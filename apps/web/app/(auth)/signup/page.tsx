import Link from "next/link";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCornerDownLeft,
  IconTrendingUp,
  IconBolt,
  IconDeviceLaptop,
  IconStarFilled,
  IconShieldCheck,
} from "@tabler/icons-react";
import { SignupForm } from "~/components/signup-form";
import { ChaiFormLogo } from "~/components/brand/chaiform-logo";
import { ThemeToggle } from "~/components/theme-toggle";
import { Badge } from "~/components/ui/badge";
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
    <div className="h-screen max-h-screen w-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-background text-foreground">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "" },
          { name: "Sign Up", path: "/signup" },
        ]}
      />

      {/* ========================================================= */}
      {/* LEFT HALF: FULL-BLEED SEAMLESS BRAND STAGE (Edge-to-Edge) */}
      {/* ========================================================= */}
      <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-between p-8 xl:p-12 border-r border-border/70 bg-muted/20 relative overflow-hidden">
        {/* Subtle Ambient Citron Glow */}
        <div className="pointer-events-none absolute -top-32 -left-32 size-96 rounded-full bg-lime-500/10 dark:bg-[#CCFF00]/10 blur-[130px] -z-10" />

        {/* Top Header */}
        <div className="flex items-center justify-between shrink-0">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <ChaiFormLogo
              size={32}
              priority
              className="transition-transform duration-200 group-hover:scale-105"
            />
            <span className="text-xl font-extrabold tracking-tight text-foreground">ChaiForm</span>
            <Badge
              variant="outline"
              className="text-[10px] font-mono border-lime-600/30 dark:border-[#CCFF00]/30 text-lime-800 dark:text-[#CCFF00] bg-lime-500/10 dark:bg-[#CCFF00]/10 px-2 py-0.5 font-bold"
            >
              v2.4
            </Badge>
          </Link>

          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground bg-background/80 px-2.5 py-1 rounded-full border border-border/60">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Form Engine</span>
          </span>
        </div>

        {/* Center: Hero Narrative & Interactive Runner Preview */}
        <div className="my-auto max-w-lg space-y-4 py-4">
          <div className="space-y-1.5">
            <h2 className="text-2xl xl:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
              Build your first conversational form in{" "}
              <span className="text-lime-800 dark:text-[#CCFF00]">under 60 seconds</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Join thousands of creators and growth teams replacing clunky Google Forms with
              interactive, step-by-step experiences.
            </p>
          </div>

          {/* Living Interactive Form Runner Preview */}
          <div className="rounded-2xl border border-border/80 bg-card/90 backdrop-blur-md p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/60 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-lime-600 dark:bg-[#CCFF00] animate-pulse" />
                <span className="text-muted-foreground uppercase text-[10px] font-semibold">
                  LIVE RUNNER PREVIEW
                </span>
              </div>
              <span className="text-[10px] font-mono text-lime-800 dark:text-[#CCFF00] font-bold">
                STEP 1 OF 3 • 100% FLUID
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
              <div className="bg-lime-600 dark:bg-[#CCFF00] h-full w-[45%]" />
            </div>

            {/* Question & Choices */}
            <div className="space-y-2 pt-1">
              <div className="space-y-0.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-lime-800 dark:text-[#CCFF00]">
                  01 <IconArrowRight className="size-2.5" />
                </span>
                <h3 className="text-sm sm:text-base font-bold text-foreground">
                  What is your primary collection goal?
                </h3>
              </div>

              <div className="space-y-1.5">
                {[
                  {
                    key: "A",
                    title: "Lead Generation & Waitlists",
                    desc: "Qualify high-intent inbound leads with zero drop-off",
                    active: true,
                  },
                  {
                    key: "B",
                    title: "Event RSVPs & Ticket Passes",
                    desc: "Print 1024px QR codes with auto-close capacity limits",
                    active: false,
                  },
                  {
                    key: "C",
                    title: "Customer CSAT & Feedback",
                    desc: "Uncover candid sentiment with animated 5-star rating scales",
                    active: false,
                  },
                ].map((opt) => (
                  <div
                    key={opt.key}
                    className={`flex items-center justify-between p-2 rounded-xl border text-xs transition-all ${
                      opt.active
                        ? "border-lime-600 dark:border-[#CCFF00] bg-lime-500/10 dark:bg-[#CCFF00]/10 text-foreground ring-1 ring-lime-600/30 dark:ring-[#CCFF00]/40"
                        : "border-border/60 bg-muted/30 text-muted-foreground opacity-75"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`size-5 rounded-md flex items-center justify-center font-mono text-[11px] font-bold shrink-0 ${
                          opt.active
                            ? "bg-lime-600 dark:bg-[#CCFF00] text-white dark:text-[#0A0B0D]"
                            : "bg-muted border border-border text-foreground"
                        }`}
                      >
                        {opt.key}
                      </span>
                      <div className="min-w-0">
                        <div className="font-semibold text-foreground text-xs truncate">
                          {opt.title}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate">{opt.desc}</div>
                      </div>
                    </div>
                    {opt.active && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-mono text-lime-800 dark:text-[#CCFF00] font-bold shrink-0 ml-2">
                        <span>ACTIVE</span>
                        <IconCornerDownLeft className="size-2.5" />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Metric Bento Strip */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-2.5 rounded-xl border border-border/80 bg-card/60">
              <div className="flex items-center gap-1 text-lime-800 dark:text-[#CCFF00] font-mono text-sm sm:text-base font-extrabold">
                <IconTrendingUp className="size-3.5 text-emerald-500" />
                <span>89.4%</span>
              </div>
              <div className="text-[10px] text-muted-foreground">Avg Completion</div>
            </div>

            <div className="p-2.5 rounded-xl border border-border/80 bg-card/60">
              <div className="flex items-center gap-1 text-lime-800 dark:text-[#CCFF00] font-mono text-sm sm:text-base font-extrabold">
                <IconBolt className="size-3.5 text-amber-500" />
                <span>3.4×</span>
              </div>
              <div className="text-[10px] text-muted-foreground">Faster Pace</div>
            </div>

            <div className="p-2.5 rounded-xl border border-border/80 bg-card/60">
              <div className="flex items-center gap-1 text-lime-800 dark:text-[#CCFF00] font-mono text-sm sm:text-base font-extrabold">
                <IconDeviceLaptop className="size-3.5 text-blue-500" />
                <span>1-Click</span>
              </div>
              <div className="text-[10px] text-muted-foreground">Embed &amp; Sync</div>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof */}
        <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              <span className="size-5 rounded-full bg-lime-600/30 border border-background text-[9px] font-bold flex items-center justify-center text-foreground">
                AP
              </span>
              <span className="size-5 rounded-full bg-amber-500/30 border border-background text-[9px] font-bold flex items-center justify-center text-foreground">
                MK
              </span>
              <span className="size-5 rounded-full bg-blue-500/30 border border-background text-[9px] font-bold flex items-center justify-center text-foreground">
                JL
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground">
              Loved by <strong className="text-foreground">2,400+</strong> creators &amp; growth
              teams
            </span>
          </div>

          <div className="flex items-center gap-0.5 text-amber-500">
            {[1, 2, 3, 4, 5].map((i) => (
              <IconStarFilled key={i} className="size-2.5" />
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT HALF: CLEAN AUTH CONSOLE (Direct on Canvas, No Box) */}
      {/* ========================================================= */}
      <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-12 relative overflow-hidden bg-background">
        {/* Top Navbar Actions */}
        <div className="flex items-center justify-between w-full max-w-md mx-auto shrink-0">
          {/* Mobile Logo */}
          <Link href="/" className="lg:hidden inline-flex items-center gap-2">
            <ChaiFormLogo size={28} priority />
            <span className="text-base font-extrabold tracking-tight">ChaiForm</span>
          </Link>

          <div className="ml-auto flex items-center gap-2.5">
            <span className="hidden sm:inline text-xs text-muted-foreground">
              Already registered?{" "}
              <Link
                href="/login"
                className="font-bold text-lime-800 dark:text-[#CCFF00] hover:underline"
              >
                Sign in
              </Link>
            </span>
            <ThemeToggle className="size-8" />
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1 rounded-lg border border-border/60 hover:bg-muted"
            >
              <IconArrowLeft className="size-3.5" />
              <span className="hidden sm:inline">Website</span>
            </Link>
          </div>
        </div>

        {/* Center: Signup Form resting directly on canvas without a box */}
        <div className="w-full max-w-md mx-auto my-auto py-2">
          <SignupForm redirectUrl={redirectUrl} />
        </div>

        {/* Bottom Legal & Security Footer */}
        <div className="w-full max-w-md mx-auto text-center text-[11px] text-muted-foreground shrink-0 pt-2">
          <div className="flex items-center justify-center gap-1 text-muted-foreground/80 mb-0.5">
            <IconShieldCheck className="size-3.5 text-emerald-500" />
            <span>256-bit SSL encrypted • Zero telemetry tracking</span>
          </div>
          <p>© {new Date().getFullYear()} ChaiForm • Conversational Form OS</p>
        </div>
      </div>
    </div>
  );
}
