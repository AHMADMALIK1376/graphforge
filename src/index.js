import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// ==============================================
// ERROR HANDLING FOR PRODUCTION
// ==============================================

// Global error handler for uncaught errors
const handleGlobalError = (error, errorInfo) => {
  console.error("Uncaught error:", error, errorInfo);

  // You can log to an error tracking service here
  // Example: Sentry.captureException(error);

  // Show user-friendly error in production
  if (process.env.NODE_ENV === "production") {
    const errorDiv = document.createElement("div");
    errorDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #FFFFFF;
      border: 1px solid #D4C4AE;
      border-radius: 8px;
      padding: 32px;
      max-width: 500px;
      text-align: center;
      color: #4A3728;
      font-family: 'Bungee', 'Bungee Inline', 'Bungee Shade', cursive;
      z-index: 9999;
      box-shadow: 0 8px 32px rgba(180, 160, 140, 0.15);
      animation: errorFadeIn 0.3s ease forwards;
    `;
    errorDiv.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 12px;">⚠️</div>
      <h2 style="color: #D15F55; margin: 0 0 12px; font-family: 'Bungee', cursive; letter-spacing: 1px;">Something went wrong</h2>
      <p style="color: #8A7A6A; font-size: 14px; margin: 0 0 20px; font-family: 'Inter', sans-serif; line-height: 1.6;">
        We're sorry, but something went wrong. Please try refreshing the page.
      </p>
      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
        <button 
          onclick="window.location.reload()" 
          style="
            background: #82C8E5; 
            border: none; 
            border-radius: 4px; 
            padding: 10px 24px; 
            color: #FFFFFF; 
            font-weight: bold; 
            cursor: pointer;
            font-family: 'Bungee', 'Bungee Inline', 'Bungee Shade', cursive;
            font-size: 13px;
            transition: all 0.15s ease;
            letter-spacing: 1px;
          "
          onmouseover="this.style.background='#A8DCF0'; this.style.transform='scale(1.02)';"
          onmouseout="this.style.background='#82C8E5'; this.style.transform='scale(1)';"
        >
          🔄 Refresh Page
        </button>
        <button 
          onclick="document.body.removeChild(this.parentElement.parentElement)" 
          style="
            background: transparent; 
            border: 1px solid #D4C4AE; 
            border-radius: 4px; 
            padding: 10px 24px; 
            color: #8A7A6A; 
            cursor: pointer;
            font-family: 'Inter', sans-serif;
            font-size: 13px;
            transition: all 0.15s ease;
          "
          onmouseover="this.style.borderColor='#B0A090'; this.style.color='#5C4A3A';"
          onmouseout="this.style.borderColor='#D4C4AE'; this.style.color='#8A7A6A';"
        >
          Dismiss
        </button>
      </div>
      <p style="color: #B0A090; font-size: 11px; margin-top: 16px; font-family: 'Inter', sans-serif;">
        Error: ${error?.message || "Unknown error"}
      </p>
    `;
    document.body.appendChild(errorDiv);

    // Add animation styles
    const style = document.createElement("style");
    style.textContent = `
      @keyframes errorFadeIn {
        from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      }
    `;
    document.head.appendChild(style);
  }
};

// Register global error handler
window.addEventListener("error", (event) => {
  handleGlobalError(event.error, "Uncaught Exception");
});

// Handle unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
  handleGlobalError(event.reason, "Unhandled Promise Rejection");
});

// ==============================================
// PERFORMANCE MONITORING
// ==============================================

if (process.env.NODE_ENV === "development") {
  // Log performance metrics in development
  console.log(
    "%c🚀 GraphForge - Development Mode",
    "font-size: 16px; font-weight: bold; color: #82C8E5;",
  );
  console.log(
    "%c📊 Chart Types: %c69",
    "color: #8A7A6A;",
    "color: #82C8E5; font-weight: bold;",
  );
  console.log(
    "%c📁 Categories: %c5",
    "color: #8A7A6A;",
    "color: #F88379; font-weight: bold;",
  );
  console.log(
    "%c🎨 Theme: %cWarm Professional",
    "color: #8A7A6A;",
    "color: #FFEB3B; font-weight: bold;",
  );
  console.log(
    "%c🔤 Font: %cBungee",
    "color: #8A7A6A;",
    "color: #4CAF50; font-weight: bold;",
  );
  console.log(
    "%c📦 Version: %c1.0.0",
    "color: #8A7A6A;",
    "color: #A8DCF0; font-weight: bold;",
  );
  console.log(
    "%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "color: #D4C4AE;",
  );
} else {
  // Production mode - log minimal info
  console.log("📊 GraphForge v1.0.0");
}

// ==============================================
// REACT 18 CONCURRENT MODE
// ==============================================

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// ==============================================
// SERVICE WORKER REGISTRATION (Optional)
// ==============================================

// Uncomment to register service worker for offline support
// if ("serviceWorker" in navigator) {
//   const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
//   window.addEventListener("load", () => {
//     navigator.serviceWorker
//       .register(swUrl)
//       .then((registration) => {
//         console.log("✅ Service Worker registered:", registration);
//       })
//       .catch((error) => {
//         console.error("❌ Service Worker registration failed:", error);
//       });
//   });
// }

// ==============================================
// HOT RELOADING SUPPORT (Development)
// ==============================================

if (process.env.NODE_ENV === "development" && module.hot) {
  module.hot.accept("./App", () => {
    const NextApp = require("./App").default;
    root.render(
      <React.StrictMode>
        <NextApp />
      </React.StrictMode>,
    );
  });
}

// ==============================================
// PERFORMANCE METRICS (Optional)
// ==============================================

// Report Web Vitals
// import reportWebVitals from "./reportWebVitals";
// reportWebVitals(console.log);

// ==============================================
// CONSOLE CLEANUP (Production)
// ==============================================

if (process.env.NODE_ENV === "production") {
  // Disable console.log in production (optional)
  // console.log = () => {};
  // console.warn = () => {};
}
