import type { MetadataRoute } from "next";
import { SITE_CONFIG, DISALLOWED_ROBOT_PATHS } from "~/seo";

/**
 * Standard Next.js Metadata Route for /robots.txt
 * Instructs search engine crawlers & AI search agents on allowed paths
 */
export default function robots(): MetadataRoute.Robots {
  const publicAllowedPaths = [
    "/",
    "/features",
    "/integrations",
    "/pricing",
    "/form/*",
    "/terms",
    "/privacy",
    "/signup",
    "/llms.txt",
    "/llms-full.txt",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: publicAllowedPaths,
        disallow: DISALLOWED_ROBOT_PATHS,
      },
      {
        userAgent: "Googlebot",
        allow: publicAllowedPaths,
        disallow: DISALLOWED_ROBOT_PATHS,
      },
      // Explicit AI Search Engine Agents (Google AI Overviews, Perplexity, ChatGPT Search, Claude)
      {
        userAgent: [
          "Google-Extended",
          "GPTBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "anthropic-ai",
          "cohere-ai",
          "CCBot",
        ],
        allow: publicAllowedPaths,
        disallow: DISALLOWED_ROBOT_PATHS,
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  };
}
