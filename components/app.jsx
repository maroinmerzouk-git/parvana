/* global React, ReactDOM, Hero, Story, Menu, Space, Brunch, Traiteur, Visit, Footer, Butterfly */
const { useEffect: useAppEffect, useState: useAppState } = React;

function Nav() {
  const [scrolled, setScrolled] = useAppState(false);
  const [open, setOpen] = useAppState(false);

  useAppEffect(() => {
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

function App() {
  return (
    <div id="top">
      <Nav />
      <Hero />
      <Story />
      <Menu />
      <Space />
      <Brunch />
      <Traiteur />
      <Visit />
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
