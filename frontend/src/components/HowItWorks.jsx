import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, FileText, SplitSquareHorizontal, Database, Network, Cpu, ShieldCheck } from 'lucide-react';

export function HowItWorks() {
  return (
    <div style={{ padding: '6rem 0', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '4rem', fontSize: '2.5rem' }}>The Hybrid Pipeline</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <StepCard 
          icon={<FileText size={24} color="var(--text-secondary)" />} 
          title="1. Raw News Input" 
          desc="System ingests article text or headline."
        />
        
        <Arrow />
        
        <StepCard 
          icon={<SplitSquareHorizontal size={24} color="var(--accent-blue)" />} 
          title="2. Text Preprocessing" 
          desc="Cleaning, tokenization, and stopword removal."
        />
        
        <Arrow />
        
        <div style={{ display: 'flex', gap: '1.5rem', margin: '0.5rem 0' }}>
          <motion.div whileHover={{ scale: 1.02 }} className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1.5rem', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <Network size={32} color="var(--accent-blue)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--accent-blue)' }}>RoBERTa Model</h3>
            <p style={{ fontSize: '0.9rem', margin: 0, color: 'var(--text-secondary)' }}>Extracts 768 semantic contextual features</p>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1.5rem', background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            <Database size={32} color="var(--accent-purple)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--accent-purple)' }}>TF-IDF Vectorizer</h3>
            <p style={{ fontSize: '0.9rem', margin: 0, color: 'var(--text-secondary)' }}>Extracts 5,000 statistical n-gram features</p>
          </motion.div>
        </div>
        
        <Arrow />
        
        <StepCard 
          icon={<Cpu size={24} color="var(--accent-purple)" />} 
          title="3. Feature Fusion" 
          desc="Concatenation of semantic and statistical vectors (5,768 total dims)."
        />
        
        <Arrow />

        <StepCard 
          icon={<ShieldCheck size={24} color="var(--real-green)" />} 
          title="4. Final Classification" 
          desc="XGBoost algorithm predicts REAL or FAKE probability."
          highlight={true}
        />

      </div>
    </div>
  );
}

function StepCard({ icon, title, desc, highlight }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="glass-panel"
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1.5rem', 
        padding: '1.5rem', 
        border: highlight ? '1px solid rgba(16, 185, 129, 0.4)' : undefined,
        background: highlight ? 'rgba(16, 185, 129, 0.05)' : undefined 
      }}
    >
      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
        {icon}
      </div>
      <div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{title}</h3>
        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{desc}</p>
      </div>
    </motion.div>
  );
}

function Arrow() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', opacity: 0.5 }}>
      <ArrowDown size={24} color="var(--text-secondary)" />
    </div>
  );
}
