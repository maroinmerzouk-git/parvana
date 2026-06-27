import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import {
  openingHoursSchema,
  OPENING_HOURS_DEFAULTS,
  DAY_KEYS,
  DAY_LABELS_FR,
  type OpeningHours,
  type DayHours,
  type ServiceRange,
} from "@/lib/schemas/hours";

export type { OpeningHours, DayHours, ServiceRange } from "@/lib/schemas/hours";

export const OPENING_HOURS_SETTINGS_KEY = "opening-hours";

/**
 * Horaires d'ouverture éditables, lus depuis `site_settings`. Retombe sur les
 * valeurs par défaut si la base est indisponible ou si la ligne est invalide
 * (même pattern que `getAssociationSettings`).
 */
export async function getOpeningHours(): Promise<OpeningHours> {
  try {
    const db = getDb();
    const [row] = await db
      .select()
      .from(schema.siteSettings)
      .where(eq(schema.siteSettings.key, OPENING_HOURS_SETTINGS_KEY))
      .limit(1);

    if (row) {
      const parsed = openingHoursSchema.safeParse(row.data);
      if (parsed.success) return parsed.data;
      console.error(
        "[hours] DB row failed Zod validation, using defaults:",
        parsed.error.format(),
      );
    }
  } catch (err) {
    console.error("[hours] DB unavailable, using defaults:", err);
  }

  return OPENING_HOURS_DEFAULTS;
}

/** "12:00" → "12h00" (format horaire français). */
export function toFrenchTime(t: string): string {
  return t.replace(":", "h");
}

/** "12h00 — 14h30" ou "11h00 — 14h30 · brunch" si la plage est labellisée. */
export function formatRange(r: ServiceRange): string {
  const base = `${toFrenchTime(r.start)} — ${toFrenchTime(r.end)}`;
  return r.label ? `${base} · ${r.label}` : base;
}

/** Texte d'une journée : "Fermé" ou les plages jointes par " · ". */
export function formatDay(day: DayHours): string {
  if (day.closed || day.ranges.length === 0) return "Fermé";
  return day.ranges.map(formatRange).join(" · ");
}

export interface WeeklyHourRow {
  key: string;
  label: string;
  text: string;
  closed: boolean;
}

/** Lignes prêtes à afficher (lundi → dimanche) pour la page Contact. */
export function weeklyHours(settings: OpeningHours): WeeklyHourRow[] {
  return DAY_KEYS.map((key) => {
    const day = settings.days[key];
    return {
      key,
      label: DAY_LABELS_FR[key],
      text: formatDay(day),
      closed: day.closed || day.ranges.length === 0,
    };
  });
}
