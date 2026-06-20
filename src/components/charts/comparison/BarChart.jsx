import React, { useState, useCallback, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
  Legend,
} from "recharts";
import { theme } from "../../../styles/theme";

// ============================================
// DEFAULT DATA
// ============================================
const DEFAULT_DATA = [
  { label: "Jan", value: 30 },
  { label: "Feb", value: 50 },
  { label: "Mar", value: 70 },
  { label: "Apr", value: 45 },
  { label: "May", value: 60 },
  { label: "Jun", value: 85 },
  { label: "Jul", value: 40 },
  { label: "Aug", value: 55 },
];

// ============================================
// GRADIENT PRESETS
// ============================================
const GRADIENT_PRESETS = [
  { name: "Solid", value: "solid" },
  { name: "Ocean", value: "ocean" },
  { name: "Sunset", value: "sunset" },
  { name: "Forest", value: "forest" },
  { name: "Purple", value: "purple" },
  { name: "Metal", value: "metal" },
];

// ============================================
// MAIN COMPONENT
// ============================================
const BarChartComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#58a6ff",
}) => {
  // ===== STATE =====
  const [data, setData] = useState(initialData);
  const [color, setColor] = useState(chartColor);
  const [orientation, setOrientation] = useState("vertical"); // 'vertical' | 'horizontal'
  const [barWidth, setBarWidth] = useState(30);
  const [showValues, setShowValues] = useState(true);
  const [borderRadius, setBorderRadius] = useState(4);
  const [gradientType, setGradientType] = useState("solid");
  const [hoverColor, setHoverColor] = useState("#ffffff");
  const [gridVisible, setGridVisible] = useState(true);
  const [titleText, setTitleText] = useState("Bar Chart");

  // ===== DERIVED DATA =====
  const isHorizontal = orientation === "horizontal";

  // Calculate max value for axis
  const maxValue = useMemo(() => {
    return Math.max(...data.map((d) => d.value), 10);
  }, [data]);

  // ===== HANDLERS =====
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

  const addDataRow = useCallback(() => {
    setData((prev) => [
      ...prev,
      { label: `Item ${prev.length + 1}`, value: 50 },
    ]);
  }, []);

  const removeDataRow = useCallback((index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // ===== GRADIENT DEFINITIONS =====
  const renderGradient = () => {
    if (gradientType === "solid") return null;

    const gradients = {
      ocean: [
        { offset: "0%", color: "#00d4ff", opacity: 1 },
        { offset: "100%", color: "#0099cc", opacity: 0.5 },
      ],
      sunset: [
        { offset: "0%", color: "#ff6b6b", opacity: 1 },
        { offset: "100%", color: "#ee5a24", opacity: 0.5 },
      ],
      forest: [
        { offset: "0%", color: "#2ecc71", opacity: 1 },
        { offset: "100%", color: "#27ae60", opacity: 0.5 },
      ],
      purple: [
        { offset: "0%", color: "#a78bfa", opacity: 1 },
        { offset: "100%", color: "#7c3aed", opacity: 0.5 },
      ],
      metal: [
        { offset: "0%", color: "#94a3b8", opacity: 1 },
        { offset: "100%", color: "#64748b", opacity: 0.5 },
      ],
    };

    const selected = gradients[gradientType] || gradients.ocean;

    return (
      <defs>
        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
          {selected.map((stop, i) => (
            <stop
              key={i}
              offset={stop.offset}
              stopColor={stop.color}
              stopOpacity={stop.opacity}
            />
          ))}
        </linearGradient>
      </defs>
    );
  };

  // ===== TOOLTIP =====
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={tooltipContainerStyle}>
          <p style={tooltipLabelStyle}>{label}</p>
          <p style={tooltipValueStyle}>
            Value:{" "}
            <span style={{ color: color, fontWeight: 700 }}>
              {payload[0].value}
            </span>
          </p>
          <p style={tooltipPercentStyle}>
            {((payload[0].value / maxValue) * 100).toFixed(1)}% of max
          </p>
        </div>
      );
    }
    return null;
  };

  // ===== CUSTOM LABEL =====
  const renderCustomLabel = (props) => {
    const { x, y, width, height, value } = props;
    if (!showValues) return null;

    return (
      <text
        x={isHorizontal ? x + width + 8 : x + width / 2}
        y={isHorizontal ? y + height / 2 : y - 8}
        fill={theme.colors.text.body}
        textAnchor={isHorizontal ? "start" : "middle"}
        fontSize={11}
        fontFamily={theme.typography.fontFamily.primary}
        fontWeight={600}
      >
        {value}
      </text>
    );
  };

  // ===== RENDER BARS =====
  const renderBars = () => {
    if (gradientType !== "solid") {
      return (
        <Bar
          dataKey="value"
          fill="url(#barGradient)"
          barSize={barWidth}
          radius={[borderRadius, borderRadius, 0, 0]}
          isAnimationActive={true}
          animationDuration={800}
          onMouseEnter={(data, index) => {
            // Hover effect handled by CSS
          }}
        >
          {showValues && <LabelList content={renderCustomLabel} />}
        </Bar>
      );
    }

    // Solid color - can use individual colors per bar
    return (
      <Bar
        dataKey="value"
        barSize={barWidth}
        radius={[borderRadius, borderRadius, 0, 0]}
        isAnimationActive={true}
        animationDuration={800}
        animationBegin={300}
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={color}
            style={{
              filter: "brightness(1)",
              transition: "filter 0.2s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.target.style.fill = hoverColor;
            }}
            onMouseLeave={(e) => {
              e.target.style.fill = color;
            }}
          />
        ))}
        {showValues && <LabelList content={renderCustomLabel} />}
      </Bar>
    );
  };

  // ============================================
  // STYLES
  // ============================================
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
    borderBottom: `2px solid ${color}`,
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
    padding: "24px 16px 16px",
    border: `1px solid ${theme.colors.border.light}`,
    minHeight: "450px",
  };

  const controlsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "16px",
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
    padding: "8px 12px",
    background: theme.colors.inputBg,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: "3px",
    color: theme.colors.text.body,
    fontSize: "12px",
    fontFamily: theme.typography.fontFamily.primary,
    outline: "none",
    cursor: "pointer",
  };

  const inputStyle = {
    padding: "8px 12px",
    background: theme.colors.inputBg,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: "3px",
    color: theme.colors.text.body,
    fontSize: "12px",
    fontFamily: theme.typography.fontFamily.primary,
    outline: "none",
    width: "80px",
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
    maxHeight: "300px",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "12px",
  };

  const thStyle = {
    background: theme.colors.inputBg,
    color: theme.colors.text.muted,
    padding: "10px 12px",
    textAlign: "left",
    fontSize: "10px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "2px",
    borderBottom: `2px solid ${theme.colors.border.default}`,
    position: "sticky",
    top: 0,
  };

  const tdStyle = {
    padding: "6px 12px",
    borderBottom: `1px solid ${theme.colors.border.light}`,
  };

  const cellInputStyle = {
    padding: "6px 8px",
    background: theme.colors.inputBg,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: "3px",
    color: theme.colors.text.body,
    fontSize: "12px",
    fontFamily: theme.typography.fontFamily.primary,
    width: "100%",
    outline: "none",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    padding: "8px 16px",
    background: "transparent",
    border: `1px solid ${color}`,
    borderRadius: "3px",
    color: color,
    cursor: "pointer",
    fontSize: "11px",
    fontFamily: theme.typography.fontFamily.primary,
    fontWeight: 600,
    letterSpacing: "1px",
    textTransform: "uppercase",
    transition: "all 0.15s ease",
  };

  const deleteButtonStyle = {
    ...buttonStyle,
    border: `1px solid ${theme.colors.status.error}`,
    color: theme.colors.status.error,
    padding: "4px 8px",
    fontSize: "10px",
  };

  const tooltipContainerStyle = {
    background: theme.colors.cardBg,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: "4px",
    padding: "12px 16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
  };

  const tooltipLabelStyle = {
    color: theme.colors.text.heading,
    fontSize: "12px",
    fontWeight: 700,
    margin: "0 0 4px 0",
    textTransform: "uppercase",
    letterSpacing: "1px",
  };

  const tooltipValueStyle = {
    color: theme.colors.text.body,
    fontSize: "14px",
    margin: "0 0 2px 0",
  };

  const tooltipPercentStyle = {
    color: theme.colors.text.muted,
    fontSize: "10px",
    margin: 0,
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div style={containerStyle}>
      {/* HEADER */}
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>📊</span>
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
              color: color,
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${color}50`,
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
            {data.length} ITEMS
          </span>
        </div>
      </div>

      {/* CHART DISPLAY */}
      <div id="chart-visual-area" style={chartContainerStyle}>
        <ResponsiveContainer width="100%" height={420}>
          <BarChart
            data={data}
            layout={isHorizontal ? "vertical" : "horizontal"}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            {renderGradient()}

            {gridVisible && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme.colors.border.light}
                vertical={!isHorizontal}
                horizontal={isHorizontal}
              />
            )}

            {isHorizontal ? (
              <>
                <XAxis
                  type="number"
                  tick={{ fill: theme.colors.text.muted, fontSize: 11 }}
                  axisLine={{ stroke: theme.colors.border.default }}
                />
                <YAxis
                  dataKey="label"
                  type="category"
                  tick={{ fill: theme.colors.text.muted, fontSize: 11 }}
                  axisLine={{ stroke: theme.colors.border.default }}
                  width={60}
                />
              </>
            ) : (
              <>
                <XAxis
                  dataKey="label"
                  tick={{ fill: theme.colors.text.muted, fontSize: 11 }}
                  axisLine={{ stroke: theme.colors.border.default }}
                />
                <YAxis
                  tick={{ fill: theme.colors.text.muted, fontSize: 11 }}
                  axisLine={{ stroke: theme.colors.border.default }}
                  domain={[0, maxValue + Math.ceil(maxValue * 0.1)]}
                />
              </>
            )}

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(88, 166, 255, 0.1)" }}
            />
            <Legend
              wrapperStyle={{
                color: theme.colors.text.body,
                fontSize: "11px",
                fontFamily: theme.typography.fontFamily.primary,
              }}
            />

            {renderBars()}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* CONTROLS */}
      <div style={controlsGridStyle}>
        {/* Color Picker */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📌 Bar Color</label>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <input
              type="color"
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
                setGradientType("solid");
              }}
              style={{
                width: "36px",
                height: "36px",
                border: `1px solid ${theme.colors.border.default}`,
                borderRadius: "3px",
                cursor: "pointer",
                padding: "2px",
                background: theme.colors.inputBg,
              }}
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ ...inputStyle, width: "100px" }}
            />
          </div>
        </div>
        {/* Hover Color */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>✨ Hover Color</label>
          <input
            type="color"
            value={hoverColor}
            onChange={(e) => setHoverColor(e.target.value)}
            style={{
              width: "36px",
              height: "32px",
              cursor: "pointer",
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: "3px",
              padding: "2px",
            }}
          />
        </div>

        {/* Gradient Type */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Gradient</label>
          <select
            value={gradientType}
            onChange={(e) => setGradientType(e.target.value)}
            style={selectStyle}
          >
            {GRADIENT_PRESETS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* Orientation */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📐 Orientation</label>
          <select
            value={orientation}
            onChange={(e) => setOrientation(e.target.value)}
            style={selectStyle}
          >
            <option value="vertical">Vertical</option>
            <option value="horizontal">Horizontal</option>
          </select>
        </div>

        {/* Bar Width */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Bar Width: {barWidth}px</label>
          <input
            type="range"
            min="10"
            max="80"
            value={barWidth}
            onChange={(e) => setBarWidth(Number(e.target.value))}
            style={{ width: "100%", accentColor: color }}
          />
        </div>

        {/* Border Radius */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔲 Roundness: {borderRadius}px</label>
          <input
            type="range"
            min="0"
            max="20"
            value={borderRadius}
            onChange={(e) => setBorderRadius(Number(e.target.value))}
            style={{ width: "100%", accentColor: color }}
          />
        </div>

        {/* Show Values Toggle */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>💬 Value Labels</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showValues}
              onChange={(e) => setShowValues(e.target.checked)}
              style={{ accentColor: color }}
            />
            <span style={{ fontSize: "12px", color: theme.colors.text.body }}>
              Show values on bars
            </span>
          </label>
        </div>

        {/* Grid Toggle */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔲 Grid</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={gridVisible}
              onChange={(e) => setGridVisible(e.target.checked)}
              style={{ accentColor: color }}
            />
            <span style={{ fontSize: "12px", color: theme.colors.text.body }}>
              Show grid lines
            </span>
          </label>
        </div>
      </div>

      {/* DATA TABLE */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <label style={labelStyle}>📋 Data Table</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={addDataRow}
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.target.style.background = `${color}20`;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
              }}
            >
              + Add Row
            </button>
            <button
              onClick={() => setData(DEFAULT_DATA)}
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.target.style.background = `${color}20`;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
              }}
            >
              ↺ Reset
            </button>
          </div>
        </div>

        <div id="chart-data-table" style={dataTableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>#</th>
                <th style={thStyle}>Label</th>
                <th style={thStyle}>Value</th>
                <th style={thStyle}>% of Max</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td
                    style={{
                      ...tdStyle,
                      color: theme.colors.text.muted,
                      fontSize: "10px",
                    }}
                  >
                    {index + 1}
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      value={row.label}
                      onChange={(e) =>
                        handleDataChange(index, "label", e.target.value)
                      }
                      style={cellInputStyle}
                      placeholder="Label"
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="number"
                      value={row.value}
                      onChange={(e) =>
                        handleDataChange(index, "value", e.target.value)
                      }
                      style={cellInputStyle}
                      placeholder="Value"
                      min="0"
                    />
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      color: color,
                      fontSize: "11px",
                      fontWeight: 600,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          height: "6px",
                          background: theme.colors.border.light,
                          borderRadius: "3px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${(row.value / maxValue) * 100}%`,
                            height: "100%",
                            background: color,
                            borderRadius: "3px",
                          }}
                        />
                      </div>
                      <span>{((row.value / maxValue) * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => removeDataRow(index)}
                      style={deleteButtonStyle}
                      disabled={data.length <= 1}
                      onMouseEnter={(e) => {
                        if (data.length > 1) {
                          e.target.style.background = `${theme.colors.status.error}20`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "transparent";
                      }}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Data Summary */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "12px",
            padding: "10px 14px",
            background: theme.colors.cardBg,
            borderRadius: "4px",
            border: `1px solid ${theme.colors.border.default}`,
            fontSize: "11px",
            flexWrap: "wrap",
          }}
        >
          <span style={{ color: theme.colors.text.muted }}>
            Total:{" "}
            <strong style={{ color: theme.colors.text.heading }}>
              {data.reduce((sum, d) => sum + d.value, 0)}
            </strong>
          </span>
          <span style={{ color: theme.colors.text.muted }}>
            Average:{" "}
            <strong style={{ color: color }}>
              {(
                data.reduce((sum, d) => sum + d.value, 0) / data.length
              ).toFixed(1)}
            </strong>
          </span>
          <span style={{ color: theme.colors.text.muted }}>
            Max:{" "}
            <strong style={{ color: theme.colors.charts[2] }}>
              {maxValue}
            </strong>
          </span>
          <span style={{ color: theme.colors.text.muted }}>
            Min:{" "}
            <strong style={{ color: theme.colors.charts[3] }}>
              {Math.min(...data.map((d) => d.value))}
            </strong>
          </span>
          <span style={{ color: theme.colors.text.muted }}>
            Items:{" "}
            <strong style={{ color: theme.colors.text.heading }}>
              {data.length}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default BarChartComponent;

