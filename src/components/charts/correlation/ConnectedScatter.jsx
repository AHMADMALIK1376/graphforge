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
  Label,
} from "recharts";
import { theme } from "../../../styles/theme";

const DEFAULT_DATA = [
  { x: 10, y: 20, label: "2020" },
  { x: 25, y: 35, label: "2021" },
  { x: 40, y: 30, label: "2022" },
  { x: 55, y: 50, label: "2023" },
  { x: 70, y: 45, label: "2024" },
  { x: 85, y: 65, label: "2025" },
  { x: 60, y: 70, label: "2026" },
  { x: 80, y: 85, label: "2027" },
];

const ConnectedScatterComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#3fb950",
}) => {
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Connected Scatter Plot");
  const [xLabel, setXLabel] = useState("X Variable");
  const [yLabel, setYLabel] = useState("Y Variable");
  const [dotColor, setDotColor] = useState(chartColor);
  const [lineColor, setLineColor] = useState("#58a6ff");
  const [dotSize, setDotSize] = useState(7);
  const [lineWidth, setLineWidth] = useState(2);
  const [showArrows, setShowArrows] = useState(true);
  const [showDots, setShowDots] = useState(true);
  const [showGrid, setGridVisible] = useState(true);
  const [animation, setAnimation] = useState(true);

  const handleDataChange = useCallback((index, field, newValue) => {
    setData((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: field === "label" ? newValue : Number(newValue) || 0,
      };
      return updated;
    });
  }, []);
  const addPoint = useCallback(() => {
    const last = data[data.length - 1];
    setData((prev) => [
      ...prev,
      {
        x: (last?.x || 50) + Math.floor(Math.random() * 20) - 10,
        y: (last?.y || 50) + Math.floor(Math.random() * 20) - 10,
        label: `P${prev.length + 1}`,
      },
    ]);
  }, [data]);
  const removePoint = useCallback((index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const connectingLines = useMemo(() => {
    return data
      .map((point, i) => {
        if (i === data.length - 1) return null;
        const next = data[i + 1];
        return { x1: point.x, y1: point.y, x2: next.x, y2: next.y };
      })
      .filter(Boolean);
  }, [data]);

  const CustomDot = (props) => {
    const { cx, cy, payload, index } = props;
    const isFirst = index === 0;
    const isLast = index === data.length - 1;
    return (
      <g style={{ cursor: "pointer" }}>
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
          fill={isFirst ? "#3fb950" : isLast ? "#f85149" : dotColor}
          opacity={0.85}
          stroke="#fff"
          strokeWidth={1.5}
          style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.2))" }}
        />
        <text
          x={cx}
          y={cy - dotSize - 6}
          textAnchor="middle"
          fill="#8b949e"
          fontSize="8"
          fontWeight={700}
        >
          {payload.label}
        </text>
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const pt = payload[0]?.payload;
      const idx = data.indexOf(pt);
      return (
        <div style={tooltipStyle}>
          <p style={{ fontWeight: 700, margin: "0 0 4px", color: "#f0f6fc" }}>
            {pt.label}
          </p>
          <p style={{ margin: 0, color: dotColor }}>X: {pt.x}</p>
          <p style={{ margin: 0, color: dotColor }}>Y: {pt.y}</p>
          <p style={{ margin: 0, color: "#8b949e", fontSize: "9px" }}>
            Point #{idx + 1} of {data.length}
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
    borderBottom: `2px solid ${dotColor}`,
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
  const dataTableStyle = {
    background: theme.colors.cardBg,
    borderRadius: "4px",
    border: "1px solid #30363d",
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
          <span style={{ fontSize: "28px" }}>🔗</span>
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
            {connectingLines.map((line, i) => (
              <Scatter
                key={`line-${i}`}
                data={[
                  { x: line.x1, y: line.y1 },
                  { x: line.x2, y: line.y2 },
                ]}
                line={{ stroke: lineColor, strokeWidth: lineWidth }}
                shape={() => null}
                legendType="none"
              />
            ))}
            {showDots && (
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
          <label style={labelStyle}>〰️ Line Color</label>
          <input
            type="color"
            value={lineColor}
            onChange={(e) => setLineColor(e.target.value)}
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
            max="14"
            value={dotSize}
            onChange={(e) => setDotSize(Number(e.target.value))}
            style={{ width: "100%", accentColor: dotColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Line Width: {lineWidth}px</label>
          <input
            type="range"
            min="1"
            max="5"
            step="0.5"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            style={{ width: "100%", accentColor: lineColor }}
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
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>
              Data points
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
                      onChange={(e) =>
                        handleDataChange(i, "label", e.target.value)
                      }
                      style={cellInputStyle("60px")}
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

export default ConnectedScatterComponent;
