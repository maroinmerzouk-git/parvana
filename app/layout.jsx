import { Cormorant_Garamond, Manrope, Vazirmatn } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-manrope',
});

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-vazirmatn',
});

export const metadata = {
  title: "Parvana — Cuisine d'Afghanistan & d'Asie Centrale · Nantes",
  description:
    "Parvana — cantine afghane et d'Asie Centrale sur l'Île de Nantes. Tradition · Création · Saveur. Une cuisine portée par Maryam.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${manrope.variable} ${vazirmatn.variable}`}>
      <body>{children}</body>
    </html>
  );
}
