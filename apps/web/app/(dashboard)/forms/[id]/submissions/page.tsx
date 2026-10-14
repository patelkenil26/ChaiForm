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
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 w-full">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/forms/${formId}`}>
            <ArrowLeftIcon className="size-4" />
            <span className="sr-only">Back to form builder</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            Submissions & Analytics {form?.title ? `— ${form.title}` : ""}
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Monitor impressions, visual timeline charts, filter responses, and export data.
          </p>
        </div>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="mb-2">
          <TabsTrigger value="analytics" className="gap-1.5 text-xs">
            <BarChart3Icon className="size-3.5 text-primary" />
            <span>Analytics & Charts</span>
          </TabsTrigger>
          <TabsTrigger value="responses" className="gap-1.5 text-xs">
            <TablePropertiesIcon className="size-3.5 text-blue-500" />
            <span>Responses Table ({submissions?.length ?? 0})</span>
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

