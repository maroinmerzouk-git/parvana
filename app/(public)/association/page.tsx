import type { Metadata } from "next";
import Link from "next/link";
import { PhotoPlaceholder } from "@/components/site/photo-placeholder";
import { getAssociationSettings, ateliersDateLabel } from "@/lib/association";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Association",
  description:
    "Le projet associatif de Parvana — soutenir les femmes et les enfants sans abri en Asie centrale à travers la santé, l'éducation, le logement et l'accès au travail.",
  path: "/association",
});

export const dynamic = "force-dynamic";

const actions: Array<[string, string]> = [
  [
    "Nourrir les enfants",
    "Aider à nourrir les enfants vivant dans la rue.",
  ],
  [
    "Soutenir l'école",
    "Permettre aux enfants un accès à la scolarité et à l'éducation.",
  ],
  [
    "Accompagner les femmes",
    "Accompagner les femmes en situation de précarité vers plus d'autonomie.",
  ],
  [
    "Besoins essentiels",
    "Participer aux besoins essentiels liés à la santé, au logement et au travail.",
  ],
];

export default async function AssociationPage() {
  const settings = await getAssociationSettings();
  const ateliersDates = ateliersDateLabel(settings.ateliers);

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
            Parvana est un restaurant engagé qui soutient des actions
            solidaires en faveur des femmes et des enfants sans abri en Asie
            centrale.
          </p>
        </div>
      </section>

      <section className="border-b border-ink/10">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[1.4fr_1fr] md:gap-16 md:px-10 md:py-24">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
              Le projet associatif
            </p>
            <h2 className="mt-4 font-display text-3xl italic leading-tight text-ink md:text-4xl">
              Un restaurant, un engagement.
            </h2>
            <div className="mt-6 space-y-4 text-lg text-ink-soft">
              <p>
                À travers le restaurant et les événements organisés, une partie
                des revenus est reversée à l&apos;association afin de
                participer à des projets concrets autour de la santé, de
                l&apos;éducation, du logement et de l&apos;accès au travail
                pour les femmes en situation de précarité.
              </p>
              <p>
                Chez Parvana, nous croyons qu&apos;un lieu de restauration peut
                aussi devenir un lieu d&apos;entraide, de culture et de
                solidarité. Chaque repas partagé contribue à soutenir une
                démarche humaine et engagée.
              </p>
            </div>
          </div>
          <PhotoPlaceholder
            description="textiles · suspensions"
            aspectRatio="3/4"
            src="/photos/suspensions.jpg"
            alt="Lanternes et voilages suspendus dans la salle, devant un tapis traditionnel"
          />
        </div>
      </section>

      <section className="border-b border-ink/10 bg-sand">
        <div className="mx-auto max-w-5xl px-6 py-20 md:px-10 md:py-24">
          <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
            Les actions soutenues
          </p>
          <h2 className="mt-4 font-display text-3xl italic leading-tight text-ink md:text-4xl">
            Quatre gestes concrets.
          </h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {actions.map(([title, description]) => (
              <li
                key={title}
                className="rounded-lg border border-ink/10 bg-beige p-6"
              >
                <p className="font-display text-xl italic text-ink">{title}</p>
                <p className="mt-2 text-ink-soft">{description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-ink/10">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[1fr_1.4fr] md:gap-16 md:px-10 md:py-24">
          <PhotoPlaceholder
            description="ateliers · partage"
            aspectRatio="3/4"
            src="/photos/partage.jpg"
            alt="Moment de partage autour d'un repas : thé versé dans une tasse en céramique"
          />
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
              Les ateliers
            </p>
            <h2 className="mt-4 font-display text-3xl italic leading-tight text-ink md:text-4xl">
              Ateliers artistiques et culinaires.
            </h2>
            {ateliersDates && (
              <p className="mt-4 inline-flex items-center rounded-full border border-terracotta/40 bg-terracotta/5 px-4 py-1.5 text-sm font-medium text-terracotta-dark">
                {ateliersDates}
              </p>
            )}
            <div className="mt-6 space-y-4 text-lg text-ink-soft">
              <p>
                Les ateliers artistiques et culinaires sont organisés par les
                bénévoles de l&apos;association. Ces moments de partage
                permettent de créer du lien, transmettre des savoir-faire et
                sensibiliser autour des réalités sociales vécues par certaines
                familles en Asie centrale.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink text-beige">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 py-20 md:flex-row md:items-center md:justify-between md:px-10 md:py-24">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
              Participer
            </p>
            <h2 className="mt-4 font-display text-3xl italic leading-tight md:text-4xl">
              Soutenir le projet.
            </h2>
            <p className="mt-3 max-w-md text-beige/80">
              Venir manger, participer à un atelier, ou organiser un événement
              traiteur — chaque geste soutient les actions de
              l&apos;association.
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
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
