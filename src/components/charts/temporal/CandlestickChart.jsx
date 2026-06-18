import React, { useState, useCallback, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { theme } from "../../../styles/theme";

const DEFAULT_DATA = [
  { name: "Jan", open: 100, high: 120, low: 95, close: 115 },
  { name: "Feb", open: 115, high: 130, low: 110, close: 125 },
  { name: "Mar", open: 125, high: 140, low: 120, close: 135 },
  { name: "Apr", open: 135, high: 145, low: 125, close: 128 },
  { name: "May", open: 128, high: 135, low: 115, close: 120 },
  { name: "Jun", open: 120, high: 125, low: 100, close: 105 },
  { name: "Jul", open: 105, high: 120, low: 100, close: 115 },
  { name: "Aug", open: 115, high: 130, low: 110, close: 125 },
  { name: "Sep", open: 125, high: 135, low: 120, close: 130 },
  { name: "Oct", open: 130, high: 140, low: 125, close: 135 },
  { name: "Nov", open: 135, high: 150, low: 130, close: 145 },
  { name: "Dec", open: 145, high: 155, low: 140, close: 150 },
];

const CandlestickChartComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#a371f7",
}) => {
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Candlestick Chart");
  const [bullColor, setBullColor] = useState("#3fb950");
  const [bearColor, setBearColor] = useState("#f85149");
  const [candleWidth, setCandleWidth] = useState(20);
  const [showGrid, setGridVisible] = useState(true);
  const [animation, setAnimation] = useState(true);

  const handleDataChange = useCallback((index, field, newValue) => {
    setData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: Number(newValue) || 0 };
      return updated;
    });
  }, []);

  const handleNameChange = useCallback((index, newName) => {
    setData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], name: newName };
      return updated;
    });
  }, []);

  const addCandle = useCallback(() => {
    const last = data[data.length - 1];
    const base = last?.close || 100;
    setData((prev) => [
      ...prev,
      {
        name: `Period ${prev.length + 1}`,
        open: base + Math.floor(Math.random() * 20) - 10,
        high: base + Math.floor(Math.random() * 30) + 10,
        low: base - Math.floor(Math.random() * 30) - 10,
        close: base + Math.floor(Math.random() * 20) - 10,
      },
    ]);
  }, [data]);

  const removeCandle = useCallback((index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const d = payload[0]?.payload;
      const isBull = d.close >= d.open;
      return (
        <div
          style={{
            background: theme.colors.cardBg,
            border: "1px solid #30363d",
            borderRadius: "4px",
            padding: "10px 14px",
            fontSize: "11px",
          }}
        >
          <p style={{ fontWeight: 700, color: "#f0f6fc", margin: "0 0 4px" }}>
            {label}
          </p>
          <p style={{ margin: 0, color: isBull ? bullColor : bearColor }}>
            Open: {d.open}
          </p>
          <p style={{ margin: 0, color: isBull ? bullColor : bearColor }}>
            High: {d.high}
          </p>
          <p style={{ margin: 0, color: isBull ? bullColor : bearColor }}>
            Low: {d.low}
          </p>
          <p style={{ margin: 0, color: isBull ? bullColor : bearColor }}>
            Close: {d.close}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom candle renderer using bar chart
  const renderCandles = () => {
    return data.map((d, index) => {
      const isBull = d.close >= d.open;
      const color = isBull ? bullColor : bearColor;
      const bodyHeight = Math.abs(d.close - d.open);
      const bodyY = Math.min(d.close, d.open);
      const highLowHeight = d.high - d.low;
      const candleData = [
        {
          name: d.name,
          value: highLowHeight,
          low: d.low,
          high: d.high,
          open: d.open,
          close: d.close,
          color,
          isBull,
          bodyHeight,
          bodyY,
          index,
        },
      ];
      return candleData;
    });
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
    borderBottom: `2px solid ${bullColor}`,
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
    padding: "24px 16px",
    border: "1px solid #30363d",
    minHeight: "450px",
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
  const buttonStyle = (c = bullColor) => ({
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

  // Create custom candle visualization using SVG
  const renderCandlesSVG = () => {
    const maxVal = Math.max(...data.map((d) => d.high));
    const minVal = Math.min(...data.map((d) => d.low));
    const range = maxVal - minVal || 1;
    const height = 400;
    const width = data.length * 30;
    const padding = 20;

    return (
      <svg
        width="100%"
        height={height + 40}
        viewBox={`0 0 ${Math.max(width + padding * 2, 400)} ${height + 40}`}
      >
        {data.map((d, i) => {
          const isBull = d.close >= d.open;
          const color = isBull ? bullColor : bearColor;
          const x = padding + i * 30 + 10;
          const yHigh = padding + ((maxVal - d.high) / range) * height;
          const yLow = padding + ((maxVal - d.low) / range) * height;
          const yOpen = padding + ((maxVal - d.open) / range) * height;
          const yClose = padding + ((maxVal - d.close) / range) * height;
          const bodyTop = Math.min(yOpen, yClose);
          const bodyHeight = Math.abs(yOpen - yClose) || 1;

          return (
            <g key={i}>
              {/* Wick (high to low) */}
              <line
                x1={x}
                y1={yHigh}
                x2={x}
                y2={yLow}
                stroke={color}
                strokeWidth="1.5"
              />
              {/* Body (open to close) */}
              <rect
                x={x - candleWidth / 2}
                y={bodyTop}
                width={candleWidth}
                height={bodyHeight}
                fill={color}
                rx="1"
              />
              {/* Label */}
              <text
                x={x}
                y={height + 30}
                textAnchor="middle"
                fill="#8b949e"
                fontSize="8"
              >
                {d.name}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>🕯️</span>
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
              color: bullColor,
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${bullColor}50`,
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
            {data.length} CANDLES
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        {renderCandlesSVG()}
      </div>

      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🟢 Bull Color</label>
          <input
            type="color"
            value={bullColor}
            onChange={(e) => setBullColor(e.target.value)}
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
          <label style={labelStyle}>🔴 Bear Color</label>
          <input
            type="color"
            value={bearColor}
            onChange={(e) => setBearColor(e.target.value)}
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
          <label style={labelStyle}>📏 Candle Width: {candleWidth}</label>
          <input
            type="range"
            min="6"
            max="30"
            value={candleWidth}
            onChange={(e) => setCandleWidth(Number(e.target.value))}
            style={{ width: "100%", accentColor: bullColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔲 Grid</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setGridVisible(e.target.checked)}
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
            <span style={{ fontSize: "11px", color: "#c9d1d9" }}>Animate</span>
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
          <button onClick={addCandle} style={buttonStyle()}>
            + Add Candle
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
                  Open
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
                  High
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
                  Low
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
                  Close
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
                    }}
                  >
                    <input
                      type="text"
                      value={row.name}
                      onChange={(e) => handleNameChange(i, e.target.value)}
                      style={cellInputStyle("60px")}
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
                      value={row.open}
                      onChange={(e) =>
                        handleDataChange(i, "open", e.target.value)
                      }
                      style={cellInputStyle("55px")}
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
                      value={row.high}
                      onChange={(e) =>
                        handleDataChange(i, "high", e.target.value)
                      }
                      style={cellInputStyle("55px")}
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
                      value={row.low}
                      onChange={(e) =>
                        handleDataChange(i, "low", e.target.value)
                      }
                      style={cellInputStyle("55px")}
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
                      value={row.close}
                      onChange={(e) =>
                        handleDataChange(i, "close", e.target.value)
                      }
                      style={cellInputStyle("55px")}
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
                      onClick={() => removeCandle(i)}
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

export default CandlestickChartComponent;
