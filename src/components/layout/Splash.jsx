// src/components/layout/Splash.jsx
import React, { useState, useEffect } from "react";
import FolderButton from "../common/FolderButton";
import { useLanguage } from "../../context/LanguageContext";
import logo from "../../assets/logos/Graphforgelogos.png";

// Import slide components
import ChartTypesSlide from "../splash/ChartTypesSlide";
import CategoriesSlide from "../splash/CategoriesSlide";
import ExportSlide from "../splash/ExportSlide";
import ForgeSlide from "../splash/ForgeSlide";
import ReadySlide from "../splash/ReadySlide";

const Splash = ({ onComplete }) => {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(0);

  // Color palette matching the website
  const AEGEAN_BLUE = "#0077C8";
  const CORAL_PINK = "#F88379";
  const LIGHT_YELLOW = "#F2D24B";
  const GREEN = "#A9C632";
  const ORANGE = "#F39A1E";

  // Background colors for each slide
  const LIGHTER_BLUE = "#D4E8F5";
  const LIGHTER_CORAL = "#FDE8E6";
  const LIGHTER_YELLOW = "#FFF8E0";
  const LIGHTER_GREEN = "#EBF5E8";
  const LIGHTER_ORANGE = "#FEF0E0";

  const totalSlides = 4;
  const LOGO_DURATION = 3000; // Logo screen: 3 seconds
  const SLIDE_DURATION = 3000; // Slides 1, 2, and 3: 3 seconds each
  const FORGE_SLIDE_DURATION = 4000; // Slide 4 (Second-to-last slide): 4 seconds

  const getBackgroundColor = () => {
    switch (currentPage) {
      case 0:
        return "#F5EDE0";
      case 1:
        return LIGHTER_BLUE;
      case 2:
        return LIGHTER_CORAL;
      case 3:
        return LIGHTER_YELLOW;
      case 4:
        return LIGHTER_GREEN;
      case 5:
        return LIGHTER_ORANGE;
      default:
        return "#F5EDE0";
    }
  };

  // Timers management with isolated timing variations
  useEffect(() => {
    const timers = [];

    // 1. Logo screen: 3 seconds
    timers.push(setTimeout(() => setCurrentPage(1), LOGO_DURATION));

    // 2. Queue up slide updates
    for (let i = 1; i <= totalSlides; i++) {
      let delay = LOGO_DURATION + i * SLIDE_DURATION;

      // If we are evaluating the final loop index (moving from Slide 4 to Slide 5),
      // we calculate its window based on standard durations accrued beforehand
      if (i === totalSlides) {
        // Delay is built from: Logo (3000) + 3 standard slides (3 * 3000) = 12000ms
        delay = LOGO_DURATION + (totalSlides - 1) * SLIDE_DURATION;

        timers.push(
          setTimeout(() => {
            // Transitions into the final Ready slide (page 5) after the 4-second delay
            setCurrentPage(5);
          }, delay + FORGE_SLIDE_DURATION),
        );
      } else {
        // Slides 1, 2, and 3 standard timeline propagation
        timers.push(
          setTimeout(() => {
            setCurrentPage(i + 1);
          }, delay),
        );
      }
    }

    // 3. Finalization Pipeline Callback (Ready slide display window)
    // Logo (3s) + Slides 1-3 (9s) + Slide 4 (4s) + Ready slide display window (3s) = 19 seconds total
    const readyDelay =
      LOGO_DURATION +
      (totalSlides - 1) * SLIDE_DURATION +
      FORGE_SLIDE_DURATION +
      SLIDE_DURATION;
    const finalTimer = setTimeout(onComplete, readyDelay);
    timers.push(finalTimer);

    return () => timers.forEach((t) => clearTimeout(t));
  }, [onComplete]);

  const handleDotClick = (page) => {
    setCurrentPage(page);
  };

  const splashContainer = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    width: "100%",
    background: getBackgroundColor(),
    overflow: "hidden",
    fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
    transition: "background 0.5s ease",
  };

  const innerStyle = (isLeft) => ({
    width: isLeft ? "260px" : "230px",
    height: "100px",
    lineHeight: "100px",
    fontSize: "3.6em",
    fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
    fontWeight: 700,
    whiteSpace: "nowrap",
    overflow: "hidden",
    position: "relative",
    background: isLeft ? AEGEAN_BLUE : CORAL_PINK,
    color: "#FFFFFF",
    transformOrigin: isLeft ? "right" : "left",
    transform: isLeft
      ? "perspective(100px) rotateY(-15deg)"
      : "perspective(100px) rotateY(15deg)",
    boxShadow: isLeft
      ? "inset -10px 0 20px rgba(0,0,0,0.15)"
      : "inset 10px 0 20px rgba(0,0,0,0.15)",
    borderRadius: isLeft ? "4px 0 0 4px" : "0 4px 4px 0",
    flexShrink: 0,
    margin: 0,
    padding: 0,
  });

  const spanStyle = (isLeft) => ({
    position: "absolute",
    top: 0,
    left: isLeft ? "-100%" : "100%",
    animation: isLeft
      ? "slideFromLeft 1.5s ease forwards"
      : "slideFromRight 1.5s ease forwards",
    animationDelay: isLeft ? "0.3s" : "0.8s",
    letterSpacing: "6px",
    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
    width: "100%",
    textAlign: "center",
  });

  // ============================================
  // FOLDER STYLE SKIP BUTTON
  // ============================================
  const skipButtonWrapperStyle = {
    position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: 100,
  };

  const skipTabStyle = {
    position: "absolute",
    top: "-8px",
    left: "0",
    right: "0",
    height: "8px",
    background: "#D4C4AE",
    borderRadius: "3px 3px 0 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "3px",
    padding: "0 8px",
  };

  const skipDotStyle = {
    width: "3px",
    height: "3px",
    background: "rgba(255,255,255,0.5)",
    borderRadius: "50%",
  };

  const skipButtonStyle = {
    padding: "10px 18px",
    background: "#FFFFFF",
    border: "2px solid #D4C4AE",
    borderRadius: "0 4px 4px 4px",
    color: "#4A3728",
    cursor: "pointer",
    fontSize: "12px",
    letterSpacing: "1px",
    textTransform: "uppercase",
    transition: "all 0.2s ease",
    backdropFilter: "blur(10px)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "120px",
  };

  // ============================================
  // DOT INDICATOR - Folder Style
  // ============================================
  const dotContainerStyle = {
    position: "fixed",
    bottom: "40px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 100,
    display: "flex",
    gap: "8px",
    background: "rgba(255,255,255,0.8)",
    padding: "8px 14px",
    borderRadius: "3px",
    backdropFilter: "blur(10px)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    border: "1px solid rgba(0,0,0,0.06)",
  };

  const dotStyle = (isActive, color) => ({
    width: "8px",
    height: "8px",
    borderRadius: "2px",
    background: isActive ? color || AEGEAN_BLUE : "#D4C4AE",
    transition: "all 0.3s ease",
    cursor: "pointer",
    border: "none",
    padding: 0,
  });

  // Dot colors for each slide
  const dotColors = [
    AEGEAN_BLUE,
    AEGEAN_BLUE,
    CORAL_PINK,
    LIGHT_YELLOW,
    GREEN,
    ORANGE,
  ];

  return (
    <div style={splashContainer}>
      {/* ===== FOLDER STYLE SKIP BUTTON ===== */}
      <div style={skipButtonWrapperStyle}>
        <FolderButton
          onClick={onComplete}
          baseColor={CORAL_PINK}
          bodyStyle={{ width: "auto" }}
        >
          Skip →
        </FolderButton>
      </div>

      {/* ===== DOT INDICATORS ===== */}
      <div style={dotContainerStyle}>
        <button
          style={dotStyle(currentPage === 0, dotColors[0])}
          onClick={() => handleDotClick(0)}
          title="Logo"
        />
        <button
          style={dotStyle(currentPage === 1, dotColors[1])}
          onClick={() => handleDotClick(1)}
          title="Chart Types"
        />
        <button
          style={dotStyle(currentPage === 2, dotColors[2])}
          onClick={() => handleDotClick(2)}
          title="Categories"
        />
        <button
          style={dotStyle(currentPage === 3, dotColors[3])}
          onClick={() => handleDotClick(3)}
          title="Export"
        />
        <button
          style={dotStyle(currentPage === 4, dotColors[4])}
          onClick={() => handleDotClick(4)}
          title="Forge"
        />
        <button
          style={dotStyle(currentPage === 5, dotColors[5])}
          onClick={() => handleDotClick(5)}
          title="Ready"
        />
      </div>

      {/* ===== CONTENT ===== */}
      {currentPage === 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "30px",
            animation: "fadeInScale 1s ease forwards",
            width: "100%",
          }}
        >
          <div
            style={{
              width: "180px",
              height: "180px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={logo}
              alt="GraphForge Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                filter: `drop-shadow(0 0 40px ${AEGEAN_BLUE}33)`,
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              position: "relative",
              width: "100%",
              maxWidth: "800px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={innerStyle(true)}>
              <span style={spanStyle(true)}>GRAPH</span>
            </div>
            <div style={innerStyle(false)}>
              <span style={spanStyle(false)}>FORGE</span>
            </div>
          </div>
          <p
            style={{
              color: "#8A7A6A",
              fontSize: "14px",
              letterSpacing: "6px",
              margin: 0,
              fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
              animation: "fadeInUp 0.8s ease forwards",
              animationDelay: "1.5s",
              opacity: 0,
            }}
          >
            {t("common.tagline") || "Data Visualization Made Simple"}
          </p>
        </div>
      )}

      {currentPage === 1 && (
        <ChartTypesSlide currentPage={currentPage} totalPages={totalSlides} />
      )}
      {currentPage === 2 && (
        <CategoriesSlide currentPage={currentPage} totalPages={totalSlides} />
      )}
      {currentPage === 3 && (
        <ExportSlide currentPage={currentPage} totalPages={totalSlides} />
      )}
      {currentPage === 4 && (
        <ForgeSlide currentPage={currentPage} totalPages={totalSlides} />
      )}
      {currentPage === 5 && <ReadySlide />}

      <style>{`
        @keyframes fadeInScale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulseGlow { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes slideFromLeft { from { left: -100%; } to { left: 0%; } }
        @keyframes slideFromRight { from { left: 100%; } to { left: 0%; } }
      `}</style>
    </div>
  );
};

export default Splash;
