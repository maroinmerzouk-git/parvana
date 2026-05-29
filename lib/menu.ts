import { desc } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { menuSchema, type Menu } from "@/lib/schemas/menu";
import staticMenu from "@/content/menu.json";

export type {
  Menu,
  MenuService,
  MenuCategory,
  MenuItem,
  MenuTag,
  MenuMode,
} from "@/lib/schemas/menu";
export { effectiveMenuMode } from "@/lib/schemas/menu";

export interface CurrentMenu {
  menu: Menu;
  version: number | null; // null = fallback JSON, not from DB
  source: "db" | "fallback";
}

export async function getCurrentMenu(): Promise<CurrentMenu> {
  try {
    const db = getDb();
    const [row] = await db
      .select()
      .from(schema.menus)
      .orderBy(desc(schema.menus.version))
      .limit(1);

    if (row) {
      const parsed = menuSchema.safeParse(row.data);
      if (parsed.success) {
        return { menu: parsed.data, version: row.version, source: "db" };
      }
      console.error(
        "[menu] DB row failed Zod validation, falling back:",
        parsed.error.format(),
      );
    }
  } catch (err) {
    console.error("[menu] DB unavailable, falling back to JSON:", err);
  }

  // Fallback: validate the static JSON too, so a corrupt file doesn't
  // silently ship malformed data.
  const fallback = menuSchema.parse(staticMenu);
  return { menu: fallback, version: null, source: "fallback" };
}
