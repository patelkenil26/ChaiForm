import type { MetadataRoute } from "next";
import { SITE_CONFIG, DISALLOWED_ROBOT_PATHS } from "~/seo";

/**
 * Standard Next.js Metadata Route for /robots.txt
 * Instructs search engine crawlers on allowed and disallowed paths
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/templates", "/pricing", "/form/*", "/terms", "/privacy", "/signup"],
        disallow: DISALLOWED_ROBOT_PATHS,
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/templates", "/pricing", "/form/*", "/terms", "/privacy", "/signup"],
        disallow: DISALLOWED_ROBOT_PATHS,
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  };
}
