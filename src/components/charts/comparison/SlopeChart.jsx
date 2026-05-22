import React, { useState, useCallback, useMemo } from "react";
import { theme } from "../../../styles/theme";

const DEFAULT_DATA = [
  { label: "Revenue", before: 30, after: 70 },
  { label: "Profit", before: 45, after: 85 },
  { label: "Customers", before: 55, after: 90 },
  { label: "Satisfaction", before: 60, after: 75 },
  { label: "Productivity", before: 40, after: 80 },
  { label: "Retention", before: 50, after: 65 },
  { label: "Growth", before: 25, after: 70 },
  { label: "Market Share", before: 20, after: 35 },
  { label: "Efficiency", before: 70, after: 45 },
  { label: "Cost", before: 80, after: 40 },
  { label: "Churn", before: 65, after: 30 },
  { label: "Errors", before: 55, after: 20 },
];

const LABEL_POSITIONS = [
  { name: "Both Sides", value: "both" },
  { name: "Left Only", value: "left" },
  { name: "Right Only", value: "right" },
];
const LINE_STYLES = [
  { name: "Solid", value: "solid" },
  { name: "Dashed", value: "dashed" },
  { name: "Dotted", value: "dotted" },
];

const SlopeChartComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#58a6ff",
}) => {
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Slope Chart");
  const [increaseColor, setIncreaseColor] = useState("#3fb950");
  const [decreaseColor, setDecreaseColor] = useState("#f85149");
  const [noChangeColor, setNoChangeColor] = useState("#8b949e");
  const [lineWidth, setLineWidth] = useState(2.5);
  const [lineStyle, setLineStyle] = useState("solid");
  const [labelPosition, setLabelPosition] = useState("both");
  const [showValues, setShowValues] = useState(true);
  const [showChangePercent, setShowChangePercent] = useState(true);
  const [showDots, setShowDots] = useState(true);
  const [dotSize, setDotSize] = useState(6);
  const [highlightLargest, setHighlightLargest] = useState(true);
  const [sortBy, setSortBy] = useState("none");
  const [chartHeight, setChartHeight] = useState(500);
  const [leftLabel, setLeftLabel] = useState("Before (2023)");
  const [rightLabel, setRightLabel] = useState("After (2024)");
  const [animation, setAnimation] = useState(true);

  const sortedData = useMemo(() => {
    const sorted = [...data];
    switch (sortBy) {
      case "change_asc":
        sorted.sort((a, b) => a.after - a.before - (b.after - b.before));
        break;
      case "change_desc":
        sorted.sort((a, b) => b.after - b.after - (a.after - a.before));
        break;
      case "before_asc":
        sorted.sort((a, b) => a.before - b.before);
        break;
      case "before_desc":
        sorted.sort((a, b) => b.before - a.before);
        break;
      case "after_asc":
        sorted.sort((a, b) => a.after - b.after);
        break;
      case "after_desc":
        sorted.sort((a, b) => b.after - a.after);
        break;
      case "label":
        sorted.sort((a, b) => a.label.localeCompare(b.label));
        break;
      default:
        break;
    }
    return sorted;
  }, [data, sortBy]);
  const maxValue = useMemo(() => {
    let max = 10;
    data.forEach((d) => {
      if (d.before > max) max = d.before;
      if (d.after > max) max = d.after;
    });
    return Math.ceil(max / 10) * 10;
  }, [data]);
  const largestChange = useMemo(() => {
    let maxChange = 0;
    let maxIndex = -1;
    data.forEach((d, i) => {
      const change = Math.abs(d.after - d.before);
      if (change > maxChange) {
        maxChange = change;
        maxIndex = i;
      }
    });
    return maxIndex;
  }, [data]);

  const handleDataChange = useCallback((index, field, newValue) => {
    setData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: Number(newValue) || 0 };
      return updated;
    });
  }, []);
  const handleLabelChange = useCallback((index, newLabel) => {
    setData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], label: newLabel };
      return updated;
    });
  }, []);
  const addItem = useCallback(() => {
    setData((prev) => [
      ...prev,
      {
        label: `Item ${prev.length + 1}`,
        before: Math.floor(Math.random() * 70) + 10,
        after: Math.floor(Math.random() * 70) + 10,
      },
    ]);
  }, []);
  const removeItem = useCallback((index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const getLineColor = (item) => {
    if (item.after > item.before) return increaseColor;
    if (item.after < item.before) return decreaseColor;
    return noChangeColor;
  };
  const getDashArray = () => {
    switch (lineStyle) {
      case "dashed":
        return "8 4";
      case "dotted":
        return "3 4";
      default:
        return "none";
    }
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
    width: "220px",
  };
  const chartContainerStyle = {
    background: "#ffffff",
    borderRadius: "6px",
    padding: "24px 20px",
    border: `1px solid ${theme.colors.border.light}`,
    minHeight: "450px",
    overflow: "auto",
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

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>📈</span>
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
            {data.length} ITEMS
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        <div style={{ width: "100%", position: "relative" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "16px",
              padding: "0 10%",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#8b949e",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              {leftLabel}
            </span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#8b949e",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              {rightLabel}
            </span>
          </div>
          <div
            style={{
              position: "relative",
              height: `${chartHeight}px`,
              padding: "0 8%",
            }}
          >
            <svg
              width="100%"
              height={chartHeight}
              viewBox={`0 0 100 ${chartHeight}`}
              preserveAspectRatio="none"
              style={{ position: "absolute", top: 0, left: 0, right: 0 }}
            >
              {sortedData.map((item, index) => {
                const y = (index / (sortedData.length - 1 || 1)) * chartHeight;
                const x1 = (item.before / maxValue) * 80;
                const x2 = 80 + (item.after / maxValue) * 80;
                const endX = x2; // ✅ x2 used via endX
                const yOffset = 10;
                const actualY =
                  yOffset + (y / chartHeight) * (chartHeight - yOffset * 2);
                const color = getLineColor(item);
                const isLargestChange =
                  highlightLargest && index === largestChange;
                const actualLineWidth = isLargestChange
                  ? lineWidth + 1.5
                  : lineWidth;
                return (
                  <g key={index}>
                    <line
                      x1={`${x1}%`}
                      y1={actualY}
                      x2={`${endX}%`}
                      y2={actualY}
                      stroke={color}
                      strokeWidth={actualLineWidth}
                      strokeDasharray={getDashArray()}
                      strokeLinecap="round"
                      opacity={isLargestChange ? 1 : 0.7}
                      style={{
                        transition: animation ? "all 0.5s ease" : "none",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.opacity = "1";
                        e.target.style.strokeWidth = actualLineWidth + 1;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.opacity = isLargestChange ? "1" : "0.7";
                        e.target.style.strokeWidth = actualLineWidth;
                      }}
                    >
                      <title>{`${item.label}: ${item.before} → ${item.after} (${item.after > item.before ? "+" : ""}${item.after - item.before}) | x2:${x2.toFixed(0)}`}</title>
                    </line>
                    {showDots && (
                      <circle
                        cx={`${x1}%`}
                        cy={actualY}
                        r={dotSize}
                        fill="#ffffff"
                        stroke={color}
                        strokeWidth={2}
                        style={{ cursor: "pointer" }}
                      >
                        <title>{`${item.label}: ${item.before}`}</title>
                      </circle>
                    )}
                    {showDots && (
                      <circle
                        cx={`${endX}%`}
                        cy={actualY}
                        r={dotSize}
                        fill={color}
                        stroke="#ffffff"
                        strokeWidth={1.5}
                        style={{ cursor: "pointer" }}
                      >
                        <title>{`${item.label}: ${item.after}`}</title>
                      </circle>
                    )}
                    {(labelPosition === "left" || labelPosition === "both") && (
                      <text
                        x={`${x1 - 2}%`}
                        y={actualY + 4}
                        textAnchor="end"
                        fill={showValues ? "#0d1117" : "#8b949e"}
                        fontSize="9"
                        fontWeight={showValues ? 700 : 400}
                        fontFamily={theme.typography.fontFamily.primary}
                      >
                        {showValues
                          ? `${item.label} (${item.before})`
                          : item.label}
                      </text>
                    )}
                    {(labelPosition === "right" ||
                      labelPosition === "both") && (
                      <text
                        x={`${endX + 2}%`}
                        y={actualY + 4}
                        textAnchor="start"
                        fill={showValues ? color : "#8b949e"}
                        fontSize="9"
                        fontWeight={showValues ? 700 : 400}
                        fontFamily={theme.typography.fontFamily.primary}
                      >
                        {showValues ? `${item.after}` : ""}
                      </text>
                    )}
                    {showChangePercent && (
                      <text
                        x={`${(x1 + endX) / 2}%`}
                        y={actualY - 8}
                        textAnchor="middle"
                        fill={color}
                        fontSize="8"
                        fontWeight={700}
                        fontFamily={theme.typography.fontFamily.primary}
                      >
                        {item.before !== 0
                          ? `${item.after > item.before ? "+" : ""}${(((item.after - item.before) / Math.abs(item.before)) * 100).toFixed(0)}%`
                          : "N/A"}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            marginTop: "16px",
            flexWrap: "wrap",
            fontSize: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: "20px",
                height: "3px",
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
                width: "20px",
                height: "3px",
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
                width: "20px",
                height: "3px",
                background: noChangeColor,
                borderRadius: "2px",
                display: "inline-block",
              }}
            />
            <span style={{ color: "#8b949e" }}>No Change</span>
          </div>
        </div>
      </div>

      <div style={controlsGridStyle}>
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
          <label style={labelStyle}>⚪ No Change</label>
          <input
            type="color"
            value={noChangeColor}
            onChange={(e) => setNoChangeColor(e.target.value)}
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
          <label style={labelStyle}>📏 Line Width: {lineWidth}px</label>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.5"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Chart Height: {chartHeight}px</label>
          <input
            type="range"
            min="300"
            max="700"
            step="50"
            value={chartHeight}
            onChange={(e) => setChartHeight(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>〰️ Line Style</label>
          <select
            value={lineStyle}
            onChange={(e) => setLineStyle(e.target.value)}
            style={selectStyle}
          >
            {LINE_STYLES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>⚫ Dot Size: {dotSize}px</label>
          <input
            type="range"
            min="3"
            max="12"
            value={dotSize}
            onChange={(e) => setDotSize(Number(e.target.value))}
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
            {LABEL_POSITIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📊 Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={selectStyle}
          >
            <option value="none">Default</option>
            <option value="change_desc">Change (Largest)</option>
            <option value="change_asc">Change (Smallest)</option>
            <option value="before_desc">Before (High)</option>
            <option value="before_asc">Before (Low)</option>
            <option value="after_desc">After (High)</option>
            <option value="after_asc">After (Low)</option>
            <option value="label">Alphabetical</option>
          </select>
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
              On labels
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>💯 Show % Change</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showChangePercent}
              onChange={(e) => setShowChangePercent(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Above lines
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>⚫ Show Dots</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showDots}
              onChange={(e) => setShowDots(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Endpoints
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>⭐ Highlight Largest</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={highlightLargest}
              onChange={(e) => setHighlightLargest(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Thicker line
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
              Smooth
            </span>
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
          <label style={labelStyle}>📝 Left Column Label</label>
          <input
            type="text"
            value={leftLabel}
            onChange={(e) => setLeftLabel(e.target.value)}
            style={{ ...cellInputStyle("150px") }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📝 Right Column Label</label>
          <input
            type="text"
            value={rightLabel}
            onChange={(e) => setRightLabel(e.target.value)}
            style={{ ...cellInputStyle("150px") }}
          />
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
            + Add Item
          </button>
        </div>
        <div id="chart-data-table" style={dataTableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>#</th>
                <th style={thStyle}>Label</th>
                <th style={{ ...thStyle, color: "#8b949e" }}>Before</th>
                <th style={{ ...thStyle, color: "#8b949e" }}>After</th>
                <th style={thStyle}>Change</th>
                <th style={thStyle}>% Change</th>
                <th style={thStyle}>Direction</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item, index) => {
                const change = item.after - item.before;
                const changePercent =
                  item.before !== 0
                    ? ((item.after - item.before) / Math.abs(item.before)) * 100
                    : 0;
                const isIncrease = change > 0;
                const isSame = change === 0;
                const lineColor = getLineColor(item);
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
                          handleLabelChange(index, e.target.value)
                        }
                        style={cellInputStyle("90px")}
                      />
                    </td>
                    <td style={tdStyle}>
                      <input
                        type="number"
                        value={item.before}
                        onChange={(e) =>
                          handleDataChange(index, "before", e.target.value)
                        }
                        style={cellInputStyle("55px")}
                      />
                    </td>
                    <td style={tdStyle}>
                      <input
                        type="number"
                        value={item.after}
                        onChange={(e) =>
                          handleDataChange(index, "after", e.target.value)
                        }
                        style={cellInputStyle("55px")}
                      />
                    </td>
                    <td
                      style={{ ...tdStyle, color: lineColor, fontWeight: 700 }}
                    >
                      {change > 0 ? "+" : ""}
                      {change}
                    </td>
                    <td style={{ ...tdStyle, color: lineColor }}>
                      {changePercent > 0 ? "+" : ""}
                      {changePercent.toFixed(1)}%
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: "14px", color: lineColor }}>
                        {isSame ? "→" : isIncrease ? "↗" : "↘"}
                      </span>
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
                );
              })}
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
          Increased:{" "}
          <strong style={{ color: increaseColor }}>
            {data.filter((d) => d.after > d.before).length}
          </strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Decreased:{" "}
          <strong style={{ color: decreaseColor }}>
            {data.filter((d) => d.after < d.before).length}
          </strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Unchanged:{" "}
          <strong style={{ color: noChangeColor }}>
            {data.filter((d) => d.after === d.before).length}
          </strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Items: <strong style={{ color: "#f0f6fc" }}>{data.length}</strong>
        </span>
      </div>
    </div>
  );
};

export default SlopeChartComponent;

