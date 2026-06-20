import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            background: "#0d1117",
            color: "#f0f6fc",
            minHeight: "100vh",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          <h1 style={{ fontSize: "48px" }}>⚠️</h1>
          <h2>Something went wrong</h2>
          <p style={{ color: "#8b949e" }}>
            Please refresh the page or try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
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
            🔄 Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
