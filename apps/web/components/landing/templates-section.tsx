"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconCompass,
  IconArrowRight,
  IconSparkles,
} from "@tabler/icons-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import {
  TemplateCard,
  type PublicTemplateItem,
} from "~/components/explore/template-card";
import { useListPublicForms } from "~/hooks/api/form";

const LANDING_CATEGORIES = [
  { id: "ALL", label: "All Templates" },
  { id: "SURVEYS", label: "Surveys" },
  { id: "FEEDBACK", label: "Feedback" },
  { id: "EVENTS", label: "Events" },
  { id: "APPLICATIONS", label: "Job Applications" },
  { id: "QUIZZES", label: "Quizzes" },
];

export function TemplatesSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const { publicForms, isLoading } = useListPublicForms({
    category: selectedCategory === "ALL" ? undefined : selectedCategory,
  });

  const formsList = (publicForms as PublicTemplateItem[] | undefined) ?? [];
  // Show up to 6 on the landing page
  const displayedForms = formsList.slice(0, 6);

  return (
    <section id="templates" className="relative py-20 md:py-28 overflow-hidden">
      {/* Background Subtle Gradient & Grid Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[400px] w-[700px] rounded-full bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/5 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <Badge
            variant="outline"
            className="mb-3.5 gap-1.5 px-3 py-1 text-xs font-medium border-primary/30 bg-primary/5 text-primary"
          >
            <IconCompass className="size-3.5" />
            <span>Curated Template Gallery</span>
          </Badge>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Jumpstart with Ready-Made Forms
          </h2>

          <p className="mt-3.5 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
            Don&apos;t start from a blank canvas. Clone battle-tested conversational templates directly into your account or test-drive them right now.
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
                      ? "bg-primary text-primary-foreground shadow-xs font-semibold scale-105"
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
              <TemplateCard key={tpl.id} template={tpl} />
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
            className="gap-2 bg-gradient-to-r from-indigo-600 via-primary to-purple-600 text-white shadow-md shadow-primary/25 hover:opacity-95"
          >
            <Link href="/explore">
              <IconSparkles className="size-4" />
              <span>Explore All {formsList.length}+ Templates in Gallery</span>
              <IconArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
