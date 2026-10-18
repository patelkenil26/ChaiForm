import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, ArrowLeft } from "lucide-react";
import { SignupForm } from "~/components/signup-form";
import { landingTheme } from "~/config/landing-theme";

export const metadata = {
  title: "Create Account • ChaiForm",
  description: "Create your free ChaiForm account and start building conversational forms",
};

export default function SignupPage() {

  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden ${landingTheme.selection}`}>
      {/* Background Ambient Glows */}
      <div className={`pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[450px] w-[650px] rounded-full ${landingTheme.heroGlow} -z-10`} />

      <div className="flex w-full max-w-md flex-col gap-6">
        {/* Brand Link */}
        <Link href="/" className="flex items-center gap-2.5 self-center group">
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

        {/* Card */}
        <div className={`rounded-2xl border border-border/80 ${landingTheme.cardBg} backdrop-blur-xl shadow-2xl p-6 sm:p-8 relative overflow-hidden`}>
          <div className={landingTheme.cardBeam} />
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12 gap-2 text-sm text-muted-foreground">
                <Loader2 className={`size-5 animate-spin ${landingTheme.iconColor}`} />
                <span>Loading sign up...</span>
              </div>
            }
          >
            <SignupForm />
          </Suspense>
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
  );
}
