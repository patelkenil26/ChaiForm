"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  FIELD_TYPE_LABELS,
  type FieldRow,
  type FieldType,
} from "./field-types";

interface BuilderFieldCardProps {
  field: FieldRow;
  onEdit: (field: FieldRow) => void;
  onDelete: (fieldId: string) => void;
}

export function BuilderFieldCard({ field, onEdit, onDelete }: BuilderFieldCardProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border bg-card p-4 transition-all hover:border-border/80 hover:shadow-2xs">
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm text-foreground">{field.label}</span>
          <Badge variant="outline" className="text-xs">
            {FIELD_TYPE_LABELS[field.type as FieldType] ?? field.type}
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
          onClick={() => onEdit(field)}
          title={`Edit ${field.label}`}
        >
          <PencilIcon className="size-4" />
          <span className="sr-only">Edit {field.label}</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive"
          onClick={() => onDelete(field.id)}
          title={`Delete ${field.label}`}
        >
          <Trash2Icon className="size-4" />
          <span className="sr-only">Delete {field.label}</span>
        </Button>
      </div>
    </div>
  );
}
