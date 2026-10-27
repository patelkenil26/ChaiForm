"use client";

import { useMemo, useState } from "react";
import { SearchXIcon, StarIcon } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { SubmissionsToolbar, type DatePreset } from "./submissions-toolbar";
import { SubmissionsPagination } from "./submissions-pagination";
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
}

export function SubmissionsTable({
  fields,
  submissions,
  isLoading,
  formTitle,
}: SubmissionsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [datePreset, setDatePreset] = useState<DatePreset>("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalSubmissionsCount = submissions?.length ?? 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Show Toolbar if not loading and has data */}
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
        />
      )}

      {/* Main Table Container */}
      <div className="rounded-xl border overflow-hidden bg-card shadow-xs">
        <Table>
          <TableHeader className="bg-muted/60">
            <TableRow>
              <TableHead className="w-44 font-semibold">Submitted At</TableHead>
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <TableHead key={i}>
                      <Skeleton className="h-4 w-24" />
                    </TableHead>
                  ))
                : sortedFields.map((field) => (
                    <TableHead key={field.id} className="font-semibold">
                      {field.label}
                      {field.isRequired && <span className="text-destructive ml-0.5">*</span>}
                    </TableHead>
                  ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  {Array.from({ length: 3 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : totalSubmissionsCount === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={sortedFields.length + 1}
                  className="h-32 text-center text-muted-foreground"
                >
                  <p className="font-medium text-sm">No responses submitted yet.</p>
                  <p className="text-xs text-muted-foreground/80 mt-1">
                    Share your form link with respondents to begin collecting answers.
                  </p>
                </TableCell>
              </TableRow>
            ) : totalFiltered === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={sortedFields.length + 1}
                  className="h-36 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <SearchXIcon className="size-6 text-muted-foreground/60" />
                    <p className="font-medium text-sm text-foreground">
                      No matching responses found
                    </p>
                    <p className="text-xs text-muted-foreground">
                      No submissions match your search query or selected date range.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResetFilters}
                      className="mt-1 h-7 text-xs"
                    >
                      Clear all filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedSubmissions.map((submission) => {
                const valueMap = new Map(
                  (submission.values ?? []).map((v) => [v.formFieldId, v.value]),
                );

                return (
                  <TableRow key={submission.id} className="hover:bg-muted/40 transition-colors">
                    <TableCell
                      className="text-muted-foreground text-sm whitespace-nowrap font-mono text-xs"
                      suppressHydrationWarning
                    >
                      {submission.createdAt
                        ? new Date(submission.createdAt).toLocaleString([], {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "—"}
                    </TableCell>
                    {sortedFields.map((field) => {
                      const val = valueMap.get(field.id);
                      return (
                        <TableCell key={field.id} className="text-sm">
                          {val !== undefined && val !== "" ? (
                            field.type === "RATING" ? (
                              <span
                                className={`inline-flex items-center gap-1 font-medium ${landingTheme.iconColor}`}
                              >
                                <StarIcon
                                  className={`size-3.5 fill-current ${landingTheme.iconColor}`}
                                />
                                <span>{val} / 5</span>
                              </span>
                            ) : (
                              val
                            )
                          ) : (
                            <span className="text-muted-foreground/40 italic">—</span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
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
    </div>
  );
}
