"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconPlus, IconSparkles, IconCompass } from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { useCreateForm, useListForms } from "~/hooks/api/form";
import { useUserWorkspaceStats } from "~/hooks/api/form-submission";
import { useUser } from "~/hooks/api/auth";
import { landingTheme } from "~/config/landing-theme";
import { CreateFormDialog, type CreateFormValues } from "~/components/forms/create-form-dialog";

import { DashboardMetrics } from "~/components/dashboard/dashboard-metrics";
import { DashboardChart } from "~/components/dashboard/dashboard-chart";
import { DashboardRecentForms } from "~/components/dashboard/dashboard-recent-forms";
import { DashboardActivityFeed } from "~/components/dashboard/dashboard-activity-feed";
import { DashboardShortcuts } from "~/components/dashboard/dashboard-shortcuts";

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
  const totalSubmissions = stats?.totalSubmissions ?? 0;
  const publishedCount = useMemo(() => forms?.filter((f) => f.isPublished).length ?? 0, [forms]);
  const draftCount = useMemo(() => forms?.filter((f) => !f.isPublished).length ?? 0, [forms]);
  const totalViews = useMemo(
    () => forms?.reduce((acc, f) => acc + (f.views ?? 0), 0) ?? 0,
    [forms],
  );
  const completionRate = useMemo(() => {
    if (totalSubmissions <= 0) return null;
    if (totalViews <= 0) return 100;
    return Math.min(
      100,
      Math.round((totalSubmissions / Math.max(totalViews, totalSubmissions)) * 100),
    );
  }, [totalSubmissions, totalViews]);

  // Top 6 Recent Forms
  const recentForms = useMemo(() => {
    if (!forms) return [];
    return [...forms]
      .sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      })
      .slice(0, 6);
  }, [forms]);

  // 14-Day Timeline Data Generator for Recharts Area
  const timelineData = useMemo(() => {
    const days: { date: string; rawDate: string; submissions: number }[] = [];
    const now = new Date();

    for (let i = 13; i >= 0; i--) {
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

    if (stats?.allSubmissions && stats.allSubmissions.length > 0) {
      const map = new Map<string, number>();
      stats.allSubmissions.forEach((sub) => {
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
  }, [stats]);

  const handleCreateForm = async (values: CreateFormValues) => {
    try {
      const res = await createFormAsync({
        title: values.title.trim(),
        description: values.description ? values.description.trim() : undefined,
        visibility: values.visibility,
        isPublished: values.isPublished,
      });
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

  const firstForm = forms && forms.length > 0 && forms[0] ? forms[0] : null;

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
              <span>Workspace Overview</span>
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
            Your forms, responses and activity — at a glance.
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

      {/* 2. Executive KPI Metrics Cards */}
      <DashboardMetrics
        isDataLoading={isDataLoading}
        totalForms={totalForms}
        publishedCount={publishedCount}
        draftCount={draftCount}
        totalSubmissions={totalSubmissions}
        totalViews={totalViews}
        completionRate={completionRate}
      />

      {/* 3. Submissions Velocity Chart */}
      <DashboardChart
        isDataLoading={isDataLoading}
        totalSubmissions={totalSubmissions}
        timelineData={timelineData}
        firstForm={firstForm}
        onCopyFirstFormLink={
          firstForm ? () => handleCopyLink(firstForm.id, firstForm.slug) : undefined
        }
      />

      {/* 4. Recent Forms (Top 6 Cards) */}
      <DashboardRecentForms
        forms={recentForms}
        totalForms={totalForms}
        isLoading={isFormsLoading}
        copiedId={copiedId}
        onCopyLink={handleCopyLink}
        onCreateOpen={() => setOpen(true)}
      />

      {/* 5. Live Activity Feed (Incoming Responses) */}
      <DashboardActivityFeed submissions={stats?.recentSubmissions} isLoading={isStatsLoading} />

      {/* 6. Pro Shortcuts Hub */}
      <DashboardShortcuts onCreateOpen={() => setOpen(true)} />

      {/* Standardized Create Form Dialog */}
      <CreateFormDialog open={open} onOpenChange={setOpen} onSubmit={handleCreateForm} />
    </div>
  );
}
