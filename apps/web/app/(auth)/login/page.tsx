import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "~/components/login-form";
import { AuthBrandPanel } from "~/components/auth/auth-brand-panel";
import { landingTheme } from "~/config/landing-theme";

import { loginMetadata } from "~/seo";

export const metadata = loginMetadata;

export default async function LoginPage({
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
                Conversational forms that{" "}
                <span className={landingTheme.gradientText}>convert 3.5× higher</span>
              </>
            }
            subtitle="Replace clunky multi-page questionnaires with one-question-at-a-time flow that respondents love completing."
            previewBadge="Preview"
            previewQuestion="What is your primary goal for this workspace?"
            previewContent={
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg border border-amber-400/40 bg-amber-400/10 text-amber-200 flex items-center gap-2">
                  <span className="size-4 rounded-full bg-amber-400/20 text-[10px] font-bold flex items-center justify-center">
                    A
                  </span>
                  <span>Lead Generation</span>
                </div>
                <div className="p-2 rounded-lg border border-border/60 bg-muted/30 text-muted-foreground flex items-center gap-2">
                  <span className="size-4 rounded-full bg-muted text-[10px] font-bold flex items-center justify-center">
                    B
                  </span>
                  <span>User Feedback</span>
                </div>
              </div>
            }
            previewFooterLeft={
              <span>
                Press{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/60 text-foreground font-mono">
                  Enter ↵
                </kbd>{" "}
                to proceed
              </span>
            }
            previewFooterRight="92% completion rate"
          />

          {/* Right Panel: Login Card */}
          <div className="lg:col-span-5 w-full flex flex-col justify-between gap-4 h-full">
            <div
              className={`flex-1 flex flex-col justify-center rounded-2xl border border-border/80 ${landingTheme.cardBg} backdrop-blur-xl shadow-2xl p-6 sm:p-8 relative overflow-hidden min-h-[540px]`}
            >
              <div className={landingTheme.cardBeam} />
              <LoginForm redirectUrl={redirectUrl} />
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
