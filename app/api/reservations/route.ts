import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { reservationSchema } from "@/lib/schemas/reservation";
import {
  adminAddress,
  fromAddress,
  getResend,
} from "@/lib/email/resend";
import {
  clientReceivedEmail,
  maryamNotificationEmail,
} from "@/lib/email/templates";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Requête JSON invalide" },
      { status: 400 },
    );
  }

  const parsed = reservationSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation échouée",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }
  const data = parsed.data;

  let db: ReturnType<typeof getDb>;
  try {
    db = getDb();
  } catch (err) {
    console.error("[reservations] DB not configured:", err);
    return NextResponse.json(
      {
        error:
          "Le service de réservation n'est pas encore actif. Merci d'appeler le 06 22 64 32 53.",
      },
      { status: 503 },
    );
  }

  let insertedId: string;
  try {
    const [row] = await db
      .insert(schema.reservations)
      .values({
        name: data.name,
        email: data.email,
        phone: data.phone,
        date: data.date,
        service: data.service,
        arrivalTime: data.arrivalTime,
        partySize: data.partySize,
        message: data.message?.trim() ? data.message.trim() : null,
      })
      .returning({ id: schema.reservations.id });
    insertedId = row.id;
  } catch (err) {
    console.error("[reservations] insert failed:", err);
    return NextResponse.json(
      {
        error:
          "Impossible d'enregistrer la demande. Merci de réessayer ou d'appeler le 06 22 64 32 53.",
      },
      { status: 500 },
    );
  }

  // Emails — best-effort. We don't fail the request if emails fail; we just log
  // and reflect the failure in DB so Maryam can see what's missing.
  let resend: ReturnType<typeof getResend> | null = null;
  let adminTo = "";
  try {
    resend = getResend();
    adminTo = adminAddress();
  } catch (err) {
    console.error("[reservations] email service not configured:", err);
  }

  if (resend && adminTo) {
    const from = fromAddress();
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const adminUrl = `${siteUrl.replace(/\/$/, "")}/admin/reservations`;

    const clientMail = clientReceivedEmail(data);
    const maryamMail = maryamNotificationEmail(data, adminUrl);

    const [clientRes, maryamRes] = await Promise.allSettled([
      resend.emails.send({
        from,
        to: data.email,
        subject: clientMail.subject,
        html: clientMail.html,
      }),
      resend.emails.send({
        from,
        to: adminTo,
        replyTo: data.email,
        subject: maryamMail.subject,
        html: maryamMail.html,
      }),
    ]);

    const clientOk =
      clientRes.status === "fulfilled" && !clientRes.value.error;
    const adminOk =
      maryamRes.status === "fulfilled" && !maryamRes.value.error;

    if (!clientOk) console.error("[reservations] client email:", clientRes);
    if (!adminOk) console.error("[reservations] admin email:", maryamRes);

    if (clientOk || adminOk) {
      try {
        await db
          .update(schema.reservations)
          .set({
            clientEmailSent: clientOk,
          })
          .where(eq(schema.reservations.id, insertedId));
      } catch (err) {
        console.error("[reservations] email-flag update failed:", err);
      }
    }
  }

  return NextResponse.json({ ok: true, id: insertedId }, { status: 201 });
}
