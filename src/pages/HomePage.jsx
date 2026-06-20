// src/pages/HomePage.jsx
import React, { useState, useMemo } from "react";
import { theme } from "../styles/theme";
import { CHART_CATEGORIES, getAllCharts } from "../utils/chartTypes";
import ChartCard from "../components/common/ChartCard";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import SearchBar from "../components/common/SearchBar";
import { useLanguage } from "../context/LanguageContext";

const HomePage = ({ onSelectChart }) => {
  const { t, language, isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const allCharts = useMemo(() => getAllCharts(), []);

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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "#F5EDE0",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <Header />

      <div
        style={{
          display: "flex",
          flex: 1,
          paddingTop: "64px", // Height of fixed header
          position: "relative",
        }}
      >
        <Sidebar
          currentPath="/home"
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
        />

        <main
          style={{
            flex: 1,
            padding: "24px",
            marginLeft: sidebarOpen ? "250px" : "0",
            overflow: "auto",
            background: "#F5EDE0",
            transition: "margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <div style={contentStyle}>
            {/* Hero Section */}
            <div style={heroStyle}>
              <h2 style={heroTitleStyle}>📊 {t("home.title")}</h2>
              <p style={heroSubtitleStyle}>
                {t("home.subtitle", { count: allCharts.length })}
              </p>

              <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("home.search")}
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
                <button
                  onClick={() => setActiveCategory("all")}
                  style={filterBtnStyle(activeCategory === "all", "#A8DCF0")}
                >
                  📂 ALL [{allCharts.length}]
                </button>
                {Object.entries(CHART_CATEGORIES).map(([key, cat]) => (
                  <button
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    style={filterBtnStyle(activeCategory === key, cat.color)}
                  >
                    {cat.label} [{Object.keys(cat.charts).length}]
                  </button>
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
                  </div>
                  <div style={gridStyle}>
                    {group.charts.map((chart) => (
                      <ChartCard
                        key={chart.id}
                        chart={chart}
                        onClick={onSelectChart}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {filteredCharts.length === 0 && (
              <div style={emptyStyle}>
                <span style={{ fontSize: "48px" }}>📂</span>
                <p style={{ color: theme.colors.text.muted }}>
                  {t("home.noCharts")}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// ===== STYLES =====
const contentStyle = {
  maxWidth: "1400px",
  margin: "0 auto",
};

const heroStyle = {
  textAlign: "center",
  padding: "40px 0 48px",
};

const heroTitleStyle = {
  color: "#4A3728",
  fontSize: "32px",
  fontWeight: 700,
  letterSpacing: "4px",
  margin: "0 0 12px 0",
};

const heroSubtitleStyle = {
  color: "#8A7A6A",
  fontSize: "14px",
  letterSpacing: "1px",
  margin: "0 0 32px 0",
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
  boxShadow: "0 2px 8px rgba(180, 160, 140, 0.10)",
};

const filterBtnStyle = (isActive, color) => ({
  padding: "8px 16px",
  background: isActive ? `${color}20` : "transparent",
  border: isActive ? `1px solid ${color}` : "1px solid #E8DCC8",
  borderRadius: "3px",
  color: isActive ? color : "#8A7A6A",
  cursor: "pointer",
  fontSize: "11px",
  fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
  fontWeight: isActive ? 700 : 400,
  letterSpacing: "1px",
  transition: "all 0.15s ease",
  textTransform: "uppercase",
});

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

export default HomePage;
