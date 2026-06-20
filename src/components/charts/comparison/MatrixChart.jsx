import React, { useState, useCallback, useMemo } from "react";
import { theme } from "../../../styles/theme";

const DEFAULT_ROWS = ["Low Risk", "Medium Risk", "High Risk"];
const DEFAULT_COLS = ["Low Impact", "Medium Impact", "High Impact"];
const DEFAULT_MATRIX = [
  { row: "Low Risk", col: "Low Impact", value: 85 },
  { row: "Low Risk", col: "Medium Impact", value: 60 },
  { row: "Low Risk", col: "High Impact", value: 35 },
  { row: "Medium Risk", col: "Low Impact", value: 55 },
  { row: "Medium Risk", col: "Medium Impact", value: 45 },
  { row: "Medium Risk", col: "High Impact", value: 25 },
  { row: "High Risk", col: "Low Impact", value: 30 },
  { row: "High Risk", col: "Medium Impact", value: 20 },
  { row: "High Risk", col: "High Impact", value: 10 },
];

const COLOR_SCALE_PRESETS = [
  {
    name: "Blue Scale",
    colors: ["#0d419d", "#1f6feb", "#58a6ff", "#79c0ff", "#cae8ff"],
    type: "sequential",
  },
  {
    name: "Green Scale",
    colors: ["#0e4429", "#238636", "#3fb950", "#56d364", "#7ee787"],
    type: "sequential",
  },
  {
    name: "Red Scale",
    colors: ["#da3633", "#f85149", "#ff7b72", "#ffa198", "#ffc1ba"],
    type: "sequential",
  },
  {
    name: "Purple Scale",
    colors: ["#4c1d95", "#7c3aed", "#a371f7", "#bc8cff", "#d8b4fe"],
    type: "sequential",
  },
  {
    name: "Diverging R-G",
    colors: ["#f85149", "#ff7b72", "#f0f6fc", "#56d364", "#3fb950"],
    type: "diverging",
  },
  {
    name: "Diverging B-O",
    colors: ["#1f6feb", "#58a6ff", "#f0f6fc", "#e3b341", "#d29922"],
    type: "diverging",
  },
  {
    name: "Heat Map",
    colors: ["#0d1117", "#1f6feb", "#58a6ff", "#d29922", "#f85149"],
    type: "sequential",
  },
];

const CELL_SHAPES = [
  { name: "Square", value: "square" },
  { name: "Circle", value: "circle" },
  { name: "Rounded", value: "rounded" },
];

const MatrixChartComponent = ({
  initialData = DEFAULT_MATRIX,
  chartColor = "#58a6ff",
}) => {
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [cols, setCols] = useState(DEFAULT_COLS);
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Matrix Chart");
  const [colorScale, setColorScale] = useState(COLOR_SCALE_PRESETS[0].colors);
  const [colorScaleName, setColorScaleName] = useState("Blue Scale");
  const [cellSize, setCellSize] = useState(80);
  const [cellShape, setCellShape] = useState("square");
  const [cellGap, setCellGap] = useState(4);
  const [showValues, setShowValues] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showColorLegend, setShowColorLegend] = useState(true);
  const [valueFormat, setValueFormat] = useState("number");
  const [borderVisible, setBorderVisible] = useState(true);
  const [hoverEffect, setHoverEffect] = useState(true);
  const [highlightMin, setHighlightMin] = useState(false);
  const [highlightMax, setHighlightMax] = useState(false);

  const allValues = useMemo(() => data.map((d) => d.value), [data]);
  const minValue = useMemo(() => Math.min(...allValues), [allValues]);
  const maxValue = useMemo(() => Math.max(...allValues), [allValues]);
  const midValue = useMemo(
    () => (minValue + maxValue) / 2,
    [minValue, maxValue],
  );

  // ✅ FIX: removed normalizedValue, kept only adjustedValue
  const getCellColor = useCallback(
    (value) => {
      const adjustedValue =
        value <= midValue
          ? (0.5 * (value - minValue)) / (midValue - minValue || 1)
          : 0.5 + (0.5 * (value - midValue)) / (maxValue - midValue || 1);
      const index = Math.min(
        Math.floor(adjustedValue * colorScale.length),
        colorScale.length - 1,
      );
      return colorScale[index];
    },
    [colorScale, minValue, maxValue, midValue],
  );

  const getTextColor = useCallback((bgColor) => {
    const hex = bgColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 140 ? "#0d1117" : "#f0f6fc";
  }, []);

  const handleValueChange = useCallback((row, col, newValue) => {
    setData((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((d) => d.row === row && d.col === col);
      if (index !== -1)
        updated[index] = { ...updated[index], value: Number(newValue) || 0 };
      return updated;
    });
  }, []);
  const addRow = useCallback(() => {
    const newRowName = `Row ${rows.length + 1}`;
    setRows((prev) => [...prev, newRowName]);
    const newCells = cols.map((col) => ({
      row: newRowName,
      col,
      value: Math.floor(Math.random() * 80) + 10,
    }));
    setData((prev) => [...prev, ...newCells]);
  }, [rows, cols]);
  const addCol = useCallback(() => {
    const newColName = `Col ${cols.length + 1}`;
    setCols((prev) => [...prev, newColName]);
    const newCells = rows.map((row) => ({
      row,
      col: newColName,
      value: Math.floor(Math.random() * 80) + 10,
    }));
    setData((prev) => [...prev, ...newCells]);
  }, [rows, cols]);
  const removeRow = useCallback((rowName) => {
    setRows((prev) => prev.filter((r) => r !== rowName));
    setData((prev) => prev.filter((d) => d.row !== rowName));
  }, []);
  const removeCol = useCallback((colName) => {
    setCols((prev) => prev.filter((c) => c !== colName));
    setData((prev) => prev.filter((d) => d.col !== colName));
  }, []);
  const renameRow = useCallback((oldName, newName) => {
    setRows((prev) => prev.map((r) => (r === oldName ? newName : r)));
    setData((prev) =>
      prev.map((d) => (d.row === oldName ? { ...d, row: newName } : d)),
    );
  }, []);
  const renameCol = useCallback((oldName, newName) => {
    setCols((prev) => prev.map((c) => (c === oldName ? newName : c)));
    setData((prev) =>
      prev.map((d) => (d.col === oldName ? { ...d, col: newName } : d)),
    );
  }, []);
  const handlePresetChange = (presetName) => {
    const preset = COLOR_SCALE_PRESETS.find((p) => p.name === presetName);
    if (preset) {
      setColorScaleName(presetName);
      setColorScale(preset.colors);
    }
  };
  const getCellValue = (row, col) => {
    const cell = data.find((d) => d.row === row && d.col === col);
    return cell ? cell.value : 0;
  };
  const formatValue = (val) => {
    if (valueFormat === "percent")
      return `${((val / maxValue) * 100).toFixed(0)}%`;
    if (valueFormat === "decimal") return val.toFixed(1);
    return val;
  };

  // ===== STYLES =====
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
    border: `1px solid ${theme.colors.border.light}`,
    minHeight: "400px",
    overflow: "auto",
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
  const selectStyle = {
    padding: "7px 10px",
    background: theme.colors.inputBg,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: "3px",
    color: theme.colors.text.body,
    fontSize: "11px",
    fontFamily: theme.typography.fontFamily.primary,
    outline: "none",
    cursor: "pointer",
  };
  const checkboxStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
  };
  const cellInputStyle = (width = "55px") => ({
    padding: "3px 4px",
    background: "transparent",
    border: "none",
    color: "inherit",
    fontSize: "13px",
    fontWeight: 700,
    fontFamily: theme.typography.fontFamily.primary,
    width: width,
    outline: "none",
    textAlign: "center",
    boxSizing: "border-box",
  });
  const buttonStyle = (color = chartColor) => ({
    padding: "6px 12px",
    background: "transparent",
    border: `1px solid ${color}`,
    borderRadius: "3px",
    color: color,
    cursor: "pointer",
    fontSize: "10px",
    fontFamily: theme.typography.fontFamily.primary,
    fontWeight: 600,
    letterSpacing: "1px",
    textTransform: "uppercase",
  });
  const deleteBtnStyle = {
    padding: "1px 4px",
    background: "transparent",
    border: "1px solid #f85149",
    borderRadius: "2px",
    color: "#f85149",
    cursor: "pointer",
    fontSize: "7px",
    lineHeight: 1,
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>🔲</span>
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
              letterSpacing: "1px",
            }}
          >
            COMPARISON
          </span>
          <span
            style={{
              color: theme.colors.text.muted,
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: "3px",
              letterSpacing: "1px",
            }}
          >
            {rows.length}×{cols.length}
          </span>
        </div>
      </div>
      <div id="chart-visual-area" style={chartContainerStyle}>
        {showColorLegend && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginBottom: "16px",
              fontSize: "10px",
            }}
          >
            <span style={{ color: "#8b949e" }}>{formatValue(minValue)}</span>
            <div
              style={{
                display: "flex",
                height: "16px",
                borderRadius: "3px",
                overflow: "hidden",
                flex: 1,
                maxWidth: "300px",
              }}
            >
              {colorScale.map((color, i) => (
                <div key={i} style={{ flex: 1, background: color }} />
              ))}
            </div>
            <span style={{ color: "#8b949e" }}>{formatValue(maxValue)}</span>
            <span style={{ color: "#484f58", fontSize: "8px" }}>
              Mid: {formatValue(midValue)}
            </span>
          </div>
        )}
        <table style={{ borderCollapse: "collapse", margin: "0 auto" }}>
          <thead>
            {showLabels && (
              <tr>
                <th style={{ padding: "4px" }}></th>
                {cols.map((col, ci) => (
                  <th
                    key={ci}
                    style={{
                      padding: "6px 8px",
                      textAlign: "center",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#8b949e",
                      letterSpacing: "1px",
                      position: "relative",
                    }}
                  >
                    <input
                      type="text"
                      value={col}
                      onChange={(e) => renameCol(col, e.target.value)}
                      style={{
                        ...cellInputStyle("80px"),
                        color: "#8b949e",
                        fontSize: "10px",
                        fontWeight: 700,
                        background: "transparent",
                        border: "none",
                      }}
                    />
                    <button
                      onClick={() => removeCol(col)}
                      style={{
                        ...deleteBtnStyle,
                        position: "absolute",
                        top: 0,
                        right: 0,
                      }}
                      disabled={cols.length <= 2}
                    >
                      ×
                    </button>
                  </th>
                ))}
                {addCol && (
                  <th>
                    <button
                      onClick={addCol}
                      style={{
                        ...buttonStyle("#8b949e"),
                        fontSize: "8px",
                        padding: "4px 8px",
                      }}
                    >
                      + Col
                    </button>
                  </th>
                )}
              </tr>
            )}
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {showLabels && (
                  <td
                    style={{
                      padding: "6px 10px",
                      textAlign: "right",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#8b949e",
                      letterSpacing: "1px",
                      position: "relative",
                    }}
                  >
                    <input
                      type="text"
                      value={row}
                      onChange={(e) => renameRow(row, e.target.value)}
                      style={{
                        ...cellInputStyle("90px"),
                        color: "#8b949e",
                        fontSize: "10px",
                        fontWeight: 700,
                        textAlign: "right",
                        background: "transparent",
                        border: "none",
                      }}
                    />
                    <button
                      onClick={() => removeRow(row)}
                      style={{
                        ...deleteBtnStyle,
                        position: "absolute",
                        top: 0,
                        left: 0,
                      }}
                      disabled={rows.length <= 2}
                    >
                      ×
                    </button>
                  </td>
                )}
                {cols.map((col, ci) => {
                  const cellValue = getCellValue(row, col);
                  const bgColor = getCellColor(cellValue);
                  const textColor = getTextColor(bgColor);
                  const isMax = highlightMax && cellValue === maxValue;
                  const isMin = highlightMin && cellValue === minValue;
                  return (
                    <td key={ci} style={{ padding: `${cellGap}px` }}>
                      <div
                        style={{
                          width: `${cellSize}px`,
                          height: `${cellSize}px`,
                          background: bgColor,
                          borderRadius:
                            cellShape === "circle"
                              ? "50%"
                              : cellShape === "rounded"
                                ? "8px"
                                : "3px",
                          border: borderVisible
                            ? isMax
                              ? "2px solid #f0f6fc"
                              : isMin
                                ? "2px solid #f85149"
                                : "1px solid rgba(0,0,0,0.1)"
                            : "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: hoverEffect ? "all 0.2s ease" : "none",
                          position: "relative",
                          boxShadow: isMax
                            ? "0 0 8px rgba(88,166,255,0.5)"
                            : isMin
                              ? "0 0 8px rgba(248,81,73,0.5)"
                              : "none",
                        }}
                        onMouseEnter={(e) => {
                          if (hoverEffect) {
                            e.currentTarget.style.transform = "scale(1.08)";
                            e.currentTarget.style.zIndex = "5";
                            e.currentTarget.style.boxShadow =
                              "0 4px 16px rgba(0,0,0,0.2)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (hoverEffect) {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.zIndex = "1";
                            e.currentTarget.style.boxShadow = isMax
                              ? "0 0 8px rgba(88,166,255,0.5)"
                              : isMin
                                ? "0 0 8px rgba(248,81,73,0.5)"
                                : "none";
                          }
                        }}
                        title={`${row} × ${col}: ${formatValue(cellValue)}`}
                      >
                        {showValues && (
                          <input
                            type="number"
                            value={cellValue}
                            onChange={(e) =>
                              handleValueChange(row, col, e.target.value)
                            }
                            style={{
                              ...cellInputStyle("50px"),
                              color: textColor,
                              fontSize: "16px",
                              fontWeight: 700,
                              background: "transparent",
                              border: "none",
                            }}
                          />
                        )}
                        {isMax && (
                          <span
                            style={{
                              position: "absolute",
                              top: "3px",
                              right: "5px",
                              fontSize: "8px",
                              color: textColor,
                              fontWeight: 700,
                            }}
                          >
                            MAX
                          </span>
                        )}
                        {isMin && (
                          <span
                            style={{
                              position: "absolute",
                              top: "3px",
                              right: "5px",
                              fontSize: "8px",
                              color: textColor,
                              fontWeight: 700,
                            }}
                          >
                            MIN
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: "12px", textAlign: "center" }}>
          <button onClick={addRow} style={buttonStyle("#8b949e")}>
            + Add Row
          </button>
        </div>
      </div>
      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Color Scale</label>
          <select
            value={colorScaleName}
            onChange={(e) => handlePresetChange(e.target.value)}
            style={selectStyle}
          >
            {COLOR_SCALE_PRESETS.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔷 Cell Shape</label>
          <select
            value={cellShape}
            onChange={(e) => setCellShape(e.target.value)}
            style={selectStyle}
          >
            {CELL_SHAPES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Cell Size: {cellSize}px</label>
          <input
            type="range"
            min="40"
            max="150"
            value={cellSize}
            onChange={(e) => setCellSize(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>↔️ Cell Gap: {cellGap}px</label>
          <input
            type="range"
            min="0"
            max="12"
            value={cellGap}
            onChange={(e) => setCellGap(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📊 Value Format</label>
          <select
            value={valueFormat}
            onChange={(e) => setValueFormat(e.target.value)}
            style={selectStyle}
          >
            <option value="number">Number</option>
            <option value="percent">Percent</option>
            <option value="decimal">Decimal</option>
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔢 Show Values</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showValues}
              onChange={(e) => setShowValues(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              In cells
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🏷️ Show Labels</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showLabels}
              onChange={(e) => setShowLabels(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Row & Col
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Color Legend</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showColorLegend}
              onChange={(e) => setShowColorLegend(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Show scale bar
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔲 Borders</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={borderVisible}
              onChange={(e) => setBorderVisible(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Cell border
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>✨ Hover Effect</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={hoverEffect}
              onChange={(e) => setHoverEffect(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Scale on hover
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔵 Highlight Max</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={highlightMax}
              onChange={(e) => setHighlightMax(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Highest value
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔴 Highlight Min</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={highlightMin}
              onChange={(e) => setHighlightMin(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Lowest value
            </span>
          </label>
        </div>
      </div>
      <div
        style={{
          background: theme.colors.cardBg,
          padding: "12px 16px",
          borderRadius: "4px",
          border: `1px solid ${theme.colors.border.default}`,
        }}
      >
        <label style={labelStyle}>🎨 Custom Color Scale</label>
        <div
          style={{
            display: "flex",
            gap: "4px",
            marginTop: "8px",
            alignItems: "center",
          }}
        >
          <span style={{ color: "#8b949e", fontSize: "9px" }}>
            {formatValue(minValue)}
          </span>
          <div
            style={{
              display: "flex",
              flex: 1,
              height: "20px",
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            {colorScale.map((color, i) => (
              <div key={i} style={{ flex: 1, position: "relative" }}>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => {
                    const updated = [...colorScale];
                    updated[i] = e.target.value;
                    setColorScale(updated);
                    setColorScaleName("Custom");
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    cursor: "pointer",
                    border: "none",
                    padding: 0,
                    opacity: 0,
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                />
                <div
                  style={{ width: "100%", height: "100%", background: color }}
                />
              </div>
            ))}
          </div>
          <span style={{ color: "#8b949e", fontSize: "9px" }}>
            {formatValue(maxValue)}
          </span>
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
          border: `1px solid ${theme.colors.border.default}`,
          fontSize: "10px",
        }}
      >
        <span style={{ color: "#8b949e" }}>
          Min:{" "}
          <strong style={{ color: "#f85149" }}>{formatValue(minValue)}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Mid:{" "}
          <strong style={{ color: "#d29922" }}>{formatValue(midValue)}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Max:{" "}
          <strong style={{ color: "#58a6ff" }}>{formatValue(maxValue)}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Average:{" "}
          <strong style={{ color: "#f0f6fc" }}>
            {formatValue(
              allValues.reduce((s, v) => s + v, 0) / allValues.length,
            )}
          </strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Cells: <strong style={{ color: "#f0f6fc" }}>{data.length}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Grid:{" "}
          <strong style={{ color: "#f0f6fc" }}>
            {rows.length}×{cols.length}
          </strong>
        </span>
      </div>
    </div>
  );
};

export default MatrixChartComponent;

