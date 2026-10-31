"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  IconExternalLink,
  IconCopy,
  IconEye,
  IconClock,
  IconHelpCircle,
  IconShieldCheck,
  IconLoader2,
  IconCheck,
  IconSparkles,
  IconForms,
  IconChartBar,
  IconMessageDots,
  IconCalendarEvent,
  IconBriefcase,
  IconBrain,
} from "@tabler/icons-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "~/components/ui/sheet";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { useGetFields } from "~/hooks/api/form-field";
import { landingTheme } from "~/config/landing-theme";
import type { PublicTemplateItem } from "./template-card";

export interface TemplatePreviewSheetProps {
  template: PublicTemplateItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUseTemplate: (templateId: string) => Promise<void>;
  isCloning: boolean;
}

export function getCategoryMeta(category?: string | null) {
  const cat = category?.toUpperCase() || "GENERAL";
  switch (cat) {
    case "SURVEYS":
      return {
        label: "Survey & NPS",
        icon: IconChartBar,
        badgeClass: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/25",
      };
    case "FEEDBACK":
      return {
        label: "Product Feedback",
        icon: IconMessageDots,
        badgeClass:
          "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
      };
    case "EVENTS":
      return {
        label: "Event & RSVP",
        icon: IconCalendarEvent,
        badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25",
      };
    case "APPLICATIONS":
      return {
        label: "Job Application",
        icon: IconBriefcase,
        badgeClass: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/25",
      };
    case "QUIZZES":
      return {
        label: "Knowledge Quiz",
        icon: IconBrain,
        badgeClass: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25",
      };
    default:
      return {
        label: "General Form",
        icon: IconForms,
        badgeClass: "bg-muted text-muted-foreground border-border/70",
      };
  }
}

export function TemplatePreviewSheet({
  template,
  open,
  onOpenChange,
  onUseTemplate,
  isCloning,
}: TemplatePreviewSheetProps) {
  const formId = template?.id || "";
  const { fields, isLoading: isFieldsLoading } = useGetFields(formId);

  const sortedFields = useMemo(() => {
    if (!fields) return [];
    return [...fields].sort((a, b) => parseFloat(a.index) - parseFloat(b.index));
  }, [fields]);

  if (!template) return null;

  const categoryMeta = getCategoryMeta(template.category);
  const CategoryIcon = categoryMeta.icon;
  const questionsCount = sortedFields.length || template.fieldsCount || 0;
  const estMinutes = Math.max(1, Math.round(questionsCount * 0.4));
  const publicSlugOrId = template.slug || template.id;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 flex flex-col bg-background border-l border-border/80 shadow-2xl"
      >
        {/* Top Header */}
        <SheetHeader className="p-4 sm:p-6 border-b border-border/60 bg-muted/20 text-left space-y-3">
          <div className="flex items-center justify-between gap-2">
            <Badge
              variant="outline"
              className={`text-[11px] font-semibold gap-1.5 px-2.5 py-0.5 ${categoryMeta.badgeClass}`}
            >
              <CategoryIcon className="size-3.5" />
              <span>{categoryMeta.label}</span>
            </Badge>

            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              {typeof template.views === "number" && template.views > 0 && (
                <span className="flex items-center gap-1">
                  <IconEye className="size-3.5" />
                  <span>{template.views} views</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                <IconShieldCheck className="size-3.5" />
                <span>Verified</span>
              </span>
            </div>
          </div>

          <div>
            <SheetTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
              {template.title}
            </SheetTitle>
            <SheetDescription className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
              {template.description ||
                "A clean, conversational multi-step form template ready to deploy and customize."}
            </SheetDescription>
          </div>

          {/* Key Attributes Bar */}
          <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-background border border-border/60 text-xs">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                Questions
              </span>
              <span className="font-bold text-foreground mt-0.5 flex items-center gap-1">
                <IconHelpCircle className="size-3.5 text-muted-foreground" />
                <span>{questionsCount} steps</span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                Est. Duration
              </span>
              <span className="font-bold text-foreground mt-0.5 flex items-center gap-1">
                <IconClock className="size-3.5 text-muted-foreground" />
                <span>~{estMinutes} min</span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                Type
              </span>
              <span className="font-bold text-foreground mt-0.5 flex items-center gap-1">
                <IconSparkles className={`size-3.5 ${landingTheme.iconColor}`} />
                <span>Conversational</span>
              </span>
            </div>
          </div>
        </SheetHeader>

        {/* Scrollable Questions List Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
          <div className="flex items-center justify-between pb-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Questions Walkthrough ({questionsCount})
            </h4>
            <span className="text-[11px] text-muted-foreground">
              Presented 1-question at a time to respondents
            </span>
          </div>

          {isFieldsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-border/50 bg-card space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-8 w-full rounded-lg" />
                </div>
              ))}
            </div>
          ) : sortedFields.length === 0 ? (
            <div className="p-8 text-center rounded-xl border border-dashed border-border/60 bg-muted/10">
              <IconForms className="size-8 mx-auto text-muted-foreground/60 mb-2" />
              <p className="text-xs text-muted-foreground">
                This template includes standard conversational fields that you can edit after
                cloning.
              </p>
            </div>
          ) : (
            sortedFields.map((field, idx) => (
              <div
                key={field.id}
                className="rounded-xl border border-border/60 bg-card p-3.5 sm:p-4 space-y-2.5 hover:border-border transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-[10px] font-bold text-foreground">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-foreground block leading-snug">
                        {field.label}
                        {field.isRequired && (
                          <span className="text-rose-400 ml-1" title="Required field">
                            *
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase font-mono px-1.5 py-0 bg-muted/40 text-muted-foreground border-border/60 shrink-0"
                  >
                    {field.type}
                  </Badge>
                </div>

                {/* Input Simulation */}
                <div className="pl-7">
                  {field.type === "RADIO" ||
                  field.type === "CHECKBOX" ||
                  field.type === "SELECT" ? (
                    <div className="flex flex-wrap gap-1.5">
                      {["Option A", "Option B", "Option C"].map((opt) => (
                        <span
                          key={opt}
                          className="text-[11px] px-2.5 py-1 rounded-md border border-border/60 bg-muted/30 text-muted-foreground font-medium"
                        >
                          {opt}
                        </span>
                      ))}
                    </div>
                  ) : field.type === "YES_NO" ? (
                    <div className="flex gap-2">
                      <span className="text-[11px] px-3 py-1 rounded-md border border-border/60 bg-muted/30 text-muted-foreground font-medium">
                        Yes
                      </span>
                      <span className="text-[11px] px-3 py-1 rounded-md border border-border/60 bg-muted/30 text-muted-foreground font-medium">
                        No
                      </span>
                    </div>
                  ) : field.type === "TEXTAREA" ? (
                    <div className="h-14 rounded-lg border border-border/50 bg-muted/20 p-2 text-xs text-muted-foreground/60 select-none">
                      <span>Longer descriptive response here...</span>
                    </div>
                  ) : (
                    <div className="h-8 rounded-lg border border-border/50 bg-muted/20 px-3 flex items-center text-xs text-muted-foreground/60 select-none">
                      <span>Respondent types answer here...</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {/* Non-AI Craft Assurance */}
          <div className="rounded-xl border border-border/50 bg-muted/20 p-3 text-[11px] text-muted-foreground flex items-center gap-2">
            <IconCheck className="size-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span>
              100% customizable in ChaiForm visual builder — modify questions, add logic, re-order
              steps, and connect webhook telemetry.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border/60 bg-muted/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="text-xs h-9 gap-1.5 border-border/70"
          >
            <Link
              href={`/form/${publicSlugOrId}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Test interactive form runner in a new tab"
            >
              <IconExternalLink className="size-3.5" />
              <span>Open Live Runner</span>
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs h-9 px-3"
            >
              Close
            </Button>

            <Button
              size="sm"
              onClick={() => onUseTemplate(template.id)}
              disabled={isCloning}
              className={`text-xs h-9 gap-1.5 font-semibold px-4 ${landingTheme.primaryButton}`}
            >
              {isCloning ? (
                <>
                  <IconLoader2 className="size-3.5 animate-spin" />
                  <span>Cloning to Workspace...</span>
                </>
              ) : (
                <>
                  <IconCopy className="size-3.5" />
                  <span>Use This Template</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
