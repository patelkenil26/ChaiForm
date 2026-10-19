import { LandingNavbar } from "~/components/landing/navbar";
import { LandingFooter } from "~/components/landing/footer";
import { PricingView } from "~/components/pricing/pricing-view";
import { landingTheme } from "~/config/landing-theme";

export const metadata = {
  title: "Pricing Plans & Features • ChaiForm",
  description:
    "Transparent pricing for creators, marketers, and fast-growing teams. Start free with 250 responses, or unlock unlimited forms and 10,000 responses with Pro.",
  openGraph: {
    title: "Pricing Plans & Features • ChaiForm",
    description:
      "Transparent pricing for creators, marketers, and fast-growing teams. Start free with 250 responses, or unlock unlimited forms and 10,000 responses with Pro.",
    url: "https://chaiform.kenilpatel.in/pricing",
    siteName: "ChaiForm",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing Plans & Features • ChaiForm",
    description:
      "Transparent pricing for creators, marketers, and fast-growing teams. Start free with 250 responses, or unlock unlimited forms and 10,000 responses with Pro.",
  },
};

export default function PricingPage() {
  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col ${landingTheme.selection}`}>
      <LandingNavbar />
      <main className="flex-1">
        <PricingView />
      </main>
      <LandingFooter />
    </div>
  );
}
