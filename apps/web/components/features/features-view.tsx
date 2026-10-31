"use client";

import Link from "next/link";
import {
  IconSparkles,
  IconCheck,
  IconArrowRight,
  IconForms,
  IconQrcode,
  IconLock,
  IconChartBar,
  IconFileSpreadsheet,
  IconKeyboard,
  IconTerminal2,
  IconStarFilled,
  IconShieldCheck,
  IconBolt,
  IconClock,
  IconDeviceLaptop,
  IconStar,
  IconCircleDot,
  IconCheckbox,
  IconLetterCase,
  IconAlignLeft,
  IconPhone,
  IconCalendar,
  IconMail,
  IconPaperclip,
  IconToggleRight,
  IconLink,
  IconHash,
  IconChevronDown,
} from "@tabler/icons-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { FeaturesBentoSection } from "~/components/landing/features-bento";
import { CtaSection } from "~/components/landing/cta-section";
import { useUser } from "~/hooks/api/auth";

export function FeaturesView() {
  const { user } = useUser();
  const ctaHref = user ? "/dashboard" : "/signup";

  const allFieldTypes = [
    {
      name: "Rating Stars",
      desc: "1 to 5 star rating with customizable labels",
      icon: IconStar,
      tag: "CSAT / NPS",
    },
    {
      name: "Single Choice",
      desc: "Radio selection with keyboard shortcut keys (1-9)",
      icon: IconCircleDot,
      tag: "Qualification",
    },
    {
      name: "Multi-Select",
      desc: "Checkboxes for selecting multiple preferences",
      icon: IconCheckbox,
      tag: "Surveys",
    },
    {
      name: "Short Text",
      desc: "Names, job titles, and quick single-line responses",
      icon: IconLetterCase,
      tag: "Contact",
    },
    {
      name: "Long Text",
      desc: "Detailed customer feedback with auto-expanding textarea",
      icon: IconAlignLeft,
      tag: "Feedback",
    },
    {
      name: "Phone Number",
      desc: "E.164 international phone number formatting",
      icon: IconPhone,
      tag: "Leads",
    },
    {
      name: "Date Picker",
      desc: "Event RSVPs, birthdays, and calendar bookings",
      icon: IconCalendar,
      tag: "Bookings",
    },
    {
      name: "Email Input",
      desc: "RFC-compliant email validation with instant feedback",
      icon: IconMail,
      tag: "Capture",
    },
    {
      name: "File Upload",
      desc: "Resumes, screenshots, and PDF attachments",
      icon: IconPaperclip,
      tag: "Hiring",
    },
    {
      name: "Password Gate",
      desc: "Lock sensitive surveys behind access passcodes",
      icon: IconLock,
      tag: "Confidential",
    },
    {
      name: "Switch Toggle",
      desc: "Binary yes/no decisions and opt-in consent toggles",
      icon: IconToggleRight,
      tag: "Consent",
    },
    {
      name: "Website URL",
      desc: "Portfolio links, social handles, and company websites",
      icon: IconLink,
      tag: "Profiles",
    },
    {
      name: "Number / Currency",
      desc: "Budgets, quantities, and numerical metrics",
      icon: IconHash,
      tag: "Commerce",
    },
    {
      name: "Dropdown Selector",
      desc: "Long lists of countries, states, or departments",
      icon: IconChevronDown,
      tag: "Select",
    },
  ];

  return (
    <div className="py-12 sm:py-16 md:py-20 relative bg-background text-foreground">
      {/* Background Glow */}
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
            <span>Complete Feature Suite</span>
          </Badge>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.08]">
            Engineered for effortless form creation &amp; zero drop-off.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Every capability required to design viral conversational surveys, print high-resolution
            QR passes, configure automated webhooks, and export verified datasets.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="h-12 px-8 text-sm font-bold bg-[#CCFF00] text-[#0A0B0D] hover:bg-[#b8e600] active:scale-[0.99] shadow-lg shadow-[#CCFF00]/25 transition-all cursor-pointer gap-2"
            >
              <Link href={ctaHref}>
                <span>{user ? "Open Creator Studio" : "Start Building for Free"}</span>
                <IconArrowRight className="size-4.5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-6 text-sm font-medium border-border/80 bg-card hover:bg-muted backdrop-blur-xs cursor-pointer"
            >
              <Link href="/templates">Explore 40+ Templates</Link>
            </Button>
          </div>
        </div>

        {/* SECTION 1: 14 FIELD TYPES DEEP DIVE (100% Tabler Icons, Zero Emojis) */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold text-lime-800 dark:text-[#CCFF00] uppercase tracking-wider">
              Comprehensive Question Schema
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-2">
              14 Field Types for Every Form Requirement
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Drag, drop, and configure questions with real-time validation rules and responsive
              mobile viewports.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {allFieldTypes.map((field) => {
              const IconComponent = field.icon;
              return (
                <div
                  key={field.name}
                  className="rounded-xl border border-border/70 bg-card p-4 flex flex-col justify-between hover:border-lime-600/40 dark:hover:border-[#CCFF00]/40 transition-all duration-200 group shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="size-8 rounded-lg bg-muted border border-border/60 flex items-center justify-center text-sm font-bold group-hover:scale-105 transition-transform text-lime-800 dark:text-[#CCFF00]">
                        <IconComponent className="size-4.5 text-lime-800 dark:text-[#CCFF00]" />
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-mono border-border/50 text-muted-foreground"
                      >
                        {field.tag}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-sm text-foreground">{field.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {field.desc}
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border/50 text-[10px] font-mono text-muted-foreground flex items-center justify-between">
                    <span>KEYBOARD NAV READY</span>
                    <span className="text-emerald-500 font-medium flex items-center gap-1">
                      <IconCheck className="size-3" /> SUPPORTED
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 2: LIVING BENTO GRID (QR STUDIO, WEBHOOK TERMINAL, KEYBOARD) */}
      <FeaturesBentoSection />

      {/* SECTION 3: ACCESS LIMITS & SECURITY */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-2xl border border-border/80 bg-card p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="space-y-2">
              <div className="size-10 rounded-xl bg-lime-500/15 dark:bg-[#CCFF00]/10 text-lime-800 dark:text-[#CCFF00] border border-lime-600/30 dark:border-[#CCFF00]/30 flex items-center justify-center mx-auto md:mx-0">
                <IconShieldCheck className="size-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Password Passcodes</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Gate internal employee feedback, executive surveys, and private beta forms with
                custom passcodes.
              </p>
            </div>

            <div className="space-y-2">
              <div className="size-10 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center justify-center mx-auto md:mx-0">
                <IconClock className="size-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Capacity &amp; Expiration</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Auto-close forms automatically when RSVP capacity is reached or when a target
                closing date arrives.
              </p>
            </div>

            <div className="space-y-2">
              <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto md:mx-0">
                <IconFileSpreadsheet className="size-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Instant CSV Data Exports</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Download pristine, timestamped CSV files ready to open in Excel, Google Sheets, or
                import into CRM systems.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <CtaSection />
    </div>
  );
}
