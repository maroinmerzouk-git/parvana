/**
 * Test helper — confirme les réservations pending qui ont un email envoyable
 * (sandbox Resend = compte propriétaire uniquement).
 * Bypass de l'auth Clerk pour test E2E only.
 *
 * Reproduit confirmReservation() de app/admin/actions.ts.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import * as schema from "../db/schema";
import { clientConfirmationEmail } from "../lib/email/templates";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });
  const resend = new Resend(process.env.RESEND_API_KEY!);
  const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const adminTo = process.env.ADMIN_EMAIL!;

  const pending = await db
    .select()
    .from(schema.reservations)
    .where(eq(schema.reservations.status, "pending"));

  console.log(`Found ${pending.length} pending reservations to confirm.\n`);

  for (const r of pending) {
    console.log(`→ Confirming ${r.name} (${r.email}) for ${r.date} ${r.arrivalTime}…`);

    // 1. Update DB (status, seen_at, status_changed_at)
    await db
      .update(schema.reservations)
      .set({
        status: "confirmed",
        statusChangedAt: new Date(),
        seenAt: new Date(),
      })
      .where(eq(schema.reservations.id, r.id));

    // 2. Send confirmation email to client
    const { subject, html } = clientConfirmationEmail({
      name: r.name,
      email: r.email,
      phone: r.phone,
      date: r.date,
      service: r.service as "midi" | "soir",
      arrivalTime: r.arrivalTime,
      partySize: r.partySize,
      message: r.message,
    });

    const result = await resend.emails.send({
      from,
      to: r.email,
      replyTo: adminTo,
      subject,
      html,
    });

    const ok = !result.error;
    console.log(
      ok
        ? `  ✓ Email confirmation envoyé (id=${result.data?.id})`
        : `  ✗ Email FAILED: ${JSON.stringify(result.error)}`,
    );

    if (ok) {
      await db
        .update(schema.reservations)
        .set({ confirmationEmailSent: true })
        .where(eq(schema.reservations.id, r.id));
    }
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
