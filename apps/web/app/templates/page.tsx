import { LandingNavbar } from "~/components/landing/navbar";
import { LandingFooter } from "~/components/landing/footer";
import { TemplatesView } from "~/components/templates/templates-view";
import { landingTheme } from "~/config/landing-theme";

export const metadata = {
  title: "Conversational Form Templates • ChaiForm",
  description:
    "Explore curated conversational form templates for customer surveys, event RSVPs, feedback collection, job applications, and quizzes. Clone into your account in 1 click.",
  openGraph: {
    title: "Conversational Form Templates • ChaiForm",
    description:
      "Explore curated conversational form templates for customer surveys, event RSVPs, feedback collection, job applications, and quizzes. Clone into your account in 1 click.",
    url: "https://chaiform.kenilpatel.in/templates",
    siteName: "ChaiForm",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Conversational Form Templates • ChaiForm",
    description:
      "Explore curated conversational form templates for customer surveys, event RSVPs, feedback collection, job applications, and quizzes. Clone into your account in 1 click.",
  },
};

export default function PublicTemplatesPage() {
  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col ${landingTheme.selection}`}>
      <LandingNavbar />
      <main className="flex-1">
        <TemplatesView />
      </main>
      <LandingFooter />
    </div>
  );
}
