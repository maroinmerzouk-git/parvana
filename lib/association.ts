import { eq } from "drizzle-orm";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { getDb, schema } from "@/db";
import {
  associationSettingsSchema,
  ASSOCIATION_DEFAULTS,
  type AssociationSettings,
} from "@/lib/schemas/association";

export type { AssociationSettings, AteliersSettings } from "@/lib/schemas/association";

export const ASSOCIATION_SETTINGS_KEY = "association";

export async function getAssociationSettings(): Promise<AssociationSettings> {
  try {
    const db = getDb();
    const [row] = await db
      .select()
      .from(schema.siteSettings)
      .where(eq(schema.siteSettings.key, ASSOCIATION_SETTINGS_KEY))
      .limit(1);

    if (row) {
      const parsed = associationSettingsSchema.safeParse(row.data);
      if (parsed.success) return parsed.data;
      console.error(
        "[association] DB row failed Zod validation, using defaults:",
        parsed.error.format(),
      );
    }
  } catch (err) {
    console.error("[association] DB unavailable, using defaults:", err);
  }

  return ASSOCIATION_DEFAULTS;
}

/**
 * Human-readable French label for the ateliers period, or null when nothing
 * should be displayed (dates hidden or none set).
 */
export function ateliersDateLabel(
  ateliers: AssociationSettings["ateliers"],
): string | null {
  if (!ateliers.showDates) return null;
  const { startDate, endDate } = ateliers;
  const fmt = (d: string) => format(parseISO(d), "d MMMM yyyy", { locale: fr });

  if (startDate && endDate) return `Du ${fmt(startDate)} au ${fmt(endDate)}`;
  if (startDate) return `À partir du ${fmt(startDate)}`;
  if (endDate) return `Jusqu'au ${fmt(endDate)}`;
  return null;
}
