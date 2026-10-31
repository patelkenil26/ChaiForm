"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  IconSearch,
  IconStarFilled,
  IconCopy,
  IconArrowRight,
  IconExternalLink,
  IconHelpCircle,
  IconCheck,
  IconInbox,
  IconEye,
  IconSparkles,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Card } from "~/components/ui/card";
import { SubmissionsToolbar, type DatePreset } from "./submissions-toolbar";
import { SubmissionsPagination } from "./submissions-pagination";
import { SubmissionDetailSheet } from "./submission-detail-sheet";
import { formatRelativeTime } from "~/lib/date-utils";
import { landingTheme } from "~/config/landing-theme";

export interface SubmissionField {
  id: string;
  label: string;
  labelKey: string;
  type: string;
  isRequired: boolean;
  index: string;
}

export interface SubmissionValue {
  formFieldId: string;
  value: string;
}

export interface SubmissionItem {
  id: string;
  createdAt: Date | string | null;
  values?: SubmissionValue[] | null;
}

interface SubmissionsTableProps {
  fields: SubmissionField[] | undefined;
  submissions: SubmissionItem[] | undefined;
  isLoading: boolean;
  formTitle?: string | null;
  onCopyShareLink?: () => void;
  formSlugOrId?: string | null;
}

export function SubmissionsTable({
  fields,
  submissions,
  isLoading,
  formTitle,
  onCopyShareLink,
  formSlugOrId,
}: SubmissionsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [datePreset, setDatePreset] = useState<DatePreset>("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Detail Sheet state
  const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const sortedFields = useMemo(() => {
    return [...(fields ?? [])].sort((a, b) => parseFloat(a.index) - parseFloat(b.index));
  }, [fields]);

  // Handle Search Input Change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Handle Date Preset Selection
  const handleSelectPreset = (preset: DatePreset) => {
    setDatePreset(preset);
    if (preset !== "CUSTOM") {
      setStartDate("");
      setEndDate("");
    }
    setCurrentPage(1);
  };

  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    setCurrentPage(1);
  };

  const handleEndDateChange = (date: string) => {
    setEndDate(date);
    setCurrentPage(1);
  };

  // Reset all active filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setDatePreset("ALL");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  // Filter Submissions by Text and Date Range
  const filteredSubmissions = useMemo(() => {
    if (!submissions) return [];

    const query = searchQuery.trim().toLowerCase();
    const now = new Date();

    return submissions.filter((sub) => {
      const subDate = sub.createdAt ? new Date(sub.createdAt) : null;

      // 1. Date Range Filter
      if (datePreset === "TODAY") {
        if (!subDate) return false;
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (subDate < startOfToday) return false;
      } else if (datePreset === "7D") {
        if (!subDate) return false;
        const past7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (subDate < past7Days) return false;
      } else if (datePreset === "30D") {
        if (!subDate) return false;
        const past30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (subDate < past30Days) return false;
      } else if (datePreset === "CUSTOM") {
        if (startDate && subDate) {
          const from = new Date(startDate);
          from.setHours(0, 0, 0, 0);
          if (subDate < from) return false;
        }
        if (endDate && subDate) {
          const to = new Date(endDate);
          to.setHours(23, 59, 59, 999);
          if (subDate > to) return false;
        }
      }

      // 2. Global Text Search Filter
      if (query !== "") {
        const dateString = subDate ? subDate.toLocaleString().toLowerCase() : "";
        const matchesDate = dateString.includes(query);
        const matchesId = sub.id.toLowerCase().includes(query);
        const matchesAnswers = (sub.values ?? []).some((v) =>
          v.value.toLowerCase().includes(query),
        );

        if (!matchesDate && !matchesId && !matchesAnswers) {
          return false;
        }
      }

      return true;
    });
  }, [submissions, searchQuery, datePreset, startDate, endDate]);

  const totalFiltered = filteredSubmissions.length;
  const totalPages = Math.ceil(totalFiltered / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);

  // Paginated Rows Slice
  const paginatedSubmissions = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return filteredSubmissions.slice(startIndex, startIndex + pageSize);
  }, [filteredSubmissions, safeCurrentPage, pageSize]);

  // Export to CSV Function
  const handleExportCsv = () => {
    if (!filteredSubmissions || filteredSubmissions.length === 0) return;

    try {
      const headers = [
        "Submission ID",
        "Submitted At",
        ...sortedFields.map((f) => `"${f.label.replace(/"/g, '""')}"`),
      ];

      const rows = filteredSubmissions.map((sub) => {
        const valMap = new Map((sub.values ?? []).map((v) => [v.formFieldId, v.value]));
        const dateStr = sub.createdAt ? new Date(sub.createdAt).toISOString() : "";

        const colVals = sortedFields.map((f) => {
          const val = valMap.get(f.id) ?? "";
          return `"${String(val).replace(/"/g, '""')}"`;
        });

        return [`"${sub.id}"`, `"${dateStr}"`, ...colVals].join(",");
      });

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      const fileName = formTitle
        ? `${formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-submissions.csv`
        : "form-submissions.csv";
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Submissions exported as CSV!");
    } catch {
      toast.error("Failed to export submissions to CSV");
    }
  };

  // Export to JSON Function
  const handleExportJson = () => {
    if (!filteredSubmissions || filteredSubmissions.length === 0) return;

    try {
      const exportData = filteredSubmissions.map((sub, idx) => {
        const valMap = new Map((sub.values ?? []).map((v) => [v.formFieldId, v.value]));
        const answers: Record<string, string | null> = {};

        sortedFields.forEach((field) => {
          answers[field.label] = valMap.get(field.id) ?? null;
        });

        return {
          index: idx + 1,
          submissionId: sub.id,
          submittedAt: sub.createdAt,
          answers,
        };
      });

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const fileName = formTitle
        ? `${formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-submissions.json`
        : "form-submissions.json";
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Submissions exported as JSON!");
    } catch {
      toast.error("Failed to export JSON");
    }
  };

  // Active submission for detail sheet
  const activeSubmission = useMemo(() => {
    if (!activeSubmissionId) return null;
    return filteredSubmissions.find((s) => s.id === activeSubmissionId) || null;
  }, [activeSubmissionId, filteredSubmissions]);

  const activeIndex = useMemo(() => {
    if (!activeSubmissionId) return 0;
    return Math.max(
      0,
      filteredSubmissions.findIndex((s) => s.id === activeSubmissionId),
    );
  }, [activeSubmissionId, filteredSubmissions]);

  const handleOpenDetail = (subId: string) => {
    setActiveSubmissionId(subId);
    setSheetOpen(true);
  };

  const handleNextSubmission = () => {
    if (activeIndex < filteredSubmissions.length - 1) {
      const nextSub = filteredSubmissions[activeIndex + 1];
      if (nextSub) setActiveSubmissionId(nextSub.id);
    }
  };

  const handlePreviousSubmission = () => {
    if (activeIndex > 0) {
      const prevSub = filteredSubmissions[activeIndex - 1];
      if (prevSub) setActiveSubmissionId(prevSub.id);
    }
  };

  const totalSubmissionsCount = submissions?.length ?? 0;

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Control Toolbar */}
      {!isLoading && totalSubmissionsCount > 0 && (
        <SubmissionsToolbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          datePreset={datePreset}
          onSelectPreset={handleSelectPreset}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          totalCount={totalSubmissionsCount}
          filteredCount={totalFiltered}
          onResetFilters={handleResetFilters}
          onExportCsv={handleExportCsv}
          onExportJson={handleExportJson}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      )}

      {/* 2. Main Content: Table View vs Cards Stream View */}
      {isLoading ? (
        <div className="rounded-2xl border border-border/70 overflow-hidden bg-card p-4 space-y-3">
          <Skeleton className="h-10 w-full rounded-xl" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      ) : totalSubmissionsCount === 0 ? (
        /* Zero Responses State */
        <Card className="flex flex-col items-center justify-center p-8 sm:p-12 text-center border-dashed rounded-2xl bg-card/40">
          <div
            className={`flex size-14 items-center justify-center rounded-2xl ${landingTheme.iconBg} mb-3`}
          >
            <IconInbox className="size-7" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            Awaiting your first respondent
          </h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
            When respondents complete your conversational form, their answers, timestamps, and
            ratings will stream here in real-time.
          </p>

          <div className="mt-5 flex items-center gap-2.5 flex-wrap justify-center">
            {onCopyShareLink && (
              <Button
                type="button"
                size="sm"
                onClick={onCopyShareLink}
                className={`h-8.5 text-xs gap-1.5 ${landingTheme.primaryButton}`}
              >
                <IconCopy className="size-3.5" />
                <span>Copy Share Link</span>
              </Button>
            )}

            {formSlugOrId && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-8.5 text-xs gap-1.5 border-border/70 cursor-pointer"
                title="Open live form in new tab to submit a test response"
              >
                <Link href={`/form/${formSlugOrId}`} target="_blank">
                  <IconExternalLink className="size-3.5" />
                  <span>Submit Test Response</span>
                </Link>
              </Button>
            )}
          </div>
        </Card>
      ) : totalFiltered === 0 ? (
        /* Zero Filter Matches State */
        <Card className="flex flex-col items-center justify-center p-8 text-center border-dashed rounded-2xl bg-card/40">
          <IconSearch className="size-8 text-muted-foreground/60 mb-2" />
          <h4 className="font-semibold text-sm text-foreground">No matching responses found</h4>
          <p className="text-xs text-muted-foreground mt-0.5 max-w-sm">
            No submissions match your search query or selected date filter.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            className="mt-3 h-8 text-xs font-semibold"
          >
            Clear All Filters
          </Button>
        </Card>
      ) : viewMode === "cards" ? (
        /* Cards Stream View (Mobile & Tablet Friendly) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {paginatedSubmissions.map((submission, index) => {
            const valueMap = new Map(
              (submission.values ?? []).map((v) => [v.formFieldId, v.value]),
            );
            const globalIndex = (safeCurrentPage - 1) * pageSize + index + 1;
            const answeredCount = sortedFields.filter((f) => {
              const val = valueMap.get(f.id);
              return val !== undefined && val !== null && String(val).trim() !== "";
            }).length;

            return (
              <Card
                key={submission.id}
                onClick={() => handleOpenDetail(submission.id)}
                className="p-4 rounded-2xl border border-border/70 hover:border-lime-600/40 dark:hover:border-[#ccff00]/40 bg-card hover:bg-muted/20 transition-all cursor-pointer group space-y-3"
              >
                {/* Top: Index, Date, Answered Badge */}
                <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-foreground bg-muted/60 px-2 py-0.5 rounded-md border border-border/50">
                      #{globalIndex}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(submission.createdAt)}
                    </span>
                  </div>

                  <Badge
                    variant="outline"
                    className="text-[10px] font-mono px-1.5 py-0 bg-muted/30 text-muted-foreground"
                  >
                    {answeredCount}/{sortedFields.length} answered
                  </Badge>
                </div>

                {/* Preview of first 2 questions */}
                <div className="space-y-2 text-xs">
                  {sortedFields.slice(0, 2).map((field) => {
                    const val = valueMap.get(field.id);
                    return (
                      <div key={field.id} className="space-y-0.5">
                        <span className="text-muted-foreground text-[11px] block truncate font-medium">
                          {field.label}:
                        </span>
                        <span className="text-foreground font-semibold block truncate">
                          {val !== undefined && val !== "" ? (
                            String(val)
                          ) : (
                            <span className="italic opacity-50">—</span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom: Action hint */}
                <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground group-hover:text-lime-700 dark:group-hover:text-[#ccff00] transition-colors">
                  <span>Click to view all answers</span>
                  <IconArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Spreadsheet Table View (Desktop & Wide Screen) */
        <div className="rounded-2xl border border-border/70 overflow-hidden bg-card shadow-xs">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-border/70 bg-muted/20">
                  <TableHead className="w-14 text-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground py-3 px-3">
                    #
                  </TableHead>
                  <TableHead className="w-44 text-[11px] font-bold uppercase tracking-wider text-muted-foreground py-3 px-4">
                    Submitted Date
                  </TableHead>
                  {sortedFields.map((field) => (
                    <TableHead
                      key={field.id}
                      className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground py-3 px-4 max-w-[240px]"
                    >
                      <span className="truncate block" title={field.label}>
                        {field.label}
                        {field.isRequired && <span className="text-rose-400 ml-0.5">*</span>}
                      </span>
                    </TableHead>
                  ))}
                  <TableHead className="w-20 text-right text-[11px] font-bold uppercase tracking-wider text-muted-foreground py-3 px-4">
                    Inspect
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedSubmissions.map((submission, index) => {
                  const valueMap = new Map(
                    (submission.values ?? []).map((v) => [v.formFieldId, v.value]),
                  );
                  const globalIndex = (safeCurrentPage - 1) * pageSize + index + 1;
                  const isSelected = activeSubmissionId === submission.id && sheetOpen;

                  return (
                    <TableRow
                      key={submission.id}
                      onClick={() => handleOpenDetail(submission.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? "bg-lime-500/10 dark:bg-[#CCFF00]/10" : "hover:bg-muted/40"
                      }`}
                      title="Click to inspect complete conversational answers"
                    >
                      {/* Row Index Number */}
                      <TableCell className="text-center font-mono text-xs text-muted-foreground py-3 px-3 font-semibold">
                        #{globalIndex}
                      </TableCell>

                      {/* Submitted Date */}
                      <TableCell
                        className="text-muted-foreground text-xs whitespace-nowrap font-mono py-3 px-4"
                        suppressHydrationWarning
                      >
                        {submission.createdAt
                          ? new Date(submission.createdAt).toLocaleString([], {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </TableCell>

                      {/* Fields columns */}
                      {sortedFields.map((field) => {
                        const val = valueMap.get(field.id);
                        return (
                          <TableCell
                            key={field.id}
                            className="text-xs sm:text-sm py-3 px-4 text-foreground max-w-[220px]"
                          >
                            {val !== undefined && val !== "" ? (
                              field.type === "RATING" ? (
                                <span className="inline-flex items-center gap-1 font-semibold text-amber-400">
                                  <IconStarFilled className="size-3.5 fill-amber-400" />
                                  <span>{val} / 5</span>
                                </span>
                              ) : (
                                <span className="truncate block max-w-[200px]" title={String(val)}>
                                  {String(val)}
                                </span>
                              )
                            ) : (
                              <span className="text-muted-foreground/40 italic">—</span>
                            )}
                          </TableCell>
                        );
                      })}

                      {/* Right Inspect Action Pill */}
                      <TableCell className="text-right py-3 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-muted-foreground hover:text-lime-400 font-semibold gap-1"
                        >
                          <span>View</span>
                          <IconArrowRight className="size-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* 3. Pagination Footer */}
      {!isLoading && totalFiltered > 0 && (
        <SubmissionsPagination
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalFiltered}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
        />
      )}

      {/* 4. Slide-Over Detail Sheet for inspecting full respondent answers */}
      <SubmissionDetailSheet
        submission={activeSubmission}
        fields={sortedFields}
        formTitle={formTitle}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        currentIndex={activeIndex}
        totalSubmissions={filteredSubmissions.length}
        onNext={activeIndex < filteredSubmissions.length - 1 ? handleNextSubmission : undefined}
        onPrevious={activeIndex > 0 ? handlePreviousSubmission : undefined}
      />
    </div>
  );
}
