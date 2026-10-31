import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import { ForgotPasswordForm } from "~/components/forgot-password-form";
import { ChaiFormLogo } from "~/components/brand/chaiform-logo";
import { ThemeToggle } from "~/components/theme-toggle";
import { Badge } from "~/components/ui/badge";

export const metadata = {
  title: "Forgot Password • ChaiForm",
  description: "Recover your ChaiForm account password with an email reset link.",
  openGraph: {
    title: "Forgot Password • ChaiForm",
    description: "Recover your ChaiForm account password with an email reset link.",
  },
};

export default function ForgotPasswordPage() {
  return (
    <div className="h-screen max-h-screen w-full bg-background text-foreground flex flex-col justify-between p-3 sm:p-4 lg:p-6 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[400px] w-[700px] rounded-full bg-gradient-to-tr from-lime-500/10 dark:from-[#CCFF00]/10 via-primary/5 to-transparent blur-[120px] -z-10" />

      {/* TOP AUTH NAVBAR STRIP */}
      <header className="w-full max-w-md mx-auto flex items-center justify-between py-1 shrink-0">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <ChaiFormLogo
            size={28}
            priority
            className="transition-transform duration-200 group-hover:scale-105"
          />
          <span className="text-base font-extrabold tracking-tight text-foreground">ChaiForm</span>
          <Badge
            variant="outline"
            className="text-[10px] font-mono border-lime-600/30 dark:border-[#CCFF00]/30 text-lime-800 dark:text-[#CCFF00] bg-lime-500/10 dark:bg-[#CCFF00]/10 px-1.5 py-0"
          >
            v2.4
          </Badge>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle className="size-8" />
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg border border-border/60 hover:bg-muted"
          >
            <IconArrowLeft className="size-3.5" />
            <span>Sign in</span>
          </Link>
        </div>
      </header>

      {/* CARD CONTAINER */}
      <main className="w-full max-w-md mx-auto my-auto flex-1 min-h-0 flex items-center justify-center">
        <div className="w-full rounded-2xl sm:rounded-3xl border border-border/80 bg-card/90 backdrop-blur-2xl shadow-2xl p-5 sm:p-6 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-lime-600/50 dark:via-[#CCFF00]/60 to-transparent" />
          <ForgotPasswordForm />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full max-w-md mx-auto py-1 text-center text-[11px] text-muted-foreground shrink-0">
        <Link
          href="/"
          className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <IconArrowLeft className="size-3.5" />
          <span>Back to ChaiForm Home</span>
        </Link>
      </footer>
    </div>
  );
}
