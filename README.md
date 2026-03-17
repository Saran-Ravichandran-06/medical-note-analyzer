# MedNote

A modern web application for intelligent classification of medical notes using Natural Language Processing (NLP) techniques. This tool helps healthcare professionals categorize clinical notes into predefined medical specialties with confidence scores.

## Features

- **Clinical Note Input**: Paste text or upload .txt files containing medical notes
- **AI-Powered Classification**: Uses TF-IDF vectorization and Logistic Regression for accurate categorization
- **Medical Categories**: Supports Cardiology, Diabetes, Neurology, Respiratory, and Orthopedics
- **Confidence Scoring**: Provides percentage confidence for each classification
- **Responsive Design**: Clean, modern interface with light theme

## Tech Stack

- **Backend**: Python, Flask, scikit-learn, NLTK
- **Frontend**: React, Vite, CSS3
- **Deployment**: Ready for containerization with Docker

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/medical-note-classifier.git
   cd medical-note-classifier
   ```

2. **Setup Backend**
   ```bash
   cd backend
   python -m venv venv
   # On Windows: venv\Scripts\activate
   # On macOS/Linux: source venv/bin/activate
   pip install -r requirements.txt
   python app.py
   ```

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Usage

1. Enter or upload a clinical note in the input panel
2. Click "Classify Note" to get instant analysis
3. View the predicted medical category and confidence score in the analysis panel

## API Endpoints

- `POST /classify`: Classify a medical note
  - Body: `{"text": "clinical note text"}`
  - Response: `{"prediction": "category", "confidence": 95.2, "keywords": ["keyword1", "keyword2"]}`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for educational and commercial purposes.