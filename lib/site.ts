/**
 * URL canonique du site, sans slash final.
 * Fallback vers le domaine de production si NEXT_PUBLIC_SITE_URL est absent ou vide.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://parvanarestaurant.com"
).replace(/\/$/, "");

/**
 * Informations métier centralisées — source unique de vérité pour les
 * métadonnées (Open Graph, Twitter) et les données structurées (JSON-LD).
 * Toute modification d'adresse / horaires / contact doit se faire ici.
 */
export const SITE = {
  name: "Parvana",
  legalName: "Parvana",
  /** Tagline courte, réutilisée dans les titres et l'OG par défaut. */
  tagline: "Restaurant d'Asie centrale à Nantes",
  description:
    "Parvana — restaurant d'Asie centrale sur l'Île de Nantes. Cuisine afghane, iranienne, ouzbèke, turque et tadjike faite maison et halal : déjeuner et dîner du mardi au vendredi, brunch le week-end. Réservation en ligne et service traiteur.",
  locale: "fr_FR",
  lang: "fr",
  cuisines: ["Afghane", "Iranienne", "Ouzbèke", "Turque", "Tadjike"],
  priceRange: "€€",
  currency: "EUR",
  telephone: "+33622643253",
  telephoneDisplay: "06 22 64 32 53",
  email: "contact@parvana.fr",
  address: {
    streetAddress: "8 Boulevard Gisèle Halimi",
    addressLocality: "Nantes",
    postalCode: "44200",
    addressRegion: "Pays de la Loire",
    addressCountry: "FR",
  },
  geo: {
    latitude: 47.203131,
    longitude: -1.554858,
  },
  /** Lien Google Maps vers l'établissement (recherche par adresse). */
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=Parvana+8+Boulevard+Gis%C3%A8le+Halimi+44200+Nantes",
  social: {
    instagram: "https://instagram.com/parvana_nantes",
    instagramHandle: "@parvana_nantes",
  },
  /**
   * Mentions légales (LCEN) + RGPD. Les champs marqués TODO doivent être
   * confirmés par l'exploitant avant publication.
   */
  legal: {
    siren: "980 492 367",
    siret: "980 492 367 00019",
    rcs: "Nantes 980 492 367",
    legalForm: "Société à responsabilité limitée (SARL)",
    shareCapital: "1 000 €",
    apeCode: "56.10C — Restauration de type rapide",
    publicationManager: "L'équipe Parvana",
    // Hébergeur du site.
    host: {
      name: "Vercel Inc.",
      address: "340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis",
      url: "https://vercel.com",
    },
    /** Sous-traitants / destinataires des données personnelles. */
    processors: [
      {
        name: "Vercel Inc.",
        role: "Hébergement du site (États-Unis)",
        url: "https://vercel.com/legal/privacy-policy",
      },
      {
        name: "Neon Inc.",
        role: "Base de données hébergée — stockage des demandes (États-Unis)",
        url: "https://neon.tech/privacy-policy",
      },
      {
        name: "Resend (Plus Five Five, Inc.)",
        role: "Envoi des emails de confirmation (États-Unis)",
        url: "https://resend.com/legal/privacy-policy",
      },
    ],
    /** Durée de conservation des données des formulaires (nombre de mois). */
    retentionMonths: 13,
    /** Libellé lisible de la durée de conservation. */
    retention: "13 mois à compter de la demande",
    /** Date de dernière mise à jour des pages légales. */
    lastUpdated: "31 mai 2026",
  },
  /** Image partagée par défaut (Open Graph / Twitter) si aucune n'est fournie. */
  defaultOgImage: "/photos/salle-vue-ensemble.jpg",
  /** Plages horaires au format schema.org OpeningHoursSpecification. */
  openingHours: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "12:00",
      closes: "14:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "19:00",
      closes: "22:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "11:00",
      closes: "14:30",
    },
  ],
} as const;

/** Mots-clés SEO réutilisés dans les métadonnées. */
export const SITE_KEYWORDS = [
  "restaurant afghan Nantes",
  "cuisine d'Asie centrale Nantes",
  "restaurant halal Nantes",
  "Île de Nantes restaurant",
  "brunch Nantes",
  "traiteur afghan Nantes",
  "restaurant iranien Nantes",
  "Parvana Nantes",
];

/** Construit une URL absolue à partir d'un chemin relatif. */
export function absoluteUrl(path = ""): string {
  if (!path) return SITE_URL;
  return path.startsWith("http")
    ? path
    : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** Image partagée par défaut (Open Graph / Twitter), au format 1280×720. */
const DEFAULT_OG_IMAGE = {
  url: "/video/maryam-palaw-poster.jpg",
  width: 1280,
  height: 720,
  alt: "Palaw afghan — plat signature de Parvana, restaurant d'Asie centrale à Nantes",
};

interface PageMetaInput {
  title: string;
  description: string;
  /** Chemin relatif de la page (ex. "/menu"). Utilisé pour le canonical et l'URL OG. */
  path: string;
  /** Image OG spécifique (chemin relatif). À défaut, l'image par défaut est utilisée. */
  image?: { url: string; width: number; height: number; alt: string };
}

/**
 * Métadonnées complètes d'une page : canonical + Open Graph + Twitter,
 * en conservant l'image partagée (Next ne fusionne pas openGraph en profondeur).
 * Le `title` fourni passe par le template "%s · Parvana" du layout racine.
 */
export function pageMetadata({ title, description, path, image }: PageMetaInput) {
  const img = image ?? DEFAULT_OG_IMAGE;
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website" as const,
      siteName: SITE.name,
      locale: SITE.locale,
      url,
      title: `${title} · ${SITE.name}`,
      description,
      images: [img],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: `${title} · ${SITE.name}`,
      description,
      images: [img.url],
    },
  };
}

/**
 * Données structurées schema.org pour l'établissement (Restaurant).
 * Injectées en JSON-LD sur la page d'accueil.
 */
export function restaurantJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITE_URL}/#restaurant`,
    name: SITE.name,
    description: SITE.description,
    servesCuisine: SITE.cuisines,
    url: SITE_URL,
    telephone: SITE.telephone,
    email: SITE.email,
    image: [
      absoluteUrl("/photos/salle-vue-ensemble.jpg"),
      absoluteUrl("/photos/plat-signature.jpg"),
      absoluteUrl("/photos/lanternes-salle.jpg"),
    ],
    priceRange: SITE.priceRange,
    currenciesAccepted: SITE.currency,
    acceptsReservations: true,
    hasMenu: absoluteUrl("/menu"),
    hasMap: SITE.mapUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.streetAddress,
      addressLocality: SITE.address.addressLocality,
      postalCode: SITE.address.postalCode,
      addressRegion: SITE.address.addressRegion,
      addressCountry: SITE.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    areaServed: {
      "@type": "City",
      name: "Nantes",
    },
    sameAs: [SITE.social.instagram],
    openingHoursSpecification: SITE.openingHours,
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
}
