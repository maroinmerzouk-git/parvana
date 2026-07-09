import { z } from "zod";

const FRENCH_PHONE = /^(?:\+33|0)\s?[1-9](?:[\s.-]?\d{2}){4}$/;

// Format et cohérence de base uniquement. La disponibilité réelle (jour fermé,
// créneau valide pour le service) est vérifiée contre les horaires d'ouverture
// via `reservationHoursError` (voir lib/hours.ts) — côté client et serveur.
export const reservationSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(80, "Nom trop long"),
  email: z.string().trim().toLowerCase().email("Email invalide").max(120),
  phone: z
    .string()
    .trim()
    .regex(FRENCH_PHONE, "Numéro français invalide (ex : 06 12 34 56 78)"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide")
    .refine((d) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(d) >= today;
    }, "La date doit être aujourd'hui ou plus tard"),
  service: z.enum(["midi", "soir"], {
    message: "Service requis",
  }),
  arrivalTime: z.string().regex(/^\d{2}:\d{2}$/, "Heure invalide"),
  partySize: z
    .number()
    .int()
    .min(1, "Minimum 1 personne")
    .max(10, "Au-delà de 10 personnes, merci de nous contacter directement"),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
