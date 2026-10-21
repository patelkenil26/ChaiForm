"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, BarChart3Icon, TablePropertiesIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  SubmissionsTable,
  type SubmissionField,
  type SubmissionItem,
} from "~/components/submissions/submissions-table";
import { FormAnalyticsView } from "~/components/analytics/form-analytics-view";
import { useGetForm } from "~/hooks/api/form";
import { useGetFields } from "~/hooks/api/form-field";
import { useGetFormSubmissions } from "~/hooks/api/form-submission";
import { useUser } from "~/hooks/api/auth";
import { landingTheme } from "~/config/landing-theme";

export default function SubmissionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: formId } = use(params);
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(`/forms/${formId}/submissions`)}`);
    }
  }, [user, isUserLoading, router, formId]);

  const { form } = useGetForm(formId);
  const { fields, isLoading: fieldsLoading } = useGetFields(formId);
  const { submissions, isLoading: submissionsLoading } = useGetFormSubmissions(formId);

  const isLoading = fieldsLoading || submissionsLoading;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 w-full animate-in fade-in duration-300">
      <div className="flex items-center gap-4 border-b border-border/60 pb-5">
        <Button variant="ghost" size="icon" asChild className={landingTheme.buttonGhostHover}>
          <Link href={`/forms/${formId}`}>
            <ArrowLeftIcon className="size-4" />
            <span className="sr-only">Back to form builder</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            Submissions &amp; <span className={landingTheme.gradientText}>Analytics</span>
            {form?.title ? ` — ${form.title}` : ""}
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Monitor impressions, visual timeline charts, filter responses, and export data.
          </p>
        </div>
      </div>

      <Tabs defaultValue="responses" className="w-full">
        <TabsList className="mb-2 inline-flex h-9 items-center p-1 rounded-lg bg-muted/30 border border-border/50 gap-1">
          <TabsTrigger
            value="responses"
            className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer border border-transparent data-[state=active]:bg-secondary/80 data-[state=active]:border-border/80 data-[state=active]:text-foreground data-[state=active]:shadow-2xs text-muted-foreground hover:text-foreground hover:bg-muted/40"
          >
            <TablePropertiesIcon className="size-3.5 text-muted-foreground group-data-[state=active]:text-blue-400 transition-colors" />
            <span>Responses Table</span>
            <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full font-medium tabular-nums bg-muted/60 text-muted-foreground group-data-[state=active]:bg-muted group-data-[state=active]:text-foreground border border-border/40">
              {submissions?.length ?? 0}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer border border-transparent data-[state=active]:bg-secondary/80 data-[state=active]:border-border/80 data-[state=active]:text-foreground data-[state=active]:shadow-2xs text-muted-foreground hover:text-foreground hover:bg-muted/40"
          >
            <BarChart3Icon className="size-3.5 text-muted-foreground group-data-[state=active]:text-[#fcd34d] transition-colors" />
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
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

