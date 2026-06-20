// src/components/splash/ForgeSlide.jsx
import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import forgeAnimation from "../../assets/lootiefiles/idZTRc2dfn.json";

const ForgeSlide = ({ currentPage, totalPages }) => {
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
          animationData: forgeAnimation,
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
          left: "15%", // Consistent positioning with previous slides
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "12px", // Tightened gap
          zIndex: 2,
        }}
      >
        <h2
          style={{
            color: "#4A3728",
            fontSize: "36px", // Reduced to match previous slides
            fontWeight: 500, // Lighter weight for a cleaner look
            letterSpacing: "1.5px",
            lineHeight: "1.2", // Adjusted for the two-line layout
            margin: 0,
            fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
          }}
        >
          Forge Your Data <br /> Into Visuals
        </h2>
        <p
          style={{
            color: "#8A7A6A",
            fontSize: "16px", // Matched body size
            fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
            margin: 0,
            letterSpacing: "1px",
            maxWidth: "500px",
          }}
        >
          Transform raw data into stunning visualizations
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
          right: "10%",
          top: "50%",
          transform: "translateY(-50%)",
          width: "55%",
          height: "90vh", // Slightly shorter for a cleaner aspect ratio
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      />
    </>
  );
};

export default ForgeSlide;
