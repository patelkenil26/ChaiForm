import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "~/seo";

/**
 * Standard Next.js Web App Manifest Route for /manifest.webmanifest
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ChaiForm • Conversational Form Builder",
    short_name: "ChaiForm",
    description: SITE_CONFIG.description,
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: SITE_CONFIG.themeColor,
    icons: [
      {
        src: "/chaiform-logo-transparent-for-dark-bg (3).svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
