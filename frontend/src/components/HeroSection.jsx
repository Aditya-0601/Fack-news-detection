/**
 * HeroSection.jsx
 * Premium split-glow hero area. Left=green (REAL), Right=red (FAKE), Center=blue AI zone.
 * Reacts to analysis results by intensifying the corresponding side glow.
 * Features: parallax mouse effect, gradient animated title, floating animation.
 */
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScrollSequence } from './ScrollSequence';

export function HeroSection({ result }) {
  const parallaxRef = useRef(null);
  const isReal = result?.label === 'REAL';
  const isFake = result?.label === 'FAKE';

  // Mouse-driven parallax on the hero content
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!parallaxRef.current) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 14;
      const y = (e.clientY / innerHeight - 0.5) * 8;
      parallaxRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Dynamic glow opacity based on result
  const leftGlowOpacity = isFake ? 0.3 : isReal ? 1.8 : 1;
  const rightGlowOpacity = isReal ? 0.3 : isFake ? 1.8 : 1;

  return (
    <div style={{ position: 'relative' }}>
      {/* Cinematic scroll background */}
      <ScrollSequence />

      {/* Split glow zones */}
      <div className="hero-glow-left" style={{ opacity: leftGlowOpacity, transition: 'opacity 1s ease' }} />
      <div className="hero-glow-right" style={{ opacity: rightGlowOpacity, transition: 'opacity 1s ease' }} />
      <div className="hero-glow-center" />

      {/* Tall scroll container */}
      <div style={{ height: '250vh' }}>
        {/* Sticky hero content */}
        <div style={{
          position: 'sticky', top: 0, height: '100vh',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
        }}>
          {/* Stronger dark radial overlay for text/input readability */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%', height: '100%', maxWidth: '1200px',
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.30) 55%, transparent 82%)',
            zIndex: 1, pointerEvents: 'none'
          }} />

          {/* Particles */}
          <div className="particles-container" style={{ zIndex: 1 }}>
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  width: `${Math.random() * 2.5 + 0.8}px`,
                  height: `${Math.random() * 2.5 + 0.8}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100 + 100}vh`,
                  animationDuration: `${Math.random() * 12 + 10}s`,
                  animationDelay: `${Math.random() * 6}s`,
                }}
              />
            ))}
          </div>

          {/* Hero content with parallax */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '820px', padding: '0 2rem' }}
          >
            <div ref={parallaxRef} style={{ transition: 'transform 0.1s ease-out' }}>

              {/* Top badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                style={{ marginBottom: '1.8rem' }}
              >
                <span className="tech-badge">
                  <span style={{
                    width: '7px', height: '7px', borderRadius: '50%',
                    background: 'var(--accent-blue)',
                    boxShadow: '0 0 8px var(--accent-blue)',
                    animation: 'glow-pulse 2s ease-in-out infinite'
                  }} />
                  Next-Gen AI Analysis
                </span>
              </motion.div>

              {/* Gradient animated title */}
              <h1 className="gradient-title" style={{ fontSize: '5.5rem', marginBottom: '1.5rem' }}>
                Credible
              </h1>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                style={{
                  fontSize: '1.2rem',
                  color: '#cbd5e1',
                  marginBottom: '1.2rem',
                  textShadow: '0 2px 16px rgba(0,0,0,0.9)',
                  fontWeight: 500,
                  letterSpacing: '0.01em'
                }}
              >
                Experience real-time AI-powered credibility analysis.
              </motion.p>

              {/* Technical identity line */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="tech-identity-line"
              >
                Hybrid AI Model &nbsp;•&nbsp; RoBERTa + XGBoost &nbsp;•&nbsp; Real-Time Detection
              </motion.p>

            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
