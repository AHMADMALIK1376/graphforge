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
  Array.from({ length: 200 }, () => Math.random() * 100);

const DensityPlotComponent = ({
  initialData = null,
  chartColor = "#d29922",
}) => {
  const [rawData, setRawData] = useState(generateData());
  const [titleText, setTitleText] = useState("Density Plot");
  const [curveColor, setCurveColor] = useState(chartColor);
  const [fillOpacity, setFillOpacity] = useState(0.3);
  const [bandwidth, setBandwidth] = useState(5);
  const [showGrid, setGridVisible] = useState(true);
  const [animation, setAnimation] = useState(true);

  const kdeData = useMemo(() => {
    const points = 100;
    const min = Math.min(...rawData),
      max = Math.max(...rawData);
    const step = (max - min) / points;
    const result = [];
    for (let i = 0; i <= points; i++) {
      const x = min + i * step;
      let density = 0;
      rawData.forEach((v) => {
        density += Math.exp(-0.5 * ((x - v) / bandwidth) ** 2);
      });
      density /= rawData.length * bandwidth * Math.sqrt(2 * Math.PI);
      result.push({ x: x.toFixed(1), density: density * 100 });
    }
    return result;
  }, [rawData, bandwidth]);

  const regenerate = useCallback(() => {
    setRawData(Array.from({ length: 200 }, () => Math.random() * 100));
  }, []);
  const addPoints = useCallback(() => {
    setRawData((prev) => [
      ...prev,
      ...Array.from({ length: 50 }, () => Math.random() * 100),
    ]);
  }, []);

  const CustomTooltip = ({ active, payload }) => {
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
          <p style={{ margin: 0, color: curveColor }}>
            X: {payload[0]?.payload?.x}
          </p>
          <p style={{ margin: 0, color: "#f0f6fc" }}>
            Density: {payload[0]?.value?.toFixed(4)}
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
    borderBottom: `2px solid ${curveColor}`,
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
            {rawData.length} POINTS
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={kdeData}
            margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
          >
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            )}
            <XAxis dataKey="x" tick={{ fill: "#8b949e", fontSize: 10 }} />
            <YAxis tick={{ fill: "#8b949e", fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="density"
              stroke={curveColor}
              fill={curveColor}
              fillOpacity={fillOpacity}
              strokeWidth={2}
              isAnimationActive={animation}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Curve Color</label>
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
            min="0"
            max="0.6"
            step="0.05"
            value={fillOpacity}
            onChange={(e) => setFillOpacity(Number(e.target.value))}
            style={{ width: "100%", accentColor: curveColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Bandwidth: {bandwidth}</label>
          <input
            type="range"
            min="1"
            max="15"
            value={bandwidth}
            onChange={(e) => setBandwidth(Number(e.target.value))}
            style={{ width: "100%", accentColor: curveColor }}
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
        <button onClick={addPoints} style={buttonStyle("#3fb950")}>
          + Add 50 Points
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
                    color: curveColor,
                  }}
                >
                  {v.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DensityPlotComponent;
