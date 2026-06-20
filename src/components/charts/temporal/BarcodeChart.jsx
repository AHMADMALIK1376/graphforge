import React, { useState, useCallback, useMemo } from "react";
import { theme } from "../../../styles/theme";

const DEFAULT_DATA = [
  { name: "Jan", value: 30 },
  { name: "Feb", value: 45 },
  { name: "Mar", value: 55 },
  { name: "Apr", value: 40 },
  { name: "May", value: 65 },
  { name: "Jun", value: 80 },
  { name: "Jul", value: 70 },
  { name: "Aug", value: 60 },
  { name: "Sep", value: 85 },
  { name: "Oct", value: 75 },
  { name: "Nov", value: 90 },
  { name: "Dec", value: 100 },
];

const BarcodeChartComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#a371f7",
}) => {
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Barcode Chart");
  const [barColor, setBarColor] = useState(chartColor);
  const [barHeight, setBarHeight] = useState(40);
  const [barSpacing, setBarSpacing] = useState(2);
  const [showLabels, setShowLabels] = useState(true);
  const [showValues, setShowValues] = useState(true);
  const [animation, setAnimation] = useState(true);

  const maxVal = useMemo(() => Math.max(...data.map((d) => d.value)), [data]);

  const handleDataChange = useCallback((index, field, newValue) => {
    setData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: Number(newValue) || 0 };
      return updated;
    });
  }, []);

  const handleLabelChange = useCallback((index, newLabel) => {
    setData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], name: newLabel };
      return updated;
    });
  }, []);

  const addPoint = useCallback(() => {
    setData((prev) => [
      ...prev,
      {
        name: `Period ${prev.length + 1}`,
        value: Math.floor(Math.random() * 50) + 30,
      },
    ]);
  }, []);

  const removePoint = useCallback((index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const renderBarcode = () => {
    const totalWidth = data.length * (barHeight + barSpacing) + 40;

    return (
      <svg
        width="100%"
        height={Math.max(totalWidth, 200)}
        viewBox={`0 0 ${Math.max(totalWidth, 200)} ${Math.max(totalWidth, 200)}`}
      >
        {data.map((d, i) => {
          const x = 20 + i * (barHeight + barSpacing);
          const height = (d.value / maxVal) * 150 + 20;

          return (
            <g key={i}>
              <rect
                x={x}
                y={180 - height}
                width={barHeight}
                height={height}
                fill={barColor}
                opacity="0.85"
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
              />
              {showLabels && (
                <text
                  x={x + barHeight / 2}
                  y={195}
                  textAnchor="middle"
                  fill="#8b949e"
                  fontSize="8"
                  transform={`rotate(-45, ${x + barHeight / 2}, 195)`}
                >
                  {d.name}
                </text>
              )}
              {showValues && (
                <text
                  x={x + barHeight / 2}
                  y={175 - height}
                  textAnchor="middle"
                  fill={barColor}
                  fontSize="8"
                  fontWeight="600"
                >
                  {d.value}
                </text>
              )}
            </g>
          );
        })}
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
    borderBottom: `2px solid ${barColor}`,
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
  const buttonStyle = (c = barColor) => ({
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
              color: barColor,
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${barColor}50`,
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
            {data.length} PERIODS
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        {renderBarcode()}
      </div>

      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Bar Color</label>
          <input
            type="color"
            value={barColor}
            onChange={(e) => setBarColor(e.target.value)}
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
          <label style={labelStyle}>📏 Bar Width: {barHeight}px</label>
          <input
            type="range"
            min="10"
            max="50"
            value={barHeight}
            onChange={(e) => setBarHeight(Number(e.target.value))}
            style={{ width: "100%", accentColor: barColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>↔️ Spacing: {barSpacing}px</label>
          <input
            type="range"
            min="0"
            max="8"
            value={barSpacing}
            onChange={(e) => setBarSpacing(Number(e.target.value))}
            style={{ width: "100%", accentColor: barColor }}
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

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <label style={labelStyle}>📋 Data</label>
          <button onClick={addPoint} style={buttonStyle()}>
            + Add Period
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
                  Period
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
                      onChange={(e) => handleLabelChange(i, e.target.value)}
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
                    }}
                  >
                    <button
                      onClick={() => removePoint(i)}
                      style={{
                        padding: "2px 6px",
                        background: "transparent",
                        border: "1px solid #f85149",
                        borderRadius: "2px",
                        color: "#f85149",
                        cursor: "pointer",
                        fontSize: "9px",
                      }}
                      disabled={data.length <= 3}
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

export default BarcodeChartComponent;
