// src/pages/AboutPage.jsx
import React from "react";
import { useLanguage } from "../context/LanguageContext";
import Layout from "../components/layout/Layout";

const AboutPage = () => {
  const { t, language, isRTL } = useLanguage();

  // Color palette matching TemplatesPage
  const AEGEAN_BLUE = "#0077C8";
  const CORAL_PINK = "#F88379";
  const LIGHT_YELLOW = "#F2D24B";
  const WARM_BROWN = "#D4A373";
  const GREEN = "#A9C632";

  const features = [
    {
      icon: "📊",
      text: t("about.features.chartTypes") || "69+ Chart Types",
      color: AEGEAN_BLUE,
      tag: "Popular",
    },
    {
      icon: "📁",
      text: t("about.features.categories") || "5 Chart Categories",
      color: CORAL_PINK,
      tag: "Core",
    },
    {
      icon: "📥",
      text:
        t("about.features.export") ||
        "Export to PNG, SVG, PDF, CSV, JSON, Excel",
      color: LIGHT_YELLOW,
      tag: "Pro",
    },
    {
      icon: "🎨",
      text: t("about.features.theme") || "Warm Professional Theme",
      color: GREEN,
      tag: "Design",
    },
    {
      icon: "🔓",
      text: t("about.features.free") || "100% Free & Open Source",
      color: AEGEAN_BLUE,
      tag: "Free",
    },
  ];

  return (
    <Layout currentPath="/about">
      <div style={contentStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            📊 {t("about.title") || "About GraphForge"}
          </h1>
          <p style={subtitleStyle}>
            {t("about.subtitle") ||
              "Forge Your Data Into Visuals — A powerful graph calculator for everyone"}
          </p>
        </div>

        {/* Description - Folder Design with gradient */}
        <div
          style={cardWrapperStyle}
          onMouseEnter={(e) => {
            const body = e.currentTarget.querySelector(".folder-body");
            if (body) {
              body.style.transform = "translateY(-4px)";
              body.style.boxShadow = `0 8px 24px ${AEGEAN_BLUE}60`;
            }
          }}
          onMouseLeave={(e) => {
            const body = e.currentTarget.querySelector(".folder-body");
            if (body) {
              body.style.transform = "translateY(0)";
              body.style.boxShadow = `0 4px 12px ${AEGEAN_BLUE}40`;
            }
          }}
        >
          <div style={folderTabStyle(AEGEAN_BLUE)}>
            <div style={folderTabDotStyle} />
            <div style={folderTabDotStyle} />
            <div style={folderTabDotStyle} />
          </div>
          <div className="folder-body" style={folderBodyStyle(AEGEAN_BLUE)}>
            {/* Shine Effect */}
            <div style={shineStyle} />

            <p style={descriptionStyle}>
              {t("about.description") ||
                "GraphForge is a powerful, cross-platform graph calculator that transforms raw data into stunning professional visualizations. Whether you're a student, researcher, or business professional, GraphForge makes data visualization simple, intuitive, and beautiful."}
            </p>
            <div style={badgeContainerStyle}>
              <span style={badgeStyle}>
                🚀 {t("about.version") || "Version 1.0.0"}
              </span>
              <span style={badgeStyle}>
                📦 {t("about.license") || "MIT License"}
              </span>
              <span style={badgeStyle}>
                🌐 {t("about.openSource") || "Open Source"}
              </span>
            </div>

            {/* Folder Lines (decorative) */}
            <div style={folderLinesStyle}>
              <div style={{ ...lineStyle, width: "100%" }} />
              <div style={{ ...lineStyle, width: "70%" }} />
              <div style={{ ...lineStyle, width: "85%" }} />
            </div>
          </div>
        </div>

        {/* Key Features - Folder Design with gradient */}
        <div
          style={cardWrapperStyle}
          onMouseEnter={(e) => {
            const body = e.currentTarget.querySelector(".folder-body");
            if (body) {
              body.style.transform = "translateY(-4px)";
              body.style.boxShadow = `0 8px 24px ${CORAL_PINK}60`;
            }
          }}
          onMouseLeave={(e) => {
            const body = e.currentTarget.querySelector(".folder-body");
            if (body) {
              body.style.transform = "translateY(0)";
              body.style.boxShadow = `0 4px 12px ${CORAL_PINK}40`;
            }
          }}
        >
          <div style={folderTabStyle(CORAL_PINK)}>
            <div style={folderTabDotStyle} />
            <div style={folderTabDotStyle} />
            <div style={folderTabDotStyle} />
          </div>
          <div className="folder-body" style={folderBodyStyle(CORAL_PINK)}>
            {/* Shine Effect */}
            <div style={shineStyle} />

            <h3 style={sectionTitleStyle}>
              <span style={sectionIconStyle}>✨</span>{" "}
              {t("about.keyFeatures") || "Key Features"}
            </h3>
            <div style={featuresGridStyle}>
              {features.map((feature, index) => (
                <div key={index} style={featureItemStyle(feature.color)}>
                  <span style={featureIconStyle}>{feature.icon}</span>
                  <span style={featureTextStyle}>{feature.text}</span>
                  <span style={featureTagStyle(feature.color)}>
                    {feature.tag}
                  </span>
                </div>
              ))}
            </div>

            {/* Folder Lines (decorative) */}
            <div style={folderLinesStyle}>
              <div style={{ ...lineStyle, width: "100%" }} />
              <div style={{ ...lineStyle, width: "70%" }} />
              <div style={{ ...lineStyle, width: "85%" }} />
            </div>
          </div>
        </div>

        {/* Stats - Folder Design with gradient */}
        <div
          style={cardWrapperStyle}
          onMouseEnter={(e) => {
            const body = e.currentTarget.querySelector(".folder-body");
            if (body) {
              body.style.transform = "translateY(-4px)";
              body.style.boxShadow = `0 8px 24px ${GREEN}60`;
            }
          }}
          onMouseLeave={(e) => {
            const body = e.currentTarget.querySelector(".folder-body");
            if (body) {
              body.style.transform = "translateY(0)";
              body.style.boxShadow = `0 4px 12px ${GREEN}40`;
            }
          }}
        >
          <div style={folderTabStyle(GREEN)}>
            <div style={folderTabDotStyle} />
            <div style={folderTabDotStyle} />
            <div style={folderTabDotStyle} />
          </div>
          <div className="folder-body" style={folderBodyStyle(GREEN)}>
            {/* Shine Effect */}
            <div style={shineStyle} />

            <div style={statsContainerStyle}>
              <div style={statCardStyle}>
                <span style={statNumberStyle}>69+</span>
                <span style={statLabelStyle}>
                  {t("about.stats.chartTypes") || "Chart Types"}
                </span>
              </div>
              <div style={statCardStyle}>
                <span style={statNumberStyle}>5</span>
                <span style={statLabelStyle}>
                  {t("about.stats.categories") || "Categories"}
                </span>
              </div>
              <div style={statCardStyle}>
                <span style={statNumberStyle}>6</span>
                <span style={statLabelStyle}>
                  {t("about.stats.exportFormats") || "Export Formats"}
                </span>
              </div>
              <div style={statCardStyle}>
                <span style={statNumberStyle}>100%</span>
                <span style={statLabelStyle}>
                  {t("about.stats.free") || "Free"}
                </span>
              </div>
            </div>

            {/* Folder Lines (decorative) */}
            <div style={folderLinesStyle}>
              <div style={{ ...lineStyle, width: "100%" }} />
              <div style={{ ...lineStyle, width: "70%" }} />
              <div style={{ ...lineStyle, width: "85%" }} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={footerStyle}>
          <p style={footerTextStyle}>
            {t("about.footer.builtWith") ||
              "Built with ❤️ using React, Recharts, and D3.js"}
          </p>
          <p style={footerVersionStyle}>
            {t("about.version") || "Version 1.0.0"}
          </p>
        </div>
      </div>
    </Layout>
  );
};

// ===== STYLES =====
const contentStyle = {
  maxWidth: "900px",
  margin: "0 auto",
};

const headerStyle = {
  marginBottom: "32px",
};

const titleStyle = {
  color: "#4A3728",
  fontSize: "36px",
  fontWeight: 700,
  letterSpacing: "3px",
  marginBottom: "8px",
};

const subtitleStyle = {
  color: "#8A7A6A",
  fontSize: "16px",
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
  letterSpacing: "1px",
};

// Folder Design Styles (matching TemplatesPage)
const cardWrapperStyle = {
  position: "relative",
  marginTop: "12px",
  marginBottom: "24px",
  cursor: "default",
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
  padding: "24px 24px 40px",
  boxShadow: `0 4px 12px ${color}40`,
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
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

const descriptionStyle = {
  color: "#FFFFFF",
  fontSize: "16px",
  lineHeight: 1.8,
  marginBottom: "16px",
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
  textShadow: "0 1px 2px rgba(0,0,0,0.2)",
};

const badgeContainerStyle = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

const badgeStyle = {
  padding: "4px 12px",
  background: "rgba(255,255,255,0.2)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: "20px",
  fontSize: "10px",
  color: "#FFFFFF",
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
  letterSpacing: "0.5px",
  backdropFilter: "blur(4px)",
};

const sectionTitleStyle = {
  color: "#FFFFFF",
  fontSize: "18px",
  fontWeight: 700,
  letterSpacing: "1px",
  marginBottom: "16px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  textShadow: "0 1px 2px rgba(0,0,0,0.2)",
};

const sectionIconStyle = {
  fontSize: "22px",
};

const featuresGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: "8px",
};

const featureItemStyle = (color) => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "10px 14px",
  background: "rgba(255,255,255,0.15)",
  borderRadius: "4px",
  borderLeft: `3px solid rgba(255,255,255,0.4)`,
  transition: "all 0.15s ease",
  cursor: "default",
  flexWrap: "wrap",
  backdropFilter: "blur(4px)",
});

const featureIconStyle = {
  fontSize: "18px",
};

const featureTextStyle = {
  color: "#FFFFFF",
  fontSize: "13px",
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
  flex: 1,
  textShadow: "0 1px 2px rgba(0,0,0,0.2)",
};

const featureTagStyle = (color) => ({
  fontSize: "8px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "1px",
  padding: "2px 8px",
  background: "rgba(255,255,255,0.25)",
  color: "#FFFFFF",
  borderRadius: "3px",
  border: "1px solid rgba(255,255,255,0.2)",
});

const statsContainerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
  gap: "16px",
};

const statCardStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  background: "rgba(255,255,255,0.15)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: "4px",
  textAlign: "center",
  transition: "all 0.15s ease",
  backdropFilter: "blur(4px)",
};

const statNumberStyle = {
  color: "#FFFFFF",
  fontSize: "28px",
  fontWeight: 700,
  fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
  textShadow: "0 1px 3px rgba(0,0,0,0.2)",
};

const statLabelStyle = {
  color: "rgba(255,255,255,0.85)",
  fontSize: "11px",
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
  letterSpacing: "1px",
  textTransform: "uppercase",
  marginTop: "4px",
  textShadow: "0 1px 2px rgba(0,0,0,0.1)",
};

const footerStyle = {
  textAlign: "center",
  padding: "20px 0",
  borderTop: "1px solid #E8DCC8",
  marginTop: "16px",
};

const footerTextStyle = {
  color: "#8A7A6A",
  fontSize: "13px",
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
  marginBottom: "4px",
};

const footerVersionStyle = {
  color: "#B0A090",
  fontSize: "11px",
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
};

export default AboutPage;
