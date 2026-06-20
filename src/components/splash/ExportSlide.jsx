// src/components/splash/ExportSlide.jsx
import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import exportAnimation from "../../assets/lootiefiles/7vbJlG9uMj.json";

const ExportSlide = ({ currentPage, totalPages }) => {
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
          animationData: exportAnimation,
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
      {/* Left Side - Lottie Animation */}
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          left: "10%",
          top: "50%",
          transform: "translateY(-50%)",
          width: "45%",
          height: "60vh", // Standardized to 60vh to match previous slides
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      />

      {/* Right Side - Text Content */}
      <div
        style={{
          position: "absolute",
          right: "15%",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "12px",
          textAlign: "left",
          zIndex: 2,
        }}
      >
        <h2
          style={{
            color: "#4A3728",
            fontSize: "36px",
            fontWeight: 500,
            letterSpacing: "1.5px",
            lineHeight: "1.2", // Adjusted line height for the two-line layout
            margin: 0,
            fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
          }}
        >
          Export to PNG, PDF, <br /> CSV, Excel
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
          Share your insights anywhere
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
    </>
  );
};

export default ExportSlide;
