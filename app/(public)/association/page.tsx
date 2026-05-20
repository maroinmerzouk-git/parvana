import type { Metadata } from "next";
import { PhotoPlaceholder } from "@/components/site/photo-placeholder";

export const metadata: Metadata = {
  title: "Association",
  description:
    "L'engagement associatif de Parvana : soutien aux femmes et enfants sans-abris d'Asie Centrale.",
};

// TODO: contenu à recevoir de la cliente.
// Maryam doit fournir :
//   - le nom officiel de l'association (si elle est constituée)
//   - les modalités de soutien (dons, bénévolat, événements)
//   - les bénéficiaires et projets concrets soutenus
//   - éventuellement un appel à dons / lien de financement
// En attendant, page construite avec Lorem ipsum + ancrages connus de la v2.

export default function AssociationPage() {
  return (
    <>
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-4xl px-6 pb-12 pt-20 md:px-10 md:pb-16 md:pt-28">
          <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
            Association
          </p>
          <h1 className="mt-6 font-display text-5xl leading-[0.95] text-ink md:text-7xl">
            <span className="italic">Soutenir,</span>
            <br />
            transmettre.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-soft">
            Parvana est aussi un projet associatif : soutenir les femmes et les
            enfants sans-abris d&apos;Asie Centrale, et valoriser le
            savoir-faire artisanal des femmes afghanes.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-terracotta/40 bg-terracotta/5 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-terracotta">
            Page en construction · contenu à finaliser avec Maryam
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[1.4fr_1fr] md:gap-16 md:px-10 md:py-24">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
              Notre engagement
            </p>
            <h2 className="mt-4 font-display text-3xl italic leading-tight text-ink md:text-4xl">
              Une cause, deux gestes.
            </h2>
            <div className="mt-6 space-y-4 text-lg text-ink-soft">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum.
              </p>
            </div>
          </div>
          {/* TODO: remplacer par la photo fournie par la cliente — sujet: suspensions textiles tissées à la main dans la salle */}
          <PhotoPlaceholder
            description="textiles · suspensions"
            aspectRatio="3/4"
          />
        </div>
      </section>

      <section className="border-b border-ink/10 bg-sand">
        <div className="mx-auto max-w-4xl px-6 py-20 md:px-10 md:py-24">
          <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
            Soutenir le projet
          </p>
          <h2 className="mt-4 font-display text-3xl italic leading-tight text-ink md:text-4xl">
            Comment participer ?
          </h2>
          <p className="mt-6 text-lg text-ink-soft">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maryam
            précisera ici les modalités concrètes : dons, bénévolat, événements
            de soutien, partenariats.
          </p>
          <ul className="mt-8 space-y-4 text-ink-soft">
            <li className="border-l-2 border-terracotta pl-4">
              <span className="font-display text-lg italic text-ink">
                Par un don
              </span>
              <p>À compléter avec lien / RIB / plateforme.</p>
            </li>
            <li className="border-l-2 border-terracotta pl-4">
              <span className="font-display text-lg italic text-ink">
                En venant manger
              </span>
              <p>
                Une partie des recettes du restaurant est reversée aux projets
                soutenus — préciser le pourcentage.
              </p>
            </li>
            <li className="border-l-2 border-terracotta pl-4">
              <span className="font-display text-lg italic text-ink">
                Par le bénévolat
              </span>
              <p>À compléter : missions ponctuelles, événements.</p>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
