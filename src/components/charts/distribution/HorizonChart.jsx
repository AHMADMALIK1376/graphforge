import React, { useState, useCallback, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { theme } from "../../../styles/theme";

const generateData = () =>
  Array.from({ length: 60 }, (_, i) => ({
    x: i,
    value: Math.sin(i / 5) * 50 + Math.random() * 30,
  }));

const HorizonChartComponent = ({
  initialData = null,
  chartColor = "#d29922",
}) => {
  const [data, setData] = useState(generateData());
  const [titleText, setTitleText] = useState("Horizon Chart");
  const [bands, setBands] = useState(4);
  const [bandColor, setBandColor] = useState(chartColor);
  const [showGrid, setGridVisible] = useState(true);
  const [animation, setAnimation] = useState(true);

  const bandData = useMemo(() => {
    const maxVal = Math.max(...data.map((d) => Math.abs(d.value)));
    const bandHeight = maxVal / bands;
    const result = [];
    for (let b = 0; b < bands; b++) {
      const threshold = bandHeight * (b + 1);
      result.push({
        band: b,
        threshold,
        data: data.map((d) => ({
          x: d.x,
          value: Math.min(Math.abs(d.value), threshold) - b * bandHeight,
          color: d.value >= 0 ? bandColor : "#f85149",
        })),
      });
    }
    return result;
  }, [data, bands, bandColor]);

  const regenerate = useCallback(() => {
    setData(generateData());
  }, []);

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
    borderBottom: `2px solid ${bandColor}`,
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
    padding: "16px",
    border: "1px solid #30363d",
    minHeight: "420px",
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
  const buttonStyle = (c = bandColor) => ({
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
          <span style={{ fontSize: "28px" }}>🌅</span>
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
              color: bandColor,
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${bandColor}50`,
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
            {data.length} POINTS
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {bandData.map((band, bi) => (
            <div key={bi} style={{ height: "80px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={band.data}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  {showGrid && (
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  )}
                  <XAxis dataKey="x" hide />
                  <YAxis hide domain={[0, band.threshold]} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={bandColor}
                    fill={bandColor}
                    fillOpacity={0.4 + bi * 0.15}
                    strokeWidth={1}
                    isAnimationActive={animation}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </div>

      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Band Color</label>
          <input
            type="color"
            value={bandColor}
            onChange={(e) => setBandColor(e.target.value)}
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
          <label style={labelStyle}>📊 Bands: {bands}</label>
          <input
            type="range"
            min="2"
            max="8"
            value={bands}
            onChange={(e) => setBands(Number(e.target.value))}
            style={{ width: "100%", accentColor: bandColor }}
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

      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={regenerate} style={buttonStyle()}>
          🔄 Regenerate
        </button>
      </div>

      <div
        id="chart-data-table"
        style={{
          background: theme.colors.cardBg,
          borderRadius: "4px",
          border: "1px solid #30363d",
          overflow: "auto",
          maxHeight: "200px",
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
            {data.slice(0, 30).map((d, i) => (
              <tr key={i}>
                <td
                  style={{
                    padding: "4px 8px",
                    borderBottom: "1px solid #21262d",
                    fontSize: "10px",
                    color: "#484f58",
                  }}
                >
                  {d.x}
                </td>
                <td
                  style={{
                    padding: "4px 8px",
                    borderBottom: "1px solid #21262d",
                    fontSize: "10px",
                    color: d.value >= 0 ? bandColor : "#f85149",
                  }}
                >
                  {d.value.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HorizonChartComponent;
