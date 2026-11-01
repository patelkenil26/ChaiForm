export interface FormThemeConfig {
  id: string;
  name: string;
  tag: string;
  description: string;
  isDark: boolean;
  background: string;
  textColor: string;
  textMutedColor: string;
  accentColor: string;
  accentTextColor: string;
  cardBackground: string;
  cardBorder: string;
  inputBackground: string;
  inputBorder: string;
  glowColor: string;
}

export const FORM_THEME_PRESETS: FormThemeConfig[] = [
  {
    id: "citron-neon",
    name: "Citron Neon",
    tag: "Signature Dark",
    description: "Deep obsidian canvas with high-energy electric lime accents",
    isDark: true,
    background: "radial-gradient(ellipse at 50% -20%, #182012 0%, #090B0D 70%, #060708 100%)",
    textColor: "#F4F4F5",
    textMutedColor: "#A1A1AA",
    accentColor: "#CCFF00",
    accentTextColor: "#000000",
    cardBackground: "rgba(18, 20, 24, 0.88)",
    cardBorder: "rgba(204, 255, 0, 0.22)",
    inputBackground: "rgba(255, 255, 255, 0.04)",
    inputBorder: "rgba(255, 255, 255, 0.12)",
    glowColor: "rgba(204, 255, 0, 0.16)",
  },
  {
    id: "midnight-indigo",
    name: "Midnight Indigo",
    tag: "Cosmic Gradient",
    description: "Deep cosmic navy backdrop illuminated with radiant violet indigo",
    isDark: true,
    background: "linear-gradient(135deg, #070B19 0%, #0F172E 50%, #0B1124 100%)",
    textColor: "#F8FAFC",
    textMutedColor: "#94A3B8",
    accentColor: "#6366F1",
    accentTextColor: "#FFFFFF",
    cardBackground: "rgba(17, 24, 46, 0.88)",
    cardBorder: "rgba(99, 102, 241, 0.25)",
    inputBackground: "rgba(255, 255, 255, 0.05)",
    inputBorder: "rgba(99, 102, 241, 0.2)",
    glowColor: "rgba(99, 102, 241, 0.22)",
  },
  {
    id: "sunset-warmth",
    name: "Sunset Warmth",
    tag: "Velvet Dusk",
    description: "Warm dusk purple gradient with sunset coral highlights",
    isDark: true,
    background: "linear-gradient(135deg, #150921 0%, #2A0E38 50%, #180A26 100%)",
    textColor: "#FFF5F5",
    textMutedColor: "#D4B8D8",
    accentColor: "#FF5E62",
    accentTextColor: "#FFFFFF",
    cardBackground: "rgba(38, 18, 54, 0.88)",
    cardBorder: "rgba(255, 94, 98, 0.28)",
    inputBackground: "rgba(255, 255, 255, 0.05)",
    inputBorder: "rgba(255, 94, 98, 0.22)",
    glowColor: "rgba(255, 94, 98, 0.24)",
  },
  {
    id: "emerald-forest",
    name: "Emerald Forest",
    tag: "Lush Botanic",
    description: "Deep rainforest night gradient with glowing vivid mint accents",
    isDark: true,
    background: "linear-gradient(135deg, #03140E 0%, #092B20 50%, #041710 100%)",
    textColor: "#ECFDF5",
    textMutedColor: "#A7F3D0",
    accentColor: "#10B981",
    accentTextColor: "#022C22",
    cardBackground: "rgba(8, 38, 28, 0.88)",
    cardBorder: "rgba(16, 185, 129, 0.26)",
    inputBackground: "rgba(255, 255, 255, 0.05)",
    inputBorder: "rgba(16, 185, 129, 0.2)",
    glowColor: "rgba(16, 185, 129, 0.2)",
  },
  {
    id: "ocean-cyan",
    name: "Ocean Abyss",
    tag: "Deep Sea Glow",
    description: "Oceanic abyss gradient with electric cyber cyan accents",
    isDark: true,
    background: "linear-gradient(135deg, #05141E 0%, #0A273B 50%, #061824 100%)",
    textColor: "#F0FDFA",
    textMutedColor: "#99F6E4",
    accentColor: "#06B6D4",
    accentTextColor: "#083344",
    cardBackground: "rgba(10, 39, 59, 0.88)",
    cardBorder: "rgba(6, 182, 212, 0.25)",
    inputBackground: "rgba(255, 255, 255, 0.05)",
    inputBorder: "rgba(6, 182, 212, 0.2)",
    glowColor: "rgba(6, 182, 212, 0.22)",
  },
  {
    id: "cyberpunk-neon",
    name: "Cyberpunk Neon",
    tag: "High Contrast",
    description: "Midnight dark with high-voltage neon pink & purple laser vibes",
    isDark: true,
    background: "linear-gradient(135deg, #09020D 0%, #190526 50%, #0B0212 100%)",
    textColor: "#FDF4F8",
    textMutedColor: "#E879F9",
    accentColor: "#F43F5E",
    accentTextColor: "#FFFFFF",
    cardBackground: "rgba(28, 7, 44, 0.88)",
    cardBorder: "rgba(244, 63, 94, 0.3)",
    inputBackground: "rgba(255, 255, 255, 0.06)",
    inputBorder: "rgba(244, 63, 94, 0.25)",
    glowColor: "rgba(244, 63, 94, 0.25)",
  },
  {
    id: "velvet-charcoal",
    name: "Velvet Charcoal",
    tag: "Minimalist Slate",
    description: "Monochrome luxury dark with crisp white typography & borders",
    isDark: true,
    background: "#111215",
    textColor: "#EDEDED",
    textMutedColor: "#9CA3AF",
    accentColor: "#FFFFFF",
    accentTextColor: "#000000",
    cardBackground: "rgba(24, 25, 29, 0.92)",
    cardBorder: "rgba(255, 255, 255, 0.16)",
    inputBackground: "rgba(255, 255, 255, 0.05)",
    inputBorder: "rgba(255, 255, 255, 0.12)",
    glowColor: "rgba(255, 255, 255, 0.09)",
  },
  {
    id: "clean-minimal-light",
    name: "Clean Porcelain",
    tag: "Airy Light Mode",
    description: "Crisp architectural light canvas with deep slate contrast",
    isDark: false,
    background: "linear-gradient(135deg, #F8FAFC 0%, #EDF2F7 100%)",
    textColor: "#0F172A",
    textMutedColor: "#64748B",
    accentColor: "#0F172A",
    accentTextColor: "#FFFFFF",
    cardBackground: "rgba(255, 255, 255, 0.96)",
    cardBorder: "rgba(15, 23, 42, 0.12)",
    inputBackground: "#FFFFFF",
    inputBorder: "rgba(15, 23, 42, 0.18)",
    glowColor: "rgba(15, 23, 42, 0.06)",
  },
];

export function resolveFormTheme(
  presetId?: string | null,
  customBg?: string | null,
  customText?: string | null,
  customAccent?: string | null,
): FormThemeConfig {
  const base =
    FORM_THEME_PRESETS.find((p) => p.id === (presetId || "citron-neon")) || FORM_THEME_PRESETS[0]!;

  if (presetId === "custom" || customBg || customText || customAccent) {
    const bg = customBg?.trim() || base.background;
    const text = customText?.trim() || base.textColor;
    const accent = customAccent?.trim() || base.accentColor;

    return {
      ...base,
      id: "custom",
      name: "Custom Theme",
      tag: "Custom Style",
      background: bg,
      textColor: text,
      accentColor: accent,
      accentTextColor: "#000000",
      cardBorder: `${accent}40`,
      glowColor: `${accent}25`,
    };
  }

  return base;
}
