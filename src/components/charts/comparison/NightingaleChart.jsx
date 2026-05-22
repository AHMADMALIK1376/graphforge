import React, { useState, useCallback, useMemo } from "react";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { theme } from "../../../styles/theme";

// ============================================
// DEFAULT DATA
// ============================================
const DEFAULT_DATA = [
  { month: "Jan", value: 120, color: "#58a6ff" },
  { month: "Feb", value: 90, color: "#3fb950" },
  { month: "Mar", value: 150, color: "#d29922" },
  { month: "Apr", value: 110, color: "#f85149" },
  { month: "May", value: 180, color: "#a371f7" },
  { month: "Jun", value: 140, color: "#79c0ff" },
  { month: "Jul", value: 200, color: "#56d364" },
  { month: "Aug", value: 170, color: "#ff7b72" },
  { month: "Sep", value: 130, color: "#bc8cff" },
  { month: "Oct", value: 160, color: "#e3b341" },
  { month: "Nov", value: 100, color: "#1f6feb" },
  { month: "Dec", value: 190, color: "#238636" },
];

// ============================================
// WEDGE STYLE PRESETS
// ============================================
const WEDGE_STYLES = [
  { name: "Solid", value: "solid" },
  { name: "Gradient", value: "gradient" },
  { name: "Rounded", value: "rounded" },
];

// ============================================
// COLOR MODES
// ============================================
const COLOR_MODES = [
  { name: "Per Wedge", value: "individual" },
  { name: "Uniform", value: "uniform" },
  { name: "Gradient Spread", value: "gradient" },
  { name: "Monochromatic", value: "mono" },
];

// ============================================
// MAIN COMPONENT
// ============================================
const NightingaleChartComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#58a6ff",
}) => {
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Nightingale / Polar Area Chart");
  const [innerRadius, setInnerRadius] = useState(20);
  const [outerRadius, setOuterRadius] = useState(90);
  const [wedgeGap, setWedgeGap] = useState(2);
  const [colorMode, setColorMode] = useState("individual");
  const [uniformColor, setUniformColor] = useState("#58a6ff");
  const [wedgeStyle, setWedgeStyle] = useState("solid");
  const [cornerRadius, setCornerRadius] = useState(2);
  const [showLabels, setShowLabels] = useState(true);
  const [labelPosition, setLabelPosition] = useState("outside");
  const [showValues, setShowValues] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [legendPosition, setLegendPosition] = useState("right");
  const [startAngle, setStartAngle] = useState(90);
  const [animation, setAnimation] = useState(true);
  const [sortData, setSortData] = useState("none");

  const sortedData = useMemo(() => {
    const sorted = [...data];
    switch (sortData) {
      case "asc":
        sorted.sort((a, b) => a.value - b.value);
        break;
      case "desc":
        sorted.sort((a, b) => b.value - a.value);
        break;
      case "alpha":
        sorted.sort((a, b) => a.month.localeCompare(b.month));
        break;
      default:
        break;
    }
    return sorted;
  }, [data, sortData]);

  const maxValue = useMemo(
    () => Math.max(...data.map((d) => d.value), 1),
    [data],
  );
  const totalValue = useMemo(
    () => data.reduce((s, d) => s + d.value, 0),
    [data],
  );

  const getWedgeColor = (item, index) => {
    switch (colorMode) {
      case "uniform":
        return uniformColor;
      case "gradient": {
        const alpha = 1 - index * 0.06;
        return (
          uniformColor +
          Math.floor(Math.max(30, alpha * 255))
            .toString(16)
            .padStart(2, "0")
        );
      }
      case "mono": {
        const intensity = 0.3 + (item.value / maxValue) * 0.7;
        return (
          uniformColor +
          Math.floor(intensity * 255)
            .toString(16)
            .padStart(2, "0")
        );
      }
      default:
        return (
          item.color || theme.colors.charts[index % theme.colors.charts.length]
        );
    }
  };

  const handleDataChange = useCallback((index, field, newValue) => {
    setData((prev) => {
      const updated = [...prev];
      if (field === "value")
        updated[index] = { ...updated[index], value: Number(newValue) || 0 };
      else updated[index] = { ...updated[index], [field]: newValue };
      return updated;
    });
  }, []);
  const addWedge = useCallback(() => {
    const newMonth = `Item ${data.length + 1}`;
    setData((prev) => [
      ...prev,
      {
        month: newMonth,
        value: Math.floor(Math.random() * 180) + 20,
        color: theme.colors.charts[prev.length % theme.colors.charts.length],
      },
    ]);
  }, [data]);
  const removeWedge = useCallback((index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percent = ((item.value / totalValue) * 100).toFixed(1);
      const angle = (item.value / maxValue) * 360;
      return (
        <div style={tooltipContainerStyle}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "6px",
            }}
          >
            <span
              style={{
                ...tooltipColorDot,
                background: item.color || getWedgeColor(item, 0),
              }}
            />
            <span style={tooltipLabelStyle}>{item.month}</span>
          </div>
          <div style={tooltipValueRow}>
            <span style={tooltipValueLabel}>Value:</span>
            <span style={tooltipValue}>{item.value.toLocaleString()}</span>
          </div>
          <div style={tooltipValueRow}>
            <span style={tooltipValueLabel}>Share:</span>
            <span style={tooltipStat}>{percent}%</span>
          </div>
          <div style={tooltipValueRow}>
            <span style={tooltipValueLabel}>Angle:</span>
            <span style={tooltipStat}>{angle.toFixed(1)}°</span>
          </div>
          <div style={tooltipValueRow}>
            <span style={tooltipValueLabel}>Radius:</span>
            <span style={tooltipStat}>
              {((item.value / maxValue) * 100).toFixed(0)}%
            </span>
          </div>
          <div style={tooltipBarContainer}>
            <div
              style={{
                ...tooltipBarFill,
                width: `${(item.value / maxValue) * 100}%`,
                background: item.color,
              }}
            />
          </div>
        </div>
      );
    }
    return null;
  };

  const customLabel = (props) => {
    if (!props?.payload) return null;
    const { cx, cy, midAngle, innerRadius, outerRadius, payload } = props;
    if (!showLabels) return null;
    const radius =
      labelPosition === "outside"
        ? outerRadius + 20
        : (innerRadius + outerRadius) / 2;
    const angle = midAngle * (Math.PI / 180);
    const x = cx + radius * Math.cos(-angle + Math.PI / 2);
    const y = cy + radius * Math.sin(-angle + Math.PI / 2);
    const textAnchor = x > cx ? "start" : x < cx ? "end" : "middle";
    return (
      <text
        x={x}
        y={y}
        fill={labelPosition === "inside" ? "#ffffff" : theme.colors.mainBg}
        textAnchor={textAnchor}
        dominantBaseline="central"
        fontSize="9"
        fontWeight="600"
        fontFamily={theme.typography.fontFamily.primary}
      >
        {showValues
          ? `${payload?.month || ""} (${payload.value})`
          : payload?.month || ""}
      </text>
    );
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
    width: "320px",
  };
  const chartContainerStyle = {
    background: "#ffffff",
    borderRadius: "6px",
    padding: "24px",
    border: `1px solid ${theme.colors.border.light}`,
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
  const dataTableContainerStyle = {
    background: theme.colors.cardBg,
    borderRadius: "4px",
    border: `1px solid ${theme.colors.border.default}`,
    overflow: "auto",
    maxHeight: "380px",
  };
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "10px",
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
    position: "sticky",
    top: 0,
    whiteSpace: "nowrap",
  };
  const tdStyle = {
    padding: "4px 6px",
    borderBottom: "1px solid #21262d",
    fontSize: "10px",
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
  const tooltipContainerStyle = {
    background: theme.colors.cardBg,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: "4px",
    padding: "12px 14px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
    minWidth: "160px",
  };
  const tooltipColorDot = {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    display: "inline-block",
  };
  const tooltipLabelStyle = {
    color: theme.colors.text.heading,
    fontSize: "12px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1px",
  };
  const tooltipValueRow = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "3px",
  };
  const tooltipValueLabel = {
    color: theme.colors.text.muted,
    fontSize: "10px",
  };
  const tooltipValue = {
    fontSize: "15px",
    fontWeight: 700,
    color: theme.colors.text.heading,
  };
  const tooltipStat = {
    color: theme.colors.text.heading,
    fontSize: "11px",
    fontWeight: 600,
  };
  const tooltipBarContainer = {
    marginTop: "6px",
    height: "4px",
    background: theme.colors.border.light,
    borderRadius: "2px",
    overflow: "hidden",
  };
  const tooltipBarFill = {
    height: "100%",
    borderRadius: "2px",
    transition: "width 0.3s ease",
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>🌸</span>
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
            {data.length} WEDGES
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        <ResponsiveContainer width="100%" height={500}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius={`${innerRadius}%`}
            outerRadius={`${outerRadius}%`}
            barSize={100 / data.length - wedgeGap}
            data={sortedData}
            startAngle={startAngle}
            endAngle={startAngle + 360}
          >
            <PolarAngleAxis type="category" dataKey="month" tick={false} />
            <PolarRadiusAxis
              type="number"
              domain={[0, maxValue]}
              tick={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && (
              <Legend
                iconType="square"
                iconSize={8}
                layout="vertical"
                verticalAlign="middle"
                align={legendPosition}
                wrapperStyle={{
                  fontSize: "9px",
                  fontFamily: theme.typography.fontFamily.primary,
                  color: theme.colors.mainBg,
                }}
              />
            )}
            <RadialBar
              dataKey="value"
              cornerRadius={wedgeStyle === "rounded" ? cornerRadius : 0}
              label={customLabel}
              isAnimationActive={animation}
              animationDuration={800}
              animationBegin={0}
            >
              {sortedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getWedgeColor(entry, index)}
                  style={{
                    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))",
                    cursor: "pointer",
                    transition: "opacity 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = "0.85";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = "1";
                  }}
                />
              ))}
            </RadialBar>
          </RadialBarChart>
        </ResponsiveContainer>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              color: theme.colors.mainBg,
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            {totalValue}
          </div>
          <div
            style={{
              color: theme.colors.text.muted,
              fontSize: "9px",
              fontWeight: 600,
              letterSpacing: "1px",
            }}
          >
            TOTAL
          </div>
        </div>
      </div>

      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Color Mode</label>
          <select
            value={colorMode}
            onChange={(e) => setColorMode(e.target.value)}
            style={selectStyle}
          >
            {COLOR_MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        {colorMode !== "individual" && (
          <div style={controlGroupStyle}>
            <label style={labelStyle}>🎨 Base Color</label>
            <input
              type="color"
              value={uniformColor}
              onChange={(e) => setUniformColor(e.target.value)}
              style={{
                width: "36px",
                height: "28px",
                cursor: "pointer",
                border: "1px solid #30363d",
                borderRadius: "3px",
                padding: "2px",
              }}
            />
          </div>
        )}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔷 Wedge Style</label>
          <select
            value={wedgeStyle}
            onChange={(e) => setWedgeStyle(e.target.value)}
            style={selectStyle}
          >
            {WEDGE_STYLES.map((w) => (
              <option key={w.value} value={w.value}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
        {wedgeStyle === "rounded" && (
          <div style={controlGroupStyle}>
            <label style={labelStyle}>🔲 Corner Radius: {cornerRadius}px</label>
            <input
              type="range"
              min="0"
              max="15"
              value={cornerRadius}
              onChange={(e) => setCornerRadius(Number(e.target.value))}
              style={{ width: "100%", accentColor: chartColor }}
            />
          </div>
        )}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Inner Radius: {innerRadius}%</label>
          <input
            type="range"
            min="0"
            max="60"
            value={innerRadius}
            onChange={(e) => setInnerRadius(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Outer Radius: {outerRadius}%</label>
          <input
            type="range"
            min="50"
            max="100"
            value={outerRadius}
            onChange={(e) => setOuterRadius(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>↔️ Wedge Gap: {wedgeGap}px</label>
          <input
            type="range"
            min="0"
            max="8"
            value={wedgeGap}
            onChange={(e) => setWedgeGap(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔄 Start Angle: {startAngle}°</label>
          <input
            type="range"
            min="0"
            max="360"
            value={startAngle}
            onChange={(e) => setStartAngle(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📊 Sort Data</label>
          <select
            value={sortData}
            onChange={(e) => setSortData(e.target.value)}
            style={selectStyle}
          >
            <option value="none">Default</option>
            <option value="asc">Value ↑</option>
            <option value="desc">Value ↓</option>
            <option value="alpha">Alphabetical</option>
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📍 Label Position</label>
          <select
            value={labelPosition}
            onChange={(e) => setLabelPosition(e.target.value)}
            style={selectStyle}
          >
            <option value="outside">Outside</option>
            <option value="inside">Inside</option>
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📋 Legend Position</label>
          <select
            value={legendPosition}
            onChange={(e) => setLegendPosition(e.target.value)}
            style={selectStyle}
          >
            <option value="right">Right</option>
            <option value="bottom">Bottom</option>
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>💬 Show Labels</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showLabels}
              onChange={(e) => setShowLabels(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Wedge labels
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
              In labels
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📋 Show Legend</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showLegend}
              onChange={(e) => setShowLegend(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Display legend
            </span>
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
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Animate wedges
            </span>
          </label>
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
          <label style={labelStyle}>📋 Data Table ({data.length} items)</label>
          <button onClick={addWedge} style={buttonStyle()}>
            + Add Wedge
          </button>
        </div>
        <div id="chart-data-table" style={dataTableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>#</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Value</th>
                <th style={thStyle}>% Share</th>
                <th style={thStyle}>Angle</th>
                <th style={thStyle}>Color</th>
                <th style={thStyle}>Visual</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item, index) => {
                const percent = ((item.value / totalValue) * 100).toFixed(1);
                const angle = ((item.value / maxValue) * 360).toFixed(1);
                const wedgeColor = getWedgeColor(item, index);
                return (
                  <tr key={index}>
                    <td style={{ ...tdStyle, color: "#484f58" }}>
                      {index + 1}
                    </td>
                    <td style={tdStyle}>
                      <input
                        type="text"
                        value={item.month}
                        onChange={(e) =>
                          handleDataChange(index, "month", e.target.value)
                        }
                        style={cellInputStyle("70px")}
                      />
                    </td>
                    <td style={tdStyle}>
                      <input
                        type="number"
                        value={item.value}
                        onChange={(e) =>
                          handleDataChange(index, "value", e.target.value)
                        }
                        style={cellInputStyle("60px")}
                        min="0"
                      />
                    </td>
                    <td
                      style={{ ...tdStyle, color: wedgeColor, fontWeight: 700 }}
                    >
                      {percent}%
                    </td>
                    <td style={{ ...tdStyle, color: "#8b949e" }}>{angle}°</td>
                    <td style={tdStyle}>
                      <input
                        type="color"
                        value={item.color || wedgeColor}
                        onChange={(e) =>
                          handleDataChange(index, "color", e.target.value)
                        }
                        style={{
                          width: "24px",
                          height: "22px",
                          cursor: "pointer",
                          border: "none",
                          borderRadius: "2px",
                        }}
                      />
                    </td>
                    <td style={tdStyle}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.max(5, (item.value / maxValue) * 60)}px`,
                            height: "10px",
                            background: wedgeColor,
                            borderRadius: "2px",
                          }}
                        />
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => removeWedge(index)}
                        style={deleteBtnStyle}
                        disabled={data.length <= 3}
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
          Total:{" "}
          <strong style={{ color: "#f0f6fc" }}>
            {totalValue.toLocaleString()}
          </strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Average:{" "}
          <strong style={{ color: chartColor }}>
            {(totalValue / data.length).toFixed(1)}
          </strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Max: <strong style={{ color: "#f85149" }}>{maxValue}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Min:{" "}
          <strong style={{ color: "#3fb950" }}>
            {Math.min(...data.map((d) => d.value))}
          </strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Wedges: <strong style={{ color: "#f0f6fc" }}>{data.length}</strong>
        </span>
      </div>
    </div>
  );
};

export default NightingaleChartComponent;

