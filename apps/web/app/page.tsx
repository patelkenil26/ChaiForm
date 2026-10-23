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

import { homeMetadata, SoftwareAppJsonLd, LandingFaqJsonLd } from "~/seo";

export const metadata = homeMetadata;

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authentication-token")?.value;
  if (token) {
    redirect("/dashboard");
  }

  return (
    <div
      className={`min-h-screen bg-background text-foreground flex flex-col ${landingTheme.selection}`}
    >
      <SoftwareAppJsonLd />
      <LandingFaqJsonLd />
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
