import { z } from "zod";

// A date is either an ISO day string (YYYY-MM-DD) or empty (not set).
const dateString = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date attendue au format AAAA-MM-JJ")
  .or(z.literal(""));

export const ateliersSettingsSchema = z.object({
  // When false, no dates are shown on the public "Les ateliers" section.
  showDates: z.boolean(),
  startDate: dateString,
  endDate: dateString,
});

export const associationSettingsSchema = z.object({
  ateliers: ateliersSettingsSchema,
});

export type AteliersSettings = z.infer<typeof ateliersSettingsSchema>;
export type AssociationSettings = z.infer<typeof associationSettingsSchema>;

export const ASSOCIATION_DEFAULTS: AssociationSettings = {
  ateliers: { showDates: false, startDate: "", endDate: "" },
};
