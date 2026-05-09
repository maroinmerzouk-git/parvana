/* global React */
const { useEffect, useRef, useState } = React;

// Reveal-on-scroll wrapper
function Reveal({ children, delay = 0, as = 'div', className = '', style = {} }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } });
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Cmp = as;
  return (
    <Cmp ref={ref} className={`reveal ${seen ? 'in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </Cmp>
  );
}

// Butterfly silhouette — primitives only (ellipses + body line + dots)
function Butterfly({ size = 64, color = 'currentColor', stroke = 1.2 }) {
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 80 68" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      {/* body */}
      <line x1="40" y1="14" x2="40" y2="58" />
      {/* antennae */}
      <path d="M40 14 C 36 8, 30 6, 28 4" />
      <path d="M40 14 C 44 8, 50 6, 52 4" />
      {/* upper wings */}
      <ellipse cx="22" cy="26" rx="20" ry="14" transform="rotate(-18 22 26)" />
      <ellipse cx="58" cy="26" rx="20" ry="14" transform="rotate(18 58 26)" />
      {/* lower wings */}
      <ellipse cx="26" cy="48" rx="14" ry="10" transform="rotate(-12 26 48)" />
      <ellipse cx="54" cy="48" rx="14" ry="10" transform="rotate(12 54 48)" />
      {/* dots */}
      <circle cx="22" cy="26" r="1.6" fill={color} stroke="none" />
      <circle cx="58" cy="26" r="1.6" fill={color} stroke="none" />
    </svg>
  );
}

// Diamond divider — primitives
function DiamondDivider({ color = 'currentColor', count = 5 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, color }}>
      <span style={{ flex: 1, height: 1, background: color, opacity: 0.3 }} />
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{
          width: i === Math.floor(count / 2) ? 8 : 5,
          height: i === Math.floor(count / 2) ? 8 : 5,
          background: color,
          transform: 'rotate(45deg)',
          opacity: i === Math.floor(count / 2) ? 1 : 0.5,
        }} />
      ))}
      <span style={{ flex: 1, height: 1, background: color, opacity: 0.3 }} />
    </div>
  );
}

// Image placeholder
function Placeholder({ label, height = 360, dark = false, aspect, style = {} }) {
  return (
    <div className={`ph ${dark ? 'dark' : ''}`} style={{
      height: aspect ? undefined : height,
      aspectRatio: aspect,
      width: '100%',
      ...style,
    }}>
      <span className="ph-label">{label}</span>
    </div>
  );
}

Object.assign(window, { Reveal, Butterfly, DiamondDivider, Placeholder });
