/* global React, Reveal, Butterfly, DiamondDivider, Placeholder */
const { useEffect, useState } = React;

function Hero() {
  const [scrolled, setScrolled] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrolled(Math.min(1, window.scrollY / 600));
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section style={{
      minHeight: '100vh',
      background: 'var(--lapis-deep)',
      color: 'var(--cream)',
      position: 'relative',
      overflow: 'hidden',
      paddingTop: 120,
      paddingBottom: 80,
    }}>
      {/* textile band on left */}
      <div className="textile-band" style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 56, color: 'var(--saffron)',
      }} />
      {/* textile band on right */}
      <div className="textile-band" style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 56, color: 'var(--saffron)',
      }} />

      {/* radial saffron glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 90%, rgba(217,154,43,0.18), transparent 55%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* eyebrow row */}
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 80, opacity: 0.85 }}>
            <span className="mono" style={{ color: 'var(--saffron)' }}>Nantes — Île de Nantes</span>
            <span className="mono">Depuis Juin 2025</span>
          </div>
        </Reveal>

        <div style={{ textAlign: 'center', position: 'relative' }}>
          <Reveal delay={150}>
            <span className="eyebrow" style={{ color: 'var(--saffron)' }}>
              Tradition · Création · Saveur
            </span>
          </Reveal>

          {/* Persian script in subtle gold */}
          <Reveal delay={250}>
            <div className="persian" style={{
              fontSize: 28, marginTop: 36, marginBottom: 8,
              color: 'var(--saffron)', opacity: 0.7, letterSpacing: '0.02em',
            }}>
              پروانه
            </div>
          </Reveal>

          {/* main wordmark */}
          <Reveal delay={350}>
            <h1 className="serif-it" style={{
              fontSize: 'clamp(96px, 18vw, 280px)',
              lineHeight: 0.92,
              fontWeight: 400,
              letterSpacing: '-0.02em',
              margin: '12px 0 24px',
              transform: `translateY(${scrolled * -40}px)`,
              transition: 'transform 0.1s linear',
            }}>
              Parvana
            </h1>
          </Reveal>

          {/* butterfly */}
          <Reveal delay={500}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24,
              color: 'var(--saffron)', margin: '8px 0 36px',
            }}>
              <span style={{ flex: '0 1 80px', height: 1, background: 'currentColor', opacity: 0.4 }} />
              <Butterfly size={42} stroke={1} />
              <span style={{ flex: '0 1 80px', height: 1, background: 'currentColor', opacity: 0.4 }} />
            </div>
          </Reveal>

          <Reveal delay={650}>
            <p className="serif-it" style={{
              fontSize: 'clamp(20px, 2.4vw, 30px)',
              maxWidth: 720, margin: '0 auto', lineHeight: 1.4,
              color: 'var(--cream-soft)', fontWeight: 300,
            }}>
              Une cuisine d'Asie Centrale, portée par&nbsp;Maryam.<br/>
              Le voyage commence sur l'Île de Nantes.
            </p>
          </Reveal>

          <Reveal delay={800}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 56, flexWrap: 'wrap' }}>
              <a href="#carte" className="btn solid" style={{ background: 'var(--saffron)', borderColor: 'var(--saffron)', color: 'var(--lapis-deep)' }}>
                Découvrir la carte <span className="arrow">→</span>
              </a>
              <a href="#visite" className="btn" style={{ color: 'var(--cream)' }}>
                Réserver une table
              </a>
            </div>
          </Reveal>
        </div>

        {/* Bottom row: address + scroll cue */}
        <Reveal delay={1000}>
          <div style={{
            position: 'absolute', left: 56, right: 56, bottom: -40,
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            color: 'var(--cream-soft)',
          }}>
            <div className="mono" style={{ opacity: 0.7, lineHeight: 1.7 }}>
              8 Boulevard Gisèle Halimi<br/>
              44200 Nantes · France
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <span className="mono" style={{ opacity: 0.6 }}>Découvrir</span>
              <div style={{ width: 1, height: 60, background: 'var(--saffron)', opacity: 0.5, animation: 'scrollPulse 2.4s ease-in-out infinite' }} />
            </div>
            <div className="mono" style={{ opacity: 0.7, textAlign: 'right', lineHeight: 1.7 }}>
              Mar — Ven 12h00 / 14h30<br/>
              Sam — Dim 11h00 / 14h30
            </div>
          </div>
        </Reveal>
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { transform: scaleY(0.4); transform-origin: top; opacity: 0.3; }
          50% { transform: scaleY(1); transform-origin: top; opacity: 0.7; }
        }
      `}</style>
    </section>
  );
}

window.Hero = Hero;
