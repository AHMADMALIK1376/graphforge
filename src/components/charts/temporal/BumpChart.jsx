import React, { useState, useCallback, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { theme } from "../../../styles/theme";

const DEFAULT_DATA = [
  { name: "2020", rank1: 1, rank2: 3, rank3: 5 },
  { name: "2021", rank1: 2, rank2: 1, rank3: 4 },
  { name: "2022", rank1: 3, rank2: 2, rank3: 1 },
  { name: "2023", rank1: 4, rank2: 1, rank3: 2 },
  { name: "2024", rank1: 2, rank2: 3, rank3: 4 },
];

const COLORS = ["#a371f7", "#58a6ff", "#3fb950", "#f85149", "#d29922"];

const BumpChartComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#a371f7",
}) => {
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Bump Chart");
  const [seriesColors, setSeriesColors] = useState(COLORS);
  const [lineWidth, setLineWidth] = useState(3);
  const [dotSize, setDotSize] = useState(8);
  const [showDots, setShowDots] = useState(true);
  const [showGrid, setGridVisible] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [animation, setAnimation] = useState(true);

  const seriesKeys = useMemo(
    () => Object.keys(data[0] || {}).filter((k) => k !== "name"),
    [data],
  );

  const handleDataChange = useCallback((rowIndex, key, newValue) => {
    setData((prev) => {
      const updated = [...prev];
      updated[rowIndex] = {
        ...updated[rowIndex],
        [key]: Number(newValue) || 0,
      };
      return updated;
    });
  }, []);

  const handleNameChange = useCallback((index, newName) => {
    setData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], name: newName };
      return updated;
    });
  }, []);

  const addRow = useCallback(() => {
    const row = { name: `Year ${data.length + 1}` };
    seriesKeys.forEach((k) => (row[k] = Math.floor(Math.random() * 5) + 1));
    setData((prev) => [...prev, row]);
  }, [data, seriesKeys]);

  const removeRow = useCallback((index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: theme.colors.cardBg,
            border: "1px solid #30363d",
            borderRadius: "4px",
            padding: "10px 14px",
            fontSize: "11px",
          }}
        >
          <p style={{ fontWeight: 700, color: "#f0f6fc", margin: "0 0 4px" }}>
            {label}
          </p>
          {payload.map((e, i) => (
            <p key={i} style={{ margin: "0 0 2px", color: e.color }}>
              {e.name}: Rank #{e.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

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
    padding: "24px 16px",
    border: "1px solid #30363d",
    minHeight: "450px",
  };
  const controlsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "14px",
    background: theme.colors.cardBg,
    padding: "16px",
    borderRadius: "4px",
    border: "1px solid #30363d",
  };
  const controlGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  };
  const labelStyle = {
    color: "#8b949e",
    fontSize: "10px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "2px",
  };
  const checkboxStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
  };
  const cellInputStyle = (w = "55px") => ({
    padding: "4px 5px",
    background: theme.colors.inputBg,
    border: "1px solid #30363d",
    borderRadius: "3px",
    color: theme.colors.text.body,
    fontSize: "10px",
    fontFamily: theme.typography.fontFamily.primary,
    width: w,
    outline: "none",
    boxSizing: "border-box",
  });
  const buttonStyle = (c = chartColor) => ({
    padding: "6px 12px",
    background: "transparent",
    border: `1px solid ${c}`,
    borderRadius: "3px",
    color: c,
    cursor: "pointer",
    fontSize: "10px",
    fontFamily: theme.typography.fontFamily.primary,
    fontWeight: 600,
    letterSpacing: "1px",
    textTransform: "uppercase",
  });

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
              color: chartColor,
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${chartColor}50`,
              borderRadius: "3px",
              fontWeight: 600,
            }}
          >
            TEMPORAL
          </span>
          <span
            style={{
              color: "#8b949e",
              fontSize: "10px",
              padding: "4px 10px",
              border: "1px solid #30363d",
              borderRadius: "3px",
            }}
          >
            {data.length} YEARS
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        <ResponsiveContainer width="100%" height={420}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
          >
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            )}
            <XAxis dataKey="name" tick={{ fill: "#8b949e", fontSize: 10 }} />
            <YAxis domain={[5, 1]} tick={{ fill: "#8b949e", fontSize: 10 }} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#30363d",
                strokeWidth: 1,
                strokeDasharray: "3 3",
              }}
            />
            {showLegend && <Legend />}
            {seriesKeys.map((key, i) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={key}
                stroke={seriesColors[i % seriesColors.length]}
                strokeWidth={lineWidth}
                dot={
                  showDots
                    ? {
                        r: dotSize,
                        fill: seriesColors[i % seriesColors.length],
                        stroke: "#fff",
                        strokeWidth: 2,
                      }
                    : false
                }
                activeDot={{
                  r: dotSize + 4,
                  fill: seriesColors[i % seriesColors.length],
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
                isAnimationActive={animation}
                animationDuration={600}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Series Colors</label>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {seriesColors.slice(0, seriesKeys.length).map((c, i) => (
              <input
                key={i}
                type="color"
                value={c}
                onChange={(e) => {
                  const updated = [...seriesColors];
                  updated[i] = e.target.value;
                  setSeriesColors(updated);
                }}
                style={{
                  width: "28px",
                  height: "28px",
                  cursor: "pointer",
                  border: "none",
                  borderRadius: "2px",
                }}
              />
            ))}
          </div>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Line Width: {lineWidth}</label>
          <input
            type="range"
            min="1"
            max="5"
            step="0.5"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔵 Dot Size: {dotSize}</label>
          <input
            type="range"
            min="4"
            max="14"
            value={dotSize}
            onChange={(e) => setDotSize(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>⚫ Show Dots</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showDots}
              onChange={(e) => setShowDots(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>Show</span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔲 Grid</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setGridVisible(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>Show</span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📋 Legend</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showLegend}
              onChange={(e) => setShowLegend(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>Show</span>
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

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <label style={labelStyle}>📋 Data</label>
          <button onClick={addRow} style={buttonStyle()}>
            + Add Year
          </button>
        </div>
        <div
          id="chart-data-table"
          style={{
            background: theme.colors.cardBg,
            borderRadius: "4px",
            border: "1px solid #30363d",
            overflow: "auto",
            maxHeight: "250px",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th
                  style={{
                    background: "#0d1117",
                    color: "#8b949e",
                    padding: "6px 8px",
                    fontSize: "9px",
                    fontWeight: 700,
                    borderBottom: "2px solid #30363d",
                    position: "sticky",
                    top: 0,
                  }}
                >
                  Year
                </th>
                {seriesKeys.map((k) => (
                  <th
                    key={k}
                    style={{
                      background: "#0d1117",
                      color: "#8b949e",
                      padding: "6px 8px",
                      fontSize: "9px",
                      fontWeight: 700,
                      borderBottom: "2px solid #30363d",
                      position: "sticky",
                      top: 0,
                    }}
                  >
                    {k}
                  </th>
                ))}
                <th
                  style={{
                    background: "#0d1117",
                    color: "#8b949e",
                    padding: "6px 8px",
                    fontSize: "9px",
                    fontWeight: 700,
                    borderBottom: "2px solid #30363d",
                    position: "sticky",
                    top: 0,
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  <td
                    style={{
                      padding: "4px 8px",
                      borderBottom: "1px solid #21262d",
                      fontSize: "10px",
                    }}
                  >
                    <input
                      type="text"
                      value={row.name}
                      onChange={(e) => handleNameChange(i, e.target.value)}
                      style={cellInputStyle("60px")}
                    />
                  </td>
                  {seriesKeys.map((k) => (
                    <td
                      key={k}
                      style={{
                        padding: "4px 8px",
                        borderBottom: "1px solid #21262d",
                        fontSize: "10px",
                      }}
                    >
                      <input
                        type="number"
                        value={row[k] || 0}
                        onChange={(e) => handleDataChange(i, k, e.target.value)}
                        style={cellInputStyle("50px")}
                        min="1"
                        max="5"
                      />
                    </td>
                  ))}
                  <td
                    style={{
                      padding: "4px 8px",
                      borderBottom: "1px solid #21262d",
                      fontSize: "10px",
                    }}
                  >
                    <button
                      onClick={() => removeRow(i)}
                      style={{
                        padding: "2px 6px",
                        background: "transparent",
                        border: "1px solid #f85149",
                        borderRadius: "2px",
                        color: "#f85149",
                        cursor: "pointer",
                        fontSize: "9px",
                      }}
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
    </div>
  );
};

export default BumpChartComponent;
