import React from 'react';

export function Footer() {
  return (
    <footer style={{ 
      padding: '3rem', 
      textAlign: 'center', 
      borderTop: '1px solid var(--glass-border)', 
      marginTop: '4rem', 
      color: 'var(--text-secondary)' 
    }}>
      <p>Credible &copy; 2026. Powered by RoBERTa + TF-IDF + XGBoost.</p>
      <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.7 }}>
        WELFake Dataset (72,134 articles) • Accuracy: 97.64%
      </p>
    </footer>
  );
}
