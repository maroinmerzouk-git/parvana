import type { Menu, MenuService } from "@/lib/schemas/menu";
import { formatCents, parsePriceCents } from "./price";
import { parseCourseMenu } from "./course-menu";

// Transforme le menu publié du jour (JSONB libre, sans identifiants) en un
// catalogue sélectionnable et indexable pour le bot. Chaque article reçoit un
// id déterministe dérivé de sa POSITION — « <service>:<catIdx>:<itemIdx> » —
// qui est stable au sein d'une même version de menu. Comme le bot reconstruit
// le catalogue à chaque étape depuis `getCurrentMenu()`, le flux colle toujours
// au menu du jour (voir resolveItem + le garde-fou de version dans la machine).

export type ServiceKey = "midi" | "soir" | "boissons";

export interface CatalogItem {
  id: string; // "<service>:<catIdx>:<itemIdx>"
  name: string;
  priceCents: number | null; // null = plat au forfait (formule midi)
  priceNote?: string; // libellé de prix alternatif (ex. fourchette "15 € à 24 €")
}

export interface CatalogCategory {
  title: string;
  items: CatalogItem[];
}

export interface CatalogService {
  key: ServiceKey;
  label: string;
  formule: string | null; // texte de la formule, le cas échéant
  categories: CatalogCategory[];
}

export interface Catalog {
  version: number | null;
  services: CatalogService[];
}

const SERVICE_LABELS: Record<ServiceKey, string> = {
  midi: "Le midi — cantine",
  soir: "Le soir — à la carte",
  boissons: "Boissons",
};

/** Catégories brutes (sans id) — on attribue les ids dans buildCatalog. */
interface RawCategory {
  title: string;
  items: { name: string; priceCents: number | null; priceNote?: string }[];
}

/**
 * Analyse le bloc texte libre des boissons en catégories/articles.
 * Une ligne non vide sans préfixe « - » est un titre de section ; une ligne
 * « - Nom — … — 8€ » est un article (le dernier segment est le prix).
 */
export function parseBoissonsBlob(text: string): RawCategory[] {
  const categories: RawCategory[] = [];
  let current: RawCategory | null = null;

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (line === "") continue;

    if (line.startsWith("-")) {
      const body = line.replace(/^-\s*/, "").trim();
      if (body === "") continue;
      const parts = body.split(/\s*—\s*/); // tiret cadratin « — »
      let name = body;
      let priceCents: number | null = null;
      if (parts.length >= 2) {
        const maybePrice = parsePriceCents(parts[parts.length - 1]);
        if (maybePrice != null) {
          priceCents = maybePrice;
          name = parts[0].trim();
        }
      }
      if (!current) {
        current = { title: "Boissons", items: [] };
        categories.push(current);
      }
      current.items.push({ name, priceCents });
    } else {
      current = { title: line, items: [] };
      categories.push(current);
    }
  }

  return categories.filter((c) => c.items.length > 0);
}

/** Catégories brutes d'un service midi/soir (mode carte, plats nommés). */
function rawCategoriesForService(service: MenuService): RawCategory[] {
  return service.categories.map((cat) => ({
    title: cat.title,
    items: cat.items.map((item) => ({
      name: item.name,
      priceCents: parsePriceCents(item.price),
    })),
  }));
}

/**
 * Catégories brutes dérivées du texte libre d'un service food : une catégorie
 * « Formules » et une catégorie « À la carte » (prix par plat). Les plats n'y
 * sont pas nommés — le client précise ses choix en texte à la commande.
 */
function courseCategoriesFromText(text: string): RawCategory[] {
  const { courses, formules } = parseCourseMenu(text);
  const cats: RawCategory[] = [];
  if (formules.length > 0) {
    cats.push({
      title: "Formules",
      items: formules.map((f) => ({ name: f.name, priceCents: f.priceCents })),
    });
  }
  if (courses.length > 0) {
    cats.push({
      title: "À la carte",
      items: courses.map((c) => ({
        name: c.name,
        priceCents: c.priceCents,
        priceNote:
          c.priceMaxCents != null && c.priceMaxCents !== c.priceCents
            ? `${formatCents(c.priceCents)} à ${formatCents(c.priceMaxCents)}`
            : undefined,
      })),
    });
  }
  return cats;
}

/** Catégories food : plats nommés (mode carte) sinon dérivées du texte libre. */
function foodCategories(service: MenuService): RawCategory[] {
  if (service.categories.length > 0) return rawCategoriesForService(service);
  if (service.text && service.text.trim() !== "")
    return courseCategoriesFromText(service.text);
  return [];
}

/** Assemble un service du catalogue (ids inclus) à partir de catégories brutes. */
function assemble(
  key: ServiceKey,
  formule: string | null,
  raw: RawCategory[],
): CatalogService | null {
  const categories: CatalogCategory[] = raw
    .map((cat, ci) => ({
      title: cat.title,
      items: cat.items.map((item, ii) => ({
        id: `${key}:${ci}:${ii}`,
        name: item.name,
        priceCents: item.priceCents,
        ...(item.priceNote ? { priceNote: item.priceNote } : {}),
      })),
    }))
    .filter((cat) => cat.items.length > 0);

  if (categories.length === 0) return null;
  return { key, label: SERVICE_LABELS[key], formule, categories };
}

function formuleOf(service: MenuService): string | null {
  return service.formule && service.formule.trim() !== ""
    ? service.formule.trim()
    : null;
}

/** Construit le catalogue sélectionnable depuis le menu du jour. */
export function buildCatalog(menu: Menu, version: number | null): Catalog {
  const services: CatalogService[] = [];

  if (menu.midi.active) {
    const s = assemble("midi", formuleOf(menu.midi), foodCategories(menu.midi));
    if (s) services.push(s);
  }
  if (menu.soir.active) {
    const s = assemble("soir", formuleOf(menu.soir), foodCategories(menu.soir));
    if (s) services.push(s);
  }
  if (menu.boissons?.active) {
    const b = menu.boissons;
    const raw =
      b.text && b.text.trim() !== ""
        ? parseBoissonsBlob(b.text)
        : rawCategoriesForService(b);
    const s = assemble("boissons", formuleOf(b), raw);
    if (s) services.push(s);
  }

  return { version, services };
}

/** Retrouve un service du catalogue par sa clé. */
export function findService(
  catalog: Catalog,
  key: ServiceKey,
): CatalogService | undefined {
  return catalog.services.find((s) => s.key === key);
}

/** Retrouve un article par son id (re-résolu contre le catalogue courant). */
export function resolveItem(
  catalog: Catalog,
  id: string,
): { service: CatalogService; category: CatalogCategory; item: CatalogItem } | null {
  for (const service of catalog.services) {
    for (const category of service.categories) {
      const item = category.items.find((it) => it.id === id);
      if (item) return { service, category, item };
    }
  }
  return null;
}
