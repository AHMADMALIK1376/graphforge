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
  { x: 45, y: 55, size: 80, label: "A" },
  { x: 60, y: 70, size: 120, label: "B" },
  { x: 30, y: 40, size: 50, label: "C" },
  { x: 75, y: 80, size: 150, label: "D" },
  { x: 50, y: 50, size: 90, label: "E" },
  { x: 85, y: 90, size: 160, label: "F" },
  { x: 25, y: 30, size: 40, label: "G" },
  { x: 65, y: 60, size: 100, label: "H" },
  { x: 40, y: 65, size: 70, label: "I" },
  { x: 70, y: 45, size: 110, label: "J" },
];

const BubbleChartComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#3fb950",
}) => {
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Bubble Chart");
  const [xLabel, setXLabel] = useState("X Variable");
  const [yLabel, setYLabel] = useState("Y Variable");
  const [bubbleColor, setBubbleColor] = useState(chartColor);
  const [bubbleScale, setBubbleScale] = useState(1);
  const [bubbleOpacity, setBubbleOpacity] = useState(0.75);
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
  const addBubble = useCallback(() => {
    setData((prev) => [
      ...prev,
      {
        x: Math.floor(Math.random() * 80) + 10,
        y: Math.floor(Math.random() * 80) + 10,
        size: Math.floor(Math.random() * 100) + 50,
        label: `B${prev.length + 1}`,
      },
    ]);
  }, []);
  const removeBubble = useCallback((index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const CustomBubble = (props) => {
    const { cx, cy, payload } = props;
    const size = Math.sqrt(payload.size) * bubbleScale * 0.6;
    const r = Math.max(8, Math.min(size, 70));
    return (
      <g style={{ cursor: "pointer" }}>
        <circle cx={cx} cy={cy} r={r + 4} fill={bubbleColor} opacity={0.1} />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill={bubbleColor}
          opacity={bubbleOpacity}
          stroke="#fff"
          strokeWidth={2}
          style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.2))" }}
        />
        <circle
          cx={cx - r * 0.25}
          cy={cy - r * 0.25}
          r={r * 0.2}
          fill="rgba(255,255,255,0.35)"
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
          <p style={{ margin: 0, color: bubbleColor }}>X: {pt.x}</p>
          <p style={{ margin: 0, color: bubbleColor }}>Y: {pt.y}</p>
          <p style={{ margin: 0, color: bubbleColor }}>Size: {pt.size}</p>
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
    borderBottom: `2px solid ${bubbleColor}`,
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
  const buttonStyle = (c = bubbleColor) => ({
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
          <span style={{ fontSize: "28px" }}>🫧</span>
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
              color: bubbleColor,
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${bubbleColor}50`,
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
            {data.length} BUBBLES
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
            <ZAxis dataKey="size" range={[30, 200]} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ strokeDasharray: "3 3" }}
            />
            <Legend />
            <Scatter
              data={data}
              shape={<CustomBubble />}
              isAnimationActive={animation}
              animationDuration={600}
            >
              {data.map((_, idx) => (
                <Cell key={`cell-${idx}`} fill={bubbleColor} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Bubble Color</label>
          <input
            type="color"
            value={bubbleColor}
            onChange={(e) => setBubbleColor(e.target.value)}
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
          <label style={labelStyle}>📏 Scale: {bubbleScale.toFixed(1)}</label>
          <input
            type="range"
            min="0.3"
            max="2"
            step="0.1"
            value={bubbleScale}
            onChange={(e) => setBubbleScale(Number(e.target.value))}
            style={{ width: "100%", accentColor: bubbleColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>👁️ Opacity: {bubbleOpacity}</label>
          <input
            type="range"
            min="0.3"
            max="1"
            step="0.05"
            value={bubbleOpacity}
            onChange={(e) => setBubbleOpacity(Number(e.target.value))}
            style={{ width: "100%", accentColor: bubbleColor }}
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
          <button onClick={addBubble} style={buttonStyle()}>
            + Add Bubble
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
                <th style={thStyle}>Size</th>
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
                    <input
                      type="number"
                      value={row.size}
                      onChange={(e) =>
                        handleDataChange(i, "size", e.target.value)
                      }
                      style={cellInputStyle("55px")}
                      min="1"
                    />
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => removeBubble(i)}
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

export default BubbleChartComponent;
