// src/components/layout/NavBar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logos/Graphforgelogos.png";

const NavBar = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/home");
  };

  return (
    <header style={headerStyle}>
      <div style={logoSectionStyle} onClick={handleNavigate}>
        <img src={logo} alt="GraphForge Logo" style={logoImageStyle} />
        <h1 style={logoTextStyle}>GRAPHFORGE</h1>
        <span style={versionStyle}>v1.0</span>
      </div>
      <div style={statusIndicatorStyle}>
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
