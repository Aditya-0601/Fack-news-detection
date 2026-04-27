/**
 * HowItWorks.jsx
 * Dynamic, animated AI pipeline visualization.
 * Features:
 *  - Scroll-triggered stagger entry (whileInView)
 *  - Flowing particle connectors between each stage
 *  - Convergence SVG animation for the feature fusion merge point
 *  - Floating + pulsing model cards (RoBERTa=blue, TF-IDF=purple)
 *  - Per-card hover glow + scale micro-interactions
 *  - Faint grid background for a "tech" spatial feel
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, SplitSquareHorizontal, Database, Network, Cpu, ShieldCheck } from 'lucide-react';

/* ─────────────────────────────────────────
   FlowConnector — glowing line + particles
───────────────────────────────────────── */
function FlowConnector({ color = '#4f8ef7', height = 60 }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{
        width: '2px',
        height: `${height}px`,
        background: `linear-gradient(to bottom, ${color}00, ${color}88, ${color}00)`,
        position: 'relative',
        overflow: 'visible',
      }}>
        {/* Soft outer glow on the line */}
        <div style={{
          position: 'absolute',
          top: 0, left: '-3px',
          width: '8px', height: '100%',
          background: `linear-gradient(to bottom, transparent, ${color}22, transparent)`,
          filter: 'blur(4px)',
          pointerEvents: 'none',
        }} />
        {/* Three particles staggered in time */}
        {[0, 0.65, 1.3].map((delay, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 10px ${color}, 0 0 20px ${color}88`,
            animation: `flow-particle 2s ease-in-out ${delay}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ConvergenceConnector — SVG merge lines
   Shows RoBERTa (left/blue) + TF-IDF (right/purple)
   converging into one Feature Fusion point
───────────────────────────────────────── */
function ConvergenceConnector() {
  return (
    <div style={{ position: 'relative', height: '90px', marginTop: '2px' }}>
      <svg
        width="100%" height="90"
        viewBox="0 0 600 90"
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="cg-left" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(79,142,247,0.9)" />
            <stop offset="100%" stopColor="rgba(155,111,245,0.5)" />
          </linearGradient>
          <linearGradient id="cg-right" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(155,111,245,0.9)" />
            <stop offset="100%" stopColor="rgba(79,142,247,0.5)" />
          </linearGradient>
          <filter id="cg-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Left curved line — RoBERTa side */}
        <path d="M 150 0 C 150 50, 300 65, 300 90"
          stroke="url(#cg-left)" strokeWidth="2" fill="none"
          filter="url(#cg-glow)" strokeDasharray="7 4"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-22" dur="0.85s" repeatCount="indefinite" />
        </path>

        {/* Right curved line — TF-IDF side */}
        <path d="M 450 0 C 450 50, 300 65, 300 90"
          stroke="url(#cg-right)" strokeWidth="2" fill="none"
          filter="url(#cg-glow)" strokeDasharray="7 4"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-22" dur="0.85s" repeatCount="indefinite" />
        </path>

        {/* Merge burst circle at bottom */}
        <circle cx="300" cy="90" r="5" fill="rgba(155,111,245,0.95)" filter="url(#cg-glow)">
          <animate attributeName="r" values="4;8;4" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;1;0.6" dur="1.6s" repeatCount="indefinite" />
        </circle>
        {/* Outer ring pulse */}
        <circle cx="300" cy="90" r="10" fill="none" stroke="rgba(155,111,245,0.35)" strokeWidth="1.5">
          <animate attributeName="r" values="8;18;8" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="1.6s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────
   StepCard — animated pipeline step block
───────────────────────────────────────── */
function StepCard({ icon, title, desc, highlight, hoverColor, delay = 0 }) {
  const [hovered, setHovered] = useState(false);

  const baseColor = highlight ? 'rgba(16,232,138,0.35)' : 'rgba(255,255,255,0.07)';
  const glowShadow = hoverColor
    ? `0 6px 40px rgba(0,0,0,0.55), 0 0 28px ${hoverColor}`
    : '0 6px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.025 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        padding: '1.4rem 1.8rem',
        background: highlight ? 'rgba(16,232,138,0.04)' : 'rgba(6, 8, 18, 0.88)',
        border: `1px solid ${hovered ? (hoverColor || 'rgba(79,142,247,0.4)') : baseColor}`,
        borderRadius: '14px',
        backdropFilter: 'blur(14px)',
        boxShadow: hovered ? glowShadow : '0 6px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.02)',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        cursor: 'default',
      }}
    >
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
        padding: '0.85rem',
        borderRadius: '12px',
        flexShrink: 0,
        transition: 'background 0.25s ease',
      }}>
        {icon}
      </div>
      <div>
        <h3 style={{
          fontSize: '1.05rem', fontWeight: 700,
          marginBottom: '0.25rem', color: '#e8edf5',
        }}>{title}</h3>
        <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   ModelCard — floating RoBERTa / TF-IDF
───────────────────────────────────────── */
function ModelCard({ icon, title, desc, accentColor, borderColor, floatDelay, delay }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.03 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '1.75rem 1.25rem',
        background: 'rgba(6, 8, 18, 0.9)',
        border: `1px solid ${hovered ? accentColor : borderColor}`,
        borderRadius: '14px',
        backdropFilter: 'blur(14px)',
        boxShadow: hovered
          ? `0 0 50px ${accentColor}44, 0 8px 40px rgba(0,0,0,0.6)`
          : `0 0 25px ${accentColor}18, 0 6px 30px rgba(0,0,0,0.5)`,
        animation: `float-card 4s ease-in-out ${floatDelay} infinite`,
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        cursor: 'default',
      }}
    >
      {/* Icon with pulsing glow ring */}
      <div style={{
        background: `${accentColor}18`,
        border: `1px solid ${accentColor}35`,
        padding: '1rem',
        borderRadius: '12px',
        marginBottom: '1rem',
        animation: 'glow-pulse 2.8s ease-in-out infinite',
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1rem', marginBottom: '0.4rem', color: accentColor, fontWeight: 700 }}>{title}</h3>
      <p style={{ fontSize: '0.83rem', margin: 0, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Main export
───────────────────────────────────────── */
export function HowItWorks() {
  return (
    <section style={{
      padding: '6rem 0 8rem',
      maxWidth: '720px',
      margin: '0 auto',
      position: 'relative',
      padding: '6rem 1rem 8rem',
    }}>

      {/* Faint grid background */}
      <div style={{
        position: 'absolute',
        inset: '-3rem -6rem',
        backgroundImage: `
          linear-gradient(rgba(79,142,247,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(79,142,247,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '38px 38px',
        maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* ── Section header ── */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: '4rem', position: 'relative', zIndex: 1 }}
      >
        {/* Live badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(79,142,247,0.07)',
          border: '1px solid rgba(79,142,247,0.22)',
          padding: '0.35rem 1rem', borderRadius: '9999px',
          color: 'var(--accent-blue)', fontSize: '0.72rem',
          fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', marginBottom: '1rem',
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: 'var(--accent-blue)',
            boxShadow: '0 0 8px var(--accent-blue)',
            animation: 'glow-pulse 2s ease-in-out infinite',
          }} />
          Live AI Pipeline
        </div>

        <h2 style={{
          fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.035em',
          background: 'linear-gradient(135deg, #ffffff 0%, #c7d8ff 60%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '0.6rem',
        }}>
          The Hybrid Pipeline
        </h2>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
          Four stages. Two AI models. One verdict.
        </p>
      </motion.div>

      {/* ── Pipeline flow ── */}
      <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>

        {/* Step 1 — Input */}
        <StepCard
          delay={0}
          icon={<FileText size={22} color="#8892a4" />}
          title="1. Raw News Input"
          desc="System ingests article text or headline for credibility analysis."
          hoverColor="rgba(79,142,247,0.25)"
        />

        <FlowConnector color="#4f8ef7" height={58} />

        {/* Step 2 — Preprocessing */}
        <StepCard
          delay={0.12}
          icon={<SplitSquareHorizontal size={22} color="#4f8ef7" />}
          title="2. Text Preprocessing"
          desc="Cleaning, tokenization, lowercasing, and stopword removal to normalize the input."
          hoverColor="rgba(79,142,247,0.25)"
        />

        <FlowConnector color="#7090f5" height={58} />

        {/* Parallel model cards */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{ display: 'flex', gap: '1.2rem' }}
        >
          <ModelCard
            delay={0.2}
            icon={<Network size={28} color="#4f8ef7" />}
            title="RoBERTa Model"
            desc="Extracts 768 deep semantic contextual embeddings from the processed text."
            accentColor="#4f8ef7"
            borderColor="rgba(79,142,247,0.22)"
            floatDelay="0s"
          />
          <ModelCard
            delay={0.32}
            icon={<Database size={28} color="#9b6ff5" />}
            title="TF-IDF Vectorizer"
            desc="Extracts 2,000 statistical n-gram features to identify linguistic patterns."
            accentColor="#9b6ff5"
            borderColor="rgba(155,111,245,0.22)"
            floatDelay="1s"
          />
        </motion.div>

        {/* SVG convergence connector */}
        <ConvergenceConnector />

        {/* Step 3 — Feature Fusion */}
        <StepCard
          delay={0.4}
          icon={<Cpu size={22} color="#9b6ff5" />}
          title="3. Feature Fusion"
          desc="Concatenation of 768 semantic + 2,000 statistical vectors → 2,768 total feature dimensions."
          hoverColor="rgba(155,111,245,0.25)"
        />

        <FlowConnector color="#10e88a" height={58} />

        {/* Step 4 — Classification */}
        <StepCard
          delay={0.52}
          icon={<ShieldCheck size={22} color="var(--real-green)" />}
          title="4. Final Classification"
          desc="XGBoost Gradient Boosting processes all 2,768 features to output a calibrated REAL or FAKE probability."
          highlight={true}
          hoverColor="rgba(16,232,138,0.3)"
        />

      </div>
    </section>
  );
}
