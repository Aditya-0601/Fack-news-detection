/**
 * ResultCard.jsx
 * Dynamic result display for REAL/FAKE classification.
 * Features an animated verdict, glowing confidence bar, and expandable AI processing details.
 * On result: triggers matching glow color on border and background.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, ChevronDown, ChevronUp, Cpu, Network, Database } from 'lucide-react';

export function ResultCard({ result }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isReal = result.label === 'REAL';
  const confidencePercent = (result.confidence * 100).toFixed(1);

  const color = isReal ? 'var(--real-green)' : 'var(--fake-red)';
  const bgColor = isReal ? 'rgba(16, 232, 138, 0.08)' : 'rgba(240, 79, 79, 0.08)';
  const glowColor = isReal ? 'rgba(16, 232, 138, 0.25)' : 'rgba(240, 79, 79, 0.25)';
  const Icon = isReal ? CheckCircle : AlertTriangle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="glass-panel"
      style={{
        border: `1px solid ${color}`,
        background: `rgba(6, 8, 18, 0.96)`,
        maxWidth: '820px',
        margin: '0 auto',
        boxShadow: `0 0 40px ${glowColor}, 0 8px 40px rgba(0,0,0,0.6)`,
        transition: 'box-shadow 0.6s ease',
      }}
    >
      {/* ── Verdict header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
          style={{
            background: bgColor, color, padding: '1.1rem', borderRadius: '14px',
            border: `1px solid ${color}30`,
            flexShrink: 0,
          }}
        >
          <Icon size={34} />
        </motion.div>

        <div style={{ flex: 1 }}>
          {/* Label */}
          <h2 style={{
            margin: '0 0 0.3rem 0',
            color,
            fontSize: '2.6rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '3px',
            textShadow: `0 0 24px ${glowColor}`,
          }}>
            {result.label} NEWS
          </h2>

          {/* Confidence score text */}
          <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.8rem' }}>
            {confidencePercent}% confidence
          </div>

          {/* Confidence bar */}
          <div style={{
            width: '100%', maxWidth: '340px', height: '6px',
            background: 'rgba(255,255,255,0.07)', borderRadius: '9999px', overflow: 'hidden',
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidencePercent}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
              style={{ height: '100%', background: `linear-gradient(90deg, ${color}aa, ${color})`, borderRadius: '9999px' }}
            />
          </div>
        </div>
      </div>

      {/* ── Summary text ── */}
      <p style={{
        fontSize: '1rem', marginTop: '1.5rem', maxWidth: '620px',
        color: '#94a3b8', lineHeight: 1.75,
      }}>
        {isReal
          ? 'The hybrid model detected structural and semantic patterns consistent with factual reporting and verified sources.'
          : 'The model detected linguistic and contextual anomalies typically associated with misinformation, clickbait, or fabricated content.'}
      </p>

      {/* ── Expandable AI details ── */}
      <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'none', border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            fontSize: '0.9rem', fontWeight: 600, padding: 0,
            transition: 'color 0.2s',
            letterSpacing: '0.02em',
          }}
          onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
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
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '1.2rem', marginTop: '2rem',
              }}>
                {/* Semantic */}
                <div style={{
                  background: 'rgba(79, 142, 247, 0.05)', padding: '1.4rem',
                  borderRadius: '12px', border: '1px solid rgba(79, 142, 247, 0.15)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-blue)', marginBottom: '0.8rem' }}>
                    <Network size={18} /><span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Semantic Features</span>
                  </div>
                  <h4 style={{ marginBottom: '0.4rem', fontSize: '1rem' }}>RoBERTa CLS</h4>
                  <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--text-secondary)' }}>
                    768-dimensional deep contextual embeddings capturing nuanced meaning.
                  </p>
                </div>

                {/* Statistical */}
                <div style={{
                  background: 'rgba(155, 111, 245, 0.05)', padding: '1.4rem',
                  borderRadius: '12px', border: '1px solid rgba(155, 111, 245, 0.15)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-purple)', marginBottom: '0.8rem' }}>
                    <Database size={18} /><span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Statistical Features</span>
                  </div>
                  <h4 style={{ marginBottom: '0.4rem', fontSize: '1rem' }}>TF-IDF Vectors</h4>
                  <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--text-secondary)' }}>
                    5,000 unigram/bigram term frequencies to identify linguistic markers.
                  </p>
                </div>

                {/* Classifier */}
                <div style={{
                  background: 'rgba(16, 232, 138, 0.05)', padding: '1.4rem',
                  borderRadius: '12px', border: '1px solid rgba(16, 232, 138, 0.15)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--real-green)', marginBottom: '0.8rem' }}>
                    <Cpu size={18} /><span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Classification Fusion</span>
                  </div>
                  <h4 style={{ marginBottom: '0.4rem', fontSize: '1rem' }}>XGBoost Classifier</h4>
                  <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--text-secondary)' }}>
                    5,768 fused features processed through Gradient Boosting trees.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
