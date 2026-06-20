// src/App.js
import React, { useState, lazy, Suspense, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import i18n from "./i18n";

// ==============================================
// ERROR BOUNDARY
// ==============================================
import ErrorBoundary from "./components/common/ErrorBoundary";
import ErrorBoundaryRoute from "./components/common/ErrorBoundaryRoute";

// ==============================================
// LOADING COMPONENT
// ==============================================
import {
  LoadingSpinner,
  SplashLoader,
} from "./components/common/LoadingSpinner";

// ==============================================
// ALWAYS LOADED IMMEDIATELY
// ==============================================
import Splash from "./components/layout/Splash";
import { ThemeProvider } from "./styles/ThemeProvider";
import { LanguageProvider } from "./context/LanguageContext";

// ==============================================
// PAGES (Lazy loaded for better performance)
// ==============================================
const HomePage = lazy(() => import("./pages/HomePage"));
const ChartPage = lazy(() => import("./pages/ChartPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const TemplatesPage = lazy(() => import("./pages/TemplatesPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

// ==============================================
// SCROLL TO TOP COMPONENT
// ==============================================
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// ==============================================
// PAGE LOADER using LoadingSpinner component
// ==============================================
function PageLoader() {
  return <LoadingSpinner />;
}

// ==============================================
// CHART WRAPPER - Handles chart selection and navigation
// ==============================================
function ChartWrapper() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathSegments = location.pathname.split("/");
  const chartId = pathSegments[pathSegments.length - 1];
  const selectedChartId = chartId && chartId !== "chart" ? chartId : null;

  const handleBackToHome = () => {
    navigate("/home");
  };

  const handleSelectChart = (chartId) => {
    navigate(`/chart/${chartId}`);
  };

  return (
    <ChartPage
      chartId={selectedChartId}
      onBack={handleBackToHome}
      onSelectChart={handleSelectChart}
    />
  );
}

// ==============================================
// HOME WRAPPER - Handles navigation to charts
// ==============================================
function HomeWrapper() {
  const navigate = useNavigate();

  const handleSelectChart = (chartId) => {
    navigate(`/chart/${chartId}`);
  };

  return <HomePage onSelectChart={handleSelectChart} />;
}

// ==============================================
// MAIN APP COMPONENT
// ==============================================
function App() {
  // Application view pipeline state: "splash" | "loading" | "ready"
  const [appState, setAppState] = useState("splash");

  // PRELOAD BUNDLES IN THE BACKGROUND
  useEffect(() => {
    import("./pages/HomePage");
    import("./pages/ChartPage");
    import("./pages/AboutPage");
    import("./pages/TemplatesPage");
    import("./pages/SettingsPage");
  }, []);

  // Handle splash screen completion
  const handleSplashComplete = () => {
    setAppState("loading");

    // Enforce an intentional delay of exactly 2.5 seconds (2500ms)
    setTimeout(() => {
      setAppState("ready");
    }, 2500);
  };

  // Smooth fade-in wrapper style for the ready application
  const appFadeInStyle = {
    animation: "appSmoothFadeIn 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards",
    opacity: 0,
    width: "100%",
    minHeight: "100vh",
  };

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <LanguageProvider>
          {/* STATE 1: Slide Presentation Deck */}
          {appState === "splash" && (
            <Splash onComplete={handleSplashComplete} />
          )}

          {/* STATE 2: Upgraded Full-Screen Spinner */}
          {appState === "loading" && <SplashLoader />}

          {/* STATE 3: App mounted and ready with smooth transition */}
          {appState === "ready" && (
            <div style={appFadeInStyle}>
              <ErrorBoundary>
                <BrowserRouter>
                  <ScrollToTop />
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route
                        path="/"
                        element={<Navigate to="/home" replace />}
                      />
                      <Route path="/home" element={<HomeWrapper />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route
                        path="/chart/:chartId?"
                        element={<ChartWrapper />}
                      />
                      <Route path="/templates" element={<TemplatesPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="*" element={<ErrorBoundaryRoute />} />
                    </Routes>
                  </Suspense>
                </BrowserRouter>
              </ErrorBoundary>

              {/* Global transition animation rules */}
              <style>{`
                @keyframes appSmoothFadeIn {
                  from {
                    opacity: 0;
                    transform: scale(0.99);
                  }
                  to {
                    opacity: 1;
                    transform: scale(1);
                  }
                }
              `}</style>
            </div>
          )}
        </LanguageProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default App;
