"use client";

import { cn } from "~/lib/utils";

export interface CharacterCounterProps {
  current: number;
  max: number;
  className?: string;
  warningThreshold?: number; // ratio (0 to 1), default 0.85
}

/**
 * Reusable character counter badge for text inputs, textareas, and form fields.
 * Displays `current/max` with automated warning (amber) and exceeded (red) styling.
 */
export function CharacterCounter({
  current,
  max,
  className,
  warningThreshold = 0.85,
}: CharacterCounterProps) {
  const isExceeded = current >= max;
  const isNearLimit = current >= max * warningThreshold && !isExceeded;

  return (
    <span
      className={cn(
        "text-[10px] font-mono tabular-nums select-none",
        isExceeded
          ? "text-destructive font-bold"
          : isNearLimit
            ? "text-amber-400 font-medium"
            : "text-muted-foreground/60",
        className,
      )}
      aria-label={`${current} of ${max} characters`}
    >
      {current}/{max}
    </span>
  );
}
