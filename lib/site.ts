/**
 * URL canonique du site, sans slash final.
 * Fallback vers le domaine de production si NEXT_PUBLIC_SITE_URL est absent ou vide.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://parvanarestaurant.com"
).replace(/\/$/, "");
