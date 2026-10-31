"use client";

import { useState, useMemo } from "react";
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
  IconSearch,
  IconSparkles,
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
import { Input } from "~/components/ui/input";
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
  onCreateOpen: (presetTitle?: string) => void;
}

type FilterTab = "all" | "published" | "draft";

const STARTER_TEMPLATES = [
  {
    title: "Customer Feedback & NPS Survey",
    desc: "Collect customer satisfaction ratings & feedback",
  },
  {
    title: "Lead Generation & Contact Us",
    desc: "Qualify inbound prospects with conversational questions",
  },
  {
    title: "Event RSVP & Guest Registration",
    desc: "Track attendees, meal preferences, and headcounts",
  },
  {
    title: "Product Research & Feature Request",
    desc: "Discover what features users want you to build next",
  },
];

/**
 * Top recently active forms hub with self-explanatory action buttons, status filters, and instant search.
 */
export function DashboardRecentForms({
  forms,
  totalForms,
  isLoading,
  copiedId,
  onCopyLink,
  onCreateOpen,
}: DashboardRecentFormsProps) {
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const publishedCount = useMemo(() => forms.filter((f) => f.isPublished).length, [forms]);
  const draftCount = useMemo(() => forms.filter((f) => !f.isPublished).length, [forms]);

  const filteredForms = useMemo(() => {
    return forms.filter((form) => {
      // Tab filter
      if (filterTab === "published" && !form.isPublished) return false;
      if (filterTab === "draft" && form.isPublished) return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = form.title.toLowerCase().includes(query);
        const matchesDesc = form.description?.toLowerCase().includes(query) ?? false;
        return matchesTitle || matchesDesc;
      }
      return true;
    });
  }, [forms, filterTab, searchQuery]);

  return (
    <div className="flex flex-col gap-4">
      {/* Section Header & View All */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <IconFolder className={`size-4.5 ${landingTheme.iconColor}`} />
            <h2 className="text-base sm:text-lg font-bold tracking-tight">Your Forms</h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage questions, review incoming answers, and share public form links.
          </p>
        </div>

        {totalForms > 0 && (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={`text-xs gap-1.5 font-semibold text-muted-foreground self-start sm:self-auto ${landingTheme.linkHover}`}
          >
            <Link href="/forms">
              <span>View All Forms ({totalForms})</span>
              <IconArrowRight className="size-3.5" />
            </Link>
          </Button>
        )}
      </div>

      {/* Control Bar: Status Tabs + Search */}
      {totalForms > 0 && !isLoading && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Segmented Filter Tabs */}
          <div className="grid grid-cols-3 sm:inline-flex items-center rounded-lg border border-border/70 bg-muted/30 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setFilterTab("all")}
              className={`px-2.5 sm:px-3 py-1 rounded-md text-[11px] sm:text-xs font-medium transition-all text-center justify-center ${
                filterTab === "all"
                  ? `bg-background text-foreground shadow-xs font-semibold ${landingTheme.primaryText}`
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({forms.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("published")}
              className={`px-2.5 sm:px-3 py-1 rounded-md text-[11px] sm:text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                filterTab === "published"
                  ? "bg-background text-emerald-400 shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>Live ({publishedCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("draft")}
              className={`px-2.5 sm:px-3 py-1 rounded-md text-[11px] sm:text-xs font-medium transition-all text-center justify-center ${
                filterTab === "draft"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Drafts ({draftCount})
            </button>
          </div>

          {/* Quick Search Input */}
          <div className="relative sm:w-64">
            <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by form name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs bg-muted/20 border-border/60 focus-visible:ring-lime-500/30"
            />
          </div>
        </div>
      )}

      {/* Forms Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {Array.from({ length: 6 }).map((_, i) => {
            const skeletonClass = i < 3 ? "flex" : i === 3 ? "hidden md:flex" : "hidden lg:flex";
            return (
              <Card key={i} className={`${skeletonClass} flex-col p-4.5 rounded-2xl`}>
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-12 rounded-full" />
                </div>
                <Skeleton className="h-3 w-4/5 mb-4" />
                <div className="flex items-center justify-between pt-2 border-t border-border/40 mb-3">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <Skeleton className="h-7.5 w-28 rounded-lg" />
                  <Skeleton className="h-7.5 w-16 rounded-lg" />
                </div>
              </Card>
            );
          })}
        </div>
      ) : forms.length === 0 ? (
        <Card className="flex flex-col p-5 sm:p-8 border-dashed rounded-2xl bg-card/40">
          <div className="text-center mb-6">
            <div
              className={`inline-flex size-12 items-center justify-center rounded-2xl ${landingTheme.iconBg} mb-3`}
            >
              <IconClipboardText className="size-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              Create your first conversational form
            </h3>
            <p className="mt-1 max-w-md mx-auto text-xs text-muted-foreground">
              Build a beautiful one-question-at-a-time experience that respondents enjoy completing.
              Pick a quick starter or start fresh from scratch.
            </p>
            <Button
              onClick={() => onCreateOpen()}
              size="sm"
              className={`mt-4 gap-2 ${landingTheme.primaryButton}`}
            >
              <IconPlus className="size-4" />
              <span>Start Blank Form</span>
            </Button>
          </div>

          {/* Quick Starters Grid */}
          <div className="border-t border-border/50 pt-5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-3 flex items-center gap-1.5">
              <IconSparkles className="size-3 text-amber-400" />
              <span>Or click a popular template to start instantly:</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {STARTER_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.title}
                  type="button"
                  onClick={() => onCreateOpen(tpl.title)}
                  className="text-left p-3 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/40 hover:border-lime-500/40 transition-all group cursor-pointer"
                >
                  <span className="font-semibold text-xs text-foreground block group-hover:text-lime-700 dark:group-hover:text-[#ccff00] transition-colors">
                    {tpl.title}
                  </span>
                  <span className="text-[11px] text-muted-foreground block mt-0.5">{tpl.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>
      ) : filteredForms.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-8 text-center border-dashed rounded-2xl bg-card/40">
          <p className="text-xs text-muted-foreground">
            No forms match &ldquo;{searchQuery}&rdquo;.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setFilterTab("all");
            }}
            className="mt-2 text-xs text-lime-700 dark:text-[#ccff00] hover:underline font-semibold"
          >
            Clear Search Filter
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredForms.map((form, index) => {
            const publicLink = form.slug || form.id;
            const isCopied = copiedId === form.id;

            // Strict responsive card visibility:
            // Mobile (<768px): Top 3 forms (index 0, 1, 2)
            // Tablet (768px - 1023px): Top 4 forms (index 0, 1, 2, 3) in balanced 2x2 grid
            // Desktop (>=1024px): Top 6 forms (index 0, 1, 2, 3, 4, 5) in 3x2 grid
            // When user is actively filtering via search bar, display all matching results
            const responsiveClass = searchQuery.trim()
              ? "flex"
              : index < 3
                ? "flex"
                : index === 3
                  ? "hidden md:flex"
                  : index < 6
                    ? "hidden lg:flex"
                    : "hidden";

            return (
              <Card
                key={form.id}
                className={`${responsiveClass} flex-col justify-between transition-all duration-200 rounded-2xl border ${landingTheme.cardBg} p-4 sm:p-4.5 ${landingTheme.cardBorderHover} relative overflow-hidden group`}
              >
                {/* Top Section: Form Title & Status Badge */}
                <CardHeader className="p-0 pb-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle
                      className={`line-clamp-1 text-sm font-bold group-hover:opacity-90 break-words ${landingTheme.linkHover}`}
                      title={form.title}
                    >
                      {form.title}
                    </CardTitle>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {form.isPublished ? (
                        <Badge
                          variant="default"
                          className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] font-semibold px-2 py-0.5"
                          title="Form is live and accessible on public URL"
                        >
                          <span className="size-1 rounded-full bg-emerald-400 mr-1 animate-pulse" />
                          Live
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-semibold px-2 py-0.5"
                          title="Form is unpublished and invisible to respondents"
                        >
                          Draft
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardDescription
                    className="line-clamp-2 text-xs min-h-[30px] mt-1 break-words text-muted-foreground"
                    title={form.description || undefined}
                  >
                    {form.description || (
                      <span className="italic opacity-50">No description added</span>
                    )}
                  </CardDescription>
                </CardHeader>

                {/* Meta stats: Views & Last Edited Date */}
                <CardContent className="p-0 pb-2.5 text-xs text-muted-foreground flex items-center justify-between border-t border-border/40 pt-2">
                  <div
                    className="flex items-center gap-1.5 text-[11px]"
                    title="Total views on this form"
                  >
                    <IconEye className="size-3.5 text-muted-foreground" />
                    <span>{form.isPublished ? `${form.views ?? 0} views` : "Draft mode"}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px]" title="Last modified date">
                    <IconClock className="size-3.5 text-muted-foreground" />
                    <span>Edited {formatRelativeTime(form.createdAt)}</span>
                  </div>
                </CardContent>

                {/* Bottom Action Buttons: Self-Explanatory Clear Buttons */}
                <CardFooter className="p-0 flex items-center justify-between gap-1.5 border-t border-border/40 pt-2.5">
                  {/* Left Primary Actions: Edit Form & Answers */}
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className={`gap-1 sm:gap-1.5 text-xs h-7.5 px-2 sm:px-2.5 border-border/70 ${landingTheme.buttonOutlineHover}`}
                      title="Open form builder to edit questions and settings"
                    >
                      <Link href={`/forms/${form.id}`}>
                        <IconPencil className="size-3 text-muted-foreground" />
                        <span>Edit Form</span>
                      </Link>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className={`gap-1 sm:gap-1.5 text-xs h-7.5 px-2 sm:px-2.5 ${landingTheme.buttonGhostHover}`}
                      title="View submitted answers and analytics for this form"
                    >
                      <Link href={`/forms/${form.id}/submissions`}>
                        <IconChartBar className={`size-3 ${landingTheme.iconColor}`} />
                        <span>Answers</span>
                      </Link>
                    </Button>
                  </div>

                  {/* Right Actions: Share Link & Live Preview */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`h-7.5 px-2 text-xs gap-1 border-border/60 ${
                        isCopied
                          ? "text-emerald-400 border-emerald-500/40"
                          : landingTheme.buttonGhostHover
                      }`}
                      title="Copy public link to share on WhatsApp, Email, or Socials"
                      onClick={(e) => onCopyLink(form.id, form.slug, e)}
                    >
                      {isCopied ? (
                        <>
                          <IconCheck className="size-3 text-emerald-400" />
                          <span className="text-[11px] font-semibold text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <IconCopy className="size-3 text-muted-foreground" />
                          <span className="text-[11px]">Share</span>
                        </>
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className={`size-7.5 rounded-lg ${landingTheme.buttonGhostHover}`}
                      asChild
                      title="Open live form preview in a new tab"
                    >
                      <Link href={`/form/${publicLink}`} target="_blank">
                        <IconExternalLink className="size-3.5" />
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

      {totalForms > 0 && !isLoading && (
        <div className="flex items-center justify-between pt-1 px-1 text-xs text-muted-foreground">
          <span>
            <span className="md:hidden">
              Showing {Math.min(3, filteredForms.length)} of {totalForms} forms
            </span>
            <span className="hidden md:inline lg:hidden">
              Showing {Math.min(4, filteredForms.length)} of {totalForms} forms
            </span>
            <span className="hidden lg:inline">
              Showing {Math.min(6, filteredForms.length)} of {totalForms} forms
            </span>
          </span>

          <Button
            variant="ghost"
            size="sm"
            asChild
            className={`h-7 px-2 text-xs font-semibold gap-1 text-muted-foreground ${landingTheme.linkHover}`}
          >
            <Link href="/forms">
              <span>View All ({totalForms})</span>
              <IconArrowRight className="size-3" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
