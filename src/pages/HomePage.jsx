import React, { useState, useMemo } from "react";
import { theme } from "../styles/theme";
import { CHART_CATEGORIES, getAllCharts } from "../utils/chartTypes";
import ChartCard from "../components/common/ChartCard";
import Header from "../components/layout/Header";

const HomePage = ({ onSelectChart }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

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

  return (
    <div style={pageStyle}>
      <Header currentPage="home" />

      <div style={contentStyle}>
        {/* Hero Section */}
        <div style={heroStyle}>
          <h2 style={heroTitleStyle}>📊 FORGE YOUR DATA</h2>
          <p style={heroSubtitleStyle}>
            Choose from <span style={countStyle}>{allCharts.length}</span> chart
            types
          </p>

          {/* Search Bar - Folder Style */}
          <div style={searchWrapperStyle}>
            <div style={searchTabStyle}>
              <div style={searchDotStyle("#ff6b6b")} />
              <div style={searchDotStyle("#ffd93d")} />
              <div style={searchDotStyle("#6bcb77")} />
            </div>
            <div style={searchContainerStyle}>
              <span style={searchIconStyle}>⌕</span>
              <input
                type="text"
                placeholder="SEARCH CHARTS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={searchInputStyle}
              />
            </div>
          </div>
        </div>

        {/* Category Filters - Folder Style Buttons */}
        <div style={filterWrapperStyle}>
          <div style={filterTabStyle("all", activeCategory === "all")}>
            <div style={filterDotStyle} />
            <div style={filterDotStyle} />
            <div style={filterDotStyle} />
          </div>
          <div style={filterContainerStyle}>
            <button
              onClick={() => setActiveCategory("all")}
              style={filterBtnStyle(activeCategory === "all", "#ffffff")}
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

        {/* Empty State */}
        {filteredCharts.length === 0 && (
          <div style={emptyStyle}>
            <span style={{ fontSize: "48px" }}>📂</span>
            <p style={{ color: theme.colors.text.muted }}>NO CHARTS FOUND</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ===== STYLES =====
const pageStyle = {
  background: "#0a0e14",
  minHeight: "100vh",
  fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
};

const contentStyle = {
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "32px 24px",
};

const heroStyle = {
  textAlign: "center",
  padding: "40px 0 48px",
};

const heroTitleStyle = {
  color: "#f0f6fc",
  fontSize: "32px",
  fontWeight: 700,
  letterSpacing: "4px",
  margin: "0 0 12px 0",
};

const heroSubtitleStyle = {
  color: "#8b949e",
  fontSize: "14px",
  letterSpacing: "1px",
  margin: "0 0 32px 0",
};

const countStyle = {
  color: "#58a6ff",
  fontWeight: 700,
};

// Search Bar - Folder Style
const searchWrapperStyle = {
  maxWidth: "520px",
  margin: "0 auto",
  position: "relative",
};

const searchTabStyle = {
  position: "absolute",
  top: "-10px",
  left: "0",
  width: "40%",
  height: "10px",
  background: "#21262d",
  borderRadius: "3px 3px 0 0",
  display: "flex",
  alignItems: "center",
  padding: "0 10px",
  gap: "4px",
};

const searchDotStyle = (color) => ({
  width: "5px",
  height: "5px",
  background: color,
  borderRadius: "50%",
});

const searchContainerStyle = {
  position: "relative",
  border: "1px solid #30363d",
  borderRadius: "0 6px 6px 6px",
  background: "#161b22",
  overflow: "hidden",
};

const searchIconStyle = {
  position: "absolute",
  left: "14px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#8b949e",
  fontSize: "18px",
};

const searchInputStyle = {
  width: "100%",
  padding: "14px 16px 14px 40px",
  background: "transparent",
  border: "none",
  color: "#c9d1d9",
  fontSize: "13px",
  fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
  letterSpacing: "1px",
  outline: "none",
  boxSizing: "border-box",
};

// Category Filters - Folder Style
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
  background: isActive ? "#58a6ff" : "#21262d",
  borderRadius: "3px 3px 0 0",
  display: "flex",
  alignItems: "center",
  padding: "0 10px",
  gap: "4px",
});

const filterDotStyle = {
  width: "4px",
  height: "4px",
  background: "rgba(255,255,255,0.5)",
  borderRadius: "50%",
};

const filterContainerStyle = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  justifyContent: "center",
  border: "1px solid #30363d",
  borderRadius: "0 6px 6px 6px",
  background: "#161b22",
  padding: "16px",
};

const filterBtnStyle = (isActive, color) => ({
  padding: "8px 16px",
  background: isActive ? `${color}20` : "transparent",
  border: isActive ? `1px solid ${color}` : "1px solid #21262d",
  borderRadius: "3px",
  color: isActive ? color : "#8b949e",
  cursor: "pointer",
  fontSize: "11px",
  fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
  fontWeight: isActive ? 700 : 400,
  letterSpacing: "1px",
  transition: "all 0.15s ease",
  textTransform: "uppercase",
});

// Grid
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
  borderBottom: "1px solid #21262d",
};

const sectionTitleStyle = {
  color: "#f0f6fc",
  fontSize: "15px",
  fontWeight: 700,
  letterSpacing: "2px",
  margin: 0,
  textTransform: "uppercase",
};

const sectionCountStyle = {
  color: "#484f58",
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
  color: "#8b949e",
};

export default HomePage;
