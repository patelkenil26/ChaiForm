import { LandingNavbar } from "~/components/landing/navbar";
import { LandingFooter } from "~/components/landing/footer";
import { FeaturesView } from "~/components/features/features-view";
import { landingTheme } from "~/config/landing-theme";

import { featuresMetadata, BreadcrumbJsonLd } from "~/seo";

export const metadata = featuresMetadata;

export default function FeaturesPage() {
  return (
    <div
      className={`min-h-screen bg-background text-foreground flex flex-col ${landingTheme.selection}`}
    >
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "" },
          { name: "Features", path: "/features" },
        ]}
      />
      <LandingNavbar />
      <main className="flex-1">
        <FeaturesView />
      </main>
      <LandingFooter />
    </div>
  );
}
