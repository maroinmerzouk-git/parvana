import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { SITE_URL } from "@/lib/site";
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
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="min-h-dvh bg-beige text-ink font-body">
        {children}
      </body>
    </html>
  );
}
