"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "~/hooks/api/auth";
import { useUseTemplate } from "~/hooks/api/form";
import { getSafeErrorMessage } from "~/lib/error";
import {
  TemplateCard as BaseTemplateCard,
  type PublicTemplateItem,
  type TemplateCardProps as BaseTemplateCardProps,
} from "~/components/templates/template-card";
import { TemplatePreviewSheet } from "~/components/templates/template-preview-sheet";

export type { PublicTemplateItem };

export interface TemplateCardProps {
  template: PublicTemplateItem;
  onPreview?: (template: PublicTemplateItem) => void;
  onUseTemplate?: (templateId: string) => Promise<void>;
  isCloning?: boolean;
}

/**
 * Universal TemplateCard component that supports both standalone and managed preview sheet workflows.
 */
export function TemplateCard({ template, onPreview, onUseTemplate, isCloning }: TemplateCardProps) {
  const router = useRouter();
  const { user } = useUser();
  const { useTemplateAsync, isLoading: internalCloning } = useUseTemplate();
  const [localPreviewOpen, setLocalPreviewOpen] = useState(false);

  const effectiveIsCloning = isCloning ?? internalCloning;

  const defaultUseTemplate = async (templateId: string) => {
    if (!user) {
      toast.info("Please sign in to clone this template to your workspace");
      router.push(`/login?redirect=/explore`);
      return;
    }

    try {
      const res = await useTemplateAsync({ formId: templateId });
      toast.success("Template cloned to your forms!");
      router.push(`/forms/${res.id}`);
    } catch (err: unknown) {
      toast.error(getSafeErrorMessage(err, "Failed to use template"));
    }
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview(template);
    } else {
      setLocalPreviewOpen(true);
    }
  };

  const handleUse = onUseTemplate ?? defaultUseTemplate;

  return (
    <>
      <BaseTemplateCard
        template={template}
        onPreview={handlePreview}
        onUseTemplate={handleUse}
        isCloning={effectiveIsCloning}
      />

      {/* Embedded preview sheet if parent didn't manage it */}
      {!onPreview && (
        <TemplatePreviewSheet
          template={template}
          open={localPreviewOpen}
          onOpenChange={setLocalPreviewOpen}
          onUseTemplate={handleUse}
          isCloning={effectiveIsCloning}
        />
      )}
    </>
  );
}
