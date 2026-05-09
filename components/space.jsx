/* global React, Reveal, Butterfly, DiamondDivider, Placeholder */
const { useState: useSpaceState } = React;

function Space() {
  const [active, setActive] = useSpaceState(0);

  const images = [
    { label: 'salle principale · vitrine', tone: 'cream' },
    { label: 'suspensions textiles · artisanat afghan', tone: 'cream' },
    { label: 'tablée du midi · quartier république', tone: 'cream' },
    { label: 'détail mur · voilage', tone: 'cream' },
  ];

  return (
    <section id="lieu" style={{
      background: 'var(--lapis-deep)',
      color: 'var(--cream)',
      padding: '160px 0 140px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div className="textile-band" style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 32, color: 'var(--saffron)',
      }} />

      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'end', marginBottom: 80 }} className="space-grid">
          <Reveal>
            <div>
              <span className="eyebrow" style={{ color: 'var(--saffron)' }}>Le lieu</span>
              <h2 className="serif-it" style={{
                fontSize: 'clamp(56px, 7vw, 108px)',
                lineHeight: 0.95,
                fontWeight: 400,
                marginTop: 24,
                letterSpacing: '-0.015em',
              }}>
                Une cantine,<br/>
                cousue à <span style={{ color: 'var(--saffron)' }}>la main.</span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <p style={{ fontSize: 17, lineHeight: 1.8, color: 'var(--cream-soft)', maxWidth: 480 }}>
              Sous une belle hauteur sous plafond, voilages et suspensions textiles dessinent une lumière douce. <em className="serif-it">L'ensemble des suspensions a été fabriqué à la main par des femmes afghanes</em> — un geste artisanal qui prolonge la mission jusque dans la matière du lieu.
            </p>
          </Reveal>
        </div>

        {/* Image grid — main + thumbnails */}
        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 24 }} className="space-imgs">
            <div style={{ aspectRatio: '4 / 3' }}>
              <Placeholder dark label={images[active].label} aspect="4 / 3" />
            </div>
            <div style={{ display: 'grid', gridTemplateRows: 'repeat(4, 1fr)', gap: 24 }}>
              {images.map((img, i) => (
                <div key={i}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                  style={{
                    cursor: 'pointer',
                    opacity: active === i ? 1 : 0.55,
                    outline: active === i ? '2px solid var(--saffron)' : 'none',
                    outlineOffset: 4,
                    transition: 'all 0.3s',
                  }}>
                  <Placeholder dark label={`0${i + 1}`} aspect="4 / 3" />
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Pull quote */}
        <Reveal delay={200}>
          <blockquote style={{
            marginTop: 120, maxWidth: 980,
            paddingLeft: 40, borderLeft: '2px solid var(--saffron)',
          }}>
            <p className="serif-it" style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', lineHeight: 1.3, fontWeight: 300 }}>
              «&nbsp;Saluons le goût avec lequel ont été aménagés les lieux, tirant pleinement parti d'une belle hauteur sous plafond et réussissant à faire de ce nouveau bâtiment un lieu chaleureux et confortable.&nbsp;»
            </p>
            <footer className="mono" style={{ marginTop: 24, color: 'var(--saffron)' }}>
              — Nantes Végétal · 2026
            </footer>
          </blockquote>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 920px) {
          .space-grid { grid-template-columns: 1fr !important; }
          .space-imgs { grid-template-columns: 1fr !important; }
          .space-imgs > div:last-child { grid-template-columns: repeat(4, 1fr) !important; grid-template-rows: none !important; }
        }
      `}</style>
    </section>
  );
}

window.Space = Space;
