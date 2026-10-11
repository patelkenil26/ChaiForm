"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import {
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  ArrowLeftIcon,
  ExternalLinkIcon,
  CopyIcon,
  BarChart3Icon,
  GlobeIcon,
  LinkIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
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
import { useGetForm, useUpdateFormVisibility } from "~/hooks/api/form";
import {
  useGetFields,
  useCreateField,
  useUpdateField,
  useDeleteField,
} from "~/hooks/api/form-field";

const FIELD_TYPES = ["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"] as const;
type FieldType = (typeof FIELD_TYPES)[number];

const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  TEXT: "Text",
  NUMBER: "Number",
  EMAIL: "Email",
  YES_NO: "Yes / No",
  PASSWORD: "Password",
};

type FieldFormValues = {
  label: string;
  type: FieldType;
  description: string;
  placeholder: string;
  isRequired: boolean;
};

type FieldRow = {
  id: string;
  label: string;
  labelKey: string;
  type: FieldType;
  description?: string | null;
  placeholder?: string | null;
  isRequired: boolean;
  index: string;
};

const DEFAULT_VALUES: FieldFormValues = {
  label: "",
  type: "TEXT",
  description: "",
  placeholder: "",
  isRequired: false,
};

function FieldForm({
  onSubmit,
  isSubmitting,
  defaultValues,
  onCancel,
  submitLabel,
}: {
  onSubmit: SubmitHandler<FieldFormValues>;
  isSubmitting: boolean;
  defaultValues: FieldFormValues;
  onCancel: () => void;
  submitLabel: string;
}) {
  const { register, handleSubmit, control, watch, reset } = useForm<FieldFormValues>({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const type = watch("type");
  const hasPlaceholder = type !== "YES_NO";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="label">Label</FieldLabel>
          <Input
            id="label"
            placeholder="e.g. Full Name"
            {...register("label", { required: true, maxLength: 100 })}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="type">Type</FieldLabel>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {FIELD_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea
            id="description"
            placeholder="Helper text shown below the field (optional)"
            {...register("description")}
          />
        </Field>

        {hasPlaceholder && (
          <Field>
            <FieldLabel htmlFor="placeholder">Placeholder</FieldLabel>
            <Input
              id="placeholder"
              placeholder="e.g. Enter your name"
              {...register("placeholder")}
            />
          </Field>
        )}

        <div className="flex items-center gap-2">
          <Controller
            name="isRequired"
            control={control}
            render={({ field }) => (
              <Checkbox id="isRequired" checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label htmlFor="isRequired" className="text-sm font-medium">
            Required field
          </Label>
        </div>
      </FieldGroup>

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function FormBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: formId } = use(params);

  const { form } = useGetForm(formId);
  const { updateFormVisibilityAsync, isLoading: isUpdatingVisibility } = useUpdateFormVisibility();
  const { fields, isLoading } = useGetFields(formId);
  const { createFieldAsync, isError: isCreateError, error: createError } = useCreateField(formId);
  const { updateFieldAsync } = useUpdateField(formId);
  const { deleteFieldAsync } = useDeleteField(formId);

  const [createOpen, setCreateOpen] = useState(false);
  const [editingField, setEditingField] = useState<FieldRow | null>(null);

  const handleTogglePublish = async (checked: boolean) => {
    try {
      await updateFormVisibilityAsync({
        formId,
        isPublished: checked,
      });
      toast.success(
        checked
          ? "Form published! Live and accepting responses."
          : "Form unpublished! Submissions are now paused."
      );
    } catch {
      toast.error("Failed to update publish status");
    }
  };

  const handleSelectVisibility = async (value: "PUBLIC" | "UNLISTED") => {
    try {
      await updateFormVisibilityAsync({
        formId,
        visibility: value,
      });
      toast.success(
        `Form visibility set to ${value === "PUBLIC" ? "Public" : "Unlisted"}`
      );
    } catch {
      toast.error("Failed to update visibility");
    }
  };

  const handleCreate: SubmitHandler<FieldFormValues> = async (values) => {
    await createFieldAsync({
      formId,
      label: values.label,
      type: values.type,
      description: values.description || undefined,
      placeholder: values.placeholder || undefined,
      isRequired: values.isRequired,
    });
    setCreateOpen(false);
  };

  const handleUpdate: SubmitHandler<FieldFormValues> = async (values) => {
    if (!editingField) return;
    await updateFieldAsync({
      fieldId: editingField.id,
      label: values.label,
      type: values.type,
      description: values.description || null,
      placeholder: values.placeholder || null,
      isRequired: values.isRequired,
    });
    setEditingField(null);
  };

  const handleDelete = async (fieldId: string) => {
    await deleteFieldAsync({ fieldId });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/form/${formId}`);
    toast.success("Public form link copied to clipboard!");
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-6 max-w-4xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/forms">
              <ArrowLeftIcon className="size-4" />
              <span className="sr-only">Back to forms</span>
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                {form?.title || "Form Builder"}
              </h1>
              {form && (
                <div className="flex items-center gap-1.5">
                  {form.isPublished ? (
                    <Badge
                      variant="default"
                      className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs gap-1"
                    >
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Published
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs gap-1"
                    >
                      <span className="size-1.5 rounded-full bg-amber-500" />
                      Draft (Closed)
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs text-muted-foreground gap-1">
                    {form.visibility === "PUBLIC" ? (
                      <>
                        <GlobeIcon className="size-3 text-blue-500" />
                        Public
                      </>
                    ) : (
                      <>
                        <LinkIcon className="size-3 text-muted-foreground" />
                        Unlisted
                      </>
                    )}
                  </Badge>
                </div>
              )}
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              {form?.description || "Design fields and questions for this form"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/forms/${formId}/submissions`}>
              <BarChart3Icon className="size-3.5 mr-1.5" />
              Submissions
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopyLink}>
            <CopyIcon className="size-3.5 mr-1.5" />
            Share Link
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/form/${formId}`} target="_blank">
              <ExternalLinkIcon className="size-3.5 mr-1.5" />
              Live Form
            </Link>
          </Button>
          <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5">
            <PlusIcon className="size-3.5" />
            Add Field
          </Button>
        </div>
      </div>

      {/* Creator Controls: Publishing Status & Visibility Mode */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border bg-card/60 backdrop-blur-sm p-3.5 px-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch
              id="form-publish-switch"
              checked={form?.isPublished ?? true}
              disabled={isUpdatingVisibility || !form}
              onCheckedChange={handleTogglePublish}
            />
            <Label
              htmlFor="form-publish-switch"
              className="text-sm font-medium cursor-pointer select-none"
            >
              {form?.isPublished ? "Accepting Responses" : "Responses Paused"}
            </Label>
          </div>
          <span className="text-xs text-muted-foreground hidden md:inline">
            {form?.isPublished
              ? "(Form is published and accepting submissions)"
              : "(Form is closed; visitors will see a closed message)"}
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Label className="text-xs text-muted-foreground font-normal">Visibility:</Label>
          <Select
            value={form?.visibility ?? "UNLISTED"}
            disabled={isUpdatingVisibility || !form}
            onValueChange={handleSelectVisibility}
          >
            <SelectTrigger className="h-8 text-xs w-[130px] gap-1.5">
              <SelectValue placeholder="Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UNLISTED" className="text-xs">
                <span className="flex items-center gap-1.5">
                  <LinkIcon className="size-3.5 text-muted-foreground" />
                  Unlisted
                </span>
              </SelectItem>
              <SelectItem value="PUBLIC" className="text-xs">
                <span className="flex items-center gap-1.5">
                  <GlobeIcon className="size-3.5 text-blue-500" />
                  Public
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading fields...</p>
        ) : !fields || fields.length === 0 ? (
          <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
            No fields yet. Add your first field.
          </div>
        ) : (
          fields.map((field) => (
            <div
              key={field.id}
              className="flex items-start justify-between gap-4 rounded-lg border bg-card p-4"
            >
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{field.label}</span>
                  <Badge variant="outline" className="text-xs">
                    {FIELD_TYPE_LABELS[field.type as FieldType]}
                  </Badge>
                  {field.isRequired && (
                    <Badge variant="secondary" className="text-xs">
                      Required
                    </Badge>
                  )}
                </div>
                {field.description && (
                  <p className="text-xs text-muted-foreground truncate">{field.description}</p>
                )}
                <p className="text-xs text-muted-foreground/60 font-mono">{field.labelKey}</p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingField(field as FieldRow)}
                >
                  <PencilIcon className="size-4" />
                  <span className="sr-only">Edit {field.label}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(field.id)}
                >
                  <Trash2Icon className="size-4" />
                  <span className="sr-only">Delete {field.label}</span>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create field modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add field</DialogTitle>
          </DialogHeader>
          {isCreateError && <p className="text-sm text-destructive">{createError?.message}</p>}
          <FieldForm
            defaultValues={DEFAULT_VALUES}
            onSubmit={handleCreate}
            isSubmitting={false}
            onCancel={() => setCreateOpen(false)}
            submitLabel="Add Field"
          />
        </DialogContent>
      </Dialog>

      {/* Edit field modal */}
      <Dialog
        open={!!editingField}
        onOpenChange={(open) => {
          if (!open) setEditingField(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit field</DialogTitle>
          </DialogHeader>
          {editingField && (
            <FieldForm
              defaultValues={{
                label: editingField.label,
                type: editingField.type,
                description: editingField.description ?? "",
                placeholder: editingField.placeholder ?? "",
                isRequired: editingField.isRequired,
              }}
              onSubmit={handleUpdate}
              isSubmitting={false}
              onCancel={() => setEditingField(null)}
              submitLabel="Save Changes"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
