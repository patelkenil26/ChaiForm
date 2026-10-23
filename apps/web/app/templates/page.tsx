import { LandingNavbar } from "~/components/landing/navbar";
import { LandingFooter } from "~/components/landing/footer";
import { TemplatesView } from "~/components/templates/templates-view";
import { landingTheme } from "~/config/landing-theme";

import { templatesMetadata } from "~/seo";

export const metadata = templatesMetadata;

export default function PublicTemplatesPage() {
  return (
    <div
      className={`min-h-screen bg-background text-foreground flex flex-col ${landingTheme.selection}`}
    >
      <LandingNavbar />
      <main className="flex-1">
        <TemplatesView />
      </main>
      <LandingFooter />
    </div>
  );
}
