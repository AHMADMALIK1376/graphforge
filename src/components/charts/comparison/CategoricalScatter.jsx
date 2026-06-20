import React, { useState, useCallback, useMemo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  Cell,
  Legend,
  ReferenceLine,
} from "recharts";
import { theme } from "../../../styles/theme";

// ============================================
// DEFAULT DATA
// ============================================
const DEFAULT_DATA = [
  {
    category: "Group A",
    values: [45, 55, 48, 52, 58, 42, 50, 60, 47, 53, 49, 57],
  },
  {
    category: "Group B",
    values: [30, 35, 38, 42, 45, 28, 33, 40, 36, 44, 32, 39],
  },
  {
    category: "Group C",
    values: [65, 70, 72, 68, 75, 62, 78, 66, 73, 69, 71, 64],
  },
  {
    category: "Group D",
    values: [20, 25, 22, 28, 30, 18, 24, 26, 21, 29, 23, 27],
  },
  {
    category: "Group E",
    values: [80, 85, 82, 88, 90, 78, 84, 86, 81, 89, 83, 87],
  },
];

// ============================================
// SUMMARY STATISTICS OPTIONS
// ============================================
const SUMMARY_OPTIONS = [
  { name: "Mean", value: "mean", icon: "─" },
  { name: "Median", value: "median", icon: "---" },
  { name: "Quartiles", value: "quartiles", icon: "┊" },
  { name: "None", value: "none", icon: "" },
];

// ============================================
// DOT SHAPES
// ============================================
const DOT_SHAPES = [
  { name: "Circle", value: "circle" },
  { name: "Diamond", value: "diamond" },
  { name: "Square", value: "square" },
  { name: "Triangle", value: "triangle" },
];

// ============================================
// JITTER MODES
// ============================================
const JITTER_MODES = [
  { name: "Random", value: "random" },
  { name: "Beeswarm", value: "beeswarm" },
  { name: "Stacked", value: "stacked" },
  { name: "None", value: "none" },
];

// ============================================
// MAIN COMPONENT
// ============================================
const CategoricalScatterComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#58a6ff",
}) => {
  // ===== STATE =====
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Categorical Scatter Plot");
  const [categoryColors, setCategoryColors] = useState([
    "#58a6ff",
    "#f85149",
    "#3fb950",
    "#d29922",
    "#a371f7",
  ]);
  const [dotSize, setDotSize] = useState(8);
  const [dotShape, setDotShape] = useState("circle");
  const [dotOpacity, setDotOpacity] = useState(0.8);
  const [jitterMode, setJitterMode] = useState("random");
  const [jitterAmount, setJitterAmount] = useState(0.3);
  const [summaryType, setSummaryType] = useState("mean");
  const [showSummary, setShowSummary] = useState(true);
  const [showIndividual, setShowIndividual] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showViolin, setShowViolin] = useState(false);
  const [gridColor, setGridColor] = useState("#30363d");
  const [highlightOutliers, setHighlightOutliers] = useState(false);
  const [animation, setAnimation] = useState(true);
  const [sortCategories, setSortCategories] = useState("none");

  // ===== DERIVED =====
  const sortedCategories = useMemo(() => {
    const sorted = [...data];
    switch (sortCategories) {
      case "asc":
        sorted.sort((a, b) => {
          const avgA = a.values.reduce((s, v) => s + v, 0) / a.values.length;
          const avgB = b.values.reduce((s, v) => s + v, 0) / b.values.length;
          return avgA - avgB;
        });
        break;
      case "desc":
        sorted.sort((a, b) => {
          const avgA = a.values.reduce((s, v) => s + v, 0) / a.values.length;
          const avgB = b.values.reduce((s, v) => s + v, 0) / b.values.length;
          return avgB - avgA;
        });
        break;
      case "alpha":
        sorted.sort((a, b) => a.category.localeCompare(b.category));
        break;
      default:
        break;
    }
    return sorted;
  }, [data, sortCategories]);

  const categoryStats = useMemo(() => {
    return sortedCategories.map((cat, ci) => {
      const vals = cat.values.sort((a, b) => a - b);
      const n = vals.length;
      const sum = vals.reduce((s, v) => s + v, 0);
      const mean = sum / n;
      const median =
        n % 2 === 0
          ? (vals[n / 2 - 1] + vals[n / 2]) / 2
          : vals[Math.floor(n / 2)];
      const q1 = vals[Math.floor(n / 4)];
      const q3 = vals[Math.floor((3 * n) / 4)];
      const iqr = q3 - q1;
      const lowerFence = q1 - 1.5 * iqr;
      const upperFence = q3 + 1.5 * iqr;
      const outliers = vals.filter((v) => v < lowerFence || v > upperFence);
      const min = vals[0];
      const max = vals[n - 1];
      return { ci, mean, median, q1, q3, iqr, outliers, min, max, n, sum };
    });
  }, [sortedCategories]);

  const globalMax = useMemo(() => {
    let max = 10;
    sortedCategories.forEach((cat) => {
      cat.values.forEach((v) => {
        if (v > max) max = v;
      });
    });
    return Math.ceil(max / 10) * 10;
  }, [sortedCategories]);

  const scatterData = useMemo(() => {
    const points = [];
    sortedCategories.forEach((cat, catIndex) => {
      cat.values.forEach((value, valIndex) => {
        let jitterOffset = 0;
        if (jitterMode === "random") {
          jitterOffset = (Math.random() - 0.5) * jitterAmount * 2;
        } else if (jitterMode === "beeswarm") {
          const sameValues = cat.values.filter(
            (v) => Math.abs(v - value) < jitterAmount * 5,
          ).length;
          jitterOffset =
            (valIndex % Math.max(sameValues, 1)) * 0.1 * jitterAmount -
            sameValues * 0.05;
        } else if (jitterMode === "stacked") {
          jitterOffset = (valIndex % 5) * 0.15 - 0.3;
        }
        points.push({
          x: catIndex + jitterOffset,
          y: value,
          category: cat.category,
          catIndex,
          value,
          valIndex,
        });
      });
    });
    return points;
  }, [sortedCategories, jitterMode, jitterAmount]);

  const handleValueChange = useCallback(
    (catIndex, valIndex, newValue) => {
      setData((prev) => {
        const updated = [...prev];
        const actualIndex = sortedCategories[catIndex]
          ? prev.findIndex(
              (d) => d.category === sortedCategories[catIndex].category,
            )
          : catIndex;
        if (actualIndex !== -1) {
          const newValues = [...updated[actualIndex].values];
          newValues[valIndex] = Number(newValue) || 0;
          updated[actualIndex] = { ...updated[actualIndex], values: newValues };
        }
        return updated;
      });
    },
    [sortedCategories],
  );

  const handleCategoryRename = useCallback(
    (catIndex, newName) => {
      setData((prev) => {
        const updated = [...prev];
        const actualIndex = sortedCategories[catIndex]
          ? prev.findIndex(
              (d) => d.category === sortedCategories[catIndex].category,
            )
          : catIndex;
        if (actualIndex !== -1) {
          updated[actualIndex] = { ...updated[actualIndex], category: newName };
        }
        return updated;
      });
    },
    [sortedCategories],
  );

  const addValue = useCallback(
    (catIndex) => {
      setData((prev) => {
        const updated = [...prev];
        const actualIndex = sortedCategories[catIndex]
          ? prev.findIndex(
              (d) => d.category === sortedCategories[catIndex].category,
            )
          : catIndex;
        if (actualIndex !== -1) {
          const avg =
            updated[actualIndex].values.reduce((s, v) => s + v, 0) /
            updated[actualIndex].values.length;
          updated[actualIndex] = {
            ...updated[actualIndex],
            values: [
              ...updated[actualIndex].values,
              Math.round(avg) + Math.floor(Math.random() * 10) - 5,
            ],
          };
        }
        return updated;
      });
    },
    [sortedCategories],
  );

  const removeValue = useCallback(
    (catIndex, valIndex) => {
      setData((prev) => {
        const updated = [...prev];
        const actualIndex = sortedCategories[catIndex]
          ? prev.findIndex(
              (d) => d.category === sortedCategories[catIndex].category,
            )
          : catIndex;
        if (actualIndex !== -1) {
          updated[actualIndex] = {
            ...updated[actualIndex],
            values: updated[actualIndex].values.filter(
              (_, i) => i !== valIndex,
            ),
          };
        }
        return updated;
      });
    },
    [sortedCategories],
  );

  const addCategory = useCallback(() => {
    const newCat = `Group ${String.fromCharCode(65 + data.length)}`;
    const newValues = Array.from(
      { length: 8 },
      () => Math.floor(Math.random() * 60) + 20,
    );
    setData((prev) => [...prev, { category: newCat, values: newValues }]);
  }, [data]);

  const removeCategory = useCallback(
    (catIndex) => {
      setData((prev) => {
        const actualIndex = sortedCategories[catIndex]
          ? prev.findIndex(
              (d) => d.category === sortedCategories[catIndex].category,
            )
          : catIndex;
        return prev.filter((_, i) => i !== actualIndex);
      });
    },
    [sortedCategories],
  );

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    const color = categoryColors[payload.catIndex % categoryColors.length];
    const isOutlier =
      highlightOutliers &&
      categoryStats[payload.catIndex]?.outliers.includes(payload.value);
    const finalColor = isOutlier ? "#f85149" : color;
    const finalSize = isOutlier ? dotSize + 3 : dotSize;
    const shape = dotShape;

    const commonProps = {
      fill: finalColor,
      fillOpacity: isOutlier ? 1 : dotOpacity,
      stroke: finalColor,
      strokeWidth: 1,
      style: {
        cursor: "pointer",
        transition: "all 0.2s ease",
        filter: isOutlier
          ? `drop-shadow(0 0 ${finalSize}px ${finalColor})`
          : "none",
      },
    };

    switch (shape) {
      case "diamond":
        return (
          <polygon
            points={`${cx},${cy - finalSize} ${cx + finalSize},${cy} ${cx},${cy + finalSize} ${cx - finalSize},${cy}`}
            {...commonProps}
          />
        );
      case "square":
        return (
          <rect
            x={cx - finalSize}
            y={cy - finalSize}
            width={finalSize * 2}
            height={finalSize * 2}
            rx={2}
            {...commonProps}
          />
        );
      case "triangle":
        return (
          <polygon
            points={`${cx},${cy - finalSize} ${cx + finalSize},${cy + finalSize} ${cx - finalSize},${cy + finalSize}`}
            {...commonProps}
          />
        );
      default:
        return (
          <g>
            <circle
              cx={cx}
              cy={cy}
              r={finalSize + 2}
              fill={finalColor}
              opacity={0.15}
            />
            <circle cx={cx} cy={cy} r={finalSize} {...commonProps} />
            {finalSize > 5 && (
              <circle
                cx={cx - finalSize * 0.2}
                cy={cy - finalSize * 0.2}
                r={finalSize * 0.25}
                fill="rgba(255,255,255,0.4)"
              />
            )}
          </g>
        );
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const pt = payload[0]?.payload;
      if (!pt) return null;
      const stats = categoryStats[pt.catIndex];
      const isOutlier = highlightOutliers && stats?.outliers.includes(pt.value);
      return (
        <div style={tooltipContainerStyle}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "6px",
            }}
          >
            <span
              style={{
                ...tooltipColorDot,
                background: categoryColors[pt.catIndex % categoryColors.length],
              }}
            />
            <span style={tooltipLabelStyle}>{pt.category}</span>
          </div>
          <div style={tooltipValueRow}>
            <span style={tooltipValueLabel}>Value:</span>
            <span
              style={{
                ...tooltipValue,
                color: isOutlier ? "#f85149" : "#f0f6fc",
              }}
            >
              {pt.value}
              {isOutlier ? " ⚠" : ""}
            </span>
          </div>
          {stats && (
            <>
              <div style={tooltipDivider} />
              <div style={tooltipValueRow}>
                <span style={tooltipValueLabel}>Mean:</span>
                <span style={tooltipStat}>{stats.mean.toFixed(1)}</span>
              </div>
              <div style={tooltipValueRow}>
                <span style={tooltipValueLabel}>Median:</span>
                <span style={tooltipStat}>{stats.median.toFixed(1)}</span>
              </div>
              <div style={tooltipValueRow}>
                <span style={tooltipValueLabel}>Min:</span>
                <span style={tooltipStat}>{stats.min}</span>
              </div>
              <div style={tooltipValueRow}>
                <span style={tooltipValueLabel}>Max:</span>
                <span style={tooltipStat}>{stats.max}</span>
              </div>
              <div style={tooltipValueRow}>
                <span style={tooltipValueLabel}>Count:</span>
                <span style={tooltipStat}>{stats.n}</span>
              </div>
            </>
          )}
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
    borderBottom: `2px solid ${chartColor}`,
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
    padding: "24px 16px",
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
  const groupCardStyle = (color) => ({
    background: theme.colors.cardBg,
    borderRadius: "4px",
    border: `1px solid ${theme.colors.border.default}`,
    borderLeft: `3px solid ${color}`,
    padding: "10px 12px",
    marginBottom: "8px",
  });
  const cellInputStyle = (width = "55px") => ({
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
    minWidth: "150px",
  };
  const tooltipColorDot = {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    display: "inline-block",
  };
  const tooltipLabelStyle = {
    color: "#f0f6fc",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1px",
  };
  const tooltipValueRow = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "3px",
  };
  const tooltipValueLabel = { color: "#8b949e", fontSize: "10px" };
  const tooltipValue = { fontSize: "14px", fontWeight: 700 };
  const tooltipStat = { color: "#c9d1d9", fontSize: "10px", fontWeight: 600 };
  const tooltipDivider = { borderTop: "1px solid #21262d", margin: "6px 0" };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>⚫</span>
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
              color: "#8b949e",
              fontSize: "10px",
              padding: "4px 10px",
              border: "1px solid #30363d",
              borderRadius: "3px",
              letterSpacing: "1px",
            }}
          >
            {sortedCategories.length} GROUPS
          </span>
        </div>
      </div>

      {/* CHART DISPLAY */}
      <div id="chart-visual-area" style={chartContainerStyle}>
        <ResponsiveContainer width="100%" height={440}>
          <ScatterChart margin={{ top: 25, right: 25, left: 10, bottom: 20 }}>
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            )}
            <XAxis
              type="number"
              dataKey="x"
              domain={[-0.5, sortedCategories.length - 0.5]}
              ticks={sortedCategories.map((_, i) => i)}
              tickFormatter={(i) => sortedCategories[i]?.category || ""}
              tick={{ fill: "#8b949e", fontSize: 10, fontWeight: 600 }}
              axisLine={{ stroke: "#30363d" }}
            />
            <YAxis
              type="number"
              dataKey="y"
              tick={{ fill: "#8b949e", fontSize: 10 }}
              axisLine={{ stroke: "#30363d" }}
              domain={[0, globalMax + Math.ceil(globalMax * 0.1)]}
            />
            <ZAxis range={[dotSize * 5, dotSize * 5]} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ strokeDasharray: "3 3" }}
            />
            {showSummary &&
              summaryType !== "none" &&
              categoryStats.map((stat, i) => (
                <g key={`summary-${i}`}>
                  {summaryType === "mean" && (
                    <ReferenceLine
                      x={i}
                      stroke={categoryColors[i % categoryColors.length]}
                      strokeWidth={3}
                      strokeDasharray="none"
                      opacity={0.6}
                      segment={[
                        { x: i - 0.25, y: stat.mean },
                        { x: i + 0.25, y: stat.mean },
                      ]}
                    />
                  )}
                  {summaryType === "median" && (
                    <ReferenceLine
                      x={i}
                      stroke={categoryColors[i % categoryColors.length]}
                      strokeWidth={2}
                      strokeDasharray="6 3"
                      opacity={0.5}
                      segment={[
                        { x: i - 0.3, y: stat.median },
                        { x: i + 0.3, y: stat.median },
                      ]}
                    />
                  )}
                  {summaryType === "quartiles" && (
                    <>
                      <ReferenceLine
                        x={i}
                        stroke={categoryColors[i % categoryColors.length]}
                        strokeWidth={4}
                        opacity={0.5}
                        segment={[
                          { x: i - 0.15, y: stat.q1 },
                          { x: i + 0.15, y: stat.q1 },
                        ]}
                      />
                      <ReferenceLine
                        x={i}
                        stroke={categoryColors[i % categoryColors.length]}
                        strokeWidth={2}
                        opacity={0.4}
                        segment={[
                          { x: i - 0.2, y: stat.median },
                          { x: i + 0.2, y: stat.median },
                        ]}
                      />
                      <ReferenceLine
                        x={i}
                        stroke={categoryColors[i % categoryColors.length]}
                        strokeWidth={4}
                        opacity={0.5}
                        segment={[
                          { x: i - 0.15, y: stat.q3 },
                          { x: i + 0.15, y: stat.q3 },
                        ]}
                      />
                    </>
                  )}
                </g>
              ))}
            {showIndividual && (
              <Scatter
                data={scatterData}
                shape={<CustomDot />}
                isAnimationActive={animation}
                animationDuration={500}
              >
                {scatterData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      categoryColors[entry.catIndex % categoryColors.length]
                    }
                  />
                ))}
              </Scatter>
            )}
            <Legend
              payload={sortedCategories.map((cat, i) => ({
                value: cat.category,
                type: "circle",
                color: categoryColors[i % categoryColors.length],
              }))}
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
            gap: "16px",
            marginTop: "8px",
            flexWrap: "wrap",
            fontSize: "9px",
          }}
        >
          {showSummary && summaryType === "mean" && (
            <span style={{ color: "#8b949e" }}>━ Mean</span>
          )}
          {showSummary && summaryType === "median" && (
            <span style={{ color: "#8b949e" }}>- - Median</span>
          )}
          {showSummary && summaryType === "quartiles" && (
            <span style={{ color: "#8b949e" }}>━ Q1/Q3 | - - Median</span>
          )}
        </div>

        {/* Violin Plot Overlay */}
        {showViolin && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "16px",
              padding: "12px",
              background: "#f8f9fa",
              borderRadius: "6px",
            }}
          >
            {categoryStats.map((stat, i) => (
              <div key={i} style={{ textAlign: "center", fontSize: "10px" }}>
                <div
                  style={{
                    fontWeight: 700,
                    color: categoryColors[i],
                    marginBottom: "4px",
                  }}
                >
                  {sortedCategories[i].category}
                </div>
                <div
                  style={{
                    width: "30px",
                    height: "50px",
                    background: `${categoryColors[i]}15`,
                    borderRadius: "15px",
                    margin: "0 auto",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: `${((stat.q3 - stat.q1) / (globalMax || 1)) * 100}%`,
                      background: categoryColors[i],
                      borderRadius: "15px",
                      opacity: 0.5,
                    }}
                  />
                </div>
                <div style={{ color: "#8b949e", marginTop: "4px" }}>
                  IQR: {stat.iqr.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CONTROLS */}
      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔷 Dot Shape</label>
          <select
            value={dotShape}
            onChange={(e) => setDotShape(e.target.value)}
            style={selectStyle}
          >
            {DOT_SHAPES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>〰️ Jitter Mode</label>
          <select
            value={jitterMode}
            onChange={(e) => setJitterMode(e.target.value)}
            style={selectStyle}
          >
            {JITTER_MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📊 Summary</label>
          <select
            value={summaryType}
            onChange={(e) => setSummaryType(e.target.value)}
            style={selectStyle}
          >
            {SUMMARY_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📊 Sort</label>
          <select
            value={sortCategories}
            onChange={(e) => setSortCategories(e.target.value)}
            style={selectStyle}
          >
            <option value="none">Default</option>
            <option value="asc">Mean ↑</option>
            <option value="desc">Mean ↓</option>
            <option value="alpha">Alphabetical</option>
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Dot Size: {dotSize}px</label>
          <input
            type="range"
            min="3"
            max="16"
            value={dotSize}
            onChange={(e) => setDotSize(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>〰️ Jitter: {jitterAmount.toFixed(1)}</label>
          <input
            type="range"
            min="0"
            max="0.6"
            step="0.05"
            value={jitterAmount}
            onChange={(e) => setJitterAmount(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>👁️ Dot Opacity: {dotOpacity}</label>
          <input
            type="range"
            min="0.3"
            max="1"
            step="0.05"
            value={dotOpacity}
            onChange={(e) => setDotOpacity(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>⚫ Show Points</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showIndividual}
              onChange={(e) => setShowIndividual(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>
              Individual dots
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📊 Show Summary</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showSummary}
              onChange={(e) => setShowSummary(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>
              Statistics lines
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>⚠ Highlight Outliers</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={highlightOutliers}
              onChange={(e) => setHighlightOutliers(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>
              Mark outliers
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎻 Show Violin</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showViolin}
              onChange={(e) => setShowViolin(e.target.checked)}
              style={{ accentColor: chartColor }}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Violin overlay
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔲 Grid Color</label>
          <input
            type="color"
            value={gridColor}
            onChange={(e) => setGridColor(e.target.value)}
            style={{
              width: "32px",
              height: "28px",
              cursor: "pointer",
              border: "1px solid #30363d",
              borderRadius: "3px",
              padding: "2px",
            }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔲 Grid</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>
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
            />
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>Animate</span>
          </label>
        </div>
      </div>

      {/* CATEGORY COLORS */}
      <div style={statsCardStyle}>
        <label style={labelStyle}>🎨 Category Colors</label>
        <div
          style={{
            display: "flex",
            gap: "6px",
            marginTop: "6px",
            flexWrap: "wrap",
          }}
        >
          {sortedCategories.map((cat, i) => (
            <input
              key={i}
              type="color"
              value={categoryColors[i] || "#58a6ff"}
              onChange={(e) => {
                const updated = [...categoryColors];
                updated[i] = e.target.value;
                setCategoryColors(updated);
              }}
              title={cat.category}
              style={{
                width: "24px",
                height: "24px",
                cursor: "pointer",
                border: "none",
                borderRadius: "2px",
              }}
            />
          ))}
        </div>
      </div>

      {/* STATISTICS CARDS */}
      <div style={statsCardStyle}>
        <label style={labelStyle}>📊 Group Statistics</label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(sortedCategories.length, 5)}, 1fr)`,
            gap: "8px",
            marginTop: "8px",
            fontSize: "10px",
          }}
        >
          {categoryStats.map((stat, i) => (
            <div
              key={i}
              style={{
                padding: "8px",
                background: "#0d1117",
                borderRadius: "3px",
                borderLeft: `3px solid ${categoryColors[i]}`,
              }}
            >
              <div
                style={{
                  color: categoryColors[i],
                  fontWeight: 700,
                  fontSize: "10px",
                  marginBottom: "4px",
                }}
              >
                {sortedCategories[i].category}
              </div>
              <div style={{ color: "#8b949e" }}>
                n: <strong style={{ color: "#c9d1d9" }}>{stat.n}</strong>
              </div>
              <div style={{ color: "#8b949e" }}>
                Mean:{" "}
                <strong style={{ color: "#c9d1d9" }}>
                  {stat.mean.toFixed(1)}
                </strong>
              </div>
              <div style={{ color: "#8b949e" }}>
                Median:{" "}
                <strong style={{ color: "#c9d1d9" }}>
                  {stat.median.toFixed(1)}
                </strong>
              </div>
              <div style={{ color: "#8b949e" }}>
                IQR:{" "}
                <strong style={{ color: "#c9d1d9" }}>
                  {stat.iqr.toFixed(1)}
                </strong>
              </div>
              <div style={{ color: "#8b949e" }}>
                Range:{" "}
                <strong style={{ color: "#c9d1d9" }}>
                  {stat.min}-{stat.max}
                </strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DATA EDITOR */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <label style={labelStyle}>📋 Data Groups</label>
          <button onClick={addCategory} style={buttonStyle()}>
            + Add Group
          </button>
        </div>
        {sortedCategories.map((cat, catIndex) => (
          <div
            key={catIndex}
            style={groupCardStyle(
              categoryColors[catIndex % categoryColors.length],
            )}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <span
                  style={{
                    color: categoryColors[catIndex % categoryColors.length],
                    fontSize: "14px",
                  }}
                >
                  ●
                </span>
                <input
                  type="text"
                  value={cat.category}
                  onChange={(e) =>
                    handleCategoryRename(catIndex, e.target.value)
                  }
                  style={{
                    ...cellInputStyle("100px"),
                    fontWeight: 700,
                    color: categoryColors[catIndex % categoryColors.length],
                  }}
                />
                <span style={{ color: "#484f58", fontSize: "9px" }}>
                  ({cat.values.length} pts)
                </span>
              </div>
              <div style={{ display: "flex", gap: "4px" }}>
                <button
                  onClick={() => addValue(catIndex)}
                  style={{
                    ...buttonStyle(
                      categoryColors[catIndex % categoryColors.length],
                    ),
                    fontSize: "8px",
                    padding: "3px 8px",
                  }}
                >
                  + Pt
                </button>
                <button
                  onClick={() => removeCategory(catIndex)}
                  style={deleteBtnStyle}
                  disabled={sortedCategories.length <= 2}
                >
                  ×
                </button>
              </div>
            </div>
            <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
              {cat.values.map((val, valIndex) => (
                <div
                  key={valIndex}
                  style={{ display: "flex", alignItems: "center", gap: "1px" }}
                >
                  <input
                    type="number"
                    value={val}
                    onChange={(e) =>
                      handleValueChange(catIndex, valIndex, e.target.value)
                    }
                    style={{ ...cellInputStyle("42px"), fontSize: "9px" }}
                  />
                  <button
                    onClick={() => removeValue(catIndex, valIndex)}
                    style={{
                      ...deleteBtnStyle,
                      fontSize: "6px",
                      padding: "1px 3px",
                    }}
                    disabled={cat.values.length <= 2}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoricalScatterComponent;

