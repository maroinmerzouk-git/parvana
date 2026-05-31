import { NextResponse } from "next/server";
import { lt } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";
// Toujours exécuté à la demande (déclenché par Vercel Cron), jamais mis en cache.
export const dynamic = "force-dynamic";

/**
 * Purge RGPD — supprime les demandes (réservations + traiteur) dont la date
 * de réception dépasse la durée de conservation déclarée dans la politique de
 * confidentialité (SITE.legal.retentionMonths).
 *
 * Déclenché par Vercel Cron (voir vercel.json). Protégé par CRON_SECRET :
 * Vercel ajoute automatiquement l'en-tête « Authorization: Bearer <secret> »
 * aux requêtes de cron lorsque la variable d'environnement est définie.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET non configuré sur le serveur." },
      { status: 500 },
    );
  }
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Date limite : maintenant moins la durée de conservation.
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - SITE.legal.retentionMonths);

  try {
    const db = getDb();

    const deletedReservations = await db
      .delete(schema.reservations)
      .where(lt(schema.reservations.createdAt, cutoff))
      .returning({ id: schema.reservations.id });

    const deletedCatering = await db
      .delete(schema.cateringRequests)
      .where(lt(schema.cateringRequests.createdAt, cutoff))
      .returning({ id: schema.cateringRequests.id });

    const result = {
      ok: true,
      cutoff: cutoff.toISOString(),
      retentionMonths: SITE.legal.retentionMonths,
      deletedReservations: deletedReservations.length,
      deletedCatering: deletedCatering.length,
    };
    console.log("[cron/cleanup]", result);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[cron/cleanup] échec:", err);
    return NextResponse.json(
      { error: "Échec de la purge des données." },
      { status: 500 },
    );
  }
}
