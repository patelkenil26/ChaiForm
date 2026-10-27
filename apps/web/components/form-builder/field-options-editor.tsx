"use client";

import { useState } from "react";
import { PlusIcon, XIcon } from "lucide-react";
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
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {/* Existing Option Pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] text-muted-foreground font-medium">Choices:</span>
        {options.map((opt, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-muted/80 text-foreground border border-border/50"
          >
            <span className="max-w-[140px] truncate" title={opt}>
              {opt}
            </span>
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="text-muted-foreground hover:text-destructive cursor-pointer transition-colors"
              title={`Remove ${opt}`}
            >
              <XIcon className="size-3" />
            </button>
          </span>
        ))}
        {options.length === 0 && (
          <span className="text-[11px] text-muted-foreground/60 italic">No choices added yet.</span>
        )}
      </div>

      {/* Add New Option Input Bar */}
      <div className="flex items-center gap-2 max-w-xs mt-0.5">
        <Input
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          placeholder={placeholder}
          maxLength={100}
          className="h-7 text-xs rounded-md"
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
          className="h-7 px-2 text-xs gap-1 shrink-0"
        >
          <PlusIcon className="size-3" />
          <span>Add</span>
        </Button>
      </div>
    </div>
  );
}
