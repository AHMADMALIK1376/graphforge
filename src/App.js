// src/App.js
import React, { useState, Suspense, useEffect } from "react";
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
const HomePage = React.lazy(() => import("./pages/HomePage"));
const ChartListPage = React.lazy(() => import("./pages/ChartListPage"));
const ChartPage = React.lazy(() => import("./pages/ChartPage"));
const AboutPage = React.lazy(() => import("./pages/AboutPage"));
const TemplatesPage = React.lazy(() => import("./pages/TemplatesPage"));
const SettingsPage = React.lazy(() => import("./pages/SettingsPage"));

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
    <Suspense fallback={<PageLoader />}>
      <ChartPage
        chartId={selectedChartId}
        onBack={handleBackToHome}
        onSelectChart={handleSelectChart}
      />
    </Suspense>
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

  const handleNavigateToCharts = () => {
    navigate("/charts");
  };

  return (
    <Suspense fallback={<PageLoader />}>
      <HomePage
        onSelectChart={handleSelectChart}
        onNavigateToCharts={handleNavigateToCharts}
      />
    </Suspense>
  );
}

// ==============================================
// CHART LIST WRAPPER - Handles navigation to individual charts
// ==============================================
function ChartListWrapper() {
  const navigate = useNavigate();

  const handleSelectChart = (chartId) => {
    navigate(`/chart/${chartId}`);
  };

  return (
    <Suspense fallback={<PageLoader />}>
      <ChartListPage onSelectChart={handleSelectChart} />
    </Suspense>
  );
}

// ==============================================
// MAIN APP COMPONENT
// ==============================================
function App() {
  // Application view pipeline state: "splash" | "loading" | "ready"
  const [appState, setAppState] = useState("splash");

  // PRELOAD BUNDLES IN THE BACKGROUND
  useEffect(() => {
    // Preload all pages for smoother navigation
    const preloadPages = async () => {
      try {
        await Promise.allSettled([
          import("./pages/HomePage"),
          import("./pages/ChartListPage"),
          import("./pages/ChartPage"),
          import("./pages/AboutPage"),
          import("./pages/TemplatesPage"),
          import("./pages/SettingsPage"),
        ]);
      } catch (error) {
        console.warn("Page preloading completed with some warnings");
      }
    };
    preloadPages();
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
                      <Route path="/charts" element={<ChartListWrapper />} />
                      <Route
                        path="/about"
                        element={
                          <Suspense fallback={<PageLoader />}>
                            <AboutPage />
                          </Suspense>
                        }
                      />
                      <Route
                        path="/chart/:chartId?"
                        element={<ChartWrapper />}
                      />
                      <Route
                        path="/templates"
                        element={
                          <Suspense fallback={<PageLoader />}>
                            <TemplatesPage />
                          </Suspense>
                        }
                      />
                      <Route
                        path="/settings"
                        element={
                          <Suspense fallback={<PageLoader />}>
                            <SettingsPage />
                          </Suspense>
                        }
                      />
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
