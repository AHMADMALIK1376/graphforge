// src/pages/ChartListPage.jsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import lottie from "lottie-web";
import forgeAnimation from "../assets/lootiefiles/MxoeM9KC8Y.json";
import comparisonAnimation from "../assets/lootiefiles/JeSv7vYZBK.json";
import correlationAnimation from "../assets/lootiefiles/nM3kWOM2IG.json";
import { CHART_CATEGORIES, getAllCharts } from "../utils/chartTypes";
import Layout from "../components/layout/Layout";
import SearchBar from "../components/common/SearchBar";
import PageHeader from "../components/common/PageHeader";
import CategoryInfoPopup from "../components/common/CategoryInfoPopup";
import { useLanguage } from "../context/LanguageContext";

// Map each category to its specific Lottie animation
const categoryAnimations = {
  comparison: comparisonAnimation,
  correlation: correlationAnimation,
  partToWhole: forgeAnimation,
  temporal: forgeAnimation,
  distribution: forgeAnimation,
  geospatial: forgeAnimation,
};

const ChartListPage = ({ onSelectChart }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [infoPopupCategory, setInfoPopupCategory] = useState(null);

  const allCharts = useMemo(() => getAllCharts(), []);

  const categoryCounts = useMemo(() => {
    const counts = {};
    Object.entries(CHART_CATEGORIES).forEach(([key, cat]) => {
      counts[key] = Object.keys(cat.charts).length;
    });
    return counts;
  }, []);

  const openCategoryPage = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  const openInfoPopup = (categoryId) => {
    setInfoPopupCategory(categoryId);
  };

  const closeInfoPopup = () => {
    setInfoPopupCategory(null);
  };

  // Lottie refs for each folder card
  const lottieRefs = useRef({});

  useEffect(() => {
    Object.entries(CHART_CATEGORIES).forEach(([key]) => {
      const container = lottieRefs.current[key];
      if (!container) return;

      let anim = null;
      try {
        anim = lottie.loadAnimation({
          container,
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData: categoryAnimations[key] || forgeAnimation,
          rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
        });
      } catch (err) {
        console.error(`Lottie error for ${key}:`, err);
      }

      lottieRefs.current[`${key}-anim`] = anim;
    });

    return () => {
      Object.entries(CHART_CATEGORIES).forEach(([key]) => {
        const anim = lottieRefs.current[`${key}-anim`];
        if (anim) anim.destroy();
      });
    };
  }, []);

  return (
    <Layout currentPath="/charts">
      <div style={pageContentStyle}>
        <PageHeader
          allCharts={allCharts.length}
          categoryCounts={categoryCounts}
        />

        {/* Search Bar */}
        <div style={searchWrapperStyle}>
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("home.search") || "Search charts..."}
          />
        </div>

        {/* Folder Cards – 2 per row, 3 rows */}
        <div style={folderGridStyle}>
          {Object.entries(CHART_CATEGORIES).map(([key, cat]) => (
            <div
              key={key}
              style={categoryWrapperStyle}
              onClick={() => openCategoryPage(key)}
            >
              {/* Folder tab */}
              <div style={categoryFolderTabStyle(cat.color)}>
                <span style={categoryDotStyle} />
                <span style={categoryDotStyle} />
                <span style={categoryDotStyle} />
              </div>

              {/* Three-dot info button */}
              <div
                style={threeDotContainerStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  openInfoPopup(key);
                }}
              >
                <span style={threeDotSingleStyle} />
                <span style={threeDotSingleStyle} />
                <span style={threeDotSingleStyle} />
              </div>

              {/* Folder body */}
              <div style={categoryFolderBodyStyle(cat.color)}>
                <div style={categoryInnerRowStyle}>
                  {/* Left side: number + title */}
                  <div style={categoryLeftAreaStyle}>
                    <div style={categoryHeaderStyle}>
                      <h3 style={categoryTitleStyle}>
                        {cat.label.replace(/[^\w\s]/g, "").trim()}
                      </h3>
                    </div>
                    <div style={categoryNumberAreaStyle}>
                      <span style={categoryNumberStyle}>
                        {categoryCounts[key]}
                      </span>
                      <span style={categoryNumberLabelStyle}>charts</span>
                    </div>
                    <span style={categoryCountStyle}>
                      {categoryCounts[key]} charts
                    </span>
                  </div>

                  {/* Right side: Lottie Animation */}
                  <div style={lottieContainerStyle}>
                    <div
                      ref={(el) => (lottieRefs.current[key] = el)}
                      style={lottieStyle}
                    />
                  </div>
                </div>

                {/* Decorative lines */}
                <div style={categoryLinesStyle}>
                  <div style={{ ...categoryLineStyle, width: "100%" }} />
                  <div style={{ ...categoryLineStyle, width: "70%" }} />
                  <div style={{ ...categoryLineStyle, width: "85%" }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Popup */}
        {infoPopupCategory && (
          <CategoryInfoPopup
            categoryId={infoPopupCategory}
            onClose={closeInfoPopup}
          />
        )}
      </div>
    </Layout>
  );
};

// ===== STYLES =====
const pageContentStyle = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "0 16px",
};
const searchWrapperStyle = { marginBottom: "24px" };

const folderGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "24px",
};

const categoryWrapperStyle = {
  position: "relative",
  cursor: "pointer",
  transition: "transform 0.2s ease",
};

const categoryFolderTabStyle = (color) => ({
  position: "absolute",
  top: "-10px",
  left: "0",
  height: "10px",
  width: "55%",
  maxWidth: "240px",
  background: color,
  borderRadius: "3px 3px 0 0",
  display: "flex",
  alignItems: "center",
  padding: "0 6px",
  gap: "3px",
});
const categoryDotStyle = {
  width: "3px",
  height: "3px",
  background: "rgba(255,255,255,0.6)",
  borderRadius: "50%",
};

const categoryFolderBodyStyle = (color) => ({
  background: `linear-gradient(135deg, ${color}dd, ${color}99)`,
  border: `1px solid ${color}`,
  borderRadius: "0 6px 6px 6px",
  padding: "24px 24px 36px",
  boxShadow: `0 4px 16px ${color}40`,
  position: "relative",
  overflow: "hidden",
});

const categoryInnerRowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
};

const categoryLeftAreaStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  flex: "0 0 auto",
};

const categoryHeaderStyle = { display: "flex", alignItems: "center" };
const categoryTitleStyle = {
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: 700,
  letterSpacing: "1.5px",
  margin: 0,
  fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
  textShadow: "0 1px 2px rgba(0,0,0,0.15)",
};
const categoryCountStyle = {
  color: "rgba(255,255,255,0.7)",
  fontSize: "10px",
  letterSpacing: "1px",
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
};

const categoryNumberAreaStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
};
const categoryNumberStyle = {
  fontSize: "34px",
  fontWeight: 700,
  color: "#ffffff",
  fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
  lineHeight: 1,
};
const categoryNumberLabelStyle = {
  fontSize: "9px",
  color: "rgba(255,255,255,0.8)",
  textTransform: "uppercase",
  letterSpacing: "1px",
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
};

const lottieContainerStyle = {
  flex: "0 0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
};
const lottieStyle = { width: "180px", height: "180px" };

const categoryLinesStyle = {
  position: "absolute",
  bottom: "10px",
  left: "12px",
  right: "12px",
  display: "flex",
  flexDirection: "column",
  gap: "3px",
  opacity: 0.3,
  pointerEvents: "none",
};
const categoryLineStyle = {
  height: "2px",
  background: "#ffffff",
  borderRadius: "1px",
};

const threeDotContainerStyle = {
  position: "absolute",
  top: "6px",
  right: "10px",
  display: "flex",
  gap: "3px",
  cursor: "pointer",
  zIndex: 3,
  padding: "4px",
};
const threeDotSingleStyle = {
  width: "4px",
  height: "4px",
  background: "rgba(255,255,255,0.9)",
  borderRadius: "50%",
};

export default ChartListPage;
