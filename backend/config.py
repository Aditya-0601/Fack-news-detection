import os

class Config:
    """Configuration settings for the Flask backend."""
    
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    MODELS_DIR = os.path.join(BASE_DIR, 'models')
    
    # Model Paths - Adjust these based on the actual model files provided
    ROBERTA_MODEL_PATH = os.path.join(BASE_DIR, 'bert_fake_news_model') # Fallback to existing if available
    TFIDF_MODEL_PATH = os.path.join(MODELS_DIR, 'tfidf_vectorizer.pkl')
    XGBOOST_MODEL_PATH = os.path.join(MODELS_DIR, 'xgboost_classifier.pkl')
    
    # RoBERTa config
    MAX_SEQ_LENGTH = 256
    
    # Debug mode
    DEBUG = True
