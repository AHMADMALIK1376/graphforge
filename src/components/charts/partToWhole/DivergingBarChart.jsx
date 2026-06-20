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
  ReferenceLine,
} from "recharts";
import { theme } from "../../../styles/theme";

const DEFAULT_DATA = [
  { name: "Question 1", positive: 65, negative: 35 },
  { name: "Question 2", positive: 45, negative: 55 },
  { name: "Question 3", positive: 75, negative: 25 },
  { name: "Question 4", positive: 30, negative: 70 },
  { name: "Question 5", positive: 55, negative: 45 },
  { name: "Question 6", positive: 80, negative: 20 },
];

const DivergingBarChartComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#f85149",
}) => {
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Diverging Bar Chart");
  const [positiveColor, setPositiveColor] = useState("#3fb950");
  const [negativeColor, setNegativeColor] = useState(chartColor);
  const [showValues, setShowValues] = useState(true);
  const [showGrid, setGridVisible] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [animation, setAnimation] = useState(true);

  const handleDataChange = useCallback((index, field, newValue) => {
    setData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: Number(newValue) || 0 };
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
    setData((prev) => [
      ...prev,
      {
        name: `Item ${prev.length + 1}`,
        positive: Math.floor(Math.random() * 80) + 10,
        negative: Math.floor(Math.random() * 80) + 10,
      },
    ]);
  }, []);
  const removeRow = useCallback((index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const chartData = useMemo(
    () => data.map((d) => ({ ...d, negative: -d.negative })),
    [data],
  );

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0]?.payload;
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
            {d.name}
          </p>
          <p style={{ margin: 0, color: positiveColor }}>
            Positive: {d.positive}
          </p>
          <p style={{ margin: 0, color: negativeColor }}>
            Negative: {Math.abs(d.negative)}
          </p>
          <p style={{ margin: "4px 0 0", color: "#8b949e", fontSize: "9px" }}>
            Net: {d.positive + d.negative}
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
    width: "280px",
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
            {data.length} ITEMS
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        <ResponsiveContainer width="100%" height={420}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
          >
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                horizontal={false}
              />
            )}
            <XAxis
              type="number"
              tick={{ fill: "#8b949e", fontSize: 10 }}
              tickFormatter={(v) => Math.abs(v)}
              domain={[-100, 100]}
            />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fill: "#8b949e", fontSize: 10 }}
              width={80}
            />
            <ReferenceLine x={0} stroke="#30363d" strokeWidth={2} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(0,0,0,0.05)" }}
            />
            {showLegend && <Legend />}
            <Bar
              dataKey="positive"
              name="Positive"
              fill={positiveColor}
              barSize={16}
              isAnimationActive={animation}
              animationDuration={500}
            />
            <Bar
              dataKey="negative"
              name="Negative"
              fill={negativeColor}
              barSize={16}
              isAnimationActive={animation}
              animationDuration={500}
              animationBegin={200}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🟢 Positive Color</label>
          <input
            type="color"
            value={positiveColor}
            onChange={(e) => setPositiveColor(e.target.value)}
            style={{
              width: "36px",
              height: "32px",
              cursor: "pointer",
              border: "1px solid #30363d",
              borderRadius: "3px",
              padding: "2px",
            }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔴 Negative Color</label>
          <input
            type="color"
            value={negativeColor}
            onChange={(e) => setNegativeColor(e.target.value)}
            style={{
              width: "36px",
              height: "32px",
              cursor: "pointer",
              border: "1px solid #30363d",
              borderRadius: "3px",
              padding: "2px",
            }}
          />
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
                  Name
                </th>
                <th
                  style={{
                    background: "#0d1117",
                    color: positiveColor,
                    padding: "6px 8px",
                    fontSize: "9px",
                    fontWeight: 700,
                    borderBottom: "2px solid #30363d",
                    position: "sticky",
                    top: 0,
                  }}
                >
                  Positive
                </th>
                <th
                  style={{
                    background: "#0d1117",
                    color: negativeColor,
                    padding: "6px 8px",
                    fontSize: "9px",
                    fontWeight: 700,
                    borderBottom: "2px solid #30363d",
                    position: "sticky",
                    top: 0,
                  }}
                >
                  Negative
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
                  Net
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => {
                const net = row.positive - row.negative;
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
                    <td
                      style={{
                        padding: "4px 8px",
                        borderBottom: "1px solid #21262d",
                        fontSize: "10px",
                      }}
                    >
                      <input
                        type="number"
                        value={row.positive}
                        onChange={(e) =>
                          handleDataChange(i, "positive", e.target.value)
                        }
                        style={cellInputStyle("50px")}
                        min="0"
                      />
                    </td>
                    <td
                      style={{
                        padding: "4px 8px",
                        borderBottom: "1px solid #21262d",
                        fontSize: "10px",
                      }}
                    >
                      <input
                        type="number"
                        value={row.negative}
                        onChange={(e) =>
                          handleDataChange(i, "negative", e.target.value)
                        }
                        style={cellInputStyle("50px")}
                        min="0"
                      />
                    </td>
                    <td
                      style={{
                        padding: "4px 8px",
                        borderBottom: "1px solid #21262d",
                        fontSize: "10px",
                        color: net > 0 ? positiveColor : negativeColor,
                        fontWeight: 700,
                      }}
                    >
                      {net}
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

export default DivergingBarChartComponent;
