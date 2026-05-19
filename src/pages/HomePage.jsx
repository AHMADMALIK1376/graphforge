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

  // Group by category for display
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
          <h2 style={heroTitleStyle}>FORGE YOUR DATA</h2>
          <p style={heroSubtitleStyle}>
            Select from <span style={countStyle}>{allCharts.length}</span> chart
            types across <span style={countStyle}>5</span> categories
          </p>

          {/* Search */}
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

        {/* Category Filters */}
        <div style={filterContainerStyle}>
          <button
            onClick={() => setActiveCategory("all")}
            style={filterBtnStyle(
              activeCategory === "all",
              theme.colors.text.heading,
            )}
          >
            ALL [{allCharts.length}]
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

        {/* Charts Grid */}
        <div style={gridContainerStyle}>
          {Object.entries(groupedCharts).map(([catKey, group]) => (
            <div key={catKey} style={sectionStyle}>
              <div style={sectionHeaderStyle}>
                <span
                  style={{
                    ...sectionDotStyle,
                    background: group.categoryColor,
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
            <span style={{ fontSize: "48px" }}>⌕</span>
            <p style={{ color: theme.colors.text.muted }}>NO CHARTS FOUND</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ===== STYLES =====
const pageStyle = {
  background: theme.colors.mainBg,
  minHeight: "100vh",
  fontFamily: theme.typography.fontFamily.primary,
};

const contentStyle = {
  maxWidth: "1400px",
  margin: "0 auto",
  padding: theme.spacing.xl,
};

const heroStyle = {
  textAlign: "center",
  padding: `${theme.spacing.xxl} 0`,
  borderBottom: `1px solid ${theme.colors.border.light}`,
  marginBottom: theme.spacing.xl,
};

const heroTitleStyle = {
  color: theme.colors.text.heading,
  fontSize: theme.typography.fontSize.hero,
  fontWeight: theme.typography.fontWeight.bold,
  letterSpacing: "4px",
  margin: "0 0 12px 0",
};

const heroSubtitleStyle = {
  color: theme.colors.text.muted,
  fontSize: theme.typography.fontSize.md,
  letterSpacing: "1px",
  margin: "0 0 32px 0",
};

const countStyle = {
  color: theme.colors.charts[0],
  fontWeight: theme.typography.fontWeight.bold,
};

const searchContainerStyle = {
  position: "relative",
  maxWidth: "500px",
  margin: "0 auto",
};

const searchIconStyle = {
  position: "absolute",
  left: "16px",
  top: "50%",
  transform: "translateY(-50%)",
  color: theme.colors.text.muted,
  fontSize: "20px",
};

const searchInputStyle = {
  width: "100%",
  padding: "14px 16px 14px 44px",
  background: theme.colors.inputBg,
  border: `1px solid ${theme.colors.border.default}`,
  borderRadius: theme.borderRadius.sharp,
  color: theme.colors.text.body,
  fontSize: theme.typography.fontSize.base,
  fontFamily: theme.typography.fontFamily.primary,
  letterSpacing: "1px",
  outline: "none",
  boxSizing: "border-box",
};

const filterContainerStyle = {
  display: "flex",
  gap: theme.spacing.sm,
  flexWrap: "wrap",
  marginBottom: theme.spacing.xl,
  justifyContent: "center",
};

const filterBtnStyle = (isActive, color) => ({
  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
  background: isActive ? color + "20" : "transparent",
  border: isActive
    ? `1px solid ${color}`
    : `1px solid ${theme.colors.border.default}`,
  borderRadius: theme.borderRadius.sharp,
  color: isActive ? color : theme.colors.text.muted,
  cursor: "pointer",
  fontSize: theme.typography.fontSize.sm,
  fontFamily: theme.typography.fontFamily.primary,
  fontWeight: isActive
    ? theme.typography.fontWeight.bold
    : theme.typography.fontWeight.normal,
  letterSpacing: "1px",
  transition: theme.transitions.fast,
  textTransform: "uppercase",
});

const gridContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing.xxl,
};

const sectionStyle = {
  // Each category section
};

const sectionHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: theme.spacing.sm,
  marginBottom: theme.spacing.lg,
  paddingBottom: theme.spacing.sm,
  borderBottom: `1px solid ${theme.colors.border.light}`,
};

const sectionDotStyle = {
  width: "8px",
  height: "8px",
  borderRadius: theme.borderRadius.sharp,
};

const sectionTitleStyle = {
  color: theme.colors.text.heading,
  fontSize: theme.typography.fontSize.lg,
  fontWeight: theme.typography.fontWeight.bold,
  letterSpacing: "2px",
  margin: 0,
  textTransform: "uppercase",
};

const sectionCountStyle = {
  color: theme.colors.text.muted,
  fontSize: theme.typography.fontSize.xs,
  letterSpacing: "1px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
  gap: theme.spacing.md,
};

const emptyStyle = {
  textAlign: "center",
  padding: "80px 0",
  color: theme.colors.text.muted,
  fontSize: theme.typography.fontSize.lg,
  letterSpacing: "2px",
};

export default HomePage;
