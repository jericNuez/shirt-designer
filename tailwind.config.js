import colors from 'tailwindcss/colors';
import { APP_THEME } from './src/theme/theme.ts';

const getColorPalette = (name) => {
  return colors[name] || colors.indigo;
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic Theme Tokens
        primary: getColorPalette(APP_THEME.primary),
        secondary: getColorPalette(APP_THEME.secondary),
        accent: getColorPalette(APP_THEME.accent),
        surface: getColorPalette(APP_THEME.surface),
        danger: colors.rose,
        success: colors.emerald,
        warning: colors.amber,
        info: colors.sky,
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
