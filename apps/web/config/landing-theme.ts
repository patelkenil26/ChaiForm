/**
 * ============================================================================
 * CHAI FORM - GLOBAL UNIFIED THEME SYSTEM (SINGLE SOURCE OF TRUTH)
 * ============================================================================
 * Centralized design tokens and color system for the entire application:
 *  - Landing & Public Pages (/, /explore, /pricing, /templates, etc.)
 *  - Dashboard & Form Builder (/forms, /forms/[id], /submissions)
 *  - Form Runner & Embed Views (/form/[form_id])
 *  - UI Primitives (Switch, Checkbox, Tabs, Dialogs, Cards, Badges, Charts)
 *
 * HOW TO SWITCH THEMES GLOBALLY:
 * Simply change `ACTIVE_THEME_ID` below to any preset key:
 *   - "frosty_mint"           : [1] Frosty Mint (#17C662 -> #F5FF6C)
 *   - "desert_champagne_gold" : [2] Luminous Champagne Gold (#F59E0B -> #FEF9C3) [DEFAULT]
 *   - "sexy_blue"             : [3] Sexy Blue (#007BFF -> #B0E0E6)
 *
 * Changing ACTIVE_THEME_ID will instantly re-skin the entire application!
 * ============================================================================
 */

export interface QrCodePreset {
  name: string;
  hex: string;
}

export interface LandingThemeConfig {
  id: string;
  name: string;
  description: string;
  paletteHex: string[];
  primaryHex: string;
  primaryLightHex: string;
  // Brand Logo & Core Visuals
  logoGradient: string;
  // Hero & Header
  badge: string;
  dashboardBadge: string;
  primaryText: string;
  gradientText: string;
  heroGlow: string;
  // Buttons & Interactive
  primaryButton: string;
  buttonOutlineHover: string;
  buttonGhostHover: string;
  // Controls (Switch & Checkbox)
  switchChecked: string;
  switchFocus: string;
  checkboxChecked: string;
  checkboxFocus: string;
  // Card & Border Styling
  cardBg: string;
  cardBeam: string;
  cardBorderHover: string;
  cardHighlightBorder: string;
  cardHighlightBadge: string;
  // Filter pills, Tabs & Toggles
  activePill: string;
  tabActive: string;
  tabInactive: string;
  tabActiveIcon: string;
  // Interactive Elements & Icons
  iconColor: string;
  iconBg: string;
  checkColor: string;
  progressBar: string;
  ratingStar: string;
  activeDot: string;
  // Badges & Pills
  draftBadge: string;
  publishedBadge: string;
  slugBadge: string;
  // Tables & Links
  tableRowHover: string;
  linkHover: string;
  // Inputs & Focus
  inputFocus: string;
  // Navigation & User
  navActive: string;
  navInactive: string;
  avatarBorder: string;
  avatarFallback: string;
  // Bottom CTA Section Box
  ctaBox: string;
  ctaGlow: string;
  ctaBadge: string;
  // Selection
  selection: string;
  // Callout & Notices
  callout: {
    border: string;
    bg: string;
    text: string;
    accent: string;
  };
  // Analytics Charts
  chart: {
    stroke: string;
    stopColor: string;
    fill: string;
  };
  // Confetti celebration colors
  confettiColors: string[];
  // QR Code Presets
  qrCodePresets: QrCodePreset[];
}

export const THEME_PRESETS = {
  // --------------------------------------------------------------------------
  // [1] Frosty Mint (Electric Mint -> Bright Lemon-Lime)
  // --------------------------------------------------------------------------
  frosty_mint: {
    id: "frosty_mint",
    name: "1. Frosty Mint",
    description:
      "Vibrant electric mint green (#17C662) smoothly blending into bright citrus lemon-lime (#F5FF6C).",
    paletteHex: ["#17C662", "#47DE79", "#75E96E", "#B1F46A", "#F5FF6C"],
    primaryHex: "#17C662",
    primaryLightHex: "#F5FF6C",
    logoGradient:
      "bg-gradient-to-br from-[#17c662] via-[#52e88f] to-[#f5ff6c] text-neutral-950 shadow-md shadow-[#17c662]/30",
    badge:
      "border-[#17c662]/40 bg-[#17c662]/10 text-[#17c662] dark:text-[#52e88f] backdrop-blur-md hover:border-[#17c662]/60 hover:bg-[#17c662]/15 transition-all shadow-xs",
    dashboardBadge: "border border-border/70 bg-card/60 text-muted-foreground",
    primaryText: "text-[#17c662] dark:text-[#52e88f]",
    gradientText:
      "bg-gradient-to-r from-[#17c662] via-[#6aed61] to-[#f5ff6c] bg-clip-text text-transparent",
    heroGlow: "bg-gradient-to-tr from-[#17c662]/20 via-[#f5ff6c]/10 to-transparent blur-[140px]",
    primaryButton:
      "bg-gradient-to-r from-[#17c662] via-[#75e96e] to-[#b1f46a] hover:opacity-90 active:opacity-95 text-neutral-950 font-semibold shadow-xs transition-opacity cursor-pointer",
    buttonOutlineHover:
      "hover:border-[#17c662]/40 hover:bg-[#17c662]/10 hover:text-[#52e88f] transition-colors",
    buttonGhostHover: "hover:bg-[#17c662]/10 hover:text-[#52e88f] transition-colors",
    switchChecked:
      "data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#17c662] data-[state=checked]:via-[#52e88f] data-[state=checked]:to-[#f5ff6c] data-[state=checked]:border-[#17c662]/60 data-[state=checked]:shadow-[0_0_12px_rgba(23,198,98,0.25)]",
    switchFocus: "focus-visible:ring-[#17c662]/40",
    checkboxChecked:
      "data-[state=checked]:border-[#17c662] data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#17c662] data-[state=checked]:to-[#75e96e] data-[state=checked]:text-neutral-950 dark:data-[state=checked]:border-[#17c662] dark:data-[state=checked]:bg-gradient-to-r dark:data-[state=checked]:from-[#17c662] dark:data-[state=checked]:to-[#75e96e] dark:data-[state=checked]:text-neutral-950",
    checkboxFocus: "focus-visible:ring-[#17c662]/40",
    cardBg: "bg-gradient-to-b from-[#17c662]/[0.035] via-card to-card border-border/75",
    cardBeam:
      "absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#17c662]/50 to-transparent group-hover:via-[#17c662] transition-all",
    cardBorderHover: "hover:border-[#17c662]/45 transition-colors duration-150",
    cardHighlightBorder:
      "border-2 border-[#17c662]/70 bg-gradient-to-b from-[#17c662]/15 via-card to-card shadow-2xl shadow-[#17c662]/15",
    cardHighlightBadge: "bg-gradient-to-r from-[#17c662] to-[#b1f46a] text-neutral-950 font-bold",
    activePill: "bg-foreground text-background font-medium shadow-xs transition-all",
    tabActive: "border border-border/80 bg-secondary/80 text-foreground shadow-2xs font-medium",
    tabInactive:
      "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent transition-colors",
    tabActiveIcon: "group-data-[state=active]:text-[#17c662]",
    iconColor: "text-[#17c662]",
    iconBg: "bg-[#17c662]/15 text-[#17c662] dark:text-[#52e88f]",
    checkColor: "text-[#17c662]",
    progressBar: "bg-gradient-to-r from-[#17c662] via-[#75e96e] to-[#f5ff6c]",
    ratingStar: "text-[#17c662] drop-shadow-[0_0_8px_rgba(23,198,98,0.5)]",
    activeDot: "bg-[#17c662] shadow-[0_0_8px_rgba(23,198,98,0.8)]",
    draftBadge: "bg-secondary text-muted-foreground border border-border/60 text-xs font-normal",
    publishedBadge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs font-normal",
    slugBadge:
      "inline-flex items-center gap-1 text-[11px] font-mono text-[#52e88f] bg-[#17c662]/10 border border-[#17c662]/25 px-1.5 py-0.5 rounded",
    tableRowHover: "hover:bg-[#17c662]/[0.05] border-border/50 transition-colors group",
    linkHover: "hover:underline hover:text-[#52e88f] transition-colors",
    inputFocus: "focus-visible:ring-[#17c662]/40 focus-visible:border-[#17c662]/50",
    navActive:
      "bg-gradient-to-r from-[#17c662]/15 to-[#75e96e]/10 text-[#52e88f] font-semibold border border-[#17c662]/40 ring-1 ring-[#17c662]/25 shadow-xs",
    navInactive:
      "text-muted-foreground hover:bg-[#17c662]/[0.08] hover:text-[#52e88f] hover:border-[#17c662]/20 border border-transparent",
    avatarBorder: "border-[#17c662]/40",
    avatarFallback: "rounded-lg bg-[#17c662]/15 text-[#52e88f] font-bold text-xs",
    ctaBox:
      "border border-[#17c662]/35 bg-gradient-to-b from-[#17c662]/15 via-card to-card shadow-2xl shadow-[#17c662]/15",
    ctaGlow: "bg-[#17c662]/25 blur-[100px]",
    ctaBadge: "border border-border/70 bg-card/60 text-muted-foreground",
    selection: "selection:bg-[#17c662]/25 selection:text-[#17c662]",
    callout: {
      border: "border-[#17c662]/25",
      bg: "bg-[#17c662]/10",
      text: "text-[#52e88f]",
      accent: "text-[#17c662]",
    },
    chart: {
      stroke: "#17c662",
      stopColor: "#17c662",
      fill: "rgba(23, 198, 98, 0.2)",
    },
    confettiColors: ["#17c662", "#52e88f", "#75e96e", "#b1f46a", "#f5ff6c"],
    qrCodePresets: [
      { name: "Frosty Mint (Brand)", hex: "#17c662" },
      { name: "Classic Black", hex: "#000000" },
      { name: "Chai Indigo", hex: "#4f46e5" },
      { name: "Emerald Green", hex: "#059669" },
      { name: "Crimson Rose", hex: "#e11d48" },
      { name: "Amber Ochre", hex: "#d97706" },
    ],
  },

  // --------------------------------------------------------------------------
  // [2] Luminous Champagne Gold (Polished Luxury Edition) [DEFAULT]
  // --------------------------------------------------------------------------
  desert_champagne_gold: {
    id: "desert_champagne_gold",
    name: "2. Luminous Champagne Gold (Polished Luxury)",
    description:
      "Bright golden sunlight (#F59E0B) into shimmering champagne cream (#FEF9C3). Clean, radiant luxury.",
    paletteHex: ["#F59E0B", "#FCD34D", "#FEF08A", "#FEF9C3"],
    primaryHex: "#F59E0B",
    primaryLightHex: "#FEF08A",
    logoGradient:
      "bg-gradient-to-br from-[#f59e0b] via-[#fcd34d] to-[#fef9c3] text-neutral-950 shadow-md shadow-[#f59e0b]/30 ring-1 ring-white/20",
    badge:
      "border-[#fcd34d]/35 bg-[#fcd34d]/10 text-[#fef08a] backdrop-blur-md hover:border-[#fcd34d]/60 hover:bg-[#fcd34d]/15 transition-all shadow-xs",
    dashboardBadge: "border border-border/70 bg-card/60 text-muted-foreground",
    primaryText: "text-[#fef08a]",
    gradientText:
      "bg-gradient-to-r from-[#f59e0b] via-[#fcd34d] to-[#fef9c3] bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(245,158,11,0.2)]",
    heroGlow: "bg-gradient-to-tr from-[#f59e0b]/22 via-[#fcd34d]/12 to-transparent blur-[140px]",
    primaryButton:
      "bg-gradient-to-r from-[#f59e0b] via-[#fcd34d] to-[#fef08a] hover:opacity-90 active:opacity-95 text-neutral-950 font-semibold shadow-xs transition-opacity cursor-pointer",
    buttonOutlineHover:
      "hover:border-[#fcd34d]/40 hover:bg-[#fcd34d]/10 hover:text-[#fef08a] transition-colors",
    buttonGhostHover: "hover:bg-[#fcd34d]/10 hover:text-[#fef08a] transition-colors",
    switchChecked:
      "data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#f59e0b] data-[state=checked]:via-[#fcd34d] data-[state=checked]:to-[#fef08a] data-[state=checked]:border-[#f59e0b]/60 data-[state=checked]:shadow-[0_0_12px_rgba(245,158,11,0.25)]",
    switchFocus: "focus-visible:ring-[#fcd34d]/40",
    checkboxChecked:
      "data-[state=checked]:border-[#f59e0b] data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#f59e0b] data-[state=checked]:to-[#fcd34d] data-[state=checked]:text-neutral-950 dark:data-[state=checked]:border-[#f59e0b] dark:data-[state=checked]:bg-gradient-to-r dark:data-[state=checked]:from-[#f59e0b] dark:data-[state=checked]:to-[#fcd34d] dark:data-[state=checked]:text-neutral-950",
    checkboxFocus: "focus-visible:ring-[#fcd34d]/40",
    cardBg: "bg-gradient-to-b from-[#f59e0b]/[0.035] via-card to-card border-border/75",
    cardBeam:
      "absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#fcd34d]/50 to-transparent group-hover:via-[#fcd34d] transition-all",
    cardBorderHover: "hover:border-[#fcd34d]/45 transition-colors duration-150",
    cardHighlightBorder:
      "border-2 border-[#fcd34d]/65 bg-gradient-to-b from-[#f59e0b]/12 via-card to-card shadow-2xl shadow-[#f59e0b]/15 hover:border-[#fcd34d]/85 transition-all",
    cardHighlightBadge:
      "bg-gradient-to-r from-[#f59e0b] to-[#fcd34d] text-neutral-950 font-bold shadow-xs",
    activePill: "bg-foreground text-background font-medium shadow-xs transition-all",
    tabActive: "border border-border/80 bg-secondary/80 text-foreground shadow-2xs font-medium",
    tabInactive:
      "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent transition-colors",
    tabActiveIcon: "group-data-[state=active]:text-[#fcd34d]",
    iconColor: "text-[#fcd34d]",
    iconBg: "bg-[#fcd34d]/15 text-[#fef08a] border border-[#fcd34d]/25",
    checkColor: "text-[#fcd34d]",
    progressBar:
      "bg-gradient-to-r from-[#f59e0b] via-[#fcd34d] to-[#fef9c3] shadow-xs shadow-[#f59e0b]/40",
    ratingStar: "text-[#fcd34d] drop-shadow-[0_0_10px_rgba(252,211,77,0.7)]",
    activeDot: "bg-[#fcd34d] shadow-[0_0_8px_rgba(252,211,77,0.8)]",
    draftBadge: "bg-secondary text-muted-foreground border border-border/60 text-xs font-normal",
    publishedBadge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs font-normal",
    slugBadge:
      "inline-flex items-center gap-1 text-[11px] font-mono text-[#fef08a] bg-[#fcd34d]/10 border border-[#fcd34d]/25 px-1.5 py-0.5 rounded",
    tableRowHover: "hover:bg-[#fcd34d]/[0.05] border-border/50 transition-colors group",
    linkHover: "hover:underline hover:text-[#fef08a] transition-colors",
    inputFocus: "focus-visible:ring-[#fcd34d]/40 focus-visible:border-[#fcd34d]/50",
    navActive:
      "bg-gradient-to-r from-[#f59e0b]/15 to-[#fcd34d]/10 text-[#fef08a] font-semibold border border-[#fcd34d]/40 ring-1 ring-[#fcd34d]/25 shadow-xs",
    navInactive:
      "text-muted-foreground hover:bg-[#fcd34d]/[0.08] hover:text-[#fef08a] hover:border-[#fcd34d]/20 border border-transparent",
    avatarBorder: "border-[#fcd34d]/40",
    avatarFallback: "rounded-lg bg-[#fcd34d]/15 text-[#fef08a] font-bold text-xs",
    ctaBox:
      "border border-[#fcd34d]/30 bg-gradient-to-b from-[#f59e0b]/12 via-card to-card shadow-2xl shadow-[#f59e0b]/15 backdrop-blur-xl",
    ctaGlow: "bg-[#f59e0b]/20 blur-[110px]",
    ctaBadge: "border border-border/70 bg-card/60 text-muted-foreground",
    selection: "selection:bg-[#f59e0b]/25 selection:text-[#fef08a]",
    callout: {
      border: "border-amber-500/25",
      bg: "bg-amber-500/10",
      text: "text-amber-200",
      accent: "text-amber-400",
    },
    chart: {
      stroke: "#f59e0b",
      stopColor: "#f59e0b",
      fill: "rgba(245, 158, 11, 0.2)",
    },
    confettiColors: ["#f59e0b", "#fcd34d", "#fef08a", "#10b981", "#6366f1"],
    qrCodePresets: [
      { name: "Luminous Gold (Brand)", hex: "#f59e0b" },
      { name: "Classic Black", hex: "#000000" },
      { name: "Chai Indigo", hex: "#4f46e5" },
      { name: "Emerald Green", hex: "#059669" },
      { name: "Crimson Rose", hex: "#e11d48" },
      { name: "Amber Ochre", hex: "#d97706" },
    ],
  },

  // --------------------------------------------------------------------------
  // [3] Sexy Blue (Bold Electric Blue -> Ice Powder Blue)
  // --------------------------------------------------------------------------
  sexy_blue: {
    id: "sexy_blue",
    name: "3. Sexy Blue",
    description:
      "Bold & vibrant shades of electric blue (#007BFF) fading to ice powder blue (#B0E0E6), evoking confidence.",
    paletteHex: ["#007BFF", "#1A8CFF", "#38A3FF", "#68C2E8", "#B0E0E6"],
    primaryHex: "#007BFF",
    primaryLightHex: "#B0E0E6",
    logoGradient:
      "bg-gradient-to-br from-[#007bff] via-[#2d9bf0] to-[#b0e0e6] text-white shadow-md shadow-[#007bff]/30",
    badge:
      "border-[#007bff]/40 bg-[#007bff]/10 text-[#007bff] dark:text-[#5ab4ff] backdrop-blur-md hover:border-[#007bff]/60 hover:bg-[#007bff]/15 transition-all shadow-xs",
    dashboardBadge: "border border-border/70 bg-card/60 text-muted-foreground",
    primaryText: "text-[#007bff] dark:text-[#5ab4ff]",
    gradientText:
      "bg-gradient-to-r from-[#007bff] via-[#38a3ff] to-[#b0e0e6] bg-clip-text text-transparent",
    heroGlow: "bg-gradient-to-tr from-[#007bff]/25 via-[#b0e0e6]/15 to-transparent blur-[140px]",
    primaryButton:
      "bg-gradient-to-r from-[#007bff] via-[#2d9bf0] to-[#68c2e8] hover:opacity-90 active:opacity-95 text-white font-semibold shadow-xs transition-opacity cursor-pointer",
    buttonOutlineHover:
      "hover:border-[#007bff]/40 hover:bg-[#007bff]/10 hover:text-[#5ab4ff] transition-colors",
    buttonGhostHover: "hover:bg-[#007bff]/10 hover:text-[#5ab4ff] transition-colors",
    switchChecked:
      "data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#007bff] data-[state=checked]:via-[#2d9bf0] data-[state=checked]:to-[#68c2e8] data-[state=checked]:border-[#007bff]/60 data-[state=checked]:shadow-[0_0_12px_rgba(0,123,255,0.25)]",
    switchFocus: "focus-visible:ring-[#007bff]/40",
    checkboxChecked:
      "data-[state=checked]:border-[#007bff] data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#007bff] data-[state=checked]:to-[#38a3ff] data-[state=checked]:text-white dark:data-[state=checked]:border-[#007bff] dark:data-[state=checked]:bg-gradient-to-r dark:data-[state=checked]:from-[#007bff] dark:data-[state=checked]:to-[#38a3ff] dark:data-[state=checked]:text-white",
    checkboxFocus: "focus-visible:ring-[#007bff]/40",
    cardBg: "bg-gradient-to-b from-[#007bff]/[0.035] via-card to-card border-border/75",
    cardBeam:
      "absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#007bff]/50 to-transparent group-hover:via-[#007bff] transition-all",
    cardBorderHover: "hover:border-[#007bff]/45 transition-colors duration-150",
    cardHighlightBorder:
      "border-2 border-[#007bff]/70 bg-gradient-to-b from-[#007bff]/15 via-card to-card shadow-2xl shadow-[#007bff]/15",
    cardHighlightBadge: "bg-gradient-to-r from-[#007bff] to-[#68c2e8] text-white font-bold",
    activePill: "bg-foreground text-background font-medium shadow-xs transition-all",
    tabActive: "border border-border/80 bg-secondary/80 text-foreground shadow-2xs font-medium",
    tabInactive:
      "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent transition-colors",
    tabActiveIcon: "group-data-[state=active]:text-[#5ab4ff]",
    iconColor: "text-[#007bff] dark:text-[#5ab4ff]",
    iconBg: "bg-[#007bff]/15 text-[#007bff] dark:text-[#5ab4ff]",
    checkColor: "text-[#007bff] dark:text-[#5ab4ff]",
    progressBar: "bg-gradient-to-r from-[#007bff] via-[#38a3ff] to-[#b0e0e6]",
    ratingStar: "text-[#007bff] dark:text-[#5ab4ff] drop-shadow-[0_0_8px_rgba(0,123,255,0.5)]",
    activeDot: "bg-[#007bff] shadow-[0_0_8px_rgba(0,123,255,0.8)]",
    draftBadge: "bg-secondary text-muted-foreground border border-border/60 text-xs font-normal",
    publishedBadge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs font-normal",
    slugBadge:
      "inline-flex items-center gap-1 text-[11px] font-mono text-[#5ab4ff] bg-[#007bff]/10 border border-[#007bff]/25 px-1.5 py-0.5 rounded",
    tableRowHover: "hover:bg-[#007bff]/[0.05] border-border/50 transition-colors group",
    linkHover: "hover:underline hover:text-[#5ab4ff] transition-colors",
    inputFocus: "focus-visible:ring-[#007bff]/40 focus-visible:border-[#007bff]/50",
    navActive:
      "bg-gradient-to-r from-[#007bff]/15 to-[#38a3ff]/10 text-[#5ab4ff] font-semibold border border-[#007bff]/40 ring-1 ring-[#007bff]/25 shadow-xs",
    navInactive:
      "text-muted-foreground hover:bg-[#007bff]/[0.08] hover:text-[#5ab4ff] hover:border-[#007bff]/20 border border-transparent",
    avatarBorder: "border-[#007bff]/40",
    avatarFallback: "rounded-lg bg-[#007bff]/15 text-[#5ab4ff] font-bold text-xs",
    ctaBox:
      "border border-[#007bff]/35 bg-gradient-to-b from-[#007bff]/15 via-card to-card shadow-2xl shadow-[#007bff]/15",
    ctaGlow: "bg-[#007bff]/25 blur-[100px]",
    ctaBadge: "border border-border/70 bg-card/60 text-muted-foreground",
    selection: "selection:bg-[#007bff]/25 selection:text-[#5ab4ff]",
    callout: {
      border: "border-blue-500/25",
      bg: "bg-blue-500/10",
      text: "text-blue-200",
      accent: "text-blue-400",
    },
    chart: {
      stroke: "#007bff",
      stopColor: "#007bff",
      fill: "rgba(0, 123, 255, 0.2)",
    },
    confettiColors: ["#007bff", "#38a3ff", "#68c2e8", "#10b981", "#a855f7"],
    qrCodePresets: [
      { name: "Electric Blue (Brand)", hex: "#007bff" },
      { name: "Classic Black", hex: "#000000" },
      { name: "Chai Indigo", hex: "#4f46e5" },
      { name: "Emerald Green", hex: "#059669" },
      { name: "Crimson Rose", hex: "#e11d48" },
      { name: "Amber Ochre", hex: "#d97706" },
    ],
  },

  // --------------------------------------------------------------------------
  // [4] Stealth Carbon & Acid Citron (High-Taste / Non-AI Slop)
  // --------------------------------------------------------------------------
  stealth_acid_citron: {
    id: "stealth_acid_citron",
    name: "4. Stealth Carbon & Acid Citron (High-Taste)",
    description:
      "Matte stealth carbon (#0A0B0D) paired with electric acid citron (#CCFF00). Distinct, non-generic craft.",
    paletteHex: ["#CCFF00", "#D4FF00", "#BEF264", "#0A0B0D"],
    primaryHex: "#CCFF00",
    primaryLightHex: "#D4FF00",
    logoGradient:
      "bg-[#ccff00] text-[#0a0b0d] font-bold shadow-md shadow-[#ccff00]/30 ring-1 ring-white/20",
    badge:
      "border-lime-600/30 dark:border-[#ccff00]/30 bg-lime-500/10 dark:bg-[#ccff00]/10 text-lime-800 dark:text-[#ccff00] backdrop-blur-md hover:border-lime-600/50 dark:hover:border-[#ccff00]/50 transition-all shadow-xs",
    dashboardBadge: "border border-border/70 bg-card/60 text-muted-foreground",
    primaryText: "text-lime-800 dark:text-[#ccff00]",
    gradientText:
      "text-lime-800 dark:text-[#ccff00] dark:drop-shadow-[0_2px_10px_rgba(204,255,0,0.15)]",
    heroGlow: "bg-gradient-to-tr from-[#ccff00]/12 via-white/5 to-transparent blur-[140px]",
    primaryButton:
      "bg-[#ccff00] hover:bg-[#b8e600] active:scale-[0.99] text-[#0a0b0d] font-bold shadow-md shadow-[#ccff00]/25 transition-all cursor-pointer",
    buttonOutlineHover:
      "hover:border-lime-600/40 dark:hover:border-[#ccff00]/40 hover:bg-lime-500/10 dark:hover:bg-[#ccff00]/10 hover:text-lime-800 dark:hover:text-[#ccff00] transition-colors",
    buttonGhostHover:
      "hover:bg-lime-500/10 dark:hover:bg-[#ccff00]/10 hover:text-lime-800 dark:hover:text-[#ccff00] transition-colors",
    switchChecked:
      "data-[state=checked]:bg-[#ccff00] data-[state=checked]:border-[#ccff00] data-[state=checked]:text-[#0a0b0d] data-[state=checked]:shadow-[0_0_12px_rgba(204,255,0,0.35)]",
    switchFocus: "focus-visible:ring-[#ccff00]/40",
    checkboxChecked:
      "data-[state=checked]:border-[#ccff00] data-[state=checked]:bg-[#ccff00] data-[state=checked]:text-[#0a0b0d] dark:data-[state=checked]:border-[#ccff00] dark:data-[state=checked]:bg-[#ccff00] dark:data-[state=checked]:text-[#0a0b0d]",
    checkboxFocus: "focus-visible:ring-[#ccff00]/40",
    cardBg: "bg-gradient-to-b from-[#ccff00]/[0.02] via-card to-card border-border/75",
    cardBeam:
      "absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#ccff00]/50 to-transparent group-hover:via-[#ccff00] transition-all",
    cardBorderHover:
      "hover:border-lime-600/40 dark:hover:border-[#ccff00]/40 transition-colors duration-150",
    cardHighlightBorder:
      "border-2 border-lime-600 dark:border-[#ccff00] bg-gradient-to-b from-[#ccff00]/[0.08] via-card to-card shadow-2xl shadow-[#ccff00]/10",
    cardHighlightBadge:
      "bg-lime-600 dark:bg-[#ccff00] text-white dark:text-[#0a0b0d] font-bold shadow-xs",
    activePill:
      "bg-lime-600 dark:bg-[#ccff00] text-white dark:text-[#0a0b0d] font-bold shadow-xs transition-all",
    tabActive:
      "border border-lime-600/40 dark:border-[#ccff00]/40 bg-lime-500/10 dark:bg-[#ccff00]/10 text-lime-800 dark:text-[#ccff00] shadow-xs font-semibold",
    tabInactive:
      "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent transition-colors",
    tabActiveIcon:
      "group-data-[state=active]:text-lime-700 dark:group-data-[state=active]:text-[#ccff00]",
    iconColor: "text-lime-700 dark:text-[#ccff00]",
    iconBg:
      "bg-lime-500/10 dark:bg-[#ccff00]/10 text-lime-800 dark:text-[#ccff00] border border-lime-600/25 dark:border-[#ccff00]/25",
    checkColor: "text-lime-700 dark:text-[#ccff00]",
    progressBar: "bg-[#ccff00] shadow-[0_0_10px_rgba(204,255,0,0.5)]",
    ratingStar: "text-amber-500 dark:text-[#ccff00] drop-shadow-[0_0_8px_rgba(204,255,0,0.6)]",
    activeDot: "bg-lime-600 dark:bg-[#ccff00] shadow-[0_0_8px_rgba(204,255,0,0.8)]",
    draftBadge: "bg-secondary text-muted-foreground border border-border/60 text-xs font-normal",
    publishedBadge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs font-normal",
    slugBadge:
      "inline-flex items-center gap-1 text-[11px] font-mono text-lime-800 dark:text-[#ccff00] bg-lime-500/10 dark:bg-[#ccff00]/10 border border-lime-600/25 dark:border-[#ccff00]/25 px-1.5 py-0.5 rounded",
    tableRowHover: "hover:bg-[#ccff00]/[0.03] border-border/50 transition-colors group",
    linkHover: "hover:underline hover:text-lime-800 dark:hover:text-[#ccff00] transition-colors",
    inputFocus: "focus-visible:ring-[#ccff00]/40 focus-visible:border-[#ccff00]/60",
    navActive:
      "bg-lime-500/10 dark:bg-[#ccff00]/10 text-lime-800 dark:text-[#ccff00] font-semibold border border-lime-600/30 dark:border-[#ccff00]/30 shadow-xs",
    navInactive:
      "text-muted-foreground hover:bg-lime-500/10 dark:hover:bg-[#ccff00]/[0.06] hover:text-lime-800 dark:hover:text-[#ccff00] border border-transparent",
    avatarBorder: "border-lime-600/30 dark:border-[#ccff00]/40",
    avatarFallback:
      "rounded-lg bg-lime-500/15 dark:bg-[#ccff00]/15 text-lime-800 dark:text-[#ccff00] font-bold text-xs",
    ctaBox:
      "border border-lime-600/30 dark:border-[#ccff00]/30 bg-card shadow-2xl shadow-lime-500/10 dark:shadow-[#ccff00]/10",
    ctaGlow: "bg-lime-500/15 dark:bg-[#ccff00]/15 blur-[100px]",
    ctaBadge: "border border-border/70 bg-card/60 text-muted-foreground",
    selection: "selection:bg-[#ccff00] selection:text-[#0a0b0d]",
    callout: {
      border: "border-lime-600/30 dark:border-[#ccff00]/30",
      bg: "bg-lime-500/10 dark:bg-[#ccff00]/10",
      text: "text-lime-800 dark:text-[#ccff00]",
      accent: "text-lime-800 dark:text-[#ccff00]",
    },
    chart: {
      stroke: "#ccff00",
      stopColor: "#ccff00",
      fill: "rgba(204, 255, 0, 0.15)",
    },
    confettiColors: ["#ccff00", "#d4ff00", "#ffffff", "#10b981", "#38bdf8"],
    qrCodePresets: [
      { name: "Acid Citron (Brand)", hex: "#ccff00" },
      { name: "Classic Black", hex: "#000000" },
      { name: "Chai Indigo", hex: "#4f46e5" },
      { name: "Emerald Green", hex: "#059669" },
      { name: "Crimson Rose", hex: "#e11d48" },
      { name: "Amber Ochre", hex: "#d97706" },
    ],
  },
} as const satisfies Record<string, LandingThemeConfig>;

export type ThemePresetKey = keyof typeof THEME_PRESETS;

/**
 * ============================================================================
 * CURRENT ACTIVE GLOBAL THEME SWITCHER
 * ============================================================================
 * Change this single constant to instantly reskin the entire app:
 *   - "frosty_mint"
 *   - "desert_champagne_gold"
 *   - "sexy_blue"
 *   - "stealth_acid_citron" [ACTIVE / HIGH-TASTE]
 * ============================================================================
 */
export const ACTIVE_THEME_ID: ThemePresetKey = "stealth_acid_citron";

// Export active theme tokens
export const landingTheme: LandingThemeConfig = THEME_PRESETS[ACTIVE_THEME_ID];
export const appTheme: LandingThemeConfig = landingTheme;
export const theme: LandingThemeConfig = landingTheme;

/**
 * Toast theme configuration for Sonner notifications
 */
export interface ToastThemeConfig {
  cssVars: Record<string, string>;
  classNames: {
    toast: string;
    title: string;
    description: string;
    actionButton: string;
    cancelButton: string;
    closeButton: string;
    default: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    loading: string;
  };
  icons: {
    success: string;
    error: string;
    warning: string;
    info: string;
    loading: string;
    close: string;
  };
}

export const toastTheme: ToastThemeConfig = {
  cssVars: {
    "--normal-bg": "rgba(24, 24, 27, 0.95)",
    "--normal-border": "rgba(255, 255, 255, 0.12)",
    "--normal-text": "#f4f4f5",
    "--border-radius": "10px",
    "--success-bg": "rgba(6, 78, 59, 0.92)",
    "--success-border": "rgba(16, 185, 129, 0.45)",
    "--success-text": "#ecfdf5",
    "--error-bg": "rgba(76, 5, 25, 0.92)",
    "--error-border": "rgba(244, 63, 94, 0.45)",
    "--error-text": "#fff1f2",
    "--warning-bg": "rgba(69, 26, 3, 0.92)",
    "--warning-border": "rgba(245, 158, 11, 0.45)",
    "--warning-text": "#fefce8",
    "--info-bg": "rgba(23, 37, 84, 0.92)",
    "--info-border": "rgba(59, 130, 246, 0.45)",
    "--info-text": "#eff6ff",
  },
  classNames: {
    toast:
      "group font-sans backdrop-blur-md shadow-2xl border text-sm font-medium transition-all duration-200",
    title: "font-semibold text-sm tracking-tight",
    description: "text-xs opacity-90 leading-relaxed mt-0.5",
    actionButton:
      "font-semibold text-xs rounded-md px-3 py-1.5 transition-all hover:opacity-90 shadow-xs cursor-pointer",
    cancelButton:
      "font-medium text-xs rounded-md px-3 py-1.5 transition-all hover:opacity-90 shadow-xs cursor-pointer",
    closeButton:
      "!border !border-white/10 !bg-white/10 !text-white/80 hover:!bg-white/20 hover:!text-white transition-all",
    default: "!bg-zinc-900/95 !border-zinc-800 !text-zinc-100 shadow-zinc-950/40",
    success: "!bg-emerald-950/92 !border-emerald-500/40 !text-emerald-50 shadow-emerald-950/40",
    error: "!bg-rose-950/92 !border-rose-500/40 !text-rose-50 shadow-rose-950/40",
    warning: "!bg-amber-950/92 !border-amber-500/40 !text-amber-50 shadow-amber-950/40",
    info: "!bg-blue-950/92 !border-blue-500/40 !text-blue-50 shadow-blue-950/40",
    loading: "!bg-neutral-900/95 !border-primary/40 !text-neutral-100 shadow-neutral-950/20",
  },
  icons: {
    success: "size-4 text-emerald-400 shrink-0",
    error: "size-4 text-rose-400 shrink-0",
    warning: "size-4 text-amber-400 shrink-0",
    info: "size-4 text-blue-400 shrink-0",
    loading: `size-4 ${landingTheme.iconColor} shrink-0 animate-spin`,
    close: "size-3.5",
  },
};
