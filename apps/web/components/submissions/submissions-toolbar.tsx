"use client";

import { useEffect, useRef } from "react";
import {
  IconSearch,
  IconX,
  IconDownload,
  IconCalendar,
  IconRotate2,
  IconTable,
  IconLayoutList,
  IconFileSpreadsheet,
  IconFileCode,
  IconChevronDown,
} from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { landingTheme } from "~/config/landing-theme";

export type DatePreset = "ALL" | "TODAY" | "7D" | "30D" | "CUSTOM";

export interface SubmissionsToolbarProps {
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
  onExportJson?: () => void;
  viewMode?: "table" | "cards";
  onViewModeChange?: (mode: "table" | "cards") => void;
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
  onExportJson,
  viewMode = "table",
  onViewModeChange,
}: SubmissionsToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isFiltered =
    searchQuery.trim() !== "" || datePreset !== "ALL" || startDate !== "" || endDate !== "";

  // Keyboard shortcut: Pressing "/" focuses search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm p-3.5 sm:p-4 shadow-2xs">
      {/* Top Row: Search Input + Results Badge + View Toggle + Export Menu */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            ref={inputRef}
            placeholder="Search answers across all questions... (Press '/' to focus)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-14 h-9 text-xs bg-muted/20 border-border/60 focus-visible:ring-lime-500/30"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded cursor-pointer"
              title="Clear search"
            >
              <IconX className="size-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground bg-muted/60 border border-border/60 px-1.5 py-0.2 rounded">
              /
            </kbd>
          )}
        </div>

        {/* Right Controls: Matching Count, View Mode Switch, Export Menu */}
        <div className="flex items-center justify-between sm:justify-start gap-2 flex-wrap">
          {/* Results Badge */}
          <div className="flex items-center gap-1.5 text-xs">
            {isFiltered ? (
              <Badge
                variant="outline"
                className="font-mono text-[10px] gap-1 bg-lime-500/10 text-lime-700 dark:text-[#ccff00] border-lime-600/30 dark:border-[#ccff00]/30 font-semibold"
              >
                {filteredCount} of {totalCount}
              </Badge>
            ) : (
              <span className="text-[11px] text-muted-foreground font-mono hidden md:inline">
                {totalCount} responses
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Reset Filters Button */}
            {isFiltered && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetFilters}
                className="h-8 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
                title="Reset all search and date filters"
              >
                <IconRotate2 className="size-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
            )}

            {/* View Mode Toggle (Table vs Cards Feed) */}
            {onViewModeChange && (
              <div className="inline-flex items-center rounded-lg border border-border/70 bg-muted/30 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => onViewModeChange("table")}
                  className={`size-7 rounded-md flex items-center justify-center transition-all cursor-pointer ${
                    viewMode === "table"
                      ? "bg-background text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Spreadsheet Table View"
                >
                  <IconTable className="size-3.5" />
                  <span className="sr-only">Table View</span>
                </button>
                <button
                  type="button"
                  onClick={() => onViewModeChange("cards")}
                  className={`size-7 rounded-md flex items-center justify-center transition-all cursor-pointer ${
                    viewMode === "cards"
                      ? "bg-background text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Respondent Cards Stream View"
                >
                  <IconLayoutList className="size-3.5" />
                  <span className="sr-only">Cards View</span>
                </button>
              </div>
            )}

            {/* Export Dropdown (CSV / JSON) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={filteredCount === 0}
                  className={`h-8 px-2.5 text-xs gap-1.5 border-border/70 ${landingTheme.buttonOutlineHover} cursor-pointer`}
                  title="Export filtered submissions to file"
                >
                  <IconDownload className="size-3.5" />
                  <span className="hidden sm:inline">Export</span>
                  <IconChevronDown className="size-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 p-1.5 rounded-xl border border-border/70 bg-card"
              >
                <DropdownMenuItem
                  onClick={onExportCsv}
                  className="text-xs flex items-center gap-2 cursor-pointer py-2 rounded-lg"
                >
                  <IconFileSpreadsheet className="size-4 text-emerald-400" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">Export as CSV</span>
                    <span className="text-[10px] text-muted-foreground">
                      Excel, Google Sheets, Airtable
                    </span>
                  </div>
                </DropdownMenuItem>
                {onExportJson && (
                  <DropdownMenuItem
                    onClick={onExportJson}
                    className="text-xs flex items-center gap-2 cursor-pointer py-2 rounded-lg"
                  >
                    <IconFileCode className="size-4 text-lime-600 dark:text-[#ccff00]" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">Export as JSON</span>
                      <span className="text-[10px] text-muted-foreground">
                        Formatted structured payload
                      </span>
                    </div>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Bottom Row: Date Range Quick Filters & Custom Pickers */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5 pt-2.5 border-t border-border/50 text-xs">
        {/* Quick Date Segmented Tabs */}
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-muted-foreground mr-1 flex items-center gap-1 text-[11px]">
            <IconCalendar className="size-3.5" />
            <span>Timeline:</span>
          </span>

          <div className="inline-flex items-center rounded-lg border border-border/70 bg-muted/30 p-0.5 text-xs">
            {(
              [
                { id: "ALL", label: "All Time" },
                { id: "TODAY", label: "Today" },
                { id: "7D", label: "Last 7D" },
                { id: "30D", label: "Last 30D" },
                { id: "CUSTOM", label: "Custom Range" },
              ] as { id: DatePreset; label: string }[]
            ).map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset.id)}
                className={`px-2 sm:px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                  datePreset === preset.id
                    ? `bg-background text-foreground shadow-xs font-semibold ${landingTheme.primaryText}`
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Start & End Date Inputs (Shown when CUSTOM is selected) */}
        {datePreset === "CUSTOM" && (
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto bg-muted/30 p-1.5 rounded-xl border border-border/60 animate-in fade-in duration-200">
            <div className="flex items-center gap-1.5 flex-1 min-w-[120px]">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                From:
              </span>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="h-7 text-xs w-full px-2 bg-background border-border/60"
              />
            </div>
            <div className="flex items-center gap-1.5 flex-1 min-w-[120px]">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">To:</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="h-7 text-xs w-full px-2 bg-background border-border/60"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
