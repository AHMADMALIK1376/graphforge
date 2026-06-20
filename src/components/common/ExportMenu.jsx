import React, { useState } from "react";
import { theme } from "../../styles/theme";

const ExportMenu = ({
  onExport,
  formats = ["png", "svg", "pdf", "csv", "json", "excel"],
  label = "⬇ Export",
  type = "all", // 'all' | 'chart' | 'data'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatInfo = {
    png: {
      icon: "🖼️",
      label: "PNG Image",
      desc: "High quality image",
      category: "chart",
    },
    svg: {
      icon: "🎨",
      label: "SVG Vector",
      desc: "Scalable graphics",
      category: "chart",
    },
    pdf: {
      icon: "📄",
      label: "PDF Document",
      desc: "Print-ready document",
      category: "chart",
    },
    csv: {
      icon: "📊",
      label: "CSV Data",
      desc: "Spreadsheet compatible",
      category: "data",
    },
    json: {
      icon: "📋",
      label: "JSON Data",
      desc: "Raw data format",
      category: "data",
    },
    excel: {
      icon: "📈",
      label: "Excel File",
      desc: "Microsoft Excel format",
      category: "data",
    },
  };

  // Filter formats based on type
  const filteredFormats = formats.filter((format) => {
    if (type === "chart") return formatInfo[format]?.category === "chart";
    if (type === "data") return formatInfo[format]?.category === "data";
    return true;
  });

  const menuStyle = {
    position: "relative",
    display: "inline-block",
    fontFamily: theme.typography.fontFamily.primary,
  };

  const getButtonStyle = (type) => {
    if (type === "chart") {
      return {
        padding: "8px 16px",
        background: `linear-gradient(135deg, ${theme.colors.charts[0]}, ${theme.colors.charts[1]})`,
        border: "none",
        borderRadius: theme.borderRadius.md,
        color: "#ffffff",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: 700,
        fontFamily: theme.typography.fontFamily.primary,
        letterSpacing: "1px",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        transition: "all 0.2s ease",
      };
    }
    return {
      padding: "8px 16px",
      background: "transparent",
      border: `1px solid ${theme.colors.charts[4] || "#d29922"}`,
      borderRadius: theme.borderRadius.md,
      color: theme.colors.charts[4] || "#d29922",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: 700,
      fontFamily: theme.typography.fontFamily.primary,
      letterSpacing: "1px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      transition: "all 0.2s ease",
    };
  };

  const buttonStyle = getButtonStyle(type);

  const dropdownStyle = {
    position: "absolute",
    top: "100%",
    right: 0,
    marginTop: "4px",
    background: theme.colors.cardBg,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: theme.borderRadius.md,
    boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
    zIndex: 1000,
    minWidth: "220px",
    overflow: "hidden",
  };

  const optionStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 14px",
    cursor: "pointer",
    transition: "background 0.15s ease",
    borderBottom: `1px solid ${theme.colors.border.light}`,
    color: theme.colors.text.body,
    fontSize: "12px",
    fontFamily: theme.typography.fontFamily.primary,
  };

  const descStyle = {
    fontSize: "9px",
    color: theme.colors.text.muted,
    marginTop: "1px",
  };

  return (
    <div style={menuStyle}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={buttonStyle}
        onMouseEnter={(e) => (e.target.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.target.style.opacity = "1")}
      >
        {label}
      </button>

      {isOpen && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999,
            }}
            onClick={() => setIsOpen(false)}
          />
          <div style={dropdownStyle}>
            {filteredFormats.map((format) => {
              const info = formatInfo[format] || {
                icon: "📁",
                label: format,
                desc: "",
              };
              return (
                <div
                  key={format}
                  style={optionStyle}
                  onClick={() => {
                    onExport(format);
                    setIsOpen(false);
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.background = theme.colors.hoverBg)
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.background = "transparent")
                  }
                >
                  <span style={{ fontSize: "18px" }}>{info.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, letterSpacing: "0.5px" }}>
                      {info.label}
                    </div>
                    <div style={descStyle}>{info.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ExportMenu;
