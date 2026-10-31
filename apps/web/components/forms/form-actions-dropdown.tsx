"use client";

import Link from "next/link";
import {
  IconDots,
  IconCopy,
  IconQrcode,
  IconExternalLink,
  IconArchiveOff,
  IconArchive,
} from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface FormActionsDropdownProps {
  formId: string;
  formTitle: string;
  target: string;
  slug?: string | null;
  isArchived: boolean;
  onClone: (formId: string) => void;
  onOpenQr: (form: { title: string; url: string; slug?: string | null }) => void;
  onToggleArchive: (formId: string, isCurrentlyArchived: boolean) => void;
  triggerClassName?: string;
  iconClassName?: string;
}

export function FormActionsDropdown({
  formId,
  formTitle,
  target,
  slug,
  isArchived,
  onClone,
  onOpenQr,
  onToggleArchive,
  triggerClassName = "size-8",
  iconClassName = "size-4",
}: FormActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title="More options"
          className={`${triggerClassName} cursor-pointer`}
        >
          <IconDots className={iconClassName} />
          <span className="sr-only">More options for {formTitle}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-card border-border/80 shadow-lg">
        <DropdownMenuItem onClick={() => onClone(formId)} className="cursor-pointer gap-2 text-xs">
          <IconCopy className="size-3.5 text-muted-foreground" />
          <span>Duplicate Form</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            onOpenQr({
              title: formTitle,
              url: `${typeof window !== "undefined" ? window.location.origin : ""}/form/${target}`,
              slug,
            });
          }}
          className="cursor-pointer gap-2 text-xs"
        >
          <IconQrcode className="size-3.5 text-muted-foreground" />
          <span>Embed &amp; QR Code</span>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer gap-2 text-xs">
          <Link href={`/form/${target}`} target="_blank">
            <IconExternalLink className="size-3.5 text-muted-foreground" />
            <span>Open Live Form</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {isArchived ? (
          <DropdownMenuItem
            onClick={() => onToggleArchive(formId, true)}
            className="cursor-pointer gap-2 text-xs text-emerald-600 dark:text-emerald-400 focus:text-emerald-500"
          >
            <IconArchiveOff className="size-3.5" />
            <span>Restore Form</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => onToggleArchive(formId, false)}
            className="cursor-pointer gap-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <IconArchive className="size-3.5" />
            <span>Archive Form</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
