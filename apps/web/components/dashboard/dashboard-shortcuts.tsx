"use client";

import Link from "next/link";
import { IconPlus, IconCompass, IconChartBar } from "@tabler/icons-react";
import { Card } from "~/components/ui/card";
import { landingTheme } from "~/config/landing-theme";

export interface DashboardShortcutsProps {
  onCreateOpen: () => void;
}

/**
 * 3 Pro Action Hub Shortcuts (Create Form, Explore Templates, Submissions & Export).
 */
export function DashboardShortcuts({ onCreateOpen }: DashboardShortcutsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 pt-2">
      {/* Create Form Shortcut */}
      <Card
        onClick={onCreateOpen}
        className={`p-6 rounded-2xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} transition-all cursor-pointer group`}
      >
        <div
          className={`flex size-9 items-center justify-center rounded-lg ${landingTheme.iconBg} font-bold text-sm mb-3 group-hover:scale-105 transition-transform`}
        >
          <IconPlus className="size-4.5" />
        </div>
        <h4 className={`font-semibold text-sm ${landingTheme.linkHover}`}>Create Form</h4>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          Start a fresh conversational form with text, ratings, choices, and password protection.
        </p>
      </Card>

      {/* Explore Templates Shortcut */}
      <Link href="/explore" className="block">
        <Card
          className={`h-full p-6 rounded-2xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} transition-all cursor-pointer group`}
        >
          <div
            className={`flex size-9 items-center justify-center rounded-lg ${landingTheme.iconBg} font-bold text-sm mb-3 group-hover:scale-105 transition-transform`}
          >
            <IconCompass className="size-4.5" />
          </div>
          <h4 className={`font-semibold text-sm ${landingTheme.linkHover}`}>Templates</h4>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Clone pre-built community templates for surveys, feedback, quizzes, and job
            applications.
          </p>
        </Card>
      </Link>

      {/* Submissions & Export Shortcut */}
      <Link href="/submissions" className="block">
        <Card
          className={`h-full p-6 rounded-2xl border border-border/75 bg-gradient-to-b from-emerald-500/[0.04] via-card to-card ${landingTheme.cardBorderHover} transition-all cursor-pointer group`}
        >
          <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold text-sm mb-3 group-hover:scale-105 transition-transform">
            <IconChartBar className="size-4.5" />
          </div>
          <h4 className="font-semibold text-sm group-hover:text-emerald-400 transition-colors">
            Submissions & CSV Export
          </h4>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Download formatted spreadsheet reports and JSON payloads for all respondent submissions.
          </p>
        </Card>
      </Link>
    </div>
  );
}
