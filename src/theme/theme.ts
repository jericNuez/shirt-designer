/**
 * 🎨 CENTRALIZED THEME TOKENS CONFIGURATION
 *
 * Customize any color token here.
 * Changing these tokens updates every component across the entire app automatically!
 */

export type ThemePreset =
  'indigo' | 'emerald' | 'violet' | 'cyan' | 'rose' | 'amber' | 'blue' | 'teal';

export interface AppTheme {
  primary: ThemePreset;
  secondary: ThemePreset;
  accent: ThemePreset;
  surface: 'slate' | 'zinc' | 'neutral' | 'gray';
}

export const APP_THEME: AppTheme = {
  // Primary brand: buttons, active tabs, 3D gizmo borders, sliders, primary badges
  primary: 'blue',

  // Secondary brand: gradient blends, secondary highlights, tags
  secondary: 'indigo',

  // Accent: sparkles, star icons, special highlights
  accent: 'amber',

  // Surface: studio background, modals, panels, inputs
  surface: 'slate',
};
