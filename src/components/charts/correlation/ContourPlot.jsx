import React, { useState, useCallback, useMemo } from "react";
import { theme } from "../../../styles/theme";

const generateData = () => {
  const points = [];
  for (let i = 0; i < 60; i++) {
    points.push({ x: Math.random() * 100, y: Math.random() * 100 });
  }
  return points;
};

const ContourPlotComponent = ({
  initialData = null,
  chartColor = "#3fb950",
}) => {
  const [data, setData] = useState(generateData());
  const [titleText, setTitleText] = useState("Contour Plot");
  const [colorLow, setColorLow] = useState("#0d1117");
  const [colorHigh, setColorHigh] = useState(chartColor);
  const [resolution, setResolution] = useState(20);
  const [showPoints, setShowPoints] = useState(true);
  const [pointSize, setPointSize] = useState(3);
  const [animation, setAnimation] = useState(true);

  const gridData = useMemo(() => {
    const grid = [];
    const cellW = 100 / resolution;
    const cellH = 100 / resolution;
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const cx = i * cellW + cellW / 2;
        const cy = j * cellH + cellH / 2;
        let count = 0;
        data.forEach((p) => {
          if (
            p.x >= i * cellW &&
            p.x < (i + 1) * cellW &&
            p.y >= j * cellH &&
            p.y < (j + 1) * cellH
          )
            count++;
        });
        grid.push({
          x: cx,
          y: cy,
          density: count,
          width: cellW,
          height: cellH,
        });
      }
    }
    return grid;
  }, [data, resolution]);

  const maxDensity = useMemo(
    () => Math.max(...gridData.map((d) => d.density), 1),
    [gridData],
  );

  const getColor = useCallback(
    (density) => {
      const ratio = density / maxDensity;
      const r1 = parseInt(colorLow.slice(1, 3), 16),
        g1 = parseInt(colorLow.slice(3, 5), 16),
        b1 = parseInt(colorLow.slice(5, 7), 16);
      const r2 = parseInt(colorHigh.slice(1, 3), 16),
        g2 = parseInt(colorHigh.slice(3, 5), 16),
        b2 = parseInt(colorHigh.slice(5, 7), 16);
      const r = Math.round(r1 + (r2 - r1) * ratio),
        g = Math.round(g1 + (g2 - g1) * ratio),
        b = Math.round(b1 + (b2 - b1) * ratio);
      return `rgba(${r},${g},${b},${0.3 + ratio * 0.7})`;
    },
    [colorLow, colorHigh, maxDensity],
  );

  const addPoint = useCallback(() => {
    setData((prev) => [
      ...prev,
      { x: Math.random() * 100, y: Math.random() * 100 },
    ]);
  }, []);
  const clearPoints = useCallback(() => {
    setData([]);
  }, []);
  const resetPoints = useCallback(() => {
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
    borderBottom: `2px solid ${chartColor}`,
    color: theme.colors.text.heading,
    fontSize: "20px",
    fontWeight: 700,
    fontFamily: theme.typography.fontFamily.primary,
    letterSpacing: "2px",
    outline: "none",
    padding: "4px 0",
    width: "230px",
  };
  const chartContainerStyle = {
    background: "#ffffff",
    borderRadius: "6px",
    padding: "24px",
    border: "1px solid #30363d",
    minHeight: "500px",
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
          <span style={{ fontSize: "28px" }}>🗺️</span>
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
            CORRELATION
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
            {data.length} POINTS
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        <svg
          width="100%"
          height="480"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {gridData.map((cell, i) => (
            <rect
              key={i}
              x={cell.x - cell.width / 2}
              y={cell.y - cell.height / 2}
              width={cell.width}
              height={cell.height}
              fill={getColor(cell.density)}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="0.3"
            />
          ))}
          {showPoints &&
            data.map((point, i) => (
              <circle
                key={i}
                cx={point.x}
                cy={point.y}
                r={pointSize / 3}
                fill={chartColor}
                opacity={0.6}
              />
            ))}
        </svg>
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
          <label style={labelStyle}>📐 Resolution: {resolution}</label>
          <input
            type="range"
            min="10"
            max="40"
            value={resolution}
            onChange={(e) => setResolution(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>⚫ Point Size: {pointSize}px</label>
          <input
            type="range"
            min="1"
            max="8"
            value={pointSize}
            onChange={(e) => setPointSize(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>⚫ Show Points</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showPoints}
              onChange={(e) => setShowPoints(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>
              Overlay points
            </span>
          </label>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button onClick={addPoint} style={buttonStyle()}>
          + Add Point
        </button>
        <button onClick={resetPoints} style={buttonStyle("#8b949e")}>
          ↺ Reset
        </button>
        <button onClick={clearPoints} style={buttonStyle("#f85149")}>
          ✕ Clear
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
          Points: <strong style={{ color: "#f0f6fc" }}>{data.length}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Max Density:{" "}
          <strong style={{ color: colorHigh }}>{maxDensity}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Resolution:{" "}
          <strong style={{ color: "#f0f6fc" }}>
            {resolution}×{resolution}
          </strong>
        </span>
      </div>

      <div>
        <div style={{ marginBottom: "10px" }}>
          <label style={labelStyle}>📋 Data Points ({data.length})</label>
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
                  X
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
                  Y
                </th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 50).map((p, i) => (
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
                    {p.x.toFixed(1)}
                  </td>
                  <td
                    style={{
                      padding: "4px 8px",
                      borderBottom: "1px solid #21262d",
                      fontSize: "10px",
                    }}
                  >
                    {p.y.toFixed(1)}
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

export default ContourPlotComponent;
