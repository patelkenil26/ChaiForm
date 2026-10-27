"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconCheck,
  IconSparkles,
  IconArrowRight,
  IconShieldCheck,
  IconBolt,
  IconFlame,
  IconBuildingStore,
  IconStarFilled,
  IconX,
  IconMail,
  IconHelpCircle,
} from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { landingTheme } from "~/config/landing-theme";

type Currency = "USD" | "INR";

export function PricingView() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [isYearly, setIsYearly] = useState(false);

  const getPrice = (plan: "starter" | "pro" | "team") => {
    if (plan === "starter") {
      return {
        display: currency === "USD" ? "$0" : "₹0",
        period: "/ month",
        subtext: "Free forever • No credit card needed",
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
    <div>
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-14 pb-12 md:pt-20 md:pb-16 text-center">
        {/* Subtle Ambient Glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
          <div className={`h-[340px] w-[640px] rounded-full ${landingTheme.heroGlow}`} />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <Badge
            variant="outline"
            className={`mb-4 gap-1.5 px-3 py-1 text-xs font-medium ${landingTheme.badge}`}
          >
            <IconSparkles className="size-3.5" />
            <span>Honest & Transparent Pricing</span>
          </Badge>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            Higher form conversion,{" "}
            <span className={landingTheme.gradientText}>without the Typeform bill</span>
          </h1>

          <p className="mt-4 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Start completely free, collect verified responses, and upgrade as your audience grows.
            No surprise fees or lock-in.
          </p>

          {/* Controls: Currency + Billing Frequency */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {/* Currency Selector */}
            <div className="flex items-center p-1 rounded-xl bg-muted/60 border border-border/50 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setCurrency("USD")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  currency === "USD"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => setCurrency("INR")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  currency === "INR"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>INR (₹)</span>
                <span className="text-[10px] text-emerald-500 font-bold">UPI / Cards</span>
              </button>
            </div>

            {/* Monthly / Yearly Billing Toggle */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/50 text-xs sm:text-sm font-medium">
              <button
                type="button"
                onClick={() => setIsYearly(false)}
                className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                  !isYearly
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setIsYearly(true)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                  isYearly
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>Yearly</span>
                <Badge
                  variant="outline"
                  className="text-[10px] py-0 px-1.5 h-4.5 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 font-bold"
                >
                  SAVE 20%
                </Badge>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="py-8 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* 1. Free Starter */}
          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xs p-6 sm:p-8 flex flex-col justify-between transition hover:border-border">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <IconBolt className="size-4" />
                  </div>
                  <h3 className="font-bold text-lg">Starter</h3>
                </div>
                <Badge variant="secondary" className="text-[10px] font-medium">
                  Free Forever
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground min-h-[36px]">
                For indie makers, students, and hobby projects exploring conversational forms.
              </p>

              <div className="mt-6 mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight">
                    {starterPrice.display}
                  </span>
                  <span className="text-xs text-muted-foreground">{starterPrice.period}</span>
                </div>
                <span className="text-[11px] text-muted-foreground block mt-1">
                  {starterPrice.subtext}
                </span>
              </div>

              <div className="border-t border-border/40 pt-5 space-y-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <IconCheck className="size-4 text-emerald-500 shrink-0" />
                  <span>Up to 3 active live forms</span>
                </div>
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <IconCheck className="size-4 text-emerald-500 shrink-0" />
                  <span>250 submissions / month (resets monthly)</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCheck className="size-4 text-emerald-500 shrink-0" />
                  <span>All 14 question input types</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCheck className="size-4 text-emerald-500 shrink-0" />
                  <span>Keyboard-first conversational runner</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCheck className="size-4 text-emerald-500 shrink-0" />
                  <span>Instant CSV data export</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCheck className="size-4 text-emerald-500 shrink-0" />
                  <span>Standard 1-line iframe embed</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-border/40">
              <Button asChild variant="outline" className="w-full text-xs font-semibold h-10">
                <Link href="/signup">Start Free Today</Link>
              </Button>
            </div>
          </div>

          {/* 2. Pro Creator (Most Popular) */}
          <div
            className={`relative rounded-2xl ${landingTheme.cardHighlightBorder} p-6 sm:p-8 flex flex-col justify-between md:scale-[1.02]`}
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <Badge
                className={`${landingTheme.cardHighlightBadge} font-bold text-[10px] tracking-wide uppercase px-3 py-1 shadow-sm border-none flex items-center gap-1`}
              >
                <IconStarFilled className="size-3 text-neutral-950" /> Most Popular
              </Badge>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex size-8 items-center justify-center rounded-lg ${landingTheme.iconBg}`}
                  >
                    <IconFlame className="size-4" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground">Pro Creator</h3>
                </div>
                <Badge
                  variant="outline"
                  className={`text-[10px] ${landingTheme.badge} font-medium`}
                >
                  Growth
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground min-h-[36px]">
                For creators, founders, and startups looking to collect and manage serious leads.
              </p>

              <div className="mt-6 mb-6">
                <div className="flex items-baseline gap-2">
                  {isYearly && (
                    <span className="text-xl line-through text-muted-foreground/60">
                      {currency === "USD" ? "$19" : "₹1,499"}
                    </span>
                  )}
                  <span className="text-4xl font-extrabold tracking-tight text-foreground">
                    {proPrice.display}
                  </span>
                  <span className="text-xs text-muted-foreground">{proPrice.period}</span>
                </div>
                <span className={`text-[11px] ${landingTheme.primaryText} font-medium block mt-1`}>
                  {proPrice.subtext}
                </span>
              </div>

              <div className="border-t border-border/40 pt-5 space-y-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <IconCheck className={`size-4 ${landingTheme.iconColor} shrink-0`} />
                  <span>Unlimited active live forms</span>
                </div>
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <IconCheck className={`size-4 ${landingTheme.iconColor} shrink-0`} />
                  <span>10,000 submissions / month</span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <IconCheck className={`size-4 ${landingTheme.iconColor} shrink-0`} />
                  <span>Password protection for confidential forms</span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <IconCheck className={`size-4 ${landingTheme.iconColor} shrink-0`} />
                  <span>Response caps & auto-close expiry deadlines</span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <IconCheck className={`size-4 ${landingTheme.iconColor} shrink-0`} />
                  <span>Custom URL slugs (/form/your-brand)</span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <IconCheck className={`size-4 ${landingTheme.iconColor} shrink-0`} />
                  <span>High-res 1024px QR Code PNG & SVG generator</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCheck className={`size-4 ${landingTheme.iconColor} shrink-0`} />
                  <span>Priority creator email support</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-border/40">
              <Button
                asChild
                className={`w-full text-xs font-semibold h-11 ${landingTheme.primaryButton}`}
              >
                <Link href="/signup?plan=pro">Get Started with Pro</Link>
              </Button>
            </div>
          </div>

          {/* 3. Team & Agency */}
          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xs p-6 sm:p-8 flex flex-col justify-between transition hover:border-border">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <IconBuildingStore className="size-4" />
                  </div>
                  <h3 className="font-bold text-lg">Team & Agency</h3>
                </div>
                <Badge variant="secondary" className="text-[10px] font-medium">
                  Scale
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground min-h-[36px]">
                For marketing agencies, high-traffic SaaS products, and scaling teams.
              </p>

              <div className="mt-6 mb-6">
                <div className="flex items-baseline gap-2">
                  {isYearly && (
                    <span className="text-xl line-through text-muted-foreground/60">
                      {currency === "USD" ? "$49" : "₹3,999"}
                    </span>
                  )}
                  <span className="text-4xl font-extrabold tracking-tight">
                    {teamPrice.display}
                  </span>
                  <span className="text-xs text-muted-foreground">{teamPrice.period}</span>
                </div>
                <span className="text-[11px] text-muted-foreground block mt-1">
                  {teamPrice.subtext}
                </span>
              </div>

              <div className="border-t border-border/40 pt-5 space-y-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <IconCheck className="size-4 text-emerald-500 shrink-0" />
                  <span>Everything in Pro tier included</span>
                </div>
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <IconCheck className="size-4 text-emerald-500 shrink-0" />
                  <span>100,000 submissions / month</span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <IconCheck className="size-4 text-emerald-500 shrink-0" />
                  <span>Remove &quot;Powered by ChaiForm&quot; branding</span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <IconCheck className="size-4 text-emerald-500 shrink-0" />
                  <span>Multi-theme QR styling (5 designer palettes)</span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <IconCheck className="size-4 text-emerald-500 shrink-0" />
                  <span>Instant webhook delivery to custom endpoints</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCheck className="size-4 text-emerald-500 shrink-0" />
                  <span>Priority founder support & feature onboarding</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-border/40">
              <Button asChild variant="outline" className="w-full text-xs font-semibold h-10">
                <Link href="/signup?plan=agency">Get Agency Access</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Trust Guarantees Row (Immediately below cards) */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-muted-foreground border-y border-border/40 py-4">
          <div className="flex items-center gap-1.5">
            <IconShieldCheck className="size-4 text-emerald-500" />
            <span>30-Day Money-Back Guarantee</span>
          </div>
          <div className="flex items-center gap-1.5">
            <IconCheck className="size-4 text-emerald-500" />
            <span>Cancel anytime from your dashboard</span>
          </div>
          <div className="flex items-center gap-1.5">
            <IconCheck className="size-4 text-emerald-500" />
            <span>No credit card required for Starter</span>
          </div>
          <div className="flex items-center gap-1.5">
            <IconCheck className="size-4 text-emerald-500" />
            <span>SSL encrypted submissions</span>
          </div>
        </div>

        {/* Custom Plan / Enterprise Banner */}
        <div className="mt-8 rounded-2xl border border-border/60 bg-card/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="size-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <IconMail className="size-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground">
                Need a custom plan or higher volume?
              </h4>
              <p className="text-xs text-muted-foreground">
                Custom submission limits, dedicated invoicing, and tailored support for high-volume
                teams.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="shrink-0 text-xs gap-1.5">
            <a href="mailto:support@chaiform.kenilpatel.in?subject=Custom%20Plan%20Inquiry">
              <span>Contact Us for Custom Plan</span>
              <IconArrowRight className="size-3.5" />
            </a>
          </Button>
        </div>

        {/* Full Feature Comparison Matrix */}
        <div className="mt-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge
              variant="outline"
              className={`mb-3 gap-1.5 px-3 py-1 text-xs font-medium ${landingTheme.badge}`}
            >
              <IconSparkles className="size-3.5" />
              <span>Side-by-Side</span>
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Compare All Plan Features
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
              Detailed breakdown of features and capabilities across each tier.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-muted/60 border-b border-border/60">
                    <th className="p-4 sm:p-5 font-semibold text-muted-foreground uppercase tracking-wider w-2/5">
                      Feature
                    </th>
                    <th className="p-4 sm:p-5 font-semibold text-foreground text-center w-1/5">
                      Starter
                    </th>
                    <th
                      className={`p-4 sm:p-5 font-bold ${landingTheme.primaryText} text-center w-1/5 bg-primary/5`}
                    >
                      Pro Creator
                    </th>
                    <th className="p-4 sm:p-5 font-semibold text-foreground text-center w-1/5">
                      Team & Agency
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {/* Category: Volume & Limits */}
                  <tr className="bg-muted/30">
                    <td
                      colSpan={4}
                      className="p-3 px-5 font-bold text-foreground text-xs uppercase tracking-wider"
                    >
                      Volume & Limits
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-medium text-foreground">Active Forms</td>
                    <td className="p-4 sm:p-5 text-center text-muted-foreground">3 Forms</td>
                    <td className="p-4 sm:p-5 text-center font-semibold text-foreground bg-primary/5">
                      Unlimited
                    </td>
                    <td className="p-4 sm:p-5 text-center font-semibold text-foreground">
                      Unlimited
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-medium text-foreground">Monthly Submissions</td>
                    <td className="p-4 sm:p-5 text-center text-muted-foreground">250 / mo</td>
                    <td className="p-4 sm:p-5 text-center font-semibold text-foreground bg-primary/5">
                      10,000 / mo
                    </td>
                    <td className="p-4 sm:p-5 text-center font-semibold text-foreground">
                      100,000 / mo
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-medium text-foreground">Over-Limit Behavior</td>
                    <td className="p-4 sm:p-5 text-center text-muted-foreground">
                      Resets next month
                    </td>
                    <td className="p-4 sm:p-5 text-center font-semibold text-emerald-500 bg-primary/5">
                      Email alert + grace period
                    </td>
                    <td className="p-4 sm:p-5 text-center font-semibold text-emerald-500">
                      Auto-scale available
                    </td>
                  </tr>

                  {/* Category: Question Types & Design */}
                  <tr className="bg-muted/30">
                    <td
                      colSpan={4}
                      className="p-3 px-5 font-bold text-foreground text-xs uppercase tracking-wider"
                    >
                      Form Builder & Question Types
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-medium text-foreground">
                      Branded Forms &amp; Custom Slugs
                    </td>
                    <td className="p-4 sm:p-5 text-center text-muted-foreground">Standard slug</td>
                    <td className="p-4 sm:p-5 text-center font-semibold text-emerald-500 bg-primary/5">
                      Custom slug (/form/your-brand)
                    </td>
                    <td className="p-4 sm:p-5 text-center font-semibold text-emerald-500">
                      White-label + Custom slug
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-medium text-foreground">
                      14 Specialized Field Types
                    </td>
                    <td className="p-4 sm:p-5 text-center">
                      <IconCheck className="size-4 text-emerald-500 mx-auto" />
                    </td>
                    <td className="p-4 sm:p-5 text-center bg-primary/5">
                      <IconCheck className="size-4 text-emerald-500 mx-auto" />
                    </td>
                    <td className="p-4 sm:p-5 text-center">
                      <IconCheck className="size-4 text-emerald-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-medium text-foreground">
                      Conversational 1-At-A-Time Flow
                    </td>
                    <td className="p-4 sm:p-5 text-center">
                      <IconCheck className="size-4 text-emerald-500 mx-auto" />
                    </td>
                    <td className="p-4 sm:p-5 text-center bg-primary/5">
                      <IconCheck className="size-4 text-emerald-500 mx-auto" />
                    </td>
                    <td className="p-4 sm:p-5 text-center">
                      <IconCheck className="size-4 text-emerald-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-medium text-foreground">
                      Custom URL Slugs (/form/my-brand)
                    </td>
                    <td className="p-4 sm:p-5 text-center">
                      <IconX className="size-4 text-muted-foreground/40 mx-auto" />
                    </td>
                    <td className="p-4 sm:p-5 text-center bg-primary/5">
                      <IconCheck className="size-4 text-emerald-500 mx-auto" />
                    </td>
                    <td className="p-4 sm:p-5 text-center">
                      <IconCheck className="size-4 text-emerald-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-medium text-foreground">
                      Remove ChaiForm Branding
                    </td>
                    <td className="p-4 sm:p-5 text-center">
                      <IconX className="size-4 text-muted-foreground/40 mx-auto" />
                    </td>
                    <td className="p-4 sm:p-5 text-center bg-primary/5">
                      <IconX className="size-4 text-muted-foreground/40 mx-auto" />
                    </td>
                    <td className="p-4 sm:p-5 text-center">
                      <IconCheck className="size-4 text-emerald-500 mx-auto" />
                    </td>
                  </tr>

                  {/* Category: Security & Control */}
                  <tr className="bg-muted/30">
                    <td
                      colSpan={4}
                      className="p-3 px-5 font-bold text-foreground text-xs uppercase tracking-wider"
                    >
                      Security & Form Access Controls
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-medium text-foreground">
                      Password Protected Forms
                    </td>
                    <td className="p-4 sm:p-5 text-center">
                      <IconX className="size-4 text-muted-foreground/40 mx-auto" />
                    </td>
                    <td className="p-4 sm:p-5 text-center bg-primary/5">
                      <IconCheck className="size-4 text-emerald-500 mx-auto" />
                    </td>
                    <td className="p-4 sm:p-5 text-center">
                      <IconCheck className="size-4 text-emerald-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-medium text-foreground">
                      Automatic Submission Cap (Max Responses)
                    </td>
                    <td className="p-4 sm:p-5 text-center">
                      <IconX className="size-4 text-muted-foreground/40 mx-auto" />
                    </td>
                    <td className="p-4 sm:p-5 text-center bg-primary/5">
                      <IconCheck className="size-4 text-emerald-500 mx-auto" />
                    </td>
                    <td className="p-4 sm:p-5 text-center">
                      <IconCheck className="size-4 text-emerald-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-medium text-foreground">
                      Auto-Close Expiry Date & Time
                    </td>
                    <td className="p-4 sm:p-5 text-center">
                      <IconX className="size-4 text-muted-foreground/40 mx-auto" />
                    </td>
                    <td className="p-4 sm:p-5 text-center bg-primary/5">
                      <IconCheck className="size-4 text-emerald-500 mx-auto" />
                    </td>
                    <td className="p-4 sm:p-5 text-center">
                      <IconCheck className="size-4 text-emerald-500 mx-auto" />
                    </td>
                  </tr>

                  {/* Category: Distribution & QR */}
                  <tr className="bg-muted/30">
                    <td
                      colSpan={4}
                      className="p-3 px-5 font-bold text-foreground text-xs uppercase tracking-wider"
                    >
                      Sharing, QR & Embeds
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-medium text-foreground">
                      Responsive iframe Embed Code
                    </td>
                    <td className="p-4 sm:p-5 text-center">
                      <IconCheck className="size-4 text-emerald-500 mx-auto" />
                    </td>
                    <td className="p-4 sm:p-5 text-center bg-primary/5">
                      <IconCheck className="size-4 text-emerald-500 mx-auto" />
                    </td>
                    <td className="p-4 sm:p-5 text-center">
                      <IconCheck className="size-4 text-emerald-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-medium text-foreground">
                      1024px High-Res QR Code PNG
                    </td>
                    <td className="p-4 sm:p-5 text-center text-muted-foreground">Standard Black</td>
                    <td className="p-4 sm:p-5 text-center font-semibold text-foreground bg-primary/5">
                      High-Res PNG
                    </td>
                    <td className="p-4 sm:p-5 text-center font-semibold text-foreground">
                      PNG & Vector SVG
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-medium text-foreground">
                      Designer QR Color Palettes
                    </td>
                    <td className="p-4 sm:p-5 text-center">
                      <IconX className="size-4 text-muted-foreground/40 mx-auto" />
                    </td>
                    <td className="p-4 sm:p-5 text-center text-muted-foreground bg-primary/5">
                      3 Palettes
                    </td>
                    <td className="p-4 sm:p-5 text-center font-semibold text-foreground">
                      5 Palettes + Vector
                    </td>
                  </tr>

                  {/* Category: Data & Support */}
                  <tr className="bg-muted/30">
                    <td
                      colSpan={4}
                      className="p-3 px-5 font-bold text-foreground text-xs uppercase tracking-wider"
                    >
                      Analytics, Data Export & Support
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-medium text-foreground">
                      Live Submissions Inbox
                    </td>
                    <td className="p-4 sm:p-5 text-center">
                      <IconCheck className="size-4 text-emerald-500 mx-auto" />
                    </td>
                    <td className="p-4 sm:p-5 text-center bg-primary/5">
                      <IconCheck className="size-4 text-emerald-500 mx-auto" />
                    </td>
                    <td className="p-4 sm:p-5 text-center">
                      <IconCheck className="size-4 text-emerald-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-medium text-foreground">CSV & JSON Export</td>
                    <td className="p-4 sm:p-5 text-center">
                      <IconCheck className="size-4 text-emerald-500 mx-auto" />
                    </td>
                    <td className="p-4 sm:p-5 text-center bg-primary/5">
                      <IconCheck className="size-4 text-emerald-500 mx-auto" />
                    </td>
                    <td className="p-4 sm:p-5 text-center">
                      <IconCheck className="size-4 text-emerald-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-medium text-foreground">Support Tier</td>
                    <td className="p-4 sm:p-5 text-center text-muted-foreground">
                      Community & Help Center
                    </td>
                    <td className="p-4 sm:p-5 text-center font-semibold text-foreground bg-primary/5">
                      Priority Email
                    </td>
                    <td className="p-4 sm:p-5 text-center font-semibold text-foreground">
                      Founder & Dedicated Email
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-center mb-8">Pricing FAQs</h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-border/60 bg-card p-5">
              <h4 className="font-semibold text-sm">
                Do my respondents need a ChaiForm account to submit?
              </h4>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                No! Respondents can fill out and submit your forms anonymously on desktop or mobile
                without any login, account creation, or friction.
              </p>
            </div>

            <div className="rounded-xl border border-border/60 bg-card p-5">
              <h4 className="font-semibold text-sm">
                Can I upgrade or downgrade my plan at any time?
              </h4>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Yes, you can upgrade, downgrade, or cancel your subscription whenever you wish from
                your account settings. Upgrades take effect immediately with prorated billing.
              </p>
            </div>

            <div className="rounded-xl border border-border/60 bg-card p-5">
              <h4 className="font-semibold text-sm">
                What happens if I reach my monthly response limit on Starter?
              </h4>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Your responses are never deleted. When you hit 250 responses, your form simply rests
                until your next 30-day reset cycle, or you can upgrade to Pro at any time for 10,000
                responses.
              </p>
            </div>

            <div className="rounded-xl border border-border/60 bg-card p-5">
              <h4 className="font-semibold text-sm">Which payment methods are accepted?</h4>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                We accept all major credit and debit cards globally (Visa, Mastercard, American
                Express). For Indian creators choosing INR, we support UPI (Google Pay, PhonePe,
                Paytm), Netbanking, and domestic cards.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
