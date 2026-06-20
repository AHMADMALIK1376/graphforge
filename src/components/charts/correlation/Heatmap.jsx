import React, { useState, useCallback, useMemo } from "react";
import { theme } from "../../../styles/theme";

const DEFAULT_ROWS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DEFAULT_COLS = ["12AM", "4AM", "8AM", "12PM", "4PM", "8PM"];
const generateData = () => {
  const data = [];
  DEFAULT_ROWS.forEach((row) => {
    DEFAULT_COLS.forEach((col) => {
      data.push({ row, col, value: Math.floor(Math.random() * 100) });
    });
  });
  return data;
};

const HeatmapComponent = ({ initialData = null, chartColor = "#3fb950" }) => {
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [cols, setCols] = useState(DEFAULT_COLS);
  const [data, setData] = useState(generateData());
  const [titleText, setTitleText] = useState("Heatmap");
  const [colorLow, setColorLow] = useState("#0d1117");
  const [colorHigh, setColorHigh] = useState(chartColor);
  const [cellSize, setCellSize] = useState(55);
  const [cellGap, setCellGap] = useState(2);
  const [showValues, setShowValues] = useState(true);
  const [animation, setAnimation] = useState(true);

  const allValues = useMemo(() => data.map((d) => d.value), [data]);
  const minValue = useMemo(() => Math.min(...allValues), [allValues]);
  const maxValue = useMemo(() => Math.max(...allValues), [allValues]);

  const getColor = useCallback(
    (value) => {
      const ratio =
        maxValue > minValue ? (value - minValue) / (maxValue - minValue) : 0.5;
      const r1 = parseInt(colorLow.slice(1, 3), 16),
        g1 = parseInt(colorLow.slice(3, 5), 16),
        b1 = parseInt(colorLow.slice(5, 7), 16);
      const r2 = parseInt(colorHigh.slice(1, 3), 16),
        g2 = parseInt(colorHigh.slice(3, 5), 16),
        b2 = parseInt(colorHigh.slice(5, 7), 16);
      const r = Math.round(r1 + (r2 - r1) * ratio),
        g = Math.round(g1 + (g2 - g1) * ratio),
        b = Math.round(b1 + (b2 - b1) * ratio);
      return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    },
    [colorLow, colorHigh, minValue, maxValue],
  );

  const getTextColor = useCallback((bg) => {
    const r = parseInt(bg.slice(1, 3), 16),
      g = parseInt(bg.slice(3, 5), 16),
      b = parseInt(bg.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 130 ? "#0d1117" : "#f0f6fc";
  }, []);

  const handleValueChange = useCallback((row, col, newVal) => {
    setData((prev) => {
      const updated = [...prev];
      const idx = updated.findIndex((d) => d.row === row && d.col === col);
      if (idx !== -1)
        updated[idx] = { ...updated[idx], value: Number(newVal) || 0 };
      return updated;
    });
  }, []);
  const getCellValue = (row, col) => {
    const cell = data.find((d) => d.row === row && d.col === col);
    return cell ? cell.value : 0;
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
    borderBottom: `2px solid ${chartColor}`,
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
    padding: "24px",
    border: "1px solid #30363d",
    overflow: "auto",
    minHeight: "400px",
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
  const cellInputStyle = (w = "40px") => ({
    padding: "2px",
    background: "transparent",
    border: "none",
    color: "inherit",
    fontSize: "11px",
    fontWeight: 700,
    fontFamily: theme.typography.fontFamily.primary,
    width: w,
    textAlign: "center",
    outline: "none",
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
            {rows.length}×{cols.length}
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        <table style={{ borderCollapse: "collapse", margin: "0 auto" }}>
          <thead>
            <tr>
              <th style={{ padding: "4px" }}></th>
              {cols.map((col) => (
                <th
                  key={col}
                  style={{
                    padding: "4px 8px",
                    textAlign: "center",
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "#8b949e",
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row}>
                <td
                  style={{
                    padding: "4px 8px",
                    textAlign: "right",
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "#8b949e",
                  }}
                >
                  {row}
                </td>
                {cols.map((col) => {
                  const val = getCellValue(row, col);
                  const bg = getColor(val);
                  const tc = getTextColor(bg);
                  return (
                    <td key={col} style={{ padding: `${cellGap}px` }}>
                      <div
                        style={{
                          width: `${cellSize}px`,
                          height: `${cellSize}px`,
                          background: bg,
                          borderRadius: "3px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: animation ? "all 0.3s ease" : "none",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          if (animation)
                            e.currentTarget.style.transform = "scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                          if (animation)
                            e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        {showValues && (
                          <input
                            type="number"
                            value={val}
                            onChange={(e) =>
                              handleValueChange(row, col, e.target.value)
                            }
                            style={{ ...cellInputStyle("40px"), color: tc }}
                          />
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
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
          <label style={labelStyle}>📏 Cell Size: {cellSize}px</label>
          <input
            type="range"
            min="30"
            max="100"
            value={cellSize}
            onChange={(e) => setCellSize(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>↔️ Gap: {cellGap}px</label>
          <input
            type="range"
            min="0"
            max="8"
            value={cellGap}
            onChange={(e) => setCellGap(Number(e.target.value))}
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
          Min: <strong style={{ color: colorLow }}>{minValue}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Max: <strong style={{ color: colorHigh }}>{maxValue}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Avg:{" "}
          <strong style={{ color: "#f0f6fc" }}>
            {(allValues.reduce((s, v) => s + v, 0) / allValues.length).toFixed(
              1,
            )}
          </strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Cells: <strong style={{ color: "#f0f6fc" }}>{data.length}</strong>
        </span>
      </div>

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <label style={labelStyle}>📋 Data Table</label>
        </div>
        <div
          id="chart-data-table"
          style={{
            background: theme.colors.cardBg,
            borderRadius: "4px",
            border: "1px solid #30363d",
            overflow: "auto",
            maxHeight: "300px",
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
                  Row
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
                  Col
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
              {data.map((d, i) => (
                <tr key={i}>
                  <td
                    style={{
                      padding: "4px 8px",
                      borderBottom: "1px solid #21262d",
                      fontSize: "10px",
                    }}
                  >
                    {d.row}
                  </td>
                  <td
                    style={{
                      padding: "4px 8px",
                      borderBottom: "1px solid #21262d",
                      fontSize: "10px",
                    }}
                  >
                    {d.col}
                  </td>
                  <td
                    style={{
                      padding: "4px 8px",
                      borderBottom: "1px solid #21262d",
                      fontSize: "10px",
                      color: getColor(d.value),
                      fontWeight: 700,
                    }}
                  >
                    {d.value}
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

export default HeatmapComponent;
