"use client";

import {
  IconEye,
  IconCopy,
  IconLoader2,
  IconClock,
  IconHelpCircle,
  IconSparkles,
} from "@tabler/icons-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "~/components/ui/card";
import { landingTheme } from "~/config/landing-theme";
import { getCategoryMeta } from "./template-preview-sheet";

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

export interface TemplateCardProps {
  template: PublicTemplateItem;
  onPreview: (template: PublicTemplateItem) => void;
  onUseTemplate: (templateId: string) => Promise<void>;
  isCloning: boolean;
}

export function TemplateCard({ template, onPreview, onUseTemplate, isCloning }: TemplateCardProps) {
  const categoryMeta = getCategoryMeta(template.category);
  const CategoryIcon = categoryMeta.icon;
  const questionsCount = template.fieldsCount ?? 0;
  const estMinutes = Math.max(1, Math.round((questionsCount || 4) * 0.4));

  return (
    <Card
      className={`group flex flex-col justify-between rounded-2xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} p-4.5 sm:p-5 transition-all duration-200 relative overflow-hidden shadow-2xs hover:shadow-md`}
    >
      <div>
        {/* Top: Category Badge + Views Count */}
        <CardHeader className="p-0 pb-3">
          <div className="flex items-center justify-between gap-2">
            <Badge
              variant="outline"
              className={`text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 gap-1.5 ${categoryMeta.badgeClass}`}
            >
              <CategoryIcon className="size-3" />
              <span>{categoryMeta.label}</span>
            </Badge>

            {typeof template.views === "number" && template.views > 0 && (
              <div
                className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full border border-border/40"
                title="Total Views"
              >
                <IconEye className="size-3 text-muted-foreground" />
                <span>{template.views}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={() => onPreview(template)}
            className={`text-base font-bold text-foreground mt-2 cursor-pointer transition-colors line-clamp-1 ${landingTheme.linkHover}`}
            title={template.title}
          >
            {template.title}
          </h3>

          {/* Description */}
          <p
            className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2 min-h-[32px]"
            title={template.description || undefined}
          >
            {template.description ||
              "Conversational multi-field template ready for immediate deployment."}
          </p>
        </CardHeader>

        {/* Honest Metric Badges Row */}
        <CardContent className="p-0 pt-2 pb-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5" title="Number of conversational questions">
            <IconHelpCircle className={`size-3.5 ${landingTheme.iconColor}`} />
            <span>{questionsCount} questions</span>
          </div>

          <div className="flex items-center gap-1" title="Estimated time to complete">
            <IconClock className="size-3.5 text-muted-foreground" />
            <span>~{estMinutes} min</span>
          </div>

          <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
            <IconSparkles className="size-3.5" />
            <span>Ready</span>
          </div>
        </CardContent>
      </div>

      {/* Action Buttons: Quick In-App Preview & Direct Clone */}
      <CardFooter className="p-0 pt-3 border-t border-border/40 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPreview(template)}
          className={`flex-1 text-xs gap-1.5 h-8.5 border-border/70 ${landingTheme.buttonOutlineHover} cursor-pointer`}
          title="Preview template questions and fields in-app"
        >
          <IconEye className="size-3.5 text-muted-foreground" />
          <span>Quick Preview</span>
        </Button>

        <Button
          size="sm"
          onClick={() => onUseTemplate(template.id)}
          disabled={isCloning}
          className={`flex-1 text-xs gap-1.5 h-8.5 font-semibold ${landingTheme.primaryButton}`}
          title="Clone template to your workspace"
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
      </CardFooter>
    </Card>
  );
}
