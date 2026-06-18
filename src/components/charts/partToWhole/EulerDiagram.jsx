import React, { useState, useCallback, useMemo } from "react";
import { theme } from "../../../styles/theme";

const EulerDiagramComponent = ({
  initialData = null,
  chartColor = "#f85149",
}) => {
  const [setA, setSetA] = useState(50);
  const [setB, setSetB] = useState(40);
  const [setC, setSetC] = useState(35);
  const [intersectionAB, setIntersectionAB] = useState(15);
  const [intersectionAC, setIntersectionAC] = useState(10);
  const [intersectionBC, setIntersectionBC] = useState(12);
  const [intersectionABC, setIntersectionABC] = useState(5);
  const [titleText, setTitleText] = useState("Euler Diagram");
  const [colorA, setColorA] = useState("#58a6ff");
  const [colorB, setColorB] = useState(chartColor);
  const [colorC, setColorC] = useState("#3fb950");
  const [showValues, setShowValues] = useState(true);
  const [animation, setAnimation] = useState(true);

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
    width: "240px",
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
            <filter id="eulerA">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="eulerB">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="eulerC">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle
            cx="160"
            cy="150"
            r={Math.max(30, setA * 0.5)}
            fill={colorA}
            opacity="0.3"
            stroke={colorA}
            strokeWidth="2"
            filter="url(#eulerA)"
          />
          <circle
            cx="240"
            cy="150"
            r={Math.max(30, setB * 0.5)}
            fill={colorB}
            opacity="0.3"
            stroke={colorB}
            strokeWidth="2"
            filter="url(#eulerB)"
          />
          <circle
            cx="200"
            cy="190"
            r={Math.max(30, setC * 0.5)}
            fill={colorC}
            opacity="0.3"
            stroke={colorC}
            strokeWidth="2"
            filter="url(#eulerC)"
          />
          {showValues && (
            <>
              <text
                x="130"
                y="140"
                textAnchor="middle"
                fill={colorA}
                fontSize="12"
                fontWeight="700"
              >
                A
              </text>
              <text
                x="270"
                y="140"
                textAnchor="middle"
                fill={colorB}
                fontSize="12"
                fontWeight="700"
              >
                B
              </text>
              <text
                x="200"
                y="210"
                textAnchor="middle"
                fill={colorC}
                fontSize="12"
                fontWeight="700"
              >
                C
              </text>
              <text
                x="200"
                y="170"
                textAnchor="middle"
                fill="#f0f6fc"
                fontSize="10"
              >
                A∩B: {intersectionAB}
              </text>
              <text
                x="180"
                y="195"
                textAnchor="middle"
                fill="#f0f6fc"
                fontSize="10"
              >
                A∩C: {intersectionAC}
              </text>
              <text
                x="220"
                y="195"
                textAnchor="middle"
                fill="#f0f6fc"
                fontSize="10"
              >
                B∩C: {intersectionBC}
              </text>
              <text
                x="200"
                y="185"
                textAnchor="middle"
                fill="#fff"
                fontSize="11"
                fontWeight="700"
              >
                A∩B∩C: {intersectionABC}
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
          <label style={labelStyle}>🟢 Color C</label>
          <input
            type="color"
            value={colorC}
            onChange={(e) => setColorC(e.target.value)}
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
            max="80"
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
            max="80"
            value={setB}
            onChange={(e) => setSetB(Number(e.target.value))}
            style={{ width: "100%", accentColor: colorB }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>Set C: {setC}</label>
          <input
            type="range"
            min="10"
            max="80"
            value={setC}
            onChange={(e) => setSetC(Number(e.target.value))}
            style={{ width: "100%", accentColor: colorC }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>A∩B: {intersectionAB}</label>
          <input
            type="range"
            min="0"
            max={Math.min(setA, setB)}
            value={intersectionAB}
            onChange={(e) => setIntersectionAB(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>A∩C: {intersectionAC}</label>
          <input
            type="range"
            min="0"
            max={Math.min(setA, setC)}
            value={intersectionAC}
            onChange={(e) => setIntersectionAC(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>B∩C: {intersectionBC}</label>
          <input
            type="range"
            min="0"
            max={Math.min(setB, setC)}
            value={intersectionBC}
            onChange={(e) => setIntersectionBC(Number(e.target.value))}
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
          A: <strong style={{ color: colorA }}>{setA}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          B: <strong style={{ color: colorB }}>{setB}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          C: <strong style={{ color: colorC }}>{setC}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          A∩B∩C: <strong style={{ color: "#f0f6fc" }}>{intersectionABC}</strong>
        </span>
      </div>
    </div>
  );
};

export default EulerDiagramComponent;
