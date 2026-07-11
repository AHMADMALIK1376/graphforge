// src/pages/HomePage.jsx
import React, { useMemo } from "react";
import Layout from "../components/layout/Layout";
import HeroCard from "../components/home/HeroCard";
import VisualsCard from "../components/home/VisualsCard";
import CategoriesCard from "../components/home/CategoriesCard";
import {
  CHART_CATEGORIES,
  getAllCharts,
  getTotalChartCount,
} from "../utils/chartTypes";

const HomePage = ({ onSelectChart, onNavigateToCharts }) => {
  const allCharts = useMemo(() => getAllCharts(), []);
  const totalCharts = getTotalChartCount();

  const categoryCounts = useMemo(() => {
    const counts = {};
    Object.entries(CHART_CATEGORIES).forEach(([key, cat]) => {
      counts[key] = Object.keys(cat.charts).length;
    });
    return counts;
  }, []);

  return (
    <Layout currentPath="/home">
      <HeroCard
        totalCharts={totalCharts}
        onSelectChart={onSelectChart}
        onNavigateToCharts={onNavigateToCharts}
        allCharts={allCharts}
      />

      <VisualsCard />

      <CategoriesCard categoryCounts={categoryCounts} />

      {/* Footer */}
      <div style={footerStyle}>
        <p style={footerTextStyle}>
          Built with ❤️ using React • {totalCharts} chart types • Free & Open
          Source
        </p>
      </div>
    </Layout>
  );
};

// ===== STYLES =====
const footerStyle = {
  marginTop: "8px",
  padding: "16px 0",
  textAlign: "center",
  borderTop: "1px solid #D4C4AE",
  maxWidth: "1200px",
};

const footerTextStyle = {
  color: "#8A7A6A",
  fontSize: "11px",
  letterSpacing: "1px",
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
  margin: 0,
};

export default HomePage;
