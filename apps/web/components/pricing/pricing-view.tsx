"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconCheck,
  IconArrowRight,
  IconShieldCheck,
  IconBolt,
  IconFlame,
  IconBuildingStore,
  IconStarFilled,
  IconX,
  IconChevronDown,
  IconLock,
  IconQrcode,
  IconLink,
  IconClock,
  IconCalculator,
  IconTrendingDown,
  IconTerminal2,
} from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { landingTheme } from "~/config/landing-theme";

type Currency = "USD" | "INR";

export function PricingView() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [isYearly, setIsYearly] = useState(true);
  const [sliderIndex, setSliderIndex] = useState(2); // default 10,000 responses
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeMatrixTab, setActiveMatrixTab] = useState<"all" | "limits" | "design" | "security">(
    "all",
  );

  // Response tiers for the interactive savings calculator
  const responseTiers = [
    {
      responses: "500",
      typeformCostUSD: 29,
      typeformCostINR: 2400,
      bestPlan: "starter",
      chaiformUSD: 0,
      chaiformINR: 0,
    },
    {
      responses: "2,500",
      typeformCostUSD: 59,
      typeformCostINR: 4900,
      bestPlan: "pro",
      chaiformUSD: isYearly ? 15 : 19,
      chaiformINR: isYearly ? 1199 : 1499,
    },
    {
      responses: "10,000",
      typeformCostUSD: 99,
      typeformCostINR: 8200,
      bestPlan: "pro",
      chaiformUSD: isYearly ? 15 : 19,
      chaiformINR: isYearly ? 1199 : 1499,
    },
    {
      responses: "50,000",
      typeformCostUSD: 249,
      typeformCostINR: 20500,
      bestPlan: "team",
      chaiformUSD: isYearly ? 39 : 49,
      chaiformINR: isYearly ? 3199 : 3999,
    },
    {
      responses: "100,000+",
      typeformCostUSD: 499,
      typeformCostINR: 41000,
      bestPlan: "team",
      chaiformUSD: isYearly ? 39 : 49,
      chaiformINR: isYearly ? 3199 : 3999,
    },
  ];

  const currentTier = responseTiers[sliderIndex] ?? responseTiers[2]!;
  const monthlySavingsUSD = currentTier.typeformCostUSD - currentTier.chaiformUSD;
  const yearlySavingsUSD = monthlySavingsUSD * 12;

  const monthlySavingsINR = currentTier.typeformCostINR - currentTier.chaiformINR;
  const yearlySavingsINR = monthlySavingsINR * 12;

  const getPrice = (plan: "starter" | "pro" | "team") => {
    if (plan === "starter") {
      return {
        display: currency === "USD" ? "$0" : "₹0",
        period: "/ month",
        subtext: "Free forever • No credit card",
      };
    }
    if (plan === "pro") {
      if (currency === "USD") {
        return isYearly
          ? { display: "$15", period: "/ month", subtext: "Billed annually ($180/yr) • Save $48" }
          : { display: "$19", period: "/ month", subtext: "Billed monthly • Cancel anytime" };
      } else {
        return isYearly
          ? {
              display: "₹1,199",
              period: "/ month",
              subtext: "Billed annually (₹14,388/yr) • Save ₹3,600",
            }
          : { display: "₹1,499", period: "/ month", subtext: "Billed monthly • Cancel anytime" };
      }
    }
    // Team
    if (currency === "USD") {
      return isYearly
        ? { display: "$39", period: "/ month", subtext: "Billed annually ($468/yr) • Save $120" }
        : { display: "$49", period: "/ month", subtext: "Billed monthly • Cancel anytime" };
    } else {
      return isYearly
        ? {
            display: "₹3,199",
            period: "/ month",
            subtext: "Billed annually (₹38,388/yr) • Save ₹9,600",
          }
        : { display: "₹3,999", period: "/ month", subtext: "Billed monthly • Cancel anytime" };
    }
  };

  const proPrice = getPrice("pro");
  const teamPrice = getPrice("team");
  const starterPrice = getPrice("starter");

  return (
    <div className="relative overflow-hidden bg-background text-foreground">
      {/* Precision Technical Grid Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(currentColor_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-12 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-tight border border-border bg-card text-foreground mb-6 shadow-xs">
          <IconTerminal2 className="size-3.5 text-lime-700 dark:text-[#CCFF00]" />
          <span>ZERO TYPEFORM TAX • OPEN SAAS PRICING</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.06]">
          Higher form conversions. <br />
          <span className="text-lime-800 dark:text-[#CCFF00] underline decoration-[#CCFF00]/40 decoration-wavy decoration-2 underline-offset-8">
            Flat, honest pricing.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          10,000 monthly verified responses included. No hidden per-seat fees. No artificial
          question limits.
        </p>

        {/* Technical Floating Control Bar */}
        <div className="mt-10 inline-flex flex-wrap items-center justify-center gap-3 p-1.5 rounded-2xl bg-muted/70 border border-border/80 shadow-md">
          {/* Currency Toggle */}
          <div className="flex items-center p-0.5 rounded-xl bg-card border border-border/70 text-xs font-mono font-semibold">
            <button
              type="button"
              onClick={() => setCurrency("USD")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currency === "USD"
                  ? "bg-[#CCFF00] text-[#0A0B0D] shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              USD ($)
            </button>
            <button
              type="button"
              onClick={() => setCurrency("INR")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                currency === "INR"
                  ? "bg-[#CCFF00] text-[#0A0B0D] shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>INR (₹)</span>
              <span className="text-[10px] opacity-80">UPI</span>
            </button>
          </div>

          <div className="h-5 w-[1px] bg-border hidden sm:block" />

          {/* Billing Frequency Toggle */}
          <div className="flex items-center p-0.5 rounded-xl bg-card border border-border/70 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setIsYearly(false)}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                !isYearly
                  ? "bg-foreground text-background shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setIsYearly(true)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                isYearly
                  ? "bg-foreground text-background shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Annual</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#CCFF00] text-[#0A0B0D]">
                -20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE SAVINGS ENGINE */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-16">
        <div className="relative rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left max-w-sm">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-lime-800 dark:text-[#CCFF00]">
                <IconCalculator className="size-4" />
                <span>Real-Time ROI Engine</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mt-1">
                Select your expected monthly volume
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5">
                Compare your actual monthly spend against equivalent Typeform tiers.
              </p>
            </div>

            {/* Savings Callout Box */}
            <div className="rounded-xl border border-lime-600/30 dark:border-[#CCFF00]/40 bg-lime-500/10 dark:bg-[#CCFF00]/[0.06] px-6 py-4 text-center shrink-0 w-full md:w-auto">
              <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-lime-800 dark:text-[#CCFF00]">
                <IconTrendingDown className="size-4" />
                <span>ANNUAL SAVINGS</span>
              </div>
              <div className="text-3xl font-black text-foreground mt-0.5 font-mono">
                {currency === "USD"
                  ? `$${yearlySavingsUSD}`
                  : `₹${yearlySavingsINR.toLocaleString("en-IN")}`}
                <span className="text-xs font-normal text-muted-foreground"> / yr</span>
              </div>
              <span className="text-[11px] text-muted-foreground block mt-0.5">
                vs Typeform (${currentTier.typeformCostUSD * 12}/yr)
              </span>
            </div>
          </div>

          {/* Response Slider Chips */}
          <div className="mt-8">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {responseTiers.map((tier, idx) => {
                const isSelected = sliderIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSliderIndex(idx)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary/10 border-lime-600 dark:border-[#CCFF00] text-foreground shadow-md ring-1 ring-lime-600/30 dark:ring-[#CCFF00]/30"
                        : "bg-muted/40 border-border/70 text-muted-foreground hover:border-border hover:text-foreground"
                    }`}
                  >
                    <span className="block text-sm font-mono font-bold text-foreground">
                      {tier.responses}
                    </span>
                    <span className="block text-[11px] text-muted-foreground mt-0.5">
                      responses / mo
                    </span>
                    <span
                      className={`inline-block mt-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        isSelected
                          ? "bg-lime-600 dark:bg-[#CCFF00] text-white dark:text-[#0A0B0D]"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {tier.bestPlan.toUpperCase()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. ASYMMETRICAL PLANS ARCHITECTURE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Plan 1: Starter (Col-span 3) */}
          <div className="lg:col-span-3 rounded-2xl border border-border/80 bg-card p-6 sm:p-7 flex flex-col justify-between transition-all hover:border-border shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-lg bg-muted border border-border/70 flex items-center justify-center text-muted-foreground">
                    <IconBolt className="size-4" />
                  </div>
                  <h3 className="font-bold text-base text-foreground">Starter</h3>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground">
                  Free
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed min-h-[34px]">
                For hobbyists and indie experiments testing conversational flow.
              </p>

              <div className="my-5">
                <span className="text-3xl font-extrabold text-foreground font-mono">
                  {starterPrice.display}
                </span>
                <span className="text-xs text-muted-foreground ml-1">{starterPrice.period}</span>
                <span className="text-[11px] text-muted-foreground block mt-1">
                  {starterPrice.subtext}
                </span>
              </div>

              <div className="border-t border-border/60 pt-4 space-y-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <IconCheck className="size-4 text-emerald-500 shrink-0" />
                  <span>3 active live forms</span>
                </div>
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <IconCheck className="size-4 text-emerald-500 shrink-0" />
                  <span>250 responses / month</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCheck className="size-4 text-emerald-500 shrink-0" />
                  <span>All 14 question types</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCheck className="size-4 text-emerald-500 shrink-0" />
                  <span>Instant CSV exports</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCheck className="size-4 text-emerald-500 shrink-0" />
                  <span>Responsive iframe embed</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-border/60">
              <Button
                asChild
                variant="outline"
                className="w-full text-xs font-semibold h-10 border-border bg-card hover:bg-muted text-foreground cursor-pointer"
              >
                <Link href="/signup">Start Free</Link>
              </Button>
            </div>
          </div>

          {/* Plan 2: Pro Creator (Col-span 6 - HERO COMMAND CARD) */}
          <div className="lg:col-span-6 relative rounded-3xl bg-card border-2 border-lime-600 dark:border-[#CCFF00] p-7 sm:p-9 flex flex-col justify-between shadow-2xl shadow-lime-600/10 dark:shadow-[#CCFF00]/15">
            {/* Top Citron Pill */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-lime-600 dark:bg-[#CCFF00] text-white dark:text-[#0A0B0D] text-[11px] font-mono font-bold tracking-wide uppercase shadow-md">
                <IconStarFilled className="size-3 text-white dark:text-[#0A0B0D]" /> RECOMMENDED
                CHOICE
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-lime-500/15 dark:bg-[#CCFF00]/10 border border-lime-600/30 dark:border-[#CCFF00]/30 flex items-center justify-center text-lime-800 dark:text-[#CCFF00]">
                    <IconFlame className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-2xl text-foreground">Pro Creator</h3>
                    <span className="text-xs text-muted-foreground font-medium">
                      Built for founders, marketers &amp; serious lead capture
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-lime-500/15 dark:bg-[#CCFF00]/15 text-lime-800 dark:text-[#CCFF00] border border-lime-600/30 dark:border-[#CCFF00]/30">
                  GROWTH
                </span>
              </div>

              {/* Price Banner */}
              <div className="my-6 p-4 rounded-xl bg-muted/40 border border-border/80 flex items-baseline justify-between flex-wrap gap-2">
                <div>
                  <div className="flex items-baseline gap-2">
                    {isYearly && (
                      <span className="text-lg line-through text-muted-foreground/60 font-mono">
                        {currency === "USD" ? "$19" : "₹1,499"}
                      </span>
                    )}
                    <span className="text-5xl font-black tracking-tight text-foreground font-mono">
                      {proPrice.display}
                    </span>
                    <span className="text-sm text-muted-foreground">{proPrice.period}</span>
                  </div>
                  <span className="text-xs text-lime-800 dark:text-[#CCFF00] font-mono font-medium block mt-1">
                    {proPrice.subtext}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground block font-mono">
                    INCLUDED CAPACITY
                  </span>
                  <span className="text-sm font-extrabold text-lime-800 dark:text-[#CCFF00] font-mono">
                    10,000 Responses / mo
                  </span>
                </div>
              </div>

              {/* 2-Column Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-muted-foreground pt-1">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <IconCheck className="size-4 text-emerald-500 shrink-0" />
                  <span>Unlimited active forms</span>
                </div>
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <IconCheck className="size-4 text-emerald-500 shrink-0" />
                  <span>10,000 submissions / month</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/90">
                  <IconCheck className="size-4 text-emerald-500 shrink-0" />
                  <span>Custom URL slugs (/f/your-brand)</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/90">
                  <IconCheck className="size-4 text-emerald-500 shrink-0" />
                  <span>Password-protected access</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/90">
                  <IconCheck className="size-4 text-emerald-500 shrink-0" />
                  <span>Response caps &amp; auto-expiry</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/90">
                  <IconCheck className="size-4 text-emerald-500 shrink-0" />
                  <span>Vector SVG QR generator</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/90">
                  <IconCheck className="size-4 text-emerald-500 shrink-0" />
                  <span>Real-time email notifications</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/90">
                  <IconCheck className="size-4 text-emerald-500 shrink-0" />
                  <span>Priority creator support</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-border/80">
              <Button
                asChild
                className={`w-full text-sm font-mono font-bold h-12 rounded-xl ${landingTheme.primaryButton} flex items-center justify-center gap-2`}
              >
                <Link href="/signup?plan=pro">
                  <span>GET STARTED WITH PRO</span>
                  <IconArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Plan 3: Agency (Col-span 3) */}
          <div className="lg:col-span-3 rounded-2xl border border-border/80 bg-card p-6 sm:p-7 flex flex-col justify-between transition-all hover:border-border shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-lg bg-muted border border-border/70 flex items-center justify-center text-muted-foreground">
                    <IconBuildingStore className="size-4" />
                  </div>
                  <h3 className="font-bold text-base text-foreground">Agency</h3>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground">
                  Scale
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed min-h-[34px]">
                For marketing agencies &amp; high-volume teams needing 100% white-label.
              </p>

              <div className="my-5">
                <span className="text-3xl font-extrabold text-foreground font-mono">
                  {teamPrice.display}
                </span>
                <span className="text-xs text-muted-foreground ml-1">{teamPrice.period}</span>
                <span className="text-[11px] text-muted-foreground block mt-1">
                  {teamPrice.subtext}
                </span>
              </div>

              <div className="border-t border-border/60 pt-4 space-y-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <IconCheck className="size-4 text-emerald-500 shrink-0" />
                  <span>Everything in Pro</span>
                </div>
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <IconCheck className="size-4 text-emerald-500 shrink-0" />
                  <span>100,000 responses / mo</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCheck className="size-4 text-emerald-500 shrink-0" />
                  <span>100% White-label (No watermark)</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCheck className="size-4 text-emerald-500 shrink-0" />
                  <span>Instant webhooks to APIs</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCheck className="size-4 text-emerald-500 shrink-0" />
                  <span>Multi-theme custom palettes</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-border/60">
              <Button
                asChild
                variant="outline"
                className="w-full text-xs font-semibold h-10 border-border bg-card hover:bg-muted text-foreground cursor-pointer"
              >
                <Link href="/signup?plan=agency">Get Agency Access</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Minimal Trust Strip */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-xs font-mono text-muted-foreground border-y border-border/60 py-4">
          <div className="flex items-center gap-2">
            <IconShieldCheck className="size-4 text-emerald-500" />
            <span>30-DAY REFUND GUARANTEE</span>
          </div>
          <div className="flex items-center gap-2">
            <IconCheck className="size-4 text-emerald-500" />
            <span>CANCEL ANYTIME</span>
          </div>
          <div className="flex items-center gap-2">
            <IconCheck className="size-4 text-emerald-500" />
            <span>NO CARD REQUIRED FOR STARTER</span>
          </div>
        </div>
      </section>

      {/* 4. ARCHITECTURAL BENTO GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold text-lime-800 dark:text-[#CCFF00] uppercase tracking-widest block mb-2">
            ENGINEERING CRAFT
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Built for high conversion &amp; clean workflows
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Key tools designed to eliminate drop-offs and collect reliable data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Bento 1: Custom Slugs */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 hover:border-lime-600/40 dark:hover:border-[#CCFF00]/40 transition-all group shadow-xs">
            <div className="size-10 rounded-xl bg-muted border border-border/70 text-lime-800 dark:text-[#CCFF00] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <IconLink className="size-5" />
            </div>
            <h4 className="font-bold text-base text-foreground">Custom Brand Slugs</h4>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Clean shareable links like{" "}
              <span className="text-lime-800 dark:text-[#CCFF00] font-mono">/f/founder-q3</span>{" "}
              rather than long random query strings.
            </p>
          </div>

          {/* Bento 2: Expiry & Caps */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 hover:border-lime-600/40 dark:hover:border-[#CCFF00]/40 transition-all group shadow-xs">
            <div className="size-10 rounded-xl bg-muted border border-border/70 text-lime-800 dark:text-[#CCFF00] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <IconClock className="size-5" />
            </div>
            <h4 className="font-bold text-base text-foreground">Auto-Close &amp; Caps</h4>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Auto-close registrations when 100 entries are hit, or set an automated deadline.
            </p>
          </div>

          {/* Bento 3: Password Protection */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 hover:border-lime-600/40 dark:hover:border-[#CCFF00]/40 transition-all group shadow-xs">
            <div className="size-10 rounded-xl bg-muted border border-border/70 text-lime-800 dark:text-[#CCFF00] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <IconLock className="size-5" />
            </div>
            <h4 className="font-bold text-base text-foreground">Password Protection</h4>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Secure internal feedback, stakeholder forms, and confidential briefs behind passcodes.
            </p>
          </div>

          {/* Bento 4: Vector QR Generator */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 hover:border-lime-600/40 dark:hover:border-[#CCFF00]/40 transition-all group shadow-xs">
            <div className="size-10 rounded-xl bg-muted border border-border/70 text-lime-800 dark:text-[#CCFF00] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <IconQrcode className="size-5" />
            </div>
            <h4 className="font-bold text-base text-foreground">Vector QR Engine</h4>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Generate 1024px PNG and print-ready SVG QR codes in 5 curated brand palettes.
            </p>
          </div>
        </div>
      </section>

      {/* 5. FILTERABLE CAPABILITY MATRIX */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-24">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Detailed Capability Matrix
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Full technical breakdown across each subscription tier.
          </p>

          {/* Filter Pills */}
          <div className="mt-6 inline-flex p-1 rounded-xl bg-muted/60 border border-border/80 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveMatrixTab("all")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeMatrixTab === "all"
                  ? "bg-lime-600 dark:bg-[#CCFF00] text-white dark:text-[#0A0B0D] font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Features
            </button>
            <button
              type="button"
              onClick={() => setActiveMatrixTab("limits")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeMatrixTab === "limits"
                  ? "bg-lime-600 dark:bg-[#CCFF00] text-white dark:text-[#0A0B0D] font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Volume &amp; Limits
            </button>
            <button
              type="button"
              onClick={() => setActiveMatrixTab("design")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeMatrixTab === "design"
                  ? "bg-lime-600 dark:bg-[#CCFF00] text-white dark:text-[#0A0B0D] font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Branding
            </button>
            <button
              type="button"
              onClick={() => setActiveMatrixTab("security")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeMatrixTab === "security"
                  ? "bg-lime-600 dark:bg-[#CCFF00] text-white dark:text-[#0A0B0D] font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Security
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left border-collapse text-xs">
              <thead>
                <tr className="bg-muted/50 border-b border-border/80">
                  <th className="p-4 sm:p-5 font-bold text-foreground uppercase tracking-wider w-2/5 font-mono">
                    Capability
                  </th>
                  <th className="p-4 sm:p-5 font-bold text-muted-foreground uppercase tracking-wider text-center w-1/5 font-mono">
                    Starter
                  </th>
                  <th className="p-4 sm:p-5 font-bold text-lime-800 dark:text-[#CCFF00] uppercase tracking-wider text-center w-1/5 bg-lime-500/10 dark:bg-[#CCFF00]/[0.05] border-x border-lime-600/20 dark:border-[#CCFF00]/20 font-mono">
                    Pro Creator
                  </th>
                  <th className="p-4 sm:p-5 font-bold text-muted-foreground uppercase tracking-wider text-center w-1/5 font-mono">
                    Agency
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {(activeMatrixTab === "all" || activeMatrixTab === "limits") && (
                  <>
                    <tr className="hover:bg-muted/30">
                      <td className="p-4 font-medium text-foreground">Active Forms</td>
                      <td className="p-4 text-center text-muted-foreground font-mono">3</td>
                      <td className="p-4 text-center font-mono font-bold text-lime-800 dark:text-[#CCFF00] bg-lime-500/5 dark:bg-[#CCFF00]/[0.03] border-x border-lime-600/15 dark:border-[#CCFF00]/15">
                        UNLIMITED
                      </td>
                      <td className="p-4 text-center font-mono font-bold text-foreground">
                        UNLIMITED
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30">
                      <td className="p-4 font-medium text-foreground">Monthly Submissions</td>
                      <td className="p-4 text-center text-muted-foreground font-mono">250 / mo</td>
                      <td className="p-4 text-center font-mono font-bold text-lime-800 dark:text-[#CCFF00] bg-lime-500/5 dark:bg-[#CCFF00]/[0.03] border-x border-lime-600/15 dark:border-[#CCFF00]/15">
                        10,000 / mo
                      </td>
                      <td className="p-4 text-center font-mono font-bold text-foreground">
                        100,000 / mo
                      </td>
                    </tr>
                  </>
                )}

                {(activeMatrixTab === "all" || activeMatrixTab === "design") && (
                  <>
                    <tr className="hover:bg-muted/30">
                      <td className="p-4 font-medium text-foreground">Custom Brand URL Slug</td>
                      <td className="p-4 text-center">
                        <IconX className="size-4 text-muted-foreground/50 mx-auto" />
                      </td>
                      <td className="p-4 text-center bg-lime-500/5 dark:bg-[#CCFF00]/[0.03] border-x border-lime-600/15 dark:border-[#CCFF00]/15">
                        <IconCheck className="size-4 text-emerald-500 mx-auto" />
                      </td>
                      <td className="p-4 text-center">
                        <IconCheck className="size-4 text-emerald-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30">
                      <td className="p-4 font-medium text-foreground">
                        White-Label (Remove ChaiForm Badge)
                      </td>
                      <td className="p-4 text-center">
                        <IconX className="size-4 text-muted-foreground/50 mx-auto" />
                      </td>
                      <td className="p-4 text-center bg-lime-500/5 dark:bg-[#CCFF00]/[0.03] border-x border-lime-600/15 dark:border-[#CCFF00]/15">
                        <IconX className="size-4 text-muted-foreground/50 mx-auto" />
                      </td>
                      <td className="p-4 text-center">
                        <IconCheck className="size-4 text-emerald-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30">
                      <td className="p-4 font-medium text-foreground">
                        1024px High-Res Vector QR Codes
                      </td>
                      <td className="p-4 text-center text-muted-foreground font-mono">Standard</td>
                      <td className="p-4 text-center font-mono font-bold text-lime-800 dark:text-[#CCFF00] bg-lime-500/5 dark:bg-[#CCFF00]/[0.03] border-x border-lime-600/15 dark:border-[#CCFF00]/15">
                        PNG &amp; SVG
                      </td>
                      <td className="p-4 text-center font-mono font-bold text-foreground">
                        PNG &amp; SVG
                      </td>
                    </tr>
                  </>
                )}

                {(activeMatrixTab === "all" || activeMatrixTab === "security") && (
                  <>
                    <tr className="hover:bg-muted/30">
                      <td className="p-4 font-medium text-foreground">Password Protected Forms</td>
                      <td className="p-4 text-center">
                        <IconX className="size-4 text-muted-foreground/50 mx-auto" />
                      </td>
                      <td className="p-4 text-center bg-lime-500/5 dark:bg-[#CCFF00]/[0.03] border-x border-lime-600/15 dark:border-[#CCFF00]/15">
                        <IconCheck className="size-4 text-emerald-500 mx-auto" />
                      </td>
                      <td className="p-4 text-center">
                        <IconCheck className="size-4 text-emerald-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30">
                      <td className="p-4 font-medium text-foreground">
                        Auto-Close Expiry &amp; Response Limits
                      </td>
                      <td className="p-4 text-center">
                        <IconX className="size-4 text-muted-foreground/50 mx-auto" />
                      </td>
                      <td className="p-4 text-center bg-lime-500/5 dark:bg-[#CCFF00]/[0.03] border-x border-lime-600/15 dark:border-[#CCFF00]/15">
                        <IconCheck className="size-4 text-emerald-500 mx-auto" />
                      </td>
                      <td className="p-4 text-center">
                        <IconCheck className="size-4 text-emerald-500 mx-auto" />
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6. TECHNICAL FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-24">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Direct answers to subscription and platform questions.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "Do respondents need a ChaiForm account to submit?",
              a: "Never. Respondents fill and submit your forms anonymously on desktop or mobile with zero friction.",
            },
            {
              q: "Can I upgrade or downgrade whenever I want?",
              a: "Yes. Plan adjustments take effect immediately with prorated billing from your account settings.",
            },
            {
              q: "What happens if I hit my response limit on Starter?",
              a: "Your responses are never deleted. When you hit 250 responses, your form rests until your next 30-day reset cycle, or you can instantly upgrade to Pro for 10,000 responses.",
            },
            {
              q: "Which payment options are supported?",
              a: "We accept all major global credit cards (Visa, Mastercard, Amex). For Indian founders choosing INR, we support domestic cards, Netbanking, and instant UPI (GPay, PhonePe, Paytm).",
            },
          ].map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-border/80 bg-card overflow-hidden transition-all duration-200 shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-muted/40"
                >
                  <span className="font-semibold text-sm text-foreground">{faq.q}</span>
                  <IconChevronDown
                    className={`size-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-lime-800 dark:text-[#CCFF00]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs text-muted-foreground leading-relaxed border-t border-border/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
