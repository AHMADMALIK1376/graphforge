// GraphForge - Sharp Dark Theme
export const theme = {
  colors: {
    mainBg: "#0d1117",
    cardBg: "#161b22",
    inputBg: "#0d1117",
    hoverBg: "#1c2128",
    categories: {
      comparison: { name: "Comparison", color: "#58a6ff", border: "#1f6feb" },
      correlation: { name: "Correlation", color: "#3fb950", border: "#238636" },
      partToWhole: {
        name: "Part-to-Whole",
        color: "#f85149",
        border: "#da3633",
      },
      temporal: { name: "Temporal", color: "#a371f7", border: "#7c3aed" },
      distribution: {
        name: "Distribution",
        color: "#d29922",
        border: "#9e6a03",
      },
    },
    charts: [
      "#58a6ff",
      "#3fb950",
      "#f85149",
      "#a371f7",
      "#d29922",
      "#79c0ff",
      "#56d364",
      "#ff7b72",
      "#bc8cff",
      "#e3b341",
    ],
    text: {
      heading: "#f0f6fc",
      body: "#c9d1d9",
      muted: "#8b949e",
      placeholder: "#484f58",
    },
    border: {
      default: "#30363d",
      light: "#21262d",
    },
    status: {
      success: "#3fb950",
      warning: "#d29922",
      error: "#f85149",
    },
  },
  borderRadius: {
    sharp: "2px",
    sm: "3px",
    md: "4px",
    lg: "6px",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },
  typography: {
    fontFamily: {
      primary: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
    },
    fontSize: {
      xs: "10px",
      sm: "11px",
      base: "13px",
      md: "14px",
      lg: "16px",
      xxl: "22px",
      hero: "36px",
    },
    fontWeight: {
      bold: 700,
      semibold: 600,
      medium: 500,
      normal: 400,
    },
    letterSpacing: {
      wide: "1px",
      wider: "2px",
    },
  },
  shadows: {
    card: "0 1px 3px rgba(0,0,0,0.5)",
  },
  transitions: {
    fast: "all 0.1s ease",
  },
  zIndex: {
    sticky: 200,
  },
};

export const getCategoryColor = (categoryId) => {
  return theme.colors.categories[categoryId]?.color || theme.colors.charts[0];
};

export default theme;
