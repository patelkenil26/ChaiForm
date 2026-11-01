"use client";

import Link from "next/link";
import {
  IconArrowLeft,
  IconExternalLink,
  IconCopy,
  IconChartBar,
  IconWorld,
  IconLink,
  IconPlus,
  IconClock,
  IconUsers,
  IconLock,
  IconAdjustmentsHorizontal,
  IconArchive,
  IconEye,
  IconCode,
  IconDots,
  IconPalette,
} from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { landingTheme } from "~/config/landing-theme";

export interface BuilderFormData {
  id: string;
  title: string;
  description?: string | null;
  slug?: string | null;
  isPublished: boolean;
  visibility: "PUBLIC" | "UNLISTED";
  isArchived?: boolean;
  closesAt?: Date | string | null;
  isExpired?: boolean;
  responseLimit?: number | null;
  submissionCount: number;
  isLimitReached?: boolean;
  isPasswordProtected?: boolean;
  submitButtonText?: string | null;
  thankYouTitle?: string | null;
  thankYouDescription?: string | null;
  thankYouButtonText?: string | null;
  thankYouButtonUrl?: string | null;
  autoRedirectUrl?: string | null;
  showWelcomeScreen?: boolean;
  welcomeTitle?: string | null;
  welcomeDescription?: string | null;
  welcomeButtonText?: string | null;
  estimatedTime?: string | null;
  themePreset?: string | null;
  customBgColor?: string | null;
  customTextColor?: string | null;
  customAccentColor?: string | null;
}

interface BuilderHeaderProps {
  form: BuilderFormData | null | undefined;
  formId: string;
  publicPath: string;
  isUpdatingVisibility: boolean;
  onCopyLink: () => void;
  onOpenQr: () => void;
  onOpenLimits: () => void;
  onOpenTheme?: () => void;
  onAddField: () => void;
  onOpenPreview: () => void;
  onTogglePublish: (checked: boolean) => void;
  onSelectVisibility: (visibility: "PUBLIC" | "UNLISTED") => void;
}

export function BuilderHeader({
  form,
  formId,
  publicPath,
  isUpdatingVisibility,
  onCopyLink,
  onOpenQr,
  onOpenLimits,
  onOpenTheme,
  onAddField,
  onOpenPreview,
  onTogglePublish,
  onSelectVisibility,
}: BuilderHeaderProps) {
  return (
    <>
      {/* Top Bar: Navigation, Title, Status Badges & Action Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" asChild className={landingTheme.buttonGhostHover}>
            <Link href="/forms">
              <IconArrowLeft className="size-4" />
              <span className="sr-only">Back to forms</span>
            </Link>
          </Button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1
                className="text-xl md:text-2xl font-bold tracking-tight max-w-[240px] sm:max-w-md truncate block"
                title={form?.title || "Form Builder"}
              >
                {form?.title ? (
                  <span className={landingTheme.gradientText}>{form.title}</span>
                ) : (
                  "Form Builder"
                )}
              </h1>
              {form && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {form.isPublished ? (
                    <Badge
                      variant="default"
                      className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-xs gap-1 font-medium"
                    >
                      <span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                      Published
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 text-xs gap-1 font-medium"
                    >
                      <span className="size-1.5 rounded-full bg-amber-500 dark:bg-amber-400" />
                      Draft (Closed)
                    </Badge>
                  )}

                  <Badge
                    variant="outline"
                    className="text-xs text-muted-foreground gap-1 border-border/70"
                  >
                    {form.visibility === "PUBLIC" ? (
                      <>
                        <IconWorld className="size-3 text-blue-500" />
                        Public
                      </>
                    ) : (
                      <>
                        <IconLink className="size-3 text-muted-foreground" />
                        Unlisted
                      </>
                    )}
                  </Badge>

                  {form.slug && (
                    <Badge
                      variant="outline"
                      className="text-xs font-mono border-lime-500/30 bg-lime-500/10 dark:bg-[#ccff00]/10 text-lime-700 dark:text-[#ccff00] gap-1"
                    >
                      <IconLink className="size-3" />
                      /form/{form.slug}
                    </Badge>
                  )}

                  {form.closesAt && (
                    <Badge
                      variant="outline"
                      className={`text-xs gap-1 ${
                        form.isExpired
                          ? "border-destructive text-destructive bg-destructive/10"
                          : "text-muted-foreground border-border/70"
                      }`}
                    >
                      <IconClock className="size-3" />
                      {form.isExpired
                        ? "Expired"
                        : `Closes: ${new Date(form.closesAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                          })}`}
                    </Badge>
                  )}

                  {form.responseLimit && (
                    <Badge
                      variant="outline"
                      className={`text-xs gap-1 ${
                        form.isLimitReached
                          ? "border-amber-500/40 text-amber-700 dark:text-amber-400 bg-amber-500/10"
                          : "text-muted-foreground border-border/70"
                      }`}
                    >
                      <IconUsers className="size-3" />
                      {form.submissionCount} / {form.responseLimit}
                    </Badge>
                  )}

                  {form.isPasswordProtected && (
                    <Badge
                      variant="outline"
                      className="text-xs font-mono border-lime-500/30 bg-lime-500/10 dark:bg-[#ccff00]/10 text-lime-700 dark:text-[#ccff00] gap-1"
                    >
                      <IconLock className="size-3" />
                      Protected
                    </Badge>
                  )}

                  {form.isArchived && (
                    <Badge variant="outline" className="text-xs border-border/70 gap-1">
                      <IconArchive className="size-3" />
                      Archived
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5 truncate max-w-xl">
              {form?.description || "Design fields and questions for this form"}
            </p>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Desktop Full Action Buttons (lg:flex) */}
          <div className="hidden lg:flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className={`h-8 text-xs px-2.5 ${landingTheme.buttonOutlineHover}`}
              title="Submissions"
            >
              <Link href={`/forms/${formId}/submissions`}>
                <IconChartBar className={`size-3.5 mr-1.5 ${landingTheme.iconColor}`} />
                <span>Submissions</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onCopyLink}
              className={`h-8 text-xs px-2.5 ${landingTheme.buttonOutlineHover}`}
              title="Share Link"
            >
              <IconCopy className="size-3.5 mr-1.5" />
              <span>Share Link</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenQr}
              className={`h-8 text-xs px-2.5 ${landingTheme.buttonOutlineHover}`}
              title="Website Embed & QR Code"
            >
              <IconCode className="size-3.5 mr-1.5" />
              <span>Embed & QR</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className={`h-8 text-xs px-2.5 ${landingTheme.buttonOutlineHover}`}
              title="Live Form"
            >
              <Link href={publicPath} target="_blank">
                <IconExternalLink className="size-3.5 mr-1.5" />
                <span>Live Form</span>
              </Link>
            </Button>
          </div>

          {/* Mobile / Tablet Consolidated Dropdown (< lg) */}
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs px-2.5 gap-1.5 cursor-pointer"
                  title="Share & More Actions"
                >
                  <IconDots className="size-4" />
                  <span className="hidden xs:inline">Share & More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 bg-card border-border/80 shadow-lg">
                <DropdownMenuItem asChild className="cursor-pointer gap-2 text-xs">
                  <Link href={publicPath} target="_blank">
                    <IconExternalLink className="size-3.5 text-muted-foreground" />
                    <span>Open Live Form</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onCopyLink} className="cursor-pointer gap-2 text-xs">
                  <IconCopy className="size-3.5 text-muted-foreground" />
                  <span>Copy Public Link</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onOpenQr} className="cursor-pointer gap-2 text-xs">
                  <IconCode className="size-3.5 text-muted-foreground" />
                  <span>Embed Code & QR</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer gap-2 text-xs">
                  <Link href={`/forms/${formId}/submissions`}>
                    <IconChartBar className="size-3.5 text-lime-600 dark:text-[#ccff00]" />
                    <span>View Submissions</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Always Visible Primary Actions: Preview & Add Field */}
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenPreview}
            title="Preview Form"
            className={`h-8 text-xs px-2.5 sm:px-3 gap-1.5 ${landingTheme.buttonOutlineHover} shadow-2xs font-medium cursor-pointer`}
          >
            <IconEye className={`size-3.5 ${landingTheme.iconColor}`} />
            <span>Preview</span>
          </Button>

          <Button
            size="sm"
            onClick={onAddField}
            className={`h-8 text-xs gap-1.5 ${landingTheme.primaryButton}`}
          >
            <IconPlus className="size-3.5" />
            <span>Add Field</span>
          </Button>
        </div>
      </div>

      {/* Creator Controls Bar: Publishing Status Switch & Settings & Access */}
      <div
        className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 rounded-xl border border-border/75 ${landingTheme.cardBg} backdrop-blur-sm p-3.5 px-4 shadow-xs`}
      >
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <div className="flex items-center gap-2">
            <Switch
              id="form-publish-switch"
              checked={form?.isPublished ?? true}
              disabled={isUpdatingVisibility || !form}
              onCheckedChange={onTogglePublish}
            />
            <Label
              htmlFor="form-publish-switch"
              className="text-xs sm:text-sm font-medium cursor-pointer select-none"
            >
              {form?.isPublished ? "Accepting Responses" : "Responses Paused"}
            </Label>
          </div>
          <span className="text-xs text-muted-foreground hidden lg:inline">
            {form?.isPublished
              ? "(Form is published and accepting submissions)"
              : "(Form is closed; visitors will see a closed message)"}
          </span>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenTheme}
            className="h-8 text-xs gap-1.5 cursor-pointer hover:border-lime-500/40 dark:hover:border-[#ccff00]/40 transition-colors"
            title="Choose curated gradient themes, background colors, and button accents"
          >
            <IconPalette className="size-3.5 text-lime-600 dark:text-[#ccff00]" />
            <span>Design & Theme</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onOpenLimits}
            className="h-8 text-xs gap-1.5 cursor-pointer hover:border-lime-500/40 dark:hover:border-[#ccff00]/40 transition-colors"
            title="Configure Custom Slug, Password Protection, Limits & Expiry"
          >
            <IconAdjustmentsHorizontal className="size-3.5 text-lime-600 dark:text-[#ccff00]" />
            <span>Settings & Access</span>
          </Button>

          <div className="flex items-center gap-1.5">
            <Label className="text-xs text-muted-foreground font-normal hidden xs:inline">
              Visibility:
            </Label>
            <Select
              value={form?.visibility ?? "UNLISTED"}
              disabled={isUpdatingVisibility || !form}
              onValueChange={onSelectVisibility}
            >
              <SelectTrigger className="h-8 text-xs w-[115px] sm:w-[130px] gap-1.5">
                <SelectValue placeholder="Visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UNLISTED" className="text-xs">
                  <span className="flex items-center gap-1.5">
                    <IconLink className="size-3 text-muted-foreground" />
                    Unlisted
                  </span>
                </SelectItem>
                <SelectItem value="PUBLIC" className="text-xs">
                  <span className="flex items-center gap-1.5">
                    <IconWorld className="size-3 text-blue-500" />
                    Public
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </>
  );
}
