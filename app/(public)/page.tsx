import Link from "next/link";
import { PhotoPlaceholder } from "@/components/site/photo-placeholder";
import { PhotoStrip } from "@/components/site/photo-strip";
import { SITE_URL } from "@/lib/site";

const restaurantJsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Parvana",
  description:
    "Restaurant afghan à Nantes : cuisine faite maison, halal, en cantine le midi et brunch le week-end, sur l'Île de Nantes.",
  servesCuisine: "Afghane",
  url: SITE_URL,
  telephone: "+33622643253",
  email: "contact@parvana.fr",
  image: `${SITE_URL}/photos/salle-vue-ensemble.jpg`,
  priceRange: "€€",
  address: {
    "@type": "PostalAddress",
    streetAddress: "8 Boulevard Gisèle Halimi",
    addressLocality: "Nantes",
    postalCode: "44200",
    addressCountry: "FR",
  },
  sameAs: ["https://instagram.com/parvana_nantes"],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "12:00",
      closes: "14:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "11:00",
      closes: "14:30",
    },
  ],
  acceptsReservations: true,
  potentialAction: {
    "@type": "ReserveAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/reservation`,
      inLanguage: "fr",
      actionPlatform: [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/IOSPlatform",
        "http://schema.org/AndroidPlatform",
      ],
    },
    result: {
      "@type": "Reservation",
      name: "Réserver une table",
    },
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
      />
      <section className="relative overflow-hidden border-b border-ink/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-[1.1fr_1fr] md:gap-16 md:px-10 md:py-28 md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
              Nantes · Île de Nantes · depuis juin 2025
            </p>
            <h1 className="mt-6 font-display text-5xl leading-[0.95] text-ink md:text-7xl lg:text-8xl">
              <span className="italic">Parvana</span>
              <span className="block text-terracotta italic">papillon</span>
              <span className="block">en persan.</span>
            </h1>
            <p className="mt-8 max-w-md text-lg text-ink-soft">
              Une cuisine d&apos;Asie Centrale, portée par Maryam. Le voyage
              commence sur l&apos;Île de Nantes — autour de plats afghans, faits
              maison, halal, partagés en cantine.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/reservation"
                className="inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 text-sm font-medium uppercase tracking-[0.12em] text-beige transition-colors hover:bg-terracotta-dark"
              >
                Réserver une table
              </Link>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 rounded-full border border-ink/30 px-6 py-3 text-sm font-medium uppercase tracking-[0.12em] text-ink transition-colors hover:border-terracotta hover:text-terracotta"
              >
                Découvrir la carte
              </Link>
            </div>
          </div>

          <PhotoPlaceholder
            description="lanternes · salle"
            aspectRatio="4/5"
            src="/photos/lanternes-salle.jpg"
            alt="Lanternes orientales en verre ambré suspendues devant des voilages, avec un tapis afghan en arrière-plan"
            priority
          />
        </div>
      </section>

      <section className="border-b border-ink/10 bg-sand">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-3 md:px-10">
          {[
            {
              eyebrow: "Cuisine",
              title: "Faite maison",
              body: "Tous les plats sont préparés sur place, à partir d'ingrédients frais, naturels et halal. Pas de raccourcis, pas de surgelé.",
            },
            {
              eyebrow: "Lieu",
              title: "Une cantine",
              body: "On choisit ses plats à la vitrine, on règle, on s'installe. Le rythme du midi à Nantes, simple et chaleureux.",
            },
            {
              eyebrow: "Engagement",
              title: "Une cause",
              body: "Soutien aux femmes et enfants sans-abris d'Asie Centrale. Les suspensions textiles de la salle sont tissées à la main par des femmes afghanes.",
            },
          ].map((b) => (
            <div key={b.title}>
              <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
                {b.eyebrow}
              </p>
              <h2 className="mt-4 font-display text-3xl italic text-ink md:text-4xl">
                {b.title}
              </h2>
              <p className="mt-4 text-ink-soft">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
          <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
            En cuisine
          </p>
          <h2 className="mt-4 max-w-xl font-display text-3xl italic text-ink md:text-4xl">
            Du salé au sucré, tout est fait maison.
          </h2>
          <PhotoStrip
            className="mt-10"
            photos={[
              {
                src: "/photos/cuisine-plat-oeuf.jpg",
                alt: "Plat mijoté aux œufs, tomates et coriandre servi dans un bol",
              },
              {
                src: "/photos/cuisine-riz-afghan.jpg",
                alt: "Riz afghan aux carottes confites et raisins secs",
              },
              {
                src: "/photos/cuisine-riz-au-lait.jpg",
                alt: "Dessert crémeux aux fruits et graines dans un bol en céramique",
              },
            ]}
          />
        </div>
      </section>

      <section className="border-b border-ink/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-[1fr_1.2fr] md:gap-16 md:px-10 md:py-28 md:items-center">
          <figure className="relative aspect-[16/9] overflow-hidden border border-ink/10 bg-sand">
            <video
              className="h-full w-full object-cover"
              src="/video/maryam-palaw.mp4"
              poster="/video/maryam-palaw-poster.jpg"
              controls
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Maryam prépare le palaw, riz afghan emblématique de Parvana"
            />
          </figure>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
              La cheffe
            </p>
            <h2 className="mt-4 font-display text-4xl italic leading-tight text-ink md:text-5xl">
              Maryam
            </h2>
            <p className="mt-6 text-lg text-ink-soft">
              Jeune cheffe afghane, passée par le restaurant associatif Fair-e
              puis les foodhalls Magmaa et Carquefood. Parvana est son premier
              lieu — une cantine ouverte en juin 2025 sur l&apos;Île de Nantes,
              qui s&apos;étend bien au-delà de l&apos;assiette.
            </p>
            <Link
              href="/restaurant"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-terracotta hover:text-terracotta-dark"
            >
              Lire l&apos;histoire complète →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
