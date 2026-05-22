import React, { useState, useCallback, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
  Legend,
} from "recharts";
import { theme } from "../../../styles/theme";

// ============================================
// DEFAULT DATA - 4 series, 6 categories
// ============================================
const DEFAULT_DATA = [
  { label: "2020", series1: 30, series2: 40, series3: 25, series4: 50 },
  { label: "2021", series1: 45, series2: 35, series3: 50, series4: 40 },
  { label: "2022", series1: 55, series2: 50, series3: 45, series4: 60 },
  { label: "2023", series1: 60, series2: 55, series3: 70, series4: 45 },
  { label: "2024", series1: 75, series2: 65, series3: 60, series4: 55 },
  { label: "2025", series1: 85, series2: 70, series3: 80, series4: 65 },
];

// ============================================
// SERIES CONFIGURATION
// ============================================
const SERIES_CONFIG = [
  { key: "series1", name: "Product A", color: "#58a6ff" },
  { key: "series2", name: "Product B", color: "#f85149" },
  { key: "series3", name: "Product C", color: "#3fb950" },
  { key: "series4", name: "Product D", color: "#d29922" },
];

const ACTIVE_SERIES_COUNT = 4;

// ============================================
// MAIN COMPONENT
// ============================================
const GroupedBarChartComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#58a6ff",
}) => {
  // ===== STATE =====
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Grouped Bar Chart");
  const [seriesColors, setSeriesColors] = useState(
    SERIES_CONFIG.map((s) => s.color),
  );
  const [seriesNames, setSeriesNames] = useState(
    SERIES_CONFIG.map((s) => s.name),
  );
  const [visibleSeries, setVisibleSeries] = useState([true, true, true, true]);
  const [groupGap, setGroupGap] = useState(10);
  const [barWidth, setBarWidth] = useState(20);
  const [showValues, setShowValues] = useState(false);
  const [valuePosition, setValuePosition] = useState("top");
  const [legendPosition, setLegendPosition] = useState("bottom");
  const [gridVisible, setGridVisible] = useState(true);
  const [orientation, setOrientation] = useState("vertical");
  const [activeSeriesCount, setActiveSeriesCount] =
    useState(ACTIVE_SERIES_COUNT);

  // ===== DERIVED =====
  const maxValue = useMemo(() => {
    let max = 10;
    data.forEach((row) => {
      SERIES_CONFIG.forEach((series, i) => {
        if (visibleSeries[i]) max = Math.max(max, row[series.key] || 0);
      });
    });
    return max;
  }, [data, visibleSeries]);

  const activeSeries = useMemo(() => {
    return SERIES_CONFIG.filter((_, i) => visibleSeries[i]).slice(
      0,
      activeSeriesCount,
    );
  }, [visibleSeries, activeSeriesCount]);

  // ===== HANDLERS =====
  const handleDataChange = useCallback((rowIndex, seriesKey, newValue) => {
    setData((prev) => {
      const updated = [...prev];
      updated[rowIndex] = {
        ...updated[rowIndex],
        [seriesKey]: Number(newValue) || 0,
      };
      return updated;
    });
  }, []);

  const handleLabelChange = useCallback((rowIndex, newLabel) => {
    setData((prev) => {
      const updated = [...prev];
      updated[rowIndex] = { ...updated[rowIndex], label: newLabel };
      return updated;
    });
  }, []);

  const addDataRow = useCallback(() => {
    const newLabel = `Item ${data.length + 1}`;
    const newRow = { label: newLabel };
    SERIES_CONFIG.forEach((s) => {
      newRow[s.key] = Math.floor(Math.random() * 80) + 20;
    });
    setData((prev) => [...prev, newRow]);
  }, [data]);

  const removeDataRow = useCallback((index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const toggleSeries = (index) => {
    const updated = [...visibleSeries];
    updated[index] = !updated[index];
    setVisibleSeries(updated);
  };

  const handleSeriesColorChange = (index, newColor) => {
    const updated = [...seriesColors];
    updated[index] = newColor;
    setSeriesColors(updated);
  };

  const handleSeriesNameChange = (index, newName) => {
    const updated = [...seriesNames];
    updated[index] = newName;
    setSeriesNames(updated);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);
      return (
        <div style={tooltipContainerStyle}>
          <p style={tooltipLabelStyle}>{label}</p>
          <div style={{ marginBottom: "8px" }}>
            {payload.map((entry, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "20px",
                  marginBottom: "2px",
                }}
              >
                <span style={{ color: entry.color, fontSize: "11px" }}>
                  ● {entry.name}
                </span>
                <span
                  style={{
                    color: theme.colors.text.heading,
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              borderTop: `1px solid ${theme.colors.border.light}`,
              paddingTop: "6px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                color: theme.colors.text.muted,
                fontSize: "10px",
                fontWeight: 700,
              }}
            >
              TOTAL
            </span>
            <span
              style={{
                color: theme.colors.text.heading,
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              {total}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderCustomLegend = () => {
    const legendProps = {
      wrapperStyle: {
        color: theme.colors.text.body,
        fontSize: "11px",
        fontFamily: theme.typography.fontFamily.primary,
        paddingTop: legendPosition === "bottom" ? "16px" : "0",
      },
      verticalAlign: legendPosition === "bottom" ? "bottom" : "top",
      align: "center",
      iconType: "square",
      iconSize: 10,
      formatter: (value, entry, index) => (
        <span
          style={{
            color: seriesColors[index],
            fontWeight: 600,
            marginRight: "16px",
          }}
        >
          {seriesNames[index] || value}
        </span>
      ),
      onClick: (e, index) => toggleSeries(index),
    };
    return <Legend {...legendProps} />;
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
    borderBottom: `2px solid ${seriesColors[0]}`,
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
    background: "#ffffff",
    borderRadius: "6px",
    padding: "24px 16px 16px",
    border: `1px solid ${theme.colors.border.light}`,
    minHeight: "450px",
  };
  const controlsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
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
  };
  const seriesLegendStyle = {
    background: theme.colors.cardBg,
    padding: "12px 16px",
    borderRadius: "4px",
    border: `1px solid ${theme.colors.border.default}`,
  };
  const seriesItemStyle = (isVisible) => ({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px",
    borderBottom: `1px solid ${theme.colors.border.light}`,
    opacity: isVisible ? 1 : 0.4,
    transition: "opacity 0.2s ease",
  });
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
    padding: "10px 8px",
    textAlign: "left",
    fontSize: "10px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "2px",
    borderBottom: `2px solid ${theme.colors.border.default}`,
    position: "sticky",
    top: 0,
    whiteSpace: "nowrap",
  };
  const tdStyle = {
    padding: "6px 8px",
    borderBottom: `1px solid ${theme.colors.border.light}`,
    fontSize: "11px",
  };
  const cellInputStyle = {
    padding: "6px 8px",
    background: theme.colors.inputBg,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: "3px",
    color: theme.colors.text.body,
    fontSize: "11px",
    fontFamily: theme.typography.fontFamily.primary,
    width: "70px",
    outline: "none",
    boxSizing: "border-box",
  };
  const buttonStyle = (borderColor) => ({
    padding: "8px 16px",
    background: "transparent",
    border: `1px solid ${borderColor}`,
    borderRadius: "3px",
    color: borderColor,
    cursor: "pointer",
    fontSize: "11px",
    fontFamily: theme.typography.fontFamily.primary,
    fontWeight: 600,
    letterSpacing: "1px",
    textTransform: "uppercase",
    transition: "all 0.15s ease",
  });
  const deleteButtonStyle = {
    padding: "4px 8px",
    background: "transparent",
    border: `1px solid ${theme.colors.status.error}`,
    borderRadius: "3px",
    color: theme.colors.status.error,
    cursor: "pointer",
    fontSize: "10px",
  };
  const tooltipContainerStyle = {
    background: theme.colors.cardBg,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: "4px",
    padding: "12px 16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
    minWidth: "180px",
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

  // ============================================
  // RENDER
  // ============================================
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
              color: seriesColors[0],
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${seriesColors[0]}50`,
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
            {data.length} × {activeSeries.length} DATA
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart
            data={data}
            barCategoryGap={groupGap}
            layout={orientation === "horizontal" ? "vertical" : "horizontal"}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: legendPosition === "bottom" ? 20 : 20,
            }}
          >
            {gridVisible && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme.colors.border.light}
                vertical={false}
              />
            )}
            {orientation === "vertical" ? (
              <>
                <XAxis
                  dataKey="label"
                  tick={{ fill: theme.colors.text.muted, fontSize: 11 }}
                  axisLine={{ stroke: theme.colors.border.default }}
                />
                <YAxis
                  tick={{ fill: theme.colors.text.muted, fontSize: 11 }}
                  axisLine={{ stroke: theme.colors.border.default }}
                  domain={[0, maxValue + Math.ceil(maxValue * 0.1)]}
                />
              </>
            ) : (
              <>
                <XAxis
                  type="number"
                  tick={{ fill: theme.colors.text.muted, fontSize: 11 }}
                  axisLine={{ stroke: theme.colors.border.default }}
                />
                <YAxis
                  dataKey="label"
                  type="category"
                  tick={{ fill: theme.colors.text.muted, fontSize: 11 }}
                  axisLine={{ stroke: theme.colors.border.default }}
                  width={70}
                />
              </>
            )}
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(88, 166, 255, 0.06)" }}
            />
            {renderCustomLegend()}
            {activeSeries.map((series, sIndex) => (
              <Bar
                key={series.key}
                dataKey={series.key}
                name={seriesNames[sIndex]}
                fill={seriesColors[sIndex]}
                barSize={barWidth}
                radius={[3, 3, 0, 0]}
                isAnimationActive={true}
                animationDuration={500}
                animationBegin={sIndex * 150}
                hide={!visibleSeries[sIndex]}
              >
                {/* Cell for each bar segment */}
                {data.map((entry, idx) => (
                  <Cell
                    key={`cell-${sIndex}-${idx}`}
                    fill={seriesColors[sIndex]}
                  />
                ))}
                {showValues && (
                  <LabelList
                    dataKey={series.key}
                    position={valuePosition}
                    fill={theme.colors.text.muted}
                    fontSize={9}
                    fontWeight={600}
                  />
                )}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📐 Orientation</label>
          <select
            value={orientation}
            onChange={(e) => setOrientation(e.target.value)}
            style={selectStyle}
          >
            <option value="vertical">Vertical Groups</option>
            <option value="horizontal">Horizontal Groups</option>
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🏷️ Legend Position</label>
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
          <label style={labelStyle}>💬 Value Position</label>
          <select
            value={valuePosition}
            onChange={(e) => setValuePosition(e.target.value)}
            style={selectStyle}
          >
            <option value="top">Top</option>
            <option value="insideTop">Inside Top</option>
            <option value="center">Center</option>
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>
            📊 Active Series: {activeSeriesCount}
          </label>
          <input
            type="range"
            min="1"
            max="4"
            value={activeSeriesCount}
            onChange={(e) => setActiveSeriesCount(Number(e.target.value))}
            style={{ width: "100%", accentColor: seriesColors[0] }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>↔️ Group Gap: {groupGap}px</label>
          <input
            type="range"
            min="0"
            max="80"
            value={groupGap}
            onChange={(e) => setGroupGap(Number(e.target.value))}
            style={{ width: "100%", accentColor: seriesColors[0] }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Bar Width: {barWidth}px</label>
          <input
            type="range"
            min="5"
            max="60"
            value={barWidth}
            onChange={(e) => setBarWidth(Number(e.target.value))}
            style={{ width: "100%", accentColor: seriesColors[0] }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>💬 Show Values</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showValues}
              onChange={(e) => setShowValues(e.target.checked)}
              style={{ accentColor: seriesColors[0] }}
            />
            <span style={{ fontSize: "12px", color: theme.colors.text.body }}>
              Display labels
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
              style={{ accentColor: seriesColors[0] }}
            />
            <span style={{ fontSize: "12px", color: theme.colors.text.body }}>
              Show grid
            </span>
          </label>
        </div>
      </div>

      <div style={seriesLegendStyle}>
        <label style={labelStyle}>
          🎨 Series Settings (click legend items to toggle visibility)
        </label>
        {SERIES_CONFIG.slice(0, activeSeriesCount).map((series, index) => (
          <div key={series.key} style={seriesItemStyle(visibleSeries[index])}>
            <input
              type="checkbox"
              checked={visibleSeries[index]}
              onChange={() => toggleSeries(index)}
              style={{ accentColor: seriesColors[index] }}
            />
            <input
              type="color"
              value={seriesColors[index]}
              onChange={(e) => handleSeriesColorChange(index, e.target.value)}
              style={{
                width: "28px",
                height: "28px",
                border: `1px solid ${theme.colors.border.default}`,
                borderRadius: "3px",
                cursor: "pointer",
                padding: "2px",
              }}
            />
            <input
              type="text"
              value={seriesNames[index]}
              onChange={(e) => handleSeriesNameChange(index, e.target.value)}
              style={{
                ...cellInputStyle,
                flex: 1,
                maxWidth: "200px",
                fontWeight: 600,
                color: seriesColors[index],
              }}
            />
            <span
              style={{
                color: theme.colors.text.muted,
                fontSize: "9px",
                background: theme.colors.inputBg,
                padding: "3px 8px",
                borderRadius: "2px",
              }}
            >
              {series.key}
            </span>
          </div>
        ))}
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
          <label style={labelStyle}>📋 Data Table</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={addDataRow} style={buttonStyle(seriesColors[0])}>
              + Add Row
            </button>
            <button
              onClick={() => setData(DEFAULT_DATA)}
              style={buttonStyle(seriesColors[1])}
            >
              ↺ Reset
            </button>
          </div>
        </div>
        <div id="chart-data-table" style={dataTableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>#</th>
                <th style={thStyle}>Label</th>
                {SERIES_CONFIG.slice(0, activeSeriesCount).map((s, i) => (
                  <th
                    key={s.key}
                    style={{ ...thStyle, color: seriesColors[i] }}
                  >
                    {seriesNames[i]}
                  </th>
                ))}
                <th style={thStyle}>Total</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => {
                const rowTotal = SERIES_CONFIG.slice(
                  0,
                  activeSeriesCount,
                ).reduce((sum, s) => sum + (row[s.key] || 0), 0);
                return (
                  <tr key={rowIndex}>
                    <td
                      style={{
                        ...tdStyle,
                        color: theme.colors.text.muted,
                        fontSize: "10px",
                        width: "30px",
                      }}
                    >
                      {rowIndex + 1}
                    </td>
                    <td style={tdStyle}>
                      <input
                        type="text"
                        value={row.label}
                        onChange={(e) =>
                          handleLabelChange(rowIndex, e.target.value)
                        }
                        style={{ ...cellInputStyle, width: "80px" }}
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
                              ...cellInputStyle,
                              width: "70px",
                              borderColor: visibleSeries[sIndex]
                                ? seriesColors[sIndex] + "50"
                                : theme.colors.border.default,
                            }}
                          />
                        </td>
                      ),
                    )}
                    <td
                      style={{
                        ...tdStyle,
                        color: theme.colors.text.heading,
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                    >
                      {rowTotal}
                    </td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => removeDataRow(rowIndex)}
                        style={deleteButtonStyle}
                        disabled={data.length <= 1}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "10px",
            marginTop: "12px",
          }}
        >
          {SERIES_CONFIG.slice(0, activeSeriesCount).map((s, i) => {
            const seriesTotal = data.reduce(
              (sum, row) => sum + (row[s.key] || 0),
              0,
            );
            const seriesAvg = (seriesTotal / data.length).toFixed(1);
            return (
              <div
                key={s.key}
                style={{
                  padding: "10px 14px",
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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "11px",
                  }}
                >
                  <span style={{ color: theme.colors.text.muted }}>Total:</span>
                  <span
                    style={{
                      color: theme.colors.text.heading,
                      fontWeight: 700,
                    }}
                  >
                    {seriesTotal}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "11px",
                  }}
                >
                  <span style={{ color: theme.colors.text.muted }}>Avg:</span>
                  <span style={{ color: theme.colors.text.heading }}>
                    {seriesAvg}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GroupedBarChartComponent;

