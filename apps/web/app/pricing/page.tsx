import { LandingNavbar } from "~/components/landing/navbar";
import { LandingFooter } from "~/components/landing/footer";
import { PricingView } from "~/components/pricing/pricing-view";
import { landingTheme } from "~/config/landing-theme";

import { pricingMetadata } from "~/seo";

export const metadata = pricingMetadata;

export default function PricingPage() {
  return (
    <div
      className={`min-h-screen bg-background text-foreground flex flex-col ${landingTheme.selection}`}
    >
      <LandingNavbar />
      <main className="flex-1">
        <PricingView />
      </main>
      <LandingFooter />
    </div>
  );
}
