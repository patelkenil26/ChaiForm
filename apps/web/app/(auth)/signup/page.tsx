import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { SignupForm } from "~/components/signup-form";
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Panel: Brand Story & Live Form Preview (Desktop only) */}
          <div className="hidden lg:flex lg:col-span-7 flex-col justify-between p-8 xl:p-10 rounded-2xl border border-border/80 bg-gradient-to-br from-amber-500/[0.04] via-card to-background relative overflow-hidden min-h-[580px]">
            <div className={landingTheme.cardBeam} />

            <div>
              <Link href="/" className="inline-flex items-center gap-2.5 group mb-6">
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

              <h2 className="text-2xl xl:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
                Start collecting higher{" "}
                <span className={landingTheme.gradientText}>form responses today</span>
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Join thousands of creators and teams building beautiful, distraction-free
                conversational forms without code.
              </p>

              {/* Mini Form Preview Card */}
              <div className="mt-6 p-4 rounded-xl border border-border/70 bg-background/70 backdrop-blur-md shadow-xs space-y-3">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-medium text-amber-300">
                    <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
                    Question 1 of 3
                  </span>
                  <span className="text-[10px] bg-muted/60 px-2 py-0.5 rounded-full">
                    Interactive Flow
                  </span>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  How would you rate your current form conversion?
                </p>
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
                <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground border-t border-border/40">
                  <span>Zero code required · Instant mobile responsive</span>
                  <span className="text-emerald-400 font-medium">Auto-saves every field</span>
                </div>
              </div>
            </div>

            {/* 3 Conversion Bullets */}
            <div className="mt-8 pt-6 border-t border-border/60 grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-1">
                <span className="font-semibold text-foreground block">⚡ Built in 60s</span>
                <span className="text-[11px] text-muted-foreground leading-tight block">
                  14 interactive types, zero code
                </span>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-foreground block">☕ Free Forever</span>
                <span className="text-[11px] text-muted-foreground leading-tight block">
                  250 responses/mo included
                </span>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-foreground block">📊 Export Anytime</span>
                <span className="text-[11px] text-muted-foreground leading-tight block">
                  CSV, JSON &amp; embed API
                </span>
              </div>
            </div>
          </div>

          {/* Right Panel: Signup Card */}
          <div className="lg:col-span-5 w-full flex flex-col gap-4">
            <div
              className={`rounded-2xl border border-border/80 ${landingTheme.cardBg} backdrop-blur-xl shadow-2xl p-6 sm:p-8 relative overflow-hidden`}
            >
              <div className={landingTheme.cardBeam} />
              <SignupForm redirectUrl={redirectUrl} />
            </div>

            {/* Back to Home Link */}
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
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
