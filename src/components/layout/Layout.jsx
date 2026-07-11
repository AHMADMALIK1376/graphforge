// src/components/layout/Layout.jsx
import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const location = useLocation();
  const { isRTL } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth > 900;
  });
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 900;
  });

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

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 900;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          width: "100%",
        }}
      >
        {/* Sidebar */}
        <Sidebar
          currentPath={location.pathname}
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
          isMobile={isMobile}
        />

        {/* Scrollable Content */}
        <main
          className="page-main"
          style={{
            flex: 1,
            padding: isMobile ? "16px 16px 24px" : "24px 32px",
            marginLeft: isMobile ? "0px" : sidebarOpen ? "240px" : "0px",
            overflowY: "auto",
            overflowX: "hidden",
            background: "#F5EDE0",
            transition: "margin-left 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
            height: "100%",
            width: "100%",
            boxSizing: "border-box",
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
