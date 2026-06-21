// src/components/layout/Layout.jsx
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const location = useLocation();
  const { language, isRTL } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === "/home" || path === "/") return "home";
    if (path.startsWith("/chart")) return "charts";
    if (path === "/about") return "about";
    if (path === "/templates") return "templates";
    if (path === "/settings") return "settings";
    return "home";
  };

  const currentPage = getCurrentPage();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        background: "#F5EDE0",
        color: "#5C4A3A",
        fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
        direction: isRTL ? "rtl" : "ltr",
        position: "relative",
      }}
    >
      {/* Force global overrides */}
      <style>{`
        html, body, #root {
          margin: 0 !important;
          padding: 0 !important;
          height: 100vh !important;
          max-height: 100vh !important;
          overflow: hidden !important;
        }
      `}</style>

      {/* Fixed Header */}
      <Header currentPage={currentPage} />

      {/* Body Container */}
      <div
        style={{
          display: "flex",
          flex: 1,
          marginTop: "64px",
          height: "calc(100vh - 64px)",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {/* Sidebar */}
        <Sidebar
          currentPath={location.pathname}
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
        />

        {/* Scrollable Content */}
        <main
          style={{
            flex: 1,
            padding: "24px 32px",
            marginLeft: sidebarOpen ? "240px" : "0px",
            overflowY: "auto",
            overflowX: "hidden",
            background: "#F5EDE0",
            transition: "margin-left 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
            height: "100%",
          }}
        >
          <div
            style={{
              minHeight: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ flex: 1 }}>{children || <Outlet />}</div>
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
