"use client";

import { use, useState, useEffect, useCallback } from "react";
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
import {
  BuilderHeader,
  type BuilderFormData,
} from "~/components/form-builder/builder-header";
import { BuilderPreviewModal } from "~/components/form-builder/builder-preview-modal";
import {
  type ExtendedFieldRow,
} from "~/components/form-builder/builder-field-card";
import { BuilderControlBar } from "~/components/form-builder/builder-control-bar";
import { BuilderCanvas } from "~/components/form-builder/builder-canvas";
import { FieldToolbox } from "~/components/form-builder/field-toolbox";
import { FieldForm } from "~/components/form-builder/field-form";
import {
  DEFAULT_VALUES,
  toLabelKey,
  getFieldPlaceholder,
  type FieldFormValues,
  type FieldRow,
  type FieldType,
} from "~/components/form-builder/field-types";
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
import { landingTheme } from "~/config/landing-theme";

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
  const { syncFormFieldsAsync, isLoading: isSyncing } = useSyncFormFields(formId);

  // Local state for drag & drop, inline draft fields, reordering and single unified save/edit
  const [localFields, setLocalFields] = useState<ExtendedFieldRow[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [hasReordered, setHasReordered] = useState<boolean>(false);
  const [isRestoredFromDraft, setIsRestoredFromDraft] = useState<boolean>(false);
  const [hasRestoredChecked, setHasRestoredChecked] = useState<boolean>(false);
  const [isDraggingOverCanvas, setIsDraggingOverCanvas] = useState<boolean>(false);
  const [draggedRowIndex, setDraggedRowIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [limitsOpen, setLimitsOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editingField, setEditingField] = useState<FieldRow | null>(null);

  // Restore unsaved drafts from localStorage on page mount / refresh
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`chaiform_builder_draft_${formId}`);
      if (saved) {
        const parsed = JSON.parse(saved) as ExtendedFieldRow[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLocalFields(parsed);
          setIsRestoredFromDraft(true);
          toast.info("Restored unsaved draft questions from your previous session.", {
            duration: 4000,
          });
        }
      }
    } catch (err) {
      console.error("Failed to restore draft from localStorage", err);
    } finally {
      setHasRestoredChecked(true);
    }
  }, [formId]);

  // Synchronize remote fields with local state only if no unsaved draft exists
  useEffect(() => {
    if (fields && hasRestoredChecked) {
      const hasLocalDraft =
        typeof window !== "undefined" &&
        Boolean(localStorage.getItem(`chaiform_builder_draft_${formId}`));
      if (!hasLocalDraft && !isRestoredFromDraft) {
        setLocalFields(fields as ExtendedFieldRow[]);
      }
    }
  }, [fields, hasRestoredChecked, isRestoredFromDraft, formId]);

  // Auto-sync local draft state to localStorage to prevent data loss on refresh or logout
  useEffect(() => {
    if (!hasRestoredChecked) return;
    const hasUnsaved =
      localFields.some((f) => f.isDraft) || hasReordered || isRestoredFromDraft;
    if (hasUnsaved && localFields.length > 0) {
      try {
        localStorage.setItem(
          `chaiform_builder_draft_${formId}`,
          JSON.stringify(localFields)
        );
      } catch (e) {
        console.error("Failed to auto-save draft to localStorage", e);
      }
    }
  }, [localFields, hasReordered, isRestoredFromDraft, hasRestoredChecked, formId]);

  // Prevent accidental tab close or page reload when unsaved changes exist
  useEffect(() => {
    const hasUnsaved =
      localFields.some((f) => f.isDraft) ||
      hasReordered ||
      isRestoredFromDraft ||
      Boolean(editingFieldId);
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsaved) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [localFields, hasReordered, isRestoredFromDraft, editingFieldId]);

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
      toast.error(getSafeErrorMessage(err, "Failed to update form settings"));
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

  // Insert new field at an exact index with empty label and rich contextual placeholder
  const insertFieldAt = useCallback(
    (type: FieldType, targetIdx: number, customPlaceholder?: string) => {
      const isChoice = type === "SELECT" || type === "RADIO" || type === "CHECKBOX";
      const newFieldId = `draft_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const placeholderText = customPlaceholder || getFieldPlaceholder(type);

      const newField: ExtendedFieldRow = {
        id: newFieldId,
        label: "", // Bilkul empty string - user fill karega
        labelKey: "",
        type,
        isRequired: false,
        isDraft: true,
        index: "1.00",
        options: isChoice ? ["Option 1", "Option 2"] : null,
        description: null,
        placeholder: placeholderText,
      };

      setLocalFields((prev) => {
        const next = [...prev];
        const clamped = Math.max(0, Math.min(targetIdx, next.length));
        next.splice(clamped, 0, newField);
        return next;
      });

      // ONLY this newly dropped field is editable! Other existing fields stay frozen in view mode.
      setIsEditMode(false);
      setEditingFieldId(newFieldId);
      setDraggedRowIndex(null);
      setDropTargetIndex(null);
      setIsDraggingOverCanvas(false);
      toast.info(`Question added. Enter your question title and click "Save Changes".`);
    },
    []
  );

  // Add field at the end (fallback for click from toolbox)
  const handleAddField = useCallback(
    (type: FieldType, customPlaceholder?: string) => {
      insertFieldAt(type, localFields.length, customPlaceholder);
    },
    [insertFieldAt, localFields.length]
  );

  // Discard local draft and revert to cloud DB state
  const handleDiscardDraft = () => {
    try {
      localStorage.removeItem(`chaiform_builder_draft_${formId}`);
    } catch (e) {
      console.error("Failed to discard draft", e);
    }
    setIsRestoredFromDraft(false);
    setHasReordered(false);
    setEditingFieldId(null);
    setIsEditMode(false);
    setLocalFields((fields as ExtendedFieldRow[]) ?? []);
    toast.success("Draft discarded. Reverted to cloud saved state.");
  };

  // Update a field in the local array
  const handleUpdateLocalField = (index: number, updated: ExtendedFieldRow) => {
    setLocalFields((prev) => {
      const next = [...prev];
      next[index] = updated;
      return next;
    });
  };

  // Delete a field: if draft, remove from local state; if saved, delete from db
  const handleDeleteField = async (fieldId: string) => {
    const fieldIndex = localFields.findIndex((f) => f.id === fieldId);
    if (fieldIndex === -1) return;
    const field = localFields[fieldIndex];

    if (!field) return;

    if (field.isDraft || fieldId.startsWith("draft_")) {
      setLocalFields((prev) => prev.filter((f) => f.id !== fieldId));
      toast.success("Draft field removed");
      return;
    }

    try {
      await deleteFieldAsync({ fieldId });
      setLocalFields((prev) => prev.filter((f) => f.id !== fieldId));
      toast.success("Field deleted");
    } catch (err: unknown) {
      toast.error(getSafeErrorMessage(err, "Failed to delete field"));
    }
  };

  // Reorder an existing row to target index without turning all fields into edit mode
  const reorderRow = (fromIndex: number, targetIdx: number) => {
    setLocalFields((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      if (!moved) return prev;

      let destination = targetIdx;
      if (fromIndex < targetIdx) {
        destination = targetIdx - 1;
      }
      const clamped = Math.max(0, Math.min(destination, next.length));
      next.splice(clamped, 0, moved);
      return next;
    });

    setDraggedRowIndex(null);
    setDropTargetIndex(null);
    setIsDraggingOverCanvas(false);
    setHasReordered(true);
    setIsEditMode(false);
    toast.info("Question position updated. Click \"Save Changes\" to persist.");
  };

  // Process drop at an exact target index (either from toolbox or existing row)
  const processDropAt = (e: React.DragEvent, targetIdx: number) => {
    setIsDraggingOverCanvas(false);
    setDropTargetIndex(null);

    // Check 1: Toolbox item dropped
    const rawToolboxData = e.dataTransfer.getData("application/json");
    if (rawToolboxData) {
      try {
        const data = JSON.parse(rawToolboxData) as { type?: FieldType; defaultTitle?: string };
        if (data?.type) {
          insertFieldAt(data.type, targetIdx, data.defaultTitle);
          return;
        }
      } catch (err) {
        console.error("Failed to parse dropped field data", err);
      }
    }

    // Check 2: Existing row reordered
    const fromIndexStr = e.dataTransfer.getData("text/plain");
    const fromIndex =
      draggedRowIndex !== null
        ? draggedRowIndex
        : fromIndexStr
        ? parseInt(fromIndexStr, 10)
        : null;

    if (fromIndex !== null && !isNaN(fromIndex)) {
      reorderRow(fromIndex, targetIdx);
    }
  };

  // Row reordering handlers
  const handleDragStartRow = (e: React.DragEvent, index: number) => {
    setDraggedRowIndex(index);
    e.dataTransfer.setData("text/plain", index.toString());
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOverRow = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const relY = e.clientY - rect.top;
    const isTopHalf = relY < rect.height / 2;

    const targetIdx = isTopHalf ? index : index + 1;
    setDropTargetIndex(targetIdx);
    if (!isDraggingOverCanvas) {
      setIsDraggingOverCanvas(true);
    }
  };

  const handleDropRow = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const relY = e.clientY - rect.top;
    const isTopHalf = relY < rect.height / 2;
    const targetIdx = isTopHalf ? index : index + 1;

    processDropAt(e, targetIdx);
  };

  const handleDragEndRow = () => {
    setIsDraggingOverCanvas(false);
    setDropTargetIndex(null);
    setDraggedRowIndex(null);
  };

  // Canvas Drag & Drop handlers for incoming toolbox items
  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    if (!isDraggingOverCanvas) {
      setIsDraggingOverCanvas(true);
    }
    if (localFields.length === 0) {
      setDropTargetIndex(0);
    }
  };

  const handleCanvasDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDraggingOverCanvas(false);
    setDropTargetIndex(null);
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const targetIdx = dropTargetIndex !== null ? dropTargetIndex : localFields.length;
    processDropAt(e, targetIdx);
  };

  // Single unified Save handler with validation
  const handleSaveAll = async () => {
    // 1. Validation: check that every field has a non-empty question title
    let hasValidationError = false;
    const validated = localFields.map((f) => {
      const isEmpty = !f.label || f.label.trim().length === 0;
      if (isEmpty) {
        hasValidationError = true;
      }
      return {
        ...f,
        hasError: isEmpty,
      };
    });

    if (hasValidationError) {
      setLocalFields(validated);
      const firstInvalid = validated.find((f) => f.hasError);
      if (firstInvalid) {
        setEditingFieldId(firstInvalid.id);
      }
      setIsEditMode(false);
      toast.error("Please enter a question title for all fields before saving.");
      return;
    }

    // 2. Persist to database atomically via syncFormFields
    try {
      const payloadFields = localFields.map((f) => {
        const isChoice = f.type === "SELECT" || f.type === "RADIO" || f.type === "CHECKBOX";
        return {
          id: f.id.startsWith("draft_") ? undefined : f.id,
          label: f.label.trim(),
          type: f.type,
          isRequired: Boolean(f.isRequired),
          description: f.description || null,
          placeholder: f.placeholder || null,
          options: isChoice
            ? f.options?.length
              ? f.options
              : ["Option 1", "Option 2"]
            : null,
        };
      });

      const updated = await syncFormFieldsAsync({
        formId,
        fields: payloadFields,
      });

      if (updated) {
        setLocalFields(updated as ExtendedFieldRow[]);
      }
      // Clean up localStorage draft after successful persistence
      try {
        localStorage.removeItem(`chaiform_builder_draft_${formId}`);
      } catch (e) {
        console.error("Failed to clear draft from localStorage", e);
      }
      setIsRestoredFromDraft(false);
      setIsEditMode(false);
      setEditingFieldId(null);
      setHasReordered(false);
      toast.success("All form fields saved successfully!");
    } catch (err: unknown) {
      toast.error(getSafeErrorMessage(err, "Failed to save fields"));
    }
  };

  // Modal create handler (fallback)
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

  // Modal update handler
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

  const publicPath = form?.slug ? `/form/${form.slug}` : `/form/${formId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}${publicPath}`);
    toast.success("Public form link copied to clipboard!");
  };

  const hasDrafts =
    localFields.some((f) => f.isDraft) || hasReordered || isRestoredFromDraft;
  const canDrag = isEditMode || hasDrafts || Boolean(editingFieldId);

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
      <div className="flex flex-col xl:flex-row gap-6 items-start w-full">
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
            onAddFirstQuestion={() => handleAddField("TEXT")}
          />
        </div>

        {/* Right Column: Sticky Field Toolbox */}
        <div className="w-full xl:w-72 xl:sticky xl:top-20 shrink-0">
          <FieldToolbox onAddField={handleAddField} />
        </div>
      </div>

      {/* Create field modal (optional manual popup) */}
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
