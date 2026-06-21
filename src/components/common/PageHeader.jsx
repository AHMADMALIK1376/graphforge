import React from "react";
import { CHART_CATEGORIES } from "../../utils/chartTypes";

const PageHeader = ({
  title = "All Charts",
  subtitle,
  allCharts = 0,
  categoryCounts = {},
  t,
}) => {
  return (
    <div style={pageHeaderStyle}>
      <div style={pageHeaderLeftStyle}>
        <h1 style={pageTitleStyle}>{title}</h1>
        <p style={pageSubtitleStyle}>
          {subtitle ||
            `Browse all ${allCharts} chart types across ${Object.keys(CHART_CATEGORIES).length} categories`}
        </p>
      </div>
      <div style={categoryCountBadgeStyle}>
        {Object.entries(categoryCounts).map(([key, count]) => {
          const cat = CHART_CATEGORIES[key];
          return (
            <span
              key={key}
              style={{
                ...badgeStyle,
                color: cat.color,
                borderColor: cat.color,
              }}
            >
              {cat.label.replace(/[^\w\s]/g, "").trim()} ({count})
            </span>
          );
        })}
      </div>
    </div>
  );
};

const pageHeaderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "24px",
  padding: "16px 20px",
  background: "#FFFFFF",
  borderRadius: "8px",
  border: "1px solid #D4C4AE",
  boxShadow: "0 2px 8px rgba(180,160,140,0.06)",
  flexWrap: "wrap",
  gap: "12px",
};

const pageHeaderLeftStyle = { flex: 1 };

const pageTitleStyle = {
  color: "#4A3728",
  fontSize: "24px",
  fontWeight: 700,
  letterSpacing: "2px",
  margin: "0 0 4px 0",
};

const pageSubtitleStyle = {
  color: "#8A7A6A",
  fontSize: "13px",
  letterSpacing: "1px",
  margin: 0,
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
};

const categoryCountBadgeStyle = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

const badgeStyle = {
  padding: "4px 10px",
  border: "1px solid",
  borderRadius: "4px",
  fontSize: "10px",
  fontWeight: 600,
  letterSpacing: "0.5px",
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
};

export default PageHeader;
