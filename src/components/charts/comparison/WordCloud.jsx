import React, { useState, useCallback, useMemo } from "react";
import { theme } from "../../../styles/theme";

const DEFAULT_DATA = [
  { text: "React", value: 85 },
  { text: "JavaScript", value: 70 },
  { text: "Component", value: 60 },
  { text: "State", value: 55 },
  { text: "Props", value: 50 },
  { text: "Hooks", value: 65 },
  { text: "Redux", value: 40 },
  { text: "API", value: 45 },
  { text: "Router", value: 35 },
  { text: "Context", value: 42 },
  { text: "Effect", value: 38 },
  { text: "Render", value: 48 },
  { text: "Mount", value: 30 },
  { text: "Update", value: 33 },
  { text: "Event", value: 36 },
  { text: "Form", value: 28 },
  { text: "Input", value: 25 },
  { text: "Output", value: 22 },
  { text: "Promise", value: 44 },
  { text: "Async", value: 40 },
  { text: "Await", value: 32 },
  { text: "Fetch", value: 38 },
  { text: "Axios", value: 26 },
  { text: "GraphQL", value: 30 },
  { text: "Node", value: 52 },
  { text: "Express", value: 35 },
  { text: "MongoDB", value: 28 },
  { text: "SQL", value: 32 },
  { text: "CSS", value: 45 },
  { text: "HTML", value: 42 },
];

const COLOR_PRESETS = [
  {
    name: "Ocean",
    colors: ["#58a6ff", "#1f6feb", "#79c0ff", "#0d419d", "#cae8ff"],
  },
  {
    name: "Forest",
    colors: ["#3fb950", "#238636", "#56d364", "#0e4429", "#7ee787"],
  },
  {
    name: "Sunset",
    colors: ["#f85149", "#d29922", "#ff7b72", "#e3b341", "#ffc1ba"],
  },
  {
    name: "Purple",
    colors: ["#a371f7", "#7c3aed", "#bc8cff", "#4c1d95", "#d8b4fe"],
  },
  {
    name: "Rainbow",
    colors: [
      "#58a6ff",
      "#3fb950",
      "#f85149",
      "#d29922",
      "#a371f7",
      "#79c0ff",
      "#56d364",
    ],
  },
  {
    name: "Mono Dark",
    colors: ["#f0f6fc", "#c9d1d9", "#8b949e", "#484f58", "#30363d", "#21262d"],
  },
];

const FONT_FAMILIES = [
  { name: "Monospace", value: "'JetBrains Mono', 'Consolas', monospace" },
  { name: "Sans Serif", value: "'Inter', 'Segoe UI', sans-serif" },
  { name: "Serif", value: "'Georgia', 'Times New Roman', serif" },
  { name: "Display", value: "'Impact', 'Arial Black', sans-serif" },
];

const ORIENTATIONS = [
  { name: "Mixed", value: "mixed" },
  { name: "Horizontal", value: "horizontal" },
  { name: "Vertical", value: "vertical" },
];
const LAYOUTS = [
  { name: "Spiral", value: "spiral" },
  { name: "Random", value: "random" },
  { name: "Grid", value: "grid" },
];

const WordCloudComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#58a6ff",
}) => {
  const [words, setWords] = useState(initialData);
  const [titleText, setTitleText] = useState("Word Cloud");
  const [colorPalette, setColorPalette] = useState(COLOR_PRESETS[0].colors);
  const [paletteName, setPaletteName] = useState("Ocean");
  const [fontFamily, setFontFamily] = useState(FONT_FAMILIES[0].value);
  const [minFontSize, setMinFontSize] = useState(14);
  const [maxFontSize, setMaxFontSize] = useState(60);
  const [orientation, setOrientation] = useState("mixed");
  const [layout, setLayout] = useState("spiral");
  const [wordGap, setWordGap] = useState(8);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [showValues, setShowValues] = useState(false);
  const [hoverScale, setHoverScale] = useState(true);
  const [excludedWords, setExcludedWords] = useState("");
  const [animation, setAnimation] = useState(true);

  const maxValue = useMemo(
    () => Math.max(...words.map((w) => w.value), 1),
    [words],
  );
  const minValue = useMemo(
    () => Math.min(...words.map((w) => w.value), 1),
    [words],
  );
  const filteredWords = useMemo(() => {
    const excluded = excludedWords
      .split(",")
      .map((w) => w.trim().toLowerCase())
      .filter(Boolean);
    return words.filter((w) => !excluded.includes(w.text.toLowerCase()));
  }, [words, excludedWords]);
  const sortedWords = useMemo(
    () => [...filteredWords].sort((a, b) => b.value - a.value),
    [filteredWords],
  );

  // ✅ FIX: Wrap in useCallback to keep stable references
  const getFontSize = useCallback(
    (value) => {
      if (maxValue === minValue) return (minFontSize + maxFontSize) / 2;
      return (
        minFontSize +
        ((value - minValue) / (maxValue - minValue)) *
          (maxFontSize - minFontSize)
      );
    },
    [minFontSize, maxFontSize, minValue, maxValue],
  );

  const getWordColor = useCallback(
    (index) => colorPalette[index % colorPalette.length],
    [colorPalette],
  );

  const getRotation = useCallback(
    (index) => {
      if (orientation === "horizontal") return 0;
      if (orientation === "vertical") return 90;
      return index % 3 === 0 ? 0 : index % 3 === 1 ? 90 : 0;
    },
    [orientation],
  );

  const wordPositions = useMemo(() => {
    const positions = [];
    let angle = 0;
    let radius = 5;
    sortedWords.forEach((word, index) => {
      const x = Math.cos(angle) * radius + 50;
      const y = Math.sin(angle) * radius + 50;
      const fontSize = getFontSize(word.value);
      const rotation = getRotation(index);
      positions.push({
        ...word,
        x: layout === "random" ? Math.random() * 80 + 10 : x,
        y: layout === "grid" ? (index % 5) * 18 + 10 : y,
        fontSize,
        rotation,
        color: getWordColor(index),
      });
      angle +=
        layout === "spiral"
          ? 0.6
          : layout === "random"
            ? Math.random() * Math.PI * 2
            : 0;
      radius += layout === "spiral" ? fontSize * 0.08 : 5;
    });
    return positions;
  }, [sortedWords, layout, getFontSize, getRotation, getWordColor]);

  const handleWordChange = useCallback((index, field, newValue) => {
    setWords((prev) => {
      const updated = [...prev];
      if (field === "value")
        updated[index] = { ...updated[index], value: Number(newValue) || 0 };
      else updated[index] = { ...updated[index], [field]: newValue };
      return updated;
    });
  }, []);
  const addWord = useCallback(() => {
    setWords((prev) => [...prev, { text: "New", value: 30 }]);
  }, []);
  const removeWord = useCallback((index) => {
    setWords((prev) => prev.filter((_, i) => i !== index));
  }, []);
  const handlePresetChange = (presetName) => {
    const preset = COLOR_PRESETS.find((p) => p.name === presetName);
    if (preset) {
      setPaletteName(presetName);
      setColorPalette(preset.colors);
    }
  };
  const handleImportText = () => {
    const text = prompt("Paste text to generate word cloud:");
    if (text) {
      const wordCount = {};
      text
        .toLowerCase()
        .split(/\s+/)
        .forEach((word) => {
          word = word.replace(/[^a-zA-Z0-9#@]/g, "");
          if (word.length > 1) wordCount[word] = (wordCount[word] || 0) + 1;
        });
      const newWords = Object.entries(wordCount)
        .map(([text, value]) => ({ text, value: value * 10 }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 50);
      if (newWords.length > 0) setWords(newWords);
    }
  };

  // ===== STYLES =====
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    fontFamily: theme.typography.fontFamily.primary,
    background: theme.colors.mainBg,
    color: theme.colors.text.body,
    padding: "20px",
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border.default}`,
  };
  const headerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "12px",
  };
  const titleInputStyle = {
    background: "transparent",
    border: "none",
    borderBottom: `2px solid ${chartColor}`,
    color: theme.colors.text.heading,
    fontSize: "20px",
    fontWeight: 700,
    fontFamily: theme.typography.fontFamily.primary,
    letterSpacing: "2px",
    outline: "none",
    padding: "4px 0",
    width: "230px",
  };
  const chartContainerStyle = {
    background: bgColor,
    borderRadius: "6px",
    padding: "32px 24px",
    border: `1px solid ${theme.colors.border.light}`,
    minHeight: "480px",
    position: "relative",
    overflow: "hidden",
  };
  const controlsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "14px",
    background: theme.colors.cardBg,
    padding: "16px",
    borderRadius: "4px",
    border: `1px solid ${theme.colors.border.default}`,
  };
  const controlGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  };
  const labelStyle = {
    color: theme.colors.text.muted,
    fontSize: "10px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "2px",
  };
  const selectStyle = {
    padding: "7px 10px",
    background: theme.colors.inputBg,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: "3px",
    color: theme.colors.text.body,
    fontSize: "11px",
    fontFamily: theme.typography.fontFamily.primary,
    outline: "none",
    cursor: "pointer",
  };
  const checkboxStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
  };
  const dataTableContainerStyle = {
    background: theme.colors.cardBg,
    borderRadius: "4px",
    border: `1px solid ${theme.colors.border.default}`,
    overflow: "auto",
    maxHeight: "350px",
  };
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "10px",
  };
  const thStyle = {
    background: "#0d1117",
    color: "#8b949e",
    padding: "6px 8px",
    textAlign: "left",
    fontSize: "9px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1px",
    borderBottom: "2px solid #30363d",
    position: "sticky",
    top: 0,
    whiteSpace: "nowrap",
  };
  const tdStyle = {
    padding: "4px 6px",
    borderBottom: "1px solid #21262d",
    fontSize: "10px",
  };
  const cellInputStyle = (width = "65px") => ({
    padding: "4px 5px",
    background: theme.colors.inputBg,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: "3px",
    color: theme.colors.text.body,
    fontSize: "10px",
    fontFamily: theme.typography.fontFamily.primary,
    width: width,
    outline: "none",
    boxSizing: "border-box",
  });
  const buttonStyle = (color = chartColor) => ({
    padding: "6px 12px",
    background: "transparent",
    border: `1px solid ${color}`,
    borderRadius: "3px",
    color: color,
    cursor: "pointer",
    fontSize: "10px",
    fontFamily: theme.typography.fontFamily.primary,
    fontWeight: 600,
    letterSpacing: "1px",
    textTransform: "uppercase",
  });
  const deleteBtnStyle = {
    padding: "2px 5px",
    background: "transparent",
    border: "1px solid #f85149",
    borderRadius: "2px",
    color: "#f85149",
    cursor: "pointer",
    fontSize: "8px",
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>☁️</span>
          <input
            type="text"
            value={titleText}
            onChange={(e) => setTitleText(e.target.value)}
            style={titleInputStyle}
          />
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <span
            style={{
              color: chartColor,
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${chartColor}50`,
              borderRadius: "3px",
              fontWeight: 600,
              letterSpacing: "1px",
            }}
          >
            COMPARISON
          </span>
          <span
            style={{
              color: theme.colors.text.muted,
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: "3px",
              letterSpacing: "1px",
            }}
          >
            {words.length} WORDS
          </span>
        </div>
      </div>
      <div id="chart-visual-area" style={chartContainerStyle}>
        {wordPositions.length === 0 ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#8b949e",
              fontSize: "14px",
              letterSpacing: "1px",
            }}
          >
            NO WORDS TO DISPLAY
          </div>
        ) : (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              minHeight: "440px",
            }}
          >
            {wordPositions.map((word, index) => (
              <span
                key={index}
                style={{
                  position: "absolute",
                  left: `${word.x}%`,
                  top: `${word.y}%`,
                  transform: `translate(-50%, -50%) rotate(${word.rotation}deg)`,
                  fontSize: `${word.fontSize}px`,
                  fontWeight:
                    word.value > maxValue * 0.7
                      ? 700
                      : word.value > maxValue * 0.4
                        ? 500
                        : 300,
                  color: word.color,
                  fontFamily: fontFamily,
                  cursor: "pointer",
                  transition: animation ? "all 0.3s ease" : "none",
                  opacity: 0.85,
                  lineHeight: 1.1,
                  textShadow: "0 1px 2px rgba(0,0,0,0.08)",
                  whiteSpace: "nowrap",
                  userSelect: "none",
                  zIndex: Math.floor(word.fontSize),
                }}
                onMouseEnter={(e) => {
                  if (hoverScale) {
                    e.target.style.transform = `translate(-50%, -50%) rotate(${word.rotation}deg) scale(1.2)`;
                    e.target.style.opacity = "1";
                    e.target.style.zIndex = "999";
                  }
                }}
                onMouseLeave={(e) => {
                  if (hoverScale) {
                    e.target.style.transform = `translate(-50%, -50%) rotate(${word.rotation}deg) scale(1)`;
                    e.target.style.opacity = "0.85";
                    e.target.style.zIndex = Math.floor(word.fontSize);
                  }
                }}
                title={showValues ? `${word.text}: ${word.value}` : word.text}
              >
                {word.text}
                {showValues && (
                  <sup
                    style={{
                      fontSize: "0.5em",
                      marginLeft: "2px",
                      opacity: 0.7,
                    }}
                  >
                    {word.value}
                  </sup>
                )}
              </span>
            ))}
          </div>
        )}
      </div>
      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Color Palette</label>
          <select
            value={paletteName}
            onChange={(e) => handlePresetChange(e.target.value)}
            style={selectStyle}
          >
            {COLOR_PRESETS.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔤 Font</label>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            style={selectStyle}
          >
            {FONT_FAMILIES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📐 Orientation</label>
          <select
            value={orientation}
            onChange={(e) => setOrientation(e.target.value)}
            style={selectStyle}
          >
            {ORIENTATIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📐 Layout</label>
          <select
            value={layout}
            onChange={(e) => setLayout(e.target.value)}
            style={selectStyle}
          >
            {LAYOUTS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔤 Min Font: {minFontSize}px</label>
          <input
            type="range"
            min="8"
            max="40"
            value={minFontSize}
            onChange={(e) => setMinFontSize(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔤 Max Font: {maxFontSize}px</label>
          <input
            type="range"
            min="30"
            max="100"
            value={maxFontSize}
            onChange={(e) => setMaxFontSize(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>↔️ Word Gap: {wordGap}px</label>
          <input
            type="range"
            min="2"
            max="20"
            value={wordGap}
            onChange={(e) => setWordGap(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🖼️ Background</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            style={{
              width: "32px",
              height: "28px",
              cursor: "pointer",
              border: "1px solid #30363d",
              borderRadius: "3px",
              padding: "2px",
            }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔢 Show Values</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showValues}
              onChange={(e) => setShowValues(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              As superscript
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>✨ Hover Scale</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={hoverScale}
              onChange={(e) => setHoverScale(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Enlarge on hover
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>✨ Animation</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={animation}
              onChange={(e) => setAnimation(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Smooth transitions
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🚫 Exclude Words</label>
          <input
            type="text"
            value={excludedWords}
            onChange={(e) => setExcludedWords(e.target.value)}
            placeholder="the, and, or..."
            style={{ ...cellInputStyle("150px") }}
          />
        </div>
      </div>
      <div
        style={{
          background: theme.colors.cardBg,
          padding: "12px 16px",
          borderRadius: "4px",
          border: `1px solid ${theme.colors.border.default}`,
        }}
      >
        <label style={labelStyle}>🎨 Custom Palette Colors</label>
        <div
          style={{
            display: "flex",
            gap: "6px",
            marginTop: "8px",
            flexWrap: "wrap",
          }}
        >
          {colorPalette.map((color, i) => (
            <input
              key={i}
              type="color"
              value={color}
              onChange={(e) => {
                const updated = [...colorPalette];
                updated[i] = e.target.value;
                setColorPalette(updated);
                setPaletteName("Custom");
              }}
              style={{
                width: "28px",
                height: "28px",
                cursor: "pointer",
                border: "none",
                borderRadius: "3px",
                padding: "2px",
              }}
            />
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button onClick={handleImportText} style={buttonStyle("#3fb950")}>
          📥 Import Text
        </button>
        <button onClick={addWord} style={buttonStyle()}>
          + Add Word
        </button>
        <button
          onClick={() => setWords(DEFAULT_DATA)}
          style={{ ...buttonStyle("#8b949e") }}
        >
          ↺ Reset
        </button>
      </div>
      <div>
        <div id="chart-data-table" style={dataTableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>#</th>
                <th style={thStyle}>Word</th>
                <th style={thStyle}>Frequency</th>
                <th style={thStyle}>Font Size</th>
                <th style={thStyle}>Preview</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedWords.map((word, index) => {
                const fontSize = getFontSize(word.value);
                const wordColor = getWordColor(index);
                return (
                  <tr key={index}>
                    <td style={{ ...tdStyle, color: "#484f58" }}>
                      {index + 1}
                    </td>
                    <td style={tdStyle}>
                      <input
                        type="text"
                        value={word.text}
                        onChange={(e) =>
                          handleWordChange(
                            words.indexOf(word),
                            "text",
                            e.target.value,
                          )
                        }
                        style={cellInputStyle("100px")}
                      />
                    </td>
                    <td style={tdStyle}>
                      <input
                        type="number"
                        value={word.value}
                        onChange={(e) =>
                          handleWordChange(
                            words.indexOf(word),
                            "value",
                            e.target.value,
                          )
                        }
                        style={cellInputStyle("55px")}
                        min="1"
                      />
                    </td>
                    <td style={{ ...tdStyle, color: "#8b949e" }}>
                      {fontSize.toFixed(0)}px
                    </td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          fontSize: `${Math.min(fontSize, 20)}px`,
                          color: wordColor,
                          fontWeight: word.value > maxValue * 0.7 ? 700 : 400,
                          fontFamily,
                        }}
                      >
                        {word.text}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => removeWord(words.indexOf(word))}
                        style={deleteBtnStyle}
                        disabled={words.length <= 3}
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          padding: "10px 14px",
          background: theme.colors.cardBg,
          borderRadius: "4px",
          border: `1px solid ${theme.colors.border.default}`,
          fontSize: "10px",
        }}
      >
        <span style={{ color: "#8b949e" }}>
          Words:{" "}
          <strong style={{ color: "#f0f6fc" }}>{filteredWords.length}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Max Freq: <strong style={{ color: "#58a6ff" }}>{maxValue}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Min Freq: <strong style={{ color: "#8b949e" }}>{minValue}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Font Range:{" "}
          <strong style={{ color: "#f0f6fc" }}>
            {minFontSize}-{maxFontSize}px
          </strong>
        </span>
      </div>
    </div>
  );
};

export default WordCloudComponent;

