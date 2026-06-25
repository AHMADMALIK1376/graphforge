import React, { useState, useCallback, useMemo, memo } from "react";
import { theme } from "../../../styles/theme";

// ============================================
// DEFAULT DATA - Connections between entities
// ============================================
const DEFAULT_NODES = [
  { id: "A", name: "Research", color: "#3b82f6" },
  { id: "B", name: "Design", color: "#ef4444" },
  { id: "C", name: "Development", color: "#10b981" },
  { id: "D", name: "Testing", color: "#f59e0b" },
  { id: "E", name: "Deployment", color: "#8b5cf6" },
  { id: "F", name: "Marketing", color: "#ec4899" },
  { id: "G", name: "Sales", color: "#06b6d4" },
  { id: "H", name: "Support", color: "#f97316" },
];

const DEFAULT_LINKS = [
  { source: "A", target: "B", value: 8 },
  { source: "A", target: "C", value: 5 },
  { source: "B", target: "C", value: 10 },
  { source: "B", target: "D", value: 7 },
  { source: "C", target: "D", value: 12 },
  { source: "C", target: "E", value: 6 },
  { source: "D", target: "E", value: 9 },
  { source: "E", target: "F", value: 4 },
  { source: "F", target: "G", value: 11 },
  { source: "G", target: "H", value: 8 },
  { source: "A", target: "G", value: 3 },
  { source: "B", target: "F", value: 5 },
  { source: "C", target: "H", value: 7 },
  { source: "D", target: "G", value: 6 },
  { source: "A", target: "E", value: 4 },
];

// ============================================
// SMALLER DATASET FOR SIMPLICITY
// ============================================
const SMALL_NODES = [
  { id: "A", name: "Alpha", color: "#3b82f6" },
  { id: "B", name: "Beta", color: "#ef4444" },
  { id: "C", name: "Gamma", color: "#10b981" },
  { id: "D", name: "Delta", color: "#f59e0b" },
  { id: "E", name: "Epsilon", color: "#8b5cf6" },
];

const SMALL_LINKS = [
  { source: "A", target: "B", value: 8 },
  { source: "A", target: "C", value: 5 },
  { source: "B", target: "D", value: 7 },
  { source: "C", target: "D", value: 9 },
  { source: "C", target: "E", value: 6 },
  { source: "D", target: "E", value: 4 },
  { source: "A", target: "E", value: 3 },
];

// ============================================
// COLOR PALETTE PRESETS
// ============================================
const COLOR_PRESETS = [
  {
    name: "Vibrant",
    colors: [
      "#3b82f6",
      "#ef4444",
      "#10b981",
      "#f59e0b",
      "#8b5cf6",
      "#ec4899",
      "#06b6d4",
      "#f97316",
    ],
  },
  {
    name: "Ocean",
    colors: [
      "#023047",
      "#219ebc",
      "#8ecae6",
      "#ffb703",
      "#fb8500",
      "#e63946",
      "#457b9d",
      "#a8dadc",
    ],
  },
  {
    name: "Sunset",
    colors: [
      "#ff6b6b",
      "#ee5a24",
      "#feca57",
      "#ff9ff3",
      "#54a0ff",
      "#5f27cd",
      "#01a3a4",
      "#f368e0",
    ],
  },
  {
    name: "Forest",
    colors: [
      "#1b4332",
      "#40916c",
      "#52b788",
      "#95d5b2",
      "#d8f3dc",
      "#2d6a4f",
      "#74c69d",
      "#b7e4c7",
    ],
  },
  {
    name: "Pastel",
    colors: [
      "#93c5fd",
      "#fca5a5",
      "#86efac",
      "#fcd34d",
      "#c4b5fd",
      "#f9a8d4",
      "#67e8f9",
      "#fdba74",
    ],
  },
  {
    name: "Neon",
    colors: [
      "#00ff88",
      "#ff006e",
      "#00d4ff",
      "#ffbe0b",
      "#8338ec",
      "#ff006e",
      "#3a86ff",
      "#fb5607",
    ],
  },
];

// ============================================
// ARC STYLE PRESETS
// ============================================
const ARC_STYLES = [
  { name: "Smooth Curve", value: "smooth" },
  { name: "Quadratic", value: "quadratic" },
  { name: "Cubic", value: "cubic" },
  { name: "Angular", value: "angular" },
];

// ============================================
// HELPER FUNCTIONS
// ============================================
const hexToRgba = (hex, alpha) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(0,0,0,${alpha})`;
  return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`;
};

const generateArcPath = (x1, y1, x2, y2, height, style) => {
  const midX = (x1 + x2) / 2;
  const midY = Math.min(y1, y2) - height;

  switch (style) {
    case "quadratic":
      return `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
    case "cubic":
      const cp1x = x1 + (x2 - x1) * 0.25;
      const cp2x = x1 + (x2 - x1) * 0.75;
      return `M ${x1} ${y1} C ${cp1x} ${midY} ${cp2x} ${midY} ${x2} ${y2}`;
    case "angular":
      const quarterX = (x2 - x1) / 4;
      return `M ${x1} ${y1} L ${x1 + quarterX} ${midY} L ${x2 - quarterX} ${midY} L ${x2} ${y2}`;
    default: // smooth
      return `M ${x1} ${y1} C ${midX} ${midY} ${midX} ${midY} ${x2} ${y2}`;
  }
};

// ============================================
// MAIN COMPONENT
// ============================================
const ArcDiagramComponent = ({
  initialNodes = SMALL_NODES,
  initialLinks = SMALL_LINKS,
}) => {
  // ===== STATE =====
  const [nodes, setNodes] = useState(initialNodes);
  const [links, setLinks] = useState(initialLinks);
  const [colorPreset, setColorPreset] = useState(COLOR_PRESETS[0]);
  const [arcStyle, setArcStyle] = useState("smooth");
  const [arcHeight, setArcHeight] = useState(80);
  const [arcThickness, setArcThickness] = useState(2);
  const [nodeSize, setNodeSize] = useState(18);
  const [spacing, setSpacing] = useState(100);
  const [showLabels, setShowLabels] = useState(true);
  const [labelSize, setLabelSize] = useState(11);
  const [showValues, setShowValues] = useState(true);
  const [valuePosition, setValuePosition] = useState("top");
  const [bidirectional, setBidirectional] = useState(false);
  const [arcOpacity, setArcOpacity] = useState(0.8);
  const [titleText, setTitleText] = useState("Arc Diagram");
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [datasetSize, setDatasetSize] = useState("small");
  const [darkBackground, setDarkBackground] = useState(true);

  // ===== DERIVED DATA =====
  const nodeMap = useMemo(() => {
    const map = {};
    nodes.forEach((n) => {
      map[n.id] = n;
    });
    return map;
  }, [nodes]);

  const nodePositions = useMemo(() => {
    const totalWidth = (nodes.length - 1) * spacing;
    const startX = 80;
    const baselineY = 350;

    return nodes.map((node, i) => ({
      ...node,
      x: startX + i * spacing,
      y: baselineY,
    }));
  }, [nodes, spacing]);

  const maxLinkValue = useMemo(() => {
    if (links.length === 0) return 1;
    return Math.max(...links.map((l) => l.value));
  }, [links]);

  const totalConnections = useMemo(() => {
    return links.length;
  }, [links]);

  // ===== HANDLERS =====
  const handleNodeChange = useCallback((id, field, value) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, [field]: value } : n)),
    );
  }, []);

  const handleLinkChange = useCallback((index, field, value) => {
    setLinks((prev) =>
      prev.map((l, i) =>
        i === index
          ? {
              ...l,
              [field]:
                field === "value" ? Math.max(1, Number(value) || 1) : value,
            }
          : l,
      ),
    );
  }, []);

  const handleAddNode = useCallback(() => {
    const newId = String.fromCharCode(65 + nodes.length);
    const colors = colorPreset.colors;
    setNodes((prev) => [
      ...prev,
      {
        id: newId,
        name: `Node ${newId}`,
        color: colors[nodes.length % colors.length],
      },
    ]);
  }, [nodes, colorPreset]);

  const handleRemoveNode = useCallback((id) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setLinks((prev) => prev.filter((l) => l.source !== id && l.target !== id));
    setSelectedNode(null);
  }, []);

  const handleAddLink = useCallback(() => {
    if (nodes.length < 2) return;
    const sourceIdx = Math.floor(Math.random() * nodes.length);
    let targetIdx = Math.floor(Math.random() * nodes.length);
    while (targetIdx === sourceIdx) {
      targetIdx = Math.floor(Math.random() * nodes.length);
    }
    setLinks((prev) => [
      ...prev,
      {
        source: nodes[sourceIdx].id,
        target: nodes[targetIdx].id,
        value: Math.floor(Math.random() * 8) + 2,
      },
    ]);
  }, [nodes]);

  const handleRemoveLink = useCallback((index) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
    setSelectedLink(null);
  }, []);

  const handleColorPresetChange = useCallback((presetName) => {
    const preset = COLOR_PRESETS.find((p) => p.name === presetName);
    if (preset) {
      setColorPreset(preset);
      setNodes((prev) =>
        prev.map((n, i) => ({
          ...n,
          color: preset.colors[i % preset.colors.length],
        })),
      );
    }
  }, []);

  const handleDatasetChange = useCallback((size) => {
    setDatasetSize(size);
    if (size === "small") {
      setNodes([...SMALL_NODES]);
      setLinks([...SMALL_LINKS]);
      setTitleText("Arc Diagram - Simple");
    } else {
      setNodes([...DEFAULT_NODES]);
      setLinks([...DEFAULT_LINKS]);
      setTitleText("Arc Diagram - Process Flow");
    }
    setSelectedNode(null);
    setSelectedLink(null);
  }, []);

  const handleNodeClick = useCallback(
    (nodeId) => {
      setSelectedNode(selectedNode === nodeId ? null : nodeId);
      setSelectedLink(null);
    },
    [selectedNode],
  );

  // ===== DIMENSIONS =====
  const svgWidth = useMemo(() => {
    return Math.max(800, (nodes.length - 1) * spacing + 160);
  }, [nodes, spacing]);

  const svgHeight = 500;

  // ============================================
  // STYLES
  // ============================================
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
    borderBottom: `2px solid ${nodes[0]?.color || "#3b82f6"}`,
    color: theme.colors.text.heading,
    fontSize: "20px",
    fontWeight: 700,
    fontFamily: theme.typography.fontFamily.primary,
    letterSpacing: "2px",
    outline: "none",
    padding: "4px 0",
    width: "300px",
  };

  const chartContainerStyle = {
    background: darkBackground ? "#0f172a" : "#f8fafc",
    borderRadius: "8px",
    border: `1px solid ${theme.colors.border.light}`,
    minHeight: "500px",
    overflow: "auto",
    position: "relative",
  };

  const controlsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "16px",
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
    padding: "8px 12px",
    background: theme.colors.inputBg,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: "3px",
    color: theme.colors.text.body,
    fontSize: "12px",
    fontFamily: theme.typography.fontFamily.primary,
    outline: "none",
    cursor: "pointer",
  };

  const checkboxStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontSize: "12px",
    color: theme.colors.text.body,
  };

  const buttonStyle = {
    padding: "8px 16px",
    background: "transparent",
    border: `1px solid ${nodes[0]?.color || "#3b82f6"}`,
    borderRadius: "3px",
    color: nodes[0]?.color || "#3b82f6",
    cursor: "pointer",
    fontSize: "11px",
    fontFamily: theme.typography.fontFamily.primary,
    fontWeight: 600,
    letterSpacing: "1px",
    textTransform: "uppercase",
    transition: "all 0.15s ease",
  };

  const deleteButtonStyle = {
    ...buttonStyle,
    border: `1px solid ${theme.colors.status.error}`,
    color: theme.colors.status.error,
    padding: "4px 8px",
    fontSize: "10px",
  };

  const dataTableContainerStyle = {
    background: theme.colors.cardBg,
    borderRadius: "4px",
    border: `1px solid ${theme.colors.border.default}`,
    overflow: "auto",
    maxHeight: "400px",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "12px",
  };

  const thStyle = {
    background: theme.colors.inputBg,
    color: theme.colors.text.muted,
    padding: "10px 12px",
    textAlign: "left",
    fontSize: "10px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "2px",
    borderBottom: `2px solid ${theme.colors.border.default}`,
    position: "sticky",
    top: 0,
  };

  const tdStyle = {
    padding: "8px 12px",
    borderBottom: `1px solid ${theme.colors.border.light}`,
  };

  const cellInputStyle = {
    padding: "6px 8px",
    background: theme.colors.inputBg,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: "3px",
    color: theme.colors.text.body,
    fontSize: "12px",
    fontFamily: theme.typography.fontFamily.primary,
    width: "100%",
    outline: "none",
    boxSizing: "border-box",
  };

  // ============================================
  // TOOLTIP COMPONENT
  // ============================================
  const Tooltip = ({ info, pos }) => {
    if (!info || !pos) return null;
    return (
      <div
        style={{
          position: "absolute",
          left: pos.x + 15,
          top: pos.y - 40,
          background: "rgba(15, 15, 35, 0.95)",
          border: `1px solid ${nodeMap[info.source]?.color || "#3b82f6"}`,
          borderRadius: "6px",
          padding: "10px 14px",
          pointerEvents: "none",
          zIndex: 100,
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "12px",
            fontWeight: 700,
            color: "#e2e8f0",
          }}
        >
          {nodeMap[info.source]?.name} → {nodeMap[info.target]?.name}
        </p>
        <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#94a3b8" }}>
          Strength: {info.value}
        </p>
      </div>
    );
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div style={containerStyle}>
      {/* HEADER */}
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>🔗</span>
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
              color: nodes[0]?.color || "#3b82f6",
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${nodes[0]?.color || "#3b82f6"}50`,
              borderRadius: "3px",
              fontWeight: 600,
              letterSpacing: "1px",
            }}
          >
            GEOSPATIAL & OTHER
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
            {nodes.length} NODES · {links.length} LINKS
          </span>
        </div>
      </div>

      {/* ARC DIAGRAM */}
      <div id="chart-visual-area" style={chartContainerStyle}>
        <Tooltip info={tooltip?.info} pos={tooltip?.position} />

        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ display: "block", minWidth: "100%" }}
        >
          {/* Background */}
          <rect
            width={svgWidth}
            height={svgHeight}
            fill={darkBackground ? "#0f172a" : "#f8fafc"}
          />

          {/* Title */}
          <text
            x={svgWidth / 2}
            y={35}
            textAnchor="middle"
            fontSize="14"
            fontWeight={700}
            fill={darkBackground ? "#cbd5e1" : "#1e293b"}
            fontFamily={theme.typography.fontFamily.primary}
          >
            {titleText}
          </text>

          {/* Baseline */}
          <line
            x1={50}
            y1={350}
            x2={svgWidth - 50}
            y2={350}
            stroke={darkBackground ? "#334155" : "#cbd5e1"}
            strokeWidth={1}
            strokeDasharray="5,5"
          />

          {/* Arcs (Links) */}
          {links.map((link, i) => {
            const sourceNode = nodePositions.find((n) => n.id === link.source);
            const targetNode = nodePositions.find((n) => n.id === link.target);
            if (!sourceNode || !targetNode) return null;

            const isHighlighted =
              selectedNode === null ||
              selectedNode === link.source ||
              selectedNode === link.target;
            const isSelectedLink = selectedLink === i;
            const sourceColor = nodeMap[link.source]?.color || "#64748b";
            const thickness =
              (link.value / maxLinkValue) * arcThickness * 3 + 1;
            const direction = sourceNode.x < targetNode.x ? 1 : -1;
            const height = arcHeight + (link.value / maxLinkValue) * 40;

            // Bidirectional arcs - alternate above/below
            const arcDirection = bidirectional && direction < 0 ? -1 : 1;
            const baselineY = sourceNode.y;
            const arcY = baselineY - height * arcDirection;

            const pathD = generateArcPath(
              sourceNode.x,
              baselineY,
              targetNode.x,
              baselineY,
              height,
              arcStyle,
            );

            return (
              <g key={`link-${i}`}>
                {/* Arc shadow/glow */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={sourceColor}
                  strokeWidth={thickness + 4}
                  opacity={isHighlighted ? 0.15 : 0.03}
                  strokeLinecap="round"
                  style={{ pointerEvents: "stroke", cursor: "pointer" }}
                  onClick={() => setSelectedLink(isSelectedLink ? null : i)}
                  onMouseEnter={(e) => {
                    const rect = e.target
                      .closest("svg")
                      .getBoundingClientRect();
                    setTooltip({
                      info: {
                        source: link.source,
                        target: link.target,
                        value: link.value,
                      },
                      position: {
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                      },
                    });
                  }}
                  onMouseMove={(e) => {
                    const rect = e.target
                      .closest("svg")
                      .getBoundingClientRect();
                    setTooltip((prev) => ({
                      ...prev,
                      position: {
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                      },
                    }));
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
                {/* Main arc */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={sourceColor}
                  strokeWidth={isSelectedLink ? thickness + 2 : thickness}
                  opacity={isHighlighted ? arcOpacity : 0.12}
                  strokeLinecap="round"
                  style={{
                    cursor: "pointer",
                    transition: "opacity 0.3s ease, stroke-width 0.2s ease",
                  }}
                  onClick={() => setSelectedLink(isSelectedLink ? null : i)}
                />
                {/* Value label */}
                {showValues && isHighlighted && (
                  <text
                    x={(sourceNode.x + targetNode.x) / 2}
                    y={arcY + (valuePosition === "top" ? -10 : 20)}
                    textAnchor="middle"
                    fontSize={labelSize - 2}
                    fill={darkBackground ? "#94a3b8" : "#64748b"}
                    fontFamily={theme.typography.fontFamily.primary}
                    fontWeight={600}
                    style={{ pointerEvents: "none" }}
                  >
                    {link.value}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodePositions.map((node) => {
            const isSelected = selectedNode === node.id;
            const connectedLinks = links.filter(
              (l) => l.source === node.id || l.target === node.id,
            );

            return (
              <g
                key={`node-${node.id}`}
                style={{ cursor: "pointer" }}
                onClick={() => handleNodeClick(node.id)}
              >
                {/* Node glow */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={nodeSize + 8}
                  fill={node.color}
                  opacity={isSelected ? 0.3 : 0.1}
                  style={{ transition: "opacity 0.3s ease" }}
                />
                {/* Node circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isSelected ? nodeSize + 4 : nodeSize}
                  fill={node.color}
                  stroke={darkBackground ? "#0f172a" : "#f8fafc"}
                  strokeWidth={3}
                  style={{ transition: "r 0.2s ease" }}
                />
                {/* Connection count */}
                {connectedLinks.length > 0 && (
                  <text
                    x={node.x}
                    y={node.y + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={nodeSize * 0.7}
                    fill="#ffffff"
                    fontWeight={700}
                    fontFamily={theme.typography.fontFamily.primary}
                    style={{ pointerEvents: "none" }}
                  >
                    {connectedLinks.length}
                  </text>
                )}
                {/* Label */}
                {showLabels && (
                  <text
                    x={node.x}
                    y={node.y + nodeSize + 20}
                    textAnchor="middle"
                    fontSize={labelSize}
                    fill={darkBackground ? "#e2e8f0" : "#1e293b"}
                    fontWeight={isSelected ? 700 : 500}
                    fontFamily={theme.typography.fontFamily.primary}
                    style={{ pointerEvents: "none" }}
                  >
                    {node.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* CONTROLS */}
      <div style={controlsGridStyle}>
        {/* Dataset */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📊 Dataset</label>
          <select
            value={datasetSize}
            onChange={(e) => handleDatasetChange(e.target.value)}
            style={selectStyle}
          >
            <option value="small">5 Nodes (Simple)</option>
            <option value="large">8 Nodes (Complex)</option>
          </select>
        </div>

        {/* Color Preset */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Color Palette</label>
          <select
            value={colorPreset.name}
            onChange={(e) => handleColorPresetChange(e.target.value)}
            style={selectStyle}
          >
            {COLOR_PRESETS.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Arc Style */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>〰️ Arc Style</label>
          <select
            value={arcStyle}
            onChange={(e) => setArcStyle(e.target.value)}
            style={selectStyle}
          >
            {ARC_STYLES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Arc Height */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Arc Height: {arcHeight}</label>
          <input
            type="range"
            min="30"
            max="200"
            value={arcHeight}
            onChange={(e) => setArcHeight(Number(e.target.value))}
            style={{ width: "100%", accentColor: nodes[0]?.color }}
          />
        </div>

        {/* Arc Thickness */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📐 Thickness: {arcThickness}</label>
          <input
            type="range"
            min="1"
            max="8"
            value={arcThickness}
            onChange={(e) => setArcThickness(Number(e.target.value))}
            style={{ width: "100%", accentColor: nodes[0]?.color }}
          />
        </div>

        {/* Node Size */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>⚫ Node Size: {nodeSize}</label>
          <input
            type="range"
            min="10"
            max="30"
            value={nodeSize}
            onChange={(e) => setNodeSize(Number(e.target.value))}
            style={{ width: "100%", accentColor: nodes[0]?.color }}
          />
        </div>

        {/* Spacing */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>↔️ Spacing: {spacing}</label>
          <input
            type="range"
            min="60"
            max="150"
            value={spacing}
            onChange={(e) => setSpacing(Number(e.target.value))}
            style={{ width: "100%", accentColor: nodes[0]?.color }}
          />
        </div>

        {/* Arc Opacity */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>👁️ Arc Opacity: {arcOpacity}</label>
          <input
            type="range"
            min="0.3"
            max="1"
            step="0.1"
            value={arcOpacity}
            onChange={(e) => setArcOpacity(Number(e.target.value))}
            style={{ width: "100%", accentColor: nodes[0]?.color }}
          />
        </div>

        {/* Label Size */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔤 Label Size: {labelSize}</label>
          <input
            type="range"
            min="8"
            max="16"
            value={labelSize}
            onChange={(e) => setLabelSize(Number(e.target.value))}
            style={{ width: "100%", accentColor: nodes[0]?.color }}
          />
        </div>

        {/* Toggles */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>👁️ Options</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={checkboxStyle}>
              <input
                type="checkbox"
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
                style={{ accentColor: nodes[0]?.color }}
              />
              Show Labels
            </label>
            <label style={checkboxStyle}>
              <input
                type="checkbox"
                checked={showValues}
                onChange={(e) => setShowValues(e.target.checked)}
                style={{ accentColor: nodes[0]?.color }}
              />
              Show Values on Arcs
            </label>
            <label style={checkboxStyle}>
              <input
                type="checkbox"
                checked={bidirectional}
                onChange={(e) => setBidirectional(e.target.checked)}
                style={{ accentColor: nodes[0]?.color }}
              />
              Bidirectional Arcs
            </label>
            <label style={checkboxStyle}>
              <input
                type="checkbox"
                checked={darkBackground}
                onChange={(e) => setDarkBackground(e.target.checked)}
                style={{ accentColor: nodes[0]?.color }}
              />
              Dark Background
            </label>
          </div>
        </div>
      </div>

      {/* DATA TABLES */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        {/* Nodes Table */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <label style={labelStyle}>🔵 Nodes</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={handleAddNode}
                style={buttonStyle}
                onMouseEnter={(e) =>
                  (e.target.style.background = `${nodes[0]?.color}20`)
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "transparent")
                }
              >
                + Add
              </button>
            </div>
          </div>
          <div style={dataTableContainerStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Color</th>
                  <th style={thStyle}>Links</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {nodes.map((node) => {
                  const linkCount = links.filter(
                    (l) => l.source === node.id || l.target === node.id,
                  ).length;
                  return (
                    <tr
                      key={node.id}
                      style={{
                        background:
                          selectedNode === node.id
                            ? `${node.color}15`
                            : "transparent",
                        cursor: "pointer",
                      }}
                      onClick={() => handleNodeClick(node.id)}
                    >
                      <td
                        style={{
                          ...tdStyle,
                          fontWeight: 700,
                          color: node.color,
                        }}
                      >
                        {node.id}
                      </td>
                      <td style={tdStyle}>
                        <input
                          type="text"
                          value={node.name}
                          onChange={(e) =>
                            handleNodeChange(node.id, "name", e.target.value)
                          }
                          onClick={(e) => e.stopPropagation()}
                          style={cellInputStyle}
                        />
                      </td>
                      <td style={tdStyle}>
                        <input
                          type="color"
                          value={node.color}
                          onChange={(e) =>
                            handleNodeChange(node.id, "color", e.target.value)
                          }
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            width: "28px",
                            height: "24px",
                            cursor: "pointer",
                            border: "none",
                            borderRadius: "3px",
                          }}
                        />
                      </td>
                      <td style={{ ...tdStyle, textAlign: "center" }}>
                        <span style={{ color: node.color, fontWeight: 700 }}>
                          {linkCount}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveNode(node.id);
                          }}
                          style={deleteButtonStyle}
                          disabled={nodes.length <= 2}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Links Table */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <label style={labelStyle}>〰️ Links</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={handleAddLink}
                style={buttonStyle}
                onMouseEnter={(e) =>
                  (e.target.style.background = `${nodes[0]?.color}20`)
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "transparent")
                }
              >
                + Add
              </button>
            </div>
          </div>
          <div style={dataTableContainerStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>Source</th>
                  <th style={thStyle}>Target</th>
                  <th style={thStyle}>Value</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link, i) => (
                  <tr
                    key={i}
                    style={{
                      background:
                        selectedLink === i
                          ? `${nodeMap[link.source]?.color}15`
                          : "transparent",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      setSelectedLink(selectedLink === i ? null : i)
                    }
                  >
                    <td
                      style={{
                        ...tdStyle,
                        color: theme.colors.text.muted,
                        fontSize: "10px",
                      }}
                    >
                      {i + 1}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        color: nodeMap[link.source]?.color,
                        fontWeight: 600,
                      }}
                    >
                      {nodeMap[link.source]?.name}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        color: nodeMap[link.target]?.color,
                        fontWeight: 600,
                      }}
                    >
                      {nodeMap[link.target]?.name}
                    </td>
                    <td style={tdStyle}>
                      <input
                        type="range"
                        min="1"
                        max="15"
                        value={link.value}
                        onChange={(e) =>
                          handleLinkChange(i, "value", e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          width: "60px",
                          accentColor: nodeMap[link.source]?.color,
                        }}
                      />
                      <span
                        style={{
                          marginLeft: "6px",
                          fontSize: "11px",
                          fontWeight: 700,
                        }}
                      >
                        {link.value}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveLink(i);
                        }}
                        style={deleteButtonStyle}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          padding: "12px 16px",
          background: theme.colors.cardBg,
          borderRadius: "4px",
          border: `1px solid ${theme.colors.border.default}`,
          fontSize: "11px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <span style={{ color: theme.colors.text.muted }}>
          Nodes:{" "}
          <strong style={{ color: theme.colors.text.heading }}>
            {nodes.length}
          </strong>
        </span>
        <span style={{ color: theme.colors.text.muted }}>
          Links:{" "}
          <strong style={{ color: theme.colors.text.heading }}>
            {links.length}
          </strong>
        </span>
        <span style={{ color: theme.colors.text.muted }}>
          Max Strength:{" "}
          <strong style={{ color: nodes[0]?.color }}>{maxLinkValue}</strong>
        </span>
        {selectedNode && (
          <span
            style={{
              color: nodeMap[selectedNode]?.color,
              background: `${nodeMap[selectedNode]?.color}15`,
              padding: "2px 8px",
              borderRadius: "3px",
              fontSize: "10px",
            }}
          >
            🔵 {nodeMap[selectedNode]?.name} selected
          </span>
        )}
        {selectedLink !== null && (
          <span
            style={{
              color: nodeMap[links[selectedLink]?.source]?.color,
              background: `${nodeMap[links[selectedLink]?.source]?.color}15`,
              padding: "2px 8px",
              borderRadius: "3px",
              fontSize: "10px",
            }}
          >
            〰️ Link #{selectedLink + 1} selected
          </span>
        )}
      </div>
    </div>
  );
};

export default ArcDiagramComponent;
