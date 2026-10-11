"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconExternalLink,
  IconCopy,
  IconHelpCircle,
  IconEye,
  IconLoader2,
  IconSparkles,
  IconCalendar,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { useUser } from "~/hooks/api/auth";
import { useUseTemplate } from "~/hooks/api/form";

export interface PublicTemplateItem {
  id: string;
  title: string;
  description?: string | null;
  slug?: string | null;
  category: string;
  views?: number;
  fieldsCount?: number;
  createdAt?: string | Date | null;
}

interface TemplateCardProps {
  template: PublicTemplateItem;
}

const DEFAULT_CATEGORY = {
  label: "General Form",
  badgeClass: "bg-muted text-muted-foreground border-border",
  accentBorder: "group-hover:border-primary/40",
};

const CATEGORY_STYLES: Record<
  string,
  { label: string; badgeClass: string; accentBorder: string }
> = {
  SURVEYS: {
    label: "Surveys",
    badgeClass: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    accentBorder: "group-hover:border-blue-500/40",
  },
  FEEDBACK: {
    label: "Feedback",
    badgeClass: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    accentBorder: "group-hover:border-purple-500/40",
  },
  QUIZZES: {
    label: "Quizzes",
    badgeClass: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    accentBorder: "group-hover:border-amber-500/40",
  },
  EVENTS: {
    label: "Event Registration",
    badgeClass: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    accentBorder: "group-hover:border-emerald-500/40",
  },
  APPLICATIONS: {
    label: "Job Applications",
    badgeClass: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    accentBorder: "group-hover:border-rose-500/40",
  },
  GENERAL: DEFAULT_CATEGORY,
};

export function TemplateCard({ template }: TemplateCardProps) {
  const router = useRouter();
  const { user } = useUser();
  const { useTemplateAsync, isLoading: isCloning } = useUseTemplate();

  const categoryConfig =
    CATEGORY_STYLES[template.category?.toUpperCase() || ""] ?? DEFAULT_CATEGORY;

  const targetUrl = `/form/${template.slug || template.id}`;

  const handleUseTemplate = async () => {
    if (!user) {
      toast.info("Please sign in to clone this template to your workspace");
      router.push(`/login?redirect=/explore`);
      return;
    }

    try {
      const res = await useTemplateAsync({ formId: template.id });
      toast.success("Template cloned to your forms!");
      router.push(`/forms/${res.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to use template";
      toast.error(msg);
    }
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-xl border border-border/70 bg-card p-5 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 ${categoryConfig.accentBorder}`}
    >
      <div>
        {/* Header: Category Badge + Views */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge
            variant="outline"
            className={`text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 ${categoryConfig.badgeClass}`}
          >
            {categoryConfig.label}
          </Badge>

          {typeof template.views === "number" && template.views > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground" title="Total Views">
              <IconEye className="size-3.5" />
              <span>{template.views}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {template.title}
        </h3>

        {/* Description */}
        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2 min-h-[32px]">
          {template.description || "Pre-built production-ready form template with conversational fields."}
        </p>

        {/* Metadata Pill Row */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground border-t border-border/40 pt-3">
          <div className="flex items-center gap-1">
            <IconHelpCircle className="size-3.5 text-primary" />
            <span>{template.fieldsCount ?? 0} Questions</span>
          </div>

          <div className="flex items-center gap-1">
            <IconSparkles className="size-3.5 text-amber-500" />
            <span>Ready to use</span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Fill Form & Use Template */}
      <div className="mt-5 flex items-center gap-2 pt-1 border-t border-border/40">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs gap-1.5 h-8.5"
          asChild
        >
          <Link href={targetUrl} target="_blank" rel="noopener noreferrer">
            <IconExternalLink className="size-3.5" />
            <span>Fill Form</span>
          </Link>
        </Button>

        <Button
          variant="default"
          size="sm"
          className="flex-1 text-xs gap-1.5 h-8.5 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handleUseTemplate}
          disabled={isCloning}
        >
          {isCloning ? (
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
  );
}
