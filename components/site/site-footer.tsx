import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-sand">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3 md:px-10">
        <div>
          <p className="font-display text-2xl italic text-ink">Parvana</p>
          <p className="mt-2 max-w-xs text-sm text-ink-soft">
            Cuisine d&apos;Asie Centrale à Nantes — une table de famille, ouverte aux
            voyageurs.
          </p>
        </div>

        <div className="text-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">
            Adresse
          </p>
          <p className="mt-2 text-ink">
            8 Boulevard Gisèle Halimi
            <br />
            44200 Nantes
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-ink-soft">
            Contact
          </p>
          <p className="mt-2 text-ink">
            <a
              href="tel:+33622643253"
              className="hover:text-terracotta transition-colors"
            >
              06 22 64 32 53
            </a>
            <br />
            <a
              href="mailto:contact@parvana.fr"
              className="hover:text-terracotta transition-colors"
            >
              contact@parvana.fr
            </a>
          </p>
        </div>

        <div className="text-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">
            Suivez-nous
          </p>
          <p className="mt-2">
            <a
              href="https://instagram.com/parvana_nantes"
              target="_blank"
              rel="noreferrer"
              className="text-ink hover:text-terracotta transition-colors"
            >
              @parvana_nantes
            </a>
          </p>
          <p className="mt-6 text-xs text-ink-soft/70">
            <Link
              href="/admin/login"
              className="hover:text-terracotta transition-colors"
            >
              Espace gestion
            </Link>
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-between gap-3 border-t border-ink/10 px-6 py-4 text-center text-xs text-ink-soft sm:flex-row md:px-10">
        <p>© {new Date().getFullYear()} Parvana — Tous droits réservés</p>
        <nav className="flex items-center gap-4">
          <Link
            href="/mentions-legales"
            className="hover:text-terracotta transition-colors"
          >
            Mentions légales
          </Link>
          <Link
            href="/confidentialite"
            className="hover:text-terracotta transition-colors"
          >
            Confidentialité
          </Link>
        </nav>
      </div>
    </footer>
  );
}
