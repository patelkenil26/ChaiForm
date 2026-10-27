"use client";

import { ClockIcon, UsersIcon, PauseCircleIcon, ArchiveIcon } from "lucide-react";
import { landingTheme } from "~/config/landing-theme";

export interface FormClosedScreenProps {
  isExpired?: boolean;
  closesAt?: Date | string | null;
  isLimitReached?: boolean;
  responseLimit?: number | null;
  isPublished?: boolean;
  isArchived?: boolean;
}

export function FormClosedScreen({
  isExpired,
  closesAt,
  isLimitReached,
  responseLimit,
  isPublished = true,
  isArchived,
}: FormClosedScreenProps) {
  let title = "Form is Closed";
  let message = "This form is currently not accepting responses.";
  let Icon = PauseCircleIcon;
  let iconColor = landingTheme.iconBg;

  if (isArchived) {
    title = "Form is Archived";
    message = "This form has been archived and is no longer accepting responses.";
    Icon = ArchiveIcon;
    iconColor = landingTheme.iconBg;
  } else if (isExpired && closesAt) {
    title = "Form has Expired";
    message = `This form closed on ${new Date(closesAt).toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    })} and is no longer accepting responses.`;
    Icon = ClockIcon;
    iconColor = "bg-destructive/10 text-destructive";
  } else if (isLimitReached && responseLimit) {
    title = "Response Limit Reached";
    message = `This form has reached its maximum response capacity (${responseLimit} responses) and is no longer accepting new submissions.`;
    Icon = UsersIcon;
    iconColor = "bg-blue-500/10 text-blue-600 dark:text-blue-400";
  } else if (!isPublished) {
    title = "Submissions Paused";
    message = "The creator has paused submissions for this form. Please check back later.";
    Icon = PauseCircleIcon;
    iconColor = landingTheme.iconBg;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-3 max-w-md w-full rounded-3xl border p-8 bg-card shadow-sm animate-in fade-in duration-300">
        <div
          className={`mx-auto size-12 rounded-2xl ${iconColor} flex items-center justify-center`}
        >
          <Icon className="size-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
