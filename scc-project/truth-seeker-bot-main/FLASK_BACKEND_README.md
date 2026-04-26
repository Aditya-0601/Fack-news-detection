# Flask Backend for Fake News Detection

This folder contains the complete Flask backend code for your BERT-based Fake News Detector.

## 📁 Project Structure

```
flask-backend/
│
├── app.py                      # Main Flask application
├── requirements.txt            # Python dependencies
├── bert_fake_news_model/       # Your fine-tuned BERT model (ADD YOUR FILES HERE)
│   ├── config.json
│   ├── model.safetensors
│   ├── tokenizer_config.json
│   ├── special_tokens_map.json
│   ├── vocab.txt
│   └── added_tokens.json
│
├── templates/
│   └── index.html              # Simple test frontend
│
└── static/
    └── style.css               # Optional styling
```

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Add Your Model Files

Place all your BERT model files in the `bert_fake_news_model/` folder:
- config.json
- model.safetensors
- tokenizer_config.json
- special_tokens_map.json
- vocab.txt
- added_tokens.json

### 3. Run the Flask Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## 🔌 API Usage

### Endpoint: `/predict`

**Method:** POST

**Request Body:**
```json
{
  "text": "Your news text here..."
}
```

**Response:**
```json
{
  "prediction": "Fake",
  "label": 0,
  "confidence": 87.34
}
```

- `prediction`: "Fake" or "Real"
- `label`: 0 (Fake) or 1 (Real)
- `confidence`: Percentage (0-100)

## 🌐 Connecting to React Frontend

Update the `BACKEND_URL` in the React app's `NewsAnalyzer.tsx`:

```typescript
const BACKEND_URL = "http://localhost:5000";  // For local development
// or
const BACKEND_URL = "https://your-deployed-backend.com";  // For production
```

## 📦 Deployment Options

### Option 1: Railway
1. Create account at [railway.app](https://railway.app)
2. Connect your GitHub repo
3. Railway auto-detects Flask
4. Set environment variables if needed
5. Deploy!

### Option 2: Render
1. Create account at [render.com](https://render.com)
2. Create new Web Service
3. Connect repo
4. Build command: `pip install -r requirements.txt`
5. Start command: `python app.py`

### Option 3: Heroku
```bash
heroku create your-app-name
git push heroku main
```

## ⚠️ Important Notes

- Model files are NOT included in this repo
- Make sure GPU/CUDA is available for faster inference
- The model runs on CPU if GPU is not available
- For production, consider adding rate limiting
- Enable CORS for your React frontend domain

## 🔧 Troubleshooting

**Issue: Module not found**
```bash
pip install -r requirements.txt
```

**Issue: CUDA out of memory**
- Reduce `max_length` in tokenizer
- Use CPU instead: Remove `.to(device)` calls

**Issue: Model not loading**
- Verify all model files are present
- Check file permissions
- Ensure correct folder name: `bert_fake_news_model`

## 📝 File Contents

See the individual files below for complete implementation.
