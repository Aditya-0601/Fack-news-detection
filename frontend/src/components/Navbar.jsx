/**
 * Navbar.jsx
 * Premium top navigation with glassmorphism, gradient logo dot, and status indicator.
 */
import React from 'react';

export function Navbar() {
  return (
    <nav style={{
      padding: '1.2rem 2rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 100,
      background: 'rgba(3, 3, 8, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
    }}>
      {/* Brand */}
      <div style={{ fontWeight: 800, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.6rem', letterSpacing: '-0.02em' }}>
        <div style={{
          width: '22px', height: '22px', borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
          boxShadow: '0 0 12px rgba(79, 142, 247, 0.6)',
        }} />
        <span style={{
          background: 'linear-gradient(135deg, #ffffff, #c7d8ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Credible
        </span>
      </div>

      {/* Status indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
        <span style={{
          width: '7px', height: '7px', borderRadius: '50%',
          background: 'var(--real-green)',
          boxShadow: '0 0 8px var(--real-green)',
          animation: 'glow-pulse 2.5s ease-in-out infinite',
        }} />
        Hybrid AI • Live
      </div>
    </nav>
  );
}
