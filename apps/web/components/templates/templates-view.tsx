"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconSearch,
  IconCompass,
  IconSparkles,
  IconFilter,
  IconX,
  IconPlus,
  IconChartBar,
  IconMessageDots,
  IconCalendarEvent,
  IconBriefcase,
  IconBrain,
  IconForms,
} from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { Card } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useListPublicForms, useUseTemplate } from "~/hooks/api/form";
import { useUser } from "~/hooks/api/auth";
import { getSafeErrorMessage } from "~/lib/error";
import { toast } from "sonner";
import { landingTheme } from "~/config/landing-theme";
import { TemplateCard, type PublicTemplateItem } from "./template-card";
import { TemplatePreviewSheet } from "./template-preview-sheet";

const TEMPLATE_CATEGORIES = [
  { id: "ALL", label: "All Templates", icon: IconCompass },
  { id: "SURVEYS", label: "Surveys & NPS", icon: IconChartBar },
  { id: "FEEDBACK", label: "Feedback", icon: IconMessageDots },
  { id: "EVENTS", label: "Events & RSVPs", icon: IconCalendarEvent },
  { id: "APPLICATIONS", label: "Job Applications", icon: IconBriefcase },
  { id: "QUIZZES", label: "Quizzes", icon: IconBrain },
  { id: "GENERAL", label: "General Forms", icon: IconForms },
];

export function TemplatesView() {
  const router = useRouter();
  const { user } = useUser();
  const { useTemplateAsync } = useUseTemplate();

  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "questions" | "newest">("popular");
  const [cloningId, setCloningId] = useState<string | null>(null);

  // In-app preview sheet state
  const [previewTemplate, setPreviewTemplate] = useState<PublicTemplateItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Fetch all templates with React Query
  const { publicForms, isLoading } = useListPublicForms();
  const allForms = (publicForms as PublicTemplateItem[] | undefined) ?? [];

  // Count items per category
  const folderCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: allForms.length };
    for (const form of allForms) {
      const cat = form.category?.toUpperCase() || "GENERAL";
      counts[cat] = (counts[cat] || 0) + 1;
    }
    return counts;
  }, [allForms]);

  // Filter
  const filteredTemplates = useMemo(() => {
    return allForms.filter((tpl) => {
      if (
        selectedCategory !== "ALL" &&
        tpl.category?.toUpperCase() !== selectedCategory.toUpperCase()
      ) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchesTitle = tpl.title.toLowerCase().includes(q);
      const matchesDesc = tpl.description?.toLowerCase().includes(q) ?? false;
      const matchesCat = tpl.category?.toLowerCase().includes(q) ?? false;
      return matchesTitle || matchesDesc || matchesCat;
    });
  }, [allForms, selectedCategory, searchQuery]);

  // Sort
  const sortedTemplates = useMemo(() => {
    return [...filteredTemplates].sort((a, b) => {
      if (sortBy === "popular") {
        return (b.views ?? 0) - (a.views ?? 0);
      }
      if (sortBy === "questions") {
        return (b.fieldsCount ?? 0) - (a.fieldsCount ?? 0);
      }
      return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
    });
  }, [filteredTemplates, sortBy]);

  const handleOpenPreview = (tpl: PublicTemplateItem) => {
    setPreviewTemplate(tpl);
    setPreviewOpen(true);
  };

  const handleUseTemplate = async (templateId: string) => {
    if (!user) {
      toast.info("Please sign in or create an account to customize this template", {
        description: "Your selection will be preserved after signing in.",
      });
      router.push(`/login?redirect=/templates`);
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

  return (
    <div>
      {/* Hero Header Banner */}
      <section className="relative overflow-hidden pt-12 pb-12 md:pt-16 md:pb-16 border-b border-border/40 text-center">
        {/* Subtle Ambient Glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
          <div className={`h-[300px] w-[600px] rounded-full ${landingTheme.heroGlow}`} />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <Badge
            variant="outline"
            className={`mb-4 gap-1.5 px-3 py-1 text-xs font-medium ${landingTheme.badge}`}
          >
            <IconSparkles className="size-3.5" />
            <span>Curated Community Templates</span>
          </Badge>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Conversational Form <span className={landingTheme.gradientText}>Templates</span>
          </h1>

          <p className="mt-3.5 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Jumpstart your data collection with ready-made conversational templates. Test-drive any
            form live or clone it to your workspace with one click.
          </p>

          {/* Search Bar */}
          <div className="mt-8 w-full max-w-md relative">
            <IconSearch className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search templates by title or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-9 h-11 text-sm bg-card/80 border-border/60 shadow-xs rounded-xl"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs cursor-pointer"
                title="Clear search"
              >
                <IconX className="size-4" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="mt-6 flex items-center justify-center flex-wrap gap-2">
            {TEMPLATE_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count = folderCounts[cat.id];
              const CatIcon = cat.icon;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs font-medium px-3.5 py-1.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 border select-none ${
                    isSelected
                      ? `${landingTheme.tabActive} shadow-xs`
                      : "bg-muted/40 border-border/60 text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  }`}
                >
                  <CatIcon className="size-3.5" />
                  <span>{cat.label}</span>
                  {count !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-mono font-semibold ${
                        isSelected
                          ? "bg-primary/20 text-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-10 md:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Count & Sorting Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-border/40 text-xs">
          <div className="text-muted-foreground">
            {isLoading ? (
              <span>Loading templates...</span>
            ) : (
              <span>
                Showing <strong className="text-foreground">{sortedTemplates.length}</strong> of{" "}
                <strong className="text-foreground">{allForms.length}</strong> available templates
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
              <IconFilter className={`size-3.5 ${landingTheme.iconColor}`} />
              <span>Sort by:</span>
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

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border/60 bg-card p-5 space-y-4">
                <Skeleton className="h-5 w-24 rounded-md" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-10 w-full" />
                <div className="flex gap-2 pt-2 border-t border-border/40">
                  <Skeleton className="h-8 flex-1 rounded-xl" />
                  <Skeleton className="h-8 flex-1 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedTemplates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedTemplates.map((tpl) => (
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
            <h3 className="text-base font-bold text-foreground">No matching templates</h3>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              No public templates found. Try resetting your search query or selecting a different
              category.
            </p>
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCategory("ALL");
                  setSearchQuery("");
                }}
                className="text-xs"
              >
                Reset Filters
              </Button>
            </div>
          </Card>
        )}
      </section>

      {/* In-App Template Preview Sheet */}
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
