// src/components/layout/Sidebar.jsx
import React, { useState } from "react";
import FolderButton from "../common/FolderButton";
import { useLanguage } from "../../context/LanguageContext";

const Sidebar = ({ currentPath = "", isOpen = true, onToggle = () => {} }) => {
  const { t } = useLanguage();

  // Track currently hovered item path to sync tab and body colors cleanly
  const [hoveredPath, setHoveredPath] = useState(null);

  // Alternating themes: Blue, Pink, Blue, Pink, Blue... (Emojis removed)
  const navItems = [
    {
      path: "/home",
      label: t("nav.home"),
      color: "#0077C8", // Aegean Blue
    },
    {
      path: "/charts",
      label: t("nav.charts"),
      color: "#F88379", // Coral Pink
    },
    {
      path: "/templates",
      label: t("nav.templates"),
      color: "#0077C8", // Aegean Blue
    },
    {
      path: "/about",
      label: t("nav.about"),
      color: "#F88379", // Coral Pink
    },
    {
      path: "/settings",
      label: t("nav.settings"),
      color: "#0077C8", // Aegean Blue
    },
  ];

  const isActive = (path) => {
    if (path === "/charts") {
      return (
        currentPath.startsWith("/charts") || currentPath.startsWith("/chart")
      );
    }
    return currentPath === path;
  };

  // Arrow Left Icon for close button (inside sidebar)
  const ArrowLeftIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );

  // Arrow Right Icon for open button (floating)
  const ArrowRightIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );

  return (
    <>
      {/* Floating Toggle Button - When sidebar is closed */}
      {!isOpen && (
        <div style={floatingWrapperStyle}>
          <div style={floatingFolderTabStyle}>
            <div style={folderTabDotStyle} />
            <div style={folderTabDotStyle} />
            <div style={folderTabDotStyle} />
          </div>
          <button
            onClick={onToggle}
            style={floatingFolderBodyStyle}
            aria-label="Open sidebar"
            className="sidebar-toggle-floating"
          >
            <ArrowRightIcon />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <aside
        style={{
          ...asideStyle,
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          width: isOpen ? "240px" : "0",
          padding: isOpen ? "0" : "0",
          overflow: "hidden",
          transition:
            "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), width 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        {/* Custom Scrollbar and Base Utilities */}
        <style>{`
          .nav-scroll-container {
            scrollbar-width: thin;
            scrollbar-color: transparent transparent;
            transition: scrollbar-color 0.3s ease;
          }
          .nav-scroll-container:hover {
            scrollbar-color: #D4C4AE #F5EDE0;
          }
          .nav-scroll-container::-webkit-scrollbar {
            width: 4px;
            transition: all 0.3s ease;
          }
          .nav-scroll-container::-webkit-scrollbar-track {
            background: transparent;
            border-radius: 2px;
            transition: background 0.3s ease;
          }
          .nav-scroll-container:hover::-webkit-scrollbar-track {
            background: #F5EDE0;
          }
          .nav-scroll-container::-webkit-scrollbar-thumb {
            background: transparent;
            border-radius: 2px;
            transition: background 0.3s ease;
          }
          .nav-scroll-container:hover::-webkit-scrollbar-thumb {
            background: #D4C4AE;
          }
          .nav-scroll-container::-webkit-scrollbar-thumb:hover {
            background: #B0A090;
          }

          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: scale(0.85);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .sidebar-toggle-floating {
            animation: slideIn 0.25s ease forwards;
          }

          .sidebar-folder-btn:hover, .sidebar-toggle-floating:hover {
            background: #F5EDE0 !important;
            border-color: #B0A090 !important;
            color: #4A3728 !important;
          }
        `}</style>

        {/* Sidebar Content Wrapper */}
        <div style={sidebarWrapperStyle}>
          {/* Sidebar Header with Toggle Button */}
          <div style={sidebarHeaderStyle}>
            <div style={headerTopRowStyle}>
              {/* Close Button - Folder style */}
              <div style={closeButtonWrapperStyle}>
                <div style={closeFolderTabStyle}>
                  <div style={folderTabDotStyle} />
                  <div style={folderTabDotStyle} />
                  <div style={folderTabDotStyle} />
                </div>
                <button
                  onClick={onToggle}
                  style={closeFolderBodyStyle}
                  aria-label="Close sidebar"
                  className="sidebar-folder-btn"
                >
                  <ArrowLeftIcon />
                </button>
              </div>

              {/* Brand Text (Emoji Cleaned) */}
              <div style={brandTextStyle}>
                <span style={brandNameStyle}>GraphForge</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={dividerStyle} />

          {/* Navigation with Scroll */}
          <div className="nav-scroll-container" style={navScrollContainerStyle}>
            <nav style={navStyle}>
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <div key={item.path} style={navItemWrapperStyle}>
                    <FolderButton
                      to={item.path}
                      baseColor={item.color}
                      active={active}
                      showDot={active}
                      bodyStyle={{ width: "100%" }}
                    >
                      {item.label}
                    </FolderButton>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Bottom Section - Fixed at bottom */}
          {isOpen && (
            <div style={bottomSectionStyle}>
              <div style={dividerStyle} />
              <div style={versionStyle}>
                <span style={versionIconStyle}>⚡</span>
                <span style={versionTextStyle}>GraphForge v1.0.0</span>
              </div>
              <div style={statusStyle}>
                <span style={statusDotStyle} />
                <span style={statusTextStyle}>All systems ready</span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

// ============================================
// STYLES
// ============================================

// Floating Button (Closed Sidebar)
const floatingWrapperStyle = {
  position: "fixed",
  top: "76px",
  left: "12px",
  zIndex: 300,
  marginTop: "8px",
};

const floatingFolderTabStyle = {
  position: "absolute",
  top: "-6px",
  left: "0",
  height: "6px",
  width: "40%",
  background: "#D4C4AE",
  borderRadius: "3px 3px 0 0",
  display: "flex",
  alignItems: "center",
  padding: "0 6px",
  gap: "2px",
};

const floatingFolderBodyStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "6px 8px",
  background: "#FFFFFF",
  border: "1px solid #D4C4AE",
  borderRadius: "0 4px 4px 4px",
  cursor: "pointer",
  transition: "all 0.25s ease",
  color: "#8A7A6A",
  width: "32px",
  height: "32px",
  boxShadow: "none",
};

// Close Button (Open Sidebar)
const closeButtonWrapperStyle = {
  position: "relative",
  flexShrink: 0,
};

const closeFolderTabStyle = {
  position: "absolute",
  top: "-6px",
  left: "0",
  height: "6px",
  width: "40%",
  background: "#D4C4AE",
  borderRadius: "3px 3px 0 0",
  display: "flex",
  alignItems: "center",
  padding: "0 6px",
  gap: "2px",
};

const closeFolderBodyStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "6px 8px",
  background: "#FFFFFF",
  border: "1px solid #D4C4AE",
  borderRadius: "0 4px 4px 4px",
  cursor: "pointer",
  transition: "all 0.25s ease",
  color: "#8A7A6A",
  width: "32px",
  height: "32px",
  boxShadow: "none",
};

// Shared styles
const folderTabDotStyle = {
  width: "3px",
  height: "3px",
  background: "rgba(255,255,255,0.6)",
  borderRadius: "50%",
};

const asideStyle = {
  background: "#FFFFFF",
  borderRight: "1px solid #D4C4AE",
  height: "calc(100vh - 64px)",
  position: "fixed",
  top: "64px",
  left: 0,
  fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
  flexShrink: 0,
  boxShadow: "2px 0 8px rgba(180, 160, 140, 0.06)",
  zIndex: 200,
};

const sidebarWrapperStyle = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
};

// Header Styles
const headerTopRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  width: "100%",
};

const brandTextStyle = {
  display: "flex",
  alignItems: "center",
  paddingLeft: "4px",
  flex: 1,
};

const brandNameStyle = {
  fontSize: "14px",
  fontWeight: 700,
  color: "#4A3728",
  letterSpacing: "2px",
  fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
};

const sidebarHeaderStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
  padding: "12px 16px 8px 16px",
  flexShrink: 0,
};

// Other Styles
const dividerStyle = {
  height: "1px",
  background: "#E8DCC8",
  margin: "0 16px",
  flexShrink: 0,
};

const navScrollContainerStyle = {
  flex: 1,
  overflowY: "auto",
  overflowX: "hidden",
  padding: "8px 0",
  margin: "4px 0",
  scrollBehavior: "smooth",
};

const navStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  padding: "0 12px",
};

const navItemWrapperStyle = {
  position: "relative",
  marginTop: "8px",
};

const folderTabStyle = (bgColor) => ({
  position: "absolute",
  top: "-8px",
  left: "0",
  height: "8px",
  width: "40%",
  background: bgColor,
  borderRadius: "3px 3px 0 0",
  display: "flex",
  alignItems: "center",
  padding: "0 8px",
  gap: "2px",
  transition: "background 0.2s ease",
});

const folderBodyStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "10px 18px",
  textDecoration: "none",
  borderRadius: "0 4px 4px 4px",
  border: "2px solid",
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  fontSize: "13px",
  letterSpacing: "1px",
  fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
  position: "relative",
};

const labelStyle = {
  flex: 1,
};

const dotStyle = {
  width: "6px",
  height: "6px",
  borderRadius: "50%",
  flexShrink: 0,
};

const bottomSectionStyle = {
  flexShrink: 0,
  padding: "12px 16px 16px",
  background: "#FFFFFF",
  borderTop: "1px solid #E8DCC8",
};

const versionStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "6px 0",
};

const versionIconStyle = {
  fontSize: "14px",
};

const versionTextStyle = {
  fontSize: "10px",
  color: "#8A7A6A",
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
  letterSpacing: "1px",
};

const statusStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "6px 0",
};

const statusDotStyle = {
  width: "6px",
  height: "6px",
  borderRadius: "50%",
  background: "#4CAF50",
  animation: "pulse 2s infinite",
};

const statusTextStyle = {
  fontSize: "10px",
  color: "#8A7A6A",
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
  letterSpacing: "1px",
};

export default Sidebar;
