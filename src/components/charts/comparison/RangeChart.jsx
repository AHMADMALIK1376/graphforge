import React, { useState, useCallback, useMemo } from "react";
import { theme } from "../../../styles/theme";

// ============================================
// DEFAULT DATA
// ============================================
const DEFAULT_DATA = [
  {
    label: "Stock A",
    min: 10,
    max: 90,
    current: 55,
    zones: [0, 33, 66, 100],
    zoneLabels: ["Low", "Medium", "High", "Peak"],
  },
  {
    label: "Stock B",
    min: 20,
    max: 80,
    current: 70,
    zones: [0, 33, 66, 100],
    zoneLabels: ["Low", "Medium", "High", "Peak"],
  },
  {
    label: "Stock C",
    min: 5,
    max: 95,
    current: 25,
    zones: [0, 33, 66, 100],
    zoneLabels: ["Low", "Medium", "High", "Peak"],
  },
  {
    label: "Stock D",
    min: 15,
    max: 85,
    current: 45,
    zones: [0, 33, 66, 100],
    zoneLabels: ["Low", "Medium", "High", "Peak"],
  },
  {
    label: "Stock E",
    min: 30,
    max: 70,
    current: 60,
    zones: [0, 33, 66, 100],
    zoneLabels: ["Low", "Medium", "High", "Peak"],
  },
  {
    label: "Stock F",
    min: 0,
    max: 100,
    current: 82,
    zones: [0, 33, 66, 100],
    zoneLabels: ["Low", "Medium", "High", "Peak"],
  },
];

const ZONE_PRESETS = [
  {
    name: "Traffic Light",
    colors: ["#3fb950", "#d29922", "#f85149", "#8b0000"],
  },
  { name: "Blue Scale", colors: ["#79c0ff", "#58a6ff", "#1f6feb", "#0d419d"] },
  { name: "Temperature", colors: ["#3fb950", "#d29922", "#f97316", "#f85149"] },
  { name: "Purple Haze", colors: ["#bc8cff", "#a371f7", "#7c3aed", "#4c1d95"] },
  { name: "Mono", colors: ["#c9d1d9", "#8b949e", "#484f58", "#21262d"] },
];

const MARKER_STYLES = [
  { name: "Circle", value: "circle" },
  { name: "Diamond", value: "diamond" },
  { name: "Triangle Down", value: "triangle" },
  { name: "Arrow", value: "arrow" },
  { name: "Bar", value: "bar" },
];

const RangeChartComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#58a6ff",
}) => {
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Range Chart");
  const [zoneColors, setZoneColors] = useState(ZONE_PRESETS[0].colors);
  const [zonePreset, setZonePreset] = useState("Traffic Light");
  const [markerStyle, setMarkerStyle] = useState("circle");
  const [markerColor, setMarkerColor] = useState("#ffffff");
  const [markerSize, setMarkerSize] = useState(10);
  const [showMinMax, setShowMinMax] = useState(true);
  const [showCurrentValue, setShowCurrentValue] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const [showZoneLabels, setShowZoneLabels] = useState(true);
  const [rangeHeight, setRangeHeight] = useState(24);
  const [gap, setGap] = useState(16);
  const [showPercentage, setShowPercentage] = useState(true);
  const [valuePosition, setValuePosition] = useState("right");

  const globalMin = useMemo(() => Math.min(...data.map((d) => d.min)), [data]);
  const globalMax = useMemo(() => Math.max(...data.map((d) => d.max)), [data]);

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
      updated[index] = { ...updated[index], label: newLabel };
      return updated;
    });
  }, []);
  const handleZoneLabelChange = useCallback((index, zoneIndex, newLabel) => {
    setData((prev) => {
      const updated = [...prev];
      const newZoneLabels = [...updated[index].zoneLabels];
      newZoneLabels[zoneIndex] = newLabel;
      updated[index] = { ...updated[index], zoneLabels: newZoneLabels };
      return updated;
    });
  }, []);
  const addItem = useCallback(() => {
    setData((prev) => [
      ...prev,
      {
        label: `Item ${prev.length + 1}`,
        min: Math.floor(Math.random() * 30),
        max: 70 + Math.floor(Math.random() * 30),
        current: Math.floor(Math.random() * 80) + 10,
        zones: [0, 33, 66, 100],
        zoneLabels: ["Low", "Medium", "High", "Peak"],
      },
    ]);
  }, []);
  const removeItem = useCallback((index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  }, []);
  const handlePresetChange = (presetName) => {
    const preset = ZONE_PRESETS.find((p) => p.name === presetName);
    if (preset) {
      setZonePreset(presetName);
      setZoneColors(preset.colors);
    }
  };

  const renderMarker = (position, color, size, height) => {
    const halfSize = size / 2;
    // USE halfSize for all marker calculations
    switch (markerStyle) {
      case "diamond":
        return (
          <div
            style={{
              position: "absolute",
              left: `${position}%`,
              top: "50%",
              transform: "translate(-50%, -50%) rotate(45deg)",
              width: `${halfSize * 2}px`,
              height: `${halfSize * 2}px`,
              background: color,
              border: "2px solid #ffffff",
              borderRadius: "2px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
              zIndex: 3,
            }}
          />
        );
      case "triangle":
        return (
          <div
            style={{
              position: "absolute",
              left: `${position}%`,
              top: -2,
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: `${size}px solid transparent`,
              borderRight: `${size}px solid transparent`,
              borderTop: `${size * 1.5}px solid ${color}`,
              filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
              zIndex: 3,
            }}
          />
        );
      case "arrow":
        return (
          <div
            style={{
              position: "absolute",
              left: `${position}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 0,
              height: 0,
              borderTop: `${halfSize * 2}px solid transparent`,
              borderBottom: `${halfSize * 2}px solid transparent`,
              borderLeft: `${halfSize * 3}px solid ${color}`,
              filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
              zIndex: 3,
            }}
          />
        );
      case "bar":
        return (
          <div
            style={{
              position: "absolute",
              left: `${position}%`,
              top: -4,
              transform: "translateX(-50%)",
              width: `${Math.max(2, halfSize / 2)}px`,
              height: `${height + 8}px`,
              background: color,
              borderRadius: "2px",
              boxShadow: "0 0 4px rgba(0,0,0,0.5)",
              zIndex: 3,
            }}
          />
        );
      default:
        return (
          <div
            style={{
              position: "absolute",
              left: `${position}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: `${halfSize * 2 + 4}px`,
              height: `${halfSize * 2 + 4}px`,
              background: "rgba(0,0,0,0.3)",
              borderRadius: "50%",
              zIndex: 2,
            }}
          >
            <div
              style={{
                width: `${halfSize * 2}px`,
                height: `${halfSize * 2}px`,
                background: color,
                borderRadius: "50%",
                border: "2px solid #ffffff",
                boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>
        );
    }
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
    width: "250px",
  };
  const chartContainerStyle = {
    background: "#ffffff",
    borderRadius: "6px",
    padding: "24px 20px",
    border: `1px solid ${theme.colors.border.light}`,
    minHeight: "400px",
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
  const itemCardStyle = (color) => ({
    background: theme.colors.cardBg,
    borderRadius: "4px",
    border: `1px solid ${theme.colors.border.default}`,
    borderLeft: `3px solid ${color}`,
    padding: "10px 14px",
    marginBottom: "8px",
  });
  const cellInputStyle = (width = "65px") => ({
    padding: "5px 6px",
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
    padding: "7px 14px",
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

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>↔️</span>
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
            {data.length} ITEMS
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        <div
          style={{ display: "flex", flexDirection: "column", gap: `${gap}px` }}
        >
          {data.map((item, index) => {
            const range = item.max - item.min;
            const currentPercent =
              range > 0 ? ((item.current - item.min) / range) * 100 : 50;
            const currentInRange = Math.max(0, Math.min(100, currentPercent));
            return (
              <div
                key={index}
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: valuePosition === "left" ? "auto" : "100px",
                    textAlign: "right",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      color: theme.colors.mainBg,
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.5px",
                    }}
                  >
                    {item.label}
                  </div>
                  {showMinMax && (
                    <div
                      style={{
                        color: theme.colors.text.muted,
                        fontSize: "8px",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "4px",
                      }}
                    >
                      <span>{item.min}</span>
                      <span>-</span>
                      <span>{item.max}</span>
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, position: "relative" }}>
                  {showZones && (
                    <div
                      style={{
                        display: "flex",
                        height: `${rangeHeight}px`,
                        borderRadius: "3px",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      {item.zones &&
                        item.zones.map((zone, zi) => {
                          const startPercent =
                            zi === 0 ? 0 : item.zones[zi - 1];
                          const endPercent = zone;
                          const width = endPercent - startPercent;
                          return (
                            <div
                              key={zi}
                              style={{
                                width: `${width}%`,
                                background: zoneColors[zi % zoneColors.length],
                                opacity: 0.35,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative",
                                transition: "width 0.3s ease",
                              }}
                            >
                              {showZoneLabels && width > 12 && (
                                <span
                                  style={{
                                    color: "#ffffff",
                                    fontSize: "7px",
                                    fontWeight: 700,
                                    textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                                    letterSpacing: "1px",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {item.zoneLabels?.[zi]}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      )
                    </div>
                  )}
                  {showMinMax && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "2px",
                        fontSize: "8px",
                        color: theme.colors.text.muted,
                      }}
                    >
                      <span>{item.min}</span>
                      <span>{item.max}</span>
                    </div>
                  )}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: `${currentInRange}%`,
                      height: "100%",
                      zIndex: 3,
                    }}
                  >
                    {renderMarker(
                      currentInRange,
                      markerColor,
                      markerSize,
                      rangeHeight,
                    )}
                  </div>
                </div>
                {showCurrentValue && valuePosition === "right" && (
                  <div
                    style={{
                      width: "70px",
                      textAlign: "center",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        color: markerColor,
                        fontSize: "14px",
                        fontWeight: 700,
                        background: "#161b22",
                        padding: "3px 8px",
                        borderRadius: "3px",
                        border: `1px solid ${theme.colors.border.default}`,
                      }}
                    >
                      {item.current}
                    </div>
                    {showPercentage && (
                      <div
                        style={{
                          color: theme.colors.text.muted,
                          fontSize: "8px",
                          marginTop: "2px",
                        }}
                      >
                        {currentInRange.toFixed(0)}%
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {showZones && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              marginTop: "20px",
              paddingTop: "16px",
              borderTop: `1px solid ${theme.colors.border.light}`,
              flexWrap: "wrap",
            }}
          >
            {data[0]?.zoneLabels?.map((label, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "10px",
                }}
              >
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    background: zoneColors[i % zoneColors.length],
                    borderRadius: "2px",
                    display: "inline-block",
                    opacity: 0.7,
                  }}
                />
                <span style={{ color: theme.colors.text.muted }}>{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Zone Preset</label>
          <select
            value={zonePreset}
            onChange={(e) => handlePresetChange(e.target.value)}
            style={selectStyle}
          >
            {ZONE_PRESETS.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📍 Marker Style</label>
          <select
            value={markerStyle}
            onChange={(e) => setMarkerStyle(e.target.value)}
            style={selectStyle}
          >
            {MARKER_STYLES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎯 Marker Color</label>
          <input
            type="color"
            value={markerColor}
            onChange={(e) => setMarkerColor(e.target.value)}
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
          <label style={labelStyle}>📏 Marker Size: {markerSize}px</label>
          <input
            type="range"
            min="6"
            max="20"
            value={markerSize}
            onChange={(e) => setMarkerSize(Number(e.target.value))}
            style={{ width: "100%", accentColor: markerColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📊 Bar Height: {rangeHeight}px</label>
          <input
            type="range"
            min="16"
            max="48"
            value={rangeHeight}
            onChange={(e) => setRangeHeight(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>↔️ Gap: {gap}px</label>
          <input
            type="range"
            min="8"
            max="32"
            value={gap}
            onChange={(e) => setGap(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📋 Value Position</label>
          <select
            value={valuePosition}
            onChange={(e) => setValuePosition(e.target.value)}
            style={selectStyle}
          >
            <option value="right">Right</option>
            <option value="left">Left</option>
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔢 Show Min/Max</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showMinMax}
              onChange={(e) => setShowMinMax(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Range endpoints
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎯 Show Current</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showCurrentValue}
              onChange={(e) => setShowCurrentValue(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Value display
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Show Zones</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showZones}
              onChange={(e) => setShowZones(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Color zones
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🏷️ Zone Labels</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showZoneLabels}
              onChange={(e) => setShowZoneLabels(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              On zones
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>💯 Show %</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showPercentage}
              onChange={(e) => setShowPercentage(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Percentage
            </span>
          </label>
        </div>
      </div>

      <div
        style={{
          background: theme.colors.cardBg,
          padding: "14px 16px",
          borderRadius: "4px",
          border: `1px solid ${theme.colors.border.default}`,
        }}
      >
        <label style={labelStyle}>🎨 Zone Colors</label>
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "8px",
            flexWrap: "wrap",
          }}
        >
          {zoneColors.map((color, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: "4px" }}
            >
              <input
                type="color"
                value={color}
                onChange={(e) => {
                  const updated = [...zoneColors];
                  updated[i] = e.target.value;
                  setZoneColors(updated);
                  setZonePreset("Custom");
                }}
                style={{
                  width: "28px",
                  height: "28px",
                  cursor: "pointer",
                  border: "none",
                  borderRadius: "2px",
                }}
              />
              <span style={{ color: theme.colors.text.muted, fontSize: "9px" }}>
                {data[0]?.zoneLabels?.[i] || `Z${i + 1}`}
              </span>
            </div>
          ))}
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
          <label style={labelStyle}>📋 Data Items</label>
          <button onClick={addItem} style={buttonStyle()}>
            + Add Item
          </button>
        </div>
        {data.map((item, index) => (
          <div key={index} style={itemCardStyle(zoneColors[0])}>
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: "6px",
              }}
            >
              <input
                type="text"
                value={item.label}
                onChange={(e) => handleLabelChange(index, e.target.value)}
                style={cellInputStyle("90px")}
                placeholder="Label"
              />
              <span style={{ color: theme.colors.text.muted, fontSize: "9px" }}>
                Min:
              </span>
              <input
                type="number"
                value={item.min}
                onChange={(e) => handleDataChange(index, "min", e.target.value)}
                style={cellInputStyle("55px")}
              />
              <span style={{ color: theme.colors.text.muted, fontSize: "9px" }}>
                Current:
              </span>
              <input
                type="number"
                value={item.current}
                onChange={(e) =>
                  handleDataChange(index, "current", e.target.value)
                }
                style={cellInputStyle("55px")}
              />
              <span style={{ color: theme.colors.text.muted, fontSize: "9px" }}>
                Max:
              </span>
              <input
                type="number"
                value={item.max}
                onChange={(e) => handleDataChange(index, "max", e.target.value)}
                style={cellInputStyle("55px")}
              />
              <span style={{ color: theme.colors.text.muted, fontSize: "9px" }}>
                (
                {(item.max - item.min > 0
                  ? ((item.current - item.min) / (item.max - item.min)) * 100
                  : 50
                ).toFixed(0)}
                %)
              </span>
              <button
                onClick={() => removeItem(index)}
                style={{
                  padding: "3px 8px",
                  background: "transparent",
                  border: "1px solid #f85149",
                  borderRadius: "3px",
                  color: "#f85149",
                  cursor: "pointer",
                  fontSize: "10px",
                  marginLeft: "auto",
                }}
                disabled={data.length <= 1}
              >
                ✕
              </button>
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {item.zoneLabels?.map((zl, zi) => (
                <div
                  key={zi}
                  style={{ display: "flex", alignItems: "center", gap: "2px" }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      background: zoneColors[zi],
                      borderRadius: "1px",
                      display: "inline-block",
                    }}
                  />
                  <input
                    type="text"
                    value={zl}
                    onChange={(e) =>
                      handleZoneLabelChange(index, zi, e.target.value)
                    }
                    style={{ ...cellInputStyle("55px"), fontSize: "9px" }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary with globalMin and globalMax */}
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
          Global Min: <strong style={{ color: "#3fb950" }}>{globalMin}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Global Max: <strong style={{ color: "#f85149" }}>{globalMax}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Global Range:{" "}
          <strong style={{ color: "#f0f6fc" }}>{globalMax - globalMin}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Items: <strong style={{ color: "#f0f6fc" }}>{data.length}</strong>
        </span>
      </div>
    </div>
  );
};

export default RangeChartComponent;

