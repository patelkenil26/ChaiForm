"use client";

import { useEffect, useState } from "react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconCopy,
  IconCheck,
  IconStarFilled,
  IconStar,
  IconClock,
  IconClipboardCheck,
  IconDownload,
  IconHelpCircle,
  IconSend,
  IconFingerprint,
} from "@tabler/icons-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { formatRelativeTime } from "~/lib/date-utils";
import { landingTheme } from "~/config/landing-theme";
import type { SubmissionField, SubmissionItem } from "./submissions-table";

export interface SubmissionDetailSheetProps {
  submission: SubmissionItem | null;
  fields: SubmissionField[];
  formTitle?: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentIndex?: number;
  totalSubmissions?: number;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function SubmissionDetailSheet({
  submission,
  fields,
  formTitle,
  open,
  onOpenChange,
  currentIndex = 0,
  totalSubmissions = 0,
  onNext,
  onPrevious,
}: SubmissionDetailSheetProps) {
  const [copiedAnswers, setCopiedAnswers] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Keyboard navigation: ArrowLeft/ArrowUp for previous, ArrowRight/ArrowDown for next
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;

      if ((e.key === "ArrowLeft" || e.key === "ArrowUp") && onPrevious) {
        e.preventDefault();
        onPrevious();
      } else if ((e.key === "ArrowRight" || e.key === "ArrowDown") && onNext) {
        e.preventDefault();
        onNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onNext, onPrevious]);

  if (!submission) return null;

  const valueMap = new Map((submission.values ?? []).map((v) => [v.formFieldId, v.value]));
  const sortedFields = [...fields].sort((a, b) => parseFloat(a.index) - parseFloat(b.index));

  const answeredCount = sortedFields.filter((f) => {
    const val = valueMap.get(f.id);
    return val !== undefined && val !== null && String(val).trim() !== "";
  }).length;

  const completionPercent =
    sortedFields.length > 0 ? Math.round((answeredCount / sortedFields.length) * 100) : 100;

  const formattedDate = submission.createdAt
    ? new Date(submission.createdAt).toLocaleString([], {
        dateStyle: "full",
        timeStyle: "short",
      })
    : "Unknown date";

  const handleCopyAnswersText = () => {
    const textLines = [
      `Form: ${formTitle || "ChaiForm"}`,
      `Submission ID: ${submission.id}`,
      `Date: ${formattedDate}`,
      `Completion: ${answeredCount}/${sortedFields.length} answered (${completionPercent}%)`,
      "---",
      ...sortedFields.map((field, idx) => {
        const val = valueMap.get(field.id);
        const answerText = val !== undefined && val !== "" ? String(val) : "[Not Answered]";
        return `${idx + 1}. ${field.label}\n   Answer: ${answerText}`;
      }),
    ];

    navigator.clipboard.writeText(textLines.join("\n\n"));
    setCopiedAnswers(true);
    toast.success("All respondent answers copied to clipboard!");
    setTimeout(() => setCopiedAnswers(false), 2000);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(submission.id);
    setCopiedId(true);
    toast.success("Submission ID copied!");
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleDownloadSingleJson = () => {
    try {
      const data = {
        submissionId: submission.id,
        formTitle: formTitle || "Untitled Form",
        submittedAt: submission.createdAt,
        totalFields: sortedFields.length,
        answeredFields: answeredCount,
        answers: sortedFields.map((f) => ({
          fieldId: f.id,
          label: f.label,
          type: f.type,
          value: valueMap.get(f.id) ?? null,
        })),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `response-${submission.id.slice(0, 8)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Response downloaded as JSON");
    } catch {
      toast.error("Failed to download JSON");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl md:max-w-2xl p-0 flex flex-col h-full bg-card border-l border-border/80 shadow-2xl"
      >
        {/* 1. Header Toolbar with Next/Prev Controls */}
        <SheetHeader className="p-4 sm:p-5 border-b border-border/60 bg-muted/20 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`flex size-8 items-center justify-center rounded-lg ${landingTheme.iconBg}`}
              >
                <IconClipboardCheck className="size-4" />
              </div>
              <div>
                <SheetTitle className="text-sm sm:text-base font-bold text-foreground">
                  Response Details
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  Submission #{currentIndex + 1} of {totalSubmissions}
                </SheetDescription>
              </div>
            </div>

            {/* Stepper Controls (Next / Prev) */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={onPrevious}
                disabled={!onPrevious}
                className="size-7.5 rounded-lg border-border/70"
                title="Previous response (Arrow Up or Left)"
              >
                <IconChevronLeft className="size-4" />
                <span className="sr-only">Previous response</span>
              </Button>

              <span className="font-mono text-xs text-muted-foreground px-1.5 font-medium">
                {currentIndex + 1} / {totalSubmissions}
              </span>

              <Button
                variant="outline"
                size="icon"
                onClick={onNext}
                disabled={!onNext}
                className="size-7.5 rounded-lg border-border/70"
                title="Next response (Arrow Down or Right)"
              >
                <IconChevronRight className="size-4" />
                <span className="sr-only">Next response</span>
              </Button>
            </div>
          </div>
        </SheetHeader>

        {/* 2. Metadata Telemetry Strip */}
        <div className="p-4 border-b border-border/50 bg-background/50 text-xs space-y-2.5 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <IconClock className="size-3.5 text-muted-foreground" />
              <span>{formattedDate}</span>
              <span className="text-[11px] opacity-70">
                ({formatRelativeTime(submission.createdAt)})
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyId}
              className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-foreground bg-muted/30 hover:bg-muted/60 px-2 py-0.5 rounded-md border border-border/50 transition-colors self-start sm:self-auto cursor-pointer"
              title="Click to copy full Submission ID"
            >
              <IconFingerprint className="size-3 text-muted-foreground" />
              <span>{submission.id.slice(0, 10)}...</span>
              {copiedId ? (
                <IconCheck className="size-3 text-emerald-400" />
              ) : (
                <IconCopy className="size-3" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px]">
            <span className="text-muted-foreground font-medium">Questions Answered:</span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
              <span className={landingTheme.primaryText}>{answeredCount}</span> of{" "}
              {sortedFields.length}
              <Badge
                variant="outline"
                className={`text-[10px] px-1.5 py-0 ${
                  completionPercent === 100
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                    : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
                }`}
              >
                {completionPercent}% completed
              </Badge>
            </span>
          </div>
        </div>

        {/* 3. Scrollable List of Questions & Respondent Answers */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {sortedFields.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No questions found on this form.
            </div>
          ) : (
            sortedFields.map((field, idx) => {
              const val = valueMap.get(field.id);
              const hasAnswer = val !== undefined && val !== null && String(val).trim() !== "";
              const strVal = hasAnswer ? String(val) : "";

              return (
                <div
                  key={field.id}
                  className="rounded-xl border border-border/60 bg-muted/15 p-4 hover:border-lime-600/30 dark:hover:border-[#ccff00]/30 transition-all space-y-2.5"
                >
                  {/* Question Title & Type Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-[10px] font-bold text-foreground">
                        {idx + 1}
                      </span>
                      <h4 className="text-xs sm:text-sm font-semibold text-foreground leading-snug">
                        {field.label}
                        {field.isRequired && (
                          <span className="text-rose-400 ml-1" title="Required field">
                            *
                          </span>
                        )}
                      </h4>
                    </div>

                    <Badge
                      variant="outline"
                      className="text-[10px] uppercase font-mono px-1.5 py-0 shrink-0 bg-muted/30 text-muted-foreground border-border/60"
                    >
                      {field.type}
                    </Badge>
                  </div>

                  {/* Respondent Answer Value */}
                  <div className="pl-7">
                    {hasAnswer ? (
                      field.type === "RATING" ? (
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {[1, 2, 3, 4, 5].map((star) =>
                              star <= Number(strVal) ? (
                                <IconStarFilled key={star} className="size-4 fill-amber-400" />
                              ) : (
                                <IconStar key={star} className="size-4 text-muted-foreground/30" />
                              ),
                            )}
                          </div>
                          <span className="font-bold text-sm text-foreground ml-1">
                            {strVal} / 5
                          </span>
                        </div>
                      ) : (
                        <div className="p-3 rounded-lg bg-background/80 border border-border/50 text-xs sm:text-sm text-foreground font-medium whitespace-pre-wrap break-words leading-relaxed select-text">
                          {strVal}
                        </div>
                      )
                    ) : (
                      <div className="italic text-xs text-muted-foreground/60 p-2.5 rounded-lg bg-muted/20 border border-dashed border-border/40">
                        Respondent skipped this question
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 4. Footer Actions (Copy All Text / Download JSON) */}
        <div className="p-3.5 sm:p-4 border-t border-border/60 bg-muted/20 flex items-center justify-between gap-2 shrink-0 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyAnswersText}
              className="text-xs h-8 gap-1.5 border-border/70 cursor-pointer"
              title="Copy formatted questions and answers as text"
            >
              {copiedAnswers ? (
                <>
                  <IconCheck className="size-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied Answers!</span>
                </>
              ) : (
                <>
                  <IconCopy className="size-3.5 text-muted-foreground" />
                  <span>Copy Text</span>
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadSingleJson}
              className="text-xs h-8 gap-1.5 border-border/70 cursor-pointer"
              title="Download this response as structured JSON file"
            >
              <IconDownload className="size-3.5 text-muted-foreground" />
              <span>Export JSON</span>
            </Button>
          </div>

          <Button size="sm" onClick={() => onOpenChange(false)} className="text-xs h-8 px-4">
            Close Sheet
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
