import React, { useState, useCallback, useMemo } from "react";
import { theme } from "../../../styles/theme";

const DEFAULT_DATA = [
  { name: "Phase 1", start: 0, duration: 5, color: "#a371f7" },
  { name: "Phase 2", start: 3, duration: 4, color: "#58a6ff" },
  { name: "Phase 3", start: 5, duration: 6, color: "#3fb950" },
  { name: "Phase 4", start: 7, duration: 3, color: "#f85149" },
  { name: "Phase 5", start: 9, duration: 5, color: "#d29922" },
];

const GanttChartComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#a371f7",
}) => {
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Gantt Chart");
  const [barHeight, setBarHeight] = useState(30);
  const [barSpacing, setBarSpacing] = useState(8);
  const [showLabels, setShowLabels] = useState(true);
  const [showGrid, setGridVisible] = useState(true);
  const [animation, setAnimation] = useState(true);

  const maxDuration = useMemo(() => {
    return Math.max(...data.map((d) => d.start + d.duration));
  }, [data]);

  const handleDataChange = useCallback((index, field, newValue) => {
    setData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: Number(newValue) || 0 };
      return updated;
    });
  }, []);

  const handleNameChange = useCallback((index, newName) => {
    setData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], name: newName };
      return updated;
    });
  }, []);

  const handleColorChange = useCallback((index, newColor) => {
    setData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], color: newColor };
      return updated;
    });
  }, []);

  const addTask = useCallback(() => {
    setData((prev) => [
      ...prev,
      {
        name: `Task ${prev.length + 1}`,
        start: Math.floor(Math.random() * 5),
        duration: Math.floor(Math.random() * 5) + 2,
        color: theme.colors.charts[prev.length % theme.colors.charts.length],
      },
    ]);
  }, []);

  const removeTask = useCallback((index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const renderGantt = () => {
    const padding = 20;
    const totalHeight = data.length * (barHeight + barSpacing) + padding * 2;
    const chartWidth = 700;

    return (
      <svg
        width="100%"
        height={Math.max(totalHeight + 20, 300)}
        viewBox={`0 0 ${chartWidth} ${Math.max(totalHeight + 20, 300)}`}
      >
        {/* Grid lines */}
        {showGrid &&
          Array.from({ length: maxDuration + 1 }, (_, i) => (
            <line
              key={i}
              x1={padding + (i / maxDuration) * (chartWidth - padding * 2)}
              y1={20}
              x2={padding + (i / maxDuration) * (chartWidth - padding * 2)}
              y2={totalHeight}
              stroke="#e2e8f0"
              strokeWidth="0.5"
            />
          ))}
        {/* Bars */}
        {data.map((task, i) => {
          const x =
            padding + (task.start / maxDuration) * (chartWidth - padding * 2);
          const width =
            (task.duration / maxDuration) * (chartWidth - padding * 2);
          const y = padding + i * (barHeight + barSpacing);
          const color = task.color || chartColor;

          return (
            <g key={i}>
              {showLabels && (
                <text
                  x={5}
                  y={y + barHeight / 2 + 4}
                  fill="#8b949e"
                  fontSize="10"
                  textAnchor="start"
                >
                  {task.name}
                </text>
              )}
              <rect
                x={x}
                y={y}
                width={Math.max(width, 2)}
                height={barHeight}
                fill={color}
                opacity="0.85"
                rx="3"
                style={{
                  transition: animation ? "all 0.3s ease" : "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  if (animation) e.target.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  if (animation) e.target.style.opacity = "0.85";
                }}
              >
                <title>
                  {task.name}: {task.start} → {task.start + task.duration}
                </title>
              </rect>
              <text
                x={x + width / 2}
                y={y + barHeight / 2 + 4}
                fill="#fff"
                fontSize="8"
                fontWeight="600"
                textAnchor="middle"
              >
                {task.duration}
              </text>
            </g>
          );
        })}
        {/* X-axis labels */}
        {Array.from({ length: maxDuration + 1 }, (_, i) => (
          <text
            key={i}
            x={padding + (i / maxDuration) * (chartWidth - padding * 2)}
            y={totalHeight + 14}
            fill="#8b949e"
            fontSize="8"
            textAnchor="middle"
          >
            {i}
          </text>
        ))}
      </svg>
    );
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
    width: "240px",
  };
  const chartContainerStyle = {
    background: "#ffffff",
    borderRadius: "6px",
    padding: "16px",
    border: "1px solid #30363d",
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
  const cellInputStyle = (w = "55px") => ({
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
          <span style={{ fontSize: "28px" }}>📅</span>
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
            TEMPORAL
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
            {data.length} TASKS
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        {renderGantt()}
      </div>

      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Bar Height: {barHeight}px</label>
          <input
            type="range"
            min="16"
            max="50"
            value={barHeight}
            onChange={(e) => setBarHeight(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>↔️ Spacing: {barSpacing}px</label>
          <input
            type="range"
            min="4"
            max="20"
            value={barSpacing}
            onChange={(e) => setBarSpacing(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🏷️ Labels</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showLabels}
              onChange={(e) => setShowLabels(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>Show</span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔲 Grid</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setGridVisible(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>Show</span>
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

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <label style={labelStyle}>📋 Data</label>
          <button onClick={addTask} style={buttonStyle()}>
            + Add Task
          </button>
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
                  Task
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
                  Start
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
                  Duration
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
                  Action
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
                    }}
                  >
                    <input
                      type="text"
                      value={row.name}
                      onChange={(e) => handleNameChange(i, e.target.value)}
                      style={cellInputStyle("60px")}
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
                      value={row.start}
                      onChange={(e) =>
                        handleDataChange(i, "start", e.target.value)
                      }
                      style={cellInputStyle("50px")}
                      min="0"
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
                      value={row.duration}
                      onChange={(e) =>
                        handleDataChange(i, "duration", e.target.value)
                      }
                      style={cellInputStyle("50px")}
                      min="1"
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
                      type="color"
                      value={row.color || chartColor}
                      onChange={(e) => handleColorChange(i, e.target.value)}
                      style={{
                        width: "36px",
                        height: "24px",
                        cursor: "pointer",
                        border: "none",
                      }}
                    />
                  </td>
                  <td
                    style={{
                      padding: "4px 8px",
                      borderBottom: "1px solid #21262d",
                      fontSize: "10px",
                    }}
                  >
                    <button
                      onClick={() => removeTask(i)}
                      style={{
                        padding: "2px 6px",
                        background: "transparent",
                        border: "1px solid #f85149",
                        borderRadius: "2px",
                        color: "#f85149",
                        cursor: "pointer",
                        fontSize: "9px",
                      }}
                      disabled={data.length <= 2}
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

export default GanttChartComponent;
