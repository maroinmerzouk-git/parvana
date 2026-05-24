import { z } from "zod";

const FRENCH_PHONE = /^(?:\+33|0)\s?[1-9](?:[\s.-]?\d{2}){4}$/;

export const EVENT_TYPES = [
  "mariage",
  "anniversaire",
  "entreprise",
  "autre",
] as const;

export const eventTypeLabels: Record<(typeof EVENT_TYPES)[number], string> = {
  mariage: "Mariage",
  anniversaire: "Anniversaire",
  entreprise: "Événement d'entreprise",
  autre: "Autre",
};

export const cateringSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nom trop court")
    .max(80, "Nom trop long"),
  email: z.string().trim().toLowerCase().email("Email invalide").max(120),
  phone: z
    .string()
    .trim()
    .regex(FRENCH_PHONE, "Numéro français invalide (ex : 06 12 34 56 78)"),
  eventDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide")
    .refine((d) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(d) >= today;
    }, "La date doit être aujourd'hui ou plus tard"),
  eventType: z.enum(EVENT_TYPES, { message: "Type d'événement requis" }),
  partySize: z
    .number()
    .int()
    .min(10, "Minimum 10 personnes pour le traiteur")
    .max(500, "Au-delà de 500 personnes, merci de nous contacter directement"),
  budget: z.string().trim().max(100).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type CateringInput = z.infer<typeof cateringSchema>;
export type EventType = (typeof EVENT_TYPES)[number];
