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
} from "recharts";
import { theme } from "../../../styles/theme";

const DEFAULT_DATA = {
  "Group A": [12, 15, 18, 22, 25, 28, 30, 35, 38, 42],
  "Group B": [8, 10, 12, 15, 18, 20, 22, 25, 28, 30],
  "Group C": [20, 22, 25, 28, 30, 32, 35, 38, 40, 42],
  "Group D": [5, 8, 10, 12, 15, 18, 20, 22, 25, 28],
};

const StripPlotComponent = ({ initialData = null, chartColor = "#d29922" }) => {
  const [data, setData] = useState(DEFAULT_DATA);
  const [titleText, setTitleText] = useState("Strip Plot");
  const [dotColor, setDotColor] = useState(chartColor);
  const [dotSize, setDotSize] = useState(7);
  const [jitter, setJitter] = useState(0.25);
  const [showGrid, setGridVisible] = useState(true);
  const [animation, setAnimation] = useState(true);

  const colors = [chartColor, "#58a6ff", "#3fb950", "#f85149", "#a371f7"];

  const scatterData = useMemo(() => {
    const result = [];
    Object.entries(data).forEach(([group, values], gi) => {
      values.forEach((v, vi) => {
        result.push({
          x: gi + (Math.random() - 0.5) * jitter,
          y: v,
          group,
          groupIndex: gi,
        });
      });
    });
    return result;
  }, [data, jitter]);

  const handleValueChange = useCallback((group, index, newVal) => {
    setData((prev) => {
      const updated = { ...prev };
      updated[group] = [...updated[group]];
      updated[group][index] = Number(newVal) || 0;
      return updated;
    });
  }, []);
  const addValue = useCallback((group) => {
    setData((prev) => {
      const updated = { ...prev };
      updated[group] = [...updated[group], Math.floor(Math.random() * 40) + 10];
      return updated;
    });
  }, []);
  const removeValue = useCallback((group, index) => {
    setData((prev) => {
      const updated = { ...prev };
      updated[group] = updated[group].filter((_, i) => i !== index);
      return updated;
    });
  }, []);

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    const c = colors[payload.groupIndex % colors.length];
    return (
      <circle
        cx={cx}
        cy={cy}
        r={dotSize}
        fill={c}
        opacity={0.8}
        stroke="#fff"
        strokeWidth={1}
        style={{ cursor: "pointer" }}
      />
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const pt = payload[0]?.payload;
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
          <p
            style={{
              fontWeight: 700,
              color: colors[pt.groupIndex % colors.length],
              margin: "0 0 4px",
            }}
          >
            {pt.group}
          </p>
          <p style={{ margin: 0, color: "#f0f6fc" }}>Value: {pt.y}</p>
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
    width: "200px",
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
  const cellInputStyle = (w = "45px") => ({
    padding: "3px 4px",
    background: theme.colors.inputBg,
    border: "1px solid #30363d",
    borderRadius: "2px",
    color: theme.colors.text.body,
    fontSize: "9px",
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

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>📏</span>
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
            {Object.keys(data).length} GROUPS
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            )}
            <XAxis
              type="number"
              dataKey="x"
              domain={[-0.5, Object.keys(data).length - 0.5]}
              ticks={Object.keys(data).map((_, i) => i)}
              tickFormatter={(i) => Object.keys(data)[i]}
              tick={{ fill: "#8b949e", fontSize: 10 }}
            />
            <YAxis tick={{ fill: "#8b949e", fontSize: 10 }} />
            <ZAxis range={[dotSize * 5, dotSize * 5]} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ strokeDasharray: "3 3" }}
            />
            <Legend
              payload={Object.keys(data).map((g, i) => ({
                value: g,
                type: "circle",
                color: colors[i % colors.length],
              }))}
            />
            <Scatter
              data={scatterData}
              shape={<CustomDot />}
              isAnimationActive={animation}
              animationDuration={500}
            />
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
            max="14"
            value={dotSize}
            onChange={(e) => setDotSize(Number(e.target.value))}
            style={{ width: "100%", accentColor: dotColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>〰️ Jitter: {jitter.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="0.5"
            step="0.05"
            value={jitter}
            onChange={(e) => setJitter(Number(e.target.value))}
            style={{ width: "100%", accentColor: dotColor }}
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
      </div>

      <div id="chart-data-table">
        {Object.entries(data).map(([group, values]) => (
          <div
            key={group}
            style={{
              marginBottom: "12px",
              background: theme.colors.cardBg,
              padding: "10px 14px",
              borderRadius: "4px",
              border: "1px solid #30363d",
              borderLeft: `3px solid ${colors[Object.keys(data).indexOf(group) % colors.length]}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "6px",
              }}
            >
              <span
                style={{
                  color:
                    colors[Object.keys(data).indexOf(group) % colors.length],
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                {group}
              </span>
              <button
                onClick={() => addValue(group)}
                style={buttonStyle(
                  colors[Object.keys(data).indexOf(group) % colors.length],
                )}
              >
                + Value
              </button>
            </div>
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
              {values.map((v, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: "2px" }}
                >
                  <input
                    type="number"
                    value={v}
                    onChange={(e) =>
                      handleValueChange(group, i, e.target.value)
                    }
                    style={cellInputStyle("42px")}
                  />
                  <button
                    onClick={() => removeValue(group, i)}
                    style={{
                      padding: "1px 3px",
                      background: "transparent",
                      border: "1px solid #f85149",
                      borderRadius: "2px",
                      color: "#f85149",
                      cursor: "pointer",
                      fontSize: "7px",
                    }}
                    disabled={values.length <= 4}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StripPlotComponent;
