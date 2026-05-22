import React, { useState, useCallback, useMemo } from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
  Line,
  Legend,
} from "recharts";
import { theme } from "../../../styles/theme";

// ============================================
// DEFAULT DATA
// ============================================
const DEFAULT_DATA = [
  { label: "Start", value: 1000 },
  { label: "Sales", value: 500 },
  { label: "Refunds", value: -200 },
  { label: "Marketing", value: -150 },
  { label: "Upsells", value: 300 },
  { label: "Discounts", value: -100 },
  { label: "Referrals", value: 250 },
  { label: "Chargebacks", value: -80 },
  { label: "Bonuses", value: 400 },
  { label: "Tax", value: -220 },
];

const COLOR_PRESETS = [
  {
    name: "Default",
    increase: "#3fb950",
    decrease: "#f85149",
    total: "#58a6ff",
    start: "#8b949e",
  },
  {
    name: "Corporate",
    increase: "#238636",
    decrease: "#da3633",
    total: "#1f6feb",
    start: "#484f58",
  },
  {
    name: "Vibrant",
    increase: "#56d364",
    decrease: "#ff7b72",
    total: "#79c0ff",
    start: "#c9d1d9",
  },
  {
    name: "Mono",
    increase: "#c9d1d9",
    decrease: "#484f58",
    total: "#8b949e",
    start: "#30363d",
  },
];

const WaterfallChartComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#58a6ff",
}) => {
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Waterfall Chart");
  const [increaseColor, setIncreaseColor] = useState("#3fb950");
  const [decreaseColor, setDecreaseColor] = useState("#f85149");
  const [totalColor, setTotalColor] = useState("#58a6ff");
  const [startColor, setStartColor] = useState("#8b949e");
  const [showConnectors, setShowConnectors] = useState(true);
  const [connectorColor, setConnectorColor] = useState("#8b949e");
  const [connectorWidth, setConnectorWidth] = useState(1.5);
  const [showValues, setShowValues] = useState(true);
  const [valuePosition, setValuePosition] = useState("top");
  const [showSubtotals, setShowSubtotals] = useState(true);
  const [gridVisible, setGridVisible] = useState(true);
  const [barGap, setBarGap] = useState(4);
  const [animation, setAnimation] = useState(true);
  const [lastIsTotal, setLastIsTotal] = useState(true);

  const waterfallData = useMemo(() => {
    let runningTotal = 0;
    const result = [];
    data.forEach((item, index) => {
      const isStart = index === 0;
      const isLast = lastIsTotal && index === data.length - 1;
      const isIncrease = item.value >= 0 && !isStart && !isLast;
      const isDecrease = item.value < 0 && !isStart && !isLast;
      const base = isStart ? 0 : isLast ? 0 : runningTotal;
      const height = isLast ? runningTotal : Math.abs(item.value);
      const y = isIncrease ? base + item.value : base;
      if (!isLast) runningTotal += item.value;
      result.push({
        ...item,
        isStart,
        isLast,
        isIncrease,
        isDecrease,
        base,
        height,
        y,
        runningTotal: isLast ? item.value : runningTotal,
        absValue: Math.abs(item.value),
        displayValue: isLast ? runningTotal : item.value,
      });
    });
    return result;
  }, [data, lastIsTotal]);

  const connectorData = useMemo(() => {
    if (!showConnectors) return [];
    const lines = [];
    for (let i = 1; i < waterfallData.length; i++) {
      const prev = waterfallData[i - 1];
      const curr = waterfallData[i];
      if (!curr.isLast && !curr.isStart)
        lines.push({
          x1: i - 0.5,
          y1: prev.runningTotal,
          x2: i + 0.5,
          y2: prev.runningTotal,
        });
    }
    return lines;
  }, [waterfallData, showConnectors]);

  const getBarColor = (item) => {
    if (item.isStart) return startColor;
    if (item.isLast) return totalColor;
    if (item.isIncrease) return increaseColor;
    if (item.isDecrease) return decreaseColor;
    return chartColor;
  };

  const getLabelColor = (item) => {
    if (item.isStart) return startColor;
    if (item.isLast) return totalColor;
    if (item.isIncrease) return increaseColor;
    if (item.isDecrease) return decreaseColor;
    return "#8b949e";
  };

  const handleDataChange = useCallback((index, field, newValue) => {
    setData((prev) => {
      const updated = [...prev];
      if (field === "value")
        updated[index] = { ...updated[index], value: Number(newValue) || 0 };
      else updated[index] = { ...updated[index], [field]: newValue };
      return updated;
    });
  }, []);

  const addItem = useCallback(() => {
    const insertIndex = data.length - (lastIsTotal ? 1 : 0);
    setData((prev) => {
      const newItem = {
        label: `Item ${prev.length}`,
        value: Math.floor(Math.random() * 300) - 150,
      };
      const updated = [...prev];
      updated.splice(insertIndex, 0, newItem);
      return updated;
    });
  }, [data, lastIsTotal]);

  const removeItem = useCallback((index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  }, []);
  const handlePresetChange = (presetName) => {
    const preset = COLOR_PRESETS.find((p) => p.name === presetName);
    if (preset) {
      setIncreaseColor(preset.increase);
      setDecreaseColor(preset.decrease);
      setTotalColor(preset.total);
      setStartColor(preset.start);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = waterfallData.find((d) => d.label === label);
      if (!item) return null;
      return (
        <div style={tooltipContainerStyle}>
          <p style={tooltipLabelStyle}>{label}</p>
          <div style={tooltipValueRow}>
            <span style={tooltipValueLabel}>Value:</span>
            <span
              style={{
                ...tooltipValue,
                color: item.value >= 0 ? increaseColor : decreaseColor,
              }}
            >
              {item.value > 0 ? "+" : ""}
              {item.value}
            </span>
          </div>
          {!item.isStart && !item.isLast && (
            <div style={tooltipValueRow}>
              <span style={tooltipValueLabel}>Running Total:</span>
              <span style={tooltipStat}>{item.runningTotal}</span>
            </div>
          )}
          {item.isStart && (
            <div style={tooltipValueRow}>
              <span style={tooltipValueLabel}>Starting Value</span>
            </div>
          )}
          {item.isLast && (
            <div style={tooltipValueRow}>
              <span style={tooltipValueLabel}>Final Total</span>
            </div>
          )}
          <div style={tooltipValueRow}>
            <span style={tooltipValueLabel}>Bar Height:</span>
            <span style={tooltipStat}>{item.height}</span>
          </div>
          <div style={tooltipValueRow}>
            <span style={tooltipValueLabel}>Contribution:</span>
            <span
              style={{
                ...tooltipStat,
                color: item.value >= 0 ? increaseColor : decreaseColor,
              }}
            >
              {item.isStart
                ? "Base"
                : item.isLast
                  ? "Total"
                  : item.value > 0
                    ? "Increase"
                    : "Decrease"}
            </span>
          </div>
          <div style={tooltipBarContainer}>
            <div
              style={{
                display: "flex",
                height: "8px",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${Math.max(0, (item.base / (item.base + item.height)) * 100)}%`,
                  background: "transparent",
                }}
              />
              <div style={{ flex: 1, background: getBarColor(item) }} />
            </div>
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
    minHeight: "450px",
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
  const legendBarStyle = {
    background: theme.colors.cardBg,
    padding: "12px 16px",
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
  const cellInputStyle = (width = "65px") => ({
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
    minWidth: "170px",
  };
  const tooltipLabelStyle = {
    color: theme.colors.text.heading,
    fontSize: "12px",
    fontWeight: 700,
    margin: "0 0 8px 0",
    textTransform: "uppercase",
    letterSpacing: "1px",
    borderBottom: `1px solid ${theme.colors.border.light}`,
    paddingBottom: "6px",
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
  const tooltipValue = { fontSize: "14px", fontWeight: 700 };
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

  // ============================================
  // RENDER
  // ============================================
  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>🌊</span>
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
              color: increaseColor,
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${increaseColor}50`,
              borderRadius: "3px",
              fontWeight: 600,
              letterSpacing: "1px",
            }}
          >
            ↑
          </span>
          <span
            style={{
              color: decreaseColor,
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${decreaseColor}50`,
              borderRadius: "3px",
              fontWeight: 600,
              letterSpacing: "1px",
            }}
          >
            ↓
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
            {data.length} STEPS
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        <ResponsiveContainer width="100%" height={420}>
          <ComposedChart
            data={waterfallData}
            barCategoryGap={barGap}
            margin={{ top: 30, right: 20, left: 20, bottom: 20 }}
          >
            {gridVisible && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme.colors.border.light}
                vertical={false}
              />
            )}
            <XAxis
              dataKey="label"
              tick={{ fill: "#8b949e", fontSize: 10 }}
              axisLine={{ stroke: "#30363d" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#8b949e", fontSize: 10 }}
              axisLine={{ stroke: "#30363d" }}
              tickLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(88, 166, 255, 0.06)" }}
            />
            <Bar
              dataKey="base"
              stackId="stack"
              fill="transparent"
              isAnimationActive={false}
            />
            <Bar
              dataKey="height"
              stackId="stack"
              radius={[3, 3, 0, 0]}
              isAnimationActive={animation}
              animationDuration={600}
            >
              {waterfallData.map((item, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(item)}
                  style={{
                    cursor: "pointer",
                    transition: "opacity 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = "0.85";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = "1";
                  }}
                />
              ))}
              {showValues && (
                <LabelList
                  dataKey="displayValue"
                  position={valuePosition}
                  formatter={(value, entry) => {
                    if (!entry?.payload) return value;
                    const item = waterfallData.find(
                      (d) => d.label === entry.payload.label,
                    );
                    const prefix = item?.isIncrease
                      ? "+"
                      : item?.isDecrease
                        ? ""
                        : "";
                    return `${prefix}${value}`;
                  }}
                  style={{
                    fill: (entry) => {
                      const item = waterfallData.find(
                        (d) => d.label === entry?.payload?.label,
                      );
                      return item ? getLabelColor(item) : "#f0f6fc";
                    },
                    fontSize: "10px",
                    fontWeight: 700,
                    fontFamily: theme.typography.fontFamily.primary,
                  }}
                />
              )}
            </Bar>
            {showConnectors &&
              connectorData.map((line, i) => (
                <Line
                  key={`connector-${i}`}
                  data={[
                    { x: line.x1, y: line.y1 },
                    { x: line.x2, y: line.y2 },
                  ]}
                  dataKey="y"
                  stroke={connectorColor}
                  strokeWidth={connectorWidth}
                  strokeDasharray="4 3"
                  dot={false}
                  isAnimationActive={false}
                />
              ))}
            {/* Legend Component */}
            <Legend
              payload={[
                { value: "Start", type: "square", color: startColor },
                { value: "Increase", type: "square", color: increaseColor },
                { value: "Decrease", type: "square", color: decreaseColor },
                { value: "Total", type: "square", color: totalColor },
              ]}
              wrapperStyle={{
                fontSize: "10px",
                fontFamily: theme.typography.fontFamily.primary,
                color: "#8b949e",
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
        {/* Subtotals Display */}
        {showSubtotals && (
          <div style={legendBarStyle}>
            <div
              style={{
                display: "flex",
                gap: "24px",
                justifyContent: "center",
                fontSize: "10px",
                flexWrap: "wrap",
              }}
            >
              {waterfallData
                .filter((item) => !item.isStart && !item.isLast)
                .map((item, i) => (
                  <span
                    key={i}
                    style={{
                      color: item.isIncrease ? increaseColor : decreaseColor,
                    }}
                  >
                    {item.label}: <strong>{item.runningTotal}</strong>
                  </span>
                ))}
            </div>
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            marginTop: "12px",
            fontSize: "10px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: "12px",
                height: "12px",
                background: startColor,
                borderRadius: "2px",
                display: "inline-block",
              }}
            />
            <span style={{ color: "#8b949e" }}>Start</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: "12px",
                height: "12px",
                background: increaseColor,
                borderRadius: "2px",
                display: "inline-block",
              }}
            />
            <span style={{ color: "#8b949e" }}>Increase</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: "12px",
                height: "12px",
                background: decreaseColor,
                borderRadius: "2px",
                display: "inline-block",
              }}
            />
            <span style={{ color: "#8b949e" }}>Decrease</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: "12px",
                height: "12px",
                background: totalColor,
                borderRadius: "2px",
                display: "inline-block",
              }}
            />
            <span style={{ color: "#8b949e" }}>Total</span>
          </div>
        </div>
      </div>

      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Color Preset</label>
          <select
            onChange={(e) => handlePresetChange(e.target.value)}
            style={selectStyle}
          >
            {COLOR_PRESETS.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🟢 Increase Color</label>
          <input
            type="color"
            value={increaseColor}
            onChange={(e) => setIncreaseColor(e.target.value)}
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
          <label style={labelStyle}>🔴 Decrease Color</label>
          <input
            type="color"
            value={decreaseColor}
            onChange={(e) => setDecreaseColor(e.target.value)}
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
          <label style={labelStyle}>🔵 Total Color</label>
          <input
            type="color"
            value={totalColor}
            onChange={(e) => setTotalColor(e.target.value)}
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
          <label style={labelStyle}>⚪ Start Color</label>
          <input
            type="color"
            value={startColor}
            onChange={(e) => setStartColor(e.target.value)}
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
          <label style={labelStyle}>〰️ Connector Color</label>
          <input
            type="color"
            value={connectorColor}
            onChange={(e) => setConnectorColor(e.target.value)}
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
          <label style={labelStyle}>
            📏 Connector Width: {connectorWidth}px
          </label>
          <input
            type="range"
            min="0.5"
            max="4"
            step="0.5"
            value={connectorWidth}
            onChange={(e) => setConnectorWidth(Number(e.target.value))}
            style={{ width: "100%", accentColor: connectorColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📊 Bar Gap: {barGap}px</label>
          <input
            type="range"
            min="0"
            max="16"
            value={barGap}
            onChange={(e) => setBarGap(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>💬 Value Position</label>
          <select
            value={valuePosition}
            onChange={(e) => setValuePosition(e.target.value)}
            style={selectStyle}
          >
            <option value="top">Top</option>
            <option value="inside">Inside</option>
            <option value="center">Center</option>
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>〰️ Connectors</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showConnectors}
              onChange={(e) => setShowConnectors(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Show lines
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔢 Show Values</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showValues}
              onChange={(e) => setShowValues(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              On bars
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📊 Show Subtotals</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showSubtotals}
              onChange={(e) => setShowSubtotals(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Running totals
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔲 Grid</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={gridVisible}
              onChange={(e) => setGridVisible(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Show grid
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📊 Last is Total</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={lastIsTotal}
              onChange={(e) => setLastIsTotal(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Final bar
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
              Animate
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
            marginBottom: "10px",
          }}
        >
          <label style={labelStyle}>📋 Data Table</label>
          <button onClick={addItem} style={buttonStyle()}>
            + Add Step
          </button>
        </div>
        <div id="chart-data-table" style={dataTableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>#</th>
                <th style={thStyle}>Label</th>
                <th style={thStyle}>Value</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Running Total</th>
                <th style={thStyle}>Bar Color</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {waterfallData.map((item, index) => (
                <tr key={index}>
                  <td style={{ ...tdStyle, color: "#484f58" }}>{index + 1}</td>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) =>
                        handleDataChange(index, "label", e.target.value)
                      }
                      style={cellInputStyle("80px")}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="number"
                      value={item.value}
                      onChange={(e) =>
                        handleDataChange(index, "value", e.target.value)
                      }
                      style={cellInputStyle("65px")}
                    />
                  </td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        padding: "1px 6px",
                        borderRadius: "2px",
                        fontSize: "8px",
                        fontWeight: 700,
                        letterSpacing: "1px",
                        background: item.isStart
                          ? startColor + "20"
                          : item.isLast
                            ? totalColor + "20"
                            : item.isIncrease
                              ? increaseColor + "20"
                              : decreaseColor + "20",
                        color: item.isStart
                          ? startColor
                          : item.isLast
                            ? totalColor
                            : item.isIncrease
                              ? increaseColor
                              : decreaseColor,
                      }}
                    >
                      {item.isStart
                        ? "START"
                        : item.isLast
                          ? "TOTAL"
                          : item.isIncrease
                            ? "↑ INC"
                            : "↓ DEC"}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, color: "#f0f6fc", fontWeight: 700 }}>
                    {item.isLast
                      ? waterfallData[waterfallData.length - 2]?.runningTotal ||
                        0
                      : item.runningTotal}
                  </td>
                  <td style={tdStyle}>
                    <div
                      style={{
                        width: "20px",
                        height: "14px",
                        background: getBarColor(item),
                        borderRadius: "2px",
                        border: "1px solid #30363d",
                      }}
                    />
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => removeItem(index)}
                      style={deleteBtnStyle}
                      disabled={data.length <= 2}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          padding: "10px 14px",
          background: theme.colors.cardBg,
          borderRadius: "4px",
          border: `1px solid ${theme.colors.border.default}`,
          fontSize: "10px",
        }}
      >
        <span style={{ color: "#8b949e" }}>
          Start:{" "}
          <strong style={{ color: startColor }}>{data[0]?.value || 0}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Total Increases:{" "}
          <strong style={{ color: increaseColor }}>
            +
            {data
              .filter(
                (d) =>
                  d.value > 0 &&
                  data.indexOf(d) > 0 &&
                  !(lastIsTotal && data.indexOf(d) === data.length - 1),
              )
              .reduce((s, d) => s + d.value, 0)}
          </strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Total Decreases:{" "}
          <strong style={{ color: decreaseColor }}>
            {data.filter((d) => d.value < 0).reduce((s, d) => s + d.value, 0)}
          </strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Final:{" "}
          <strong style={{ color: totalColor }}>
            {waterfallData[waterfallData.length - 1]?.runningTotal || 0}
          </strong>
        </span>
      </div>
    </div>
  );
};

export default WaterfallChartComponent;

