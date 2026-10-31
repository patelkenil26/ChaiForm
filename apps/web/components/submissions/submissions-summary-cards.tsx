"use client";

import { IconInbox, IconHelpCircle, IconClock, IconTrendingUp } from "@tabler/icons-react";
import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { landingTheme } from "~/config/landing-theme";

interface SubmissionsSummaryCardsProps {
  submissionsCount: number;
  fieldsCount: number;
  lastResponse: string;
  avgCompletionTime: string;
  submissionsLoading: boolean;
  fieldsLoading: boolean;
}

export function SubmissionsSummaryCards({
  submissionsCount,
  fieldsCount,
  lastResponse,
  avgCompletionTime,
  submissionsLoading,
  fieldsLoading,
}: SubmissionsSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
      {/* Card 1: Total Responses */}
      <Card
        className={`p-3.5 sm:p-4.5 rounded-2xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} relative overflow-hidden transition-all duration-200 group`}
      >
        <div className="flex items-center justify-between">
          <span
            className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
            title="Total completed answers received"
          >
            Total Responses
          </span>
          <div
            className={`flex size-7 sm:size-8 items-center justify-center rounded-lg ${landingTheme.iconBg} transition-transform group-hover:scale-105 shrink-0`}
          >
            <IconInbox className="size-3.5 sm:size-4" />
          </div>
        </div>
        <div className="mt-2 sm:mt-2.5">
          <div
            className={`text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight ${landingTheme.primaryText}`}
          >
            {submissionsLoading ? <Skeleton className="h-7 sm:h-8 w-14" /> : submissionsCount}
          </div>
          <div className="mt-1 text-[11px] sm:text-xs text-muted-foreground flex items-center gap-1.5 truncate">
            {submissionsCount > 0 ? (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live &amp; recording
              </span>
            ) : (
              <span>Awaiting first respondent</span>
            )}
          </div>
        </div>
      </Card>

      {/* Card 2: Form Questions */}
      <Card
        className={`p-3.5 sm:p-4.5 rounded-2xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} relative overflow-hidden transition-all duration-200 group`}
      >
        <div className="flex items-center justify-between">
          <span
            className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
            title="Total questions in this form"
          >
            Questions in Form
          </span>
          <div
            className={`flex size-7 sm:size-8 items-center justify-center rounded-lg ${landingTheme.iconBg} transition-transform group-hover:scale-105 shrink-0`}
          >
            <IconHelpCircle className="size-3.5 sm:size-4" />
          </div>
        </div>
        <div className="mt-2 sm:mt-2.5">
          <div
            className={`text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight ${landingTheme.primaryText}`}
          >
            {fieldsLoading ? <Skeleton className="h-7 sm:h-8 w-12" /> : fieldsCount}
          </div>
          <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground truncate">
            Active step fields configured
          </p>
        </div>
      </Card>

      {/* Card 3: Latest Activity */}
      <Card
        className={`p-3.5 sm:p-4.5 rounded-2xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} relative overflow-hidden transition-all duration-200 group`}
      >
        <div className="flex items-center justify-between">
          <span
            className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
            title="When the most recent response was submitted"
          >
            Latest Activity
          </span>
          <div
            className={`flex size-7 sm:size-8 items-center justify-center rounded-lg ${landingTheme.iconBg} transition-transform group-hover:scale-105 shrink-0`}
          >
            <IconClock className="size-3.5 sm:size-4" />
          </div>
        </div>
        <div className="mt-2 sm:mt-2.5">
          <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground tracking-tight">
            {submissionsLoading ? <Skeleton className="h-7 sm:h-8 w-16" /> : lastResponse}
          </div>
          <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground truncate">
            {submissionsCount > 0 ? "Last submission time" : "No submissions yet"}
          </p>
        </div>
      </Card>

      {/* Card 4: Estimated Pace */}
      <Card
        className={`p-3.5 sm:p-4.5 rounded-2xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} relative overflow-hidden transition-all duration-200 group`}
      >
        <div className="flex items-center justify-between">
          <span
            className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
            title="Average time needed to answer all questions"
          >
            Estimated Pace
          </span>
          <div
            className={`flex size-7 sm:size-8 items-center justify-center rounded-lg ${landingTheme.iconBg} transition-transform group-hover:scale-105 shrink-0`}
          >
            <IconTrendingUp className="size-3.5 sm:size-4" />
          </div>
        </div>
        <div className="mt-2 sm:mt-2.5">
          <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground tracking-tight">
            {submissionsLoading ? <Skeleton className="h-7 sm:h-8 w-14" /> : avgCompletionTime}
          </div>
          <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground truncate">
            Average time to complete
          </p>
        </div>
      </Card>
    </div>
  );
}
