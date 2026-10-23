"use client";

import { SearchIcon, XIcon, DownloadIcon, CalendarIcon, RotateCcwIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";

export type DatePreset = "ALL" | "TODAY" | "7D" | "30D" | "CUSTOM";

interface SubmissionsToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  datePreset: DatePreset;
  onSelectPreset: (preset: DatePreset) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  totalCount: number;
  filteredCount: number;
  onResetFilters: () => void;
  onExportCsv: () => void;
}

export function SubmissionsToolbar({
  searchQuery,
  onSearchChange,
  datePreset,
  onSelectPreset,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  totalCount,
  filteredCount,
  onResetFilters,
  onExportCsv,
}: SubmissionsToolbarProps) {
  const isFiltered =
    searchQuery.trim() !== "" || datePreset !== "ALL" || startDate !== "" || endDate !== "";

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card/60 backdrop-blur-sm p-4 shadow-2xs">
      {/* Top Row: Search Box & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search responses across all answers..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-8 h-9 text-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              title="Clear search"
            >
              <XIcon className="size-3.5" />
            </button>
          )}
        </div>

        {/* Right Actions: Counts & Export Button */}
        <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Badge variant="outline" className="font-mono text-[11px] gap-1">
              {totalCount} Total
            </Badge>
            {isFiltered && (
              <Badge
                variant="secondary"
                className="font-mono text-[11px] gap-1 bg-primary/10 text-primary border-primary/20"
              >
                {filteredCount} Matching
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isFiltered && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetFilters}
                className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <RotateCcwIcon className="size-3" />
                Reset
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={onExportCsv}
              disabled={filteredCount === 0}
              className="h-8 text-xs gap-1.5"
              title="Download CSV file of responses"
            >
              <DownloadIcon className="size-3.5" />
              <span>Export CSV</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Date Range Quick Filters & Custom Pickers */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pt-2 border-t text-xs">
        {/* Quick Date Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-muted-foreground mr-1 flex items-center gap-1">
            <CalendarIcon className="size-3.5" />
            Date:
          </span>

          <Button
            type="button"
            variant={datePreset === "ALL" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onSelectPreset("ALL")}
            className="h-7 px-2 text-xs rounded-md"
          >
            All Time
          </Button>

          <Button
            type="button"
            variant={datePreset === "TODAY" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onSelectPreset("TODAY")}
            className="h-7 px-2 text-xs rounded-md"
          >
            Today
          </Button>

          <Button
            type="button"
            variant={datePreset === "7D" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onSelectPreset("7D")}
            className="h-7 px-2 text-xs rounded-md"
          >
            7D
          </Button>

          <Button
            type="button"
            variant={datePreset === "30D" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onSelectPreset("30D")}
            className="h-7 px-2 text-xs rounded-md"
          >
            30D
          </Button>

          <Button
            type="button"
            variant={datePreset === "CUSTOM" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onSelectPreset("CUSTOM")}
            className="h-7 px-2 text-xs rounded-md"
          >
            Custom
          </Button>
        </div>

        {/* Custom Start & End Date Inputs (Shown when CUSTOM is selected) */}
        {datePreset === "CUSTOM" && (
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto bg-muted/40 p-1.5 rounded-lg border">
            <div className="flex items-center gap-1.5 flex-1 min-w-[120px]">
              <span className="text-[11px] text-muted-foreground">From:</span>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="h-7 text-xs w-full px-2"
              />
            </div>
            <div className="flex items-center gap-1.5 flex-1 min-w-[120px]">
              <span className="text-[11px] text-muted-foreground">To:</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="h-7 text-xs w-full px-2"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
