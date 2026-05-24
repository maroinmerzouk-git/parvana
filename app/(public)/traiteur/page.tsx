import type { Metadata } from "next";
import { CateringForm } from "@/components/catering/catering-form";

export const metadata: Metadata = {
  title: "Traiteur",
  description:
    "Service traiteur Parvana — cuisine afghane faite maison pour mariages, anniversaires et événements d'entreprise à Nantes.",
};

export default function TraiteurPage() {
  return (
    <>
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-3xl px-6 pb-12 pt-20 md:px-10 md:pb-16 md:pt-28">
          <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
            Traiteur
          </p>
          <h1 className="mt-6 font-display text-5xl leading-[0.95] text-ink md:text-7xl">
            <span className="italic">Parvana</span>
            <br />
            chez vous.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-soft">
            Mariages, anniversaires, événements d&apos;entreprise — Parvana
            compose des prestations traiteur sur mesure, autour de la cuisine
            afghane faite maison. Pour découvrir les possibilités et obtenir une
            proposition adaptée, remplissez ce formulaire&nbsp;: Maryam vous
            répondra personnellement.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-20">
          <CateringForm />
        </div>
      </section>
    </>
  );
}
