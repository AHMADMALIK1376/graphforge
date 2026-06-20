import React, { useState, useCallback, useMemo } from "react";
import { theme } from "../../../styles/theme";

const DEFAULT_DATA = [
  { name: "Product A", value: 40, color: "#f85149" },
  { name: "Product B", value: 25, color: "#58a6ff" },
  { name: "Product C", value: 20, color: "#3fb950" },
  { name: "Product D", value: 10, color: "#d29922" },
  { name: "Product E", value: 5, color: "#a371f7" },
];

const WaffleChartComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#f85149",
}) => {
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Waffle Chart");
  const [gridSize, setGridSize] = useState(10);
  const [cellSize, setCellSize] = useState(28);
  const [cellGap, setCellGap] = useState(3);
  const [showLabels, setShowLabels] = useState(true);
  const [animation, setAnimation] = useState(true);

  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data]);
  const totalCells = gridSize * gridSize;

  const waffleGrid = useMemo(() => {
    const grid = [];
    let cellIndex = 0;
    data.forEach((item) => {
      const cells = Math.round((item.value / total) * totalCells);
      for (let i = 0; i < cells && cellIndex < totalCells; i++) {
        grid.push({ ...item, cellIndex });
        cellIndex++;
      }
    });
    while (cellIndex < totalCells) {
      grid.push({ name: "empty", value: 0, color: "#e2e8f0", cellIndex });
      cellIndex++;
    }
    return grid;
  }, [data, total, totalCells]);

  const handleDataChange = useCallback((index, field, newValue) => {
    setData((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: field === "value" ? Number(newValue) || 0 : newValue,
      };
      return updated;
    });
  }, []);
  const addItem = useCallback(() => {
    setData((prev) => [
      ...prev,
      {
        name: `Item ${prev.length + 1}`,
        value: Math.floor(Math.random() * 20) + 5,
        color: theme.colors.charts[prev.length % theme.colors.charts.length],
      },
    ]);
  }, []);
  const removeItem = useCallback((index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
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
    minHeight: "420px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
          <span style={{ fontSize: "28px" }}>🧇</span>
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
          <span
            style={{
              color: "#8b949e",
              fontSize: "10px",
              padding: "4px 10px",
              border: "1px solid #30363d",
              borderRadius: "3px",
            }}
          >
            {data.length} ITEMS
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridSize}, ${cellSize + cellGap}px)`,
            gap: `${cellGap}px`,
          }}
        >
          {waffleGrid.map((cell, i) => (
            <div
              key={i}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                background: cell.color,
                borderRadius: "2px",
                transition: animation ? "transform 0.2s ease" : "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                if (animation) e.currentTarget.style.transform = "scale(1.15)";
              }}
              onMouseLeave={(e) => {
                if (animation) e.currentTarget.style.transform = "scale(1)";
              }}
              title={cell.name !== "empty" ? `${cell.name}: ${cell.value}` : ""}
            />
          ))}
        </div>
      </div>

      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>
            📐 Grid: {gridSize}×{gridSize}
          </label>
          <input
            type="range"
            min="5"
            max="15"
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Cell Size: {cellSize}px</label>
          <input
            type="range"
            min="14"
            max="40"
            value={cellSize}
            onChange={(e) => setCellSize(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>↔️ Gap: {cellGap}px</label>
          <input
            type="range"
            min="1"
            max="6"
            value={cellGap}
            onChange={(e) => setCellGap(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🏷️ Show Labels</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showLabels}
              onChange={(e) => setShowLabels(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>Legend</span>
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
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>Hover</span>
          </label>
        </div>
      </div>

      {showLabels && (
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
          {data.map((d, i) => (
            <span
              key={i}
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <span
                style={{
                  width: "12px",
                  height: "12px",
                  background: d.color,
                  borderRadius: "2px",
                }}
              />
              {d.name}: {d.value} ({((d.value / total) * 100).toFixed(0)}%)
            </span>
          ))}
        </div>
      )}

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <label style={labelStyle}>📋 Data</label>
          <button onClick={addItem} style={buttonStyle()}>
            + Add Item
          </button>
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
                  Name
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
                  %
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
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
                    <input
                      type="text"
                      value={row.name}
                      onChange={(e) =>
                        handleDataChange(i, "name", e.target.value)
                      }
                      style={cellInputStyle("70px")}
                    />
                  </td>
                  <td
                    style={{
                      padding: "4px 8px",
                      borderBottom: "1px solid #21262d",
                      fontSize: "10px",
                    }}
                  >
                    <input
                      type="number"
                      value={row.value}
                      onChange={(e) =>
                        handleDataChange(i, "value", e.target.value)
                      }
                      style={cellInputStyle("55px")}
                      min="0"
                    />
                  </td>
                  <td
                    style={{
                      padding: "4px 8px",
                      borderBottom: "1px solid #21262d",
                      fontSize: "10px",
                      color: row.color,
                      fontWeight: 700,
                    }}
                  >
                    {((row.value / total) * 100).toFixed(1)}%
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

export default WaffleChartComponent;
