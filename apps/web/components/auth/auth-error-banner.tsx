"use client";

import { IconAlertCircle } from "@tabler/icons-react";
import { cn } from "~/lib/utils";

interface AuthErrorBannerProps {
  title: string;
  description: string;
  className?: string;
}

export function AuthErrorBanner({ title, description, className }: AuthErrorBannerProps) {
  if (!title && !description) return null;

  return (
    <div
      role="alert"
      className={cn(
        "rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-700 dark:text-rose-200 flex items-start gap-2.5 animate-in fade-in duration-200",
        className,
      )}
    >
      <IconAlertCircle className="size-4.5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
      <div className="space-y-0.5 min-w-0">
        {title && <p className="font-semibold text-rose-800 dark:text-rose-200 text-xs">{title}</p>}
        {description && (
          <p className="text-[11px] text-rose-700/90 dark:text-rose-300/90 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
