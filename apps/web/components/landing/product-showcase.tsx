"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconPlus,
  IconSparkles,
  IconCheck,
  IconArrowRight,
  IconEye,
  IconCopy,
  IconExternalLink,
  IconLock,
  IconCalendar,
  IconStarFilled,
  IconForms,
  IconShare,
  IconChartBar,
  IconQrcode,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { landingTheme } from "~/config/landing-theme";

export function ProductShowcaseSection() {
  const [activeTab, setActiveTab] = useState<"builder" | "preview" | "analytics">("builder");

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className={`h-[420px] w-[800px] rounded-full ${landingTheme.heroGlow} opacity-60`} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge
            variant="outline"
            className={`text-xs px-3 py-1 ${landingTheme.badge} gap-1.5 mb-3`}
          >
            <IconSparkles className="size-3.5" />
            <span>Product Walkthrough</span>
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            See how ChaiForm works.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            From blank canvas to live responses in 3 intuitive steps. No coding, complex logic
            trees, or setup required.
          </p>
        </div>

        {/* 3-Step Walkthrough Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-12">
          <div className="rounded-2xl border border-border/80 bg-card/60 p-6 backdrop-blur-xs relative overflow-hidden flex flex-col justify-between">
            <div className={landingTheme.cardBeam} />
            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-xs font-bold ${landingTheme.primaryText} tracking-wider uppercase`}
                >
                  Step 01
                </span>
                <div
                  className={`size-8 rounded-lg ${landingTheme.iconBg} flex items-center justify-center`}
                >
                  <IconForms className="size-4" />
                </div>
              </div>
              <h3 className="font-bold text-base text-foreground">Build with 14 Field Types</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Add ratings, single & multiple choices, text, passwords, and dates. Reorder
                questions effortlessly and preview live.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl border border-border/80 bg-card/60 p-6 backdrop-blur-xs relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-blue-400 tracking-wider uppercase">
                  Step 02
                </span>
                <div className="size-8 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                  <IconShare className="size-4" />
                </div>
              </div>
              <h3 className="font-bold text-base text-foreground">Share via Link, QR or Embed</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Send your clean custom URL, download high-resolution themed QR codes, or paste a
                1-line iframe into Next.js or Webflow.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl border border-border/80 bg-card/60 p-6 backdrop-blur-xs relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">
                  Step 03
                </span>
                <div className="size-8 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <IconChartBar className="size-4" />
                </div>
              </div>
              <h3 className="font-bold text-base text-foreground">Track Live Responses & Export</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Watch verified answers stream directly into your submissions hub. Search, filter by
                dates, and export to CSV in 1 click.
              </p>
            </div>
          </div>
        </div>

        {/* Realistic Interactive Product UI Showcase Frame */}
        <div className="rounded-2xl border border-border/80 bg-neutral-950 shadow-2xl overflow-hidden relative">
          {/* Top Window Bar */}
          <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-border/60 bg-muted/40 gap-3">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="size-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="size-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="text-xs text-muted-foreground font-mono ml-2 hidden sm:inline">
                chaiform.kenilpatel.in/forms/product-feedback
              </span>
            </div>

            {/* View Switcher Tabs */}
            <div className="flex items-center p-0.5 rounded-lg bg-muted/60 border border-border/50 text-xs overflow-x-auto no-scrollbar max-w-full">
              <button
                type="button"
                onClick={() => setActiveTab("builder")}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "builder"
                    ? "bg-foreground text-background font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Form Builder
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "preview"
                    ? "bg-foreground text-background font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Live Runner View
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("analytics")}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "analytics"
                    ? "bg-foreground text-background font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Submissions &amp; Stats
              </button>
            </div>
          </div>

          {/* View Tab 1: Form Builder */}
          {activeTab === "builder" && (
            <div className="p-4 sm:p-6 md:p-8 bg-card/40">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Questions List */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-border/40">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                        Form Questions (4)
                      </span>
                      <Badge variant="secondary" className="text-[10px]">
                        Auto-saved
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">Drag to reorder</span>
                  </div>

                  {/* Question Card 1 */}
                  <div className="rounded-xl border border-border/80 bg-card p-3.5 flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <span
                        className={`size-6 rounded-md ${landingTheme.iconBg} flex items-center justify-center text-xs font-bold`}
                      >
                        1
                      </span>
                      <div>
                        <div className="text-xs font-medium text-foreground">
                          What is your overall impression of ChaiForm?
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                          <span className="inline-flex items-center gap-1 text-amber-400">
                            <IconStarFilled className="size-3" /> 5-Star Rating
                          </span>
                          <span>•</span>
                          <span className="text-emerald-400">Required</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Question Card 2 */}
                  <div className="rounded-xl border border-border/80 bg-card p-3.5 flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <span
                        className={`size-6 rounded-md ${landingTheme.iconBg} flex items-center justify-center text-xs font-bold`}
                      >
                        2
                      </span>
                      <div>
                        <div className="text-xs font-medium text-foreground">
                          Which feature matters most to your workflow?
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                          <span>Multiple Choice (3 options)</span>
                          <span>•</span>
                          <span className="text-emerald-400">Required</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Question Card 3 */}
                  <div className="rounded-xl border border-border/80 bg-card p-3.5 flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <span
                        className={`size-6 rounded-md ${landingTheme.iconBg} flex items-center justify-center text-xs font-bold`}
                      >
                        3
                      </span>
                      <div>
                        <div className="text-xs font-medium text-foreground">
                          What is your work email address?
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                          <span>Validated Email Input</span>
                          <span>•</span>
                          <span className="text-emerald-400">Required</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Add Question Button */}
                  <div className="p-3 rounded-xl border border-dashed border-border/80 bg-muted/20 text-center text-xs text-muted-foreground flex items-center justify-center gap-2 hover:bg-muted/40 transition-colors">
                    <IconPlus className="size-4" />
                    <span>Add New Question (14 types available)</span>
                  </div>
                </div>

                {/* Right: Security & Sharing Settings */}
                <div className="lg:col-span-5 rounded-xl border border-border/70 bg-card/60 p-4 space-y-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-2">
                    Publishing & Access Controls
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                      <div>
                        <div className="font-medium text-foreground">Form Status</div>
                        <div className="text-[11px] text-muted-foreground">Accepting responses</div>
                      </div>
                      <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">
                        Published
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                      <div>
                        <div className="font-medium text-foreground">Custom URL Slug</div>
                        <div className={`text-[11px] font-mono ${landingTheme.primaryText}`}>
                          /form/early-feedback
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 text-[10px]">
                        Edit
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                      <div>
                        <div className="font-medium text-foreground">Password Protection</div>
                        <div className="text-[11px] text-muted-foreground">
                          Enabled for private survey
                        </div>
                      </div>
                      <IconLock className={`size-3.5 ${landingTheme.iconColor}`} />
                    </div>

                    <div className="pt-2">
                      <Button
                        asChild
                        size="sm"
                        className={`w-full text-xs font-semibold ${landingTheme.primaryButton}`}
                      >
                        <Link href="/signup">
                          <span>Try the Live Builder Free</span>
                          <IconArrowRight className="size-3.5 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View Tab 2: Live Runner View */}
          {activeTab === "preview" && (
            <div className="p-8 sm:p-12 md:p-16 flex flex-col items-center justify-center text-center bg-background/90 min-h-[340px]">
              <span
                className={`text-[11px] font-bold ${landingTheme.primaryText} tracking-wider uppercase mb-2`}
              >
                1-Question-At-A-Time Runner
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground max-w-lg">
                How would you rate your product onboarding experience?
              </h3>
              <p className="text-xs text-muted-foreground mt-1 mb-6">
                Press 1-5 on your keyboard or select a star below
              </p>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <IconStarFilled className="size-6 text-amber-400" />
                  </button>
                ))}
              </div>
              <div className="mt-8 text-[11px] text-muted-foreground flex items-center gap-2">
                <span>
                  Press{" "}
                  <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">
                    Enter ↵
                  </kbd>{" "}
                  to proceed
                </span>
              </div>
            </div>
          )}

          {/* View Tab 3: Submissions & Analytics */}
          {activeTab === "analytics" && (
            <div className="p-4 sm:p-6 bg-card/40">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="p-3 rounded-xl border border-border/60 bg-card">
                  <div className="text-[11px] text-muted-foreground">Total Views</div>
                  <div className="text-xl font-bold text-foreground mt-0.5">148</div>
                </div>
                <div className="p-3 rounded-xl border border-border/60 bg-card">
                  <div className="text-[11px] text-muted-foreground">Total Responses</div>
                  <div className={`text-xl font-bold ${landingTheme.primaryText} mt-0.5`}>96</div>
                </div>
                <div className="p-3 rounded-xl border border-border/60 bg-card">
                  <div className="text-[11px] text-muted-foreground">Avg. Completion Time</div>
                  <div className="text-xl font-bold text-foreground mt-0.5">42s</div>
                </div>
                <div className="p-3 rounded-xl border border-border/60 bg-card">
                  <div className="text-[11px] text-muted-foreground">Export Formats</div>
                  <div className="text-xs font-semibold text-emerald-400 mt-1">
                    CSV & JSON Ready
                  </div>
                </div>
              </div>

              {/* Sample Submissions Table */}
              <div className="overflow-x-auto rounded-xl border border-border/70">
                <div className="min-w-[460px] text-xs">
                  <div className="grid grid-cols-12 bg-muted/60 p-2.5 font-semibold text-muted-foreground border-b border-border/60 text-[11px]">
                    <div className="col-span-4">Feedback Answer</div>
                    <div className="col-span-3">Rating</div>
                    <div className="col-span-3">Email</div>
                    <div className="col-span-2 text-right">Time</div>
                  </div>
                  <div className="grid grid-cols-12 p-2.5 border-b border-border/40 text-foreground items-center">
                    <div className="col-span-4 truncate">
                      &quot;Much cleaner than Google Forms&quot;
                    </div>
                    <div className="col-span-3 text-amber-400 flex items-center gap-1">
                      ★ ★ ★ ★ ★
                    </div>
                    <div className="col-span-3 text-muted-foreground truncate">alex@startup.io</div>
                    <div className="col-span-2 text-right text-muted-foreground">2m ago</div>
                  </div>
                  <div className="grid grid-cols-12 p-2.5 text-foreground items-center bg-muted/15">
                    <div className="col-span-4 truncate">
                      &quot;Mobile keyboard flow is super smooth&quot;
                    </div>
                    <div className="col-span-3 text-amber-400 flex items-center gap-1">
                      ★ ★ ★ ★ ★
                    </div>
                    <div className="col-span-3 text-muted-foreground truncate">
                      sara@creative.co
                    </div>
                    <div className="col-span-2 text-right text-muted-foreground">14m ago</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
