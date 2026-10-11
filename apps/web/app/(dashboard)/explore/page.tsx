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
import {
  TemplateCard,
  type PublicTemplateItem,
} from "~/components/explore/template-card";
import { useListPublicForms } from "~/hooks/api/form";

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
    colorClass: "text-primary",
    iconBg: "bg-primary/10 text-primary border-primary/20",
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
  const { publicForms: allPublicForms, isLoading: isAllLoading } =
    useListPublicForms();

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
      list = list.filter(
        (f) => (f.category?.toUpperCase() || "GENERAL") === selectedFolder
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (f) =>
          f.title?.toLowerCase().includes(q) ||
          f.description?.toLowerCase().includes(q) ||
          f.category?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allForms, selectedFolder, searchQuery]);

  const activeCategoryMeta =
    FOLDER_CATEGORIES.find((c) => c.id === selectedFolder) ||
    FOLDER_CATEGORIES[0];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 w-full">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <IconCompass className="size-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                Templates Gallery
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Browse pre-built templates by folder or search to clone directly into your forms.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Search bar */}
          <div className="relative w-full sm:w-64 md:w-72">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-8 h-9 text-xs bg-card"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <IconX className="size-3.5" />
              </button>
            )}
          </div>

          <Button asChild size="sm" className="h-9 gap-1.5 text-xs shrink-0">
            <Link href="/forms">
              <IconPlus className="size-3.5" />
              <span>Blank Form</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Top Section: FOLDERS */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconFolderOpen className="size-4 text-primary" />
            <h2 className="text-sm font-semibold tracking-tight">
              Template Folders
            </h2>
            <span className="text-xs text-muted-foreground">
              (Click a folder to filter)
            </span>
          </div>

          {selectedFolder !== "ALL" && (
            <button
              type="button"
              onClick={() => setSelectedFolder("ALL")}
              className="text-xs text-primary hover:underline cursor-pointer font-medium"
            >
              Reset to All Folders
            </button>
          )}
        </div>

        {/* Folders Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {FOLDER_CATEGORIES.map((folder) => {
            const isSelected = selectedFolder === folder.id;
            const count = folderCounts[folder.id] ?? 0;

            return (
              <Card
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className={`relative flex flex-col justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary"
                    : "border-border/70 bg-card/60 hover:bg-card hover:border-border hover:shadow-xs"
                }`}
              >
                {/* Folder Icon & Count */}
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div
                    className={`flex size-8 items-center justify-center rounded-lg border ${folder.iconBg}`}
                  >
                    {isSelected ? (
                      <IconFolderFilled className="size-4.5" />
                    ) : (
                      <IconFolder className="size-4.5" />
                    )}
                  </div>

                  <Badge
                    variant="outline"
                    className={`text-[10px] px-1.5 py-0 h-4 font-mono ${
                      isSelected
                        ? "border-primary/40 bg-primary/20 text-primary font-semibold"
                        : "text-muted-foreground border-border"
                    }`}
                  >
                    {isAllLoading ? "-" : count}
                  </Badge>
                </div>

                {/* Folder Name */}
                <div>
                  <h3
                    className={`text-xs font-semibold truncate ${
                      isSelected ? "text-foreground" : "text-foreground/90"
                    }`}
                  >
                    {folder.name}
                  </h3>
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                    {folder.description}
                  </p>
                </div>

                {/* Selected Indicator Pill */}
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary" />
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Active Folder Filter Bar */}
      <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3 pt-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Active Folder:</span>
          <Badge
            variant="outline"
            className={`font-medium gap-1 text-xs py-0.5 ${activeCategoryMeta?.iconBg}`}
          >
            <IconFolderFilled className="size-3" />
            <span>{activeCategoryMeta?.name}</span>
          </Badge>
          {searchQuery && (
            <Badge variant="secondary" className="text-xs">
              Search: &quot;{searchQuery}&quot;
            </Badge>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          {isAllLoading ? (
            <span>Loading templates...</span>
          ) : (
            <span>
              Showing {filteredForms.length} template
              {filteredForms.length === 1 ? "" : "s"}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Section: TEMPLATES GRID */}
      {isAllLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border/60 bg-card p-5 space-y-4"
            >
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
