import React, { useState, useCallback, useMemo } from "react";
import { theme } from "../../../styles/theme";

// ============================================
// DEFAULT DATA - 6 dimensions, 8 data rows
// ============================================
const DEFAULT_DATA = {
  dimensions: [
    "Economy",
    "Health",
    "Education",
    "Safety",
    "Environment",
    "Infrastructure",
  ],
  rows: [
    {
      name: "Norway",
      Economy: 85,
      Health: 90,
      Education: 88,
      Safety: 92,
      Environment: 80,
      Infrastructure: 78,
    },
    {
      name: "Switzerland",
      Economy: 88,
      Health: 85,
      Education: 82,
      Safety: 88,
      Environment: 75,
      Infrastructure: 85,
    },
    {
      name: "Canada",
      Economy: 75,
      Health: 80,
      Education: 85,
      Safety: 82,
      Environment: 70,
      Infrastructure: 72,
    },
    {
      name: "Sweden",
      Economy: 72,
      Health: 82,
      Education: 80,
      Safety: 85,
      Environment: 88,
      Infrastructure: 75,
    },
    {
      name: "Germany",
      Economy: 80,
      Health: 78,
      Education: 75,
      Safety: 78,
      Environment: 72,
      Infrastructure: 82,
    },
    {
      name: "Japan",
      Economy: 78,
      Health: 88,
      Education: 82,
      Safety: 90,
      Environment: 65,
      Infrastructure: 80,
    },
    {
      name: "USA",
      Economy: 90,
      Health: 70,
      Education: 78,
      Safety: 65,
      Environment: 55,
      Infrastructure: 88,
    },
    {
      name: "Brazil",
      Economy: 55,
      Health: 65,
      Education: 58,
      Safety: 45,
      Environment: 75,
      Infrastructure: 50,
    },
  ],
};

const ROW_COLORS = [
  "#58a6ff",
  "#f85149",
  "#3fb950",
  "#d29922",
  "#a371f7",
  "#79c0ff",
  "#ff7b72",
  "#56d364",
  "#e3b341",
  "#bc8cff",
  "#1f6feb",
  "#da3633",
  "#238636",
  "#9e6a03",
  "#7c3aed",
];

const ParallelCoordinatesComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#58a6ff",
}) => {
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Parallel Coordinates");
  const [rowColors, setRowColors] = useState(ROW_COLORS);
  const [lineOpacity, setLineOpacity] = useState(0.7);
  const [lineWidth, setLineWidth] = useState(2);
  const [highlightedRow, setHighlightedRow] = useState(null);
  const [showLabels, setShowLabels] = useState(true);
  const [showValues, setShowValues] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [axisColor, setAxisColor] = useState("#8b949e");
  const [axisWidth, setAxisWidth] = useState(2);
  const [animation, setAnimation] = useState(true);
  const [smoothing, setSmoothing] = useState(0.3);
  const [padding, setPadding] = useState(40);

  const dimensionRanges = useMemo(() => {
    const ranges = {};
    data.dimensions.forEach((dim) => {
      const values = data.rows.map((row) => row[dim]);
      ranges[dim] = { min: Math.min(...values), max: Math.max(...values) };
    });
    return ranges;
  }, [data]);

  const handleDimensionReorder = useCallback((fromIndex, toIndex) => {
    setData((prev) => {
      const newDimensions = [...prev.dimensions];
      const [moved] = newDimensions.splice(fromIndex, 1);
      newDimensions.splice(toIndex, 0, moved);
      return { ...prev, dimensions: newDimensions };
    });
  }, []);

  const handleRowValueChange = useCallback((rowIndex, dimension, newValue) => {
    setData((prev) => {
      const newRows = [...prev.rows];
      newRows[rowIndex] = {
        ...newRows[rowIndex],
        [dimension]: Number(newValue) || 0,
      };
      return { ...prev, rows: newRows };
    });
  }, []);
  const handleRowNameChange = useCallback((rowIndex, newName) => {
    setData((prev) => {
      const newRows = [...prev.rows];
      newRows[rowIndex] = { ...newRows[rowIndex], name: newName };
      return { ...prev, rows: newRows };
    });
  }, []);
  const handleDimensionNameChange = useCallback((dimIndex, newName) => {
    setData((prev) => {
      const newDimensions = [...prev.dimensions];
      const oldName = newDimensions[dimIndex];
      newDimensions[dimIndex] = newName;
      const newRows = prev.rows.map((row) => {
        const newRow = { ...row };
        newRow[newName] = newRow[oldName];
        delete newRow[oldName];
        return newRow;
      });
      return { dimensions: newDimensions, rows: newRows };
    });
  }, []);
  const addRow = useCallback(() => {
    const newRow = { name: `Item ${data.rows.length + 1}` };
    data.dimensions.forEach((dim) => {
      const range = dimensionRanges[dim];
      newRow[dim] =
        Math.floor(Math.random() * (range.max - range.min)) + range.min;
    });
    setData((prev) => ({ ...prev, rows: [...prev.rows, newRow] }));
  }, [data, dimensionRanges]);
  const addDimension = useCallback(() => {
    const newDim = `Dimension ${data.dimensions.length + 1}`;
    setData((prev) => {
      const newRows = prev.rows.map((row) => ({
        ...row,
        [newDim]: Math.floor(Math.random() * 80) + 20,
      }));
      return { dimensions: [...prev.dimensions, newDim], rows: newRows };
    });
  }, [data]);
  const removeRow = useCallback((index) => {
    setData((prev) => ({
      ...prev,
      rows: prev.rows.filter((_, i) => i !== index),
    }));
  }, []);
  const removeDimension = useCallback((index) => {
    setData((prev) => {
      const dimToRemove = prev.dimensions[index];
      const newRows = prev.rows.map((row) => {
        const newRow = { ...row };
        delete newRow[dimToRemove];
        return newRow;
      });
      return {
        dimensions: prev.dimensions.filter((_, i) => i !== index),
        rows: newRows,
      };
    });
  }, []);

  const chartWidth = 900;
  const chartHeight = 500;
  // USE padding for dynamic layout
  const leftPadding = padding;
  const rightPadding = padding;
  const topPadding = 40;
  const bottomPadding = 60;

  const getXPosition = (dimIndex) => {
    const totalDims = data.dimensions.length;
    const availableWidth = chartWidth - leftPadding - rightPadding;
    const step =
      totalDims > 1 ? availableWidth / (totalDims - 1) : availableWidth / 2;
    return leftPadding + dimIndex * step;
  };
  const getYPosition = (value, dim) => {
    const range = dimensionRanges[dim];
    const availableHeight = chartHeight - topPadding - bottomPadding;
    const normalizedValue = (value - range.min) / (range.max - range.min || 1);
    return chartHeight - bottomPadding - normalizedValue * availableHeight;
  };

  const generatePath = (row) => {
    let path = "";
    data.dimensions.forEach((dim, index) => {
      const x = getXPosition(index);
      const y = getYPosition(row[dim], dim);
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        const prevX = getXPosition(index - 1);
        const prevY = getYPosition(
          row[data.dimensions[index - 1]],
          data.dimensions[index - 1],
        );
        const cp1x = prevX + (x - prevX) * smoothing;
        const cp1y = prevY;
        const cp2x = x - (x - prevX) * smoothing;
        const cp2y = y;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
      }
    });
    return path;
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
    width: "300px",
  };
  const chartContainerStyle = {
    background: "#ffffff",
    borderRadius: "6px",
    padding: "20px",
    border: `1px solid ${theme.colors.border.light}`,
    overflow: "auto",
    minHeight: "520px",
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
  const checkboxStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
  };
  const cellInputStyle = (width = "65px") => ({
    padding: "4px 5px",
    background: theme.colors.inputBg,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: "3px",
    color: theme.colors.text.body,
    fontSize: "10px",
    fontFamily: theme.typography.fontFamily.primary,
    width: width,
    outline: "none",
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
    padding: "2px 5px",
    background: "transparent",
    border: "1px solid #f85149",
    borderRadius: "2px",
    color: "#f85149",
    cursor: "pointer",
    fontSize: "8px",
  };
  const thStyle = {
    background: "#0d1117",
    color: "#8b949e",
    padding: "6px 8px",
    textAlign: "left",
    fontSize: "9px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1px",
    borderBottom: "2px solid #30363d",
    whiteSpace: "nowrap",
  };
  const tdStyle = { padding: "4px 6px", borderBottom: "1px solid #21262d" };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>〰️</span>
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
            {data.dimensions.length}D × {data.rows.length}R
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        <svg
          width={chartWidth}
          height={chartHeight}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        >
          {showGrid &&
            data.dimensions.map((dim, dimIndex) => {
              const x = getXPosition(dimIndex);
              const range = dimensionRanges[dim];
              const steps = 5;
              return Array.from({ length: steps + 1 }, (_, i) => {
                const value = range.min + (range.max - range.min) * (i / steps);
                const y = getYPosition(value, dim);
                return (
                  <g key={`grid-${dimIndex}-${i}`}>
                    <line
                      x1={x - 5}
                      y1={y}
                      x2={x + 5}
                      y2={y}
                      stroke="#e2e8f0"
                      strokeWidth={0.5}
                    />
                    {showValues && (
                      <text
                        x={x - 8}
                        y={y + 3}
                        textAnchor="end"
                        fill="#94a3b8"
                        fontSize="8"
                        fontFamily={theme.typography.fontFamily.primary}
                      >
                        {value.toFixed(0)}
                      </text>
                    )}
                  </g>
                );
              });
            })}
          {data.rows.map((row, rowIndex) => {
            const isHighlighted = highlightedRow !== null;
            const isThisHighlighted = highlightedRow === rowIndex;
            const shouldShow = !isHighlighted || isThisHighlighted;
            if (!shouldShow) return null;
            const rowColor = rowColors[rowIndex % rowColors.length];
            const opacity = isHighlighted
              ? isThisHighlighted
                ? 1
                : 0.08
              : lineOpacity;
            return (
              <path
                key={`path-${rowIndex}`}
                d={generatePath(row)}
                fill="none"
                stroke={rowColor}
                strokeWidth={isThisHighlighted ? lineWidth + 1.5 : lineWidth}
                strokeOpacity={opacity}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  cursor: "pointer",
                  transition: animation ? "all 0.3s ease" : "none",
                }}
                onMouseEnter={() => setHighlightedRow(rowIndex)}
                onMouseLeave={() => setHighlightedRow(null)}
              />
            );
          })}
          {data.rows.map((row, rowIndex) => {
            const isHighlighted = highlightedRow !== null;
            const isThisHighlighted = highlightedRow === rowIndex;
            if (isHighlighted && !isThisHighlighted) return null;
            const rowColor = rowColors[rowIndex % rowColors.length];
            return data.dimensions.map((dim, dimIndex) => {
              const x = getXPosition(dimIndex);
              const y = getYPosition(row[dim], dim);
              return (
                <circle
                  key={`dot-${rowIndex}-${dimIndex}`}
                  cx={x}
                  cy={y}
                  r={isThisHighlighted ? 5 : 3}
                  fill="#ffffff"
                  stroke={rowColor}
                  strokeWidth={2}
                  style={{
                    cursor: "pointer",
                    transition: animation ? "all 0.2s ease" : "none",
                  }}
                  onMouseEnter={() => setHighlightedRow(rowIndex)}
                  onMouseLeave={() => setHighlightedRow(null)}
                >
                  <title>{`${row.name}: ${dim}=${row[dim]}`}</title>
                </circle>
              );
            });
          })}
          {data.dimensions.map((dim, dimIndex) => {
            const x = getXPosition(dimIndex);
            const topY = getYPosition(dimensionRanges[dim].max, dim);
            const bottomY = getYPosition(dimensionRanges[dim].min, dim);
            return (
              <g key={`axis-${dimIndex}`}>
                <line
                  x1={x}
                  y1={topY - 10}
                  x2={x}
                  y2={bottomY + 10}
                  stroke={axisColor}
                  strokeWidth={axisWidth}
                  strokeLinecap="round"
                />
                <line
                  x1={x - 8}
                  y1={topY}
                  x2={x + 8}
                  y2={topY}
                  stroke={axisColor}
                  strokeWidth={1.5}
                />
                <line
                  x1={x - 8}
                  y1={bottomY}
                  x2={x + 8}
                  y2={bottomY}
                  stroke={axisColor}
                  strokeWidth={1.5}
                />
                {showLabels && (
                  <text
                    x={x}
                    y={bottomY + 25}
                    textAnchor="middle"
                    fill={theme.colors.mainBg}
                    fontSize="10"
                    fontWeight="700"
                    fontFamily={theme.typography.fontFamily.primary}
                    letterSpacing="0.5px"
                  >
                    {dim}
                  </text>
                )}
                <text
                  x={x + 10}
                  y={topY + 3}
                  fill="#94a3b8"
                  fontSize="7"
                  fontFamily={theme.typography.fontFamily.primary}
                >
                  {dimensionRanges[dim].max}
                </text>
                <text
                  x={x + 10}
                  y={bottomY + 3}
                  fill="#94a3b8"
                  fontSize="7"
                  fontFamily={theme.typography.fontFamily.primary}
                >
                  {dimensionRanges[dim].min}
                </text>
              </g>
            );
          })}
        </svg>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            marginTop: "12px",
            flexWrap: "wrap",
          }}
        >
          {data.rows.map((row, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                cursor: "pointer",
                opacity:
                  highlightedRow !== null && highlightedRow !== index ? 0.3 : 1,
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={() => setHighlightedRow(index)}
              onMouseLeave={() => setHighlightedRow(null)}
            >
              <span
                style={{
                  width: "12px",
                  height: "3px",
                  background: rowColors[index % rowColors.length],
                  borderRadius: "2px",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  color: theme.colors.mainBg,
                  fontSize: "9px",
                  fontWeight: 600,
                }}
              >
                {row.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>〰️ Line Opacity: {lineOpacity}</label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={lineOpacity}
            onChange={(e) => setLineOpacity(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Line Width: {lineWidth}px</label>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.5"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>〰️ Smoothing: {smoothing.toFixed(1)}</label>
          <input
            type="range"
            min="0"
            max="0.8"
            step="0.05"
            value={smoothing}
            onChange={(e) => setSmoothing(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Padding: {padding}px</label>
          <input
            type="range"
            min="20"
            max="80"
            value={padding}
            onChange={(e) => setPadding(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Axis Color</label>
          <input
            type="color"
            value={axisColor}
            onChange={(e) => setAxisColor(e.target.value)}
            style={{
              width: "32px",
              height: "28px",
              cursor: "pointer",
              border: "1px solid #30363d",
              borderRadius: "3px",
              padding: "2px",
            }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Axis Width: {axisWidth}px</label>
          <input
            type="range"
            min="1"
            max="5"
            step="0.5"
            value={axisWidth}
            onChange={(e) => setAxisWidth(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>✨ Animation</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={animation}
              onChange={(e) => setAnimation(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Smooth transitions
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
              Axis labels
            </span>
          </label>
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
              Tick values
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔲 Grid Lines</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Show grid
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
        <label style={labelStyle}>🎨 Row Colors</label>
        <div
          style={{
            display: "flex",
            gap: "6px",
            marginTop: "8px",
            flexWrap: "wrap",
          }}
        >
          {data.rows.map((row, i) => (
            <input
              key={i}
              type="color"
              value={rowColors[i] || "#58a6ff"}
              onChange={(e) => {
                const updated = [...rowColors];
                updated[i] = e.target.value;
                setRowColors(updated);
              }}
              title={row.name}
              style={{
                width: "24px",
                height: "24px",
                cursor: "pointer",
                border: "none",
                borderRadius: "2px",
                padding: "1px",
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <label style={labelStyle}>
            📐 Dimensions ({data.dimensions.length})
          </label>
          <button onClick={addDimension} style={buttonStyle()}>
            + Add Dimension
          </button>
        </div>
        <div
          style={{
            display: "flex",
            gap: "6px",
            flexWrap: "wrap",
            marginBottom: "16px",
          }}
        >
          {data.dimensions.map((dim, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "3px",
                background: theme.colors.cardBg,
                padding: "4px 8px",
                borderRadius: "3px",
                border: `1px solid ${theme.colors.border.default}`,
              }}
            >
              {/* Reorder buttons using handleDimensionReorder */}
              <button
                onClick={() => handleDimensionReorder(i, Math.max(0, i - 1))}
                disabled={i === 0}
                style={{
                  ...deleteBtnStyle,
                  border: "1px solid #8b949e",
                  color: "#8b949e",
                  fontSize: "10px",
                  padding: "1px 3px",
                  cursor: i === 0 ? "default" : "pointer",
                  opacity: i === 0 ? 0.3 : 1,
                }}
              >
                ◀
              </button>
              <input
                type="text"
                value={dim}
                onChange={(e) => handleDimensionNameChange(i, e.target.value)}
                style={{
                  ...cellInputStyle("70px"),
                  border: "none",
                  background: "transparent",
                  fontWeight: 600,
                }}
              />
              <button
                onClick={() =>
                  handleDimensionReorder(
                    i,
                    Math.min(data.dimensions.length - 1, i + 1),
                  )
                }
                disabled={i === data.dimensions.length - 1}
                style={{
                  ...deleteBtnStyle,
                  border: "1px solid #8b949e",
                  color: "#8b949e",
                  fontSize: "10px",
                  padding: "1px 3px",
                  cursor:
                    i === data.dimensions.length - 1 ? "default" : "pointer",
                  opacity: i === data.dimensions.length - 1 ? 0.3 : 1,
                }}
              >
                ▶
              </button>
              <button
                onClick={() => removeDimension(i)}
                style={deleteBtnStyle}
                disabled={data.dimensions.length <= 3}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <label style={labelStyle}>📋 Data Rows ({data.rows.length})</label>
          <button onClick={addRow} style={buttonStyle()}>
            + Add Row
          </button>
        </div>
        <div
          style={{
            overflow: "auto",
            maxHeight: "350px",
            background: theme.colors.cardBg,
            borderRadius: "4px",
            border: `1px solid ${theme.colors.border.default}`,
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "10px",
            }}
          >
            <thead>
              <tr>
                <th style={{ ...thStyle, position: "sticky", top: 0 }}>#</th>
                <th style={{ ...thStyle, position: "sticky", top: 0 }}>Name</th>
                {data.dimensions.map((dim) => (
                  <th
                    key={dim}
                    style={{ ...thStyle, position: "sticky", top: 0 }}
                  >
                    {dim}
                  </th>
                ))}
                <th style={{ ...thStyle, position: "sticky", top: 0 }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td style={tdStyle}>{rowIndex + 1}</td>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      value={row.name}
                      onChange={(e) =>
                        handleRowNameChange(rowIndex, e.target.value)
                      }
                      style={cellInputStyle("70px")}
                    />
                  </td>
                  {data.dimensions.map((dim) => (
                    <td key={dim} style={tdStyle}>
                      <input
                        type="number"
                        value={row[dim]}
                        onChange={(e) =>
                          handleRowValueChange(rowIndex, dim, e.target.value)
                        }
                        style={cellInputStyle("50px")}
                      />
                    </td>
                  ))}
                  <td style={tdStyle}>
                    <button
                      onClick={() => removeRow(rowIndex)}
                      style={deleteBtnStyle}
                      disabled={data.rows.length <= 2}
                    >
                      ×
                    </button>
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

export default ParallelCoordinatesComponent;

