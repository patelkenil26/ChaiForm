"use client";

import Link from "next/link";
import {
  PencilIcon,
  BarChart3Icon,
  CopyIcon,
  GlobeIcon,
  LinkIcon,
  ArchiveIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Switch } from "~/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Skeleton } from "~/components/ui/skeleton";
import { landingTheme } from "~/config/landing-theme";
import { formatRelativeTime } from "~/lib/date-utils";
import { FormMetaBadges } from "./form-meta-badges";
import { FormActionsDropdown } from "./form-actions-dropdown";
import { FormMobileCard, type FormListItem } from "./form-mobile-card";

export type { FormListItem };

interface FormsTableProps {
  forms: FormListItem[] | undefined;
  isLoading: boolean;
  updatingId: string | null;
  onTogglePublish: (formId: string, currentPublished: boolean) => void;
  onVisibilityChange: (formId: string, visibility: "PUBLIC" | "UNLISTED") => void;
  onCopyLink: (slugOrId: string) => void;
  onOpenQr: (form: { title: string; url: string; slug?: string | null }) => void;
  onClone: (formId: string) => void;
  onToggleArchive: (formId: string, isCurrentlyArchived: boolean) => void;
  emptyMessage?: string;
}

export function FormsTable({
  forms,
  isLoading,
  updatingId,
  onTogglePublish,
  onVisibilityChange,
  onCopyLink,
  onOpenQr,
  onClone,
  onToggleArchive,
  emptyMessage = 'No forms yet. Click "Create Form" to start building.',
}: FormsTableProps) {
  return (
    <>
      {/* Mobile Card List View (md:hidden) */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={`p-4 rounded-xl border ${landingTheme.cardBg} space-y-3`}>
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-24 rounded-md" />
                <Skeleton className="h-7 w-20 rounded-md" />
              </div>
            </div>
          ))
        ) : !forms || forms.length === 0 ? (
          <div
            className={`p-8 text-center text-xs sm:text-sm text-muted-foreground rounded-xl border ${landingTheme.cardBg}`}
          >
            {emptyMessage}
          </div>
        ) : (
          forms.map((form) => (
            <FormMobileCard
              key={form.id}
              form={form}
              isUpdating={updatingId === form.id}
              onTogglePublish={onTogglePublish}
              onVisibilityChange={onVisibilityChange}
              onCopyLink={onCopyLink}
              onOpenQr={onOpenQr}
              onClone={onClone}
              onToggleArchive={onToggleArchive}
            />
          ))
        )}
      </div>

      {/* Desktop Table View (hidden md:block) */}
      <div
        className={`hidden md:block rounded-xl border ${landingTheme.cardBg} shadow-xs overflow-hidden ${landingTheme.cardBorderHover} transition-all duration-200`}
      >
        <Table>
          <TableHeader className="bg-amber-500/[0.12] dark:bg-amber-500/[0.16] border-b border-amber-500/25">
            <TableRow className="hover:bg-transparent border-b border-amber-500/20">
              <TableHead className="font-bold text-xs uppercase tracking-wider text-foreground py-3.5 px-4">
                Title
              </TableHead>
              <TableHead className="w-44 font-bold text-xs uppercase tracking-wider text-foreground py-3.5 px-4">
                Status
              </TableHead>
              <TableHead className="w-36 font-bold text-xs uppercase tracking-wider text-foreground py-3.5 px-4">
                Visibility
              </TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-wider text-foreground py-3.5 px-4">
                Description
              </TableHead>
              <TableHead className="w-32 font-bold text-xs uppercase tracking-wider text-foreground py-3.5 px-4">
                Created
              </TableHead>
              <TableHead className="w-36 text-right font-bold text-xs uppercase tracking-wider text-foreground py-3.5 px-4">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="space-y-2 py-1">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-7 w-24 rounded-md" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Skeleton className="size-8 rounded-md" />
                      <Skeleton className="size-8 rounded-md" />
                      <Skeleton className="size-8 rounded-md" />
                      <Skeleton className="size-8 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : !forms || forms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              forms.map((form) => {
                const target = form.slug || form.id;

                return (
                  <TableRow
                    key={form.id}
                    className="hover:bg-amber-500/[0.06] dark:hover:bg-amber-500/[0.07] transition-colors border-b border-border/50"
                  >
                    <TableCell className="font-medium py-3.5 px-4 max-w-[280px]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/forms/${form.id}`}
                          className={`${landingTheme.linkHover} block text-foreground font-semibold truncate max-w-[230px]`}
                          title={form.title}
                        >
                          {form.title}
                        </Link>
                        {form.isArchived && (
                          <Badge
                            variant="outline"
                            className={`text-[10px] py-0 px-1.5 gap-1 shrink-0 ${landingTheme.draftBadge}`}
                          >
                            <ArchiveIcon className="size-2.5" />
                            Archived
                          </Badge>
                        )}
                      </div>
                      {form.description && (
                        <p
                          className="text-xs text-muted-foreground truncate max-w-[250px] mt-0.5"
                          title={form.description}
                        >
                          {form.description}
                        </p>
                      )}

                      <div className="mt-1">
                        <FormMetaBadges
                          slug={form.slug}
                          closesAt={form.closesAt}
                          responseLimit={form.responseLimit}
                          isPasswordProtected={form.isPasswordProtected}
                        />
                      </div>
                    </TableCell>

                    {/* Status Toggle & Badge */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={form.isPublished}
                          disabled={updatingId === form.id || form.isArchived}
                          onCheckedChange={() => onTogglePublish(form.id, form.isPublished)}
                          title={
                            form.isArchived
                              ? "Archived forms cannot be published"
                              : form.isPublished
                                ? "Click to unpublish"
                                : "Click to publish"
                          }
                        />
                        {form.isArchived ? (
                          <Badge
                            variant="secondary"
                            className="bg-muted text-muted-foreground text-xs font-normal"
                          >
                            Archived
                          </Badge>
                        ) : form.isPublished ? (
                          <Badge
                            variant="default"
                            className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20 text-xs font-normal"
                          >
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className={landingTheme.draftBadge}>
                            Draft
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    {/* Visibility Dropdown */}
                    <TableCell>
                      <Select
                        value={form.visibility}
                        disabled={updatingId === form.id || form.isArchived}
                        onValueChange={(val: "PUBLIC" | "UNLISTED") =>
                          onVisibilityChange(form.id, val)
                        }
                      >
                        <SelectTrigger
                          className={`h-7 text-xs w-[110px] gap-1 border-border/70 ${landingTheme.inputFocus}`}
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
                    </TableCell>

                    <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                      {form.description ?? "—"}
                    </TableCell>

                    <TableCell
                      className="text-muted-foreground text-xs"
                      suppressHydrationWarning
                      title={form.createdAt ? new Date(form.createdAt).toLocaleString() : undefined}
                    >
                      {formatRelativeTime(form.createdAt)}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {/* 1. Edit Builder */}
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          title="Edit in builder"
                          className={landingTheme.buttonGhostHover}
                        >
                          <Link href={`/forms/${form.id}`}>
                            <PencilIcon className="size-4" />
                            <span className="sr-only">Edit {form.title}</span>
                          </Link>
                        </Button>

                        {/* 2. Submissions / Responses */}
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          title="View Submissions"
                          className={landingTheme.buttonGhostHover}
                        >
                          <Link href={`/forms/${form.id}/submissions`}>
                            <BarChart3Icon className="size-4" />
                            <span className="sr-only">Submissions for {form.title}</span>
                          </Link>
                        </Button>

                        {/* 3. Share / Copy Link */}
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Copy Public Link"
                          onClick={() => onCopyLink(target)}
                          className={landingTheme.buttonGhostHover}
                        >
                          <CopyIcon className="size-4" />
                          <span className="sr-only">Copy Link</span>
                        </Button>

                        {/* 4. More Options Dropdown (⋯) */}
                        <FormActionsDropdown
                          formId={form.id}
                          formTitle={form.title}
                          target={target}
                          slug={form.slug}
                          isArchived={form.isArchived}
                          onClone={onClone}
                          onOpenQr={onOpenQr}
                          onToggleArchive={onToggleArchive}
                          triggerClassName={landingTheme.buttonGhostHover}
                          iconClassName="size-4"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
