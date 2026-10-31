"use client";

import { useState } from "react";
import {
  IconQrcode,
  IconSparkles,
  IconTerminal2,
  IconForms,
  IconLock,
  IconKeyboard,
  IconCheck,
} from "@tabler/icons-react";
import { Badge } from "~/components/ui/badge";

export function FeaturesBentoSection() {
  // Interactive QR Studio state
  const [selectedQrColor, setSelectedQrColor] = useState<string>("#16a34a");

  const qrColorOptions = [
    {
      label: "Acid Citron",
      hex: "#65a30d",
      darkHex: "#CCFF00",
      ring: "ring-lime-600 dark:ring-[#CCFF00]",
    },
    { label: "Cyber Sky", hex: "#0284c7", darkHex: "#38BDF8", ring: "ring-sky-500" },
    { label: "Emerald Mint", hex: "#059669", darkHex: "#10B981", ring: "ring-emerald-500" },
    { label: "Classic Dark", hex: "#18181b", darkHex: "#FFFFFF", ring: "ring-foreground" },
  ];

  return (
    <section
      id="features"
      className="py-20 md:py-28 relative bg-background text-foreground border-t border-border/40 overflow-hidden"
    >
      {/* Ambient Atmospheric Light Beam */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex flex-col items-center overflow-hidden">
        <div className="h-64 w-[80%] max-w-4xl rounded-full bg-gradient-to-b from-lime-500/10 via-emerald-500/5 to-transparent dark:from-[#CCFF00]/12 dark:via-[#CCFF00]/3 dark:to-transparent blur-[120px] -translate-y-1/2" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Metallic & Citron Text Gradients */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge
            variant="outline"
            className="text-xs px-3.5 py-1 border-lime-600/30 dark:border-[#CCFF00]/30 bg-gradient-to-r from-lime-500/10 via-emerald-500/10 to-lime-500/5 dark:from-[#CCFF00]/15 dark:via-[#CCFF00]/10 dark:to-[#CCFF00]/5 text-lime-800 dark:text-[#CCFF00] gap-1.5 mb-4 shadow-xs font-medium"
          >
            <IconSparkles className="size-3.5" />
            <span>Living Micro-Tools</span>
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-b from-foreground via-foreground/95 to-foreground/75 bg-clip-text text-transparent">
              Engineered for high engagement &amp;{" "}
            </span>
            <span className="bg-gradient-to-r from-lime-600 via-emerald-600 to-lime-700 dark:from-[#CCFF00] dark:via-[#E2FF66] dark:to-[#A3E635] bg-clip-text text-transparent">
              zero drop-off.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Everything you need to craft viral conversational surveys, print high-res QR codes, and
            stream automated webhook payloads to your stack.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* WIDGET 1: Interactive Live QR Code Studio (Spans 2 cols on md) */}
          <div className="md:col-span-2 rounded-2xl border border-border/80 bg-card p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-lime-600/40 dark:hover:border-[#CCFF00]/40 transition-all duration-300 shadow-xs">
            {/* Top Chamfered Light Sheen */}
            <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-lime-600/60 dark:via-[#CCFF00]/70 to-transparent opacity-75 group-hover:opacity-100 transition-opacity" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-gradient-to-br from-lime-500/20 to-emerald-500/10 dark:from-[#CCFF00]/20 dark:to-[#CCFF00]/5 text-lime-800 dark:text-[#CCFF00] border border-lime-600/30 dark:border-[#CCFF00]/30 flex items-center justify-center">
                    <IconQrcode className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground tracking-tight">
                      Interactive QR Code Studio
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Print-ready 1024px vector SVG &amp; PNG
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] font-mono border-border text-muted-foreground"
                >
                  Interactive Widget
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mb-6">
                Print ready-to-scan QR codes directly on conference badges, restaurant tables, or
                presentation slides. Custom brand recoloring built right in.
              </p>

              {/* Live QR Customizer Card */}
              <div className="rounded-xl border border-border bg-muted/40 p-5 flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* SVG QR Code Simulation */}
                <div className="p-3.5 rounded-xl bg-card border border-border shadow-xs flex flex-col items-center">
                  <div className="size-36 p-2 rounded-lg bg-white flex items-center justify-center shadow-xs">
                    {/* Simulated High-Density QR SVG Matrix */}
                    <svg
                      viewBox="0 0 100 100"
                      className="size-full"
                      style={{ color: selectedQrColor }}
                    >
                      <rect width="100" height="100" fill="#ffffff" />
                      {/* Corner 1 */}
                      <rect x="10" y="10" width="24" height="24" rx="3" fill="currentColor" />
                      <rect x="14" y="14" width="16" height="16" rx="2" fill="#ffffff" />
                      <rect x="18" y="18" width="8" height="8" rx="1" fill="currentColor" />
                      {/* Corner 2 */}
                      <rect x="66" y="10" width="24" height="24" rx="3" fill="currentColor" />
                      <rect x="70" y="14" width="16" height="16" rx="2" fill="#ffffff" />
                      <rect x="74" y="18" width="8" height="8" rx="1" fill="currentColor" />
                      {/* Corner 3 */}
                      <rect x="10" y="66" width="24" height="24" rx="3" fill="currentColor" />
                      <rect x="14" y="70" width="16" height="16" rx="2" fill="#ffffff" />
                      <rect x="18" y="74" width="8" height="8" rx="1" fill="currentColor" />
                      {/* Data Pattern Nodes */}
                      <rect x="42" y="12" width="6" height="6" fill="currentColor" />
                      <rect x="52" y="12" width="6" height="6" fill="currentColor" />
                      <rect x="42" y="24" width="6" height="6" fill="currentColor" />
                      <rect x="52" y="24" width="6" height="6" fill="currentColor" />
                      <rect x="12" y="42" width="6" height="6" fill="currentColor" />
                      <rect x="24" y="42" width="6" height="6" fill="currentColor" />
                      <rect x="36" y="42" width="6" height="6" fill="currentColor" />
                      <rect x="48" y="42" width="6" height="6" fill="currentColor" />
                      <rect x="60" y="42" width="6" height="6" fill="currentColor" />
                      <rect x="72" y="42" width="6" height="6" fill="currentColor" />
                      <rect x="84" y="42" width="6" height="6" fill="currentColor" />
                      <rect x="42" y="66" width="6" height="6" fill="currentColor" />
                      <rect x="54" y="66" width="6" height="6" fill="currentColor" />
                      <rect x="66" y="66" width="6" height="6" fill="currentColor" />
                      <rect x="78" y="66" width="6" height="6" fill="currentColor" />
                      <rect x="42" y="78" width="6" height="6" fill="currentColor" />
                      <rect x="66" y="78" width="6" height="6" fill="currentColor" />
                      <rect x="78" y="78" width="6" height="6" fill="currentColor" />
                      {/* Center Brand Accent */}
                      <circle cx="50" cy="50" r="7" fill="currentColor" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground mt-2">
                    scan-test.chaiform.com
                  </span>
                </div>

                {/* Color Selector Controls */}
                <div className="flex-1 space-y-3 w-full">
                  <div className="text-xs font-semibold text-foreground">Pick Brand Palette</div>
                  <div className="grid grid-cols-2 gap-2">
                    {qrColorOptions.map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setSelectedQrColor(opt.hex)}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all cursor-pointer text-xs ${
                          selectedQrColor === opt.hex
                            ? "border-lime-600/60 dark:border-[#CCFF00] bg-lime-500/10 dark:bg-[#CCFF00]/10 font-bold"
                            : "border-border bg-card/60 hover:bg-card text-muted-foreground"
                        }`}
                      >
                        <span
                          className={`size-3.5 rounded-full border border-black/20 shrink-0 ${
                            selectedQrColor === opt.hex ? "ring-2 " + opt.ring : ""
                          }`}
                          style={{ backgroundColor: opt.hex }}
                        />
                        <span className="truncate">{opt.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <IconCheck className="size-3 text-emerald-500" />
                    <span>High-error correction (Level H) • Scannable on low-contrast paper</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* WIDGET 2: Simulated Live Webhook Terminal */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-lime-600/40 dark:hover:border-[#CCFF00]/40 transition-all duration-300 shadow-xs">
            {/* Top Chamfered Light Sheen */}
            <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-75 group-hover:opacity-100 transition-opacity" />

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-500 border border-emerald-500/30 flex items-center justify-center">
                  <IconTerminal2 className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground tracking-tight">
                    Real-Time Webhooks
                  </h3>
                  <p className="text-xs text-muted-foreground">HTTP JSON dispatch in &lt;10ms</p>
                </div>
              </div>

              {/* Terminal Code Preview */}
              <div className="rounded-xl border border-border bg-neutral-950 p-3.5 font-mono text-xs space-y-2 mt-4 text-neutral-100 shadow-md">
                <div className="flex items-center justify-between text-[10px] text-neutral-400 pb-2 border-b border-neutral-800">
                  <span>EVENT DISPATCH</span>
                  <span className="text-emerald-400 font-bold">● LIVE</span>
                </div>
                <div className="text-[11px] text-neutral-300 leading-relaxed">
                  <span className="text-emerald-400 font-bold">POST</span> /api/webhooks/response
                  <div className="text-neutral-500 text-[10px] mt-0.5">{`{ "event": "submission.created", "time": "8ms" }`}</div>
                </div>
                <div className="text-[10px] text-emerald-400 pt-1 flex items-center gap-1">
                  <IconCheck className="size-3 text-emerald-400" />
                  <span>200 OK • Payload delivered</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border/60 text-xs text-muted-foreground">
              Instant sync with Slack, Zapier, Make, and custom backends.
            </div>
          </div>

          {/* WIDGET 3: 14 Field Types Cloud */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-lime-600/40 dark:hover:border-[#CCFF00]/40 transition-all duration-300 shadow-xs">
            {/* Top Chamfered Light Sheen */}
            <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-75 group-hover:opacity-100 transition-opacity" />

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 text-blue-500 border border-blue-500/30 flex items-center justify-center">
                  <IconForms className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground tracking-tight">
                    14 Field Types
                  </h3>
                  <p className="text-xs text-muted-foreground">Every question pattern supported</p>
                </div>
              </div>

              {/* Field chips cloud */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {[
                  "Rating Stars",
                  "Single Choice",
                  "Multi-Select",
                  "Short Text",
                  "Long Text",
                  "Phone (E.164)",
                  "Date Picker",
                  "Email Verification",
                  "File Upload",
                  "Password Gate",
                  "Switch Toggle",
                  "Website URL",
                  "Number / Currency",
                  "Dropdown",
                ].map((field) => (
                  <span
                    key={field}
                    className="px-2.5 py-1 rounded-md bg-muted/70 border border-border/80 text-[11px] font-medium text-foreground hover:border-lime-600/40 dark:hover:border-[#CCFF00]/30 transition-colors"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border/60 text-xs text-muted-foreground">
              Drag-and-drop ordering with live validation rules.
            </div>
          </div>

          {/* WIDGET 4: Kinetic Keyboard Navigation */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-lime-600/40 dark:hover:border-[#CCFF00]/40 transition-all duration-300 shadow-xs">
            {/* Top Chamfered Light Sheen */}
            <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-lime-600/60 dark:via-[#CCFF00]/70 to-transparent opacity-75 group-hover:opacity-100 transition-opacity" />

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-xl bg-gradient-to-br from-lime-500/20 to-emerald-500/10 dark:from-[#CCFF00]/20 dark:to-[#CCFF00]/5 text-lime-800 dark:text-[#CCFF00] border border-lime-600/30 dark:border-[#CCFF00]/30 flex items-center justify-center">
                  <IconKeyboard className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground tracking-tight">
                    Full Keyboard Flow
                  </h3>
                  <p className="text-xs text-muted-foreground">Speedrun form completion</p>
                </div>
              </div>

              {/* Keyboard keys preview */}
              <div className="rounded-xl border border-border bg-muted/40 p-4 mt-4 flex items-center justify-around font-mono text-xs">
                <div className="p-2 rounded-lg bg-card border border-border text-center min-w-[48px] shadow-xs">
                  <div className="font-bold text-lime-800 dark:text-[#CCFF00]">1-9</div>
                  <div className="text-[9px] text-muted-foreground">Select</div>
                </div>
                <div className="p-2 rounded-lg bg-card border border-border text-center min-w-[56px] shadow-xs">
                  <div className="font-bold text-foreground">Tab ⇥</div>
                  <div className="text-[9px] text-muted-foreground">Next</div>
                </div>
                <div className="p-2 rounded-lg bg-gradient-to-r from-lime-500/15 to-emerald-500/15 dark:from-[#CCFF00]/20 dark:to-[#CCFF00]/10 border border-lime-600/40 dark:border-[#CCFF00]/40 text-center min-w-[64px] shadow-xs">
                  <div className="font-bold text-lime-800 dark:text-[#CCFF00]">Enter ↵</div>
                  <div className="text-[9px] text-lime-800 dark:text-[#CCFF00] font-semibold">
                    Submit
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border/60 text-xs text-muted-foreground">
              Zero mouse movement required. Respondents fly through questions.
            </div>
          </div>

          {/* WIDGET 5: Access Protection & Capacity Caps */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-lime-600/40 dark:hover:border-[#CCFF00]/40 transition-all duration-300 shadow-xs">
            {/* Top Chamfered Light Sheen */}
            <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-75 group-hover:opacity-100 transition-opacity" />

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 text-amber-500 border border-amber-500/30 flex items-center justify-center">
                  <IconLock className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground tracking-tight">
                    Access Control &amp; Caps
                  </h3>
                  <p className="text-xs text-muted-foreground">Auto-close on limits</p>
                </div>
              </div>

              {/* Capacity meter preview */}
              <div className="rounded-xl border border-border bg-muted/40 p-4 mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-muted-foreground font-medium">CAPACITY LIMIT</span>
                  <span className="text-lime-800 dark:text-[#CCFF00] font-bold">
                    148 / 150 SPOTS
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden border border-border">
                  <div className="bg-gradient-to-r from-lime-600 to-emerald-600 dark:from-[#CCFF00] dark:to-[#A3E635] h-full w-[98%]" />
                </div>
                <div className="text-[10px] text-muted-foreground pt-1 flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>Auto-locks form when quota is fulfilled</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border/60 text-xs text-muted-foreground">
              Includes password gating for confidential executive or internal surveys.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
