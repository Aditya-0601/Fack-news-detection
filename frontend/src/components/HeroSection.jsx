import React from 'react';
import { motion } from 'framer-motion';
import { ScrollSequence } from './ScrollSequence';

export function HeroSection() {
  return (
    <div style={{ position: 'relative' }}>
      {/* Background cinematic sequence */}
      <ScrollSequence />

      {/* Tall container to allow scroll animation to play */}
      <div style={{ height: '250vh' }}>
        {/* Sticky Hero Content */}
        <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          
          {/* Safe Content Zone */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            maxWidth: '1200px',
            background: 'radial-gradient(circle, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 80%)',
            zIndex: 1,
            pointerEvents: 'none'
          }} />

          <div className="particles-container" style={{ zIndex: 1 }}>
            {[...Array(15)].map((_, i) => (
              <div 
                key={i} 
                className="particle" 
                style={{ 
                  width: `${Math.random() * 3 + 1}px`, 
                  height: `${Math.random() * 3 + 1}px`, 
                  left: `${Math.random() * 100}%`, 
                  top: `${Math.random() * 100 + 100}vh`, 
                  animationDuration: `${Math.random() * 10 + 10}s`,
                  animationDelay: `${Math.random() * 5}s`
                }} 
              />
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '800px', padding: '0 2rem' }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '0.5rem 1rem', borderRadius: '9999px', color: 'var(--accent-blue)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.5rem', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
              Next-Gen AI Analysis
            </div>
            <h1 style={{ fontSize: '4rem', margin: '0 0 1.5rem 0', lineHeight: 1.1 }}>
              Credible
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#cbd5e1', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
              Scroll down to watch the AI Core extract features, or skip to analyze an article instantly.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
