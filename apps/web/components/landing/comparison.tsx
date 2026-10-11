"use client";

import { IconCheck, IconX, IconSparkles } from "@tabler/icons-react";
import { Badge } from "~/components/ui/badge";

export function ComparisonSection() {
  const comparisonRows = [
    {
      feature: "User Completion Experience",
      traditional: "Tedious 20-field wall of inputs with high drop-off",
      chaiform: "1-question-at-a-time fluid conversational flow",
    },
    {
      feature: "Keyboard & Mobile Usability",
      traditional: "Clunky mobile zooming, requires manual clicking",
      chaiform: "Full keyboard shortcuts (Enter, Tab, 1-9) & mobile gestures",
    },
    {
      feature: "Average Completion Rate",
      traditional: "~14% to 22% average completion",
      chaiform: "Up to 58% to 74% completion (3.5x higher)",
    },
    {
      feature: "Developer API & Schema Sync",
      traditional: "Separate REST endpoints prone to payload mismatch",
      chaiform: "End-to-end type safety with tRPC and Zod schemas",
    },
    {
      feature: "Real-Time Response Feed",
      traditional: "Requires manual page refreshes or external plugins",
      chaiform: "Live response inbox with instant CSV/Excel export",
    },
    {
      feature: "Distribution & QR Sharing",
      traditional: "Plain links only; 3rd party QR generator needed",
      chaiform: "1024px print-ready QR codes with custom designer color themes",
    },
  ];

  return (
    <section id="comparison" className="py-20 md:py-24 bg-muted/20 border-t border-border/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="outline" className="text-xs px-3 py-1 border-primary/30 text-primary gap-1.5 mb-3">
            <IconSparkles className="size-3.5" />
            Clear Advantage
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Traditional Web Forms vs. ChaiForm
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            See why modern startups and product teams abandon legacy form builders.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 bg-muted/60 p-4 border-b border-border/60 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <div className="col-span-4 sm:col-span-4">Capability</div>
            <div className="col-span-4 sm:col-span-4 text-center sm:text-left">Traditional Forms</div>
            <div className="col-span-4 sm:col-span-4 text-primary font-bold">ChaiForm 2.0</div>
          </div>

          <div className="divide-y divide-border/60">
            {comparisonRows.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 p-4 sm:p-5 text-xs sm:text-sm items-center hover:bg-muted/30 transition-colors"
              >
                <div className="col-span-4 font-medium text-foreground pr-2">
                  {row.feature}
                </div>

                <div className="col-span-4 text-muted-foreground flex items-start gap-1.5 pr-2">
                  <IconX className="size-4 text-rose-500 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{row.traditional}</span>
                </div>

                <div className="col-span-4 text-foreground font-semibold flex items-start gap-1.5">
                  <IconCheck className="size-4 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                  <span>{row.chaiform}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
