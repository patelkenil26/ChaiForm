"use client";

import { useState } from "react";
import { IconSparkles, IconChartBar, IconBolt } from "@tabler/icons-react";
import { Badge } from "~/components/ui/badge";
import type { ShowcaseTab } from "./showcase/showcase-data";
import { ShowcaseRunner } from "./showcase/showcase-runner";
import { ShowcaseBuilder } from "./showcase/showcase-builder";
import { ShowcaseResponses } from "./showcase/showcase-responses";

/**
 * Living Product Studio Orchestrator
 * Modularized for production grade scalability, isolated state performance,
 * and high developer readability.
 */
export function ProductShowcaseSection() {
  const [activeTab, setActiveTab] = useState<ShowcaseTab>("runner");

  return (
    <section
      id="interactive-canvas"
      className="py-20 md:py-28 relative overflow-hidden border-t border-border/40 bg-background text-foreground"
    >
      {/* Target anchor fallback for old #live-demo */}
      <div id="live-demo" className="absolute -top-24" />

      {/* Atmospheric Ambient Light Beam */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex flex-col items-center overflow-hidden">
        <div className="h-72 w-[85%] max-w-5xl rounded-full bg-gradient-to-b from-lime-500/10 via-emerald-500/5 to-transparent dark:from-[#CCFF00]/15 dark:via-[#CCFF00]/3 dark:to-transparent blur-[130px] -translate-y-1/3" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge
            variant="outline"
            className="text-xs px-3.5 py-1 border-lime-600/30 dark:border-[#CCFF00]/30 bg-gradient-to-r from-lime-500/10 via-emerald-500/10 to-lime-500/5 dark:from-[#CCFF00]/15 dark:via-[#CCFF00]/10 dark:to-[#CCFF00]/5 text-lime-800 dark:text-[#CCFF00] gap-1.5 mb-4 shadow-xs font-semibold"
          >
            <IconSparkles className="size-3.5" />
            <span>Living Product Studio</span>
          </Badge>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-b from-foreground via-foreground/95 to-foreground/75 bg-clip-text text-transparent">
              The entire conversational engine{" "}
            </span>
            <span className="bg-gradient-to-r from-lime-600 via-emerald-600 to-lime-700 dark:from-[#CCFF00] dark:via-[#E2FF66] dark:to-[#A3E635] bg-clip-text text-transparent">
              at your fingertips.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Experience how easy it is to compose questions, collect live answers, and inspect
            instant JSON payloads directly in your browser.
          </p>
        </div>

        {/* Unified Living OS Window Frame */}
        <div className="rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden relative">
          {/* Top Chamfered Light Sheen */}
          <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-lime-600/60 dark:via-[#CCFF00]/70 to-transparent" />

          {/* Top Window Bar */}
          <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3.5 border-b border-border/60 bg-muted/40 gap-3 backdrop-blur-md">
            {/* macOS Window Controls + Fake URL */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="size-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="size-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="size-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-card border border-border/70 text-[11px] font-mono text-muted-foreground">
                <span className="text-emerald-500 font-semibold">https://</span>
                <span>chaiform.com/flow/conversational-demo</span>
              </div>
            </div>

            {/* View Switcher Tabs */}
            <div className="flex items-center p-1 rounded-xl bg-card border border-border/70 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("runner")}
                className={`px-3 sm:px-4 py-1.5 rounded-lg transition-all cursor-pointer font-bold text-xs flex items-center gap-1.5 ${
                  activeTab === "runner"
                    ? "bg-lime-600 dark:bg-[#CCFF00] text-white dark:text-[#0A0B0D] shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <IconBolt className="size-3.5" />
                <span>Live Runner</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("builder")}
                className={`px-3 sm:px-4 py-1.5 rounded-lg transition-all cursor-pointer font-bold text-xs flex items-center gap-1.5 ${
                  activeTab === "builder"
                    ? "bg-lime-600 dark:bg-[#CCFF00] text-white dark:text-[#0A0B0D] shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <IconSparkles className="size-3.5" />
                <span>Form Builder</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("analytics")}
                className={`px-3 sm:px-4 py-1.5 rounded-lg transition-all cursor-pointer font-bold text-xs flex items-center gap-1.5 ${
                  activeTab === "analytics"
                    ? "bg-lime-600 dark:bg-[#CCFF00] text-white dark:text-[#0A0B0D] shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <IconChartBar className="size-3.5" />
                <span>Live Responses</span>
              </button>
            </div>
          </div>

          {/* Sub-Components View Routing */}
          {activeTab === "runner" && <ShowcaseRunner />}
          {activeTab === "builder" && <ShowcaseBuilder />}
          {activeTab === "analytics" && <ShowcaseResponses />}
        </div>
      </div>
    </section>
  );
}
