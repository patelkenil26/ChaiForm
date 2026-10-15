"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconCompass,
  IconArrowRight,
  IconSparkles,
  IconExternalLink,
  IconHelpCircle,
  IconCopy,
  IconLoader2,
  IconEye,
  IconCheck,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { useListPublicForms, useUseTemplate } from "~/hooks/api/form";
import { useUser } from "~/hooks/api/auth";
import { landingTheme } from "~/config/landing-theme";

const LANDING_CATEGORIES = [
  { id: "ALL", label: "All Templates" },
  { id: "SURVEYS", label: "Surveys" },
  { id: "FEEDBACK", label: "Feedback" },
  { id: "EVENTS", label: "Events & RSVPs" },
  { id: "APPLICATIONS", label: "Applications" },
  { id: "QUIZZES", label: "Quizzes" },
];

export function TemplatesSection() {
  const router = useRouter();
  const { user } = useUser();
  const { useTemplateAsync } = useUseTemplate();
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [cloningId, setCloningId] = useState<string | null>(null);

  const { publicForms, isLoading } = useListPublicForms({
    category: selectedCategory === "ALL" ? undefined : selectedCategory,
  });

  const formsList = publicForms ?? [];
  const displayedForms = formsList.slice(0, 6);

  const handleUseTemplate = async (templateId: string) => {
    if (!user) {
      toast.info("Please sign in or create a free account to customize this template", {
        description: "Your session will safely preserve your selected template.",
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
      const msg = err instanceof Error ? err.message : "Failed to use template";
      toast.error(msg);
    } finally {
      setCloningId(null);
    }
  };

  return (
    <section id="templates" className="relative py-20 md:py-28 overflow-hidden border-t border-border/40">
      {/* Background Subtle Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className={`h-[400px] w-[700px] rounded-full ${landingTheme.heroGlow}`} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <Badge
            variant="outline"
            className={`mb-3.5 gap-1.5 px-3 py-1 text-xs font-medium ${landingTheme.badge}`}
          >
            <IconCompass className="size-3.5" />
            <span>Curated Template Gallery</span>
          </Badge>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Jumpstart with Ready-Made Forms
          </h2>

          <p className="mt-3.5 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
            Don&apos;t build from scratch. Clone battle-tested conversational templates directly into your account or test-drive them right now with zero signup.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-7 flex items-center justify-center flex-wrap gap-2">
            {LANDING_CATEGORIES.map((cat) => {
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

        {/* Templates Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        ) : displayedForms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedForms.map((tpl) => (
              <div
                key={tpl.id}
                className={`group relative flex flex-col justify-between rounded-xl border border-border/70 bg-card/70 backdrop-blur-xs p-5 transition-all duration-200 ${landingTheme.cardBorderHover}`}
              >
                <div>
                  {/* Category Badge + Views */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge
                      variant="outline"
                      className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 border-border bg-muted/40 text-muted-foreground"
                    >
                      {tpl.category || "General"}
                    </Badge>

                    {typeof tpl.views === "number" && tpl.views > 0 && (
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <IconEye className="size-3.5" />
                        <span>{tpl.views}</span>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className={`text-base font-semibold text-foreground group-hover:${landingTheme.primaryText} transition-colors line-clamp-1`}>
                    {tpl.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2 min-h-[32px]">
                    {tpl.description || "Conversational multi-field template engineered for high completion."}
                  </p>

                  {/* Metadata info */}
                  <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40 pt-3">
                    <div className="flex items-center gap-1.5">
                      <IconHelpCircle className={`size-3.5 ${landingTheme.iconColor}`} />
                      <span>{tpl.fieldsCount ?? 0} questions</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-500 font-medium">
                      <IconCheck className="size-3" />
                      <span>Ready to deploy</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 flex items-center gap-2 pt-2 border-t border-border/40">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs gap-1.5 h-8.5 hover:border-border"
                    asChild
                  >
                    <Link
                      href={`/form/${tpl.slug || tpl.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconExternalLink className="size-3.5" />
                      <span>Fill Form</span>
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
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center border border-dashed rounded-2xl bg-card/40 max-w-md mx-auto">
            <IconCompass className="size-8 text-muted-foreground mb-3" />
            <h3 className="text-base font-semibold">No templates in this category yet</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Explore other categories or check back soon.
            </p>
          </div>
        )}

        {/* Explore All CTA Bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <Button
            asChild
            size="lg"
            className={`gap-2 ${landingTheme.primaryButton} hover:opacity-95`}
          >
            <Link href="/templates">
              <IconSparkles className="size-4" />
              <span>Explore All {formsList.length}+ Templates in Showcase</span>
              <IconArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
