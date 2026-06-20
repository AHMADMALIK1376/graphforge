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
// DEFAULT DATA
// ============================================
const DEFAULT_DATA = [
  { label: "Q1", value: 100 },
  { label: "Q2", value: 150 },
  { label: "Q3", value: 120 },
  { label: "Q4", value: 180 },
  { label: "Q5", value: 90 },
  { label: "Q6", value: 200 },
];

const DEFAULT_STACKED_DATA = [
  { label: "Q1", series1: 60, series2: 40 },
  { label: "Q2", series1: 80, series2: 70 },
  { label: "Q3", series1: 50, series2: 70 },
  { label: "Q4", series1: 90, series2: 90 },
];

const COLOR_PRESETS = [
  "#58a6ff",
  "#3fb950",
  "#f85149",
  "#a371f7",
  "#d29922",
  "#79c0ff",
  "#56d364",
  "#ff7b72",
  "#bc8cff",
  "#e3b341",
  "#1f6feb",
  "#238636",
  "#da3633",
  "#7c3aed",
  "#9e6a03",
];

const ColumnChartComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#58a6ff",
}) => {
  const [data, setData] = useState(initialData);
  const [stackedData, setStackedData] = useState(DEFAULT_STACKED_DATA);
  const [color, setColor] = useState(chartColor);
  const [colorMode, setColorMode] = useState("uniform");
  const [columnGap, setColumnGap] = useState(20);
  const [columnWidth, setColumnWidth] = useState(40);
  const [show3D, setShow3D] = useState(false);
  const [stackedMode, setStackedMode] = useState(false);
  const [showValues, setShowValues] = useState(true);
  const [gridVisible, setGridVisible] = useState(true);
  const [titleText, setTitleText] = useState("Column Chart");
  const [individualColors, setIndividualColors] = useState(
    COLOR_PRESETS.slice(0, 6),
  );
  const [seriesColors, setSeriesColors] = useState(["#58a6ff", "#f85149"]);

  const activeData = stackedMode ? stackedData : data;
  const maxValue = useMemo(() => {
    if (stackedMode)
      return Math.max(
        ...stackedData.map((d) => (d.series1 || 0) + (d.series2 || 0)),
        10,
      );
    return Math.max(...data.map((d) => d.value), 10);
  }, [data, stackedData, stackedMode]);

  const handleDataChange = useCallback(
    (index, field, newValue) => {
      if (stackedMode) {
        setStackedData((prev) => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            [field]: Number(newValue) || 0,
          };
          return updated;
        });
      } else {
        setData((prev) => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            [field]: field === "value" ? Number(newValue) || 0 : newValue,
          };
          return updated;
        });
      }
    },
    [stackedMode],
  );
  const addDataRow = useCallback(() => {
    if (stackedMode)
      setStackedData((prev) => [
        ...prev,
        { label: `Q${prev.length + 1}`, series1: 50, series2: 50 },
      ]);
    else
      setData((prev) => [...prev, { label: `Q${prev.length + 1}`, value: 50 }]);
  }, [stackedMode]);
  const removeDataRow = useCallback(
    (index) => {
      if (stackedMode)
        setStackedData((prev) => prev.filter((_, i) => i !== index));
      else setData((prev) => prev.filter((_, i) => i !== index));
    },
    [stackedMode],
  );
  const handleIndividualColorChange = (index, newColor) => {
    const updated = [...individualColors];
    updated[index] = newColor;
    setIndividualColors(updated);
  };
  const get3DStyle = (baseColor, index) => {
    if (!show3D) return {};
    return { filter: `drop-shadow(2px 3px 3px rgba(0,0,0,0.3))` };
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length)
      return (
        <div style={tooltipContainerStyle}>
          <p style={tooltipLabelStyle}>{label}</p>
          {payload.map((entry, i) => (
            <p key={i} style={tooltipValueStyle}>
              {entry.name}:{" "}
              <span style={{ color: entry.color, fontWeight: 700 }}>
                {entry.value}
              </span>
            </p>
          ))}
          {!stackedMode && (
            <p style={tooltipPercentStyle}>
              {((payload[0].value / maxValue) * 100).toFixed(1)}% of max
            </p>
          )}
        </div>
      );
    return null;
  };

  const renderColumns = () => {
    if (stackedMode)
      return (
        <>
          <Bar
            dataKey="series1"
            name="Series 1"
            stackId="stack"
            fill={seriesColors[0]}
            barSize={columnWidth}
            radius={[0, 0, 0, 0]}
            isAnimationActive={true}
            animationDuration={600}
          >
            {showValues && (
              <LabelList
                dataKey="series1"
                position="inside"
                fill="#fff"
                fontSize={10}
              />
            )}
          </Bar>
          <Bar
            dataKey="series2"
            name="Series 2"
            stackId="stack"
            fill={seriesColors[1]}
            barSize={columnWidth}
            radius={[4, 4, 0, 0]}
            isAnimationActive={true}
            animationDuration={600}
            animationBegin={200}
          >
            {showValues && (
              <LabelList
                dataKey="series2"
                position="inside"
                fill="#fff"
                fontSize={10}
              />
            )}
          </Bar>
        </>
      );
    if (colorMode === "gradient")
      return (
        <Bar
          dataKey="value"
          barSize={columnWidth}
          radius={[4, 4, 0, 0]}
          isAnimationActive={true}
          animationDuration={600}
        >
          {data.map((entry, index) => {
            const alpha = 1 - index * 0.12;
            return (
              <Cell
                key={`cell-${index}`}
                fill={color}
                fillOpacity={Math.max(0.3, alpha)}
                style={get3DStyle(color, index)}
              />
            );
          })}
          {showValues && (
            <LabelList
              dataKey="value"
              position="top"
              fill={theme.colors.text.body}
              fontSize={11}
              fontWeight={600}
            />
          )}
        </Bar>
      );
    return (
      <Bar
        dataKey="value"
        barSize={columnWidth}
        radius={[4, 4, 0, 0]}
        isAnimationActive={true}
        animationDuration={600}
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={
              colorMode === "individual"
                ? individualColors[index % individualColors.length]
                : color
            }
            style={{
              ...get3DStyle(
                colorMode === "individual"
                  ? individualColors[index % individualColors.length]
                  : color,
                index,
              ),
              cursor: "pointer",
              transition: "filter 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.filter = "brightness(1.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.filter = show3D
                ? "drop-shadow(2px 3px 3px rgba(0,0,0,0.3))"
                : "brightness(1)";
            }}
          />
        ))}
        {showValues && (
          <LabelList
            dataKey="value"
            position="top"
            fill={theme.colors.text.body}
            fontSize={11}
            fontWeight={600}
          />
        )}
      </Bar>
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
    borderBottom: `2px solid ${color}`,
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
  const dataTableContainerStyle = {
    background: theme.colors.cardBg,
    borderRadius: "4px",
    border: `1px solid ${theme.colors.border.default}`,
    overflow: "auto",
    maxHeight: "300px",
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
    padding: "6px 12px",
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
  const buttonStyle = {
    padding: "8px 16px",
    background: "transparent",
    border: `1px solid ${color}`,
    borderRadius: "3px",
    color: color,
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
  const tooltipContainerStyle = {
    background: theme.colors.cardBg,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: "4px",
    padding: "12px 16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
  };
  const tooltipLabelStyle = {
    color: theme.colors.text.heading,
    fontSize: "12px",
    fontWeight: 700,
    margin: "0 0 4px 0",
    textTransform: "uppercase",
    letterSpacing: "1px",
  };
  const tooltipValueStyle = {
    color: theme.colors.text.body,
    fontSize: "14px",
    margin: "0 0 2px 0",
  };
  const tooltipPercentStyle = {
    color: theme.colors.text.muted,
    fontSize: "10px",
    margin: 0,
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
              color: color,
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${color}50`,
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
            {activeData.length} ITEMS
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        <ResponsiveContainer width="100%" height={420}>
          <BarChart
            data={activeData}
            barCategoryGap={columnGap}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
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
              tick={{ fill: theme.colors.text.muted, fontSize: 11 }}
              axisLine={{ stroke: theme.colors.border.default }}
            />
            <YAxis
              tick={{ fill: theme.colors.text.muted, fontSize: 11 }}
              axisLine={{ stroke: theme.colors.border.default }}
              domain={[0, maxValue + Math.ceil(maxValue * 0.1)]}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(88, 166, 255, 0.08)" }}
            />
            <Legend
              wrapperStyle={{
                color: theme.colors.text.body,
                fontSize: "11px",
                fontFamily: theme.typography.fontFamily.primary,
              }}
            />
            {renderColumns()}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📌 Column Color</label>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <input
              type="color"
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
                setColorMode("uniform");
              }}
              style={{
                width: "36px",
                height: "36px",
                border: `1px solid ${theme.colors.border.default}`,
                borderRadius: "3px",
                cursor: "pointer",
                padding: "2px",
                background: theme.colors.inputBg,
              }}
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ ...cellInputStyle, width: "100px" }}
            />
          </div>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Color Mode</label>
          <select
            value={colorMode}
            onChange={(e) => setColorMode(e.target.value)}
            style={selectStyle}
          >
            <option value="uniform">Uniform Color</option>
            <option value="individual">Individual Colors</option>
            <option value="gradient">Gradient Fade</option>
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📚 Stacked Mode</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={stackedMode}
              onChange={(e) => setStackedMode(e.target.checked)}
              style={{ accentColor: color }}
            />
            <span style={{ fontSize: "12px", color: theme.colors.text.body }}>
              Enable stacking
            </span>
          </label>
        </div>
        {stackedMode && (
          <div style={controlGroupStyle}>
            <label style={labelStyle}>🎨 Series Colors</label>
            <div style={{ display: "flex", gap: "4px" }}>
              <input
                type="color"
                value={seriesColors[0] || "#58a6ff"}
                onChange={(e) =>
                  setSeriesColors([
                    e.target.value,
                    seriesColors[1] || "#f85149",
                  ])
                }
                style={{
                  width: "28px",
                  height: "28px",
                  cursor: "pointer",
                  border: "1px solid #30363d",
                  borderRadius: "3px",
                  padding: "2px",
                }}
              />
              <input
                type="color"
                value={seriesColors[1] || "#f85149"}
                onChange={(e) =>
                  setSeriesColors([
                    seriesColors[0] || "#58a6ff",
                    e.target.value,
                  ])
                }
                style={{
                  width: "28px",
                  height: "28px",
                  cursor: "pointer",
                  border: "1px solid #30363d",
                  borderRadius: "3px",
                  padding: "2px",
                }}
              />
            </div>
          </div>
        )}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎯 3D Effect</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={show3D}
              onChange={(e) => setShow3D(e.target.checked)}
              style={{ accentColor: color }}
            />
            <span style={{ fontSize: "12px", color: theme.colors.text.body }}>
              Drop shadow
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>↔️ Gap: {columnGap}px</label>
          <input
            type="range"
            min="0"
            max="60"
            value={columnGap}
            onChange={(e) => setColumnGap(Number(e.target.value))}
            style={{ width: "100%", accentColor: color }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Width: {columnWidth}px</label>
          <input
            type="range"
            min="10"
            max="100"
            value={columnWidth}
            onChange={(e) => setColumnWidth(Number(e.target.value))}
            style={{ width: "100%", accentColor: color }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>💬 Value Labels</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showValues}
              onChange={(e) => setShowValues(e.target.checked)}
              style={{ accentColor: color }}
            />
            <span style={{ fontSize: "12px", color: theme.colors.text.body }}>
              Show on columns
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
              style={{ accentColor: color }}
            />
            <span style={{ fontSize: "12px", color: theme.colors.text.body }}>
              Show grid
            </span>
          </label>
        </div>
      </div>

      {colorMode === "individual" && !stackedMode && (
        <div
          style={{
            background: theme.colors.cardBg,
            padding: "12px 16px",
            borderRadius: "4px",
            border: `1px solid ${theme.colors.border.default}`,
          }}
        >
          <label style={labelStyle}>🎨 Individual Column Colors</label>
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              marginTop: "8px",
            }}
          >
            {data.map((row, index) => (
              <input
                key={index}
                type="color"
                value={individualColors[index] || color}
                onChange={(e) =>
                  handleIndividualColorChange(index, e.target.value)
                }
                title={`${row.label} color`}
                style={{
                  width: "32px",
                  height: "32px",
                  border: `1px solid ${theme.colors.border.default}`,
                  borderRadius: "3px",
                  cursor: "pointer",
                  padding: "2px",
                }}
              />
            ))}
          </div>
        </div>
      )}

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
            <button onClick={addDataRow} style={buttonStyle}>
              + Add Row
            </button>
            <button
              onClick={() => {
                setData(DEFAULT_DATA);
                setStackedData(DEFAULT_STACKED_DATA);
              }}
              style={buttonStyle}
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
                {stackedMode ? (
                  <>
                    <th style={thStyle}>Series 1</th>
                    <th style={thStyle}>Series 2</th>
                    <th style={thStyle}>Total</th>
                  </>
                ) : (
                  <>
                    <th style={thStyle}>Value</th>
                    <th style={thStyle}>% of Max</th>
                  </>
                )}
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {activeData.map((row, index) => (
                <tr key={index}>
                  <td
                    style={{
                      ...tdStyle,
                      color: theme.colors.text.muted,
                      fontSize: "10px",
                    }}
                  >
                    {index + 1}
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      value={row.label}
                      onChange={(e) =>
                        handleDataChange(index, "label", e.target.value)
                      }
                      style={cellInputStyle}
                    />
                  </td>
                  {stackedMode ? (
                    <>
                      <td style={tdStyle}>
                        <input
                          type="number"
                          value={row.series1}
                          onChange={(e) =>
                            handleDataChange(index, "series1", e.target.value)
                          }
                          style={cellInputStyle}
                        />
                      </td>
                      <td style={tdStyle}>
                        <input
                          type="number"
                          value={row.series2}
                          onChange={(e) =>
                            handleDataChange(index, "series2", e.target.value)
                          }
                          style={cellInputStyle}
                        />
                      </td>
                      <td style={{ ...tdStyle, color: color, fontWeight: 700 }}>
                        {(row.series1 || 0) + (row.series2 || 0)}
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={tdStyle}>
                        <input
                          type="number"
                          value={row.value}
                          onChange={(e) =>
                            handleDataChange(index, "value", e.target.value)
                          }
                          style={cellInputStyle}
                        />
                      </td>
                      <td style={{ ...tdStyle }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <div
                            style={{
                              flex: 1,
                              height: "6px",
                              background: theme.colors.border.light,
                              borderRadius: "3px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${(row.value / maxValue) * 100}%`,
                                height: "100%",
                                background: color,
                                borderRadius: "3px",
                              }}
                            />
                          </div>
                          <span
                            style={{
                              fontSize: "10px",
                              color: theme.colors.text.muted,
                            }}
                          >
                            {((row.value / maxValue) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                    </>
                  )}
                  <td style={tdStyle}>
                    <button
                      onClick={() => removeDataRow(index)}
                      style={deleteButtonStyle}
                      disabled={activeData.length <= 1}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
          }}
        >
          {stackedMode ? (
            <>
              <span style={{ color: theme.colors.text.muted }}>
                Series 1 Total:{" "}
                <strong style={{ color: seriesColors[0] }}>
                  {stackedData.reduce((s, d) => s + (d.series1 || 0), 0)}
                </strong>
              </span>
              <span style={{ color: theme.colors.text.muted }}>
                Series 2 Total:{" "}
                <strong style={{ color: seriesColors[1] }}>
                  {stackedData.reduce((s, d) => s + (d.series2 || 0), 0)}
                </strong>
              </span>
            </>
          ) : (
            <>
              <span style={{ color: theme.colors.text.muted }}>
                Total:{" "}
                <strong style={{ color: theme.colors.text.heading }}>
                  {data.reduce((sum, d) => sum + d.value, 0)}
                </strong>
              </span>
              <span style={{ color: theme.colors.text.muted }}>
                Average:{" "}
                <strong style={{ color: color }}>
                  {(
                    data.reduce((sum, d) => sum + d.value, 0) / data.length
                  ).toFixed(1)}
                </strong>
              </span>
            </>
          )}
          <span style={{ color: theme.colors.text.muted }}>
            Max:{" "}
            <strong style={{ color: theme.colors.charts[2] }}>
              {maxValue}
            </strong>
          </span>
          <span style={{ color: theme.colors.text.muted }}>
            Items:{" "}
            <strong style={{ color: theme.colors.text.heading }}>
              {activeData.length}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ColumnChartComponent;

