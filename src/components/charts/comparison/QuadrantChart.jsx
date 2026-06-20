import React, { useState, useCallback, useMemo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  Cell,
  ReferenceLine,
  Label,
} from "recharts";
import { theme } from "../../../styles/theme";

// ============================================
// DEFAULT DATA
// ============================================
const DEFAULT_DATA = [
  { label: "Product A", x: 75, y: 80, size: 100, color: "#58a6ff" },
  { label: "Product B", x: 45, y: 70, size: 80, color: "#3fb950" },
  { label: "Product C", x: 85, y: 35, size: 60, color: "#f85149" },
  { label: "Product D", x: 30, y: 25, size: 40, color: "#d29922" },
  { label: "Product E", x: 60, y: 55, size: 90, color: "#a371f7" },
  { label: "Product F", x: 20, y: 75, size: 50, color: "#79c0ff" },
  { label: "Product G", x: 70, y: 20, size: 70, color: "#ff7b72" },
  { label: "Product H", x: 40, y: 45, size: 55, color: "#56d364" },
  { label: "Product I", x: 90, y: 90, size: 120, color: "#bc8cff" },
  { label: "Product J", x: 15, y: 15, size: 30, color: "#e3b341" },
  { label: "Product K", x: 55, y: 85, size: 65, color: "#1f6feb" },
  { label: "Product L", x: 80, y: 60, size: 85, color: "#238636" },
];

const QUADRANT_PRESETS = [
  {
    name: "SWOT Analysis",
    q1: "Stars (High-High)",
    q2: "Question Marks (Low-High)",
    q3: "Dogs (Low-Low)",
    q4: "Cash Cows (High-Low)",
  },
  {
    name: "Priority Matrix",
    q1: "Do First",
    q2: "Schedule",
    q3: "Delegate",
    q4: "Eliminate",
  },
  {
    name: "Risk Matrix",
    q1: "High Impact / High Prob",
    q2: "High Impact / Low Prob",
    q3: "Low Impact / Low Prob",
    q4: "Low Impact / High Prob",
  },
  {
    name: "Custom",
    q1: "Q1: High-High",
    q2: "Q2: Low-High",
    q3: "Q3: Low-Low",
    q4: "Q4: High-Low",
  },
];

const CENTER_MODES = [
  { name: "Median", value: "median" },
  { name: "Mean", value: "mean" },
  { name: "Custom", value: "custom" },
  { name: "Middle (50)", value: "middle" },
];

const QuadrantChartComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#58a6ff",
}) => {
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Quadrant Chart");
  const [xLabel, setXLabel] = useState("Impact →");
  const [yLabel, setYLabel] = useState("Effort →");
  const [quadrantColors, setQuadrantColors] = useState([
    "rgba(63, 185, 80, 0.08)",
    "rgba(88, 166, 255, 0.08)",
    "rgba(248, 81, 73, 0.08)",
    "rgba(210, 153, 34, 0.08)",
  ]);
  const [quadrantPreset, setQuadrantPreset] = useState("SWOT Analysis");
  const [quadrantLabels, setQuadrantLabels] = useState(QUADRANT_PRESETS[0]);
  const [centerMode, setCenterMode] = useState("median");
  const [customCenterX, setCustomCenterX] = useState(50);
  const [customCenterY, setCustomCenterY] = useState(50);
  const [showCenterLines, setShowCenterLines] = useState(true);
  const [centerLineColor, setCenterLineColor] = useState("#30363d");
  const [centerLineWidth, setCenterLineWidth] = useState(1.5);
  const [showQuadrantLabels, setShowQuadrantLabels] = useState(true);
  const [showQuadrantColors, setShowQuadrantColors] = useState(true);
  const [bubbleScale, setBubbleScale] = useState(1);
  const [labelPosition, setLabelPosition] = useState("top");
  const [showLabels, setShowLabels] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [fontSize, setFontSize] = useState(11);
  const [animation, setAnimation] = useState(true);
  const [highlightZone, setHighlightZone] = useState(null);

  const centerX = useMemo(() => {
    if (centerMode === "median") {
      const sorted = [...data].sort((a, b) => a.x - b.x);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 === 0
        ? (sorted[mid - 1].x + sorted[mid].x) / 2
        : sorted[mid].x;
    }
    if (centerMode === "mean")
      return data.reduce((s, d) => s + d.x, 0) / data.length;
    if (centerMode === "custom") return customCenterX;
    return 50;
  }, [data, centerMode, customCenterX]);

  const centerY = useMemo(() => {
    if (centerMode === "median") {
      const sorted = [...data].sort((a, b) => a.y - b.y);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 === 0
        ? (sorted[mid - 1].y + sorted[mid].y) / 2
        : sorted[mid].y;
    }
    if (centerMode === "mean")
      return data.reduce((s, d) => s + d.y, 0) / data.length;
    if (centerMode === "custom") return customCenterY;
    return 50;
  }, [data, centerMode, customCenterY]);

  const quadrantCounts = useMemo(() => {
    const counts = { q1: 0, q2: 0, q3: 0, q4: 0 };
    data.forEach((d) => {
      if (d.x >= centerX && d.y >= centerY) counts.q1++;
      else if (d.x < centerX && d.y >= centerY) counts.q2++;
      else if (d.x < centerX && d.y < centerY) counts.q3++;
      else counts.q4++;
    });
    return counts;
  }, [data, centerX, centerY]);

  const handleDataChange = useCallback((index, field, newValue) => {
    setData((prev) => {
      const updated = [...prev];
      if (field === "label")
        updated[index] = { ...updated[index], label: newValue };
      else
        updated[index] = { ...updated[index], [field]: Number(newValue) || 0 };
      return updated;
    });
  }, []);

  const addPoint = useCallback(() => {
    setData((prev) => [
      ...prev,
      {
        label: `Item ${prev.length + 1}`,
        x: Math.floor(Math.random() * 80) + 10,
        y: Math.floor(Math.random() * 80) + 10,
        size: Math.floor(Math.random() * 80) + 20,
        color: theme.colors.charts[prev.length % theme.colors.charts.length],
      },
    ]);
  }, []);
  const removePoint = useCallback((index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  }, []);
  const handlePresetChange = (presetName) => {
    const preset = QUADRANT_PRESETS.find((p) => p.name === presetName);
    if (preset) {
      setQuadrantPreset(presetName);
      setQuadrantLabels(preset);
    }
  };

  const CustomBubble = (props) => {
    const { cx, cy, payload } = props;
    const size = Math.sqrt(payload.size) * bubbleScale * 0.8;
    const color = payload.color || "#58a6ff";
    const actualSize = Math.max(8, Math.min(size, 60));
    // USE highlightZone for hover effect
    const isHighlighted = highlightZone === payload.label;
    const glowOpacity = isHighlighted ? 0.35 : 0.15;
    const scale = isHighlighted ? 1.15 : 1;

    return (
      <g
        style={{
          cursor: "pointer",
          transform: `scale(${scale})`,
          transformOrigin: `${cx}px ${cy}px`,
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={() => setHighlightZone(payload.label)}
        onMouseLeave={() => setHighlightZone(null)}
      >
        <circle
          cx={cx}
          cy={cy}
          r={actualSize + 3}
          fill={color}
          opacity={glowOpacity}
        />
        <circle
          cx={cx}
          cy={cy}
          r={actualSize}
          fill={color}
          opacity={0.85}
          stroke="#ffffff"
          strokeWidth={1.5}
          style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.2))" }}
        />
        <circle
          cx={cx - actualSize * 0.25}
          cy={cy - actualSize * 0.25}
          r={actualSize * 0.25}
          fill="rgba(255,255,255,0.35)"
        />
        {showLabels && labelPosition === "center" && actualSize > 15 && (
          <text
            x={cx}
            y={cy + 3}
            textAnchor="middle"
            fill="#ffffff"
            fontSize={Math.min(actualSize * 0.4, 10)}
            fontWeight={700}
            fontFamily={theme.typography.fontFamily.primary}
            style={{ pointerEvents: "none" }}
          >
            {payload.label.length > 8
              ? payload.label.substring(0, 7) + "…"
              : payload.label}
          </text>
        )}
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const pt = payload[0]?.payload;
      if (!pt) return null;
      const quadrant =
        pt.x >= centerX && pt.y >= centerY
          ? quadrantLabels.q1
          : pt.x < centerX && pt.y >= centerY
            ? quadrantLabels.q2
            : pt.x < centerX && pt.y < centerY
              ? quadrantLabels.q3
              : quadrantLabels.q4;
      return (
        <div style={tooltipContainerStyle}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "6px",
            }}
          >
            <span style={{ ...tooltipColorDot, background: pt.color }} />
            <span style={tooltipLabelStyle}>{pt.label}</span>
          </div>
          <div style={tooltipValueRow}>
            <span style={tooltipValueLabel}>
              {xLabel.replace("→", "").trim()}:
            </span>
            <span style={tooltipValue}>{pt.x}</span>
          </div>
          <div style={tooltipValueRow}>
            <span style={tooltipValueLabel}>
              {yLabel.replace("→", "").trim()}:
            </span>
            <span style={tooltipValue}>{pt.y}</span>
          </div>
          <div style={tooltipValueRow}>
            <span style={tooltipValueLabel}>Size:</span>
            <span style={tooltipValue}>{pt.size}</span>
          </div>
          <div style={{ ...tooltipDivider }} />
          <div
            style={{
              ...tooltipQuadrantBadge,
              background:
                quadrantColors[
                  pt.x >= centerX && pt.y >= centerY
                    ? 0
                    : pt.x < centerX && pt.y >= centerY
                      ? 1
                      : pt.x < centerX && pt.y < centerY
                        ? 2
                        : 3
                ],
            }}
          >
            {quadrant}
          </div>
        </div>
      );
    }
    return null;
  };

  // ===== STYLES =====
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
    borderBottom: `2px solid ${chartColor}`,
    color: theme.colors.text.heading,
    fontSize: "20px",
    fontWeight: 700,
    fontFamily: theme.typography.fontFamily.primary,
    letterSpacing: "2px",
    outline: "none",
    padding: "4px 0",
    width: "250px",
  };
  const chartContainerStyle = {
    background: "#ffffff",
    borderRadius: "6px",
    padding: "24px 16px",
    border: `1px solid ${theme.colors.border.light}`,
    minHeight: "520px",
    position: "relative",
  };
  const controlsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "14px",
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
    padding: "7px 10px",
    background: theme.colors.inputBg,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: "3px",
    color: theme.colors.text.body,
    fontSize: "11px",
    fontFamily: theme.typography.fontFamily.primary,
    outline: "none",
    cursor: "pointer",
  };
  const checkboxStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
  };
  const quadrantEditorStyle = {
    background: theme.colors.cardBg,
    padding: "14px 16px",
    borderRadius: "4px",
    border: `1px solid ${theme.colors.border.default}`,
  };
  const dataTableContainerStyle = {
    background: theme.colors.cardBg,
    borderRadius: "4px",
    border: `1px solid ${theme.colors.border.default}`,
    overflow: "auto",
    maxHeight: "350px",
  };
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "10px",
  };
  const thStyle = {
    background: "#0d1117",
    color: "#8b949e",
    padding: "6px 8px",
    textAlign: "left",
    fontSize: "9px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1px",
    borderBottom: "2px solid #30363d",
    position: "sticky",
    top: 0,
    whiteSpace: "nowrap",
  };
  const tdStyle = {
    padding: "4px 6px",
    borderBottom: "1px solid #21262d",
    fontSize: "10px",
  };
  const cellInputStyle = (width = "60px") => ({
    padding: "4px 5px",
    background: theme.colors.inputBg,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: "3px",
    color: theme.colors.text.body,
    fontSize: "10px",
    fontFamily: theme.typography.fontFamily.primary,
    width: width,
    outline: "none",
    boxSizing: "border-box",
  });
  const buttonStyle = (color = chartColor) => ({
    padding: "6px 12px",
    background: "transparent",
    border: `1px solid ${color}`,
    borderRadius: "3px",
    color: color,
    cursor: "pointer",
    fontSize: "10px",
    fontFamily: theme.typography.fontFamily.primary,
    fontWeight: 600,
    letterSpacing: "1px",
    textTransform: "uppercase",
  });
  const deleteBtnStyle = {
    padding: "2px 5px",
    background: "transparent",
    border: "1px solid #f85149",
    borderRadius: "2px",
    color: "#f85149",
    cursor: "pointer",
    fontSize: "8px",
  };
  const tooltipContainerStyle = {
    background: theme.colors.cardBg,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: "4px",
    padding: "12px 14px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
    minWidth: "160px",
  };
  const tooltipColorDot = {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    display: "inline-block",
  };
  const tooltipLabelStyle = {
    color: "#f0f6fc",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1px",
  };
  const tooltipValueRow = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "3px",
  };
  const tooltipValueLabel = { color: "#8b949e", fontSize: "10px" };
  const tooltipValue = { color: "#f0f6fc", fontSize: "13px", fontWeight: 700 };
  const tooltipDivider = { borderTop: "1px solid #21262d", margin: "6px 0" };
  const tooltipQuadrantBadge = {
    textAlign: "center",
    padding: "4px 8px",
    borderRadius: "2px",
    fontSize: "9px",
    fontWeight: 700,
    letterSpacing: "1px",
    color: "#f0f6fc",
    marginTop: "4px",
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>➕</span>
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
              color: chartColor,
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${chartColor}50`,
              borderRadius: "3px",
              fontWeight: 600,
              letterSpacing: "1px",
            }}
          >
            COMPARISON
          </span>
          <span
            style={{
              color: "#8b949e",
              fontSize: "10px",
              padding: "4px 10px",
              border: "1px solid #30363d",
              borderRadius: "3px",
              letterSpacing: "1px",
            }}
          >
            {data.length} ITEMS
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        <ResponsiveContainer width="100%" height={500}>
          <ScatterChart margin={{ top: 30, right: 30, left: 10, bottom: 30 }}>
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
            )}
            <XAxis
              type="number"
              dataKey="x"
              domain={[0, 100]}
              tick={{ fill: "#8b949e", fontSize: 10 }}
              axisLine={{ stroke: "#30363d" }}
            >
              <Label
                value={xLabel}
                position="bottom"
                offset={10}
                fill="#8b949e"
                fontSize={fontSize}
                fontFamily={theme.typography.fontFamily.primary}
                fontWeight={600}
              />
            </XAxis>
            <YAxis
              type="number"
              dataKey="y"
              domain={[0, 100]}
              tick={{ fill: "#8b949e", fontSize: 10 }}
              axisLine={{ stroke: "#30363d" }}
            >
              <Label
                value={yLabel}
                angle={-90}
                position="left"
                offset={0}
                fill="#8b949e"
                fontSize={fontSize}
                fontFamily={theme.typography.fontFamily.primary}
                fontWeight={600}
              />
            </YAxis>
            <ZAxis dataKey="size" range={[20, 200]} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ strokeDasharray: "3 3" }}
            />
            {showQuadrantColors && (
              <>
                <ReferenceLine
                  x={centerX}
                  stroke="transparent"
                  strokeWidth={0}
                  ifOverflow="extendDomain"
                >
                  <Label value="" />
                </ReferenceLine>
                <ReferenceLine
                  y={centerY}
                  stroke="transparent"
                  strokeWidth={0}
                  ifOverflow="extendDomain"
                />
                <rect
                  x={centerX}
                  y={0}
                  width={100 - centerX}
                  height={centerY}
                  fill={quadrantColors[0]}
                  rx={0}
                />
                <rect
                  x={0}
                  y={0}
                  width={centerX}
                  height={centerY}
                  fill={quadrantColors[1]}
                  rx={0}
                />
                <rect
                  x={0}
                  y={centerY}
                  width={centerX}
                  height={100 - centerY}
                  fill={quadrantColors[2]}
                  rx={0}
                />
                <rect
                  x={centerX}
                  y={centerY}
                  width={100 - centerX}
                  height={100 - centerY}
                  fill={quadrantColors[3]}
                  rx={0}
                />
              </>
            )}
            {showCenterLines && (
              <>
                <ReferenceLine
                  x={centerX}
                  stroke={centerLineColor}
                  strokeWidth={centerLineWidth}
                  strokeDasharray="8 4"
                  opacity={0.6}
                />
                <ReferenceLine
                  y={centerY}
                  stroke={centerLineColor}
                  strokeWidth={centerLineWidth}
                  strokeDasharray="8 4"
                  opacity={0.6}
                />
              </>
            )}
            {showQuadrantLabels && (
              <>
                <text
                  x={centerX + (100 - centerX) / 2}
                  y={centerY / 2}
                  textAnchor="middle"
                  fill="#8b949e"
                  fontSize={10}
                  fontFamily={theme.typography.fontFamily.primary}
                  fontWeight={600}
                  opacity={0.7}
                >
                  {quadrantLabels.q1} ({quadrantCounts.q1})
                </text>
                <text
                  x={centerX / 2}
                  y={centerY / 2}
                  textAnchor="middle"
                  fill="#8b949e"
                  fontSize={10}
                  fontFamily={theme.typography.fontFamily.primary}
                  fontWeight={600}
                  opacity={0.7}
                >
                  {quadrantLabels.q2} ({quadrantCounts.q2})
                </text>
                <text
                  x={centerX / 2}
                  y={centerY + (100 - centerY) / 2}
                  textAnchor="middle"
                  fill="#8b949e"
                  fontSize={10}
                  fontFamily={theme.typography.fontFamily.primary}
                  fontWeight={600}
                  opacity={0.7}
                >
                  {quadrantLabels.q3} ({quadrantCounts.q3})
                </text>
                <text
                  x={centerX + (100 - centerX) / 2}
                  y={centerY + (100 - centerY) / 2}
                  textAnchor="middle"
                  fill="#8b949e"
                  fontSize={10}
                  fontFamily={theme.typography.fontFamily.primary}
                  fontWeight={600}
                  opacity={0.7}
                >
                  {quadrantLabels.q4} ({quadrantCounts.q4})
                </text>
              </>
            )}
            <Scatter
              data={data}
              shape={<CustomBubble />}
              isAnimationActive={animation}
              animationDuration={600}
            >
              {data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={entry.color || chartColor} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📋 Quadrant Preset</label>
          <select
            value={quadrantPreset}
            onChange={(e) => handlePresetChange(e.target.value)}
            style={selectStyle}
          >
            {QUADRANT_PRESETS.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎯 Center Mode</label>
          <select
            value={centerMode}
            onChange={(e) => setCenterMode(e.target.value)}
            style={selectStyle}
          >
            {CENTER_MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        {centerMode === "custom" && (
          <>
            <div style={controlGroupStyle}>
              <label style={labelStyle}>📍 Center X: {customCenterX}</label>
              <input
                type="range"
                min="10"
                max="90"
                value={customCenterX}
                onChange={(e) => setCustomCenterX(Number(e.target.value))}
                style={{ width: "100%", accentColor: chartColor }}
              />
            </div>
            <div style={controlGroupStyle}>
              <label style={labelStyle}>📍 Center Y: {customCenterY}</label>
              <input
                type="range"
                min="10"
                max="90"
                value={customCenterY}
                onChange={(e) => setCustomCenterY(Number(e.target.value))}
                style={{ width: "100%", accentColor: chartColor }}
              />
            </div>
          </>
        )}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>
            🫧 Bubble Scale: {bubbleScale.toFixed(1)}
          </label>
          <input
            type="range"
            min="0.3"
            max="2"
            step="0.1"
            value={bubbleScale}
            onChange={(e) => setBubbleScale(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>
            📏 Center Line Width: {centerLineWidth}px
          </label>
          <input
            type="range"
            min="0.5"
            max="4"
            step="0.5"
            value={centerLineWidth}
            onChange={(e) => setCenterLineWidth(Number(e.target.value))}
            style={{ width: "100%", accentColor: centerLineColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Center Line Color</label>
          <input
            type="color"
            value={centerLineColor}
            onChange={(e) => setCenterLineColor(e.target.value)}
            style={{
              width: "32px",
              height: "28px",
              cursor: "pointer",
              border: "1px solid #30363d",
              borderRadius: "3px",
              padding: "2px",
            }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔤 Font Size: {fontSize}px</label>
          <input
            type="range"
            min="9"
            max="16"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📍 Label Position</label>
          <select
            value={labelPosition}
            onChange={(e) => setLabelPosition(e.target.value)}
            style={selectStyle}
          >
            <option value="top">Above Bubble</option>
            <option value="center">Inside Bubble</option>
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Quadrant Colors</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showQuadrantColors}
              onChange={(e) => setShowQuadrantColors(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>
              Show fills
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🏷️ Quadrant Labels</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showQuadrantLabels}
              onChange={(e) => setShowQuadrantLabels(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>
              Show text
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Center Lines</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showCenterLines}
              onChange={(e) => setShowCenterLines(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>
              Show divider
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🏷️ Show Labels</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showLabels}
              onChange={(e) => setShowLabels(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>
              On bubbles
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔲 Grid</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>
              Show grid
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>✨ Animation</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={animation}
              onChange={(e) => setAnimation(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>Animate</span>
          </label>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          background: theme.colors.cardBg,
          padding: "12px 16px",
          borderRadius: "4px",
          border: `1px solid ${theme.colors.border.default}`,
        }}
      >
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📝 X-Axis Label</label>
          <input
            type="text"
            value={xLabel}
            onChange={(e) => setXLabel(e.target.value)}
            style={{ ...cellInputStyle("150px") }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📝 Y-Axis Label</label>
          <input
            type="text"
            value={yLabel}
            onChange={(e) => setYLabel(e.target.value)}
            style={{ ...cellInputStyle("150px") }}
          />
        </div>
      </div>

      <div style={quadrantEditorStyle}>
        <label style={labelStyle}>🏷️ Quadrant Labels</label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginTop: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: "14px",
                height: "14px",
                background: quadrantColors[0],
                borderRadius: "2px",
                display: "inline-block",
              }}
            />
            <input
              type="text"
              value={quadrantLabels.q1}
              onChange={(e) =>
                setQuadrantLabels((prev) => ({ ...prev, q1: e.target.value }))
              }
              style={{ ...cellInputStyle("140px"), fontSize: "9px" }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: "14px",
                height: "14px",
                background: quadrantColors[1],
                borderRadius: "2px",
                display: "inline-block",
              }}
            />
            <input
              type="text"
              value={quadrantLabels.q2}
              onChange={(e) =>
                setQuadrantLabels((prev) => ({ ...prev, q2: e.target.value }))
              }
              style={{ ...cellInputStyle("140px"), fontSize: "9px" }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: "14px",
                height: "14px",
                background: quadrantColors[2],
                borderRadius: "2px",
                display: "inline-block",
              }}
            />
            <input
              type="text"
              value={quadrantLabels.q3}
              onChange={(e) =>
                setQuadrantLabels((prev) => ({ ...prev, q3: e.target.value }))
              }
              style={{ ...cellInputStyle("140px"), fontSize: "9px" }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: "14px",
                height: "14px",
                background: quadrantColors[3],
                borderRadius: "2px",
                display: "inline-block",
              }}
            />
            <input
              type="text"
              value={quadrantLabels.q4}
              onChange={(e) =>
                setQuadrantLabels((prev) => ({ ...prev, q4: e.target.value }))
              }
              style={{ ...cellInputStyle("140px"), fontSize: "9px" }}
            />
          </div>
        </div>
      </div>

      <div style={quadrantEditorStyle}>
        <label style={labelStyle}>🎨 Quadrant Colors</label>
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "8px",
            flexWrap: "wrap",
          }}
        >
          {quadrantColors.map((color, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: "4px" }}
            >
              <input
                type="color"
                value={
                  color.replace(/[^#0-9a-fA-F]/g, "").substring(0, 7) ||
                  "#58a6ff"
                }
                onChange={(e) => {
                  const updated = [...quadrantColors];
                  updated[i] = e.target.value + "15";
                  setQuadrantColors(updated);
                }}
                style={{
                  width: "28px",
                  height: "28px",
                  cursor: "pointer",
                  border: "none",
                  borderRadius: "3px",
                  padding: "2px",
                }}
              />
              <span style={{ color: "#8b949e", fontSize: "9px" }}>
                {["Q1", "Q2", "Q3", "Q4"][i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <label style={labelStyle}>📋 Data Points</label>
          <button onClick={addPoint} style={buttonStyle()}>
            + Add Point
          </button>
        </div>
        <div id="chart-data-table" style={dataTableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>#</th>
                <th style={thStyle}>Label</th>
                <th style={thStyle}>X ({xLabel.replace("→", "").trim()})</th>
                <th style={thStyle}>Y ({yLabel.replace("→", "").trim()})</th>
                <th style={thStyle}>Size</th>
                <th style={thStyle}>Quadrant</th>
                <th style={thStyle}>Color</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                const quadrant =
                  item.x >= centerX && item.y >= centerY
                    ? "Q1"
                    : item.x < centerX && item.y >= centerY
                      ? "Q2"
                      : item.x < centerX && item.y < centerY
                        ? "Q3"
                        : "Q4";
                const qColor =
                  quadrantColors[["Q1", "Q2", "Q3", "Q4"].indexOf(quadrant)];
                return (
                  <tr key={index}>
                    <td style={{ ...tdStyle, color: "#484f58" }}>
                      {index + 1}
                    </td>
                    <td style={tdStyle}>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) =>
                          handleDataChange(index, "label", e.target.value)
                        }
                        style={cellInputStyle("90px")}
                      />
                    </td>
                    <td style={tdStyle}>
                      <input
                        type="number"
                        value={item.x}
                        onChange={(e) =>
                          handleDataChange(index, "x", e.target.value)
                        }
                        style={cellInputStyle("50px")}
                        min="0"
                        max="100"
                      />
                    </td>
                    <td style={tdStyle}>
                      <input
                        type="number"
                        value={item.y}
                        onChange={(e) =>
                          handleDataChange(index, "y", e.target.value)
                        }
                        style={cellInputStyle("50px")}
                        min="0"
                        max="100"
                      />
                    </td>
                    <td style={tdStyle}>
                      <input
                        type="number"
                        value={item.size}
                        onChange={(e) =>
                          handleDataChange(index, "size", e.target.value)
                        }
                        style={cellInputStyle("55px")}
                        min="1"
                      />
                    </td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          padding: "2px 6px",
                          borderRadius: "2px",
                          fontSize: "8px",
                          fontWeight: 700,
                          letterSpacing: "1px",
                          background: qColor || "#30363d",
                          color: "#f0f6fc",
                        }}
                      >
                        {quadrant}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <input
                        type="color"
                        value={item.color}
                        onChange={(e) =>
                          handleDataChange(index, "color", e.target.value)
                        }
                        style={{
                          width: "22px",
                          height: "22px",
                          cursor: "pointer",
                          border: "none",
                          borderRadius: "2px",
                        }}
                      />
                    </td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => removePoint(index)}
                        style={deleteBtnStyle}
                        disabled={data.length <= 3}
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "8px",
        }}
      >
        {[
          {
            label: quadrantLabels.q1,
            count: quadrantCounts.q1,
            color: quadrantColors[0],
          },
          {
            label: quadrantLabels.q2,
            count: quadrantCounts.q2,
            color: quadrantColors[1],
          },
          {
            label: quadrantLabels.q3,
            count: quadrantCounts.q3,
            color: quadrantColors[2],
          },
          {
            label: quadrantLabels.q4,
            count: quadrantCounts.q4,
            color: quadrantColors[3],
          },
        ].map((q, i) => (
          <div
            key={i}
            style={{
              padding: "10px 12px",
              background: theme.colors.cardBg,
              borderRadius: "4px",
              border: `1px solid ${theme.colors.border.default}`,
              borderLeft: `3px solid ${q.color.replace("15", "")}`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: "#8b949e",
                fontSize: "8px",
                fontWeight: 700,
                letterSpacing: "1px",
                marginBottom: "4px",
              }}
            >
              {q.label.length > 20 ? q.label.substring(0, 18) + "…" : q.label}
            </div>
            <div
              style={{ color: "#f0f6fc", fontSize: "18px", fontWeight: 700 }}
            >
              {q.count}
            </div>
            <div style={{ color: "#8b949e", fontSize: "8px" }}>items</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuadrantChartComponent;

