import React, { useState, useCallback, useMemo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  Cell,
  Legend,
  ReferenceLine,
  Label,
} from "recharts";
import { theme } from "../../../styles/theme";

const DEFAULT_DATA = [
  { x: 45, y: 55, label: "A" },
  { x: 60, y: 70, label: "B" },
  { x: 30, y: 40, label: "C" },
  { x: 75, y: 80, label: "D" },
  { x: 50, y: 50, label: "E" },
  { x: 85, y: 90, label: "F" },
  { x: 25, y: 30, label: "G" },
  { x: 65, y: 60, label: "H" },
  { x: 40, y: 65, label: "I" },
  { x: 70, y: 45, label: "J" },
  { x: 55, y: 75, label: "K" },
  { x: 80, y: 55, label: "L" },
];

const ScatterPlotComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#3fb950",
}) => {
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Scatter Plot");
  const [xLabel, setXLabel] = useState("X Variable");
  const [yLabel, setYLabel] = useState("Y Variable");
  const [dotColor, setDotColor] = useState(chartColor);
  const [dotSize, setDotSize] = useState(8);
  const [dotOpacity, setDotOpacity] = useState(0.8);
  const [showTrendline, setShowTrendline] = useState(true);
  const [showGrid, setGridVisible] = useState(true);
  const [animation, setAnimation] = useState(true);

  const stats = useMemo(() => {
    const n = data.length;
    const sumX = data.reduce((s, d) => s + d.x, 0);
    const sumY = data.reduce((s, d) => s + d.y, 0);
    const meanX = sumX / n;
    const meanY = sumY / n;
    const slope =
      data.reduce((s, d) => s + (d.x - meanX) * (d.y - meanY), 0) /
      data.reduce((s, d) => s + (d.x - meanX) ** 2, 0);
    const intercept = meanY - slope * meanX;
    const correlation =
      data.reduce((s, d) => s + (d.x - meanX) * (d.y - meanY), 0) /
      Math.sqrt(
        data.reduce((s, d) => s + (d.x - meanX) ** 2, 0) *
          data.reduce((s, d) => s + (d.y - meanY) ** 2, 0),
      );
    return { meanX, meanY, slope, intercept, correlation, n };
  }, [data]);

  const trendlineData = useMemo(() => {
    if (!showTrendline) return [];
    const minX = Math.min(...data.map((d) => d.x));
    const maxX = Math.max(...data.map((d) => d.x));
    return [
      { x: minX, y: stats.slope * minX + stats.intercept },
      { x: maxX, y: stats.slope * maxX + stats.intercept },
    ];
  }, [data, stats, showTrendline]);

  const handleDataChange = useCallback((index, field, newValue) => {
    setData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: Number(newValue) || 0 };
      return updated;
    });
  }, []);
  const handleLabelChange = useCallback((index, newLabel) => {
    setData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], label: newLabel };
      return updated;
    });
  }, []);
  const addPoint = useCallback(() => {
    setData((prev) => [
      ...prev,
      {
        x: Math.floor(Math.random() * 80) + 10,
        y: Math.floor(Math.random() * 80) + 10,
        label: `P${prev.length + 1}`,
      },
    ]);
  }, []);
  const removePoint = useCallback((index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const CustomDot = (props) => {
    const { cx, cy } = props;
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={dotSize + 3}
          fill={dotColor}
          opacity={0.15}
        />
        <circle
          cx={cx}
          cy={cy}
          r={dotSize}
          fill={dotColor}
          opacity={dotOpacity}
          stroke="#fff"
          strokeWidth={1.5}
          style={{
            cursor: "pointer",
            filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.2))",
          }}
        />
        <circle
          cx={cx - dotSize * 0.2}
          cy={cy - dotSize * 0.2}
          r={dotSize * 0.2}
          fill="rgba(255,255,255,0.4)"
        />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const pt = payload[0]?.payload;
      return (
        <div style={tooltipStyle}>
          <p style={{ fontWeight: 700, margin: "0 0 4px", color: "#f0f6fc" }}>
            {pt.label}
          </p>
          <p style={{ margin: 0, color: dotColor }}>X: {pt.x}</p>
          <p style={{ margin: 0, color: dotColor }}>Y: {pt.y}</p>
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
    borderBottom: `2px solid ${dotColor}`,
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
    padding: "24px 16px",
    border: `1px solid ${theme.colors.border.light}`,
    minHeight: "480px",
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
  const dataTableStyle = {
    background: theme.colors.cardBg,
    borderRadius: "4px",
    border: `1px solid ${theme.colors.border.default}`,
    overflow: "auto",
    maxHeight: "300px",
  };
  const thStyle = {
    background: "#0d1117",
    color: "#8b949e",
    padding: "8px 10px",
    textAlign: "left",
    fontSize: "9px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1px",
    borderBottom: "2px solid #30363d",
    position: "sticky",
    top: 0,
  };
  const tdStyle = {
    padding: "5px 8px",
    borderBottom: "1px solid #21262d",
    fontSize: "10px",
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
  const buttonStyle = (c = dotColor) => ({
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
          <span style={{ fontSize: "28px" }}>⚫</span>
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
              color: dotColor,
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${dotColor}50`,
              borderRadius: "3px",
              fontWeight: 600,
              letterSpacing: "1px",
            }}
          >
            CORRELATION
          </span>
          <span
            style={{
              color: "#8b949e",
              fontSize: "10px",
              padding: "4px 10px",
              border: "1px solid #30363d",
              borderRadius: "3px",
              letterSpacing: "1px",
            }}
          >
            {data.length} POINTS
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        <ResponsiveContainer width="100%" height={450}>
          <ScatterChart margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            )}
            <XAxis
              type="number"
              dataKey="x"
              tick={{ fill: "#8b949e", fontSize: 10 }}
              axisLine={{ stroke: "#30363d" }}
            >
              <Label
                value={xLabel}
                position="bottom"
                offset={-2}
                fill="#8b949e"
                fontSize={11}
              />
            </XAxis>
            <YAxis
              type="number"
              dataKey="y"
              tick={{ fill: "#8b949e", fontSize: 10 }}
              axisLine={{ stroke: "#30363d" }}
            >
              <Label
                value={yLabel}
                angle={-90}
                position="left"
                fill="#8b949e"
                fontSize={11}
              />
            </YAxis>
            <ZAxis range={[dotSize * 5, dotSize * 5]} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ strokeDasharray: "3 3" }}
            />
            <Legend />
            <Scatter
              data={data}
              shape={<CustomDot />}
              isAnimationActive={animation}
              animationDuration={600}
            >
              {data.map((_, idx) => (
                <Cell key={`cell-${idx}`} fill={dotColor} />
              ))}
            </Scatter>
            {showTrendline && (
              <Scatter
                data={trendlineData}
                line={{
                  stroke: dotColor,
                  strokeWidth: 2,
                  strokeDasharray: "6 3",
                }}
                shape={() => null}
                legendType="none"
              />
            )}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Dot Color</label>
          <input
            type="color"
            value={dotColor}
            onChange={(e) => setDotColor(e.target.value)}
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
          <label style={labelStyle}>📏 Dot Size: {dotSize}px</label>
          <input
            type="range"
            min="3"
            max="16"
            value={dotSize}
            onChange={(e) => setDotSize(Number(e.target.value))}
            style={{ width: "100%", accentColor: dotColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>👁️ Opacity: {dotOpacity}</label>
          <input
            type="range"
            min="0.3"
            max="1"
            step="0.05"
            value={dotOpacity}
            onChange={(e) => setDotOpacity(Number(e.target.value))}
            style={{ width: "100%", accentColor: dotColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📈 Trendline</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showTrendline}
              onChange={(e) => setShowTrendline(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>
              Show line
            </span>
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

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📝 X-Axis Label</label>
          <input
            type="text"
            value={xLabel}
            onChange={(e) => setXLabel(e.target.value)}
            style={{ ...cellInputStyle("120px") }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📝 Y-Axis Label</label>
          <input
            type="text"
            value={yLabel}
            onChange={(e) => setYLabel(e.target.value)}
            style={{ ...cellInputStyle("120px") }}
          />
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
          Correlation:{" "}
          <strong style={{ color: dotColor }}>
            {stats.correlation.toFixed(4)}
          </strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          R²:{" "}
          <strong style={{ color: "#f0f6fc" }}>
            {(stats.correlation ** 2).toFixed(4)}
          </strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Slope:{" "}
          <strong style={{ color: "#f0f6fc" }}>{stats.slope.toFixed(2)}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Points: <strong style={{ color: "#f0f6fc" }}>{stats.n}</strong>
        </span>
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
          <label style={labelStyle}>📋 Data Points</label>
          <button onClick={addPoint} style={buttonStyle()}>
            + Add Point
          </button>
        </div>
        <div id="chart-data-table" style={dataTableStyle}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>#</th>
                <th style={thStyle}>Label</th>
                <th style={thStyle}>X</th>
                <th style={thStyle}>Y</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  <td style={{ ...tdStyle, color: "#484f58" }}>{i + 1}</td>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      value={row.label}
                      onChange={(e) => handleLabelChange(i, e.target.value)}
                      style={cellInputStyle("50px")}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="number"
                      value={row.x}
                      onChange={(e) => handleDataChange(i, "x", e.target.value)}
                      style={cellInputStyle("55px")}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="number"
                      value={row.y}
                      onChange={(e) => handleDataChange(i, "y", e.target.value)}
                      style={cellInputStyle("55px")}
                    />
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => removePoint(i)}
                      style={{
                        padding: "2px 6px",
                        background: "transparent",
                        border: "1px solid #f85149",
                        borderRadius: "2px",
                        color: "#f85149",
                        cursor: "pointer",
                        fontSize: "9px",
                      }}
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
    </div>
  );
};

export default ScatterPlotComponent;
