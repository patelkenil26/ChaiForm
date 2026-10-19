"use client";

import Link from "next/link";
import {
  IconArrowRight,
  IconSparkles,
  IconPlayerPlayFilled,
  IconCheck,
  IconChartBar,
  IconShieldLock,
  IconBrandGithub,
  IconBolt,
  IconStarFilled,
} from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { useUser } from "~/hooks/api/auth";
import { landingTheme } from "~/config/landing-theme";

export function HeroSection() {
  const { user } = useUser();
  const ctaHref = user ? "/dashboard" : "/signup";

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
      {/* Background Ambient Glow & Mesh Gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className={`h-[460px] w-[750px] rounded-full ${landingTheme.heroGlow}`} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Release / Announcement Badge */}
        <div className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium shadow-xs backdrop-blur-xs transition ${landingTheme.badge}`}>
          <IconSparkles className="size-3.5" />
          <span className="font-semibold">ChaiForm v2.0 Released</span>
          <span className="opacity-40">•</span>
          <span className="opacity-90 font-normal">Conversational Flow, 14 Input Types & Instant Embeds</span>
          <IconArrowRight className="size-3" />
        </div>

        {/* Hero Title */}
        <h1 className="mt-6 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
          Forms that feel like{" "}
          <span className={landingTheme.gradientText}>
            conversations
          </span>
          , not interrogations.
        </h1>

        {/* Hero Description */}
        <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg lg:text-xl leading-relaxed">
          Replace intimidating walls of static inputs with fluid, 1-question-at-a-time conversational forms.
          Engineered for effortless mobile completion, instant QR code sharing, and real-time response analytics.
        </p>

        {/* CTA Button Group */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
          <Button
            asChild
            size="lg"
            className={`w-full sm:w-auto h-12 px-8 text-sm font-semibold gap-2.5 ${landingTheme.primaryButton} hover:scale-[1.01] transition-all cursor-pointer`}
          >
            <Link href={ctaHref}>
              <span>{user ? "Open Creator Dashboard" : "Start Building for Free"}</span>
              <IconArrowRight className="size-4.5" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto h-12 px-6 text-sm font-medium gap-2 border-border/80 bg-background/50 hover:bg-muted/80 backdrop-blur-xs cursor-pointer"
          >
            <a href="#live-demo">
              <IconPlayerPlayFilled className={`size-3.5 ${landingTheme.iconColor}`} />
              <span>Try Interactive Playground</span>
            </a>
          </Button>
        </div>

        {/* Authentic Creator Badge */}
        <div className="mt-7 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/60 bg-card/60 backdrop-blur-sm text-xs text-muted-foreground shadow-2xs">
            <IconSparkles className={`size-3.5 ${landingTheme.iconColor}`} />
            <span>Built for founders, marketers, and event organizers</span>
          </div>
        </div>

        {/* Trust & Highlights Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-muted-foreground border-t border-border/40 pt-6">
          <div className="flex items-center gap-1.5">
            <div className={`flex size-4 items-center justify-center rounded-full ${landingTheme.iconBg}`}>
              <IconCheck className="size-2.5 stroke-[3]" />
            </div>
            <span>Free tier forever</span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className={`flex size-4 items-center justify-center rounded-full ${landingTheme.iconBg}`}>
              <IconCheck className="size-2.5 stroke-[3]" />
            </div>
            <span>No credit card required</span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className={`flex size-4 items-center justify-center rounded-full ${landingTheme.iconBg}`}>
              <IconCheck className="size-2.5 stroke-[3]" />
            </div>
            <span>Build & publish in under 60 seconds</span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className={`flex size-4 items-center justify-center rounded-full ${landingTheme.iconBg}`}>
              <IconCheck className="size-2.5 stroke-[3]" />
            </div>
            <span>Embed anywhere with zero CSS</span>
          </div>
        </div>

        {/* Real Product Core Value Strip */}
        <div className="mt-12 w-full grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl text-left">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5 backdrop-blur-xs shadow-xs">
            <div className={`text-2xl sm:text-3xl font-extrabold ${landingTheme.primaryText}`}>1-At-A-Time</div>
            <p className="mt-1 text-xs text-muted-foreground font-medium">Conversational pacing</p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5 backdrop-blur-xs shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">14 Types</div>
            <p className="mt-1 text-xs text-muted-foreground font-medium">Flexible input fields</p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5 backdrop-blur-xs shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">1-Click</div>
            <p className="mt-1 text-xs text-muted-foreground font-medium">Instant share & iframe embeds</p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5 backdrop-blur-xs shadow-xs">
            <div className={`text-2xl sm:text-3xl font-extrabold ${landingTheme.primaryText}`}>Live Feed</div>
            <p className="mt-1 text-xs text-muted-foreground font-medium">Instant analytics & CSV export</p>
          </div>
        </div>
      </div>
    </section>
  );
}
