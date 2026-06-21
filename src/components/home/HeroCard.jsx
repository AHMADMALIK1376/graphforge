// src/components/home/HeroCard.jsx
import React from "react";
import AnalogClock from "../common/AnalogClock";
import FolderButton from "../common/FolderButton";

const HeroCard = ({
  totalCharts,
  onSelectChart,
  onNavigateToCharts,
  allCharts,
}) => {
  // Get time-based greeting
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return { greeting: "Good Morning", emoji: "🌅" };
    } else if (hour >= 12 && hour < 17) {
      return { greeting: "Good Afternoon", emoji: "☀️" };
    } else if (hour >= 17 && hour < 21) {
      return { greeting: "Good Evening", emoji: "🌆" };
    } else {
      return { greeting: "Good Night", emoji: "🌙" };
    }
  };

  const timeGreeting = getTimeGreeting();

  const handleViewAllCharts = () => {
    if (onNavigateToCharts) {
      onNavigateToCharts();
    } else if (onSelectChart) {
      onSelectChart(allCharts[0]?.id);
    }
  };

  return (
    <div style={heroWrapperStyle}>
      <div style={heroFolderTabStyle}>
        <div style={heroDotStyle} />
        <div style={heroDotStyle} />
        <div style={heroDotStyle} />
      </div>
      <div style={heroFolderBodyStyle}>
        <div style={heroClockWrapper}>
          <AnalogClock />
        </div>

        <div style={heroContentStyle}>
          <div style={heroTextStyle}>
            <h1 style={heroTitleStyle}>
              {timeGreeting.emoji} {timeGreeting.greeting}
            </h1>
            <p style={heroSubtitleStyle}>Welcome to GraphForge</p>
            <div style={heroStatsStyle}>
              <span style={heroStatItemStyle}>
                <span style={heroStatNumberStyle}>{totalCharts}</span>
                <span style={heroStatLabelStyle}>Chart Types</span>
              </span>
              <span style={heroStatDividerStyle}>|</span>
              <span style={heroStatItemStyle}>
                <span style={heroStatNumberStyle}>5</span>
                <span style={heroStatLabelStyle}>Categories</span>
              </span>
              <span style={heroStatDividerStyle}>|</span>
              <span style={heroStatItemStyle}>
                <span style={heroStatNumberStyle}>6</span>
                <span style={heroStatLabelStyle}>Export Formats</span>
              </span>
            </div>

            <div style={heroButtonsStyle}>
              <FolderButton onClick={handleViewAllCharts} baseColor="#F88379">
                EXPLORE CHARTS
              </FolderButton>

              <FolderButton
                onClick={() => onSelectChart && onSelectChart(allCharts[0]?.id)}
                baseColor="#F88379"
              >
                CREATE CHART
              </FolderButton>
            </div>
          </div>
        </div>

        <div style={heroLinesStyle}>
          <div style={{ ...heroLineStyle, width: "100%" }} />
          <div style={{ ...heroLineStyle, width: "70%" }} />
          <div style={{ ...heroLineStyle, width: "85%" }} />
        </div>
      </div>
    </div>
  );
};

// ===== STYLES =====
const heroWrapperStyle = {
  position: "relative",
  marginTop: "22px",
  marginBottom: "32px",
  width: "100%",
  maxWidth: "900px",
};

const heroFolderTabStyle = {
  position: "absolute",
  top: "-12px",
  left: "0",
  height: "12px",
  width: "100%",
  maxWidth: "300px",
  background: "#3282B8",
  borderRadius: "3px 3px 0 0",
  display: "flex",
  alignItems: "center",
  padding: "0 8px",
  gap: "3px",
};

const heroDotStyle = {
  width: "4px",
  height: "4px",
  background: "rgba(255,255,255,0.6)",
  borderRadius: "50%",
};

const heroFolderBodyStyle = {
  background: "#4895D0",
  border: "1px solid #3282B8",
  borderRadius: "0 4px 4px 4px",
  padding: "40px 40px 56px",
  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
  position: "relative",
  overflow: "visible",
  minHeight: "340px",
};

const heroClockWrapper = {
  position: "absolute",
  top: "20px",
  right: "20px",
  zIndex: 10,
  background: "transparent",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const heroContentStyle = {
  display: "flex",
  alignItems: "center",
  gap: "40px",
  flexWrap: "wrap",
};

const heroTextStyle = {
  flex: 1,
  minWidth: "280px",
  paddingRight: "0px",
};

const heroTitleStyle = {
  color: "#ffffff",
  fontSize: "32px",
  fontWeight: 700,
  letterSpacing: "2px",
  margin: "0 0 4px 0",
  fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

const heroSubtitleStyle = {
  color: "rgba(255,255,255,0.85)",
  fontSize: "20px",
  fontWeight: 600,
  letterSpacing: "1px",
  margin: "0 0 20px 0",
  fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
  textShadow: "0 1px 3px rgba(0,0,0,0.15)",
};

const heroStatsStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "24px",
};

const heroStatItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

const heroStatNumberStyle = {
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: 700,
  fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
  letterSpacing: "0.5px",
};

const heroStatLabelStyle = {
  color: "rgba(255,255,255,0.8)",
  fontSize: "10px",
  letterSpacing: "1px",
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
  textTransform: "uppercase",
};

const heroStatDividerStyle = {
  color: "rgba(255,255,255,0.4)",
  fontSize: "14px",
};

const heroButtonsStyle = {
  display: "flex",
  gap: "16px",
  flexWrap: "wrap",
  marginTop: "8px",
};

const folderBtnWrapperStyle = {
  position: "relative",
  background: "transparent",
  border: "none",
  padding: 0,
  cursor: "pointer",
  display: "inline-block",
  textAlign: "left",
  transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  outline: "none",
};

const folderBtnTabStyle = (bgColor) => ({
  position: "absolute",
  top: "-8px",
  left: "0",
  height: "8px",
  width: "60px",
  background: bgColor,
  borderRadius: "3px 3px 0 0",
  display: "flex",
  alignItems: "center",
  padding: "0 6px",
  gap: "2px",
  transition: "background 0.25s ease, border-color 0.25s ease",
});

const folderBtnDotStyle = {
  width: "3px",
  height: "3px",
  background: "rgba(255,255,255,0.6)",
  borderRadius: "50%",
};

const folderBtnBodyStyle = (bgColor, borderColor, textColor, isHovered) => ({
  background: bgColor,
  border: `1px solid ${borderColor}`,
  borderRadius: "0 4px 4px 4px",
  padding: "8px 16px",
  color: textColor,
  fontSize: "12px",
  fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
  letterSpacing: "1px",
  transition: "all 0.25s ease",
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: isHovered
    ? `0 8px 24px ${borderColor}40`
    : "0 2px 8px rgba(0,0,0,0.1)",
  minHeight: "36px",
});

const heroLinesStyle = {
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

const heroLineStyle = {
  height: "2px",
  background: "#ffffff",
  borderRadius: "1px",
};

export default HeroCard;
