"use client";

import { useState } from "react";
import {
  IconFileSpreadsheet,
  IconBrandSlack,
  IconWebhook,
  IconMail,
  IconBrandNextjs,
  IconWorld,
  IconSparkles,
  IconCode,
} from "@tabler/icons-react";
import { Badge } from "~/components/ui/badge";
import { CodeEditorWindow } from "~/components/common/code-editor-window";
import { EMBED_TABS_CONFIG } from "./integrations/snippets-data";

const ECOSYSTEM_TOOLS = [
  { name: "Google Sheets", desc: "1-Click CSV sync", icon: IconFileSpreadsheet },
  { name: "Slack", desc: "Instant lead pings", icon: IconBrandSlack },
  { name: "Webhooks", desc: "Realtime JSON stream", icon: IconWebhook },
  { name: "Email Alerts", desc: "Instant submissions dispatch", icon: IconMail },
  { name: "Next.js & React", desc: "Native clean embed", icon: IconBrandNextjs },
  { name: "Webflow & Framer", desc: "Zero iframe resizing bugs", icon: IconWorld },
] as const;

export function IntegrationsSection() {
  const [embedTab, setEmbedTab] = useState<string>("nextjs");

  return (
    <section
      id="integrations"
      className="py-20 md:py-28 relative bg-background text-foreground border-t border-border/40 overflow-hidden"
    >
      {/* Ambient Atmospheric Light Beam */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex flex-col items-center overflow-hidden">
        <div className="h-64 w-[85%] max-w-4xl rounded-full bg-gradient-to-b from-lime-500/10 via-emerald-500/5 to-transparent dark:from-[#CCFF00]/12 dark:via-[#CCFF00]/3 dark:to-transparent blur-[120px] -translate-y-1/2" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge
            variant="outline"
            className="text-xs px-3.5 py-1 border-lime-600/30 dark:border-[#CCFF00]/30 bg-gradient-to-r from-lime-500/10 via-emerald-500/10 to-lime-500/5 dark:from-[#CCFF00]/15 dark:via-[#CCFF00]/10 dark:to-[#CCFF00]/5 text-lime-800 dark:text-[#CCFF00] gap-1.5 mb-4 shadow-xs font-semibold"
          >
            <IconSparkles className="size-3.5" />
            <span>Developer Friendly &amp; Embeddable</span>
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-b from-foreground via-foreground/95 to-foreground/75 bg-clip-text text-transparent">
              Embed anywhere.{" "}
            </span>
            <span className="bg-gradient-to-r from-lime-600 via-emerald-600 to-lime-700 dark:from-[#CCFF00] dark:via-[#E2FF66] dark:to-[#A3E635] bg-clip-text text-transparent">
              Export to everything.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Drop your conversational form into Next.js, Webflow, or Framer with a 1-line snippet.
            Verified responses stream automatically into your spreadsheet or backend.
          </p>
        </div>

        {/* Modular Code Editor Studio Component */}
        <CodeEditorWindow
          title="Embed Snippet Generator"
          titleIcon={IconCode}
          tabs={EMBED_TABS_CONFIG}
          activeTabId={embedTab}
          onTabChange={setEmbedTab}
          className="mb-16"
        />

        {/* Ecosystem Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {ECOSYSTEM_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.name}
                className="rounded-xl border border-border/80 bg-card p-4 text-center flex flex-col items-center justify-center hover:border-lime-600/40 dark:hover:border-[#CCFF00]/40 transition-colors group shadow-xs"
              >
                <div className="size-9 rounded-lg bg-muted border border-border/70 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                  <Icon className="size-5 text-muted-foreground group-hover:text-lime-800 dark:group-hover:text-[#CCFF00] transition-colors" />
                </div>
                <div className="font-semibold text-xs text-foreground">{tool.name}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{tool.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
