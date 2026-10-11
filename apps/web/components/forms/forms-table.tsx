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
  emptyMessage = "No forms yet. Click \"Create Form\" to start building.",
}: FormsTableProps) {
  return (
    <div className="rounded-xl border overflow-hidden bg-card shadow-xs">
      <Table>
        <TableHeader className="bg-muted/60">
          <TableRow>
            <TableHead className="font-semibold">Title</TableHead>
            <TableHead className="w-44 font-semibold">Status</TableHead>
            <TableHead className="w-36 font-semibold">Visibility</TableHead>
            <TableHead className="font-semibold">Description</TableHead>
            <TableHead className="w-28 font-semibold">Created</TableHead>
            <TableHead className="w-44 text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-28 text-center text-muted-foreground">
                Loading forms...
              </TableCell>
            </TableRow>
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
                <TableRow key={form.id} className="hover:bg-muted/40 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/dashboard/forms/${form.id}`}
                        className="hover:underline hover:text-primary transition-colors block"
                      >
                        {form.title}
                      </Link>
                      {form.isArchived && (
                        <Badge
                          variant="outline"
                          className="text-[10px] py-0 px-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 gap-1"
                        >
                          <ArchiveIcon className="size-2.5" />
                          Archived
                        </Badge>
                      )}
                    </div>

                    {(form.slug || form.closesAt || form.responseLimit || form.isPasswordProtected) && (
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {form.slug && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded">
                            /form/{form.slug}
                          </span>
                        )}
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
                        <Badge
                          variant="secondary"
                          className="bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border-amber-500/20 text-xs font-normal"
                        >
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
                      <SelectTrigger className="h-7 text-xs w-[110px] gap-1">
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

                  <TableCell className="text-muted-foreground text-xs">
                    {form.createdAt ? new Date(form.createdAt).toLocaleDateString() : "—"}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {/* Edit Builder */}
                      <Button variant="ghost" size="icon" asChild title="Edit in builder">
                        <Link href={`/dashboard/forms/${form.id}`}>
                          <PencilIcon className="size-4" />
                          <span className="sr-only">Edit {form.title}</span>
                        </Link>
                      </Button>

                      {/* Submissions */}
                      <Button variant="ghost" size="icon" asChild title="View Submissions">
                        <Link href={`/dashboard/forms/${form.id}/submissions`}>
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
                      >
                        <CopyPlusIcon className="size-4 text-muted-foreground hover:text-foreground" />
                        <span className="sr-only">Clone {form.title}</span>
                      </Button>

                      {/* Share Link */}
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Copy Public Link"
                        onClick={() => onCopyLink(target)}
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
                        >
                          <ArchiveRestoreIcon className="size-4 text-emerald-500 hover:text-emerald-600" />
                          <span className="sr-only">Restore {form.title}</span>
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Archive Form"
                          onClick={() => onToggleArchive(form.id, false)}
                        >
                          <ArchiveIcon className="size-4 text-muted-foreground hover:text-amber-500" />
                          <span className="sr-only">Archive {form.title}</span>
                        </Button>
                      )}

                      {/* Open live public form */}
                      <Button variant="ghost" size="icon" asChild title="Open Public Form">
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
  );
}
