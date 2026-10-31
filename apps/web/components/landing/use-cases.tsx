"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconTargetArrow,
  IconTicket,
  IconMessageHeart,
  IconBriefcase,
  IconCheck,
  IconArrowRight,
  IconSparkles,
  IconCornerDownLeft,
  IconStarFilled,
  IconQrcode,
  IconUpload,
  IconShieldCheck,
  IconDeviceLaptop,
} from "@tabler/icons-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

type PersonaKey = "leads" | "events" | "feedback" | "hiring";

interface PersonaData {
  id: PersonaKey;
  icon: typeof IconTargetArrow;
  tag: string;
  title: string;
  headline: string;
  description: string;
  features: string[];
  templateHref: string;
  templateLabel: string;
}

const PERSONAS: PersonaData[] = [
  {
    id: "leads",
    icon: IconTargetArrow,
    tag: "For Marketers & Growth",
    title: "Lead Gen & Waitlists",
    headline: "Replace clunky static lead capture with conversational qualification.",
    description:
      "Qualify high-intent enterprise prospects 1 question at a time. Verified emails stream directly into your CRM or spreadsheet.",
    features: [
      "Custom branded thank-you redirects",
      "Instant email alerts on high-score leads",
      "One-click embed on Webflow, Framer, and Next.js",
    ],
    templateHref: "/templates",
    templateLabel: "Browse Lead Gen Templates",
  },
  {
    id: "events",
    icon: IconTicket,
    tag: "For Event Organizers",
    title: "Event RSVPs & Tickets",
    headline: "Distribute forms via instant links and 1024px print-ready QR codes.",
    description:
      "Cap registrations automatically when capacity is reached. Print designer QR codes on table cards, badges, or venue flyers.",
    features: [
      "Print-ready vector QR codes with brand themes",
      "Hard response limits (auto-close at capacity)",
      "Mobile-optimized phone check-in experience",
    ],
    templateHref: "/templates",
    templateLabel: "Browse Event RSVP Templates",
  },
  {
    id: "feedback",
    icon: IconMessageHeart,
    tag: "For Product & Support",
    title: "Customer Sentiment & CSAT",
    headline: "Uncover real customer pain points with frictionless rating flows.",
    description:
      "Gather candid product feedback respondents actually finish. 5-star rating scales and smart single-choice options maximize completion.",
    features: [
      "Visual 5-star rating scales with animated feedback",
      "Confidential password protection for private betas",
      "1-Click CSV and automated webhook streaming",
    ],
    templateHref: "/templates",
    templateLabel: "Browse Feedback Templates",
  },
  {
    id: "hiring",
    icon: IconBriefcase,
    tag: "For People Ops & HR",
    title: "Candidate & Job Intake",
    headline: "Screen candidates without intimidating multi-page application portals.",
    description:
      "Collect resume uploads, portfolio URLs, and compensation expectations in one modern flow that works beautifully on mobile devices.",
    features: [
      "Validated portfolio URL and file upload inputs",
      "Centralized response hub with search and filters",
      "Clean mobile candidate experience with zero login needed",
    ],
    templateHref: "/templates",
    templateLabel: "Browse Hiring Templates",
  },
];

export function UseCasesSection() {
  const [activePersona, setActivePersona] = useState<PersonaKey>("leads");

  // Interactive micro-simulation state for each persona
  const [leadEmail, setLeadEmail] = useState("");
  const [eventTickets, setEventTickets] = useState(2);
  const [feedbackRating, setFeedbackRating] = useState(5);

  const current = PERSONAS.find((p) => p.id === activePersona) ?? PERSONAS[0]!;

  return (
    <section
      id="use-cases"
      className="py-20 md:py-28 relative bg-background text-foreground border-t border-border/40"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge
            variant="outline"
            className="text-xs px-3.5 py-1 border-lime-600/30 dark:border-[#CCFF00]/30 bg-lime-500/10 dark:bg-[#CCFF00]/10 text-lime-800 dark:text-[#CCFF00] gap-1.5 mb-4 shadow-xs font-semibold"
          >
            <IconSparkles className="size-3.5" />
            <span>Built For Your Workflow</span>
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Built for how you collect data.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Whether you are qualifying inbound leads, running physical event check-ins, or measuring
            customer sentiment, ChaiForm adapts seamlessly.
          </p>
        </div>

        {/* Persona Tabs Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-8">
          {PERSONAS.map((p) => {
            const Icon = p.icon;
            const isActive = activePersona === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePersona(p.id)}
                className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  isActive
                    ? "border-lime-600 dark:border-[#CCFF00] bg-lime-500/10 dark:bg-[#CCFF00]/10 text-foreground shadow-md ring-1 ring-lime-600/30 dark:ring-[#CCFF00]/40"
                    : "border-border bg-card text-muted-foreground hover:border-lime-600/40 dark:hover:border-[#CCFF00]/40 hover:text-foreground shadow-xs"
                }`}
              >
                <div
                  className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive
                      ? "bg-lime-600 dark:bg-[#CCFF00] text-white dark:text-[#0A0B0D] font-bold"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">{p.title}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{p.tag}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dual-Column Interactive Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center rounded-2xl border border-border/80 bg-card p-6 sm:p-10 shadow-xl relative overflow-hidden">
          {/* Top Hairline Beam Glow */}
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-lime-600/60 dark:via-[#CCFF00]/60 to-transparent" />

          {/* Left Column: Persona Details & Bullets */}
          <div className="lg:col-span-5 space-y-5">
            <Badge
              variant="outline"
              className="text-xs font-mono border-lime-600/30 dark:border-[#CCFF00]/30 text-lime-800 dark:text-[#CCFF00] bg-lime-500/10 dark:bg-[#CCFF00]/10"
            >
              {current.tag}
            </Badge>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-snug">
              {current.headline}
            </h3>

            <p className="text-sm text-muted-foreground leading-relaxed">{current.description}</p>

            <div className="space-y-2.5 pt-2 border-t border-border/60">
              {current.features.map((feat) => (
                <div key={feat} className="flex items-start gap-2.5 text-xs text-foreground/90">
                  <div className="size-4 rounded-full bg-lime-500/15 dark:bg-[#CCFF00]/15 text-lime-800 dark:text-[#CCFF00] flex items-center justify-center shrink-0 mt-0.5">
                    <IconCheck className="size-2.5 stroke-[3]" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-3">
              <Button
                asChild
                size="sm"
                className="bg-lime-600 dark:bg-[#CCFF00] text-white dark:text-[#0A0B0D] hover:bg-lime-700 dark:hover:bg-[#b8e600] font-bold text-xs gap-1.5 cursor-pointer shadow-md"
              >
                <Link href={current.templateHref}>
                  <span>{current.templateLabel}</span>
                  <IconArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column: LIVING ANIMATED FORM SIMULATOR */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-xl relative min-h-[360px] flex flex-col justify-between">
              {/* Form Window Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-border/60 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-muted-foreground uppercase text-[11px] font-semibold">
                    LIVE CONVERSATIONAL SIMULATOR
                  </span>
                </div>
                <span className="text-[11px] text-lime-800 dark:text-[#CCFF00] font-bold">
                  {activePersona.toUpperCase()} • STEP 1 OF 3
                </span>
              </div>

              {/* Progress Line */}
              <div className="w-full bg-muted h-1 rounded-full overflow-hidden mt-3 border border-border/40">
                <div className="bg-lime-600 dark:bg-[#CCFF00] h-full w-[33%]" />
              </div>

              {/* SIMULATED QUESTION FOR PERSONA 1: LEADS */}
              {activePersona === "leads" && (
                <div className="my-auto py-6 space-y-4">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-lime-800 dark:text-[#CCFF00]">
                      01 <IconArrowRight className="size-3" />
                    </span>
                    <h4 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                      Where should we dispatch your enterprise growth playbook?
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      We’ll verify your email and send instant access.
                    </p>
                  </div>

                  <div className="pt-2">
                    <div className="relative">
                      <Input
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        placeholder="work.email@company.com"
                        className="h-12 text-sm px-4 rounded-xl border-border bg-background font-mono text-foreground focus-visible:ring-lime-600/40 dark:focus-visible:ring-[#CCFF00]/40"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-semibold">
                        <IconShieldCheck className="size-3" />
                        <span>Valid format</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      className="h-9 px-4 rounded-lg bg-lime-600 dark:bg-[#CCFF00] text-white dark:text-[#0A0B0D] font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-lime-700 dark:hover:bg-[#b8e600] transition-colors shadow-xs"
                    >
                      <span>Continue</span>
                      <IconCornerDownLeft className="size-3.5" />
                    </button>
                    <span className="text-xs font-mono text-muted-foreground">
                      press{" "}
                      <kbd className="px-1 py-0.5 rounded bg-muted border border-border text-[10px] text-foreground font-mono">
                        Enter ↵
                      </kbd>
                    </span>
                  </div>
                </div>
              )}

              {/* SIMULATED QUESTION FOR PERSONA 2: EVENTS */}
              {activePersona === "events" && (
                <div className="my-auto py-6 space-y-4">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-lime-800 dark:text-[#CCFF00]">
                      01 <IconArrowRight className="size-3" />
                    </span>
                    <h4 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                      Select your VIP pass quantity for FounderSummit 2026:
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Passes include instant high-res QR code badge for mobile venue check-in.
                    </p>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center rounded-xl border border-border bg-muted/40 p-1 font-mono">
                      <button
                        type="button"
                        onClick={() => setEventTickets(Math.max(1, eventTickets - 1))}
                        className="size-9 rounded-lg hover:bg-muted text-foreground font-bold flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-12 text-center text-sm font-bold text-lime-800 dark:text-[#CCFF00]">
                        {eventTickets}
                      </span>
                      <button
                        type="button"
                        onClick={() => setEventTickets(Math.min(10, eventTickets + 1))}
                        className="size-9 rounded-lg hover:bg-muted text-foreground font-bold flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-2 p-2 px-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold">
                      <IconQrcode className="size-4" />
                      <span>Print QR Badge Auto-Generated</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground pt-1">
                    <IconCheck className="size-3 text-emerald-500 stroke-[3]" />
                    <span>Hard Capacity Limit: Form auto-locks when 150 passes are claimed.</span>
                  </div>
                </div>
              )}

              {/* SIMULATED QUESTION FOR PERSONA 3: FEEDBACK */}
              {activePersona === "feedback" && (
                <div className="my-auto py-6 space-y-4">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-lime-800 dark:text-[#CCFF00]">
                      01 <IconArrowRight className="size-3" />
                    </span>
                    <h4 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                      How intuitive was your experience using our API docs?
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Click a star rating or press keyboard shortcut 1 to 5:
                    </p>
                  </div>

                  <div className="flex items-center gap-3 py-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackRating(star)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer hover:scale-110 ${
                          star <= feedbackRating
                            ? "border-amber-500/50 bg-amber-500/15 text-amber-500 dark:text-amber-400"
                            : "border-border bg-muted/40 text-muted-foreground"
                        }`}
                      >
                        <IconStarFilled className="size-6 sm:size-7" />
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="font-bold text-lime-800 dark:text-[#CCFF00]">
                      Score: {feedbackRating}.0 / 5.0
                    </span>
                    <span className="text-muted-foreground/30">•</span>
                    <span className="text-muted-foreground">
                      Responses exported directly to Google Sheets
                    </span>
                  </div>
                </div>
              )}

              {/* SIMULATED QUESTION FOR PERSONA 4: HIRING */}
              {activePersona === "hiring" && (
                <div className="my-auto py-6 space-y-4">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-lime-800 dark:text-[#CCFF00]">
                      01 <IconArrowRight className="size-3" />
                    </span>
                    <h4 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                      Drop your resume or GitHub / Portfolio URL:
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Accepts PDF, DOCX, or direct portfolio web links.
                    </p>
                  </div>

                  <div className="rounded-xl border border-dashed border-border bg-muted/30 p-5 text-center space-y-2 hover:border-lime-600/50 dark:hover:border-[#CCFF00]/50 transition-colors cursor-pointer">
                    <div className="size-10 rounded-full bg-lime-500/10 dark:bg-[#CCFF00]/10 text-lime-800 dark:text-[#CCFF00] flex items-center justify-center mx-auto">
                      <IconUpload className="size-5" />
                    </div>
                    <div className="text-xs font-semibold text-foreground">
                      sarah_patel_fullstack_cv.pdf{" "}
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                        (1.4 MB) <IconCheck className="size-3 stroke-[3]" />
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Click to replace file or paste your portfolio URL below
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
                    <IconCheck className="size-3 text-emerald-500 stroke-[3]" />
                    <span>Candidate PII securely stored with privacy-first encryption</span>
                  </div>
                </div>
              )}

              {/* Bottom Simulator Bar */}
              <div className="pt-4 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>PRESS 1-9 OR TAB TO NAVIGATE</span>
                <span className="text-lime-800 dark:text-[#CCFF00] font-bold">
                  CHAIFORM v2.0 ENGINE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
