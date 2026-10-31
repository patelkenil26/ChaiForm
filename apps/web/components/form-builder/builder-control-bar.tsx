"use client";

import { IconStack2, IconRotateClockwise, IconDeviceFloppy } from "@tabler/icons-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { landingTheme } from "~/config/landing-theme";

interface BuilderControlBarProps {
  totalQuestions: number;
  hasDrafts: boolean;
  isRestoredFromDraft?: boolean;
  isEditMode?: boolean;
  editingFieldId?: string | null;
  isSyncing: boolean;
  onEditFields?: () => void;
  onDiscardDraft?: () => void;
  onSaveChanges: () => void;
}

export function BuilderControlBar({
  totalQuestions,
  hasDrafts,
  isRestoredFromDraft = false,
  isEditMode = false,
  editingFieldId,
  isSyncing,
  onDiscardDraft,
  onSaveChanges,
}: BuilderControlBarProps) {
  const isSaveActive = isEditMode || hasDrafts || Boolean(editingFieldId) || isRestoredFromDraft;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-md shadow-xs">
      {/* Left: Info & Status */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <IconStack2 className={`size-4 ${landingTheme.iconColor}`} />
          <span className="text-sm font-semibold text-foreground tracking-tight">
            Form Questions
          </span>
        </div>
        <Badge
          variant="outline"
          className="text-xs font-mono border-border/70 text-muted-foreground"
        >
          {totalQuestions} {totalQuestions === 1 ? "question" : "questions"}
        </Badge>

        {isRestoredFromDraft ? (
          <Badge
            variant="secondary"
            className="text-[11px] bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 gap-1 font-medium"
          >
            <span className="size-1.5 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse" />
            Unsaved Draft (Restored from session)
          </Badge>
        ) : hasDrafts ? (
          <Badge
            variant="secondary"
            className="text-[11px] bg-lime-500/10 dark:bg-[#ccff00]/10 text-lime-700 dark:text-[#ccff00] border border-lime-500/30 gap-1 font-medium"
          >
            <span className="size-1.5 rounded-full bg-lime-500 dark:bg-[#ccff00] animate-pulse" />
            Unsaved Changes
          </Badge>
        ) : editingFieldId ? (
          <Badge
            variant="secondary"
            className="text-[11px] bg-lime-500/10 dark:bg-[#ccff00]/10 text-lime-700 dark:text-[#ccff00] border border-lime-500/30 gap-1 font-medium"
          >
            <span className="size-1.5 rounded-full bg-lime-500 dark:bg-[#ccff00]" />
            Editing 1 Question
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="text-[11px] text-muted-foreground border-border/60 gap-1"
          >
            <span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
            All changes saved
          </Badge>
        )}
      </div>

      {/* Right: Discard Draft (if any) & Unified Save Button */}
      <div className="flex items-center gap-2">
        {(hasDrafts || isRestoredFromDraft) && onDiscardDraft && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDiscardDraft}
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
            title="Discard unsaved local drafts and revert to cloud saved state"
          >
            <IconRotateClockwise className="size-3.5" />
            <span>Discard</span>
          </Button>
        )}

        <Button
          type="button"
          size="sm"
          disabled={!isSaveActive || isSyncing}
          onClick={onSaveChanges}
          className={`h-8 gap-1.5 text-xs font-semibold cursor-pointer ${
            isSaveActive
              ? landingTheme.primaryButton
              : "opacity-50 cursor-not-allowed border border-border/40 bg-muted/30 text-muted-foreground"
          }`}
          title={
            isSaveActive
              ? "Validate all questions and save to database"
              : "All changes are saved to the cloud"
          }
        >
          <IconDeviceFloppy className="size-3.5" />
          <span>{isSyncing ? "Saving..." : isSaveActive ? "Save Changes" : "Saved"}</span>
        </Button>
      </div>
    </div>
  );
}
