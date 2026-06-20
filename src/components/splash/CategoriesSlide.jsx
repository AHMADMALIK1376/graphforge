// src/components/splash/CategoriesSlide.jsx
import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import categoriesAnimation from "../../assets/lootiefiles/Charts.json";

const CategoriesSlide = ({ currentPage, totalPages }) => {
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
          animationData: categoriesAnimation,
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
          left: "15%", // Matched positioning to the previous slide
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start", // Left-aligned to match design continuity
          gap: "12px", // Tightened layout gap
          textAlign: "left", // Left-aligned typography
          zIndex: 2,
        }}
      >
        <h2
          style={{
            color: "#4A3728",
            fontSize: "36px", // Reduced from 48px to match previous slide exactly
            fontWeight: 500, // Reduced from 700 for a consistent clean look
            letterSpacing: "1.5px",
            margin: 0,
            fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
          }}
        >
          5 Chart Categories
        </h2>
        <p
          style={{
            color: "#8A7A6A",
            fontSize: "16px", // Reduced from 18px for balanced body scale
            fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
            margin: 0,
            letterSpacing: "1px",
            maxWidth: "500px",
          }}
        >
          Comparison, Correlation, Part-to-Whole, Temporal, Distribution
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
          right: "5%",
          top: "50%",
          transform: "translateY(-50%)",
          width: "55%", // Increased width from 50% for a wider layout aspect
          height: "60vh", // Reduced height from 70vh to flatten out the bounding box
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      />
    </>
  );
};

export default CategoriesSlide;
