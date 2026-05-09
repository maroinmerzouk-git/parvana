'use client';
import { useEffect, useState } from 'react';
import { Butterfly } from './primitives';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'inherit', textDecoration: 'none' }}>
        <Butterfly size={28} stroke={1.2} />
        <span className="wordmark">Parvana</span>
      </a>
      <div className="nav-links">
        <a href="#histoire">Histoire</a>
        <a href="#carte">Carte</a>
        <a href="#lieu">Le lieu</a>
        <a href="#brunch">Brunch</a>
        <a href="#traiteur">Traiteur</a>
        <a href="#visite">Visiter</a>
      </div>
      <a href="#visite" className="btn" style={{
        padding: '10px 18px', fontSize: 11,
        color: 'inherit',
      }}>
        Réserver
      </a>
    </nav>
  );
}
