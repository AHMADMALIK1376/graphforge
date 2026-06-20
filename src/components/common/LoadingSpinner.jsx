// src/components/common/LoadingSpinner.jsx
import React from "react";

export const LoadingSpinner = ({
  fullScreen = true, // Force fullScreen true globally
  duration = 5000,
}) => {
  // Brand color overrides matching your exact splash screen palette
  const AEGEAN_BLUE = "#0077C8";
  const CORAL_PINK = "#F88379";
  const LIGHT_YELLOW = "#F2D24B";
  const GREEN = "#A9C632";

  // Significantly increased base spinner sizes for a premium look
  const SPINNER_SIZE = 140;

  // Enforced full-screen parent container styling
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    width: "100%",
    background: "#F5EDE0",
    position: "fixed", // locks over the entire browser viewport
    top: 0,
    left: 0,
    zIndex: 99999, // Layer above everything else
    overflow: "hidden",
  };

  // Full screen background glow effects using updated colors
  const glowStyle = {
    position: "absolute",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background: `radial-gradient(circle, ${AEGEAN_BLUE}1A, transparent 70%)`,
    top: "-20%",
    right: "-15%",
    animation: "pulseGlow 5s ease-in-out infinite",
  };

  const glowStyle2 = {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: `radial-gradient(circle, ${CORAL_PINK}1A, transparent 70%)`,
    bottom: "-20%",
    left: "-15%",
    animation: "pulseGlow 5s ease-in-out infinite 2.5s",
  };

  const glowStyle3 = {
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: `radial-gradient(circle, ${LIGHT_YELLOW}14, transparent 70%)`,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    animation: "pulseGlow 6s ease-in-out infinite 1.5s",
  };

  const glowStyle4 = {
    position: "absolute",
    width: "350px",
    height: "350px",
    borderRadius: "50%",
    background: `radial-gradient(circle, ${GREEN}0F, transparent 70%)`,
    top: "20%",
    right: "15%",
    animation: "pulseGlow 7s ease-in-out infinite 3s",
  };

  // Upgraded main outer spinner utilizing new theme track colors
  const spinnerStyle = {
    width: `${SPINNER_SIZE}px`,
    height: `${SPINNER_SIZE}px`,
    border: `5px solid #E8DCC8`,
    borderTop: `5px solid ${AEGEAN_BLUE}`,
    borderRight: `5px solid ${CORAL_PINK}`,
    borderBottom: `5px solid ${LIGHT_YELLOW}`,
    borderRadius: "50%",
    animation: "spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite",
    position: "relative",
    boxShadow: `0 0 60px ${AEGEAN_BLUE}33, 0 0 80px ${CORAL_PINK}1A, 0 0 100px ${LIGHT_YELLOW}0D`,
  };

  // Intermediate nested counter-spinning element
  const innerSpinnerStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: `${SPINNER_SIZE * 0.55}px`,
    height: `${SPINNER_SIZE * 0.55}px`,
    border: `4px solid #F5EDE0`,
    borderBottom: `4px solid ${LIGHT_YELLOW}`,
    borderLeft: `4px solid ${GREEN}`,
    borderRight: `4px solid ${AEGEAN_BLUE}`,
    borderRadius: "50%",
    animation: "spin 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite reverse",
  };

  // Center core glowing focal dot
  const centerDotStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: `${SPINNER_SIZE * 0.15}px`,
    height: `${SPINNER_SIZE * 0.15}px`,
    background: `linear-gradient(135deg, ${AEGEAN_BLUE}, ${CORAL_PINK})`,
    borderRadius: "50%",
    boxShadow: `0 0 30px ${AEGEAN_BLUE}66, 0 0 50px ${CORAL_PINK}33`,
    animation: "pulse 1.8s ease-in-out infinite",
  };

  // Outer ambient dashed tracking ring
  const outerRingStyle = {
    position: "absolute",
    top: "-12px",
    left: "-12px",
    right: "-12px",
    bottom: "-12px",
    borderRadius: "50%",
    border: `2px dashed ${AEGEAN_BLUE}26`,
    animation: "spin 10s linear infinite",
  };

  // Outer ambient secondary dashed tracking ring
  const ringDotsStyle = {
    position: "absolute",
    width: `${SPINNER_SIZE + 40}px`,
    height: `${SPINNER_SIZE + 40}px`,
    borderRadius: "50%",
    border: `1.5px dashed ${CORAL_PINK}1A`,
    animation: "spin 7s linear infinite reverse",
  };

  return (
    <div style={containerStyle}>
      {/* Background glow effects */}
      <div style={glowStyle} />
      <div style={glowStyle2} />
      <div style={glowStyle3} />
      <div style={glowStyle4} />

      {/* Upgraded Multi-Layered Spinner Hierarchy */}
      <div style={{ position: "relative" }}>
        <div style={ringDotsStyle} />
        <div style={spinnerStyle}>
          <div style={outerRingStyle} />
          <div style={innerSpinnerStyle} />
          <div style={centerDotStyle} />
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.15); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.25); }
        }
      `}</style>
    </div>
  );
};

// All clean pipeline presets point directly to the pure upgraded fullscreen spinner
export const PageLoader = () => <LoadingSpinner />;
export const ChartLoader = () => <LoadingSpinner />;
export const DataLoader = () => <LoadingSpinner />;
export const MinimalLoader = () => <LoadingSpinner />;
export const SplashLoader = () => <LoadingSpinner />;
