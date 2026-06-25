// src/components/common/ErrorBoundary.jsx
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1 style={{ fontSize: "64px", margin: "0 0 16px" }}>⚠️</h1>
          <h2 style={{ fontSize: "24px", margin: "0 0 8px", color: "#f85149" }}>
            Something went wrong
          </h2>
          <p
            style={{
              color: "#8b949e",
              fontSize: "14px",
              margin: "0 0 24px",
              maxWidth: "500px",
            }}
          >
            Please refresh the page or try again later.
          </p>

          {/* Error Details - Collapsible */}
          {this.state.error && (
            <details
              style={{
                marginBottom: "24px",
                textAlign: "left",
                maxWidth: "700px",
                width: "100%",
                background: "#161b22",
                borderRadius: "8px",
                padding: "16px",
                border: "1px solid #30363d",
              }}
            >
              <summary
                style={{
                  cursor: "pointer",
                  color: "#8b949e",
                  fontSize: "13px",
                  fontWeight: 600,
                  marginBottom: "12px",
                }}
              >
                🔍 Error Details (Click to expand)
              </summary>
              <pre
                style={{
                  background: "#0d1117",
                  padding: "16px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "#f85149",
                  overflow: "auto",
                  maxHeight: "300px",
                  margin: 0,
                  fontFamily: "'JetBrains Mono', 'Consolas', monospace",
                  lineHeight: "1.6",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                <strong>Error:</strong> {this.state.error.toString()}
                {"\n\n"}
                <strong>Stack:</strong>
                {"\n"}
                {this.state.error.stack || "No stack trace available"}
                {this.state.errorInfo && (
                  <>
                    {"\n\n"}
                    <strong>Component Stack:</strong>
                    {"\n"}
                    {this.state.errorInfo.componentStack ||
                      "No component stack available"}
                  </>
                )}
              </pre>
            </details>
          )}

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={this.handleRefresh}
              onMouseEnter={(e) => {
                e.target.style.background = "#1f6feb";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#58a6ff";
              }}
              style={{
                padding: "12px 24px",
                background: "#58a6ff",
                border: "none",
                borderRadius: "6px",
                color: "#0d1117",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "14px",
                transition: "background 0.2s ease",
              }}
            >
              🔄 Refresh Page
            </button>
            <button
              onClick={this.handleReset}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(88, 166, 255, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
              }}
              style={{
                padding: "12px 24px",
                background: "transparent",
                border: "1px solid #30363d",
                borderRadius: "6px",
                color: "#c9d1d9",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "14px",
                transition: "background 0.2s ease",
              }}
            >
              🔄 Try Again
            </button>
          </div>

          {/* Help Text */}
          <p
            style={{
              color: "#484f58",
              fontSize: "11px",
              marginTop: "24px",
              maxWidth: "500px",
            }}
          >
            If the problem persists, check the browser console for more details
            or contact the development team.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
