import React, { useState, useCallback, useMemo } from "react";
import { theme } from "../../../styles/theme";

const DEFAULT_DATA = {
  "Group A": [12, 15, 18, 22, 25, 28, 30, 35, 38, 42, 45, 48],
  "Group B": [8, 10, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35],
  "Group C": [20, 22, 25, 28, 30, 32, 35, 38, 40, 42, 45, 50],
  "Group D": [5, 8, 10, 12, 15, 18, 20, 22, 25, 28, 30, 35],
};

const BoxChartComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#d29922",
}) => {
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Box Plot");
  const [boxColor, setBoxColor] = useState(chartColor);
  const [showOutliers, setShowOutliers] = useState(true);
  const [showValues, setShowValues] = useState(true);
  const [animation, setAnimation] = useState(true);

  const boxStats = useMemo(() => {
    return Object.entries(data).map(([label, values]) => {
      const sorted = [...values].sort((a, b) => a - b);
      const n = sorted.length;
      const min = sorted[0],
        max = sorted[n - 1];
      const q1 = sorted[Math.floor(n / 4)],
        median =
          n % 2 === 0
            ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
            : sorted[Math.floor(n / 2)];
      const q3 = sorted[Math.floor((3 * n) / 4)],
        iqr = q3 - q1;
      const lowerFence = q1 - 1.5 * iqr,
        upperFence = q3 + 1.5 * iqr;
      const outliers = sorted.filter((v) => v < lowerFence || v > upperFence);
      const whiskerLow = Math.max(min, lowerFence),
        whiskerHigh = Math.min(max, upperFence);
      return {
        label,
        min,
        max,
        q1,
        median,
        q3,
        iqr,
        lowerFence,
        upperFence,
        outliers,
        whiskerLow,
        whiskerHigh,
      };
    });
  }, [data]);

  const globalMin = useMemo(
    () => Math.min(...boxStats.map((s) => s.whiskerLow)),
    [boxStats],
  );
  const globalMax = useMemo(
    () => Math.max(...boxStats.map((s) => s.whiskerHigh)),
    [boxStats],
  );

  const handleValueChange = useCallback((group, index, newVal) => {
    setData((prev) => {
      const updated = { ...prev };
      updated[group] = [...updated[group]];
      updated[group][index] = Number(newVal) || 0;
      return updated;
    });
  }, []);
  const addValue = useCallback((group) => {
    setData((prev) => {
      const updated = { ...prev };
      updated[group] = [...updated[group], Math.floor(Math.random() * 40) + 10];
      return updated;
    });
  }, []);
  const removeValue = useCallback((group, index) => {
    setData((prev) => {
      const updated = { ...prev };
      updated[group] = updated[group].filter((_, i) => i !== index);
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
    borderBottom: `2px solid ${boxColor}`,
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
    minHeight: "420px",
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
  const cellInputStyle = (w = "45px") => ({
    padding: "3px 4px",
    background: theme.colors.inputBg,
    border: "1px solid #30363d",
    borderRadius: "2px",
    color: theme.colors.text.body,
    fontSize: "9px",
    fontFamily: theme.typography.fontFamily.primary,
    width: w,
    outline: "none",
    boxSizing: "border-box",
  });
  const buttonStyle = (c = boxColor) => ({
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
          <span style={{ fontSize: "28px" }}>📦</span>
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
              color: boxColor,
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${boxColor}50`,
              borderRadius: "3px",
              fontWeight: 600,
            }}
          >
            DISTRIBUTION
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
            {Object.keys(data).length} GROUPS
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            padding: "20px 40px",
          }}
        >
          {boxStats.map((stat, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: "12px" }}
            >
              <div
                style={{
                  width: "80px",
                  textAlign: "right",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#0d1117",
                }}
              >
                {stat.label}
              </div>
              <div style={{ flex: 1, position: "relative", height: "40px" }}>
                <svg width="100%" height="40">
                  <line
                    x1={`${((stat.whiskerLow - globalMin) / (globalMax - globalMin)) * 100}%`}
                    y1="20"
                    x2={`${((stat.whiskerHigh - globalMin) / (globalMax - globalMin)) * 100}%`}
                    y2="20"
                    stroke="#8b949e"
                    strokeWidth="1.5"
                  />
                  <line
                    x1={`${((stat.whiskerLow - globalMin) / (globalMax - globalMin)) * 100}%`}
                    y1="10"
                    x2={`${((stat.whiskerLow - globalMin) / (globalMax - globalMin)) * 100}%`}
                    y2="30"
                    stroke="#8b949e"
                    strokeWidth="1.5"
                  />
                  <line
                    x1={`${((stat.whiskerHigh - globalMin) / (globalMax - globalMin)) * 100}%`}
                    y1="10"
                    x2={`${((stat.whiskerHigh - globalMin) / (globalMax - globalMin)) * 100}%`}
                    y2="30"
                    stroke="#8b949e"
                    strokeWidth="1.5"
                  />
                  <rect
                    x={`${((stat.q1 - globalMin) / (globalMax - globalMin)) * 100}%`}
                    y="5"
                    width={`${((stat.q3 - stat.q1) / (globalMax - globalMin)) * 100}%`}
                    height="30"
                    fill={boxColor}
                    opacity="0.3"
                    stroke={boxColor}
                    strokeWidth="2"
                    rx="2"
                  />
                  <line
                    x1={`${((stat.median - globalMin) / (globalMax - globalMin)) * 100}%`}
                    y1="5"
                    x2={`${((stat.median - globalMin) / (globalMax - globalMin)) * 100}%`}
                    y2="35"
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  {showOutliers &&
                    stat.outliers.map((o, j) => (
                      <circle
                        key={j}
                        cx={`${((o - globalMin) / (globalMax - globalMin)) * 100}%`}
                        cy="20"
                        r="4"
                        fill="#f85149"
                        stroke="#fff"
                        strokeWidth="1"
                      >
                        <title>Outlier: {o}</title>
                      </circle>
                    ))}
                </svg>
              </div>
              {showValues && (
                <div
                  style={{ width: "120px", fontSize: "9px", color: "#8b949e" }}
                >
                  Q1:{stat.q1.toFixed(1)} M:{stat.median.toFixed(1)} Q3:
                  {stat.q3.toFixed(1)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Box Color</label>
          <input
            type="color"
            value={boxColor}
            onChange={(e) => setBoxColor(e.target.value)}
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
          <label style={labelStyle}>⚠ Show Outliers</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showOutliers}
              onChange={(e) => setShowOutliers(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>Red dots</span>
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
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>
              Statistics
            </span>
          </label>
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
          border: "1px solid #30363d",
          fontSize: "10px",
        }}
      >
        {boxStats.map((stat, i) => (
          <span key={i} style={{ color: "#8b949e" }}>
            {stat.label}:{" "}
            <strong style={{ color: boxColor }}>
              M:{stat.median.toFixed(1)}
            </strong>{" "}
            IQR:{stat.iqr.toFixed(1)}
          </span>
        ))}
      </div>

      <div id="chart-data-table">
        {Object.entries(data).map(([group, values]) => (
          <div
            key={group}
            style={{
              marginBottom: "12px",
              background: theme.colors.cardBg,
              padding: "10px 14px",
              borderRadius: "4px",
              border: `1px solid #30363d`,
              borderLeft: `3px solid ${boxColor}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "6px",
              }}
            >
              <span
                style={{ color: boxColor, fontSize: "11px", fontWeight: 700 }}
              >
                {group}
              </span>
              <button onClick={() => addValue(group)} style={buttonStyle()}>
                + Value
              </button>
            </div>
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
              {values.map((v, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: "2px" }}
                >
                  <input
                    type="number"
                    value={v}
                    onChange={(e) =>
                      handleValueChange(group, i, e.target.value)
                    }
                    style={cellInputStyle("42px")}
                  />
                  <button
                    onClick={() => removeValue(group, i)}
                    style={{
                      padding: "1px 3px",
                      background: "transparent",
                      border: "1px solid #f85149",
                      borderRadius: "2px",
                      color: "#f85149",
                      cursor: "pointer",
                      fontSize: "7px",
                    }}
                    disabled={values.length <= 4}
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

export default BoxChartComponent;
