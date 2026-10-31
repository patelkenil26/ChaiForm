"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconSearch,
  IconCompass,
  IconSparkles,
  IconPlus,
  IconX,
  IconFolderOpen,
  IconFilter,
  IconChartBar,
  IconMessageDots,
  IconCalendarEvent,
  IconBriefcase,
  IconBrain,
  IconForms,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { TemplateCard, type PublicTemplateItem } from "~/components/templates/template-card";
import { TemplatePreviewSheet } from "~/components/templates/template-preview-sheet";
import { useListPublicForms, useUseTemplate } from "~/hooks/api/form";
import { useUser } from "~/hooks/api/auth";
import { getSafeErrorMessage } from "~/lib/error";
import { landingTheme } from "~/config/landing-theme";

interface CategoryDefinition {
  id: string;
  name: string;
  icon: typeof IconCompass;
  description: string;
}

const TEMPLATE_CATEGORIES: CategoryDefinition[] = [
  {
    id: "ALL",
    name: "All Templates",
    icon: IconCompass,
    description: "Browse all curated community templates",
  },
  {
    id: "SURVEYS",
    name: "Surveys & NPS",
    icon: IconChartBar,
    description: "CSAT, NPS & community questionnaires",
  },
  {
    id: "FEEDBACK",
    name: "Feedback",
    icon: IconMessageDots,
    description: "User sentiment & feature requests",
  },
  {
    id: "EVENTS",
    name: "Events & RSVPs",
    icon: IconCalendarEvent,
    description: "Conferences, meetups & workshops",
  },
  {
    id: "APPLICATIONS",
    name: "Job Applications",
    icon: IconBriefcase,
    description: "Candidate screening & portfolios",
  },
  {
    id: "QUIZZES",
    name: "Quizzes",
    icon: IconBrain,
    description: "Technical assessments & skills tests",
  },
  {
    id: "GENERAL",
    name: "General Forms",
    icon: IconForms,
    description: "Contact inquiries & multi-purpose forms",
  },
];

export default function DashboardExplorePage() {
  const router = useRouter();
  const { user } = useUser();
  const { useTemplateAsync } = useUseTemplate();

  const [selectedFolder, setSelectedFolder] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"popular" | "questions" | "newest">("popular");
  const [cloningId, setCloningId] = useState<string | null>(null);

  // In-app preview sheet state
  const [previewTemplate, setPreviewTemplate] = useState<PublicTemplateItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Fetch all public templates once with 5m cache
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

  // Sort filtered templates
  const sortedForms = useMemo(() => {
    return [...filteredForms].sort((a, b) => {
      if (sortBy === "popular") {
        return (b.views ?? 0) - (a.views ?? 0);
      }
      if (sortBy === "questions") {
        return (b.fieldsCount ?? 0) - (a.fieldsCount ?? 0);
      }
      return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
    });
  }, [filteredForms, sortBy]);

  const handleOpenPreview = (tpl: PublicTemplateItem) => {
    setPreviewTemplate(tpl);
    setPreviewOpen(true);
  };

  const handleUseTemplate = async (templateId: string) => {
    if (!user) {
      toast.info("Please sign in to clone this template to your workspace");
      router.push(`/login?redirect=/explore`);
      return;
    }

    setCloningId(templateId);
    try {
      const res = await useTemplateAsync({ formId: templateId });
      toast.success("Template cloned to your forms!");
      setPreviewOpen(false);
      router.push(`/forms/${res.id}`);
    } catch (err: unknown) {
      toast.error(getSafeErrorMessage(err, "Failed to clone template"));
    } finally {
      setCloningId(null);
    }
  };

  const activeCategoryMeta =
    TEMPLATE_CATEGORIES.find((c) => c.id === selectedFolder) || TEMPLATE_CATEGORIES[0];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      {/* 1. Header & Search Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge
              variant="outline"
              className={`text-[11px] px-2.5 py-0.5 gap-1.5 font-medium ${landingTheme.badge}`}
            >
              <IconSparkles className={`size-3 ${landingTheme.iconColor}`} />
              <span>Curated Templates Library</span>
            </Badge>
          </div>

          <div className="flex items-center gap-2.5">
            <div
              className={`flex size-9 items-center justify-center rounded-lg ${landingTheme.iconBg}`}
            >
              <IconCompass className="size-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                Templates <span className={landingTheme.gradientText}>Gallery</span>
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                Inspect questions in-app, test conversational flow, and clone instantly to your
                workspace.
              </p>
            </div>
          </div>
        </div>

        {/* Right Search & Blank Form Actions */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64 md:w-72 sm:flex-initial">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
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
                title="Clear search"
              >
                <IconX className="size-3.5" />
              </button>
            )}
          </div>

          <Button
            asChild
            size="sm"
            className={`h-9 gap-1.5 text-xs shrink-0 font-semibold ${landingTheme.primaryButton}`}
          >
            <Link href="/forms">
              <IconPlus className="size-3.5" />
              <span className="hidden sm:inline">Start</span> Blank Form
            </Link>
          </Button>
        </div>
      </div>

      {/* 2. Category Filter Pills Toolbar */}
      <div className="flex flex-col gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconFolderOpen className={`size-4 ${landingTheme.iconColor}`} />
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Filter by Category
            </h2>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {selectedFolder !== "ALL" && (
              <button
                type="button"
                onClick={() => setSelectedFolder("ALL")}
                className={`${landingTheme.primaryText} hover:underline cursor-pointer font-medium text-xs`}
              >
                Reset to All
              </button>
            )}
            <span className="text-muted-foreground">
              {isAllLoading
                ? "Loading..."
                : `Showing ${sortedForms.length} template${sortedForms.length === 1 ? "" : "s"}`}
            </span>
          </div>
        </div>

        {/* Category Pill Buttons with Specific Icons */}
        <div className="flex flex-wrap items-center gap-2">
          {TEMPLATE_CATEGORIES.map((cat) => {
            const isSelected = selectedFolder === cat.id;
            const count = folderCounts[cat.id] ?? 0;
            const CatIcon = cat.icon;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedFolder(cat.id)}
                className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer select-none ${
                  isSelected
                    ? `${landingTheme.tabActive} shadow-xs`
                    : `border-border/70 bg-card/60 text-muted-foreground hover:text-foreground ${landingTheme.tabInactive}`
                }`}
              >
                <CatIcon
                  className={`size-3.5 ${
                    isSelected
                      ? landingTheme.iconColor
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                />
                <span className={isSelected ? `font-semibold ${landingTheme.primaryText}` : ""}>
                  {cat.name}
                </span>

                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono leading-none ${
                    isSelected
                      ? "bg-primary/20 text-foreground font-bold"
                      : "bg-muted text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  {isAllLoading ? "..." : count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Keyword Filter Indicator */}
        {searchQuery && (
          <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
            <span>Filtered by keyword:</span>
            <Badge variant="secondary" className="gap-1 text-xs">
              <span>&quot;{searchQuery}&quot;</span>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="hover:text-foreground ml-0.5 cursor-pointer"
              >
                <IconX className="size-3" />
              </button>
            </Badge>
          </div>
        )}
      </div>

      {/* 3. Sub-bar: Sorting Dropdown & Count */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground text-xs">
          Click any card to inspect question steps or clone directly.
        </span>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
            <IconFilter className={`size-3.5 ${landingTheme.iconColor}`} />
            <span>Sort:</span>
          </span>
          <Select
            value={sortBy}
            onValueChange={(val: "popular" | "questions" | "newest") => setSortBy(val)}
          >
            <SelectTrigger
              className={`h-8 w-[145px] text-xs bg-card border-border/70 ${landingTheme.inputFocus}`}
            >
              <SelectValue placeholder="Sort templates" />
            </SelectTrigger>
            <SelectContent align="end" className="bg-card border-border/70">
              <SelectItem value="popular" className="cursor-pointer text-xs">
                Most Popular
              </SelectItem>
              <SelectItem value="questions" className="cursor-pointer text-xs">
                Question Count
              </SelectItem>
              <SelectItem value="newest" className="cursor-pointer text-xs">
                Newest First
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 4. Templates Grid */}
      {isAllLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5 sm:gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/60 bg-card p-5 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-24 rounded-md" />
                <Skeleton className="h-4 w-12 rounded-full" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-10 w-full" />
              <div className="flex gap-2 pt-2 border-t border-border/40">
                <Skeleton className="h-8 flex-1 rounded-xl" />
                <Skeleton className="h-8 flex-1 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : sortedForms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5 sm:gap-5">
          {sortedForms.map((tpl) => (
            <TemplateCard
              key={tpl.id}
              template={tpl}
              onPreview={handleOpenPreview}
              onUseTemplate={handleUseTemplate}
              isCloning={cloningId === tpl.id}
            />
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed rounded-2xl bg-card/40">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-muted mb-3 text-muted-foreground">
            <IconCompass className="size-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">No matching templates found</h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground leading-relaxed">
            No public templates match &quot;{activeCategoryMeta?.name}&quot;
            {searchQuery ? ` and keyword "${searchQuery}"` : ""}. Try adjusting filters or search
            term.
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
            <Button size="sm" asChild className={`text-xs gap-1.5 ${landingTheme.primaryButton}`}>
              <Link href="/forms">
                <IconPlus className="size-3.5" />
                <span>Start Blank Form</span>
              </Link>
            </Button>
          </div>
        </Card>
      )}

      {/* 5. In-App Template Preview Sheet */}
      <TemplatePreviewSheet
        template={previewTemplate}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        onUseTemplate={handleUseTemplate}
        isCloning={cloningId === previewTemplate?.id}
      />
    </div>
  );
}
