"use client";

import Link from "next/link";
import {
  IconFolder,
  IconArrowRight,
  IconClipboardText,
  IconPlus,
  IconEye,
  IconClock,
  IconPencil,
  IconChartBar,
  IconCheck,
  IconCopy,
  IconExternalLink,
} from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { landingTheme } from "~/config/landing-theme";
import { formatRelativeTime } from "~/lib/date-utils";

export interface DashboardRecentFormItem {
  id: string;
  title: string;
  description?: string | null;
  slug?: string | null;
  isPublished: boolean;
  views?: number | null;
  createdAt?: Date | string | null;
}

export interface DashboardRecentFormsProps {
  forms: DashboardRecentFormItem[];
  totalForms: number;
  isLoading: boolean;
  copiedId: string | null;
  onCopyLink: (formId: string, slug?: string | null, e?: React.MouseEvent) => void;
  onCreateOpen: () => void;
}

/**
 * Top 6 recently active form cards with builder links, responses, and live shortcuts.
 */
export function DashboardRecentForms({
  forms,
  totalForms,
  isLoading,
  copiedId,
  onCopyLink,
  onCreateOpen,
}: DashboardRecentFormsProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <IconFolder className={`size-4 ${landingTheme.iconColor}`} />
            <h2 className="text-base sm:text-lg font-bold tracking-tight">Recent Forms</h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Showing top 6 recently modified forms.
          </p>
        </div>

        {totalForms > 0 && (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={`text-xs gap-1.5 font-medium text-muted-foreground ${landingTheme.linkHover}`}
          >
            <Link href="/forms">
              <span>View All Forms ({totalForms})</span>
              <IconArrowRight className="size-3.5" />
            </Link>
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-9 w-full" />
            </Card>
          ))}
        </div>
      ) : forms.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <div
            className={`flex size-14 items-center justify-center rounded-full ${landingTheme.iconBg} mb-4`}
          >
            <IconClipboardText className="size-7" />
          </div>
          <h3 className="text-lg font-semibold">No forms created yet</h3>
          <p className="mt-1.5 max-w-sm text-xs sm:text-sm text-muted-foreground">
            Create your first interactive conversational form to start collecting responses and
            analyzing feedback.
          </p>
          <Button onClick={onCreateOpen} className={`mt-6 gap-2 ${landingTheme.primaryButton}`}>
            <IconPlus className="size-4" />
            Create Your First Form
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => {
            const publicLink = form.slug || form.id;
            return (
              <Card
                key={form.id}
                className={`flex flex-col justify-between transition-all duration-200 rounded-2xl border ${landingTheme.cardBg} p-5 ${landingTheme.cardBorderHover} group`}
              >
                <CardHeader className="p-0 pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle
                      className={`line-clamp-1 text-base font-semibold group-hover:opacity-90 break-words ${landingTheme.linkHover}`}
                      title={form.title}
                    >
                      {form.title}
                    </CardTitle>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {form.isPublished ? (
                        <Badge
                          variant="default"
                          className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs font-normal"
                        >
                          Live
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className={landingTheme.draftBadge}>
                          Draft
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardDescription
                    className="line-clamp-2 text-xs min-h-[32px] mt-1 break-words"
                    title={form.description || undefined}
                  >
                    {form.description || <span className="italic opacity-60">No description</span>}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-0 pb-3 text-xs text-muted-foreground flex items-center justify-between border-t border-border/40 pt-2.5">
                  <div className="flex items-center gap-1.5" title="Impressions">
                    <IconEye
                      className={`size-3.5 text-muted-foreground group-hover:${landingTheme.primaryText} transition-colors`}
                    />
                    <span>{form.isPublished ? `${form.views ?? 0} views` : "— (Draft)"}</span>
                  </div>

                  <div className="flex items-center gap-1" title="Created date">
                    <IconClock className="size-3.5 text-muted-foreground" />
                    <span>{formatRelativeTime(form.createdAt)}</span>
                  </div>
                </CardContent>

                <CardFooter className="p-0 flex items-center justify-between gap-2 border-t border-border/40 pt-3 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className={`gap-1.5 text-xs h-8 border-border/70 ${landingTheme.buttonOutlineHover}`}
                    >
                      <Link href={`/forms/${form.id}`}>
                        <IconPencil className="size-3.5" />
                        <span>Builder</span>
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className={`gap-1.5 text-xs h-8 ${landingTheme.buttonGhostHover}`}
                    >
                      <Link href={`/forms/${form.id}/submissions`}>
                        <IconChartBar className={`size-3.5 ${landingTheme.iconColor}`} />
                        <span>Responses</span>
                      </Link>
                    </Button>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`size-8 ${landingTheme.buttonGhostHover}`}
                      title="Copy Public Link"
                      onClick={(e) => onCopyLink(form.id, form.slug, e)}
                    >
                      {copiedId === form.id ? (
                        <IconCheck className="size-4 text-emerald-500" />
                      ) : (
                        <IconCopy className="size-4" />
                      )}
                      <span className="sr-only">Copy Link</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`size-8 ${landingTheme.buttonGhostHover}`}
                      asChild
                      title="Open Live Form"
                    >
                      <Link href={`/form/${publicLink}`} target="_blank">
                        <IconExternalLink className="size-4" />
                        <span className="sr-only">Open Live Form</span>
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
