"use client";

import Link from "next/link";
import {
  IconArrowRight,
  IconSparkles,
  IconTerminal2,
  IconShieldCheck,
  IconBolt,
} from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { useUser } from "~/hooks/api/auth";

export function CtaSection() {
  const { user } = useUser();
  const ctaHref = user ? "/dashboard" : "/signup";

  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-background text-foreground border-t border-border/40">
      {/* Atmospheric Horizon Light Arc behind CTA */}
      <div className="pointer-events-none absolute -top-36 left-1/2 -translate-x-1/2 h-80 w-[95%] max-w-5xl rounded-full bg-gradient-to-b from-lime-500/15 via-[#CCFF00]/10 to-transparent dark:from-[#CCFF00]/25 dark:via-[#CCFF00]/5 dark:to-transparent blur-[120px] -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-lime-600/30 dark:border-[#CCFF00]/30 bg-gradient-to-b from-lime-500/[0.08] via-card to-card p-8 sm:p-16 text-center overflow-hidden shadow-2xl shadow-lime-500/10 dark:shadow-[#CCFF00]/10">
          {/* Top Chamfered Light Beam Sheen */}
          <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-lime-600/80 dark:via-[#CCFF00]/90 to-transparent" />

          {/* Ambient Radial Center Glow */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 size-96 rounded-full bg-radial from-lime-500/15 to-transparent dark:from-[#CCFF00]/15 dark:to-transparent blur-[110px]" />

          {/* Command Prompt Pill with subtle gradient */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-lime-600/30 dark:border-[#CCFF00]/30 bg-gradient-to-r from-lime-500/10 to-muted/60 dark:from-[#CCFF00]/15 dark:to-muted/60 font-mono text-xs text-muted-foreground mb-6 backdrop-blur-md shadow-xs">
            <IconTerminal2 className="size-3.5 text-lime-800 dark:text-[#CCFF00]" />
            <span>Launch in under 60 seconds</span>
            <span className="text-muted-foreground/30">•</span>
            <span className="text-lime-800 dark:text-[#CCFF00] font-semibold">
              zero setup required
            </span>
          </div>

          {/* Headline with Metallic & Citron Text Gradients */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-3xl mx-auto leading-[1.1]">
            <span className="bg-gradient-to-b from-foreground via-foreground/95 to-foreground/75 bg-clip-text text-transparent">
              Stop losing 74% of respondents to{" "}
            </span>
            <span className="bg-gradient-to-r from-lime-600 via-emerald-600 to-lime-700 dark:from-[#CCFF00] dark:via-[#E2FF66] dark:to-[#A3E635] bg-clip-text text-transparent underline decoration-lime-500/40 dark:decoration-[#CCFF00]/40 decoration-wavy underline-offset-8">
              static web forms.
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Create your first conversational flow today. Free tier forever, no credit card required,
            instant live preview.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto h-12 px-8 text-sm font-bold bg-gradient-to-r from-lime-600 to-emerald-600 dark:from-[#CCFF00] dark:via-[#D8FF33] dark:to-[#B8E600] text-white dark:text-[#0A0B0D] hover:opacity-95 active:scale-[0.99] shadow-xl shadow-lime-500/20 dark:shadow-[#CCFF00]/25 transition-all cursor-pointer gap-2"
            >
              <Link href={ctaHref}>
                <span>
                  {user ? "Open Your Creator Dashboard" : "Claim Your Free Workspace Now"}
                </span>
                <IconArrowRight className="size-4.5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-12 px-6 text-sm font-medium border-border/80 bg-card hover:bg-muted backdrop-blur-xs cursor-pointer text-foreground"
            >
              <Link href="/templates">Explore 40+ Pre-made Templates</Link>
            </Button>
          </div>

          {/* Minimal Trust Row */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-muted-foreground pt-6 border-t border-border/60">
            <div className="flex items-center gap-1.5">
              <IconShieldCheck className="size-3.5 text-emerald-500" />
              <span>FREE STARTER TIER</span>
            </div>
            <div className="flex items-center gap-1.5">
              <IconBolt className="size-3.5 text-emerald-500" />
              <span>NO CREDIT CARD NEEDED</span>
            </div>
            <div className="flex items-center gap-1.5">
              <IconSparkles className="size-3.5 text-emerald-500" />
              <span>INSTANT SHAREABLE LINK</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
