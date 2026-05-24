// Tiny shared-password admin auth.
// One env var (ADMIN_PASSWORD) gates entry; sessions are HMAC-signed cookies
// signed with ADMIN_SESSION_SECRET. Runs on Web Crypto so it works in both
// middleware (edge) and server actions (node).

const COOKIE_NAME = "parvana_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export const ADMIN_COOKIE = COOKIE_NAME;

interface SessionPayload {
  exp: number;
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const b = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let str = "";
  for (let i = 0; i < b.length; i++) str += String.fromCharCode(b[i]);
  return btoa(str).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function fromBase64Url(s: string): Uint8Array<ArrayBuffer> {
  let v = s.replace(/-/g, "+").replace(/_/g, "/");
  while (v.length % 4) v += "=";
  const str = atob(v);
  const out = new Uint8Array(new ArrayBuffer(str.length));
  for (let i = 0; i < str.length; i++) out[i] = str.charCodeAt(i);
  return out;
}

async function getKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 24) {
    throw new Error(
      "ADMIN_SESSION_SECRET must be set (≥ 24 chars). Generate with: openssl rand -hex 32",
    );
  }
  return s;
}

export async function signSession(): Promise<{
  value: string;
  maxAge: number;
}> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload: SessionPayload = { exp };
  const payloadB64 = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const key = await getKey(getSecret());
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payloadB64),
  );
  const value = `${payloadB64}.${toBase64Url(sig)}`;
  return { value, maxAge: SESSION_TTL_SECONDS };
}

export async function verifySession(cookie: string | undefined): Promise<boolean> {
  if (!cookie) return false;
  const [payloadB64, sigB64] = cookie.split(".");
  if (!payloadB64 || !sigB64) return false;
  let secret: string;
  try {
    secret = getSecret();
  } catch {
    return false;
  }
  const key = await getKey(secret);
  let ok = false;
  try {
    ok = await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(sigB64),
      new TextEncoder().encode(payloadB64),
    );
  } catch {
    return false;
  }
  if (!ok) return false;

  try {
    const payload = JSON.parse(
      new TextDecoder().decode(fromBase64Url(payloadB64)),
    ) as SessionPayload;
    return payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function checkPassword(submitted: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  if (submitted.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= submitted.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}
