"use client";

import Link from "next/link";
import {
  IconSparkles,
  IconArrowRight,
  IconCode,
  IconTerminal2,
  IconFileSpreadsheet,
  IconBrandSlack,
  IconWebhook,
  IconMail,
  IconBrandNextjs,
  IconWorld,
  IconShieldCheck,
  IconBolt,
  IconCheck,
} from "@tabler/icons-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { IntegrationsSection } from "~/components/landing/integrations-section";
import { CtaSection } from "~/components/landing/cta-section";
import { useUser } from "~/hooks/api/auth";

export function IntegrationsView() {
  const { user } = useUser();
  const ctaHref = user ? "/dashboard" : "/signup";

  const developerQuickstart = [
    {
      step: "01",
      title: "Grab Your 1-Line Embed",
      desc: "Choose between React/Next.js native component, HTML iframe, or Webflow script block.",
    },
    {
      step: "02",
      title: "Paste into Your Web Page",
      desc: "Zero custom CSS overrides required. The form automatically adopts your responsive viewport.",
    },
    {
      step: "03",
      title: "Listen to Live Webhooks",
      desc: "Point your HTTP endpoint to receive verified JSON payloads the instant answers are submitted.",
    },
  ];

  return (
    <div className="py-12 sm:py-16 md:py-20 relative bg-background text-foreground">
      {/* Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[460px] w-[800px] rounded-full bg-[#CCFF00]/[0.06] blur-[160px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge
            variant="outline"
            className="text-xs px-3.5 py-1 border-[#CCFF00]/30 bg-[#CCFF00]/10 text-[#CCFF00] gap-1.5 mb-4 shadow-xs"
          >
            <IconSparkles className="size-3.5" />
            <span>Developer Studio &amp; Integrations</span>
          </Badge>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.08]">
            Connect ChaiForm to your website, CRM &amp; database.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Embed conversational forms anywhere with 1-line code snippets. Stream responses
            automatically into Google Sheets, Slack, or your custom webhook endpoints.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="h-12 px-8 text-sm font-bold bg-[#CCFF00] text-[#0A0B0D] hover:bg-[#b8e600] active:scale-[0.99] shadow-lg shadow-[#CCFF00]/25 transition-all cursor-pointer gap-2"
            >
              <Link href={ctaHref}>
                <span>{user ? "Open Developer Hub" : "Start Embedding Free"}</span>
                <IconArrowRight className="size-4.5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-6 text-sm font-medium border-border/80 bg-card/60 hover:bg-muted/80 backdrop-blur-xs cursor-pointer"
            >
              <Link href="/templates">Explore Embed Templates</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Embed Generator & Ecosystem Section */}
      <IntegrationsSection />

      {/* Developer Quickstart Steps */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold text-[#CCFF00] uppercase tracking-wider">
            Simple 3-Step Setup
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-2">
            Up and Running in Under 60 Seconds
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {developerQuickstart.map((qs) => (
            <div
              key={qs.step}
              className="rounded-2xl border border-border/80 bg-card p-6 flex flex-col justify-between hover:border-[#CCFF00]/40 transition-colors shadow-xs"
            >
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#CCFF00]">
                  {qs.step} <IconArrowRight className="size-3" />
                </span>
                <h3 className="text-lg font-bold text-foreground mt-2">{qs.title}</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{qs.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/60 text-[10px] font-mono text-emerald-500 flex items-center gap-1">
                <IconCheck className="size-3" /> ZERO RE-BUILD REQUIRED
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <CtaSection />
    </div>
  );
}
