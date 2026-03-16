import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleClassify = async () => {
    if (!note.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const API_BASE =
        window.location.hostname === "localhost"
          ? "http://localhost:5000"
          : "http://16.171.141.176:5000";

      const response = await fetch(`${API_BASE}/classify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: note }),
      });

      if (!response.ok) throw new Error('Failed to classify note');

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNote(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleClear = () => {
    setNote('');
    setResult(null);
    setError(null);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Cardiology': '#f43f5e',
      'Diabetes': '#10b981',
      'Neurology': '#8b5cf6',
      'Respiratory': '#0ea5e9',
      'Orthopedics': '#f59e0b'
    };
    return colors[category] || '#64748b';
  };

  return (
    <div className="container">
      <header className="header animate-fade-in">
        <div className="logo-section">
          <h1>MedNote AI</h1>
          <p>Advanced Clinical Note Classification</p>
        </div>
        <div className="header-stats">
          <div className="glass-pill">NLP Powered</div>
          <div className="glass-pill">TF-IDF</div>
        </div>
      </header>

      <main className="grid-main">
        {/* Left Side: Input */}
        <section className="input-panel glass animate-fade-in">
          <div className="panel-header">
            <h3>Input Clinical Note</h3>
            <button className="upload-btn" onClick={() => fileInputRef.current.click()}>
              <span>Upload .txt</span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept=".txt" 
              onChange={handleFileUpload}
            />
          </div>
          
          <textarea
            placeholder="Paste or upload medical notes here... e.g., 'Patient reports chest pain and shortening of breath. ECG shows abnormalities...'"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="note-textarea"
          ></textarea>

          <div className="button-group">
            <button 
              className="clear-btn" 
              onClick={handleClear}
              disabled={loading || !note}
            >
              Clear
            </button>
            <button 
              className="classify-btn" 
              onClick={handleClassify}
              disabled={loading || !note}
            >
              {loading ? <span className="loader"></span> : 'Classify Note'}
            </button>
          </div>

          {error && <div className="error-msg">{error}</div>}
        </section>

        {/* Right Side: Results */}
        <section className="results-panel glass animate-fade-in">
          <div className="panel-header">
            <h3>Medical Analysis</h3>
          </div>
          {!result ? (
            <div className="empty-results">
              <div className="pulse-icon">🔍</div>
              <p>Ready to analyze. Please enter a clinical note and click Classify.</p>
            </div>
          ) : (
            <div className="result-content">
              <div className="prediction-header">
                <div className="category-badge" style={{ backgroundColor: getCategoryColor(result.prediction) }}>
                  {result.prediction}
                </div>
                <div className="confidence-meter">
                  <span className="score">{result.confidence}%</span>
                  <span className="label">Confidence</span>
                </div>
              </div>

              <div className="summary-section">
                <h4>Analysis Summary</h4>
                <p>
                  The system detected patterns consistent with <strong>{result.prediction}</strong> with a confidence level of {result.confidence}%. 
                  {result.prediction === 'Cardiology' && " This typically involves heart-related symptoms, cardiovascular examinations, or ECG findings."}
                  {result.prediction === 'Diabetes' && " This is often characterized by glucose level abnormalities, insulin sensitivity issues, or metabolic reports."}
                  {result.prediction === 'Neurology' && " Key markers include neurological symptoms, brain imaging results, or nervous system function tests."}
                  {result.prediction === 'Respiratory' && " Focused on lung function, breathing difficulties, or pulmonary imaging observations."}
                  {result.prediction === 'Orthopedics' && " Related to bone structures, joint issues, fractures, or musculoskeletal injuries."}
                </p>
              </div>

              <div className="chart-section">
                <h4>Likelihood Distribution</h4>
                <div className="prob-chart">
                  {Object.entries(result.probabilities).sort((a,b) => b[1] - a[1]).map(([cat, prob]) => (
                    <div key={cat} className="chart-row">
                      <div className="chart-label">{cat}</div>
                      <div className="chart-bar-container">
                        <div 
                          className="chart-bar" 
                          style={{ 
                            width: `${prob * 100}%`,
                            backgroundColor: getCategoryColor(cat)
                          }}
                        ></div>
                      </div>
                      <div className="chart-value">{Math.round(prob * 100)}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
