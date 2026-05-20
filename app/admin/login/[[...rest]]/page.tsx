import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = { title: "Connexion gestion" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[calc(100dvh-3rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
            Espace gestion
          </p>
          <h1 className="mt-3 font-display text-4xl italic text-ink">
            Parvana
          </h1>
        </div>
        <SignIn
          path="/admin/login"
          routing="path"
          signUpUrl="/admin/login"
          forceRedirectUrl="/admin/reservations"
          appearance={{
            variables: {
              colorPrimary: "#B5482A",
              colorBackground: "#F5EBD8",
              colorText: "#2B1F18",
              colorTextSecondary: "#5C4A3E",
              colorInputBackground: "#F5EBD8",
              colorInputText: "#2B1F18",
              colorDanger: "#7A2A1E",
              fontFamily: "var(--font-manrope), system-ui, sans-serif",
              borderRadius: "0.5rem",
            },
            elements: {
              rootBox: "w-full",
              card: "border border-ink/10 bg-beige shadow-none",
              headerTitle: "font-display text-2xl text-ink",
              formButtonPrimary:
                "bg-terracotta hover:bg-terracotta-dark text-beige uppercase tracking-[0.12em] text-sm",
              footer: "hidden",
            },
          }}
        />
      </div>
    </div>
  );
}
