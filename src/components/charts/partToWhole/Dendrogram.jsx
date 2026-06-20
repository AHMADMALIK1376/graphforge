import React, { useState, useCallback, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { theme } from "../../../styles/theme";

const DEFAULT_DATA = [
  {
    name: "Root",
    value: 100,
    children: [
      {
        name: "Branch A",
        value: 60,
        children: [
          { name: "Leaf A1", value: 30 },
          { name: "Leaf A2", value: 20 },
          { name: "Leaf A3", value: 10 },
        ],
      },
      {
        name: "Branch B",
        value: 40,
        children: [
          { name: "Leaf B1", value: 25 },
          { name: "Leaf B2", value: 15 },
        ],
      },
    ],
  },
];

const COLORS = [
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

const SunburstChartComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#f85149",
}) => {
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Sunburst Chart");
  const [levels, setLevels] = useState(2);
  const [showLabels, setShowLabels] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [animation, setAnimation] = useState(true);

  // Flatten hierarchical data for sunburst
  const flattenData = useCallback(
    (items, depth = 0, parentId = "") => {
      const result = [];
      items.forEach((item, index) => {
        const id = `${parentId}-${index}`;
        result.push({ ...item, depth, id, parentId });
        if (item.children && depth < levels - 1) {
          result.push(...flattenData(item.children, depth + 1, id));
        }
      });
      return result;
    },
    [levels],
  );

  const flatData = useMemo(() => flattenData(data), [data, flattenData]);

  const sunburstData = useMemo(() => {
    // Group by depth for visualization
    const depthGroups = {};
    flatData.forEach((item) => {
      if (!depthGroups[item.depth]) depthGroups[item.depth] = [];
      depthGroups[item.depth].push(item);
    });
    return depthGroups;
  }, [flatData]);

  const handleDataChange = useCallback((index, field, newValue) => {
    // Simplified: just update the root data
    setData((prev) => {
      const updated = [...prev];
      updated[0] = { ...updated[0], [field]: Number(newValue) || 0 };
      return updated;
    });
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
    minHeight: "480px",
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
          <span style={{ fontSize: "28px" }}>☀️</span>
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
            {Object.keys(sunburstData).length} LEVELS
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        <div
          style={{
            width: "100%",
            height: "420px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="420" height="420" viewBox="0 0 100 100">
            {Object.entries(sunburstData).map(([depth, items]) => (
              <g key={depth}>
                {items.map((item, i) => {
                  const idx = parseInt(depth);
                  const radius = 15 + idx * 15;
                  const angle = (i / Math.max(items.length, 1)) * 360;
                  const startAngle = (angle * Math.PI) / 180;
                  const endAngle =
                    ((angle + 360 / Math.max(items.length, 1)) * Math.PI) / 180;
                  const x1 = 50 + radius * Math.cos(startAngle);
                  const y1 = 50 + radius * Math.sin(startAngle);
                  const x2 = 50 + radius * Math.cos(endAngle);
                  const y2 = 50 + radius * Math.sin(endAngle);
                  return (
                    <path
                      key={`${depth}-${i}`}
                      d={`M 50 50 L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`}
                      fill={COLORS[(parseInt(depth) + i) % COLORS.length]}
                      opacity={
                        0.3 +
                        (1 -
                          parseInt(depth) / Object.keys(sunburstData).length) *
                          0.5
                      }
                      stroke="#fff"
                      strokeWidth="0.5"
                      style={{
                        transition: animation ? "all 0.3s ease" : "none",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.opacity = "1";
                        e.target.style.transform = "scale(1.02)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.opacity =
                          "0.3 + (1 - parseInt(depth) / Object.keys(sunburstData).length) * 0.5";
                        e.target.style.transform = "scale(1)";
                      }}
                    />
                  );
                })}
              </g>
            ))}
            {showLabels && (
              <text
                x="50"
                y="50"
                textAnchor="middle"
                dominantBaseline="central"
                fill="#0d1117"
                fontSize="4"
                fontWeight="700"
              >
                ROOT
              </text>
            )}
          </svg>
        </div>
      </div>

      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📊 Levels: {levels}</label>
          <input
            type="range"
            min="1"
            max="4"
            value={levels}
            onChange={(e) => setLevels(Number(e.target.value))}
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
          <label style={labelStyle}>📋 Legend</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showLegend}
              onChange={(e) => setShowLegend(e.target.checked)}
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
                Level
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
                Items
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(sunburstData).map(([depth, items]) => (
              <tr key={depth}>
                <td
                  style={{
                    padding: "4px 8px",
                    borderBottom: "1px solid #21262d",
                    fontSize: "10px",
                    color: COLORS[parseInt(depth) % COLORS.length],
                  }}
                >
                  Level {depth}
                </td>
                <td
                  style={{
                    padding: "4px 8px",
                    borderBottom: "1px solid #21262d",
                    fontSize: "10px",
                  }}
                >
                  {items.length}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SunburstChartComponent;
