import React, { useState, useCallback, useMemo } from "react";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
  Cell,
} from "recharts";
import { theme } from "../../../styles/theme";

// ============================================
// DEFAULT DATA
// ============================================
const DEFAULT_DATA = [
  { label: "Speed", value: 75, max: 100, color: "#58a6ff" },
  { label: "Power", value: 60, max: 100, color: "#3fb950" },
  { label: "Accuracy", value: 85, max: 100, color: "#d29922" },
  { label: "Defense", value: 45, max: 100, color: "#f85149" },
  { label: "Stamina", value: 70, max: 100, color: "#a371f7" },
  { label: "Agility", value: 55, max: 100, color: "#79c0ff" },
];

const ARC_STYLES = [
  { name: "Solid", value: "solid" },
  { name: "Gradient", value: "gradient" },
  { name: "Rounded", value: "rounded" },
];

const CENTER_MODES = [
  { name: "First Value", value: "first" },
  { name: "Average", value: "average" },
  { name: "Total", value: "total" },
  { name: "Max", value: "max" },
  { name: "Custom Text", value: "custom" },
  { name: "None", value: "none" },
];

const RadialBarChartComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#58a6ff",
}) => {
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Radial Bar Chart");
  const [arcWidth, setArcWidth] = useState(20);
  const [innerRadius, setInnerRadius] = useState(30);
  const [outerRadius, setOuterRadius] = useState(80);
  const [startAngle, setStartAngle] = useState(180);
  const [endAngle, setEndAngle] = useState(0);
  const [bgArcColor, setBgArcColor] = useState("#21262d");
  const [bgArcOpacity, setBgArcOpacity] = useState(0.3);
  const [arcStyle, setArcStyle] = useState("solid");
  const [cornerRadius, setCornerRadius] = useState(0);
  const [centerMode, setCenterMode] = useState("average");
  const [customCenterText, setCustomCenterText] = useState("Stats");
  const [showLabels, setShowLabels] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [showValues, setShowValues] = useState(true);
  const [clockWise, setClockWise] = useState(true);
  const [animation, setAnimation] = useState(true);
  const [gapBetweenBars, setGapBetweenBars] = useState(4);

  const centerValue = useMemo(() => {
    if (centerMode === "first" && data.length > 0) return data[0].value;
    if (centerMode === "average")
      return (data.reduce((s, d) => s + d.value, 0) / data.length).toFixed(0);
    if (centerMode === "total") return data.reduce((s, d) => s + d.value, 0);
    if (centerMode === "max") return Math.max(...data.map((d) => d.value));
    if (centerMode === "custom") return customCenterText;
    return null;
  }, [data, centerMode, customCenterText]);
  const centerSubtext = useMemo(() => {
    if (centerMode === "first" && data.length > 0) return data[0].label;
    if (centerMode === "average") return "Average";
    if (centerMode === "total") return "Total";
    if (centerMode === "max") return "Maximum";
    return "";
  }, [centerMode, data]);

  const handleDataChange = useCallback((index, field, newValue) => {
    setData((prev) => {
      const updated = [...prev];
      if (field === "value" || field === "max")
        updated[index] = { ...updated[index], [field]: Number(newValue) || 0 };
      else updated[index] = { ...updated[index], [field]: newValue };
      return updated;
    });
  }, []);
  const addItem = useCallback(() => {
    setData((prev) => [
      ...prev,
      {
        label: `Item ${prev.length + 1}`,
        value: Math.floor(Math.random() * 80) + 20,
        max: 100,
        color: theme.colors.charts[prev.length % theme.colors.charts.length],
      },
    ]);
  }, []);
  const removeItem = useCallback((index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percent = ((item.value / item.max) * 100).toFixed(1);
      const remaining = item.max - item.value;
      return (
        <div style={tooltipContainerStyle}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "6px",
            }}
          >
            <span style={{ ...tooltipColorDot, background: item.color }} />
            <span style={tooltipLabelStyle}>{item.label}</span>
          </div>
          <div style={tooltipValueRow}>
            <span style={tooltipValueLabel}>Value:</span>
            <span style={{ ...tooltipValue, color: item.color }}>
              {item.value}
            </span>
          </div>
          <div style={tooltipValueRow}>
            <span style={tooltipValueLabel}>Max:</span>
            <span style={tooltipStat}>{item.max}</span>
          </div>
          <div style={tooltipValueRow}>
            <span style={tooltipValueLabel}>Progress:</span>
            <span style={{ ...tooltipStat, color: item.color }}>
              {percent}%
            </span>
          </div>
          <div style={tooltipValueRow}>
            <span style={tooltipValueLabel}>Remaining:</span>
            <span style={tooltipStat}>{remaining}</span>
          </div>
          <div style={tooltipBarContainer}>
            <div
              style={{
                ...tooltipBarFill,
                width: `${percent}%`,
                background: item.color,
              }}
            />
          </div>
        </div>
      );
    }
    return null;
  };

  const customLabel = (props) => {
    if (!props?.payload || !showValues) return null;
    const { cx, cy, midAngle, innerRadius, outerRadius, index, payload } =
      props;
    // USE index for angle offset variation
    const angleOffset = (index || 0) * 2;
    const radius = innerRadius + (outerRadius - innerRadius) / 2 + 15;
    const angle = (midAngle + angleOffset) * (Math.PI / 180);
    const x = cx + radius * Math.cos(-angle + Math.PI / 2);
    const y = cy + radius * Math.sin(-angle + Math.PI / 2);
    return (
      <text
        x={x}
        y={y}
        fill={theme.colors.mainBg}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="9"
        fontWeight="700"
        fontFamily={theme.typography.fontFamily.primary}
      >
        {payload?.value || ""}
      </text>
    );
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
    width: "280px",
  };
  const chartContainerStyle = {
    background: "#ffffff",
    borderRadius: "6px",
    padding: "24px",
    border: `1px solid ${theme.colors.border.light}`,
    minHeight: "500px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  const centerLabelContainerStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    pointerEvents: "none",
    zIndex: 5,
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
  const itemCardStyle = (color) => ({
    background: theme.colors.cardBg,
    borderRadius: "4px",
    border: `1px solid ${theme.colors.border.default}`,
    borderLeft: `3px solid ${color}`,
    padding: "10px 14px",
    marginBottom: "8px",
  });
  const cellInputStyle = (width = "65px") => ({
    padding: "5px 6px",
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
    padding: "7px 14px",
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
  const tooltipContainerStyle = {
    background: theme.colors.cardBg,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: "4px",
    padding: "12px 14px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
    minWidth: "160px",
  };
  const tooltipColorDot = {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    display: "inline-block",
  };
  const tooltipLabelStyle = {
    color: theme.colors.text.heading,
    fontSize: "12px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1px",
  };
  const tooltipValueRow = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "3px",
  };
  const tooltipValueLabel = {
    color: theme.colors.text.muted,
    fontSize: "10px",
  };
  const tooltipValue = { fontSize: "15px", fontWeight: 700 };
  const tooltipStat = {
    color: theme.colors.text.heading,
    fontSize: "11px",
    fontWeight: 600,
  };
  const tooltipBarContainer = {
    marginTop: "6px",
    height: "4px",
    background: theme.colors.border.light,
    borderRadius: "2px",
    overflow: "hidden",
  };
  const tooltipBarFill = {
    height: "100%",
    borderRadius: "2px",
    transition: "width 0.3s ease",
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>📊</span>
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
              color: theme.colors.text.muted,
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: "3px",
              letterSpacing: "1px",
            }}
          >
            {data.length} ITEMS
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        <ResponsiveContainer width="100%" height={480}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius={`${innerRadius}%`}
            outerRadius={`${outerRadius}%`}
            barSize={arcWidth - gapBetweenBars}
            data={data}
            startAngle={startAngle}
            endAngle={endAngle}
            clockWise={clockWise}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && (
              <Legend
                iconSize={8}
                iconType="circle"
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{
                  fontSize: "10px",
                  fontFamily: theme.typography.fontFamily.primary,
                  color: theme.colors.mainBg,
                }}
              />
            )}
            <RadialBar
              dataKey="max"
              fill={bgArcColor}
              fillOpacity={bgArcOpacity}
              cornerRadius={0}
              isAnimationActive={false}
            />
            <RadialBar
              dataKey="value"
              cornerRadius={arcStyle === "rounded" ? cornerRadius : 0}
              label={showLabels ? customLabel : null}
              isAnimationActive={animation}
              animationDuration={1000}
              animationBegin={0}
            >
              {data.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={entry.color}
                  style={{
                    filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.2))",
                    transition: "opacity 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = "0.8";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = "1";
                  }}
                />
              ))}
            </RadialBar>
          </RadialBarChart>
        </ResponsiveContainer>
        {centerMode !== "none" && (
          <div style={centerLabelContainerStyle}>
            <div
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: theme.colors.mainBg,
                lineHeight: 1,
              }}
            >
              {centerValue}
            </div>
            {centerSubtext && (
              <div
                style={{
                  fontSize: "9px",
                  color: theme.colors.text.muted,
                  fontWeight: 600,
                  letterSpacing: "1px",
                  marginTop: "2px",
                }}
              >
                {centerSubtext}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Arc Style</label>
          <select
            value={arcStyle}
            onChange={(e) => setArcStyle(e.target.value)}
            style={selectStyle}
          >
            {ARC_STYLES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.name}
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
          <div style={controlGroupStyle}>
            <label style={labelStyle}>✏️ Center Text</label>
            <input
              type="text"
              value={customCenterText}
              onChange={(e) => setCustomCenterText(e.target.value)}
              style={{ ...cellInputStyle("120px"), fontSize: "12px" }}
            />
          </div>
        )}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Arc Width: {arcWidth}px</label>
          <input
            type="range"
            min="5"
            max="40"
            value={arcWidth}
            onChange={(e) => setArcWidth(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>↔️ Bar Gap: {gapBetweenBars}px</label>
          <input
            type="range"
            min="0"
            max="10"
            value={gapBetweenBars}
            onChange={(e) => setGapBetweenBars(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔵 Inner Radius: {innerRadius}%</label>
          <input
            type="range"
            min="0"
            max="70"
            value={innerRadius}
            onChange={(e) => setInnerRadius(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🟣 Outer Radius: {outerRadius}%</label>
          <input
            type="range"
            min="50"
            max="100"
            value={outerRadius}
            onChange={(e) => setOuterRadius(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔄 Start Angle: {startAngle}°</label>
          <input
            type="range"
            min="0"
            max="360"
            value={startAngle}
            onChange={(e) => setStartAngle(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔁 End Angle: {endAngle}°</label>
          <input
            type="range"
            min="0"
            max="360"
            value={endAngle}
            onChange={(e) => setEndAngle(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        {arcStyle === "rounded" && (
          <div style={controlGroupStyle}>
            <label style={labelStyle}>🔲 Corner: {cornerRadius}px</label>
            <input
              type="range"
              min="0"
              max="20"
              value={cornerRadius}
              onChange={(e) => setCornerRadius(Number(e.target.value))}
              style={{ width: "100%", accentColor: chartColor }}
            />
          </div>
        )}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 BG Arc Color</label>
          <input
            type="color"
            value={bgArcColor}
            onChange={(e) => setBgArcColor(e.target.value)}
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
          <label style={labelStyle}>👁️ BG Opacity: {bgArcOpacity}</label>
          <input
            type="range"
            min="0"
            max="0.8"
            step="0.05"
            value={bgArcOpacity}
            onChange={(e) => setBgArcOpacity(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🏷️ Show Labels</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showLabels}
              onChange={(e) => setShowLabels(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Arc labels
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>💬 Show Values</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showValues}
              onChange={(e) => setShowValues(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              On arcs
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📋 Show Legend</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showLegend}
              onChange={(e) => setShowLegend(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Right side
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
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Animate arcs
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>↩️ Clockwise</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={clockWise}
              onChange={(e) => setClockWise(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Direction
            </span>
          </label>
        </div>
      </div>

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <label style={labelStyle}>📋 Data Items</label>
          <button onClick={addItem} style={buttonStyle()}>
            + Add Item
          </button>
        </div>
        {data.map((item, index) => (
          <div key={index} style={itemCardStyle(item.color)}>
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <input
                type="color"
                value={item.color}
                onChange={(e) =>
                  handleDataChange(index, "color", e.target.value)
                }
                style={{
                  width: "28px",
                  height: "28px",
                  cursor: "pointer",
                  border: "none",
                  borderRadius: "3px",
                  padding: "2px",
                }}
              />
              <input
                type="text"
                value={item.label}
                onChange={(e) =>
                  handleDataChange(index, "label", e.target.value)
                }
                style={cellInputStyle("90px")}
                placeholder="Label"
              />
              <span style={{ color: theme.colors.text.muted, fontSize: "9px" }}>
                Value:
              </span>
              <input
                type="number"
                value={item.value}
                onChange={(e) =>
                  handleDataChange(index, "value", e.target.value)
                }
                style={cellInputStyle("55px")}
                min="0"
              />
              <span style={{ color: theme.colors.text.muted, fontSize: "9px" }}>
                Max:
              </span>
              <input
                type="number"
                value={item.max}
                onChange={(e) => handleDataChange(index, "max", e.target.value)}
                style={cellInputStyle("55px")}
                min="1"
              />
              <span style={{ color: theme.colors.text.muted, fontSize: "9px" }}>
                ({((item.value / item.max) * 100).toFixed(0)}%)
              </span>
              <button
                onClick={() => removeItem(index)}
                style={{
                  padding: "3px 8px",
                  background: "transparent",
                  border: "1px solid #f85149",
                  borderRadius: "3px",
                  color: "#f85149",
                  cursor: "pointer",
                  fontSize: "10px",
                  marginLeft: "auto",
                }}
                disabled={data.length <= 1}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadialBarChartComponent;


