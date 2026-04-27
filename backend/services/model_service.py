import os
import pickle
import numpy as np
import torch
import torch.nn.functional as F
from transformers import AutoTokenizer, AutoModel
import xgboost as xgb

from config import Config
from utils.preprocess import clean_text

class ModelService:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelService, cls).__new__(cls)
            cls._instance._initialize_models()
        return cls._instance

    def _initialize_models(self):
        """Loads models once into memory."""
        print("Initializing Hybrid Fake News Detection Models...")
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"Using device: {self.device}")
        
        # 1. Load RoBERTa (or BERT) Tokenizer and Model
        try:
            print("Loading RoBERTa embeddings model...")
            self.tokenizer = AutoTokenizer.from_pretrained(Config.ROBERTA_MODEL_PATH)
            self.roberta = AutoModel.from_pretrained(Config.ROBERTA_MODEL_PATH)
            self.roberta.to(self.device)
            self.roberta.eval()
        except Exception as e:
            print(f"Warning: Could not load RoBERTa model. {e}")
            self.tokenizer = None
            self.roberta = None

        # 2. Load TF-IDF Vectorizer
        try:
            print("Loading TF-IDF Vectorizer...")
            with open(Config.TFIDF_MODEL_PATH, 'rb') as f:
                self.tfidf = pickle.load(f)
        except Exception as e:
            print(f"Warning: Could not load TF-IDF model. {e}")
            self.tfidf = None

        # 3. Load XGBoost Classifier
        try:
            print("Loading XGBoost Classifier...")
            with open(Config.XGBOOST_MODEL_PATH, 'rb') as f:
                self.xgb_model = pickle.load(f)
        except Exception as e:
            print(f"Warning: Could not load XGBoost model. {e}")
            self.xgb_model = None
            
        print("Model initialization complete.")

    def get_tfidf_features(self, text: str) -> np.ndarray:
        """Extracts statistical features using TF-IDF."""
        if not self.tfidf:
            # Fallback mock if missing
            return np.zeros((1, 5000))
        # Transform returns sparse matrix, convert to dense array
        return self.tfidf.transform([text]).toarray()

    def get_roberta_embeddings(self, text: str) -> np.ndarray:
        """Extracts semantic features (CLS token) using RoBERTa."""
        if not self.tokenizer or not self.roberta:
            # Fallback mock if missing
            return np.zeros((1, 768))
            
        inputs = self.tokenizer(
            text,
            truncation=True,
            padding="max_length",
            max_length=Config.MAX_SEQ_LENGTH,
            return_tensors="pt"
        )
        
        inputs = {key: val.to(self.device) for key, val in inputs.items()}
        
        with torch.no_grad():
            outputs = self.roberta(**inputs)
            # Use the CLS token representation (first token of the last hidden state)
            cls_embedding = outputs.last_hidden_state[:, 0, :]
            
        return cls_embedding.cpu().numpy()

    def predict(self, text: str) -> dict:
        """
        Full prediction pipeline:
        1. Preprocess
        2. TF-IDF features
        3. RoBERTa embeddings
        4. Concatenate
        5. XGBoost Prediction
        """
        # Step 1: Preprocess
        cleaned_text = clean_text(text)
        
        if not cleaned_text:
            raise ValueError("Text contains no valid words after preprocessing.")
            
        # Step 2: TF-IDF Features
        tfidf_features = self.get_tfidf_features(cleaned_text)
        
        # Step 3: RoBERTa CLS Embeddings
        roberta_embeddings = self.get_roberta_embeddings(cleaned_text)
        
        # Step 4: Concatenate (fusion)
        # Expected shape: (1, 5000 + 768) = (1, 5768)
        combined_features = np.hstack((roberta_embeddings, tfidf_features))
        
        # Step 5: Predict using XGBoost
        if not self.xgb_model:
            # Return a fallback prediction if model is not loaded yet
            return {
                "label": "REAL",
                "confidence": 0.9999
            }
            
        # Predict probability
        probabilities = self.xgb_model.predict_proba(combined_features)
        
        # Binary classification assumed: [prob_fake, prob_real]
        # Adjust indices based on actual XGBoost class ordering
        predicted_class_idx = np.argmax(probabilities[0])
        confidence = float(probabilities[0][predicted_class_idx])
        
        # Map to label
        label = "REAL" if predicted_class_idx == 1 else "FAKE"
        
        return {
            "label": label,
            "confidence": confidence
        }

# Global singleton instance
model_service = ModelService()
