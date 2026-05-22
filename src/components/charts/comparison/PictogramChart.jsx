import React, { useState, useCallback, useMemo } from "react";
import { theme } from "../../../styles/theme";

// ============================================
// DEFAULT DATA
// ============================================
const DEFAULT_DATA = [
  { label: "Users", value: 750, icon: "👤", unit: 100, color: "#58a6ff" },
  { label: "Downloads", value: 520, icon: "⬇️", unit: 100, color: "#3fb950" },
  { label: "Reviews", value: 340, icon: "⭐", unit: 50, color: "#d29922" },
  { label: "Shares", value: 180, icon: "🔗", unit: 50, color: "#a371f7" },
];

const ICON_LIBRARY = [
  {
    category: "People",
    icons: ["👤", "👥", "👨‍💻", "👩‍💻", "🧑‍🤝‍🧑", "👨‍👩‍👧‍👦", "🧑", "👶", "🧑‍🎓", "👨‍💼"],
  },
  {
    category: "Business",
    icons: ["💼", "💰", "📊", "📈", "🏢", "🤝", "📋", "🎯", "🏆", "💡"],
  },
  {
    category: "Tech",
    icons: ["💻", "📱", "🖥️", "⌨️", "🖱️", "🔌", "💾", "🌐", "📡", "⚙️"],
  },
  {
    category: "Media",
    icons: ["⭐", "❤️", "👍", "🔥", "💬", "📧", "📢", "🎵", "📸", "🎬"],
  },
  {
    category: "Objects",
    icons: ["📦", "🏠", "🚗", "✈️", "☕", "🍕", "📚", "🎓", "💊", "🛒"],
  },
  {
    category: "Symbols",
    icons: ["✅", "❌", "⚠️", "ℹ️", "🔒", "🔑", "📍", "🏷️", "⏰", "🔔"],
  },
  {
    category: "Arrows",
    icons: ["⬆️", "⬇️", "⬅️", "➡️", "↗️", "↘️", "🔄", "🔃", "⤴️", "⤵️"],
  },
];

const LAYOUT_OPTIONS = [
  { name: "Grid", value: "grid" },
  { name: "Row", value: "row" },
  { name: "Stacked", value: "stacked" },
];

const PARTIAL_STYLES = [
  { name: "Half-Fill", value: "half" },
  { name: "Opacity", value: "opacity" },
  { name: "Smaller", value: "smaller" },
  { name: "None", value: "none" },
];

const PictogramChartComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#58a6ff",
}) => {
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Pictogram Chart");
  const [layout, setLayout] = useState("grid");
  const [partialStyle, setPartialStyle] = useState("half");
  const [iconSize, setIconSize] = useState(32);
  const [iconsPerRow, setIconsPerRow] = useState(10);
  const [showLabels, setShowLabels] = useState(true);
  const [showValues, setShowValues] = useState(true);
  const [showUnits, setShowUnits] = useState(true);
  const [backgroundStyle, setBackgroundStyle] = useState("plain");
  const [gap, setGap] = useState(6);

  // USE useMemo for derived calculation
  const totalIconsCount = useMemo(() => {
    return data.reduce(
      (sum, item) => sum + Math.floor(item.value / item.unit),
      0,
    );
  }, [data]);

  const handleDataChange = useCallback((index, field, newValue) => {
    setData((prev) => {
      const updated = [...prev];
      if (field === "value" || field === "unit")
        updated[index] = { ...updated[index], [field]: Number(newValue) || 0 };
      else updated[index] = { ...updated[index], [field]: newValue };
      return updated;
    });
  }, []);

  const addItem = useCallback(() => {
    setData((prev) => [
      ...prev,
      {
        label: `Item ${prev.length + 1}`,
        value: Math.floor(Math.random() * 500) + 100,
        icon: "📊",
        unit: 100,
        color: theme.colors.charts[prev.length % theme.colors.charts.length],
      },
    ]);
  }, []);
  const removeItem = useCallback((index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const renderIcons = (item) => {
    const totalIcons = Math.floor(item.value / item.unit);
    const partialValue = (item.value % item.unit) / item.unit;
    const hasPartial = partialValue > 0 && partialStyle !== "none";
    const allIcons = [];
    for (let i = 0; i < totalIcons; i++)
      allIcons.push({ type: "full", key: `full-${i}` });
    if (hasPartial)
      allIcons.push({
        type: "partial",
        key: "partial",
        fraction: partialValue,
      });

    return (
      <div
        style={{
          display: "flex",
          flexWrap: layout === "row" ? "nowrap" : "wrap",
          gap: `${gap}px`,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        {allIcons.map((iconObj) => {
          const isPartial = iconObj.type === "partial";
          return (
            <div
              key={iconObj.key}
              style={{
                width: `${iconSize}px`,
                height: `${iconSize}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: `${iconSize * 0.7}px`,
                lineHeight: 1,
                position: "relative",
                borderRadius: backgroundStyle === "rounded" ? "4px" : "0px",
                background:
                  backgroundStyle !== "plain"
                    ? `${item.color}15`
                    : "transparent",
                border:
                  backgroundStyle === "bordered"
                    ? `1px solid ${item.color}30`
                    : "none",
                transition: "all 0.2s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.15)";
                e.currentTarget.style.background = `${item.color}25`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.background =
                  backgroundStyle !== "plain"
                    ? `${item.color}15`
                    : "transparent";
              }}
              title={`${item.label}: ${item.value} (1 icon = ${item.unit})`}
            >
              <span
                style={{
                  opacity: isPartial
                    ? partialStyle === "opacity"
                      ? 0.35 + iconObj.fraction * 0.65
                      : partialStyle === "smaller"
                        ? 0.5
                        : 1
                    : 1,
                  transform:
                    isPartial && partialStyle === "smaller"
                      ? `scale(${0.5 + iconObj.fraction * 0.5})`
                      : "scale(1)",
                  filter: isPartial ? "grayscale(30%)" : "none",
                }}
              >
                {item.icon}
              </span>
              {isPartial && partialStyle === "half" && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${(1 - iconObj.fraction) * 100}%`,
                    background:
                      backgroundStyle === "plain"
                        ? "#ffffff"
                        : `${item.color}05`,
                    overflow: "hidden",
                    borderRadius:
                      backgroundStyle === "rounded" ? "4px 4px 0 0" : "0px",
                  }}
                >
                  <span
                    style={{
                      fontSize: `${iconSize * 0.7}px`,
                      opacity: 0.15,
                      position: "absolute",
                      top: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  >
                    {item.icon}
                  </span>
                </div>
              )}
              {isPartial && (
                <span
                  style={{
                    position: "absolute",
                    bottom: "1px",
                    right: "2px",
                    fontSize: "7px",
                    color: item.color,
                    fontWeight: 700,
                    background:
                      backgroundStyle === "plain" ? "#ffffff" : "transparent",
                    padding: "0 1px",
                    borderRadius: "1px",
                  }}
                >
                  {(iconObj.fraction * 100).toFixed(0)}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
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
    width: "280px",
  };
  const chartContainerStyle = {
    background: "#ffffff",
    borderRadius: "6px",
    padding: "24px",
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
    background: "#ffffff",
    borderRadius: "6px",
    border: `1px solid ${theme.colors.border.light}`,
    borderLeft: `4px solid ${color}`,
    padding: "16px",
    marginBottom: "12px",
  });
  const cellInputStyle = (width = "80px") => ({
    padding: "6px 8px",
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

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>🖼️</span>
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
            {data.length} ITEMS | {totalIconsCount} ICONS
          </span>
        </div>
      </div>

      <div id="chart-visual-area" style={chartContainerStyle}>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {data.map((item, index) => {
            const totalIcons = Math.floor(item.value / item.unit);
            const partialVal = ((item.value % item.unit) / item.unit) * 100;
            return (
              <div key={index}>
                {(showLabels || showValues) && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                      padding: "0 4px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span style={{ fontSize: "18px" }}>{item.icon}</span>
                      {showLabels && (
                        <span
                          style={{
                            color: theme.colors.mainBg,
                            fontSize: "12px",
                            fontWeight: 700,
                            letterSpacing: "1px",
                          }}
                        >
                          {item.label}
                        </span>
                      )}
                    </div>
                    {showValues && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          fontSize: "10px",
                        }}
                      >
                        <span style={{ color: theme.colors.text.muted }}>
                          <strong
                            style={{ color: item.color, fontSize: "13px" }}
                          >
                            {item.value.toLocaleString()}
                          </strong>
                        </span>
                        {showUnits && (
                          <span style={{ color: theme.colors.text.muted }}>
                            1 {item.icon} = {item.unit.toLocaleString()}
                          </span>
                        )}
                        <span style={{ color: theme.colors.text.muted }}>
                          ({totalIcons}
                          {partialVal > 0
                            ? `.${partialVal.toFixed(0)}`
                            : ""}{" "}
                          icons)
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {renderIcons(item)}
              </div>
            );
          })}
        </div>
      </div>

      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📐 Layout</label>
          <select
            value={layout}
            onChange={(e) => setLayout(e.target.value)}
            style={selectStyle}
          >
            {LAYOUT_OPTIONS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔲 Background</label>
          <select
            value={backgroundStyle}
            onChange={(e) => setBackgroundStyle(e.target.value)}
            style={selectStyle}
          >
            <option value="plain">Plain</option>
            <option value="rounded">Rounded Box</option>
            <option value="bordered">Bordered</option>
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>➗ Partial Style</label>
          <select
            value={partialStyle}
            onChange={(e) => setPartialStyle(e.target.value)}
            style={selectStyle}
          >
            {PARTIAL_STYLES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Icon Size: {iconSize}px</label>
          <input
            type="range"
            min="16"
            max="64"
            value={iconSize}
            onChange={(e) => setIconSize(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📐 Icons Per Row: {iconsPerRow}</label>
          <input
            type="range"
            min="5"
            max="20"
            value={iconsPerRow}
            onChange={(e) => setIconsPerRow(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>↔️ Gap: {gap}px</label>
          <input
            type="range"
            min="0"
            max="16"
            value={gap}
            onChange={(e) => setGap(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>👁️ Show Labels</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showLabels}
              onChange={(e) => setShowLabels(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Category names
            </span>
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
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Numbers
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📊 Show Units</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showUnits}
              onChange={(e) => setShowUnits(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Scale info
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
        <label style={labelStyle}>🎨 Icon Library (click to copy)</label>
        <div style={{ marginTop: "10px" }}>
          {ICON_LIBRARY.map((cat, catIndex) => (
            <div key={catIndex} style={{ marginBottom: "8px" }}>
              <span
                style={{
                  color: theme.colors.text.muted,
                  fontSize: "9px",
                  fontWeight: 700,
                  marginRight: "8px",
                }}
              >
                {cat.category}:
              </span>
              <span
                style={{ display: "inline-flex", gap: "4px", flexWrap: "wrap" }}
              >
                {cat.icons.map((icon, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: "18px",
                      cursor: "pointer",
                      padding: "2px 4px",
                      borderRadius: "3px",
                      transition: "all 0.15s ease",
                      border: "1px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${theme.colors.border.light}`;
                      e.currentTarget.style.border = `1px solid ${theme.colors.border.default}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.border = "1px solid transparent";
                    }}
                    onClick={() => {
                      navigator.clipboard?.writeText(icon);
                    }}
                    title={`Click to copy: ${icon}`}
                  >
                    {icon}
                  </span>
                ))}
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
          <div key={index} style={itemCardStyle(item.color)}>
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <span style={{ fontSize: "24px" }}>{item.icon}</span>
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
              </div>
              <input
                type="text"
                value={item.label}
                onChange={(e) =>
                  handleDataChange(index, "label", e.target.value)
                }
                style={cellInputStyle("100px")}
                placeholder="Label"
              />
              <div
                style={{ display: "flex", alignItems: "center", gap: "2px" }}
              >
                <span
                  style={{ color: theme.colors.text.muted, fontSize: "9px" }}
                >
                  Value:
                </span>
                <input
                  type="number"
                  value={item.value}
                  onChange={(e) =>
                    handleDataChange(index, "value", e.target.value)
                  }
                  style={cellInputStyle("70px")}
                />
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "2px" }}
              >
                <span
                  style={{ color: theme.colors.text.muted, fontSize: "9px" }}
                >
                  1 {item.icon} =
                </span>
                <input
                  type="number"
                  value={item.unit}
                  onChange={(e) =>
                    handleDataChange(index, "unit", e.target.value)
                  }
                  style={cellInputStyle("60px")}
                  min="1"
                />
              </div>
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
                = {Math.floor(item.value / item.unit)} icons{" "}
                {item.value % item.unit > 0
                  ? `+ ${(((item.value % item.unit) / item.unit) * 100).toFixed(0)}%`
                  : ""}
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
    </div>
  );
};

export default PictogramChartComponent;

