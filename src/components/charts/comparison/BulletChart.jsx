import React, { useState, useCallback } from "react";
import { theme } from "../../../styles/theme";

// ============================================
// DEFAULT DATA - Multiple bullet charts
// ============================================
const DEFAULT_DATA = [
  {
    label: "Revenue",
    value: 75,
    target: 80,
    ranges: [0, 50, 70, 100],
    rangeLabels: ["Poor", "Satisfactory", "Good", "Excellent"],
    unit: "$K",
  },
  {
    label: "Profit Margin",
    value: 45,
    target: 55,
    ranges: [0, 30, 50, 100],
    rangeLabels: ["Low", "Average", "Good", "Excellent"],
    unit: "%",
  },
  {
    label: "Customer Satisfaction",
    value: 88,
    target: 85,
    ranges: [0, 40, 70, 100],
    rangeLabels: ["Poor", "Fair", "Good", "Excellent"],
    unit: "%",
  },
  {
    label: "Employee Retention",
    value: 62,
    target: 75,
    ranges: [0, 40, 65, 100],
    rangeLabels: ["Critical", "Warning", "Good", "Excellent"],
    unit: "%",
  },
  {
    label: "Market Share",
    value: 35,
    target: 40,
    ranges: [0, 20, 35, 100],
    rangeLabels: ["Low", "Average", "Good", "Excellent"],
    unit: "%",
  },
];

const DEFAULT_RANGE_COLORS = ["#f85149", "#d29922", "#58a6ff", "#3fb950"];
const DEFAULT_TARGET_COLOR = "#1a1a2e";

const TARGET_STYLES = [
  { name: "Line", value: "line" },
  { name: "Triangle", value: "triangle" },
  { name: "Circle", value: "circle" },
  { name: "Diamond", value: "diamond" },
];

const BulletChartComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#58a6ff",
}) => {
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Bullet Chart");
  const [rangeColors, setRangeColors] = useState(DEFAULT_RANGE_COLORS);
  const [targetColor, setTargetColor] = useState(DEFAULT_TARGET_COLOR);
  const [performanceColor, setPerformanceColor] = useState("#58a6ff");
  const [targetStyle, setTargetStyle] = useState("line");
  const [targetWidth, setTargetWidth] = useState(3);
  const [barHeight, setBarHeight] = useState(30);
  const [showValues, setShowValues] = useState(true);
  const [showTargets, setShowTargets] = useState(true);
  const [showRanges, setShowRanges] = useState(true);
  const [showRangeLabels, setShowRangeLabels] = useState(false);
  const [barGap, setBarGap] = useState(15);
  const [tooltipData, setTooltipData] = useState(null);

  const handleValueChange = useCallback((index, newValue) => {
    setData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], value: Number(newValue) || 0 };
      return updated;
    });
  }, []);

  const handleTargetChange = useCallback((index, newTarget) => {
    setData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], target: Number(newTarget) || 0 };
      return updated;
    });
  }, []);

  const handleLabelChange = useCallback((index, newLabel) => {
    setData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], label: newLabel };
      return updated;
    });
  }, []);

  const handleRangeLabelChange = useCallback(
    (dataIndex, rangeIndex, newLabel) => {
      setData((prev) => {
        const updated = [...prev];
        const newRangeLabels = [...updated[dataIndex].rangeLabels];
        newRangeLabels[rangeIndex] = newLabel;
        updated[dataIndex] = {
          ...updated[dataIndex],
          rangeLabels: newRangeLabels,
        };
        return updated;
      });
    },
    [],
  );

  const addBullet = useCallback(() => {
    setData((prev) => [
      ...prev,
      {
        label: `Metric ${prev.length + 1}`,
        value: 50,
        target: 70,
        ranges: [0, 40, 65, 100],
        rangeLabels: ["Poor", "Average", "Good", "Excellent"],
        unit: "%",
      },
    ]);
  }, []);

  const removeBullet = useCallback((index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleRangeColorChange = (index, newColor) => {
    const updated = [...rangeColors];
    updated[index] = newColor;
    setRangeColors(updated);
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const bulletData = data.find((d) => d.label === label);
      if (!bulletData) return null;
      const percentOfTarget = (
        (bulletData.value / bulletData.target) *
        100
      ).toFixed(1);
      const gap = bulletData.target - bulletData.value;
      const status =
        bulletData.value >= bulletData.target ? "ACHIEVED" : "BELOW TARGET";
      const statusColor =
        bulletData.value >= bulletData.target ? "#3fb950" : "#f85149";

      return (
        <div style={tooltipContainerStyle}>
          <p style={tooltipLabelStyle}>{label}</p>
          <div style={tooltipMetricRow}>
            <span style={tooltipMetricLabel}>Performance:</span>
            <span style={{ ...tooltipMetricValue, color: performanceColor }}>
              {bulletData.value}
              {bulletData.unit}
            </span>
          </div>
          <div style={tooltipMetricRow}>
            <span style={tooltipMetricLabel}>Target:</span>
            <span style={{ ...tooltipMetricValue, color: targetColor }}>
              {bulletData.target}
              {bulletData.unit}
            </span>
          </div>
          <div style={tooltipMetricRow}>
            <span style={tooltipMetricLabel}>Achievement:</span>
            <span style={{ ...tooltipMetricValue, color: statusColor }}>
              {percentOfTarget}%
            </span>
          </div>
          <div style={tooltipMetricRow}>
            <span style={tooltipMetricLabel}>Gap:</span>
            <span style={{ ...tooltipMetricValue, color: statusColor }}>
              {gap > 0
                ? `-${gap}${bulletData.unit}`
                : `+${Math.abs(gap)}${bulletData.unit}`}
            </span>
          </div>
          <div
            style={{
              ...tooltipStatusBadge,
              background: statusColor + "20",
              color: statusColor,
              border: `1px solid ${statusColor}`,
            }}
          >
            {status}
          </div>
          <div style={tooltipRangeContainer}>
            <p style={tooltipRangeTitle}>Qualitative Ranges:</p>
            {bulletData.ranges &&
              bulletData.ranges.map((range, i) => {
                const nextRange = bulletData.ranges[i + 1] || range;
                return (
                  <div key={i} style={tooltipRangeRow}>
                    <span
                      style={{
                        ...tooltipRangeDot,
                        background: rangeColors[i % rangeColors.length],
                      }}
                    />
                    <span style={tooltipRangeLabel}>
                      {bulletData.rangeLabels?.[i] || `Level ${i + 1}`}
                    </span>
                    <span style={tooltipRangeValue}>
                      {range}-{nextRange}
                      {bulletData.unit}
                    </span>
                  </div>
                );
              })}
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
    borderBottom: `2px solid ${performanceColor}`,
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
    minHeight: "400px",
    overflow: "auto",
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
  const checkboxStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
  };
  const rangeColorsBarStyle = {
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
    maxHeight: "400px",
  };
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "12px",
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
    fontSize: "11px",
  };
  const cellInputStyle = {
    padding: "5px 6px",
    background: theme.colors.inputBg,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: "3px",
    color: theme.colors.text.body,
    fontSize: "10px",
    fontFamily: theme.typography.fontFamily.primary,
    width: "60px",
    outline: "none",
    boxSizing: "border-box",
  };
  const buttonStyle = {
    padding: "8px 16px",
    background: "transparent",
    border: `1px solid ${performanceColor}`,
    borderRadius: "3px",
    color: performanceColor,
    cursor: "pointer",
    fontSize: "11px",
    fontFamily: theme.typography.fontFamily.primary,
    fontWeight: 600,
    letterSpacing: "1px",
    textTransform: "uppercase",
  };
  const deleteButtonStyle = {
    padding: "4px 8px",
    background: "transparent",
    border: `1px solid ${theme.colors.status.error}`,
    borderRadius: "3px",
    color: theme.colors.status.error,
    cursor: "pointer",
    fontSize: "9px",
  };
  const tooltipContainerStyle = {
    background: theme.colors.cardBg,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: "4px",
    padding: "14px 16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
    minWidth: "200px",
    maxWidth: "280px",
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
  const tooltipMetricRow = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "4px",
    fontSize: "11px",
  };
  const tooltipMetricLabel = { color: theme.colors.text.muted };
  const tooltipMetricValue = { fontWeight: 700 };
  const tooltipStatusBadge = {
    textAlign: "center",
    padding: "4px 8px",
    borderRadius: "2px",
    fontSize: "9px",
    fontWeight: 700,
    letterSpacing: "2px",
    marginTop: "8px",
    marginBottom: "8px",
  };
  const tooltipRangeContainer = {
    borderTop: `1px solid ${theme.colors.border.light}`,
    paddingTop: "8px",
    marginTop: "4px",
  };
  const tooltipRangeTitle = {
    color: theme.colors.text.muted,
    fontSize: "9px",
    fontWeight: 700,
    letterSpacing: "1px",
    margin: "0 0 6px 0",
  };
  const tooltipRangeRow = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "3px",
    fontSize: "10px",
  };
  const tooltipRangeDot = {
    width: "8px",
    height: "8px",
    borderRadius: "2px",
    flexShrink: 0,
  };
  const tooltipRangeLabel = { color: theme.colors.text.body, flex: 1 };
  const tooltipRangeValue = { color: theme.colors.text.muted };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>🎯</span>
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
              color: performanceColor,
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${performanceColor}50`,
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
            {data.length} METRICS
          </span>
        </div>
      </div>

      {/* CHART DISPLAY */}
      <div id="chart-visual-area" style={chartContainerStyle}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: `${barGap}px`,
            padding: "20px 40px 20px 0",
          }}
        >
          {data.map((bullet, index) => {
            const maxRange = bullet.ranges[bullet.ranges.length - 1] || 100;
            const valuePercent = (bullet.value / maxRange) * 100;
            const targetPercent = (bullet.target / maxRange) * 100;

            return (
              <div
                key={index}
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "120px",
                    textAlign: "right",
                    color: theme.colors.text.body,
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "1px",
                    flexShrink: 0,
                  }}
                >
                  {bullet.label}
                </div>
                <div
                  style={{
                    flex: 1,
                    position: "relative",
                    height: `${barHeight}px`,
                  }}
                >
                  {showRanges && (
                    <div
                      style={{
                        display: "flex",
                        height: "100%",
                        borderRadius: "3px",
                        overflow: "hidden",
                        position: "absolute",
                        width: "100%",
                      }}
                    >
                      {bullet.ranges.map((range, i) => {
                        const startPercent =
                          i === 0 ? 0 : (bullet.ranges[i - 1] / maxRange) * 100;
                        const endPercent = (range / maxRange) * 100;
                        const width = endPercent - startPercent;
                        return (
                          <div
                            key={i}
                            style={{
                              width: `${width}%`,
                              background: rangeColors[i % rangeColors.length],
                              opacity: 0.3,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {showRangeLabels && (
                              <span
                                style={{
                                  color: "#fff",
                                  fontSize: "8px",
                                  fontWeight: 700,
                                  textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                                  letterSpacing: "1px",
                                }}
                              >
                                {bullet.rangeLabels?.[i]}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      transform: "translateY(-50%)",
                      height: `${barHeight * 0.5}px`,
                      width: `${valuePercent}%`,
                      background: performanceColor,
                      borderRadius: "2px",
                      transition: "width 0.5s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      paddingRight: "6px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                      zIndex: 2,
                    }}
                    onMouseEnter={(e) =>
                      setTooltipData({
                        x: e.clientX,
                        y: e.clientY,
                        value: bullet.value,
                        label: bullet.label,
                      })
                    }
                    onMouseLeave={() => setTooltipData(null)}
                  >
                    {showValues && (
                      <span
                        style={{
                          color: "#ffffff",
                          fontSize: "9px",
                          fontWeight: 700,
                          textShadow: "0 1px 1px rgba(0,0,0,0.3)",
                        }}
                      >
                        {bullet.value}
                        {bullet.unit}
                      </span>
                    )}
                  </div>
                  {showTargets && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: `${targetPercent}%`,
                        height: "100%",
                        width: `${targetWidth}px`,
                        background: targetColor,
                        zIndex: 3,
                        borderRadius: "1px",
                        transform: "translateX(-50%)",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "-4px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: 0,
                          height: 0,
                          borderLeft: "5px solid transparent",
                          borderRight: "5px solid transparent",
                          borderTop: `6px solid ${targetColor}`,
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: "-4px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: 0,
                          height: 0,
                          borderLeft: "5px solid transparent",
                          borderRight: "5px solid transparent",
                          borderBottom: `6px solid ${targetColor}`,
                        }}
                      />
                    </div>
                  )}
                </div>
                <div
                  style={{
                    width: "80px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      color: performanceColor,
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    {bullet.value}
                    {bullet.unit}
                  </span>
                  <span
                    style={{
                      color: targetColor,
                      fontSize: "9px",
                      fontWeight: 600,
                    }}
                  >
                    Target: {bullet.target}
                    {bullet.unit}
                  </span>
                </div>
                <div
                  style={{ width: "55px", textAlign: "center", flexShrink: 0 }}
                >
                  <span
                    style={{
                      color:
                        bullet.value >= bullet.target ? "#3fb950" : "#f85149",
                      fontSize: "10px",
                      fontWeight: 700,
                    }}
                  >
                    {((bullet.value / bullet.target) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Tooltip */}
        {tooltipData && (
          <CustomTooltip
            active={true}
            payload={[{ value: tooltipData.value }]}
            label={tooltipData.label}
          />
        )}
      </div>

      {/* CONTROLS */}
      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📊 Bar Color</label>
          <input
            type="color"
            value={performanceColor}
            onChange={(e) => setPerformanceColor(e.target.value)}
            style={{
              width: "40px",
              height: "36px",
              cursor: "pointer",
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: "3px",
              padding: "2px",
            }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎯 Target Color</label>
          <input
            type="color"
            value={targetColor}
            onChange={(e) => setTargetColor(e.target.value)}
            style={{
              width: "40px",
              height: "36px",
              cursor: "pointer",
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: "3px",
              padding: "2px",
            }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎯 Target Style</label>
          <select
            value={targetStyle}
            onChange={(e) => setTargetStyle(e.target.value)}
            style={selectStyle}
          >
            {TARGET_STYLES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Target Width: {targetWidth}px</label>
          <input
            type="range"
            min="1"
            max="8"
            value={targetWidth}
            onChange={(e) => setTargetWidth(Number(e.target.value))}
            style={{ width: "100%", accentColor: targetColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📊 Bar Height: {barHeight}px</label>
          <input
            type="range"
            min="20"
            max="60"
            value={barHeight}
            onChange={(e) => setBarHeight(Number(e.target.value))}
            style={{ width: "100%", accentColor: performanceColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>↔️ Bar Gap: {barGap}px</label>
          <input
            type="range"
            min="5"
            max="40"
            value={barGap}
            onChange={(e) => setBarGap(Number(e.target.value))}
            style={{ width: "100%", accentColor: performanceColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>💬 Show Values</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showValues}
              onChange={(e) => setShowValues(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              On bars
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎯 Show Targets</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showTargets}
              onChange={(e) => setShowTargets(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Marker line
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Show Ranges</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showRanges}
              onChange={(e) => setShowRanges(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Background
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🏷️ Range Labels</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showRangeLabels}
              onChange={(e) => setShowRangeLabels(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              On ranges
            </span>
          </label>
        </div>
      </div>

      {/* RANGE COLORS */}
      <div style={rangeColorsBarStyle}>
        <label style={labelStyle}>🎨 Range Colors (Poor → Excellent)</label>
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "8px",
            flexWrap: "wrap",
          }}
        >
          {rangeColors.map((color, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: "4px" }}
            >
              <input
                type="color"
                value={color}
                onChange={(e) => handleRangeColorChange(i, e.target.value)}
                style={{
                  width: "28px",
                  height: "28px",
                  cursor: "pointer",
                  border: "none",
                  borderRadius: "2px",
                }}
              />
              <span style={{ color: theme.colors.text.muted, fontSize: "9px" }}>
                {DEFAULT_DATA[0]?.rangeLabels?.[i] || `L${i + 1}`}
              </span>
            </div>
          ))}
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
            <button onClick={addBullet} style={buttonStyle}>
              + Add Metric
            </button>
            <button
              onClick={() => setData(DEFAULT_DATA)}
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
                <th style={thStyle}>Metric</th>
                <th style={thStyle}>Value</th>
                <th style={thStyle}>Target</th>
                <th style={thStyle}>% Achieved</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => {
                const achieved = ((row.value / row.target) * 100).toFixed(0);
                const isAchieved = row.value >= row.target;
                return (
                  <React.Fragment key={index}>
                    <tr>
                      <td
                        style={{ ...tdStyle, color: theme.colors.text.muted }}
                      >
                        {index + 1}
                      </td>
                      <td style={tdStyle}>
                        <input
                          type="text"
                          value={row.label}
                          onChange={(e) =>
                            handleLabelChange(index, e.target.value)
                          }
                          style={{ ...cellInputStyle, width: "100px" }}
                        />
                      </td>
                      <td style={tdStyle}>
                        <input
                          type="number"
                          value={row.value}
                          onChange={(e) =>
                            handleValueChange(index, e.target.value)
                          }
                          style={cellInputStyle}
                        />
                      </td>
                      <td style={tdStyle}>
                        <input
                          type="number"
                          value={row.target}
                          onChange={(e) =>
                            handleTargetChange(index, e.target.value)
                          }
                          style={cellInputStyle}
                        />
                      </td>
                      <td
                        style={{
                          ...tdStyle,
                          color: isAchieved ? "#3fb950" : "#f85149",
                          fontWeight: 700,
                        }}
                      >
                        {achieved}%
                      </td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            padding: "2px 6px",
                            borderRadius: "2px",
                            fontSize: "8px",
                            fontWeight: 700,
                            letterSpacing: "1px",
                            background: isAchieved ? "#3fb95020" : "#f8514920",
                            color: isAchieved ? "#3fb950" : "#f85149",
                            border: `1px solid ${isAchieved ? "#3fb950" : "#f85149"}`,
                          }}
                        >
                          {isAchieved ? "✓ MET" : "✗ BELOW"}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => removeBullet(index)}
                          style={deleteButtonStyle}
                          disabled={data.length <= 1}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                    {/* Range Label Editors */}
                    <tr>
                      <td style={tdStyle}></td>
                      <td style={tdStyle} colSpan={6}>
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            flexWrap: "wrap",
                            alignItems: "center",
                          }}
                        >
                          {row.rangeLabels?.map((label, ri) => (
                            <div
                              key={ri}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "3px",
                              }}
                            >
                              <span
                                style={{
                                  width: "8px",
                                  height: "8px",
                                  background:
                                    rangeColors[ri % rangeColors.length],
                                  borderRadius: "1px",
                                  display: "inline-block",
                                }}
                              />
                              <input
                                type="text"
                                value={label}
                                onChange={(e) =>
                                  handleRangeLabelChange(
                                    index,
                                    ri,
                                    e.target.value,
                                  )
                                }
                                style={{
                                  ...cellInputStyle,
                                  width: "60px",
                                  fontSize: "8px",
                                  padding: "3px 4px",
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BulletChartComponent;

