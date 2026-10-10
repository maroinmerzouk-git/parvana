import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Vérifie l'en-tête `X-Hub-Signature-256` de Meta : HMAC-SHA256 du corps brut
 * (bytes exacts reçus) avec le secret de l'app. Échoue en cas d'absence ou de
 * mauvaise signature. En dev sans `WHATSAPP_APP_SECRET`, on ignore le contrôle
 * (avec avertissement) pour simplifier les tests locaux.
 */
export function verifySignature(
  rawBody: string,
  signatureHeader: string | null,
): boolean {
  const secret = process.env.WHATSAPP_APP_SECRET;
  if (!secret) {
    console.warn(
      "[wa] WHATSAPP_APP_SECRET absent — contrôle de signature ignoré (dev uniquement).",
    );
    return true;
  }
  if (!signatureHeader || !signatureHeader.startsWith("sha256=")) return false;

  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest();
  let received: Buffer;
  try {
    received = Buffer.from(signatureHeader.slice("sha256=".length), "hex");
  } catch {
    return false;
  }
  if (received.length !== expected.length) return false;
  return timingSafeEqual(received, expected);
}
