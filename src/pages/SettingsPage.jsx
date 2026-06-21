// src/pages/SettingsPage.jsx
import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import Layout from "../components/layout/Layout";

const SettingsPage = () => {
  const { t, language, changeLanguage, isRTL } = useLanguage();

  const [settings, setSettings] = useState({
    darkMode: false,
    autoSave: true,
    exportQuality: "high",
    notifications: true,
    language: language || "en",
    chartAnimations: true,
    showGridLines: true,
    defaultChartType: "bar",
  });

  useEffect(() => {
    setSettings((prev) => ({ ...prev, language: language }));
  }, [language]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    if (key === "language") {
      changeLanguage(value);
    }
  };

  // Color palette matching TemplatesPage and AboutPage
  const AEGEAN_BLUE = "#0077C8";
  const CORAL_PINK = "#F88379";
  const LIGHT_YELLOW = "#F2D24B";
  const WARM_BROWN = "#D4A373";
  const GREEN = "#A9C632";

  const languages = [
    { code: "en", name: "English", native: "English", flag: "🇬🇧" },
    { code: "es", name: "Spanish", native: "Español", flag: "🇪🇸" },
    { code: "fr", name: "French", native: "Français", flag: "🇫🇷" },
    { code: "de", name: "German", native: "Deutsch", flag: "🇩🇪" },
    { code: "it", name: "Italian", native: "Italiano", flag: "🇮🇹" },
    { code: "pt", name: "Portuguese", native: "Português", flag: "🇵🇹" },
    { code: "ru", name: "Russian", native: "Русский", flag: "🇷🇺" },
    { code: "ja", name: "Japanese", native: "日本語", flag: "🇯🇵" },
    { code: "ko", name: "Korean", native: "한국어", flag: "🇰🇷" },
    { code: "zh", name: "Chinese", native: "中文", flag: "🇨🇳" },
    { code: "ar", name: "Arabic", native: "العربية", flag: "🇸🇦" },
    { code: "hi", name: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
    { code: "bn", name: "Bengali", native: "বাংলা", flag: "🇧🇩" },
    { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
    { code: "ur", name: "Urdu", native: "اردو", flag: "🇵🇰" },
    { code: "te", name: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
    { code: "ta", name: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
    { code: "tr", name: "Turkish", native: "Türkçe", flag: "🇹🇷" },
    { code: "nl", name: "Dutch", native: "Nederlands", flag: "🇳🇱" },
    { code: "sv", name: "Swedish", native: "Svenska", flag: "🇸🇪" },
    { code: "pl", name: "Polish", native: "Polski", flag: "🇵🇱" },
    { code: "uk", name: "Ukrainian", native: "Українська", flag: "🇺🇦" },
    { code: "ro", name: "Romanian", native: "Română", flag: "🇷🇴" },
    { code: "el", name: "Greek", native: "Ελληνικά", flag: "🇬🇷" },
    { code: "he", name: "Hebrew", native: "עברית", flag: "🇮🇱" },
    { code: "th", name: "Thai", native: "ไทย", flag: "🇹🇭" },
    { code: "vi", name: "Vietnamese", native: "Tiếng Việt", flag: "🇻🇳" },
    { code: "id", name: "Indonesian", native: "Bahasa Indonesia", flag: "🇮🇩" },
    { code: "ms", name: "Malay", native: "Bahasa Melayu", flag: "🇲🇾" },
    { code: "fil", name: "Filipino", native: "Filipino", flag: "🇵🇭" },
  ];

  const getLanguageDisplay = (code) => {
    const lang = languages.find((l) => l.code === code);
    return lang ? `${lang.flag} ${lang.name} (${lang.native})` : code;
  };

  const settingsSections = [
    {
      id: "appearance",
      icon: "🎨",
      title: t("settings.appearance") || "Appearance",
      color: AEGEAN_BLUE,
      toggleColor: AEGEAN_BLUE,
      settings: [
        {
          id: "darkMode",
          label: t("settings.darkMode") || "Dark Mode",
          type: "toggle",
          value: settings.darkMode,
          onChange: (v) => updateSetting("darkMode", v),
        },
        {
          id: "chartAnimations",
          label: t("settings.chartAnimations") || "Chart Animations",
          type: "toggle",
          value: settings.chartAnimations,
          onChange: (v) => updateSetting("chartAnimations", v),
        },
        {
          id: "showGridLines",
          label: t("settings.showGridLines") || "Show Grid Lines",
          type: "toggle",
          value: settings.showGridLines,
          onChange: (v) => updateSetting("showGridLines", v),
        },
      ],
    },
    {
      id: "data",
      icon: "💾",
      title: t("settings.data") || "Data & Defaults",
      color: CORAL_PINK,
      toggleColor: CORAL_PINK,
      settings: [
        {
          id: "autoSave",
          label: t("settings.autoSave") || "Auto Save",
          type: "toggle",
          value: settings.autoSave,
          onChange: (v) => updateSetting("autoSave", v),
        },
        {
          id: "defaultChartType",
          label: t("settings.defaultChartType") || "Default Chart Type",
          type: "select",
          value: settings.defaultChartType,
          onChange: (v) => updateSetting("defaultChartType", v),
          options: [
            { value: "bar", label: t("settings.barChart") || "Bar Chart" },
            { value: "line", label: t("settings.lineChart") || "Line Chart" },
            { value: "pie", label: t("settings.pieChart") || "Pie Chart" },
            {
              value: "scatter",
              label: t("settings.scatterPlot") || "Scatter Plot",
            },
            { value: "area", label: t("settings.areaChart") || "Area Chart" },
            {
              value: "radar",
              label: t("settings.radarChart") || "Radar Chart",
            },
          ],
        },
      ],
    },
    {
      id: "export",
      icon: "📤",
      title: t("settings.export") || "Export Settings",
      color: LIGHT_YELLOW,
      toggleColor: LIGHT_YELLOW,
      settings: [
        {
          id: "exportQuality",
          label: t("settings.exportQuality") || "Export Quality",
          type: "select",
          value: settings.exportQuality,
          onChange: (v) => updateSetting("exportQuality", v),
          options: [
            { value: "low", label: t("settings.low") || "Low" },
            { value: "medium", label: t("settings.medium") || "Medium" },
            { value: "high", label: t("settings.high") || "High" },
            { value: "ultra", label: t("settings.ultra") || "Ultra" },
          ],
        },
      ],
    },
    {
      id: "notifications",
      icon: "🔔",
      title: t("settings.notifications") || "Notifications",
      color: GREEN,
      toggleColor: GREEN,
      settings: [
        {
          id: "notifications",
          label: t("settings.enableNotifications") || "Enable Notifications",
          type: "toggle",
          value: settings.notifications,
          onChange: (v) => updateSetting("notifications", v),
        },
      ],
    },
    {
      id: "language",
      icon: "🌐",
      title: t("settings.language") || "Language",
      color: WARM_BROWN,
      toggleColor: WARM_BROWN,
      settings: [
        {
          id: "language",
          label: t("settings.selectLanguage") || "Select Language",
          type: "language",
          value: settings.language,
          onChange: (v) => updateSetting("language", v),
          options: languages,
        },
      ],
    },
  ];

  const renderSetting = (setting, sectionToggleColor) => {
    switch (setting.type) {
      case "toggle":
        return (
          <label style={toggleStyle}>
            <input
              type="checkbox"
              checked={setting.value}
              onChange={(e) => setting.onChange(e.target.checked)}
              style={toggleInputStyle}
            />
            <span
              style={{
                ...toggleSliderStyle,
                background: setting.value
                  ? sectionToggleColor
                  : "rgba(255,255,255,0.3)",
              }}
            >
              <span
                style={{
                  ...toggleKnobStyle,
                  transform: setting.value
                    ? "translateX(22px)"
                    : "translateX(2px)",
                }}
              />
            </span>
          </label>
        );
      case "select":
        return (
          <select
            value={setting.value}
            onChange={(e) => setting.onChange(e.target.value)}
            style={selectStyle}
          >
            {setting.options.map((opt) => (
              <option key={opt.value} value={opt.value} style={optionStyle}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      case "language":
        return (
          <div style={languageSelectWrapper}>
            <select
              value={setting.value}
              onChange={(e) => setting.onChange(e.target.value)}
              style={languageSelectStyle}
            >
              {setting.options.map((lang) => (
                <option key={lang.code} value={lang.code} style={optionStyle}>
                  {lang.flag} {lang.name} ({lang.native})
                </option>
              ))}
            </select>
            {settings.language && (
              <div style={selectedLanguageDisplay}>
                <span style={selectedLanguageFlag}>
                  {languages.find((l) => l.code === settings.language)?.flag}
                </span>
                <span style={selectedLanguageName}>
                  {languages.find((l) => l.code === settings.language)?.native}
                </span>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const resetAllSettings = () => {
    if (
      window.confirm(
        t("settings.resetConfirm") ||
          "Are you sure you want to reset all settings to default?",
      )
    ) {
      const defaultLang = "en";
      setSettings({
        darkMode: false,
        autoSave: true,
        exportQuality: "high",
        notifications: true,
        language: defaultLang,
        chartAnimations: true,
        showGridLines: true,
        defaultChartType: "bar",
      });
      changeLanguage(defaultLang);
    }
  };

  return (
    <Layout currentPath="/settings">
      {/* Header */}
      <div style={headerStyle}>
        <h2 style={titleStyle}>⚙️ {t("settings.title") || "Settings"}</h2>
        <p style={subtitleStyle}>
          {t("settings.subtitle") ||
            "Manage your preferences and configurations."}
        </p>

        {/* Current Language Display */}
        <div style={currentLanguageStyle}>
          <span style={currentLanguageLabel}>
            {t("settings.currentLanguage") || "Current Language"}:
          </span>
          <span style={currentLanguageValue}>
            {getLanguageDisplay(settings.language)}
          </span>
        </div>
      </div>

      {/* Settings Cards with Folder Design - Matching TemplatesPage */}
      <div style={settingsContainer}>
        {settingsSections.map((section, index) => (
          <div
            key={index}
            style={cardWrapperStyle}
            onMouseEnter={(e) => {
              const body = e.currentTarget.querySelector(".folder-body");
              if (body) {
                body.style.transform = "translateY(-4px)";
                body.style.boxShadow = `0 8px 24px ${section.color}60`;
              }
            }}
            onMouseLeave={(e) => {
              const body = e.currentTarget.querySelector(".folder-body");
              if (body) {
                body.style.transform = "translateY(0)";
                body.style.boxShadow = `0 4px 12px ${section.color}40`;
              }
            }}
          >
            {/* Folder Tab */}
            <div style={folderTabStyle(section.color)}>
              <div style={folderTabDotStyle} />
              <div style={folderTabDotStyle} />
              <div style={folderTabDotStyle} />
            </div>

            {/* Folder Body */}
            <div className="folder-body" style={folderBodyStyle(section.color)}>
              {/* Shine Effect */}
              <div style={shineStyle} />

              {/* Section Header */}
              <div style={sectionHeaderStyle}>
                <span style={sectionIconStyle}>{section.icon}</span>
                <h3 style={sectionTitleStyle}>{section.title}</h3>
              </div>

              {/* Settings */}
              <div style={sectionContentStyle}>
                {section.settings.map((setting, sIndex) => (
                  <div
                    key={sIndex}
                    style={{
                      ...settingRowStyle,
                      borderBottom:
                        sIndex < section.settings.length - 1
                          ? "1px solid rgba(255,255,255,0.15)"
                          : "none",
                    }}
                  >
                    <span style={labelStyle}>{setting.label}</span>
                    {renderSetting(setting, section.toggleColor)}
                  </div>
                ))}
              </div>

              {/* Folder Lines (decorative) */}
              <div style={folderLinesStyle}>
                <div style={{ ...lineStyle, width: "100%" }} />
                <div style={{ ...lineStyle, width: "70%" }} />
                <div style={{ ...lineStyle, width: "85%" }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={footerStyle}>
        <button onClick={resetAllSettings} style={resetButtonStyle}>
          ↺ {t("settings.resetAll") || "Reset All"}
        </button>
        <span style={versionStyle}>
          {t("settings.version") || "Version"} 1.0.0
        </span>
      </div>
    </Layout>
  );
};

// ============================================
// STYLES - Matching TemplatesPage design
// ============================================

const headerStyle = {
  marginBottom: "32px",
};

const titleStyle = {
  color: "#4A3728",
  fontSize: "28px",
  fontWeight: 700,
  letterSpacing: "3px",
  marginBottom: "4px",
};

const subtitleStyle = {
  color: "#8A7A6A",
  fontSize: "14px",
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
  letterSpacing: "1px",
  marginBottom: "12px",
};

const currentLanguageStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "8px 16px",
  background: "#FFFFFF",
  border: "1px solid #D4C4AE",
  borderRadius: "8px",
  maxWidth: "300px",
  boxShadow: "0 2px 8px rgba(180, 160, 140, 0.06)",
};

const currentLanguageLabel = {
  color: "#8A7A6A",
  fontSize: "12px",
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
};

const currentLanguageValue = {
  color: "#4A3728",
  fontSize: "13px",
  fontWeight: 600,
  fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
};

const settingsContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  maxWidth: "700px",
};

// Folder Design Styles (matching TemplatesPage)
const cardWrapperStyle = {
  position: "relative",
  marginTop: "12px",
  cursor: "default",
};

const folderTabStyle = (color) => ({
  position: "absolute",
  top: "-12px",
  left: "0",
  height: "12px",
  width: "60%",
  background: color,
  borderRadius: "3px 3px 0 0",
  display: "flex",
  alignItems: "center",
  padding: "0 8px",
  zIndex: 1,
});

const folderTabDotStyle = {
  width: "4px",
  height: "4px",
  background: "rgba(255,255,255,0.6)",
  borderRadius: "50%",
  marginRight: "3px",
};

const folderBodyStyle = (color) => ({
  background: `linear-gradient(135deg, ${color}dd, ${color}99)`,
  border: `1px solid ${color}`,
  borderRadius: "0 8px 8px 8px",
  padding: "24px 24px 40px",
  boxShadow: `0 4px 12px ${color}40`,
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
});

const shineStyle = {
  position: "absolute",
  top: "0",
  left: "0",
  right: "0",
  height: "40%",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%)",
  borderRadius: "0 8px 0 0",
  pointerEvents: "none",
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

const sectionHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "16px",
  paddingBottom: "12px",
  borderBottom: "1px solid rgba(255,255,255,0.2)",
};

const sectionIconStyle = {
  fontSize: "20px",
};

const sectionTitleStyle = {
  color: "#FFFFFF",
  fontSize: "16px",
  fontWeight: 700,
  letterSpacing: "1px",
  margin: 0,
  fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
  textShadow: "0 1px 2px rgba(0,0,0,0.2)",
};

const sectionContentStyle = {
  display: "flex",
  flexDirection: "column",
};

const settingRowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 0",
};

const labelStyle = {
  color: "#FFFFFF",
  fontSize: "13px",
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
  textShadow: "0 1px 2px rgba(0,0,0,0.15)",
};

// Toggle Styles with dynamic colors
const toggleStyle = {
  position: "relative",
  display: "inline-block",
  width: "48px",
  height: "26px",
  cursor: "pointer",
};

const toggleInputStyle = {
  opacity: 0,
  width: 0,
  height: 0,
};

const toggleSliderStyle = {
  position: "absolute",
  cursor: "pointer",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(255,255,255,0.3)",
  transition: "0.3s",
  borderRadius: "26px",
  border: "1px solid rgba(255,255,255,0.2)",
};

const toggleKnobStyle = {
  position: "absolute",
  content: '""',
  height: "20px",
  width: "20px",
  left: "2px",
  bottom: "3px",
  background: "#FFFFFF",
  transition: "0.3s",
  borderRadius: "50%",
  boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
};

// Updated Select Styles with better visibility and smooth edges
const selectStyle = {
  padding: "8px 16px",
  background: "rgba(255,255,255,0.95)",
  border: "1px solid rgba(255,255,255,0.3)",
  borderRadius: "8px",
  color: "#4A3728",
  fontSize: "13px",
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
  outline: "none",
  cursor: "pointer",
  minWidth: "140px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  transition: "all 0.2s ease",
  appearance: "none",
  WebkitAppearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234A3728' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  paddingRight: "36px",
};

// Option style for dropdown items
const optionStyle = {
  color: "#4A3728",
  background: "#FFFFFF",
  padding: "8px 12px",
};

// Language Select Styles with better visibility
const languageSelectWrapper = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const languageSelectStyle = {
  padding: "8px 16px",
  background: "rgba(255,255,255,0.95)",
  border: "1px solid rgba(255,255,255,0.3)",
  borderRadius: "8px",
  color: "#4A3728",
  fontSize: "13px",
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
  outline: "none",
  cursor: "pointer",
  minWidth: "220px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  transition: "all 0.2s ease",
  appearance: "none",
  WebkitAppearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234A3728' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  paddingRight: "36px",
};

const selectedLanguageDisplay = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "4px 12px",
  background: "rgba(255,255,255,0.15)",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.2)",
  backdropFilter: "blur(4px)",
};

const selectedLanguageFlag = {
  fontSize: "18px",
};

const selectedLanguageName = {
  color: "#FFFFFF",
  fontSize: "13px",
  fontWeight: 600,
  fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
  textShadow: "0 1px 2px rgba(0,0,0,0.2)",
};

const footerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "24px",
  paddingTop: "16px",
  borderTop: "1px solid #E8DCC8",
  maxWidth: "700px",
};

const resetButtonStyle = {
  padding: "8px 20px",
  background: "rgba(255,255,255,0.15)",
  border: "1px solid rgba(255,255,255,0.3)",
  borderRadius: "8px",
  color: "#FFFFFF",
  cursor: "pointer",
  fontSize: "11px",
  fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
  letterSpacing: "1px",
  transition: "all 0.15s ease",
  backdropFilter: "blur(4px)",
};

const versionStyle = {
  color: "#FFFFFF",
  fontSize: "11px",
  fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
  opacity: 0.7,
};

export default SettingsPage;
