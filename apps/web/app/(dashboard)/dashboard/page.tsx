"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  IconClipboardText,
  IconPlus,
  IconExternalLink,
  IconCopy,
  IconCheck,
  IconChartBar,
  IconSparkles,
  IconSend,
  IconArrowRight,
  IconEye,
  IconTrendingUp,
  IconInbox,
  IconCompass,
  IconFolder,
  IconClock,
  IconPencil,
} from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useCreateForm, useListForms } from "~/hooks/api/form";
import { useUserWorkspaceStats } from "~/hooks/api/form-submission";
import { useUser } from "~/hooks/api/auth";
import { landingTheme } from "~/config/landing-theme";

type CreateFormValues = {
  title: string;
  description: string;
};

function formatRelativeTime(dateInput: Date | string | null | undefined): string {
  if (!dateInput) return "Recently";
  const date = new Date(dateInput);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffSec < 60) return "Just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useUser();
  const [open, setOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace("/login?redirect=/dashboard");
    }
  }, [user, isUserLoading, router]);

  const { createFormAsync } = useCreateForm();
  const { forms, isLoading: isFormsLoading } = useListForms();
  const { stats, isLoading: isStatsLoading } = useUserWorkspaceStats();

  const isDataLoading = isFormsLoading || isStatsLoading;

  // Aggregate Metrics
  const totalForms = forms?.length ?? 0;
  const publishedCount = useMemo(() => forms?.filter((f) => f.isPublished).length ?? 0, [forms]);
  const draftCount = useMemo(() => forms?.filter((f) => !f.isPublished).length ?? 0, [forms]);
  const totalViews = useMemo(
    () => forms?.reduce((acc, f) => acc + (f.views ?? 0), 0) ?? 0,
    [forms],
  );
  const totalSubmissions = stats?.totalSubmissions ?? 0;
  const completionRate = useMemo(() => {
    if (totalViews <= 0) return totalSubmissions > 0 ? 100 : 0;
    return Math.min(100, Math.round((totalSubmissions / totalViews) * 100));
  }, [totalSubmissions, totalViews]);

  // Top 6 Recent Forms
  const recentForms = useMemo(() => {
    if (!forms) return [];
    return forms.slice(0, 6);
  }, [forms]);

  // Daily submissions velocity for 14 days
  const timelineData = useMemo(() => {
    const days: { date: string; submissions: number }[] = [];
    const dateMap = new Map<string, number>();
    const now = new Date();

    for (let i = 13; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toLocaleDateString([], { month: "short", day: "numeric" });
      dateMap.set(key, 0);
      days.push({ date: key, submissions: 0 });
    }

    if (stats?.allSubmissions && stats.allSubmissions.length > 0) {
      stats.allSubmissions.forEach((sub) => {
        if (!sub.createdAt) return;
        const d = new Date(sub.createdAt);
        const key = d.toLocaleDateString([], { month: "short", day: "numeric" });
        if (dateMap.has(key)) {
          dateMap.set(key, (dateMap.get(key) || 0) + 1);
        }
      });
      return days.map((day) => ({
        date: day.date,
        submissions: dateMap.get(day.date) || 0,
      }));
    }

    return days;
  }, [stats?.allSubmissions]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateFormValues>({
    defaultValues: { title: "", description: "" },
  });

  const onSubmit: SubmitHandler<CreateFormValues> = async (values) => {
    try {
      const res = await createFormAsync({
        title: values.title,
        description: values.description || undefined,
      });
      reset();
      setOpen(false);
      toast.success("Form created successfully!");
      if (res?.id) {
        router.push(`/forms/${res.id}`);
      }
    } catch {
      toast.error("Failed to create form");
    }
  };

  const handleCopyLink = (formId: string, slug?: string | null, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const target = slug || formId;
    const url = `${window.location.origin}/form/${target}`;
    navigator.clipboard.writeText(url);
    setCopiedId(formId);
    toast.success("Form link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge
              variant="outline"
              className={`text-[11px] px-2.5 py-0.5 gap-1.5 font-medium ${landingTheme.badge}`}
            >
              <IconSparkles className={`size-3 ${landingTheme.iconColor}`} />
              <span>Workspace Command Center</span>
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-foreground">
            Welcome back,{" "}
            <span className={landingTheme.gradientText}>
              {user?.fullName?.split(" ")[0] || "Creator"}
            </span>
            !
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Real-time telemetry, response velocity, recent forms, and live submission feeds.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            asChild
            variant="outline"
            size="sm"
            className={`text-xs h-9 gap-1.5 border-border/70 ${landingTheme.buttonOutlineHover}`}
          >
            <Link href="/explore">
              <IconCompass className={`size-3.5 ${landingTheme.iconColor}`} />
              <span>Templates</span>
            </Link>
          </Button>

          <Button
            onClick={() => setOpen(true)}
            size="sm"
            className={`gap-2 h-9 text-xs ${landingTheme.primaryButton}`}
          >
            <IconPlus className="size-3.5" />
            <span>Create Form</span>
          </Button>
        </div>
      </div>

      {/* 2. 4 Executive Live KPI Cards with Luxury Champagne Glow */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Forms */}
        <Card
          className={`relative p-5 rounded-2xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} transition-all duration-200 overflow-hidden group`}
        >
          <div className={landingTheme.cardBeam} />
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

        {/* Total Responses (Emerald) */}
        <Card className="relative p-5 rounded-2xl border border-border/75 bg-gradient-to-b from-emerald-500/[0.05] via-card to-card hover:border-emerald-500/50 transition-all duration-200 overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent group-hover:via-emerald-400 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Responses
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <IconSend className="size-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-400">
              {isDataLoading ? <Skeleton className="h-8 w-16" /> : totalSubmissions}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {totalSubmissions === 1
                ? "1 submission collected"
                : `${totalSubmissions} submissions recorded`}
            </p>
          </div>
        </Card>

        {/* Form Impressions / Views (Blue) */}
        <Card className="relative p-5 rounded-2xl border border-border/75 bg-gradient-to-b from-blue-500/[0.05] via-card to-card hover:border-blue-500/50 transition-all duration-200 overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent group-hover:via-blue-400 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Visitor Impressions
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30">
              <IconEye className="size-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-blue-400">
              {isDataLoading ? <Skeleton className="h-8 w-16" /> : totalViews}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Across all conversational forms</p>
          </div>
        </Card>

        {/* Overall Conversion Rate */}
        <Card
          className={`relative p-5 rounded-2xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} transition-all duration-200 overflow-hidden group`}
        >
          <div className={landingTheme.cardBeam} />
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
              {isDataLoading ? <Skeleton className="h-8 w-14" /> : `${completionRate}%`}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Average responses per impression</p>
          </div>
        </Card>
      </div>

      {/* 3. Submissions Velocity Chart (Interactive Workspace Activity) */}
      <Card
        className={`p-5 sm:p-6 rounded-2xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} transition-all relative overflow-hidden`}
      >
        <div className={landingTheme.cardBeam} />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
              <IconTrendingUp className={`size-5 ${landingTheme.iconColor}`} />
              <span>Workspace Submissions Velocity</span>
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Daily responses collected across your entire workspace over the last 14 days.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              asChild
              className={`h-8 text-xs gap-1.5 border-border/70 ${landingTheme.buttonOutlineHover}`}
            >
              <Link href="/submissions">
                <IconChartBar className={`size-3.5 ${landingTheme.iconColor}`} />
                <span>Open Full Analytics</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Chart View */}
        <div className="h-64 w-full">
          {isDataLoading ? (
            <Skeleton className="h-full w-full rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="dashboardSubmissionsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={landingTheme.paletteHex[0]} stopOpacity={0.38} />
                    <stop offset="95%" stopColor={landingTheme.paletteHex[0]} stopOpacity={0.0} />
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
                      return (
                        <div className="rounded-lg border border-border/80 bg-neutral-950/95 backdrop-blur-md px-3.5 py-2.5 text-xs shadow-xl shadow-black/60">
                          <p className="font-semibold text-neutral-200">{label}</p>
                          <p className={`font-bold mt-0.5 ${landingTheme.primaryText}`}>
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
                  stroke={landingTheme.paletteHex[0]}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#dashboardSubmissionsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* 4. Recent Forms Section (Top 6 Forms) */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <IconFolder className={`size-4 ${landingTheme.iconColor}`} />
              <h2 className="text-base sm:text-lg font-bold tracking-tight">Recent Forms</h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Showing top 6 recently modified forms.
            </p>
          </div>

          {totalForms > 0 && (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className={`text-xs gap-1.5 font-medium text-muted-foreground ${landingTheme.linkHover}`}
            >
              <Link href="/forms">
                <span>View All Forms ({totalForms})</span>
                <IconArrowRight className="size-3.5" />
              </Link>
            </Button>
          )}
        </div>

        {isFormsLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-9 w-full" />
              </Card>
            ))}
          </div>
        ) : recentForms.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
            <div
              className={`flex size-14 items-center justify-center rounded-full ${landingTheme.iconBg} mb-4`}
            >
              <IconClipboardText className="size-7" />
            </div>
            <h3 className="text-lg font-semibold">No forms created yet</h3>
            <p className="mt-1.5 max-w-sm text-xs sm:text-sm text-muted-foreground">
              Create your first interactive conversational form to start collecting responses and
              analyzing feedback.
            </p>
            <Button
              onClick={() => setOpen(true)}
              className={`mt-6 gap-2 ${landingTheme.primaryButton}`}
            >
              <IconPlus className="size-4" />
              Create Your First Form
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentForms.map((form) => {
              const publicLink = form.slug || form.id;
              return (
                <Card
                  key={form.id}
                  className={`flex flex-col justify-between transition-all duration-200 rounded-2xl border ${landingTheme.cardBg} p-5 ${landingTheme.cardBorderHover} group relative overflow-hidden`}
                >
                  <div className={landingTheme.cardBeam} />
                  <CardHeader className="p-0 pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle
                        className={`line-clamp-1 text-base font-semibold group-hover:opacity-90 ${landingTheme.linkHover}`}
                      >
                        {form.title}
                      </CardTitle>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {form.isPublished ? (
                          <Badge
                            variant="default"
                            className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs font-normal"
                          >
                            Live
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className={landingTheme.draftBadge}>
                            Draft
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2 text-xs min-h-[32px] mt-1">
                      {form.description || "No description provided"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-0 pb-3 text-xs text-muted-foreground flex items-center justify-between border-t border-border/40 pt-2.5">
                    <div className="flex items-center gap-1.5" title="Impressions">
                      <IconEye
                        className={`size-3.5 text-muted-foreground group-hover:${landingTheme.primaryText} transition-colors`}
                      />
                      <span>{form.views ?? 0} views</span>
                    </div>

                    <div className="flex items-center gap-1" title="Created date">
                      <IconClock className="size-3.5 text-muted-foreground" />
                      <span>{formatRelativeTime(form.createdAt)}</span>
                    </div>
                  </CardContent>

                  <CardFooter className="p-0 flex items-center justify-between gap-2 border-t border-border/40 pt-3 flex-wrap sm:flex-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className={`gap-1.5 text-xs h-8 border-border/70 ${landingTheme.buttonOutlineHover}`}
                      >
                        <Link href={`/forms/${form.id}`}>
                          <IconPencil className="size-3.5" />
                          <span>Builder</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className={`gap-1.5 text-xs h-8 ${landingTheme.buttonGhostHover}`}
                      >
                        <Link href={`/forms/${form.id}/submissions`}>
                          <IconChartBar className={`size-3.5 ${landingTheme.iconColor}`} />
                          <span>Responses</span>
                        </Link>
                      </Button>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`size-8 ${landingTheme.buttonGhostHover}`}
                        title="Copy Public Link"
                        onClick={(e) => handleCopyLink(form.id, form.slug, e)}
                      >
                        {copiedId === form.id ? (
                          <IconCheck className="size-4 text-emerald-500" />
                        ) : (
                          <IconCopy className="size-4" />
                        )}
                        <span className="sr-only">Copy Link</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`size-8 ${landingTheme.buttonGhostHover}`}
                        asChild
                        title="Open Live Form"
                      >
                        <Link href={`/form/${publicLink}`} target="_blank">
                          <IconExternalLink className="size-4" />
                          <span className="sr-only">Open Live Form</span>
                        </Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Live Activity Feed (Latest Incoming Responses) */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <IconInbox className="size-4 text-emerald-400" />
              <h2 className="text-base sm:text-lg font-bold tracking-tight">
                Recent Submissions Feed
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live respondents answering your conversational forms across the workspace.
            </p>
          </div>

          {stats?.recentSubmissions && stats.recentSubmissions.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className={`text-xs gap-1.5 font-medium text-muted-foreground ${landingTheme.linkHover}`}
            >
              <Link href="/submissions">
                <span>All Submissions</span>
                <IconArrowRight className="size-3.5" />
              </Link>
            </Button>
          )}
        </div>

        {isStatsLoading ? (
          <Card className="p-6">
            <Skeleton className="h-6 w-full mb-3" />
            <Skeleton className="h-6 w-full mb-3" />
            <Skeleton className="h-6 w-full" />
          </Card>
        ) : !stats?.recentSubmissions || stats.recentSubmissions.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-8 text-center border-dashed">
            <div
              className={`flex size-10 items-center justify-center rounded-full ${landingTheme.iconBg} mb-2`}
            >
              <IconInbox className="size-5" />
            </div>
            <h4 className="text-sm font-semibold">No recent submissions yet</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              As soon as users complete any of your live forms, incoming responses will stream into
              this feed.
            </p>
          </Card>
        ) : (
          <div
            className={`rounded-2xl border ${landingTheme.cardBg} overflow-hidden ${landingTheme.cardBorderHover} transition-all`}
          >
            <div className="divide-y divide-border/50">
              {stats.recentSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:px-5 gap-3 ${landingTheme.tableRowHover}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <IconSend className="size-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs sm:text-sm text-foreground truncate max-w-[200px] sm:max-w-xs">
                          {sub.formTitle || "Untitled Form"}
                        </span>
                        <Badge variant="outline" className={landingTheme.draftBadge}>
                          {sub.answersCount} {sub.answersCount === 1 ? "answer" : "answers"}
                        </Badge>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        Submission ID: {sub.id.slice(0, 8)}...
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(sub.createdAt)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className={`text-xs h-7.5 gap-1 border-border/70 ${landingTheme.buttonOutlineHover}`}
                    >
                      <Link href={`/submissions?formId=${sub.formId}`}>
                        <span>Inspect</span>
                        <IconArrowRight className="size-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 6. Pro Shortcuts Hub with Luxury Amber Accents */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 pt-2">
        <Card
          onClick={() => setOpen(true)}
          className={`p-6 rounded-2xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} transition-all cursor-pointer group relative overflow-hidden`}
        >
          <div className={landingTheme.cardBeam} />
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

        <Link href="/explore" className="block">
          <Card
            className={`h-full p-6 rounded-2xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} transition-all cursor-pointer group relative overflow-hidden`}
          >
            <div className={landingTheme.cardBeam} />
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

        <Link href="/submissions" className="block">
          <Card
            className={`h-full p-6 rounded-2xl border border-border/75 bg-gradient-to-b from-emerald-500/[0.04] via-card to-card ${landingTheme.cardBorderHover} transition-all cursor-pointer group relative overflow-hidden`}
          >
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent group-hover:via-emerald-400 transition-all" />
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold text-sm mb-3 group-hover:scale-105 transition-transform">
              <IconChartBar className="size-4.5" />
            </div>
            <h4 className="font-semibold text-sm group-hover:text-emerald-400 transition-colors">
              Submissions & CSV Export
            </h4>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Download formatted spreadsheet reports and JSON payloads for all respondent
              submissions.
            </p>
          </Card>
        </Link>
      </div>

      {/* Create Form Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new form</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <Input
                  id="title"
                  placeholder="e.g. Customer Feedback"
                  {...register("title", { required: true, maxLength: 55 })}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  placeholder="What is this form for? (optional)"
                  {...register("description", { maxLength: 300 })}
                />
              </Field>
            </FieldGroup>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                className={landingTheme.buttonOutlineHover}
                onClick={() => {
                  reset();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`gap-2 ${landingTheme.primaryButton}`}
              >
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                {isSubmitting ? "Creating..." : "Create Form"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
