// src/pages/ChartListPage.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { theme } from "../styles/theme";
import { CHART_CATEGORIES, getAllCharts } from "../utils/chartTypes";
import ChartCard from "../components/common/ChartCard";
import Layout from "../components/layout/Layout";
import SearchBar from "../components/common/SearchBar";
import FolderButton from "../components/common/FolderButton";
import PageHeader from "../components/common/PageHeader";
import { useLanguage } from "../context/LanguageContext";

const ChartListPage = ({ onSelectChart }) => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(() => {
    const initialCategory = searchParams.get("category");
    return initialCategory && CHART_CATEGORIES[initialCategory]
      ? initialCategory
      : "all";
  });

  const allCharts = useMemo(() => getAllCharts(), []);

  const [openSections, setOpenSections] = useState({});

  const filteredCharts = useMemo(() => {
    return allCharts.filter((chart) => {
      const matchesSearch =
        chart.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chart.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        activeCategory === "all" || chart.categoryId === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory, allCharts]);

  const groupedCharts = useMemo(() => {
    const groups = {};
    filteredCharts.forEach((chart) => {
      if (!groups[chart.categoryId]) {
        groups[chart.categoryId] = {
          categoryName: chart.categoryName,
          categoryColor: chart.categoryColor,
          charts: [],
        };
      }
      groups[chart.categoryId].charts.push(chart);
    });
    return groups;
  }, [filteredCharts]);

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    const validatedCategory =
      categoryFromUrl && CHART_CATEGORIES[categoryFromUrl]
        ? categoryFromUrl
        : "all";

    setActiveCategory(validatedCategory);
  }, [searchParams]);

  const handleSetCategory = (cat) => {
    setActiveCategory(cat);
    if (cat === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  useEffect(() => {
    const keys = Object.keys(groupedCharts);
    const initial = {};
    keys.forEach((k) => (initial[k] = true));
    setOpenSections(initial);
  }, [groupedCharts]);

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Get category counts
  const categoryCounts = useMemo(() => {
    const counts = {};
    Object.entries(CHART_CATEGORIES).forEach(([key, cat]) => {
      counts[key] = Object.keys(cat.charts).length;
    });
    return counts;
  }, []);

  return (
    <Layout currentPath="/charts">
      <div style={contentStyle}>
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

        {/* Category Filters - Folder Style */}
        <div style={filterWrapperStyle}>
          <div style={filterTabStyle("all", activeCategory === "all")}>
            <div style={filterDotStyle} />
            <div style={filterDotStyle} />
            <div style={filterDotStyle} />
          </div>
          <div style={filterContainerStyle}>
            <FolderButton
              onClick={() => handleSetCategory("all")}
              baseColor={activeCategory === "all" ? "#D41F26" : "#A8DCF0"}
              active={activeCategory === "all"}
            >
              📂 ALL [{allCharts.length}]
            </FolderButton>
            {Object.entries(CHART_CATEGORIES).map(([key, cat]) => (
              <FolderButton
                key={key}
                onClick={() => handleSetCategory(key)}
                baseColor={cat.color}
                active={activeCategory === key}
              >
                {cat.label} [{Object.keys(cat.charts).length}]
              </FolderButton>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div style={gridContainerStyle}>
          {Object.entries(groupedCharts).map(([catKey, group]) => (
            <div key={catKey} style={sectionStyle}>
              <div style={sectionHeaderStyle}>
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    background: group.categoryColor,
                    borderRadius: "2px",
                    display: "inline-block",
                  }}
                />
                <h3 style={sectionTitleStyle}>{group.categoryName}</h3>
                <span style={sectionCountStyle}>
                  {group.charts.length} charts
                </span>
                <button
                  style={toggleBtnStyle}
                  onClick={() => toggleSection(catKey)}
                >
                  {openSections[catKey] ? "Hide" : "Show"}
                </button>
              </div>
              {openSections[catKey] && (
                <div style={gridStyle}>
                  {group.charts.map((chart) => (
                    <ChartCard
                      key={chart.id}
                      chart={chart}
                      onClick={onSelectChart}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredCharts.length === 0 && (
          <div style={emptyStyle}>
            <span style={{ fontSize: "48px" }}>📂</span>
            <p style={{ color: theme.colors.text.muted }}>
              {t("home.noCharts") || "No charts found"}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

// ===== STYLES =====
const contentStyle = {
  maxWidth: "1400px",
  margin: "0 auto",
};

const searchWrapperStyle = {
  marginBottom: "24px",
};

const filterWrapperStyle = {
  marginBottom: "40px",
  position: "relative",
};

const filterTabStyle = (cat, isActive) => ({
  position: "absolute",
  top: "-10px",
  left: "0",
  width: "30%",
  maxWidth: "200px",
  height: "10px",
  background: isActive ? "#A8DCF0" : "#D4C4AE",
  borderRadius: "3px 3px 0 0",
  display: "flex",
  alignItems: "center",
  padding: "0 10px",
  gap: "4px",
});

const filterDotStyle = {
  width: "4px",
  height: "4px",
  background: "rgba(255,255,255,0.6)",
  borderRadius: "50%",
};

const filterContainerStyle = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  justifyContent: "center",
  border: "1px solid #D4C4AE",
  borderRadius: "0 6px 6px 6px",
  background: "#FFFFFF",
  padding: "16px",
  boxShadow: "0 2px 8px rgba(180,160,140,0.10)",
};

const gridContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "40px",
};

const sectionStyle = {};

const sectionHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "20px",
  paddingBottom: "8px",
  borderBottom: "1px solid #E8DCC8",
};

const sectionTitleStyle = {
  color: "#4A3728",
  fontSize: "15px",
  fontWeight: 700,
  letterSpacing: "2px",
  margin: 0,
  textTransform: "uppercase",
};

const sectionCountStyle = {
  color: "#8A7A6A",
  fontSize: "10px",
  letterSpacing: "1px",
};

const toggleBtnStyle = {
  marginLeft: "12px",
  padding: "6px 10px",
  borderRadius: "4px",
  border: "1px solid #E8DCC8",
  background: "#FFFFFF",
  cursor: "pointer",
  fontSize: "12px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: "20px",
  paddingTop: "12px",
};

const emptyStyle = {
  textAlign: "center",
  padding: "80px 0",
  color: "#8A7A6A",
};

export default ChartListPage;
