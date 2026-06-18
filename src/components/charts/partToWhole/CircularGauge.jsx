import React, { useState, useCallback, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { theme } from "../../../styles/theme";

const CircularGaugeComponent = ({
  initialData = null,
  chartColor = "#f85149",
}) => {
  const [value, setValue] = useState(65);
  const [maxValue, setMaxValue] = useState(100);
  const [titleText, setTitleText] = useState("Circular Gauge");
  const [gaugeColor, setGaugeColor] = useState(chartColor);
  const [bgColor, setBgColor] = useState("#e2e8f0");
  const [startAngle, setStartAngle] = useState(180);
  const [endAngle, setEndAngle] = useState(0);
  const [innerRadius, setInnerRadius] = useState(65);
  const [outerRadius, setOuterRadius] = useState(85);
  const [showValue, setShowValue] = useState(true);
  const [animation, setAnimation] = useState(true);

  const percent = useMemo(
    () => Math.min((value / maxValue) * 100, 100),
    [value, maxValue],
  );
  const gaugeData = useMemo(
    () => [
      { name: "value", value: Math.min(value, maxValue), color: gaugeColor },
      {
        name: "remaining",
        value: Math.max(maxValue - value, 0),
        color: bgColor,
      },
    ],
    [value, maxValue, gaugeColor, bgColor],
  );

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
    borderBottom: `2px solid ${gaugeColor}`,
    color: theme.colors.text.heading,
    fontSize: "20px",
    fontWeight: 700,
    fontFamily: theme.typography.fontFamily.primary,
    letterSpacing: "2px",
    outline: "none",
    padding: "4px 0",
    width: "240px",
  };
  const chartContainerStyle = {
    background: "#ffffff",
    borderRadius: "6px",
    padding: "24px",
    border: "1px solid #30363d",
    minHeight: "400px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
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
  const cellInputStyle = (w = "65px") => ({
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
  const buttonStyle = (c = gaugeColor) => ({
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
          <span style={{ fontSize: "28px" }}>⏱️</span>
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
              color: gaugeColor,
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${gaugeColor}50`,
              borderRadius: "3px",
              fontWeight: 600,
            }}
          >
            PART-TO-WHOLE
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={gaugeData}
              cx="50%"
              cy="100%"
              innerRadius={`${innerRadius}%`}
              outerRadius={`${outerRadius}%`}
              startAngle={startAngle}
              endAngle={endAngle}
              dataKey="value"
              cornerRadius={5}
              isAnimationActive={animation}
              animationDuration={800}
            >
              {gaugeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {showValue && (
          <div
            style={{
              position: "absolute",
              bottom: "20%",
              left: "50%",
              transform: "translateX(-50%)",
              textAlign: "center",
            }}
          >
            <div
              style={{ fontSize: "28px", fontWeight: 700, color: gaugeColor }}
            >
              {value}
            </div>
            <div style={{ fontSize: "10px", color: "#8b949e" }}>
              of {maxValue} ({percent.toFixed(0)}%)
            </div>
          </div>
        )}
      </div>

      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Gauge Color</label>
          <input
            type="color"
            value={gaugeColor}
            onChange={(e) => setGaugeColor(e.target.value)}
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
          <label style={labelStyle}>📊 Value: {value}</label>
          <input
            type="range"
            min="0"
            max={maxValue}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            style={{ width: "100%", accentColor: gaugeColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Max: {maxValue}</label>
          <input
            type="range"
            min="10"
            max="200"
            value={maxValue}
            onChange={(e) => setMaxValue(Number(e.target.value))}
            style={{ width: "100%", accentColor: gaugeColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔵 Inner: {innerRadius}%</label>
          <input
            type="range"
            min="40"
            max="75"
            value={innerRadius}
            onChange={(e) => setInnerRadius(Number(e.target.value))}
            style={{ width: "100%", accentColor: gaugeColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🟣 Outer: {outerRadius}%</label>
          <input
            type="range"
            min="60"
            max="100"
            value={outerRadius}
            onChange={(e) => setOuterRadius(Number(e.target.value))}
            style={{ width: "100%", accentColor: gaugeColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔢 Show Value</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showValue}
              onChange={(e) => setShowValue(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>Center</span>
          </label>
        </div>
      </div>

      <div
        id="chart-data-table"
        style={{
          background: theme.colors.cardBg,
          padding: "12px 16px",
          borderRadius: "4px",
          border: "1px solid #30363d",
          fontSize: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span style={{ color: "#8b949e" }}>Value:</span>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            style={cellInputStyle("70px")}
            min="0"
          />
          <span style={{ color: "#8b949e" }}>Max:</span>
          <input
            type="number"
            value={maxValue}
            onChange={(e) => setMaxValue(Number(e.target.value))}
            style={cellInputStyle("70px")}
            min="1"
          />
          <span style={{ color: gaugeColor, fontWeight: 700 }}>
            {percent.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default CircularGaugeComponent;
