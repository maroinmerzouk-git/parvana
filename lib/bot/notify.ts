import "server-only";
import { adminAddress, fromAddress, getResend } from "@/lib/email/resend";
import {
  orderAdminNotificationEmail,
  type OrderEmailData,
} from "@/lib/email/order-templates";

/** Notifie l'équipe d'une nouvelle commande par email (Resend). Échoue en
 * silence (log) : l'échec d'email ne doit jamais bloquer la confirmation. */
export async function notifyNewOrder(data: OrderEmailData): Promise<void> {
  try {
    const resend = getResend();
    const to = adminAddress();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const adminUrl = `${siteUrl.replace(/\/$/, "")}/admin/commandes`;
    const { subject, html } = orderAdminNotificationEmail(data, adminUrl);
    const res = await resend.emails.send({
      from: fromAddress(),
      to,
      subject,
      html,
    });
    if (res.error) console.error("[orders] email admin:", res.error);
  } catch (err) {
    console.error("[orders] notifyNewOrder échec:", err);
  }
}
