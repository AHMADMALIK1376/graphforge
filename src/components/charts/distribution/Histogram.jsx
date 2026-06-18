import React, { useState, useCallback, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { theme } from "../../../styles/theme";

const generateData = () => {
  const raw = Array.from({ length: 100 }, () =>
    Math.floor(Math.random() * 100),
  );
  return raw;
};

const HistogramComponent = ({ initialData = null, chartColor = "#d29922" }) => {
  const [rawData, setRawData] = useState(generateData());
  const [titleText, setTitleText] = useState("Histogram");
  const [binCount, setBinCount] = useState(10);
  const [barColor, setBarColor] = useState(chartColor);
  const [showValues, setShowValues] = useState(true);
  const [showGrid, setGridVisible] = useState(true);
  const [animation, setAnimation] = useState(true);

  const histogramData = useMemo(() => {
    const min = Math.min(...rawData);
    const max = Math.max(...rawData);
    const binWidth = (max - min) / binCount;
    const bins = Array.from({ length: binCount }, (_, i) => ({
      range: `${(min + i * binWidth).toFixed(0)}-${(min + (i + 1) * binWidth).toFixed(0)}`,
      count: 0,
      min: min + i * binWidth,
      max: min + (i + 1) * binWidth,
    }));
    rawData.forEach((val) => {
      const idx = Math.min(Math.floor((val - min) / binWidth), binCount - 1);
      bins[idx].count++;
    });
    return bins;
  }, [rawData, binCount]);

  const stats = useMemo(() => {
    const n = rawData.length;
    const sum = rawData.reduce((s, v) => s + v, 0);
    const mean = sum / n;
    const sorted = [...rawData].sort((a, b) => a - b);
    const median =
      n % 2 === 0
        ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
        : sorted[Math.floor(n / 2)];
    const variance = rawData.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
    const stdDev = Math.sqrt(variance);
    return { mean, median, stdDev, min: sorted[0], max: sorted[n - 1], n };
  }, [rawData]);

  const regenerateData = useCallback(() => {
    setRawData(
      Array.from({ length: 100 }, () => Math.floor(Math.random() * 100)),
    );
  }, []);
  const addValue = useCallback(() => {
    setRawData((prev) => [...prev, Math.floor(Math.random() * 100)]);
  }, []);
  const clearData = useCallback(() => {
    setRawData([]);
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0]?.payload;
      return (
        <div style={tooltipStyle}>
          <p style={{ fontWeight: 700, margin: "0 0 4px", color: "#f0f6fc" }}>
            {d.range}
          </p>
          <p style={{ margin: 0, color: barColor }}>Count: {d.count}</p>
          <p style={{ margin: 0, color: "#8b949e", fontSize: "9px" }}>
            Range: {d.min.toFixed(0)} - {d.max.toFixed(0)}
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
    borderBottom: `2px solid ${barColor}`,
    color: theme.colors.text.heading,
    fontSize: "20px",
    fontWeight: 700,
    fontFamily: theme.typography.fontFamily.primary,
    letterSpacing: "2px",
    outline: "none",
    padding: "4px 0",
    width: "200px",
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
  const buttonStyle = (c = barColor) => ({
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
  const tooltipStyle = {
    background: theme.colors.cardBg,
    border: "1px solid #30363d",
    borderRadius: "4px",
    padding: "10px 14px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
    fontSize: "11px",
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
              color: barColor,
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${barColor}50`,
              borderRadius: "3px",
              fontWeight: 600,
            }}
          >
            DISTRIBUTION
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
            {rawData.length} VALUES
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        <ResponsiveContainer width="100%" height={420}>
          <BarChart
            data={histogramData}
            margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
          >
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={false}
              />
            )}
            <XAxis
              dataKey="range"
              tick={{ fill: "#8b949e", fontSize: 9 }}
              angle={-30}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fill: "#8b949e", fontSize: 10 }} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(210,153,34,0.1)" }}
            />
            <Bar
              dataKey="count"
              fill={barColor}
              radius={[3, 3, 0, 0]}
              isAnimationActive={animation}
              animationDuration={600}
            >
              {showValues && (
                <LabelList
                  dataKey="count"
                  position="top"
                  fill="#8b949e"
                  fontSize={9}
                  fontWeight={600}
                />
              )}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Bar Color</label>
          <input
            type="color"
            value={barColor}
            onChange={(e) => setBarColor(e.target.value)}
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
          <label style={labelStyle}>📊 Bins: {binCount}</label>
          <input
            type="range"
            min="5"
            max="30"
            value={binCount}
            onChange={(e) => setBinCount(Number(e.target.value))}
            style={{ width: "100%", accentColor: barColor }}
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
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>On bars</span>
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
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>
              Show grid
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
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>Animate</span>
          </label>
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
          border: "1px solid #30363d",
          fontSize: "10px",
        }}
      >
        <span style={{ color: "#8b949e" }}>
          Mean:{" "}
          <strong style={{ color: barColor }}>{stats.mean.toFixed(2)}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Median:{" "}
          <strong style={{ color: "#f0f6fc" }}>
            {stats.median.toFixed(2)}
          </strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Std Dev:{" "}
          <strong style={{ color: "#f0f6fc" }}>
            {stats.stdDev.toFixed(2)}
          </strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Min: <strong style={{ color: "#f85149" }}>{stats.min}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Max: <strong style={{ color: "#3fb950" }}>{stats.max}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Count: <strong style={{ color: "#f0f6fc" }}>{stats.n}</strong>
        </span>
      </div>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button onClick={regenerateData} style={buttonStyle()}>
          🔄 Regenerate
        </button>
        <button onClick={addValue} style={buttonStyle("#3fb950")}>
          + Add Value
        </button>
        <button onClick={clearData} style={buttonStyle("#f85149")}>
          ✕ Clear
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
                #
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
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {rawData.slice(0, 50).map((v, i) => (
              <tr key={i}>
                <td
                  style={{
                    padding: "4px 8px",
                    borderBottom: "1px solid #21262d",
                    fontSize: "10px",
                    color: "#484f58",
                  }}
                >
                  {i + 1}
                </td>
                <td
                  style={{
                    padding: "4px 8px",
                    borderBottom: "1px solid #21262d",
                    fontSize: "10px",
                    color: barColor,
                    fontWeight: 600,
                  }}
                >
                  {v}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistogramComponent;
