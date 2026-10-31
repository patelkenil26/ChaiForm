"use client";

import {
  IconClipboardText,
  IconSend,
  IconEye,
  IconTrendingUp,
  IconInfoCircle,
} from "@tabler/icons-react";
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
 * 4 Executive Workspace KPI Metrics Cards with self-explanatory labels and helpful tooltips.
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
    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
      {/* 1. Total Forms */}
      <Card
        className={`p-3.5 sm:p-5 rounded-2xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} relative overflow-hidden transition-all duration-200 group`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5" title="All forms created in this workspace">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Total Forms Created
            </span>
          </div>
          <div
            className={`flex size-7 sm:size-8 items-center justify-center rounded-lg ${landingTheme.iconBg} transition-transform group-hover:scale-105 shrink-0`}
          >
            <IconClipboardText className="size-3.5 sm:size-4.5" />
          </div>
        </div>
        <div className="mt-2 sm:mt-2.5">
          <div
            className={`text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight ${landingTheme.primaryText}`}
          >
            {isDataLoading ? <Skeleton className="h-7 sm:h-8 w-14" /> : totalForms}
          </div>
          <div className="mt-1 text-[11px] sm:text-xs text-muted-foreground flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span
              className="inline-flex items-center gap-1 text-emerald-400 font-semibold"
              title="Forms currently live and open for responses"
            >
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {publishedCount} live
            </span>
            <span>•</span>
            <span className="text-muted-foreground font-medium" title="Unpublished forms in draft">
              {draftCount} draft
            </span>
          </div>
        </div>
      </Card>

      {/* 2. Total Responses */}
      <Card
        className={`p-3.5 sm:p-5 rounded-2xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} relative overflow-hidden transition-all duration-200 group`}
      >
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-1.5"
            title="Total completed answers submitted by respondents"
          >
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Total Responses
            </span>
          </div>
          <div
            className={`flex size-7 sm:size-8 items-center justify-center rounded-lg ${landingTheme.iconBg} transition-transform group-hover:scale-105 shrink-0`}
          >
            <IconSend className="size-3.5 sm:size-4.5" />
          </div>
        </div>
        <div className="mt-2 sm:mt-2.5">
          <div
            className={`text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight ${landingTheme.primaryText}`}
          >
            {isDataLoading ? <Skeleton className="h-7 sm:h-8 w-16" /> : totalSubmissions}
          </div>
          <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground truncate">
            {totalSubmissions === 0
              ? "No answers yet"
              : totalSubmissions === 1
                ? "1 response"
                : `${totalSubmissions} responses`}
          </p>
        </div>
      </Card>

      {/* 3. Total Views */}
      <Card
        className={`p-3.5 sm:p-5 rounded-2xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} relative overflow-hidden transition-all duration-200 group`}
      >
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-1.5"
            title="Number of times your public form links were opened"
          >
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Total Form Visits
            </span>
          </div>
          <div
            className={`flex size-7 sm:size-8 items-center justify-center rounded-lg ${landingTheme.iconBg} transition-transform group-hover:scale-105 shrink-0`}
          >
            <IconEye className="size-3.5 sm:size-4.5" />
          </div>
        </div>
        <div className="mt-2 sm:mt-2.5">
          <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground">
            {isDataLoading ? <Skeleton className="h-7 sm:h-8 w-16" /> : totalViews}
          </div>
          <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground truncate">
            Web & embeds visits
          </p>
        </div>
      </Card>

      {/* 4. Completion Rate */}
      <Card
        className={`p-3.5 sm:p-5 rounded-2xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} relative overflow-hidden transition-all duration-200 group`}
      >
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-1.5"
            title="Percentage of visitors who finished all questions"
          >
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Completion Rate
            </span>
          </div>
          <div
            className={`flex size-7 sm:size-8 items-center justify-center rounded-lg ${landingTheme.iconBg} transition-transform group-hover:scale-105 shrink-0`}
          >
            <IconTrendingUp className="size-3.5 sm:size-4.5" />
          </div>
        </div>
        <div className="mt-2 sm:mt-2.5">
          <div
            className={`text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight ${landingTheme.gradientText}`}
          >
            {isDataLoading ? (
              <Skeleton className="h-7 sm:h-8 w-14" />
            ) : completionRate === null ? (
              "—"
            ) : (
              `${completionRate}%`
            )}
          </div>
          <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground truncate">
            {completionRate === null ? "After first response" : "Finished all questions"}
          </p>
        </div>
      </Card>
    </div>
  );
}
