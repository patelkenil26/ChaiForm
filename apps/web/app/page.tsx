import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LandingNavbar } from "~/components/landing/navbar";
import { HeroSection } from "~/components/landing/hero";
import { LiveDemoSection } from "~/components/landing/live-demo";
import { TemplatesSection } from "~/components/landing/templates-section";
import { FeaturesBentoSection } from "~/components/landing/features-bento";
import { ComparisonSection } from "~/components/landing/comparison";
import { TechStackSection } from "~/components/landing/tech-stack";
import { CtaSection } from "~/components/landing/cta-section";
import { LandingFooter } from "~/components/landing/footer";

export const metadata = {
  title: "ChaiForm • Next-Gen Conversational Form Builder",
  description:
    "Build fluid conversational forms, collect 3.5x more responses, and capture real-time verified feedback with end-to-end type safety.",
};

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authentication-token")?.value;
  if (token) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      <LandingNavbar />
      <main className="flex-1">
        <HeroSection />
        <LiveDemoSection />
        <TemplatesSection />
        <FeaturesBentoSection />
        <ComparisonSection />
        <TechStackSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
