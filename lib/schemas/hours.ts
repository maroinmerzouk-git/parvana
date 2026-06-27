import { z } from "zod";

/** Jours de la semaine, dans l'ordre d'affichage (lundi → dimanche). */
export const DAY_KEYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type DayKey = (typeof DAY_KEYS)[number];

/** Libellés français des jours, pour l'admin et le site public. */
export const DAY_LABELS_FR: Record<DayKey, string> = {
  monday: "Lundi",
  tuesday: "Mardi",
  wednesday: "Mercredi",
  thursday: "Jeudi",
  friday: "Vendredi",
  saturday: "Samedi",
  sunday: "Dimanche",
};

// Heure au format 24h "HH:MM" (00:00 → 23:59).
const timeString = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Heure attendue au format HH:MM");

/**
 * Une plage de service dans une journée (ex. midi 12:00–14:30). Le `label`
 * optionnel permet de qualifier la plage sur le site (ex. « brunch »).
 */
export const serviceRangeSchema = z
  .object({
    start: timeString,
    end: timeString,
    label: z.string().trim().max(40).optional().or(z.literal("")),
  })
  .refine((r) => r.start < r.end, {
    message: "L'heure de fin doit suivre l'heure de début.",
    path: ["end"],
  });

/** Horaires d'une journée : fermé, ou une à quatre plages de service. */
export const dayHoursSchema = z.object({
  closed: z.boolean(),
  ranges: z.array(serviceRangeSchema).max(4),
});

export const openingHoursSchema = z.object({
  days: z.object({
    monday: dayHoursSchema,
    tuesday: dayHoursSchema,
    wednesday: dayHoursSchema,
    thursday: dayHoursSchema,
    friday: dayHoursSchema,
    saturday: dayHoursSchema,
    sunday: dayHoursSchema,
  }),
  // Note libre affichée sous le tableau des horaires (jours fériés, etc.).
  note: z.string().trim().max(300).optional().or(z.literal("")),
});

export type ServiceRange = z.infer<typeof serviceRangeSchema>;
export type DayHours = z.infer<typeof dayHoursSchema>;
export type OpeningHours = z.infer<typeof openingHoursSchema>;

const open = (ranges: ServiceRange[]): DayHours => ({ closed: false, ranges });
const closed: DayHours = { closed: true, ranges: [] };

const weekday = open([
  { start: "12:00", end: "14:30", label: "" },
  { start: "19:00", end: "22:00", label: "" },
]);

const weekend = open([{ start: "11:00", end: "14:30", label: "brunch" }]);

/** Horaires par défaut — reflètent l'état actuel du site (mardi → dimanche). */
export const OPENING_HOURS_DEFAULTS: OpeningHours = {
  days: {
    monday: closed,
    tuesday: weekday,
    wednesday: weekday,
    thursday: weekday,
    friday: weekday,
    saturday: weekend,
    sunday: weekend,
  },
  note: "Service du soir 19h00 — 22h00 du mardi au vendredi. Brunch le week-end.",
};
