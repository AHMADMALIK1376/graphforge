// src/components/splash/ReadySlide.jsx
import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import readyAnimation from "../../assets/lootiefiles/kkqPAoOxzh.json";

const ReadySlide = () => {
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
          animationData: readyAnimation,
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
          left: "15%", // Normalized positioning with the rest of the slides
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start", // Left-aligned to look perfectly clean and consistent
          gap: "12px", // Tightened layout gap
          zIndex: 2,
        }}
      >
        <h2
          style={{
            color: "#4A3728",
            fontSize: "36px", // Reduced to match previous slides perfectly
            fontWeight: 500, // Reduced from 700 for visual cohesion
            letterSpacing: "1.5px", // Normalized spacing
            margin: 0,
            fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
          }}
        >
          Ready to Forge!
        </h2>
        <p
          style={{
            color: "#8A7A6A",
            fontSize: "16px", // Uniform body size
            fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
            margin: 0,
            letterSpacing: "1px",
            maxWidth: "400px",
          }}
        >
          Loading your charts...
        </p>
      </div>

      {/* Right Side - Lottie Animation */}
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          right: "10%", // Perfectly balanced placement
          top: "50%",
          transform: "translateY(-50%)",
          width: "45%", // Unified dimensions across the slide track
          height: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      />
    </>
  );
};

export default ReadySlide;
