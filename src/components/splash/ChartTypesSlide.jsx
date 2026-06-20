// src/components/splash/ChartTypesSlide.jsx
import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import chartsAnimation from "../../assets/lootiefiles/3tXqwvVtAd.json";

const ChartTypesSlide = ({ currentPage, totalPages }) => {
  const animationRef = useRef(null);
  const containerRef = useRef(null);

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
          animationData: chartsAnimation,
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
    <>
      {/* Left Side - Text Content */}
      <div
        style={{
          position: "absolute",
          left: "15%", // Balanced positioning to mirror the Export slide perfectly
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "12px", // Consistent tight gap
          zIndex: 2,
        }}
      >
        <h2
          style={{
            color: "#4A3728",
            fontSize: "36px", // Maintained clean font size
            fontWeight: 500, // Maintained lighter font weight
            letterSpacing: "1.5px",
            margin: 0,
            fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
          }}
        >
          69+ Chart Types
        </h2>
        <p
          style={{
            color: "#8A7A6A",
            fontSize: "16px",
            fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
            margin: 0,
            letterSpacing: "1px",
            maxWidth: "500px",
          }}
        >
          From bar charts to heatmaps
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "8px",
          }}
        >
          <span
            style={{
              color: "#8A7A6A",
              fontSize: "11px",
              letterSpacing: "2px",
              fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
            }}
          >
            {currentPage} / {totalPages}
          </span>
        </div>
      </div>

      {/* Right Side - Lottie Animation */}
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          right: "10%", // Perfectly mirrors the left position of the export slide
          top: "50%",
          transform: "translateY(-50%)",
          width: "45%", // Uniform width across slides to prevent overlap issues
          height: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      />
    </>
  );
};

export default ChartTypesSlide;
