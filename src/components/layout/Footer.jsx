// src/components/layout/Footer.jsx
import React from "react";
import { useLanguage } from "../../context/LanguageContext";

const Footer = () => {
  const { t, language, isRTL } = useLanguage();

  return (
    <footer
      style={{
        background: "#FFFFFF",
        borderTop: "1px solid #D4C4AE",
        padding: "16px 24px",
        textAlign: "center",
        fontSize: "11px",
        color: "#8A7A6A",
        fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
        letterSpacing: "1px",
        marginTop: "auto",
        boxShadow: "0 -2px 8px rgba(180, 160, 140, 0.06)",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <p style={{ margin: 0 }}>
        © {new Date().getFullYear()} GraphForge —{" "}
        {t("footer.tagline") || "Forge Your Data Into Visuals"}
      </p>
      <p
        style={{
          margin: "4px 0 0",
          fontSize: "9px",
          color: "#B0A090",
          fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
          letterSpacing: "2px",
          direction: isRTL ? "rtl" : "ltr",
        }}
      >
        {t("footer.builtWith") || "Built with ❤️ using React & Recharts"}
      </p>
    </footer>
  );
};

export default Footer;
