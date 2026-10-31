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
import { landingTheme } from "~/config/landing-theme";
import { getSafeErrorMessage } from "~/lib/error";

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
  badgeClass: "bg-muted text-muted-foreground border-border/60",
  accentBorder: landingTheme.cardBorderHover,
};

const CATEGORY_STYLES: Record<string, { label: string; badgeClass: string; accentBorder: string }> =
  {
    SURVEYS: {
      label: "Surveys",
      badgeClass: "bg-muted/80 text-muted-foreground border-border/70",
      accentBorder: landingTheme.cardBorderHover,
    },
    FEEDBACK: {
      label: "Feedback",
      badgeClass: "bg-muted/80 text-muted-foreground border-border/70",
      accentBorder: landingTheme.cardBorderHover,
    },
    QUIZZES: {
      label: "Quizzes",
      badgeClass: "bg-muted/80 text-muted-foreground border-border/70",
      accentBorder: landingTheme.cardBorderHover,
    },
    EVENTS: {
      label: "Event Registration",
      badgeClass: "bg-muted/80 text-muted-foreground border-border/70",
      accentBorder: landingTheme.cardBorderHover,
    },
    APPLICATIONS: {
      label: "Job Applications",
      badgeClass: "bg-muted/80 text-muted-foreground border-border/70",
      accentBorder: landingTheme.cardBorderHover,
    },
    GENERAL: DEFAULT_CATEGORY,
  };

function getQuestionMix(category: string): string[] {
  switch (category?.toUpperCase()) {
    case "SURVEYS":
      return ["Rating ×1", "Choice ×3", "Text ×2"];
    case "FEEDBACK":
      return ["Rating ×1", "Long Text ×2", "Choice ×1"];
    case "QUIZZES":
      return ["Choice ×4", "Multi ×2", "Score ×1"];
    case "EVENTS":
      return ["Email ×1", "Phone ×1", "Date ×1"];
    case "APPLICATIONS":
      return ["Email ×1", "Long Text ×2", "URL ×1"];
    default:
      return ["Email ×1", "Short Text ×2", "Choice ×1"];
  }
}

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
      toast.error(getSafeErrorMessage(err, "Failed to use template"));
    }
  };

  return (
    <div
      className={`group flex flex-col justify-between rounded-xl border ${landingTheme.cardBg} p-5 transition-all duration-200 ${landingTheme.cardBorderHover} ${categoryConfig.accentBorder}`}
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
            <div
              className="flex items-center gap-1 text-[11px] text-muted-foreground"
              title="Total Views"
            >
              <IconEye className="size-3.5" />
              <span>{template.views}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3
          className={`text-base font-semibold text-foreground ${landingTheme.linkHover} line-clamp-1`}
        >
          {template.title}
        </h3>

        {/* Description */}
        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2 min-h-[32px]">
          {template.description ||
            "Pre-built production-ready form template with conversational fields."}
        </p>

        {/* Question Type Mix Preview Chips */}
        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
          {getQuestionMix(template.category).map((chip, i) => (
            <span
              key={i}
              className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded-md bg-muted/60 text-muted-foreground border border-border/40 font-mono"
            >
              {chip}
            </span>
          ))}
        </div>

        {/* Metadata Pill Row */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground border-t border-border/40 pt-2.5">
          <div className="flex items-center gap-1">
            <IconHelpCircle className={`size-3.5 ${landingTheme.iconColor}`} />
            <span>{template.fieldsCount ?? 0} Questions</span>
          </div>

          <div className="flex items-center gap-1">
            <IconSparkles className={`size-3.5 ${landingTheme.iconColor}`} />
            <span>Ready to use</span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Fill Form & Use Template */}
      <div className="mt-5 flex items-center gap-2 pt-1 border-t border-border/40">
        <Button
          variant="outline"
          size="sm"
          className={`flex-1 text-xs gap-1.5 h-8.5 ${landingTheme.buttonOutlineHover}`}
          asChild
        >
          <Link href={targetUrl} target="_blank" rel="noopener noreferrer">
            <IconExternalLink className="size-3.5" />
            <span>Fill Form</span>
          </Link>
        </Button>

        <Button
          size="sm"
          className={`flex-1 text-xs gap-1.5 h-8.5 ${landingTheme.primaryButton}`}
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
