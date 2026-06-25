import React, { useState, useCallback, useMemo, memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
  Annotation,
} from "react-simple-maps";
import { theme } from "../../../styles/theme";

// ============================================
// WORLD MAP - Using Natural Earth GeoJSON (react-simple-maps compatible)
// ============================================
const GEO_URL =
  "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

// ============================================
// DEFAULT DATA
// ============================================
const DEFAULT_DATA = [
  { id: 1, name: "New York", coordinates: [-74.006, 40.7128], intensity: 85 },
  { id: 2, name: "London", coordinates: [-0.1276, 51.5074], intensity: 70 },
  { id: 3, name: "Tokyo", coordinates: [139.6917, 35.6895], intensity: 92 },
  { id: 4, name: "Shanghai", coordinates: [121.4737, 31.2304], intensity: 88 },
  { id: 5, name: "Sydney", coordinates: [151.2093, -33.8688], intensity: 55 },
  {
    id: 6,
    name: "São Paulo",
    coordinates: [-46.6333, -23.5505],
    intensity: 78,
  },
  { id: 7, name: "Mumbai", coordinates: [72.8777, 19.076], intensity: 95 },
  { id: 8, name: "Cairo", coordinates: [31.2357, 30.0444], intensity: 65 },
  { id: 9, name: "Berlin", coordinates: [13.405, 52.52], intensity: 60 },
  { id: 10, name: "Toronto", coordinates: [-79.3832, 43.6532], intensity: 45 },
  { id: 11, name: "Dubai", coordinates: [55.2708, 25.2048], intensity: 75 },
  { id: 12, name: "Singapore", coordinates: [103.8198, 1.3521], intensity: 82 },
  {
    id: 13,
    name: "Mexico City",
    coordinates: [-99.1332, 19.4326],
    intensity: 72,
  },
  { id: 14, name: "Moscow", coordinates: [37.6173, 55.7558], intensity: 58 },
  { id: 15, name: "Lagos", coordinates: [3.3792, 6.5244], intensity: 80 },
];

// ============================================
// COLOR PALETTE PRESETS
// ============================================
const COLOR_PRESETS = [
  { name: "Thermal", low: "#00ff00", mid: "#ffff00", high: "#ff0000" },
  { name: "Ocean", low: "#023047", mid: "#219ebc", high: "#ffb703" },
  { name: "Plasma", low: "#0d0887", mid: "#cc4778", high: "#f0f921" },
  { name: "Viridis", low: "#440154", mid: "#21918c", high: "#fde725" },
  { name: "Inferno", low: "#000004", mid: "#bc3754", high: "#fcffa4" },
  { name: "Magma", low: "#000004", mid: "#b73779", high: "#fcfdbf" },
  { name: "Grayscale", low: "#f0f0f0", mid: "#888888", high: "#1a1a1a" },
  { name: "Custom", low: "#00d4ff", mid: "#ff6b6b", high: "#c0392b" },
];

// ============================================
// MAP PROJECTIONS
// ============================================
const PROJECTIONS = [
  { name: "Equirectangular", value: "geoEquirectangular" },
  { name: "Mercator", value: "geoMercator" },
  { name: "Natural Earth", value: "geoNaturalEarth1" },
  { name: "Equal Earth", value: "geoEqualEarth" },
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

const interpolateColor = (color1, color2, factor) => {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const r = Math.round(c1.r + factor * (c2.r - c1.r));
  const g = Math.round(c1.g + factor * (c2.g - c1.g));
  const b = Math.round(c1.b + factor * (c2.b - c1.b));
  return `rgb(${r}, ${g}, ${b})`;
};

const getColorForIntensity = (intensity, colorPreset) => {
  const ratio = Math.min(Math.max(intensity / 100, 0), 1);
  const { low, mid, high } = colorPreset;

  if (ratio < 0.5) {
    return interpolateColor(low, mid, ratio * 2);
  } else {
    return interpolateColor(mid, high, (ratio - 0.5) * 2);
  }
};

const getOpacityFromIntensity = (
  intensity,
  minOpacity = 0.15,
  maxOpacity = 0.85,
) => {
  return minOpacity + (intensity / 100) * (maxOpacity - minOpacity);
};

const getRadiusFromIntensity = (intensity, minRadius = 6, maxRadius = 35) => {
  return minRadius + (intensity / 100) * (maxRadius - minRadius);
};

// ============================================
// MAIN COMPONENT
// ============================================
const GeographicHeatmapComponent = ({ initialData = DEFAULT_DATA }) => {
  // ===== STATE =====
  const [data, setData] = useState(initialData);
  const [colorPreset, setColorPreset] = useState(COLOR_PRESETS[0]);
  const [projection, setProjection] = useState("geoEqualEarth");
  const [showPoints, setShowPoints] = useState(true);
  const [showHeatLayer, setShowHeatLayer] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [blurRadius, setBlurRadius] = useState(8);
  const [pointOpacity, setPointOpacity] = useState(0.7);
  const [minRadius, setMinRadius] = useState(6);
  const [maxRadius, setMaxRadius] = useState(35);
  const [mapColor, setMapColor] = useState("#2d3748");
  const [mapFill, setMapFill] = useState("#1a202c");
  const [titleText, setTitleText] = useState("Geographic Heatmap");
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [position, setPosition] = useState({ coordinates: [0, 20], zoom: 1 });

  // ===== DERIVED DATA =====
  const maxIntensity = useMemo(() => {
    return Math.max(...data.map((d) => d.intensity), 1);
  }, [data]);

  const averageIntensity = useMemo(() => {
    return (
      data.reduce((sum, d) => sum + d.intensity, 0) / data.length
    ).toFixed(1);
  }, [data]);

  // ===== HANDLERS =====
  const handleDataChange = useCallback((id, field, newValue) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "intensity"
                  ? Math.min(100, Math.max(0, Number(newValue) || 0))
                  : field === "coordinates"
                    ? newValue.split(",").map((v) => parseFloat(v.trim()))
                    : newValue,
            }
          : item,
      ),
    );
  }, []);

  const addDataPoint = useCallback(() => {
    const newId = Math.max(...data.map((d) => d.id), 0) + 1;
    setData((prev) => [
      ...prev,
      {
        id: newId,
        name: `Point ${newId}`,
        coordinates: [Math.random() * 360 - 180, Math.random() * 180 - 90],
        intensity: Math.floor(Math.random() * 60) + 20,
      },
    ]);
  }, [data]);

  const removeDataPoint = useCallback((id) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    setSelectedPoint(null);
  }, []);

  const handlePointClick = useCallback(
    (point) => {
      setSelectedPoint(selectedPoint?.id === point.id ? null : point);
    },
    [selectedPoint],
  );

  const handleMoveEnd = useCallback((position) => {
    setPosition(position);
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
    borderBottom: `2px solid ${colorPreset.high}`,
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
    padding: "0",
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
    border: `1px solid ${colorPreset.high}`,
    borderRadius: "3px",
    color: colorPreset.high,
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
  // LEGEND COMPONENT
  // ============================================
  const LegendGradient = memo(() => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        background: "rgba(0,0,0,0.5)",
        borderRadius: "6px",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <span style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 600 }}>
        LOW
      </span>
      <div
        style={{
          width: "200px",
          height: "14px",
          borderRadius: "7px",
          background: `linear-gradient(to right, ${colorPreset.low}, ${colorPreset.mid}, ${colorPreset.high})`,
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      />
      <span style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 600 }}>
        HIGH
      </span>
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
          <span style={{ fontSize: "28px" }}>🌍</span>
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
              color: colorPreset.high,
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${colorPreset.high}50`,
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
            {data.length} POINTS
          </span>
        </div>
      </div>

      {/* MAP DISPLAY */}
      <div id="chart-visual-area" style={mapContainerStyle}>
        {/* Map Legend Overlay */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
        >
          <LegendGradient />
        </div>

        <ComposableMap
          projection={projection}
          projectionConfig={{
            scale: 180,
          }}
          style={{
            width: "100%",
            height: "500px",
            background: "#0f172a",
          }}
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={handleMoveEnd}
            maxZoom={8}
            minZoom={0.5}
          >
            {/* Base Map */}
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={mapFill}
                    stroke={mapColor}
                    strokeWidth={0.5}
                    style={{
                      default: {
                        outline: "none",
                      },
                      hover: {
                        fill: "#2d3748",
                        outline: "none",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      },
                      pressed: {
                        outline: "none",
                      },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Heat Layer - Glow Circles */}
            {showHeatLayer &&
              data.map((point) => (
                <Marker
                  key={`heat-${point.id}`}
                  coordinates={point.coordinates}
                >
                  {Array.from({ length: 3 }, (_, i) => {
                    const size =
                      getRadiusFromIntensity(
                        point.intensity,
                        minRadius,
                        maxRadius,
                      ) *
                      (1 + i * 1.2);
                    const opacity =
                      getOpacityFromIntensity(point.intensity, 0.05, 0.2) /
                      (i + 1);
                    return (
                      <circle
                        key={i}
                        cx={0}
                        cy={0}
                        r={size}
                        fill={getColorForIntensity(
                          point.intensity,
                          colorPreset,
                        )}
                        opacity={opacity}
                        style={{
                          filter: `blur(${blurRadius + i * 4}px)`,
                        }}
                      />
                    );
                  })}
                </Marker>
              ))}

            {/* Data Points */}
            {showPoints &&
              data.map((point) => (
                <Marker
                  key={`point-${point.id}`}
                  coordinates={point.coordinates}
                >
                  <circle
                    r={getRadiusFromIntensity(point.intensity, 3, 8)}
                    fill={getColorForIntensity(point.intensity, colorPreset)}
                    opacity={pointOpacity}
                    stroke="#ffffff"
                    strokeWidth={selectedPoint?.id === point.id ? 2.5 : 1}
                    style={{
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => handlePointClick(point)}
                  />
                </Marker>
              ))}

            {/* Labels */}
            {showLabels &&
              data.map((point) => (
                <Annotation
                  key={`label-${point.id}`}
                  subject={point.coordinates}
                  dx={
                    getRadiusFromIntensity(
                      point.intensity,
                      minRadius,
                      maxRadius,
                    ) + 10
                  }
                  dy={
                    -getRadiusFromIntensity(
                      point.intensity,
                      minRadius,
                      maxRadius,
                    ) - 5
                  }
                  connectorProps={{
                    stroke: "#94a3b8",
                    strokeWidth: 0.5,
                    strokeOpacity: 0.5,
                  }}
                >
                  <text
                    x={4}
                    y={4}
                    fontSize={9}
                    fontFamily={theme.typography.fontFamily.primary}
                    fill="#cbd5e1"
                    fontWeight={600}
                    textAnchor="start"
                    alignmentBaseline="middle"
                  >
                    {point.name}
                  </text>
                  <text
                    x={4}
                    y={16}
                    fontSize={8}
                    fontFamily={theme.typography.fontFamily.primary}
                    fill="#94a3b8"
                    textAnchor="start"
                    alignmentBaseline="middle"
                  >
                    {point.intensity}%
                  </text>
                </Annotation>
              ))}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* CONTROLS */}
      <div style={controlsGridStyle}>
        {/* Color Preset */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Color Palette</label>
          <select
            value={colorPreset.name}
            onChange={(e) => {
              const preset = COLOR_PRESETS.find(
                (c) => c.name === e.target.value,
              );
              setColorPreset(preset);
            }}
            style={selectStyle}
          >
            {COLOR_PRESETS.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
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

        {/* Blur Radius */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>💫 Blur: {blurRadius}px</label>
          <input
            type="range"
            min="0"
            max="30"
            value={blurRadius}
            onChange={(e) => setBlurRadius(Number(e.target.value))}
            style={{ width: "100%", accentColor: colorPreset.high }}
          />
        </div>

        {/* Point Opacity */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>👁️ Point Opacity: {pointOpacity}</label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={pointOpacity}
            onChange={(e) => setPointOpacity(Number(e.target.value))}
            style={{ width: "100%", accentColor: colorPreset.high }}
          />
        </div>

        {/* Radius Range */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Min Radius: {minRadius}px</label>
          <input
            type="range"
            min="2"
            max="15"
            value={minRadius}
            onChange={(e) => setMinRadius(Number(e.target.value))}
            style={{ width: "100%", accentColor: colorPreset.high }}
          />
        </div>

        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Max Radius: {maxRadius}px</label>
          <input
            type="range"
            min="15"
            max="60"
            value={maxRadius}
            onChange={(e) => setMaxRadius(Number(e.target.value))}
            style={{ width: "100%", accentColor: colorPreset.high }}
          />
        </div>

        {/* Map Colors */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🗺️ Land Color</label>
          <input
            type="color"
            value={mapFill}
            onChange={(e) => setMapFill(e.target.value)}
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

        <div style={controlGroupStyle}>
          <label style={labelStyle}>🗺️ Border Color</label>
          <input
            type="color"
            value={mapColor}
            onChange={(e) => setMapColor(e.target.value)}
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

        {/* Toggles */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>👁️ Visibility</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={checkboxStyle}>
              <input
                type="checkbox"
                checked={showHeatLayer}
                onChange={(e) => setShowHeatLayer(e.target.checked)}
                style={{ accentColor: colorPreset.high }}
              />
              Show Heat Layer
            </label>
            <label style={checkboxStyle}>
              <input
                type="checkbox"
                checked={showPoints}
                onChange={(e) => setShowPoints(e.target.checked)}
                style={{ accentColor: colorPreset.high }}
              />
              Show Points
            </label>
            <label style={checkboxStyle}>
              <input
                type="checkbox"
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
                style={{ accentColor: colorPreset.high }}
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
              onClick={addDataPoint}
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.target.style.background = `${colorPreset.high}20`;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
              }}
            >
              + Add Point
            </button>
            <button
              onClick={() => {
                setData(DEFAULT_DATA);
                setSelectedPoint(null);
              }}
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.target.style.background = `${colorPreset.high}20`;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
              }}
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
                <th style={thStyle}>Longitude</th>
                <th style={thStyle}>Latitude</th>
                <th style={thStyle}>Intensity</th>
                <th style={thStyle}>Visual</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr
                  key={row.id}
                  style={{
                    background:
                      selectedPoint?.id === row.id
                        ? `${colorPreset.high}15`
                        : "transparent",
                    transition: "background 0.2s ease",
                    cursor: "pointer",
                  }}
                  onClick={() => handlePointClick(row)}
                >
                  <td
                    style={{
                      ...tdStyle,
                      color: theme.colors.text.muted,
                      fontSize: "10px",
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
                      placeholder="Location name"
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="number"
                      value={row.coordinates[0]}
                      onChange={(e) => {
                        const updated = [...row.coordinates];
                        updated[0] = parseFloat(e.target.value) || 0;
                        handleDataChange(
                          row.id,
                          "coordinates",
                          updated.join(","),
                        );
                      }}
                      onClick={(e) => e.stopPropagation()}
                      style={cellInputStyle}
                      step="0.01"
                      placeholder="Longitude"
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="number"
                      value={row.coordinates[1]}
                      onChange={(e) => {
                        const updated = [...row.coordinates];
                        updated[1] = parseFloat(e.target.value) || 0;
                        handleDataChange(
                          row.id,
                          "coordinates",
                          updated.join(","),
                        );
                      }}
                      onClick={(e) => e.stopPropagation()}
                      style={cellInputStyle}
                      step="0.01"
                      placeholder="Latitude"
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={row.intensity}
                      onChange={(e) =>
                        handleDataChange(row.id, "intensity", e.target.value)
                      }
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        width: "80px",
                        accentColor: getColorForIntensity(
                          row.intensity,
                          colorPreset,
                        ),
                      }}
                    />
                    <span
                      style={{
                        marginLeft: "8px",
                        fontSize: "11px",
                        fontWeight: 700,
                        color: getColorForIntensity(row.intensity, colorPreset),
                      }}
                    >
                      {row.intensity}%
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background: getColorForIntensity(
                          row.intensity,
                          colorPreset,
                        ),
                        opacity: getOpacityFromIntensity(row.intensity),
                        boxShadow: `0 0 ${blurRadius}px ${getColorForIntensity(row.intensity, colorPreset)}`,
                      }}
                    />
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeDataPoint(row.id);
                      }}
                      style={deleteButtonStyle}
                      disabled={data.length <= 1}
                      onMouseEnter={(e) => {
                        if (data.length > 1) {
                          e.target.style.background = `${theme.colors.status.error}20`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "transparent";
                      }}
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
            padding: "10px 14px",
            background: theme.colors.cardBg,
            borderRadius: "4px",
            border: `1px solid ${theme.colors.border.default}`,
            fontSize: "11px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <span style={{ color: theme.colors.text.muted }}>
            Points:{" "}
            <strong style={{ color: theme.colors.text.heading }}>
              {data.length}
            </strong>
          </span>
          <span style={{ color: theme.colors.text.muted }}>
            Max:{" "}
            <strong style={{ color: colorPreset.high }}>{maxIntensity}%</strong>
          </span>
          <span style={{ color: theme.colors.text.muted }}>
            Avg:{" "}
            <strong style={{ color: colorPreset.mid }}>
              {averageIntensity}%
            </strong>
          </span>
          <span style={{ color: theme.colors.text.muted }}>
            Palette:{" "}
            <strong style={{ color: theme.colors.text.heading }}>
              {colorPreset.name}
            </strong>
          </span>
          {selectedPoint && (
            <span
              style={{
                color: colorPreset.high,
                background: `${colorPreset.high}15`,
                padding: "2px 8px",
                borderRadius: "3px",
                fontSize: "10px",
              }}
            >
              📍 {selectedPoint.name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeographicHeatmapComponent;
