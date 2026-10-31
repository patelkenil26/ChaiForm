"use client";

import { useState } from "react";
import { IconCheck, IconCopy, IconCode } from "@tabler/icons-react";
import { Button } from "~/components/ui/button";

export interface CodeEditorTab {
  id: string;
  label: string;
  fileName: string;
  language: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  rawCode: string;
  renderedLines?: React.ReactNode[];
}

export interface CodeEditorWindowProps {
  title?: string;
  titleIcon?: React.ComponentType<{ className?: string }>;
  tabs: CodeEditorTab[];
  activeTabId: string;
  onTabChange: (id: string) => void;
  className?: string;
}

/**
 * Reusable Production-Grade Code Editor Mock Window
 * Features:
 * - macOS window traffic lights
 * - Tab switcher with file metadata (filename, language, icon)
 * - Non-selectable line numbers gutter with hover highlight
 * - 1-Click clipboard copy with feedback
 * - IDE status footer (encoding, line count, language)
 */
export function CodeEditorWindow({
  title = "Code Snippet",
  titleIcon: TitleIcon = IconCode,
  tabs,
  activeTabId,
  onTabChange,
  className = "",
}: CodeEditorWindowProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];
  if (!activeTab) return null;

  const FileIcon = activeTab.icon ?? IconCode;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeTab.rawCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy snippet:", err);
    }
  };

  // Generate fallback line tokens if custom renderedLines not provided
  const lines: React.ReactNode[] =
    activeTab.renderedLines && activeTab.renderedLines.length > 0
      ? activeTab.renderedLines
      : activeTab.rawCode.split("\n").map((line, idx) => (
          <span key={idx} className="text-zinc-200">
            {line || " "}
          </span>
        ));

  return (
    <div
      className={`rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden relative ${className}`}
    >
      {/* Top Chamfered Light Sheen */}
      <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-lime-600/70 dark:via-[#CCFF00]/80 to-transparent" />

      {/* Top Bar with Platform Switcher */}
      <div className="flex flex-wrap items-center justify-between p-3.5 sm:p-4 border-b border-border/80 bg-muted/40 gap-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <TitleIcon className="size-4 text-lime-800 dark:text-[#CCFF00]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
            {title}
          </span>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center p-1 rounded-xl bg-card border border-border/70 text-xs">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-lime-600 to-emerald-600 dark:from-[#CCFF00] dark:to-[#B8E600] text-white dark:text-[#0A0B0D] font-bold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Copy Button */}
        <Button
          size="sm"
          onClick={handleCopy}
          className="bg-card hover:bg-muted text-foreground border border-border font-mono text-xs gap-1.5 cursor-pointer h-8 shadow-xs"
        >
          {copied ? (
            <>
              <IconCheck className="size-3.5 text-emerald-500" />
              <span className="text-emerald-500 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <IconCopy className="size-3.5" />
              <span>Copy Snippet</span>
            </>
          )}
        </Button>
      </div>

      {/* IDE Window Frame */}
      <div className="bg-[#0B0D13] border-t border-white/5 text-zinc-100 flex flex-col">
        {/* Editor Tab Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06] bg-[#07090D] select-none">
          <div className="flex items-center gap-3">
            {/* macOS traffic light controls */}
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="size-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="size-2.5 rounded-full bg-emerald-500/80 inline-block" />
            </div>

            {/* Active File Tab */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-[#0F131C] border border-white/10 text-xs font-mono text-zinc-200 shadow-xs">
              <FileIcon className={`size-3.5 ${activeTab.iconColor ?? "text-lime-400"}`} />
              <span>{activeTab.fileName}</span>
              <span className="size-1.5 rounded-full bg-lime-400 ml-1" />
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-zinc-500">
            <span>UTF-8</span>
            <span>•</span>
            <span className="text-zinc-400">{activeTab.language}</span>
          </div>
        </div>

        {/* Code Body with Line Numbers Gutter */}
        <div className="py-4 font-mono text-xs leading-6 overflow-x-auto selection:bg-lime-500/30 selection:text-white">
          {lines.map((lineContent, index) => (
            <div
              key={index}
              className="flex items-baseline px-4 py-0.5 hover:bg-white/[0.04] transition-colors group"
            >
              {/* Line Number Gutter */}
              <span className="w-8 shrink-0 text-right pr-4 text-zinc-600 group-hover:text-zinc-400 select-none font-mono text-xs">
                {index + 1}
              </span>

              {/* Tokenized Syntax Content */}
              <span className="whitespace-pre overflow-x-auto">{lineContent}</span>
            </div>
          ))}
        </div>

        {/* Editor Status Bar */}
        <div className="flex items-center justify-between px-4 py-1.5 border-t border-white/[0.06] bg-[#07090D] text-[10px] font-mono text-zinc-500 select-none">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <IconCheck className="size-3" />
              <span>Prettier Ready</span>
            </span>
            <span>•</span>
            <span>Spaces: 2</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Ln {lines.length}, Col 1</span>
            <span>•</span>
            <span>LF</span>
          </div>
        </div>
      </div>
    </div>
  );
}
