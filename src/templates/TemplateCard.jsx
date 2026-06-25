import React from "react";

const TemplateCard = ({ template, onClick }) => {
  const folderColor = template.color || "#0077C8";

  const cardWrapperStyle = {
    position: "relative",
    marginTop: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const folderTabStyle = {
    position: "absolute",
    top: "-12px",
    left: "0",
    height: "12px",
    width: "60%",
    background: folderColor,
    borderRadius: "3px 3px 0 0",
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    zIndex: 1,
  };

  const folderTabDotStyle = {
    width: "4px",
    height: "4px",
    background: "rgba(255,255,255,0.6)",
    borderRadius: "50%",
    marginRight: "3px",
  };

  const folderBodyStyle = {
    background: `linear-gradient(135deg, ${folderColor}dd, ${folderColor}99)`,
    border: `1px solid ${folderColor}`,
    borderRadius: "0 4px 4px 4px",
    padding: "20px 16px 16px",
    minHeight: "200px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    position: "relative",
    overflow: "hidden",
    boxShadow: `0 4px 12px ${folderColor}40`,
    transition: "all 0.3s ease",
  };

  const shineStyle = {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    height: "40%",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%)",
    borderRadius: "0 4px 0 0",
    pointerEvents: "none",
  };

  const iconStyle = {
    fontSize: "36px",
    lineHeight: 1,
    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
  };

  const cardTitleStyle = {
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: 700,
    letterSpacing: "1px",
    margin: 0,
    fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
  };

  const cardTextStyle = {
    color: "rgba(255,255,255,0.85)",
    fontSize: "12px",
    margin: 0,
    fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
    lineHeight: 1.5,
    textShadow: "0 1px 2px rgba(0,0,0,0.2)",
  };

  const categoryStyle = {
    color: "rgba(255,255,255,0.9)",
    fontSize: "9px",
    fontWeight: 600,
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginTop: "4px",
    background: "rgba(0,0,0,0.2)",
    padding: "2px 8px",
    borderRadius: "2px",
    alignSelf: "flex-start",
  };

  const chartTypesStyle = {
    display: "flex",
    gap: "4px",
    flexWrap: "wrap",
    marginTop: "4px",
  };

  const chartTagStyle = {
    padding: "2px 8px",
    background: "rgba(255,255,255,0.2)",
    borderRadius: "3px",
    fontSize: "8px",
    color: "rgba(255,255,255,0.9)",
    letterSpacing: "0.5px",
  };

  const tagStyle = {
    position: "absolute",
    top: "12px",
    right: "12px",
    padding: "2px 10px",
    background: "rgba(255,255,255,0.25)",
    color: "#FFFFFF",
    fontSize: "8px",
    fontWeight: 700,
    letterSpacing: "1px",
    borderRadius: "3px",
    textTransform: "uppercase",
    backdropFilter: "blur(4px)",
    border: "1px solid rgba(255,255,255,0.2)",
  };

  const folderLinesStyle = {
    position: "absolute",
    bottom: "12px",
    left: "16px",
    right: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    opacity: 0.3,
    pointerEvents: "none",
  };

  const lineStyle = {
    height: "2px",
    background: "#ffffff",
    borderRadius: "1px",
  };

  const handleMouseEnter = (e) => {
    const body = e.currentTarget.querySelector(".folder-body");
    if (body) {
      body.style.transform = "translateY(-4px)";
      body.style.boxShadow = `0 8px 24px ${folderColor}60`;
    }
  };

  const handleMouseLeave = (e) => {
    const body = e.currentTarget.querySelector(".folder-body");
    if (body) {
      body.style.transform = "translateY(0)";
      body.style.boxShadow = `0 4px 12px ${folderColor}40`;
    }
  };

  return (
    <div
      style={cardWrapperStyle}
      onClick={() => onClick && onClick(template.id)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={folderTabStyle}>
        <div style={folderTabDotStyle} />
        <div style={folderTabDotStyle} />
        <div style={folderTabDotStyle} />
      </div>

      <div className="folder-body" style={folderBodyStyle}>
        <div style={shineStyle} />

        <span style={iconStyle}>{template.icon}</span>
        <h3 style={cardTitleStyle}>{template.title}</h3>
        <p style={cardTextStyle}>{template.description}</p>

        <span style={categoryStyle}>{template.category}</span>

        <div style={chartTypesStyle}>
          {template.charts &&
            template.charts.map((c, i) => (
              <span key={i} style={chartTagStyle}>
                {c}
              </span>
            ))}
        </div>

        <div style={tagStyle}>{template.tag}</div>

        <div style={folderLinesStyle}>
          <div style={{ ...lineStyle, width: "100%" }} />
          <div style={{ ...lineStyle, width: "70%" }} />
          <div style={{ ...lineStyle, width: "85%" }} />
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
