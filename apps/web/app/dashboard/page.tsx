"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  IconClipboardText,
  IconPlus,
  IconExternalLink,
  IconCopy,
  IconCheck,
  IconChartBar,
  IconSparkles,
  IconSend,
  IconListCheck,
  IconArrowRight,
  IconEye,
} from "@tabler/icons-react";
import { PencilIcon } from "lucide-react";
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

type CreateFormValues = {
  title: string;
  description: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { createFormAsync, isError, error } = useCreateForm();
  const { forms, isLoading } = useListForms();

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
        router.push(`/dashboard/forms/${res.id}`);
      }
    } catch {
      toast.error("Failed to create form");
    }
  };

  const handleCopyLink = (formId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(formId);
    toast.success("Form link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalForms = forms?.length ?? 0;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Welcome to ChaiForm
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Create interactive conversational forms, collect live responses, and analyze feedback.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setOpen(true)} className="gap-2 shadow-sm">
            <IconPlus className="size-4" />
            Create Form
          </Button>
        </div>
      </div>

      {/* Metrics / Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Total Forms</span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <IconClipboardText className="size-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-14" /> : totalForms}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {totalForms === 1 ? "1 active form" : `${totalForms} forms created`}
            </p>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Response Collector</span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <IconSend className="size-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-500">Active</div>
            <p className="mt-1 text-xs text-muted-foreground">Ready to accept submissions</p>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Question Types</span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <IconListCheck className="size-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold">5 Types</div>
            <p className="mt-1 text-xs text-muted-foreground">Text, Number, Email, Yes/No, Password</p>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Submissions Engine</span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <IconChartBar className="size-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold">Real-time</div>
            <p className="mt-1 text-xs text-muted-foreground">Track responses per form</p>
          </div>
        </Card>
      </div>

      {/* Forms Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight md:text-xl">Your Forms</h2>
            <p className="text-xs text-muted-foreground md:text-sm">
              Manage your forms, open builder, or view incoming submissions.
            </p>
          </div>
          {totalForms > 0 && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/forms" className="gap-1.5 text-xs font-medium">
                View All Forms
                <IconArrowRight className="size-3.5" />
              </Link>
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-9 w-full" />
              </Card>
            ))}
          </div>
        ) : !forms || forms.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted mb-4">
              <IconClipboardText className="size-7 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No forms created yet</h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              Get started by creating your first form to collect submissions and interact with your users.
            </p>
            <Button onClick={() => setOpen(true)} className="mt-6 gap-2">
              <IconPlus className="size-4" />
              Create Your First Form
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {forms.map((form) => (
              <Card
                key={form.id}
                className="flex flex-col justify-between transition-all duration-200 hover:border-primary/50 hover:shadow-md"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-1 text-base font-semibold">
                      {form.title}
                    </CardTitle>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {form.isPublished ? (
                        <Badge
                          variant="default"
                          className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20 text-xs font-normal"
                        >
                          Published
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border-amber-500/20 text-xs font-normal"
                        >
                          Draft
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                        {form.visibility === "PUBLIC" ? "Public" : "Unlisted"}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2 text-xs">
                    {form.description || "No description provided"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-3 text-xs text-muted-foreground">
                  Created {form.createdAt ? new Date(form.createdAt).toLocaleDateString() : "Recently"}
                </CardContent>

                <CardFooter className="flex items-center justify-between gap-2 border-t pt-3">
                  <div className="flex items-center gap-1.5">
                    <Button variant="outline" size="sm" asChild className="gap-1.5 text-xs">
                      <Link href={`/dashboard/forms/${form.id}`}>
                        <PencilIcon className="size-3.5" />
                        Builder
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild className="gap-1.5 text-xs">
                      <Link href={`/dashboard/forms/${form.id}/submissions`}>
                        <IconChartBar className="size-3.5" />
                        Responses
                      </Link>
                    </Button>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      title="Copy Public Link"
                      onClick={(e) => handleCopyLink(form.id, e)}
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
                      className="size-8"
                      asChild
                      title="Open Live Form"
                    >
                      <Link href={`/form/${form.id}`} target="_blank">
                        <IconExternalLink className="size-4" />
                        <span className="sr-only">Open Live Form</span>
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ChaiForm Workflow Guide Cards */}
      <div className="mt-4 flex flex-col gap-4">
        <h3 className="text-base font-semibold">How ChaiForm Works</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="p-5">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary font-bold text-sm mb-3">
              1
            </div>
            <h4 className="font-medium text-sm">Build Your Form</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Add custom fields such as text, email, numbers, and yes/no options with easy reordering.
            </p>
          </Card>
          <Card className="p-5">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary font-bold text-sm mb-3">
              2
            </div>
            <h4 className="font-medium text-sm">Share Publicly</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Copy your form's unique public link and share it anywhere. Accessible across all devices.
            </p>
          </Card>
          <Card className="p-5">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary font-bold text-sm mb-3">
              3
            </div>
            <h4 className="font-medium text-sm">Collect & Review</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Monitor submissions live on your dashboard and view tabulated data instantly.
            </p>
          </Card>
        </div>
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
              {isError && (
                <p className="text-sm text-destructive">{error?.message}</p>
              )}
            </FieldGroup>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Form"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

