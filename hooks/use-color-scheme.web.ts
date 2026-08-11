import { useThemeContext } from "@/lib/theme-provider";

/**
 * Web build resolves this file instead of use-color-scheme.ts (Metro
 * platform extension resolution). The app forces dark mode everywhere via
 * ThemeProvider, so this must mirror the native hook instead of reading the
 * browser's prefers-color-scheme -- otherwise web/tunnel views flip to light
 * mode whenever the OS/browser is in light mode.
 */
export function useColorScheme() {
  return useThemeContext().colorScheme;
}
