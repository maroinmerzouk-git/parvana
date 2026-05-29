"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/restaurant", label: "Restaurant" },
  { href: "/menu", label: "Menu" },
  { href: "/traiteur", label: "Traiteur" },
  { href: "/association", label: "Association" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-beige/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link
          href="/"
          className="font-display text-2xl italic tracking-tight text-ink"
          onClick={() => setOpen(false)}
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

        <div className="flex items-center gap-3">
          <Link
            href="/reservation"
            className="inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm font-medium uppercase tracking-[0.12em] text-beige transition-colors hover:bg-terracotta-dark"
          >
            Réserver
          </Link>

          <button
            type="button"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:border-terracotta hover:text-terracotta md:hidden"
          >
            {open ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Navigation principale"
          className="border-t border-ink/10 bg-beige md:hidden"
        >
          <ul className="mx-auto flex max-w-7xl flex-col px-6 py-2">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block py-3 text-sm uppercase tracking-[0.18em] transition-colors ${
                      active ? "text-terracotta" : "text-ink-soft hover:text-terracotta"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
