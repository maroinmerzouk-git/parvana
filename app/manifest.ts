import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * Web App Manifest — améliore l'intégration mobile / "ajouter à l'écran
 * d'accueil" et fournit des métadonnées d'application aux navigateurs.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — ${SITE.tagline}`,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    lang: SITE.lang,
    background_color: "#f4ece0",
    theme_color: "#bf5a36",
    icons: [
      {
        src: "/photos/lanternes-salle.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}
