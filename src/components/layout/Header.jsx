import React from "react";
import { theme } from "../../styles/theme";

const Header = ({ onNavigate, currentPage = "home" }) => {
  const headerStyle = {
    background: theme.colors.cardBg,
    borderBottom: `1px solid ${theme.colors.border.default}`,
    padding: `${theme.spacing.sm} ${theme.spacing.xl}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily: theme.typography.fontFamily.primary,
    position: "sticky",
    top: 0,
    zIndex: theme.zIndex.sticky,
  };

  const logoSectionStyle = {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.md,
    cursor: "pointer",
  };

  const logoIconStyle = {
    fontSize: "28px",
    lineHeight: 1,
  };

  const logoTextStyle = {
    color: theme.colors.text.heading,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: theme.typography.letterSpacing.wide,
    margin: 0,
  };

  const versionStyle = {
    color: theme.colors.text.muted,
    fontSize: theme.typography.fontSize.xs,
    background: theme.colors.inputBg,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.borderRadius.sharp,
    border: `1px solid ${theme.colors.border.light}`,
  };

  const navStyle = {
    display: "flex",
    gap: theme.spacing.xs,
    alignItems: "center",
  };

  const navLinkStyle = (isActive) => ({
    color: isActive ? theme.colors.text.heading : theme.colors.text.muted,
    background: isActive ? theme.colors.hoverBg : "transparent",
    border: isActive
      ? `1px solid ${theme.colors.border.default}`
      : "1px solid transparent",
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.sharp,
    cursor: "pointer",
    fontSize: theme.typography.fontSize.sm,
    fontWeight: isActive
      ? theme.typography.fontWeight.semibold
      : theme.typography.fontWeight.normal,
    textTransform: "uppercase",
    letterSpacing: theme.typography.letterSpacing.wide,
    transition: theme.transitions.fast,
    textDecoration: "none",
    fontFamily: theme.typography.fontFamily.primary,
  });

  const totalChartsStyle = {
    color: theme.colors.charts[0],
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    background: theme.colors.categories.comparison.light,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.borderRadius.sharp,
    marginLeft: theme.spacing.sm,
  };

  return (
    <header style={headerStyle}>
      {/* Logo */}
      <div
        style={logoSectionStyle}
        onClick={() => onNavigate && onNavigate("home")}
      >
        <span style={logoIconStyle}>📊</span>
        <h1 style={logoTextStyle}>GRAPHFORGE</h1>
        <span style={versionStyle}>v1.0</span>
      </div>

      {/* Navigation */}
      <nav style={navStyle}>
        <button
          style={navLinkStyle(currentPage === "home")}
          onClick={() => onNavigate && onNavigate("home")}
          onMouseEnter={(e) => {
            if (currentPage !== "home") {
              e.target.style.color = theme.colors.text.heading;
              e.target.style.borderColor = theme.colors.border.default;
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== "home") {
              e.target.style.color = theme.colors.text.muted;
              e.target.style.borderColor = "transparent";
            }
          }}
        >
          ▸ Charts
          <span style={totalChartsStyle}>69</span>
        </button>

        <button
          style={navLinkStyle(currentPage === "about")}
          onClick={() => onNavigate && onNavigate("about")}
          onMouseEnter={(e) => {
            if (currentPage !== "about") {
              e.target.style.color = theme.colors.text.heading;
              e.target.style.borderColor = theme.colors.border.default;
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== "about") {
              e.target.style.color = theme.colors.text.muted;
              e.target.style.borderColor = "transparent";
            }
          }}
        >
          ▸ About
        </button>
      </nav>
    </header>
  );
};

export default Header;
