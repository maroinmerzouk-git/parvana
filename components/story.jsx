/* global React, Reveal, Butterfly, DiamondDivider, Placeholder */

function Story() {
  return (
    <section id="histoire" style={{
      background: 'var(--cream)',
      color: 'var(--ink)',
      padding: '160px 0 140px',
      position: 'relative',
    }}>
      {/* small textile divider top */}
      <div className="container">
        <Reveal>
          <div style={{ color: 'var(--pomegranate)', marginBottom: 80 }}>
            <DiamondDivider color="currentColor" count={7} />
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 100, alignItems: 'start' }} className="story-grid">
          <Reveal>
            <div>
              <span className="eyebrow" style={{ color: 'var(--pomegranate)' }}>L'origine du nom</span>
              <h2 className="serif-it" style={{
                fontSize: 'clamp(56px, 7vw, 108px)',
                lineHeight: 0.95,
                fontWeight: 400,
                marginTop: 28,
                letterSpacing: '-0.015em',
              }}>
                Parvana,<br/>
                <span style={{ color: 'var(--pomegranate)' }}>papillon</span><br/>
                en persan.
              </h2>
              <div className="persian" style={{
                fontSize: 36, marginTop: 32,
                color: 'var(--ink-soft)', opacity: 0.5,
              }}>
                پروانه
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div style={{ paddingTop: 40, fontSize: 17, lineHeight: 1.75, color: 'var(--ink-soft)', maxWidth: 560 }}>
              <p className="serif" style={{ fontSize: 28, lineHeight: 1.4, color: 'var(--ink)', marginBottom: 32, fontWeight: 400 }}>
                Parvana, c'est aussi le nom d'une héroïne littéraire. Une petite fille afghane de onze ans qui, sous le régime des talibans, coupa ses cheveux et se fit passer pour un garçon afin de faire vivre sa famille.
              </p>
              <p style={{ marginBottom: 20 }}>
                Son courage a inspiré Maryam — jeune cheffe afghane, ancienne du restaurant associatif Fair-e et des foodhalls Magmaa et Carquefood — à donner ce nom à son projet. Une cantine ouverte en juin 2025 sur l'Île de Nantes, qui s'étend bien au-delà de l'assiette.
              </p>
              <p style={{ marginBottom: 32 }}>
                « Je suis Maryam, Afghane, et je suis engagée pour la liberté des femmes. La cuisine fait partie de mon histoire — c'est, pour moi, la plus magique des recettes pour communiquer mon engagement. »
              </p>
              <div style={{
                paddingTop: 24,
                borderTop: '1px solid rgba(26,20,16,0.12)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 32,
              }}>
                <div>
                  <span className="mono" style={{ color: 'var(--pomegranate)', display: 'block', marginBottom: 6 }}>Cheffe</span>
                  <span className="serif-it" style={{ fontSize: 22 }}>Maryam Farid</span>
                </div>
                <div>
                  <span className="mono" style={{ color: 'var(--pomegranate)', display: 'block', marginBottom: 6 }}>Cuisines</span>
                  <span className="serif-it" style={{ fontSize: 22 }}>Afghanistan · Tadjikistan · Turquie</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Mission band */}
        <Reveal>
          <div style={{
            marginTop: 140,
            padding: '80px 64px',
            background: 'var(--lapis-deep)',
            color: 'var(--cream)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div className="textile-band" style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: 32, color: 'var(--saffron)',
            }} />
            <div className="textile-band" style={{
              position: 'absolute', right: 0, top: 0, bottom: 0, width: 32, color: 'var(--saffron)',
            }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'center', maxWidth: 1080, margin: '0 auto' }} className="story-grid">
              <div>
                <span className="eyebrow" style={{ color: 'var(--saffron)' }}>L'engagement</span>
                <h3 className="serif-it" style={{ fontSize: 48, lineHeight: 1.05, fontWeight: 400, marginTop: 24 }}>
                  Une cuisine,<br/>
                  une <span style={{ color: 'var(--saffron)' }}>cause.</span>
                </h3>
              </div>
              <div style={{ fontSize: 17, lineHeight: 1.75, color: 'var(--cream-soft)' }}>
                <p style={{ marginBottom: 16 }}>
                  Parvana est aussi un projet associatif : soutenir les femmes et les enfants sans-abris d'Asie Centrale, et valoriser le savoir-faire artisanal des femmes afghanes — qui ont fabriqué, à la main, l'ensemble des suspensions textiles qui habitent le restaurant.
                </p>
                <p>
                  Chaque assiette servie ici raconte un fragment de cette histoire. Chaque table partagée, un acte de transmission.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 920px) {
          .story-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  );
}

window.Story = Story;
