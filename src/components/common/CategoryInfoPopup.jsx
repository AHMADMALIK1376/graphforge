// src/components/common/CategoryInfoPopup.jsx
import React from "react";
import { CHART_CATEGORIES } from "../../utils/chartTypes";

const CategoryInfoPopup = ({ categoryId, onClose }) => {
  const category = CHART_CATEGORIES[categoryId];
  if (!category) return null;

  const infoText = {
    comparison: {
      title: "Comparison Charts",
      description:
        "Compare values across different categories or groups. Use these charts to highlight differences, rankings, or changes between items.",
      useCases: [
        "Bar charts for comparing quantities",
        "Radar charts for multi-variable comparison",
        "Waterfall charts for financial analysis",
      ],
    },
    correlation: {
      title: "Correlation Charts",
      description:
        "Show relationships and patterns between two or more variables. Ideal for identifying trends, clusters, or outliers.",
      useCases: [
        "Scatter plots for correlation",
        "Bubble charts for three-dimensional data",
        "Heatmaps for density visualization",
      ],
    },
    partToWhole: {
      title: "Part-to-Whole Charts",
      description:
        "Visualize how individual parts contribute to a total. Perfect for composition, proportions, and hierarchical data.",
      useCases: [
        "Pie and donut charts for simple proportions",
        "Treemaps for nested categories",
        "Sunburst charts for hierarchical composition",
      ],
    },
    temporal: {
      title: "Temporal Charts",
      description:
        "Display data over time to show trends, seasonality, or progression. Essential for time-series analysis.",
      useCases: [
        "Line and area charts for trends",
        "Candlestick charts for financial data",
        "Gantt charts for project timelines",
      ],
    },
    distribution: {
      title: "Distribution Charts",
      description:
        "Show the spread and frequency of data points. Helps understand data concentration, skewness, and outliers.",
      useCases: [
        "Histograms for frequency distribution",
        "Box plots for statistical summary",
        "Violin plots for density estimation",
      ],
    },
    geospatial: {
      title: "Geospatial & Other Charts",
      description:
        "Maps, networks, flows, and process diagrams. Use these to represent geographic data, relationships, and workflows.",
      useCases: [
        "Choropleth maps for regional data",
        "Sankey diagrams for flows",
        "Flowcharts for processes",
      ],
    },
  };

  const info = infoText[categoryId] || {
    title: category.label,
    description: "Chart category for " + category.label,
    useCases: [],
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={folderWrapperStyle} onClick={(e) => e.stopPropagation()}>
        {/* Folder tab */}
        <div style={folderTabStyle(category.color)}>
          <span style={tabDotStyle} />
          <span style={tabDotStyle} />
          <span style={tabDotStyle} />
        </div>

        {/* Folder body */}
        <div style={folderBodyStyle(category.color)}>
          <button onClick={onClose} style={closeIconStyle}>
            ✕
          </button>

          <div style={contentStyle}>
            <h2 style={titleStyle}>{info.title}</h2>
            <p style={descStyle}>{info.description}</p>

            {info.useCases.length > 0 && (
              <div style={casesSectionStyle}>
                <h4 style={casesHeadingStyle}>📌 Common Use Cases</h4>
                <ul style={listStyle}>
                  {info.useCases.map((useCase, idx) => (
                    <li key={idx} style={listItemStyle}>
                      {useCase}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div style={bottomLinesStyle}>
            <div style={{ ...bottomLineItemStyle, width: "100%" }} />
            <div style={{ ...bottomLineItemStyle, width: "70%" }} />
            <div style={{ ...bottomLineItemStyle, width: "85%" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1001,
  backdropFilter: "blur(4px)",
};

const folderWrapperStyle = {
  position: "relative",
  width: "500px",
  maxWidth: "92%",
};

const folderTabStyle = (color) => ({
  position: "absolute",
  top: "-20px",
  left: "0",
  height: "20px",
  width: "200px",
  background: color,
  borderRadius: "6px 6px 0 0",
  display: "flex",
  alignItems: "center",
  padding: "0 12px",
  gap: "6px",
});

const tabDotStyle = {
  width: "6px",
  height: "6px",
  background: "rgba(255,255,255,0.8)",
  borderRadius: "50%",
};

const folderBodyStyle = (color) => ({
  background: color,
  borderRadius: "0 8px 8px 8px",
  padding: "32px 32px 48px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  position: "relative",
  overflow: "hidden",
});

const closeIconStyle = {
  position: "absolute",
  top: "12px",
  right: "14px",
  background: "none",
  border: "none",
  fontSize: "18px",
  cursor: "pointer",
  color: "rgba(255,255,255,0.8)",
  zIndex: 10,
};

const contentStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  gap: "12px",
};

const titleStyle = {
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: 700,
  letterSpacing: "2px",
  margin: 0,
  fontFamily: "'Bungee', cursive",
  textShadow: "0 1px 2px rgba(0,0,0,0.15)",
};

const descStyle = {
  color: "rgba(255,255,255,0.9)",
  fontSize: "14px",
  fontWeight: 400,
  margin: 0,
  fontFamily: "'Inter', sans-serif",
  lineHeight: 1.6,
  maxWidth: "380px",
};

const casesSectionStyle = {
  background: "rgba(255,255,255,0.15)",
  borderRadius: "8px",
  padding: "16px 20px",
  width: "100%",
  textAlign: "left",
};

const casesHeadingStyle = {
  fontSize: "12px",
  fontWeight: 400,
  color: "#ffffff",
  textTransform: "uppercase",
  letterSpacing: "1px",
  margin: "0 0 10px",
  fontFamily: "'Inter', sans-serif",
};

const listStyle = { margin: 0, paddingLeft: "18px" };

const listItemStyle = {
  fontSize: "13px",
  fontWeight: 300,
  color: "#ffffff",
  marginBottom: "6px",
  fontFamily: "'Inter', sans-serif",
  lineHeight: 1.5,
};

const bottomLinesStyle = {
  position: "absolute",
  bottom: "12px",
  left: "16px",
  right: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  opacity: 0.3,
};

const bottomLineItemStyle = {
  height: "2px",
  background: "#ffffff",
  borderRadius: "1px",
};

export default CategoryInfoPopup;
