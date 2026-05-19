import React, { useState } from "react";
import { theme } from "../../styles/theme";

const ColorPicker = ({
  selectedColor,
  onColorChange,
  label = "Chart Color",
}) => {
  const [customColor, setCustomColor] = useState(
    selectedColor || theme.colors.charts[0],
  );

  const containerStyle = {
    fontFamily: theme.typography.fontFamily.primary,
  };

  const labelStyle = {
    color: theme.colors.text.muted,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    textTransform: "uppercase",
    letterSpacing: theme.typography.letterSpacing.wider,
    marginBottom: theme.spacing.sm,
    display: "block",
  };

  const paletteStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  };

  const colorSwatchStyle = (color) => ({
    width: "100%",
    aspectRatio: "1",
    background: color,
    border:
      color === selectedColor
        ? `2px solid ${theme.colors.text.heading}`
        : `1px solid ${theme.colors.border.default}`,
    borderRadius: theme.borderRadius.sharp,
    cursor: "pointer",
    transition: theme.transitions.fast,
    position: "relative",
  });

  const selectedDotStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "6px",
    height: "6px",
    background: theme.colors.text.heading,
    borderRadius: "50%",
  };

  const customInputStyle = {
    display: "flex",
    gap: theme.spacing.sm,
    alignItems: "center",
  };

  const inputStyle = {
    flex: 1,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    background: theme.colors.inputBg,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: theme.borderRadius.sharp,
    color: theme.colors.text.body,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.primary,
    outline: "none",
    letterSpacing: "1px",
  };

  const previewStyle = {
    width: "36px",
    height: "36px",
    background: customColor,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: theme.borderRadius.sharp,
  };

  const handleColorClick = (color) => {
    setCustomColor(color);
    onColorChange(color);
  };

  const handleCustomInput = (e) => {
    let value = e.target.value;
    if (!value.startsWith("#")) value = "#" + value;
    if (value.length <= 7) {
      setCustomColor(value);
      if (value.length === 7) onColorChange(value);
    }
  };

  return (
    <div style={containerStyle}>
      <label style={labelStyle}>{label}</label>

      {/* Color Palette */}
      <div style={paletteStyle}>
        {theme.colors.charts.map((color, index) => (
          <div
            key={index}
            style={colorSwatchStyle(color)}
            onClick={() => handleColorClick(color)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.15)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {color === selectedColor && <div style={selectedDotStyle} />}
          </div>
        ))}
      </div>

      {/* Custom Color Input */}
      <div style={customInputStyle}>
        <div style={previewStyle} />
        <input
          type="text"
          value={customColor}
          onChange={handleCustomInput}
          placeholder="#58a6ff"
          maxLength={7}
          style={inputStyle}
        />
      </div>
    </div>
  );
};

export default ColorPicker;
