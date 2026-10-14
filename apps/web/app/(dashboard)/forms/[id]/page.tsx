"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { FormSettingsDialog, type FormSettingsPayload } from "~/components/forms/form-settings-dialog";
import { QrCodeDialog } from "~/components/qr-code-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Skeleton } from "~/components/ui/skeleton";
import {
  BuilderHeader,
  type BuilderFormData,
} from "~/components/form-builder/builder-header";
import { BuilderPreviewModal } from "~/components/form-builder/builder-preview-modal";
import { BuilderFieldCard } from "~/components/form-builder/builder-field-card";
import { FieldForm } from "~/components/form-builder/field-form";
import {
  DEFAULT_VALUES,
  type FieldFormValues,
  type FieldRow,
} from "~/components/form-builder/field-types";
import { useGetForm, useUpdateFormVisibility, useUpdateFormSettings } from "~/hooks/api/form";
import {
  useGetFields,
  useCreateField,
  useUpdateField,
  useDeleteField,
} from "~/hooks/api/form-field";
import { useUser } from "~/hooks/api/auth";

export default function FormBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: formId } = use(params);
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(`/forms/${formId}`)}`);
    }
  }, [user, isUserLoading, router, formId]);

  const { form } = useGetForm(formId);
  const { updateFormVisibilityAsync, isLoading: isUpdatingVisibility } = useUpdateFormVisibility();
  const { updateFormSettingsAsync, isLoading: isUpdatingSettings } = useUpdateFormSettings();
  const { fields, isLoading } = useGetFields(formId);
  const {
    createFieldAsync,
    isLoading: isCreatingField,
    isError: isCreateError,
    error: createError,
  } = useCreateField(formId);
  const { updateFieldAsync, isLoading: isUpdatingField } = useUpdateField(formId);
  const { deleteFieldAsync } = useDeleteField(formId);

  const [createOpen, setCreateOpen] = useState(false);
  const [limitsOpen, setLimitsOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editingField, setEditingField] = useState<FieldRow | null>(null);

  // Keyboard shortcut Ctrl+P / Cmd+P to toggle Live Preview
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        setPreviewOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSaveSettings = async (settings: FormSettingsPayload) => {
    try {
      await updateFormSettingsAsync({
        formId,
        ...settings,
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
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 w-full">
      <BuilderHeader
        form={form as BuilderFormData | null | undefined}
        formId={formId}
        publicPath={publicPath}
        isUpdatingVisibility={isUpdatingVisibility}
        onCopyLink={handleCopyLink}
        onOpenQr={() => setQrOpen(true)}
        onOpenLimits={() => setLimitsOpen(true)}
        onOpenPreview={() => setPreviewOpen(true)}
        onAddField={() => setCreateOpen(true)}
        onTogglePublish={handleTogglePublish}
        onSelectVisibility={handleSelectVisibility}
      />

      {/* Fields List */}
      <div className="flex flex-col gap-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-xl border bg-card/60 gap-4"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="size-5 rounded" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="size-8 rounded-md" />
                <Skeleton className="size-8 rounded-md" />
              </div>
            </div>
          ))
        ) : !fields || fields.length === 0 ? (
          <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
            No fields yet. Add your first field.
          </div>
        ) : (
          fields.map((field) => (
            <BuilderFieldCard
              key={field.id}
              field={field as FieldRow}
              onEdit={(f) => setEditingField(f)}
              onDelete={handleDelete}
            />
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
            isSubmitting={isCreatingField}
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
              isSubmitting={isUpdatingField}
              onCancel={() => setEditingField(null)}
              submitLabel="Save Changes"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Form Settings, Limits, Slug & Password modal */}
      {form && (
        <FormSettingsDialog
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

      {/* Live Form Preview Simulator Modal */}
      <BuilderPreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        form={form as BuilderFormData | null | undefined}
        fields={(fields as FieldRow[] | undefined) ?? []}
        publicPath={publicPath}
      />
    </div>
  );
}
