import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { cateringSchema } from "@/lib/schemas/catering";
import {
  adminAddress,
  fromAddress,
  getResend,
} from "@/lib/email/resend";
import {
  cateringAdminNotificationEmail,
  cateringClientReceivedEmail,
} from "@/lib/email/catering-templates";

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

  const parsed = cateringSchema.safeParse(payload);
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
    console.error("[catering] DB not configured:", err);
    return NextResponse.json(
      {
        error:
          "Le service traiteur n'est pas encore actif. Merci d'appeler le 06 22 64 32 53.",
      },
      { status: 503 },
    );
  }

  let insertedId: string;
  try {
    const [row] = await db
      .insert(schema.cateringRequests)
      .values({
        name: data.name,
        email: data.email,
        phone: data.phone,
        eventDate: data.eventDate,
        eventType: data.eventType,
        partySize: data.partySize,
        budget: data.budget?.trim() ? data.budget.trim() : null,
        message: data.message?.trim() ? data.message.trim() : null,
      })
      .returning({ id: schema.cateringRequests.id });
    insertedId = row.id;
  } catch (err) {
    console.error("[catering] insert failed:", err);
    return NextResponse.json(
      {
        error:
          "Impossible d'enregistrer la demande. Merci de réessayer ou d'appeler le 06 22 64 32 53.",
      },
      { status: 500 },
    );
  }

  let resend: ReturnType<typeof getResend> | null = null;
  let adminTo = "";
  try {
    resend = getResend();
    adminTo = adminAddress();
  } catch (err) {
    console.error("[catering] email service not configured:", err);
  }

  if (resend && adminTo) {
    const from = fromAddress();
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const adminUrl = `${siteUrl.replace(/\/$/, "")}/admin/catering`;

    const clientMail = cateringClientReceivedEmail(data);
    const adminMail = cateringAdminNotificationEmail(data, adminUrl);

    const [clientRes, adminRes] = await Promise.allSettled([
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
        subject: adminMail.subject,
        html: adminMail.html,
      }),
    ]);

    const clientOk =
      clientRes.status === "fulfilled" && !clientRes.value.error;
    const adminOk =
      adminRes.status === "fulfilled" && !adminRes.value.error;

    if (!clientOk) console.error("[catering] client email:", clientRes);
    if (!adminOk) console.error("[catering] admin email:", adminRes);

    if (clientOk) {
      try {
        await db
          .update(schema.cateringRequests)
          .set({ clientEmailSent: true })
          .where(eq(schema.cateringRequests.id, insertedId));
      } catch (err) {
        console.error("[catering] email-flag update failed:", err);
      }
    }
  }

  return NextResponse.json({ ok: true, id: insertedId }, { status: 201 });
}
