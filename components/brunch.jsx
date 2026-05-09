/* global React, Reveal, Butterfly, DiamondDivider, Placeholder */

function Brunch() {
  return (
    <section id="brunch" style={{
      background: 'var(--cream)',
      color: 'var(--ink)',
      padding: '160px 0 140px',
      position: 'relative',
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="brunch-grid">
          <Reveal>
            <Placeholder label="brunch · table dressée · samedi matin" aspect="4 / 5" />
          </Reveal>

          <Reveal delay={150}>
            <div>
              <span className="eyebrow" style={{ color: 'var(--pomegranate)' }}>Le week-end</span>
              <h2 className="serif-it" style={{
                fontSize: 'clamp(56px, 7vw, 96px)',
                lineHeight: 0.95,
                fontWeight: 400,
                marginTop: 24,
                marginBottom: 32,
                letterSpacing: '-0.015em',
              }}>
                Brunch d'Asie<br/>Centrale.
              </h2>
              <p style={{ fontSize: 17, lineHeight: 1.75, color: 'var(--ink-soft)', marginBottom: 32, maxWidth: 480 }}>
                Samedi et dimanche, de 11h à 14h30 — une table partagée autour des saveurs matinales d'Afghanistan, du Tadjikistan et au-delà : pains plats sortis du four, œufs aux herbes, halwa fleur d'oranger, carrot cake à la cardamome, thé noir au cardamome.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
                {[
                  ['Salé', 'Bolani aux herbes\nŒufs persans aux épinards\nFromage frais & herbes'],
                  ['Sucré', 'Halwa fleur d\'oranger\nCarrot cake cardamome\nCrème rolls pistache'],
                  ['Boissons', 'Thé noir cardamome\nCafé maison\nLassi à la rose'],
                  ['Pratique', 'Sam — Dim · 11h00 — 14h30\nFormule complète\nRéservation conseillée'],
                ].map(([t, body]) => (
                  <div key={t} style={{ paddingTop: 16, borderTop: '1px solid rgba(26,20,16,0.15)' }}>
                    <span className="mono" style={{ color: 'var(--pomegranate)', display: 'block', marginBottom: 8 }}>{t}</span>
                    <p className="serif" style={{ fontSize: 17, lineHeight: 1.5, whiteSpace: 'pre-line' }}>{body}</p>
                  </div>
                ))}
              </div>

              <a href="#visite" className="btn solid">
                Réserver le brunch <span className="arrow">→</span>
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (max-width: 920px) {
          .brunch-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  );
}

function Traiteur() {
  return (
    <section id="traiteur" style={{
      background: 'var(--pomegranate)',
      color: 'var(--cream)',
      padding: '120px 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div className="textile-band" style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 24, color: 'var(--cream)',
      }} />
      <div className="textile-band" style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 24, color: 'var(--cream)',
      }} />

      <div className="container">
        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 80, alignItems: 'center' }} className="traiteur-grid">
            <div>
              <span className="eyebrow" style={{ color: 'var(--saffron)' }}>Traiteur · Événements</span>
              <h2 className="serif-it" style={{
                fontSize: 'clamp(48px, 6vw, 88px)',
                lineHeight: 1, fontWeight: 400, marginTop: 24, marginBottom: 24,
              }}>
                Faire voyager<br/>vos invités.
              </h2>
              <p style={{ fontSize: 17, lineHeight: 1.75, opacity: 0.92, maxWidth: 540 }}>
                Mariages, anniversaires, communions, événements professionnels, plateaux repas, buffets, cocktails. Confection complète — plats chauds, plats froids, desserts, boissons — autour des saveurs d'Asie Centrale, livrée à Nantes et environs.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <a href="mailto:contact@parvana.fr" className="btn" style={{ color: 'var(--cream)', justifyContent: 'space-between', width: '100%' }}>
                contact@parvana.fr <span className="arrow">↗</span>
              </a>
              <a href="tel:+33622643253" className="btn" style={{ color: 'var(--cream)', justifyContent: 'space-between', width: '100%' }}>
                06 22 64 32 53 <span className="arrow">↗</span>
              </a>
            </div>
          </div>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 920px) {
          .traiteur-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}

window.Brunch = Brunch;
window.Traiteur = Traiteur;
