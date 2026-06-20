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
        minHeight: "100vh",
        background: "#F5EDE0",
        color: "#5C4A3A",
        fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
        direction: isRTL ? "rtl" : "ltr",
        paddingTop: "64px", // Height of fixed header
      }}
    >
      <Header currentPage={currentPage} />
      <div
        style={{
          display: "flex",
          flex: 1,
        }}
      >
        <Sidebar
          currentPath={location.pathname}
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
        />
        <main
          style={{
            flex: 1,
            padding: "24px",
            marginLeft: sidebarOpen ? "0" : "0",
            overflow: "auto",
            background: "#F5EDE0",
            transition: "margin-left 0.3s ease",
          }}
        >
          {children || <Outlet />}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
