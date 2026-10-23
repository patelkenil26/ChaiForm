"use client";

import { useState } from "react";
import {
  PencilIcon,
  Trash2Icon,
  GripVerticalIcon,
  CheckIcon,
  PlusIcon,
  XIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  FIELD_TYPES,
  FIELD_TYPE_LABELS,
  getFieldPlaceholder,
  toLabelKey,
  type FieldRow,
  type FieldType,
} from "./field-types";

export type ExtendedFieldRow = FieldRow & {
  isDraft?: boolean;
  hasError?: boolean;
};

interface BuilderFieldCardProps {
  field: ExtendedFieldRow;
  index: number;
  totalFields?: number;
  isEditMode: boolean;
  canDrag?: boolean;
  onUpdate: (updated: ExtendedFieldRow) => void;
  onToggleSingleEdit: (fieldId: string) => void;
  onDelete: (fieldId: string) => void;
  onMoveField?: (index: number, direction: "up" | "down") => void;
  onDragStartRow: (e: React.DragEvent, index: number) => void;
  onDragOverRow: (e: React.DragEvent, index: number) => void;
  onDropRow: (e: React.DragEvent, index: number) => void;
  onDragEndRow?: (e: React.DragEvent) => void;
}

export function BuilderFieldCard({
  field,
  index,
  totalFields,
  isEditMode,
  canDrag = true,
  onUpdate,
  onToggleSingleEdit,
  onDelete,
  onMoveField,
  onDragStartRow,
  onDragOverRow,
  onDropRow,
  onDragEndRow,
}: BuilderFieldCardProps) {
  const [newOption, setNewOption] = useState("");
  const isChoice = field.type === "SELECT" || field.type === "RADIO" || field.type === "CHECKBOX";
  const slug = toLabelKey(field.label) || "field_slug";

  const handleAddOption = () => {
    if (!newOption.trim()) return;
    const currentOptions = field.options || [];
    onUpdate({
      ...field,
      options: [...currentOptions, newOption.trim()],
    });
    setNewOption("");
  };

  const handleRemoveOption = (optIndex: number) => {
    const currentOptions = field.options || [];
    onUpdate({
      ...field,
      options: currentOptions.filter((_, i) => i !== optIndex),
    });
  };

  return (
    <div
      draggable={canDrag && isEditMode}
      onDragStart={(e) => {
        if (!canDrag || !isEditMode) {
          e.preventDefault();
          return;
        }
        const target = e.target as HTMLElement;
        if (
          target.tagName === "INPUT" ||
          target.tagName === "BUTTON" ||
          target.closest("input") ||
          target.closest("button") ||
          target.closest("[role='combobox']")
        ) {
          e.preventDefault();
          return;
        }
        onDragStartRow(e, index);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDragOverRow(e, index);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDropRow(e, index);
      }}
      onDragEnd={(e) => {
        onDragEndRow?.(e);
      }}
      className={`group relative flex flex-col gap-2 rounded-xl border bg-card/80 p-3.5 sm:p-4 transition-all hover:border-amber-500/30 hover:shadow-xs ${
        field.hasError
          ? "border-destructive/80 bg-destructive/5"
          : field.isDraft
            ? "border-amber-500/40 bg-amber-500/5 shadow-2xs"
            : isEditMode
              ? "border-border/90 bg-card"
              : "border-border/60 bg-card/60"
      }`}
    >
      <div className="flex items-center justify-between gap-3 min-w-0">
        {/* Left: Drag Handle (Only in Edit Mode) + Input / Display */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* Reordering Controls: Drag handle on desktop, Up/Down arrows everywhere in edit mode or touch devices */}
          {canDrag && isEditMode && (
            <div className="flex items-center gap-1 shrink-0">
              <div
                className="hidden sm:flex cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-amber-400/80 transition-colors p-0.5"
                title="Drag to reorder question"
              >
                <GripVerticalIcon className="size-4" />
              </div>
              {onMoveField && (
                <div className="flex flex-col -space-y-0.5">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveField(index, "up");
                    }}
                    className="size-4 rounded flex items-center justify-center text-muted-foreground hover:text-amber-400 hover:bg-muted/80 disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
                    title="Move question up"
                    aria-label="Move question up"
                  >
                    <ChevronUpIcon className="size-3 stroke-[2.5]" />
                  </button>
                  <button
                    type="button"
                    disabled={totalFields !== undefined && index >= totalFields - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveField(index, "down");
                    }}
                    className="size-4 rounded flex items-center justify-center text-muted-foreground hover:text-amber-400 hover:bg-muted/80 disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
                    title="Move question down"
                    aria-label="Move question down"
                  >
                    <ChevronDownIcon className="size-3 stroke-[2.5]" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Title Area: Inline Edit vs View Mode */}
          {isEditMode ? (
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Input
                  value={field.label}
                  placeholder={field.placeholder || getFieldPlaceholder(field.type)}
                  draggable={false}
                  onDragStart={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    onUpdate({
                      ...field,
                      label: e.target.value,
                      labelKey: toLabelKey(e.target.value),
                      hasError: false,
                    })
                  }
                  className={`h-8 text-sm font-medium rounded-lg w-full sm:w-auto sm:max-w-md bg-background/80 transition ${
                    field.hasError
                      ? "border-destructive focus-visible:ring-destructive"
                      : "border-border/80 focus-visible:ring-amber-500/30 focus-visible:border-amber-500/50"
                  }`}
                  autoFocus={!field.label}
                />

                {/* Inline Type Selector */}
                <Select
                  value={field.type}
                  onValueChange={(val) =>
                    onUpdate({
                      ...field,
                      type: val as FieldType,
                      options:
                        val === "SELECT" || val === "RADIO" || val === "CHECKBOX"
                          ? field.options?.length
                            ? field.options
                            : ["Option 1", "Option 2"]
                          : undefined,
                    })
                  }
                >
                  <SelectTrigger className="h-7 text-xs px-2.5 rounded-lg border-border/70 bg-background/60 w-auto gap-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {FIELD_TYPES.map((t) => (
                      <SelectItem key={t} value={t} className="text-xs">
                        {FIELD_TYPE_LABELS[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Inline Required Toggle Badge */}
                <button
                  type="button"
                  onClick={() =>
                    onUpdate({
                      ...field,
                      isRequired: !field.isRequired,
                    })
                  }
                  className={`h-7 px-2.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer select-none inline-flex items-center gap-1 ${
                    field.isRequired
                      ? "bg-amber-500/15 border-amber-500/30 text-amber-300"
                      : "bg-muted/40 border-border/50 text-muted-foreground hover:text-foreground"
                  }`}
                  title="Click to toggle required"
                >
                  <span>{field.isRequired ? "Required" : "Optional"}</span>
                </button>
              </div>

              {/* Validation error text */}
              {field.hasError && (
                <p className="text-[11px] text-destructive font-medium animate-in fade-in">
                  Question title cannot be empty
                </p>
              )}
            </div>
          ) : (
            /* View Mode */
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {field.label ? (
                  <span className="font-semibold text-sm text-foreground tracking-tight">
                    {field.label}
                  </span>
                ) : (
                  <span className="font-medium text-sm text-muted-foreground/70 italic tracking-tight">
                    {field.placeholder || "Untitled Question (Click to edit)"}
                  </span>
                )}
                <Badge variant="outline" className="text-xs font-normal border-border/80">
                  {FIELD_TYPE_LABELS[field.type as FieldType] ?? field.type}
                </Badge>
                {field.isRequired && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-muted text-muted-foreground font-normal"
                  >
                    Required
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Action Icons: Edit & Delete */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isEditMode ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-2.5 rounded-lg text-xs font-medium border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:text-amber-200 transition-all gap-1 shadow-2xs cursor-pointer"
              onClick={() => onToggleSingleEdit(field.id)}
              title="Done editing question"
            >
              <CheckIcon className="size-3.5 text-amber-400" />
              <span>Save</span>
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              onClick={() => onToggleSingleEdit(field.id)}
              title={`Edit ${field.label}`}
            >
              <PencilIcon className="size-4" />
              <span className="sr-only">Toggle edit</span>
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            onClick={() => onDelete(field.id)}
            title={`Delete ${field.label}`}
          >
            <Trash2Icon className="size-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>

      {/* Choice Options Editor (Only if select/radio/checkbox and in edit mode) */}
      {isChoice && isEditMode && (
        <div className="pl-0 sm:pl-6.5 pt-1 flex flex-col gap-1.5 border-t border-border/40 mt-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-muted-foreground font-medium">Choices:</span>
            {(field.options || []).map((opt, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-muted/80 text-foreground border border-border/50"
              >
                {opt}
                <button
                  type="button"
                  onClick={() => handleRemoveOption(i)}
                  className="hover:text-destructive cursor-pointer"
                  title="Remove option"
                >
                  <XIcon className="size-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 max-w-xs">
            <Input
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              placeholder="Add another option..."
              className="h-7 text-xs rounded-md"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddOption();
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAddOption}
              className="h-7 px-2 text-xs gap-1"
            >
              <PlusIcon className="size-3" />
              <span>Add</span>
            </Button>
          </div>
        </div>
      )}

      {/* Slug / Key Preview (Aligned cleanly with title) */}
      <div className={canDrag && isEditMode ? "pl-0 sm:pl-6.5" : "pl-0"}>
        {field.label ? (
          <p className="text-xs text-muted-foreground/60 font-mono truncate">{slug}</p>
        ) : (
          <p className="text-xs text-muted-foreground/40 font-mono italic">
            slug generates on question title
          </p>
        )}
      </div>
    </div>
  );
}
