import React, { useState, useCallback, useMemo } from "react";
import { theme } from '../../../styles/theme';

// ============================================
// DEFAULT DATA
// ============================================
const DEFAULT_DATA = [
  { label: "Mobile", value: 60, icon: "📱", color: "#58a6ff" },
  { label: "Desktop", value: 40, icon: "💻", color: "#3fb950" },
  { label: "Tablet", value: 25, icon: "📋", color: "#d29922" },
  { label: "Watch", value: 15, icon: "⌚", color: "#a371f7" },
  { label: "TV", value: 20, icon: "📺", color: "#f85149" },
  { label: "Speaker", value: 10, icon: "🔊", color: "#79c0ff" },
];

// ============================================
// BACKGROUND SHAPES
// ============================================
const BG_SHAPES = [
  { name: "Circle", value: "circle" },
  { name: "Square", value: "square" },
  { name: "Rounded Square", value: "rounded" },
  { name: "Diamond", value: "diamond" },
  { name: "Hexagon", value: "hexagon" },
  { name: "None", value: "none" },
];

// ============================================
// LABEL POSITIONS
// ============================================
const LABEL_POSITIONS = [
  { name: "Bottom", value: "bottom" },
  { name: "Top", value: "top" },
  { name: "Right", value: "right" },
  { name: "Inside", value: "inside" },
  { name: "Tooltip Only", value: "tooltip" },
];

// ============================================
// LAYOUT DIRECTIONS
// ============================================
const LAYOUTS = [
  { name: "Horizontal Row", value: "horizontal" },
  { name: "Vertical Column", value: "vertical" },
  { name: "Grid", value: "grid" },
  { name: "Circular", value: "circular" },
];

// ============================================
// SIZE SCALE MODES
// ============================================
const SIZE_MODES = [
  { name: "Uniform", value: "uniform" },
  { name: "Proportional", value: "proportional" },
  { name: "Ranked", value: "ranked" },
];

// ============================================
// ICON LIBRARY
// ============================================
const ICON_LIBRARY = [
  {
    category: "Devices",
    icons: ["📱", "💻", "🖥️", "⌚", "📺", "🎮", "📷", "🖨️", "📟", "💾"],
  },
  {
    category: "Communication",
    icons: ["📧", "💬", "📞", "📢", "🔔", "📨", "📩", "📤", "📥", "🗣️"],
  },
  {
    category: "Business",
    icons: ["💼", "💰", "📊", "🏢", "🤝", "📋", "🎯", "🏆", "📈", "💡"],
  },
  {
    category: "People",
    icons: ["👤", "👥", "👨‍💻", "👩‍💻", "🧑‍🎓", "👨‍💼", "👩‍🔬", "🧑‍🏫", "👨‍🎨", "👩‍⚕️"],
  },
  {
    category: "Nature",
    icons: ["🌍", "🌿", "☀️", "🌙", "⭐", "🔥", "💧", "🌈", "🌸", "🌲"],
  },
  {
    category: "Objects",
    icons: ["📦", "🏠", "🚗", "✈️", "☕", "🍕", "📚", "🔑", "⏰", "🛒"],
  },
];

// ============================================
// MAIN COMPONENT
// ============================================
const IconChartComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#58a6ff",
}) => {
  // ===== STATE =====
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Icon Chart");
  const [iconSize, setIconSize] = useState(48);
  const [bgShape, setBgShape] = useState("circle");
  const [labelPosition, setLabelPosition] = useState("bottom");
  const [layout, setLayout] = useState("horizontal");
  const [sizeMode, setSizeMode] = useState("uniform");
  const [bgOpacity, setBgOpacity] = useState(0.2);
  const [showValueBar, setShowValueBar] = useState(true);
  const [showPercentage, setShowPercentage] = useState(true);
  const [animation, setAnimation] = useState(true);
  const [gridColumns, setGridColumns] = useState(3);

  // ===== DERIVED =====
  const maxValue = useMemo(
    () => Math.max(...data.map((d) => d.value), 1),
    [data],
  );
  const totalValue = useMemo(
    () => data.reduce((s, d) => s + d.value, 0),
    [data],
  );

  // ===== HANDLERS =====
  const handleDataChange = useCallback((index, field, newValue) => {
    setData((prev) => {
      const updated = [...prev];
      if (field === "value") {
        updated[index] = { ...updated[index], value: Number(newValue) || 0 };
      } else {
        updated[index] = { ...updated[index], [field]: newValue };
      }
      return updated;
    });
  }, []);

  const addItem = useCallback(() => {
    const randomIcon =
      ICON_LIBRARY[Math.floor(Math.random() * ICON_LIBRARY.length)].icons[0];
    setData((prev) => [
      ...prev,
      {
        label: `Item ${prev.length + 1}`,
        value: Math.floor(Math.random() * 80) + 10,
        icon: randomIcon,
        color: theme.colors.charts[prev.length % theme.colors.charts.length],
      },
    ]);
  }, []);

  const removeItem = useCallback((index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // ===== RENDER BACKGROUND SHAPE =====
  const renderBackgroundShape = (color, size, index) => {
    const bgColor =
      color +
      Math.floor(bgOpacity * 255)
        .toString(16)
        .padStart(2, "0");
    const halfSize = size / 2;
    const padding = 8;

    switch (bgShape) {
      case "square":
        return (
          <rect
            x={-halfSize - padding}
            y={-halfSize - padding}
            width={size + padding * 2}
            height={size + padding * 2}
            fill={bgColor}
            rx={0}
          />
        );
      case "rounded":
        return (
          <rect
            x={-halfSize - padding}
            y={-halfSize - padding}
            width={size + padding * 2}
            height={size + padding * 2}
            fill={bgColor}
            rx={8}
          />
        );
      case "diamond":
        return (
          <polygon
            points={`0,${-halfSize - padding} ${halfSize + padding},0 0,${halfSize + padding} ${-halfSize - padding},0`}
            fill={bgColor}
          />
        );
      case "hexagon":
        const hexPoints = [];
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          hexPoints.push(
            `${Math.cos(angle) * (halfSize + padding)},${Math.sin(angle) * (halfSize + padding)}`,
          );
        }
        return <polygon points={hexPoints.join(" ")} fill={bgColor} />;
      case "circle":
      default:
        return <circle cx={0} cy={0} r={halfSize + padding} fill={bgColor} />;
    }
  };

  // ===== RENDER SINGLE ICON CARD =====
  const renderIconCard = (item, index) => {
    const actualSize =
      sizeMode === "proportional"
        ? Math.max(24, (item.value / maxValue) * iconSize)
        : sizeMode === "ranked"
          ? Math.max(20, iconSize - index * 4)
          : iconSize;

    const percentage = ((item.value / totalValue) * 100).toFixed(1);

    return (
      <div
        key={index}
        style={{
          display: "flex",
          flexDirection: labelPosition === "top" ? "column-reverse" : "column",
          alignItems: "center",
          gap: "8px",
          transition: "all 0.3s ease",
          cursor: "default",
        }}
        onMouseEnter={(e) => {
          if (animation) {
            e.currentTarget.style.transform = "scale(1.08)";
            e.currentTarget.style.filter = "brightness(1.1)";
          }
        }}
        onMouseLeave={(e) => {
          if (animation) {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.filter = "brightness(1)";
          }
        }}
      >
        {/* Icon with Background */}
        <div
          style={{
            position: "relative",
            width: `${actualSize + 20}px`,
            height: `${actualSize + 20}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* SVG Background Shape */}
          {bgShape !== "none" && (
            <svg
              width={actualSize + 20}
              height={actualSize + 20}
              style={{ position: "absolute", top: 0, left: 0 }}
            >
              <g
                transform={`translate(${actualSize / 2 + 10}, ${actualSize / 2 + 10})`}
              >
                {renderBackgroundShape(item.color, actualSize, index)}
              </g>
            </svg>
          )}

          {/* Icon */}
          <span
            style={{
              fontSize: `${actualSize * 0.55}px`,
              lineHeight: 1,
              zIndex: 1,
              position: "relative",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))",
            }}
          >
            {item.icon}
          </span>

          {/* Value badge on icon */}
          {showValueBar && labelPosition === "inside" && (
            <span
              style={{
                position: "absolute",
                bottom: "4px",
                background: item.color,
                color: "#ffffff",
                fontSize: "9px",
                fontWeight: 700,
                padding: "1px 6px",
                borderRadius: "10px",
                zIndex: 2,
              }}
            >
              {item.value}
            </span>
          )}
        </div>

        {/* Label and Value */}
        {labelPosition !== "tooltip" && labelPosition !== "inside" && (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                color: theme.colors.mainBg,
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.5px",
                marginBottom: "2px",
              }}
            >
              {item.label}
            </div>
            {showValueBar && (
              <div
                style={{
                  color: item.color,
                  fontSize: "14px",
                  fontWeight: 700,
                }}
              >
                {item.value}
              </div>
            )}
            {showPercentage && (
              <div
                style={{
                  color: theme.colors.text.muted,
                  fontSize: "9px",
                }}
              >
                {percentage}%
              </div>
            )}
          </div>
        )}

        {/* Tooltip */}
        {labelPosition === "tooltip" && (
          <div
            style={{
              position: "absolute",
              bottom: "-30px",
              background: "#161b22",
              color: "#fff",
              padding: "4px 10px",
              borderRadius: "4px",
              fontSize: "10px",
              fontWeight: 700,
              opacity: 0,
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            {item.label}: {item.value} ({percentage}%)
          </div>
        )}
      </div>
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
    padding: "32px 24px",
    border: `1px solid ${theme.colors.border.light}`,
    minHeight: "400px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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

  const cellInputStyle = (width = "80px") => ({
    padding: "5px 8px",
    background: theme.colors.inputBg,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: "3px",
    color: theme.colors.text.body,
    fontSize: "11px",
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

  // ============================================
  // RENDER
  // ============================================
  return (
    <div style={containerStyle}>
      {/* HEADER */}
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>🔷</span>
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

      {/* CHART DISPLAY */}
      <div id="chart-visual-area" style={chartContainerStyle}>
        <div
          style={{
            display: layout === "grid" ? "grid" : "flex",
            gridTemplateColumns:
              layout === "grid" ? `repeat(${gridColumns}, 1fr)` : undefined,
            flexDirection:
              layout === "vertical"
                ? "column"
                : layout === "circular"
                  ? undefined
                  : "row",
            gap: layout === "circular" ? "0px" : "32px",
            alignItems: "center",
            justifyContent: "center",
            flexWrap:
              layout === "horizontal" || layout === "circular"
                ? "wrap"
                : "nowrap",
          }}
        >
          {layout === "circular" ? (
            // Circular layout
            <div
              style={{
                position: "relative",
                width: "400px",
                height: "400px",
              }}
            >
              {data.map((item, index) => {
                const angle =
                  ((2 * Math.PI) / data.length) * index - Math.PI / 2;
                const radius = 140;
                const x = Math.cos(angle) * radius + 200;
                const y = Math.sin(angle) * radius + 200;

                return (
                  <div
                    key={index}
                    style={{
                      position: "absolute",
                      left: x,
                      top: y,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {renderIconCard(item, index)}
                  </div>
                );
              })}
              {/* Center total */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
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
                  style={{ color: theme.colors.text.muted, fontSize: "10px" }}
                >
                  TOTAL
                </div>
              </div>
            </div>
          ) : (
            data.map((item, index) => renderIconCard(item, index))
          )}
        </div>
      </div>

      {/* CONTROLS */}
      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔷 Background</label>
          <select
            value={bgShape}
            onChange={(e) => setBgShape(e.target.value)}
            style={selectStyle}
          >
            {BG_SHAPES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div style={controlGroupStyle}>
          <label style={labelStyle}>📐 Layout</label>
          <select
            value={layout}
            onChange={(e) => setLayout(e.target.value)}
            style={selectStyle}
          >
            {LAYOUTS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        <div style={controlGroupStyle}>
          <label style={labelStyle}>📍 Label Position</label>
          <select
            value={labelPosition}
            onChange={(e) => setLabelPosition(e.target.value)}
            style={selectStyle}
          >
            {LABEL_POSITIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Size Mode</label>
          <select
            value={sizeMode}
            onChange={(e) => setSizeMode(e.target.value)}
            style={selectStyle}
          >
            {SIZE_MODES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Icon Size: {iconSize}px</label>
          <input
            type="range"
            min="24"
            max="100"
            value={iconSize}
            onChange={(e) => setIconSize(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>

        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔲 BG Opacity: {bgOpacity}</label>
          <input
            type="range"
            min="0.05"
            max="0.5"
            step="0.05"
            value={bgOpacity}
            onChange={(e) => setBgOpacity(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>

        {layout === "grid" && (
          <div style={controlGroupStyle}>
            <label style={labelStyle}>📊 Grid Columns: {gridColumns}</label>
            <input
              type="range"
              min="2"
              max="6"
              value={gridColumns}
              onChange={(e) => setGridColumns(Number(e.target.value))}
              style={{ width: "100%", accentColor: chartColor }}
            />
          </div>
        )}

        <div style={controlGroupStyle}>
          <label style={labelStyle}>📊 Show Values</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showValueBar}
              onChange={(e) => setShowValueBar(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Display numbers
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

        <div style={controlGroupStyle}>
          <label style={labelStyle}>✨ Animation</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={animation}
              onChange={(e) => setAnimation(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Hover effects
            </span>
          </label>
        </div>
      </div>

      {/* ICON LIBRARY */}
      <div
        style={{
          background: theme.colors.cardBg,
          padding: "14px 16px",
          borderRadius: "4px",
          border: `1px solid ${theme.colors.border.default}`,
        }}
      >
        <label style={labelStyle}>🎨 Icon Library</label>
        <div style={{ marginTop: "8px" }}>
          {ICON_LIBRARY.map((cat, i) => (
            <div
              key={i}
              style={{
                marginBottom: "6px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  color: theme.colors.text.muted,
                  fontSize: "9px",
                  fontWeight: 700,
                  minWidth: "90px",
                }}
              >
                {cat.category}:
              </span>
              <span style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
                {cat.icons.map((icon, j) => (
                  <span
                    key={j}
                    style={{
                      fontSize: "16px",
                      cursor: "pointer",
                      padding: "1px 3px",
                      borderRadius: "2px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        theme.colors.border.light;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                    title={icon}
                  >
                    {icon}
                  </span>
                ))}
              </span>
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
            marginBottom: "12px",
          }}
        >
          <label style={labelStyle}>📋 Data Items</label>
          <button onClick={addItem} style={buttonStyle()}>
            + Add Item
          </button>
        </div>

        {data.map((item, index) => (
          <div key={index} style={itemCardStyle(item.color)}>
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontSize: "22px" }}>{item.icon}</span>
              <input
                type="text"
                value={item.icon}
                onChange={(e) =>
                  handleDataChange(index, "icon", e.target.value)
                }
                style={{
                  ...cellInputStyle("40px"),
                  textAlign: "center",
                  fontSize: "14px",
                }}
                maxLength={2}
              />
              <input
                type="text"
                value={item.label}
                onChange={(e) =>
                  handleDataChange(index, "label", e.target.value)
                }
                style={cellInputStyle("100px")}
                placeholder="Label"
              />
              <input
                type="number"
                value={item.value}
                onChange={(e) =>
                  handleDataChange(index, "value", e.target.value)
                }
                style={cellInputStyle("65px")}
              />
              <input
                type="color"
                value={item.color}
                onChange={(e) =>
                  handleDataChange(index, "color", e.target.value)
                }
                style={{
                  width: "30px",
                  height: "30px",
                  cursor: "pointer",
                  border: "1px solid #30363d",
                  borderRadius: "3px",
                  padding: "2px",
                }}
              />
              <span style={{ color: theme.colors.text.muted, fontSize: "9px" }}>
                {((item.value / totalValue) * 100).toFixed(1)}%
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
          </div>
        ))}
      </div>

      {/* SUMMARY BAR */}
      <div
        style={{
          display: "flex",
          gap: "2px",
          height: "24px",
          borderRadius: "4px",
          overflow: "hidden",
          background: theme.colors.cardBg,
          border: `1px solid ${theme.colors.border.default}`,
        }}
      >
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              width: `${(item.value / totalValue) * 100}%`,
              background: item.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "8px",
              fontWeight: 700,
              color: "#ffffff",
              minWidth: item.value > 0 ? "30px" : "0px",
              transition: "width 0.3s ease",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
            title={`${item.label}: ${item.value} (${((item.value / totalValue) * 100).toFixed(1)}%)`}
          >
            {item.value > totalValue * 0.05 ? `${item.icon} ${item.value}` : ""}
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconChartComponent;




