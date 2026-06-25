// src/pages/TemplatesPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import Layout from "../components/layout/Layout";
import businessDashboard from "../templates/businessDashboardTemplate";
import academicReport from "../templates/academicReportTemplate";
import financialAnalysis from "../templates/financialAnalysisTemplate";
import scientificData from "../templates/scientificDataTemplate";
import marketingAnalytics from "../templates/marketingAnalyticsTemplate";
import healthcareReport from "../templates/healthcareReportTemplate";
import ecommerceDashboard from "../templates/ecommerceDashboardTemplate";
import socialMediaAnalytics from "../templates/socialMediaAnalyticsTemplate";
import TemplateCard from "../templates/TemplateCard";

const TemplatesPage = () => {
  const navigate = useNavigate();
  const { t, language, isRTL } = useLanguage();

  const templates = [
    businessDashboard,
    academicReport,
    financialAnalysis,
    scientificData,
    marketingAnalytics,
    healthcareReport,
    ecommerceDashboard,
    socialMediaAnalytics,
  ].map((tpl) => ({
    ...tpl,
    // allow translations from context if available
    title:
      t && typeof t === "function"
        ? t(`templates.${tpl.id}`) || tpl.title
        : tpl.title,
    description:
      t && typeof t === "function"
        ? t(`templates.${tpl.id}Desc`) || tpl.description
        : tpl.description,
    tag:
      t && typeof t === "function"
        ? t(`templates.${tpl.id}Tag`) || tpl.tag
        : tpl.tag,
  }));

  const handleTemplateClick = (templateId) => {
    console.log(`Opening template: ${templateId}`);
    // navigate(`/chart/template/${templateId}`);
  };

  return (
    <Layout currentPath="/templates">
      <div style={contentStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h2 style={titleStyle}>📁 {t("templates.title") || "Templates"}</h2>
          <p style={textStyle}>
            {t("templates.description") ||
              "Start quickly with pre-built chart combinations."}
          </p>
          <div style={statsStyle}>
            <span style={statItemStyle}>
              <span style={statNumberStyle}>{templates.length}</span>
              <span style={statLabelStyle}>
                {t("templates.stats.templates") || "Templates"}
              </span>
            </span>
            <span style={statDividerStyle}>|</span>
            <span style={statItemStyle}>
              <span style={statNumberStyle}>5</span>
              <span style={statLabelStyle}>
                {t("templates.stats.categories") || "Categories"}
              </span>
            </span>
            <span style={statDividerStyle}>|</span>
            <span style={statItemStyle}>
              <span style={statNumberStyle}>30+</span>
              <span style={statLabelStyle}>
                {t("templates.stats.chartTypes") || "Chart Types"}
              </span>
            </span>
          </div>
        </div>

        {/* Templates Grid - Folder Design (matching ChartCard) */}
        <div style={gridStyle}>
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onClick={(id) => handleTemplateClick(id)}
            />
          ))}
        </div>

        {/* Coming Soon Section */}
        <div style={comingSoonStyle}>
          <span style={comingSoonIconStyle}>🚀</span>
          <h3 style={comingSoonTitleStyle}>
            {t("templates.comingSoon") || "More Templates Coming Soon"}
          </h3>
          <p style={comingSoonTextStyle}>
            {t("templates.comingSoonDesc") ||
              "We're constantly adding new templates. Stay tuned for updates!"}
          </p>
        </div>
      </div>
    </Layout>
  );
};

// ============================================
// STYLES
// ============================================

const contentStyle = {
  maxWidth: "1400px",
  margin: "0 auto",
};

const headerStyle = {
  marginBottom: "32px",
};

const titleStyle = {
  color: "#4A3728",
  fontSize: "28px",
  fontWeight: 700,
  letterSpacing: "3px",
  marginBottom: "8px",
};

const textStyle = {
  color: "#8A7A6A",
  fontSize: "14px",
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
  marginBottom: "16px",
  letterSpacing: "1px",
};

const statsStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  marginTop: "12px",
};

const statItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

const statNumberStyle = {
  color: "#8A7A6A",
  fontSize: "18px",
  fontWeight: 700,
};

const statLabelStyle = {
  color: "#8A7A6A",
  fontSize: "11px",
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
  textTransform: "uppercase",
  letterSpacing: "1px",
};

const statDividerStyle = {
  color: "#D4C4AE",
  fontSize: "14px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "24px",
  marginBottom: "40px",
};

const cardWrapperStyle = {
  position: "relative",
  marginTop: "12px",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

const folderTabStyle = (color) => ({
  position: "absolute",
  top: "-12px",
  left: "0",
  height: "12px",
  width: "60%",
  background: color,
  borderRadius: "3px 3px 0 0",
  display: "flex",
  alignItems: "center",
  padding: "0 8px",
  zIndex: 1,
});

const folderTabDotStyle = {
  width: "4px",
  height: "4px",
  background: "rgba(255,255,255,0.6)",
  borderRadius: "50%",
  marginRight: "3px",
};

const folderBodyStyle = (color) => ({
  background: `linear-gradient(135deg, ${color}dd, ${color}99)`,
  border: `1px solid ${color}`,
  borderRadius: "0 4px 4px 4px",
  padding: "20px 16px 16px",
  minHeight: "200px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  position: "relative",
  overflow: "hidden",
  boxShadow: `0 4px 12px ${color}40`,
  transition: "all 0.3s ease",
});

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

const iconStyle = {
  fontSize: "36px",
  lineHeight: 1,
  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
};

const cardTitleStyle = {
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: 700,
  letterSpacing: "1px",
  margin: 0,
  fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
  textShadow: "0 1px 2px rgba(0,0,0,0.3)",
};

const cardTextStyle = {
  color: "rgba(255,255,255,0.85)",
  fontSize: "12px",
  margin: 0,
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
  lineHeight: 1.5,
  textShadow: "0 1px 2px rgba(0,0,0,0.2)",
};

const categoryStyle = (color) => ({
  color: "rgba(255,255,255,0.9)",
  fontSize: "9px",
  fontWeight: 600,
  letterSpacing: "1px",
  textTransform: "uppercase",
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
  marginTop: "4px",
  background: "rgba(0,0,0,0.2)",
  padding: "2px 8px",
  borderRadius: "2px",
  alignSelf: "flex-start",
});

const chartTypesStyle = {
  display: "flex",
  gap: "4px",
  flexWrap: "wrap",
  marginTop: "4px",
};

const chartTagStyle = {
  padding: "2px 8px",
  background: "rgba(255,255,255,0.2)",
  borderRadius: "3px",
  fontSize: "8px",
  color: "rgba(255,255,255,0.9)",
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
  letterSpacing: "0.5px",
};

const tagStyle = (color) => ({
  position: "absolute",
  top: "12px",
  right: "12px",
  padding: "2px 10px",
  background: "rgba(255,255,255,0.25)",
  color: "#FFFFFF",
  fontSize: "8px",
  fontWeight: 700,
  letterSpacing: "1px",
  borderRadius: "3px",
  textTransform: "uppercase",
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
  backdropFilter: "blur(4px)",
  border: "1px solid rgba(255,255,255,0.2)",
});

const comingSoonStyle = {
  textAlign: "center",
  padding: "40px",
  background: "#FFFFFF",
  border: "1px solid #D4C4AE",
  borderRadius: "6px",
  marginTop: "20px",
};

const comingSoonIconStyle = {
  fontSize: "32px",
  display: "block",
  marginBottom: "12px",
};

const comingSoonTitleStyle = {
  color: "#4A3728",
  fontSize: "18px",
  fontWeight: 700,
  marginBottom: "8px",
  fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
};

const comingSoonTextStyle = {
  color: "#8A7A6A",
  fontSize: "13px",
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
};

export default TemplatesPage;
