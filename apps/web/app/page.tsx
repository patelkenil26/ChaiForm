import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LandingNavbar } from "~/components/landing/navbar";
import { HeroSection } from "~/components/landing/hero";
import { ProductShowcaseSection } from "~/components/landing/product-showcase";
import { ComparisonSection } from "~/components/landing/comparison";
import { UseCasesSection } from "~/components/landing/use-cases";
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
        <ComparisonSection />
        <UseCasesSection />
        <FaqSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
