import type { Metadata } from "next";
import Link from "next/link";
import { PhotoPlaceholder } from "@/components/site/photo-placeholder";

export const metadata: Metadata = {
  title: "Le restaurant",
  description:
    "Parvana, restaurant d'Asie centrale sur l'Île de Nantes — cuisine d'Asie Centrale, iranienne, ouzbèke, turque et tadjike, faite maison.",
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
            un voyage en{" "}
            <span className="text-terracotta italic">Asie centrale</span>.
          </h1>
          <p className="mt-8 max-w-2xl text-xl text-ink-soft md:text-2xl">
            Bienvenue chez Parvana, un lieu de partage et de découverte au cœur
            de l&apos;Île de Nantes. Une cuisine inspirée des traditions
            iraniennes, afghanes, turques, ouzbèkes et tadjikes.
          </p>
        </div>
      </section>

      <section className="border-b border-ink/10">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[1fr_1.4fr] md:gap-16 md:px-10 md:py-24">
          <PhotoPlaceholder
            description="cuisine · vitrine"
            aspectRatio="3/4"
            src="/photos/plat-signature.jpg"
            alt="Plat signature de Parvana : aubergine fondante, légumes marinés et pain plat dans un bol vert"
          />
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
              Notre cuisine
            </p>
            <h2 className="mt-4 font-display text-3xl italic leading-tight text-ink md:text-4xl">
              Frais, fait maison, transmis.
            </h2>
            <div className="mt-6 space-y-4 text-lg text-ink-soft">
              <p>
                Chaque jour, nos plats frais et faits maison sont préparés avec
                des produits locaux et de saison. Présentés en vitrine, ils
                permettent de découvrir simplement une cuisine généreuse,
                familiale et authentique.
              </p>
              <p>
                Plats mijotés, riz afghan, spécialités végétariennes, recettes
                traditionnelles et pâtisseries création de cheffe — notre cuisine
                met à l&apos;honneur des recettes transmises et revisitées avec
                sincérité.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-sand">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-24">
          <div className="grid gap-12 md:grid-cols-[1.4fr_1fr] md:gap-16">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
                L&apos;ambiance
              </p>
              <h2 className="mt-4 font-display text-3xl italic leading-tight text-ink md:text-4xl">
                Une table accessible, un moment à partager.
              </h2>
              <div className="mt-6 space-y-4 text-lg text-ink-soft">
                <p>
                  Chez Parvana, nous souhaitons rendre cette cuisine accessible
                  à tous grâce à des prix raisonnables et une ambiance
                  conviviale. Le restaurant est pensé comme un lieu chaleureux
                  où l&apos;on vient autant pour manger que pour partager un
                  moment humain.
                </p>
                <p>
                  La décoration, inspirée des cultures d&apos;Asie centrale,
                  mêle artisanat, tissus traditionnels et objets faits à la
                  main pour créer une atmosphère authentique et dépaysante.
                </p>
              </div>
            </div>
            <PhotoPlaceholder
              description="salle · textiles"
              aspectRatio="4/5"
              src="/photos/salle-tapis.jpg"
              alt="Mur de tapis persans et table dressée dans la salle de Parvana"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[1fr_1.4fr] md:gap-16 md:px-10 md:py-24">
          <PhotoPlaceholder
            description="dessert · cornets pistache"
            aspectRatio="3/4"
            src="/photos/dessert-cornets-pistache.jpg"
            alt="Cornets feuilletés saupoudrés de sucre glace et garnis de crème à la pistache, servis dans un plat en terre cuite"
          />
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
              L&apos;histoire de Parvana
            </p>
            <h2 className="mt-4 font-display text-3xl italic leading-tight text-ink md:text-4xl">
              Un récit, un refuge, un projet.
            </h2>
            <div className="mt-6 space-y-4 text-lg text-ink-soft">
              <p>
                Parvana est avant tout le nom d&apos;un récit inspirant
                racontant l&apos;histoire d&apos;une jeune fille courageuse en
                Afghanistan. Dans un contexte difficile, elle aide sa famille
                avec force et détermination malgré les interdictions et les
                obstacles imposés aux femmes et aux enfants.
              </p>
              <p>
                Ce nom est devenu le symbole du restaurant&nbsp;: un
                lieu-refuge où l&apos;on peut se retrouver, partager, créer et
                aider.
              </p>
              <p>
                L&apos;aventure Parvana commence en 2023 au{" "}
                <strong className="text-ink">Magmaa Food Hall</strong>, puis se
                poursuit au{" "}
                <strong className="text-ink">Carquefoodhall</strong> avant
                l&apos;ouverture du restaurant sur l&apos;Île de Nantes. Depuis
                le début, le projet porte l&apos;envie de faire découvrir les
                cultures et les cuisines d&apos;Asie centrale à travers un lieu
                chaleureux et authentique.
              </p>
              <p>
                Aujourd&apos;hui, Parvana est à la fois un restaurant, un lieu
                culturel et un projet solidaire porté par des valeurs de
                partage, de transmission et d&apos;humanité.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-sand">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-24">
          <div className="grid gap-12 md:grid-cols-[1.4fr_1fr] md:gap-16">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
                Service traiteur
              </p>
              <h2 className="mt-4 font-display text-3xl italic leading-tight text-ink md:text-4xl">
                Parvana chez vous.
              </h2>
              <p className="mt-6 text-lg text-ink-soft">
                Parvana propose un service traiteur sur mesure pour vos
                événements privés ou professionnels&nbsp;: buffets, repas de
                groupe, cocktails dînatoires et bouchées apéritives inspirées
                des saveurs d&apos;Asie centrale.
              </p>
              <Link
                href="/traiteur"
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-terracotta hover:text-terracotta-dark"
              >
                Demander un devis →
              </Link>
            </div>
            <PhotoPlaceholder
              description="traiteur · buffet"
              aspectRatio="4/5"
              src="/photos/traiteur-buffet.jpg"
              alt="Buffet traiteur Parvana : plateaux de bouchées et tartelettes disposés le long du comptoir"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-24">
          <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-16">
            <PhotoPlaceholder
              description="artisanat · textiles"
              aspectRatio="3/4"
              src="/photos/artisanat-ceramiques.jpg"
              alt="Céramiques et théières artisanales d'Asie centrale exposées sur des étagères en bois"
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
                  Parvana est un restaurant engagé qui soutient des actions
                  solidaires en faveur des femmes et des enfants sans abri en
                  Asie centrale. Une partie des revenus du restaurant et des
                  événements est reversée à l&apos;association.
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
