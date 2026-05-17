export const CHART_TYPES = {
  // ===== STATISTICAL =====
  statistical: {
    label: "📊 Statistical",
    charts: {
      histogram: { name: "Histogram", icon: "📊", difficulty: "medium" },
      frequencyPolygon: {
        name: "Frequency Polygon",
        icon: "📈",
        difficulty: "medium",
      },
      ogive: { name: "Ogive Curve", icon: "📉", difficulty: "medium" },
      boxPlot: { name: "Box Plot", icon: "📦", difficulty: "hard" },
      scatterPlot: { name: "Scatter Plot", icon: "⚫", difficulty: "easy" },
      bubbleChart: { name: "Bubble Chart", icon: "🫧", difficulty: "medium" },
      qqPlot: { name: "Q-Q Plot", icon: "📐", difficulty: "hard" },
    },
  },

  // ===== BASIC =====
  basic: {
    label: "📈 Basic Charts",
    charts: {
      bar: { name: "Bar Chart", icon: "📊", difficulty: "easy" },
      line: { name: "Line Chart", icon: "📈", difficulty: "easy" },
      area: { name: "Area Chart", icon: "🏔️", difficulty: "easy" },
      pie: { name: "Pie Chart", icon: "🥧", difficulty: "easy" },
      donut: { name: "Donut Chart", icon: "🍩", difficulty: "easy" },
      radar: { name: "Radar Chart", icon: "📡", difficulty: "easy" },
      polar: { name: "Polar Chart", icon: "🎯", difficulty: "medium" },
    },
  },

  // ===== BUSINESS =====
  business: {
    label: "💼 Business",
    charts: {
      waterfall: { name: "Waterfall Chart", icon: "🌊", difficulty: "hard" },
      pareto: { name: "Pareto Chart", icon: "📊", difficulty: "medium" },
      gantt: { name: "Gantt Chart", icon: "📅", difficulty: "hard" },
      funnel: { name: "Funnel Chart", icon: "🔻", difficulty: "medium" },
      sankey: { name: "Sankey Diagram", icon: "🌊", difficulty: "hard" },
    },
  },

  // ===== 3D & ADVANCED =====
  advanced: {
    label: "🚀 Advanced",
    charts: {
      heatmap: { name: "Heatmap", icon: "🌡️", difficulty: "hard" },
      treemap: { name: "Treemap", icon: "🗺️", difficulty: "hard" },
      sunburst: { name: "Sunburst", icon: "☀️", difficulty: "hard" },
      network: { name: "Network Graph", icon: "🕸️", difficulty: "hard" },
    },
  },

  // ===== FINANCIAL =====
  financial: {
    label: "💰 Financial",
    charts: {
      candlestick: { name: "Candlestick", icon: "🕯️", difficulty: "hard" },
      ohlc: { name: "OHLC Chart", icon: "📊", difficulty: "hard" },
      volume: { name: "Volume Chart", icon: "📊", difficulty: "medium" },
    },
  },
};

// Get total count
export const getTotalChartCount = () => {
  let count = 0;
  Object.values(CHART_TYPES).forEach((category) => {
    count += Object.keys(category.charts).length;
  });
  return count;
};

// Get all charts as flat list
export const getAllCharts = () => {
  const allCharts = [];
  Object.entries(CHART_TYPES).forEach(([categoryKey, category]) => {
    Object.entries(category.charts).forEach(([chartKey, chart]) => {
      allCharts.push({
        id: chartKey,
        category: categoryKey,
        categoryName: category.label,
        ...chart,
      });
    });
  });
  return allCharts;
};
