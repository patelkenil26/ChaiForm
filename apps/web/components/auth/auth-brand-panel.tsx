"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconBolt,
  IconTrendingUp,
  IconArrowRight,
  IconCornerDownLeft,
  IconStarFilled,
  IconDeviceLaptop,
} from "@tabler/icons-react";
import { ChaiFormLogo } from "~/components/brand/chaiform-logo";
import { Badge } from "~/components/ui/badge";

export interface AuthBrandPanelProps {
  headline?: React.ReactNode;
  subtitle?: string;
}

export function AuthBrandPanel({
  headline = (
    <>
      Conversational forms that{" "}
      <span className="text-lime-800 dark:text-[#CCFF00]">convert 3.4× higher</span>
    </>
  ),
  subtitle = "Replace intimidating static walls of inputs with fluid, 1-question-at-a-time flows that respondents love completing.",
}: AuthBrandPanelProps) {
  // Visual interactive choice preview
  const [selectedGoal, setSelectedGoal] = useState<"leads" | "events" | "feedback">("leads");

  return (
    <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-between p-5 xl:p-6 rounded-2xl sm:rounded-3xl border border-border/80 bg-gradient-to-b from-card/90 via-card/60 to-card/90 backdrop-blur-2xl relative overflow-hidden h-full min-h-0 shadow-2xl">
      {/* Top Hairline Beam Glow */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-lime-600/50 dark:via-[#CCFF00]/60 to-transparent" />

      {/* Header & Narrative */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <ChaiFormLogo
              size={28}
              priority
              className="transition-transform duration-200 group-hover:scale-105"
            />
            <span className="text-lg font-extrabold tracking-tight text-foreground">ChaiForm</span>
            <Badge
              variant="outline"
              className="text-[10px] font-mono border-lime-600/30 dark:border-[#CCFF00]/30 text-lime-800 dark:text-[#CCFF00] bg-lime-500/10 dark:bg-[#CCFF00]/10 px-1.5 py-0 font-bold"
            >
              v2.4
            </Badge>
          </Link>

          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full border border-border/60">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Interactive Preview</span>
          </span>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl xl:text-2xl font-extrabold tracking-tight text-foreground leading-snug">
            {headline}
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-lg">{subtitle}</p>
        </div>

        {/* LIVING CONVERSATIONAL FORM RUNNER PREVIEW CARD */}
        <div className="rounded-xl border border-border/90 bg-card/95 p-3.5 sm:p-4 shadow-lg relative overflow-hidden">
          {/* Card Window Header */}
          <div className="flex items-center justify-between pb-2 border-b border-border/60 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-lime-600 dark:bg-[#CCFF00] animate-pulse" />
              <span className="text-muted-foreground uppercase text-[10px] font-semibold">
                CONVERSATIONAL ENGINE
              </span>
            </div>
            <span className="text-[10px] font-mono text-lime-800 dark:text-[#CCFF00] font-bold">
              STEP 1 OF 3 • 100% FLUID
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted h-1 rounded-full overflow-hidden mt-2">
            <div className="bg-lime-600 dark:bg-[#CCFF00] h-full w-[45%]" />
          </div>

          {/* Interactive Question */}
          <div className="py-2.5 space-y-2">
            <div className="space-y-0.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-lime-800 dark:text-[#CCFF00]">
                01 <IconArrowRight className="size-2.5" />
              </span>
              <h3 className="text-sm sm:text-base font-bold text-foreground tracking-tight">
                What type of form are you launching today?
              </h3>
            </div>

            {/* Options List */}
            <div className="space-y-1.5 pt-0.5">
              {[
                {
                  id: "leads" as const,
                  key: "A",
                  title: "Lead Capture & Waitlist",
                  desc: "Replace static landing page inputs with step-by-step qualification",
                },
                {
                  id: "events" as const,
                  key: "B",
                  title: "Live Event RSVP & Tickets",
                  desc: "Generate 1024px print-ready QR codes with hard capacity limits",
                },
                {
                  id: "feedback" as const,
                  key: "C",
                  title: "Customer CSAT & Feedback",
                  desc: "Uncover candid sentiment with animated 5-star rating scales",
                },
              ].map((opt) => {
                const isSelected = selectedGoal === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedGoal(opt.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                      isSelected
                        ? "border-lime-600 dark:border-[#CCFF00] bg-lime-500/10 dark:bg-[#CCFF00]/10 text-foreground ring-1 ring-lime-600/30 dark:ring-[#CCFF00]/40 shadow-xs"
                        : "border-border/80 bg-muted/30 hover:border-lime-600/30 dark:hover:border-[#CCFF00]/30 hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`size-5 rounded-md flex items-center justify-center font-mono text-[11px] font-bold shrink-0 ${
                          isSelected
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
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-mono text-lime-800 dark:text-[#CCFF00] font-bold shrink-0 ml-2">
                        <span>SELECTED</span>
                        <IconCornerDownLeft className="size-2.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Proof Strip & Metric Bento */}
      <div className="space-y-2.5 pt-3">
        {/* Metric Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 sm:p-2.5 rounded-lg border border-border/80 bg-card/60 backdrop-blur-md">
            <div className="flex items-center gap-1 text-lime-800 dark:text-[#CCFF00] font-mono text-sm sm:text-base font-extrabold">
              <IconTrendingUp className="size-3.5 text-emerald-500" />
              <span>89.4%</span>
            </div>
            <div className="text-[10px] text-muted-foreground">Avg Completion</div>
          </div>

          <div className="p-2 sm:p-2.5 rounded-lg border border-border/80 bg-card/60 backdrop-blur-md">
            <div className="flex items-center gap-1 text-lime-800 dark:text-[#CCFF00] font-mono text-sm sm:text-base font-extrabold">
              <IconBolt className="size-3.5 text-amber-500" />
              <span>3.4×</span>
            </div>
            <div className="text-[10px] text-muted-foreground">Faster Pace</div>
          </div>

          <div className="p-2 sm:p-2.5 rounded-lg border border-border/80 bg-card/60 backdrop-blur-md">
            <div className="flex items-center gap-1 text-lime-800 dark:text-[#CCFF00] font-mono text-sm sm:text-base font-extrabold">
              <IconDeviceLaptop className="size-3.5 text-blue-500" />
              <span>1-Click</span>
            </div>
            <div className="text-[10px] text-muted-foreground">Embed &amp; Sync</div>
          </div>
        </div>

        {/* Customer Social Proof Pill */}
        <div className="flex items-center justify-between p-2 rounded-lg border border-border/70 bg-muted/40 text-xs">
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
            <span className="text-[10px] text-muted-foreground">
              Loved by <strong className="text-foreground">2,400+</strong> product teams
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-amber-500">
            {[1, 2, 3, 4, 5].map((i) => (
              <IconStarFilled key={i} className="size-2.5" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
