import React, { useState, useCallback, useMemo } from "react";
import { theme } from "../../../styles/theme";

const DEFAULT_DATA = [
  { label: "Mobile", value: 45, icon: "📱", color: "#f85149" },
  { label: "Desktop", value: 30, icon: "💻", color: "#58a6ff" },
  { label: "Tablet", value: 15, icon: "📋", color: "#3fb950" },
  { label: "Other", value: 10, icon: "📺", color: "#d29922" },
];

const IconArrayComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#f85149",
}) => {
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Icon Array");
  const [iconSize, setIconSize] = useState(28);
  const [iconsPerRow, setIconsPerRow] = useState(10);
  const [iconColor, setIconColor] = useState(chartColor);
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

  const addItem = useCallback(() => {
    setData((prev) => [
      ...prev,
      {
        label: `Item ${prev.length + 1}`,
        value: Math.floor(Math.random() * 30) + 5,
        icon: "🔷",
        color: theme.colors.charts[prev.length % theme.colors.charts.length],
      },
    ]);
  }, []);

  const removeItem = useCallback((index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const resetData = useCallback(() => {
    setData(DEFAULT_DATA);
  }, []);

  // Calculate icons per category
  const renderIcons = (item) => {
    const count = Math.round((item.value / total) * 100);
    const icons = [];
    const maxIcons = iconsPerRow * 5; // Limit display

    for (let i = 0; i < Math.min(count, maxIcons); i++) {
      icons.push(
        <span
          key={i}
          style={{
            fontSize: `${iconSize * 0.7}px`,
            lineHeight: 1,
            transition: animation ? "transform 0.2s ease" : "none",
            cursor: "pointer",
            display: "inline-block",
            opacity: 0.9,
          }}
          onMouseEnter={(e) => {
            if (animation) e.currentTarget.style.transform = "scale(1.3)";
          }}
          onMouseLeave={(e) => {
            if (animation) e.currentTarget.style.transform = "scale(1)";
          }}
          title={`${item.label}: ${item.value}%`}
        >
          {item.icon}
        </span>,
      );
    }
    if (count > maxIcons) {
      icons.push(
        <span
          key="more"
          style={{
            fontSize: `${iconSize * 0.5}px`,
            lineHeight: 1,
            color: "#8b949e",
            fontWeight: 700,
          }}
        >
          +{count - maxIcons}
        </span>,
      );
    }
    return icons;
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
    borderBottom: `2px solid ${iconColor}`,
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
    minHeight: "380px",
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

  const buttonStyle = (c = iconColor) => ({
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

  const summaryStyle = {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    padding: "10px 14px",
    background: theme.colors.cardBg,
    borderRadius: "4px",
    border: "1px solid #30363d",
    fontSize: "10px",
  };

  const tableStyle = {
    background: theme.colors.cardBg,
    borderRadius: "4px",
    border: "1px solid #30363d",
    overflow: "auto",
    maxHeight: "200px",
  };

  const thStyle = {
    background: "#0d1117",
    color: "#8b949e",
    padding: "6px 8px",
    fontSize: "9px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1px",
    borderBottom: "2px solid #30363d",
    position: "sticky",
    top: 0,
  };

  const tdStyle = {
    padding: "4px 8px",
    borderBottom: "1px solid #21262d",
    fontSize: "10px",
  };

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
              color: iconColor,
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${iconColor}50`,
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
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {data.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "8px 4px",
                borderBottom:
                  i < data.length - 1 ? "1px solid #e2e8f0" : "none",
              }}
            >
              {showLabels && (
                <div
                  style={{
                    width: "80px",
                    textAlign: "right",
                    fontSize: "10px",
                    fontWeight: 700,
                    color: item.color || iconColor,
                    flexShrink: 0,
                  }}
                >
                  {item.label}
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "3px",
                  flex: 1,
                  alignItems: "center",
                }}
              >
                {renderIcons(item)}
              </div>
              {showValues && (
                <div
                  style={{
                    width: "50px",
                    fontSize: "10px",
                    color: item.color || iconColor,
                    fontWeight: 700,
                    textAlign: "right",
                    flexShrink: 0,
                  }}
                >
                  {item.value}%
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Icon Size: {iconSize}px</label>
          <input
            type="range"
            min="16"
            max="40"
            value={iconSize}
            onChange={(e) => setIconSize(Number(e.target.value))}
            style={{ width: "100%", accentColor: iconColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📐 Icons/Row: {iconsPerRow}</label>
          <input
            type="range"
            min="5"
            max="20"
            value={iconsPerRow}
            onChange={(e) => setIconsPerRow(Number(e.target.value))}
            style={{ width: "100%", accentColor: iconColor }}
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

      <div style={summaryStyle}>
        <span style={{ color: "#8b949e" }}>
          Total: <strong style={{ color: iconColor }}>{total}%</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Items: <strong style={{ color: "#f0f6fc" }}>{data.length}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Icons: <strong style={{ color: "#f0f6fc" }}>100</strong>
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
          <label style={labelStyle}>📋 Data</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={addItem} style={buttonStyle()}>
              + Add Item
            </button>
            <button onClick={resetData} style={buttonStyle("#8b949e")}>
              ↺ Reset
            </button>
          </div>
        </div>
        <div id="chart-data-table" style={tableStyle}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>#</th>
                <th style={thStyle}>Label</th>
                <th style={thStyle}>Icon</th>
                <th style={thStyle}>Value</th>
                <th style={thStyle}>%</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  <td style={{ ...tdStyle, color: "#484f58" }}>{i + 1}</td>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      value={row.label}
                      onChange={(e) =>
                        handleDataChange(i, "label", e.target.value)
                      }
                      style={cellInputStyle("70px")}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      value={row.icon}
                      onChange={(e) =>
                        handleDataChange(i, "icon", e.target.value)
                      }
                      style={{ ...cellInputStyle("35px"), textAlign: "center" }}
                      maxLength={2}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="number"
                      value={row.value}
                      onChange={(e) =>
                        handleDataChange(i, "value", e.target.value)
                      }
                      style={cellInputStyle("50px")}
                      min="0"
                      max="100"
                    />
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      color: row.color || iconColor,
                      fontWeight: 700,
                    }}
                  >
                    {((row.value / total) * 100).toFixed(1)}%
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => removeItem(i)}
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

export default IconArrayComponent;
