"use client";

import {
  IconTargetArrow,
  IconTicket,
  IconMessageHeart,
  IconBriefcase,
  IconCheck,
  IconArrowRight,
  IconSparkles,
} from "@tabler/icons-react";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { landingTheme } from "~/config/landing-theme";

const USE_CASES = [
  {
    icon: IconTargetArrow,
    tag: "For Marketers & Growth",
    title: "Lead Generation & Waitlists",
    description:
      "Replace boring lead capture forms with conversational step-by-step qualification. Gather verified emails and high-intent prospect details with zero drop-off.",
    features: [
      "Custom branded thank-you redirects",
      "Instant email notifications on new leads",
      "One-click embed on Webflow, Framer, and Next.js",
    ],
    badgeColor: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    glowColor: "from-amber-500/10",
  },
  {
    icon: IconTicket,
    tag: "For Event Organizers",
    title: "Event RSVPs & Ticket Registrations",
    description:
      "Distribute forms at physical venues or online. Print ready-to-scan 1024px QR codes on flyers and cap registrations automatically with capacity limits.",
    features: [
      "Print-ready QR codes with designer themes",
      "Hard response limits (auto-close at capacity)",
      "Mobile-optimized for quick phone check-ins",
    ],
    badgeColor: "border-purple-500/30 bg-purple-500/10 text-purple-300",
    glowColor: "from-purple-500/10",
  },
  {
    icon: IconMessageHeart,
    tag: "For Product & Support",
    title: "Customer Satisfaction & Feedback",
    description:
      "Uncover real user sentiment with 5-star rating bars, multi-select satisfaction options, and long-form feedback questions respondents enjoy completing.",
    features: [
      "Visual 5-star rating questions",
      "Password protection for confidential beta testing",
      "Direct CSV & Excel data exports",
    ],
    badgeColor: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    glowColor: "from-emerald-500/10",
  },
  {
    icon: IconBriefcase,
    tag: "For People Ops & HR",
    title: "Job Applications & Candidate Intake",
    description:
      "Screen applicants smoothly without cumbersome multi-page portals. Collect resume URLs, portfolio links, and salary expectations in one modern flow.",
    features: [
      "Validated URL, phone, and email fields",
      "Centralized response inbox with search & filter",
      "Clean mobile experience for busy candidates",
    ],
    badgeColor: "border-sky-500/30 bg-sky-500/10 text-sky-300",
    glowColor: "from-sky-500/10",
  },
];

export function UseCasesSection() {
  return (
    <section id="use-cases" className="py-20 md:py-28 relative border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge
            variant="outline"
            className={`mb-3 gap-1.5 px-3 py-1 text-xs font-medium ${landingTheme.badge}`}
          >
            <IconSparkles className="size-3.5" />
            <span>Versatile Applications</span>
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Built for how you collect data.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Whether you are capturing leads, running live event registrations, or surveying customers,
            ChaiForm adapts to your workflow.
          </p>
        </div>

        {/* Use Cases 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {USE_CASES.map((uc) => {
            const Icon = uc.icon;
            return (
              <div
                key={uc.title}
                className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-xl hover:-translate-y-1 overflow-hidden"
              >
                {/* Subtle Top Gradient Flare */}
                <div
                  className={`pointer-events-none absolute -top-16 -right-16 size-36 rounded-full bg-gradient-to-br ${uc.glowColor} to-transparent blur-2xl group-hover:scale-150 transition-transform duration-500`}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-muted/60 border border-border/60 text-foreground group-hover:scale-105 transition-transform">
                      <Icon className="size-5" />
                    </div>
                  </div>

                  <Badge variant="outline" className={`text-[10px] font-semibold mb-3 ${uc.badgeColor}`}>
                    {uc.tag}
                  </Badge>

                  <h3 className="text-lg font-bold text-foreground tracking-tight mb-2">
                    {uc.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed mb-5">
                    {uc.description}
                  </p>

                  <div className="space-y-2 border-t border-border/40 pt-4">
                    {uc.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <IconCheck className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 mt-6 pt-4 border-t border-border/40">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between text-xs font-semibold h-8.5 px-2 hover:bg-muted/60 group-hover:text-foreground"
                  >
                    <Link href="/templates">
                      <span>Explore Templates</span>
                      <IconArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
