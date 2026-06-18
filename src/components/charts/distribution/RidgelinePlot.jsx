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

const generateData = (label, offset) => {
  return Array.from({ length: 80 }, (_, i) => ({
    x: i,
    y: Math.exp(-0.5 * ((i - 30 - offset) / 15) ** 2) * 80 + Math.random() * 5,
    label,
  }));
};

const DEFAULT_SERIES = [
  { label: "Group A", data: generateData("Group A", 0) },
  { label: "Group B", data: generateData("Group B", 15) },
  { label: "Group C", data: generateData("Group C", 30) },
  { label: "Group D", data: generateData("Group D", -10) },
];

const RidgelinePlotComponent = ({
  initialData = null,
  chartColor = "#d29922",
}) => {
  const [series, setSeries] = useState(DEFAULT_SERIES);
  const [titleText, setTitleText] = useState("Ridgeline Plot");
  const [curveColor, setCurveColor] = useState(chartColor);
  const [fillOpacity, setFillOpacity] = useState(0.4);
  const [overlap, setOverlap] = useState(0.6);
  const [animation, setAnimation] = useState(true);

  const colors = [chartColor, "#58a6ff", "#3fb950", "#f85149", "#a371f7"];

  const regenerate = useCallback(() => {
    setSeries(
      DEFAULT_SERIES.map((s, i) => ({
        ...s,
        data: generateData(s.label, i * 10),
      })),
    );
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
    borderBottom: `2px solid ${curveColor}`,
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
    border: "1px solid #30363d",
    minHeight: "500px",
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
  const buttonStyle = (c = curveColor) => ({
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
          <span style={{ fontSize: "28px" }}>🏔️</span>
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
              color: curveColor,
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${curveColor}50`,
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
            {series.length} RIDGES
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        <div
          style={{
            display: "flex",
            flexDirection: "column-reverse",
            gap: `${-overlap * 60}px`,
            padding: "20px",
          }}
        >
          {series.map((s, i) => (
            <div key={i} style={{ position: "relative", height: "100px" }}>
              <span
                style={{
                  position: "absolute",
                  left: "8px",
                  top: "5px",
                  fontSize: "10px",
                  fontWeight: 700,
                  color: colors[i % colors.length],
                  zIndex: 2,
                }}
              >
                {s.label}
              </span>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={s.data}
                  margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
                >
                  <XAxis dataKey="x" hide />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="y"
                    stroke={colors[i % colors.length]}
                    fill={colors[i % colors.length]}
                    fillOpacity={fillOpacity}
                    strokeWidth={2}
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
          <label style={labelStyle}>🎨 Base Color</label>
          <input
            type="color"
            value={curveColor}
            onChange={(e) => setCurveColor(e.target.value)}
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
          <label style={labelStyle}>👁️ Fill: {fillOpacity}</label>
          <input
            type="range"
            min="0.1"
            max="0.8"
            step="0.05"
            value={fillOpacity}
            onChange={(e) => setFillOpacity(Number(e.target.value))}
            style={{ width: "100%", accentColor: curveColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>↔️ Overlap: {overlap.toFixed(1)}</label>
          <input
            type="range"
            min="0.3"
            max="0.9"
            step="0.05"
            value={overlap}
            onChange={(e) => setOverlap(Number(e.target.value))}
            style={{ width: "100%", accentColor: curveColor }}
          />
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
          maxHeight: "250px",
        }}
      >
        {series.map((s, i) => (
          <div
            key={i}
            style={{ padding: "8px 12px", borderBottom: "1px solid #21262d" }}
          >
            <span
              style={{
                color: colors[i % colors.length],
                fontSize: "10px",
                fontWeight: 700,
              }}
            >
              {s.label}:{" "}
            </span>
            <span style={{ color: "#8b949e", fontSize: "9px" }}>
              {s.data.length} points | Max:{" "}
              {Math.max(...s.data.map((d) => d.y)).toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RidgelinePlotComponent;
