import React, { createContext, useContext, useMemo } from "react";
import {
  theme,
  getCategoryColor,
  getChartColor,
  getStatusColor,
  getFontFamily,
} from "./theme";

const ThemeContext = createContext(theme);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    console.warn("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const useThemeColor = (colorKey) => {
  const theme = useTheme();
  return theme.colors?.[colorKey] || theme.colors?.primary?.main;
};

export const ThemeProvider = ({ children }) => {
  // Memoize theme value to prevent unnecessary re-renders
  const themeValue = useMemo(
    () => ({
      ...theme,
      // Additional utility methods
      getCategoryColor,
      getChartColor,
      getStatusColor,
      getFontFamily,
      // Color helper methods
      getPrimaryColor: (shade = "main") => theme.colors.primary[shade],
      getSecondaryColor: (shade = "main") => theme.colors.secondary[shade],
      getColor: (path) => {
        return (
          path.split(".").reduce((obj, key) => obj?.[key], theme.colors) ||
          theme.colors.primary.main
        );
      },
      // Spacing helper
      getSpacing: (size = "md") => theme.spacing[size] || theme.spacing.md,
      // Border radius helper
      getBorderRadius: (size = "md") =>
        theme.borderRadius[size] || theme.borderRadius.md,
      // Shadow helper
      getShadow: (size = "md") => theme.shadows[size] || theme.shadows.md,
      // Typography helper
      getTypography: (key) => {
        const [category, subKey] = key.split(".");
        if (category === "fontSize")
          return (
            theme.typography.fontSize[subKey] || theme.typography.fontSize.base
          );
        if (category === "fontWeight")
          return (
            theme.typography.fontWeight[subKey] ||
            theme.typography.fontWeight.normal
          );
        if (category === "lineHeight")
          return (
            theme.typography.lineHeight[subKey] ||
            theme.typography.lineHeight.normal
          );
        if (category === "letterSpacing")
          return (
            theme.typography.letterSpacing[subKey] ||
            theme.typography.letterSpacing.normal
          );
        return theme.typography[category]?.[subKey];
      },
      // Check if theme is dark or light
      isLight: true, // Warm theme is light
      isDark: false,
    }),
    [],
  );

  return (
    <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
  );
};

// ==============================================
// HOOK FOR CSS VARIABLES (Optional)
// ==============================================

export const useThemeCSS = () => {
  const theme = useTheme();

  return useMemo(() => {
    const colors = theme.colors;
    return {
      "--color-primary": colors.primary.main,
      "--color-primary-light": colors.primary.light,
      "--color-primary-dark": colors.primary.dark,
      "--color-secondary": colors.secondary.main,
      "--color-secondary-light": colors.secondary.light,
      "--color-secondary-dark": colors.secondary.dark,
      "--color-main-bg": colors.mainBg,
      "--color-card-bg": colors.cardBg,
      "--color-text-heading": colors.text.heading,
      "--color-text-body": colors.text.body,
      "--color-text-muted": colors.text.muted,
      "--color-border": colors.border.default,
      "--color-border-light": colors.border.light,
      "--color-success": colors.status.success,
      "--color-warning": colors.status.warning,
      "--color-error": colors.status.error,
      "--color-info": colors.status.info,
      "--font-primary": theme.typography.fontFamily.primary,
      "--font-secondary": theme.typography.fontFamily.secondary,
      "--font-mono": theme.typography.fontFamily.mono,
    };
  }, [theme]);
};

export default ThemeProvider;
