import { z } from "zod";

const FRENCH_PHONE = /^(?:\+33|0)\s?[1-9](?:[\s.-]?\d{2}){4}$/;

const MIDI_SLOTS = [
  "12:00",
  "12:15",
  "12:30",
  "12:45",
  "13:00",
  "13:15",
  "13:30",
  "13:45",
] as const;

const SOIR_SLOTS = [
  "19:00",
  "19:15",
  "19:30",
  "19:45",
  "20:00",
  "20:15",
  "20:30",
  "20:45",
  "21:00",
] as const;

export const reservationSchema = z
  .object({
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
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide")
      .refine((d) => {
        const [y, m, day] = d.split("-").map(Number);
        const dt = new Date(Date.UTC(y, m - 1, day));
        return dt.getUTCDay() !== 1; // 1 = lundi
      }, "Le restaurant est fermé le lundi")
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
  })
  .superRefine((data, ctx) => {
    const allowed = data.service === "midi" ? MIDI_SLOTS : SOIR_SLOTS;
    if (!(allowed as readonly string[]).includes(data.arrivalTime)) {
      ctx.addIssue({
        code: "custom",
        path: ["arrivalTime"],
        message: `Créneau invalide pour le service ${data.service}`,
      });
    }
  });

export type ReservationInput = z.infer<typeof reservationSchema>;

export const SLOTS = { midi: MIDI_SLOTS, soir: SOIR_SLOTS } as const;
