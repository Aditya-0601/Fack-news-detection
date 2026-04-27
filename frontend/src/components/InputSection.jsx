/**
 * InputSection.jsx
 * Premium glassmorphism input component.
 * Features: soft spotlight behind box, scan beam on analysis, focus glow ring,
 * hover border brighten, smart character counter, and micro-interaction button.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanLine, ArrowRight, Zap } from 'lucide-react';

export function InputSection({ text, setText, onAnalyze, isLoading }) {
  const [isScanning, setIsScanning] = useState(false);

  const handleAnalyzeClick = () => {
    if (!text.trim() || isLoading) return;
    // Trigger the horizontal scan beam animation
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 1900);
    onAnalyze(text);
  };

  const charCount    = text.length;
  const isReady      = charCount >= 300;
  const charColor    = isReady ? 'var(--real-green)' : charCount > 0 ? '#94a3b8' : 'var(--text-secondary)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      style={{ maxWidth: '820px', margin: '0 auto', padding: '0 2rem', position: 'relative' }}
    >
      {/* ── Soft spotlight behind the input box ── */}
      <div className="input-spotlight" />

      {/* ── Main glass container ── */}
      <div className="input-glass">

        {/* Vertical scan line while loading */}
        {isLoading && <div className="scanner-line" />}

        {/* Horizontal scan beam on click */}
        {isScanning && <div className="scan-beam" />}

        {/* Textarea */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste a news article, headline, or paragraph here to analyze credibility..."
          disabled={isLoading}
          style={{
            width: '100%',
            minHeight: '230px',
            background: 'transparent',
            border: 'none',
            color: '#e8edf5',
            fontSize: '1.05rem',
            padding: '2rem 2rem 1.5rem',
            resize: 'vertical',
            outline: 'none',
            fontFamily: 'inherit',
            lineHeight: 1.8,
            letterSpacing: '0.01em',
          }}
        />

        {/* ── Bottom toolbar ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          background: 'rgba(0, 0, 0, 0.3)',
          gap: '1rem',
        }}>

          {/* Character count */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: '0.82rem',
          }}>
            <motion.span
              key={charCount}
              initial={{ opacity: 0.6, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                color: charColor,
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
                transition: 'color 0.3s ease',
              }}
            >
              {charCount}
            </motion.span>
            <span style={{ color: 'var(--text-secondary)' }}>characters</span>

            <AnimatePresence>
              {isReady && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    color: 'var(--real-green)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    background: 'rgba(16, 232, 138, 0.1)',
                    border: '1px solid rgba(16,232,138,0.25)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '9999px',
                  }}
                >
                  ✓ Ready
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Analyze button */}
          <button
            className="analyze-btn"
            onClick={handleAnalyzeClick}
            disabled={isLoading || !text.trim()}
          >
            {isLoading ? (
              <>
                <ScanLine size={17} style={{ animation: 'glow-pulse 1s ease-in-out infinite' }} />
                Processing...
              </>
            ) : (
              <>
                <Zap size={17} />
                Analyze with AI
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Helper tip ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        style={{
          marginTop: '12px',
          marginLeft: '2px',
          fontSize: '0.78rem',
          color: '#9ca3af',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        <span style={{ fontSize: '0.9rem' }}>ℹ️</span>
        Tip: For best accuracy, submit articles with at least 300 words.
      </motion.div>
    </motion.div>
  );
}
