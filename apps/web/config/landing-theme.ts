/**
 * ============================================================================
 * CHAI FORM - GLOBAL LANDING & PUBLIC THEME SYSTEM
 * ============================================================================
 * Centralized theme tokens for all public-facing pages:
 *  - Landing Page (/) & all sections (Hero, LiveDemo, Templates, Bento, CTA, Footer)
 *  - Templates Showcase (/templates)
 *  - Pricing Page (/pricing)
 *
 * 🎮 HOW TO SWITCH THEMES:
 * Change `ACTIVE_THEME_ID` at the bottom of this file to any preset key:
 *   - "frosty_mint"           : [1] Frosty Mint (#17C662 -> #F5FF6C)
 *   - "desert_champagne_gold" : [2] Luminous Champagne Gold (#F59E0B -> #FEF9C3 - Light & Bright)
 *   - "sexy_blue"             : [3] Sexy Blue (#007BFF -> #B0E0E6)
 * ============================================================================
 */

export interface LandingThemeConfig {
  id: string;
  name: string;
  description: string;
  paletteHex: string[];
  // Brand Logo
  logoGradient: string;
  // Hero & Header
  badge: string;
  primaryText: string;
  gradientText: string;
  heroGlow: string;
  // Primary CTA Buttons
  primaryButton: string;
  // Card & Border Styling
  cardBorderHover: string;
  cardHighlightBorder: string;
  cardHighlightBadge: string;
  // Filter pills & Toggles
  activePill: string;
  // Interactive Elements & Icons
  iconColor: string;
  iconBg: string;
  checkColor: string;
  progressBar: string;
  ratingStar: string;
  // Bottom CTA Section Box
  ctaBox: string;
  ctaGlow: string;
  ctaBadge: string;
  // Selection
  selection: string;
}

export const THEME_PRESETS = {
  // --------------------------------------------------------------------------
  // [1] Frosty Mint (Designali #17C662 -> #F5FF6C)
  // --------------------------------------------------------------------------
  frosty_mint: {
    id: "frosty_mint",
    name: "1. Frosty Mint",
    description: "Vibrant electric mint green (#17C662) smoothly blending into bright citrus lemon-lime (#F5FF6C).",
    paletteHex: ["#17C662", "#47DE79", "#75E96E", "#B1F46A", "#F5FF6C"],
    logoGradient: "bg-gradient-to-br from-[#17c662] via-[#52e88f] to-[#f5ff6c] text-neutral-950 shadow-md shadow-[#17c662]/30",
    badge: "border-[#17c662]/40 bg-[#17c662]/10 text-[#17c662] dark:text-[#52e88f]",
    primaryText: "text-[#17c662] dark:text-[#52e88f]",
    gradientText: "bg-gradient-to-r from-[#17c662] via-[#6aed61] to-[#f5ff6c] bg-clip-text text-transparent",
    heroGlow: "bg-gradient-to-tr from-[#17c662]/20 via-[#f5ff6c]/10 to-transparent blur-[140px]",
    primaryButton: "bg-gradient-to-r from-[#17c662] via-[#75e96e] to-[#b1f46a] hover:opacity-90 text-neutral-950 font-bold shadow-lg shadow-[#17c662]/25",
    cardBorderHover: "hover:border-[#17c662]/50 hover:shadow-lg hover:shadow-[#17c662]/10",
    cardHighlightBorder: "border-2 border-[#17c662]/70 bg-gradient-to-b from-[#17c662]/15 via-card to-card shadow-2xl shadow-[#17c662]/15",
    cardHighlightBadge: "bg-gradient-to-r from-[#17c662] to-[#b1f46a] text-neutral-950 font-bold",
    activePill: "bg-gradient-to-r from-[#17c662] to-[#75e96e] text-neutral-950 shadow-xs font-bold scale-105",
    iconColor: "text-[#17c662]",
    iconBg: "bg-[#17c662]/15 text-[#17c662] dark:text-[#52e88f]",
    checkColor: "text-[#17c662]",
    progressBar: "bg-gradient-to-r from-[#17c662] via-[#75e96e] to-[#f5ff6c]",
    ratingStar: "text-[#17c662] drop-shadow-[0_0_8px_rgba(23,198,98,0.5)]",
    ctaBox: "border border-[#17c662]/35 bg-gradient-to-b from-[#17c662]/15 via-card to-card shadow-2xl shadow-[#17c662]/15",
    ctaGlow: "bg-[#17c662]/25 blur-[100px]",
    ctaBadge: "bg-[#17c662]/10 border border-[#17c662]/35 text-[#17c662] dark:text-[#52e88f]",
    selection: "selection:bg-[#17c662]/25 selection:text-[#17c662]",
  },

  // --------------------------------------------------------------------------
  // [2] Luminous Champagne Gold (Polished Luxury Edition)
  // --------------------------------------------------------------------------
  desert_champagne_gold: {
    id: "desert_champagne_gold",
    name: "2. Luminous Champagne Gold (Polished Luxury)",
    description: "Bright golden sunlight (#F59E0B) into shimmering champagne cream (#FEF9C3). Clean, radiant luxury.",
    paletteHex: ["#F59E0B", "#FCD34D", "#FEF08A", "#FEF9C3"],
    logoGradient: "bg-gradient-to-br from-[#f59e0b] via-[#fcd34d] to-[#fef9c3] text-neutral-950 shadow-md shadow-[#f59e0b]/30 ring-1 ring-white/20",
    badge: "border-[#fcd34d]/35 bg-[#fcd34d]/10 text-[#fef08a] backdrop-blur-md hover:border-[#fcd34d]/60 hover:bg-[#fcd34d]/15 transition-all shadow-xs",
    primaryText: "text-[#fef08a]",
    gradientText: "bg-gradient-to-r from-[#f59e0b] via-[#fcd34d] to-[#fef9c3] bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(245,158,11,0.2)]",
    heroGlow: "bg-gradient-to-tr from-[#f59e0b]/22 via-[#fcd34d]/12 to-transparent blur-[140px]",
    primaryButton: "bg-gradient-to-r from-[#f59e0b] via-[#fcd34d] to-[#fef08a] hover:brightness-105 active:scale-[0.98] text-neutral-950 font-bold shadow-lg shadow-[#f59e0b]/25 hover:shadow-xl hover:shadow-[#fcd34d]/35 transition-all duration-200 cursor-pointer",
    cardBorderHover: "hover:border-[#fcd34d]/50 hover:shadow-lg hover:shadow-[#f59e0b]/12 transition-all duration-200",
    cardHighlightBorder: "border-2 border-[#fcd34d]/65 bg-gradient-to-b from-[#f59e0b]/12 via-card to-card shadow-2xl shadow-[#f59e0b]/15 hover:border-[#fcd34d]/85 transition-all",
    cardHighlightBadge: "bg-gradient-to-r from-[#f59e0b] to-[#fcd34d] text-neutral-950 font-bold shadow-xs",
    activePill: "bg-gradient-to-r from-[#f59e0b] via-[#fcd34d] to-[#fef08a] text-neutral-950 font-bold shadow-md shadow-[#f59e0b]/25 scale-105 transition-all",
    iconColor: "text-[#fcd34d]",
    iconBg: "bg-[#fcd34d]/15 text-[#fef08a] border border-[#fcd34d]/25",
    checkColor: "text-[#fcd34d]",
    progressBar: "bg-gradient-to-r from-[#f59e0b] via-[#fcd34d] to-[#fef9c3] shadow-xs shadow-[#f59e0b]/40",
    ratingStar: "text-[#fcd34d] drop-shadow-[0_0_10px_rgba(252,211,77,0.7)]",
    ctaBox: "border border-[#fcd34d]/30 bg-gradient-to-b from-[#f59e0b]/12 via-card to-card shadow-2xl shadow-[#f59e0b]/15 backdrop-blur-xl",
    ctaGlow: "bg-[#f59e0b]/20 blur-[110px]",
    ctaBadge: "bg-[#fcd34d]/10 border border-[#fcd34d]/30 text-[#fef08a] backdrop-blur-sm",
    selection: "selection:bg-[#f59e0b]/25 selection:text-[#fef08a]",
  },

  // --------------------------------------------------------------------------
  // [3] Sexy Blue (Designali #007BFF -> #B0E0E6)
  // --------------------------------------------------------------------------
  sexy_blue: {
    id: "sexy_blue",
    name: "3. Sexy Blue",
    description: "Bold & vibrant shades of electric blue (#007BFF) fading to ice powder blue (#B0E0E6), evoking confidence.",
    paletteHex: ["#007BFF", "#1A8CFF", "#38A3FF", "#68C2E8", "#B0E0E6"],
    logoGradient: "bg-gradient-to-br from-[#007bff] via-[#2d9bf0] to-[#b0e0e6] text-white shadow-md shadow-[#007bff]/30",
    badge: "border-[#007bff]/40 bg-[#007bff]/10 text-[#007bff] dark:text-[#5ab4ff]",
    primaryText: "text-[#007bff] dark:text-[#5ab4ff]",
    gradientText: "bg-gradient-to-r from-[#007bff] via-[#38a3ff] to-[#b0e0e6] bg-clip-text text-transparent",
    heroGlow: "bg-gradient-to-tr from-[#007bff]/25 via-[#b0e0e6]/15 to-transparent blur-[140px]",
    primaryButton: "bg-gradient-to-r from-[#007bff] via-[#2d9bf0] to-[#68c2e8] hover:opacity-90 text-white font-semibold shadow-lg shadow-[#007bff]/25",
    cardBorderHover: "hover:border-[#007bff]/50 hover:shadow-lg hover:shadow-[#007bff]/15",
    cardHighlightBorder: "border-2 border-[#007bff]/70 bg-gradient-to-b from-[#007bff]/15 via-card to-card shadow-2xl shadow-[#007bff]/15",
    cardHighlightBadge: "bg-gradient-to-r from-[#007bff] to-[#68c2e8] text-white font-bold",
    activePill: "bg-gradient-to-r from-[#007bff] to-[#38a3ff] text-white shadow-xs font-semibold scale-105",
    iconColor: "text-[#007bff] dark:text-[#5ab4ff]",
    iconBg: "bg-[#007bff]/15 text-[#007bff] dark:text-[#5ab4ff]",
    checkColor: "text-[#007bff] dark:text-[#5ab4ff]",
    progressBar: "bg-gradient-to-r from-[#007bff] via-[#38a3ff] to-[#b0e0e6]",
    ratingStar: "text-[#007bff] dark:text-[#5ab4ff] drop-shadow-[0_0_8px_rgba(0,123,255,0.5)]",
    ctaBox: "border border-[#007bff]/35 bg-gradient-to-b from-[#007bff]/15 via-card to-card shadow-2xl shadow-[#007bff]/15",
    ctaGlow: "bg-[#007bff]/25 blur-[100px]",
    ctaBadge: "bg-[#007bff]/10 border border-[#007bff]/35 text-[#007bff] dark:text-[#5ab4ff]",
    selection: "selection:bg-[#007bff]/25 selection:text-[#5ab4ff]",
  },
} as const satisfies Record<string, LandingThemeConfig>;

export type ThemePresetKey = keyof typeof THEME_PRESETS;

/**
 * ============================================================================
 * 👉 CURRENT ACTIVE THEME SWITCHER
 * ============================================================================
 * Change this value to any of the 3 top finalist keys:
 * 
 *   "frosty_mint"           -> [1] Frosty Mint (#17C662 -> #F5FF6C)
 *   "desert_champagne_gold" -> [2] Luminous Champagne Gold (#F59E0B -> #FEF9C3 - Light & Bright)
 *   "sexy_blue"             -> [3] Sexy Blue (#007BFF -> #B0E0E6)
 * ============================================================================
 */

// Active theme ID (change this to test):
export const ACTIVE_THEME_ID: ThemePresetKey = "desert_champagne_gold";

// Export active theme across all landing & public pages:
export const landingTheme: LandingThemeConfig = THEME_PRESETS[ACTIVE_THEME_ID];
