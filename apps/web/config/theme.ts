/**
 * ============================================================================
 * CHAI FORM - GLOBAL THEME ENTRY POINT
 * ============================================================================
 * Central single-source-of-truth export for the ChaiForm design system.
 * Import `theme` or `appTheme` or `landingTheme` directly from `~/config/theme`.
 * ============================================================================
 */

export {
  theme,
  appTheme,
  landingTheme,
  toastTheme,
  ACTIVE_THEME_ID,
  THEME_PRESETS,
  type LandingThemeConfig,
  type LandingThemeConfig as AppThemeConfig,
  type ThemePresetKey,
  type ToastThemeConfig,
  type QrCodePreset,
} from "./landing-theme";
