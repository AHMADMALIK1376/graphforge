// src/components/layout/NavBar.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logos/Graphforgelogos.png";

const NavBar = () => {
  const navigate = useNavigate();
  const [isCompact, setIsCompact] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsCompact(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigate = () => {
    navigate("/home");
  };

  return (
    <header
      style={{
        ...headerStyle,
        padding: isCompact ? "8px 16px" : "8px 28px",
        minHeight: isCompact ? "72px" : "64px",
        height: isCompact ? "auto" : "64px",
        flexWrap: isCompact ? "wrap" : "nowrap",
        gap: isCompact ? "8px" : "0",
      }}
    >
      <div
        style={{ ...logoSectionStyle, flexWrap: isCompact ? "wrap" : "nowrap" }}
        onClick={handleNavigate}
      >
        <img
          src={logo}
          alt="GraphForge Logo"
          style={{
            ...logoImageStyle,
            width: isCompact ? "30px" : "36px",
            height: isCompact ? "30px" : "36px",
          }}
        />
        <h1
          style={{
            ...logoTextStyle,
            fontSize: isCompact ? "14px" : "18px",
            letterSpacing: isCompact ? "1.5px" : "3px",
          }}
        >
          GRAPHFORGE
        </h1>
        <span
          style={{
            ...versionStyle,
            display: isCompact ? "none" : "inline-flex",
          }}
        >
          v1.0
        </span>
      </div>
      <div
        style={{
          ...statusIndicatorStyle,
          display: isCompact ? "none" : "flex",
        }}
      >
        <span style={statusDotStyle} />
        <span style={statusTextStyle}>All systems ready</span>
      </div>
    </header>
  );
};

const headerStyle = {
  background: "#FFFFFF",
  borderBottom: "1px solid #D4C4AE",
  padding: "8px 28px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  boxShadow: "0 2px 8px rgba(180, 160, 140, 0.08)",
  height: "64px",
  boxSizing: "border-box",
};

const logoSectionStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  cursor: "pointer",
  userSelect: "none",
};

const logoImageStyle = {
  width: "36px",
  height: "36px",
  objectFit: "contain",
};

const logoTextStyle = {
  color: "#4A3728",
  fontSize: "18px",
  fontWeight: 700,
  letterSpacing: "3px",
  margin: 0,
  fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
};

const versionStyle = {
  color: "#8A7A6A",
  fontSize: "9px",
  background: "#F5EDE0",
  padding: "2px 8px",
  borderRadius: "2px",
  border: "1px solid #D4C4AE",
  fontFamily: "'Inter', sans-serif",
};

const statusIndicatorStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const statusDotStyle = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  background: "#4CAF50",
  animation: "pulse 2s infinite",
};

const statusTextStyle = {
  color: "#8A7A6A",
  fontSize: "11px",
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
  letterSpacing: "1px",
};

// Add pulse animation
const style = document.createElement("style");
style.textContent = `
  @keyframes pulse {
    0% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
    100% { opacity: 0.6; transform: scale(1); }
  }
`;
document.head.appendChild(style);

export default NavBar;
