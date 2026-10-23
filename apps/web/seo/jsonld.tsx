import React from "react";
import { SITE_CONFIG } from "./site-seo.config";

/**
 * Base Helper to serialize JSON-LD into safe script tag
 */
function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}

/**
 * Organization Schema (Brand identity & founder link to Kenil Patel)
 */
export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    legalName: SITE_CONFIG.legalName,
    url: SITE_CONFIG.url,
    logo: SITE_CONFIG.images.logo,
    founder: {
      "@type": "Person",
      name: SITE_CONFIG.author.name,
      url: SITE_CONFIG.author.url,
      jobTitle: SITE_CONFIG.author.role,
      sameAs: [
        SITE_CONFIG.author.url,
        SITE_CONFIG.author.github,
        SITE_CONFIG.author.twitter,
        SITE_CONFIG.author.linkedin,
      ],
    },
    sameAs: [SITE_CONFIG.author.github, SITE_CONFIG.author.url],
  };

  return <JsonLdScript data={schema} />;
}

/**
 * Person Schema (Kenil Patel creator authority for Google Knowledge Graph)
 */
export function PersonAuthorJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_CONFIG.author.name,
    url: SITE_CONFIG.author.url,
    jobTitle: SITE_CONFIG.author.role,
    sameAs: [
      SITE_CONFIG.author.url,
      SITE_CONFIG.author.github,
      SITE_CONFIG.author.twitter,
      SITE_CONFIG.author.linkedin,
    ],
    knowsAbout: [
      "Conversational Form Design",
      "Full Stack Web Development",
      "Next.js 16",
      "React",
      "TypeScript",
      "tRPC",
      "PostgreSQL",
    ],
  };

  return <JsonLdScript data={schema} />;
}

/**
 * SoftwareApplication & WebApplication Schema
 * Direct ranking boost for "Typeform alternative", "form builder", "survey maker"
 */
export function SoftwareAppJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_CONFIG.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "All modern web browsers, iOS Safari, Android Chrome",
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    image: SITE_CONFIG.images.ogDefault,
    creator: {
      "@type": "Person",
      name: SITE_CONFIG.author.name,
      url: SITE_CONFIG.author.url,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      category: "Free Tier Available",
    },
    featureList: [
      "1-Question-at-a-time conversational interface",
      "14 specialized question field types",
      "Instant high-resolution QR code generator",
      "CSV & JSON response export",
      "Password protection for confidential surveys",
      "Response limits & auto-expiry scheduling",
      "Mobile-optimized keyboard first navigation",
      "1-line responsive iframe embeds",
    ],
  };

  return <JsonLdScript data={schema} />;
}

/**
 * FAQPage Schema (Google rich expandable Q&A search results)
 */
export function LandingFaqJsonLd() {
  const faqs = [
    {
      q: "Do respondents need to create an account or sign in?",
      a: "No! Anyone with your form link can view and submit responses instantly on mobile or desktop without any login, signup, or friction.",
    },
    {
      q: "How does ChaiForm compare to Google Forms and Typeform?",
      a: "Google Forms presents tedious, long-scroll walls of text with high drop-off rates. Typeform has fluid UI but restricts basic features behind expensive $29-$99/month paywalls. ChaiForm combines the high conversion rate of conversational 1-question-at-a-time design with generous starter limits, designer QR codes, and transparent pricing.",
    },
    {
      q: "Can I embed ChaiForm on my own website or blog?",
      a: "Yes! Every form generates a 1-line responsive iframe snippet that works seamlessly across Webflow, WordPress, Framer, Next.js, Shopify, or plain HTML websites.",
    },
    {
      q: "What happens when I reach the 250 submission limit on the free Starter tier?",
      a: "Your submissions are never deleted or discarded. Your submission limit automatically resets every 30 days. If your traffic spikes, you will receive an email notification and can upgrade to Pro for 10,000 monthly submissions at any time.",
    },
    {
      q: "Can I export my responses to Excel or Google Sheets?",
      a: "Yes. In your dashboard response inbox, you can export all submissions with one click as CSV (compatible with Google Sheets, Microsoft Excel, and Apple Numbers) or raw JSON.",
    },
    {
      q: "Can I password-protect sensitive surveys or internal forms?",
      a: "Yes. You can lock any form with a secure password. Respondents must enter the correct passcode before questions are revealed, making it ideal for internal company surveys and private beta programs.",
    },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return <JsonLdScript data={schema} />;
}

/**
 * WebSite Schema with Sitelinks SearchBox Capability
 */
export function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    alternateName: ["ChaiForm Builder", "ChaiForm Kenil Patel"],
    url: SITE_CONFIG.url,
  };

  return <JsonLdScript data={schema} />;
}
