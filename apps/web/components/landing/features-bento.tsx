"use client";

import {
  IconForms,
  IconChartBar,
  IconLock,
  IconQrcode,
  IconSparkles,
  IconFileSpreadsheet,
  IconClock,
  IconCpu,
  IconCheck,
  IconListCheck,
  IconStarFilled,
  IconCircleDot,
  IconCheckbox,
  IconChevronDown,
  IconAlignLeft,
  IconTypography,
  IconHash,
  IconMail,
  IconPhone,
  IconCalendar,
  IconSwitch,
} from "@tabler/icons-react";
import { Badge } from "~/components/ui/badge";

export function FeaturesBentoSection() {
  return (
    <section id="features" className="py-20 md:py-28 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="outline" className="text-xs px-3 py-1 border-primary/30 text-primary gap-1.5 mb-3">
            <IconSparkles className="size-3.5" />
            Built for Modern Teams
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Engineered for high engagement.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Everything you need to build interactive conversational forms, collect verified answers,
            and extract actionable business intelligence.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Bento Item 1: Conversational (Spans 2 cols on md) */}
          <div className="md:col-span-2 rounded-2xl border border-border/80 bg-card/60 p-6 sm:p-8 backdrop-blur-xs shadow-xs flex flex-col justify-between hover:border-primary/50 transition-all group">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 group-hover:scale-105 transition-transform">
                  <IconForms className="size-5" />
                </div>
                <Badge variant="outline" className="text-xs border-indigo-500/20 text-indigo-400">
                  Keyboard-First
                </Badge>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                Conversational Forms that Never Overwhelm
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xl">
                Instead of presenting respondents with a daunting 20-field wall of text, ChaiForm guides them
                through focused, 1-question-at-a-time steps with smooth keyboard navigation.
              </p>
            </div>

            {/* Interactive Visual Element */}
            <div className="mt-6 rounded-xl border border-border/60 bg-muted/40 p-4 font-mono text-xs text-muted-foreground">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-border/40 text-[11px]">
                <span className="text-primary font-semibold">QUESTION 2 OF 5</span>
                <span className="text-emerald-500">AUTO-SCROLL ENABLED</span>
              </div>
              <div className="text-foreground text-sm font-sans font-medium mb-2">
                &quot;What is your primary product feedback?&quot;
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="px-2 py-1 rounded bg-background border text-[11px]">Press [1] Feature Request</span>
                <span className="px-2 py-1 rounded bg-background border text-[11px]">Press [2] Bug Report</span>
                <span className="px-2 py-1 rounded bg-background border text-[11px]">Press [3] General Feedback</span>
              </div>
            </div>
          </div>

          {/* Bento Item 2: End-to-End Type Safety */}
          <div className="rounded-2xl border border-border/80 bg-card/60 p-6 sm:p-8 backdrop-blur-xs shadow-xs flex flex-col justify-between hover:border-primary/50 transition-all group">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                  <IconCpu className="size-5" />
                </div>
                <Badge variant="outline" className="text-xs border-primary/20 text-primary">
                  tRPC + Zod
                </Badge>
              </div>

              <h3 className="text-xl font-bold tracking-tight">
                100% Type-Safe Architecture
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Full-stack type inference from PostgreSQL Drizzle schema directly to React hooks.
                Zero API drift, zero runtime schema bugs.
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-950 p-3.5 text-xs font-mono text-emerald-400 overflow-hidden">
              <p className="text-neutral-500 text-[11px]">// Fully inferenced tRPC client</p>
              <code>trpc.formSubmission.submitForm.useMutation()</code>
            </div>
          </div>

          {/* Bento Item 3: Real-Time Analytics & Export */}
          <div className="rounded-2xl border border-border/80 bg-card/60 p-6 sm:p-8 backdrop-blur-xs shadow-xs flex flex-col justify-between hover:border-primary/50 transition-all group">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-105 transition-transform">
                  <IconChartBar className="size-5" />
                </div>
                <Badge variant="outline" className="text-xs border-emerald-500/20 text-emerald-400">
                  Analytics
                </Badge>
              </div>

              <h3 className="text-xl font-bold tracking-tight">
                Real-Time Submissions Hub
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Live submission feed, search answers, filter by date presets (7d, 30d, custom),
                and 1-click export to CSV / Excel for instant analysis.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2">
              <Badge variant="secondary" className="gap-1 text-xs py-1">
                <IconFileSpreadsheet className="size-3.5 text-emerald-500" />
                CSV Export
              </Badge>
              <Badge variant="secondary" className="gap-1 text-xs py-1">
                <IconCheck className="size-3.5 text-blue-500" />
                Live Feed
              </Badge>
            </div>
          </div>

          {/* Bento Item 4: QR Codes & Sharing */}
          <div className="rounded-2xl border border-border/80 bg-card/60 p-6 sm:p-8 backdrop-blur-xs shadow-xs flex flex-col justify-between hover:border-primary/50 transition-all group">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 group-hover:scale-105 transition-transform">
                  <IconQrcode className="size-5" />
                </div>
                <Badge variant="outline" className="text-xs border-purple-500/20 text-purple-400">
                  1024px HD
                </Badge>
              </div>

              <h3 className="text-xl font-bold tracking-tight">
                Instant QR Codes & Flyers
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Generate high-resolution PNG & vector SVG QR codes with 5 designer color palettes.
                Print ready-made event flyers with one click.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-1.5">
              <span className="size-3 rounded-full bg-black border border-white/20" />
              <span className="size-3 rounded-full bg-indigo-600" />
              <span className="size-3 rounded-full bg-emerald-600" />
              <span className="size-3 rounded-full bg-rose-600" />
              <span className="size-3 rounded-full bg-amber-600" />
              <span className="text-xs text-muted-foreground ml-2">5 Themes</span>
            </div>
          </div>

          {/* Bento Item 5: Form Governance & Protection */}
          <div className="rounded-2xl border border-border/80 bg-card/60 p-6 sm:p-8 backdrop-blur-xs shadow-xs flex flex-col justify-between hover:border-primary/50 transition-all group">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 group-hover:scale-105 transition-transform">
                  <IconLock className="size-5" />
                </div>
                <Badge variant="outline" className="text-xs border-amber-500/20 text-amber-400">
                  Security
                </Badge>
              </div>

              <h3 className="text-xl font-bold tracking-tight">
                Access Limits & Passwords
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Protect sensitive forms with cryptographic password protection, set automatic
                closure deadlines, and cap maximum response limits.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <IconClock className="size-3 text-amber-500" /> Auto-expire
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <IconLock className="size-3 text-primary" /> Password Lock
              </span>
            </div>
          </div>
        </div>

        {/* 10+ Question Types Showcase Strip */}
        <div className="mt-12 rounded-2xl border border-border/60 bg-muted/20 p-6 sm:p-8 text-center">
          <h4 className="text-base font-semibold text-foreground">
            10+ Specialized Question Field Types Out-of-the-Box
          </h4>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 mb-6">
            Mix and match diverse inputs to create the perfect conversational survey or onboarding flow.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { label: "5-Star Rating", icon: IconStarFilled, color: "text-amber-500" },
              { label: "Single Choice (Radio)", icon: IconCircleDot, color: "text-blue-500" },
              { label: "Multi-Select Checkboxes", icon: IconCheckbox, color: "text-emerald-500" },
              { label: "Dropdown Select", icon: IconChevronDown, color: "text-purple-500" },
              { label: "Long Form Textarea", icon: IconAlignLeft, color: "text-indigo-500" },
              { label: "Short Answer", icon: IconTypography, color: "text-cyan-500" },
              { label: "Numerical Inputs", icon: IconHash, color: "text-violet-500" },
              { label: "Validated Email", icon: IconMail, color: "text-rose-500" },
              { label: "Phone / WhatsApp", icon: IconPhone, color: "text-emerald-500" },
              { label: "Date & Calendar", icon: IconCalendar, color: "text-amber-500" },
              { label: "Time Picker", icon: IconClock, color: "text-blue-500" },
              { label: "Password Protection", icon: IconLock, color: "text-amber-500" },
              { label: "Yes / No Decision", icon: IconSwitch, color: "text-teal-500" },
            ].map((item) => (
              <span
                key={item.label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/70 bg-card text-xs font-medium text-foreground shadow-2xs hover:border-primary/40 transition-colors"
              >
                <item.icon className={`size-3.5 ${item.color}`} />
                <span>{item.label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
