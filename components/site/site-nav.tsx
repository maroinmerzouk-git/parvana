import Link from "next/link";

const navLinks = [
  { href: "/restaurant", label: "Restaurant" },
  { href: "/menu", label: "Menu" },
  { href: "/traiteur", label: "Traiteur" },
  { href: "/association", label: "Association" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-beige/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link
          href="/"
          className="font-display text-2xl italic tracking-tight text-ink"
        >
          Parvana
        </Link>

        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-8 text-sm md:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-ink-soft uppercase tracking-[0.18em] text-xs transition-colors hover:text-terracotta"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/reservation"
          className="inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm font-medium uppercase tracking-[0.12em] text-beige transition-colors hover:bg-terracotta-dark"
        >
          Réserver
        </Link>
      </div>
    </header>
  );
}
