"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import {
  FormSettingsDialog,
  type FormSettingsPayload,
} from "~/components/forms/form-settings-dialog";
import { QrCodeDialog } from "~/components/qr-code-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { BuilderHeader, type BuilderFormData } from "~/components/form-builder/builder-header";
import { BuilderPreviewModal } from "~/components/form-builder/builder-preview-modal";
import { BuilderControlBar } from "~/components/form-builder/builder-control-bar";
import { BuilderCanvas } from "~/components/form-builder/builder-canvas";
import { FieldToolbox } from "~/components/form-builder/field-toolbox";
import { MobileAddFieldDrawer } from "~/components/form-builder/mobile-add-field-drawer";
import { FieldForm } from "~/components/form-builder/field-form";
import {
  DEFAULT_VALUES,
  type FieldFormValues,
  type FieldRow,
} from "~/components/form-builder/field-types";
import { useFormBuilder } from "~/components/form-builder/use-form-builder";
import { useGetForm, useUpdateFormVisibility, useUpdateFormSettings } from "~/hooks/api/form";
import {
  useGetFields,
  useCreateField,
  useUpdateField,
  useDeleteField,
  useSyncFormFields,
} from "~/hooks/api/form-field";
import { useUser } from "~/hooks/api/auth";
import { getSafeErrorMessage } from "~/lib/error";

export default function FormBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: formId } = use(params);
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(`/forms/${formId}`)}`);
    }
  }, [user, isUserLoading, router, formId]);

  // Remote tRPC queries and mutations
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
  const { syncFormFieldsAsync, isLoading: isSyncing } = useSyncFormFields(formId);

  // Unified Form Builder State Machine Hook
  const {
    localFields,
    isEditMode,
    editingFieldId,
    setEditingFieldId,
    hasDrafts,
    canDrag,
    isRestoredFromDraft,
    isDraggingOverCanvas,
    dropTargetIndex,
    previewOpen,
    setPreviewOpen,
    handleAddField,
    handleDiscardDraft,
    handleUpdateLocalField,
    handleDeleteField,
    handleDragStartRow,
    handleDragOverRow,
    handleDropRow,
    handleDragEndRow,
    handleCanvasDragOver,
    handleCanvasDragLeave,
    handleCanvasDrop,
    handleMoveField,
    handleSaveAll,
  } = useFormBuilder({
    formId,
    remoteFields: fields as FieldRow[] | undefined,
    syncFormFieldsAsync,
    deleteFieldAsync,
  });

  // Modal dialog states
  const [createOpen, setCreateOpen] = useState(false);
  const [limitsOpen, setLimitsOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [editingField, setEditingField] = useState<FieldRow | null>(null);

  const handleSaveSettings = async (settings: FormSettingsPayload) => {
    try {
      await updateFormSettingsAsync({ formId, ...settings });
      toast.success("Form settings updated!");
    } catch (err: unknown) {
      toast.error(getSafeErrorMessage(err, "Failed to update form settings"));
    }
  };

  const handleTogglePublish = async (checked: boolean) => {
    try {
      await updateFormVisibilityAsync({ formId, isPublished: checked });
      toast.success(
        checked
          ? "Form published! Live and accepting responses."
          : "Form unpublished! Submissions are now paused.",
      );
    } catch {
      toast.error("Failed to update publish status");
    }
  };

  const handleSelectVisibility = async (value: "PUBLIC" | "UNLISTED") => {
    try {
      await updateFormVisibilityAsync({ formId, visibility: value });
      toast.success(`Form visibility set to ${value === "PUBLIC" ? "Public" : "Unlisted"}`);
    } catch {
      toast.error("Failed to update visibility");
    }
  };

  const handleCreate: SubmitHandler<FieldFormValues> = async (values) => {
    const isChoice =
      values.type === "SELECT" || values.type === "RADIO" || values.type === "CHECKBOX";
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
    const isChoice =
      values.type === "SELECT" || values.type === "RADIO" || values.type === "CHECKBOX";
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

  const publicPath = form?.slug ? `/form/${form.slug}` : `/form/${formId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}${publicPath}`);
    toast.success("Public form link copied to clipboard!");
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto">
      {/* Header Bar */}
      <BuilderHeader
        form={form as BuilderFormData | null | undefined}
        formId={formId}
        publicPath={publicPath}
        isUpdatingVisibility={isUpdatingVisibility}
        onCopyLink={handleCopyLink}
        onOpenQr={() => setQrOpen(true)}
        onOpenLimits={() => setLimitsOpen(true)}
        onOpenPreview={() => setPreviewOpen(true)}
        onAddField={() => handleAddField("TEXT")}
        onTogglePublish={handleTogglePublish}
        onSelectVisibility={handleSelectVisibility}
      />

      {/* Main Drag & Drop Workspace: Canvas on Left + Toolbox on Right */}
      <div className="flex flex-col xl:flex-row gap-6 items-start w-full pb-24 xl:pb-8">
        {/* Left Column: Form Canvas */}
        <div className="flex-1 w-full flex flex-col gap-4 min-w-0">
          <BuilderControlBar
            totalQuestions={localFields.length}
            hasDrafts={hasDrafts}
            isRestoredFromDraft={isRestoredFromDraft}
            isEditMode={isEditMode}
            editingFieldId={editingFieldId}
            isSyncing={isSyncing}
            onDiscardDraft={handleDiscardDraft}
            onSaveChanges={handleSaveAll}
          />

          <BuilderCanvas
            fields={localFields}
            isLoading={isLoading}
            isEditMode={isEditMode}
            editingFieldId={editingFieldId}
            canDrag={canDrag}
            isDraggingOverCanvas={isDraggingOverCanvas}
            dropTargetIndex={dropTargetIndex}
            onCanvasDragOver={handleCanvasDragOver}
            onCanvasDragLeave={handleCanvasDragLeave}
            onCanvasDrop={handleCanvasDrop}
            onUpdateField={handleUpdateLocalField}
            onToggleSingleEdit={(fieldId) => {
              setEditingFieldId((prev) => (prev === fieldId ? null : fieldId));
            }}
            onDeleteField={handleDeleteField}
            onDragStartRow={handleDragStartRow}
            onDragOverRow={handleDragOverRow}
            onDropRow={handleDropRow}
            onDragEndRow={handleDragEndRow}
            onMoveField={handleMoveField}
            onAddFirstQuestion={() => handleAddField("TEXT")}
          />
        </div>

        {/* Right Column: Sticky Field Toolbox (Desktop) */}
        <div className="hidden xl:block xl:w-72 xl:sticky xl:top-20 shrink-0">
          <FieldToolbox onAddField={handleAddField} />
        </div>
      </div>

      {/* Mobile Touch-Friendly Floating Action Button & Bottom Sheet Drawer (< xl) */}
      <MobileAddFieldDrawer onAddField={handleAddField} />

      {/* Create field modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Question</DialogTitle>
          </DialogHeader>
          {isCreateError && <p className="text-sm text-destructive">{createError?.message}</p>}
          <FieldForm
            defaultValues={DEFAULT_VALUES}
            onSubmit={handleCreate}
            isSubmitting={isCreatingField}
            onCancel={() => setCreateOpen(false)}
            submitLabel="Add Question"
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
            <DialogTitle>Edit Question</DialogTitle>
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
        fields={(localFields.length > 0 ? localFields : (fields as FieldRow[] | undefined)) ?? []}
        publicPath={publicPath}
      />
    </div>
  );
}
