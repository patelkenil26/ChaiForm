"use client";

import {
  IconForms,
  IconChartBar,
  IconLock,
  IconQrcode,
  IconSparkles,
  IconFileSpreadsheet,
  IconClock,
  IconCode,
  IconCheck,
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
  IconLink,
} from "@tabler/icons-react";
import { Badge } from "~/components/ui/badge";
import { landingTheme } from "~/config/landing-theme";
import { cn } from "~/lib/utils";

export function FeaturesBentoSection() {
  return (
    <section id="features" className="py-20 md:py-28 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge
            variant="outline"
            className={cn("text-xs px-3 py-1 gap-1.5 mb-3 backdrop-blur-sm", landingTheme.badge)}
          >
            <IconSparkles className={cn("size-3.5", landingTheme.iconColor)} />
            <span>Built for Modern Teams</span>
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
          {/* Bento Item 1: Conversational (Indigo/Violet Theme) - Spans 2 cols on md */}
          <div className="md:col-span-2 relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-950/45 via-card/90 to-background/80 p-6 sm:p-8 backdrop-blur-md shadow-xl shadow-indigo-950/25 flex flex-col justify-between hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group">
            {/* Ambient Glow */}
            <div className="pointer-events-none absolute -top-24 -left-24 size-64 rounded-full bg-indigo-500/15 blur-3xl group-hover:bg-indigo-500/25 transition-all duration-500" />
            {/* Top Border Glow Beam */}
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500/80 to-transparent" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 shadow-xs shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  <IconForms className="size-5" />
                </div>
                <Badge
                  variant="outline"
                  className="text-xs border-indigo-500/30 bg-indigo-500/10 text-indigo-300 font-medium"
                >
                  Keyboard-First
                </Badge>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Conversational Forms that{" "}
                <span className="bg-gradient-to-r from-indigo-300 via-indigo-200 to-white bg-clip-text text-transparent">
                  Never Overwhelm
                </span>
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xl">
                Instead of presenting respondents with a daunting 20-field wall of text, ChaiForm
                guides them through focused, 1-question-at-a-time steps with smooth keyboard
                navigation.
              </p>
            </div>

            {/* Interactive Visual Element */}
            <div className="relative z-10 mt-6 rounded-xl border border-indigo-500/25 bg-neutral-950/70 p-4 font-mono text-xs text-muted-foreground backdrop-blur-sm shadow-inner">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-indigo-500/20 text-[11px]">
                <span className="text-indigo-400 font-semibold">QUESTION 2 OF 5</span>
                <span className="text-emerald-400 font-medium">AUTO-SCROLL ENABLED</span>
              </div>
              <div className="text-foreground text-sm font-sans font-medium mb-2">
                &quot;What is your primary product feedback?&quot;
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1 font-sans">
                <span className="px-2.5 py-1 rounded-md bg-indigo-950/50 border border-indigo-500/30 text-indigo-200 text-[11px] font-medium">
                  Press [1] Feature Request
                </span>
                <span className="px-2.5 py-1 rounded-md bg-indigo-950/50 border border-indigo-500/30 text-indigo-200 text-[11px] font-medium">
                  Press [2] Bug Report
                </span>
                <span className="px-2.5 py-1 rounded-md bg-indigo-950/50 border border-indigo-500/30 text-indigo-200 text-[11px] font-medium">
                  Press [3] General Feedback
                </span>
              </div>
            </div>
          </div>

          {/* Bento Item 2: Embed Anywhere & Instant Share (Cyan/Sky Theme) */}
          <div className="relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-cyan-950/45 via-card/90 to-background/80 p-6 sm:p-8 backdrop-blur-md shadow-xl shadow-cyan-950/25 flex flex-col justify-between hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 group">
            {/* Ambient Glow */}
            <div className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-cyan-500/15 blur-3xl group-hover:bg-cyan-500/25 transition-all duration-500" />
            {/* Top Border Glow Beam */}
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/80 to-transparent" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-xs shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                  <IconCode className="size-5" />
                </div>
                <Badge
                  variant="outline"
                  className="text-xs border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-medium"
                >
                  Embed Anywhere
                </Badge>
              </div>

              <h3 className="text-xl font-bold tracking-tight text-foreground">
                Embed Anywhere in{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-white bg-clip-text text-transparent">
                  1-Click
                </span>
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Drop your forms seamlessly into Next.js, WordPress, Webflow, Shopify, or share via
                direct custom links.
              </p>
            </div>

            <div className="relative z-10 mt-6 rounded-xl border border-cyan-500/25 bg-neutral-950/90 p-3.5 text-xs font-mono text-cyan-300 overflow-hidden shadow-inner">
              <p className="text-neutral-500 text-[11px]">// 1-line responsive iframe embed</p>
              <code className="text-cyan-300 text-[11px]">
                &lt;iframe src=&quot;/form/feedback&quot; width=&quot;100%&quot; /&gt;
              </code>
            </div>
          </div>

          {/* Bento Item 3: Real-Time Analytics (Emerald/Mint Theme) */}
          <div className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-950/45 via-card/90 to-background/80 p-6 sm:p-8 backdrop-blur-md shadow-xl shadow-emerald-950/25 flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 group">
            {/* Ambient Glow */}
            <div className="pointer-events-none absolute -top-20 -left-20 size-56 rounded-full bg-emerald-500/15 blur-3xl group-hover:bg-emerald-500/25 transition-all duration-500" />
            {/* Top Border Glow Beam */}
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/80 to-transparent" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  <IconChartBar className="size-5" />
                </div>
                <Badge
                  variant="outline"
                  className="text-xs border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-medium"
                >
                  Analytics
                </Badge>
              </div>

              <h3 className="text-xl font-bold tracking-tight text-foreground">
                Real-Time{" "}
                <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-white bg-clip-text text-transparent">
                  Submissions Hub
                </span>
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Live submission feed, search answers, filter by date presets (7d, 30d, custom), and
                1-click export to CSV / Excel for instant analysis.
              </p>
            </div>

            <div className="relative z-10 mt-6 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 text-xs font-semibold">
                <IconFileSpreadsheet className="size-3.5 text-emerald-400" />
                <span>CSV Export</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/15 text-teal-300 text-xs font-semibold">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Feed</span>
              </span>
            </div>
          </div>

          {/* Bento Item 4: Instant QR Codes & Flyers (Purple/Fuchsia Theme) */}
          <div className="relative overflow-hidden rounded-2xl border border-purple-500/25 bg-gradient-to-br from-purple-950/45 via-card/90 to-background/80 p-6 sm:p-8 backdrop-blur-md shadow-xl shadow-purple-950/25 flex flex-col justify-between hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 group">
            {/* Ambient Glow */}
            <div className="pointer-events-none absolute -top-20 -right-20 size-56 rounded-full bg-purple-500/15 blur-3xl group-hover:bg-purple-500/25 transition-all duration-500" />
            {/* Top Border Glow Beam */}
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500/80 to-transparent" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 shadow-xs shadow-purple-500/20 group-hover:scale-105 transition-transform">
                  <IconQrcode className="size-5" />
                </div>
                <Badge
                  variant="outline"
                  className="text-xs border-purple-500/30 bg-purple-500/10 text-purple-300 font-medium"
                >
                  1024px HD
                </Badge>
              </div>

              <h3 className="text-xl font-bold tracking-tight text-foreground">
                Instant{" "}
                <span className="bg-gradient-to-r from-purple-300 via-fuchsia-200 to-white bg-clip-text text-transparent">
                  QR Codes & Flyers
                </span>
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Generate high-resolution PNG & vector SVG QR codes with 5 designer color palettes.
                Print ready-made event flyers with one click.
              </p>
            </div>

            <div className="relative z-10 mt-6 flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/30 w-fit">
              <span className="size-3 rounded-full bg-black border border-white/20 shadow-xs" />
              <span className="size-3 rounded-full bg-indigo-500 shadow-xs" />
              <span className="size-3 rounded-full bg-emerald-500 shadow-xs" />
              <span className="size-3 rounded-full bg-rose-500 shadow-xs" />
              <span className="size-3 rounded-full bg-amber-500 shadow-xs" />
              <span className="text-xs text-purple-200 font-medium ml-1">5 Themes</span>
            </div>
          </div>

          {/* Bento Item 5: Access Limits & Passwords (Amber/Gold Theme) */}
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-950/45 via-card/90 to-background/80 p-6 sm:p-8 backdrop-blur-md shadow-xl shadow-amber-950/25 flex flex-col justify-between hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 group">
            {/* Ambient Glow */}
            <div className="pointer-events-none absolute -top-20 -right-20 size-56 rounded-full bg-amber-500/15 blur-3xl group-hover:bg-amber-500/25 transition-all duration-500" />
            {/* Top Border Glow Beam */}
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500/80 to-transparent" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-xs shadow-amber-500/20 group-hover:scale-105 transition-transform">
                  <IconLock className="size-5" />
                </div>
                <Badge
                  variant="outline"
                  className="text-xs border-amber-500/30 bg-amber-500/10 text-amber-300 font-medium"
                >
                  Security
                </Badge>
              </div>

              <h3 className="text-xl font-bold tracking-tight text-foreground">
                Access Limits &{" "}
                <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-white bg-clip-text text-transparent">
                  Passwords
                </span>
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Protect sensitive forms with cryptographic password protection, set automatic
                closure deadlines, and cap maximum response limits.
              </p>
            </div>

            <div className="relative z-10 mt-6 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/15 text-amber-300 text-xs font-semibold">
                <IconClock className="size-3.5 text-amber-400" />
                <span>Auto-expire</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-yellow-500/30 bg-yellow-500/15 text-yellow-300 text-xs font-semibold">
                <IconLock className="size-3.5 text-yellow-400" />
                <span>Password Lock</span>
              </span>
            </div>
          </div>
        </div>

        {/* 14 Specialized Question Types Showcase Strip */}
        <div className="mt-12 rounded-2xl border border-border/80 bg-gradient-to-b from-card/90 via-card/60 to-background/90 p-6 sm:p-8 text-center backdrop-blur-md relative overflow-hidden shadow-2xl">
          {/* Subtle Dual Accent Glow */}
          <div className="pointer-events-none absolute -top-24 left-1/4 size-64 rounded-full bg-indigo-500/10 blur-3xl -z-10" />
          <div className="pointer-events-none absolute -bottom-24 right-1/4 size-64 rounded-full bg-amber-500/10 blur-3xl -z-10" />

          <h4 className="text-base sm:text-lg font-bold text-foreground">
            14 Specialized Question Field Types Out-of-the-Box
          </h4>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 mb-6">
            Mix and match diverse inputs to create the perfect conversational survey or onboarding
            flow.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { label: "5-Star Rating", icon: IconStarFilled, color: "text-amber-400" },
              { label: "Single Choice (Radio)", icon: IconCircleDot, color: "text-blue-400" },
              { label: "Multi-Select Checkboxes", icon: IconCheckbox, color: "text-emerald-400" },
              { label: "Dropdown Select", icon: IconChevronDown, color: "text-purple-400" },
              { label: "Long Form Textarea", icon: IconAlignLeft, color: "text-indigo-400" },
              { label: "Short Answer", icon: IconTypography, color: "text-cyan-400" },
              { label: "Numerical Inputs", icon: IconHash, color: "text-violet-400" },
              { label: "Validated Email", icon: IconMail, color: "text-rose-400" },
              { label: "Phone / WhatsApp", icon: IconPhone, color: "text-emerald-400" },
              { label: "Website / URL", icon: IconLink, color: "text-sky-400" },
              { label: "Date & Calendar", icon: IconCalendar, color: "text-amber-400" },
              { label: "Time Picker", icon: IconClock, color: "text-blue-400" },
              { label: "Password Protection", icon: IconLock, color: "text-amber-400" },
              { label: "Yes / No Decision", icon: IconSwitch, color: "text-teal-400" },
            ].map((item) => (
              <span
                key={item.label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/70 bg-card/80 text-xs font-medium text-foreground shadow-xs hover:border-primary/50 hover:bg-card hover:scale-105 transition-all duration-200 cursor-default"
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
