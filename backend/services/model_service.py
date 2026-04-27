import joblib
import numpy as np
import torch
from scipy.sparse import csr_matrix, hstack
from transformers import AutoTokenizer, AutoModel
import xgboost as xgb

from config import Config


class ModelService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelService, cls).__new__(cls)
            cls._instance._initialize_models()
        return cls._instance

    def _initialize_models(self):
        """Loads all artifacts once into memory."""
        print("Initializing Hybrid Fake News Detection Models...")
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"Using device: {self.device}")

        self.tokenizer = None
        self.roberta = None
        self.tfidf = None
        self.scaler = None
        self.meta = {}
        self.xgb_model = None
        self.feature_order = Config.FEATURE_ORDER
        self.embedding_pooling = Config.EMBEDDING_POOLING
        self.expected_roberta_dim = None
        self.expected_tfidf_dim = None
        self.expected_fused_dim = None
        self.model_ready = False
        self.startup_error = None

        try:
            print("Loading RoBERTa tokenizer/model...")
            self.tokenizer = AutoTokenizer.from_pretrained(
                Config.ROBERTA_MODEL_PATH, local_files_only=True
            )
            self.roberta = AutoModel.from_pretrained(
                Config.ROBERTA_MODEL_PATH, local_files_only=True
            )
            self.roberta.to(self.device)
            self.roberta.eval()

            print("Loading TF-IDF vectorizer...")
            self.tfidf = joblib.load(Config.TFIDF_MODEL_PATH)

            print("Loading fused scaler...")
            self.scaler = joblib.load(Config.FUSED_SCALER_PATH)
            # Compatibility fix for scaler artifacts created with older scikit-learn versions.
            if not hasattr(self.scaler, "clip"):
                self.scaler.clip = False

            print("Loading metadata...")
            loaded_meta = joblib.load(Config.META_PATH)
            self.meta = loaded_meta if isinstance(loaded_meta, dict) else {}

            print("Loading XGBoost fused model...")
            self.xgb_model = xgb.XGBClassifier()
            self.xgb_model.load_model(Config.XGBOOST_MODEL_PATH)

            self.expected_roberta_dim = int(
                self.meta.get("roberta_dim", self.roberta.config.hidden_size)
            )
            self.expected_tfidf_dim = int(
                self.meta.get("tfidf_dim", len(getattr(self.tfidf, "vocabulary_", {})))
            )
            self.expected_fused_dim = self.expected_roberta_dim + self.expected_tfidf_dim

            self.feature_order = str(
                self.meta.get("feature_order", Config.FEATURE_ORDER)
            ).lower()
            self.embedding_pooling = str(
                self.meta.get("embedding_pooling", Config.EMBEDDING_POOLING)
            ).lower()

            self._validate_artifact_shapes()
            self.model_ready = True
            print("Model initialization complete. Ready for inference.")

        except Exception as e:
            self.startup_error = str(e)
            self.model_ready = False
            print(f"Model initialization failed: {self.startup_error}")

    def _validate_artifact_shapes(self):
        roberta_hidden = int(self.roberta.config.hidden_size)
        if roberta_hidden != self.expected_roberta_dim:
            raise ValueError(
                f"RoBERTa dim mismatch. meta={self.expected_roberta_dim}, model={roberta_hidden}"
            )

        tfidf_dim = len(getattr(self.tfidf, "vocabulary_", {}))
        if tfidf_dim != self.expected_tfidf_dim:
            raise ValueError(
                f"TF-IDF dim mismatch. meta={self.expected_tfidf_dim}, vectorizer={tfidf_dim}"
            )

        scaler_dim = getattr(self.scaler, "n_features_in_", None)
        if scaler_dim is not None and int(scaler_dim) != self.expected_fused_dim:
            raise ValueError(
                f"Scaler dim mismatch. expected={self.expected_fused_dim}, scaler={scaler_dim}"
            )

    def _require_ready(self):
        if not self.model_ready:
            reason = self.startup_error or "Unknown initialization error."
            raise RuntimeError(f"Model artifacts are not loaded correctly: {reason}")

    def get_tfidf_features(self, text: str):
        tfidf_features = self.tfidf.transform([text])
        if tfidf_features.shape[1] != self.expected_tfidf_dim:
            raise ValueError(
                f"TF-IDF output size mismatch. expected={self.expected_tfidf_dim}, got={tfidf_features.shape[1]}"
            )
        return tfidf_features

    def get_roberta_embeddings(self, text: str) -> np.ndarray:
        # Embedding pooling must match training configuration.
        inputs = self.tokenizer(
            [text],
            truncation=True,
            padding=True,
            max_length=Config.MAX_SEQ_LENGTH,
            return_tensors="pt",
        )
        inputs = {key: val.to(self.device) for key, val in inputs.items()}

        with torch.no_grad():
            outputs = self.roberta(**inputs)
            if self.embedding_pooling == "mean":
                pooled_embedding = outputs.last_hidden_state.mean(dim=1)
            elif self.embedding_pooling == "cls":
                pooled_embedding = outputs.last_hidden_state[:, 0, :]
            else:
                raise ValueError(
                    f"Unsupported embedding pooling: {self.embedding_pooling}. Use 'cls' or 'mean'."
                )

        embedding = pooled_embedding.cpu().numpy().astype(np.float32, copy=False)
        if embedding.shape[1] != self.expected_roberta_dim:
            raise ValueError(
                f"RoBERTa embedding size mismatch. expected={self.expected_roberta_dim}, got={embedding.shape[1]}"
            )
        return embedding

    def _fuse_features(self, roberta_embeddings: np.ndarray, tfidf_features):
        roberta_sparse = csr_matrix(roberta_embeddings)
        if self.feature_order == "tfidf_roberta":
            fused = hstack((tfidf_features, roberta_sparse), format="csr")
        else:
            fused = hstack((roberta_sparse, tfidf_features), format="csr")

        if fused.shape[1] != self.expected_fused_dim:
            raise ValueError(
                f"Fused feature size mismatch. expected={self.expected_fused_dim}, got={fused.shape[1]}"
            )
        return fused.astype(np.float32)

    def _apply_scaler(self, fused_features: np.ndarray) -> np.ndarray:
        """Applies scaler with fallback for old MaxAbsScaler artifacts."""
        try:
            return self.scaler.transform(fused_features).astype(np.float32)
        except AttributeError as err:
            if (
                "clip" in str(err)
                and type(self.scaler).__name__ == "MaxAbsScaler"
                and hasattr(self.scaler, "scale_")
            ):
                safe_scale = np.where(self.scaler.scale_ == 0, 1.0, self.scaler.scale_)
                return (fused_features / safe_scale).astype(np.float32)
            raise

    def predict(self, text: str) -> dict:
        self._require_ready()

        raw_text = str(text).strip()
        if not raw_text:
            raise ValueError("Text cannot be empty.")

        tfidf_features = self.get_tfidf_features(raw_text)
        roberta_embeddings = self.get_roberta_embeddings(raw_text)
        fused_features = self._fuse_features(roberta_embeddings, tfidf_features)

        scaled_features = self._apply_scaler(fused_features)
        probabilities = self.xgb_model.predict_proba(scaled_features)
        predicted_class = int(self.xgb_model.predict(scaled_features)[0])

        class_idx = predicted_class
        if hasattr(self.xgb_model, "classes_"):
            classes = np.asarray(self.xgb_model.classes_)
            match_idx = np.where(classes == predicted_class)[0]
            if len(match_idx) > 0:
                class_idx = int(match_idx[0])

        confidence = float(probabilities[0][class_idx])

        label = Config.CLASS_MAP.get(predicted_class, str(predicted_class))
        return {"label": label, "confidence": confidence}


model_service = ModelService()