from flask import Flask
from flask_cors import CORS

from routes.predict import predict_bp

def create_app():
    """Application Factory pattern."""
    app = Flask(__name__)
    
    # Enable CORS for frontend integration
    CORS(app)
    
    # Register blueprints (routes)
    app.register_blueprint(predict_bp)
    
    @app.route('/health')
    def health_check():
        return {"status": "healthy"}
        
    return app

if __name__ == '__main__':
    app = create_app()
    # Debug mode is false by default in production, use true for local dev
    app.run(host='0.0.0.0', port=5000, debug=True)
