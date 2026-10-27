"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconSearch,
  IconCompass,
  IconSparkles,
  IconArrowRight,
  IconHelpCircle,
  IconEye,
  IconCopy,
  IconExternalLink,
  IconX,
  IconCheck,
  IconBolt,
  IconFilter,
  IconLoader2,
} from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { useListPublicForms, useUseTemplate } from "~/hooks/api/form";
import { useUser } from "~/hooks/api/auth";
import { getSafeErrorMessage } from "~/lib/error";
import { toast } from "sonner";
import { landingTheme } from "~/config/landing-theme";

const TEMPLATE_CATEGORIES = [
  { id: "ALL", label: "All Templates" },
  { id: "SURVEYS", label: "Surveys" },
  { id: "FEEDBACK", label: "Feedback" },
  { id: "EVENTS", label: "Events & RSVPs" },
  { id: "APPLICATIONS", label: "Applications" },
  { id: "QUIZZES", label: "Quizzes" },
  { id: "GENERAL", label: "General Forms" },
];

export function TemplatesView() {
  const router = useRouter();
  const { user } = useUser();
  const { useTemplateAsync } = useUseTemplate();

  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "newest" | "questions">("popular");
  const [cloningId, setCloningId] = useState<string | null>(null);

  // Fetch all templates with React Query (same source as dashboard explore)
  const { publicForms, isLoading } = useListPublicForms();

  const allForms = publicForms ?? [];

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
  const filteredTemplates = allForms.filter((tpl) => {
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

  // Sort
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (sortBy === "popular") {
      return (b.views ?? 0) - (a.views ?? 0);
    }
    if (sortBy === "questions") {
      return (b.fieldsCount ?? 0) - (a.fieldsCount ?? 0);
    }
    // newest
    return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
  });

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
      router.push(`/forms/${res.id}`);
    } catch (err: unknown) {
      toast.error(getSafeErrorMessage(err, "Failed to clone template"));
    } finally {
      setCloningId(null);
    }
  };

  return (
    <div>
      {/* Header Banner */}
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
            <IconCompass className="size-3.5" />
            <span>Curated Template Directory</span>
          </Badge>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Conversational Form Templates
          </h1>

          <p className="mt-3.5 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Jumpstart your data collection with ready-made conversational templates. Test-drive any
            form live or clone it to your workspace with one click.
          </p>

          {/* Search + Category Controls */}
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
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                    isSelected
                      ? landingTheme.activePill
                      : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span>{cat.label}</span>
                  {count !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-semibold ${
                        isSelected
                          ? "bg-background/25 text-background dark:bg-foreground/25 dark:text-foreground"
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
      <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Count & Sorting Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-border/40 text-xs">
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
            <span className="text-muted-foreground flex items-center gap-1">
              <IconFilter className="size-3.5" />
              <span>Sort by:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "popular" | "newest" | "questions")}
              aria-label="Sort templates by"
              className="bg-card border border-border/60 rounded-lg px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="questions">Question Count</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border/60 bg-card p-5 space-y-4">
                <Skeleton className="h-28 w-full rounded-lg" />
                <Skeleton className="h-5 w-20 rounded-md" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-10 w-full" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-8 flex-1 rounded-md" />
                  <Skeleton className="h-8 flex-1 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedTemplates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className={`group relative flex flex-col justify-between rounded-xl border border-border/60 bg-card/60 backdrop-blur-xs overflow-hidden transition-all duration-200 ${landingTheme.cardBorderHover}`}
              >
                {/* Visual Thumbnail Header (Card Preview) */}
                <div className="h-24 bg-gradient-to-br from-amber-500/10 via-neutral-900/50 to-neutral-950/80 border-b border-border/40 p-3.5 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-background/80 border border-border/60 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-xs">
                      {tpl.category || "General"}
                    </span>
                    {typeof tpl.views === "number" && tpl.views > 0 && (
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-background/60 px-2 py-0.5 rounded-full">
                        <IconEye className="size-3" />
                        <span>{tpl.views}</span>
                      </span>
                    )}
                  </div>

                  {/* Mini Form Question Wireframe */}
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-[11px] font-medium text-foreground/80 truncate">
                      1-by-1 Step Survey
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      className={`text-base font-semibold text-foreground group-hover:${landingTheme.primaryText} transition-colors line-clamp-1`}
                    >
                      {tpl.title}
                    </h3>

                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2 min-h-[32px]">
                      {tpl.description ||
                        "Conversational multi-field template ready for immediate deployment."}
                    </p>

                    <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40 pt-3">
                      <div className="flex items-center gap-1.5">
                        <IconHelpCircle className={`size-3.5 ${landingTheme.iconColor}`} />
                        <span>{tpl.fieldsCount ?? 0} questions</span>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-500 font-medium">
                        <IconCheck className="size-3" />
                        <span>Ready to use</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex items-center gap-2 pt-2 border-t border-border/40">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="flex-1 text-xs gap-1.5 h-8.5 hover:border-border"
                    >
                      <Link
                        href={`/form/${tpl.slug || tpl.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IconExternalLink className="size-3.5" />
                        <span>Preview Live</span>
                      </Link>
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleUseTemplate(tpl.id)}
                      disabled={cloningId === tpl.id}
                      className={`flex-1 text-xs gap-1.5 h-8.5 ${landingTheme.primaryButton}`}
                    >
                      {cloningId === tpl.id ? (
                        <>
                          <IconLoader2 className="size-3.5 animate-spin" />
                          <span>Cloning...</span>
                        </>
                      ) : (
                        <>
                          <IconCopy className="size-3.5" />
                          <span>Use Template</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed rounded-2xl bg-card/40 max-w-md mx-auto">
            <IconCompass className="size-10 text-muted-foreground/60 mb-3" />
            <h3 className="text-base font-semibold">No templates found</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {searchQuery
                ? `No templates matched "${searchQuery}".`
                : "No templates exist in this category yet."}
            </p>
            <div className="mt-5 flex items-center gap-3">
              {(searchQuery || selectedCategory !== "ALL") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("ALL");
                  }}
                  className="text-xs gap-1.5"
                >
                  <IconX className="size-3.5" />
                  <span>Clear Filters</span>
                </Button>
              )}
              <Button asChild size="sm" className={`text-xs gap-1.5 ${landingTheme.primaryButton}`}>
                <Link href="/login">
                  <span>Create Custom Form</span>
                  <IconArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Bottom Banner */}
        <div
          className={`mt-16 rounded-2xl ${landingTheme.ctaBox} p-8 sm:p-10 text-center flex flex-col items-center`}
        >
          <Badge
            variant="outline"
            className={`text-xs px-3 py-1 mb-3 gap-1.5 ${landingTheme.ctaBadge}`}
          >
            <IconBolt className={`size-3.5 ${landingTheme.iconColor}`} />
            <span>Build From Scratch</span>
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Need a completely custom conversational form?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl leading-relaxed">
            Our visual builder lets you assemble custom question steps, set up password security,
            pick designer themes, and embed on any website in under 2 minutes.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <Button
              asChild
              size="lg"
              className={`h-11 px-7 text-sm ${landingTheme.primaryButton} gap-2`}
            >
              <Link href="/signup">
                <span>Start Free</span>
                <IconArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-11 px-6 text-sm">
              <Link href="/pricing">View Pricing Plans</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
