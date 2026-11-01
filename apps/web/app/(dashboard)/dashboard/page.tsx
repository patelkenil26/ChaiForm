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
import { DashboardQuota } from "~/components/dashboard/dashboard-quota";
import { DashboardActivityFeed } from "~/components/dashboard/dashboard-activity-feed";
import { DashboardShortcuts } from "~/components/dashboard/dashboard-shortcuts";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useUser();
  const [open, setOpen] = useState(false);
  const [presetTitle, setPresetTitle] = useState<string | undefined>(undefined);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const MAX_FORMS_LIMIT = 14;

  const handleOpenCreate = (title?: string) => {
    if ((forms?.length ?? 0) >= MAX_FORMS_LIMIT) {
      toast.error(
        `Workspace form limit reached (${MAX_FORMS_LIMIT}/${MAX_FORMS_LIMIT}). Please delete an older form to create a new one.`,
      );
      return;
    }
    setPresetTitle(title);
    setOpen(true);
  };

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

  // Sorted Forms (passed to recent forms hub, which handles responsive slicing & search)
  const sortedForms = useMemo(() => {
    if (!forms) return [];
    return [...forms].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
  }, [forms]);

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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create form";
      toast.error(msg);
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
    <div className="flex flex-col gap-5 sm:gap-6 p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      {/* 1. Header & Quick Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge
              variant="outline"
              className={`text-[11px] px-2.5 py-0.5 gap-1.5 font-medium ${landingTheme.badge}`}
            >
              <IconSparkles className={`size-3 ${landingTheme.iconColor}`} />
              <span>Workspace Cockpit</span>
            </Badge>

            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full border border-border/50">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Operational</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-foreground">
            Welcome back,{" "}
            <span className={landingTheme.gradientText}>
              {user?.fullName?.split(" ")[0] || "Creator"}
            </span>
            !
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Live telemetry, response velocity, and forms management — at a glance.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Templates CTA (Retained & active as requested) */}
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
            onClick={() => handleOpenCreate()}
            size="sm"
            className={`gap-1.5 h-9 text-xs font-semibold ${landingTheme.primaryButton}`}
          >
            <IconPlus className="size-3.5" />
            <span>Create Form</span>
          </Button>
        </div>
      </div>

      {/* 2. Executive KPI Metrics Strip (4 High-Contrast Cards) */}
      <DashboardMetrics
        isDataLoading={isDataLoading}
        totalForms={totalForms}
        publishedCount={publishedCount}
        draftCount={draftCount}
        totalSubmissions={totalSubmissions}
        totalViews={totalViews}
        completionRate={completionRate}
      />

      {/* 3. Asymmetric 2-Column SaaS Cockpit Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left / Main Stage (8 Columns): Velocity Chart + Active Forms Hub */}
        <div className="lg:col-span-8 flex flex-col gap-5 sm:gap-6">
          {/* Interactive Submissions Velocity Chart (with 7D/14D/30D switch) */}
          <DashboardChart
            isDataLoading={isDataLoading}
            totalSubmissions={totalSubmissions}
            allSubmissions={stats?.allSubmissions}
            firstForm={firstForm}
            onCopyFirstFormLink={
              firstForm ? () => handleCopyLink(firstForm.id, firstForm.slug) : undefined
            }
          />

          {/* Active Forms Hub (with Status Filter Tabs & Instant Search) */}
          <DashboardRecentForms
            forms={sortedForms}
            totalForms={totalForms}
            isLoading={isFormsLoading}
            copiedId={copiedId}
            onCopyLink={handleCopyLink}
            onCreateOpen={handleOpenCreate}
          />
        </div>

        {/* Right / Utility Rail (4 Columns on desktop, 2-column grid on tablet) */}
        <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-col gap-5 sm:gap-6">
          {/* Workspace Quota & Capacity Meter */}
          <div className="w-full">
            <DashboardQuota
              isDataLoading={isDataLoading}
              totalSubmissions={totalSubmissions}
              totalForms={totalForms}
              publishedCount={publishedCount}
            />
          </div>

          {/* Realtime Submissions Stream */}
          <div className="w-full">
            <DashboardActivityFeed
              submissions={stats?.recentSubmissions}
              isLoading={isStatsLoading}
            />
          </div>

          {/* Pro Action Launcher Shortcuts */}
          <div className="w-full md:col-span-2 lg:col-span-1">
            <DashboardShortcuts onCreateOpen={() => handleOpenCreate()} />
          </div>
        </div>
      </div>

      {/* Standardized Create Form Dialog */}
      <CreateFormDialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) setPresetTitle(undefined);
        }}
        onSubmit={handleCreateForm}
        defaultTitle={presetTitle}
      />
    </div>
  );
}
