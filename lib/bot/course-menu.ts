import { parsePriceCents } from "./price";

// Le menu food (midi/soir) est rédigé en texte libre : une description, des
// prix par plat (entrée / plat / dessert, parfois en fourchette) et des
// formules. Il ne nomme pas les plats du jour. On en extrait les options
// tarifaires pour une commande « par formule / à la carte » : le client choisit
// une formule ou des plats, indique les quantités, puis décrit en texte ce
// qu'il veut.

export interface CourseOption {
  name: string; // "Entrée" | "Plat" | "Dessert" (ou libellé brut)
  priceCents: number; // prix (minimum si fourchette)
  priceMaxCents?: number; // borne haute si fourchette ("de 15 € à 24 €")
}

export interface FormuleOption {
  name: string; // "Entrée + Plat + Dessert"
  priceCents: number;
}

export interface CourseMenu {
  courses: CourseOption[];
  formules: FormuleOption[];
}

/** Retire puces et caractères invisibles (word-joiner, etc.). */
function clean(line: string): string {
  return line.replace(/[••⁠-⁤]/g, "").trim();
}

/** Tous les montants d'un texte, en centimes, dans l'ordre d'apparition. */
function pricesInText(s: string): number[] {
  const out: number[] = [];
  const re = /(\d+(?:[.,]\d{1,2})?)\s*€/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    const cents = parsePriceCents(m[1]);
    if (cents != null) out.push(cents);
  }
  return out;
}

/** Normalise un libellé de plat vers Entrée / Plat / Dessert si reconnu. */
function courseName(label: string): string {
  const l = label.toLowerCase();
  if (l.includes("entrée") || l.includes("entree")) return "Entrée";
  if (l.includes("plat")) return "Plat";
  if (l.includes("dessert")) return "Dessert";
  return label;
}

/**
 * Analyse le texte libre d'un service food en prix de plats + formules.
 * Les en-têtes « À la carte » / « Formules » (lignes courtes, sans prix)
 * déterminent la section ; une ligne « Libellé : prix » est une option.
 */
export function parseCourseMenu(text: string): CourseMenu {
  const courses: CourseOption[] = [];
  const formules: FormuleOption[] = [];
  let section: "carte" | "formule" | null = null;

  for (const rawLine of text.split("\n")) {
    const line = clean(rawLine);
    if (line === "") continue;

    const hasPrice = /€/.test(line);
    const colon = line.indexOf(":");

    // En-tête de section : ligne courte, sans prix ni « : ».
    if (!hasPrice && colon === -1) {
      if (line.length <= 20) {
        const l = line.toLowerCase();
        if (l.includes("formule")) section = "formule";
        else if (l.includes("carte")) section = "carte";
      }
      continue; // prose descriptive : ignorée
    }

    if (colon === -1 || !hasPrice) continue;

    const label = clean(line.slice(0, colon));
    const prices = pricesInText(line.slice(colon + 1));
    if (prices.length === 0 || label === "") continue;
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    if (section === "formule" || label.includes("+")) {
      formules.push({ name: label, priceCents: min });
    } else {
      courses.push({
        name: courseName(label),
        priceCents: min,
        ...(max !== min ? { priceMaxCents: max } : {}),
      });
    }
  }

  return { courses, formules };
}
