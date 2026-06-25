import React, { useState, useCallback, useMemo, memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Graticule,
  Sphere,
} from "react-simple-maps";
import { theme } from "../../../styles/theme";

// ============================================
// WORLD MAP GEOJSON WITH COUNTRY DATA
// ============================================
const GEO_URL =
  "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

// ============================================
// DEFAULT DATA - Countries with normalized values
// ============================================
const DEFAULT_DATA = [
  { id: "USA", name: "United States", value: 82.5 },
  { id: "CAN", name: "Canada", value: 71.3 },
  { id: "GBR", name: "United Kingdom", value: 76.8 },
  { id: "FRA", name: "France", value: 74.2 },
  { id: "DEU", name: "Germany", value: 79.1 },
  { id: "ITA", name: "Italy", value: 68.7 },
  { id: "ESP", name: "Spain", value: 65.4 },
  { id: "PRT", name: "Portugal", value: 58.9 },
  { id: "NLD", name: "Netherlands", value: 83.6 },
  { id: "BEL", name: "Belgium", value: 72.4 },
  { id: "CHE", name: "Switzerland", value: 88.2 },
  { id: "SWE", name: "Sweden", value: 85.7 },
  { id: "NOR", name: "Norway", value: 90.1 },
  { id: "FIN", name: "Finland", value: 81.5 },
  { id: "DNK", name: "Denmark", value: 84.3 },
  { id: "JPN", name: "Japan", value: 87.6 },
  { id: "KOR", name: "South Korea", value: 78.9 },
  { id: "CHN", name: "China", value: 55.2 },
  { id: "IND", name: "India", value: 42.8 },
  { id: "AUS", name: "Australia", value: 77.4 },
  { id: "NZL", name: "New Zealand", value: 75.8 },
  { id: "BRA", name: "Brazil", value: 52.3 },
  { id: "ARG", name: "Argentina", value: 61.7 },
  { id: "MEX", name: "Mexico", value: 48.5 },
  { id: "ZAF", name: "South Africa", value: 44.2 },
  { id: "NGA", name: "Nigeria", value: 32.6 },
  { id: "EGY", name: "Egypt", value: 45.9 },
  { id: "RUS", name: "Russia", value: 67.3 },
  { id: "TUR", name: "Turkey", value: 58.1 },
  { id: "SAU", name: "Saudi Arabia", value: 64.8 },
  { id: "ARE", name: "UAE", value: 76.2 },
  { id: "SGP", name: "Singapore", value: 91.4 },
  { id: "MYS", name: "Malaysia", value: 62.7 },
  { id: "THA", name: "Thailand", value: 56.3 },
  { id: "VNM", name: "Vietnam", value: 49.8 },
  { id: "IDN", name: "Indonesia", value: 44.1 },
  { id: "PHL", name: "Philippines", value: 41.5 },
  { id: "COL", name: "Colombia", value: 54.6 },
  { id: "CHL", name: "Chile", value: 69.2 },
  { id: "PER", name: "Peru", value: 47.3 },
];

// ============================================
// COLOR SCALE PRESETS
// ============================================
const COLOR_SCALE_PRESETS = [
  {
    name: "Blues",
    colors: ["#f0f9ff", "#bae6fd", "#38bdf8", "#0284c7", "#0c4a6e"],
    description: "Sequential blue",
  },
  {
    name: "Reds",
    colors: ["#fef2f2", "#fecaca", "#f87171", "#dc2626", "#7f1d1d"],
    description: "Sequential red",
  },
  {
    name: "Greens",
    colors: ["#f0fdf4", "#bbf7d0", "#4ade80", "#16a34a", "#14532d"],
    description: "Sequential green",
  },
  {
    name: "Purples",
    colors: ["#faf5ff", "#e9d5ff", "#a78bfa", "#7c3aed", "#4c1d95"],
    description: "Sequential purple",
  },
  {
    name: "Oranges",
    colors: ["#fff7ed", "#fed7aa", "#fb923c", "#ea580c", "#7c2d12"],
    description: "Sequential orange",
  },
  {
    name: "Diverging RdBu",
    colors: ["#053061", "#2166ac", "#f7f7f7", "#d6604d", "#67001f"],
    description: "Diverging red-blue",
  },
  {
    name: "Diverging RdYlGn",
    colors: ["#006837", "#66bd63", "#ffffbf", "#fdae61", "#a50026"],
    description: "Diverging red-yellow-green",
  },
  {
    name: "Viridis",
    colors: ["#440154", "#31688e", "#35b779", "#b8de29", "#fde725"],
    description: "Perceptually uniform",
  },
  {
    name: "Magma",
    colors: ["#000004", "#51127c", "#b73779", "#f1605d", "#fcfdbf"],
    description: "Perceptually uniform",
  },
  {
    name: "Plasma",
    colors: ["#0d0887", "#7e03a8", "#cc4778", "#f89540", "#f0f921"],
    description: "Perceptually uniform",
  },
  {
    name: "Cividis",
    colors: ["#00224e", "#2a5671", "#6a8f7d", "#b7cb7e", "#fee838"],
    description: "Colorblind safe",
  },
  {
    name: "Turbo",
    colors: [
      "#30123b",
      "#4662d7",
      "#28bae4",
      "#a4fc3c",
      "#e1dc37",
      "#a62927",
      "#7a0403",
    ],
    description: "Rainbow-like",
  },
];

// ============================================
// VALUE FORMAT PRESETS
// ============================================
const FORMAT_PRESETS = [
  { name: "Percentage (0-100%)", suffix: "%", decimals: 1 },
  { name: "Decimal (0-1)", suffix: "", decimals: 3 },
  { name: "Rate per 100k", suffix: "/100k", decimals: 1 },
  { name: "Score (0-10)", suffix: "/10", decimals: 1 },
  { name: "Ratio (0-1.0)", suffix: "x", decimals: 2 },
];

// ============================================
// PROJECTIONS
// ============================================
const PROJECTIONS = [
  { name: "Mercator", value: "geoMercator" },
  { name: "Equirectangular", value: "geoEquirectangular" },
  { name: "Natural Earth", value: "geoNaturalEarth1" },
  { name: "Equal Earth", value: "geoEqualEarth" },
  { name: "Robinson", value: "geoRobinson" },
  { name: "Mollweide", value: "geoMollweide" },
];

// ============================================
// LEGEND ORIENTATIONS
// ============================================
const LEGEND_POSITIONS = [
  { name: "Bottom Right", value: "bottom-right" },
  { name: "Bottom Left", value: "bottom-left" },
  { name: "Top Right", value: "top-right" },
  { name: "Top Left", value: "top-left" },
  { name: "Bottom Center", value: "bottom-center" },
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
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
};

const interpolateColor = (color1, color2, factor) => {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const r = Math.round(c1.r + factor * (c2.r - c1.r));
  const g = Math.round(c1.g + factor * (c2.g - c1.g));
  const b = Math.round(c1.b + factor * (c2.b - c1.b));
  return rgbToHex(r, g, b);
};

const getColorFromScale = (value, min, max, colorScale) => {
  if (max === min) return colorScale[Math.floor(colorScale.length / 2)];
  const ratio = (value - min) / (max - min);
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
const ChoroplethMapComponent = ({ initialData = DEFAULT_DATA }) => {
  // ===== STATE =====
  const [data, setData] = useState(initialData);
  const [colorScale, setColorScale] = useState(COLOR_SCALE_PRESETS[0]);
  const [projection, setProjection] = useState("geoEqualEarth");
  const [formatPreset, setFormatPreset] = useState(FORMAT_PRESETS[0]);
  const [showGraticule, setShowGraticule] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [borderColor, setBorderColor] = useState("#1e293b");
  const [borderWidth, setBorderWidth] = useState(0.3);
  const [emptyColor, setEmptyColor] = useState("#1a202c");
  const [legendPosition, setLegendPosition] = useState("bottom-right");
  const [legendSize, setLegendSize] = useState(200);
  const [hoverColor, setHoverColor] = useState("#ffffff");
  const [hoverOpacity, setHoverOpacity] = useState(0.2);
  const [dataLabel, setDataLabel] = useState("Development Index");
  const [titleText, setTitleText] = useState("World Choropleth Map");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [position, setPosition] = useState({ coordinates: [0, 20], zoom: 1 });

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

  const classificationGroups = useMemo(() => {
    const { min, max } = valueRange;
    const range = max - min;
    const groups = colorScale.colors.length;
    const step = range / groups;

    return Array.from({ length: groups }, (_, i) => ({
      min: min + step * i,
      max: min + step * (i + 1),
      color: colorScale.colors[i],
      label: `${(min + step * i).toFixed(formatPreset.decimals)} - ${(min + step * (i + 1)).toFixed(formatPreset.decimals)}`,
    }));
  }, [valueRange, colorScale, formatPreset]);

  // ===== HANDLERS =====
  const handleDataChange = useCallback((id, field, value) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "value" ? Math.max(0, Number(value) || 0) : value,
            }
          : item,
      ),
    );
  }, []);

  const addCountry = useCallback(() => {
    const newId = prompt("Enter ISO A3 country code (e.g., USA, GBR):");
    if (!newId) return;
    const name = prompt("Enter country name:");
    if (!name) return;
    const value = parseFloat(prompt("Enter value:") || "50");

    setData((prev) => [...prev, { id: newId.toUpperCase(), name, value }]);
  }, []);

  const removeCountry = useCallback((id) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    setSelectedCountry(null);
  }, []);

  const handleCountryClick = useCallback(
    (geo) => {
      const countryData = dataMap[geo.properties.ISO_A3];
      if (countryData) {
        setSelectedCountry(
          selectedCountry?.id === countryData.id ? null : countryData,
        );
      }
    },
    [dataMap, selectedCountry],
  );

  const handleMoveEnd = useCallback((pos) => {
    setPosition(pos);
  }, []);

  const handleZoomIn = useCallback(() => {
    setPosition((prev) => ({ ...prev, zoom: Math.min(8, prev.zoom * 1.5) }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setPosition((prev) => ({ ...prev, zoom: Math.max(0.5, prev.zoom / 1.5) }));
  }, []);

  const handleZoomReset = useCallback(() => {
    setPosition({ coordinates: [0, 20], zoom: 1 });
  }, []);

  const getLegendStyle = useCallback(() => {
    const base = { position: "absolute", zIndex: 10 };

    switch (legendPosition) {
      case "bottom-right":
        return { ...base, bottom: "20px", right: "20px" };
      case "bottom-left":
        return { ...base, bottom: "20px", left: "20px" };
      case "top-right":
        return { ...base, top: "20px", right: "20px" };
      case "top-left":
        return { ...base, top: "20px", left: "20px" };
      case "bottom-center":
        return {
          ...base,
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
        };
      default:
        return { ...base, bottom: "20px", right: "20px" };
    }
  }, [legendPosition]);

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

  const mapContainerStyle = {
    background: "#0f172a",
    borderRadius: "8px",
    border: `1px solid ${theme.colors.border.light}`,
    minHeight: "500px",
    overflow: "hidden",
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

  const deleteButtonStyle = {
    ...buttonStyle,
    border: `1px solid ${theme.colors.status.error}`,
    color: theme.colors.status.error,
    padding: "4px 8px",
    fontSize: "10px",
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
  // TOOLTIP COMPONENT
  // ============================================
  const TooltipContent = ({ country, pos }) => {
    if (!country || !pos) return null;
    const countryData = dataMap[country.properties.ISO_A3];

    return (
      <div
        style={{
          position: "absolute",
          left: pos.x + 15,
          top: pos.y - 60,
          background: "rgba(15, 15, 35, 0.95)",
          border: `1px solid ${countryData ? getColorFromScale(countryData.value, valueRange.min, valueRange.max, colorScale.colors) : emptyColor}`,
          borderRadius: "6px",
          padding: "10px 14px",
          pointerEvents: "none",
          zIndex: 100,
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          minWidth: "160px",
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
          {country.properties.ADMIN || country.properties.name}
        </p>
        <p style={{ margin: "0 0 4px", fontSize: "10px", color: "#64748b" }}>
          {country.properties.ISO_A3 || "N/A"}
        </p>
        {countryData ? (
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              fontWeight: 700,
              color: getColorFromScale(
                countryData.value,
                valueRange.min,
                valueRange.max,
                colorScale.colors,
              ),
            }}
          >
            {countryData.value.toFixed(formatPreset.decimals)}
            {formatPreset.suffix}
          </p>
        ) : (
          <p
            style={{
              margin: 0,
              fontSize: "11px",
              color: "#64748b",
              fontStyle: "italic",
            }}
          >
            No data
          </p>
        )}
      </div>
    );
  };

  // ============================================
  // LEGEND COMPONENT
  // ============================================
  const Legend = memo(() => (
    <div
      style={{
        ...getLegendStyle(),
        background: "rgba(15, 15, 35, 0.9)",
        borderRadius: "8px",
        padding: "12px 16px",
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
        minWidth: `${legendSize}px`,
        maxWidth: "300px",
      }}
    >
      <p
        style={{
          margin: "0 0 8px",
          fontSize: "10px",
          fontWeight: 700,
          color: "#cbd5e1",
          textTransform: "uppercase",
          letterSpacing: "1px",
          textAlign: "center",
        }}
      >
        {dataLabel}
      </p>

      <div
        style={{
          width: "100%",
          height: "20px",
          borderRadius: "4px",
          background: `linear-gradient(to right, ${colorScale.colors.join(", ")})`,
          marginBottom: "6px",
        }}
      />

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: "9px", color: "#94a3b8" }}>
          {valueRange.min.toFixed(formatPreset.decimals)}
          {formatPreset.suffix}
        </span>
        <span style={{ fontSize: "9px", color: "#94a3b8" }}>
          {valueRange.max.toFixed(formatPreset.decimals)}
          {formatPreset.suffix}
        </span>
      </div>

      <div style={{ marginTop: "8px" }}>
        {classificationGroups.map((group, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "2px",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "2px",
                background: group.color,
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            />
            <span style={{ fontSize: "8px", color: "#64748b" }}>
              {group.label}
            </span>
          </div>
        ))}
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
          <span style={{ fontSize: "28px" }}>🗺️</span>
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
            {data.length} COUNTRIES
          </span>
        </div>
      </div>

      {/* MAP DISPLAY */}
      <div id="chart-visual-area" style={mapContainerStyle}>
        <Legend />
        <TooltipContent country={tooltip?.country} pos={tooltip?.position} />

        <ComposableMap
          projection={projection}
          projectionConfig={{ scale: 180 }}
          style={{ width: "100%", height: "500px", background: "#0f172a" }}
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={handleMoveEnd}
            maxZoom={8}
            minZoom={0.5}
          >
            {/* Ocean background */}
            <Sphere
              stroke="#1e293b"
              strokeWidth={0.5}
              fill="#0a0a1a"
              id="ocean"
            />

            {/* Graticule (latitude/longitude lines) */}
            {showGraticule && (
              <Graticule stroke="#1e293b" strokeWidth={0.2} step={[30, 30]} />
            )}

            {/* Countries */}
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryData = dataMap[geo.properties.ISO_A3];
                  const isSelected = selectedCountry?.id === countryData?.id;
                  const fillColor = countryData
                    ? getColorFromScale(
                        countryData.value,
                        valueRange.min,
                        valueRange.max,
                        colorScale.colors,
                      )
                    : emptyColor;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fillColor}
                      stroke={isSelected ? "#ffffff" : borderColor}
                      strokeWidth={isSelected ? 1.5 : borderWidth}
                      style={{
                        default: {
                          outline: "none",
                          transition: "all 0.2s ease",
                        },
                        hover: {
                          fill: hoverColor,
                          fillOpacity: hoverOpacity,
                          outline: "none",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        },
                        pressed: {
                          outline: "none",
                        },
                      }}
                      onClick={() => handleCountryClick(geo)}
                      onMouseEnter={(e) => {
                        const rect = e.target
                          .closest("svg")
                          .getBoundingClientRect();
                        setTooltip({
                          country: geo,
                          position: {
                            x: e.clientX - rect.left,
                            y: e.clientY - rect.top,
                          },
                        });
                      }}
                      onMouseMove={(e) => {
                        const rect = e.target
                          .closest("svg")
                          .getBoundingClientRect();
                        setTooltip((prev) => ({
                          ...prev,
                          position: {
                            x: e.clientX - rect.left,
                            y: e.clientY - rect.top,
                          },
                        }));
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* CONTROLS */}
      <div style={controlsGridStyle}>
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
                {c.name} - {c.description}
              </option>
            ))}
          </select>
        </div>

        {/* Projection */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🗺️ Projection</label>
          <select
            value={projection}
            onChange={(e) => setProjection(e.target.value)}
            style={selectStyle}
          >
            {PROJECTIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Value Format */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📊 Value Format</label>
          <select
            value={formatPreset.name}
            onChange={(e) => {
              const preset = FORMAT_PRESETS.find(
                (f) => f.name === e.target.value,
              );
              setFormatPreset(preset);
            }}
            style={selectStyle}
          >
            {FORMAT_PRESETS.map((f) => (
              <option key={f.name} value={f.name}>
                {f.name}
              </option>
            ))}
          </select>
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

        {/* Border Width */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Border Width: {borderWidth}px</label>
          <input
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={borderWidth}
            onChange={(e) => setBorderWidth(Number(e.target.value))}
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
              padding: "2px",
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
              padding: "2px",
            }}
          />
        </div>

        {/* Legend Position */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📍 Legend Position</label>
          <select
            value={legendPosition}
            onChange={(e) => setLegendPosition(e.target.value)}
            style={selectStyle}
          >
            {LEGEND_POSITIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Legend Size */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📐 Legend Width: {legendSize}px</label>
          <input
            type="range"
            min="150"
            max="350"
            value={legendSize}
            onChange={(e) => setLegendSize(Number(e.target.value))}
            style={{
              width: "100%",
              accentColor:
                colorScale.colors[Math.floor(colorScale.colors.length / 2)],
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
                checked={showGraticule}
                onChange={(e) => setShowGraticule(e.target.checked)}
                style={{
                  accentColor:
                    colorScale.colors[Math.floor(colorScale.colors.length / 2)],
                }}
              />
              Show Grid Lines
            </label>
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

        {/* Zoom Controls */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔍 Zoom: {position.zoom.toFixed(1)}x</label>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              onClick={handleZoomOut}
              style={{ ...buttonStyle, padding: "4px 12px" }}
            >
              −
            </button>
            <button
              onClick={handleZoomIn}
              style={{ ...buttonStyle, padding: "4px 12px" }}
            >
              +
            </button>
            <button
              onClick={handleZoomReset}
              style={{ ...buttonStyle, padding: "4px 12px", fontSize: "9px" }}
            >
              ↺ Reset
            </button>
          </div>
        </div>

        {/* Hover Effect */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>✨ Hover Effect</label>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input
              type="color"
              value={hoverColor}
              onChange={(e) => setHoverColor(e.target.value)}
              style={{
                width: "36px",
                height: "32px",
                cursor: "pointer",
                border: `1px solid ${theme.colors.border.default}`,
                borderRadius: "3px",
                padding: "2px",
              }}
            />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={hoverOpacity}
              onChange={(e) => setHoverOpacity(Number(e.target.value))}
              style={{
                width: "80px",
                accentColor:
                  colorScale.colors[Math.floor(colorScale.colors.length / 2)],
              }}
            />
            <span style={{ fontSize: "10px", color: theme.colors.text.muted }}>
              {hoverOpacity}
            </span>
          </div>
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
          <label style={labelStyle}>📋 Country Data Table</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={addCountry}
              style={buttonStyle}
              onMouseEnter={(e) =>
                (e.target.style.background = `${colorScale.colors[Math.floor(colorScale.colors.length / 2)]}20`)
              }
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
            >
              + Add Country
            </button>
            <button
              onClick={() => {
                setData(DEFAULT_DATA);
                setSelectedCountry(null);
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
                <th style={thStyle}>ISO Code</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Value</th>
                <th style={thStyle}>Color</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr
                  key={row.id}
                  style={{
                    background:
                      selectedCountry?.id === row.id
                        ? `${colorScale.colors[Math.floor(colorScale.colors.length / 2)]}15`
                        : "transparent",
                    cursor: "pointer",
                    transition: "background 0.2s ease",
                  }}
                  onClick={() =>
                    setSelectedCountry(
                      selectedCountry?.id === row.id ? null : row,
                    )
                  }
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
                  <td style={tdStyle}>
                    <input
                      type="text"
                      value={row.name}
                      onChange={(e) =>
                        handleDataChange(row.id, "name", e.target.value)
                      }
                      onClick={(e) => e.stopPropagation()}
                      style={cellInputStyle}
                      placeholder="Country name"
                    />
                  </td>
                  <td style={tdStyle}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <input
                        type="number"
                        value={row.value}
                        onChange={(e) =>
                          handleDataChange(row.id, "value", e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                        style={{ ...cellInputStyle, width: "80px" }}
                        step="0.1"
                        min="0"
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
                        {row.value.toFixed(formatPreset.decimals)}
                        {formatPreset.suffix}
                      </span>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "4px",
                        background: getColorFromScale(
                          row.value,
                          valueRange.min,
                          valueRange.max,
                          colorScale.colors,
                        ),
                        border: "1px solid rgba(255,255,255,0.2)",
                      }}
                    />
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCountry(row.id);
                      }}
                      style={deleteButtonStyle}
                      disabled={data.length <= 1}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
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
            Countries:{" "}
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
              {valueRange.min.toFixed(formatPreset.decimals)} -{" "}
              {valueRange.max.toFixed(formatPreset.decimals)}
              {formatPreset.suffix}
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
              {formatPreset.suffix}
            </strong>
          </span>
          <span style={{ color: theme.colors.text.muted }}>
            Scale:{" "}
            <strong style={{ color: theme.colors.text.heading }}>
              {colorScale.name}
            </strong>
          </span>
          {selectedCountry && (
            <span
              style={{
                color: getColorFromScale(
                  selectedCountry.value,
                  valueRange.min,
                  valueRange.max,
                  colorScale.colors,
                ),
                background: `${getColorFromScale(selectedCountry.value, valueRange.min, valueRange.max, colorScale.colors)}15`,
                padding: "2px 8px",
                borderRadius: "3px",
                fontSize: "10px",
              }}
            >
              🗺️ {selectedCountry.name}:{" "}
              {selectedCountry.value.toFixed(formatPreset.decimals)}
              {formatPreset.suffix}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChoroplethMapComponent;
