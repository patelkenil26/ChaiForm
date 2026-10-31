"use client";

import { Badge } from "~/components/ui/badge";
import { INITIAL_BUILDER_QUESTIONS, BUILDER_FIELD_TYPES } from "./showcase-data";

/**
 * Visual Form Builder Canvas Preview Component
 * Pure presentation component showing questions schema and field type toolbox.
 */
export function ShowcaseBuilder() {
  return (
    <div className="p-6 sm:p-8 bg-card">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Questions Tree */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/40">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Form Schema (14 Field Types Available)
            </span>
            <Badge
              variant="secondary"
              className="text-[10px] bg-lime-500/10 dark:bg-[#CCFF00]/10 text-lime-800 dark:text-[#CCFF00] border-lime-600/20 dark:border-[#CCFF00]/20 font-semibold"
            >
              Auto-saving
            </Badge>
          </div>

          <div className="space-y-2">
            {INITIAL_BUILDER_QUESTIONS.map((q) => {
              const isSelected = q.isActive;
              return (
                <div
                  key={q.id}
                  className={`rounded-xl p-3.5 flex items-center justify-between transition-all ${
                    isSelected
                      ? "border border-lime-600/40 dark:border-[#CCFF00]/40 bg-card shadow-xs"
                      : "border border-border/70 bg-muted/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`size-6 rounded-md font-mono text-xs font-bold flex items-center justify-center ${
                        isSelected
                          ? "bg-lime-500/15 dark:bg-[#CCFF00]/15 text-lime-800 dark:text-[#CCFF00]"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      {q.id}
                    </span>
                    <div>
                      <div className="font-semibold text-xs text-foreground">{q.title}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {q.description} • {q.isRequired ? "Required" : "Optional"}
                      </div>
                    </div>
                  </div>

                  {isSelected ? (
                    <Badge variant="outline" className="text-[10px] border-border/80">
                      Active
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground font-mono select-none">
                      Drag
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Field Type Toolbox */}
        <div className="lg:col-span-5 rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground pb-2 border-b border-border/40">
            Add New Field
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {BUILDER_FIELD_TYPES.map((field) => (
              <div
                key={field.id}
                className="p-2.5 rounded-lg border border-border bg-card hover:border-lime-600/30 dark:hover:border-[#CCFF00]/30 transition-colors cursor-pointer flex items-center gap-2"
              >
                <span className={`size-2 rounded-full ${field.dotColorClass}`} />
                <span className="font-medium text-foreground">{field.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
