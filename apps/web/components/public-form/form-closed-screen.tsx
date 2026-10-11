"use client";

import { ClockIcon, UsersIcon, PauseCircleIcon } from "lucide-react";

export interface FormClosedScreenProps {
  isExpired?: boolean;
  closesAt?: Date | string | null;
  isLimitReached?: boolean;
  responseLimit?: number | null;
  isPublished?: boolean;
}

export function FormClosedScreen({
  isExpired,
  closesAt,
  isLimitReached,
  responseLimit,
  isPublished = true,
}: FormClosedScreenProps) {
  let title = "Form is Closed";
  let message = "This form is currently not accepting responses.";
  let Icon = PauseCircleIcon;
  let iconColor = "bg-amber-500/10 text-amber-600 dark:text-amber-400";

  if (isExpired && closesAt) {
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
    iconColor = "bg-amber-500/10 text-amber-600 dark:text-amber-400";
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-3 max-w-md w-full rounded-3xl border p-8 bg-card shadow-sm animate-in fade-in duration-300">
        <div className={`mx-auto size-12 rounded-2xl ${iconColor} flex items-center justify-center`}>
          <Icon className="size-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
