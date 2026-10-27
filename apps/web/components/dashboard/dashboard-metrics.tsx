"use client";

import { IconClipboardText, IconSend, IconEye, IconTrendingUp } from "@tabler/icons-react";
import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { landingTheme } from "~/config/landing-theme";

export interface DashboardMetricsProps {
  isDataLoading: boolean;
  totalForms: number;
  publishedCount: number;
  draftCount: number;
  totalSubmissions: number;
  totalViews: number;
  completionRate: number | null;
}

/**
 * 4 Executive Workspace KPI Metrics Cards (Forms, Submissions, Views, Completion Rate).
 */
export function DashboardMetrics({
  isDataLoading,
  totalForms,
  publishedCount,
  draftCount,
  totalSubmissions,
  totalViews,
  completionRate,
}: DashboardMetricsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Forms */}
      <Card
        className={`p-5 rounded-2xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} transition-all duration-200`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Forms
          </span>
          <div
            className={`flex size-9 items-center justify-center rounded-lg ${landingTheme.iconBg}`}
          >
            <IconClipboardText className="size-5" />
          </div>
        </div>
        <div className="mt-3">
          <div
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${landingTheme.primaryText}`}
          >
            {isDataLoading ? <Skeleton className="h-8 w-14" /> : totalForms}
          </div>
          <p className="mt-1 text-xs text-muted-foreground flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              {publishedCount} live
            </span>
            <span>•</span>
            <span className="text-amber-400 font-medium">{draftCount} drafts</span>
          </p>
        </div>
      </Card>

      {/* Total Responses */}
      <Card
        className={`p-5 rounded-2xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} transition-all duration-200`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Responses
          </span>
          <div
            className={`flex size-9 items-center justify-center rounded-lg ${landingTheme.iconBg}`}
          >
            <IconSend className="size-5" />
          </div>
        </div>
        <div className="mt-3">
          <div
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${landingTheme.primaryText}`}
          >
            {isDataLoading ? <Skeleton className="h-8 w-16" /> : totalSubmissions}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {totalSubmissions === 0
              ? "No responses recorded yet"
              : totalSubmissions === 1
                ? "1 response recorded"
                : `${totalSubmissions} responses recorded across workspace`}
          </p>
        </div>
      </Card>

      {/* Total Views */}
      <Card
        className={`p-5 rounded-2xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} transition-all duration-200`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Views
          </span>
          <div
            className={`flex size-9 items-center justify-center rounded-lg ${landingTheme.iconBg}`}
          >
            <IconEye className="size-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {isDataLoading ? <Skeleton className="h-8 w-16" /> : totalViews}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Across all active forms</p>
        </div>
      </Card>

      {/* Overall Conversion / Completion Rate */}
      <Card
        className={`p-5 rounded-2xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} transition-all duration-200`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Completion Rate
          </span>
          <div
            className={`flex size-9 items-center justify-center rounded-lg ${landingTheme.iconBg}`}
          >
            <IconTrendingUp className="size-5" />
          </div>
        </div>
        <div className="mt-3">
          <div
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${landingTheme.gradientText}`}
          >
            {isDataLoading ? (
              <Skeleton className="h-8 w-14" />
            ) : completionRate === null ? (
              "—"
            ) : (
              `${completionRate}%`
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {completionRate === null
              ? "No responses collected yet"
              : "Average responses per form view"}
          </p>
        </div>
      </Card>
    </div>
  );
}
