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
} from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { useUser } from "~/hooks/api/auth";

export function HeroSection() {
  const { user } = useUser();
  const ctaHref = user ? "/dashboard" : "/signup";

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
      {/* Background Ambient Glow & Mesh Gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[480px] w-[750px] rounded-full bg-gradient-to-tr from-indigo-500/15 via-purple-500/15 to-pink-500/10 blur-[130px] dark:from-indigo-600/20 dark:via-purple-600/15 dark:to-cyan-500/10" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Release / Announcement Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-medium text-primary shadow-xs backdrop-blur-xs transition hover:border-primary/40">
          <IconSparkles className="size-3.5" />
          <span>ChaiForm 2.0 is live</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-foreground/80 font-normal">Keyboard-First Flow & Type-Safe APIs</span>
          <IconArrowRight className="size-3" />
        </div>

        {/* Hero Title */}
        <h1 className="mt-6 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
          Forms that feel like{" "}
          <span className="bg-gradient-to-r from-indigo-500 via-primary to-purple-500 bg-clip-text text-transparent">
            conversations
          </span>
          , not chores.
        </h1>

        {/* Hero Description */}
        <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg lg:text-xl leading-relaxed">
          Replace tedious static forms with fluid, one-question-at-a-time conversational surveys.
          Collect <strong className="text-foreground font-semibold">3.5x more responses</strong> with
          end-to-end type safety, real-time analytics, and instant QR distribution.
        </p>

        {/* CTA Button Group */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto h-12 px-7 text-sm font-semibold gap-2.5 bg-gradient-to-r from-indigo-600 via-primary to-purple-600 text-white shadow-lg shadow-primary/25 hover:opacity-95 hover:scale-[1.01] transition-all cursor-pointer"
          >
            <Link href={ctaHref}>
              <span>{user ? "Open Dashboard" : "Start Building for Free"}</span>
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
              <IconPlayerPlayFilled className="size-3.5 text-primary" />
              <span>Try Live Interactive Demo</span>
            </a>
          </Button>
        </div>

        {/* Trust & Highlights Pills */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="flex size-4 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
              <IconCheck className="size-2.5 stroke-[3]" />
            </div>
            <span>No credit card required</span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex size-4 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
              <IconCheck className="size-2.5 stroke-[3]" />
            </div>
            <span>Free forever tier</span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex size-4 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
              <IconCheck className="size-2.5 stroke-[3]" />
            </div>
            <span>100% Type-Safe tRPC & PostgreSQL</span>
          </div>
        </div>

        {/* Metric Badges Strip */}
        <div className="mt-14 w-full grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl text-left">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5 backdrop-blur-xs shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">3.5x</div>
            <p className="mt-1 text-xs text-muted-foreground font-medium">Higher completion rate</p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5 backdrop-blur-xs shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">&lt; 60s</div>
            <p className="mt-1 text-xs text-muted-foreground font-medium">Time to build & publish</p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5 backdrop-blur-xs shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-500">100%</div>
            <p className="mt-1 text-xs text-muted-foreground font-medium">Type-safe schema validation</p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5 backdrop-blur-xs shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-500">Real-Time</div>
            <p className="mt-1 text-xs text-muted-foreground font-medium">Submissions & CSV export</p>
          </div>
        </div>
      </div>
    </section>
  );
}
