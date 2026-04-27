# TruthGuard AI Backend

A robust, production-ready Flask API serving a Phase 3 Hybrid Fake News Detection Model.
It uses RoBERTa for semantic embeddings, TF-IDF for statistical modeling, and XGBoost as the final classifier.

## Architecture

```
backend/
├── app.py                  # Application entry point
├── config.py               # Configuration and paths
├── requirements.txt        # Dependencies
├── models/                 # Model files (excluded from version control)
├── routes/                 # API endpoints
│   └── predict.py          # POST /predict route
├── services/               # Core business logic
│   └── model_service.py    # Hybrid model loading and inference
└── utils/                  # Helpers
    └── preprocess.py       # Text cleaning logic
```

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Place your model files in the expected paths according to `config.py`:
   - RoBERTa model files in `models/roberta_model`
   - TF-IDF Vectorizer in `models/tfidf_vectorizer.pkl`
   - XGBoost Classifier in `models/xgboost_classifier.pkl`

3. Start the server:
   ```bash
   python app.py
   ```

## API

### `POST /predict`

**Request:**
```json
{
  "text": "The news article content goes here..."
}
```

**Response:**
```json
{
  "label": "REAL",
  "confidence": 0.9764
}
```
