"use client";

import { useState } from "react";
import Link from "next/link";
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
} from "@tabler/icons-react";
import { LandingNavbar } from "~/components/landing/navbar";
import { LandingFooter } from "~/components/landing/footer";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { useListPublicForms } from "~/hooks/api/form";
import { useUser } from "~/hooks/api/auth";
import { useUseTemplate } from "~/hooks/api/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { landingTheme } from "~/config/landing-theme";

const TEMPLATE_CATEGORIES = [
  { id: "ALL", label: "All Templates" },
  { id: "SURVEYS", label: "Surveys" },
  { id: "FEEDBACK", label: "Customer Feedback" },
  { id: "EVENTS", label: "Events & RSVPs" },
  { id: "APPLICATIONS", label: "Job Applications" },
  { id: "QUIZZES", label: "Quizzes & Tests" },
];

export default function PublicTemplatesPage() {
  const router = useRouter();
  const { user } = useUser();
  const { useTemplateAsync } = useUseTemplate();

  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [cloningId, setCloningId] = useState<string | null>(null);

  const { publicForms, isLoading } = useListPublicForms({
    category: selectedCategory === "ALL" ? undefined : selectedCategory,
  });

  const filteredTemplates = (publicForms ?? []).filter((tpl) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const matchesTitle = tpl.title.toLowerCase().includes(q);
    const matchesDesc = tpl.description?.toLowerCase().includes(q) ?? false;
    const matchesCat = tpl.category?.toLowerCase().includes(q) ?? false;
    return matchesTitle || matchesDesc || matchesCat;
  });

  const handleUseTemplate = async (templateId: string) => {
    if (!user) {
      toast.info("Please sign in or create a free account to customize this template");
      router.push(`/login?redirect=/templates`);
      return;
    }

    setCloningId(templateId);
    try {
      const res = await useTemplateAsync({ formId: templateId });
      toast.success("Template cloned to your workspace!");
      router.push(`/forms/${res.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to clone template";
      toast.error(msg);
    } finally {
      setCloningId(null);
    }
  };

  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col ${landingTheme.selection}`}>
      <LandingNavbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-12 md:pt-16 md:pb-16 border-b border-border/40">
          {/* Subtle Ambient Glow */}
          <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
            <div className={`h-[300px] w-[600px] rounded-full ${landingTheme.heroGlow}`} />
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
            <Badge
              variant="outline"
              className={`mb-4 gap-1.5 px-3 py-1 text-xs font-medium ${landingTheme.badge}`}
            >
              <IconCompass className="size-3.5" />
              <span>Curated Template Directory</span>
            </Badge>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Production-Ready Form Templates
            </h1>

            <p className="mt-3.5 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
              Don&apos;t start from a blank canvas. Clone pre-designed conversational templates into your account in 1 click or preview them live in your browser.
            </p>

            {/* Search Input Bar */}
            <div className="mt-8 w-full max-w-md relative">
              <IconSearch className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Search templates by keyword (e.g., Hiring, CSAT, RSVP)..."
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

            {/* Category Filter Pills */}
            <div className="mt-6 flex items-center justify-center flex-wrap gap-2">
              {TEMPLATE_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                      isSelected
                        ? landingTheme.activePill
                        : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Templates Grid Section */}
        <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          ) : filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((tpl) => (
                <div
                  key={tpl.id}
                  className={`group relative flex flex-col justify-between rounded-xl border border-border/60 bg-card/60 backdrop-blur-xs p-5 transition-all duration-200 ${landingTheme.cardBorderHover}`}
                >
                  <div>
                    {/* Header: Category Badge + Views */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <Badge
                        variant="outline"
                        className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 border-border bg-muted/50 text-muted-foreground"
                      >
                        {tpl.category || "General"}
                      </Badge>

                      {typeof tpl.views === "number" && tpl.views > 0 && (
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <IconEye className="size-3.5" />
                          <span>{tpl.views} views</span>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className={`text-base font-semibold text-foreground group-hover:${landingTheme.primaryText} transition-colors line-clamp-1`}>
                      {tpl.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2 min-h-[32px]">
                      {tpl.description || "Conversational multi-field template ready for immediate deployment."}
                    </p>

                    {/* Meta info */}
                    <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground border-t border-border/40 pt-3">
                      <IconHelpCircle className={`size-3.5 ${landingTheme.iconColor}`} />
                      <span>{tpl.fieldsCount ?? 0} conversational questions</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex items-center gap-2 pt-2 border-t border-border/40">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="flex-1 text-xs gap-1.5 h-8.5"
                    >
                      <Link href={`/form/${tpl.slug || tpl.id}`} target="_blank">
                        <IconExternalLink className="size-3.5" />
                        <span>Live Preview</span>
                      </Link>
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleUseTemplate(tpl.id)}
                      disabled={cloningId === tpl.id}
                      className={`flex-1 text-xs gap-1.5 h-8.5 ${landingTheme.primaryButton}`}
                    >
                      <IconSparkles className="size-3.5" />
                      <span>{cloningId === tpl.id ? "Cloning..." : "Use Template"}</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed rounded-2xl bg-card/40 max-w-md mx-auto">
              <IconCompass className="size-10 text-muted-foreground/60 mb-3" />
              <h3 className="text-base font-semibold">No templates found</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                No templates matched your query &quot;{searchQuery}&quot;. Try selecting another category or clear your search.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("ALL");
                }}
                className="mt-4 text-xs gap-1.5"
              >
                <IconX className="size-3.5" />
                Clear Filters
              </Button>
            </div>
          )}

          {/* Psychological Marketing Conversion Box */}
          <div className={`mt-16 rounded-2xl ${landingTheme.ctaBox} p-8 sm:p-10 text-center flex flex-col items-center`}>
            <Badge variant="outline" className={`text-xs px-3 py-1 mb-3 ${landingTheme.ctaBadge}`}>
              ⚡ Build Bespoke In 2 Minutes
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Need a custom form tailored for your specific brand?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl leading-relaxed">
              Don&apos;t limit yourself to pre-made templates. Create conversational forms with 14 question types, custom slugs, password access, and responsive embed snippets.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <Button
                asChild
                size="lg"
                className={`h-11 px-7 text-sm ${landingTheme.primaryButton} gap-2`}
              >
                <Link href="/signup">
                  <span>Create Free Account</span>
                  <IconArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-11 px-6 text-sm">
                <Link href="/pricing">View Pricing Plans</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
