// src/pages/CategoryChartsPage.jsx
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CHART_CATEGORIES, getAllCharts } from "../utils/chartTypes";
import Layout from "../components/layout/Layout";
import { useLanguage } from "../context/LanguageContext";

const difficultyColors = {
  easy: "#4CAF50",
  medium: "#F2D24B",
  hard: "#D15F55",
};

const CategoryChartsPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const category = CHART_CATEGORIES[categoryId];
  const allCharts = useMemo(() => getAllCharts(), []);
  const charts = allCharts.filter((c) => c.categoryId === categoryId);

  if (!category) {
    return (
      <Layout currentPath="/charts">
        <div style={errorStyle}>
          <span style={{ fontSize: "48px" }}>📂</span>
          <p style={{ color: "#8A7A6A" }}>Category not found</p>
          <button onClick={() => navigate("/charts")} style={backButtonStyle}>
            ← Back to Charts
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPath="/charts">
      <div style={pageStyle}>
        {/* Breadcrumb */}
        <div style={breadcrumbStyle}>
          <button
            onClick={() => navigate("/charts")}
            style={breadcrumbLinkStyle}
          >
            ← ALL CHARTS
          </button>
          <span style={breadcrumbSepStyle}>/</span>
          <span style={breadcrumbActiveStyle}>
            {category.label
              .replace(/[^\w\s]/g, "")
              .trim()
              .toUpperCase()}
          </span>
        </div>

        {/* Folder header */}
        <div style={folderWrapperStyle}>
          <div style={folderTabStyle(category.color)}>
            <span style={tabDotStyle} />
            <span style={tabDotStyle} />
            <span style={tabDotStyle} />
          </div>
          <div style={folderBodyStyle(category.color)}>
            <div style={folderHeaderStyle}>
              <h2 style={folderTitleStyle}>
                {category.label} ({charts.length} charts)
              </h2>
              <span style={folderCountStyle}>
                {category.description || "Browse all charts in this category"}
              </span>
            </div>
          </div>
        </div>

        {/* Charts grid */}
        <div style={gridStyle}>
          {charts.map((chart) => (
            <div
              key={chart.id}
              onClick={() => navigate(`/chart/${chart.id}`)}
              style={fileCardStyle(category.color)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
              }}
            >
              {/* Folded corner */}
              <div style={fileCornerStyle(category.color)} />
              <div style={{ fontSize: "36px", marginTop: "8px" }}>
                {chart.icon}
              </div>
              <div style={chartNameStyle}>{chart.name}</div>
              {chart.description && (
                <div style={chartDescStyle}>{chart.description}</div>
              )}
              <span
                style={{
                  ...difficultyBadgeStyle,
                  color: difficultyColors[chart.difficulty] || "#8A7A6A",
                  background: `${difficultyColors[chart.difficulty] || "#8A7A6A"}15`,
                }}
              >
                {chart.difficulty?.toUpperCase()}
              </span>
            </div>
          ))}
        </div>

        {charts.length === 0 && (
          <div style={emptyStyle}>
            <span style={{ fontSize: "48px" }}>📂</span>
            <p style={{ color: "#8A7A6A" }}>No charts found in this category</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

// ===== STYLES =====
const pageStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "24px 16px",
};

const errorStyle = { textAlign: "center", padding: "100px 0" };
const backButtonStyle = {
  marginTop: "16px",
  padding: "10px 20px",
  background: "transparent",
  border: "1px solid #D4C4AE",
  borderRadius: "4px",
  color: "#4A3728",
  cursor: "pointer",
  fontFamily: "'Bungee', cursive",
  letterSpacing: "1px",
};

const breadcrumbStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "24px",
};
const breadcrumbLinkStyle = {
  background: "none",
  border: "none",
  color: "#0077C8",
  cursor: "pointer",
  fontSize: "12px",
  letterSpacing: "1px",
  fontFamily: "'Bungee', cursive",
};
const breadcrumbSepStyle = { color: "#D4C4AE", fontSize: "12px" };
const breadcrumbActiveStyle = {
  color: "#4A3728",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "1px",
  fontFamily: "'Bungee', cursive",
};

const folderWrapperStyle = { position: "relative", marginBottom: "32px" };
const folderTabStyle = (color) => ({
  position: "absolute",
  top: "-12px",
  left: "0",
  height: "12px",
  width: "60%",
  maxWidth: "300px",
  background: color,
  borderRadius: "3px 3px 0 0",
  display: "flex",
  alignItems: "center",
  padding: "0 8px",
  gap: "3px",
});
const tabDotStyle = {
  width: "4px",
  height: "4px",
  background: "rgba(255,255,255,0.6)",
  borderRadius: "50%",
};
const folderBodyStyle = (color) => ({
  background: `linear-gradient(135deg, ${color}dd, ${color}99)`,
  border: `1px solid ${color}`,
  borderRadius: "0 6px 6px 6px",
  padding: "28px 28px 24px",
  boxShadow: `0 4px 16px ${color}40`,
});
const folderHeaderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "8px",
};
const folderTitleStyle = {
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: 700,
  letterSpacing: "2px",
  margin: 0,
  fontFamily: "'Bungee', cursive",
  textShadow: "0 1px 2px rgba(0,0,0,0.15)",
};
const folderCountStyle = {
  color: "rgba(255,255,255,0.8)",
  fontSize: "12px",
  fontFamily: "'Inter', sans-serif",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: "20px",
};

const fileCardStyle = (color) => ({
  background: "#FFFFFF",
  border: `1px solid ${color}33`,
  borderRadius: "8px",
  padding: "20px 16px 16px",
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.2s ease",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  position: "relative",
  overflow: "hidden",
});
const fileCornerStyle = (color) => ({
  position: "absolute",
  top: 0,
  right: 0,
  width: "20px",
  height: "20px",
  background: `linear-gradient(135deg, transparent 50%, ${color} 50%)`,
  borderRadius: "0 0 0 4px",
});
const chartNameStyle = {
  fontSize: "14px",
  fontWeight: 700,
  color: "#4A3728",
  margin: "8px 0 4px",
};
const chartDescStyle = {
  fontSize: "10px",
  color: "#8A7A6A",
  marginBottom: "8px",
  lineHeight: 1.3,
};
const difficultyBadgeStyle = {
  fontSize: "9px",
  fontWeight: 700,
  letterSpacing: "1px",
  padding: "2px 8px",
  borderRadius: "20px",
  display: "inline-block",
};
const emptyStyle = { textAlign: "center", padding: "80px 0" };

export default CategoryChartsPage;
