import React, { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

export function ScrollSequence() {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [loaded, setLoaded] = useState(0);
  const frameCount = 240; 
  
  const { scrollYProgress } = useScroll();
  const frameIndex = useTransform(scrollYProgress, [0, 1], [1, frameCount]);

  useEffect(() => {
    const loadedImages = [];
    let loadCount = 0;
    
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const paddedStr = i.toString().padStart(3, '0');
      img.src = `/frames/ezgif-frame-${paddedStr}.jpg`;
      
      img.onload = () => {
        loadCount++;
        setLoaded(loadCount);
      };
      img.onerror = () => {
        loadCount++;
        setLoaded(loadCount); 
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  const drawFrame = (latest) => {
    if (!canvasRef.current || images.length === 0) return;
    const ctx = canvasRef.current.getContext('2d');
    
    const index1 = Math.floor(latest) - 1;
    const index2 = index1 + 1;
    const alpha = latest - Math.floor(latest);

    const safeIndex1 = Math.max(0, Math.min(index1, frameCount - 1));
    const safeIndex2 = Math.max(0, Math.min(index2, frameCount - 1));

    const img1 = images[safeIndex1];
    const img2 = images[safeIndex2];
    const canvas = canvasRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const renderImg = (img, opacity) => {
      if (img && img.complete && img.naturalWidth > 0) {
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const centerShift_y = (canvas.height - img.height * ratio) / 2;  
        
        ctx.globalAlpha = opacity;
        ctx.drawImage(img, 0, 0, img.width, img.height,
                          centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
        ctx.globalAlpha = 1.0;
      }
    };

    renderImg(img1, 1.0);
    
    if (alpha > 0 && safeIndex1 !== safeIndex2) {
      renderImg(img2, alpha);
    }
  };

  useEffect(() => {
    if (loaded > 0) drawFrame(1);
  }, [loaded]);

  useMotionValueEvent(frameIndex, "change", (latest) => {
    drawFrame(latest);
  });

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none', background: 'var(--bg-color)' }}>
      {loaded < frameCount && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--text-secondary)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div className="spinner" style={{ width: '30px', height: '30px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-blue)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          Loading Cinematic Sequence ({Math.round((loaded / frameCount) * 100)}%)
        </div>
      )}
      <canvas 
        ref={canvasRef} 
        width={1920} 
        height={1080} 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover', 
          opacity: loaded === frameCount ? 1 : 0, 
          transition: 'opacity 1s ease-in-out',
          filter: 'brightness(0.65) blur(3px)'
        }}
      />
      {/* Dark gradient overlay on top of animation (CRITICAL) */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.85))' 
      }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '30%', background: 'linear-gradient(to top, var(--bg-color), transparent)' }} />
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
