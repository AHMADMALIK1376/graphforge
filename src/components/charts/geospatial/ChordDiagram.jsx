import React, { useState, useCallback, useMemo, memo } from "react";
import { chord, ribbon } from "d3-chord";
import { arc } from "d3-shape";
import { theme } from "../../../styles/theme";

// ============================================
// DEFAULT DATA - Trade flows between regions
// Matrix format: rows = source, columns = target
// ============================================
const DEFAULT_MATRIX = [
  [0, 45, 30, 20, 15, 10, 25, 8],
  [40, 0, 35, 15, 25, 8, 18, 12],
  [28, 38, 0, 32, 18, 15, 22, 10],
  [22, 18, 30, 0, 28, 22, 15, 20],
  [18, 22, 20, 25, 0, 30, 12, 18],
  [12, 10, 18, 20, 28, 0, 8, 25],
  [20, 15, 25, 18, 15, 10, 0, 30],
  [10, 15, 12, 22, 20, 28, 32, 0],
];

const DEFAULT_NAMES = [
  "North America",
  "Europe",
  "Asia Pacific",
  "South America",
  "Middle East",
  "Africa",
  "Oceania",
  "Central Asia",
];

const DEFAULT_COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f97316",
];

// ============================================
// SMALLER DATASET FOR SIMPLICITY
// ============================================
const SMALL_MATRIX = [
  [0, 80, 55, 30, 20],
  [75, 0, 45, 25, 35],
  [50, 40, 0, 60, 15],
  [35, 20, 55, 0, 40],
  [25, 30, 20, 45, 0],
];

const SMALL_NAMES = ["USA", "China", "EU", "Japan", "UK"];

const SMALL_COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];

// ============================================
// COLOR PALETTE PRESETS
// ============================================
const COLOR_PRESETS = [
  {
    name: "Vibrant",
    colors: [
      "#3b82f6",
      "#ef4444",
      "#10b981",
      "#f59e0b",
      "#8b5cf6",
      "#ec4899",
      "#06b6d4",
      "#f97316",
    ],
  },
  {
    name: "Pastel",
    colors: [
      "#93c5fd",
      "#fca5a5",
      "#86efac",
      "#fcd34d",
      "#c4b5fd",
      "#f9a8d4",
      "#67e8f9",
      "#fdba74",
    ],
  },
  {
    name: "Ocean",
    colors: [
      "#023047",
      "#219ebc",
      "#8ecae6",
      "#ffb703",
      "#fb8500",
      "#e63946",
      "#457b9d",
      "#a8dadc",
    ],
  },
  {
    name: "Forest",
    colors: [
      "#1b4332",
      "#40916c",
      "#52b788",
      "#95d5b2",
      "#d8f3dc",
      "#2d6a4f",
      "#74c69d",
      "#b7e4c7",
    ],
  },
  {
    name: "Sunset",
    colors: [
      "#ff6b6b",
      "#ee5a24",
      "#feca57",
      "#ff9ff3",
      "#54a0ff",
      "#5f27cd",
      "#01a3a4",
      "#f368e0",
    ],
  },
  {
    name: "Monochrome",
    colors: [
      "#1a1a2e",
      "#2d2d44",
      "#404069",
      "#53538f",
      "#6666b4",
      "#7a7ad9",
      "#8d8dff",
      "#a0a0ff",
    ],
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================
const hexToRgba = (hex, alpha) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(0,0,0,${alpha})`;
  return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`;
};

// ============================================
// MAIN COMPONENT
// ============================================
const ChordDiagramComponent = ({
  initialMatrix = SMALL_MATRIX,
  initialNames = SMALL_NAMES,
  initialColors = SMALL_COLORS,
}) => {
  // ===== STATE =====
  const [matrix, setMatrix] = useState(initialMatrix);
  const [names, setNames] = useState(initialNames);
  const [entityColors, setEntityColors] = useState(initialColors);
  const [colorPreset, setColorPreset] = useState(COLOR_PRESETS[0]);
  const [innerRadius, setInnerRadius] = useState(180);
  const [outerRadius, setOuterRadius] = useState(230);
  const [padAngle, setPadAngle] = useState(0.04);
  const [ribbonOpacity, setRibbonOpacity] = useState(0.7);
  const [showLabels, setShowLabels] = useState(true);
  const [labelSize, setLabelSize] = useState(12);
  const [showValues, setShowValues] = useState(false);
  const [titleText, setTitleText] = useState("Chord Diagram");
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [datasetSize, setDatasetSize] = useState("small");

  // ===== DERIVED DATA =====
  const chordGenerator = useMemo(() => {
    return chord()
      .padAngle(padAngle)
      .sortSubgroups((a, b) => b - a)
      .sortChords((a, b) => b - a);
  }, [padAngle]);

  const chords = useMemo(() => {
    return chordGenerator(matrix);
  }, [matrix, chordGenerator]);

  const arcGenerator = useMemo(() => {
    return arc().innerRadius(innerRadius).outerRadius(outerRadius);
  }, [innerRadius, outerRadius]);

  const ribbonGenerator = useMemo(() => {
    return ribbon().radius(innerRadius);
  }, [innerRadius]);

  const totalValue = useMemo(() => {
    return matrix.flat().reduce((sum, v) => sum + v, 0);
  }, [matrix]);

  // ===== HANDLERS =====
  const handleMatrixChange = useCallback((row, col, value) => {
    setMatrix((prev) => {
      const updated = prev.map((r) => [...r]);
      updated[row][col] = Math.max(0, Number(value) || 0);
      return updated;
    });
  }, []);

  const handleNameChange = useCallback((index, value) => {
    setNames((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  }, []);

  const handleEntityColorChange = useCallback((index, color) => {
    setEntityColors((prev) => {
      const updated = [...prev];
      updated[index] = color;
      return updated;
    });
  }, []);

  const handleColorPresetChange = useCallback(
    (presetName) => {
      const preset = COLOR_PRESETS.find((p) => p.name === presetName);
      if (preset) {
        setColorPreset(preset);
        setEntityColors(preset.colors.slice(0, names.length));
      }
    },
    [names],
  );

  const handleDatasetChange = useCallback((size) => {
    setDatasetSize(size);
    if (size === "small") {
      setMatrix(SMALL_MATRIX.map((r) => [...r]));
      setNames([...SMALL_NAMES]);
      setEntityColors([...SMALL_COLORS]);
      setTitleText("Chord Diagram - Trade Flows");
    } else {
      setMatrix(DEFAULT_MATRIX.map((r) => [...r]));
      setNames([...DEFAULT_NAMES]);
      setEntityColors([...DEFAULT_COLORS]);
      setTitleText("Chord Diagram - Global Trade");
    }
    setSelectedEntity(null);
  }, []);

  const handleArcClick = useCallback(
    (index) => {
      setSelectedEntity(selectedEntity === index ? null : index);
    },
    [selectedEntity],
  );

  const center = 320;
  const svgSize = 640;

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
    borderBottom: `2px solid ${entityColors[0] || "#3b82f6"}`,
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
    minHeight: "550px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
    border: `1px solid ${entityColors[0] || "#3b82f6"}`,
    borderRadius: "3px",
    color: entityColors[0] || "#3b82f6",
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
    padding: "6px 8px",
    borderBottom: `1px solid ${theme.colors.border.light}`,
    textAlign: "center",
  };

  const cellInputStyle = {
    padding: "4px 6px",
    background: theme.colors.inputBg,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: "3px",
    color: theme.colors.text.body,
    fontSize: "11px",
    fontFamily: theme.typography.fontFamily.primary,
    width: "55px",
    outline: "none",
    boxSizing: "border-box",
    textAlign: "center",
  };

  // ============================================
  // TOOLTIP COMPONENT
  // ============================================
  const Tooltip = ({ info, pos }) => {
    if (!info || !pos) return null;
    return (
      <div
        style={{
          position: "absolute",
          left: pos.x + 15,
          top: pos.y - 40,
          background: "rgba(15, 15, 35, 0.95)",
          border: `1px solid ${entityColors[0] || "#3b82f6"}`,
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
            margin: 0,
            fontSize: "12px",
            fontWeight: 700,
            color: "#e2e8f0",
          }}
        >
          {info.source} → {info.target}
        </p>
        <p
          style={{
            margin: "4px 0 0",
            fontSize: "14px",
            fontWeight: 700,
            color: entityColors[0] || "#3b82f6",
          }}
        >
          Value: {info.value}
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
        top: "20px",
        right: "20px",
        background: "rgba(15, 15, 35, 0.9)",
        borderRadius: "8px",
        padding: "12px 16px",
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
        zIndex: 10,
        maxHeight: "300px",
        overflowY: "auto",
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
        ENTITIES
      </p>
      {names.map((name, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "4px",
            cursor: "pointer",
          }}
          onClick={() => handleArcClick(i)}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: entityColors[i] || "#64748b",
              border:
                selectedEntity === i
                  ? "2px solid #ffffff"
                  : "1px solid rgba(255,255,255,0.2)",
            }}
          />
          <span
            style={{
              fontSize: "9px",
              color: selectedEntity === i ? "#ffffff" : "#94a3b8",
              fontWeight: selectedEntity === i ? 700 : 400,
            }}
          >
            {name}
          </span>
        </div>
      ))}
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
          <span style={{ fontSize: "28px" }}>🔄</span>
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
              color: entityColors[0] || "#3b82f6",
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${entityColors[0] || "#3b82f6"}50`,
              borderRadius: "3px",
              fontWeight: 600,
              letterSpacing: "1px",
            }}
          >
            GEOSPATIAL & OTHER
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
            {names.length} ENTITIES
          </span>
        </div>
      </div>

      {/* CHORD DIAGRAM */}
      <div id="chart-visual-area" style={chartContainerStyle}>
        <Legend />
        <Tooltip info={tooltip?.info} pos={tooltip?.position} />

        <svg
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
        >
          {/* Background */}
          <rect width={svgSize} height={svgSize} fill="#0f172a" rx="8" />

          {/* Title */}
          <text
            x={center}
            y={35}
            textAnchor="middle"
            fontSize="14"
            fontWeight={700}
            fill="#cbd5e1"
            fontFamily={theme.typography.fontFamily.primary}
          >
            {titleText}
          </text>

          <g transform={`translate(${center}, ${center})`}>
            {/* Ribbons (chords) */}
            {chords.map((chord, i) => {
              const sourceIdx = chord.source.index;
              const targetIdx = chord.target.index;
              const sourceColor = entityColors[sourceIdx] || "#64748b";
              const isHighlighted =
                selectedEntity === null ||
                selectedEntity === sourceIdx ||
                selectedEntity === targetIdx;

              return (
                <path
                  key={`ribbon-${i}`}
                  d={ribbonGenerator(chord)}
                  fill={sourceColor}
                  opacity={isHighlighted ? ribbonOpacity : 0.08}
                  stroke={
                    isHighlighted ? hexToRgba(sourceColor, 0.5) : "transparent"
                  }
                  strokeWidth={0.5}
                  style={{
                    cursor: "pointer",
                    transition: "opacity 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    const rect = e.target
                      .closest("svg")
                      .getBoundingClientRect();
                    setTooltip({
                      info: {
                        source: names[sourceIdx],
                        target: names[targetIdx],
                        value: chord.source.value,
                      },
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
            })}

            {/* Outer arcs */}
            {chords.groups.map((group, i) => {
              const isHighlighted =
                selectedEntity === null || selectedEntity === i;
              const pathData = arcGenerator(group);

              return (
                <g key={`arc-${i}`}>
                  {/* Arc segment */}
                  <path
                    d={pathData}
                    fill={entityColors[i] || "#64748b"}
                    opacity={isHighlighted ? 1 : 0.3}
                    stroke="#0f172a"
                    strokeWidth={2}
                    style={{
                      cursor: "pointer",
                      transition: "opacity 0.3s ease",
                    }}
                    onClick={() => handleArcClick(i)}
                  />

                  {/* Labels on arcs */}
                  {showLabels && (
                    <text
                      transform={`
                        translate(${arcGenerator.centroid(group)})
                        rotate(${(((group.startAngle + group.endAngle) / 2) * 180) / Math.PI - 90})
                      `}
                      dy={
                        group.startAngle + group.endAngle > Math.PI ? -15 : 25
                      }
                      fontSize={labelSize}
                      fontFamily={theme.typography.fontFamily.primary}
                      fill="#e2e8f0"
                      fontWeight={isHighlighted ? 700 : 400}
                      textAnchor="middle"
                      style={{ pointerEvents: "none" }}
                    >
                      {names[i]}
                      {showValues && ` (${group.value})`}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* CONTROLS */}
      <div style={controlsGridStyle}>
        {/* Dataset Size */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📊 Dataset</label>
          <select
            value={datasetSize}
            onChange={(e) => handleDatasetChange(e.target.value)}
            style={selectStyle}
          >
            <option value="small">5 Entities (Simple)</option>
            <option value="large">8 Entities (Complex)</option>
          </select>
        </div>

        {/* Color Preset */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Color Palette</label>
          <select
            value={colorPreset.name}
            onChange={(e) => handleColorPresetChange(e.target.value)}
            style={selectStyle}
          >
            {COLOR_PRESETS.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Inner Radius */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>⭕ Inner Radius: {innerRadius}</label>
          <input
            type="range"
            min="100"
            max="250"
            value={innerRadius}
            onChange={(e) => setInnerRadius(Number(e.target.value))}
            style={{ width: "100%", accentColor: entityColors[0] }}
          />
        </div>

        {/* Outer Radius */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>⭕ Outer Radius: {outerRadius}</label>
          <input
            type="range"
            min={150}
            max={300}
            value={outerRadius}
            onChange={(e) => setOuterRadius(Number(e.target.value))}
            style={{ width: "100%", accentColor: entityColors[0] }}
          />
        </div>

        {/* Pad Angle */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📐 Gap: {padAngle.toFixed(3)}</label>
          <input
            type="range"
            min="0.01"
            max="0.15"
            step="0.01"
            value={padAngle}
            onChange={(e) => setPadAngle(Number(e.target.value))}
            style={{ width: "100%", accentColor: entityColors[0] }}
          />
        </div>

        {/* Ribbon Opacity */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>👁️ Ribbon Opacity: {ribbonOpacity}</label>
          <input
            type="range"
            min="0.2"
            max="1"
            step="0.1"
            value={ribbonOpacity}
            onChange={(e) => setRibbonOpacity(Number(e.target.value))}
            style={{ width: "100%", accentColor: entityColors[0] }}
          />
        </div>

        {/* Label Size */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔤 Label Size: {labelSize}</label>
          <input
            type="range"
            min="8"
            max="18"
            value={labelSize}
            onChange={(e) => setLabelSize(Number(e.target.value))}
            style={{ width: "100%", accentColor: entityColors[0] }}
          />
        </div>

        {/* Entity Colors */}
        {names.map((name, i) => (
          <div key={i} style={controlGroupStyle}>
            <label style={labelStyle}>🎯 {name}</label>
            <input
              type="color"
              value={entityColors[i] || "#64748b"}
              onChange={(e) => handleEntityColorChange(i, e.target.value)}
              style={{
                width: "36px",
                height: "32px",
                cursor: "pointer",
                border: `1px solid ${theme.colors.border.default}`,
                borderRadius: "3px",
              }}
            />
          </div>
        ))}

        {/* Toggles */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>👁️ Options</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={checkboxStyle}>
              <input
                type="checkbox"
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
                style={{ accentColor: entityColors[0] }}
              />
              Show Labels
            </label>
            <label style={checkboxStyle}>
              <input
                type="checkbox"
                checked={showValues}
                onChange={(e) => setShowValues(e.target.checked)}
                style={{ accentColor: entityColors[0] }}
              />
              Show Values
            </label>
          </div>
        </div>
      </div>

      {/* MATRIX DATA TABLE */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <label style={labelStyle}>📋 Flow Matrix (Source → Target)</label>
          <button
            onClick={() => handleDatasetChange(datasetSize)}
            style={buttonStyle}
            onMouseEnter={(e) =>
              (e.target.style.background = `${entityColors[0]}20`)
            }
            onMouseLeave={(e) => (e.target.style.background = "transparent")}
          >
            ↺ Reset Data
          </button>
        </div>

        <div id="chart-data-table" style={dataTableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Source ↓ Target →</th>
                {names.map((name, i) => (
                  <th
                    key={i}
                    style={{
                      ...thStyle,
                      textAlign: "center",
                      color: entityColors[i],
                    }}
                  >
                    {name.substring(0, 4)}
                  </th>
                ))}
                <th style={thStyle}>Total Out</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  <td
                    style={{
                      ...tdStyle,
                      fontWeight: 700,
                      color: entityColors[rowIdx],
                      textAlign: "left",
                    }}
                  >
                    {names[rowIdx]}
                  </td>
                  {row.map((val, colIdx) => (
                    <td key={colIdx} style={tdStyle}>
                      <input
                        type="number"
                        value={val}
                        onChange={(e) =>
                          handleMatrixChange(rowIdx, colIdx, e.target.value)
                        }
                        style={{
                          ...cellInputStyle,
                          background:
                            rowIdx === colIdx
                              ? theme.colors.border.default
                              : theme.colors.inputBg,
                          color:
                            rowIdx === colIdx
                              ? theme.colors.text.muted
                              : theme.colors.text.body,
                        }}
                        min="0"
                        disabled={rowIdx === colIdx}
                      />
                    </td>
                  ))}
                  <td
                    style={{
                      ...tdStyle,
                      fontWeight: 700,
                      color: entityColors[rowIdx],
                    }}
                  >
                    {row.reduce((a, b) => a + b, 0)}
                  </td>
                </tr>
              ))}
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
            Entities:{" "}
            <strong style={{ color: theme.colors.text.heading }}>
              {names.length}
            </strong>
          </span>
          <span style={{ color: theme.colors.text.muted }}>
            Total Flow:{" "}
            <strong style={{ color: entityColors[0] }}>{totalValue}</strong>
          </span>
          <span style={{ color: theme.colors.text.muted }}>
            Connections:{" "}
            <strong style={{ color: theme.colors.text.heading }}>
              {matrix.length * matrix.length - matrix.length}
            </strong>
          </span>
          {selectedEntity !== null && (
            <span
              style={{
                color: entityColors[selectedEntity],
                background: `${entityColors[selectedEntity]}15`,
                padding: "2px 8px",
                borderRadius: "3px",
                fontSize: "10px",
              }}
            >
              🔄 {names[selectedEntity]} selected
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChordDiagramComponent;
