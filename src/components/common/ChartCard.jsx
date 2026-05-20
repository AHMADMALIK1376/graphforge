import React from "react";
import { theme, getCategoryColor } from "../../styles/theme";

const ChartCard = ({ chart, onClick }) => {
  const categoryColor = getCategoryColor(chart.categoryId);

  // Folder design - like desktop folders
  const cardStyle = {
    position: "relative",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginTop: "12px",
  };

  // Folder tab (the top part)
  const folderTabStyle = {
    position: "absolute",
    top: "-12px",
    left: "0",
    height: "12px",
    width: "60%",
    background: categoryColor,
    borderRadius: "3px 3px 0 0",
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
  };

  const folderTabDotStyle = {
    width: "4px",
    height: "4px",
    background: "rgba(255,255,255,0.6)",
    borderRadius: "50%",
    marginRight: "3px",
  };

  // Main folder body
  const folderBodyStyle = {
    background: `linear-gradient(135deg, ${categoryColor}dd, ${categoryColor}99)`,
    border: `1px solid ${categoryColor}`,
    borderRadius: "0 4px 4px 4px",
    padding: "20px 16px 16px",
    minHeight: "140px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    position: "relative",
    overflow: "hidden",
    boxShadow: `0 4px 12px ${categoryColor}40`,
  };

  // Folder shine effect
  const shineStyle = {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    height: "40%",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%)",
    borderRadius: "0 4px 0 0",
    pointerEvents: "none",
  };

  // Folder lines effect
  const folderLinesStyle = {
    position: "absolute",
    bottom: "12px",
    left: "16px",
    right: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    opacity: 0.3,
    pointerEvents: "none",
  };

  const lineStyle = {
    height: "2px",
    background: "#ffffff",
    borderRadius: "1px",
  };

  // Content styles
  const iconStyle = {
    fontSize: "36px",
    lineHeight: 1,
    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
  };

  const nameStyle = {
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1px",
    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
    margin: 0,
    lineHeight: 1.3,
  };

  const difficultyStyle = {
    color: "rgba(255,255,255,0.9)",
    fontSize: "10px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "2px",
    background: "rgba(0,0,0,0.2)",
    padding: "2px 8px",
    borderRadius: "2px",
    alignSelf: "flex-start",
  };

  const handleMouseEnter = (e) => {
    const body = e.currentTarget.querySelector(".folder-body");
    body.style.transform = "translateY(-4px)";
    body.style.boxShadow = `0 8px 24px ${categoryColor}60`;
  };

  const handleMouseLeave = (e) => {
    const body = e.currentTarget.querySelector(".folder-body");
    body.style.transform = "translateY(0)";
    body.style.boxShadow = `0 4px 12px ${categoryColor}40`;
  };

  return (
    <div
      style={cardStyle}
      onClick={() => onClick(chart.id)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Folder Tab */}
      <div style={folderTabStyle}>
        <div style={folderTabDotStyle} />
        <div style={folderTabDotStyle} />
        <div style={folderTabDotStyle} />
      </div>

      {/* Folder Body */}
      <div className="folder-body" style={folderBodyStyle}>
        <div style={shineStyle} />

        {/* Icon */}
        <span style={iconStyle}>{chart.icon}</span>

        {/* Name */}
        <h3 style={nameStyle}>{chart.name}</h3>

        {/* Difficulty Badge */}
        <span style={difficultyStyle}>{chart.difficulty}</span>

        {/* Folder Lines (decorative) */}
        <div style={folderLinesStyle}>
          <div style={{ ...lineStyle, width: "100%" }} />
          <div style={{ ...lineStyle, width: "70%" }} />
          <div style={{ ...lineStyle, width: "85%" }} />
        </div>
      </div>
    </div>
  );
};

export default ChartCard;
