// src/pages/CategoryChartsPage.jsx
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CHART_CATEGORIES, getAllCharts } from "../utils/chartTypes";
import Layout from "../components/layout/Layout";
import { useLanguage } from "../context/LanguageContext";

// Map chart IDs to their custom logo paths - ALL 22 Comparison Charts
const chartLogoPaths = {
  barChart: require("../assets/logos/Chartslogos/comparisionsection/1barchart.png"),
  columnChart: require("../assets/logos/Chartslogos/comparisionsection/2columnchart.png"),
  groupedBar: require("../assets/logos/Chartslogos/comparisionsection/3groupedbar.png"),
  lollipop: require("../assets/logos/Chartslogos/comparisionsection/4lolliupop.png"),
  bullet: require("../assets/logos/Chartslogos/comparisionsection/5bulletchart.png"),
  dotPlot: require("../assets/logos/Chartslogos/comparisionsection/6dotplot.png"),
  dumbbell: require("../assets/logos/Chartslogos/comparisionsection/7dumblechart.png"),
  pictogram: require("../assets/logos/Chartslogos/comparisionsection/8pictogram.png"),
  iconChart: require("../assets/logos/Chartslogos/comparisionsection/9iconchart.png"),
  rangeChart: require("../assets/logos/Chartslogos/comparisionsection/10rangechart.png"),
  radialBar: require("../assets/logos/Chartslogos/comparisionsection/11radilabar.png"),
  parallelCoordinates: require("../assets/logos/Chartslogos/comparisionsection/12parallelchart.png"),
  radar: require("../assets/logos/Chartslogos/comparisionsection/13radarchart.png"),
  nightingale: require("../assets/logos/Chartslogos/comparisionsection/14nightinglechart.png"),
  waterfall: require("../assets/logos/Chartslogos/comparisionsection/15waterfallchart.png"),
  matrix: require("../assets/logos/Chartslogos/comparisionsection/16matrixchart.png"),
  smallMultiples: require("../assets/logos/Chartslogos/comparisionsection/17smallmultiple.png"),
  wordCloud: require("../assets/logos/Chartslogos/comparisionsection/18wordchart.png"),
  slope: require("../assets/logos/Chartslogos/comparisionsection/19slopchart.png"),
  table: require("../assets/logos/Chartslogos/comparisionsection/20tablechart.png"),
  categoricalScatter: require("../assets/logos/Chartslogos/comparisionsection/21CATEGORICALchart.png"),
  quadrant: require("../assets/logos/Chartslogos/comparisionsection/22quadrantchart.png"),
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

        <div style={gridStyle}>
          {charts.map((chart) => {
            const customLogo = chartLogoPaths[chart.id];
            return (
              <div
                key={chart.id}
                onClick={() => navigate(`/chart/${chart.id}`)}
                style={fileCardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 25px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(0,0,0,0.06)";
                }}
              >
                <div style={fileCornerStyle(category.color)} />
                <div style={chartIconStyle}>
                  {customLogo ? (
                    <img
                      src={customLogo}
                      alt={chart.name}
                      style={logoImageStyle}
                    />
                  ) : (
                    chart.icon
                  )}
                </div>
                <div style={lineStyle} />
                <div style={lineStyle} />
                <div style={lineStyle} />
                {chart.description && (
                  <div style={chartDescStyle}>{chart.description}</div>
                )}
                <div
                  style={{ ...labelBarStyle, backgroundColor: category.color }}
                >
                  {chart.name.toUpperCase()}
                </div>
              </div>
            );
          })}
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
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: "24px",
};
const fileCardStyle = {
  position: "relative",
  width: "100%",
  minHeight: "220px",
  backgroundColor: "#f9f9f9",
  border: "1px solid #e0e0e0",
  borderRadius: "2px 18px 2px 2px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: "16px 10px 0",
  gap: "6px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  overflow: "hidden",
};
const fileCornerStyle = (color) => ({
  position: "absolute",
  top: 0,
  right: 0,
  width: "28px",
  height: "28px",
  background: `linear-gradient(135deg, transparent 50%, ${color} 50%)`,
  borderBottomLeftRadius: "2px",
  zIndex: 2,
  boxShadow: "-2px 2px 4px rgba(0,0,0,0.2)",
});
const chartIconStyle = {
  fontSize: "32px",
  marginTop: "4px",
  zIndex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const logoImageStyle = { width: "50px", height: "50px", objectFit: "contain" };
const lineStyle = {
  width: "65%",
  height: "2px",
  backgroundColor: "#e0e0e0",
  borderRadius: "1px",
};
const chartDescStyle = {
  fontSize: "9px",
  color: "#8A7A6A",
  textAlign: "center",
  lineHeight: 1.3,
  padding: "0 6px",
  minHeight: "26px",
};
const labelBarStyle = {
  width: "110%",
  padding: "8px 8px 6px",
  color: "#ffffff",
  textAlign: "center",
  fontWeight: 400,
  fontSize: "13.5px",
  letterSpacing: "1px",
  fontFamily: "'Bungee', cursive",
  boxShadow: "0 -2px 6px rgba(0,0,0,0.1)",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  marginTop: "8px",
};
const emptyStyle = { textAlign: "center", padding: "80px 0" };

export default CategoryChartsPage;
