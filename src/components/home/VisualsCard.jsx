// src/components/home/VisualsCard.jsx
import React, { useState, useRef, useEffect } from "react";
import lottie from "lottie-web";
import heroAnimation from "../../assets/lootiefiles/MxoeM9KC8Y.json";

const VisualsCard = () => {
  const [featureHovered, setFeatureHovered] = useState(null);
  const animationRef = useRef(null);
  const containerRef = useRef(null);

  const features = [
    { id: "chartTypes", label: "50+ Chart Types", color: "#0077C8" },
    { id: "customColors", label: "Custom Colors", color: "#F88379" },
    { id: "multiFormat", label: "Multi-Format Export", color: "#0077C8" },
    { id: "realTime", label: "Real-time Updates", color: "#F88379" },
  ];

  useEffect(() => {
    if (containerRef.current) {
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }

      try {
        animationRef.current = lottie.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData: heroAnimation,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid meet",
          },
        });
      } catch (error) {
        console.error("Error loading animation:", error);
      }
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, []);

  return (
    <div style={lottieWrapperStyle}>
      <div style={lottieFolderTabStyle}>
        <div style={lottieDotStyle} />
        <div style={lottieDotStyle} />
        <div style={lottieDotStyle} />
      </div>
      <div style={lottieFolderBodyStyle}>
        <div style={lottieContentStyle}>
          {/* Animation - LEFT SIDE */}
          <div style={lottieAnimationWrapper}>
            <div ref={containerRef} style={lottieAnimationStyle} />
          </div>

          {/* Text content - RIGHT SIDE */}
          <div style={lottieTextStyle}>
            <h2 style={lottieTitleStyle}>Forge Your Data Into Visuals</h2>
            <p style={lottieSubtitleStyle}>
              Transform raw numbers into stunning, professional charts and
              graphs with just a few clicks.
            </p>
            <div style={lottieFeaturesStyle}>
              {features.map((feature) => {
                const isHovered = featureHovered === feature.id;
                return (
                  <div
                    key={feature.id}
                    style={featureItemWrapperStyle}
                    onMouseEnter={() => setFeatureHovered(feature.id)}
                    onMouseLeave={() => setFeatureHovered(null)}
                  >
                    <div
                      style={featureItemTabStyle(
                        isHovered ? feature.color : "#D4C4AE",
                      )}
                    >
                      <div style={featureDotStyle} />
                      <div style={featureDotStyle} />
                      <div style={featureDotStyle} />
                    </div>
                    <div
                      style={featureItemBodyStyle(
                        isHovered ? feature.color : "#FFFFFF",
                        isHovered ? feature.color : "#D4C4AE",
                        isHovered ? "#FFFFFF" : "#8A7A6A",
                        isHovered,
                      )}
                    >
                      <span style={featureLabelStyle}>{feature.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={lottieLinesStyle}>
          <div style={{ ...lottieLineStyle, width: "100%" }} />
          <div style={{ ...lottieLineStyle, width: "70%" }} />
          <div style={{ ...lottieLineStyle, width: "85%" }} />
        </div>
      </div>
    </div>
  );
};

// ===== STYLES =====
const lottieWrapperStyle = {
  position: "relative",
  marginTop: "12px",
  marginBottom: "32px",
  width: "100%",
  maxWidth: "900px",
};

const lottieFolderTabStyle = {
  position: "absolute",
  top: "-12px",
  left: "0",
  height: "12px",
  width: "60%",
  maxWidth: "300px",
  background: "#D4A373",
  borderRadius: "3px 3px 0 0",
  display: "flex",
  alignItems: "center",
  padding: "0 8px",
  gap: "3px",
};

const lottieDotStyle = {
  width: "4px",
  height: "4px",
  background: "rgba(255,255,255,0.6)",
  borderRadius: "50%",
};

const lottieFolderBodyStyle = {
  background: "linear-gradient(135deg, #D4A373dd, #D4A37399)",
  border: "1px solid #D4A373",
  borderRadius: "0 4px 4px 4px",
  padding: "40px 40px 56px",
  boxShadow: "0 4px 16px rgba(212,163,115,0.3)",
  position: "relative",
  overflow: "hidden",
  minHeight: "280px",
};

const lottieContentStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "40px",
  flexWrap: "wrap",
};

const lottieAnimationWrapper = {
  flex: "0 0 300px",
  minWidth: "250px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const lottieAnimationStyle = {
  width: "120%",
  height: "290px",
};

const lottieTextStyle = {
  flex: 1,
  minWidth: "250px",
  maxWidth: "500px",
};

const lottieTitleStyle = {
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: 700,
  letterSpacing: "2px",
  margin: "0 0 8px 0",
  fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
};

const lottieSubtitleStyle = {
  color: "rgba(255,255,255,0.9)",
  fontSize: "14px",
  letterSpacing: "1px",
  margin: "0 0 16px 0",
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
  textShadow: "0 1px 2px rgba(0,0,0,0.15)",
};

const lottieFeaturesStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
  maxWidth: "380px",
};

const featureItemWrapperStyle = {
  position: "relative",
  marginTop: "6px",
  cursor: "default",
};

const featureItemTabStyle = (color) => ({
  position: "absolute",
  top: "-6px",
  left: "0",
  height: "6px",
  width: "50%",
  background: color,
  borderRadius: "3px 3px 0 0",
  display: "flex",
  alignItems: "center",
  padding: "0 5px",
  gap: "2px",
  transition: "background 0.25s ease, border-color 0.25s ease",
});

const featureDotStyle = {
  width: "2px",
  height: "2px",
  background: "rgba(255,255,255,0.6)",
  borderRadius: "50%",
};

const featureItemBodyStyle = (bgColor, borderColor, textColor, isHovered) => ({
  background: bgColor,
  border: `1px solid ${borderColor}`,
  borderRadius: "0 4px 4px 4px",
  padding: "8px 12px",
  color: textColor,
  fontSize: "11px",
  fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
  letterSpacing: "0.5px",
  transition: "all 0.25s ease",
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: isHovered
    ? `0 8px 24px ${borderColor}40`
    : "0 2px 8px rgba(0,0,0,0.1)",
  minHeight: "32px",
  textAlign: "center",
});

const featureLabelStyle = {
  fontSize: "10px",
  fontWeight: 600,
  letterSpacing: "0.3px",
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
};

const lottieLinesStyle = {
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

const lottieLineStyle = {
  height: "2px",
  background: "#ffffff",
  borderRadius: "1px",
};

export default VisualsCard;
