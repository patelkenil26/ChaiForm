"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  SubmissionsTable,
  type SubmissionField,
  type SubmissionItem,
} from "~/components/submissions/submissions-table";
import { useGetForm } from "~/hooks/api/form";
import { useGetFields } from "~/hooks/api/form-field";
import { useGetFormSubmissions } from "~/hooks/api/form-submission";

export default function SubmissionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: formId } = use(params);

  const { form } = useGetForm(formId);
  const { fields, isLoading: fieldsLoading } = useGetFields(formId);
  const { submissions, isLoading: submissionsLoading } = useGetFormSubmissions(formId);

  const isLoading = fieldsLoading || submissionsLoading;

  return (
    <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-6 max-w-6xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/forms/${formId}`}>
            <ArrowLeftIcon className="size-4" />
            <span className="sr-only">Back to form builder</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            Submissions {form?.title ? `— ${form.title}` : ""}
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            View, search, filter, and export all respondent answers collected by this form.
          </p>
        </div>
      </div>

      <SubmissionsTable
        fields={fields as SubmissionField[] | undefined}
        submissions={submissions as SubmissionItem[] | undefined}
        isLoading={isLoading}
        formTitle={form?.title}
      />
    </div>
  );
}
