import React, { useState } from 'react';
import axios from 'axios';

import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { InputSection } from './components/InputSection';
import { ResultCard } from './components/ResultCard';
import { HowItWorks } from './components/HowItWorks';
import { Footer } from './components/Footer';

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (inputText) => {
    if (!inputText.trim()) {
      setError("Please enter news text to analyze.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', { text: inputText });
      setResult(response.data);
      
      setTimeout(() => {
        const resultEl = document.getElementById('result-section');
        if (resultEl) resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Server error. Please ensure the Flask backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      <Navbar />

      <main style={{ minHeight: '100vh' }}>
        <HeroSection />

        <div style={{ position: 'relative', zIndex: 10 }}>
          <InputSection 
            text={text} 
            setText={setText} 
            onAnalyze={handleAnalyze} 
            isLoading={isLoading} 
          />

          {error && (
            <div className="container" style={{ maxWidth: '800px', margin: '2rem auto 0 auto', padding: '0 2rem' }}>
              <div style={{ 
                padding: '1rem', 
                background: 'rgba(239, 68, 68, 0.1)', 
                border: '1px solid var(--fake-red)', 
                color: '#fca5a5', 
                borderRadius: '8px', 
                textAlign: 'center' 
              }}>
                {error}
              </div>
            </div>
          )}

          <div id="result-section" style={{ marginTop: '3rem', padding: '0 2rem' }}>
            {result && <ResultCard result={result} />}
          </div>

          <div style={{ marginTop: '4rem' }}>
            <HowItWorks />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
