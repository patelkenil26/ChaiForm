"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { type ExtendedFieldRow } from "./builder-field-card";
import { getFieldPlaceholder, type FieldRow, type FieldType } from "./field-types";
import { getSafeErrorMessage } from "~/lib/error";

interface UseFormBuilderParams {
  formId: string;
  remoteFields: FieldRow[] | undefined;
  syncFormFieldsAsync: (payload: {
    formId: string;
    fields: {
      id?: string;
      label: string;
      type: FieldType;
      isRequired: boolean;
      description: string | null;
      placeholder: string | null;
      options: string[] | null;
    }[];
  }) => Promise<FieldRow[] | undefined>;
  deleteFieldAsync: (payload: { fieldId: string }) => Promise<unknown>;
}

export function useFormBuilder({
  formId,
  remoteFields,
  syncFormFieldsAsync,
  deleteFieldAsync,
}: UseFormBuilderParams) {
  const [localFields, setLocalFields] = useState<ExtendedFieldRow[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [hasReordered, setHasReordered] = useState<boolean>(false);
  const [isRestoredFromDraft, setIsRestoredFromDraft] = useState<boolean>(false);
  const [hasRestoredChecked, setHasRestoredChecked] = useState<boolean>(false);
  const [isDraggingOverCanvas, setIsDraggingOverCanvas] = useState<boolean>(false);
  const [draggedRowIndex, setDraggedRowIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  const [previewOpen, setPreviewOpen] = useState(false);

  // 1. Restore unsaved drafts from localStorage on page mount / refresh
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

  // 2. Synchronize remote fields with local state only if no unsaved draft exists
  useEffect(() => {
    if (remoteFields && hasRestoredChecked) {
      const hasLocalDraft =
        typeof window !== "undefined" &&
        Boolean(localStorage.getItem(`chaiform_builder_draft_${formId}`));
      if (!hasLocalDraft && !isRestoredFromDraft) {
        setLocalFields(remoteFields as ExtendedFieldRow[]);
      }
    }
  }, [remoteFields, hasRestoredChecked, isRestoredFromDraft, formId]);

  // 3. Auto-sync local draft state to localStorage to prevent data loss
  useEffect(() => {
    if (!hasRestoredChecked) return;
    const hasUnsaved = localFields.some((f) => f.isDraft) || hasReordered || isRestoredFromDraft;
    if (hasUnsaved && localFields.length > 0) {
      try {
        localStorage.setItem(`chaiform_builder_draft_${formId}`, JSON.stringify(localFields));
      } catch (e) {
        console.error("Failed to auto-save draft to localStorage", e);
      }
    }
  }, [localFields, hasReordered, isRestoredFromDraft, hasRestoredChecked, formId]);

  // 4. Prevent accidental tab close or page reload when unsaved changes exist
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

  // 5. Keyboard shortcut Ctrl+P / Cmd+P to toggle Live Preview
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

  // Insert a new question field at target index
  const insertFieldAt = useCallback(
    (type: FieldType, targetIdx: number, customPlaceholder?: string) => {
      const isChoice = type === "SELECT" || type === "RADIO" || type === "CHECKBOX";
      const newFieldId = `draft_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const placeholderText = customPlaceholder || getFieldPlaceholder(type);

      const newField: ExtendedFieldRow = {
        id: newFieldId,
        label: "",
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

      setIsEditMode(false);
      setEditingFieldId(newFieldId);
      setDraggedRowIndex(null);
      setDropTargetIndex(null);
      setIsDraggingOverCanvas(false);
      toast.info(`Question added. Enter your question title and click "Save Changes".`);
    },
    [],
  );

  const handleAddField = useCallback(
    (type: FieldType, customPlaceholder?: string) => {
      insertFieldAt(type, localFields.length, customPlaceholder);
    },
    [insertFieldAt, localFields.length],
  );

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
    setLocalFields((remoteFields as ExtendedFieldRow[]) ?? []);
    toast.success("Draft discarded. Reverted to cloud saved state.");
  };

  const handleUpdateLocalField = (index: number, updated: ExtendedFieldRow) => {
    setLocalFields((prev) => {
      const next = [...prev];
      next[index] = updated;
      return next;
    });
  };

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
    toast.info('Question position updated. Click "Save Changes" to persist.');
  };

  const handleMoveField = useCallback((index: number, direction: "up" | "down") => {
    setLocalFields((prev) => {
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      const [item] = next.splice(index, 1);
      if (!item) return prev;
      next.splice(target, 0, item);
      return next;
    });
    setHasReordered(true);
    toast.info('Question position updated. Click "Save Changes" to persist.');
  }, []);

  const processDropAt = (e: React.DragEvent, targetIdx: number) => {
    setIsDraggingOverCanvas(false);
    setDropTargetIndex(null);

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

    const fromIndexStr = e.dataTransfer.getData("text/plain");
    const fromIndex =
      draggedRowIndex !== null ? draggedRowIndex : fromIndexStr ? parseInt(fromIndexStr, 10) : null;

    if (fromIndex !== null && !isNaN(fromIndex)) {
      reorderRow(fromIndex, targetIdx);
    }
  };

  // Row Drag handlers
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

  // Canvas Drag handlers
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

  // Atomic Save with validation
  const handleSaveAll = async () => {
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
          options: isChoice ? (f.options?.length ? f.options : ["Option 1", "Option 2"]) : null,
        };
      });

      const updated = await syncFormFieldsAsync({
        formId,
        fields: payloadFields,
      });

      if (updated) {
        setLocalFields(updated as ExtendedFieldRow[]);
      }
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

  const hasDrafts = localFields.some((f) => f.isDraft) || hasReordered || isRestoredFromDraft;
  const canDrag = isEditMode || hasDrafts || Boolean(editingFieldId);

  return {
    localFields,
    setLocalFields,
    isEditMode,
    setIsEditMode,
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
  };
}
