"use client";

import { ClockIcon, UsersIcon, LockIcon } from "lucide-react";
import { landingTheme } from "~/config/landing-theme";

interface FormMetaBadgesProps {
  slug?: string | null;
  closesAt?: Date | string | null;
  responseLimit?: number | null;
  isPasswordProtected?: boolean;
}

export function FormMetaBadges({
  slug,
  closesAt,
  responseLimit,
  isPasswordProtected,
}: FormMetaBadgesProps) {
  if (!slug && !closesAt && !responseLimit && !isPasswordProtected) {
    return null;
  }

  const isExpired = closesAt ? new Date() > new Date(closesAt) : false;

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-xs">
      {slug && <span className={landingTheme.slugBadge}>/form/{slug}</span>}

      {closesAt && (
        <span
          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground"
          suppressHydrationWarning
        >
          <ClockIcon className={`size-3 ${landingTheme.iconColor}`} />
          {isExpired ? "Expired" : `Closes ${new Date(closesAt).toLocaleDateString()}`}
        </span>
      )}

      {responseLimit && (
        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          <UsersIcon className="size-3 text-blue-500" />
          Limit: {responseLimit}
        </span>
      )}

      {isPasswordProtected && (
        <span className="inline-flex items-center gap-1 text-[11px] text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded">
          <LockIcon className="size-3" />
          Protected
        </span>
      )}
    </div>
  );
}
