/**
 * App.jsx
 * Main orchestrator component for the Fake News Detection frontend.
 * Manages global application state (input text, backend results, loading, errors)
 * and handles the API integration with the Flask backend.
 * Passes result to HeroSection so it can intensify the matching glow zone.
 */
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
      setError('Please enter news text to analyze.');
      return;
    }

    const processedText = inputText.toLowerCase();

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', { text: processedText });
      setResult(response.data);

      // Smooth scroll to result after a short delay
      setTimeout(() => {
        const resultEl = document.getElementById('result-section');
        if (resultEl) resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Server error. Please ensure the Flask backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      {/* Fixed navbar */}
      <Navbar />

      <main style={{ minHeight: '100vh', paddingTop: '64px' }}>
        {/* Hero — passes result so glow zones can react */}
        <HeroSection result={result} />

        {/* Content zone sits above the scroll background */}
        <div style={{ position: 'relative', zIndex: 10 }}>

          <InputSection
            text={text}
            setText={setText}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
          />

          {/* Error banner */}
          {error && (
            <div className="container" style={{ maxWidth: '820px', margin: '1.5rem auto 0 auto', padding: '0 2rem' }}>
              <div style={{
                padding: '1rem 1.25rem',
                background: 'rgba(240, 79, 79, 0.08)',
                border: '1px solid var(--fake-red)',
                color: '#fca5a5',
                borderRadius: '10px',
                textAlign: 'center',
                fontSize: '0.95rem',
              }}>
                {error}
              </div>
            </div>
          )}

          {/* Result card */}
          <div id="result-section" style={{ marginTop: '3rem', padding: '0 2rem' }}>
            {result && <ResultCard result={result} />}
          </div>

          {/* How it works section */}
          <div style={{ marginTop: '5rem' }}>
            <HowItWorks />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
