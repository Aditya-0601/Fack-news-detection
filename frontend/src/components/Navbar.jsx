import React, { useEffect, useState } from 'react';

const NAV_SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'analyze', label: 'Analyze' },
  { id: 'pipeline', label: 'How it works' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 32);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sectionElements = NAV_SECTIONS
      .map((section) => document.getElementById(section.id))
      .filter(Boolean);

    if (!sectionElements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.6)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      { threshold: [0.6] }
    );

    sectionElements.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleNavMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    event.currentTarget.style.setProperty('--cursor-x', `${x}px`);
    event.currentTarget.style.setProperty('--cursor-y', `${y}px`);
  };

  const scrollToSection = (sectionId) => {
    const target = document.getElementById(sectionId);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNavClick = (sectionId) => {
    scrollToSection(sectionId);
  };

  return (
    <nav
      className={`navbar-shell ${isScrolled ? 'is-scrolled' : ''}`}
      onMouseMove={handleNavMouseMove}
    >
      <div className="navbar-cursor-glow" />

      <button
        type="button"
        className="brand-wrap interactive-item"
        onClick={() => handleNavClick('home')}
      >
        <span className="brand-logo-dot" />
        <span className="brand-title">Credible</span>
      </button>

      <div className="navbar-links">
        {NAV_SECTIONS.map((section) => (
          <button
            type="button"
            key={section.id}
            onClick={() => handleNavClick(section.id)}
            className={`nav-link interactive-item ${activeSection === section.id ? 'is-active' : ''}`}
          >
            {section.label}
          </button>
        ))}
      </div>

      <div className="navbar-meta">
        <div className="status-indicator interactive-item">
          <span className="status-dot" />
          Hybrid AI • Live
        </div>

        <div className="university-affiliation interactive-item">
          <img
            src="/university-seal.png"
            alt="Faculty of Technology, University of Delhi"
            className="university-seal"
          />
          <div className="university-affiliation-text">
            <span>Faculty of Technology</span>
            <span>University of Delhi</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
