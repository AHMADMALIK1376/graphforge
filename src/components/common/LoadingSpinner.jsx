// src/components/common/LoadingSpinner.jsx
import React from "react";

export const LoadingSpinner = () => {
  const CATEGORY_COLORS = {
    comparison: "#0077C8",
    correlation: "#F88379",
    partToWhole: "#F2D24B",
    temporal: "#D4A373",
    distribution: "#A9C632",
    geospatial: "#D41F26",
  };
  const categories = Object.entries(CATEGORY_COLORS);

  // --- STYLES ---
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    width: "100%",
    background: "#F5EDE0",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 99999,
    overflow: "hidden",
  };

  const stageStyle = {
    position: "relative",
    width: "300px",
    height: "300px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const numFolders = categories.length;
  const midIndex = (numFolders - 1) / 2;

  // Smooth cubic-bezier for natural feel
  const easing = "cubic-bezier(0.4, 0, 0.2, 1)";

  // Generate unique fan animation keyframes for each folder
  const generateKeyframes = () => {
    let css = "";
    categories.forEach((_, i) => {
      const xOffset = (i - midIndex) * 8;
      const yOffset = -i * 4;
      const fannedX = (i - midIndex) * 60;
      const fannedY = -Math.abs(i - midIndex) * 10;
      const angle = (i - midIndex) * 12;

      css += `
        @keyframes fanSpread-${i} {
          0%, 100% { transform: translate(${xOffset}px, ${yOffset}px) rotate(0deg); }
          50% { transform: translate(${fannedX}px, ${fannedY}px) rotate(${angle}deg); }
        }
      `;
    });
    return css;
  };

  // Dot style (like folder tabs across the app)
  const dotStyle = {
    width: "4px",
    height: "4px",
    background: "rgba(255,255,255,0.6)",
    borderRadius: "50%",
  };

  return (
    <div style={containerStyle}>
      {/* Optional background glow blobs */}
      <div
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${CATEGORY_COLORS.comparison}1A, transparent 70%)`,
          top: "10%",
          right: "5%",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${CATEGORY_COLORS.correlation}18, transparent 70%)`,
          bottom: "10%",
          left: "5%",
        }}
      />

      <div style={stageStyle}>
        {categories.map(([key, color], i) => (
          <div
            key={key}
            style={{
              position: "absolute",
              width: "120px",
              height: "80px",
              animation: `fanSpread-${i} 3s ${easing} infinite`,
              transformOrigin: "bottom center",
              zIndex: i,
            }}
          >
            {/* Folder tab with three dots */}
            <div
              style={{
                position: "absolute",
                top: "-10px",
                left: "0",
                width: "40%",
                height: "10px",
                background: color,
                borderRadius: "3px 3px 0 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "3px",
                padding: "0 4px",
              }}
            >
              <span style={dotStyle} />
              <span style={dotStyle} />
              <span style={dotStyle} />
            </div>

            {/* Folder body */}
            <div
              style={{
                width: "100%",
                height: "100%",
                background: color,
                borderRadius: "0 6px 6px 6px",
                border: `2px solid ${color}`,
              }}
            />
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "40px",
          fontFamily: "'Bungee', sans-serif",
          fontSize: "14px",
          color: "#4A3728",
          animation: "pulse 2s ease-in-out infinite",
        }}
      >
        LOADING...
      </div>

      <style>{`
        ${generateKeyframes()}
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export const PageLoader = () => <LoadingSpinner />;
export const ChartLoader = () => <LoadingSpinner />;
export const DataLoader = () => <LoadingSpinner />;
export const MinimalLoader = () => <LoadingSpinner />;
export const SplashLoader = () => <LoadingSpinner />;
