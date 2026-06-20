// src/components/common/SearchBar.jsx
import React from "react";

const SearchBar = ({ value, onChange, placeholder = "SEARCH CHARTS..." }) => {
  return (
    <div style={searchWrapperStyle}>
      <div style={searchTabStyle}>
        <div style={searchDotStyle("#F88379")} />
        <div style={searchDotStyle("#FFEB3B")} />
        <div style={searchDotStyle("#82C8E5")} />
      </div>
      <div style={searchContainerStyle}>
        <span style={searchIconStyle}>⌕</span>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={searchInputStyle}
        />
      </div>
    </div>
  );
};

const searchWrapperStyle = {
  maxWidth: "520px",
  margin: "0 auto",
  position: "relative",
};

const searchTabStyle = {
  position: "absolute",
  top: "-10px",
  left: "0",
  width: "40%",
  height: "10px",
  background: "#D4C4AE",
  borderRadius: "3px 3px 0 0",
  display: "flex",
  alignItems: "center",
  padding: "0 10px",
  gap: "4px",
};

const searchDotStyle = (color) => ({
  width: "5px",
  height: "5px",
  background: color,
  borderRadius: "50%",
});

const searchContainerStyle = {
  position: "relative",
  border: "1px solid #D4C4AE",
  borderRadius: "0 6px 6px 6px",
  background: "#FFFFFF",
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(180, 160, 140, 0.10)",
};

const searchIconStyle = {
  position: "absolute",
  left: "14px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#8A7A6A",
  fontSize: "18px",
};

const searchInputStyle = {
  width: "100%",
  padding: "14px 16px 14px 40px",
  background: "transparent",
  border: "none",
  color: "#5C4A3A",
  fontSize: "13px",
  fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive", // Changed from Inter to Bungee
  letterSpacing: "2px", // Increased from 1px to 2px for better readability
  outline: "none",
  boxSizing: "border-box",
};

export default SearchBar;
