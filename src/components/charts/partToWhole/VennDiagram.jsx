import React, { useState, useCallback, useMemo } from "react";
import { theme } from "../../../styles/theme";

const VennDiagramComponent = ({
  initialData = null,
  chartColor = "#f85149",
}) => {
  const [setA, setSetA] = useState(60);
  const [setB, setSetB] = useState(50);
  const [intersection, setIntersection] = useState(20);
  const [titleText, setTitleText] = useState("Venn Diagram");
  const [colorA, setColorA] = useState("#58a6ff");
  const [colorB, setColorB] = useState(chartColor);
  const [showValues, setShowValues] = useState(true);
  const [animation, setAnimation] = useState(true);

  const onlyA = setA - intersection;
  const onlyB = setB - intersection;
  const total = onlyA + onlyB + intersection;

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
    borderBottom: `2px solid ${chartColor}`,
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
    padding: "24px",
    border: "1px solid #30363d",
    minHeight: "420px",
    position: "relative",
    overflow: "hidden",
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
  const buttonStyle = (c = chartColor) => ({
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
          <span style={{ fontSize: "28px" }}>⭕</span>
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
              color: chartColor,
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${chartColor}50`,
              borderRadius: "3px",
              fontWeight: 600,
            }}
          >
            PART-TO-WHOLE
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        <svg width="100%" height="380" viewBox="0 0 400 300">
          <defs>
            <filter id="glowA">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glowB">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle
            cx="160"
            cy="150"
            r={Math.max(30, setA * 0.8)}
            fill={colorA}
            opacity="0.4"
            stroke={colorA}
            strokeWidth="2"
            filter="url(#glowA)"
          />
          <circle
            cx="240"
            cy="150"
            r={Math.max(30, setB * 0.8)}
            fill={colorB}
            opacity="0.4"
            stroke={colorB}
            strokeWidth="2"
            filter="url(#glowB)"
          />
          {showValues && (
            <>
              <text
                x="100"
                y="150"
                textAnchor="middle"
                fill={colorA}
                fontSize="14"
                fontWeight="700"
              >
                A Only
              </text>
              <text
                x="100"
                y="170"
                textAnchor="middle"
                fill="#8b949e"
                fontSize="11"
              >
                {onlyA}
              </text>
              <text
                x="300"
                y="150"
                textAnchor="middle"
                fill={colorB}
                fontSize="14"
                fontWeight="700"
              >
                B Only
              </text>
              <text
                x="300"
                y="170"
                textAnchor="middle"
                fill="#8b949e"
                fontSize="11"
              >
                {onlyB}
              </text>
              <text
                x="200"
                y="145"
                textAnchor="middle"
                fill="#f0f6fc"
                fontSize="14"
                fontWeight="700"
              >
                A∩B
              </text>
              <text
                x="200"
                y="165"
                textAnchor="middle"
                fill="#f0f6fc"
                fontSize="11"
              >
                {intersection}
              </text>
            </>
          )}
        </svg>
      </div>

      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔵 Color A</label>
          <input
            type="color"
            value={colorA}
            onChange={(e) => setColorA(e.target.value)}
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
          <label style={labelStyle}>🔴 Color B</label>
          <input
            type="color"
            value={colorB}
            onChange={(e) => setColorB(e.target.value)}
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
          <label style={labelStyle}>Set A: {setA}</label>
          <input
            type="range"
            min="10"
            max="100"
            value={setA}
            onChange={(e) => setSetA(Number(e.target.value))}
            style={{ width: "100%", accentColor: colorA }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>Set B: {setB}</label>
          <input
            type="range"
            min="10"
            max="100"
            value={setB}
            onChange={(e) => setSetB(Number(e.target.value))}
            style={{ width: "100%", accentColor: colorB }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>A∩B: {intersection}</label>
          <input
            type="range"
            min="0"
            max={Math.min(setA, setB)}
            value={intersection}
            onChange={(e) => setIntersection(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔢 Labels</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showValues}
              onChange={(e) => setShowValues(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>Show</span>
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
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <span style={{ color: "#8b949e" }}>
          A Only: <strong style={{ color: colorA }}>{onlyA}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          B Only: <strong style={{ color: colorB }}>{onlyB}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          A∩B: <strong style={{ color: "#f0f6fc" }}>{intersection}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Total: <strong style={{ color: "#f0f6fc" }}>{total}</strong>
        </span>
      </div>
    </div>
  );
};

export default VennDiagramComponent;
