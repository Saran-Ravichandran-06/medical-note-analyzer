from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import string
import numpy as np

app = Flask(__name__)
CORS(app)

# Load resources
BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, 'medical_model.pkl')
VECTORIZER_PATH = os.path.join(BASE_DIR, 'tfidf_vectorizer.pkl')

model = None
vectorizer = None

def load_models():
    global model, vectorizer
    if os.path.exists(MODEL_PATH) and os.path.exists(VECTORIZER_PATH):
        model = joblib.load(MODEL_PATH)
        vectorizer = joblib.load(VECTORIZER_PATH)
        print("Models loaded successfully.")
    else:
        print("Model files not found. Please train the model first.")

def preprocess_text(text):
    text = text.lower()
    text = text.translate(str.maketrans('', '', string.punctuation))
    tokens = word_tokenize(text)
    stop_words = set(stopwords.words('english'))
    filtered_tokens = [t for t in tokens if t not in stop_words]
    lemmatizer = WordNetLemmatizer()
    lemmatized = [lemmatizer.lemmatize(t) for t in filtered_tokens]
    return " ".join(lemmatized), filtered_tokens

@app.route('/classify', methods=['POST'])
def classify():
    if model is None or vectorizer is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    data = request.json
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400
    
    raw_text = data['text']
    processed_text, original_tokens = preprocess_text(raw_text)
    
    # Vectorize
    vec = vectorizer.transform([processed_text])
    
    # Predict
    prediction = model.predict(vec)[0]
    probabilities = model.predict_proba(vec)[0]
    
    # Map probabilities to categories
    categories = model.classes_
    prob_dict = {cat: float(prob) for cat, prob in zip(categories, probabilities)}
    
    # Sort categories by probability
    sorted_probs = sorted(prob_dict.items(), key=lambda x: x[1], reverse=True)
    
    # Confidence score is the probability of the top prediction
    confidence = prob_dict[prediction]
    
    # Keywords are tokens that are in our vocabulary and not stopwords
    vocab = vectorizer.get_feature_names_out()
    detected_keywords = list(set([t for t in original_tokens if t in vocab]))

    return jsonify({
        'prediction': prediction,
        'confidence': round(confidence * 100, 2),
        'probabilities': prob_dict,
        'keywords': detected_keywords,
        'processed_text': processed_text
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'model_loaded': model is not None})

if __name__ == '__main__':
    load_models()
    app.run(debug=True, host="0.0.0.0", port=5000)