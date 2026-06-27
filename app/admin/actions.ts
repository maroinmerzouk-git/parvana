"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema } from "@/db";
import { ADMIN_COOKIE, verifySession } from "@/lib/admin-auth";
import {
  adminAddress,
  fromAddress,
  getResend,
} from "@/lib/email/resend";
import {
  clientConfirmationEmail,
  clientRejectionEmail,
} from "@/lib/email/templates";
import { menuSchema } from "@/lib/schemas/menu";
import { associationSettingsSchema } from "@/lib/schemas/association";
import { ASSOCIATION_SETTINGS_KEY } from "@/lib/association";
import { openingHoursSchema } from "@/lib/schemas/hours";
import { OPENING_HOURS_SETTINGS_KEY } from "@/lib/hours";

const idSchema = z.string().uuid();
const rejectSchema = z.object({
  id: z.string().uuid(),
  message: z.string().trim().max(500).optional(),
});

async function requireAuth(): Promise<string> {
  const jar = await cookies();
  const cookie = jar.get(ADMIN_COOKIE)?.value;
  if (!(await verifySession(cookie))) {
    throw new Error("Non authentifié");
  }
  return "admin";
}

type Reservation = typeof schema.reservations.$inferSelect;

function emailDataFrom(r: Reservation) {
  return {
    name: r.name,
    email: r.email,
    phone: r.phone,
    date: r.date,
    service: r.service as "midi" | "soir",
    arrivalTime: r.arrivalTime,
    partySize: r.partySize,
    message: r.message,
  };
}

export async function confirmReservation(rawId: string) {
  await requireAuth();
  const id = idSchema.parse(rawId);
  const db = getDb();

  const [row] = await db
    .update(schema.reservations)
    .set({
      status: "confirmed",
      statusChangedAt: new Date(),
      seenAt: new Date(),
    })
    .where(eq(schema.reservations.id, id))
    .returning();

  if (!row) return { ok: false, error: "Réservation introuvable" };

  let emailOk = false;
  try {
    const resend = getResend();
    const { subject, html } = clientConfirmationEmail(emailDataFrom(row));
    const result = await resend.emails.send({
      from: fromAddress(),
      to: row.email,
      replyTo: adminAddress(),
      subject,
      html,
    });
    emailOk = !result.error;
    if (!emailOk) console.error("[confirm] email error:", result.error);
  } catch (err) {
    console.error("[confirm] email send failed:", err);
  }

  if (emailOk) {
    await db
      .update(schema.reservations)
      .set({ confirmationEmailSent: true })
      .where(eq(schema.reservations.id, id));
  }

  revalidatePath("/admin/reservations");
  return { ok: true, emailSent: emailOk };
}

export async function rejectReservation(formData: FormData) {
  await requireAuth();
  const parsed = rejectSchema.parse({
    id: formData.get("id"),
    message: formData.get("message"),
  });
  const db = getDb();

  const [row] = await db
    .update(schema.reservations)
    .set({
      status: "rejected",
      statusChangedAt: new Date(),
      seenAt: new Date(),
      rejectionMessage: parsed.message?.trim() || null,
    })
    .where(eq(schema.reservations.id, parsed.id))
    .returning();

  if (!row) return { ok: false, error: "Réservation introuvable" };

  let emailOk = false;
  try {
    const resend = getResend();
    const { subject, html } = clientRejectionEmail(
      emailDataFrom(row),
      parsed.message,
    );
    const result = await resend.emails.send({
      from: fromAddress(),
      to: row.email,
      replyTo: adminAddress(),
      subject,
      html,
    });
    emailOk = !result.error;
    if (!emailOk) console.error("[reject] email error:", result.error);
  } catch (err) {
    console.error("[reject] email send failed:", err);
  }

  if (emailOk) {
    await db
      .update(schema.reservations)
      .set({ rejectionEmailSent: true })
      .where(eq(schema.reservations.id, parsed.id));
  }

  revalidatePath("/admin/reservations");
  return { ok: true, emailSent: emailOk };
}

export async function markSeen(rawId: string) {
  await requireAuth();
  const id = idSchema.parse(rawId);
  const db = getDb();

  await db
    .update(schema.reservations)
    .set({ seenAt: new Date() })
    .where(eq(schema.reservations.id, id));

  revalidatePath("/admin/reservations");
  return { ok: true };
}

type SaveMenuResult =
  | { ok: true; version: number }
  | { ok: false; error: string; details?: unknown };

export async function saveMenu(rawJson: string): Promise<SaveMenuResult> {
  const userId = await requireAuth();

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawJson);
  } catch (err) {
    return {
      ok: false,
      error: `JSON invalide : ${(err as Error).message}`,
    };
  }

  const validated = menuSchema.safeParse(parsedJson);
  if (!validated.success) {
    return {
      ok: false,
      error: "Le menu ne respecte pas le schéma attendu.",
      details: validated.error.flatten(),
    };
  }

  const db = getDb();
  const [row] = await db
    .insert(schema.menus)
    .values({
      data: validated.data,
      createdBy: userId,
    })
    .returning({ version: schema.menus.version });

  revalidatePath("/menu");
  revalidatePath("/admin/menu");
  return { ok: true, version: row.version };
}

type SaveAssociationResult =
  | { ok: true }
  | { ok: false; error: string; details?: unknown };

export async function saveAssociationSettings(
  raw: unknown,
): Promise<SaveAssociationResult> {
  const userId = await requireAuth();

  const validated = associationSettingsSchema.safeParse(raw);
  if (!validated.success) {
    return {
      ok: false,
      error: "Les réglages ne respectent pas le format attendu.",
      details: validated.error.flatten(),
    };
  }

  const { startDate, endDate } = validated.data.ateliers;
  if (startDate && endDate && startDate > endDate) {
    return {
      ok: false,
      error: "La date de début doit précéder la date de fin.",
    };
  }

  const db = getDb();
  await db
    .insert(schema.siteSettings)
    .values({
      key: ASSOCIATION_SETTINGS_KEY,
      data: validated.data,
      updatedBy: userId,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: schema.siteSettings.key,
      set: { data: validated.data, updatedBy: userId, updatedAt: new Date() },
    });

  revalidatePath("/association");
  revalidatePath("/admin/association");
  return { ok: true };
}

type SaveOpeningHoursResult =
  | { ok: true }
  | { ok: false; error: string; details?: unknown };

export async function saveOpeningHours(
  raw: unknown,
): Promise<SaveOpeningHoursResult> {
  const userId = await requireAuth();

  const validated = openingHoursSchema.safeParse(raw);
  if (!validated.success) {
    return {
      ok: false,
      error: "Les horaires ne respectent pas le format attendu.",
      details: validated.error.flatten(),
    };
  }

  const db = getDb();
  await db
    .insert(schema.siteSettings)
    .values({
      key: OPENING_HOURS_SETTINGS_KEY,
      data: validated.data,
      updatedBy: userId,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: schema.siteSettings.key,
      set: { data: validated.data, updatedBy: userId, updatedAt: new Date() },
    });

  revalidatePath("/contact");
  revalidatePath("/admin/horaires");
  return { ok: true };
}

export async function markCateringSeen(rawId: string) {
  await requireAuth();
  const id = idSchema.parse(rawId);
  const db = getDb();

  await db
    .update(schema.cateringRequests)
    .set({ status: "seen", seenAt: new Date() })
    .where(eq(schema.cateringRequests.id, id));

  revalidatePath("/admin/catering");
  return { ok: true };
}

export async function archiveCateringRequest(rawId: string) {
  await requireAuth();
  const id = idSchema.parse(rawId);
  const db = getDb();

  await db
    .update(schema.cateringRequests)
    .set({ status: "archived", seenAt: new Date() })
    .where(eq(schema.cateringRequests.id, id));

  revalidatePath("/admin/catering");
  return { ok: true };
}
