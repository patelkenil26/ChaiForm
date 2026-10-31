"use client";

import { useState } from "react";
import { IconPlus, IconX } from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export interface FieldOptionsEditorProps {
  options: string[];
  onChange: (options: string[]) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Reusable options manager for SELECT, RADIO, and CHECKBOX field types.
 * Allows respondents to add, view, and remove multiple choice options.
 */
export function FieldOptionsEditor({
  options = [],
  onChange,
  placeholder = "Add option...",
  className = "",
}: FieldOptionsEditorProps) {
  const [newOption, setNewOption] = useState("");

  const handleAdd = () => {
    const trimmed = newOption.trim();
    if (!trimmed) return;
    onChange([...options, trimmed]);
    setNewOption("");
  };

  const handleRemove = (indexToRemove: number) => {
    onChange(options.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Existing Option Pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] text-muted-foreground font-medium">Choices:</span>
        {options.map((opt, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-muted/70 text-foreground border border-border/60 transition-colors"
          >
            <span className="max-w-[150px] truncate" title={opt}>
              {opt}
            </span>
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="p-0.5 rounded hover:bg-destructive/15 text-muted-foreground hover:text-destructive cursor-pointer transition-colors"
              title={`Remove ${opt}`}
              aria-label={`Remove ${opt}`}
            >
              <IconX className="size-3.5" />
            </button>
          </span>
        ))}
        {options.length === 0 && (
          <span className="text-[11px] text-muted-foreground/60 italic">No choices added yet.</span>
        )}
      </div>

      {/* Add New Option Input Bar */}
      <div className="flex items-center gap-2 max-w-sm mt-0.5">
        <Input
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          placeholder={placeholder}
          maxLength={100}
          className="h-8 sm:h-7 text-xs rounded-lg"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleAdd}
          className="h-8 sm:h-7 px-2.5 text-xs gap-1 shrink-0 cursor-pointer"
        >
          <IconPlus className="size-3.5" />
          <span>Add</span>
        </Button>
      </div>
    </div>
  );
}
