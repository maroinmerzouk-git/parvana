import { Resend } from "resend";

let cached: Resend | null = null;

export function getResend(): Resend {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error(
      "RESEND_API_KEY is not set. Create a Resend account and add the key to .env.local. See README.",
    );
  }
  cached = new Resend(key);
  return cached;
}

export function fromAddress(): string {
  return process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
}

export function adminAddress(): string {
  const addr = process.env.ADMIN_EMAIL;
  if (!addr) {
    throw new Error(
      "ADMIN_EMAIL is not set. This is the address Maryam receives notifications on.",
    );
  }
  return addr;
}
