import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { frFR } from "@clerk/localizations";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Parvana — Restaurant afghan à Nantes",
    template: "%s · Parvana",
  },
  description:
    "Cuisine afghane chaleureuse à Nantes. Réservation, menu midi & soir, brunch le week-end.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={frFR}>
      <html lang="fr" className={`${fraunces.variable} ${manrope.variable}`}>
        <body className="min-h-dvh bg-beige text-ink font-body">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
