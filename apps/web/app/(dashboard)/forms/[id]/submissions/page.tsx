"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconArrowLeft,
  IconChartBar,
  IconTable,
  IconExternalLink,
  IconCopy,
  IconCheck,
  IconPencil,
  IconSparkles,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  SubmissionsTable,
  type SubmissionField,
  type SubmissionItem,
} from "~/components/submissions/submissions-table";
import { SubmissionsSummaryCards } from "~/components/submissions/submissions-summary-cards";
import { FormAnalyticsView } from "~/components/analytics/form-analytics-view";
import { useGetForm } from "~/hooks/api/form";
import { useGetFields } from "~/hooks/api/form-field";
import { useGetFormSubmissions } from "~/hooks/api/form-submission";
import { useUser } from "~/hooks/api/auth";
import { formatRelativeTime } from "~/lib/date-utils";
import { landingTheme } from "~/config/landing-theme";

export default function SingleFormSubmissionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: formId } = use(params);
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useUser();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(`/forms/${formId}/submissions`)}`);
    }
  }, [user, isUserLoading, router, formId]);

  const { form } = useGetForm(formId);
  const { fields, isLoading: fieldsLoading } = useGetFields(formId);
  const { submissions, isLoading: submissionsLoading } = useGetFormSubmissions(formId);

  const isLoading = fieldsLoading || submissionsLoading;
  const submissionsCount = submissions?.length ?? 0;
  const fieldsCount = fields?.length ?? 0;

  const handleCopyLink = () => {
    if (!form) return;
    const target = form.slug || form.id;
    navigator.clipboard.writeText(`${window.location.origin}/form/${target}`);
    setCopied(true);
    toast.success("Public form link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

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

  const formTarget = form?.slug || form?.id;

  return (
    <div className="flex flex-col gap-5 sm:gap-6 p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className={`size-9 rounded-xl border border-border/70 ${landingTheme.buttonGhostHover}`}
            title="Back to Form Builder"
          >
            <Link href={`/forms/${formId}`}>
              <IconArrowLeft className="size-4" />
              <span className="sr-only">Back to form builder</span>
            </Link>
          </Button>

          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate max-w-[280px] sm:max-w-md">
                {form?.title || "Form"} Answers
              </h1>
              {form?.isPublished ? (
                <Badge
                  variant="default"
                  className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] font-semibold px-2 py-0.5"
                >
                  <span className="size-1 rounded-full bg-emerald-400 mr-1 animate-pulse" />
                  Live
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-[10px] font-semibold px-2 py-0.5">
                  Draft
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Review live respondent submissions, analyze completion rates, and export data.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className={`h-8.5 text-xs gap-1.5 border-border/70 ${landingTheme.buttonOutlineHover}`}
            title="Copy public link to share on WhatsApp or Email"
          >
            {copied ? (
              <>
                <IconCheck className="size-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <IconCopy className="size-3.5 text-muted-foreground" />
                <span>Share Form</span>
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            asChild
            className={`h-8.5 text-xs gap-1.5 border-border/70 ${landingTheme.buttonOutlineHover}`}
            title="Open form builder to edit questions"
          >
            <Link href={`/forms/${formId}`}>
              <IconPencil className="size-3.5 text-muted-foreground" />
              <span>Edit Questions</span>
            </Link>
          </Button>

          {formTarget && (
            <Button
              size="sm"
              asChild
              className={`h-8.5 text-xs gap-1.5 ${landingTheme.primaryButton}`}
              title="Open live public form in a new tab"
            >
              <Link href={`/form/${formTarget}`} target="_blank">
                <IconExternalLink className="size-3.5" />
                <span>Open Live Form</span>
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* 2. Executive Metrics Strip */}
      <SubmissionsSummaryCards
        submissionsCount={submissionsCount}
        fieldsCount={fieldsCount}
        lastResponse={lastResponse}
        avgCompletionTime={avgCompletionTime}
        submissionsLoading={submissionsLoading}
        fieldsLoading={fieldsLoading}
      />

      {/* 3. Main Stage: Responses Table vs Visual Analytics */}
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
            formTitle={form?.title}
            viewsCount={form?.views ?? 0}
            submissions={submissions as SubmissionItem[] | undefined}
            fields={fields as SubmissionField[] | undefined}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="responses" className="pt-2">
          <SubmissionsTable
            fields={fields as SubmissionField[] | undefined}
            submissions={submissions as SubmissionItem[] | undefined}
            isLoading={isLoading}
            formTitle={form?.title}
            onCopyShareLink={handleCopyLink}
            formSlugOrId={formTarget}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
