"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  IconSearch,
  IconForms,
  IconCompass,
  IconLayoutDashboard,
  IconTable,
  IconPlus,
  IconFolder,
  IconArrowRight,
  IconCheck,
  IconSparkles,
} from "@tabler/icons-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "~/components/ui/command";
import { Badge } from "~/components/ui/badge";
import { useListForms, useListPublicForms } from "~/hooks/api/form";
import { landingTheme } from "~/config/landing-theme";

interface GlobalCommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCreateFormClick?: () => void;
}

export function GlobalCommandPalette({
  open: externalOpen,
  onOpenChange: setExternalOpen,
  onCreateFormClick,
}: GlobalCommandPaletteProps) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;

  const handleToggle = () => {
    if (isControlled && setExternalOpen) {
      setExternalOpen(!externalOpen);
    } else {
      setInternalOpen((prev) => !prev);
    }
  };

  const handleOpenChange = (newVal: boolean) => {
    if (isControlled && setExternalOpen) {
      setExternalOpen(newVal);
    } else {
      setInternalOpen(newVal);
    }
  };

  // Global Ctrl+K / Cmd+K keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleToggle();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isControlled, externalOpen, setExternalOpen]);

  // Fetch user forms and community templates
  const { forms: userForms } = useListForms();
  const { publicForms: templates } = useListPublicForms({});

  const handleSelect = (callback: () => void) => {
    handleOpenChange(false);
    callback();
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Global Workspace Search"
      description="Quickly jump to forms, templates, or run actions..."
      className="max-w-[92vw] sm:max-w-2xl rounded-2xl shadow-2xl border border-border/70 overflow-hidden"
    >
      <CommandInput placeholder="Search your forms, templates, or quick navigation (Ctrl+K)..." />
      <CommandList className="max-h-[360px] p-2">
        <CommandEmpty className="py-8 text-center text-sm text-muted-foreground">
          No matching forms, templates, or navigation shortcuts found.
        </CommandEmpty>

        {/* Group 1: User's Forms */}
        {userForms && userForms.length > 0 && (
          <CommandGroup heading={`Your Forms (${userForms.length})`}>
            {userForms.slice(0, 8).map((form) => (
              <CommandItem
                key={`form-${form.id}`}
                value={`form ${form.title} ${form.description ?? ""} ${form.slug ?? ""}`}
                onSelect={() => handleSelect(() => router.push(`/forms/${form.id}`))}
                className="flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer hover:bg-accent"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex aspect-square size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary border border-primary/20">
                    <IconForms className="size-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-xs sm:text-sm text-foreground truncate max-w-[220px] sm:max-w-[340px]">
                        {form.title}
                      </span>
                      {form.isPublished ? (
                        <Badge
                          variant="outline"
                          className="text-[9px] py-0 px-1 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                        >
                          Live
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className={`text-[9px] py-0 px-1 ${landingTheme.callout.border} ${landingTheme.callout.text} ${landingTheme.callout.bg}`}
                        >
                          Draft
                        </Badge>
                      )}
                    </div>
                    {form.description && (
                      <span className="text-[11px] text-muted-foreground truncate max-w-[260px] sm:max-w-[380px]">
                        {form.description}
                      </span>
                    )}
                  </div>
                </div>
                <CommandShortcut className="text-[11px] text-muted-foreground flex items-center gap-1">
                  Builder <IconArrowRight className="size-3" />
                </CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandSeparator className="my-1.5" />

        {/* Group 2: Templates Gallery */}
        {templates && templates.length > 0 && (
          <CommandGroup heading="Curated Templates Gallery">
            {templates.slice(0, 6).map((tpl) => (
              <CommandItem
                key={`template-${tpl.id}`}
                value={`template ${tpl.title} ${tpl.category ?? ""} ${tpl.description ?? ""}`}
                onSelect={() => handleSelect(() => router.push(`/explore`))}
                className="flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer hover:bg-accent"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex aspect-square size-7 shrink-0 items-center justify-center rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    <IconSparkles className="size-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-xs sm:text-sm text-foreground truncate max-w-[220px] sm:max-w-[340px]">
                        {tpl.title}
                      </span>
                      {tpl.category && (
                        <Badge variant="secondary" className="text-[9px] py-0 px-1 font-normal">
                          {tpl.category}
                        </Badge>
                      )}
                    </div>
                    {tpl.description && (
                      <span className="text-[11px] text-muted-foreground truncate max-w-[260px] sm:max-w-[380px]">
                        {tpl.description}
                      </span>
                    )}
                  </div>
                </div>
                <CommandShortcut className="text-[11px] text-muted-foreground flex items-center gap-1">
                  Use <IconArrowRight className="size-3" />
                </CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandSeparator className="my-1.5" />

        {/* Group 3: Navigation Hubs */}
        <CommandGroup heading="Navigation">
          <CommandItem
            value="navigation dashboard home"
            onSelect={() => handleSelect(() => router.push("/dashboard"))}
            className="flex items-center gap-2.5 py-2 px-3 rounded-lg cursor-pointer hover:bg-accent"
          >
            <IconLayoutDashboard className="size-4 text-muted-foreground" />
            <span className="text-xs sm:text-sm font-medium">Dashboard Overview</span>
            <CommandShortcut className="text-[10px] font-mono">/dashboard</CommandShortcut>
          </CommandItem>

          <CommandItem
            value="navigation forms list builder"
            onSelect={() => handleSelect(() => router.push("/forms"))}
            className="flex items-center gap-2.5 py-2 px-3 rounded-lg cursor-pointer hover:bg-accent"
          >
            <IconFolder className="size-4 text-muted-foreground" />
            <span className="text-xs sm:text-sm font-medium">Forms Manager Hub</span>
            <CommandShortcut className="text-[10px] font-mono">/forms</CommandShortcut>
          </CommandItem>

          <CommandItem
            value="navigation submissions responses analytics"
            onSelect={() => handleSelect(() => router.push("/submissions"))}
            className="flex items-center gap-2.5 py-2 px-3 rounded-lg cursor-pointer hover:bg-accent"
          >
            <IconTable className="size-4 text-muted-foreground" />
            <span className="text-xs sm:text-sm font-medium">Submissions & Responses</span>
            <CommandShortcut className="text-[10px] font-mono">/submissions</CommandShortcut>
          </CommandItem>

          <CommandItem
            value="navigation explore templates community"
            onSelect={() => handleSelect(() => router.push("/explore"))}
            className="flex items-center gap-2.5 py-2 px-3 rounded-lg cursor-pointer hover:bg-accent"
          >
            <IconCompass className="size-4 text-muted-foreground" />
            <span className="text-xs sm:text-sm font-medium">Templates Gallery</span>
            <CommandShortcut className="text-[10px] font-mono">/explore</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator className="my-1.5" />

        {/* Group 4: Quick Actions */}
        <CommandGroup heading="Quick Actions">
          <CommandItem
            value="action create new form"
            onSelect={() =>
              handleSelect(() => {
                if (onCreateFormClick) {
                  onCreateFormClick();
                } else {
                  router.push("/dashboard");
                }
              })
            }
            className="flex items-center gap-2.5 py-2 px-3 rounded-lg cursor-pointer text-primary hover:bg-primary/10"
          >
            <IconPlus className="size-4 text-primary" />
            <span className="text-xs sm:text-sm font-semibold">Create New Form</span>
            <CommandShortcut className="text-[10px] text-primary">New</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

/**
 * Trigger Button designed to sit nicely in SiteHeader or Sidebar
 */
export function CommandSearchTrigger({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Search forms & templates (Ctrl + K)"
      className={`group relative flex h-8 w-8 sm:w-auto sm:max-w-[230px] md:max-w-[270px] items-center justify-center sm:justify-between rounded-lg border border-border/60 bg-muted/40 px-0 sm:px-2.5 text-xs text-muted-foreground transition-all ${landingTheme.buttonOutlineHover} cursor-pointer select-none shadow-2xs shrink-0 ${
        className ?? ""
      }`}
    >
      <div className="flex items-center gap-1.5 truncate">
        <IconSearch
          className={`size-3.5 shrink-0 text-muted-foreground group-hover:${landingTheme.primaryText} transition-colors`}
        />
        <span className="hidden sm:inline truncate">Search forms, templates...</span>
      </div>
      <kbd className="pointer-events-none hidden sm:inline-flex h-4.5 select-none items-center gap-0.5 rounded border border-border/60 bg-background px-1.5 font-mono text-[9px] font-medium text-muted-foreground opacity-100 shadow-2xs transition-colors">
        <span className="text-[10px]">Ctrl</span> K
      </kbd>
    </button>
  );
}
