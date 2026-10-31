"use client";

import Link from "next/link";
import {
  IconArrowRight,
  IconSparkles,
  IconPlayerPlayFilled,
  IconBolt,
  IconShieldCheck,
  IconKeyboard,
} from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { useUser } from "~/hooks/api/auth";
import { HeroMicroForm } from "./hero/hero-micro-form";

export function HeroSection() {
  const { user } = useUser();
  const ctaHref = user ? "/dashboard" : "/signup";

  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24">
      {/* Atmospheric Horizon Light & Ambient Beam */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex flex-col items-center overflow-hidden">
        {/* Top curved horizon glow arc */}
        <div className="h-72 sm:h-88 w-[95%] max-w-6xl rounded-full bg-gradient-to-b from-lime-500/15 via-[#CCFF00]/10 to-transparent dark:from-[#CCFF00]/20 dark:via-[#CCFF00]/5 dark:to-transparent blur-[120px] -translate-y-1/2" />
        {/* Subtle radial center ambient glow */}
        <div className="absolute top-1/4 h-[420px] w-[760px] rounded-full bg-radial from-lime-500/10 via-emerald-500/5 to-transparent dark:from-[#CCFF00]/10 dark:via-[#CCFF00]/3 dark:to-transparent blur-[140px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Centered Header Content */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Release / Announcement Tag */}
          <div className="inline-flex items-center gap-2 rounded-full border border-lime-600/30 dark:border-[#CCFF00]/30 bg-gradient-to-r from-lime-500/10 via-emerald-500/10 to-lime-500/5 dark:from-[#CCFF00]/15 dark:via-[#CCFF00]/10 dark:to-[#CCFF00]/5 px-3.5 py-1 text-xs font-semibold text-lime-800 dark:text-[#CCFF00] shadow-xs backdrop-blur-md">
            <span className="size-2 rounded-full bg-lime-600 dark:bg-[#CCFF00] animate-pulse" />
            <span>ChaiForm 2.0</span>
            <span className="opacity-40">•</span>
            <span className="font-normal text-foreground/90">
              Conversational Engine with 14 Field Types &amp; Instant Embeds
            </span>
          </div>

          {/* Hero Main Headline with Metallic & Citron Text Gradients */}
          <h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]">
            <span className="bg-gradient-to-b from-foreground via-foreground/95 to-foreground/75 bg-clip-text text-transparent">
              Forms that feel like{" "}
            </span>
            <span className="bg-gradient-to-r from-lime-600 via-emerald-600 to-lime-700 dark:from-[#CCFF00] dark:via-[#E2FF66] dark:to-[#A3E635] bg-clip-text text-transparent underline decoration-lime-500/40 dark:decoration-[#CCFF00]/40 decoration-wavy underline-offset-8">
              conversations
            </span>
            <span className="bg-gradient-to-b from-foreground via-foreground/95 to-foreground/75 bg-clip-text text-transparent">
              , not interrogations.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-5 max-w-2xl text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
            Replace intimidating walls of static inputs with fluid, 1-question-at-a-time flows.
            Engineered for effortless mobile completion, instant QR sharing, and real-time response
            analytics.
          </p>

          {/* CTA Group with tactile keyboard badges */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto h-12 px-8 text-sm font-bold bg-gradient-to-r from-lime-600 to-emerald-600 dark:from-[#CCFF00] dark:via-[#D8FF33] dark:to-[#B8E600] hover:opacity-95 active:scale-[0.99] text-white dark:text-[#0A0B0D] shadow-lg shadow-lime-500/20 dark:shadow-[#CCFF00]/25 transition-all cursor-pointer gap-2"
            >
              <Link href={ctaHref}>
                <span>{user ? "Open Creator Dashboard" : "Start Building Free"}</span>
                <IconArrowRight className="size-4.5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-12 px-6 text-sm font-medium border-border/80 bg-card/60 hover:bg-muted/80 backdrop-blur-xs cursor-pointer gap-2 text-foreground"
            >
              <a href="#interactive-canvas">
                <IconPlayerPlayFilled className="size-3.5 text-lime-700 dark:text-[#CCFF00]" />
                <span>Test Drive Playground</span>
              </a>
            </Button>
          </div>

          {/* Creator Badge & Authority */}
          <div className="mt-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/60 bg-card/60 backdrop-blur-sm text-xs text-muted-foreground">
            <IconSparkles className="size-3.5 text-lime-700 dark:text-[#CCFF00]" />
            <span>
              Engineered by{" "}
              <a
                href="https://kenilpatel.in"
                target="_blank"
                rel="author external noopener noreferrer"
                className="font-semibold text-foreground hover:underline"
              >
                Kenil Patel
              </a>{" "}
              • The Free Conversational Alternative to Typeform
            </span>
          </div>
        </div>

        {/* Modular Interactive Micro-Card */}
        <HeroMicroForm className="mt-12 max-w-2xl mx-auto" />

        {/* Minimal Trust & Metric Strip */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs font-mono text-muted-foreground border-t border-border/40 pt-6">
          <div className="flex items-center gap-2">
            <IconShieldCheck className="size-4 text-emerald-500" />
            <span>FREE TIER FOREVER • ZERO CREDIT CARD REQUIRED</span>
          </div>
          <div className="flex items-center gap-2">
            <IconBolt className="size-4 text-emerald-500" />
            <span>89.4% AVERAGE CONVERSATIONAL COMPLETION RATE</span>
          </div>
          <div className="flex items-center gap-2">
            <IconKeyboard className="size-4 text-emerald-500" />
            <span>FULL KEYBOARD ACCESSIBILITY (1-9, ENTER, TAB)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
