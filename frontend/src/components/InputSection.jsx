import React from 'react';
import { motion } from 'framer-motion';
import { ScanLine, ArrowRight } from 'lucide-react';

export function InputSection({ text, setText, onAnalyze, isLoading }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="container"
      style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}
    >
      <div className="glass-panel" style={{ 
        width: '100%', 
        position: 'relative', 
        overflow: 'hidden', 
        padding: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)'
      }}>
        {isLoading && <div className="scanner-line" />}
        <textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste news article content or headline here to analyze..."
          disabled={isLoading}
          style={{
            width: '100%', 
            minHeight: '220px', 
            background: 'transparent', 
            border: 'none', 
            color: '#ffffff',
            fontSize: '1.25rem', 
            padding: '2rem', 
            resize: 'vertical', 
            outline: 'none',
            fontFamily: 'inherit', 
            lineHeight: 1.6,
            textShadow: '0 2px 10px rgba(0,0,0,0.8)'
          }}
        />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '1.5rem 2rem', 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(0, 0, 0, 0.4)'
        }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {text.length} characters
          </div>
          <button 
            onClick={() => onAnalyze(text)}
            disabled={isLoading || !text.trim()}
            style={{
              background: isLoading || !text.trim() ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
              color: isLoading || !text.trim() ? 'var(--text-secondary)' : '#fff', 
              border: 'none', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '8px',
              fontSize: '1rem', 
              fontWeight: 600, 
              cursor: isLoading || !text.trim() ? 'not-allowed' : 'pointer',
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              transition: 'all 0.2s',
              opacity: isLoading || !text.trim() ? 0.7 : 1
            }}
          >
            {isLoading ? (
              <>
                <ScanLine size={18} className="animate-pulse" />
                Processing Analysis...
              </>
            ) : (
              <>
                Analyze with AI
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
