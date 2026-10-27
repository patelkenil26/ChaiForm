"use client";

import Link from "next/link";
import { PencilIcon, BarChart3Icon, CopyIcon, LinkIcon, GlobeIcon } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { landingTheme } from "~/config/landing-theme";
import { FormMetaBadges } from "./form-meta-badges";
import { FormActionsDropdown } from "./form-actions-dropdown";

export interface FormListItem {
  id: string;
  title: string;
  description?: string | null;
  slug?: string | null;
  isPublished: boolean;
  visibility: "PUBLIC" | "UNLISTED";
  isArchived: boolean;
  closesAt?: Date | string | null;
  responseLimit?: number | null;
  isPasswordProtected?: boolean;
  createdAt?: Date | string | null;
}

interface FormMobileCardProps {
  form: FormListItem;
  isUpdating: boolean;
  onTogglePublish: (formId: string, currentPublished: boolean) => void;
  onVisibilityChange: (formId: string, visibility: "PUBLIC" | "UNLISTED") => void;
  onCopyLink: (slugOrId: string) => void;
  onOpenQr: (form: { title: string; url: string; slug?: string | null }) => void;
  onClone: (formId: string) => void;
  onToggleArchive: (formId: string, isCurrentlyArchived: boolean) => void;
}

export function FormMobileCard({
  form,
  isUpdating,
  onTogglePublish,
  onVisibilityChange,
  onCopyLink,
  onOpenQr,
  onClone,
  onToggleArchive,
}: FormMobileCardProps) {
  const target = form.slug || form.id;

  return (
    <div
      className={`p-4 rounded-xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} transition-all space-y-3 shadow-xs`}
    >
      {/* Title & Status Badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <Link
            href={`/forms/${form.id}`}
            className={`font-semibold text-sm sm:text-base block truncate text-foreground ${landingTheme.linkHover}`}
            title={form.title}
          >
            {form.title}
          </Link>
          {form.description && (
            <p
              className="text-xs text-muted-foreground line-clamp-2 mt-0.5 break-words"
              title={form.description}
            >
              {form.description}
            </p>
          )}
        </div>
        <div className="shrink-0 flex items-center gap-1.5">
          {form.isArchived ? (
            <Badge
              variant="secondary"
              className="bg-muted text-muted-foreground text-[10px] py-0.5 px-2"
            >
              Archived
            </Badge>
          ) : form.isPublished ? (
            <Badge
              variant="default"
              className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 text-[10px] py-0.5 px-2"
            >
              Published
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className={`text-[10px] py-0.5 px-2 ${landingTheme.draftBadge}`}
            >
              Draft
            </Badge>
          )}
        </div>
      </div>

      {/* Metadata badges */}
      <FormMetaBadges
        slug={form.slug}
        closesAt={form.closesAt}
        responseLimit={form.responseLimit}
        isPasswordProtected={form.isPasswordProtected}
      />

      {/* Controls: Publish Switch & Visibility Dropdown */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
        <div className="flex items-center gap-2">
          <Switch
            id={`mobile-switch-${form.id}`}
            checked={form.isPublished}
            disabled={isUpdating || form.isArchived}
            onCheckedChange={() => onTogglePublish(form.id, form.isPublished)}
          />
          <label
            htmlFor={`mobile-switch-${form.id}`}
            className="text-xs text-muted-foreground select-none cursor-pointer"
          >
            {form.isPublished ? "Accepting" : "Paused"}
          </label>
        </div>

        <Select
          value={form.visibility}
          disabled={isUpdating || form.isArchived}
          onValueChange={(val: "PUBLIC" | "UNLISTED") => onVisibilityChange(form.id, val)}
        >
          <SelectTrigger
            className={`h-7 text-xs w-[105px] gap-1 border-border/70 ${landingTheme.inputFocus}`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UNLISTED" className="text-xs">
              <span className="flex items-center gap-1.5">
                <LinkIcon className="size-3 text-muted-foreground" />
                Unlisted
              </span>
            </SelectItem>
            <SelectItem value="PUBLIC" className="text-xs">
              <span className="flex items-center gap-1.5">
                <GlobeIcon className={`size-3 ${landingTheme.iconColor}`} />
                Public
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-center justify-between gap-1 pt-2 border-t border-border/50">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            asChild
            className={`h-7 text-xs px-2.5 gap-1 ${landingTheme.buttonOutlineHover}`}
          >
            <Link href={`/forms/${form.id}`}>
              <PencilIcon className="size-3" />
              <span>Builder</span>
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className={`h-7 text-xs px-2.5 gap-1 ${landingTheme.buttonOutlineHover}`}
          >
            <Link href={`/forms/${form.id}/submissions`}>
              <BarChart3Icon className={`size-3 ${landingTheme.iconColor}`} />
              <span>Answers</span>
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            title="Copy Link"
            onClick={() => onCopyLink(target)}
            className="size-7"
          >
            <CopyIcon className="size-3.5" />
          </Button>

          <FormActionsDropdown
            formId={form.id}
            formTitle={form.title}
            target={target}
            slug={form.slug}
            isArchived={form.isArchived}
            onClone={onClone}
            onOpenQr={onOpenQr}
            onToggleArchive={onToggleArchive}
            triggerClassName="size-7"
            iconClassName="size-3.5"
          />
        </div>
      </div>
    </div>
  );
}
