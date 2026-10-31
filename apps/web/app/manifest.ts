import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "~/seo";

/**
 * Standard Next.js Web App Manifest Route for /manifest.webmanifest
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "https://chaiform.kenilpatel.in",
    name: "ChaiForm • Conversational Form Builder",
    short_name: "ChaiForm",
    description: SITE_CONFIG.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#09090b",
    theme_color: SITE_CONFIG.themeColor,
    lang: "en",
    dir: "ltr",
    categories: ["business", "productivity", "utilities"],
    icons: [
      {
        src: "/logo/chaiform-logo-dark-mode.png",
        sizes: "192x192 512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo/chaiform-logo-dark-mode.png",
        sizes: "192x192 512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
