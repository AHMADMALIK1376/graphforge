import React from "react";
import { theme, getCategoryColor } from "../../styles/theme";

const ChartCard = ({ chart, onClick }) => {
  const categoryColor = getCategoryColor(chart.categoryId);

  const cardStyle = {
    background: theme.colors.cardBg,
    border: `1px solid ${theme.colors.border.default}`,
    borderLeft: `3px solid ${categoryColor}`,
    borderRadius: theme.borderRadius.sharp,
    padding: theme.spacing.lg,
    cursor: "pointer",
    transition: theme.transitions.fast,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.sm,
    fontFamily: theme.typography.fontFamily.primary,
    position: "relative",
    overflow: "hidden",
  };

  const iconStyle = {
    fontSize: "32px",
    lineHeight: 1,
  };

  const nameStyle = {
    color: theme.colors.text.heading,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    margin: 0,
    letterSpacing: theme.typography.letterSpacing.wide,
    textTransform: "uppercase",
  };

  const difficultyStyle = {
    color:
      chart.difficulty === "easy"
        ? theme.colors.status.success
        : chart.difficulty === "medium"
          ? theme.colors.status.warning
          : theme.colors.status.error,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    textTransform: "uppercase",
    letterSpacing: theme.typography.letterSpacing.wider,
    background:
      chart.difficulty === "easy"
        ? theme.colors.status.successBg
        : chart.difficulty === "medium"
          ? theme.colors.status.warningBg
          : theme.colors.status.errorBg,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.borderRadius.sharp,
    alignSelf: "flex-start",
  };

  const categoryStyle = {
    color: categoryColor,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
    textTransform: "uppercase",
    letterSpacing: theme.typography.letterSpacing.wider,
    borderBottom: `1px solid ${theme.colors.border.light}`,
    paddingBottom: theme.spacing.sm,
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.borderColor = categoryColor;
    e.currentTarget.style.transform = "translateX(4px)";
    e.currentTarget.style.boxShadow = `4px 0 0 ${categoryColor}`;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.borderColor = theme.colors.border.default;
    e.currentTarget.style.transform = "translateX(0)";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <div
      style={cardStyle}
      onClick={() => onClick(chart.id)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={categoryStyle}>{chart.categoryName}</div>
      <div style={iconStyle}>{chart.icon}</div>
      <h3 style={nameStyle}>{chart.name}</h3>
      <span style={difficultyStyle}>{chart.difficulty}</span>
    </div>
  );
};

export default ChartCard;
