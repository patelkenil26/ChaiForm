"use client";

import { useEffect, useState } from "react";
import {
  IconPalette,
  IconCheck,
  IconSparkles,
  IconLoader2,
  IconEye,
  IconColorSwatch,
  IconAdjustments,
} from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { FORM_THEME_PRESETS, resolveFormTheme, type FormThemeConfig } from "~/config/form-themes";
import { landingTheme } from "~/config/landing-theme";

export interface FormThemePayload {
  themePreset: string;
  customBgColor?: string | null;
  customTextColor?: string | null;
  customAccentColor?: string | null;
}

interface FormThemeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: {
    themePreset?: string | null;
    customBgColor?: string | null;
    customTextColor?: string | null;
    customAccentColor?: string | null;
    title?: string;
  };
  onSave: (payload: FormThemePayload) => Promise<void>;
  isSaving: boolean;
}

const ACCENT_SWATCHES = [
  { label: "Citron Lime", hex: "#CCFF00" },
  { label: "Indigo", hex: "#6366F1" },
  { label: "Emerald", hex: "#10B981" },
  { label: "Sunset Coral", hex: "#FF5E62" },
  { label: "Cyber Cyan", hex: "#06B6D4" },
  { label: "Neon Pink", hex: "#F43F5E" },
  { label: "Amber Gold", hex: "#F59E0B" },
  { label: "Crisp White", hex: "#FFFFFF" },
];

const GRADIENT_SWATCHES = [
  {
    label: "Obsidian Void",
    css: "radial-gradient(ellipse at 50% -20%, #182012 0%, #090B0D 70%, #060708 100%)",
  },
  {
    label: "Cosmic Indigo",
    css: "linear-gradient(135deg, #070B19 0%, #0F172E 50%, #0B1124 100%)",
  },
  {
    label: "Purple Dusk",
    css: "linear-gradient(135deg, #150921 0%, #2A0E38 50%, #180A26 100%)",
  },
  {
    label: "Midnight Teal",
    css: "linear-gradient(135deg, #03140E 0%, #092B20 50%, #041710 100%)",
  },
  {
    label: "Solid Black",
    css: "#0B0C0E",
  },
  {
    label: "Porcelain Light",
    css: "linear-gradient(135deg, #F8FAFC 0%, #EDF2F7 100%)",
  },
];

export function FormThemeDialog({
  open,
  onOpenChange,
  form,
  onSave,
  isSaving,
}: FormThemeDialogProps) {
  const [activeTab, setActiveTab] = useState<"presets" | "custom">("presets");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("citron-neon");
  const [customBg, setCustomBg] = useState<string>("");
  const [customText, setCustomText] = useState<string>("#FFFFFF");
  const [customAccent, setCustomAccent] = useState<string>("#CCFF00");

  useEffect(() => {
    if (open && form) {
      const preset = form.themePreset || "citron-neon";
      setSelectedPresetId(preset);
      setCustomBg(form.customBgColor || "");
      setCustomText(form.customTextColor || "#FFFFFF");
      setCustomAccent(form.customAccentColor || "#CCFF00");

      if (preset === "custom" || form.customBgColor || form.customAccentColor) {
        setActiveTab("custom");
      } else {
        setActiveTab("presets");
      }
    }
  }, [open, form]);

  const activeTheme: FormThemeConfig = resolveFormTheme(
    activeTab === "custom" ? "custom" : selectedPresetId,
    activeTab === "custom" ? customBg : undefined,
    activeTab === "custom" ? customText : undefined,
    activeTab === "custom" ? customAccent : undefined,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "custom") {
      await onSave({
        themePreset: "custom",
        customBgColor: customBg.trim() || null,
        customTextColor: customText.trim() || null,
        customAccentColor: customAccent.trim() || null,
      });
    } else {
      await onSave({
        themePreset: selectedPresetId,
        customBgColor: null,
        customTextColor: null,
        customAccentColor: null,
      });
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-[95vw] md:w-full max-h-[90vh] overflow-y-auto overflow-x-hidden p-4 sm:p-6 gap-5">
        <DialogHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg font-bold tracking-tight">
              <IconPalette className="size-5 text-lime-600 dark:text-[#ccff00]" />
              <span>Form Design & Theme Customizer</span>
            </DialogTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            Personalize the background canvas, colors, and button accents for your respondents.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-1 min-w-0">
          {/* Top Live Interactive Simulator Banner */}
          <div
            className="rounded-2xl p-4 sm:p-5 border shadow-lg relative overflow-hidden transition-all duration-300 w-full"
            style={{
              background: activeTheme.background,
              color: activeTheme.textColor,
              borderColor: activeTheme.cardBorder,
            }}
          >
            {/* Glow Orb */}
            <div
              className="absolute -top-12 -right-12 size-36 rounded-full blur-2xl pointer-events-none opacity-60"
              style={{ background: activeTheme.glowColor }}
            />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center md:text-left w-full md:w-auto min-w-0">
                <div className="flex items-center gap-2 justify-center md:justify-start flex-wrap">
                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border"
                    style={{
                      borderColor: activeTheme.cardBorder,
                      color: activeTheme.accentColor,
                    }}
                  >
                    Live Preview
                  </Badge>
                  <span className="text-xs font-semibold">{activeTheme.name}</span>
                </div>
                <h4 className="text-sm sm:text-base font-bold tracking-tight truncate max-w-sm">
                  {form.title || "Untitled Form Preview"}
                </h4>
                <p className="text-xs opacity-75 max-w-sm">
                  This is how questions, typography, and buttons will appear.
                </p>
              </div>

              {/* Sample simulated question card */}
              <div
                className="w-full md:w-60 p-3 rounded-xl border backdrop-blur-md space-y-2 shadow-md shrink-0"
                style={{
                  background: activeTheme.cardBackground,
                  borderColor: activeTheme.cardBorder,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold opacity-90">1. Sample Question</span>
                  <span
                    className="size-2 rounded-full"
                    style={{ background: activeTheme.accentColor }}
                  />
                </div>
                <div
                  className="h-8 rounded-lg border px-2.5 flex items-center text-xs opacity-60"
                  style={{
                    background: activeTheme.inputBackground,
                    borderColor: activeTheme.inputBorder,
                  }}
                >
                  Type your answer here...
                </div>
                <button
                  type="button"
                  tabIndex={-1}
                  className="w-full h-7 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm select-none"
                  style={{
                    background: activeTheme.accentColor,
                    color: activeTheme.accentTextColor,
                  }}
                >
                  <span>Submit</span>
                </button>
              </div>
            </div>
          </div>

          {/* Preset Tabs vs Custom Tab */}
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as "presets" | "custom")}
            className="w-full min-w-0"
          >
            <TabsList className="w-full grid grid-cols-2 bg-muted/70 p-1 rounded-xl gap-1">
              <TabsTrigger
                value="presets"
                className="text-xs font-medium gap-1.5 py-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-2xs rounded-lg cursor-pointer truncate"
              >
                <IconColorSwatch className="size-3.5 text-lime-600 dark:text-[#ccff00] shrink-0" />
                <span className="truncate">Presets ({FORM_THEME_PRESETS.length})</span>
              </TabsTrigger>
              <TabsTrigger
                value="custom"
                className="text-xs font-medium gap-1.5 py-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-2xs rounded-lg cursor-pointer truncate"
              >
                <IconAdjustments className="size-3.5 text-blue-500 shrink-0" />
                <span className="truncate">Custom Palette</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: CURATED PRESETS */}
            <TabsContent value="presets" className="pt-3 mt-0 focus-visible:outline-none min-w-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {FORM_THEME_PRESETS.map((preset) => {
                  const isSelected = selectedPresetId === preset.id && activeTab === "presets";

                  return (
                    <div
                      key={preset.id}
                      onClick={() => setSelectedPresetId(preset.id)}
                      className={`relative flex flex-col justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 select-none group hover:scale-[1.01] ${
                        isSelected
                          ? "ring-2 ring-lime-500 border-lime-500 shadow-md bg-card"
                          : "border-border/70 hover:border-border/90 bg-card/70 hover:bg-card"
                      }`}
                    >
                      {/* Top Header: Title, Tag & Check */}
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-foreground leading-snug truncate">
                            {preset.name}
                          </h5>
                          <span className="text-[10px] text-muted-foreground block truncate">
                            {preset.tag}
                          </span>
                        </div>
                        <div
                          className={`size-4.5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                            isSelected
                              ? "bg-lime-500 text-black dark:text-black shadow-xs"
                              : "border border-border/80 text-transparent group-hover:border-border"
                          }`}
                        >
                          <IconCheck className="size-3 stroke-[2.5]" />
                        </div>
                      </div>

                      {/* Sleek Miniature Form Wireframe Strip (No giant empty color box) */}
                      <div
                        className="h-10 w-full rounded-lg px-2.5 py-1.5 flex items-center justify-between border shadow-inner transition-all relative overflow-hidden"
                        style={{
                          background: preset.background,
                          borderColor: preset.cardBorder,
                        }}
                      >
                        {/* Micro typography & question line */}
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="text-[11px] font-bold tracking-tight shrink-0"
                            style={{ color: preset.textColor }}
                          >
                            Aa
                          </span>
                          <div className="flex flex-col gap-1 min-w-0">
                            <span
                              className="h-1 w-10 sm:w-12 rounded-full opacity-70"
                              style={{ background: preset.textColor }}
                            />
                            <span
                              className="h-1 w-6 sm:w-7 rounded-full opacity-40"
                              style={{ background: preset.textMutedColor }}
                            />
                          </div>
                        </div>

                        {/* Micro CTA Button */}
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold shadow-xs shrink-0"
                          style={{
                            background: preset.accentColor,
                            color: preset.accentTextColor,
                          }}
                        >
                          Button
                        </span>
                      </div>

                      {/* Bottom Palette Swatch Dots */}
                      <div className="mt-2.5 pt-2 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground">
                        <div
                          className="flex items-center gap-1.5"
                          title="Palette: Canvas, Text, Accent"
                        >
                          <span
                            className="size-3 rounded-full border border-white/20 shadow-xs"
                            style={{ background: preset.background }}
                          />
                          <span
                            className="size-3 rounded-full border border-white/20 shadow-xs"
                            style={{ background: preset.textColor }}
                          />
                          <span
                            className="size-3 rounded-full border border-white/20 shadow-xs"
                            style={{ background: preset.accentColor }}
                          />
                        </div>
                        <span className="font-mono text-[9px] uppercase tracking-wider opacity-70">
                          {preset.isDark ? "Dark" : "Light"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            {/* TAB 2: CUSTOM THEME BUILDER */}
            <TabsContent
              value="custom"
              className="pt-3 mt-0 space-y-4 focus-visible:outline-none min-w-0"
            >
              <div className="p-4 rounded-xl border border-border/70 bg-card/60 space-y-4">
                {/* Background Styling */}
                <div className="space-y-2">
                  <FieldLabel htmlFor="custom-bg-input">
                    Background (Solid or CSS Gradient)
                  </FieldLabel>
                  <Input
                    id="custom-bg-input"
                    value={customBg}
                    onChange={(e) => setCustomBg(e.target.value)}
                    placeholder="e.g. #0A0F1D or linear-gradient(135deg, #070B19 0%, #11182E 100%)"
                    className="text-xs font-mono w-full"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[11px] text-muted-foreground mr-1">Quick Picks:</span>
                    {GRADIENT_SWATCHES.map((swatch) => (
                      <Badge
                        key={swatch.label}
                        variant="outline"
                        className="text-[10px] cursor-pointer hover:border-lime-500/60 transition gap-1"
                        onClick={() => setCustomBg(swatch.css)}
                      >
                        <span
                          className="size-2 rounded-full border border-white/20"
                          style={{ background: swatch.css }}
                        />
                        <span>{swatch.label}</span>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Primary Accent Color & Text Color in responsive 2 cols */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/40">
                  {/* Primary Accent Color */}
                  <div className="space-y-2">
                    <FieldLabel htmlFor="custom-accent-input">
                      Primary Accent & Button Color
                    </FieldLabel>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id="custom-accent-picker"
                        value={customAccent}
                        onChange={(e) => setCustomAccent(e.target.value)}
                        className="size-9 rounded-lg border border-border cursor-pointer bg-transparent shrink-0"
                      />
                      <Input
                        id="custom-accent-input"
                        value={customAccent}
                        onChange={(e) => setCustomAccent(e.target.value)}
                        placeholder="#CCFF00"
                        maxLength={50}
                        className="text-xs font-mono flex-1 min-w-0"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[11px] text-muted-foreground mr-1">Presets:</span>
                      {ACCENT_SWATCHES.map((swatch) => (
                        <button
                          key={swatch.hex}
                          type="button"
                          onClick={() => setCustomAccent(swatch.hex)}
                          className={`size-6 rounded-full border transition-transform hover:scale-110 flex items-center justify-center cursor-pointer ${
                            customAccent.toLowerCase() === swatch.hex.toLowerCase()
                              ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                              : "border-border/60"
                          }`}
                          style={{ background: swatch.hex }}
                          title={swatch.label}
                        >
                          {customAccent.toLowerCase() === swatch.hex.toLowerCase() && (
                            <IconCheck
                              className="size-3"
                              style={{
                                color:
                                  swatch.hex === "#FFFFFF" || swatch.hex === "#CCFF00"
                                    ? "#000"
                                    : "#FFF",
                              }}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Text Color */}
                  <div className="space-y-2">
                    <FieldLabel htmlFor="custom-text-input">Primary Text Color</FieldLabel>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id="custom-text-picker"
                        value={customText.startsWith("#") ? customText : "#FFFFFF"}
                        onChange={(e) => setCustomText(e.target.value)}
                        className="size-9 rounded-lg border border-border cursor-pointer bg-transparent shrink-0"
                      />
                      <Input
                        id="custom-text-input"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        placeholder="#FFFFFF"
                        maxLength={50}
                        className="text-xs font-mono flex-1 min-w-0"
                      />
                    </div>
                    <span className="text-[11px] text-muted-foreground block pt-1">
                      Sets the color of question titles, labels, and text.
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-2 pt-2 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              className={landingTheme.buttonOutlineHover}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className={`gap-2 ${landingTheme.primaryButton}`}
            >
              {isSaving && <IconLoader2 className="size-4 animate-spin" />}
              {isSaving ? "Applying Theme..." : "Save & Apply Theme"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
