"use client";

import { SparklesIcon, PlusIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { landingTheme } from "~/config/landing-theme";

interface BuilderEmptyCanvasProps {
  isDraggingOver: boolean;
  onAddFirstQuestion: () => void;
}

export function BuilderEmptyCanvas({
  isDraggingOver,
  onAddFirstQuestion,
}: BuilderEmptyCanvasProps) {
  return (
    <div
      className={`h-64 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-8 text-center transition-all ${
        isDraggingOver
          ? "border-amber-400 bg-amber-500/15"
          : "border-border/60 bg-background/30"
      }`}
    >
      <div className="size-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
        <SparklesIcon className="size-6" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">
        Drag & Drop Questions Here
      </h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-sm">
        Drag any field type from the toolbox on the right to start building your form, or click on any field to add it instantly.
      </p>
      <Button
        size="sm"
        onClick={onAddFirstQuestion}
        className={`mt-4 gap-1.5 ${landingTheme.primaryButton}`}
      >
        <PlusIcon className="size-3.5" />
        Add First Question
      </Button>
    </div>
  );
}
