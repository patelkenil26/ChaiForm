"use client";

import { Skeleton } from "~/components/ui/skeleton";
import { BuilderFieldCard, type ExtendedFieldRow } from "./builder-field-card";
import { DropInsertionLine } from "./drop-insertion-line";
import { BuilderEmptyCanvas } from "./builder-empty-canvas";

interface BuilderCanvasProps {
  fields: ExtendedFieldRow[];
  isLoading: boolean;
  isEditMode: boolean;
  editingFieldId?: string | null;
  canDrag?: boolean;
  isDraggingOverCanvas: boolean;
  dropTargetIndex: number | null;
  onCanvasDragOver: (e: React.DragEvent) => void;
  onCanvasDragLeave: (e: React.DragEvent) => void;
  onCanvasDrop: (e: React.DragEvent) => void;
  onUpdateField: (index: number, updated: ExtendedFieldRow) => void;
  onToggleSingleEdit: (fieldId: string) => void;
  onDeleteField: (fieldId: string) => void;
  onDragStartRow: (e: React.DragEvent, index: number) => void;
  onDragOverRow: (e: React.DragEvent, index: number) => void;
  onDropRow: (e: React.DragEvent, index: number) => void;
  onDragEndRow: () => void;
  onMoveField?: (index: number, direction: "up" | "down") => void;
  onAddFirstQuestion: () => void;
}

export function BuilderCanvas({
  fields,
  isLoading,
  isEditMode,
  editingFieldId,
  canDrag = true,
  isDraggingOverCanvas,
  dropTargetIndex,
  onCanvasDragOver,
  onCanvasDragLeave,
  onCanvasDrop,
  onUpdateField,
  onToggleSingleEdit,
  onDeleteField,
  onDragStartRow,
  onDragOverRow,
  onDropRow,
  onDragEndRow,
  onMoveField,
  onAddFirstQuestion,
}: BuilderCanvasProps) {
  return (
    <div
      onDragOver={onCanvasDragOver}
      onDragLeave={onCanvasDragLeave}
      onDrop={onCanvasDrop}
      className={`min-h-[380px] rounded-2xl border-2 transition-all p-3.5 sm:p-4 flex flex-col gap-3 ${
        isDraggingOverCanvas
          ? "border-amber-400/80 bg-amber-500/10 shadow-lg shadow-amber-500/5 ring-4 ring-amber-500/20 border-dashed"
          : "border-border/60 bg-card/30"
      }`}
    >
      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/60 gap-4"
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
      ) : fields.length === 0 ? (
        <BuilderEmptyCanvas
          isDraggingOver={isDraggingOverCanvas}
          onAddFirstQuestion={onAddFirstQuestion}
        />
      ) : (
        <div className="flex flex-col gap-2">
          {fields.map((field, idx) => {
            const isCardEditing = isEditMode || editingFieldId === field.id;

            return (
              <div key={field.id} className="flex flex-col">
                {/* Drop line before card 0 if target is index 0 */}
                {isDraggingOverCanvas && dropTargetIndex === 0 && idx === 0 && (
                  <DropInsertionLine />
                )}

                <BuilderFieldCard
                  field={field}
                  index={idx}
                  totalFields={fields.length}
                  isEditMode={isCardEditing}
                  canDrag={canDrag}
                  onUpdate={(updated) => onUpdateField(idx, updated)}
                  onToggleSingleEdit={onToggleSingleEdit}
                  onDelete={onDeleteField}
                  onMoveField={onMoveField}
                  onDragStartRow={onDragStartRow}
                  onDragOverRow={onDragOverRow}
                  onDropRow={onDropRow}
                  onDragEndRow={onDragEndRow}
                />

                {/* Drop line after card idx if target is idx + 1 */}
                {isDraggingOverCanvas && dropTargetIndex === idx + 1 && <DropInsertionLine />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
