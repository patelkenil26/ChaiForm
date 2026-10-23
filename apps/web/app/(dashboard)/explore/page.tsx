"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  IconSearch,
  IconFolder,
  IconFolderFilled,
  IconFolderOpen,
  IconCompass,
  IconSparkles,
  IconPlus,
  IconX,
  IconCheck,
} from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { TemplateCard, type PublicTemplateItem } from "~/components/explore/template-card";
import { useListPublicForms } from "~/hooks/api/form";
import { landingTheme } from "~/config/landing-theme";

interface FolderCategory {
  id: string;
  name: string;
  description: string;
  colorClass: string;
  iconBg: string;
}

const FOLDER_CATEGORIES: FolderCategory[] = [
  {
    id: "ALL",
    name: "All Templates",
    description: "Browse all curated community templates",
    colorClass: landingTheme.primaryText,
    iconBg: landingTheme.iconBg,
  },
  {
    id: "SURVEYS",
    name: "Surveys",
    description: "CSAT, NPS & community questionnaires",
    colorClass: "text-blue-500",
    iconBg: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  {
    id: "FEEDBACK",
    name: "Feedback",
    description: "User sentiment & feature requests",
    colorClass: "text-purple-500",
    iconBg: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  },
  {
    id: "EVENTS",
    name: "Events",
    description: "Conferences, meetups & workshops",
    colorClass: "text-emerald-500",
    iconBg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
  {
    id: "APPLICATIONS",
    name: "Job Applications",
    description: "Candidate screening & portfolios",
    colorClass: "text-rose-500",
    iconBg: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  },
  {
    id: "QUIZZES",
    name: "Quizzes",
    description: "Technical assessments & skills tests",
    colorClass: "text-amber-500",
    iconBg: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  {
    id: "GENERAL",
    name: "General Forms",
    description: "Contact inquiries & multi-purpose forms",
    colorClass: "text-slate-400",
    iconBg: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  },
];

export default function DashboardExplorePage() {
  const [selectedFolder, setSelectedFolder] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch all public templates once to calculate counts per folder
  const { publicForms: allPublicForms, isLoading: isAllLoading } = useListPublicForms();

  const allForms = (allPublicForms as PublicTemplateItem[] | undefined) ?? [];

  // Count items per category
  const folderCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: allForms.length };
    for (const form of allForms) {
      const cat = form.category?.toUpperCase() || "GENERAL";
      counts[cat] = (counts[cat] || 0) + 1;
    }
    return counts;
  }, [allForms]);

  // Filter forms by selected folder and search query
  const filteredForms = useMemo(() => {
    let list = allForms;
    if (selectedFolder !== "ALL") {
      list = list.filter((f) => (f.category?.toUpperCase() || "GENERAL") === selectedFolder);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (f) =>
          f.title?.toLowerCase().includes(q) ||
          f.description?.toLowerCase().includes(q) ||
          f.category?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [allForms, selectedFolder, searchQuery]);

  const activeCategoryMeta =
    FOLDER_CATEGORIES.find((c) => c.id === selectedFolder) || FOLDER_CATEGORIES[0];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 w-full animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge
              variant="outline"
              className={`text-[11px] px-2.5 py-0.5 gap-1.5 font-medium ${landingTheme.dashboardBadge}`}
            >
              <IconSparkles className={`size-3 ${landingTheme.iconColor}`} />
              <span>Curated Templates</span>
            </Badge>
          </div>
          <div className="flex items-center gap-2.5">
            <div
              className={`flex size-9 items-center justify-center rounded-lg ${landingTheme.iconBg}`}
            >
              <IconCompass className="size-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                Templates <span className={landingTheme.gradientText}>Gallery</span>
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                Browse pre-built templates by folder or search to clone directly into your
                workspace.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-64 md:w-72 sm:flex-initial">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-9 pr-8 h-9 text-xs bg-card border-border/70 ${landingTheme.inputFocus}`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <IconX className="size-3.5" />
              </button>
            )}
          </div>

          <Button
            asChild
            size="sm"
            className={`h-9 gap-1.5 text-xs shrink-0 ${landingTheme.primaryButton}`}
          >
            <Link href="/forms">
              <IconPlus className="size-3.5" />
              <span>Blank Form</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Category Filter Toolbar: Short Rounded Rectangle Chips */}
      <div className="flex flex-col gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconFolderOpen className={`size-4 ${landingTheme.iconColor}`} />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Categories
            </h2>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {selectedFolder !== "ALL" && (
              <button
                type="button"
                onClick={() => setSelectedFolder("ALL")}
                className={`${landingTheme.primaryText} hover:underline cursor-pointer font-medium`}
              >
                Reset to All
              </button>
            )}
            <span className="text-muted-foreground">
              {isAllLoading
                ? "Loading..."
                : `Showing ${filteredForms.length} template${filteredForms.length === 1 ? "" : "s"}`}
            </span>
          </div>
        </div>

        {/* Compact Rectangle Rounded Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {FOLDER_CATEGORIES.map((folder) => {
            const isSelected = selectedFolder === folder.id;
            const count = folderCounts[folder.id] ?? 0;

            return (
              <button
                key={folder.id}
                type="button"
                onClick={() => setSelectedFolder(folder.id)}
                className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer select-none ${
                  isSelected
                    ? landingTheme.tabActive
                    : `border-border/70 bg-card/60 text-muted-foreground hover:text-foreground ${landingTheme.tabInactive}`
                }`}
              >
                {/* Folder Icon with preserved category color styling */}
                <div
                  className={`flex size-5 items-center justify-center rounded border text-[10px] ${folder.iconBg}`}
                >
                  {isSelected ? (
                    <IconFolderFilled className="size-3" />
                  ) : (
                    <IconFolder className="size-3" />
                  )}
                </div>

                {/* Folder Name */}
                <span className={isSelected ? `font-semibold ${landingTheme.primaryText}` : ""}>
                  {folder.name}
                </span>

                {/* Count Badge */}
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono leading-none ${
                    isSelected
                      ? landingTheme.draftBadge
                      : "bg-muted text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  {isAllLoading ? "-" : count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search query pill if active */}
        {searchQuery && (
          <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
            <span>Filtered by keyword:</span>
            <Badge variant="secondary" className="gap-1 text-xs">
              <span>&quot;{searchQuery}&quot;</span>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="hover:text-foreground ml-0.5"
              >
                <IconX className="size-3" />
              </button>
            </Badge>
          </div>
        )}
      </div>

      {/* Bottom Section: TEMPLATES GRID */}
      {isAllLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border/60 bg-card p-5 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-20 rounded-md" />
                <Skeleton className="h-4 w-12 rounded-md" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-10 w-full" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-8 flex-1 rounded-md" />
                <Skeleton className="h-8 flex-1 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredForms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredForms.map((tpl) => (
            <TemplateCard key={tpl.id} template={tpl} />
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-3 text-muted-foreground">
            <IconFolder className="size-6" />
          </div>
          <h3 className="text-base font-semibold">No templates found</h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            No public templates match the folder &quot;{activeCategoryMeta?.name}&quot;
            {searchQuery ? ` and search "${searchQuery}"` : ""}.
          </p>
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedFolder("ALL");
                setSearchQuery("");
              }}
              className="text-xs"
            >
              Reset Filters
            </Button>
            <Button size="sm" asChild className="text-xs gap-1.5">
              <Link href="/forms">
                <IconPlus className="size-3.5" />
                <span>Create Form</span>
              </Link>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
