import React, { useState, useCallback, useMemo } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Scatter,
  Legend,
} from "recharts";
import { theme } from "../../../styles/theme";

const DEFAULT_DATA = [
  { label: "Product A", value: 65 },
  { label: "Product B", value: 42 },
  { label: "Product C", value: 88 },
  { label: "Product D", value: 55 },
  { label: "Product E", value: 73 },
  { label: "Product F", value: 38 },
  { label: "Product G", value: 91 },
  { label: "Product H", value: 50 },
];

const STICK_STYLES = [
  { name: "Solid", value: "solid" },
  { name: "Dashed", value: "dashed" },
  { name: "Dotted", value: "dotted" },
  { name: "Dash-Dot", value: "dashdot" },
];

const LollipopChartComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#58a6ff",
}) => {
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Lollipop Chart");
  const [stickColor, setStickColor] = useState("#58a6ff");
  const [dotColor, setDotColor] = useState("#58a6ff");
  const [matchColors, setMatchColors] = useState(true);
  const [stickWidth, setStickWidth] = useState(3);
  const [dotSize, setDotSize] = useState(8);
  const [orientation, setOrientation] = useState("vertical");
  const [stickStyle, setStickStyle] = useState("solid");
  const [showValues, setShowValues] = useState(true);
  const [valuePosition, setValuePosition] = useState("dot");
  const [gridVisible, setGridVisible] = useState(true);
  const [dotStyle, setDotStyle] = useState("filled");
  const [animation, setAnimation] = useState(true);

  const effectiveDotColor = matchColors ? stickColor : dotColor;
  const isHorizontal = orientation === "horizontal";
  const maxValue = useMemo(
    () => Math.max(...data.map((d) => d.value), 10),
    [data],
  );
  const minValue = useMemo(() => {
    const min = Math.min(...data.map((d) => d.value), 0);
    return min < 0 ? min : 0;
  }, [data]);

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
      {
        label: `Item ${prev.length + 1}`,
        value: Math.floor(Math.random() * 80) + 20,
      },
    ]);
  }, []);
  const removeDataRow = useCallback((index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  }, []);
  const resetData = useCallback(() => {
    setData(DEFAULT_DATA);
  }, []);

  const CustomDot = (props) => {
    const { cx, cy, value, index } = props;
    // Use index for z-index layering
    const zLayer = 10 + (index || 0);
    const color = effectiveDotColor;
    const size = dotSize;
    return (
      <g style={{ zIndex: zLayer }}>
        <circle cx={cx} cy={cy} r={size + 4} fill={color} opacity={0.15} />
        <circle
          cx={cx}
          cy={cy}
          r={size}
          fill={dotStyle === "filled" ? color : "#ffffff"}
          stroke={color}
          strokeWidth={2.5}
          style={{
            filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.2))",
            transition: "all 0.2s ease",
            cursor: "pointer",
          }}
        />
        {dotStyle === "filled" && (
          <circle
            cx={cx - size * 0.25}
            cy={cy - size * 0.25}
            r={size * 0.3}
            fill="rgba(255,255,255,0.4)"
          />
        )}
        {showValues && valuePosition === "dot" && (
          <text
            x={isHorizontal ? cx + size + 8 : cx}
            y={isHorizontal ? cy + 4 : cy - size - 8}
            textAnchor={isHorizontal ? "start" : "middle"}
            fill={theme.colors.text.body}
            fontSize={11}
            fontWeight={700}
            fontFamily={theme.typography.fontFamily.primary}
          >
            {value}
          </text>
        )}
      </g>
    );
  };

  const renderStick = (props) => {
    const { x, y, width, height, index } = props;
    const dashOffset = index * 2;
    const color = stickColor;
    const strokeWidth = stickWidth;
    if (isHorizontal) {
      return (
        <line
          x1={0}
          y1={y + height / 2}
          x2={width}
          y2={y + height / 2}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={
            stickStyle === "dashed"
              ? "8 4"
              : stickStyle === "dotted"
                ? "3 4"
                : stickStyle === "dashdot"
                  ? "8 4 3 4"
                  : "none"
          }
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          opacity={0.7}
        />
      );
    }
    return (
      <line
        x1={x + width / 2}
        y1={height}
        x2={x + width / 2}
        y2={0}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={
          stickStyle === "dashed"
            ? "8 4"
            : stickStyle === "dotted"
              ? "3 4"
              : stickStyle === "dashdot"
                ? "8 4 3 4"
                : "none"
        }
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        opacity={0.7}
      />
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0]?.value || 0;
      const percentOfMax = ((value / maxValue) * 100).toFixed(1);
      const rank =
        [...data]
          .sort((a, b) => b.value - a.value)
          .findIndex((d) => d.label === label) + 1;
      return (
        <div style={tooltipContainerStyle}>
          <p style={tooltipLabelStyle}>{label}</p>
          <div style={tooltipValueRow}>
            <span
              style={{
                color: effectiveDotColor,
                fontSize: "20px",
                fontWeight: 700,
              }}
            >
              {value}
            </span>
          </div>
          <div style={tooltipDetailRow}>
            <span style={tooltipDetailLabel}>% of Max:</span>
            <span style={tooltipDetailValue}>{percentOfMax}%</span>
          </div>
          <div style={tooltipDetailRow}>
            <span style={tooltipDetailLabel}>Rank:</span>
            <span style={tooltipDetailValue}>
              #{rank} of {data.length}
            </span>
          </div>
          <div style={tooltipBarContainer}>
            <div
              style={{
                ...tooltipBarFill,
                width: `${percentOfMax}%`,
                background: effectiveDotColor,
              }}
            />
          </div>
        </div>
      );
    }
    return null;
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
    borderBottom: `2px solid ${stickColor}`,
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
    maxHeight: "350px",
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
    fontSize: "11px",
  };
  const cellInputStyle = {
    padding: "6px 8px",
    background: theme.colors.inputBg,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: "3px",
    color: theme.colors.text.body,
    fontSize: "11px",
    fontFamily: theme.typography.fontFamily.primary,
    width: "100%",
    outline: "none",
    boxSizing: "border-box",
  };
  const buttonStyle = {
    padding: "8px 16px",
    background: "transparent",
    border: `1px solid ${stickColor}`,
    borderRadius: "3px",
    color: stickColor,
    cursor: "pointer",
    fontSize: "11px",
    fontFamily: theme.typography.fontFamily.primary,
    fontWeight: 600,
    letterSpacing: "1px",
    textTransform: "uppercase",
    transition: "all 0.15s ease",
  };
  const deleteButtonStyle = {
    padding: "4px 8px",
    background: "transparent",
    border: `1px solid ${theme.colors.status.error}`,
    borderRadius: "3px",
    color: theme.colors.status.error,
    cursor: "pointer",
    fontSize: "10px",
  };
  const tooltipContainerStyle = {
    background: theme.colors.cardBg,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: "4px",
    padding: "14px 16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
    minWidth: "160px",
  };
  const tooltipLabelStyle = {
    color: theme.colors.text.heading,
    fontSize: "12px",
    fontWeight: 700,
    margin: "0 0 6px 0",
    textTransform: "uppercase",
    letterSpacing: "1px",
    borderBottom: `1px solid ${theme.colors.border.light}`,
    paddingBottom: "6px",
  };
  const tooltipValueRow = { marginBottom: "8px", textAlign: "center" };
  const tooltipDetailRow = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "3px",
    fontSize: "10px",
  };
  const tooltipDetailLabel = { color: theme.colors.text.muted };
  const tooltipDetailValue = {
    color: theme.colors.text.heading,
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
          <span style={{ fontSize: "28px" }}>🍭</span>
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
              color: stickColor,
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${stickColor}50`,
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
      <div id="chart-visual-area" style={chartContainerStyle}>
        <ResponsiveContainer width="100%" height={420}>
          <ComposedChart
            data={data}
            layout={isHorizontal ? "vertical" : "horizontal"}
            margin={{ top: 30, right: 40, left: 20, bottom: 20 }}
          >
            {gridVisible && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme.colors.border.light}
                vertical={false}
              />
            )}
            {isHorizontal ? (
              <>
                <XAxis
                  type="number"
                  tick={{ fill: theme.colors.text.muted, fontSize: 11 }}
                  axisLine={{ stroke: theme.colors.border.default }}
                  domain={[minValue, maxValue + Math.ceil(maxValue * 0.15)]}
                />
                <YAxis
                  dataKey="label"
                  type="category"
                  tick={{ fill: theme.colors.text.muted, fontSize: 11 }}
                  axisLine={{ stroke: theme.colors.border.default }}
                  width={80}
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
                  domain={[minValue, maxValue + Math.ceil(maxValue * 0.15)]}
                />
              </>
            )}
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ strokeDasharray: "3 3" }}
            />
            <Line
              dataKey="value"
              stroke="transparent"
              strokeWidth={0}
              dot={false}
              isAnimationActive={false}
            />
            <Bar
              dataKey="value"
              barSize={stickWidth}
              fill={stickColor}
              fillOpacity={0.8}
              radius={[2, 2, 0, 0]}
              isAnimationActive={animation}
              animationDuration={800}
              shape={renderStick}
            >
              {showValues && valuePosition === "top" && (
                <LabelList
                  dataKey="value"
                  position="top"
                  fill={theme.colors.text.body}
                  fontSize={10}
                  fontWeight={600}
                />
              )}
            </Bar>
            <Scatter
              dataKey="value"
              fill={effectiveDotColor}
              shape={<CustomDot />}
              isAnimationActive={animation}
              animationDuration={600}
              animationBegin={200}
            />
            <Legend
              payload={[
                { value: "Value", type: "circle", color: effectiveDotColor },
              ]}
              wrapperStyle={{
                fontSize: "10px",
                fontFamily: theme.typography.fontFamily.primary,
                color: "#8b949e",
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🥢 Stick Color</label>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <input
              type="color"
              value={stickColor}
              onChange={(e) => setStickColor(e.target.value)}
              style={{
                width: "36px",
                height: "36px",
                border: `1px solid ${theme.colors.border.default}`,
                borderRadius: "3px",
                cursor: "pointer",
                padding: "2px",
              }}
            />
            <input
              type="text"
              value={stickColor}
              onChange={(e) => setStickColor(e.target.value)}
              style={{ ...inputStyle, width: "100px" }}
            />
          </div>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🍬 Dot Color</label>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <input
              type="color"
              value={dotColor}
              onChange={(e) => setDotColor(e.target.value)}
              disabled={matchColors}
              style={{
                width: "36px",
                height: "36px",
                border: `1px solid ${theme.colors.border.default}`,
                borderRadius: "3px",
                cursor: matchColors ? "not-allowed" : "pointer",
                padding: "2px",
                opacity: matchColors ? 0.5 : 1,
              }}
            />
            <input
              type="text"
              value={matchColors ? stickColor : dotColor}
              onChange={(e) => setDotColor(e.target.value)}
              disabled={matchColors}
              style={{
                ...inputStyle,
                width: "100px",
                opacity: matchColors ? 0.5 : 1,
              }}
            />
          </div>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔗 Match Colors</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={matchColors}
              onChange={(e) => setMatchColors(e.target.checked)}
              style={{ accentColor: stickColor }}
            />
            <span style={{ fontSize: "12px", color: theme.colors.text.body }}>
              Same as stick
            </span>
          </label>
        </div>
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
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🥢 Stick Width: {stickWidth}px</label>
          <input
            type="range"
            min="1"
            max="12"
            value={stickWidth}
            onChange={(e) => setStickWidth(Number(e.target.value))}
            style={{ width: "100%", accentColor: stickColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🍬 Dot Size: {dotSize}px</label>
          <input
            type="range"
            min="3"
            max="20"
            value={dotSize}
            onChange={(e) => setDotSize(Number(e.target.value))}
            style={{ width: "100%", accentColor: effectiveDotColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>〰️ Stick Style</label>
          <select
            value={stickStyle}
            onChange={(e) => setStickStyle(e.target.value)}
            style={selectStyle}
          >
            {STICK_STYLES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎯 Dot Style</label>
          <select
            value={dotStyle}
            onChange={(e) => setDotStyle(e.target.value)}
            style={selectStyle}
          >
            <option value="filled">Filled</option>
            <option value="outline">Outline</option>
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>💬 Value Labels</label>
          <select
            value={valuePosition}
            onChange={(e) => setValuePosition(e.target.value)}
            style={selectStyle}
          >
            <option value="dot">On Dot</option>
            <option value="top">Top of Stick</option>
            <option value="none">Hidden</option>
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>👁️ Show Values</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showValues}
              onChange={(e) => setShowValues(e.target.checked)}
              style={{ accentColor: stickColor }}
            />
            <span style={{ fontSize: "12px", color: theme.colors.text.body }}>
              Display on chart
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔲 Grid</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={gridVisible}
              onChange={(e) => setGridVisible(e.target.checked)}
              style={{ accentColor: stickColor }}
            />
            <span style={{ fontSize: "12px", color: theme.colors.text.body }}>
              Show grid
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
              style={{ accentColor: stickColor }}
            />
            <span style={{ fontSize: "12px", color: theme.colors.text.body }}>
              Animate chart
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
            marginBottom: "12px",
          }}
        >
          <label style={labelStyle}>📋 Data Table</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={addDataRow} style={buttonStyle}>
              + Add Row
            </button>
            <button
              onClick={resetData}
              style={{
                ...buttonStyle,
                borderColor: theme.colors.text.muted,
                color: theme.colors.text.muted,
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
                <th style={thStyle}>Visual</th>
                <th style={thStyle}>% of Max</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => {
                const percent = ((row.value / maxValue) * 100).toFixed(1);
                return (
                  <tr key={index}>
                    <td
                      style={{
                        ...tdStyle,
                        color: theme.colors.text.muted,
                        fontSize: "10px",
                        width: "30px",
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
                        style={{ ...cellInputStyle, width: "80px" }}
                        placeholder="Value"
                      />
                    </td>
                    <td style={tdStyle}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <div
                          style={{
                            height: `${stickWidth + 6}px`,
                            width: `${(row.value / maxValue) * 100}%`,
                            minWidth: "20px",
                            background: stickColor,
                            borderRadius: "2px",
                            position: "relative",
                            opacity: 0.6,
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              right: "-6px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              width: `${Math.min(dotSize, 14)}px`,
                              height: `${Math.min(dotSize, 14)}px`,
                              backgroundColor:
                                dotStyle === "outline"
                                  ? "#ffffff"
                                  : effectiveDotColor,
                              borderRadius: "50%",
                              border:
                                dotStyle === "outline"
                                  ? `2px solid ${effectiveDotColor}`
                                  : "none",
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        color: effectiveDotColor,
                        fontWeight: 600,
                        fontSize: "10px",
                      }}
                    >
                      {percent}%
                    </td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => removeDataRow(index)}
                        style={deleteButtonStyle}
                        disabled={data.length <= 1}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
              {data.reduce((s, d) => s + d.value, 0)}
            </strong>
          </span>
          <span style={{ color: theme.colors.text.muted }}>
            Average:{" "}
            <strong style={{ color: stickColor }}>
              {(data.reduce((s, d) => s + d.value, 0) / data.length).toFixed(1)}
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
            Range:{" "}
            <strong style={{ color: theme.colors.text.heading }}>
              {maxValue - Math.min(...data.map((d) => d.value))}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LollipopChartComponent;

