import { LandingNavbar } from "~/components/landing/navbar";
import { LandingFooter } from "~/components/landing/footer";
import { IntegrationsView } from "~/components/integrations/integrations-view";
import { landingTheme } from "~/config/landing-theme";

import { integrationsMetadata, BreadcrumbJsonLd } from "~/seo";

export const metadata = integrationsMetadata;

export default function IntegrationsPage() {
  return (
    <div
      className={`min-h-screen bg-background text-foreground flex flex-col ${landingTheme.selection}`}
    >
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "" },
          { name: "Integrations", path: "/integrations" },
        ]}
      />
      <LandingNavbar />
      <main className="flex-1">
        <IntegrationsView />
      </main>
      <LandingFooter />
    </div>
  );
}
