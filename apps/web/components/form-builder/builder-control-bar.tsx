"use client";

import { LayersIcon, RotateCcwIcon, SaveIcon } from "lucide-react";
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
          <LayersIcon className={`size-4 ${landingTheme.iconColor}`} />
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
            className={`text-[11px] ${landingTheme.callout.bg} ${landingTheme.callout.text} border ${landingTheme.callout.border} gap-1`}
          >
            <span className={`size-1.5 rounded-full ${landingTheme.activeDot} animate-pulse`} />
            Unsaved Draft (Restored from session)
          </Badge>
        ) : hasDrafts ? (
          <Badge
            variant="secondary"
            className={`text-[11px] ${landingTheme.callout.bg} ${landingTheme.callout.text} border ${landingTheme.callout.border} gap-1`}
          >
            <span className={`size-1.5 rounded-full ${landingTheme.activeDot} animate-pulse`} />
            Unsaved Changes
          </Badge>
        ) : editingFieldId ? (
          <Badge
            variant="secondary"
            className={`text-[11px] ${landingTheme.callout.bg} ${landingTheme.callout.text} border ${landingTheme.callout.border} gap-1`}
          >
            <span className={`size-1.5 rounded-full ${landingTheme.activeDot}`} />
            Editing 1 Question
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="text-[11px] text-muted-foreground border-border/60 gap-1"
          >
            <span className="size-1.5 rounded-full bg-emerald-400" />
            Saved & Locked
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
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            title="Discard unsaved local drafts and revert to cloud saved state"
          >
            <RotateCcwIcon className="size-3.5" />
            <span>Discard</span>
          </Button>
        )}

        <Button
          type="button"
          size="sm"
          disabled={!isSaveActive || isSyncing}
          onClick={onSaveChanges}
          className={`h-8 gap-1.5 text-xs font-semibold ${
            isSaveActive
              ? landingTheme.primaryButton
              : "opacity-40 cursor-not-allowed border border-border/40"
          }`}
          title="Validate all questions and save to database"
        >
          <SaveIcon className="size-3.5" />
          <span>{isSyncing ? "Saving..." : "Save Changes"}</span>
        </Button>
      </div>
    </div>
  );
}
