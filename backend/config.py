import os


class Config:
    """Configuration settings for the Flask backend."""

    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    MODELS_DIR = os.path.join(BASE_DIR, "models")
    ARTIFACTS_DIR = os.path.join(MODELS_DIR, "model_artifacts")

    # New artifact paths
    ROBERTA_MODEL_PATH = os.path.join(MODELS_DIR, "roberta_final")
    TFIDF_MODEL_PATH = os.path.join(ARTIFACTS_DIR, "tfidf_vectorizer.joblib")
    FUSED_SCALER_PATH = os.path.join(ARTIFACTS_DIR, "fused_scaler.joblib")
    META_PATH = os.path.join(ARTIFACTS_DIR, "meta.joblib")
    XGBOOST_MODEL_PATH = os.path.join(ARTIFACTS_DIR, "xgb_fused_model.json")

    # Inference settings
    MAX_SEQ_LENGTH = 256
    FEATURE_ORDER = "roberta_tfidf"  # change to "tfidf_roberta" only if training used that order
    EMBEDDING_POOLING = "cls"  # keep aligned with training pipeline

    # Class mapping confirmed by you
    CLASS_MAP = {
        0: "FAKE",
        1: "REAL",
    }

    DEBUG = True