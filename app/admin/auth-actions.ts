"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  checkPassword,
  signSession,
} from "@/lib/admin-auth";

export interface LoginState {
  ok: boolean;
  error?: string;
}

const SAFE_NEXT = /^\/admin(\/[\w\-/]*)?$/;

export async function loginAdmin(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  const rawNext = String(formData.get("next") ?? "");

  if (!password) {
    return { ok: false, error: "Mot de passe requis." };
  }
  if (!checkPassword(password)) {
    return { ok: false, error: "Mot de passe incorrect." };
  }

  let session: { value: string; maxAge: number };
  try {
    session = await signSession();
  } catch (err) {
    console.error("[admin-auth] signSession failed:", err);
    return {
      ok: false,
      error:
        "Le serveur n'est pas configuré (ADMIN_SESSION_SECRET manquant).",
    };
  }

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, session.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: session.maxAge,
  });

  const next = rawNext && SAFE_NEXT.test(rawNext) ? rawNext : "/admin/reservations";
  redirect(next);
}

export async function logoutAdmin() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}
