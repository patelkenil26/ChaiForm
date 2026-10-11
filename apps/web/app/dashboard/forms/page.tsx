"use client";

import { useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import Link from "next/link";
import {
  PencilIcon,
  BarChart3Icon,
  ExternalLinkIcon,
  CopyIcon,
  GlobeIcon,
  LinkIcon,
  PlusIcon,
  ClockIcon,
  UsersIcon,
  QrCodeIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Switch } from "~/components/ui/switch";
import { QrCodeDialog } from "~/components/qr-code-dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useCreateForm, useListForms, useUpdateFormVisibility } from "~/hooks/api/form";

type CreateFormValues = {
  title: string;
  description: string;
  visibility: "PUBLIC" | "UNLISTED";
  isPublished: boolean;
};

export default function FormsPage() {
  const [open, setOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedQrForm, setSelectedQrForm] = useState<{
    title: string;
    url: string;
    slug?: string | null;
  } | null>(null);
  const { createFormAsync, isError, error } = useCreateForm();
  const { forms, isLoading } = useListForms();
  const { updateFormVisibilityAsync } = useUpdateFormVisibility();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateFormValues>({
    defaultValues: {
      title: "",
      description: "",
      visibility: "UNLISTED",
      isPublished: true,
    },
  });

  const onSubmit: SubmitHandler<CreateFormValues> = async (values) => {
    try {
      await createFormAsync({
        title: values.title,
        description: values.description || undefined,
        visibility: values.visibility,
        isPublished: values.isPublished,
      });
      reset();
      setOpen(false);
      toast.success("Form created successfully!");
    } catch {
      toast.error("Failed to create form");
    }
  };

  const handleTogglePublish = async (formId: string, currentPublished: boolean) => {
    setUpdatingId(formId);
    try {
      await updateFormVisibilityAsync({
        formId,
        isPublished: !currentPublished,
      });
      toast.success(
        !currentPublished
          ? "Form published! Live & accepting responses."
          : "Form unpublished! Submissions paused."
      );
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleVisibilityChange = async (
    formId: string,
    visibility: "PUBLIC" | "UNLISTED"
  ) => {
    setUpdatingId(formId);
    try {
      await updateFormVisibilityAsync({
        formId,
        visibility,
      });
      toast.success(
        `Visibility changed to ${visibility === "PUBLIC" ? "Public" : "Unlisted"}`
      );
    } catch {
      toast.error("Failed to update visibility");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Forms</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage, publish, and track responses for all your forms.
          </p>
        </div>
        <Button onClick={() => setOpen(true)} className="gap-1.5">
          <PlusIcon className="size-4" />
          Create Form
        </Button>
      </div>

      <div className="rounded-xl border overflow-hidden bg-card shadow-xs">
        <Table>
          <TableHeader className="bg-muted/60">
            <TableRow>
              <TableHead className="font-semibold">Title</TableHead>
              <TableHead className="w-44 font-semibold">Status</TableHead>
              <TableHead className="w-36 font-semibold">Visibility</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="w-28 font-semibold">Created</TableHead>
              <TableHead className="w-36 text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-28 text-center text-muted-foreground">
                  Loading forms...
                </TableCell>
              </TableRow>
            ) : !forms || forms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No forms yet. Click "Create Form" to start building.
                </TableCell>
              </TableRow>
            ) : (
              forms.map((form) => (
                <TableRow key={form.id} className="hover:bg-muted/40 transition-colors">
                  <TableCell className="font-medium">
                    <Link
                      href={`/dashboard/forms/${form.id}`}
                      className="hover:underline hover:text-primary transition-colors block"
                    >
                      {form.title}
                    </Link>
                    {(form.slug || form.closesAt || form.responseLimit) && (
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {form.slug && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded">
                            /form/{form.slug}
                          </span>
                        )}
                        {form.closesAt && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                            <ClockIcon className="size-3 text-amber-500" />
                            {new Date() > new Date(form.closesAt)
                              ? "Expired"
                              : `Closes ${new Date(form.closesAt).toLocaleDateString()}`}
                          </span>
                        )}
                        {form.responseLimit && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                            <UsersIcon className="size-3 text-blue-500" />
                            Limit: {form.responseLimit}
                          </span>
                        )}
                      </div>
                    )}
                  </TableCell>

                  {/* Status Toggle & Badge */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={form.isPublished}
                        disabled={updatingId === form.id}
                        onCheckedChange={() => handleTogglePublish(form.id, form.isPublished)}
                        title={form.isPublished ? "Click to unpublish" : "Click to publish"}
                      />
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
                    </div>
                  </TableCell>

                  {/* Visibility Dropdown */}
                  <TableCell>
                    <Select
                      value={form.visibility}
                      disabled={updatingId === form.id}
                      onValueChange={(val: "PUBLIC" | "UNLISTED") =>
                        handleVisibilityChange(form.id, val)
                      }
                    >
                      <SelectTrigger className="h-7 text-xs w-[110px] gap-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UNLISTED" className="text-xs">
                          <span className="flex items-center gap-1.5">
                            <LinkIcon className="size-3 text-muted-foreground" />
                            Unlisted
                          </span>
                        </SelectItem>
                        <SelectItem value="PUBLIC" className="text-xs">
                          <span className="flex items-center gap-1.5">
                            <GlobeIcon className="size-3 text-blue-500" />
                            Public
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                    {form.description ?? "—"}
                  </TableCell>

                  <TableCell className="text-muted-foreground text-xs">
                    {form.createdAt ? new Date(form.createdAt).toLocaleDateString() : "—"}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild title="Edit in builder">
                        <Link href={`/dashboard/forms/${form.id}`}>
                          <PencilIcon className="size-4" />
                          <span className="sr-only">Edit {form.title}</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild title="View Submissions">
                        <Link href={`/dashboard/forms/${form.id}/submissions`}>
                          <BarChart3Icon className="size-4" />
                          <span className="sr-only">Submissions for {form.title}</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Copy Public Link"
                        onClick={() => {
                          const target = form.slug || form.id;
                          navigator.clipboard.writeText(`${window.location.origin}/form/${target}`);
                          toast.success("Form link copied to clipboard!");
                        }}
                      >
                        <CopyIcon className="size-4" />
                        <span className="sr-only">Copy Link</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="QR Code"
                        onClick={() => {
                          const target = form.slug || form.id;
                          setSelectedQrForm({
                            title: form.title,
                            url: `${window.location.origin}/form/${target}`,
                            slug: form.slug,
                          });
                        }}
                      >
                        <QrCodeIcon className="size-4" />
                        <span className="sr-only">QR Code for {form.title}</span>
                      </Button>
                      <Button variant="ghost" size="icon" asChild title="Open Public Form">
                        <Link href={`/form/${form.slug || form.id}`} target="_blank">
                          <ExternalLinkIcon className="size-4" />
                          <span className="sr-only">Open {form.title}</span>
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Form Dialog with Visibility & Published controls */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new form</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <Input
                  id="title"
                  placeholder="e.g. Customer Feedback Survey"
                  {...register("title", { required: true, maxLength: 55 })}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  placeholder="What is this form for? (optional)"
                  rows={3}
                  {...register("description", { maxLength: 300 })}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <Field>
                  <FieldLabel>Visibility</FieldLabel>
                  <Controller
                    name="visibility"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UNLISTED" className="text-xs">
                            <span className="flex items-center gap-1.5">
                              <LinkIcon className="size-3 text-muted-foreground" />
                              Unlisted (Link only)
                            </span>
                          </SelectItem>
                          <SelectItem value="PUBLIC" className="text-xs">
                            <span className="flex items-center gap-1.5">
                              <GlobeIcon className="size-3 text-blue-500" />
                              Public (Listed)
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>

                <Field>
                  <FieldLabel>Status</FieldLabel>
                  <Controller
                    name="isPublished"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center gap-2.5 h-9 px-3 rounded-md border bg-muted/30">
                        <Switch
                          id="new-form-published"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <label
                          htmlFor="new-form-published"
                          className="text-xs font-medium cursor-pointer"
                        >
                          {field.value ? "Published" : "Draft (Closed)"}
                        </label>
                      </div>
                    )}
                  />
                </Field>
              </div>

              {isError && (
                <p className="text-sm text-destructive">{error?.message}</p>
              )}
            </FieldGroup>

            <DialogFooter className="mt-2">
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

      {/* QR Code Sharing Dialog */}
      {selectedQrForm && (
        <QrCodeDialog
          open={!!selectedQrForm}
          onOpenChange={(isOpen) => {
            if (!isOpen) setSelectedQrForm(null);
          }}
          url={selectedQrForm.url}
          title={selectedQrForm.title}
          slug={selectedQrForm.slug}
        />
      )}
    </div>
  );
}
