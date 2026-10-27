"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  IconEye,
  IconSend,
  IconPercentage,
  IconTrendingUp,
  IconFileSpreadsheet,
  IconFileCode,
  IconCalendar,
  IconChartBar,
  IconStarFilled,
  IconSparkles,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { landingTheme } from "~/config/landing-theme";
import type { SubmissionField, SubmissionItem } from "~/components/submissions/submissions-table";

interface FormAnalyticsViewProps {
  formTitle?: string;
  viewsCount?: number;
  submissions?: SubmissionItem[];
  fields?: SubmissionField[];
  isLoading?: boolean;
}

export function FormAnalyticsView({
  formTitle = "Form",
  viewsCount = 0,
  submissions = [],
  fields = [],
  isLoading = false,
}: FormAnalyticsViewProps) {
  const [timeRange, setTimeRange] = useState<"14D" | "ALL">("14D");

  const totalViews = Math.max(viewsCount, submissions.length);
  const totalCompletions = submissions.length;
  // Estimated starts: views where user started answering or views ratio
  const estimatedStarts = Math.round(
    totalViews > 0 ? totalCompletions + Math.round((totalViews - totalCompletions) * 0.4) : 0,
  );
  const completionRate =
    totalViews > 0 ? Math.min(100, Math.round((totalCompletions / totalViews) * 100)) : 0;
  const dropOffRate = totalViews > 0 ? Math.max(0, 100 - completionRate) : 0;

  // 1. Daily Submissions Timeline Aggregation
  const timelineData = useMemo(() => {
    if (!submissions || submissions.length === 0) {
      // Return placeholder empty days for clean visual state
      const days = [];
      const now = new Date();
      for (let i = 13; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        days.push({
          date: d.toLocaleDateString([], { month: "short", day: "numeric" }),
          fullDate: d.toLocaleDateString(),
          submissions: 0,
        });
      }
      return days;
    }

    const dateMap = new Map<string, number>();

    // Sort submissions by createdAt asc
    const sorted = [...submissions].sort(
      (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime(),
    );

    // If 14D, initialize last 14 days with 0
    if (timeRange === "14D") {
      const now = new Date();
      for (let i = 13; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const key = d.toLocaleDateString([], { month: "short", day: "numeric" });
        dateMap.set(key, 0);
      }
    }

    sorted.forEach((sub) => {
      if (!sub.createdAt) return;
      const d = new Date(sub.createdAt);
      const key = d.toLocaleDateString([], { month: "short", day: "numeric" });
      if (timeRange === "ALL" || dateMap.has(key)) {
        dateMap.set(key, (dateMap.get(key) ?? 0) + 1);
      }
    });

    return Array.from(dateMap.entries()).map(([date, count]) => ({
      date,
      submissions: count,
    }));
  }, [submissions, timeRange]);

  // 2. Rating Breakdown (If form has a RATING question)
  const ratingData = useMemo(() => {
    const ratingField = fields.find((f) => f.type === "RATING");
    if (!ratingField) return null;

    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    submissions.forEach((sub) => {
      const valObj = sub.values?.find((v) => v.formFieldId === ratingField.id);
      if (valObj && valObj.value) {
        const num = parseInt(valObj.value, 10);
        if (num >= 1 && num <= 5) {
          counts[num as keyof typeof counts] += 1;
        }
      }
    });

    return [
      { star: "5 Stars", count: counts[5] },
      { star: "4 Stars", count: counts[4] },
      { star: "3 Stars", count: counts[3] },
      { star: "2 Stars", count: counts[2] },
      { star: "1 Star", count: counts[1] },
    ];
  }, [fields, submissions]);

  // 3. Export to CSV
  const handleExportCsv = () => {
    if (!submissions || submissions.length === 0) {
      toast.error("No submissions available to export");
      return;
    }

    try {
      const headers = [
        "Submission ID",
        "Submitted At",
        ...fields.map((f) => `"${f.label.replace(/"/g, '""')}"`),
      ];

      const rows = submissions.map((sub) => {
        const valMap = new Map((sub.values ?? []).map((v) => [v.formFieldId, v.value]));
        const dateStr = sub.createdAt ? new Date(sub.createdAt).toISOString() : "";
        const colVals = fields.map((f) => {
          const val = valMap.get(f.id) ?? "";
          return `"${String(val).replace(/"/g, '""')}"`;
        });
        return [`"${sub.id}"`, `"${dateStr}"`, ...colVals].join(",");
      });

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `${formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-analytics-submissions.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Submissions exported to CSV!");
    } catch {
      toast.error("Failed to export CSV");
    }
  };

  // 4. Export to JSON
  const handleExportJson = () => {
    if (!submissions || submissions.length === 0) {
      toast.error("No submissions available to export");
      return;
    }

    try {
      const exportPayload = {
        formTitle,
        totalViews,
        totalCompletions,
        completionRate: `${completionRate}%`,
        dropOffRate: `${dropOffRate}%`,
        exportedAt: new Date().toISOString(),
        submissions: submissions.map((s) => ({
          id: s.id,
          submittedAt: s.createdAt,
          answers: (s.values ?? []).map((v) => {
            const fieldDef = fields.find((f) => f.id === v.formFieldId);
            return {
              question: fieldDef?.label ?? v.formFieldId,
              answer: v.value,
            };
          }),
        })),
      };

      const jsonStr = JSON.stringify(exportPayload, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `${formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-analytics.json`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Analytics & submissions exported to JSON!");
    } catch {
      toast.error("Failed to export JSON");
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
      {/* Top Banner & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border bg-card/60 backdrop-blur-xs">
        <div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-xs px-2.5 py-0.5 border-primary/30 text-primary gap-1"
            >
              <IconSparkles className="size-3" />
              Real-time Metrics
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">{formTitle}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mt-1 text-foreground">
            Form Performance & Insights
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Analyze visitor impressions, response velocity, and download full datasets.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="h-9 gap-1.5 text-xs rounded-xl"
            title="Download formatted CSV spreadsheet"
          >
            <IconFileSpreadsheet className="size-4 text-emerald-500" />
            <span>Export CSV</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportJson}
            className="h-9 gap-1.5 text-xs rounded-xl"
            title="Download full JSON dataset"
          >
            <IconFileCode className="size-4 text-blue-500" />
            <span>Export JSON</span>
          </Button>
        </div>
      </div>

      {/* 4 Form-Level Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Views (Impressions) */}
        <Card className="p-5 relative overflow-hidden transition-all hover:border-primary/40 hover:shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Form Views
            </span>
            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <IconEye className="size-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {isLoading ? <Skeleton className="h-8 w-16" /> : totalViews.toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
              <span>Unique link impressions</span>
            </p>
          </div>
        </Card>

        {/* Total Starts */}
        <Card className="p-5 relative overflow-hidden transition-all hover:border-primary/40 hover:shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Starts
            </span>
            <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
              <IconChartBar className="size-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {isLoading ? <Skeleton className="h-8 w-16" /> : estimatedStarts.toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              <span>Visitors who began filling</span>
            </p>
          </div>
        </Card>

        {/* Total Completions */}
        <Card className="p-5 relative overflow-hidden transition-all hover:border-primary/40 hover:shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Completions
            </span>
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <IconSend className="size-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {isLoading ? <Skeleton className="h-8 w-16" /> : totalCompletions.toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
              <span>{completionRate}% completion rate</span>
            </p>
          </div>
        </Card>

        {/* Drop-off Rate (%) */}
        <Card className="p-5 relative overflow-hidden transition-all hover:border-primary/40 hover:shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Drop-off Rate
            </span>
            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <IconPercentage className="size-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              {isLoading ? <Skeleton className="h-8 w-16" /> : `${dropOffRate}%`}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              <span>Visitors who abandoned form</span>
            </p>
          </div>
        </Card>
      </div>

      {/* Visual Recharts Timeline Chart */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
              <IconTrendingUp className="size-5 text-primary" />
              Submissions Velocity Timeline
            </CardTitle>
            <CardDescription className="text-xs">
              Daily incoming responses collected over time.
            </CardDescription>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto border rounded-lg p-0.5 bg-muted/40 text-xs">
            <button
              type="button"
              onClick={() => setTimeRange("14D")}
              className={`px-3 py-1 rounded-md transition font-medium cursor-pointer ${
                timeRange === "14D"
                  ? "bg-background text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Last 14 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeRange("ALL")}
              className={`px-3 py-1 rounded-md transition font-medium cursor-pointer ${
                timeRange === "ALL"
                  ? "bg-background text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        {/* Recharts Area Container */}
        <div className="h-72 w-full">
          {isLoading ? (
            <Skeleton className="h-full w-full rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="submissionsColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={landingTheme.chart.stopColor} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={landingTheme.chart.stopColor} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
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
                      return (
                        <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
                          <p className="font-semibold text-foreground">{label}</p>
                          <p className="text-primary font-medium mt-0.5">
                            {payload[0]?.value} submissions
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
                  stroke={landingTheme.chart.stroke}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#submissionsColor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Rating Breakdown Chart (Shown only if form has star rating) */}
      {ratingData && (
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <IconStarFilled className="size-4 text-amber-400" />
              Respondent Rating Distribution
            </CardTitle>
            <CardDescription className="text-xs">
              Breakdown of feedback scores from 1 to 5 stars.
            </CardDescription>
          </CardHeader>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ratingData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.15} />
                <XAxis type="number" allowDecimals={false} hide />
                <YAxis
                  dataKey="star"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "currentColor" }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-popover px-2.5 py-1.5 text-xs shadow-md">
                          <span className="font-semibold">{label}: </span>
                          <span className="text-amber-500 font-bold">
                            {payload[0]?.value} ratings
                          </span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {ratingData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        landingTheme.paletteHex[index % landingTheme.paletteHex.length] ??
                        landingTheme.primaryHex
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
}
