import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, ChevronDown, ChevronUp, Cpu, Network, Database } from 'lucide-react';

export function ResultCard({ result }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isReal = result.label === "REAL";
  const confidencePercent = (result.confidence * 100).toFixed(2);
  
  const color = isReal ? 'var(--real-green)' : 'var(--fake-red)';
  const bgColor = isReal ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
  const Icon = isReal ? CheckCircle : AlertTriangle;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel"
      style={{ border: `1px solid ${color}`, background: 'rgba(10, 10, 10, 0.95)', maxWidth: '800px', margin: '0 auto' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: bgColor, color: color, padding: '1rem', borderRadius: '12px' }}>
              <Icon size={32} />
            </div>
            <div>
              <h2 style={{ margin: 0, color: color, fontSize: '2.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                {result.label} NEWS
              </h2>
              <div style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {confidencePercent}% Confidence Score
              </div>
            </div>
          </div>
          
          <p style={{ fontSize: '1.1rem', marginTop: '1.5rem', maxWidth: '600px', color: 'var(--text-primary)' }}>
            {isReal 
              ? "The hybrid model detected structural and semantic patterns consistent with factual reporting and verified sources."
              : "The model detected linguistic and contextual anomalies typically associated with misinformation, clickbait, or fabricated content."}
          </p>
        </div>
      </div>

      <div style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--text-secondary)', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            fontSize: '1rem', 
            fontWeight: 600,
            padding: 0,
            transition: 'color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'}
          onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          View AI Processing Details
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-blue)', marginBottom: '1rem' }}>
                    <Network size={20} />
                    <span style={{ fontWeight: 600 }}>Semantic Features</span>
                  </div>
                  <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>RoBERTa CLS Embeddings</h4>
                  <p style={{ fontSize: '0.9rem', margin: 0, color: 'var(--text-secondary)' }}>Extracted 768-dimensional deep contextual representations capturing nuanced meaning.</p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-purple)', marginBottom: '1rem' }}>
                    <Database size={20} />
                    <span style={{ fontWeight: 600 }}>Statistical Features</span>
                  </div>
                  <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>TF-IDF Vectors</h4>
                  <p style={{ fontSize: '0.9rem', margin: 0, color: 'var(--text-secondary)' }}>Computed top 5,000 unigram/bigram term frequencies to identify linguistic markers.</p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--real-green)', marginBottom: '1rem' }}>
                    <Cpu size={20} />
                    <span style={{ fontWeight: 600 }}>Classification Fusion</span>
                  </div>
                  <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>XGBoost Classifier</h4>
                  <p style={{ fontSize: '0.9rem', margin: 0, color: 'var(--text-secondary)' }}>Fused 5,768 total features processed through Gradient Boosting trees for final probability.</p>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
