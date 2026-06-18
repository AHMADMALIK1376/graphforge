import React, { useState, useCallback, useMemo } from "react";
import { theme } from "../../../styles/theme";

const generateData = () =>
  Array.from({ length: 50 }, () => Math.floor(Math.random() * 100));

const OneDHeatmapComponent = ({
  initialData = null,
  chartColor = "#d29922",
}) => {
  const [data, setData] = useState(generateData());
  const [titleText, setTitleText] = useState("1D Heatmap");
  const [colorLow, setColorLow] = useState("#0d1117");
  const [colorHigh, setColorHigh] = useState(chartColor);
  const [cellWidth, setCellWidth] = useState(14);
  const [cellHeight, setCellHeight] = useState(40);
  const [showValues, setShowValues] = useState(true);
  const [animation, setAnimation] = useState(true);

  const maxVal = useMemo(() => Math.max(...data), [data]);
  const minVal = useMemo(() => Math.min(...data), [data]);

  const getColor = useCallback(
    (value) => {
      const ratio =
        maxVal > minVal ? (value - minVal) / (maxVal - minVal) : 0.5;
      const r1 = parseInt(colorLow.slice(1, 3), 16),
        g1 = parseInt(colorLow.slice(3, 5), 16),
        b1 = parseInt(colorLow.slice(5, 7), 16);
      const r2 = parseInt(colorHigh.slice(1, 3), 16),
        g2 = parseInt(colorHigh.slice(3, 5), 16),
        b2 = parseInt(colorHigh.slice(5, 7), 16);
      const r = Math.round(r1 + (r2 - r1) * ratio),
        g = Math.round(g1 + (g2 - g1) * ratio),
        b = Math.round(b1 + (b2 - b1) * ratio);
      return `rgb(${r},${g},${b})`;
    },
    [colorLow, colorHigh, minVal, maxVal],
  );

  const getTextColor = useCallback((bg) => {
    const r = parseInt(bg.slice(4, bg.indexOf(",")));
    return r > 140 ? "#0d1117" : "#f0f6fc";
  }, []);

  const regenerate = useCallback(() => {
    setData(Array.from({ length: 50 }, () => Math.floor(Math.random() * 100)));
  }, []);
  const sortData = useCallback(() => {
    setData((prev) => [...prev].sort((a, b) => a - b));
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
    minHeight: "300px",
    overflow: "auto",
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
          <span style={{ fontSize: "28px" }}>🌡️</span>
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
            {data.length} CELLS
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        <div
          style={{
            display: "flex",
            gap: "2px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {data.map((value, i) => {
            const bg = getColor(value);
            const tc = getTextColor(bg);
            return (
              <div
                key={i}
                style={{
                  width: `${cellWidth}px`,
                  height: `${cellHeight}px`,
                  background: bg,
                  borderRadius: "2px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: animation ? "transform 0.2s ease" : "none",
                }}
                onMouseEnter={(e) => {
                  if (animation)
                    e.currentTarget.style.transform = "scale(1.15)";
                }}
                onMouseLeave={(e) => {
                  if (animation) e.currentTarget.style.transform = "scale(1)";
                }}
                title={`Value: ${value}`}
              >
                {showValues && cellWidth > 10 && (
                  <span style={{ fontSize: "8px", fontWeight: 700, color: tc }}>
                    {value}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Low Color</label>
          <input
            type="color"
            value={colorLow}
            onChange={(e) => setColorLow(e.target.value)}
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
          <label style={labelStyle}>🎨 High Color</label>
          <input
            type="color"
            value={colorHigh}
            onChange={(e) => setColorHigh(e.target.value)}
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
          <label style={labelStyle}>📏 Width: {cellWidth}px</label>
          <input
            type="range"
            min="6"
            max="30"
            value={cellWidth}
            onChange={(e) => setCellWidth(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Height: {cellHeight}px</label>
          <input
            type="range"
            min="20"
            max="80"
            value={cellHeight}
            onChange={(e) => setCellHeight(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔢 Show Values</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showValues}
              onChange={(e) => setShowValues(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>In cells</span>
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
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>
              Hover effect
            </span>
          </label>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={regenerate} style={buttonStyle()}>
          🔄 Regenerate
        </button>
        <button onClick={sortData} style={buttonStyle("#58a6ff")}>
          📊 Sort
        </button>
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
          Min: <strong style={{ color: colorLow }}>{minVal}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Max: <strong style={{ color: colorHigh }}>{maxVal}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Count: <strong style={{ color: "#f0f6fc" }}>{data.length}</strong>
        </span>
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
            {data.slice(0, 30).map((v, i) => (
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
                    color: getColor(v),
                    fontWeight: 700,
                  }}
                >
                  {v}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OneDHeatmapComponent;
