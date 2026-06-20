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
      {/* Logo Section - Only Logo, No Navigation Buttons */}
      <div style={logoSectionStyle} onClick={handleNavigate}>
        <img src={logo} alt="GraphForge Logo" style={logoImageStyle} />
        <h1 style={logoTextStyle}>GRAPHFORGE</h1>
        <span style={versionStyle}>v1.0</span>
      </div>
    </header>
  );
};

// ============================================
// STYLES
// ============================================

const headerStyle = {
  background: "#FFFFFF",
  borderBottom: "1px solid #D4C4AE",
  padding: "12px 28px",
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
};

const logoSectionStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  cursor: "pointer",
};

const logoImageStyle = {
  width: "40px",
  height: "40px",
  objectFit: "contain",
  filter: "drop-shadow(0 0 10px rgba(168, 220, 240, 0.15))",
};

const logoTextStyle = {
  color: "#4A3728",
  fontSize: "20px",
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

export default NavBar;
