"use client";

import Link from "next/link";
import {
  ArrowLeftIcon,
  ExternalLinkIcon,
  CopyIcon,
  BarChart3Icon,
  GlobeIcon,
  LinkIcon,
  PlusIcon,
  ClockIcon,
  UsersIcon,
  QrCodeIcon,
  LockIcon,
  SlidersHorizontalIcon,
  ArchiveIcon,
  EyeIcon,
  CodeIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
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
}

interface BuilderHeaderProps {
  form: BuilderFormData | null | undefined;
  formId: string;
  publicPath: string;
  isUpdatingVisibility: boolean;
  onCopyLink: () => void;
  onOpenQr: () => void;
  onOpenLimits: () => void;
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
  onAddField,
  onOpenPreview,
  onTogglePublish,
  onSelectVisibility,
}: BuilderHeaderProps) {
  return (
    <>
      {/* Top Bar: Navigation, Title, Status Badges & Action Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className={landingTheme.buttonGhostHover}>
            <Link href="/forms">
              <ArrowLeftIcon className="size-4" />
              <span className="sr-only">Back to forms</span>
            </Link>
          </Button>
          <div>
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
                      className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs gap-1"
                    >
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Published
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className={`${landingTheme.draftBadge} gap-1`}>
                      <span className="size-1.5 rounded-full bg-amber-400" />
                      Draft (Closed)
                    </Badge>
                  )}

                  <Badge
                    variant="outline"
                    className="text-xs text-muted-foreground gap-1 border-border/70"
                  >
                    {form.visibility === "PUBLIC" ? (
                      <>
                        <GlobeIcon className="size-3 text-blue-400" />
                        Public
                      </>
                    ) : (
                      <>
                        <LinkIcon className="size-3 text-muted-foreground" />
                        Unlisted
                      </>
                    )}
                  </Badge>

                  {form.slug && (
                    <Badge variant="outline" className={`${landingTheme.slugBadge} gap-1`}>
                      <LinkIcon className="size-3" />
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
                      <ClockIcon className="size-3" />
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
                          ? `${landingTheme.callout.border} ${landingTheme.callout.accent} ${landingTheme.callout.bg}`
                          : "text-muted-foreground border-border/70"
                      }`}
                    >
                      <UsersIcon className="size-3" />
                      {form.submissionCount} / {form.responseLimit}
                    </Badge>
                  )}

                  {form.isPasswordProtected && (
                    <Badge variant="outline" className={`${landingTheme.slugBadge} gap-1`}>
                      <LockIcon className="size-3" />
                      Password Protected
                    </Badge>
                  )}

                  {form.isArchived && (
                    <Badge variant="outline" className={`${landingTheme.slugBadge} gap-1`}>
                      <ArchiveIcon className="size-3" />
                      Archived
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              {form?.description || "Design fields and questions for this form"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            asChild
            className={`h-8 sm:h-9 text-xs px-2.5 sm:px-3 ${landingTheme.buttonOutlineHover}`}
            title="Submissions"
          >
            <Link href={`/forms/${formId}/submissions`}>
              <BarChart3Icon className={`size-3.5 sm:mr-1.5 ${landingTheme.iconColor}`} />
              <span className="hidden sm:inline">Submissions</span>
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onCopyLink}
            className={`h-8 sm:h-9 text-xs px-2.5 sm:px-3 ${landingTheme.buttonOutlineHover}`}
            title="Share Link"
          >
            <CopyIcon className="size-3.5 sm:mr-1.5" />
            <span className="hidden sm:inline">Share Link</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenQr}
            className={`h-8 sm:h-9 text-xs px-2.5 sm:px-3 ${landingTheme.buttonOutlineHover}`}
            title="Website Embed & QR Code"
          >
            <CodeIcon className="size-3.5 sm:mr-1.5" />
            <span className="hidden sm:inline">Embed & QR</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenPreview}
            title="Preview Form"
            className={`h-8 sm:h-9 text-xs px-2.5 sm:px-3 gap-1.5 ${landingTheme.buttonOutlineHover} shadow-2xs font-medium`}
          >
            <EyeIcon className={`size-3.5 ${landingTheme.iconColor}`} />
            <span className="hidden sm:inline">Preview</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className={`h-8 sm:h-9 text-xs px-2.5 sm:px-3 ${landingTheme.buttonOutlineHover}`}
            title="Live Form"
          >
            <Link href={publicPath} target="_blank">
              <ExternalLinkIcon className="size-3.5 sm:mr-1.5" />
              <span className="hidden sm:inline">Live Form</span>
            </Link>
          </Button>
          <Button
            size="sm"
            onClick={onAddField}
            className={`h-8 sm:h-9 text-xs gap-1.5 ${landingTheme.primaryButton}`}
          >
            <PlusIcon className="size-3.5" />
            <span>Add Field</span>
          </Button>
        </div>
      </div>

      {/* Creator Controls Bar: Publishing Status Switch & Visibility Mode Selector */}
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
            onClick={onOpenLimits}
            className="h-8 text-xs gap-1.5"
          >
            <SlidersHorizontalIcon className="size-3.5 text-muted-foreground" />
            <span>Limits & Expiry</span>
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
                    <LinkIcon className="size-3 text-muted-foreground" />
                    Unlisted
                  </span>
                </SelectItem>
                <SelectItem value="PUBLIC" className="text-xs">
                  <span className="flex items-center gap-1.5">
                    <GlobeIcon className="size-3 text-blue-500" />
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
