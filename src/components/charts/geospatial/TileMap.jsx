import React, { useState, useCallback, useMemo, memo } from "react";
import { theme } from "../../../styles/theme";

// ============================================
// US STATES TILE MAP LAYOUT
// Grid positions [row, col] arranged to roughly
// match US geographic layout
// ============================================
const US_STATES_GRID = {
  AL: { row: 6, col: 9, name: "Alabama" },
  AK: { row: 0, col: 0, name: "Alaska" },
  AZ: { row: 5, col: 5, name: "Arizona" },
  AR: { row: 5, col: 8, name: "Arkansas" },
  CA: { row: 4, col: 3, name: "California" },
  CO: { row: 4, col: 7, name: "Colorado" },
  CT: { row: 2, col: 12, name: "Connecticut" },
  DE: { row: 3, col: 11, name: "Delaware" },
  FL: { row: 7, col: 10, name: "Florida" },
  GA: { row: 6, col: 10, name: "Georgia" },
  HI: { row: 8, col: 2, name: "Hawaii" },
  ID: { row: 2, col: 5, name: "Idaho" },
  IL: { row: 3, col: 8, name: "Illinois" },
  IN: { row: 3, col: 9, name: "Indiana" },
  IA: { row: 3, col: 7, name: "Iowa" },
  KS: { row: 5, col: 7, name: "Kansas" },
  KY: { row: 4, col: 9, name: "Kentucky" },
  LA: { row: 6, col: 8, name: "Louisiana" },
  ME: { row: 1, col: 13, name: "Maine" },
  MD: { row: 3, col: 10, name: "Maryland" },
  MA: { row: 2, col: 12, name: "Massachusetts" },
  MI: { row: 2, col: 10, name: "Michigan" },
  MN: { row: 2, col: 7, name: "Minnesota" },
  MS: { row: 6, col: 8, name: "Mississippi", offset: [0, 0.8] },
  MO: { row: 4, col: 8, name: "Missouri" },
  MT: { row: 2, col: 6, name: "Montana" },
  NE: { row: 4, col: 6, name: "Nebraska" },
  NV: { row: 4, col: 4, name: "Nevada" },
  NH: { row: 2, col: 12, name: "New Hampshire", offset: [0, -0.7] },
  NJ: { row: 3, col: 11, name: "New Jersey", offset: [0, 0.5] },
  NM: { row: 5, col: 6, name: "New Mexico" },
  NY: { row: 2, col: 11, name: "New York" },
  NC: { row: 5, col: 10, name: "North Carolina" },
  ND: { row: 2, col: 7, name: "North Dakota", offset: [0, -0.8] },
  OH: { row: 3, col: 10, name: "Ohio", offset: [0, -0.5] },
  OK: { row: 5, col: 8, name: "Oklahoma", offset: [0, 0.5] },
  OR: { row: 2, col: 4, name: "Oregon" },
  PA: { row: 3, col: 10, name: "Pennsylvania", offset: [0, -1] },
  RI: { row: 2, col: 13, name: "Rhode Island" },
  SC: { row: 6, col: 10, name: "South Carolina", offset: [0, 0.6] },
  SD: { row: 3, col: 6, name: "South Dakota" },
  TN: { row: 5, col: 9, name: "Tennessee" },
  TX: { row: 6, col: 7, name: "Texas" },
  UT: { row: 4, col: 5, name: "Utah" },
  VT: { row: 1, col: 12, name: "Vermont" },
  VA: { row: 4, col: 10, name: "Virginia" },
  WA: { row: 1, col: 4, name: "Washington" },
  WV: { row: 4, col: 10, name: "West Virginia", offset: [0, 0.7] },
  WI: { row: 2, col: 9, name: "Wisconsin" },
  WY: { row: 3, col: 5, name: "Wyoming" },
  DC: { row: 4, col: 11, name: "District of Columbia" },
};

// ============================================
// WORLD COUNTRIES GRID LAYOUT (simplified)
// ============================================
const WORLD_GRID = {
  USA: { row: 2, col: 1, name: "United States" },
  CAN: { row: 1, col: 2, name: "Canada" },
  MEX: { row: 4, col: 1, name: "Mexico" },
  BRA: { row: 6, col: 3, name: "Brazil" },
  ARG: { row: 8, col: 3, name: "Argentina" },
  GBR: { row: 2, col: 6, name: "United Kingdom" },
  FRA: { row: 3, col: 6, name: "France" },
  DEU: { row: 2, col: 7, name: "Germany" },
  ITA: { row: 3, col: 7, name: "Italy" },
  ESP: { row: 4, col: 6, name: "Spain" },
  RUS: { row: 1, col: 8, name: "Russia" },
  CHN: { row: 3, col: 10, name: "China" },
  JPN: { row: 2, col: 12, name: "Japan" },
  IND: { row: 4, col: 10, name: "India" },
  AUS: { row: 7, col: 12, name: "Australia" },
  ZAF: { row: 7, col: 7, name: "South Africa" },
  NGA: { row: 5, col: 7, name: "Nigeria" },
  EGY: { row: 4, col: 8, name: "Egypt" },
  SAU: { row: 4, col: 9, name: "Saudi Arabia" },
  TUR: { row: 3, col: 8, name: "Turkey" },
  IDN: { row: 5, col: 12, name: "Indonesia" },
  KOR: { row: 2, col: 11, name: "South Korea" },
  SWE: { row: 1, col: 7, name: "Sweden" },
  NOR: { row: 1, col: 6, name: "Norway" },
  FIN: { row: 1, col: 8, name: "Finland" },
  UKR: { row: 2, col: 8, name: "Ukraine" },
  THA: { row: 5, col: 11, name: "Thailand" },
  VNM: { row: 5, col: 11, name: "Vietnam", offset: [0, 0.8] },
  PHL: { row: 4, col: 12, name: "Philippines" },
  COL: { row: 5, col: 2, name: "Colombia" },
  PER: { row: 6, col: 2, name: "Peru" },
  CHL: { row: 7, col: 2, name: "Chile" },
};

// ============================================
// DEFAULT DATA - US States with values
// ============================================
const DEFAULT_US_DATA = [
  { id: "AL", value: 67 },
  { id: "AK", value: 42 },
  { id: "AZ", value: 73 },
  { id: "AR", value: 55 },
  { id: "CA", value: 89 },
  { id: "CO", value: 81 },
  { id: "CT", value: 78 },
  { id: "DE", value: 72 },
  { id: "FL", value: 76 },
  { id: "GA", value: 70 },
  { id: "HI", value: 65 },
  { id: "ID", value: 58 },
  { id: "IL", value: 75 },
  { id: "IN", value: 68 },
  { id: "IA", value: 62 },
  { id: "KS", value: 60 },
  { id: "KY", value: 64 },
  { id: "LA", value: 59 },
  { id: "ME", value: 71 },
  { id: "MD", value: 80 },
  { id: "MA", value: 85 },
  { id: "MI", value: 69 },
  { id: "MN", value: 77 },
  { id: "MS", value: 52 },
  { id: "MO", value: 66 },
  { id: "MT", value: 54 },
  { id: "NE", value: 61 },
  { id: "NV", value: 74 },
  { id: "NH", value: 79 },
  { id: "NJ", value: 82 },
  { id: "NM", value: 57 },
  { id: "NY", value: 88 },
  { id: "NC", value: 72 },
  { id: "ND", value: 56 },
  { id: "OH", value: 70 },
  { id: "OK", value: 58 },
  { id: "OR", value: 75 },
  { id: "PA", value: 74 },
  { id: "RI", value: 76 },
  { id: "SC", value: 63 },
  { id: "SD", value: 53 },
  { id: "TN", value: 65 },
  { id: "TX", value: 78 },
  { id: "UT", value: 71 },
  { id: "VT", value: 73 },
  { id: "VA", value: 79 },
  { id: "WA", value: 84 },
  { id: "WV", value: 55 },
  { id: "WI", value: 68 },
  { id: "WY", value: 51 },
  { id: "DC", value: 90 },
];

// ============================================
// COLOR SCALE PRESETS
// ============================================
const COLOR_SCALE_PRESETS = [
  {
    name: "Blues",
    colors: ["#e0f2fe", "#7dd3fc", "#38bdf8", "#0284c7", "#0c4a6e"],
  },
  {
    name: "Reds",
    colors: ["#fee2e2", "#fca5a5", "#f87171", "#dc2626", "#7f1d1d"],
  },
  {
    name: "Greens",
    colors: ["#dcfce7", "#86efac", "#4ade80", "#16a34a", "#14532d"],
  },
  {
    name: "Purples",
    colors: ["#f3e8ff", "#c084fc", "#a78bfa", "#7c3aed", "#4c1d95"],
  },
  {
    name: "Oranges",
    colors: ["#ffedd5", "#fdba74", "#fb923c", "#ea580c", "#7c2d12"],
  },
  {
    name: "Teal",
    colors: ["#ccfbf1", "#5eead4", "#2dd4bf", "#0d9488", "#115e59"],
  },
  {
    name: "Viridis",
    colors: ["#440154", "#31688e", "#35b779", "#b8de29", "#fde725"],
  },
  {
    name: "Plasma",
    colors: ["#0d0887", "#7e03a8", "#cc4778", "#f89540", "#f0f921"],
  },
];

// ============================================
// TILE SHAPES
// ============================================
const TILE_SHAPES = [
  { name: "Square", value: "square" },
  { name: "Rounded Square", value: "rounded" },
  { name: "Circle", value: "circle" },
  { name: "Hexagon", value: "hexagon" },
];

// ============================================
// MAP PRESETS
// ============================================
const MAP_PRESETS = [
  {
    name: "US States",
    value: "us-states",
    grid: US_STATES_GRID,
    data: DEFAULT_US_DATA,
  },
  { name: "World Countries", value: "world", grid: WORLD_GRID, data: [] },
];

// ============================================
// HELPER FUNCTIONS
// ============================================
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

const rgbToHex = (r, g, b) => {
  return (
    "#" +
    [r, g, b].map((x) => Math.round(x).toString(16).padStart(2, "0")).join("")
  );
};

const interpolateColor = (color1, color2, factor) => {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  return rgbToHex(
    c1.r + factor * (c2.r - c1.r),
    c1.g + factor * (c2.g - c1.g),
    c1.b + factor * (c2.b - c1.b),
  );
};

const getColorFromScale = (value, min, max, colorScale) => {
  if (max === min) return colorScale[Math.floor(colorScale.length / 2)];
  const ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const segments = colorScale.length - 1;
  const segmentIndex = Math.min(Math.floor(ratio * segments), segments - 1);
  const segmentRatio = ratio * segments - segmentIndex;
  return interpolateColor(
    colorScale[segmentIndex],
    colorScale[Math.min(segmentIndex + 1, segments)],
    segmentRatio,
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const TileMapComponent = ({ initialMapPreset = "us-states" }) => {
  // ===== STATE =====
  const [mapPreset, setMapPreset] = useState(MAP_PRESETS[0]);
  const [data, setData] = useState(MAP_PRESETS[0].data);
  const [gridLayout, setGridLayout] = useState(MAP_PRESETS[0].grid);
  const [colorScale, setColorScale] = useState(COLOR_SCALE_PRESETS[0]);
  const [tileShape, setTileShape] = useState("rounded");
  const [tileSize, setTileSize] = useState(40);
  const [tileGap, setTileGap] = useState(4);
  const [showLabels, setShowLabels] = useState(true);
  const [labelSize, setLabelSize] = useState(9);
  const [hoverEffect, setHoverEffect] = useState("highlight");
  const [emptyColor, setEmptyColor] = useState("#2d3748");
  const [borderColor, setBorderColor] = useState("#1e293b");
  const [borderWidth, setBorderWidth] = useState(1);
  const [dataLabel, setDataLabel] = useState("Score");
  const [titleText, setTitleText] = useState("US States Tile Map");
  const [selectedTile, setSelectedTile] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  // ===== DERIVED DATA =====
  const dataMap = useMemo(() => {
    const map = {};
    data.forEach((d) => {
      map[d.id] = d;
    });
    return map;
  }, [data]);

  const valueRange = useMemo(() => {
    const values = data.map((d) => d.value);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1),
    };
  }, [data]);

  const allRegions = useMemo(() => {
    return Object.keys(gridLayout).sort();
  }, [gridLayout]);

  // ===== HANDLERS =====
  const handleDataChange = useCallback((id, value) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, value: Math.max(0, Number(value) || 0) }
          : item,
      ),
    );
  }, []);

  const handleMapPresetChange = useCallback((presetName) => {
    const preset = MAP_PRESETS.find((p) => p.value === presetName);
    if (preset) {
      setMapPreset(preset);
      setGridLayout(preset.grid);
      setTitleText(
        preset.name === "us-states" ? "US States Tile Map" : "World Tile Map",
      );

      // Generate data for world preset if needed
      if (preset.value === "world" && preset.data.length === 0) {
        const worldData = Object.keys(preset.grid).map((id) => ({
          id,
          value: Math.floor(Math.random() * 60) + 20,
        }));
        setData(worldData);
      } else {
        setData(preset.data.length > 0 ? preset.data : []);
      }
    }
  }, []);

  const handleTileClick = useCallback(
    (regionId) => {
      const regionData = dataMap[regionId];
      setSelectedTile(selectedTile === regionId ? null : regionId);
    },
    [dataMap, selectedTile],
  );

  const handleAddData = useCallback(() => {
    const unaddedRegions = allRegions.filter((id) => !dataMap[id]);
    if (unaddedRegions.length === 0) {
      alert("All regions already have data!");
      return;
    }
    const randomRegion =
      unaddedRegions[Math.floor(Math.random() * unaddedRegions.length)];
    setData((prev) => [
      ...prev,
      { id: randomRegion, value: Math.floor(Math.random() * 60) + 20 },
    ]);
  }, [allRegions, dataMap]);

  // ===== GRID DIMENSIONS =====
  const gridDimensions = useMemo(() => {
    let maxRow = 0;
    let maxCol = 0;
    Object.values(gridLayout).forEach(({ row, col }) => {
      maxRow = Math.max(maxRow, row);
      maxCol = Math.max(maxCol, col);
    });
    return {
      rows: maxRow + 1,
      cols: maxCol + 1,
      width: (maxCol + 1) * (tileSize + tileGap) + tileGap,
      height: (maxRow + 1) * (tileSize + tileGap) + tileGap,
    };
  }, [gridLayout, tileSize, tileGap]);

  // ===== TILE RENDERER =====
  const renderTile = (x, y, size, shape) => {
    const half = size / 2;
    const r = 6; // corner radius

    switch (shape) {
      case "circle":
        return <circle cx={x} cy={y} r={half - 1} />;
      case "hexagon":
        const points = [];
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          points.push(
            `${x + (half - 1) * Math.cos(angle)},${y + (half - 1) * Math.sin(angle)}`,
          );
        }
        return <polygon points={points.join(" ")} />;
      case "rounded":
        return (
          <rect
            x={x - half}
            y={y - half}
            width={size}
            height={size}
            rx={r}
            ry={r}
          />
        );
      default: // square
        return <rect x={x - half} y={y - half} width={size} height={size} />;
    }
  };

  // ============================================
  // STYLES
  // ============================================
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    fontFamily: theme.typography.fontFamily.primary,
    background: theme.colors.mainBg,
    color: theme.colors.text.body,
    padding: "20px",
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border.default}`,
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "12px",
  };

  const titleInputStyle = {
    background: "transparent",
    border: "none",
    borderBottom: `2px solid ${colorScale.colors[Math.floor(colorScale.colors.length / 2)]}`,
    color: theme.colors.text.heading,
    fontSize: "20px",
    fontWeight: 700,
    fontFamily: theme.typography.fontFamily.primary,
    letterSpacing: "2px",
    outline: "none",
    padding: "4px 0",
    width: "300px",
  };

  const chartContainerStyle = {
    background: "#0f172a",
    borderRadius: "8px",
    border: `1px solid ${theme.colors.border.light}`,
    minHeight: "450px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "auto",
    padding: "20px",
    position: "relative",
  };

  const controlsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "16px",
    background: theme.colors.cardBg,
    padding: "16px",
    borderRadius: "4px",
    border: `1px solid ${theme.colors.border.default}`,
  };

  const controlGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  };

  const labelStyle = {
    color: theme.colors.text.muted,
    fontSize: "10px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "2px",
  };

  const selectStyle = {
    padding: "8px 12px",
    background: theme.colors.inputBg,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: "3px",
    color: theme.colors.text.body,
    fontSize: "12px",
    fontFamily: theme.typography.fontFamily.primary,
    outline: "none",
    cursor: "pointer",
  };

  const checkboxStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontSize: "12px",
    color: theme.colors.text.body,
  };

  const buttonStyle = {
    padding: "8px 16px",
    background: "transparent",
    border: `1px solid ${colorScale.colors[Math.floor(colorScale.colors.length / 2)]}`,
    borderRadius: "3px",
    color: colorScale.colors[Math.floor(colorScale.colors.length / 2)],
    cursor: "pointer",
    fontSize: "11px",
    fontFamily: theme.typography.fontFamily.primary,
    fontWeight: 600,
    letterSpacing: "1px",
    textTransform: "uppercase",
    transition: "all 0.15s ease",
  };

  const dataTableContainerStyle = {
    background: theme.colors.cardBg,
    borderRadius: "4px",
    border: `1px solid ${theme.colors.border.default}`,
    overflow: "auto",
    maxHeight: "400px",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "12px",
  };

  const thStyle = {
    background: theme.colors.inputBg,
    color: theme.colors.text.muted,
    padding: "10px 12px",
    textAlign: "left",
    fontSize: "10px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "2px",
    borderBottom: `2px solid ${theme.colors.border.default}`,
    position: "sticky",
    top: 0,
  };

  const tdStyle = {
    padding: "8px 12px",
    borderBottom: `1px solid ${theme.colors.border.light}`,
  };

  const cellInputStyle = {
    padding: "6px 8px",
    background: theme.colors.inputBg,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: "3px",
    color: theme.colors.text.body,
    fontSize: "12px",
    fontFamily: theme.typography.fontFamily.primary,
    width: "100%",
    outline: "none",
    boxSizing: "border-box",
  };

  // ============================================
  // TOOLTIP
  // ============================================
  const Tooltip = ({ info, pos }) => {
    if (!info || !pos) return null;
    return (
      <div
        style={{
          position: "absolute",
          left: pos.x + 15,
          top: pos.y - 50,
          background: "rgba(15, 15, 35, 0.95)",
          border: `1px solid ${info.color}`,
          borderRadius: "6px",
          padding: "10px 14px",
          pointerEvents: "none",
          zIndex: 100,
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        }}
      >
        <p
          style={{
            margin: "0 0 4px",
            fontSize: "12px",
            fontWeight: 700,
            color: "#e2e8f0",
          }}
        >
          {info.name}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            fontWeight: 700,
            color: info.color,
          }}
        >
          {info.value}
        </p>
      </div>
    );
  };

  // ============================================
  // LEGEND
  // ============================================
  const Legend = memo(() => (
    <div
      style={{
        position: "absolute",
        bottom: "20px",
        right: "20px",
        background: "rgba(15, 15, 35, 0.9)",
        borderRadius: "8px",
        padding: "12px 16px",
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
        zIndex: 10,
        minWidth: "200px",
      }}
    >
      <p
        style={{
          margin: "0 0 8px",
          fontSize: "10px",
          fontWeight: 700,
          color: "#cbd5e1",
          textAlign: "center",
        }}
      >
        {dataLabel}
      </p>
      <div
        style={{
          width: "100%",
          height: "16px",
          borderRadius: "4px",
          background: `linear-gradient(to right, ${colorScale.colors.join(", ")})`,
          marginBottom: "6px",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "9px",
          color: "#94a3b8",
        }}
      >
        <span>{valueRange.min}</span>
        <span>{valueRange.max}</span>
      </div>
    </div>
  ));

  // ============================================
  // RENDER
  // ============================================
  return (
    <div style={containerStyle}>
      {/* HEADER */}
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>🔲</span>
          <input
            type="text"
            value={titleText}
            onChange={(e) => setTitleText(e.target.value)}
            style={titleInputStyle}
          />
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <span
            style={{
              color:
                colorScale.colors[Math.floor(colorScale.colors.length / 2)],
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${colorScale.colors[Math.floor(colorScale.colors.length / 2)]}50`,
              borderRadius: "3px",
              fontWeight: 600,
              letterSpacing: "1px",
            }}
          >
            GEOSPATIAL
          </span>
          <span
            style={{
              color: theme.colors.text.muted,
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: "3px",
              letterSpacing: "1px",
            }}
          >
            {data.length} REGIONS
          </span>
        </div>
      </div>

      {/* TILE MAP */}
      <div id="chart-visual-area" style={chartContainerStyle}>
        <Legend />
        <Tooltip info={tooltip?.info} pos={tooltip?.position} />

        <svg
          width={gridDimensions.width}
          height={gridDimensions.height}
          style={{ display: "block" }}
        >
          {/* Grid background */}
          <rect
            x={0}
            y={0}
            width={gridDimensions.width}
            height={gridDimensions.height}
            fill="transparent"
          />

          {/* Tiles */}
          {allRegions.map((regionId) => {
            const layout = gridLayout[regionId];
            if (!layout) return null;

            const regionData = dataMap[regionId];
            const hasData = !!regionData;
            const isSelected = selectedTile === regionId;
            const fillColor = hasData
              ? getColorFromScale(
                  regionData.value,
                  valueRange.min,
                  valueRange.max,
                  colorScale.colors,
                )
              : emptyColor;

            const offsetX = layout.offset
              ? layout.offset[0] * (tileSize + tileGap)
              : 0;
            const offsetY = layout.offset
              ? layout.offset[1] * (tileSize + tileGap)
              : 0;
            const cx =
              tileGap +
              tileSize / 2 +
              layout.col * (tileSize + tileGap) +
              offsetX;
            const cy =
              tileGap +
              tileSize / 2 +
              layout.row * (tileSize + tileGap) +
              offsetY;

            return (
              <g
                key={regionId}
                style={{ cursor: "pointer" }}
                onClick={() => handleTileClick(regionId)}
                onMouseEnter={(e) => {
                  const rect = e.target.closest("svg").getBoundingClientRect();
                  setTooltip({
                    info: {
                      name: layout.name,
                      value: hasData ? regionData.value : "No data",
                      color: fillColor,
                    },
                    position: {
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                    },
                  });
                }}
                onMouseMove={(e) => {
                  const rect = e.target.closest("svg").getBoundingClientRect();
                  setTooltip((prev) => ({
                    ...prev,
                    position: {
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                    },
                  }));
                }}
                onMouseLeave={() => setTooltip(null)}
              >
                {/* Tile shape */}
                {renderTile(cx, cy, tileSize, tileShape).type
                  ? React.cloneElement(
                      renderTile(cx, cy, tileSize, tileShape),
                      {
                        fill: fillColor,
                        stroke: isSelected ? "#ffffff" : borderColor,
                        strokeWidth: isSelected ? 2.5 : borderWidth,
                        style: {
                          transition: "all 0.2s ease",
                          filter: isSelected ? "brightness(1.3)" : "none",
                        },
                      },
                    )
                  : renderTile(cx, cy, tileSize, tileShape)}

                {/* Hover effect */}
                <rect
                  x={cx - tileSize / 2}
                  y={cy - tileSize / 2}
                  width={tileSize}
                  height={tileSize}
                  rx={tileShape === "rounded" ? 6 : 0}
                  ry={tileShape === "rounded" ? 6 : 0}
                  fill="transparent"
                  stroke="transparent"
                  style={{ pointerEvents: "all" }}
                />

                {/* Labels */}
                {showLabels && (
                  <text
                    x={cx}
                    y={cy + 1}
                    fontSize={labelSize}
                    fontFamily={theme.typography.fontFamily.primary}
                    fill={hasData ? "#ffffff" : "#64748b"}
                    fontWeight={600}
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{
                      pointerEvents: "none",
                      textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                    }}
                  >
                    {regionId}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* CONTROLS */}
      <div style={controlsGridStyle}>
        {/* Map Preset */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🗺️ Map</label>
          <select
            value={mapPreset.value}
            onChange={(e) => handleMapPresetChange(e.target.value)}
            style={selectStyle}
          >
            {MAP_PRESETS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Color Scale */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Color Scale</label>
          <select
            value={colorScale.name}
            onChange={(e) => {
              const preset = COLOR_SCALE_PRESETS.find(
                (c) => c.name === e.target.value,
              );
              setColorScale(preset);
            }}
            style={selectStyle}
          >
            {COLOR_SCALE_PRESETS.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tile Shape */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔷 Tile Shape</label>
          <select
            value={tileShape}
            onChange={(e) => setTileShape(e.target.value)}
            style={selectStyle}
          >
            {TILE_SHAPES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tile Size */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Tile Size: {tileSize}px</label>
          <input
            type="range"
            min="20"
            max="80"
            value={tileSize}
            onChange={(e) => setTileSize(Number(e.target.value))}
            style={{
              width: "100%",
              accentColor:
                colorScale.colors[Math.floor(colorScale.colors.length / 2)],
            }}
          />
        </div>

        {/* Tile Gap */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>↔️ Gap: {tileGap}px</label>
          <input
            type="range"
            min="1"
            max="12"
            value={tileGap}
            onChange={(e) => setTileGap(Number(e.target.value))}
            style={{
              width: "100%",
              accentColor:
                colorScale.colors[Math.floor(colorScale.colors.length / 2)],
            }}
          />
        </div>

        {/* Label Size */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔤 Label Size: {labelSize}</label>
          <input
            type="range"
            min="6"
            max="16"
            value={labelSize}
            onChange={(e) => setLabelSize(Number(e.target.value))}
            style={{
              width: "100%",
              accentColor:
                colorScale.colors[Math.floor(colorScale.colors.length / 2)],
            }}
          />
        </div>

        {/* Border Color */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>✏️ Border Color</label>
          <input
            type="color"
            value={borderColor}
            onChange={(e) => setBorderColor(e.target.value)}
            style={{
              width: "36px",
              height: "32px",
              cursor: "pointer",
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: "3px",
            }}
          />
        </div>

        {/* Empty Color */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🚫 No Data Color</label>
          <input
            type="color"
            value={emptyColor}
            onChange={(e) => setEmptyColor(e.target.value)}
            style={{
              width: "36px",
              height: "32px",
              cursor: "pointer",
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: "3px",
            }}
          />
        </div>

        {/* Toggles */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>👁️ Visibility</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={checkboxStyle}>
              <input
                type="checkbox"
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
                style={{
                  accentColor:
                    colorScale.colors[Math.floor(colorScale.colors.length / 2)],
                }}
              />
              Show Labels
            </label>
          </div>
        </div>

        {/* Data Label */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🏷️ Data Label</label>
          <input
            type="text"
            value={dataLabel}
            onChange={(e) => setDataLabel(e.target.value)}
            style={{
              padding: "8px 12px",
              background: theme.colors.inputBg,
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: "3px",
              color: theme.colors.text.body,
              fontSize: "12px",
              fontFamily: theme.typography.fontFamily.primary,
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* DATA TABLE */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <label style={labelStyle}>📋 Data Table</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleAddData}
              style={buttonStyle}
              onMouseEnter={(e) =>
                (e.target.style.background = `${colorScale.colors[Math.floor(colorScale.colors.length / 2)]}20`)
              }
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
            >
              + Add Region
            </button>
            <button
              onClick={() => {
                setData(MAP_PRESETS[0].data);
                setSelectedTile(null);
              }}
              style={buttonStyle}
              onMouseEnter={(e) =>
                (e.target.style.background = `${colorScale.colors[Math.floor(colorScale.colors.length / 2)]}20`)
              }
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
            >
              ↺ Reset
            </button>
          </div>
        </div>

        <div id="chart-data-table" style={dataTableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Value</th>
                <th style={thStyle}>Color</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => {
                const layout = gridLayout[row.id];
                return (
                  <tr
                    key={row.id}
                    style={{
                      background:
                        selectedTile === row.id
                          ? `${colorScale.colors[Math.floor(colorScale.colors.length / 2)]}15`
                          : "transparent",
                      cursor: "pointer",
                    }}
                    onClick={() => handleTileClick(row.id)}
                  >
                    <td
                      style={{
                        ...tdStyle,
                        color: theme.colors.text.muted,
                        fontSize: "10px",
                        fontWeight: 700,
                      }}
                    >
                      {row.id}
                    </td>
                    <td style={tdStyle}>{layout ? layout.name : row.id}</td>
                    <td style={tdStyle}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={row.value}
                          onChange={(e) =>
                            handleDataChange(row.id, e.target.value)
                          }
                          style={{
                            width: "80px",
                            accentColor: getColorFromScale(
                              row.value,
                              valueRange.min,
                              valueRange.max,
                              colorScale.colors,
                            ),
                          }}
                        />
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: getColorFromScale(
                              row.value,
                              valueRange.min,
                              valueRange.max,
                              colorScale.colors,
                            ),
                          }}
                        >
                          {row.value}
                        </span>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: tileShape === "circle" ? "50%" : "3px",
                          background: getColorFromScale(
                            row.value,
                            valueRange.min,
                            valueRange.max,
                            colorScale.colors,
                          ),
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "12px",
            padding: "12px 16px",
            background: theme.colors.cardBg,
            borderRadius: "4px",
            border: `1px solid ${theme.colors.border.default}`,
            fontSize: "11px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <span style={{ color: theme.colors.text.muted }}>
            Regions:{" "}
            <strong style={{ color: theme.colors.text.heading }}>
              {data.length}
            </strong>
          </span>
          <span style={{ color: theme.colors.text.muted }}>
            Range:{" "}
            <strong
              style={{
                color:
                  colorScale.colors[Math.floor(colorScale.colors.length / 2)],
              }}
            >
              {valueRange.min} - {valueRange.max}
            </strong>
          </span>
          <span style={{ color: theme.colors.text.muted }}>
            Avg:{" "}
            <strong
              style={{
                color:
                  colorScale.colors[Math.floor(colorScale.colors.length / 2)],
              }}
            >
              {valueRange.avg}
            </strong>
          </span>
          {selectedTile &&
            (() => {
              const layout = gridLayout[selectedTile];
              const selData = dataMap[selectedTile];
              return (
                <span
                  style={{
                    color: getColorFromScale(
                      selData?.value || 0,
                      valueRange.min,
                      valueRange.max,
                      colorScale.colors,
                    ),
                    background: `${getColorFromScale(selData?.value || 0, valueRange.min, valueRange.max, colorScale.colors)}15`,
                    padding: "2px 8px",
                    borderRadius: "3px",
                    fontSize: "10px",
                  }}
                >
                  🔲 {layout?.name || selectedTile}:{" "}
                  {selData?.value || "No data"}
                </span>
              );
            })()}
        </div>
      </div>
    </div>
  );
};

export default TileMapComponent;
