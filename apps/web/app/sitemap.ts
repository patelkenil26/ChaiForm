import type { MetadataRoute } from "next";
import { getSitemapEntries } from "~/seo";

/**
 * Standard Next.js Metadata Route for /sitemap.xml
 * Auto-generated and indexed by Google Search Console
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return getSitemapEntries();
}
