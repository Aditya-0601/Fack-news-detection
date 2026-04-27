import React from 'react';

export function Navbar() {
  return (
    <nav style={{ 
      padding: '1.5rem', 
      borderBottom: '1px solid var(--glass-border)', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      position: 'relative', 
      zIndex: 10, 
      background: 'rgba(5, 5, 5, 0.8)',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ fontWeight: 800, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ 
          width: '24px', 
          height: '24px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))' 
        }}></div>
        Credible
      </div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
        Production Level Hybrid Architecture
      </div>
    </nav>
  );
}
