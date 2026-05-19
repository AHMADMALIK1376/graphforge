import React, { useState } from "react";
import { theme, getCategoryColor } from "../styles/theme";
import { getChartById } from "../utils/chartTypes";
import Header from "../components/layout/Header";
import ColorPicker from "../components/common/ColorPicker";

const ChartPage = ({ chartId, onBack }) => {
  const chart = getChartById(chartId);
  const [chartColor, setChartColor] = useState(theme.colors.charts[0]);
  const [data, setData] = useState([
    { label: "A", value: 30 },
    { label: "B", value: 50 },
    { label: "C", value: 70 },
    { label: "D", value: 40 },
    { label: "E", value: 60 },
  ]);
  const [chartTitle, setChartTitle] = useState(chart?.name || "Chart");

  if (!chart) {
    return (
      <div style={pageStyle}>
        <Header />
        <div style={contentStyle}>
          <div style={errorStyle}>
            <span style={{ fontSize: "48px" }}>⚠</span>
            <p style={{ color: theme.colors.text.muted }}>CHART NOT FOUND</p>
            <button onClick={onBack} style={backBtnStyle}>
              ← BACK TO CHARTS
            </button>
          </div>
        </div>
      </div>
    );
  }

  const categoryColor = getCategoryColor(chart.categoryId);

  return (
    <div style={pageStyle}>
      <Header currentPage="charts" />

      <div style={contentStyle}>
        {/* Breadcrumb */}
        <div style={breadcrumbStyle}>
          <button onClick={onBack} style={backLinkStyle}>
            ← ALL CHARTS
          </button>
          <span style={separatorStyle}>/</span>
          <span style={categoryStyle}>{chart.categoryName}</span>
          <span style={separatorStyle}>/</span>
          <span style={currentStyle}>{chart.name.toUpperCase()}</span>
        </div>

        {/* Chart Info Bar */}
        <div style={infoBarStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "32px" }}>{chart.icon}</span>
            <div>
              <input
                type="text"
                value={chartTitle}
                onChange={(e) => setChartTitle(e.target.value)}
                style={titleInputStyle}
              />
              <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                <span style={badgeStyle(chart.difficulty)}>
                  {chart.difficulty.toUpperCase()}
                </span>
                <span
                  style={{
                    ...badgeStyle(""),
                    color: categoryColor,
                    borderColor: categoryColor,
                  }}
                >
                  {chart.categoryName.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={workspaceStyle}>
          {/* Chart Area */}
          <div style={chartAreaStyle}>
            <div style={chartPlaceholderStyle}>
              <span style={{ fontSize: "64px" }}>{chart.icon}</span>
              <p
                style={{ color: theme.colors.text.muted, letterSpacing: "2px" }}
              >
                {chart.name.toUpperCase()}
              </p>
              <p
                style={{
                  color: theme.colors.text.placeholder,
                  fontSize: "11px",
                }}
              >
                CHART WILL RENDER HERE
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div style={sidebarStyle}>
            {/* Color Picker */}
            <div style={sidebarSectionStyle}>
              <ColorPicker
                selectedColor={chartColor}
                onColorChange={setChartColor}
                label="Chart Color"
              />
            </div>

            {/* Data Table */}
            <div style={sidebarSectionStyle}>
              <label style={sidebarLabelStyle}>DATA</label>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>LABEL</th>
                    <th style={thStyle}>VALUE</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={i}>
                      <td style={tdStyle}>
                        <input
                          value={row.label}
                          onChange={(e) => {
                            const newData = [...data];
                            newData[i].label = e.target.value;
                            setData(newData);
                          }}
                          style={cellInputStyle}
                        />
                      </td>
                      <td style={tdStyle}>
                        <input
                          type="number"
                          value={row.value}
                          onChange={(e) => {
                            const newData = [...data];
                            newData[i].value = Number(e.target.value);
                            setData(newData);
                          }}
                          style={cellInputStyle}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={() => setData([...data, { label: "", value: 0 }])}
                style={addRowBtnStyle}
              >
                + ADD ROW
              </button>
            </div>

            {/* Export */}
            <div style={sidebarSectionStyle}>
              <label style={sidebarLabelStyle}>EXPORT</label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                }}
              >
                {["PNG", "SVG", "CSV", "JSON"].map((fmt) => (
                  <button key={fmt} style={exportBtnStyle}>
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== STYLES =====
const pageStyle = {
  background: theme.colors.mainBg,
  minHeight: "100vh",
  fontFamily: theme.typography.fontFamily.primary,
};

const contentStyle = {
  maxWidth: "1400px",
  margin: "0 auto",
  padding: theme.spacing.lg,
};

const breadcrumbStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: theme.spacing.lg,
  fontSize: theme.typography.fontSize.sm,
  letterSpacing: "1px",
};

const backLinkStyle = {
  background: "none",
  border: "none",
  color: theme.colors.charts[0],
  cursor: "pointer",
  fontSize: theme.typography.fontSize.sm,
  fontFamily: theme.typography.fontFamily.primary,
  letterSpacing: "1px",
  padding: 0,
};

const separatorStyle = { color: theme.colors.text.muted };

const categoryStyle = { color: theme.colors.text.muted };
const currentStyle = {
  color: theme.colors.text.heading,
  fontWeight: theme.typography.fontWeight.bold,
};

const infoBarStyle = {
  background: theme.colors.cardBg,
  border: `1px solid ${theme.colors.border.default}`,
  borderRadius: theme.borderRadius.sharp,
  padding: theme.spacing.lg,
  marginBottom: theme.spacing.lg,
};

const titleInputStyle = {
  background: "transparent",
  border: "none",
  borderBottom: `1px solid ${theme.colors.border.light}`,
  color: theme.colors.text.heading,
  fontSize: theme.typography.fontSize.xxl,
  fontWeight: theme.typography.fontWeight.bold,
  fontFamily: theme.typography.fontFamily.primary,
  letterSpacing: "2px",
  outline: "none",
  padding: "4px 0",
  width: "400px",
};

const badgeStyle = (difficulty) => ({
  color:
    difficulty === "easy"
      ? theme.colors.status.success
      : difficulty === "medium"
        ? theme.colors.status.warning
        : theme.colors.status.error,
  border: `1px solid ${theme.colors.border.default}`,
  padding: "2px 8px",
  fontSize: "10px",
  letterSpacing: "2px",
  borderRadius: theme.borderRadius.sharp,
});

const workspaceStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 350px",
  gap: theme.spacing.lg,
};

const chartAreaStyle = {
  background: "#ffffff",
  border: `1px solid ${theme.colors.border.default}`,
  borderRadius: theme.borderRadius.sharp,
  minHeight: "500px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const chartPlaceholderStyle = {
  textAlign: "center",
};

const sidebarStyle = {
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing.md,
};

const sidebarSectionStyle = {
  background: theme.colors.cardBg,
  border: `1px solid ${theme.colors.border.default}`,
  borderRadius: theme.borderRadius.sharp,
  padding: theme.spacing.md,
};

const sidebarLabelStyle = {
  color: theme.colors.text.muted,
  fontSize: theme.typography.fontSize.xs,
  fontWeight: theme.typography.fontWeight.bold,
  letterSpacing: "2px",
  marginBottom: theme.spacing.sm,
  display: "block",
};

const tableStyle = { width: "100%", borderCollapse: "collapse" };
const thStyle = {
  color: theme.colors.text.muted,
  fontSize: "10px",
  letterSpacing: "2px",
  padding: "6px 4px",
  textAlign: "left",
  borderBottom: `1px solid ${theme.colors.border.default}`,
};

const tdStyle = { padding: "4px" };

const cellInputStyle = {
  width: "100%",
  padding: "6px 8px",
  background: theme.colors.inputBg,
  border: `1px solid ${theme.colors.border.light}`,
  borderRadius: theme.borderRadius.sharp,
  color: theme.colors.text.body,
  fontSize: "12px",
  fontFamily: theme.typography.fontFamily.primary,
  outline: "none",
  boxSizing: "border-box",
};

const addRowBtnStyle = {
  width: "100%",
  marginTop: "8px",
  padding: "8px",
  background: "transparent",
  border: `1px dashed ${theme.colors.border.default}`,
  borderRadius: theme.borderRadius.sharp,
  color: theme.colors.text.muted,
  cursor: "pointer",
  fontSize: "11px",
  fontFamily: theme.typography.fontFamily.primary,
  letterSpacing: "1px",
};

const exportBtnStyle = {
  padding: "10px",
  background: theme.colors.inputBg,
  border: `1px solid ${theme.colors.border.default}`,
  borderRadius: theme.borderRadius.sharp,
  color: theme.colors.text.body,
  cursor: "pointer",
  fontSize: "11px",
  fontFamily: theme.typography.fontFamily.primary,
  letterSpacing: "1px",
};

const backBtnStyle = {
  padding: "10px 20px",
  background: "transparent",
  border: `1px solid ${theme.colors.charts[0]}`,
  borderRadius: theme.borderRadius.sharp,
  color: theme.colors.charts[0],
  cursor: "pointer",
  fontFamily: theme.typography.fontFamily.primary,
  letterSpacing: "1px",
};

const errorStyle = {
  textAlign: "center",
  padding: "100px 0",
};

export default ChartPage;
