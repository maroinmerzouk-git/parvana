import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Connexion gestion" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
            Espace gestion
          </p>
          <h1 className="mt-3 font-display text-4xl italic text-ink">
            Parvana
          </h1>
        </div>
        <LoginForm next={next} />
      </div>
    </div>
  );
}
