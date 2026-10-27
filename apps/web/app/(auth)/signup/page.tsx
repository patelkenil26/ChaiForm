import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { SignupForm } from "~/components/signup-form";
import { AuthBrandPanel } from "~/components/auth/auth-brand-panel";
import { landingTheme } from "~/config/landing-theme";

import { signupMetadata, BreadcrumbJsonLd } from "~/seo";

export const metadata = signupMetadata;

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;
  const redirectUrl = params?.redirect || "/dashboard";

  return (
    <div
      className={`min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden ${landingTheme.selection}`}
    >
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "" },
          { name: "Sign Up", path: "/signup" },
        ]}
      />
      {/* Background Ambient Glows */}
      <div
        className={`pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[450px] w-[650px] rounded-full ${landingTheme.heroGlow} -z-10`}
      />

      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
        {/* Brand Link (Mobile only) */}
        <Link href="/" className="lg:hidden flex items-center gap-2.5 self-center group mb-2">
          <div className="relative size-9 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
            <Image
              src="/chaiform-logo-transparent-for-dark-bg (3).svg"
              alt="ChaiForm"
              width={36}
              height={36}
              className="size-full object-contain"
              priority
            />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">ChaiForm</span>
        </Link>

        {/* Dual Panel Grid (Desktop 2-col, Mobile 1-col) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Panel: Modular Brand Story & Live Form Preview (Desktop only) */}
          <AuthBrandPanel
            headline={
              <>
                Start collecting higher{" "}
                <span className={landingTheme.gradientText}>form responses today</span>
              </>
            }
            subtitle="Join thousands of creators and teams building beautiful, distraction-free conversational forms without code."
            previewBadge="Interactive Flow"
            previewQuestion="How would you rate your current form conversion?"
            previewContent={
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className={`flex-1 py-2 rounded-lg border text-center text-xs font-bold transition-all ${
                      star === 5
                        ? "border-amber-400/50 bg-amber-400/15 text-amber-200"
                        : "border-border/60 bg-muted/30 text-muted-foreground"
                    }`}
                  >
                    ★ {star}
                  </div>
                ))}
              </div>
            }
            previewFooterLeft="Zero code required · Instant mobile responsive"
            previewFooterRight="Auto-saves every field"
          />

          {/* Right Panel: Signup Card */}
          <div className="lg:col-span-5 w-full flex flex-col justify-between gap-4 h-full">
            <div
              className={`flex-1 flex flex-col justify-center rounded-2xl border border-border/80 ${landingTheme.cardBg} backdrop-blur-xl shadow-2xl p-6 sm:p-8 relative overflow-hidden min-h-[540px]`}
            >
              <div className={landingTheme.cardBeam} />
              <SignupForm redirectUrl={redirectUrl} />
            </div>

            {/* Back to Home Link */}
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground hover:text-foreground transition-colors py-1 shrink-0"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to ChaiForm</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
