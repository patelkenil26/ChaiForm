"use client";

import Link from "next/link";
import { IconInbox, IconArrowRight, IconSend } from "@tabler/icons-react";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { landingTheme } from "~/config/landing-theme";
import { formatRelativeTime } from "~/lib/date-utils";

export interface ActivitySubmissionItem {
  id: string;
  formId?: string | null;
  formTitle?: string | null;
  formSlug?: string | null;
  answersCount: number;
  createdAt?: Date | string | null;
}

export interface DashboardActivityFeedProps {
  submissions?: ActivitySubmissionItem[] | null;
  isLoading: boolean;
}

/**
 * Real-time incoming respondent submissions feed with instant audit links.
 */
export function DashboardActivityFeed({ submissions, isLoading }: DashboardActivityFeedProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <IconInbox className="size-4 text-emerald-400" />
            <h2 className="text-base sm:text-lg font-bold tracking-tight">
              Recent Submissions Feed
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Live respondents answering your conversational forms across the workspace.
          </p>
        </div>

        {submissions && submissions.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={`text-xs gap-1.5 font-medium text-muted-foreground ${landingTheme.linkHover}`}
          >
            <Link href="/submissions">
              <span>All Submissions</span>
              <IconArrowRight className="size-3.5" />
            </Link>
          </Button>
        )}
      </div>

      {isLoading ? (
        <Card className="p-6">
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-full" />
        </Card>
      ) : !submissions || submissions.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-8 text-center border-dashed">
          <div
            className={`flex size-10 items-center justify-center rounded-full ${landingTheme.iconBg} mb-2`}
          >
            <IconInbox className="size-5" />
          </div>
          <h4 className="text-sm font-semibold">No recent submissions yet</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            As soon as users complete any of your live forms, incoming responses will stream into
            this feed.
          </p>
        </Card>
      ) : (
        <div
          className={`rounded-2xl border ${landingTheme.cardBg} overflow-hidden ${landingTheme.cardBorderHover} transition-all`}
        >
          <div className="divide-y divide-border/50">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:px-5 gap-3 ${landingTheme.tableRowHover}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted border border-border/60 text-muted-foreground">
                    <span
                      className={`absolute -top-0.5 -right-0.5 size-2 rounded-full ${landingTheme.activeDot}`}
                    />
                    <IconSend className="size-3.5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="font-semibold text-xs sm:text-sm text-foreground truncate max-w-[200px] sm:max-w-xs"
                        title={sub.formTitle || "Untitled Form"}
                      >
                        {sub.formTitle || "Untitled Form"}
                      </span>
                      <Badge variant="outline" className={landingTheme.draftBadge}>
                        {sub.answersCount} {sub.answersCount === 1 ? "answer" : "answers"}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      Verified response • {formatRelativeTime(sub.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(sub.createdAt)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className={`text-xs h-7.5 gap-1 border-border/70 ${landingTheme.buttonOutlineHover}`}
                  >
                    <Link href={sub.formId ? `/submissions?formId=${sub.formId}` : "/submissions"}>
                      <span>Inspect</span>
                      <IconArrowRight className="size-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
