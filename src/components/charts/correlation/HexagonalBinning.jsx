import React, { useState, useCallback, useMemo } from "react";
import { theme } from "../../../styles/theme";

const generateData = () => {
  const points = [];
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * 80 + 10;
    const y = Math.random() * 80 + 10;
    points.push({ x, y });
  }
  return points;
};

const HexagonalBinningComponent = ({
  initialData = null,
  chartColor = "#3fb950",
}) => {
  const [data, setData] = useState(generateData());
  const [titleText, setTitleText] = useState("Hexagonal Binning");
  const [colorLow, setColorLow] = useState("#0d1117");
  const [colorHigh, setColorHigh] = useState(chartColor);
  const [hexSize, setHexSize] = useState(8);
  const [showHexagons, setShowHexagons] = useState(true);
  const [showPoints, setShowPoints] = useState(false);
  const [animation, setAnimation] = useState(true);

  const hexData = useMemo(() => {
    const bins = {};
    const hexWidth = hexSize * 2;
    const hexHeight = Math.sqrt(3) * hexSize;
    data.forEach((point) => {
      const col = Math.round(point.x / (hexWidth * 0.75));
      const row = Math.round(
        (point.y - ((col % 2) * hexHeight) / 2) / hexHeight,
      );
      const key = `${col},${row}`;
      if (!bins[key]) bins[key] = { col, row, count: 0, points: [] };
      bins[key].count++;
      bins[key].points.push(point);
    });
    return Object.values(bins);
  }, [data, hexSize]);

  const maxCount = useMemo(
    () => Math.max(...hexData.map((d) => d.count), 1),
    [hexData],
  );

  const getColor = useCallback(
    (count) => {
      const ratio = count / maxCount;
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
    [colorLow, colorHigh, maxCount],
  );

  const getHexPoints = (cx, cy, size) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      points.push(
        `${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`,
      );
    }
    return points.join(" ");
  };

  const addPoints = useCallback(() => {
    const newPts = [];
    for (let i = 0; i < 50; i++)
      newPts.push({ x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 });
    setData((prev) => [...prev, ...newPts]);
  }, []);
  const resetPoints = useCallback(() => {
    setData(generateData());
  }, []);
  const clearPoints = useCallback(() => {
    setData([]);
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
    width: "260px",
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
          <span style={{ fontSize: "28px" }}>⬡</span>
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
          {showHexagons &&
            hexData.map((bin, i) => {
              const cx = bin.col * hexSize * 1.5;
              const cy =
                bin.row * Math.sqrt(3) * hexSize +
                ((bin.col % 2) * Math.sqrt(3) * hexSize) / 2;
              return (
                <polygon
                  key={i}
                  points={getHexPoints(cx, cy, hexSize)}
                  fill={getColor(bin.count)}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="0.3"
                >
                  <title>Count: {bin.count}</title>
                </polygon>
              );
            })}
          {showPoints &&
            data.map((point, i) => (
              <circle
                key={i}
                cx={point.x}
                cy={point.y}
                r="0.5"
                fill={chartColor}
                opacity={0.4}
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
          <label style={labelStyle}>⬡ Hex Size: {hexSize}px</label>
          <input
            type="range"
            min="4"
            max="15"
            value={hexSize}
            onChange={(e) => setHexSize(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>⬡ Show Hexagons</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showHexagons}
              onChange={(e) => setShowHexagons(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>Bins</span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>⚫ Show Points</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showPoints}
              onChange={(e) => setShowPoints(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>Raw data</span>
          </label>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button onClick={addPoints} style={buttonStyle()}>
          + Add 50 Points
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
          Bins: <strong style={{ color: colorHigh }}>{hexData.length}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Max Count: <strong style={{ color: colorHigh }}>{maxCount}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Hex Size: <strong style={{ color: "#f0f6fc" }}>{hexSize}px</strong>
        </span>
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
                Count
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
                Color
              </th>
            </tr>
          </thead>
          <tbody>
            {hexData
              .sort((a, b) => b.count - a.count)
              .slice(0, 30)
              .map((bin, i) => (
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
                      color: getColor(bin.count),
                      fontWeight: 700,
                    }}
                  >
                    {bin.count}
                  </td>
                  <td
                    style={{
                      padding: "4px 8px",
                      borderBottom: "1px solid #21262d",
                      fontSize: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "14px",
                        background: getColor(bin.count),
                        borderRadius: "2px",
                      }}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HexagonalBinningComponent;
