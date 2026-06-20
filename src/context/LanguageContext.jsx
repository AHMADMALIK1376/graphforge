// src/context/LanguageContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const { i18n, t } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || "en");

  useEffect(() => {
    setLanguage(i18n.language);
  }, [i18n.language]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    setLanguage(lang);
  };

  // Available languages
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
    { code: "ur", name: "Urdu", native: "اردو", flag: "🇵🇰" },
  ];

  const getLanguageDisplay = (code) => {
    const lang = languages.find((l) => l.code === code);
    return lang ? `${lang.flag} ${lang.name} (${lang.native})` : code;
  };

  const value = {
    language,
    changeLanguage,
    t,
    languages,
    getLanguageDisplay,
    isRTL: language === "ar" || language === "he" || language === "ur",
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
