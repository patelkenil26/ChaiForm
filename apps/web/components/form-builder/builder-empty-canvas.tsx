"use client";

import {
  IconSparkles,
  IconPlus,
  IconMail,
  IconStar,
  IconCircleDot,
  IconTypography,
} from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { landingTheme } from "~/config/landing-theme";
import type { FieldType } from "./field-types";

interface BuilderEmptyCanvasProps {
  isDraggingOver: boolean;
  onAddFirstQuestion: (type?: FieldType) => void;
}

const STARTER_CHIPS: Array<{ type: FieldType; label: string; icon: typeof IconMail }> = [
  { type: "TEXT", label: "Short Text", icon: IconTypography },
  { type: "EMAIL", label: "Email Address", icon: IconMail },
  { type: "RATING", label: "Star Rating", icon: IconStar },
  { type: "RADIO", label: "Single Choice", icon: IconCircleDot },
];

export function BuilderEmptyCanvas({
  isDraggingOver,
  onAddFirstQuestion,
}: BuilderEmptyCanvasProps) {
  return (
    <div
      className={`min-h-[280px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 sm:p-8 text-center transition-all ${
        isDraggingOver
          ? `${landingTheme.callout.border} ${landingTheme.callout.bg}`
          : "border-border/60 bg-card/20 hover:border-border/80"
      }`}
    >
      <div className="size-12 rounded-2xl bg-lime-500/10 dark:bg-[#ccff00]/10 border border-lime-500/20 text-lime-700 dark:text-[#ccff00] flex items-center justify-center mb-3 shadow-xs">
        <IconSparkles className="size-6" />
      </div>
      <h3 className="text-base font-semibold text-foreground tracking-tight">
        Your Form is Ready to Build
      </h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-md text-center leading-relaxed">
        Choose a quick starter question below, click Add Question, or drag field types from the
        toolbox.
      </p>

      {/* Primary CTA Button */}
      <Button
        size="sm"
        onClick={() => onAddFirstQuestion("TEXT")}
        className={`mt-4 gap-1.5 ${landingTheme.primaryButton}`}
      >
        <IconPlus className="size-4" />
        <span>Add First Question</span>
      </Button>

      {/* Quick Starter Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4 max-w-lg">
        {STARTER_CHIPS.map((chip) => {
          const Icon = chip.icon;
          return (
            <button
              key={chip.type}
              type="button"
              onClick={() => onAddFirstQuestion(chip.type)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-background hover:bg-muted/80 text-foreground border border-border/70 hover:border-lime-500/40 dark:hover:border-[#ccff00]/40 transition-colors shadow-2xs active:scale-[0.98] cursor-pointer"
            >
              <Icon className="size-3.5 text-lime-600 dark:text-[#ccff00]" />
              <span>+ {chip.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
