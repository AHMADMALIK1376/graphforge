import React, { useState, useCallback, useMemo } from "react";
import { theme } from "../../../styles/theme";

const DEFAULT_DATA = {
  "Group A": [12, 15, 18, 18, 22, 25, 25, 28, 30, 35, 38, 42],
  "Group B": [8, 10, 12, 12, 15, 15, 18, 20, 22, 25, 28, 30],
  "Group C": [25, 28, 30, 32, 35, 35, 38, 40, 42, 45, 48, 52],
  "Group D": [5, 8, 8, 10, 12, 15, 18, 20, 22, 25, 28, 32],
};

const ViolinPlotComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#d29922",
}) => {
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Violin Plot");
  const [violinColor, setViolinColor] = useState(chartColor);
  const [showPoints, setShowPoints] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [animation, setAnimation] = useState(true);

  const violinStats = useMemo(() => {
    return Object.entries(data).map(([label, values]) => {
      const sorted = [...values].sort((a, b) => a - b);
      const n = sorted.length;
      const sum = sorted.reduce((s, v) => s + v, 0);
      const mean = sum / n;
      const median =
        n % 2 === 0
          ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
          : sorted[Math.floor(n / 2)];
      const q1 = sorted[Math.floor(n / 4)],
        q3 = sorted[Math.floor((3 * n) / 4)];
      return {
        label,
        mean,
        median,
        q1,
        q3,
        iqr: q3 - q1,
        min: sorted[0],
        max: sorted[n - 1],
        n,
      };
    });
  }, [data]);

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
    borderBottom: `2px solid ${violinColor}`,
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
  const buttonStyle = (c = violinColor) => ({
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
          <span style={{ fontSize: "28px" }}>🎻</span>
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
              color: violinColor,
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${violinColor}50`,
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
            justifyContent: "space-around",
            alignItems: "flex-end",
            height: "350px",
            padding: "20px 0",
          }}
        >
          {violinStats.map((stat, i) => {
            const maxVal = Math.max(...Object.values(data).flat());
            const minVal = Math.min(...Object.values(data).flat());
            const range = maxVal - minVal || 1;
            const height = 280;
            const width = 80;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: `${width}px`,
                    height: `${height}px`,
                  }}
                >
                  <svg width={width} height={height}>
                    <ellipse
                      cx={width / 2}
                      cy={height - ((stat.median - minVal) / range) * height}
                      rx={width / 3}
                      ry={8}
                      fill="#fff"
                      stroke="#0d1117"
                      strokeWidth="2"
                    />
                    <ellipse
                      cx={width / 2}
                      cy={height / 2}
                      rx={width / 2}
                      ry={height / 2}
                      fill={violinColor}
                      opacity="0.25"
                      stroke={violinColor}
                      strokeWidth="2"
                    />
                    <ellipse
                      cx={width / 2}
                      cy={height - ((stat.q3 - minVal) / range) * height}
                      rx={width / 4}
                      ry={(height * ((stat.q3 - stat.q1) / range)) / 2}
                      fill={violinColor}
                      opacity="0.5"
                      stroke={violinColor}
                      strokeWidth="1.5"
                    />
                    <ellipse
                      cx={width / 2}
                      cy={height - ((stat.mean - minVal) / range) * height}
                      rx={4}
                      ry={4}
                      fill="#fff"
                      stroke="#f85149"
                      strokeWidth="2"
                    />
                  </svg>
                  {showPoints &&
                    data[stat.label]
                      ?.slice(0, 20)
                      .map((v, j) => (
                        <div
                          key={j}
                          style={{
                            position: "absolute",
                            left: `${Math.random() * width * 0.6 + width * 0.2}px`,
                            top: `${height - ((v - minVal) / range) * height - 3}px`,
                            width: "5px",
                            height: "5px",
                            background: violinColor,
                            borderRadius: "50%",
                            opacity: 0.6,
                          }}
                        />
                      ))}
                </div>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#0d1117",
                  }}
                >
                  {stat.label}
                </span>
                {showStats && (
                  <span style={{ fontSize: "8px", color: "#8b949e" }}>
                    M:{stat.median.toFixed(1)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Violin Color</label>
          <input
            type="color"
            value={violinColor}
            onChange={(e) => setViolinColor(e.target.value)}
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
          <label style={labelStyle}>⚫ Show Points</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showPoints}
              onChange={(e) => setShowPoints(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>
              Data dots
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📊 Show Stats</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showStats}
              onChange={(e) => setShowStats(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>
              Median label
            </span>
          </label>
        </div>
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
              borderLeft: `3px solid ${violinColor}`,
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
                style={{
                  color: violinColor,
                  fontSize: "11px",
                  fontWeight: 700,
                }}
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

export default ViolinPlotComponent;
