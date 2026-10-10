import {
  pgTable,
  uuid,
  text,
  timestamp,
  date,
  time,
  integer,
  boolean,
  check,
  index,
  jsonb,
  serial,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const reservations = pgTable(
  "reservations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),

    date: date("date").notNull(),
    service: text("service").notNull(),
    arrivalTime: time("arrival_time").notNull(),
    partySize: integer("party_size").notNull(),
    message: text("message"),

    status: text("status").notNull().default("pending"),
    statusChangedAt: timestamp("status_changed_at", { withTimezone: true }),
    rejectionMessage: text("rejection_message"),
    seenAt: timestamp("seen_at", { withTimezone: true }),

    clientEmailSent: boolean("client_email_sent").notNull().default(false),
    confirmationEmailSent: boolean("confirmation_email_sent")
      .notNull()
      .default(false),
    rejectionEmailSent: boolean("rejection_email_sent")
      .notNull()
      .default(false),
  },
  (t) => [
    check("service_check", sql`${t.service} in ('midi', 'soir')`),
    check(
      "status_check",
      sql`${t.status} in ('pending', 'confirmed', 'rejected', 'cancelled')`,
    ),
    check("party_size_check", sql`${t.partySize} between 1 and 10`),
    index("reservations_status_date_idx").on(t.status, t.date),
    index("reservations_created_at_idx").on(t.createdAt.desc()),
  ],
);

export type Reservation = typeof reservations.$inferSelect;
export type NewReservation = typeof reservations.$inferInsert;

export const menus = pgTable(
  "menus",
  {
    version: serial("version").primaryKey(),
    data: jsonb("data").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdBy: text("created_by"),
  },
  (t) => [index("menus_created_at_idx").on(t.createdAt.desc())],
);

export type MenuRow = typeof menus.$inferSelect;
export type NewMenuRow = typeof menus.$inferInsert;

export const cateringRequests = pgTable(
  "catering_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),

    eventDate: date("event_date").notNull(),
    eventType: text("event_type").notNull(),
    partySize: integer("party_size").notNull(),
    budget: text("budget"),
    message: text("message"),

    status: text("status").notNull().default("new"),
    seenAt: timestamp("seen_at", { withTimezone: true }),
    clientEmailSent: boolean("client_email_sent").notNull().default(false),
  },
  (t) => [
    check(
      "catering_event_type_check",
      sql`${t.eventType} in ('mariage', 'anniversaire', 'entreprise', 'autre')`,
    ),
    check(
      "catering_status_check",
      sql`${t.status} in ('new', 'seen', 'archived')`,
    ),
    check(
      "catering_party_size_check",
      sql`${t.partySize} between 10 and 500`,
    ),
    index("catering_status_created_at_idx").on(t.status, t.createdAt.desc()),
    index("catering_created_at_idx").on(t.createdAt.desc()),
  ],
);

export type CateringRequest = typeof cateringRequests.$inferSelect;
export type NewCateringRequest = typeof cateringRequests.$inferInsert;

// Editable site settings, keyed by section (e.g. "association"). One row per
// key, upserted on save. `data` holds a section-specific JSON blob validated
// by Zod before it is read or written.
export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  data: jsonb("data").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedBy: text("updated_by"),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type NewSiteSetting = typeof siteSettings.$inferInsert;

// Commandes à emporter passées via le bot WhatsApp. Auto-confirmées, réglées
// sur place. `items` est un tableau de lignes de panier (name/qty/priceCents…),
// `totalCents` est indicatif et peut être null si la commande ne contient que
// des plats au forfait (formule du midi, sans prix unitaire).
export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    phone: text("phone").notNull(), // identifiant WhatsApp de l'expéditeur
    customerName: text("customer_name").notNull(),

    items: jsonb("items").notNull(), // CartLine[]
    pickupTime: text("pickup_time").notNull(),
    totalCents: integer("total_cents"), // indicatif, null si forfait uniquement
    menuVersion: integer("menu_version"), // version du menu au moment de la commande
    note: text("note"),

    status: text("status").notNull().default("new"),
    seenAt: timestamp("seen_at", { withTimezone: true }),
  },
  (t) => [
    check("orders_status_check", sql`${t.status} in ('new', 'seen', 'archived')`),
    index("orders_status_created_at_idx").on(t.status, t.createdAt.desc()),
    index("orders_created_at_idx").on(t.createdAt.desc()),
  ],
);

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

// État de conversation du bot WhatsApp : une ligne par expéditeur (numéro
// unique du restaurant). `data` porte l'étape courante, le panier, la version
// du menu, etc. (blob JSON spécifique au bot).
export const waConversations = pgTable("wa_conversations", {
  waId: text("wa_id").primaryKey(),
  step: text("step").notNull().default("greet"),
  data: jsonb("data").notNull().default(sql`'{}'::jsonb`),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type WaConversation = typeof waConversations.$inferSelect;
export type NewWaConversation = typeof waConversations.$inferInsert;

// Registre d'idempotence : un message entrant (id Meta) n'est traité qu'une
// seule fois, même si Meta renvoie le webhook plusieurs fois.
export const waProcessedMessages = pgTable("wa_processed_messages", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type WaProcessedMessage = typeof waProcessedMessages.$inferSelect;
