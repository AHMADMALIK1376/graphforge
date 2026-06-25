// src/utils/chartTypes.js

// ============================================
// GRAPHFORGE - CHART TYPES REGISTRY
// All 77 chart types across 6 categories
// ============================================

export const CHART_CATEGORIES = {
  comparison: {
    id: "comparison",
    label: "📊 Comparison",
    color: "#0077C8",
    description: "Compare values across categories",
    charts: {
      barChart: {
        name: "Bar Chart",
        icon: "📊",
        difficulty: "easy",
        category: "comparison",
      },
      columnChart: {
        name: "Column Chart",
        icon: "📊",
        difficulty: "easy",
        category: "comparison",
      },
      groupedBar: {
        name: "Grouped Bar Chart",
        icon: "📊",
        difficulty: "easy",
        category: "comparison",
      },
      lollipop: {
        name: "Lollipop Chart",
        icon: "🍭",
        difficulty: "medium",
        category: "comparison",
      },
      bullet: {
        name: "Bullet Chart",
        icon: "🎯",
        difficulty: "medium",
        category: "comparison",
      },
      dotPlot: {
        name: "Dot Plot",
        icon: "⚫",
        difficulty: "easy",
        category: "comparison",
      },
      dumbbell: {
        name: "Dumbbell Chart",
        icon: "🏋️",
        difficulty: "medium",
        category: "comparison",
      },
      pictogram: {
        name: "Pictogram",
        icon: "🖼️",
        difficulty: "medium",
        category: "comparison",
      },
      iconChart: {
        name: "Icon Chart",
        icon: "🔷",
        difficulty: "medium",
        category: "comparison",
      },
      rangeChart: {
        name: "Range Chart",
        icon: "↔️",
        difficulty: "medium",
        category: "comparison",
      },
      radialBar: {
        name: "Radial Bar Chart",
        icon: "📊",
        difficulty: "hard",
        category: "comparison",
      },
      parallelCoordinates: {
        name: "Parallel Coordinates",
        icon: "〰️",
        difficulty: "hard",
        category: "comparison",
      },
      radar: {
        name: "Radar Chart",
        icon: "📡",
        difficulty: "easy",
        category: "comparison",
      },
      nightingale: {
        name: "Nightingale Chart",
        icon: "🌸",
        difficulty: "hard",
        category: "comparison",
      },
      waterfall: {
        name: "Waterfall Chart",
        icon: "🌊",
        difficulty: "medium",
        category: "comparison",
      },
      matrix: {
        name: "Matrix Chart",
        icon: "🔲",
        difficulty: "hard",
        category: "comparison",
      },
      smallMultiples: {
        name: "Small Multiples",
        icon: "📊",
        difficulty: "hard",
        category: "comparison",
      },
      wordCloud: {
        name: "Word Cloud",
        icon: "☁️",
        difficulty: "medium",
        category: "comparison",
      },
      slope: {
        name: "Slope Chart",
        icon: "📈",
        difficulty: "medium",
        category: "comparison",
      },
      table: {
        name: "Table Chart",
        icon: "📋",
        difficulty: "easy",
        category: "comparison",
      },
      categoricalScatter: {
        name: "Categorical Scatter",
        icon: "⚫",
        difficulty: "medium",
        category: "comparison",
      },
      quadrant: {
        name: "Quadrant Chart",
        icon: "➕",
        difficulty: "medium",
        category: "comparison",
      },
    },
  },

  correlation: {
    id: "correlation",
    label: "🔗 Correlation",
    color: "#F88379",
    description: "Show relationships between variables",
    charts: {
      heatmap: {
        name: "Heatmap",
        icon: "🌡️",
        difficulty: "medium",
        category: "correlation",
      },
      bubble: {
        name: "Bubble Chart",
        icon: "🫧",
        difficulty: "medium",
        category: "correlation",
      },
      scatter: {
        name: "Scatter Plot",
        icon: "⚫",
        difficulty: "easy",
        category: "correlation",
      },
      connectedScatter: {
        name: "Connected Scatter",
        icon: "🔗",
        difficulty: "medium",
        category: "correlation",
      },
      hexagonalBinning: {
        name: "Hexagonal Binning",
        icon: "⬡",
        difficulty: "hard",
        category: "correlation",
      },
      contour: {
        name: "Contour Plot",
        icon: "🗺️",
        difficulty: "hard",
        category: "correlation",
      },
    },
  },

  partToWhole: {
    id: "partToWhole",
    label: "🥧 Part-to-Whole",
    color: "#F2D24B",
    description: "Show composition and hierarchy",
    charts: {
      stackedBar: {
        name: "Stacked Bar Chart",
        icon: "📊",
        difficulty: "easy",
        category: "partToWhole",
      },
      divergingBar: {
        name: "Diverging Bar Chart",
        icon: "↔️",
        difficulty: "medium",
        category: "partToWhole",
      },
      populationPyramid: {
        name: "Population Pyramid",
        icon: "🔺",
        difficulty: "medium",
        category: "partToWhole",
      },
      iconArray: {
        name: "Icon Array",
        icon: "🔷",
        difficulty: "medium",
        category: "partToWhole",
      },
      waffle: {
        name: "Waffle Chart",
        icon: "🧇",
        difficulty: "medium",
        category: "partToWhole",
      },
      pie: {
        name: "Pie Chart",
        icon: "🥧",
        difficulty: "easy",
        category: "partToWhole",
      },
      donut: {
        name: "Donut Chart",
        icon: "🍩",
        difficulty: "easy",
        category: "partToWhole",
      },
      semiCircleDonut: {
        name: "Semi-Circle Donut",
        icon: "🌓",
        difficulty: "medium",
        category: "partToWhole",
      },
      marimekko: {
        name: "Marimekko Chart",
        icon: "📊",
        difficulty: "hard",
        category: "partToWhole",
      },
      treemap: {
        name: "Treemap",
        icon: "🗺️",
        difficulty: "hard",
        category: "partToWhole",
      },
      circularTreemap: {
        name: "Circular Treemap",
        icon: "⭕",
        difficulty: "hard",
        category: "partToWhole",
      },
      convexTreemap: {
        name: "Convex Treemap",
        icon: "🔷",
        difficulty: "hard",
        category: "partToWhole",
      },
      dendrogram: {
        name: "Dendrogram",
        icon: "🌳",
        difficulty: "hard",
        category: "partToWhole",
      },
      venn: {
        name: "Venn Diagram",
        icon: "⭕",
        difficulty: "medium",
        category: "partToWhole",
      },
      euler: {
        name: "Euler Diagram",
        icon: "⭕",
        difficulty: "hard",
        category: "partToWhole",
      },
      circularGauge: {
        name: "Circular Gauge",
        icon: "⏱️",
        difficulty: "medium",
        category: "partToWhole",
      },
      sunburst: {
        name: "Sunburst Chart",
        icon: "☀️",
        difficulty: "hard",
        category: "partToWhole",
      },
      funnel: {
        name: "Funnel & Pyramid",
        icon: "🔻",
        difficulty: "medium",
        category: "partToWhole",
      },
    },
  },

  temporal: {
    id: "temporal",
    label: "⏳ Temporal",
    color: "#D4A373",
    description: "Show data over time",
    charts: {
      area: {
        name: "Area Chart",
        icon: "🏔️",
        difficulty: "easy",
        category: "temporal",
      },
      stackedArea: {
        name: "Stacked Area Chart",
        icon: "🏔️",
        difficulty: "easy",
        category: "temporal",
      },
      streamGraph: {
        name: "Stream Graph",
        icon: "🌊",
        difficulty: "hard",
        category: "temporal",
      },
      bump: {
        name: "Bump Chart",
        icon: "📈",
        difficulty: "medium",
        category: "temporal",
      },
      bumpArea: {
        name: "Bump Area Chart",
        icon: "📈",
        difficulty: "medium",
        category: "temporal",
      },
      line: {
        name: "Line Chart",
        icon: "📈",
        difficulty: "easy",
        category: "temporal",
      },
      spline: {
        name: "Spline Chart",
        icon: "〰️",
        difficulty: "easy",
        category: "temporal",
      },
      stepLine: {
        name: "Step Line Chart",
        icon: "📶",
        difficulty: "easy",
        category: "temporal",
      },
      candlestick: {
        name: "Candlestick Chart",
        icon: "🕯️",
        difficulty: "hard",
        category: "temporal",
      },
      gantt: {
        name: "Gantt Chart",
        icon: "📅",
        difficulty: "medium",
        category: "temporal",
      },
      barcode: {
        name: "Barcode Chart",
        icon: "🔲",
        difficulty: "medium",
        category: "temporal",
      },
      ohlc: {
        name: "OHLC Chart",
        icon: "📊",
        difficulty: "hard",
        category: "temporal",
      },
    },
  },

  distribution: {
    id: "distribution",
    label: "📉 Distribution",
    color: "#A9C632",
    description: "Show data spread and frequency",
    charts: {
      density: {
        name: "Density Plot",
        icon: "📈",
        difficulty: "medium",
        category: "distribution",
      },
      ridgeline: {
        name: "Ridgeline Plot",
        icon: "🏔️",
        difficulty: "hard",
        category: "distribution",
      },
      horizon: {
        name: "Horizon Chart",
        icon: "🌅",
        difficulty: "hard",
        category: "distribution",
      },
      histogram: {
        name: "Histogram",
        icon: "📊",
        difficulty: "easy",
        category: "distribution",
      },
      radialHistogram: {
        name: "Radial Histogram",
        icon: "📊",
        difficulty: "hard",
        category: "distribution",
      },
      strip: {
        name: "Strip Plot",
        icon: "📏",
        difficulty: "medium",
        category: "distribution",
      },
      jitter: {
        name: "Jitter Plot",
        icon: "⚫",
        difficulty: "medium",
        category: "distribution",
      },
      oneDHeatmap: {
        name: "1D Heatmap",
        icon: "🌡️",
        difficulty: "medium",
        category: "distribution",
      },
      beeswarm: {
        name: "Beeswarm Chart",
        icon: "🐝",
        difficulty: "hard",
        category: "distribution",
      },
      box: {
        name: "Box Chart",
        icon: "📦",
        difficulty: "medium",
        category: "distribution",
      },
      violin: {
        name: "Violin Plot",
        icon: "🎻",
        difficulty: "hard",
        category: "distribution",
      },
    },
  },

  // ============================================
  // NEW: GEOSPATIAL & OTHER (8 charts)
  // ============================================
  geospatial: {
    id: "geospatial",
    label: "🌍 Geospatial & Other",
    color: "#D41F26",
    description: "Maps, networks, flows, and process diagrams",
    charts: {
      geographicHeatmap: {
        name: "Geographic Heatmap",
        icon: "🔥",
        difficulty: "medium",
        category: "geospatial",
      },
      choroplethMap: {
        name: "Choropleth Map",
        icon: "🗺️",
        difficulty: "medium",
        category: "geospatial",
      },
      tileMap: {
        name: "Tile Map",
        icon: "🔲",
        difficulty: "easy",
        category: "geospatial",
      },
      chordDiagram: {
        name: "Chord Diagram",
        icon: "🔄",
        difficulty: "hard",
        category: "geospatial",
      },
      arcDiagram: {
        name: "Arc Diagram",
        icon: "🔗",
        difficulty: "medium",
        category: "geospatial",
      },
      sankeyDiagram: {
        name: "Sankey Diagram",
        icon: "🔀",
        difficulty: "hard",
        category: "geospatial",
      },
      networkDiagram: {
        name: "Network Diagram",
        icon: "🌐",
        difficulty: "medium",
        category: "geospatial",
      },
      flowchart: {
        name: "Flowchart",
        icon: "📊",
        difficulty: "easy",
        category: "geospatial",
      },
    },
  },
};

// Get all charts as flat array
export const getAllCharts = () => {
  const allCharts = [];
  Object.entries(CHART_CATEGORIES).forEach(([catKey, category]) => {
    Object.entries(category.charts).forEach(([chartKey, chart]) => {
      allCharts.push({
        id: chartKey,
        categoryId: catKey,
        categoryName: category.label,
        categoryColor: category.color,
        ...chart,
      });
    });
  });
  return allCharts;
};

// Get total chart count
export const getTotalChartCount = () => getAllCharts().length;

// Get chart by ID
export const getChartById = (id) => {
  return getAllCharts().find((chart) => chart.id === id);
};

// Get charts by category
export const getChartsByCategory = (categoryId) => {
  return getAllCharts().filter((chart) => chart.categoryId === categoryId);
};
