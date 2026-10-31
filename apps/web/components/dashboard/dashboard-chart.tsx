"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { IconTrendingUp, IconChartBar, IconCopy, IconCheck, IconBulb } from "@tabler/icons-react";
import { Card, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { landingTheme } from "~/config/landing-theme";

export interface TimelineDataPoint {
  date: string;
  rawDate: string;
  submissions: number;
}

export interface DashboardChartProps {
  isDataLoading: boolean;
  totalSubmissions: number;
  allSubmissions?: { id: string; createdAt?: Date | string | null }[] | null;
  firstForm?: { id: string; slug?: string | null } | null;
  onCopyFirstFormLink?: () => void;
}

type TimeRangeOption = 7 | 14 | 30;

/**
 * Interactive submissions velocity area chart with dynamic 7D/14D/30D time range toggle.
 */
export function DashboardChart({
  isDataLoading,
  totalSubmissions,
  allSubmissions,
  firstForm,
  onCopyFirstFormLink,
}: DashboardChartProps) {
  const [rangeDays, setRangeDays] = useState<TimeRangeOption>(14);
  const [copied, setCopied] = useState(false);

  // Generate dynamic time range data based on active rangeDays (7, 14, or 30)
  const timelineData = useMemo(() => {
    const days: TimelineDataPoint[] = [];
    const now = new Date();

    for (let i = rangeDays - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const rawDate = d.toISOString().split("T")[0] ?? "";
      const displayLabel = d.toLocaleDateString([], { month: "short", day: "numeric" });
      days.push({
        date: displayLabel,
        rawDate,
        submissions: 0,
      });
    }

    if (allSubmissions && allSubmissions.length > 0) {
      const map = new Map<string, number>();
      allSubmissions.forEach((sub) => {
        if (!sub.createdAt) return;
        const dStr = new Date(sub.createdAt).toISOString().split("T")[0] ?? "";
        map.set(dStr, (map.get(dStr) || 0) + 1);
      });

      days.forEach((day) => {
        if (map.has(day.rawDate)) {
          day.submissions = map.get(day.rawDate) || 0;
        }
      });
    }

    return days;
  }, [allSubmissions, rangeDays]);

  // Derived statistics for the active time window
  const inRangeTotal = useMemo(
    () => timelineData.reduce((sum, d) => sum + d.submissions, 0),
    [timelineData],
  );
  const avgPerDay = useMemo(() => (inRangeTotal / rangeDays).toFixed(1), [inRangeTotal, rangeDays]);
  const peakDay = useMemo(() => {
    let peak = 0;
    timelineData.forEach((d) => {
      if (d.submissions > peak) peak = d.submissions;
    });
    return peak;
  }, [timelineData]);

  const handleShareClick = () => {
    if (onCopyFirstFormLink) {
      onCopyFirstFormLink();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const primaryColor = landingTheme.paletteHex[0] || "#CCFF00";

  return (
    <Card
      className={`p-4 sm:p-6 rounded-2xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} relative overflow-hidden transition-all`}
    >
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <IconTrendingUp className={`size-4.5 ${landingTheme.iconColor}`} />
            <CardTitle className="text-base sm:text-lg font-bold">Submissions Over Time</CardTitle>
          </div>
          <CardDescription className="text-xs mt-0.5">
            Track daily responses captured across all conversational forms in your workspace.
          </CardDescription>
        </div>

        {/* Right Controls: Range Toggle + Submissions Link */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* 7D / 14D / 30D Segmented Toggle */}
          <div className="inline-flex items-center rounded-lg border border-border/70 bg-muted/40 p-0.5 text-xs">
            {([7, 14, 30] as TimeRangeOption[]).map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setRangeDays(days)}
                title={`Show responses over the last ${days} days`}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  rangeDays === days
                    ? `bg-background text-foreground shadow-xs font-bold ${landingTheme.primaryText}`
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {days}D
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            asChild
            className={`h-7.5 px-2.5 text-xs gap-1.5 border-border/70 ${landingTheme.buttonOutlineHover}`}
            title="Open spreadsheet view and export responses to CSV"
          >
            <Link href="/submissions">
              <IconChartBar className={`size-3.5 ${landingTheme.iconColor}`} />
              <span className="hidden sm:inline">Export CSV</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary KPI Pills Strip (Visible when there is data) */}
      {totalSubmissions > 0 && !isDataLoading && (
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-xl bg-muted/30 border border-border/50 text-xs mb-4">
          <div>
            <span className="text-[9px] sm:text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
              Last {rangeDays} Days
            </span>
            <span className="font-bold text-foreground text-xs sm:text-sm mt-0.5 inline-block">
              {inRangeTotal} responses
            </span>
          </div>
          <div>
            <span className="text-[9px] sm:text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
              Daily Average
            </span>
            <span className="font-bold text-foreground text-xs sm:text-sm mt-0.5 inline-block">
              {avgPerDay} / day
            </span>
          </div>
          <div>
            <span className="text-[9px] sm:text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
              Peak Volume
            </span>
            <span className="font-bold text-foreground text-xs sm:text-sm mt-0.5 inline-block">
              {peakDay} peak
            </span>
          </div>
        </div>
      )}

      {/* Chart Canvas */}
      <div className="h-48 sm:h-64 lg:h-72 w-full">
        {isDataLoading ? (
          <Skeleton className="h-full w-full rounded-xl" />
        ) : totalSubmissions === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center border border-dashed border-border/70 rounded-xl bg-card/40">
            <div
              className={`size-10 rounded-xl ${landingTheme.iconBg} flex items-center justify-center mb-3`}
            >
              <IconTrendingUp className="size-5" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">
              Awaiting your first respondent
            </h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Publish your form and share the link on WhatsApp, Email, or your website. Answers will
              chart here in real-time.
            </p>
            {firstForm && onCopyFirstFormLink && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleShareClick}
                className={`mt-4 text-xs gap-1.5 h-8 ${landingTheme.buttonOutlineHover}`}
              >
                {copied ? (
                  <>
                    <IconCheck className="size-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copied Share Link!</span>
                  </>
                ) : (
                  <>
                    <IconCopy className="size-3.5" />
                    <span>Copy First Form Link</span>
                  </>
                )}
              </Button>
            )}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="dashboardSubmissionsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={primaryColor} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={primaryColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.12} vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const value = Number(payload[0]?.value || 0);
                    return (
                      <div className="rounded-lg border border-border/80 bg-neutral-950/95 backdrop-blur-md px-3.5 py-2.5 text-xs shadow-xl shadow-black/60">
                        <p className="font-semibold text-neutral-200">{label}</p>
                        <p className={`font-bold mt-0.5 ${landingTheme.primaryText}`}>
                          {value} {value === 1 ? "response submitted" : "responses submitted"}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="submissions"
                stroke={primaryColor}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#dashboardSubmissionsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Helpful SaaS Ergonomics Tip */}
      <div className="mt-4 pt-3 border-t border-border/40 flex items-center gap-2 text-[11px] text-muted-foreground">
        <IconBulb className="size-3.5 text-amber-400 shrink-0" />
        <span>
          <strong className="text-foreground font-semibold">Pro-tip:</strong> Embedding your form
          directly on your website increases completion rates by up to 40%.
        </span>
      </div>
    </Card>
  );
}
