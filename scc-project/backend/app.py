# app.py
# Flask Backend for BERT Fake News Detection
# Copy this file to your Flask project folder

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import torch
from transformers import BertTokenizer, BertForSequenceClassification
import torch.nn.functional as F

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Model configuration
MODEL_PATH = "./bert_fake_news_model"
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print(f"Loading model from {MODEL_PATH}...")
print(f"Using device: {device}")

# Load tokenizer and model
try:
    tokenizer = BertTokenizer.from_pretrained(MODEL_PATH)
    model = BertForSequenceClassification.from_pretrained(
        MODEL_PATH,
        from_tf=False
    )
    model.to(device)
    model.eval()
    print("✓ Model loaded successfully!")
except Exception as e:
    print(f"✗ Error loading model: {e}")
    raise

@app.route('/')
def home():
    """Render simple test page"""
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    """
    Main prediction endpoint
    Expects JSON: { "text": "news article text" }
    Returns: { "prediction": "Fake/Real", "label": 0/1, "confidence": float }
    """
    try:
        # Get text from request
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400
        
        text = data['text'].strip()
        
        if not text:
            return jsonify({'error': 'Text cannot be empty'}), 400
        
        # Tokenize input
        inputs = tokenizer(
            text,
            truncation=True,
            padding=True,
            max_length=256,
            return_tensors="pt"
        )
        
        # Move tensors to GPU if available
        inputs = {key: val.to(device) for key, val in inputs.items()}
        
        # Run inference (no gradient computation)
        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits
        
        # Apply softmax to get probabilities
        probabilities = F.softmax(logits, dim=-1)
        
        # Get prediction
        predicted_label = torch.argmax(probabilities, dim=-1).item()
        confidence = probabilities[0][predicted_label].item() * 100
        
        # Map label to prediction
        prediction = "Real" if predicted_label == 1 else "Fake"
        
        return jsonify({
            'prediction': prediction,
            'label': predicted_label,
            'confidence': round(confidence, 2)
        })
    
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'device': str(device)
    })

if __name__ == '__main__':
    # For development
    app.run(host='0.0.0.0', port=5000, debug=True)
    
    # For production, use gunicorn:
    # gunicorn -w 4 -b 0.0.0.0:5000 app:app
