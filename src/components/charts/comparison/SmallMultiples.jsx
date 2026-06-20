import React, { useState, useCallback, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { theme } from "../../../styles/theme";

const DEFAULT_CATEGORIES = [
  "Product A",
  "Product B",
  "Product C",
  "Product D",
  "Product E",
  "Product F",
];
const DEFAULT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const generateDefaultData = () => {
  return DEFAULT_CATEGORIES.map((category, ci) => {
    const data = DEFAULT_MONTHS.map((month, mi) => ({
      month,
      value: Math.floor(Math.random() * 60) + 20 + ci * 5,
    }));
    return {
      category,
      data,
      color: theme.colors.charts[ci % theme.colors.charts.length],
    };
  });
};

const MINI_CHART_TYPES = [
  { name: "Line", value: "line" },
  { name: "Bar", value: "bar" },
  { name: "Area", value: "area" },
];
const AXIS_MODES = [
  { name: "Free (Per Panel)", value: "free" },
  { name: "Shared (All Same)", value: "shared" },
];

const SmallMultiplesComponent = ({
  initialData = null,
  chartColor = "#58a6ff",
}) => {
  const [categories, setCategories] = useState(generateDefaultData());
  const [titleText, setTitleText] = useState("Small Multiples");
  const [chartType, setChartType] = useState("line");
  const [columns, setColumns] = useState(3);
  const [axisMode, setAxisMode] = useState("free");
  const [showAxes, setShowAxes] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [panelHeight, setPanelHeight] = useState(180);
  const [panelGap, setPanelGap] = useState(16);
  const [highlightedPanel, setHighlightedPanel] = useState(null);
  const [showValues, setShowValues] = useState(false);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [animation, setAnimation] = useState(true);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [panelBorder, setPanelBorder] = useState(true);

  const globalMax = useMemo(() => {
    if (axisMode !== "shared") return null;
    let max = 10;
    categories.forEach((cat) => {
      cat.data.forEach((d) => {
        if (d.value > max) max = d.value;
      });
    });
    return Math.ceil(max / 10) * 10;
  }, [categories, axisMode]);
  const globalMin = useMemo(() => {
    if (axisMode !== "shared") return null;
    let min = Infinity;
    categories.forEach((cat) => {
      cat.data.forEach((d) => {
        if (d.value < min) min = d.value;
      });
    });
    return Math.floor(min / 10) * 10;
  }, [categories, axisMode]);

  const handleCategoryNameChange = useCallback((index, newName) => {
    setCategories((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], category: newName };
      return updated;
    });
  }, []);
  const handleCategoryColorChange = useCallback((index, newColor) => {
    setCategories((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], color: newColor };
      return updated;
    });
  }, []);
  const handleDataPointChange = useCallback((catIndex, dataIndex, newValue) => {
    setCategories((prev) => {
      const updated = [...prev];
      const newData = [...updated[catIndex].data];
      newData[dataIndex] = {
        ...newData[dataIndex],
        value: Number(newValue) || 0,
      };
      updated[catIndex] = { ...updated[catIndex], data: newData };
      return updated;
    });
  }, []);
  const addCategory = useCallback(() => {
    const newCat = {
      category: `Product ${String.fromCharCode(65 + categories.length)}`,
      data: DEFAULT_MONTHS.map((month) => ({
        month,
        value: Math.floor(Math.random() * 60) + 20,
      })),
      color:
        theme.colors.charts[categories.length % theme.colors.charts.length],
    };
    setCategories((prev) => [...prev, newCat]);
  }, [categories]);
  const removeCategory = useCallback((index) => {
    setCategories((prev) => prev.filter((_, i) => i !== index));
  }, []);
  const addDataPoint = useCallback((catIndex) => {
    setCategories((prev) => {
      const updated = [...prev];
      const newData = [...updated[catIndex].data];
      newData.push({
        month: `M${newData.length + 1}`,
        value: Math.floor(Math.random() * 50) + 30,
      });
      updated[catIndex] = { ...updated[catIndex], data: newData };
      return updated;
    });
  }, []);
  const removeDataPoint = useCallback((catIndex, dataIndex) => {
    setCategories((prev) => {
      const updated = [...prev];
      const newData = updated[catIndex].data.filter((_, i) => i !== dataIndex);
      updated[catIndex] = { ...updated[catIndex], data: newData };
      return updated;
    });
  }, []);

  // ✅ FIX: Use isHighlighted inside renderMiniChart for stroke width emphasis
  const renderMiniChart = (data, color, index) => {
    const isHighlighted = highlightedPanel === index;
    const maxVal =
      axisMode === "shared"
        ? globalMax
        : Math.max(...data.map((d) => d.value), 10);
    const minVal = axisMode === "shared" ? globalMin : 0;
    const chartProps = {
      data,
      margin: { top: 10, right: 10, left: 0, bottom: 5 },
    };
    const commonProps = {
      dataKey: "value",
      stroke: color,
      fill: color,
      strokeWidth: isHighlighted ? strokeWidth + 1 : strokeWidth,
    };

    switch (chartType) {
      case "bar":
        return (
          <BarChart {...chartProps}>
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            )}
            {showAxes && (
              <XAxis
                dataKey="month"
                tick={{ fontSize: 7, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
            )}
            {showAxes && (
              <YAxis
                domain={[minVal || 0, maxVal || "auto"]}
                tick={{ fontSize: 7, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                width={25}
              />
            )}
            <Tooltip
              contentStyle={{
                fontSize: "10px",
                background: "#161b22",
                border: "1px solid #30363d",
                borderRadius: "3px",
                color: "#c9d1d9",
              }}
            />
            <Bar
              {...commonProps}
              radius={[2, 2, 0, 0]}
              isAnimationActive={animation}
              label={
                showValues
                  ? { fontSize: 8, fill: color, position: "top" }
                  : false
              }
            />
          </BarChart>
        );
      case "area":
        return (
          <AreaChart {...chartProps}>
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            )}
            {showAxes && (
              <XAxis
                dataKey="month"
                tick={{ fontSize: 7, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
            )}
            {showAxes && (
              <YAxis
                domain={[minVal || 0, maxVal || "auto"]}
                tick={{ fontSize: 7, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                width={25}
              />
            )}
            <Tooltip
              contentStyle={{
                fontSize: "10px",
                background: "#161b22",
                border: "1px solid #30363d",
                borderRadius: "3px",
                color: "#c9d1d9",
              }}
            />
            <Area
              {...commonProps}
              fillOpacity={0.2}
              isAnimationActive={animation}
              label={
                showValues
                  ? { fontSize: 8, fill: color, position: "top" }
                  : false
              }
            />
          </AreaChart>
        );
      default:
        return (
          <LineChart {...chartProps}>
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            )}
            {showAxes && (
              <XAxis
                dataKey="month"
                tick={{ fontSize: 7, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
            )}
            {showAxes && (
              <YAxis
                domain={[minVal || 0, maxVal || "auto"]}
                tick={{ fontSize: 7, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                width={25}
              />
            )}
            <Tooltip
              contentStyle={{
                fontSize: "10px",
                background: "#161b22",
                border: "1px solid #30363d",
                borderRadius: "3px",
                color: "#c9d1d9",
              }}
            />
            <Line
              {...commonProps}
              dot={{ r: 3, fill: color, stroke: "#fff", strokeWidth: 1 }}
              activeDot={{ r: 5, fill: color, stroke: "#fff", strokeWidth: 2 }}
              isAnimationActive={animation}
              label={
                showValues
                  ? { fontSize: 8, fill: color, position: "top" }
                  : false
              }
            />
          </LineChart>
        );
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
    width: "250px",
  };
  const chartContainerStyle = {
    background: "#ffffff",
    borderRadius: "6px",
    padding: "20px",
    border: `1px solid ${theme.colors.border.light}`,
    minHeight: "400px",
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
  const cellInputStyle = (width = "65px") => ({
    padding: "3px 4px",
    background: theme.colors.inputBg,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: "2px",
    color: theme.colors.text.body,
    fontSize: "9px",
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
    padding: "1px 4px",
    background: "transparent",
    border: "1px solid #f85149",
    borderRadius: "2px",
    color: "#f85149",
    cursor: "pointer",
    fontSize: "7px",
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
            {categories.length} PANELS
          </span>
        </div>
      </div>
      <div id="chart-visual-area" style={chartContainerStyle}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: `${panelGap}px`,
          }}
        >
          {categories.map((cat, catIndex) => {
            const isHighlighted = highlightedPanel === catIndex;
            return (
              <div
                key={catIndex}
                style={{
                  background: bgColor,
                  borderRadius: "6px",
                  border: panelBorder
                    ? isHighlighted
                      ? `2px solid ${cat.color}`
                      : "1px solid #e2e8f0"
                    : "none",
                  padding: "12px 8px 4px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: isHighlighted
                    ? `0 0 12px ${cat.color}40`
                    : "0 1px 3px rgba(0,0,0,0.06)",
                  transform: isHighlighted ? "scale(1.03)" : "scale(1)",
                  position: "relative",
                }}
                onMouseEnter={() => setHighlightedPanel(catIndex)}
                onMouseLeave={() => setHighlightedPanel(null)}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                    padding: "0 4px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        background: cat.color,
                        borderRadius: "2px",
                        display: "inline-block",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        color: "#0d1117",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {cat.category}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "9px",
                      color: isHighlighted ? cat.color : "#8b949e",
                      fontWeight: 600,
                    }}
                  >
                    Avg:{" "}
                    {(
                      cat.data.reduce((s, d) => s + d.value, 0) /
                        cat.data.length || 0
                    ).toFixed(0)}
                  </span>
                </div>
                <div style={{ height: `${panelHeight}px` }}>
                  <ResponsiveContainer width="100%" height="100%">
                    {renderMiniChart(cat.data, cat.color, catIndex)}
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📈 Chart Type</label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            style={selectStyle}
          >
            {MINI_CHART_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📐 Axis Mode</label>
          <select
            value={axisMode}
            onChange={(e) => setAxisMode(e.target.value)}
            style={selectStyle}
          >
            {AXIS_MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📊 Columns: {columns}</label>
          <input
            type="range"
            min="1"
            max="4"
            value={columns}
            onChange={(e) => setColumns(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Panel Height: {panelHeight}px</label>
          <input
            type="range"
            min="100"
            max="300"
            value={panelHeight}
            onChange={(e) => setPanelHeight(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>↔️ Panel Gap: {panelGap}px</label>
          <input
            type="range"
            min="4"
            max="32"
            value={panelGap}
            onChange={(e) => setPanelGap(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Line Width: {strokeWidth}px</label>
          <input
            type="range"
            min="1"
            max="4"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Panel Background</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
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
          <label style={labelStyle}>🔢 Show Values</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showValues}
              onChange={(e) => setShowValues(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Data labels
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📐 Show Axes</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showAxes}
              onChange={(e) => setShowAxes(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Axis labels
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔲 Show Grid</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Grid lines
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔲 Panel Border</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={panelBorder}
              onChange={(e) => setPanelBorder(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Show border
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
          <label style={labelStyle}>📋 Categories ({categories.length})</label>
          <button onClick={addCategory} style={buttonStyle()}>
            + Add Category
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {categories.map((cat, catIndex) => (
            <div
              key={catIndex}
              style={{
                background: theme.colors.cardBg,
                borderRadius: "4px",
                border: `1px solid ${theme.colors.border.default}`,
                borderLeft: `3px solid ${cat.color}`,
                padding: "10px 12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  marginBottom: "6px",
                  flexWrap: "wrap",
                }}
              >
                <input
                  type="color"
                  value={cat.color}
                  onChange={(e) =>
                    handleCategoryColorChange(catIndex, e.target.value)
                  }
                  style={{
                    width: "24px",
                    height: "24px",
                    cursor: "pointer",
                    border: "none",
                    borderRadius: "2px",
                  }}
                />
                <input
                  type="text"
                  value={cat.category}
                  onChange={(e) =>
                    handleCategoryNameChange(catIndex, e.target.value)
                  }
                  style={{
                    ...cellInputStyle("100px"),
                    fontWeight: 700,
                    color: cat.color,
                  }}
                />
                <span style={{ color: "#8b949e", fontSize: "9px" }}>
                  ({cat.data.length} points)
                </span>
                <button
                  onClick={() => addDataPoint(catIndex)}
                  style={{
                    ...buttonStyle(cat.color),
                    fontSize: "8px",
                    padding: "3px 8px",
                  }}
                >
                  + Point
                </button>
                <button
                  onClick={() => removeCategory(catIndex)}
                  style={deleteBtnStyle}
                  disabled={categories.length <= 2}
                >
                  ×
                </button>
              </div>
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                {cat.data.map((point, dataIndex) => (
                  <div
                    key={dataIndex}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "2px",
                    }}
                  >
                    <input
                      type="text"
                      value={point.month}
                      onChange={(e) => {
                        setCategories((prev) => {
                          const updated = [...prev];
                          const newData = [...updated[catIndex].data];
                          newData[dataIndex] = {
                            ...newData[dataIndex],
                            month: e.target.value,
                          };
                          updated[catIndex] = {
                            ...updated[catIndex],
                            data: newData,
                          };
                          return updated;
                        });
                      }}
                      style={{ ...cellInputStyle("35px"), fontSize: "8px" }}
                    />
                    <input
                      type="number"
                      value={point.value}
                      onChange={(e) =>
                        handleDataPointChange(
                          catIndex,
                          dataIndex,
                          e.target.value,
                        )
                      }
                      style={{ ...cellInputStyle("40px"), fontSize: "8px" }}
                    />
                    <button
                      onClick={() => removeDataPoint(catIndex, dataIndex)}
                      style={{ ...deleteBtnStyle, fontSize: "6px" }}
                      disabled={cat.data.length <= 2}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
          Panels:{" "}
          <strong style={{ color: "#f0f6fc" }}>{categories.length}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Grid: <strong style={{ color: "#f0f6fc" }}>{columns} columns</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Chart:{" "}
          <strong style={{ color: chartColor }}>
            {chartType.toUpperCase()}
          </strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Axis:{" "}
          <strong style={{ color: "#f0f6fc" }}>{axisMode.toUpperCase()}</strong>
        </span>
      </div>
    </div>
  );
};

export default SmallMultiplesComponent;

