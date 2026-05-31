import { SITE, SITE_URL } from "@/lib/site";
import { getCurrentMenu, type MenuService } from "@/lib/menu";

/**
 * /llms.txt — format proposé par https://llmstxt.org pour offrir aux
 * assistants IA (Claude, ChatGPT, Gemini, Perplexity…) un résumé concis,
 * lisible et structuré du site. Servi en Markdown / text/plain.
 *
 * Régénéré au plus une fois par heure pour refléter le menu courant.
 */
export const revalidate = 3600;

function serviceLines(label: string, service: MenuService): string[] {
  if (!service.active) return [];
  const lines: string[] = [`### ${label}`];
  if (service.intro) lines.push(service.intro);
  if (service.formule) lines.push(`Formule : ${service.formule}`);
  if (service.text) lines.push(service.text);
  for (const category of service.categories) {
    const items = category.items.map((i) => i.name).filter(Boolean);
    if (items.length) lines.push(`- **${category.title}** : ${items.join(", ")}`);
  }
  return [...lines, ""];
}

export async function GET() {
  let menuSection: string[] = [];
  try {
    const { menu } = await getCurrentMenu();
    menuSection = [
      ...serviceLines("Déjeuner (midi)", menu.midi),
      ...serviceLines("Dîner (soir)", menu.soir),
    ];
  } catch {
    // Le menu détaillé reste consultable sur /menu si la base est indisponible.
  }

  const body = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description}`,
    "",
    "## À propos",
    "",
    `${SITE.name} (« papillon » en persan) est un restaurant d'Asie centrale situé sur l'Île de Nantes, quartier République. La cuisine — afghane, iranienne, ouzbèke, turque et tadjike — est faite maison, halal, et préparée chaque matin sur place. Le restaurant propose un service de cantine le midi, un service du soir, un brunch le week-end, ainsi qu'un service traiteur pour les événements. Un projet associatif soutient les femmes et les enfants en Asie centrale.`,
    "",
    "## Informations pratiques",
    "",
    `- Adresse : ${SITE.address.streetAddress}, ${SITE.address.postalCode} ${SITE.address.addressLocality} (Île de Nantes — quartier République)`,
    `- Téléphone : ${SITE.telephoneDisplay} (${SITE.telephone})`,
    `- Email : ${SITE.email}`,
    `- Instagram : ${SITE.social.instagramHandle} (${SITE.social.instagram})`,
    `- Gamme de prix : ${SITE.priceRange}`,
    "- Réservation : demande en ligne, confirmée manuellement (voir /reservation)",
    "",
    "### Horaires",
    "",
    "- Lundi : fermé",
    "- Mardi au vendredi : 12h00–14h30 (déjeuner) et 19h00–22h00 (dîner)",
    "- Samedi et dimanche : 11h00–14h30 (brunch)",
    "",
    "## Pages",
    "",
    `- [Accueil](${SITE_URL}/) : présentation du restaurant`,
    `- [Le restaurant](${SITE_URL}/restaurant) : l'histoire et la cuisine d'Asie centrale`,
    `- [Menu](${SITE_URL}/menu) : carte du midi et du soir, mise à jour régulièrement`,
    `- [Réservation](${SITE_URL}/reservation) : réserver une table`,
    `- [Traiteur](${SITE_URL}/traiteur) : prestations pour mariages, anniversaires et événements d'entreprise`,
    `- [Association](${SITE_URL}/association) : le projet associatif de Parvana`,
    `- [Contact](${SITE_URL}/contact) : adresse, horaires et coordonnées`,
    `- [Mentions légales](${SITE_URL}/mentions-legales)`,
    `- [Politique de confidentialité](${SITE_URL}/confidentialite)`,
    "",
    ...(menuSection.length ? ["## Aperçu du menu", "", ...menuSection] : []),
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
