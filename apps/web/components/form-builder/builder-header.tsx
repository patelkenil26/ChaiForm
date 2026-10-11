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

export interface BuilderFormData {
  id: string;
  title: string;
  description?: string | null;
  slug?: string | null;
  isPublished: boolean;
  visibility: "PUBLIC" | "UNLISTED";
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
  onTogglePublish,
  onSelectVisibility,
}: BuilderHeaderProps) {
  return (
    <>
      {/* Top Bar: Navigation, Title, Status Badges & Action Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/forms">
              <ArrowLeftIcon className="size-4" />
              <span className="sr-only">Back to forms</span>
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                {form?.title || "Form Builder"}
              </h1>
              {form && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {form.isPublished ? (
                    <Badge
                      variant="default"
                      className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs gap-1"
                    >
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Published
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs gap-1"
                    >
                      <span className="size-1.5 rounded-full bg-amber-500" />
                      Draft (Closed)
                    </Badge>
                  )}

                  <Badge variant="outline" className="text-xs text-muted-foreground gap-1">
                    {form.visibility === "PUBLIC" ? (
                      <>
                        <GlobeIcon className="size-3 text-blue-500" />
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
                    <Badge variant="outline" className="text-xs font-mono text-muted-foreground gap-1">
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
                          : "text-muted-foreground"
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
                          ? "border-amber-500 text-amber-600 bg-amber-500/10"
                          : "text-muted-foreground"
                      }`}
                    >
                      <UsersIcon className="size-3" />
                      {form.submissionCount} / {form.responseLimit}
                    </Badge>
                  )}

                  {form.isPasswordProtected && (
                    <Badge
                      variant="outline"
                      className="text-xs gap-1 border-primary/20 bg-primary/5 text-primary"
                    >
                      <LockIcon className="size-3" />
                      Password Protected
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

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/forms/${formId}/submissions`}>
              <BarChart3Icon className="size-3.5 mr-1.5" />
              Submissions
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={onCopyLink}>
            <CopyIcon className="size-3.5 mr-1.5" />
            Share Link
          </Button>
          <Button variant="outline" size="sm" onClick={onOpenQr}>
            <QrCodeIcon className="size-3.5 mr-1.5" />
            QR Code
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={publicPath} target="_blank">
              <ExternalLinkIcon className="size-3.5 mr-1.5" />
              Live Form
            </Link>
          </Button>
          <Button size="sm" onClick={onAddField} className="gap-1.5">
            <PlusIcon className="size-3.5" />
            Add Field
          </Button>
        </div>
      </div>

      {/* Creator Controls Bar: Publishing Status Switch & Visibility Mode Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border bg-card/60 backdrop-blur-sm p-3.5 px-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch
              id="form-publish-switch"
              checked={form?.isPublished ?? true}
              disabled={isUpdatingVisibility || !form}
              onCheckedChange={onTogglePublish}
            />
            <Label
              htmlFor="form-publish-switch"
              className="text-sm font-medium cursor-pointer select-none"
            >
              {form?.isPublished ? "Accepting Responses" : "Responses Paused"}
            </Label>
          </div>
          <span className="text-xs text-muted-foreground hidden md:inline">
            {form?.isPublished
              ? "(Form is published and accepting submissions)"
              : "(Form is closed; visitors will see a closed message)"}
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenLimits}
            className="h-8 text-xs gap-1.5"
          >
            <SlidersHorizontalIcon className="size-3.5 text-muted-foreground" />
            Limits & Expiry
          </Button>

          <Label className="text-xs text-muted-foreground font-normal">Visibility:</Label>
          <Select
            value={form?.visibility ?? "UNLISTED"}
            disabled={isUpdatingVisibility || !form}
            onValueChange={onSelectVisibility}
          >
            <SelectTrigger className="h-8 text-xs w-[130px] gap-1.5">
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
    </>
  );
}
