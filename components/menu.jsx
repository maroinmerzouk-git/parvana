/* global React, Reveal, Butterfly, DiamondDivider, Placeholder */
const { useState: useMenuState } = React;

const DISHES = [
  {
    id: 'kabuli',
    name: 'Kabuli Pulao',
    origin: 'Afghanistan',
    desc: 'Le plat national afghan. Riz basmati pilaf délicatement épicé, lit de carottes confites, raisins secs gonflés et amandes effilées.',
    notes: ['Cardamome', 'Cumin', 'Carottes', 'Raisins'],
    tag: 'Plat signature',
  },
  {
    id: 'mantu',
    name: 'Mantu',
    origin: 'Afghanistan',
    desc: 'Petits raviolis afghans pliés à la main, farcis à la viande hachée et oignons. Servis sous une nappe de yaourt à l\'ail et sauce tomate-pois chiches.',
    notes: ['Pâte fraîche', 'Yaourt', 'Menthe séchée'],
    tag: 'Fait maison',
  },
  {
    id: 'borani',
    name: 'Borani Banjan',
    origin: 'Afghanistan',
    desc: 'Aubergines mijotées dans une sauce tomate parfumée, dressées sur un lit de yaourt à l\'ail, finition de menthe séchée et grenade.',
    notes: ['Aubergine', 'Yaourt', 'Grenade'],
    tag: 'Végétarien',
  },
  {
    id: 'kaddo',
    name: 'Kaddo Bourani',
    origin: 'Afghanistan',
    desc: 'Citrouille rôtie au four jusqu\'à caramélisation, nappée de yaourt à l\'ail et menthe fraîche. Une douceur fumée, signature des tables afghanes.',
    notes: ['Citrouille', 'Ail', 'Menthe'],
    tag: 'Végétarien',
  },
  {
    id: 'kumpir',
    name: 'Kumpir Turc',
    origin: 'Turquie',
    desc: 'Pomme de terre cuite au four, fourrée mozzarella et courgette grillée, purée de légumes, pickles de chou rouge, sauce maison au céleri.',
    notes: ['Mozzarella', 'Courgette', 'Pickles'],
    tag: 'Végétarien',
  },
  {
    id: 'saabzi',
    name: 'Saabzi',
    origin: 'Afghanistan',
    desc: 'Épinards afghans longuement mijotés aux herbes fraîches, aneth, coriandre, piment vert. Une verdeur profonde et parfumée.',
    notes: ['Épinards', 'Aneth', 'Piment vert'],
  },
  {
    id: 'shorwa',
    name: 'Shorwa',
    origin: 'Afghanistan',
    desc: 'Soupe traditionnelle afghane mijotée aux légumes-racines, pois chiches et herbes — à la fois rustique et profondément réconfortante.',
    notes: ['Pois chiches', 'Coriandre', 'Bouillon'],
    tag: 'Soupe',
  },
  {
    id: 'halwa',
    name: 'Halwa Fleur d\'Oranger',
    origin: 'Dessert',
    desc: 'Semoule dorée au beurre clarifié, parfumée à la fleur d\'oranger, surface étoilée d\'amandes et de pistaches concassées.',
    notes: ['Semoule', 'Fleur d\'oranger', 'Pistache'],
    tag: 'Dessert',
  },
];

function Menu() {
  const [active, setActive] = useMenuState('kabuli');
  const [filter, setFilter] = useMenuState('Tous');

  const filters = ['Tous', 'Afghanistan', 'Turquie', 'Végétarien', 'Dessert'];

  const visible = DISHES.filter(d => {
    if (filter === 'Tous') return true;
    if (filter === 'Végétarien' || filter === 'Dessert') return d.tag === filter;
    return d.origin === filter;
  });

  return (
    <section id="carte" style={{
      background: 'var(--cream-soft)',
      color: 'var(--ink)',
      padding: '160px 0 140px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div className="container">
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 60, flexWrap: 'wrap', gap: 24 }}>
            <div>
              <span className="eyebrow" style={{ color: 'var(--pomegranate)' }}>La carte du jour</span>
              <h2 className="serif-it" style={{
                fontSize: 'clamp(56px, 8vw, 120px)',
                lineHeight: 0.95,
                fontWeight: 400,
                marginTop: 24,
                letterSpacing: '-0.015em',
              }}>
                Recettes <span style={{ color: 'var(--pomegranate)' }}>vivantes</span>
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="serif-it" style={{ fontSize: 64, lineHeight: 1, color: 'var(--pomegranate)' }}>15,50€</div>
              <div className="mono" style={{ marginTop: 8, color: 'var(--ink-soft)' }}>
                formule entrée + plat<br/>ou plat + dessert
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <p style={{
            maxWidth: 680, fontSize: 17, lineHeight: 1.75, color: 'var(--ink-soft)',
            marginBottom: 60,
          }}>
            Une cantine au fonctionnement simple : on choisit son ou ses plats soigneusement disposés derrière la vitrine, on règle, l'équipe se charge du reste. Tous les plats sont frais, faits maison, halal, composés d'ingrédients naturels et de qualité.
          </p>
        </Reveal>

        {/* Filters */}
        <Reveal delay={150}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 56, paddingBottom: 40, borderBottom: '1px solid rgba(26,20,16,0.12)' }}>
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '10px 22px',
                border: '1px solid',
                borderColor: filter === f ? 'var(--ink)' : 'rgba(26,20,16,0.2)',
                background: filter === f ? 'var(--ink)' : 'transparent',
                color: filter === f ? 'var(--cream)' : 'var(--ink)',
                fontFamily: 'inherit',
                fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.3s',
                borderRadius: 999,
              }}>
                {f}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Split layout: list left, detail right */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 80, alignItems: 'start' }} className="menu-grid">
          <Reveal>
            <div style={{ borderTop: '1px solid rgba(26,20,16,0.15)' }}>
              {visible.map((d, i) => (
                <div key={d.id}
                  onMouseEnter={() => setActive(d.id)}
                  onClick={() => setActive(d.id)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    gap: 24,
                    alignItems: 'baseline',
                    padding: '28px 0',
                    borderBottom: '1px solid rgba(26,20,16,0.12)',
                    cursor: 'pointer',
                    transition: 'all 0.4s',
                    color: active === d.id ? 'var(--pomegranate)' : 'var(--ink)',
                  }}>
                  <span className="mono" style={{ opacity: 0.5, fontVariantNumeric: 'tabular-nums' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="serif" style={{
                      fontSize: 'clamp(32px, 4vw, 44px)',
                      lineHeight: 1.05,
                      fontWeight: 400,
                      fontStyle: active === d.id ? 'italic' : 'normal',
                      transition: 'all 0.3s',
                    }}>{d.name}</h3>
                  </div>
                  <span className="mono" style={{ opacity: 0.55 }}>{d.origin}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div style={{ position: 'sticky', top: 100 }}>
              {visible.find(d => d.id === active) && (() => {
                const d = visible.find(x => x.id === active) || visible[0];
                return (
                  <div key={d.id} style={{ animation: 'fadeUp 0.5s ease' }}>
                    <Placeholder label={`${d.name.toLowerCase()} · photo`} aspect="5 / 4" />
                    <div style={{ paddingTop: 28 }}>
                      {d.tag && (
                        <span className="pill" style={{ color: 'var(--pomegranate)', marginBottom: 16, display: 'inline-block' }}>
                          {d.tag}
                        </span>
                      )}
                      <h3 className="serif-it" style={{ fontSize: 48, lineHeight: 1.05, fontWeight: 400, marginTop: 8, marginBottom: 16 }}>
                        {d.name}
                      </h3>
                      <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--ink-soft)', marginBottom: 24 }}>
                        {d.desc}
                      </p>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {d.notes.map(n => (
                          <span key={n} className="mono" style={{
                            padding: '6px 12px',
                            background: 'var(--cream)',
                            border: '1px solid rgba(26,20,16,0.12)',
                            color: 'var(--ink-soft)',
                          }}>{n}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </Reveal>
        </div>

        {/* Marquee */}
        <Reveal>
          <div style={{
            marginTop: 140,
            paddingTop: 40, paddingBottom: 40,
            borderTop: '1px solid rgba(26,20,16,0.15)',
            borderBottom: '1px solid rgba(26,20,16,0.15)',
            overflow: 'hidden',
            position: 'relative',
          }}>
            <div className="marquee serif-it" style={{ fontSize: 64, color: 'var(--ink)', lineHeight: 1 }}>
              {Array.from({ length: 2 }).map((_, i) => (
                <React.Fragment key={i}>
                  <span>Tradition</span>
                  <span style={{ color: 'var(--pomegranate)' }}>✦</span>
                  <span style={{ fontStyle: 'normal' }} className="serif">Création</span>
                  <span style={{ color: 'var(--pomegranate)' }}>✦</span>
                  <span>Saveur</span>
                  <span style={{ color: 'var(--pomegranate)' }}>✦</span>
                  <span style={{ fontStyle: 'normal' }} className="serif">Voyage</span>
                  <span style={{ color: 'var(--pomegranate)' }}>✦</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        @media (max-width: 920px) {
          .menu-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  );
}

window.Menu = Menu;
