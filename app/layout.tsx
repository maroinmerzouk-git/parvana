import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { SITE, SITE_URL, SITE_KEYWORDS } from "@/lib/site";
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

const OG_IMAGE = {
  url: "/video/maryam-palaw-poster.jpg",
  width: 1280,
  height: 720,
  alt: "Palaw afghan — plat signature de Parvana, restaurant d'Asie centrale à Nantes",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Parvana — Restaurant d'Asie centrale à Nantes",
    template: "%s · Parvana",
  },
  description: SITE.description,
  keywords: SITE_KEYWORDS,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE_URL }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "restaurant",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    url: SITE_URL,
    title: "Parvana — Restaurant d'Asie centrale à Nantes",
    description: SITE.description,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Parvana — Restaurant d'Asie centrale à Nantes",
    description: SITE.description,
    images: [OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/video/maryam-palaw-poster.jpg",
    apple: "/video/maryam-palaw-poster.jpg",
  },
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#bf5a36",
  colorScheme: "light",
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
