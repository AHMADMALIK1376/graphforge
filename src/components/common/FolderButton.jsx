// src/components/common/FolderButton.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const FolderButton = React.forwardRef(
  (
    {
      to,
      onClick,
      children,
      baseColor = "#0077C8",
      hoverColor,
      activeColor,
      active = false,
      showDot = false,
      disabled = false,
      style = {},
      bodyStyle = {},
      tabStyle = {},
      labelStyle = {},
      ...rest
    },
    ref,
  ) => {
    const [hovered, setHovered] = useState(false);

    const hoverBgColor = hoverColor || baseColor;
    const activeBgColor = activeColor || hoverBgColor;

    const currentTabColor = active
      ? activeBgColor
      : hovered
        ? hoverBgColor
        : "#D4C4AE";

    // Use original full-saturation color on hover/active
    const currentBackground =
      active || hovered ? (active ? activeBgColor : hoverBgColor) : "#FFFFFF";

    const currentBorderColor =
      active || hovered ? (active ? activeBgColor : hoverBgColor) : "#D4C4AE";

    // ensure readable text depending on background luminance
    const isLight = (() => {
      try {
        const num = parseInt(baseColor.replace("#", ""), 16);
        const r = (num >> 16) & 0xff;
        const g = (num >> 8) & 0xff;
        const b = num & 0xff;
        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return lum > 0.6;
      } catch {
        return false;
      }
    })();

    const defaultTextColor = "#A38F84";
    const currentTextColor = active || hovered ? "#FFFFFF" : defaultTextColor;

    const content = (
      <>
        <div
          style={{
            ...folderTabStyleBase,
            ...folderTabStyle(currentTabColor),
            ...tabStyle,
          }}
        >
          <div style={folderTabDotStyle} />
          <div style={folderTabDotStyle} />
          <div style={folderTabDotStyle} />
        </div>
        <div
          style={{
            ...labelStyleBase,
            ...labelStyle,
            color: currentTextColor,
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {children}
        </div>
        {showDot && <span style={{ ...dotStyle, background: baseColor }} />}
      </>
    );

    const componentStyle = {
      ...folderBodyStyleBase,
      background: currentBackground,
      borderColor: currentBorderColor,
      color: currentTextColor,
      ...bodyStyle,
      ...style,
      cursor: disabled ? "not-allowed" : "pointer",
    };

    const commonProps = {
      ref,
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      style: componentStyle,
      ...rest,
    };

    if (to) {
      return (
        <div style={wrapperStyle}>
          <Link to={to} {...commonProps}>
            {content}
          </Link>
        </div>
      );
    }

    return (
      <div style={wrapperStyle}>
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          {...commonProps}
        >
          {content}
        </button>
      </div>
    );
  },
);

const wrapperStyle = {
  position: "relative",
  display: "inline-flex",
  marginTop: "8px",
};

const folderTabStyleBase = {
  position: "absolute",
  top: "-8px",
  left: "0",
  height: "8px",
  width: "40%",
  borderRadius: "3px 3px 0 0",
  display: "flex",
  alignItems: "center",
  padding: "0 8px",
  gap: "2px",
  transition: "background 0.2s ease",
};

const folderTabStyle = (bgColor) => ({
  background: bgColor,
});

const folderTabDotStyle = {
  width: "3px",
  height: "3px",
  background: "rgba(255,255,255,0.6)",
  borderRadius: "50%",
};

const folderBodyStyleBase = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "10px 18px",
  textDecoration: "none",
  borderRadius: "0 4px 4px 4px",
  border: "2px solid",
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  fontSize: "13px",
  letterSpacing: "1px",
  fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
  position: "relative",
  minWidth: "120px",
  whiteSpace: "nowrap",
};

const labelStyleBase = {
  flex: 1,
};

const dotStyle = {
  width: "6px",
  height: "6px",
  borderRadius: "50%",
  flexShrink: 0,
};

export default FolderButton;
