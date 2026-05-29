import type { Metadata } from "next";
import Script from "next/script";
import { PhotoStrip } from "@/components/site/photo-strip";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Adresse, horaires et contact du restaurant Parvana à Nantes — 8 Boulevard Gisèle Halimi.",
};

const hours: Array<[string, string, boolean]> = [
  ["Lundi", "Fermé", true],
  ["Mardi", "12h00 — 14h30", false],
  ["Mercredi", "12h00 — 14h30", false],
  ["Jeudi", "12h00 — 14h30", false],
  ["Vendredi", "12h00 — 14h30", false],
  ["Samedi", "11h00 — 14h30 · brunch", false],
  ["Dimanche", "11h00 — 14h30 · brunch", false],
];

// TODO: remplacer par les permalinks réels des 4 derniers posts Instagram fournis par Maryam.
// Format attendu : https://www.instagram.com/p/XXXXXXXXX/
const instagramPosts: string[] = [
  "https://www.instagram.com/parvana_nantes/",
  "https://www.instagram.com/parvana_nantes/",
  "https://www.instagram.com/parvana_nantes/",
  "https://www.instagram.com/parvana_nantes/",
];

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-4xl px-6 pb-12 pt-20 md:px-10 md:pb-16 md:pt-28">
          <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
            Contact
          </p>
          <h1 className="mt-6 font-display text-5xl leading-[0.95] text-ink md:text-7xl">
            <span className="italic">Nous</span> trouver
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-soft">
            Sur l&apos;Île de Nantes, quartier République. Un appel reste le
            moyen le plus rapide pour une question : nous décrochons pendant les
            services.
          </p>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-sand">
        <div className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
          <PhotoStrip
            photos={[
              {
                src: "/photos/ambiance-fauteuil.jpg",
                alt: "Chaise en bois et rotin baignée de lumière près de la baie vitrée",
              },
              {
                src: "/photos/ambiance-tapis.jpg",
                alt: "Détail d'un tapis persan et de coussins dans la salle, au soleil",
              },
            ]}
          />
        </div>
      </section>

      <section className="border-b border-ink/10">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2 md:gap-16 md:px-10 md:py-20">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
              Adresse
            </p>
            <p className="mt-4 font-display text-2xl leading-snug text-ink">
              8 Boulevard Gisèle Halimi
              <br />
              44200 Nantes
              <br />
              <span className="text-ink-soft text-lg italic">
                Île de Nantes — quartier République
              </span>
            </p>

            <p className="mt-10 text-xs uppercase tracking-[0.22em] text-terracotta">
              Contact direct
            </p>
            <ul className="mt-4 space-y-2 font-display text-xl text-ink">
              <li>
                <a
                  href="tel:+33622643253"
                  className="border-b border-ink/30 transition-colors hover:border-terracotta hover:text-terracotta"
                >
                  06 22 64 32 53
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@parvana.fr"
                  className="border-b border-ink/30 transition-colors hover:border-terracotta hover:text-terracotta"
                >
                  contact@parvana.fr
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/parvana_nantes"
                  target="_blank"
                  rel="noreferrer"
                  className="border-b border-ink/30 transition-colors hover:border-terracotta hover:text-terracotta"
                >
                  @parvana_nantes
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
              Horaires
            </p>
            <ul className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
              {hours.map(([day, time, closed]) => (
                <li
                  key={day}
                  className="flex items-center justify-between py-3"
                >
                  <span className="font-display text-lg text-ink">{day}</span>
                  <span
                    className={`text-sm uppercase tracking-[0.12em] ${closed ? "text-ink-soft/50" : "text-ink-soft"}`}
                  >
                    {time}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-ink-soft">
              Service du soir 19h00 — 22h00 selon les jours — voir le menu pour
              les dates ouvertes.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-sand">
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
          <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
            Sur la carte
          </p>
          <h2 className="mt-3 font-display text-3xl italic text-ink md:text-4xl">
            8 Bd Gisèle Halimi, Nantes
          </h2>
          <div className="mt-8 overflow-hidden border border-ink/10 bg-beige">
            <iframe
              title="Carte du restaurant Parvana"
              src="https://www.google.com/maps?q=8+Boulevard+Gisèle+Halimi+44200+Nantes&output=embed"
              className="aspect-[16/9] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
                Instagram
              </p>
              <h2 className="mt-3 font-display text-3xl italic text-ink md:text-4xl">
                @parvana_nantes
              </h2>
            </div>
            <a
              href="https://instagram.com/parvana_nantes"
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-ink/30 px-5 py-2.5 text-sm font-medium uppercase tracking-[0.12em] text-ink transition-colors hover:border-terracotta hover:text-terracotta"
            >
              Voir le compte ↗
            </a>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {instagramPosts.map((href, i) => (
              <blockquote
                key={i}
                className="instagram-media"
                data-instgrm-permalink={href}
                data-instgrm-version="14"
                style={{
                  background: "#FFF",
                  border: 0,
                  margin: 0,
                  minWidth: 0,
                  padding: 0,
                }}
              >
                <div className="aspect-square border border-ink/10 bg-beige p-4 text-xs uppercase tracking-[0.12em] text-ink-soft">
                  Post Instagram #{i + 1} — permalink à compléter
                </div>
              </blockquote>
            ))}
          </div>
          <Script
            src="https://www.instagram.com/embed.js"
            strategy="lazyOnload"
          />
        </div>
      </section>
    </>
  );
}
