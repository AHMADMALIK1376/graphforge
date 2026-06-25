// src/examples/ButtonAnimationExamples.jsx
/**
 * BUTTON ANIMATION IMPLEMENTATION EXAMPLES
 *
 * This file shows practical examples of how to add the folder card animation
 * to different types of buttons throughout the GraphForge application.
 *
 * Copy these patterns to implement animations in your components!
 */

import React, { useState } from "react";
import AnimatedButton from "../components/common/AnimatedButton";
import ButtonAnimationWrapper from "../components/common/ButtonAnimationWrapper";

// ============================================
// EXAMPLE 1: Chart Control Buttons
// ============================================
export function ChartControlButtonsExample() {
  const [dataCount, setDataCount] = useState(5);

  return (
    <div className="button-group">
      <h3>Chart Controls</h3>

      {/* Add Button - Green */}
      <ButtonAnimationWrapper showHint hintText="Add more data">
        <button
          onClick={() => setDataCount(dataCount + 1)}
          style={{
            background: "#3fb950",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          ➕ Add Data
        </button>
      </ButtonAnimationWrapper>

      {/* Reset Button - Gray */}
      <ButtonAnimationWrapper showHint hintText="Reset to defaults">
        <button
          onClick={() => setDataCount(0)}
          style={{
            background: "#8b949e",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          🔄 Reset
        </button>
      </ButtonAnimationWrapper>

      {/* Delete Button - Red */}
      <ButtonAnimationWrapper showHint hintText="Remove this chart">
        <button
          onClick={() => console.log("Deleting...")}
          style={{
            background: "#f85149",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          🗑️ Delete
        </button>
      </ButtonAnimationWrapper>
    </div>
  );
}

// ============================================
// EXAMPLE 2: Export Menu Buttons
// ============================================
export function ExportMenuButtonsExample() {
  const handleExport = (format) => {
    console.log(`Exporting as ${format}...`);
  };

  return (
    <div className="export-menu">
      <h3>Export Options</h3>

      <AnimatedButton
        onClick={() => handleExport("PNG")}
        showCounter
        counterLabel="EXPORT"
        counterNumber="01"
        counterDotColor="#A8DCF0"
        counterBgColor="#A8DCF0"
        style={{
          background: "#A8DCF0",
          color: "#333",
          padding: "10px 20px",
          border: "1px solid #7DB8D4",
          borderRadius: "4px",
          marginRight: "10px",
        }}
      >
        📥 Export as PNG
      </AnimatedButton>

      <AnimatedButton
        onClick={() => handleExport("SVG")}
        showCounter
        counterLabel="EXPORT"
        counterNumber="02"
        counterDotColor="#A8DCF0"
        counterBgColor="#A8DCF0"
        style={{
          background: "#A8DCF0",
          color: "#333",
          padding: "10px 20px",
          border: "1px solid #7DB8D4",
          borderRadius: "4px",
        }}
      >
        📥 Export as SVG
      </AnimatedButton>
    </div>
  );
}

// ============================================
// EXAMPLE 3: Settings Page Buttons
// ============================================
export function SettingsButtonsExample() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className="settings-section">
      <h3>Settings</h3>

      {/* Toggle Button */}
      <label style={{ marginBottom: "20px" }}>
        <input
          type="checkbox"
          checked={isDarkMode}
          onChange={(e) => setIsDarkMode(e.target.checked)}
        />
        Dark Mode
      </label>

      {/* Reset Button */}
      <ButtonAnimationWrapper showHint hintText="Restore defaults">
        <button
          onClick={() => console.log("Resetting all settings...")}
          style={{
            background: "#8b949e",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            display: "block",
            marginTop: "20px",
          }}
        >
          ↻ Reset All Settings
        </button>
      </ButtonAnimationWrapper>

      {/* Save Button */}
      <AnimatedButton
        onClick={() => console.log("Saving settings...")}
        showHint
        hintText="Save and apply"
        style={{
          background: "#0077C8",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          marginTop: "10px",
        }}
      >
        💾 Save Changes
      </AnimatedButton>
    </div>
  );
}

// ============================================
// EXAMPLE 4: Category Filter Buttons
// ============================================
export function CategoryFilterButtonsExample() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const categories = ["Bar Charts", "Line Charts", "Pie Charts", "Scatter"];

  return (
    <div className="category-filters">
      <h3>Chart Categories</h3>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {categories.map((category) => (
          <ButtonAnimationWrapper
            key={category}
            showHint
            hintText="Filter by category"
          >
            <button
              onClick={() => setSelectedCategory(category)}
              style={{
                background:
                  selectedCategory === category ? "#0077C8" : "#F5EDE0",
                color: selectedCategory === category ? "white" : "#333",
                padding: "8px 16px",
                border: `2px solid ${selectedCategory === category ? "#0077C8" : "#D4C4AE"}`,
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: selectedCategory === category ? "600" : "400",
              }}
            >
              {category}
            </button>
          </ButtonAnimationWrapper>
        ))}
      </div>
    </div>
  );
}

// ============================================
// EXAMPLE 5: Action Buttons with Counters
// ============================================
export function ActionButtonsWithCountersExample() {
  const [actionCount, setActionCount] = useState(0);

  return (
    <div className="action-buttons">
      <h3>Action Tracking</h3>

      <AnimatedButton
        onClick={() => setActionCount(actionCount + 1)}
        showCounter
        counterLabel="ACTIONS"
        counterNumber={String(actionCount).padStart(2, "0")}
        counterDotColor="#34d399"
        counterBgColor="#a18cd1"
        style={{
          background: "#0077C8",
          color: "white",
          padding: "12px 24px",
          border: "none",
          borderRadius: "4px",
          fontSize: "14px",
        }}
      >
        🎯 Track Action
      </AnimatedButton>

      <p style={{ marginTop: "10px" }}>Total Actions: {actionCount}</p>
    </div>
  );
}

// ============================================
// EXAMPLE 6: Floating Hint Animation
// ============================================
export function FloatingHintButtonsExample() {
  return (
    <div className="hint-buttons">
      <h3>Buttons with Floating Hints</h3>

      <div style={{ display: "flex", gap: "20px", marginTop: "40px" }}>
        <AnimatedButton
          onClick={() => console.log("Clicked!")}
          showHint
          hintText="Click to explore"
          style={{
            background: "#F88379",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Explore
        </AnimatedButton>

        <AnimatedButton
          onClick={() => console.log("Clicked!")}
          showHint
          hintText="Refresh data"
          style={{
            background: "#4facfe",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Refresh
        </AnimatedButton>

        <AnimatedButton
          onClick={() => console.log("Clicked!")}
          showHint
          hintText="Generate new"
          style={{
            background: "#00f2fe",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Generate
        </AnimatedButton>
      </div>
    </div>
  );
}

// ============================================
// EXAMPLE 7: Mixed Color Buttons
// ============================================
export function MixedColorButtonsExample() {
  const buttonStyles = [
    { bg: "#ff5f6d", label: "Red" },
    { bg: "#ffc371", label: "Orange" },
    { bg: "#4facfe", label: "Blue" },
    { bg: "#00f2fe", label: "Cyan" },
    { bg: "#a18cd1", label: "Purple" },
  ];

  return (
    <div className="mixed-buttons">
      <h3>All Button Colors</h3>
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        {buttonStyles.map((btn) => (
          <ButtonAnimationWrapper
            key={btn.bg}
            showHint
            hintText={`${btn.label} action`}
          >
            <button
              style={{
                background: btn.bg,
                color: "white",
                padding: "8px 16px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {btn.label}
            </button>
          </ButtonAnimationWrapper>
        ))}
      </div>
    </div>
  );
}

// ============================================
// USAGE IN YOUR COMPONENTS
// ============================================

/**
 * QUICK START:
 *
 * 1. For existing buttons, wrap them:
 *
 *    Before:
 *    <button onClick={handleClick}>Click me</button>
 *
 *    After:
 *    import ButtonAnimationWrapper from '../components/common/ButtonAnimationWrapper';
 *
 *    <ButtonAnimationWrapper>
 *      <button onClick={handleClick}>Click me</button>
 *    </ButtonAnimationWrapper>
 *
 * 2. For new buttons, use AnimatedButton:
 *
 *    import AnimatedButton from '../components/common/AnimatedButton';
 *
 *    <AnimatedButton
 *      onClick={handleClick}
 *      showHint={true}
 *      hintText="Do something"
 *    >
 *      Click me
 *    </AnimatedButton>
 *
 * 3. The animation is automatic - colors stay the same!
 */

export default {
  ChartControlButtonsExample,
  ExportMenuButtonsExample,
  SettingsButtonsExample,
  CategoryFilterButtonsExample,
  ActionButtonsWithCountersExample,
  FloatingHintButtonsExample,
  MixedColorButtonsExample,
};
