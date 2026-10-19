import Link from "next/link";
import { LandingNavbar } from "~/components/landing/navbar";
import { LandingFooter } from "~/components/landing/footer";
import { Badge } from "~/components/ui/badge";
import { landingTheme } from "~/config/landing-theme";

export const metadata = {
  title: "Terms of Service • ChaiForm",
  description: "Read the Terms of Service governing your use of ChaiForm's conversational form builder.",
  openGraph: {
    title: "Terms of Service • ChaiForm",
    description: "Read the Terms of Service governing your use of ChaiForm's conversational form builder.",
  },
};

export default function TermsPage() {
  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col ${landingTheme.selection}`}>
      <LandingNavbar />

      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge variant="outline" className={`mb-4 px-3 py-1 text-xs ${landingTheme.badge}`}>
            Agreement
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Terms of Service</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: October 2026 • Effective immediately
          </p>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground border-t border-border/60 pt-8">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">1. Acceptance of Terms</h2>
              <p>
                By accessing or using ChaiForm (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the Service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">2. Account Registration & Security</h2>
              <p>
                You must provide accurate and complete information when registering. You are responsible for safeguarding your password and account credentials, and for any activities or actions under your account.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">3. Acceptable Use Policy</h2>
              <p>
                You agree not to use ChaiForm to collect sensitive personal information without authorization, engage in phishing or deceptive practices, distribute malware, or violate any applicable local or international laws. We reserve the right to suspend or terminate accounts that violate this policy.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">4. Free & Paid Subscriptions</h2>
              <p>
                ChaiForm offers both a free tier and paid tiers. Free accounts are subject to monthly response and active form limits as displayed on our Pricing page. Paid plans are billed according to your selected billing interval (monthly or annual). You may cancel your subscription at any time.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">5. Limitation of Liability</h2>
              <p>
                The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. ChaiForm makes no warranties that the service will meet your specific requirements or be uninterrupted, secure, or error-free.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">6. Contact Information</h2>
              <p>
                For questions regarding these Terms, please email us at{" "}
                <a href="mailto:support@chaiform.kenilpatel.in" className="text-foreground underline">
                  support@chaiform.kenilpatel.in
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
