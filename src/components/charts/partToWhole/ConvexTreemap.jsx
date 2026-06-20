import React, { useState, useCallback, useMemo } from "react";
import { theme } from "../../../styles/theme";

const DEFAULT_DATA = [
  { name: "Group A", value: 40, color: "#f85149" },
  { name: "Group B", value: 30, color: "#58a6ff" },
  { name: "Group C", value: 20, color: "#3fb950" },
  { name: "Group D", value: 10, color: "#d29922" },
];

const CONVEX_COLORS = [
  "#f85149",
  "#58a6ff",
  "#3fb950",
  "#d29922",
  "#a371f7",
  "#79c0ff",
  "#56d364",
  "#ff7b72",
  "#bc8cff",
  "#e3b341",
];

const ConvexTreemapComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#f85149",
}) => {
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Convex Treemap");
  const [showLabels, setShowLabels] = useState(true);
  const [showValues, setShowValues] = useState(true);
  const [animation, setAnimation] = useState(true);

  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data]);

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

  const handleNameChange = useCallback((index, newName) => {
    setData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], name: newName };
      return updated;
    });
  }, []);

  const addItem = useCallback(() => {
    setData((prev) => [
      ...prev,
      {
        name: `Item ${prev.length + 1}`,
        value: Math.floor(Math.random() * 30) + 5,
        color: CONVEX_COLORS[prev.length % CONVEX_COLORS.length],
      },
    ]);
  }, []);

  const removeItem = useCallback((index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Generate convex shapes based on values
  const convexData = useMemo(() => {
    const result = [];
    const sorted = [...data].sort((a, b) => b.value - a.value);
    sorted.forEach((item, i) => {
      const angle = (i / sorted.length) * 360;
      const radius = 30 + (item.value / total) * 40;
      const points = [];
      for (let j = 0; j < 20; j++) {
        const a = (j / 20) * 2 * Math.PI + (angle * Math.PI) / 180;
        const r = radius + (item.value / total) * 20 * Math.sin(a * 3);
        points.push({ x: 50 + r * Math.cos(a), y: 50 + r * Math.sin(a) });
      }
      result.push({
        ...item,
        points,
        radius,
        color: item.color || CONVEX_COLORS[i % CONVEX_COLORS.length],
      });
    });
    return result;
  }, [data, total]);

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
    padding: "16px",
    border: "1px solid #30363d",
    minHeight: "480px",
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
          <span style={{ fontSize: "28px" }}>🔷</span>
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
            {data.length} GROUPS
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        <svg width="100%" height="440" viewBox="0 0 100 100">
          {convexData.map((item, i) => (
            <g key={i}>
              <polygon
                points={item.points.map((p) => `${p.x},${p.y}`).join(" ")}
                fill={item.color}
                opacity="0.7"
                stroke="#fff"
                strokeWidth="0.5"
                style={{
                  transition: animation ? "all 0.4s ease" : "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.target.style.opacity = "1";
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = "0.7";
                  e.target.style.transform = "scale(1)";
                }}
              />
              {showLabels && (
                <text
                  x={
                    50 +
                    item.radius *
                      0.5 *
                      Math.cos((i / convexData.length) * 2 * Math.PI)
                  }
                  y={
                    50 +
                    item.radius *
                      0.5 *
                      Math.sin((i / convexData.length) * 2 * Math.PI)
                  }
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#fff"
                  fontSize="3.5"
                  fontWeight="700"
                  style={{
                    pointerEvents: "none",
                    textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                  }}
                >
                  {item.name}
                  {showValues && ` ${item.value}`}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      <div style={controlsGridStyle}>
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
          <label style={labelStyle}>🔢 Values</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showValues}
              onChange={(e) => setShowValues(e.target.checked)}
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
          <button onClick={addItem} style={buttonStyle()}>
            + Add Group
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
                      onChange={(e) => handleNameChange(i, e.target.value)}
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
                      color:
                        row.color || CONVEX_COLORS[i % CONVEX_COLORS.length],
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

export default ConvexTreemapComponent;
