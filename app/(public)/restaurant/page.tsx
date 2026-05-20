import type { Metadata } from "next";
import Link from "next/link";
import { PhotoPlaceholder } from "@/components/site/photo-placeholder";

export const metadata: Metadata = {
  title: "Le restaurant",
  description:
    "L'histoire de Parvana, cantine afghane portée par Maryam Farid, à Nantes.",
};

export default function RestaurantPage() {
  return (
    <>
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-4xl px-6 pb-12 pt-20 md:px-10 md:pb-16 md:pt-28">
          <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
            Le restaurant
          </p>
          <h1 className="mt-6 font-display text-5xl leading-[0.95] text-ink md:text-7xl">
            <span className="italic">Parvana,</span>
            <br />
            <span className="text-terracotta italic">papillon</span> en persan.
          </h1>
          <p className="mt-8 max-w-2xl text-xl text-ink-soft md:text-2xl">
            Une cantine d&apos;Asie Centrale ouverte en juin 2025 sur l&apos;Île
            de Nantes. Un nom emprunté à une héroïne littéraire — et porté par
            une cheffe qui en prolonge le geste.
          </p>
        </div>
      </section>

      <section className="border-b border-ink/10">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[1fr_1.4fr] md:gap-16 md:px-10 md:py-24">
          {/* TODO: remplacer par la photo fournie par la cliente — sujet: portrait Maryam */}
          <PhotoPlaceholder description="portrait · Maryam" aspectRatio="3/4" />
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
              L&apos;origine du nom
            </p>
            <h2 className="mt-4 font-display text-3xl italic leading-tight text-ink md:text-4xl">
              Une enfant de onze ans, et beaucoup de courage.
            </h2>
            <div className="mt-6 space-y-4 text-lg text-ink-soft">
              <p>
                Parvana, c&apos;est d&apos;abord le nom d&apos;une héroïne
                littéraire. Une petite fille afghane de onze ans qui, sous le
                régime des talibans, coupa ses cheveux et se fit passer pour un
                garçon afin de faire vivre sa famille.
              </p>
              <p>
                Son courage a inspiré Maryam — jeune cheffe afghane — à donner
                ce nom à son projet. Une cantine ouverte en juin 2025 sur
                l&apos;Île de Nantes, qui s&apos;étend bien au-delà de
                l&apos;assiette.
              </p>
            </div>
            <blockquote className="mt-8 border-l-2 border-terracotta pl-6 font-display text-2xl italic leading-snug text-ink">
              « Je suis Maryam, Afghane, et je suis engagée pour la liberté des
              femmes. La cuisine fait partie de mon histoire — c&apos;est, pour
              moi, la plus magique des recettes pour communiquer mon
              engagement. »
            </blockquote>
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-sand">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-24">
          <div className="grid gap-12 md:grid-cols-[1.4fr_1fr] md:gap-16">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
                Le parcours
              </p>
              <h2 className="mt-4 font-display text-3xl italic leading-tight text-ink md:text-4xl">
                De Fair-e à Parvana, dix ans de cuisine partagée.
              </h2>
              <div className="mt-6 space-y-4 text-lg text-ink-soft">
                <p>
                  Maryam a appris à Nantes — d&apos;abord au restaurant
                  associatif <strong className="text-ink">Fair-e</strong>, lieu
                  d&apos;insertion et de transmission, puis dans les foodhalls{" "}
                  <strong className="text-ink">Magmaa</strong> et{" "}
                  <strong className="text-ink">Carquefood</strong>, où elle
                  affine sa cuisine afghane au contact du public.
                </p>
                <p>
                  Parvana est son premier lieu en propre. Une cantine sur
                  l&apos;Île de Nantes, ouverte du mardi au dimanche, où les
                  plats — pulao, mantu, borani, halwa — sont préparés chaque
                  matin et présentés derrière la vitrine.
                </p>
              </div>
            </div>
            {/* TODO: remplacer par la photo fournie par la cliente — sujet: salle du restaurant, lumière du jour */}
            <PhotoPlaceholder description="salle · lumière" aspectRatio="4/5" />
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-24">
          <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-16">
            {/* TODO: remplacer par la photo fournie par la cliente — sujet: équipe en cuisine ou détail des suspensions textiles */}
            <PhotoPlaceholder
              description="équipe / textiles"
              aspectRatio="3/4"
            />
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
                L&apos;engagement
              </p>
              <h2 className="mt-4 font-display text-3xl italic leading-tight text-ink md:text-4xl">
                Une cuisine, une cause.
              </h2>
              <div className="mt-6 space-y-4 text-lg text-ink-soft">
                <p>
                  Parvana est aussi un projet associatif : soutenir les femmes
                  et les enfants sans-abris d&apos;Asie Centrale, et valoriser
                  le savoir-faire artisanal des femmes afghanes — qui ont
                  fabriqué, à la main, l&apos;ensemble des suspensions textiles
                  qui habitent le restaurant.
                </p>
                <p>
                  Chaque assiette servie ici raconte un fragment de cette
                  histoire. Chaque table partagée, un acte de transmission.
                </p>
              </div>
              <Link
                href="/association"
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-terracotta hover:text-terracotta-dark"
              >
                En savoir plus sur l&apos;association →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink text-beige">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 py-20 md:flex-row md:items-center md:justify-between md:px-10 md:py-24">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
              Visiter
            </p>
            <h2 className="mt-4 font-display text-3xl italic leading-tight md:text-4xl">
              Venir manger chez Parvana.
            </h2>
            <p className="mt-3 max-w-md text-beige/80">
              8 Boulevard Gisèle Halimi · 44200 Nantes
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/reservation"
              className="inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 text-sm font-medium uppercase tracking-[0.12em] text-beige transition-colors hover:bg-terracotta-dark"
            >
              Réserver une table
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-beige/40 px-6 py-3 text-sm font-medium uppercase tracking-[0.12em] text-beige transition-colors hover:border-beige"
            >
              Adresse & horaires
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
