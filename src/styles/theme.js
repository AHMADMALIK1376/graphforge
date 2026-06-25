// src/styles/theme.js
// ============================================
// GRAPHFORGE - WARM PROFESSIONAL THEME
// With Bungee Font Family
// ============================================

export const theme = {
  colors: {
    // ===== BACKGROUND SYSTEM =====
    mainBg: "#F5EDE0",
    cardBg: "#FFFFFF",
    inputBg: "#F5EDE0",
    hoverBg: "#DED0BC",
    overlayBg: "rgba(245, 237, 224, 0.85)",

    // ===== PRIMARY COLORS =====
    primary: {
      main: "#A8DCF0", // Lighter Sky Blue (was #82C8E5)
      light: "#C5E8F5", // Even lighter sky blue
      dark: "#82C8E5", // Darker sky blue (now the old color)
    },

    // ===== SECONDARY COLORS =====
    secondary: {
      main: "#F88379",
      light: "#FAA89F",
      dark: "#D15F55",
    },

    // ===== ACCENT COLORS =====
    accent: {
      yellow: "#FFF3A0", // Lighter Yellow (was #FFEB3B)
      yellowLight: "rgba(255, 243, 160, 0.15)",
      beige: "#E6D8C4",
      beigeDark: "#D4C4AE",
      coral: "#F88379",
      coralLight: "rgba(248, 131, 121, 0.15)",
    },

    // ===== CHART CATEGORY COLORS =====
    categories: {
      comparison: {
        name: "Comparison",
        color: "#A8DCF0", // Lighter Sky Blue
        border: "#82C8E5",
        light: "rgba(168, 220, 240, 0.15)",
      },
      correlation: {
        name: "Correlation",
        color: "#F88379",
        border: "#D15F55",
        light: "rgba(248, 131, 121, 0.15)",
      },
      partToWhole: {
        name: "Part-to-Whole",
        color: "#FFF3A0", // Lighter Yellow
        border: "#E8D870",
        light: "rgba(255, 243, 160, 0.15)",
      },
      distribution: {
        name: "Distribution",
        color: "#A8DCF0", // Lighter Sky Blue
        border: "#82C8E5",
        light: "rgba(168, 220, 240, 0.15)",
      },
      temporal: {
        name: "Temporal",
        color: "#E6D8C4",
        border: "#D4C4AE",
        light: "rgba(230, 216, 196, 0.30)",
      },
      geospatial: {
        name: "Geospatial & Other",
        color: "#06b6d4", // Teal/Cyan
        border: "#0891b2",
        light: "rgba(6, 182, 212, 0.15)",
      },
    },

    // ===== CHART PALETTE =====
    charts: [
      "#A8DCF0", // Lighter Sky Blue
      "#F88379", // Coral Pink
      "#FFF3A0", // Lighter Yellow
      "#E6D8C4", // Warm Beige
      "#82C8E5", // Sky Blue
      "#D15F55", // Darker Coral
      "#E8D870", // Darker Yellow
      "#D4C4AE", // Darker Beige
      "#C5E8F5", // Very Light Sky Blue
      "#FAA89F", // Light Coral
      "#4CAF50", // Green
      "#FFB74D", // Orange
      "#06b6d4", // Teal/Cyan - Geospatial
      "#0891b2", // Darker Teal
    ],

    // ===== TEXT SYSTEM =====
    text: {
      heading: "#4A3728",
      body: "#5C4A3A",
      muted: "#8A7A6A",
      placeholder: "#B0A090",
      inverse: "#FFFFFF",
      link: "#A8DCF0", // Lighter Sky Blue for links
      success: "#4CAF50",
      error: "#D15F55",
      warning: "#FFF3A0", // Lighter Yellow for warnings
      light: "#F5EDE0",
    },

    // ===== BORDER SYSTEM =====
    border: {
      default: "#D4C4AE",
      light: "#E8DCC8",
      strong: "#B0A090",
      accent: "#A8DCF0", // Lighter Sky Blue
      success: "#4CAF50",
      warning: "#FFF3A0", // Lighter Yellow
      error: "#D15F55",
      info: "#A8DCF0", // Lighter Sky Blue
    },

    // ===== STATUS COLORS =====
    status: {
      success: "#4CAF50",
      successBg: "rgba(76, 175, 80, 0.12)",
      warning: "#FFF3A0", // Lighter Yellow
      warningBg: "rgba(255, 243, 160, 0.12)",
      error: "#D15F55",
      errorBg: "rgba(209, 95, 85, 0.12)",
      info: "#A8DCF0", // Lighter Sky Blue
      infoBg: "rgba(168, 220, 240, 0.12)",
    },

    // ===== CHART ELEMENTS =====
    chartElements: {
      grid: "#E8DCC8",
      axis: "#B0A090",
      tooltip: {
        bg: "#FFFFFF",
        border: "#D4C4AE",
        text: "#4A3728",
      },
      legend: "#5C4A3A",
      label: "#5C4A3A",
      crosshair: "#E6D8C4",
    },
  },

  // ==============================================
  // SPACING
  // ==============================================
  spacing: {
    none: "0px",
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
    xxxl: "64px",
  },

  // ==============================================
  // BORDER RADIUS
  // ==============================================
  borderRadius: {
    none: "0px",
    sharp: "2px",
    sm: "4px",
    md: "6px",
    lg: "8px",
    xl: "12px",
    full: "9999px",
  },

  // ==============================================
  // SHADOWS
  // ==============================================
  shadows: {
    none: "none",
    sm: "0 1px 3px rgba(180, 160, 140, 0.12)",
    md: "0 2px 8px rgba(180, 160, 140, 0.10)",
    lg: "0 4px 16px rgba(180, 160, 140, 0.08)",
    xl: "0 8px 32px rgba(180, 160, 140, 0.06)",
    inner: "inset 0 1px 3px rgba(180, 160, 140, 0.06)",
    outline: "0 0 0 2px #A8DCF0", // Lighter Sky Blue
    card: "0 2px 8px rgba(180, 160, 140, 0.10)",
    button: "0 1px 3px rgba(180, 160, 140, 0.12)",
    dropdown: "0 8px 24px rgba(180, 160, 140, 0.10)",
  },

  // ==============================================
  // TYPOGRAPHY
  // ==============================================
  typography: {
    fontFamily: {
      primary: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
      secondary: "'Inter', 'Segoe UI', -apple-system, sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
    },
    fontSize: {
      xs: "10px",
      sm: "11px",
      base: "13px",
      md: "14px",
      lg: "16px",
      xl: "18px",
      xxl: "22px",
      xxxl: "28px",
      hero: "36px",
      display: "48px",
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 900,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.7,
    },
    letterSpacing: {
      tight: "-0.5px",
      normal: "0px",
      wide: "1px",
      wider: "2px",
      widest: "4px",
    },
  },

  // ==============================================
  // TRANSITIONS
  // ==============================================
  transitions: {
    fast: "all 0.15s ease",
    normal: "all 0.25s ease",
    slow: "all 0.4s ease",
    none: "none",
  },

  // ==============================================
  // Z-INDEX
  // ==============================================
  zIndex: {
    base: 1,
    dropdown: 100,
    sticky: 200,
    modal: 300,
    tooltip: 400,
    toast: 500,
  },

  // ==============================================
  // BREAKPOINTS
  // ==============================================
  breakpoints: {
    mobile: "480px",
    tablet: "768px",
    laptop: "1024px",
    desktop: "1280px",
    wide: "1440px",
  },

  // ==============================================
  // CHART DIMENSIONS
  // ==============================================
  chart: {
    height: {
      sm: "250px",
      md: "350px",
      lg: "450px",
      xl: "550px",
    },
    padding: {
      sm: "8px",
      md: "16px",
      lg: "24px",
    },
    strokeWidth: {
      thin: "1px",
      normal: "2px",
      thick: "3px",
    },
    dotRadius: {
      sm: "3px",
      md: "4px",
      lg: "6px",
    },
  },
};

// ==============================================
// HELPER FUNCTIONS
// ==============================================

export const getCategoryColor = (categoryId) => {
  return theme.colors.categories[categoryId]?.color || theme.colors.charts[0];
};

export const getCategoryBorder = (categoryId) => {
  return (
    theme.colors.categories[categoryId]?.border || theme.colors.border.default
  );
};

export const getChartColor = (index) => {
  return theme.colors.charts[index % theme.colors.charts.length];
};

export const getStatusColor = (status) => {
  return theme.colors.status[status] || theme.colors.charts[0];
};

export const getStatusBg = (status) => {
  return theme.colors.status[`${status}Bg`] || theme.colors.status.infoBg;
};

export const adjustColor = (hex, percent) => {
  try {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, Math.max(0, (num >> 16) + amt));
    const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
    const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
  } catch {
    return hex;
  }
};

export const isLightColor = (hex) => {
  try {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = (num >> 16) & 0xff;
    const g = (num >> 8) & 0xff;
    const b = num & 0xff;
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  } catch {
    return false;
  }
};

export const getContrastTextColor = (bgColor) => {
  return isLightColor(bgColor) ? "#4A3728" : "#FFFFFF";
};

export const withOpacity = (hex, opacity) => {
  try {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = (num >> 16) & 0xff;
    const g = (num >> 8) & 0xff;
    const b = num & 0xff;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  } catch {
    return hex;
  }
};

export const getPrimaryColor = (shade = "main") => {
  return theme.colors.primary[shade] || theme.colors.primary.main;
};

export const getSecondaryColor = (shade = "main") => {
  return theme.colors.secondary[shade] || theme.colors.secondary.main;
};

export const getFontFamily = (type = "primary") => {
  return (
    theme.typography.fontFamily[type] || theme.typography.fontFamily.primary
  );
};

export default theme;
