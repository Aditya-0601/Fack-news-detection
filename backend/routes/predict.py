from flask import Blueprint, request, jsonify
from services.model_service import model_service

predict_bp = Blueprint("predict", __name__)


@predict_bp.route("/predict", methods=["POST"])
def predict():
    """
    Prediction endpoint.
    Expects: {"text": "news content"}
    Returns: {"label": "REAL"|"FAKE", "confidence": float}
    """
    try:
        data = request.get_json()

        if not data or "text" not in data:
            return jsonify({"error": "No text provided"}), 400

        text = data["text"].strip()

        if not text:
            return jsonify({"error": "Text cannot be empty"}), 400

        result = model_service.predict(text)
        return jsonify(result)

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except RuntimeError as re:
        return jsonify({"error": str(re)}), 503
    except Exception as e:
        print(f"Server error during prediction: {str(e)}")
        return jsonify({"error": "An internal server error occurred processing the text."}), 500