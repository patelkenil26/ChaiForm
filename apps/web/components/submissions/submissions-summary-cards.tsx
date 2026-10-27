"use client";

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
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {/* Card 1: Total Responses */}
      <Card
        className={`p-4 rounded-xl border ${landingTheme.cardBg} hover:border-amber-400/50 transition-all duration-200`}
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Total Responses
        </span>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className={`text-2xl sm:text-3xl font-extrabold ${landingTheme.primaryText}`}>
            {submissionsLoading ? <Skeleton className="h-7 w-12" /> : submissionsCount}
          </span>
          <span className="text-[11px] text-muted-foreground">collected</span>
        </div>
      </Card>

      {/* Card 2: Form Questions */}
      <Card
        className={`p-4 rounded-xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} transition-all duration-200`}
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Form Questions
        </span>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className={`text-2xl sm:text-3xl font-extrabold ${landingTheme.primaryText}`}>
            {fieldsLoading ? <Skeleton className="h-7 w-12" /> : fieldsCount}
          </span>
          <span className="text-[11px] text-muted-foreground">fields</span>
        </div>
      </Card>

      {/* Card 3: Last Response */}
      <Card
        className={`p-4 rounded-xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} transition-all duration-200`}
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Last Response
        </span>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {submissionsLoading ? <Skeleton className="h-7 w-12" /> : lastResponse}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {submissionsCount > 0 ? "activity" : "none yet"}
          </span>
        </div>
      </Card>

      {/* Card 4: Avg Completion Time */}
      <Card
        className={`p-4 rounded-xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} transition-all duration-200`}
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Avg. Completion
        </span>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {submissionsLoading ? <Skeleton className="h-7 w-12" /> : avgCompletionTime}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {submissionsCount > 0 ? "pace" : "estimate"}
          </span>
        </div>
      </Card>
    </div>
  );
}
