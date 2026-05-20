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

export const menuServiceSchema = z.object({
  active: z.boolean(),
  intro: z.string().trim().max(800),
  formule: z.string().trim().max(200).nullable().or(z.literal("")),
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
export type Menu = z.infer<typeof menuSchema>;
