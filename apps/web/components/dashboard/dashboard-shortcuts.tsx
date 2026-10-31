"use client";

import Link from "next/link";
import {
  IconPlus,
  IconCompass,
  IconFileSpreadsheet,
  IconArrowRight,
  IconBolt,
  IconCode,
} from "@tabler/icons-react";
import { Card } from "~/components/ui/card";
import { landingTheme } from "~/config/landing-theme";

export interface DashboardShortcutsProps {
  onCreateOpen: () => void;
}

/**
 * Pro Action Hub Shortcuts panel designed for the dashboard utility rail.
 */
export function DashboardShortcuts({ onCreateOpen }: DashboardShortcutsProps) {
  return (
    <Card
      className={`p-4 sm:p-5 rounded-2xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} relative overflow-hidden transition-all`}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`flex size-8 items-center justify-center rounded-lg ${landingTheme.iconBg}`}
        >
          <IconBolt className="size-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold tracking-tight text-foreground">Creator Toolbox</h3>
          <p className="text-[11px] text-muted-foreground">Quick actions & power tools</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2">
        {/* 1. Create Form Shortcut */}
        <button
          type="button"
          onClick={onCreateOpen}
          className="w-full text-left flex items-center justify-between p-2.5 rounded-xl border border-border/40 bg-muted/20 hover:bg-muted/40 hover:border-lime-500/30 transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-lime-500/10 text-lime-500 dark:text-[#CCFF00] border border-lime-500/20 group-hover:scale-105 transition-transform">
              <IconPlus className="size-3.5" />
            </div>
            <div>
              <span className="font-semibold text-xs text-foreground block group-hover:text-lime-700 dark:group-hover:text-[#ccff00] transition-colors">
                Create Form from Scratch
              </span>
              <span className="text-[10px] text-muted-foreground block">
                Add text, rating, choice & password fields
              </span>
            </div>
          </div>
          <IconArrowRight className="size-3 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* 2. Explore Templates (Untouched & prominent) */}
        <Link
          href="/explore"
          className="flex items-center justify-between p-2.5 rounded-xl border border-border/40 bg-muted/20 hover:bg-muted/40 hover:border-amber-500/30 transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
              <IconCompass className="size-3.5" />
            </div>
            <div>
              <span className="font-semibold text-xs text-foreground block group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Browse 40+ Templates
              </span>
              <span className="text-[10px] text-muted-foreground block">
                Pre-built customer surveys, quizzes & forms
              </span>
            </div>
          </div>
          <IconArrowRight className="size-3 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
        </Link>

        {/* 3. Submissions & CSV Export */}
        <Link
          href="/submissions"
          className="flex items-center justify-between p-2.5 rounded-xl border border-border/40 bg-muted/20 hover:bg-muted/40 hover:border-emerald-500/30 transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
              <IconFileSpreadsheet className="size-3.5" />
            </div>
            <div>
              <span className="font-semibold text-xs text-foreground block group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Export Responses (CSV / JSON)
              </span>
              <span className="text-[10px] text-muted-foreground block">
                Download formatted spreadsheets & analytics
              </span>
            </div>
          </div>
          <IconArrowRight className="size-3 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
        </Link>

        {/* 4. Embed on Website Tool */}
        <Link
          href="/features"
          className="flex items-center justify-between p-2.5 rounded-xl border border-border/40 bg-muted/20 hover:bg-muted/40 hover:border-border transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:text-foreground border border-border/60 group-hover:scale-105 transition-transform">
              <IconCode className="size-3.5" />
            </div>
            <div>
              <span className="font-semibold text-xs text-foreground block group-hover:text-foreground transition-colors">
                Embed Form in Website
              </span>
              <span className="text-[10px] text-muted-foreground block">
                Copy iframe or inline code for Next.js & HTML
              </span>
            </div>
          </div>
          <IconArrowRight className="size-3 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>
    </Card>
  );
}
