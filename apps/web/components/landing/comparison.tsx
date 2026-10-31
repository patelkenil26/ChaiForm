"use client";

import {
  IconCheck,
  IconX,
  IconSparkles,
  IconAlertTriangle,
  IconBolt,
  IconMoodSmile,
  IconMoodSad,
  IconArrowRight,
  IconCornerDownLeft,
} from "@tabler/icons-react";
import { Badge } from "~/components/ui/badge";

export function ComparisonSection() {
  const comparisonRows = [
    {
      feature: "Completion UX",
      traditional: "20+ static inputs stacked vertically with high drop-off",
      chaiform: "1-question-at-a-time fluid conversational flow",
    },
    {
      feature: "Keyboard & Speed",
      traditional: "Requires constant mouse clicking and manual tabbing",
      chaiform: "Full keyboard speed (1-9 choices, Enter to continue)",
    },
    {
      feature: "Mobile Usability",
      traditional: "Clunky pinch-to-zoom on iOS/Android keyboards",
      chaiform: "Auto-scrolling viewport with zero screen shifting",
    },
    {
      feature: "Distribution & QR",
      traditional: "Plain URLs only; third-party QR code tools needed",
      chaiform: "Print-ready QR studio with branded color presets built-in",
    },
    {
      feature: "Pricing Transparency",
      traditional: "Core features locked behind $29-$99+/mo per-seat walls",
      chaiform: "Generous starter tier, transparent pricing, zero lock-in",
    },
    {
      feature: "Live Response Feed",
      traditional: "Manual spreadsheet refreshes or disconnected plugins",
      chaiform: "Real-time responses with instant CSV and JSON export",
    },
  ];

  return (
    <section
      id="comparison"
      className="py-20 md:py-28 bg-background text-foreground border-t border-border/40 relative"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge
            variant="outline"
            className="text-xs px-3.5 py-1 border-lime-600/30 dark:border-[#CCFF00]/30 bg-gradient-to-r from-lime-500/10 via-emerald-500/10 to-lime-500/5 dark:from-[#CCFF00]/15 dark:via-[#CCFF00]/10 dark:to-[#CCFF00]/5 text-lime-800 dark:text-[#CCFF00] gap-1.5 mb-4 shadow-xs"
          >
            <IconSparkles className="size-3.5" />
            <span>Visual Benchmark</span>
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-b from-foreground via-foreground/95 to-foreground/75 bg-clip-text text-transparent">
              Why modern teams abandon{" "}
            </span>
            <span className="bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600 dark:from-rose-400 dark:via-amber-300 dark:to-rose-400 bg-clip-text text-transparent">
              static web forms.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Legacy forms create cognitive friction and respondent fatigue. ChaiForm turns forms into
            effortless, high-converting conversations.
          </p>
        </div>

        {/* Visual Split Screen: Before vs After */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-14">
          {/* Card A: The 2008 Web Form */}
          <div className="rounded-2xl border border-rose-500/30 bg-card p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-xs">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-rose-500" />
                  <span className="font-mono text-xs font-bold text-rose-500 uppercase tracking-wider">
                    Legacy 2008 Static Forms
                  </span>
                </div>
                <IconMoodSad className="size-5 text-rose-400" />
              </div>

              {/* Mockup of cramped form */}
              <div className="mt-6 rounded-xl border border-border/80 bg-muted/40 p-4 space-y-3 opacity-90 pointer-events-none">
                <div className="space-y-1">
                  <div className="h-2 w-28 bg-muted-foreground/30 rounded" />
                  <div className="h-7 w-full bg-card border border-border rounded" />
                </div>
                <div className="space-y-1">
                  <div className="h-2 w-36 bg-muted-foreground/30 rounded" />
                  <div className="h-7 w-full bg-card border border-rose-500/40 rounded flex items-center px-2">
                    <span className="text-[10px] text-rose-500 font-mono">
                      * Required field cannot be empty
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="h-2 w-32 bg-muted-foreground/30 rounded" />
                  <div className="h-7 w-full bg-card border border-border rounded" />
                </div>
                <div className="pt-1">
                  <div className="h-7 w-24 bg-muted border border-border rounded flex items-center justify-center text-[10px] font-mono text-muted-foreground">
                    SUBMIT
                  </div>
                </div>
              </div>
            </div>

            {/* Downside Stats */}
            <div className="mt-8 pt-4 border-t border-border/60 grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-extrabold text-rose-500 font-mono">26.3%</div>
                <div className="text-xs text-muted-foreground mt-0.5">Average Completion Rate</div>
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-muted-foreground uppercase">
                  High Drop-off
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Respondents abandon midway
                </div>
              </div>
            </div>
          </div>

          {/* Card B: The ChaiForm Conversational Flow */}
          <div className="rounded-2xl border-2 border-lime-600/40 dark:border-[#CCFF00]/50 bg-gradient-to-b from-primary/[0.08] via-card to-card p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-primary/10">
            {/* Top Chamfered Light Sheen */}
            <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-lime-600/80 dark:via-[#CCFF00]/90 to-transparent" />

            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-lime-600 dark:bg-[#CCFF00] animate-pulse" />
                  <span className="font-mono text-xs font-bold text-lime-800 dark:text-[#CCFF00] uppercase tracking-wider">
                    ChaiForm 2.0 Conversational Flow
                  </span>
                </div>
                <IconMoodSmile className="size-5 text-lime-700 dark:text-[#CCFF00]" />
              </div>

              {/* Mockup of fluid conversational card */}
              <div className="mt-6 rounded-xl border border-lime-600/30 dark:border-[#CCFF00]/30 bg-card p-5 space-y-3 pointer-events-none shadow-md">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-mono text-lime-800 dark:text-[#CCFF00] font-bold">
                    1 <IconArrowRight className="size-3" />
                  </span>
                  <div className="text-sm font-bold text-foreground">
                    How can we help your team scale?
                  </div>
                </div>
                <div className="space-y-1.5 pt-1">
                  <div className="h-8 rounded-lg border border-lime-600/30 dark:border-[#CCFF00]/40 bg-lime-500/10 dark:bg-[#CCFF00]/10 px-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">
                      A. Automate inbound lead intake
                    </span>
                    <span className="text-[10px] font-mono text-lime-800 dark:text-[#CCFF00] flex items-center gap-1 font-bold">
                      SELECTED <IconCornerDownLeft className="size-3" />
                    </span>
                  </div>
                  <div className="h-8 rounded-lg border border-border/80 bg-muted/40 px-3 flex items-center">
                    <span className="text-xs text-muted-foreground">
                      B. Replace expensive Typeform bill
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-muted-foreground">
                  <span className="flex items-center gap-1">
                    Press Enter <IconCornerDownLeft className="size-3 text-muted-foreground" /> to
                    continue
                  </span>
                  <span className="text-lime-800 dark:text-[#CCFF00] font-semibold">
                    Step 1 of 3
                  </span>
                </div>
              </div>
            </div>

            {/* Upside Stats */}
            <div className="mt-8 pt-4 border-t border-border/60 grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-extrabold bg-gradient-to-r from-lime-600 via-emerald-600 to-lime-700 dark:from-[#CCFF00] dark:via-[#E2FF66] dark:to-[#A3E635] bg-clip-text text-transparent font-mono">
                  89.4%
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">Verified Completion Rate</div>
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-foreground uppercase">
                  Instant Pacing
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  3.4x faster submission speed
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Matrix */}
        <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-xl">
          <div className="min-w-[560px]">
            <div className="grid grid-cols-12 bg-muted/50 p-4 border-b border-border/60 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
              <div className="col-span-4">Capability</div>
              <div className="col-span-4 text-rose-500">Traditional Forms</div>
              <div className="col-span-4 text-lime-800 dark:text-[#CCFF00]">ChaiForm 2.0</div>
            </div>

            <div className="divide-y divide-border/60">
              {comparisonRows.map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 p-4 sm:p-5 text-xs sm:text-sm items-center hover:bg-muted/30 transition-colors"
                >
                  <div className="col-span-4 font-semibold text-foreground pr-3">{row.feature}</div>

                  <div className="col-span-4 text-muted-foreground flex items-start gap-2 pr-3">
                    <IconX className="size-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{row.traditional}</span>
                  </div>

                  <div className="col-span-4 text-foreground font-semibold flex items-start gap-2">
                    <IconCheck className="size-4 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                    <span>{row.chaiform}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
