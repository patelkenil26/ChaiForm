import type { Metadata } from "next";
import { SITE_CONFIG } from "./site-seo.config";

interface CreateMetadataOptions {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
  ogType?: "website" | "article";
  image?: string;
}

/**
 * Universal Metadata Factory for Next.js App Router
 * Ensures every page gets high-ranking Google SEO tags, canonical URL,
 * author authority for Kenil Patel, Twitter cards, and OpenGraph data.
 */
export function createSeoMetadata({
  title,
  description,
  path = "",
  keywords = [],
  noIndex = false,
  ogType = "website",
  image = SITE_CONFIG.images.ogDefault,
}: CreateMetadataOptions): Metadata {
  const canonicalUrl = `${SITE_CONFIG.url}${path}`;
  const allKeywords = Array.from(new Set([...keywords, ...SITE_CONFIG.keywords]));

  return {
    title,
    description,
    keywords: allKeywords,
    authors: [{ name: SITE_CONFIG.author.name, url: SITE_CONFIG.author.url }],
    creator: SITE_CONFIG.author.name,
    publisher: SITE_CONFIG.legalName,
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      type: ogType,
      images: [
        {
          url: image,
          width: SITE_CONFIG.images.ogWidth,
          height: SITE_CONFIG.images.ogHeight,
          alt: `${title} - ChaiForm by Kenil Patel`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: SITE_CONFIG.author.twitter,
      images: [image],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    icons: {
      icon: { url: "/chaiform-logo-transparent-for-dark-bg (3).svg", type: "image/svg+xml" },
      shortcut: "/chaiform-logo-transparent-for-dark-bg (3).svg",
      apple: "/chaiform-logo-transparent-for-dark-bg (3).svg",
    },
    verification: {
      google: SITE_CONFIG.googleSiteVerification,
    },
  };
}

// ----------------------------------------------------------------------
// PRESET PAGE METADATA CONFIGURATIONS
// (Import directly in pages - zero boilerplate or clutter)
// ----------------------------------------------------------------------

/** Root App Metadata with Title Template */
export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: "ChaiForm • Next-Gen Conversational Form Builder",
    template: "%s • ChaiForm",
  },
  description: SITE_CONFIG.description,
  keywords: [...SITE_CONFIG.keywords],
  authors: [{ name: SITE_CONFIG.author.name, url: SITE_CONFIG.author.url }],
  creator: SITE_CONFIG.author.name,
  publisher: SITE_CONFIG.legalName,
  icons: {
    icon: { url: "/chaiform-logo-transparent-for-dark-bg (3).svg", type: "image/svg+xml" },
    shortcut: "/chaiform-logo-transparent-for-dark-bg (3).svg",
    apple: "/chaiform-logo-transparent-for-dark-bg (3).svg",
  },
  verification: {
    google: SITE_CONFIG.googleSiteVerification,
  },
};

/** Homepage (Landing Page) Metadata */
export const homeMetadata: Metadata = createSeoMetadata({
  title: "ChaiForm • Beautiful Conversational Forms & Surveys | by Kenil Patel",
  description:
    "Build fluid conversational forms, surveys, and quizzes with 1-question-at-a-time focus. 14 input field types, instant QR codes, and real-time response analytics. Designed by Kenil Patel.",
  path: "",
  keywords: [
    "chaiform kenil patel",
    "conversational form builder free",
    "typeform alternative open source",
    "google forms alternative modern",
  ],
});

/** Templates Gallery Page Metadata */
export const templatesMetadata: Metadata = createSeoMetadata({
  title: "Conversational Form Templates • ChaiForm",
  description:
    "Explore curated conversational form templates for customer surveys, event RSVPs, feedback collection, job applications, and quizzes. Clone into your account in 1 click.",
  path: "/templates",
  keywords: [
    "free form templates",
    "survey templates",
    "event rsvp template",
    "job application form template",
    "customer feedback template",
  ],
});

/** Pricing Page Metadata */
export const pricingMetadata: Metadata = createSeoMetadata({
  title: "Honest & Transparent Pricing Plans • ChaiForm",
  description:
    "Transparent pricing for creators, marketers, and fast-growing teams. Start free with 250 responses, or unlock unlimited forms and 10,000 responses with Pro.",
  path: "/pricing",
  keywords: [
    "chaiform pricing",
    "typeform alternative cheap",
    "free conversational form builder",
    "pro form builder plan",
  ],
});

/** Sign In Page Metadata (NoIndex to avoid duplicate query noise) */
export const loginMetadata: Metadata = createSeoMetadata({
  title: "Sign In • ChaiForm",
  description:
    "Sign in to your ChaiForm account to create, publish, and manage conversational forms.",
  path: "/login",
  noIndex: true,
});

/** Sign Up Page Metadata */
export const signupMetadata: Metadata = createSeoMetadata({
  title: "Create a Free Account • ChaiForm",
  description:
    "Create your free ChaiForm account in under 60 seconds. Build conversational forms with zero credit card required.",
  path: "/signup",
});

/** Terms of Service Page Metadata */
export const termsMetadata: Metadata = createSeoMetadata({
  title: "Terms of Service • ChaiForm",
  description:
    "Read the Terms of Service governing your use of ChaiForm's conversational form builder.",
  path: "/terms",
});

/** Privacy Policy Page Metadata */
export const privacyMetadata: Metadata = createSeoMetadata({
  title: "Privacy Policy • ChaiForm",
  description:
    "Read ChaiForm's Privacy Policy regarding data protection, response storage, and privacy rights.",
  path: "/privacy",
});

/** Dynamic Form Public Metadata Generator */
export function getPublicFormMetadata(
  formTitle?: string | null,
  formDescription?: string | null,
  slugOrId?: string,
): Metadata {
  const displayTitle = formTitle ? `${formTitle} • ChaiForm` : "Online Form • ChaiForm";
  const displayDesc =
    formDescription ||
    "Complete this conversational form on ChaiForm. Quick, responsive, and mobile-friendly.";
  const path = slugOrId ? `/form/${slugOrId}` : "";

  return createSeoMetadata({
    title: displayTitle,
    description: displayDesc,
    path,
  });
}
