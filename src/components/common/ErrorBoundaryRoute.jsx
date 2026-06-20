import React from "react";
import { Link } from "react-router-dom";

const ErrorBoundaryRoute = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#0d1117",
        color: "#f0f6fc",
        fontFamily: "'JetBrains Mono', monospace",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "64px", margin: 0 }}>404</h1>
      <h2 style={{ color: "#8b949e", margin: "8px 0" }}>Page Not Found</h2>
      <p style={{ color: "#8b949e", maxWidth: "400px" }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/home">
        <button
          style={{
            marginTop: "20px",
            padding: "10px 24px",
            background: "#58a6ff",
            border: "none",
            borderRadius: "4px",
            color: "#0d1117",
            fontWeight: "bold",
            cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          ← Back to Home
        </button>
      </Link>
    </div>
  );
};

export default ErrorBoundaryRoute;
