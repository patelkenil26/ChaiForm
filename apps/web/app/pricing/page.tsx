"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconCheck,
  IconSparkles,
  IconArrowRight,
  IconHelpCircle,
  IconShieldCheck,
  IconBolt,
  IconFlame,
  IconBuildingStore,
} from "@tabler/icons-react";
import { LandingNavbar } from "~/components/landing/navbar";
import { LandingFooter } from "~/components/landing/footer";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { landingTheme } from "~/config/landing-theme";

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col ${landingTheme.selection}`}>
      <LandingNavbar />

      <main className="flex-1">
        {/* Hero Section */}
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
              <span>Simple, Predictable Pricing</span>
            </Badge>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
              Invest in Higher Form Conversion
            </h1>

            <p className="mt-4 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              Start completely free, collect verified responses, and upgrade as your audience grows. No surprise charges or hidden limits.
            </p>

            {/* Monthly / Yearly Billing Toggle */}
            <div className="mt-8 flex items-center gap-3 p-1 rounded-xl bg-muted/60 border border-border/50">
              <button
                type="button"
                onClick={() => setIsYearly(false)}
                className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
                  !isYearly
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setIsYearly(true)}
                className={`flex items-center gap-2 px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
                  isYearly
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>Yearly Billing</span>
                <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4.5 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 font-bold">
                  SAVE 20%
                </Badge>
              </button>
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
                  <Badge variant="secondary" className="text-[10px] font-medium">Free Forever</Badge>
                </div>

                <p className="text-xs text-muted-foreground min-h-[36px]">
                  For indie hackers, students, and hobby projects exploring conversational forms.
                </p>

                <div className="mt-6 mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold tracking-tight">$0</span>
                    <span className="text-xs text-muted-foreground">/ month</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground block mt-1">Zero credit card required</span>
                </div>

                <div className="border-t border-border/40 pt-5 space-y-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <IconCheck className="size-4 text-emerald-500 shrink-0" />
                    <span>Up to 3 active live forms</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <IconCheck className="size-4 text-emerald-500 shrink-0" />
                    <span>250 submissions / month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconCheck className="size-4 text-emerald-500 shrink-0" />
                    <span>All 14 input question types</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconCheck className="size-4 text-emerald-500 shrink-0" />
                    <span>Standard conversational responder</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconCheck className="size-4 text-emerald-500 shrink-0" />
                    <span>Instant CSV & JSON data export</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconCheck className="size-4 text-emerald-500 shrink-0" />
                    <span>Impression & view analytics</span>
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
            <div className={`relative rounded-2xl ${landingTheme.cardHighlightBorder} p-6 sm:p-8 flex flex-col justify-between scale-[1.02]`}>
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <Badge className={`${landingTheme.cardHighlightBadge} font-bold text-[10px] tracking-wide uppercase px-3 py-1 shadow-sm border-none`}>
                  ★ Most Popular
                </Badge>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`flex size-8 items-center justify-center rounded-lg ${landingTheme.iconBg}`}>
                      <IconFlame className="size-4" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground">Pro Creator</h3>
                  </div>
                  <Badge variant="outline" className={`text-[10px] ${landingTheme.badge} font-medium`}>Growth</Badge>
                </div>

                <p className="text-xs text-muted-foreground min-h-[36px]">
                  For creators, startups, and developers building high-converting landing pages.
                </p>

                <div className="mt-6 mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold tracking-tight text-foreground">
                      {isYearly ? "$15" : "$19"}
                    </span>
                    <span className="text-xs text-muted-foreground">/ month</span>
                  </div>
                  <span className={`text-[11px] ${landingTheme.primaryText} font-medium block mt-1`}>
                    {isYearly ? "Billed annually ($180/year) • Save $48" : "Billed monthly • Cancel anytime"}
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
                    <span>Response caps & auto-close expiry dates</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <IconCheck className={`size-4 ${landingTheme.iconColor} shrink-0`} />
                    <span>Custom URL slugs (/form/your-slug)</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <IconCheck className={`size-4 ${landingTheme.iconColor} shrink-0`} />
                    <span>High-res QR Code PNG generator</span>
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
                  <Badge variant="secondary" className="text-[10px] font-medium">Scale</Badge>
                </div>

                <p className="text-xs text-muted-foreground min-h-[36px]">
                  For marketing agencies, high-traffic SaaS products, and scaling teams.
                </p>

                <div className="mt-6 mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold tracking-tight">
                      {isYearly ? "$39" : "$49"}
                    </span>
                    <span className="text-xs text-muted-foreground">/ month</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground block mt-1">
                    {isYearly ? "Billed annually ($468/year)" : "Billed monthly • Cancel anytime"}
                  </span>
                </div>

                <div className="border-t border-border/40 pt-5 space-y-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <IconCheck className="size-4 text-emerald-500 shrink-0" />
                    <span>Everything in Pro tier included</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <IconCheck className="size-4 text-emerald-500 shrink-0" />
                    <span>100,000+ submissions / month</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <IconCheck className="size-4 text-emerald-500 shrink-0" />
                    <span>Remove &quot;Powered by ChaiForm&quot; badge</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <IconCheck className="size-4 text-emerald-500 shrink-0" />
                    <span>Chameleon Embed: Auto-match host site</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <IconCheck className="size-4 text-emerald-500 shrink-0" />
                    <span>Multi-client workspace organization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconCheck className="size-4 text-emerald-500 shrink-0" />
                    <span>Direct WhatsApp & Telegram alert webhooks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconCheck className="size-4 text-emerald-500 shrink-0" />
                    <span>Dedicated 99.9% uptime SLA</span>
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

          {/* Trust Guarantees Row */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-muted-foreground border-y border-border/40 py-6">
            <div className="flex items-center gap-2">
              <IconShieldCheck className="size-4 text-emerald-500" />
              <span>30-Day Money-Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <IconCheck className="size-4 text-emerald-500" />
              <span>Cancel or pause subscription in 1 click</span>
            </div>
            <div className="flex items-center gap-2">
              <IconCheck className="size-4 text-emerald-500" />
              <span>No credit card required for Starter</span>
            </div>
            <div className="flex items-center gap-2">
              <IconCheck className="size-4 text-emerald-500" />
              <span>SOC-2 & GDPR compliant infrastructure</span>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 bg-card p-5">
                <h4 className="font-semibold text-sm">Do my respondents need a ChaiForm account to submit?</h4>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  No! Respondents can fill out and submit your forms anonymously on desktop or mobile without any login, account creation, or friction.
                </p>
              </div>

              <div className="rounded-xl border border-border/60 bg-card p-5">
                <h4 className="font-semibold text-sm">Can I upgrade or downgrade my plan at any time?</h4>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Yes, you can upgrade, downgrade, or cancel your subscription whenever you wish from your account settings. Upgrades take effect immediately with prorated billing.
                </p>
              </div>

              <div className="rounded-xl border border-border/60 bg-card p-5">
                <h4 className="font-semibold text-sm">What happens if I exceed my monthly response limit?</h4>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  We never discard incoming customer leads. You will receive an email alert, and we provide a 7-day grace period to upgrade before additional submissions are paused.
                </p>
              </div>

              <div className="rounded-xl border border-border/60 bg-card p-5">
                <h4 className="font-semibold text-sm">Can I embed ChaiForm on my Next.js, Webflow, or WordPress site?</h4>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Yes! Every form includes a 1-click responsive iframe snippet and popup modal code that works seamlessly across Next.js, React, Webflow, Shopify, and plain HTML websites.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
