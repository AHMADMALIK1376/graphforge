import React, { useState, useCallback, useMemo } from "react";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import { theme } from "../../../styles/theme";

const generateData = () => {
  const raw = Array.from({ length: 100 }, () =>
    Math.floor(Math.random() * 100),
  );
  const bins = 12;
  const min = Math.min(...raw),
    max = Math.max(...raw);
  const binWidth = (max - min) / bins;
  return Array.from({ length: bins }, (_, i) => ({
    name: `${(min + i * binWidth).toFixed(0)}-${(min + (i + 1) * binWidth).toFixed(0)}`,
    value: raw.filter(
      (v) => v >= min + i * binWidth && v < min + (i + 1) * binWidth,
    ).length,
  }));
};

const RadialHistogramComponent = ({
  initialData = null,
  chartColor = "#d29922",
}) => {
  const [data, setData] = useState(generateData());
  const [titleText, setTitleText] = useState("Radial Histogram");
  const [barColor, setBarColor] = useState(chartColor);
  const [innerRadius, setInnerRadius] = useState(25);
  const [animation, setAnimation] = useState(true);

  const maxValue = useMemo(() => Math.max(...data.map((d) => d.value)), [data]);

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
    borderBottom: `2px solid ${barColor}`,
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
    padding: "24px",
    border: "1px solid #30363d",
    minHeight: "480px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
            {data.length} BINS
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        <ResponsiveContainer width="100%" height={450}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius={`${innerRadius}%`}
            outerRadius="90%"
            barSize={15}
            data={data}
            startAngle={90}
            endAngle={450}
          >
            <PolarAngleAxis
              type="category"
              dataKey="name"
              tick={{ fill: "#8b949e", fontSize: 8 }}
            />
            <Tooltip
              contentStyle={{
                background: "#161b22",
                border: "1px solid #30363d",
                borderRadius: "4px",
                fontSize: "11px",
              }}
            />
            <RadialBar
              dataKey="value"
              isAnimationActive={animation}
              animationDuration={800}
              label={{
                position: "insideStart",
                fill: "#fff",
                fontSize: 9,
                fontWeight: 600,
              }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={barColor}
                  fillOpacity={0.3 + (entry.value / maxValue) * 0.7}
                />
              ))}
            </RadialBar>
          </RadialBarChart>
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
          <label style={labelStyle}>🔵 Inner Radius: {innerRadius}%</label>
          <input
            type="range"
            min="10"
            max="60"
            value={innerRadius}
            onChange={(e) => setInnerRadius(Number(e.target.value))}
            style={{ width: "100%", accentColor: barColor }}
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
                Range
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
                Count
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
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
                  }}
                >
                  {d.name}
                </td>
                <td
                  style={{
                    padding: "4px 8px",
                    borderBottom: "1px solid #21262d",
                    fontSize: "10px",
                    color: barColor,
                    fontWeight: 700,
                  }}
                >
                  {d.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RadialHistogramComponent;
