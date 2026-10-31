"use client";

import Link from "next/link";
import { IconInbox, IconArrowRight, IconSend, IconChevronRight } from "@tabler/icons-react";
import { Card } from "~/components/ui/card";
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
 * Compact, real-time incoming respondent submissions feed tailored for the SaaS cockpit right rail.
 */
export function DashboardActivityFeed({ submissions, isLoading }: DashboardActivityFeedProps) {
  return (
    <Card
      className={`p-4 sm:p-5 rounded-2xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} relative overflow-hidden transition-all`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div
              className={`flex size-8 items-center justify-center rounded-lg ${landingTheme.iconBg}`}
            >
              <IconInbox className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-foreground">
                Recent Submissions
              </h3>
              <p className="text-[11px] text-muted-foreground">Live respondent answers stream</p>
            </div>
          </div>
        </div>

        {submissions && submissions.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={`h-7 px-2 text-xs font-semibold gap-1 text-muted-foreground ${landingTheme.linkHover}`}
            title="Open all respondent submissions table"
          >
            <Link href="/submissions">
              <span>View All</span>
              <IconArrowRight className="size-3" />
            </Link>
          </Button>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <Skeleton className="size-8 rounded-lg shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-2 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : !submissions || submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed border-border/60 rounded-xl bg-card/40">
          <div
            className={`flex size-9 items-center justify-center rounded-xl ${landingTheme.iconBg} mb-2`}
          >
            <IconInbox className="size-4.5" />
          </div>
          <h4 className="text-xs font-semibold text-foreground">No submissions recorded yet</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5 max-w-xs leading-relaxed">
            When someone completes any of your live forms, their submitted answers will appear here
            in real-time.
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
          {submissions.slice(0, 5).map((sub) => {
            const inspectHref = sub.formId ? `/forms/${sub.formId}/submissions` : "/submissions";
            return (
              <Link
                key={sub.id}
                href={inspectHref}
                title="Click to view full answer sheet"
                className="group flex items-center justify-between p-2.5 rounded-xl border border-border/40 bg-muted/20 hover:bg-muted/40 hover:border-lime-500/30 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:text-foreground transition-colors">
                    <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-emerald-400" />
                    <IconSend className="size-3.5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span
                      className="font-semibold text-xs text-foreground truncate max-w-[140px] sm:max-w-[170px] group-hover:text-lime-400 transition-colors"
                      title={sub.formTitle || "Untitled Form"}
                    >
                      {sub.formTitle || "Untitled Form"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {sub.answersCount} {sub.answersCount === 1 ? "answer" : "answers"} •{" "}
                      {formatRelativeTime(sub.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground group-hover:text-lime-400 transition-colors pl-2 shrink-0">
                  <span className="hidden sm:inline">Review</span>
                  <IconChevronRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </Card>
  );
}
