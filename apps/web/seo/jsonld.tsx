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
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: SITE_CONFIG.author.email,
      url: SITE_CONFIG.url,
      availableLanguage: ["English", "Hindi"],
    },
    knowsAbout: [
      "Conversational Form Design",
      "Online Surveys",
      "Interactive Quizzes",
      "Typeform Alternative",
      "Lead Generation",
    ],
    sameAs: [
      SITE_CONFIG.author.github,
      SITE_CONFIG.author.url,
      SITE_CONFIG.author.twitter,
      SITE_CONFIG.author.linkedin,
    ],
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
 * Formatted for Google Knowledge Graph & AI Mode reasoning entities
 */
export function SoftwareAppJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_CONFIG.name,
    alternateName: [
      "Chai Forms",
      "ChaiForm Builder",
      "ChaiForm by Kenil Patel",
      "Typeform Alternative ChaiForm",
    ],
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Conversational Form & Survey Builder",
    operatingSystem: "All modern web browsers, iOS Safari, Android Chrome",
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    image: SITE_CONFIG.images.ogDefault,
    author: {
      "@type": "Person",
      name: SITE_CONFIG.author.name,
      url: SITE_CONFIG.author.url,
      sameAs: [
        SITE_CONFIG.author.url,
        SITE_CONFIG.author.github,
        SITE_CONFIG.author.twitter,
        SITE_CONFIG.author.linkedin,
      ],
    },
    creator: {
      "@type": "Person",
      name: SITE_CONFIG.author.name,
      url: SITE_CONFIG.author.url,
    },
    isSimilarTo: [
      {
        "@type": "SoftwareApplication",
        name: "Typeform",
        url: "https://www.typeform.com",
      },
      {
        "@type": "SoftwareApplication",
        name: "Google Forms",
        url: "https://docs.google.com/forms",
      },
      {
        "@type": "SoftwareApplication",
        name: "Tally",
        url: "https://tally.so",
      },
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      category: "Free Tier Available",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "128",
      bestRating: "5",
      worstRating: "1",
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
 * FAQPage Schema (Google rich expandable Q&A search results & AI Answer Retrieval)
 */
export function LandingFaqJsonLd() {
  const faqs = [
    {
      q: "What is ChaiForm?",
      a: "ChaiForm is an open, high-converting conversational form, survey, and quiz builder created by Kenil Patel. Unlike traditional static forms that display long lists of questions, ChaiForm presents one question at a time with smooth transitions, yielding significantly higher completion and conversion rates. It is designed as a fast, accessible, and generous alternative to Typeform and Google Forms.",
    },
    {
      q: "Who created ChaiForm?",
      a: "ChaiForm was created and engineered by full-stack developer Kenil Patel (https://kenilpatel.in). It was built to solve the frustration of expensive form paywalls and clunky user interfaces by offering a modern, accessible conversational form experience.",
    },
    {
      q: "Is ChaiForm a free alternative to Typeform?",
      a: "Yes. ChaiForm offers a 100% free Starter tier with unlimited forms, 14 field types, instant QR codes, and 250 monthly submissions with zero credit card required, making it an ideal modern alternative to Typeform's restrictive $29+/month paywalls and Google Forms' static design.",
    },
    {
      q: "How does ChaiForm compare to Google Forms and Typeform?",
      a: "Google Forms presents tedious, long-scroll walls of text with high drop-off rates. Typeform has fluid UI but restricts basic features behind expensive $29-$99/month paywalls. ChaiForm combines the high conversion rate of conversational 1-question-at-a-time design with generous starter limits, designer QR codes, and transparent pricing.",
    },
    {
      q: "Do respondents need to create an account or sign in?",
      a: "No! Anyone with your form link can view and submit responses instantly on mobile or desktop without any login, signup, or friction.",
    },
    {
      q: "Can I embed ChaiForm on my own website or blog?",
      a: "Yes! Every form generates a 1-line responsive iframe snippet that works seamlessly across Webflow, WordPress, Framer, Next.js, Shopify, or plain HTML websites.",
    },
    {
      q: "Can I password-protect sensitive surveys or internal forms?",
      a: "Yes. You can lock any form with a secure password. Respondents must enter the correct passcode before questions are revealed, making it ideal for internal company surveys and private beta programs.",
    },
    {
      q: "Can I export my responses to Excel or Google Sheets?",
      a: "Yes. In your dashboard response inbox, you can export all submissions with one click as CSV (compatible with Google Sheets, Microsoft Excel, and Apple Numbers) or raw JSON.",
    },
    {
      q: "What happens when I reach the 250 submission limit on the free Starter tier?",
      a: "Your submissions are never deleted or discarded. Your submission limit automatically resets every 30 days. If your traffic spikes, you will receive an email notification and can upgrade to Pro for 10,000 monthly submissions at any time.",
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

/**
 * BreadcrumbList Schema (Rich navigational hierarchy in Google SERPs)
 */
export function BreadcrumbJsonLd({ items }: { items: Array<{ name: string; path: string }> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.path}`,
    })),
  };

  return <JsonLdScript data={schema} />;
}

/**
 * Pricing Product & Offer Schema for /pricing
 */
export function PricingProductJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "ChaiForm Conversational Form Builder",
    description:
      "Conversational form and survey builder with 1-question-at-a-time focus, QR codes, and real-time response analytics.",
    brand: {
      "@type": "Brand",
      name: SITE_CONFIG.name,
    },
    offers: [
      {
        "@type": "Offer",
        name: "Starter Tier (Free Forever)",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: `${SITE_CONFIG.url}/pricing`,
        description:
          "Unlimited forms, 14 field types, up to 250 responses per month, QR codes, and CSV export.",
      },
      {
        "@type": "Offer",
        name: "Pro Tier",
        price: "19",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "19",
          priceCurrency: "USD",
          unitCode: "MON",
        },
        availability: "https://schema.org/InStock",
        url: `${SITE_CONFIG.url}/pricing`,
        description:
          "Unlimited forms, 10,000 responses per month, webhooks, password protection, and priority support.",
      },
    ],
  };

  return <JsonLdScript data={schema} />;
}

/**
 * Templates CollectionPage & ItemList Schema for /templates
 */
export function TemplatesCollectionJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "ChaiForm Conversational Form Templates",
    description:
      "Curated collection of conversational form templates for customer feedback, event RSVPs, job applications, and quizzes.",
    url: `${SITE_CONFIG.url}/templates`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Customer Satisfaction Survey Template",
          description:
            "Measure CSAT and gather actionable feedback with conversational 1-at-a-time pacing.",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Event RSVP & Registration Template",
          description:
            "Collect attendee information, dietary requirements, and guest counts seamlessly.",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Job Application & Candidate Intake Template",
          description: "Screen candidates, collect portfolios, and capture contact details.",
        },
        {
          "@type": "ListItem",
          position: 4,
          name: "Interactive Lead Capture Quiz Template",
          description:
            "High-converting lead qualification questionnaire with instant response capture.",
        },
      ],
    },
  };

  return <JsonLdScript data={schema} />;
}
