import Link from "next/link";
import { LandingNavbar } from "~/components/landing/navbar";
import { LandingFooter } from "~/components/landing/footer";
import { Badge } from "~/components/ui/badge";
import { landingTheme } from "~/config/landing-theme";

export const metadata = {
  title: "Privacy Policy • ChaiForm",
  description: "Learn how ChaiForm collects, uses, and safeguards your personal and form submission data.",
  openGraph: {
    title: "Privacy Policy • ChaiForm",
    description: "Learn how ChaiForm collects, uses, and safeguards your personal and form submission data.",
  },
};

export default function PrivacyPage() {
  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col ${landingTheme.selection}`}>
      <LandingNavbar />

      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge variant="outline" className={`mb-4 px-3 py-1 text-xs ${landingTheme.badge}`}>
            Legal & Security
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: October 2026 • Effective immediately
          </p>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground border-t border-border/60 pt-8">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">1. Introduction</h2>
              <p>
                At ChaiForm (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;), we are committed to respecting and protecting the privacy of both our account holders (&quot;Creators&quot;) and the individuals responding to forms created using our service (&quot;Respondents&quot;).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">2. Information We Collect</h2>
              <p>
                <strong className="text-foreground">For Creators:</strong> When you sign up for an account, we collect your name, email address, and encrypted credentials. We also collect metadata about forms you create, publish, or archive.
              </p>
              <p>
                <strong className="text-foreground">For Form Respondents:</strong> When you submit a form powered by ChaiForm, we collect only the answers you provide in the form fields, along with technical submission metadata (timestamp, completion time) necessary to ensure security and prevent spam. We do not sell your personal data or answers to third parties.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">3. How We Use Information</h2>
              <p>We use collected data solely to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Provide, maintain, and improve the conversational form service.</li>
                <li>Display responses and real-time analytics to the authorized form creator.</li>
                <li>Prevent abusive activity, bot attacks, and automated spam.</li>
                <li>Send transactional notifications (such as password reset links or response alerts).</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">4. Data Storage & Security</h2>
              <p>
                All network communication is strictly encrypted using TLS 1.3 encryption in transit. Passwords and sensitive parameters are cryptographically hashed using industry-standard hashing algorithms. Database backups are taken regularly and stored securely.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">5. Data Ownership & Export</h2>
              <p>
                You retain full ownership of all forms and submission data collected in your workspace. You can export your data in CSV or JSON format at any time from your Creator Dashboard, or delete forms and submissions permanently.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">6. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or your data, please contact our support team at{" "}
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
