"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  IconInbox,
  IconClipboardText,
  IconExternalLink,
  IconCheck,
  IconCopy,
  IconPencil,
  IconPlus,
  IconChartBar,
  IconTable,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  SubmissionsTable,
  type SubmissionField,
  type SubmissionItem,
} from "~/components/submissions/submissions-table";
import { FormAnalyticsView } from "~/components/analytics/form-analytics-view";
import { useListForms } from "~/hooks/api/form";
import { useGetFields } from "~/hooks/api/form-field";
import { useGetFormSubmissions } from "~/hooks/api/form-submission";
import { useUser } from "~/hooks/api/auth";
import { landingTheme } from "~/config/landing-theme";

function formatRelativeTime(dateInput: Date | string | null | undefined): string {
  if (!dateInput) return "—";
  const date = new Date(dateInput);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffSec < 60) return "Just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function SubmissionsHubContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFormId = searchParams.get("formId");

  const { user, isLoading: isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && !user) {
      const redirectUrl = initialFormId ? `/submissions?formId=${initialFormId}` : "/submissions";
      router.replace(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
    }
  }, [user, isUserLoading, router, initialFormId]);

  const { forms, isLoading: formsLoading } = useListForms();
  const [selectedFormId, setSelectedFormId] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // Auto-select first form or sync from searchParams
  useEffect(() => {
    if (!forms || forms.length === 0) return;

    if (initialFormId && forms.some((f) => f.id === initialFormId)) {
      setSelectedFormId(initialFormId);
    } else if (!selectedFormId || !forms.some((f) => f.id === selectedFormId)) {
      setSelectedFormId(forms[0]?.id ?? "");
    }
  }, [forms, initialFormId, selectedFormId]);

  const handleFormChange = (newFormId: string) => {
    setSelectedFormId(newFormId);
    router.replace(`/submissions?formId=${newFormId}`, { scroll: false });
  };

  const currentForm = useMemo(
    () => forms?.find((f) => f.id === selectedFormId),
    [forms, selectedFormId],
  );

  const { fields, isLoading: fieldsLoading } = useGetFields(selectedFormId || "");
  const { submissions, isLoading: submissionsLoading } = useGetFormSubmissions(
    selectedFormId || "",
  );

  const isDataLoading = fieldsLoading || submissionsLoading;

  const handleCopyLink = () => {
    if (!currentForm) return;
    const target = currentForm.slug || currentForm.id;
    const url = `${window.location.origin}/form/${target}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Public form link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (formsLoading) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 w-full">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!forms || forms.length === 0) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 w-full animate-in fade-in duration-300">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Submissions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View, filter, and export respondent answers across all your forms.
          </p>
        </div>

        <Card
          className={`flex flex-col items-center justify-center p-12 text-center border-dashed rounded-2xl ${landingTheme.cardBorderHover}`}
        >
          <div
            className={`flex size-14 items-center justify-center rounded-full mb-4 ${landingTheme.iconBg}`}
          >
            <IconInbox className="size-7" />
          </div>
          <h3 className="text-lg font-semibold">No forms created yet</h3>
          <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
            Once you create forms and collect responses, all submissions will appear here for
            filtering and export.
          </p>
          <Button asChild className={`mt-6 gap-2 text-xs h-9 ${landingTheme.primaryButton}`}>
            <Link href="/forms">
              <IconPlus className="size-4" />
              <span>Create Your First Form</span>
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  const formTarget = currentForm?.slug || currentForm?.id;
  const submissionsCount = submissions?.length ?? 0;
  const fieldsCount = fields?.length ?? 0;

  const lastResponse = useMemo(() => {
    if (!submissions || submissions.length === 0) return "—";
    const sorted = [...submissions].sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    });
    return formatRelativeTime(sorted[0]?.createdAt);
  }, [submissions]);

  const avgCompletionTime = useMemo(() => {
    if (!submissions || submissions.length === 0) return "—";
    const sec = Math.max(25, fieldsCount * 15);
    return sec < 60 ? `~${sec}s` : `~${Math.round(sec / 60)}m`;
  }, [submissions, fieldsCount]);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 w-full animate-in fade-in duration-300">
      {/* Top Header & Switcher */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div
              className={`flex size-9 items-center justify-center rounded-lg ${landingTheme.iconBg}`}
            >
              <IconInbox className="size-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                Submissions &amp; <span className={landingTheme.gradientText}>Responses</span>
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Inspect live answers, filter by date, search responses, and export telemetry.
              </p>
            </div>
          </div>
        </div>

        {/* Form Selector Dropdown & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground hidden sm:inline">
              Form:
            </span>
            <Select value={selectedFormId} onValueChange={handleFormChange}>
              <SelectTrigger
                className={`w-full max-w-[220px] sm:w-[220px] md:w-[280px] h-9 text-xs border-border/70 ${landingTheme.inputFocus}`}
              >
                <SelectValue placeholder="Select a form..." />
              </SelectTrigger>
              <SelectContent>
                {forms.map((f) => (
                  <SelectItem key={f.id} value={f.id} className="text-xs">
                    <span className="flex items-center gap-2">
                      <span className="truncate max-w-[170px] font-medium">{f.title}</span>
                      {f.isPublished ? (
                        <span
                          className="size-1.5 rounded-full bg-emerald-500 shrink-0"
                          title="Published"
                        />
                      ) : (
                        <span
                          className="size-1.5 rounded-full bg-amber-500 shrink-0"
                          title="Draft"
                        />
                      )}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {currentForm && (
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className={`h-9 gap-1.5 text-xs ${landingTheme.buttonOutlineHover}`}
                onClick={handleCopyLink}
                title="Copy Public Link"
              >
                {copied ? (
                  <IconCheck className="size-3.5 text-emerald-500" />
                ) : (
                  <IconCopy className="size-3.5" />
                )}
                <span className="hidden md:inline">Share</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className={`h-9 gap-1.5 text-xs ${landingTheme.buttonOutlineHover}`}
                asChild
                title="Open Form Builder"
              >
                <Link href={`/forms/${currentForm.id}`}>
                  <IconPencil className="size-3.5" />
                  <span className="hidden md:inline">Builder</span>
                </Link>
              </Button>

              <Button
                size="sm"
                className={`h-9 gap-1.5 text-xs ${landingTheme.primaryButton}`}
                asChild
                title="Open Live Public Form"
              >
                <Link href={`/form/${formTarget}`} target="_blank">
                  <IconExternalLink className="size-3.5" />
                  <span>Live Form</span>
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats Row */}
      {currentForm && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {/* Card 1: Total Responses (Amber/Gold) */}
          <Card
            className={`relative p-4 rounded-xl border ${landingTheme.cardBg} hover:border-amber-400/50 transition-all duration-200 overflow-hidden group`}
          >
            <div className={landingTheme.cardBeam} />
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
            className={`relative p-4 rounded-xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} transition-all duration-200 overflow-hidden group`}
          >
            <div className={landingTheme.cardBeam} />
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
            className={`relative p-4 rounded-xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} transition-all duration-200 overflow-hidden group`}
          >
            <div className={landingTheme.cardBeam} />
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
            className={`relative p-4 rounded-xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} transition-all duration-200 overflow-hidden group`}
          >
            <div className={landingTheme.cardBeam} />
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
      )}

      {/* Main Content Tabs: Analytics vs Responses Table */}
      <Tabs defaultValue="responses" className="w-full">
        <TabsList className="mb-2 inline-flex h-9 items-center p-0.5 rounded-lg bg-muted/30 border border-border/50 gap-1">
          <TabsTrigger
            value="responses"
            className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer border border-transparent data-[state=active]:!bg-secondary/80 data-[state=active]:!border-border/80 data-[state=active]:!text-foreground data-[state=active]:!shadow-2xs text-muted-foreground hover:text-foreground hover:!bg-muted/50"
          >
            <IconTable
              className={`size-3.5 text-muted-foreground ${landingTheme.tabActiveIcon} transition-colors`}
            />
            <span>Responses Table</span>
            <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full font-medium tabular-nums bg-muted/40 text-muted-foreground border border-border/40 group-data-[state=active]:bg-muted group-data-[state=active]:text-foreground group-data-[state=active]:border-border/70 transition-colors">
              {submissionsCount}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer border border-transparent data-[state=active]:!bg-secondary/80 data-[state=active]:!border-border/80 data-[state=active]:!text-foreground data-[state=active]:!shadow-2xs text-muted-foreground hover:text-foreground hover:!bg-muted/50"
          >
            <IconChartBar
              className={`size-3.5 text-muted-foreground ${landingTheme.tabActiveIcon} transition-colors`}
            />
            <span>Analytics &amp; Charts</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="pt-2">
          <FormAnalyticsView
            formTitle={currentForm?.title}
            viewsCount={currentForm?.views ?? 0}
            submissions={submissions as SubmissionItem[] | undefined}
            fields={fields as SubmissionField[] | undefined}
            isLoading={isDataLoading}
          />
        </TabsContent>

        <TabsContent value="responses" className="pt-2">
          <SubmissionsTable
            fields={fields as SubmissionField[] | undefined}
            submissions={submissions as SubmissionItem[] | undefined}
            isLoading={isDataLoading}
            formTitle={currentForm?.title}
            onCopyShareLink={handleCopyLink}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function SubmissionsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6">
          <Skeleton className="h-10 w-48 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <SubmissionsHubContent />
    </Suspense>
  );
}
