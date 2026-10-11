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
  XIcon,
  SlidersHorizontalIcon,
  ClockIcon,
  UsersIcon,
  QrCodeIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
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
import { useGetForm, useUpdateFormVisibility, useUpdateFormSettings } from "~/hooks/api/form";
import {
  useGetFields,
  useCreateField,
  useUpdateField,
  useDeleteField,
} from "~/hooks/api/form-field";

const FIELD_TYPES = [
  "TEXT",
  "TEXTAREA",
  "NUMBER",
  "EMAIL",
  "PHONE",
  "URL",
  "DATE",
  "TIME",
  "YES_NO",
  "PASSWORD",
  "SELECT",
  "RADIO",
  "CHECKBOX",
  "RATING",
] as const;
type FieldType = (typeof FIELD_TYPES)[number];

const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  TEXT: "Short Text",
  TEXTAREA: "Long Text (Paragraph)",
  NUMBER: "Number",
  EMAIL: "Email Address",
  PHONE: "Phone Number",
  URL: "Website / URL",
  DATE: "Date Picker",
  TIME: "Time Picker",
  YES_NO: "Yes / No Toggle",
  PASSWORD: "Password",
  SELECT: "Dropdown (Single Select)",
  RADIO: "Single Choice (Radio)",
  CHECKBOX: "Multiple Choice (Checkbox)",
  RATING: "Rating (1-5 Stars)",
};

type FieldFormValues = {
  label: string;
  type: FieldType;
  description: string;
  placeholder: string;
  isRequired: boolean;
  options: string[];
};

type FieldRow = {
  id: string;
  label: string;
  labelKey: string;
  type: FieldType;
  description?: string | null;
  placeholder?: string | null;
  isRequired: boolean;
  options?: string[] | null;
  index: string;
};

const DEFAULT_VALUES: FieldFormValues = {
  label: "",
  type: "TEXT",
  description: "",
  placeholder: "",
  isRequired: false,
  options: ["Option 1", "Option 2"],
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

  const [newOptionInput, setNewOptionInput] = useState("");

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const type = watch("type");
  const isChoiceType = type === "SELECT" || type === "RADIO" || type === "CHECKBOX";
  const hasPlaceholder =
    type !== "YES_NO" && type !== "RATING" && type !== "CHECKBOX" && type !== "RADIO";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="label">Label / Question</FieldLabel>
          <Input
            id="label"
            placeholder="e.g. What is your email address?"
            {...register("label", { required: true, maxLength: 100 })}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="type">Field Type</FieldLabel>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
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

        {isChoiceType && (
          <Field>
            <FieldLabel>Options / Choices</FieldLabel>
            <Controller
              name="options"
              control={control}
              render={({ field }) => {
                const currentOptions = field.value || [];

                const handleAdd = () => {
                  if (!newOptionInput.trim()) return;
                  field.onChange([...currentOptions, newOptionInput.trim()]);
                  setNewOptionInput("");
                };

                const handleRemove = (idxToRemove: number) => {
                  field.onChange(currentOptions.filter((_, i) => i !== idxToRemove));
                };

                return (
                  <div className="flex flex-col gap-2 rounded-lg border bg-muted/20 p-3">
                    <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto">
                      {currentOptions.map((opt, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md border bg-card text-xs shadow-2xs"
                        >
                          <span className="truncate">{opt}</span>
                          <button
                            type="button"
                            onClick={() => handleRemove(i)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <XIcon className="size-3.5" />
                          </button>
                        </div>
                      ))}
                      {currentOptions.length === 0 && (
                        <p className="text-xs text-muted-foreground italic py-1">
                          No options added yet. Add at least one option below.
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        placeholder="Add an option..."
                        value={newOptionInput}
                        onChange={(e) => setNewOptionInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAdd();
                          }
                        }}
                        className="h-8 text-xs"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleAdd}
                        className="h-8 text-xs shrink-0"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                );
              }}
            />
          </Field>
        )}

        <Field>
          <FieldLabel htmlFor="description">Helper Text / Description</FieldLabel>
          <Textarea
            id="description"
            placeholder="Subtext shown below the question (optional)"
            rows={2}
            {...register("description")}
          />
        </Field>

        {hasPlaceholder && (
          <Field>
            <FieldLabel htmlFor="placeholder">Placeholder</FieldLabel>
            <Input
              id="placeholder"
              placeholder="e.g. Type your answer here..."
              {...register("placeholder")}
            />
          </Field>
        )}

        <div className="flex items-center gap-2 pt-1">
          <Controller
            name="isRequired"
            control={control}
            render={({ field }) => (
              <Checkbox id="isRequired" checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label htmlFor="isRequired" className="text-sm font-medium cursor-pointer">
            Required question
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

function FormLimitsDialog({
  open,
  onOpenChange,
  form,
  onSave,
  isSaving,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: NonNullable<ReturnType<typeof useGetForm>["form"]>;
  onSave: (settings: { closesAt: Date | null; responseLimit: number | null; slug: string | null }) => Promise<void>;
  isSaving: boolean;
}) {
  const [hasExpiry, setHasExpiry] = useState(false);
  const [expiryValue, setExpiryValue] = useState("");
  const [hasLimit, setHasLimit] = useState(false);
  const [limitValue, setLimitValue] = useState("");
  const [hasSlug, setHasSlug] = useState(false);
  const [slugValue, setSlugValue] = useState("");

  useEffect(() => {
    if (open && form) {
      if (form.closesAt) {
        setHasExpiry(true);
        const d = new Date(form.closesAt);
        const pad = (n: number) => String(n).padStart(2, "0");
        const formatted = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        setExpiryValue(formatted);
      } else {
        setHasExpiry(false);
        setExpiryValue("");
      }

      if (form.responseLimit) {
        setHasLimit(true);
        setLimitValue(String(form.responseLimit));
      } else {
        setHasLimit(false);
        setLimitValue("");
      }

      if (form.slug) {
        setHasSlug(true);
        setSlugValue(form.slug);
      } else {
        setHasSlug(false);
        setSlugValue("");
      }
    }
  }, [open, form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const closesAt = hasExpiry && expiryValue ? new Date(expiryValue) : null;
    const responseLimit = hasLimit && limitValue ? parseInt(limitValue, 10) : null;
    const slug = hasSlug && slugValue.trim() ? slugValue.toLowerCase().trim() : null;
    await onSave({ closesAt, responseLimit, slug });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SlidersHorizontalIcon className="size-5 text-primary" />
            Form Settings, URL & Limits
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {/* Submission status banner */}
          <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/40 text-xs">
            <span className="text-muted-foreground">Current Submissions:</span>
            <span className="font-semibold text-foreground">
              {form.submissionCount} {form.responseLimit ? `/ ${form.responseLimit}` : "responses"}
            </span>
          </div>

          {/* Custom Slug / Clean URL Section */}
          <div className="flex flex-col gap-3 rounded-xl border p-4 bg-card">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="toggle-slug" className="text-sm font-medium cursor-pointer">
                  Custom Clean URL
                </Label>
                <p className="text-xs text-muted-foreground">
                  Personalize the public link with a short slug
                </p>
              </div>
              <Switch
                id="toggle-slug"
                checked={hasSlug}
                onCheckedChange={setHasSlug}
              />
            </div>

            {hasSlug && (
              <div className="pt-2 space-y-1.5">
                <FieldLabel htmlFor="custom-slug">Public URL Slug</FieldLabel>
                <div className="flex items-center rounded-md border bg-muted/40 px-3 focus-within:ring-1 focus-within:ring-ring">
                  <span className="text-xs text-muted-foreground font-mono select-none">
                    /form/
                  </span>
                  <input
                    id="custom-slug"
                    type="text"
                    placeholder="my-form-name"
                    value={slugValue}
                    onChange={(e) => {
                      const val = e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9-]/g, "");
                      setSlugValue(val);
                    }}
                    className="w-full bg-transparent px-1.5 py-2 text-xs font-mono outline-none"
                    required={hasSlug}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Letters, numbers, and hyphens only (min 3 chars).
                </p>
              </div>
            )}
          </div>

          {/* Expiry Date Section */}
          <div className="flex flex-col gap-3 rounded-xl border p-4 bg-card">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="toggle-expiry" className="text-sm font-medium cursor-pointer">
                  Schedule Expiration
                </Label>
                <p className="text-xs text-muted-foreground">
                  Automatically close form after specific date & time
                </p>
              </div>
              <Switch
                id="toggle-expiry"
                checked={hasExpiry}
                onCheckedChange={setHasExpiry}
              />
            </div>

            {hasExpiry && (
              <div className="pt-2">
                <FieldLabel htmlFor="expiry-datetime">Close on (Date & Time)</FieldLabel>
                <Input
                  id="expiry-datetime"
                  type="datetime-local"
                  value={expiryValue}
                  onChange={(e) => setExpiryValue(e.target.value)}
                  className="text-sm"
                  required={hasExpiry}
                />
              </div>
            )}
          </div>

          {/* Response Limit Section */}
          <div className="flex flex-col gap-3 rounded-xl border p-4 bg-card">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="toggle-limit" className="text-sm font-medium cursor-pointer">
                  Response Cap
                </Label>
                <p className="text-xs text-muted-foreground">
                  Limit maximum number of accepted submissions
                </p>
              </div>
              <Switch
                id="toggle-limit"
                checked={hasLimit}
                onCheckedChange={setHasLimit}
              />
            </div>

            {hasLimit && (
              <div className="pt-2">
                <FieldLabel htmlFor="response-cap">Max Responses</FieldLabel>
                <Input
                  id="response-cap"
                  type="number"
                  min="1"
                  placeholder="e.g. 100"
                  value={limitValue}
                  onChange={(e) => setLimitValue(e.target.value)}
                  className="text-sm"
                  required={hasLimit}
                />
              </div>
            )}
          </div>

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function FormBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: formId } = use(params);

  const { form } = useGetForm(formId);
  const { updateFormVisibilityAsync, isLoading: isUpdatingVisibility } = useUpdateFormVisibility();
  const { updateFormSettingsAsync, isLoading: isUpdatingSettings } = useUpdateFormSettings();
  const { fields, isLoading } = useGetFields(formId);
  const { createFieldAsync, isError: isCreateError, error: createError } = useCreateField(formId);
  const { updateFieldAsync } = useUpdateField(formId);
  const { deleteFieldAsync } = useDeleteField(formId);

  const [createOpen, setCreateOpen] = useState(false);
  const [limitsOpen, setLimitsOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [editingField, setEditingField] = useState<FieldRow | null>(null);

  const handleSaveSettings = async ({
    closesAt,
    responseLimit,
    slug,
  }: {
    closesAt: Date | null;
    responseLimit: number | null;
    slug: string | null;
  }) => {
    try {
      await updateFormSettingsAsync({
        formId,
        closesAt,
        responseLimit,
        slug,
      });
      toast.success("Form settings updated!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update form settings";
      toast.error(msg);
    }
  };

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
    const isChoice = values.type === "SELECT" || values.type === "RADIO" || values.type === "CHECKBOX";
    await createFieldAsync({
      formId,
      label: values.label,
      type: values.type,
      description: values.description || undefined,
      placeholder: values.placeholder || undefined,
      isRequired: values.isRequired,
      options: isChoice
        ? values.options?.length
          ? values.options
          : ["Option 1", "Option 2"]
        : undefined,
    });
    setCreateOpen(false);
  };

  const handleUpdate: SubmitHandler<FieldFormValues> = async (values) => {
    if (!editingField) return;
    const isChoice = values.type === "SELECT" || values.type === "RADIO" || values.type === "CHECKBOX";
    await updateFieldAsync({
      fieldId: editingField.id,
      label: values.label,
      type: values.type,
      description: values.description || null,
      placeholder: values.placeholder || null,
      isRequired: values.isRequired,
      options: isChoice
        ? values.options?.length
          ? values.options
          : ["Option 1", "Option 2"]
        : null,
    });
    setEditingField(null);
  };

  const handleDelete = async (fieldId: string) => {
    await deleteFieldAsync({ fieldId });
  };

  const publicPath = form?.slug ? `/form/${form.slug}` : `/form/${formId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}${publicPath}`);
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
                <div className="flex items-center gap-1.5 flex-wrap">
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

                  {form.slug && (
                    <Badge variant="outline" className="text-xs font-mono text-muted-foreground gap-1">
                      <LinkIcon className="size-3" />
                      /form/{form.slug}
                    </Badge>
                  )}

                  {form.closesAt && (
                    <Badge
                      variant="outline"
                      className={`text-xs gap-1 ${
                        form.isExpired
                          ? "border-destructive text-destructive bg-destructive/10"
                          : "text-muted-foreground"
                      }`}
                    >
                      <ClockIcon className="size-3" />
                      {form.isExpired
                        ? "Expired"
                        : `Closes: ${new Date(form.closesAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                          })}`}
                    </Badge>
                  )}

                  {form.responseLimit && (
                    <Badge
                      variant="outline"
                      className={`text-xs gap-1 ${
                        form.isLimitReached
                          ? "border-amber-500 text-amber-600 bg-amber-500/10"
                          : "text-muted-foreground"
                      }`}
                    >
                      <UsersIcon className="size-3" />
                      {form.submissionCount} / {form.responseLimit}
                    </Badge>
                  )}
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
          <Button variant="outline" size="sm" onClick={() => setQrOpen(true)}>
            <QrCodeIcon className="size-3.5 mr-1.5" />
            QR Code
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={publicPath} target="_blank">
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

        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLimitsOpen(true)}
            className="h-8 text-xs gap-1.5"
          >
            <SlidersHorizontalIcon className="size-3.5 text-muted-foreground" />
            Limits & Expiry
          </Button>

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
                {field.options && field.options.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                    <span className="text-[11px] text-muted-foreground">Options:</span>
                    {field.options.map((opt, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="text-[10px] py-0 px-1.5 font-normal"
                      >
                        {opt}
                      </Badge>
                    ))}
                  </div>
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
                options: editingField.options ?? ["Option 1", "Option 2"],
              }}
              onSubmit={handleUpdate}
              isSubmitting={false}
              onCancel={() => setEditingField(null)}
              submitLabel="Save Changes"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Form Limits & Expiry modal */}
      {form && (
        <FormLimitsDialog
          open={limitsOpen}
          onOpenChange={setLimitsOpen}
          form={form}
          onSave={handleSaveSettings}
          isSaving={isUpdatingSettings}
        />
      )}

      {/* QR Code Sharing modal */}
      {form && (
        <QrCodeDialog
          open={qrOpen}
          onOpenChange={setQrOpen}
          url={`${typeof window !== "undefined" ? window.location.origin : ""}${publicPath}`}
          title={form.title}
          slug={form.slug}
        />
      )}
    </div>
  );
}
