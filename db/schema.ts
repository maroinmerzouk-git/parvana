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
