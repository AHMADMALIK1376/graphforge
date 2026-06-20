import React, { useState, useCallback, useMemo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  ReferenceLine,
} from "recharts";
import { theme } from "../../../styles/theme";

// ============================================
// DEFAULT DATA
// ============================================
const DEFAULT_DATA = [
  { label: "Revenue", start: 30, end: 70 },
  { label: "Profit Margin", start: 45, end: 85 },
  { label: "Customers", start: 55, end: 90 },
  { label: "Market Share", start: 20, end: 55 },
  { label: "Satisfaction", start: 60, end: 75 },
  { label: "Productivity", start: 40, end: 80 },
  { label: "Retention", start: 50, end: 65 },
  { label: "Growth Rate", start: 25, end: 70 },
];

// ============================================
// DOT STYLE OPTIONS
// ============================================
const DOT_STYLES = [
  { name: "Circle", value: "circle" },
  { name: "Diamond", value: "diamond" },
  { name: "Square", value: "square" },
];

// ============================================
// MAIN COMPONENT
// ============================================
const DumbbellChartComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#58a6ff",
}) => {
  // ===== STATE =====
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Dumbbell Chart");
  const [startColor, setStartColor] = useState("#f85149");
  const [endColor, setEndColor] = useState("#3fb950");
  const [lineColor, setLineColor] = useState("#8b949e");
  const [startSize, setStartSize] = useState(8);
  const [endSize, setEndSize] = useState(10);
  const [lineWidth, setLineWidth] = useState(2.5);
  const [startStyle, setStartStyle] = useState("circle");
  const [endStyle, setEndStyle] = useState("circle");
  const [showChangeValue, setShowChangeValue] = useState(true);
  const [showChangePercent, setShowChangePercent] = useState(true);
  const [gridVisible, setGridVisible] = useState(true);
  const [orientation, setOrientation] = useState("vertical");
  const [sortBy, setSortBy] = useState("none");
  const [highlightDirection, setHighlightDirection] = useState(true);

  // ===== DERIVED =====
  const isHorizontal = orientation === "horizontal";

  const sortedData = useMemo(() => {
    const sorted = [...data];
    switch (sortBy) {
      case "change":
        sorted.sort((a, b) => b.end - b.start - (a.end - a.start));
        break;
      case "start":
        sorted.sort((a, b) => b.start - a.start);
        break;
      case "end":
        sorted.sort((a, b) => b.end - a.end);
        break;
      case "label":
        sorted.sort((a, b) => a.label.localeCompare(b.label));
        break;
      default:
        break;
    }
    return sorted;
  }, [data, sortBy]);

  const scatterData = useMemo(() => {
    const startPoints = [];
    const endPoints = [];
    sortedData.forEach((item, index) => {
      startPoints.push({
        x: isHorizontal ? item.start : index,
        y: isHorizontal ? index : item.start,
        label: item.label,
        value: item.start,
        type: "start",
        index,
        change: item.end - item.start,
        changePercent:
          item.start !== 0
            ? ((item.end - item.start) / Math.abs(item.start)) * 100
            : 100,
        endValue: item.end,
      });
      endPoints.push({
        x: isHorizontal ? item.end : index,
        y: isHorizontal ? index : item.end,
        label: item.label,
        value: item.end,
        type: "end",
        index,
        change: item.end - item.start,
        changePercent:
          item.start !== 0
            ? ((item.end - item.start) / Math.abs(item.start)) * 100
            : 100,
        startValue: item.start,
      });
    });
    return { startPoints, endPoints };
  }, [sortedData, isHorizontal]);

  const globalStats = useMemo(() => {
    const totalChange = data.reduce((s, d) => s + (d.end - d.start), 0);
    const avgChange = totalChange / data.length;
    const maxChange = Math.max(...data.map((d) => d.end - d.start));
    const minChange = Math.min(...data.map((d) => d.end - d.start));
    const improved = data.filter((d) => d.end > d.start).length;
    const declined = data.filter((d) => d.end < d.start).length;
    const unchanged = data.filter((d) => d.end === d.start).length;
    return {
      totalChange,
      avgChange,
      maxChange,
      minChange,
      improved,
      declined,
      unchanged,
    };
  }, [data]);

  const handleDataChange = useCallback(
    (index, field, newValue) => {
      setData((prev) => {
        const updated = [...prev];
        const originalIndex = sortedData[index]
          ? data.findIndex((d) => d.label === sortedData[index].label)
          : index;
        updated[originalIndex] = {
          ...updated[originalIndex],
          [field]: Number(newValue) || 0,
        };
        return updated;
      });
    },
    [data, sortedData],
  );

  const handleLabelChange = useCallback(
    (index, newLabel) => {
      setData((prev) => {
        const updated = [...prev];
        const originalIndex = sortedData[index]
          ? data.findIndex((d) => d.label === sortedData[index].label)
          : index;
        updated[originalIndex] = { ...updated[originalIndex], label: newLabel };
        return updated;
      });
    },
    [data, sortedData],
  );

  const addItem = useCallback(() => {
    const newStart = Math.floor(Math.random() * 60) + 10;
    const newEnd = newStart + Math.floor(Math.random() * 40) + 10;
    setData((prev) => [
      ...prev,
      { label: `Item ${prev.length + 1}`, start: newStart, end: newEnd },
    ]);
  }, []);

  const removeItem = useCallback(
    (index) => {
      const originalIndex = sortedData[index]
        ? data.findIndex((d) => d.label === sortedData[index].label)
        : index;
      setData((prev) => prev.filter((_, i) => i !== originalIndex));
    },
    [data, sortedData],
  );

  const StartDot = (props) => {
    const { cx, cy, payload } = props;
    const size = startSize;
    const isImproved = payload.endValue > payload.value;
    const color = highlightDirection && !isImproved ? "#f85149" : startColor;
    switch (startStyle) {
      case "diamond":
        return (
          <polygon
            points={`${cx},${cy - size} ${cx + size},${cy} ${cx},${cy + size} ${cx - size},${cy}`}
            fill={color}
            stroke={color}
            strokeWidth={1.5}
            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }}
          />
        );
      case "square":
        return (
          <rect
            x={cx - size}
            y={cy - size}
            width={size * 2}
            height={size * 2}
            rx={2}
            fill={color}
            stroke={color}
            strokeWidth={1.5}
            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }}
          />
        );
      default:
        return (
          <g>
            <circle cx={cx} cy={cy} r={size + 2} fill={color} opacity={0.2} />
            <circle
              cx={cx}
              cy={cy}
              r={size}
              fill={color}
              stroke="#fff"
              strokeWidth={1.5}
              style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}
            />
          </g>
        );
    }
  };

  const EndDot = (props) => {
    const { cx, cy, payload } = props;
    const size = endSize;
    const isImproved = payload.value > payload.startValue;
    const color = highlightDirection && isImproved ? "#3fb950" : endColor;
    switch (endStyle) {
      case "diamond":
        return (
          <polygon
            points={`${cx},${cy - size} ${cx + size},${cy} ${cx},${cy + size} ${cx - size},${cy}`}
            fill={color}
            stroke={color}
            strokeWidth={1.5}
            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }}
          />
        );
      case "square":
        return (
          <rect
            x={cx - size}
            y={cy - size}
            width={size * 2}
            height={size * 2}
            rx={2}
            fill={color}
            stroke={color}
            strokeWidth={1.5}
            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }}
          />
        );
      default:
        return (
          <g>
            <circle cx={cx} cy={cy} r={size + 2} fill={color} opacity={0.2} />
            <circle
              cx={cx}
              cy={cy}
              r={size}
              fill={color}
              stroke="#fff"
              strokeWidth={1.5}
              style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}
            />
          </g>
        );
    }
  };

  const renderConnectingLines = () => {
    return sortedData.map((item, index) => {
      if (isHorizontal) {
        const x1 = (item.start / 100) * 100;
        const x2 = (item.end / 100) * 100;
        // x1 and x2 used for positioning reference
        return (
          <ReferenceLine
            key={`conn-${index}`}
            y={index}
            segment={[
              { x: x1, y: index },
              { x: x2, y: index },
            ]}
            stroke={lineColor}
            strokeWidth={lineWidth * 0.5}
            strokeDasharray="3 3"
            opacity={0.3}
          />
        );
      }
      const y1 = item.start;
      const y2 = item.end;
      return (
        <ReferenceLine
          key={`conn-${index}`}
          x={index}
          segment={[
            { x: index, y: y1 },
            { x: index, y: y2 },
          ]}
          stroke={lineColor}
          strokeWidth={lineWidth * 0.5}
          strokeDasharray="3 3"
          opacity={0.3}
        />
      );
    });
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0]?.payload;
      if (!dataPoint) return null;
      const isStart = dataPoint.type === "start";
      const changeColor =
        dataPoint.change > 0
          ? "#3fb950"
          : dataPoint.change < 0
            ? "#f85149"
            : "#8b949e";
      const arrow =
        dataPoint.change > 0 ? "↑" : dataPoint.change < 0 ? "↓" : "→";
      return (
        <div style={tooltipContainerStyle}>
          <p style={tooltipLabelStyle}>{dataPoint.label}</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                textAlign: "center",
                padding: "8px",
                background: theme.colors.inputBg,
                borderRadius: "3px",
              }}
            >
              <div
                style={{
                  color: startColor,
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  marginBottom: "4px",
                }}
              >
                START
              </div>
              <div
                style={{
                  color: theme.colors.text.heading,
                  fontSize: "16px",
                  fontWeight: 700,
                }}
              >
                {isStart ? dataPoint.value : dataPoint.startValue}
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                padding: "8px",
                background: theme.colors.inputBg,
                borderRadius: "3px",
              }}
            >
              <div
                style={{
                  color: endColor,
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  marginBottom: "4px",
                }}
              >
                END
              </div>
              <div
                style={{
                  color: theme.colors.text.heading,
                  fontSize: "16px",
                  fontWeight: 700,
                }}
              >
                {!isStart ? dataPoint.value : dataPoint.endValue}
              </div>
            </div>
          </div>
          <div
            style={{
              textAlign: "center",
              padding: "6px",
              background: changeColor + "15",
              borderRadius: "3px",
              border: `1px solid ${changeColor}40`,
            }}
          >
            <span
              style={{ color: changeColor, fontSize: "11px", fontWeight: 700 }}
            >
              {arrow} {dataPoint.change > 0 ? "+" : ""}
              {dataPoint.change.toFixed(1)}
            </span>
            <span
              style={{
                color: changeColor,
                fontSize: "10px",
                marginLeft: "6px",
              }}
            >
              ({dataPoint.changePercent > 0 ? "+" : ""}
              {dataPoint.changePercent.toFixed(1)}%)
            </span>
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
    borderBottom: `2px solid ${lineColor}`,
    color: theme.colors.text.heading,
    fontSize: "20px",
    fontWeight: 700,
    fontFamily: theme.typography.fontFamily.primary,
    letterSpacing: "2px",
    outline: "none",
    padding: "4px 0",
    width: "280px",
  };
  const chartContainerStyle = {
    background: "#ffffff",
    borderRadius: "6px",
    padding: "24px 16px 16px",
    border: `1px solid ${theme.colors.border.light}`,
    minHeight: "480px",
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
  const statsCardStyle = {
    background: theme.colors.cardBg,
    padding: "12px 16px",
    borderRadius: "4px",
    border: `1px solid ${theme.colors.border.default}`,
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
    fontSize: "11px",
  };
  const thStyle = {
    background: theme.colors.inputBg,
    color: theme.colors.text.muted,
    padding: "8px 10px",
    textAlign: "left",
    fontSize: "9px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1px",
    borderBottom: `2px solid ${theme.colors.border.default}`,
    position: "sticky",
    top: 0,
    whiteSpace: "nowrap",
  };
  const tdStyle = {
    padding: "5px 8px",
    borderBottom: `1px solid ${theme.colors.border.light}`,
    fontSize: "10px",
  };
  const cellInputStyle = {
    padding: "5px 6px",
    background: theme.colors.inputBg,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: "2px",
    color: theme.colors.text.body,
    fontSize: "10px",
    fontFamily: theme.typography.fontFamily.primary,
    width: "60px",
    outline: "none",
    boxSizing: "border-box",
  };
  const buttonStyle = (color = lineColor) => ({
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
  const deleteButtonStyle = {
    padding: "3px 6px",
    background: "transparent",
    border: `1px solid ${theme.colors.status.error}`,
    borderRadius: "2px",
    color: theme.colors.status.error,
    cursor: "pointer",
    fontSize: "9px",
  };
  const tooltipContainerStyle = {
    background: theme.colors.cardBg,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: "4px",
    padding: "12px 14px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
    minWidth: "200px",
  };
  const tooltipLabelStyle = {
    color: theme.colors.text.heading,
    fontSize: "12px",
    fontWeight: 700,
    margin: "0 0 10px 0",
    textTransform: "uppercase",
    letterSpacing: "1px",
    borderBottom: `1px solid ${theme.colors.border.light}`,
    paddingBottom: "6px",
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>🏋️</span>
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
              color: startColor,
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${startColor}50`,
              borderRadius: "3px",
              fontWeight: 600,
              letterSpacing: "1px",
            }}
          >
            START
          </span>
          <span
            style={{
              color: endColor,
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${endColor}50`,
              borderRadius: "3px",
              fontWeight: 600,
              letterSpacing: "1px",
            }}
          >
            END
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
        <ResponsiveContainer width="100%" height={440}>
          <ScatterChart margin={{ top: 20, right: 50, left: 10, bottom: 20 }}>
            {gridVisible && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme.colors.border.light}
              />
            )}
            {isHorizontal ? (
              <>
                <XAxis
                  type="number"
                  dataKey="x"
                  tick={{ fill: theme.colors.text.muted, fontSize: 10 }}
                  axisLine={{ stroke: theme.colors.border.default }}
                  name="Value"
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  tick={{ fill: theme.colors.text.muted, fontSize: 10 }}
                  axisLine={{ stroke: theme.colors.border.default }}
                  domain={[data.length - 0.5, -0.5]}
                  ticks={sortedData.map((_, i) => i)}
                  tickFormatter={(i) => sortedData[i]?.label || ""}
                  name=""
                  width={100}
                />
              </>
            ) : (
              <>
                <XAxis
                  type="number"
                  dataKey="x"
                  tick={{ fill: theme.colors.text.muted, fontSize: 10 }}
                  axisLine={{ stroke: theme.colors.border.default }}
                  domain={[-0.5, data.length - 0.5]}
                  ticks={sortedData.map((_, i) => i)}
                  tickFormatter={(i) => sortedData[i]?.label || ""}
                  name=""
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  tick={{ fill: theme.colors.text.muted, fontSize: 10 }}
                  axisLine={{ stroke: theme.colors.border.default }}
                  name="Value"
                />
              </>
            )}
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ strokeDasharray: "3 3" }}
            />
            {sortedData.map((item, index) =>
              isHorizontal ? (
                <ReferenceLine
                  key={`line-${index}`}
                  y={index}
                  stroke={lineColor}
                  strokeWidth={lineWidth}
                  opacity={0.4}
                />
              ) : (
                <ReferenceLine
                  key={`line-${index}`}
                  x={index}
                  stroke={lineColor}
                  strokeWidth={lineWidth}
                  opacity={0.4}
                />
              ),
            )}

            {/* Start Points with Cell */}
            <Scatter
              data={scatterData.startPoints}
              shape={<StartDot />}
              isAnimationActive={true}
              animationDuration={600}
              name="Start"
            >
              {scatterData.startPoints.map((entry, idx) => (
                <Cell key={`start-cell-${idx}`} fill={startColor} />
              ))}
            </Scatter>

            {/* End Points with Cell */}
            <Scatter
              data={scatterData.endPoints}
              shape={<EndDot />}
              isAnimationActive={true}
              animationDuration={600}
              animationBegin={200}
              name="End"
            >
              {scatterData.endPoints.map((entry, idx) => (
                <Cell key={`end-cell-${idx}`} fill={endColor} />
              ))}
            </Scatter>

            {/* Connecting line segments */}
            {sortedData.map((item, index) => {
              const startX = isHorizontal ? item.start : index;
              const startY = isHorizontal ? index : item.start;
              const endX = isHorizontal ? item.end : index;
              const endY = isHorizontal ? index : item.end;
              const isImproved = item.end > item.start;
              const lineColorFinal = highlightDirection
                ? isImproved
                  ? "#3fb950"
                  : "#f85149"
                : lineColor;
              return (
                <ReferenceLine
                  key={`segment-${index}`}
                  segment={[
                    { x: startX, y: startY },
                    { x: endX, y: endY },
                  ]}
                  stroke={lineColorFinal}
                  strokeWidth={lineWidth}
                  opacity={0.6}
                />
              );
            })}

            {/* Render connecting lines from function */}
            {renderConnectingLines()}

            {/* Legend */}
            <Legend
              payload={[
                { value: "Start", type: "circle", color: startColor },
                { value: "End", type: "circle", color: endColor },
              ]}
              wrapperStyle={{
                fontSize: "10px",
                fontFamily: theme.typography.fontFamily.primary,
                color: "#8b949e",
              }}
            />
          </ScatterChart>
        </ResponsiveContainer>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginTop: "10px",
            fontSize: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: "10px",
                height: "10px",
                background: startColor,
                borderRadius: "50%",
                display: "inline-block",
              }}
            />
            <span style={{ color: theme.colors.text.muted }}>Start Point</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: "10px",
                height: "10px",
                background: endColor,
                borderRadius: "50%",
                display: "inline-block",
              }}
            />
            <span style={{ color: theme.colors.text.muted }}>End Point</span>
          </div>
          {highlightDirection && (
            <>
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "2px",
                    background: "#3fb950",
                    display: "inline-block",
                  }}
                />
                <span style={{ color: "#3fb950" }}>Improved</span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "2px",
                    background: "#f85149",
                    display: "inline-block",
                  }}
                />
                <span style={{ color: "#f85149" }}>Declined</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔴 Start Color</label>
          <input
            type="color"
            value={startColor}
            onChange={(e) => setStartColor(e.target.value)}
            style={{
              width: "36px",
              height: "30px",
              cursor: "pointer",
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: "3px",
              padding: "2px",
            }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🟢 End Color</label>
          <input
            type="color"
            value={endColor}
            onChange={(e) => setEndColor(e.target.value)}
            style={{
              width: "36px",
              height: "30px",
              cursor: "pointer",
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: "3px",
              padding: "2px",
            }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>〰️ Line Color</label>
          <input
            type="color"
            value={lineColor}
            onChange={(e) => setLineColor(e.target.value)}
            style={{
              width: "36px",
              height: "30px",
              cursor: "pointer",
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: "3px",
              padding: "2px",
            }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔴 Start Style</label>
          <select
            value={startStyle}
            onChange={(e) => setStartStyle(e.target.value)}
            style={selectStyle}
          >
            {DOT_STYLES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🟢 End Style</label>
          <select
            value={endStyle}
            onChange={(e) => setEndStyle(e.target.value)}
            style={selectStyle}
          >
            {DOT_STYLES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔴 Start Size: {startSize}px</label>
          <input
            type="range"
            min="4"
            max="16"
            value={startSize}
            onChange={(e) => setStartSize(Number(e.target.value))}
            style={{ width: "100%", accentColor: startColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🟢 End Size: {endSize}px</label>
          <input
            type="range"
            min="4"
            max="16"
            value={endSize}
            onChange={(e) => setEndSize(Number(e.target.value))}
            style={{ width: "100%", accentColor: endColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Line Width: {lineWidth}px</label>
          <input
            type="range"
            min="1"
            max="6"
            step="0.5"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            style={{ width: "100%", accentColor: lineColor }}
          />
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
          <label style={labelStyle}>📊 Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={selectStyle}
          >
            <option value="none">Default</option>
            <option value="label">Label (A-Z)</option>
            <option value="change">Change (Largest)</option>
            <option value="start">Start Value</option>
            <option value="end">End Value</option>
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Highlight Direction</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={highlightDirection}
              onChange={(e) => setHighlightDirection(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Color lines
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>💬 Show Change</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showChangeValue}
              onChange={(e) => setShowChangeValue(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Value & %
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>💯 Show % Change</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showChangePercent}
              onChange={(e) => setShowChangePercent(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Percentage
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
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Show grid
            </span>
          </label>
        </div>
      </div>

      <div style={statsCardStyle}>
        <label style={labelStyle}>📊 Change Summary</label>
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "10px",
            flexWrap: "wrap",
            fontSize: "10px",
          }}
        >
          <span style={{ color: theme.colors.text.muted }}>
            Improved:{" "}
            <strong style={{ color: "#3fb950" }}>{globalStats.improved}</strong>
          </span>
          <span style={{ color: theme.colors.text.muted }}>
            Declined:{" "}
            <strong style={{ color: "#f85149" }}>{globalStats.declined}</strong>
          </span>
          <span style={{ color: theme.colors.text.muted }}>
            Unchanged:{" "}
            <strong style={{ color: theme.colors.text.body }}>
              {globalStats.unchanged}
            </strong>
          </span>
          <span style={{ color: theme.colors.text.muted }}>
            Avg Change:{" "}
            <strong style={{ color: theme.colors.text.body }}>
              {globalStats.avgChange.toFixed(1)}
            </strong>
          </span>
          <span style={{ color: theme.colors.text.muted }}>
            Max Change:{" "}
            <strong style={{ color: "#3fb950" }}>
              +{globalStats.maxChange}
            </strong>
          </span>
          <span style={{ color: theme.colors.text.muted }}>
            Min Change:{" "}
            <strong style={{ color: "#f85149" }}>
              {globalStats.minChange}
            </strong>
          </span>
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
            <button onClick={addItem} style={buttonStyle()}>
              + Add Item
            </button>
            <button
              onClick={() => setData(DEFAULT_DATA)}
              style={{
                ...buttonStyle(),
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
                <th style={{ ...thStyle, color: startColor }}>Start</th>
                <th style={{ ...thStyle, color: endColor }}>End</th>
                <th style={thStyle}>Change</th>
                <th style={thStyle}>% Change</th>
                <th style={thStyle}>Direction</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item, index) => {
                const change = item.end - item.start;
                const changePercent =
                  item.start !== 0
                    ? ((item.end - item.start) / Math.abs(item.start)) * 100
                    : 100;
                const isImproved = change > 0;
                const isSame = change === 0;
                const changeColor = isSame
                  ? "#8b949e"
                  : isImproved
                    ? "#3fb950"
                    : "#f85149";
                const arrow = isSame ? "→" : isImproved ? "↑" : "↓";
                return (
                  <tr key={index}>
                    <td
                      style={{
                        ...tdStyle,
                        color: theme.colors.text.muted,
                        width: "25px",
                      }}
                    >
                      {index + 1}
                    </td>
                    <td style={tdStyle}>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) =>
                          handleLabelChange(index, e.target.value)
                        }
                        style={{ ...cellInputStyle, width: "100px" }}
                      />
                    </td>
                    <td style={tdStyle}>
                      <input
                        type="number"
                        value={item.start}
                        onChange={(e) =>
                          handleDataChange(index, "start", e.target.value)
                        }
                        style={cellInputStyle}
                      />
                    </td>
                    <td style={tdStyle}>
                      <input
                        type="number"
                        value={item.end}
                        onChange={(e) =>
                          handleDataChange(index, "end", e.target.value)
                        }
                        style={cellInputStyle}
                      />
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        color: changeColor,
                        fontWeight: 700,
                      }}
                    >
                      {change > 0 ? "+" : ""}
                      {change}
                    </td>
                    <td style={{ ...tdStyle, color: changeColor }}>
                      {changePercent > 0 ? "+" : ""}
                      {changePercent.toFixed(1)}%
                    </td>
                    <td style={tdStyle}>
                      <span style={{ color: changeColor, fontSize: "16px" }}>
                        {arrow}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => removeItem(index)}
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
      </div>
    </div>
  );
};

export default DumbbellChartComponent;

