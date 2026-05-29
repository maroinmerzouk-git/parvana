import { z } from "zod";

export const menuTagSchema = z.enum([
  "végétarien",
  "vegan",
  "épicé",
  "signature",
  "fait maison",
  "soupe",
]);

export const menuItemSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500),
  price: z
    .string()
    .trim()
    .min(1)
    .max(20)
    .nullable()
    .or(z.literal("")),
  tags: z.array(menuTagSchema).optional(),
});

export const menuCategorySchema = z.object({
  title: z.string().trim().min(1).max(60),
  items: z.array(menuItemSchema),
});

export const menuModeSchema = z.enum(["formule", "carte", "texte"]);

export const menuServiceSchema = z.object({
  active: z.boolean(),
  // How this service is composed. Optional for backward compatibility with
  // rows saved before modes existed — see effectiveMenuMode().
  mode: menuModeSchema.optional(),
  intro: z.string().trim().max(800),
  formule: z.string().trim().max(200).nullable().or(z.literal("")),
  // Free-text composition used in "texte" mode (line breaks preserved).
  text: z.string().trim().max(5000).optional(),
  // Free-text drinks section, shown under a "Boissons" block in carte mode.
  boissons: z.string().trim().max(3000).optional(),
  categories: z.array(menuCategorySchema),
});

export const menuSchema = z.object({
  midi: menuServiceSchema,
  soir: menuServiceSchema,
});

export type MenuTag = z.infer<typeof menuTagSchema>;
export type MenuItem = z.infer<typeof menuItemSchema>;
export type MenuCategory = z.infer<typeof menuCategorySchema>;
export type MenuService = z.infer<typeof menuServiceSchema>;
export type MenuMode = z.infer<typeof menuModeSchema>;
export type Menu = z.infer<typeof menuSchema>;

/**
 * Resolve a service's composition mode, falling back to the legacy heuristic
 * (categories present → carte, else formule) for rows saved before `mode`.
 */
export function effectiveMenuMode(service: MenuService): MenuMode {
  if (service.mode) return service.mode;
  return service.categories.length > 0 ? "carte" : "formule";
}
