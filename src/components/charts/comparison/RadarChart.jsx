import React, { useState, useCallback, useMemo } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { theme } from "../../../styles/theme";

// ============================================
// DEFAULT DATA
// ============================================
const DEFAULT_DATA = [
  { category: "Speed", value1: 80, value2: 60, value3: 45, fullMark: 100 },
  { category: "Power", value1: 70, value2: 85, value3: 55, fullMark: 100 },
  { category: "Accuracy", value1: 90, value2: 50, value3: 75, fullMark: 100 },
  { category: "Defense", value1: 55, value2: 75, value3: 90, fullMark: 100 },
  { category: "Stamina", value1: 65, value2: 70, value3: 60, fullMark: 100 },
  { category: "Agility", value1: 85, value2: 55, value3: 70, fullMark: 100 },
];

const SERIES_CONFIG = [
  { key: "value1", name: "Product A", color: "#58a6ff" },
  { key: "value2", name: "Product B", color: "#f85149" },
  { key: "value3", name: "Product C", color: "#3fb950" },
];

const GRID_SHAPES = [
  { name: "Polygon", value: "polygon" },
  { name: "Circle", value: "circle" },
];

const RadarChartComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#58a6ff",
}) => {
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Radar Chart");
  const [seriesColors, setSeriesColors] = useState(
    SERIES_CONFIG.map((s) => s.color),
  );
  const [seriesNames, setSeriesNames] = useState(
    SERIES_CONFIG.map((s) => s.name),
  );
  const [visibleSeries, setVisibleSeries] = useState([true, true, true]);
  const [activeSeriesCount, setActiveSeriesCount] = useState(3);
  const [fillOpacity, setFillOpacity] = useState(0.25);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [showDots, setShowDots] = useState(true);
  const [dotSize, setDotSize] = useState(5);
  const [gridLevels, setGridLevels] = useState(5);
  const [gridShape, setGridShape] = useState("polygon");
  const [gridColor, setGridColor] = useState("#30363d");
  const [axisColor, setAxisColor] = useState("#8b949e");
  const [showLegend, setShowLegend] = useState(true);
  const [legendPosition, setLegendPosition] = useState("bottom");
  const [showValues, setShowValues] = useState(false);
  const [animation, setAnimation] = useState(true);

  const maxValue = useMemo(() => {
    let max = 10;
    data.forEach((row) => {
      SERIES_CONFIG.slice(0, activeSeriesCount).forEach((series) => {
        if (row[series.key] > max) max = row[series.key];
      });
    });
    return Math.ceil(max / 10) * 10;
  }, [data, activeSeriesCount]);
  const chartData = useMemo(
    () => data.map((row) => ({ ...row, fullMark: maxValue })),
    [data, maxValue],
  );
  const activeSeries = useMemo(
    () =>
      SERIES_CONFIG.filter((_, i) => visibleSeries[i]).slice(
        0,
        activeSeriesCount,
      ),
    [visibleSeries, activeSeriesCount],
  );

  const handleDataChange = useCallback((categoryIndex, seriesKey, newValue) => {
    setData((prev) => {
      const updated = [...prev];
      updated[categoryIndex] = {
        ...updated[categoryIndex],
        [seriesKey]: Number(newValue) || 0,
      };
      return updated;
    });
  }, []);
  const handleCategoryChange = useCallback((index, newCategory) => {
    setData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], category: newCategory };
      return updated;
    });
  }, []);
  const addCategory = useCallback(() => {
    const newCategory = `Item ${data.length + 1}`;
    const newRow = { category: newCategory, fullMark: 100 };
    SERIES_CONFIG.slice(0, activeSeriesCount).forEach((s) => {
      newRow[s.key] = Math.floor(Math.random() * 70) + 20;
    });
    setData((prev) => [...prev, newRow]);
  }, [data, activeSeriesCount]);
  const removeCategory = useCallback((index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  }, []);
  const toggleSeries = (index) => {
    const updated = [...visibleSeries];
    updated[index] = !updated[index];
    setVisibleSeries(updated);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const category = payload[0]?.payload?.category;
      return (
        <div style={tooltipContainerStyle}>
          <p style={tooltipLabelStyle}>{category}</p>
          {payload
            .filter((p) => p.dataKey !== "fullMark")
            .map((entry, i) => (
              <div key={i} style={tooltipValueRow}>
                <span style={{ ...tooltipColorDot, background: entry.color }} />
                <span style={tooltipValueLabel}>{entry.name}:</span>
                <span style={{ ...tooltipValue, color: entry.color }}>
                  {entry.value}
                </span>
                <span style={tooltipPercent}>
                  ({((entry.value / maxValue) * 100).toFixed(0)}%)
                </span>
              </div>
            ))}
        </div>
      );
    }
    return null;
  };

  const customLegend = () => (
    <Legend
      wrapperStyle={{
        fontSize: "11px",
        fontFamily: theme.typography.fontFamily.primary,
        color: theme.colors.mainBg,
        paddingTop: legendPosition === "bottom" ? "16px" : "0",
      }}
      iconType="circle"
      iconSize={8}
      verticalAlign={legendPosition}
      align="center"
      onClick={(e, index) => toggleSeries(index)}
      formatter={(value, entry, index) => (
        <span
          style={{
            color: visibleSeries[index] ? seriesColors[index] : "#8b949e",
            fontWeight: 600,
            cursor: "pointer",
            opacity: visibleSeries[index] ? 1 : 0.4,
          }}
        >
          {seriesNames[index] || value}
        </span>
      )}
    />
  );

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
    padding: "24px",
    border: `1px solid ${theme.colors.border.light}`,
    minHeight: "500px",
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
  const seriesBarStyle = {
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
  const tdStyle = { padding: "4px 6px", borderBottom: "1px solid #21262d" };
  const cellInputStyle = (width = "55px") => ({
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
    padding: "2px 6px",
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
    alignItems: "center",
    gap: "6px",
    marginBottom: "4px",
  };
  const tooltipColorDot = {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    display: "inline-block",
    flexShrink: 0,
  };
  const tooltipValueLabel = {
    color: theme.colors.text.muted,
    fontSize: "10px",
    flex: 1,
  };
  const tooltipValue = {
    fontSize: "13px",
    fontWeight: 700,
    minWidth: "30px",
    textAlign: "right",
  };
  const tooltipPercent = { color: theme.colors.text.muted, fontSize: "9px" };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>📡</span>
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
            {data.length} × {activeSeries.length}
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        <ResponsiveContainer width="100%" height={480}>
          <RadarChart
            data={chartData}
            margin={{
              top: 30,
              right: 30,
              left: 30,
              bottom: legendPosition === "bottom" ? 20 : 10,
            }}
          >
            <PolarGrid
              gridType={gridShape}
              stroke={gridColor}
              strokeWidth={0.5}
              polarAngles={data.map((_, i) => (360 / data.length) * i)}
              polarRadius={Array.from(
                { length: gridLevels },
                (_, i) => (i + 1) * (100 / gridLevels),
              )}
            />
            <PolarAngleAxis
              dataKey="category"
              tick={{
                fill: axisColor,
                fontSize: 10,
                fontFamily: theme.typography.fontFamily.primary,
                fontWeight: 600,
              }}
              tickLine={{ stroke: gridColor, strokeWidth: 0.5 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, maxValue]}
              tick={{ fill: "#94a3b8", fontSize: 8 }}
              axisLine={{ stroke: gridColor }}
              tickCount={gridLevels + 1}
            />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && customLegend()}
            {activeSeries.map((series, sIndex) => (
              <Radar
                key={series.key}
                dataKey={series.key}
                name={seriesNames[sIndex]}
                stroke={seriesColors[sIndex]}
                fill={seriesColors[sIndex]}
                fillOpacity={fillOpacity}
                strokeWidth={strokeWidth}
                dot={
                  showDots
                    ? {
                        r: dotSize,
                        fill: seriesColors[sIndex],
                        stroke: "#ffffff",
                        strokeWidth: 1.5,
                      }
                    : false
                }
                activeDot={{
                  r: dotSize + 2,
                  fill: seriesColors[sIndex],
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
                isAnimationActive={animation}
                animationDuration={800}
                animationBegin={sIndex * 200}
                label={
                  showValues
                    ? {
                        fontSize: 9,
                        fill: seriesColors[sIndex],
                        fontWeight: 700,
                        position: "top",
                      }
                    : false
                }
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔷 Grid Shape</label>
          <select
            value={gridShape}
            onChange={(e) => setGridShape(e.target.value)}
            style={selectStyle}
          >
            {GRID_SHAPES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📊 Grid Levels: {gridLevels}</label>
          <input
            type="range"
            min="3"
            max="10"
            value={gridLevels}
            onChange={(e) => setGridLevels(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>
            📊 Active Series: {activeSeriesCount}
          </label>
          <input
            type="range"
            min="1"
            max="3"
            value={activeSeriesCount}
            onChange={(e) => setActiveSeriesCount(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Grid Color</label>
          <input
            type="color"
            value={gridColor}
            onChange={(e) => setGridColor(e.target.value)}
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
          <label style={labelStyle}>📐 Axis Color</label>
          <input
            type="color"
            value={axisColor}
            onChange={(e) => setAxisColor(e.target.value)}
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
          <label style={labelStyle}>🎨 Fill Opacity: {fillOpacity}</label>
          <input
            type="range"
            min="0"
            max="0.6"
            step="0.05"
            value={fillOpacity}
            onChange={(e) => setFillOpacity(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Stroke Width: {strokeWidth}px</label>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.5"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>⚫ Dot Size: {dotSize}px</label>
          <input
            type="range"
            min="2"
            max="10"
            value={dotSize}
            onChange={(e) => setDotSize(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📋 Legend Position</label>
          <select
            value={legendPosition}
            onChange={(e) => setLegendPosition(e.target.value)}
            style={selectStyle}
          >
            <option value="bottom">Bottom</option>
            <option value="top">Top</option>
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
              Value labels
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
              Data points
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
              Display legend
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

      <div style={seriesBarStyle}>
        <label style={labelStyle}>
          🎨 Series Settings (click legend to toggle)
        </label>
        {SERIES_CONFIG.slice(0, activeSeriesCount).map((series, index) => (
          <div
            key={series.key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px",
              borderBottom:
                index < activeSeriesCount - 1
                  ? `1px solid ${theme.colors.border.light}`
                  : "none",
              opacity: visibleSeries[index] ? 1 : 0.4,
            }}
          >
            <input
              type="checkbox"
              checked={visibleSeries[index]}
              onChange={() => toggleSeries(index)}
              style={{ accentColor: seriesColors[index] }}
            />
            <input
              type="color"
              value={seriesColors[index]}
              onChange={(e) => {
                const updated = [...seriesColors];
                updated[index] = e.target.value;
                setSeriesColors(updated);
              }}
              style={{
                width: "26px",
                height: "26px",
                cursor: "pointer",
                border: "none",
                borderRadius: "3px",
                padding: "2px",
              }}
            />
            <input
              type="text"
              value={seriesNames[index]}
              onChange={(e) => {
                const updated = [...seriesNames];
                updated[index] = e.target.value;
                setSeriesNames(updated);
              }}
              style={{
                ...cellInputStyle("100px"),
                fontWeight: 600,
                color: seriesColors[index],
              }}
            />
          </div>
        ))}
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
          <label style={labelStyle}>
            📋 Data Table ({data.length} categories)
          </label>
          <button onClick={addCategory} style={buttonStyle()}>
            + Add Category
          </button>
        </div>
        <div id="chart-data-table" style={dataTableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>#</th>
                <th style={thStyle}>Category</th>
                {SERIES_CONFIG.slice(0, activeSeriesCount).map((s, i) => (
                  <th
                    key={s.key}
                    style={{ ...thStyle, color: seriesColors[i] }}
                  >
                    {seriesNames[i]}
                  </th>
                ))}
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td style={{ ...tdStyle, color: "#484f58" }}>
                    {rowIndex + 1}
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      value={row.category}
                      onChange={(e) =>
                        handleCategoryChange(rowIndex, e.target.value)
                      }
                      style={cellInputStyle("80px")}
                    />
                  </td>
                  {SERIES_CONFIG.slice(0, activeSeriesCount).map(
                    (s, sIndex) => (
                      <td key={s.key} style={tdStyle}>
                        <input
                          type="number"
                          value={row[s.key]}
                          onChange={(e) =>
                            handleDataChange(rowIndex, s.key, e.target.value)
                          }
                          style={{
                            ...cellInputStyle("50px"),
                            borderColor: visibleSeries[sIndex]
                              ? seriesColors[sIndex] + "50"
                              : "#30363d",
                          }}
                          min="0"
                          max={maxValue}
                        />
                      </td>
                    ),
                  )}
                  <td style={tdStyle}>
                    <button
                      onClick={() => removeCategory(rowIndex)}
                      style={deleteBtnStyle}
                      disabled={data.length <= 3}
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
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(activeSeriesCount, 4)}, 1fr)`,
          gap: "10px",
        }}
      >
        {SERIES_CONFIG.slice(0, activeSeriesCount).map((s, i) => {
          const seriesTotal = data.reduce(
            (sum, row) => sum + (row[s.key] || 0),
            0,
          );
          const seriesAvg = (seriesTotal / data.length).toFixed(1);
          const seriesMax = Math.max(...data.map((row) => row[s.key] || 0));
          return (
            <div
              key={s.key}
              style={{
                padding: "10px 12px",
                background: theme.colors.cardBg,
                borderRadius: "4px",
                border: `1px solid ${theme.colors.border.default}`,
                borderLeft: `3px solid ${seriesColors[i]}`,
              }}
            >
              <div
                style={{
                  color: seriesColors[i],
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  marginBottom: "4px",
                }}
              >
                {seriesNames[i]}
              </div>
              <div style={{ fontSize: "10px", color: theme.colors.text.muted }}>
                Avg:{" "}
                <strong style={{ color: theme.colors.text.body }}>
                  {seriesAvg}
                </strong>
              </div>
              <div style={{ fontSize: "10px", color: theme.colors.text.muted }}>
                Max:{" "}
                <strong style={{ color: theme.colors.text.body }}>
                  {seriesMax}
                </strong>
              </div>
              <div style={{ fontSize: "10px", color: theme.colors.text.muted }}>
                Total:{" "}
                <strong style={{ color: theme.colors.text.body }}>
                  {seriesTotal}
                </strong>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RadarChartComponent;

