"use client";

import React, { useState } from "react";
import {
  CodeIcon,
  CopyIcon,
  CheckIcon,
  SparklesIcon,
  LayersIcon,
  SunIcon,
  MoonIcon,
  HelpCircleIcon,
  ExternalLinkIcon,
  EyeIcon,
  SmartphoneIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { landingTheme } from "~/config/landing-theme";

export interface EmbedCodeTabProps {
  url: string;
  title: string;
  slug?: string | null;
}

export function EmbedCodeTab({ url, title, slug }: EmbedCodeTabProps) {
  const [embedMode, setEmbedMode] = useState<"responsive" | "iframe">("responsive");
  const [theme, setTheme] = useState<"transparent" | "dark" | "light">("transparent");
  const [hideTitle, setHideTitle] = useState(false);
  const [height] = useState<"600" | "700" | "500">("600");
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeGuide, setActiveGuide] = useState<"html" | "wordpress" | "webflow">("html");

  // Construct dynamic embed query parameters
  const queryParams = new URLSearchParams();
  queryParams.set("embed", "true");
  if (theme !== "dark") {
    queryParams.set("theme", theme);
  }
  if (hideTitle) {
    queryParams.set("hide_title", "true");
  }

  const embedUrl = `${url}?${queryParams.toString()}`;

  // Generate clean, production-grade embed snippet with clean multi-line formatting
  const generatedCode =
    embedMode === "responsive"
      ? `<!-- ChaiForm Embed (Fluid & Responsive with Auto-Resize) -->\n<iframe\n  src="${embedUrl}"\n  width="100%"\n  height="${height}"\n  style="border: none; width: 100%; min-height: 480px; overflow: hidden;"\n  allow="camera; microphone; clipboard-write"\n></iframe>\n<script src="https://chaiform.kenilpatel.in/embed.js" async></script>`
      : `<!-- ChaiForm Standard Iframe -->\n<iframe\n  src="${embedUrl}"\n  width="100%"\n  height="${height}"\n  frameborder="0"\n  style="border: none; width: 100%; min-height: 500px;"\n  allow="camera; microphone; clipboard-write"\n></iframe>`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      toast.success("Embed code copied to clipboard!");
      setTimeout(() => setCopied(false), 2200);
    } catch {
      toast.error("Failed to copy code. Please select and copy manually.");
    }
  };

  return (
    <div className="space-y-4 pt-1 text-left w-full max-w-full overflow-hidden">
      {/* Live Auto-Sync Banner */}
      <div
        className={`flex items-start gap-2.5 p-3 rounded-xl border ${landingTheme.callout.border} ${landingTheme.callout.bg} text-xs ${landingTheme.callout.text}`}
      >
        <SparklesIcon className={`size-4 ${landingTheme.callout.accent} shrink-0 mt-0.5`} />
        <div className="min-w-0 flex-1 leading-relaxed">
          <span className={`font-semibold ${landingTheme.callout.accent}`}>
            Live Auto-Sync Enabled:{" "}
          </span>
          Paste this snippet once into your website. Whenever you edit questions or settings in
          ChaiForm, your live website updates automatically without touching its code again!
        </div>
      </div>

      {/* Embed Configuration Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl border border-border/70 bg-card/60 backdrop-blur-xs w-full min-w-0">
        {/* Theme Mode Selector */}
        <div className="space-y-1.5 min-w-0">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <LayersIcon className="size-3" /> Background Theme
          </label>
          <div className="grid grid-cols-3 gap-1 p-1 bg-muted/60 rounded-lg border border-border/40 text-xs">
            <button
              type="button"
              onClick={() => setTheme("transparent")}
              className={`py-1.5 px-1 sm:px-2 rounded-md text-[11px] sm:text-xs font-medium transition cursor-pointer flex items-center justify-center gap-1 ${
                theme === "transparent"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Inherits your host website's exact background color"
            >
              <span>Auto/Clear</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`py-1.5 px-1 sm:px-2 rounded-md text-[11px] sm:text-xs font-medium transition cursor-pointer flex items-center justify-center gap-1 ${
                theme === "dark"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MoonIcon className="size-3 shrink-0" />
              <span>Dark</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`py-1.5 px-1 sm:px-2 rounded-md text-[11px] sm:text-xs font-medium transition cursor-pointer flex items-center justify-center gap-1 ${
                theme === "light"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <SunIcon className="size-3 shrink-0" />
              <span>Light</span>
            </button>
          </div>
        </div>

        {/* Embed Mode */}
        <div className="space-y-1.5 min-w-0">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <CodeIcon className="size-3" /> Embed Engine
          </label>
          <div className="grid grid-cols-2 gap-1 p-1 bg-muted/60 rounded-lg border border-border/40 text-xs">
            <button
              type="button"
              onClick={() => setEmbedMode("responsive")}
              className={`py-1.5 px-2 rounded-md text-[11px] sm:text-xs font-medium transition cursor-pointer flex items-center justify-center gap-1 ${
                embedMode === "responsive"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Auto-Resize</span>
            </button>
            <button
              type="button"
              onClick={() => setEmbedMode("iframe")}
              className={`py-1.5 px-2 rounded-md text-[11px] sm:text-xs font-medium transition cursor-pointer flex items-center justify-center gap-1 ${
                embedMode === "iframe"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Pure Iframe</span>
            </button>
          </div>
        </div>

        {/* Title Visibility Toggle */}
        <div className="space-y-1 sm:col-span-2 flex items-center justify-between gap-3 pt-2.5 border-t border-border/40 min-w-0">
          <div className="min-w-0 pr-2">
            <div className="text-xs font-semibold text-foreground">Hide Form Title in Embed</div>
            <div className="text-[11px] text-muted-foreground leading-tight">
              Turn on if your website already has its own heading above the form.
            </div>
          </div>
          <button
            type="button"
            onClick={() => setHideTitle(!hideTitle)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              hideTitle ? landingTheme.primaryButton : "bg-muted"
            }`}
          >
            <span
              className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                hideTitle ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Code Snippet Box */}
      <div className="space-y-2 w-full min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-mono px-2 py-0.5">
              HTML Snippet
            </Badge>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Paste directly into your web page
            </span>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={handleCopyCode}
            className={`h-7 px-3 text-xs gap-1.5 cursor-pointer font-medium ${
              copied ? "bg-emerald-600 text-white hover:bg-emerald-600" : landingTheme.primaryButton
            }`}
          >
            {copied ? (
              <>
                <CheckIcon className="size-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <CopyIcon className="size-3.5" />
                <span>Copy Embed Code</span>
              </>
            )}
          </Button>
        </div>

        {/* Clean, Non-Overflowing Pre Code Box */}
        <div className="relative rounded-xl border border-border/80 bg-neutral-950 p-3 font-mono text-[11px] text-zinc-300 leading-relaxed overflow-hidden shadow-inner w-full min-w-0">
          <pre
            className={`whitespace-pre-wrap break-all break-words font-mono text-[11px] text-zinc-300 ${landingTheme.selection}`}
          >
            {generatedCode}
          </pre>
        </div>

        {/* Live Preview & Direct Link Bar */}
        <div className="flex items-center justify-between pt-0.5 px-0.5 text-xs text-muted-foreground">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1.5 hover:text-foreground cursor-pointer transition font-medium"
          >
            <EyeIcon className={`size-3.5 ${landingTheme.iconColor}`} />
            <span>{showPreview ? "Hide Preview" : "Preview Embedded Form"}</span>
          </button>
          <a
            href={embedUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:text-primary transition"
          >
            <span>Open preview tab</span>
            <ExternalLinkIcon className="size-3" />
          </a>
        </div>

        {/* Embedded Iframe Preview Simulator */}
        {showPreview && (
          <div
            className={`rounded-xl border border-border/80 p-3 overflow-hidden transition-all shadow-md ${
              theme === "light"
                ? "bg-white text-neutral-900 border-neutral-300"
                : theme === "dark"
                  ? "bg-neutral-950 text-white"
                  : "bg-neutral-900 text-neutral-100"
            }`}
          >
            <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-wider text-muted-foreground mb-2 pb-1.5 border-b border-border/40">
              <span className="flex items-center gap-1">
                <SmartphoneIcon className="size-3" />
                Live Embedded Mockup
              </span>
              <span>Theme: {theme}</span>
            </div>
            <div className="w-full h-72 rounded-lg overflow-y-auto bg-transparent">
              <iframe
                src={embedUrl}
                title={`Preview of ${title}`}
                className="w-full h-full border-none bg-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Platform Instructions Guide */}
      <div className="rounded-xl border border-border/60 bg-muted/30 p-3 text-xs w-full min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <HelpCircleIcon className="size-3.5 text-muted-foreground shrink-0" />
            <span>Quick Setup Guide:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setActiveGuide("html")}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition cursor-pointer ${
                activeGuide === "html"
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Plain HTML
            </button>
            <button
              type="button"
              onClick={() => setActiveGuide("wordpress")}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition cursor-pointer ${
                activeGuide === "wordpress"
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              WordPress
            </button>
            <button
              type="button"
              onClick={() => setActiveGuide("webflow")}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition cursor-pointer ${
                activeGuide === "webflow"
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Webflow / Framer
            </button>
          </div>
        </div>

        <div className="text-muted-foreground text-[11px] leading-relaxed break-words">
          {activeGuide === "html" && (
            <p>
              Paste the code inside your HTML container (e.g. inside a{" "}
              <code className="text-foreground bg-muted px-1 py-0.5 rounded">&lt;section&gt;</code>{" "}
              or <code className="text-foreground bg-muted px-1 py-0.5 rounded">&lt;div&gt;</code>)
              where you want the form to appear.
            </p>
          )}
          {activeGuide === "wordpress" && (
            <p>
              In Gutenberg or Elementor, add a <strong>&quot;Custom HTML&quot;</strong> block and
              paste this snippet into it. Publish or update your page.
            </p>
          )}
          {activeGuide === "webflow" && (
            <p>
              Drag an <strong>&quot;Embed&quot;</strong> component into your Webflow/Framer section,
              paste this snippet into the HTML editor, and hit Save &amp; Publish.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
