"use client";

import { use, useState } from "react";
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
import {
  BuilderHeader,
  type BuilderFormData,
} from "~/components/form-builder/builder-header";
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
    <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-6 max-w-4xl">
      <BuilderHeader
        form={form as BuilderFormData | null | undefined}
        formId={formId}
        publicPath={publicPath}
        isUpdatingVisibility={isUpdatingVisibility}
        onCopyLink={handleCopyLink}
        onOpenQr={() => setQrOpen(true)}
        onOpenLimits={() => setLimitsOpen(true)}
        onAddField={() => setCreateOpen(true)}
        onTogglePublish={handleTogglePublish}
        onSelectVisibility={handleSelectVisibility}
      />

      {/* Fields List */}
      <div className="flex flex-col gap-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading fields...</p>
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
    </div>
  );
}
