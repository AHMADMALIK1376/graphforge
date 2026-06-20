import React, { useState, useCallback, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { theme } from "../../../styles/theme";

const DEFAULT_DATA = [
  { name: "Category A", segment1: 30, segment2: 20, segment3: 15 },
  { name: "Category B", segment1: 25, segment2: 30, segment3: 10 },
  { name: "Category C", segment1: 15, segment2: 25, segment3: 20 },
];

const COLORS = [
  "#f85149",
  "#58a6ff",
  "#3fb950",
  "#d29922",
  "#a371f7",
  "#79c0ff",
  "#56d364",
  "#ff7b72",
  "#bc8cff",
  "#e3b341",
];

const MarimekkoChartComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#f85149",
}) => {
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Marimekko Chart");
  const [segmentColors, setSegmentColors] = useState(COLORS);
  const [showGrid, setGridVisible] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [showValues, setShowValues] = useState(true);
  const [animation, setAnimation] = useState(true);

  const seriesKeys = useMemo(
    () => Object.keys(data[0] || {}).filter((k) => k !== "name"),
    [data],
  );
  const categoryTotals = useMemo(
    () => data.map((row) => seriesKeys.reduce((s, k) => s + (row[k] || 0), 0)),
    [data, seriesKeys],
  );
  const grandTotal = useMemo(
    () => categoryTotals.reduce((s, v) => s + v, 0),
    [categoryTotals],
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
    const row = { name: `Category ${data.length + 1}` };
    seriesKeys.forEach((k) => (row[k] = Math.floor(Math.random() * 30) + 10));
    setData((prev) => [...prev, row]);
  }, [data, seriesKeys]);
  const removeRow = useCallback((index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((s, e) => s + (e.value || 0), 0);
      const pct = grandTotal > 0 ? ((total / grandTotal) * 100).toFixed(1) : 0;
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
              {e.name}: {e.value}
            </p>
          ))}
          <p style={{ margin: "4px 0 0", fontWeight: 700, color: "#f0f6fc" }}>
            Total: {total} ({pct}%)
          </p>
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
    width: "260px",
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
            }}
          >
            PART-TO-WHOLE
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
            {data.length} × {seriesKeys.length}
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        <ResponsiveContainer width="100%" height={420}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
          >
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={false}
              />
            )}
            <XAxis dataKey="name" tick={{ fill: "#8b949e", fontSize: 10 }} />
            <YAxis tick={{ fill: "#8b949e", fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
            {seriesKeys.map((key, i) => (
              <Bar
                key={key}
                dataKey={key}
                name={key}
                fill={segmentColors[i % segmentColors.length]}
                stackId="stack"
                isAnimationActive={animation}
                animationDuration={500}
              >
                {showValues &&
                  data.map((_, idx) => <Cell key={`cell-${idx}`} />)}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Segment Colors</label>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {segmentColors.slice(0, seriesKeys.length).map((c, i) => (
              <input
                key={i}
                type="color"
                value={c}
                onChange={(e) => {
                  const updated = [...segmentColors];
                  updated[i] = e.target.value;
                  setSegmentColors(updated);
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
          <label style={labelStyle}>🔢 Values</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showValues}
              onChange={(e) => setShowValues(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>Show</span>
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
            + Add Row
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
                  Category
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
                  Total
                </th>
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
                  %
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => {
                const total = seriesKeys.reduce((s, k) => s + (row[k] || 0), 0);
                const pct =
                  grandTotal > 0 ? ((total / grandTotal) * 100).toFixed(1) : 0;
                return (
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
                        style={cellInputStyle("70px")}
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
                          onChange={(e) =>
                            handleDataChange(i, k, e.target.value)
                          }
                          style={cellInputStyle("50px")}
                        />
                      </td>
                    ))}
                    <td
                      style={{
                        padding: "4px 8px",
                        borderBottom: "1px solid #21262d",
                        fontSize: "10px",
                        color: chartColor,
                        fontWeight: 700,
                      }}
                    >
                      {total}
                    </td>
                    <td
                      style={{
                        padding: "4px 8px",
                        borderBottom: "1px solid #21262d",
                        fontSize: "10px",
                        color: "#8b949e",
                      }}
                    >
                      {pct}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MarimekkoChartComponent;
