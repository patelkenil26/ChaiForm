import { SITE_CONFIG } from "./site-seo.config";

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
}

/**
 * Public Indexable Route Definitions for Sitemap & Search Engines
 */
export const PUBLIC_ROUTES: Array<{
  path: string;
  changeFrequency: SitemapEntry["changeFrequency"];
  priority: number;
}> = [
  {
    path: "",
    changeFrequency: "daily",
    priority: 1.0, // Primary homepage
  },
  {
    path: "/templates",
    changeFrequency: "daily",
    priority: 0.9, // High commercial intent
  },
  {
    path: "/pricing",
    changeFrequency: "weekly",
    priority: 0.9, // High transactional intent
  },
  {
    path: "/signup",
    changeFrequency: "monthly",
    priority: 0.8, // User acquisition
  },
  {
    path: "/terms",
    changeFrequency: "yearly",
    priority: 0.4, // Legal documentation
  },
  {
    path: "/privacy",
    changeFrequency: "yearly",
    priority: 0.4, // Legal documentation
  },
];

/**
 * Disallowed Routes (Internal dashboard workspaces & private user API endpoints)
 */
export const DISALLOWED_ROBOT_PATHS = [
  "/dashboard",
  "/dashboard/*",
  "/forms/*",
  "/submissions",
  "/submissions/*",
  "/api/*",
  "/login",
  "/forgot-password",
  "/reset-password",
];

/**
 * Generate full sitemap entries with canonical site base URL
 */
export function getSitemapEntries(): SitemapEntry[] {
  const now = new Date();
  return PUBLIC_ROUTES.map((route) => ({
    url: `${SITE_CONFIG.url}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
