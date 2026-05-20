import React from "react";

const Header = ({ onNavigate, currentPage = "home" }) => {
  return (
    <header style={headerStyle}>
      {/* Logo */}
      <div style={logoSection} onClick={() => onNavigate && onNavigate("home")}>
        <span style={{ fontSize: "24px" }}>📊</span>
        <h1 style={logoText}>GRAPHFORGE</h1>
        <span style={versionBadge}>v1.0</span>
      </div>

      {/* Navigation - Folder Tab Style */}
      <nav style={navStyle}>
        {/* Charts Button - Folder Style */}
        <div style={navItemWrapper}>
          <div style={navTabStyle(currentPage === "home", "#58a6ff")}>
            <span style={navTabDot} />
            <span style={navTabDot} />
            <span style={navTabDot} />
          </div>
          <button
            onClick={() => onNavigate && onNavigate("home")}
            style={navBtnStyle(currentPage === "home", "#58a6ff")}
          >
            ▸ Charts <span style={badgeStyle}>69</span>
          </button>
        </div>

        {/* About Button - Folder Style */}
        <div style={navItemWrapper}>
          <div style={navTabStyle(currentPage === "about", "#a371f7")}>
            <span style={navTabDot} />
            <span style={navTabDot} />
            <span style={navTabDot} />
          </div>
          <button
            onClick={() => onNavigate && onNavigate("about")}
            style={navBtnStyle(currentPage === "about", "#a371f7")}
          >
            ▸ About
          </button>
        </div>
      </nav>
    </header>
  );
};

// Styles
const headerStyle = {
  background: "#0d1117",
  borderBottom: "1px solid #21262d",
  padding: "10px 28px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
  position: "sticky",
  top: 0,
  zIndex: 200,
};

const logoSection = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  cursor: "pointer",
};

const logoText = {
  color: "#f0f6fc",
  fontSize: "18px",
  fontWeight: 700,
  letterSpacing: "3px",
  margin: 0,
};

const versionBadge = {
  color: "#8b949e",
  fontSize: "9px",
  background: "#161b22",
  padding: "2px 8px",
  borderRadius: "2px",
  border: "1px solid #30363d",
};

const navStyle = {
  display: "flex",
  gap: "16px",
  alignItems: "center",
};

const navItemWrapper = {
  position: "relative",
};

const navTabStyle = (isActive, color) => ({
  position: "absolute",
  top: "-8px",
  left: "0",
  right: "0",
  height: "8px",
  background: isActive ? color : "#21262d",
  borderRadius: "3px 3px 0 0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "3px",
  padding: "0 8px",
});

const navTabDot = {
  width: "3px",
  height: "3px",
  background: "rgba(255,255,255,0.4)",
  borderRadius: "50%",
};

const navBtnStyle = (isActive, color) => ({
  padding: "8px 16px",
  background: isActive ? `${color}15` : "transparent",
  border: isActive ? `1px solid ${color}50` : "1px solid #21262d",
  borderRadius: "0 0 4px 4px",
  color: isActive ? color : "#8b949e",
  cursor: "pointer",
  fontSize: "12px",
  fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
  fontWeight: isActive ? 700 : 400,
  letterSpacing: "1px",
  textTransform: "uppercase",
  transition: "all 0.15s ease",
  display: "flex",
  alignItems: "center",
  gap: "6px",
});

const badgeStyle = {
  background: "#58a6ff20",
  color: "#58a6ff",
  fontSize: "9px",
  padding: "1px 6px",
  borderRadius: "2px",
  fontWeight: 700,
};

export default Header;
