"use client";

import Link from "next/link";
import {
  PencilIcon,
  BarChart3Icon,
  ExternalLinkIcon,
  CopyIcon,
  GlobeIcon,
  LinkIcon,
  ClockIcon,
  UsersIcon,
  QrCodeIcon,
  LockIcon,
  CopyPlusIcon,
  ArchiveIcon,
  ArchiveRestoreIcon,
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
          forms.map((form) => {
            const target = form.slug || form.id;
            const isExpired = form.closesAt ? new Date() > new Date(form.closesAt) : false;

            return (
              <div
                key={form.id}
                className={`p-4 rounded-xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} relative overflow-hidden transition-all space-y-3 shadow-xs`}
              >
                <div className={landingTheme.cardBeam} />

                {/* Title & Status Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/forms/${form.id}`}
                      className={`font-semibold text-sm sm:text-base block truncate text-foreground ${landingTheme.linkHover}`}
                    >
                      {form.title}
                    </Link>
                    {form.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
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
                {(form.slug || form.closesAt || form.responseLimit || form.isPasswordProtected) && (
                  <div className="flex items-center gap-1.5 flex-wrap text-xs">
                    {form.slug && <span className={landingTheme.slugBadge}>/form/{form.slug}</span>}
                    {form.closesAt && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        <ClockIcon className="size-3 text-amber-500" />
                        {isExpired
                          ? "Expired"
                          : `Closes ${new Date(form.closesAt).toLocaleDateString()}`}
                      </span>
                    )}
                    {form.responseLimit && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        <UsersIcon className="size-3 text-blue-500" />
                        Limit: {form.responseLimit}
                      </span>
                    )}
                    {form.isPasswordProtected && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded">
                        <LockIcon className="size-3" />
                        Protected
                      </span>
                    )}
                  </div>
                )}

                {/* Controls: Publish Switch & Visibility Dropdown */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`mobile-switch-${form.id}`}
                      checked={form.isPublished}
                      disabled={updatingId === form.id || form.isArchived}
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
                    disabled={updatingId === form.id || form.isArchived}
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
                          <GlobeIcon className="size-3 text-blue-500" />
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
                      title="Duplicate"
                      onClick={() => onClone(form.id)}
                      className="size-7"
                    >
                      <CopyPlusIcon className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Copy Link"
                      onClick={() => onCopyLink(target)}
                      className="size-7"
                    >
                      <CopyIcon className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="QR Code"
                      onClick={() => {
                        onOpenQr({
                          title: form.title,
                          url: `${window.location.origin}/form/${target}`,
                          slug: form.slug,
                        });
                      }}
                      className="size-7"
                    >
                      <QrCodeIcon className="size-3.5" />
                    </Button>
                    {form.isArchived ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Restore"
                        onClick={() => onToggleArchive(form.id, true)}
                        className="size-7 text-emerald-400"
                      >
                        <ArchiveRestoreIcon className="size-3.5" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Archive"
                        onClick={() => onToggleArchive(form.id, false)}
                        className="size-7 text-muted-foreground"
                      >
                        <ArchiveIcon className="size-3.5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      title="Open Live"
                      className="size-7"
                    >
                      <Link href={`/form/${target}`} target="_blank">
                        <ExternalLinkIcon className="size-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Table View (hidden md:block) */}
      <div
        className={`hidden md:block relative rounded-xl border ${landingTheme.cardBg} shadow-xs overflow-hidden ${landingTheme.cardBorderHover} transition-all duration-200`}
      >
        <div className={landingTheme.cardBeam} />
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow>
              <TableHead className="font-semibold text-foreground">Title</TableHead>
              <TableHead className="w-44 font-semibold text-foreground">Status</TableHead>
              <TableHead className="w-36 font-semibold text-foreground">Visibility</TableHead>
              <TableHead className="font-semibold text-foreground">Description</TableHead>
              <TableHead className="w-28 font-semibold text-foreground">Created</TableHead>
              <TableHead className="w-44 text-right font-semibold text-foreground">
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
                const isExpired = form.closesAt ? new Date() > new Date(form.closesAt) : false;

                return (
                  <TableRow key={form.id} className={landingTheme.tableRowHover}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/forms/${form.id}`}
                          className={`${landingTheme.linkHover} block text-foreground`}
                        >
                          {form.title}
                        </Link>
                        {form.isArchived && (
                          <Badge
                            variant="outline"
                            className={`text-[10px] py-0 px-1.5 gap-1 ${landingTheme.draftBadge}`}
                          >
                            <ArchiveIcon className="size-2.5" />
                            Archived
                          </Badge>
                        )}
                      </div>

                      {(form.slug ||
                        form.closesAt ||
                        form.responseLimit ||
                        form.isPasswordProtected) && (
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {form.slug && (
                            <span className={landingTheme.slugBadge}>/form/{form.slug}</span>
                          )}
                          {form.closesAt && (
                            <span
                              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground"
                              suppressHydrationWarning
                            >
                              <ClockIcon className="size-3 text-amber-500" />
                              {isExpired
                                ? "Expired"
                                : `Closes ${new Date(form.closesAt).toLocaleDateString()}`}
                            </span>
                          )}
                          {form.responseLimit && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                              <UsersIcon className="size-3 text-blue-500" />
                              Limit: {form.responseLimit}
                            </span>
                          )}
                          {form.isPasswordProtected && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded">
                              <LockIcon className="size-3" />
                              Protected
                            </span>
                          )}
                        </div>
                      )}
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
                              <GlobeIcon className="size-3 text-blue-500" />
                              Public
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                      {form.description ?? "—"}
                    </TableCell>

                    <TableCell className="text-muted-foreground text-xs" suppressHydrationWarning>
                      {form.createdAt ? new Date(form.createdAt).toLocaleDateString() : "—"}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {/* Edit Builder */}
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

                        {/* Submissions */}
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

                        {/* Clone / Duplicate Form */}
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Duplicate / Clone Form"
                          onClick={() => onClone(form.id)}
                          className={landingTheme.buttonGhostHover}
                        >
                          <CopyPlusIcon className="size-4 text-muted-foreground group-hover:text-foreground" />
                          <span className="sr-only">Clone {form.title}</span>
                        </Button>

                        {/* Share Link */}
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

                        {/* QR Code */}
                        <Button
                          variant="ghost"
                          size="icon"
                          title="QR Code"
                          onClick={() => {
                            onOpenQr({
                              title: form.title,
                              url: `${window.location.origin}/form/${target}`,
                              slug: form.slug,
                            });
                          }}
                          className={landingTheme.buttonGhostHover}
                        >
                          <QrCodeIcon className="size-4" />
                          <span className="sr-only">QR Code for {form.title}</span>
                        </Button>

                        {/* Archive / Unarchive */}
                        {form.isArchived ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Restore Form"
                            onClick={() => onToggleArchive(form.id, true)}
                            className="hover:bg-emerald-500/15"
                          >
                            <ArchiveRestoreIcon className="size-4 text-emerald-400 hover:text-emerald-300" />
                            <span className="sr-only">Restore {form.title}</span>
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Archive Form"
                            onClick={() => onToggleArchive(form.id, false)}
                            className={landingTheme.buttonGhostHover}
                          >
                            <ArchiveIcon
                              className={`size-4 text-muted-foreground hover:${landingTheme.iconColor}`}
                            />
                            <span className="sr-only">Archive {form.title}</span>
                          </Button>
                        )}

                        {/* Open live public form */}
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          title="Open Public Form"
                          className={landingTheme.buttonGhostHover}
                        >
                          <Link href={`/form/${target}`} target="_blank">
                            <ExternalLinkIcon className="size-4" />
                            <span className="sr-only">Open {form.title}</span>
                          </Link>
                        </Button>
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
