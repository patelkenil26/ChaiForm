import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LandingNavbar } from "~/components/landing/navbar";
import { HeroSection } from "~/components/landing/hero";
import { ProductShowcaseSection } from "~/components/landing/product-showcase";
import { LiveDemoSection } from "~/components/landing/live-demo";
import { UseCasesSection } from "~/components/landing/use-cases";
import { FeaturesBentoSection } from "~/components/landing/features-bento";
import { IntegrationsSection } from "~/components/landing/integrations-section";
import { ComparisonSection } from "~/components/landing/comparison";
import { TemplatesSection } from "~/components/landing/templates-section";
import { FaqSection } from "~/components/landing/faq-section";
import { CtaSection } from "~/components/landing/cta-section";
import { LandingFooter } from "~/components/landing/footer";
import { landingTheme } from "~/config/landing-theme";

export const metadata = {
  title: "ChaiForm • Beautiful Conversational Forms & Surveys",
  description:
    "Build fluid conversational forms, surveys, and quizzes with 1-question-at-a-time focus. 14 field types, instant QR codes, and real-time response analytics.",
  openGraph: {
    title: "ChaiForm • Beautiful Conversational Forms & Surveys",
    description:
      "Build fluid conversational forms with 1-question-at-a-time focus. 14 field types, instant QR codes, and real-time response analytics.",
    url: "https://chaiform.kenilpatel.in",
    siteName: "ChaiForm",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChaiForm • Beautiful Conversational Forms & Surveys",
    description:
      "Build fluid conversational forms with 1-question-at-a-time focus. 14 field types, instant QR codes, and real-time response analytics.",
  },
};

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authentication-token")?.value;
  if (token) {
    redirect("/dashboard");
  }

  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col ${landingTheme.selection}`}>
      <LandingNavbar />
      <main className="flex-1">
        <HeroSection />
        <ProductShowcaseSection />
        <LiveDemoSection />
        <UseCasesSection />
        <FeaturesBentoSection />
        <IntegrationsSection />
        <ComparisonSection />
        <TemplatesSection />
        <FaqSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}

