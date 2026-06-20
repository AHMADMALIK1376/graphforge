import React, { useState, useCallback, useMemo } from "react";
import { theme } from "../../../styles/theme";

const DEFAULT_DATA = [
  {
    name: "Electronics",
    value: 300,
    children: [
      { name: "Phones", value: 150 },
      { name: "Laptops", value: 100 },
      { name: "Tablets", value: 50 },
    ],
  },
  {
    name: "Clothing",
    value: 200,
    children: [
      { name: "Men", value: 80 },
      { name: "Women", value: 70 },
      { name: "Kids", value: 50 },
    ],
  },
  {
    name: "Food",
    value: 150,
    children: [
      { name: "Snacks", value: 60 },
      { name: "Drinks", value: 50 },
      { name: "Meals", value: 40 },
    ],
  },
  {
    name: "Books",
    value: 100,
    children: [
      { name: "Fiction", value: 40 },
      { name: "Non-Fiction", value: 35 },
      { name: "Education", value: 25 },
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

const TreemapComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#f85149",
}) => {
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Treemap");
  const [colorPalette, setColorPalette] = useState(COLORS);
  const [showLabels, setShowLabels] = useState(true);
  const [showValues, setShowValues] = useState(true);
  const [animation, setAnimation] = useState(true);

  const total = useMemo(() => {
    return data.reduce((s, d) => s + d.value, 0);
  }, [data]);

  const handleDataChange = useCallback((index, field, newValue) => {
    setData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: Number(newValue) || 0 };
      return updated;
    });
  }, []);

  const handleChildChange = useCallback(
    (parentIndex, childIndex, field, newValue) => {
      setData((prev) => {
        const updated = [...prev];
        updated[parentIndex].children[childIndex] = {
          ...updated[parentIndex].children[childIndex],
          [field]: Number(newValue) || 0,
        };
        return updated;
      });
    },
    [],
  );

  const handleNameChange = useCallback((index, newName) => {
    setData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], name: newName };
      return updated;
    });
  }, []);

  const handleChildNameChange = useCallback(
    (parentIndex, childIndex, newName) => {
      setData((prev) => {
        const updated = [...prev];
        updated[parentIndex].children[childIndex] = {
          ...updated[parentIndex].children[childIndex],
          name: newName,
        };
        return updated;
      });
    },
    [],
  );

  const addCategory = useCallback(() => {
    setData((prev) => [
      ...prev,
      {
        name: `Category ${prev.length + 1}`,
        value: Math.floor(Math.random() * 150) + 50,
        children: [
          { name: "Sub-item 1", value: Math.floor(Math.random() * 50) + 20 },
        ],
      },
    ]);
  }, []);

  const addChild = useCallback((parentIndex) => {
    setData((prev) => {
      const updated = [...prev];
      updated[parentIndex].children.push({
        name: `Sub-${updated[parentIndex].children.length + 1}`,
        value: Math.floor(Math.random() * 50) + 10,
      });
      return updated;
    });
  }, []);

  const removeCategory = useCallback((index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const removeChild = useCallback((parentIndex, childIndex) => {
    setData((prev) => {
      const updated = [...prev];
      updated[parentIndex].children = updated[parentIndex].children.filter(
        (_, i) => i !== childIndex,
      );
      return updated;
    });
  }, []);

  // Calculate treemap layout - simplified version
  const treemapData = useMemo(() => {
    const result = [];
    let x = 0;
    const totalWidth = 100;
    data.forEach((category, ci) => {
      const width = (category.value / total) * totalWidth;
      let y = 0;
      const categoryItems = [];
      category.children.forEach((child, chi) => {
        const height = (child.value / category.value) * 100;
        categoryItems.push({
          ...child,
          x,
          y,
          width,
          height,
          color: colorPalette[(ci + chi) % colorPalette.length],
        });
        y += height;
      });
      result.push({ ...category, items: categoryItems, x, width });
      x += width;
    });
    return result;
  }, [data, total, colorPalette]);

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
    padding: "16px",
    border: "1px solid #30363d",
    minHeight: "480px",
    position: "relative",
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
            {data.length} CATEGORIES
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        <svg
          width="100%"
          height="450"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {treemapData.map((category, ci) =>
            category.items.map((item, ii) => (
              <g key={`${ci}-${ii}`}>
                <rect
                  x={item.x}
                  y={item.y}
                  width={item.width}
                  height={item.height}
                  fill={item.color}
                  opacity="0.85"
                  stroke="#fff"
                  strokeWidth="0.3"
                  style={{
                    transition: animation ? "all 0.3s ease" : "none",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = "1";
                    e.target.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = "0.85";
                    e.target.style.transform = "scale(1)";
                  }}
                />
                {showLabels && item.width > 5 && item.height > 5 && (
                  <text
                    x={item.x + item.width / 2}
                    y={item.y + item.height / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#fff"
                    fontSize={Math.min(item.width / 4, 3.5)}
                    fontWeight="600"
                    style={{
                      pointerEvents: "none",
                      textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                    }}
                  >
                    {item.name}
                    {showValues && ` (${item.value})`}
                  </text>
                )}
              </g>
            )),
          )}
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
          <button onClick={addCategory} style={buttonStyle()}>
            + Add Category
          </button>
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
                  Category
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
                  Sub-items
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
              {data.map((cat, ci) => (
                <tr key={ci}>
                  <td
                    style={{
                      padding: "4px 8px",
                      borderBottom: "1px solid #21262d",
                      fontSize: "10px",
                    }}
                  >
                    <input
                      type="text"
                      value={cat.name}
                      onChange={(e) => handleNameChange(ci, e.target.value)}
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
                      value={cat.value}
                      onChange={(e) =>
                        handleDataChange(ci, "value", e.target.value)
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
                    <button
                      onClick={() => addChild(ci)}
                      style={buttonStyle(
                        colorPalette[ci % colorPalette.length],
                      )}
                    >
                      +
                    </button>
                    {cat.children.map((child, chi) => (
                      <div
                        key={chi}
                        style={{
                          display: "flex",
                          gap: "4px",
                          alignItems: "center",
                          marginTop: "2px",
                        }}
                      >
                        <input
                          type="text"
                          value={child.name}
                          onChange={(e) =>
                            handleChildNameChange(ci, chi, e.target.value)
                          }
                          style={cellInputStyle("50px")}
                        />
                        <input
                          type="number"
                          value={child.value}
                          onChange={(e) =>
                            handleChildChange(ci, chi, "value", e.target.value)
                          }
                          style={cellInputStyle("40px")}
                        />
                        <button
                          onClick={() => removeChild(ci, chi)}
                          style={{
                            padding: "1px 4px",
                            background: "transparent",
                            border: "1px solid #f85149",
                            borderRadius: "2px",
                            color: "#f85149",
                            cursor: "pointer",
                            fontSize: "7px",
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </td>
                  <td
                    style={{
                      padding: "4px 8px",
                      borderBottom: "1px solid #21262d",
                      fontSize: "10px",
                    }}
                  >
                    <button
                      onClick={() => removeCategory(ci)}
                      style={{
                        padding: "2px 6px",
                        background: "transparent",
                        border: "1px solid #f85149",
                        borderRadius: "2px",
                        color: "#f85149",
                        cursor: "pointer",
                        fontSize: "9px",
                      }}
                      disabled={data.length <= 1}
                    >
                      Remove
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

export default TreemapComponent;
