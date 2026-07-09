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
  type DayKey,
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

// ---------------------------------------------------------------------------
// Mapping horaires ↔ réservations
//
// Les créneaux de réservation sont dérivés des horaires d'ouverture : un jour
// fermé n'est pas réservable, et les créneaux proposés sont générés à partir
// des plages de service configurées dans l'admin (fini les créneaux en dur).
// ---------------------------------------------------------------------------

export type ReservationService = "midi" | "soir";

/** Pas entre deux créneaux proposés, en minutes. */
export const SLOT_STEP_MIN = 15;

/**
 * Dernier créneau réservable = fin de service − ce délai (minutes). Laisse le
 * temps aux clients de s'installer et de dîner avant la fermeture.
 */
export const LAST_SEATING_BUFFER_MIN = 45;

/** Une plage qui commence avant 17h00 est un service du midi, sinon du soir. */
const MIDI_SOIR_CUTOFF = "17:00";

const DAY_KEY_TO_DOW: Record<DayKey, number> = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 0,
};

function toMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function toHHMM(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** "2026-07-11" → clé de jour ("saturday"), ou `null` si le format est invalide. */
export function dayKeyForDate(dateStr: string): DayKey | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!m) return null;
  const dt = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return DAY_KEYS[(dt.getUTCDay() + 6) % 7]; // 0 = lundi
}

function isDayClosed(day: DayHours): boolean {
  return day.closed || day.ranges.length === 0;
}

/** Le restaurant est-il fermé à cette date (jour hebdomadaire fermé) ? */
export function isClosedOn(hours: OpeningHours, dateStr: string): boolean {
  const key = dayKeyForDate(dateStr);
  if (!key) return true;
  return isDayClosed(hours.days[key]);
}

/** Service (midi/soir) auquel appartient une plage, selon son heure de début. */
export function serviceForRange(r: ServiceRange): ReservationService {
  return r.start < MIDI_SOIR_CUTOFF ? "midi" : "soir";
}

/** Créneaux réservables (HH:MM) générés depuis une plage de service. */
function slotsForRange(r: ServiceRange): string[] {
  const start = toMinutes(r.start);
  const last = Math.max(start, toMinutes(r.end) - LAST_SEATING_BUFFER_MIN);
  const out: string[] = [];
  for (let t = start; t <= last; t += SLOT_STEP_MIN) out.push(toHHMM(t));
  return out;
}

/** Créneaux réservables pour un service donné à une date donnée. */
export function slotsForService(
  hours: OpeningHours,
  dateStr: string,
  service: ReservationService,
): string[] {
  const key = dayKeyForDate(dateStr);
  if (!key) return [];
  const day = hours.days[key];
  if (isDayClosed(day)) return [];
  const slots = new Set<string>();
  for (const r of day.ranges) {
    if (serviceForRange(r) === service) {
      for (const s of slotsForRange(r)) slots.add(s);
    }
  }
  return [...slots].sort();
}

export interface ServiceAvailability {
  service: ReservationService;
  available: boolean;
  slots: string[];
  /** "12h00 — 14h30" (plages du service, jointes par " · "), ou "". */
  rangeText: string;
}

export interface ReservationDayOptions {
  closed: boolean;
  midi: ServiceAvailability;
  soir: ServiceAvailability;
}

/**
 * Options de réservation pour une date : ouverture, et pour chaque service ses
 * créneaux et le texte de la plage. Utilisé par le formulaire pour n'afficher
 * que ce qui est réellement réservable ce jour-là.
 */
export function reservationDayOptions(
  hours: OpeningHours,
  dateStr: string,
): ReservationDayOptions {
  const key = dayKeyForDate(dateStr);
  const day = key ? hours.days[key] : null;
  const closed = !day || isDayClosed(day);

  const build = (service: ReservationService): ServiceAvailability => {
    const ranges = day && !closed
      ? day.ranges.filter((r) => serviceForRange(r) === service)
      : [];
    const slots = slotsForService(hours, dateStr, service);
    return {
      service,
      available: slots.length > 0,
      slots,
      rangeText: ranges.map(formatRange).join(" · "),
    };
  };

  return { closed, midi: build("midi"), soir: build("soir") };
}

/**
 * Numéros de jours (0 = dimanche … 6 = samedi, format react-day-picker) où le
 * restaurant est fermé — pour désactiver ces jours dans le calendrier.
 */
export function closedDaysOfWeek(hours: OpeningHours): number[] {
  return DAY_KEYS.filter((k) => isDayClosed(hours.days[k])).map(
    (k) => DAY_KEY_TO_DOW[k],
  );
}

/**
 * Vérifie une réservation contre les horaires. Retourne un message d'erreur
 * (fermé / service indisponible / créneau invalide) ou `null` si tout est bon.
 * Partagé entre la validation serveur (API) et le garde-fou côté client.
 */
export function reservationHoursError(
  hours: OpeningHours,
  data: { date: string; service: ReservationService; arrivalTime: string },
): string | null {
  if (isClosedOn(hours, data.date)) {
    return "Le restaurant est fermé à cette date.";
  }
  const slots = slotsForService(hours, data.date, data.service);
  if (slots.length === 0) {
    return `Aucun service ${
      data.service === "midi" ? "du midi" : "du soir"
    } n'est proposé à cette date.`;
  }
  if (!slots.includes(data.arrivalTime)) {
    return "Ce créneau n'est pas disponible pour ce service.";
  }
  return null;
}
