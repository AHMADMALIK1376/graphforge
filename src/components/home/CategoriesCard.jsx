// src/components/home/CategoriesCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { CHART_CATEGORIES } from "../../utils/chartTypes";
import FolderButton from "../common/FolderButton";

const CategoriesCard = ({ categoryCounts }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    navigate(`/charts?category=${categoryId}`);
  };

  return (
    <div style={categoryWrapperStyle}>
      <div style={categoryFolderTabStyle}>
        <div style={categoryDotStyle} />
        <div style={categoryDotStyle} />
        <div style={categoryDotStyle} />
      </div>
      <div style={categoryFolderBodyStyle}>
        <div style={categoryContentStyle}>
          <div style={categoryHeaderStyle}>
            <h3 style={categoryTitleStyle}>Chart Categories</h3>
            <span style={categoryCountStyle}>
              {Object.keys(CHART_CATEGORIES).length} categories
            </span>
          </div>
          <div style={categoryGridStyle}>
            {Object.entries(CHART_CATEGORIES).map(([key, cat]) => {
              const count = categoryCounts[key];

              return (
                <div key={key} style={categoryCardWrapperStyle}>
                  <FolderButton
                    onClick={() => handleCategoryClick(key)}
                    baseColor={cat.color}
                    hoverColor="#0077C8"
                    activeColor="#0077C8"
                    bodyStyle={{
                      padding: "12px 10px",
                      minHeight: "60px",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span style={{ ...categoryNumberStyle }}>{count}</span>
                      <span style={{ ...categoryLabelStyle }}>
                        {cat.label.replace(/[^\w\s]/g, "").trim()}
                      </span>
                    </div>
                  </FolderButton>
                </div>
              );
            })}
          </div>
        </div>

        <div style={categoryLinesStyle}>
          <div style={{ ...categoryLineStyle, width: "100%" }} />
          <div style={{ ...categoryLineStyle, width: "70%" }} />
          <div style={{ ...categoryLineStyle, width: "85%" }} />
        </div>
      </div>
    </div>
  );
};

// ===== STYLES =====
const categoryWrapperStyle = {
  position: "relative",
  marginTop: "12px",
  marginBottom: "32px",
  width: "100%",
  maxWidth: "900px",
};

const categoryFolderTabStyle = {
  position: "absolute",
  top: "-12px",
  left: "0",
  height: "12px",
  width: "60%",
  maxWidth: "300px",
  background: "#F88379",
  borderRadius: "3px 3px 0 0",
  display: "flex",
  alignItems: "center",
  padding: "0 8px",
  gap: "3px",
};

const categoryDotStyle = {
  width: "4px",
  height: "4px",
  background: "rgba(255,255,255,0.6)",
  borderRadius: "50%",
};

const categoryFolderBodyStyle = {
  background: "linear-gradient(135deg, #F88379dd, #F8837999)",
  border: "1px solid #F88379",
  borderRadius: "0 4px 4px 4px",
  padding: "32px 36px 48px",
  boxShadow: "0 4px 16px rgba(248,131,121,0.25)",
  position: "relative",
  overflow: "hidden",
};

const categoryContentStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const categoryHeaderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const categoryTitleStyle = {
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: 700,
  letterSpacing: "2px",
  margin: 0,
  fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
  textShadow: "0 1px 2px rgba(0,0,0,0.15)",
};

const categoryCountStyle = {
  color: "rgba(255,255,255,0.7)",
  fontSize: "11px",
  letterSpacing: "1px",
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
};

const categoryGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "10px",
  maxWidth: "420px",
};

const categoryCardWrapperStyle = {
  position: "relative",
  marginTop: "8px",
  cursor: "pointer",
  transition: "transform 0.2s ease",
};

const categoryCardTabStyle = (color) => ({
  position: "absolute",
  top: "-6px",
  left: "0",
  height: "6px",
  width: "50%",
  background: color,
  borderRadius: "3px 3px 0 0",
  display: "flex",
  alignItems: "center",
  padding: "0 5px",
  gap: "2px",
  transition: "background 0.25s ease, border-color 0.25s ease",
});

const categoryDotSmallStyle = {
  width: "2px",
  height: "2px",
  background: "rgba(255,255,255,0.6)",
  borderRadius: "50%",
};

const categoryCardBodyStyle = (bgColor, borderColor, textColor, isHovered) => ({
  background: bgColor,
  border: `1px solid ${borderColor}`,
  borderRadius: "0 4px 4px 4px",
  padding: "12px 10px",
  color: textColor,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "2px",
  transition: "all 0.25s ease",
  boxShadow: isHovered
    ? `0 8px 24px ${borderColor}40`
    : "0 2px 8px rgba(180,160,140,0.06)",
  minHeight: "60px",
  position: "relative",
});

const categoryNumberStyle = {
  fontSize: "22px",
  fontWeight: 700,
  color: "inherit",
  fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
  letterSpacing: "0.5px",
};

const categoryLabelStyle = {
  fontSize: "8px",
  fontWeight: 600,
  color: "inherit",
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
  textAlign: "center",
};

const categoryLinesStyle = {
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

const categoryLineStyle = {
  height: "2px",
  background: "#ffffff",
  borderRadius: "1px",
};

export default CategoriesCard;
