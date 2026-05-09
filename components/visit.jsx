'use client';
import { useState } from 'react';
import { Reveal, Butterfly, Placeholder } from './primitives';

export function Visit() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', date: '', time: '12:30', covers: '2', message: '', service: 'Déjeuner',
  });
  const [submitted, setSubmitted] = useState(false);

  const onChange = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const onSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  const hours = [
    ['Lundi', 'Fermé'],
    ['Mardi', '12h00 — 14h30'],
    ['Mercredi', '12h00 — 14h30'],
    ['Jeudi', '12h00 — 14h30'],
    ['Vendredi', '12h00 — 14h30'],
    ['Samedi', '11h00 — 14h30 · brunch'],
    ['Dimanche', '11h00 — 14h30 · brunch'],
  ];

  return (
    <section id="visite" style={{
      background: 'var(--cream)',
      color: 'var(--ink)',
      padding: '160px 0 60px',
      position: 'relative',
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }} className="visit-grid">
          {/* Left — info */}
          <Reveal>
            <div>
              <span className="eyebrow" style={{ color: 'var(--pomegranate)' }}>Visiter</span>
              <h2 className="serif-it" style={{
                fontSize: 'clamp(56px, 7vw, 108px)',
                lineHeight: 0.95, fontWeight: 400, marginTop: 24, marginBottom: 40,
                letterSpacing: '-0.015em',
              }}>
                À table,<br/>à <span style={{ color: 'var(--pomegranate)' }}>Nantes.</span>
              </h2>

              {/* Map placeholder */}
              <div style={{ marginBottom: 40 }}>
                <Placeholder label="île de nantes · quartier république" aspect="16 / 9" />
              </div>

              {/* Address block */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 40 }}>
                <div>
                  <span className="mono" style={{ color: 'var(--pomegranate)', display: 'block', marginBottom: 8 }}>Adresse</span>
                  <p className="serif" style={{ fontSize: 19, lineHeight: 1.4 }}>
                    8 Boulevard Gisèle Halimi<br/>
                    44200 Nantes<br/>
                    Île de Nantes — Quartier République
                  </p>
                </div>
                <div>
                  <span className="mono" style={{ color: 'var(--pomegranate)', display: 'block', marginBottom: 8 }}>Contact</span>
                  <p className="serif" style={{ fontSize: 19, lineHeight: 1.4 }}>
                    <a href="tel:+33622643253" style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px solid currentColor' }}>06 22 64 32 53</a><br/>
                    <a href="mailto:contact@parvana.fr" style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px solid currentColor' }}>contact@parvana.fr</a><br/>
                    <a href="https://instagram.com/parvana_nantes" style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px solid currentColor' }}>@parvana_nantes</a>
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div>
                <span className="mono" style={{ color: 'var(--pomegranate)', display: 'block', marginBottom: 16 }}>Horaires</span>
                <div style={{ borderTop: '1px solid rgba(26,20,16,0.15)' }}>
                  {hours.map(([day, t]) => (
                    <div key={day} style={{
                      display: 'flex', justifyContent: 'space-between',
                      padding: '12px 0',
                      borderBottom: '1px solid rgba(26,20,16,0.1)',
                    }}>
                      <span className="serif" style={{ fontSize: 17 }}>{day}</span>
                      <span className="mono" style={{ color: t === 'Fermé' ? 'rgba(26,20,16,0.4)' : 'var(--ink-soft)' }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Practical badges */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 32 }}>
                {['Halal', 'Options végétariennes', 'Bio', 'Tickets restaurant', 'Terrasse', 'À emporter', 'Accessible PMR'].map(b => (
                  <span key={b} className="pill" style={{ color: 'var(--ink-soft)' }}>{b}</span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Right — form */}
          <Reveal delay={150}>
            <div style={{
              background: 'var(--lapis-deep)',
              color: 'var(--cream)',
              padding: '56px 48px',
              position: 'sticky', top: 100,
            }}>
              <span className="eyebrow" style={{ color: 'var(--saffron)' }}>Réservation</span>
              <h3 className="serif-it" style={{ fontSize: 48, lineHeight: 1.05, fontWeight: 400, marginTop: 16, marginBottom: 32 }}>
                Une table chez<br/>Parvana.
              </h3>

              {!submitted ? (
                <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <FormField label="Service">
                      <select value={form.service} onChange={onChange('service')} style={lightInput}>
                        <option>Déjeuner</option>
                        <option>Brunch</option>
                      </select>
                    </FormField>
                    <FormField label="Couverts">
                      <select value={form.covers} onChange={onChange('covers')} style={lightInput}>
                        {[1,2,3,4,5,6,7,8].map(n => <option key={n}>{n}</option>)}
                      </select>
                    </FormField>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <FormField label="Date">
                      <input type="date" value={form.date} onChange={onChange('date')} style={lightInput} required />
                    </FormField>
                    <FormField label="Heure">
                      <input type="time" value={form.time} onChange={onChange('time')} style={lightInput} required />
                    </FormField>
                  </div>

                  <FormField label="Nom complet">
                    <input value={form.name} onChange={onChange('name')} style={lightInput} placeholder="Maryam Farid" required />
                  </FormField>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <FormField label="Email">
                      <input type="email" value={form.email} onChange={onChange('email')} style={lightInput} placeholder="vous@email.fr" required />
                    </FormField>
                    <FormField label="Téléphone">
                      <input type="tel" value={form.phone} onChange={onChange('phone')} style={lightInput} placeholder="06 ..." />
                    </FormField>
                  </div>

                  <FormField label="Allergies, demandes particulières (optionnel)">
                    <textarea rows="3" value={form.message} onChange={onChange('message')} style={{ ...lightInput, resize: 'vertical' }} />
                  </FormField>

                  <button type="submit" className="btn solid" style={{
                    background: 'var(--saffron)', borderColor: 'var(--saffron)', color: 'var(--lapis-deep)',
                    justifyContent: 'center', marginTop: 16,
                  }}>
                    Confirmer la réservation <span className="arrow">→</span>
                  </button>

                  <p className="mono" style={{ color: 'rgba(243,235,220,0.5)', textAlign: 'center', marginTop: 8, fontSize: 10 }}>
                    Un appel téléphonique reste le plus rapide · 06 22 64 32 53
                  </p>
                </form>
              ) : (
                <div style={{ padding: '40px 0', textAlign: 'center' }}>
                  <div style={{ fontSize: 40, marginBottom: 16, color: 'var(--saffron)' }}>
                    <Butterfly size={48} stroke={1} />
                  </div>
                  <h4 className="serif-it" style={{ fontSize: 36, fontWeight: 400, marginBottom: 16 }}>Merci, {form.name.split(' ')[0] || 'à bientôt'}.</h4>
                  <p style={{ color: 'var(--cream-soft)', lineHeight: 1.6, marginBottom: 24 }}>
                    Nous revenons vers vous très vite pour confirmer votre table de {form.covers} couvert{Number(form.covers) > 1 ? 's' : ''} le {form.date} à {form.time}.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn" style={{ color: 'var(--cream)' }}>
                    Nouvelle réservation
                  </button>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>

    </section>
  );
}

const lightInput = {
  background: 'transparent',
  borderBottom: '1px solid rgba(243,235,220,0.3)',
  color: 'var(--cream)',
  padding: '10px 0',
  fontFamily: 'inherit',
  fontSize: 15,
  width: '100%',
  outline: 'none',
  border: 'none',
  borderBottomWidth: 1,
  borderBottomStyle: 'solid',
  borderBottomColor: 'rgba(243,235,220,0.3)',
};

function FormField({ label, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span className="mono" style={{ color: 'rgba(243,235,220,0.55)', fontSize: 10 }}>{label}</span>
      {children}
    </label>
  );
}

export function Footer() {
  return (
    <footer style={{
      background: 'var(--lapis-deep)',
      color: 'var(--cream)',
      padding: '80px 0 40px',
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 56, marginBottom: 64 }} className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, color: 'var(--saffron)' }}>
              <Butterfly size={36} stroke={1} />
              <span className="wordmark" style={{ fontSize: 32, color: 'var(--cream)' }}>Parvana</span>
            </div>
            <p className="serif-it" style={{ fontSize: 20, lineHeight: 1.5, color: 'var(--cream-soft)', maxWidth: 360 }}>
              Une cuisine d'Asie Centrale, portée par Maryam, à Nantes.
            </p>
          </div>
          {[
            ['Visiter', ['Carte', '#carte', 'Brunch', '#brunch', 'Le lieu', '#lieu']],
            ['Pratique', ['Réservation', '#visite', 'Traiteur', '#traiteur', 'Horaires', '#visite']],
            ['Suivre', ['Instagram', 'https://instagram.com/parvana_nantes', 'parvana.fr', 'https://parvana.fr', 'Email', 'mailto:contact@parvana.fr']],
          ].map(([title, links]) => (
            <div key={title}>
              <span className="mono" style={{ color: 'var(--saffron)', display: 'block', marginBottom: 16 }}>{title}</span>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Array.from({ length: links.length / 2 }).map((_, i) => (
                  <li key={i}>
                    <a href={links[i*2 + 1]} className="serif" style={{ color: 'var(--cream-soft)', textDecoration: 'none', fontSize: 18 }}>
                      {links[i*2]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="textile-border" style={{ color: 'var(--saffron)', marginBottom: 32 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <span className="mono" style={{ color: 'rgba(243,235,220,0.45)' }}>
            © Parvana · 8 Boulevard Gisèle Halimi · 44200 Nantes
          </span>
          <span className="mono" style={{ color: 'rgba(243,235,220,0.45)' }}>
            Cuisine d'Asie Centrale · Halal · Faite maison
          </span>
        </div>
      </div>

    </footer>
  );
}
