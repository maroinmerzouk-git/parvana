import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * robots.txt — autorise explicitement les moteurs de recherche ET les
 * robots d'IA (OpenAI / ChatGPT, Anthropic / Claude, Google Gemini,
 * Perplexity, etc.) à explorer le site public, tout en bloquant l'espace
 * d'administration et les routes d'API.
 *
 * Les sections "Disallow: /admin, /api" valent pour TOUS les agents grâce
 * à la règle générique (userAgent: "*"). Les robots IA sont listés
 * nominativement pour lever toute ambiguïté : par défaut on les autorise.
 */
const AI_AND_SEARCH_BOTS = [
  // OpenAI
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic (Claude)
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  // Google (Gemini / extended training) + recherche
  "Google-Extended",
  "Googlebot",
  "Googlebot-Image",
  // Microsoft / Bing + Copilot
  "Bingbot",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Autres assistants / moteurs
  "Applebot",
  "Applebot-Extended",
  "Amazonbot",
  "Bytespider",
  "CCBot",
  "cohere-ai",
  "DuckAssistBot",
  "meta-externalagent",
  "YouBot",
];

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/admin", "/admin/", "/api/"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
      ...AI_AND_SEARCH_BOTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
