import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { theme } from "../../../styles/theme";

// ============================================
// FORCE-DIRECTED LAYOUT (internal function)
// ============================================
const computeForceLayout = (
  nodes,
  links,
  width,
  height,
  repulsion,
  attraction,
) => {
  const positions = nodes.map((node) => ({
    id: node.id,
    x: width / 2 + (Math.random() - 0.5) * width * 0.5,
    y: height / 2 + (Math.random() - 0.5) * height * 0.5,
    vx: 0,
    vy: 0,
  }));

  const posMap = {};
  positions.forEach((p) => {
    posMap[p.id] = p;
  });

  const linkRefs = links
    .map((l) => ({
      source: posMap[l.source],
      target: posMap[l.target],
      value: l.value || 1,
    }))
    .filter((l) => l.source && l.target);

  const iterations = 80;
  for (let iter = 0; iter < iterations; iter++) {
    // Repulsion
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const a = positions[i];
        const b = positions[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = repulsion / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        a.vx -= fx;
        a.vy -= fy;
        b.vx += fx;
        b.vy += fy;
      }
    }

    // Attraction
    linkRefs.forEach((link) => {
      const a = link.source;
      const b = link.target;
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      let dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = dist * attraction * link.value;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      a.vx += fx;
      a.vy += fy;
      b.vx -= fx;
      b.vy -= fy;
    });

    // Center gravity + velocity update
    positions.forEach((p) => {
      p.vx += (width / 2 - p.x) * 0.03;
      p.vy += (height / 2 - p.y) * 0.03;
      p.vx *= 0.85;
      p.vy *= 0.85;
      p.x += p.vx;
      p.y += p.vy;
      p.x = Math.max(40, Math.min(width - 40, p.x));
      p.y = Math.max(40, Math.min(height - 40, p.y));
    });
  }

  return { positions, lines: linkRefs };
};

// ============================================
// CIRCULAR LAYOUT
// ============================================
const computeCircularLayout = (nodes, width, height) => {
  const radius = Math.min(width, height) * 0.38;
  return nodes.map((node, i) => {
    const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
    return {
      id: node.id,
      x: width / 2 + radius * Math.cos(angle),
      y: height / 2 + radius * Math.sin(angle),
    };
  });
};

// ============================================
// GRID LAYOUT
// ============================================
const computeGridLayout = (nodes, width, height) => {
  const cols = Math.ceil(Math.sqrt(nodes.length));
  const cellW = (width - 80) / cols;
  const cellH = (height - 80) / Math.ceil(nodes.length / cols);
  return nodes.map((node, i) => ({
    id: node.id,
    x: 40 + (i % cols) * cellW + cellW / 2,
    y: 40 + Math.floor(i / cols) * cellH + cellH / 2,
  }));
};

// ============================================
// DEFAULT DATA
// ============================================
const DEFAULT_NODES = [
  { id: "alice", name: "Alice", color: "#3b82f6", group: 1, size: 14 },
  { id: "bob", name: "Bob", color: "#3b82f6", group: 1, size: 12 },
  { id: "carol", name: "Carol", color: "#3b82f6", group: 1, size: 11 },
  { id: "dave", name: "Dave", color: "#ef4444", group: 2, size: 13 },
  { id: "eve", name: "Eve", color: "#ef4444", group: 2, size: 10 },
  { id: "frank", name: "Frank", color: "#ef4444", group: 2, size: 12 },
  { id: "grace", name: "Grace", color: "#10b981", group: 3, size: 15 },
  { id: "heidi", name: "Heidi", color: "#10b981", group: 3, size: 11 },
  { id: "ivan", name: "Ivan", color: "#10b981", group: 3, size: 10 },
  { id: "judy", name: "Judy", color: "#f59e0b", group: 4, size: 12 },
  { id: "karl", name: "Karl", color: "#f59e0b", group: 4, size: 9 },
  { id: "leo", name: "Leo", color: "#8b5cf6", group: 5, size: 14 },
  { id: "mallory", name: "Mallory", color: "#8b5cf6", group: 5, size: 10 },
  { id: "nancy", name: "Nancy", color: "#ec4899", group: 6, size: 11 },
  { id: "oscar", name: "Oscar", color: "#ec4899", group: 6, size: 9 },
];

const DEFAULT_LINKS = [
  { source: "alice", target: "bob", value: 5 },
  { source: "alice", target: "carol", value: 4 },
  { source: "bob", target: "carol", value: 3 },
  { source: "alice", target: "dave", value: 2 },
  { source: "dave", target: "eve", value: 5 },
  { source: "dave", target: "frank", value: 4 },
  { source: "eve", target: "frank", value: 3 },
  { source: "carol", target: "grace", value: 3 },
  { source: "grace", target: "heidi", value: 5 },
  { source: "grace", target: "ivan", value: 4 },
  { source: "heidi", target: "ivan", value: 3 },
  { source: "grace", target: "judy", value: 2 },
  { source: "judy", target: "karl", value: 4 },
  { source: "grace", target: "leo", value: 3 },
  { source: "leo", target: "mallory", value: 5 },
  { source: "leo", target: "nancy", value: 2 },
  { source: "mallory", target: "nancy", value: 4 },
  { source: "nancy", target: "oscar", value: 3 },
  { source: "alice", target: "leo", value: 1 },
  { source: "bob", target: "frank", value: 2 },
  { source: "dave", target: "judy", value: 2 },
  { source: "grace", target: "alice", value: 2 },
];

// ============================================
// SMALL DATASET
// ============================================
const SMALL_NODES = [
  { id: "a", name: "Research", color: "#3b82f6", group: 1, size: 14 },
  { id: "b", name: "Design", color: "#ef4444", group: 1, size: 12 },
  { id: "c", name: "Engineering", color: "#10b981", group: 2, size: 15 },
  { id: "d", name: "QA", color: "#f59e0b", group: 2, size: 11 },
  { id: "e", name: "DevOps", color: "#8b5cf6", group: 2, size: 13 },
  { id: "f", name: "Marketing", color: "#ec4899", group: 3, size: 10 },
  { id: "g", name: "Sales", color: "#06b6d4", group: 3, size: 12 },
  { id: "h", name: "Support", color: "#f97316", group: 3, size: 10 },
];

const SMALL_LINKS = [
  { source: "a", target: "b", value: 5 },
  { source: "a", target: "c", value: 3 },
  { source: "b", target: "c", value: 4 },
  { source: "c", target: "d", value: 5 },
  { source: "c", target: "e", value: 4 },
  { source: "d", target: "e", value: 3 },
  { source: "e", target: "f", value: 2 },
  { source: "f", target: "g", value: 5 },
  { source: "g", target: "h", value: 4 },
  { source: "f", target: "h", value: 2 },
  { source: "a", target: "f", value: 2 },
  { source: "c", target: "g", value: 2 },
];

// ============================================
// COLOR PALETTE PRESETS
// ============================================
const COLOR_PRESETS = [
  {
    name: "Vibrant",
    groupColors: [
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
    groupColors: [
      "#023047",
      "#219ebc",
      "#8ecae6",
      "#ffb703",
      "#fb8500",
      "#e63946",
    ],
  },
  {
    name: "Sunset",
    groupColors: [
      "#ff6b6b",
      "#ee5a24",
      "#feca57",
      "#ff9ff3",
      "#54a0ff",
      "#5f27cd",
    ],
  },
  {
    name: "Forest",
    groupColors: [
      "#1b4332",
      "#40916c",
      "#52b788",
      "#95d5b2",
      "#d8f3dc",
      "#2d6a4f",
    ],
  },
  {
    name: "Neon",
    groupColors: [
      "#00ff88",
      "#ff006e",
      "#00d4ff",
      "#ffbe0b",
      "#8338ec",
      "#ff006e",
    ],
  },
];

// ============================================
// LAYOUT PRESETS
// ============================================
const LAYOUT_PRESETS = [
  { name: "Force Directed", value: "force" },
  { name: "Circular", value: "circular" },
  { name: "Grid", value: "grid" },
];

// ============================================
// MAIN COMPONENT
// ============================================
const NetworkDiagramComponent = ({
  initialNodes = SMALL_NODES,
  initialLinks = SMALL_LINKS,
}) => {
  // ===== REFS =====
  const containerRef = useRef(null);

  // ===== STATE =====
  const [nodes, setNodes] = useState(initialNodes);
  const [links, setLinks] = useState(initialLinks);
  const [colorPreset, setColorPreset] = useState(COLOR_PRESETS[0]);
  const [layoutType, setLayoutType] = useState("force");
  const [repulsion, setRepulsion] = useState(3000);
  const [attraction, setAttraction] = useState(0.01);
  const [linkThickness, setLinkThickness] = useState(2);
  const [nodeBaseSize, setNodeBaseSize] = useState(16);
  const [showLabels, setShowLabels] = useState(true);
  const [labelSize] = useState(10);
  const [titleText, setTitleText] = useState("Network Diagram");
  const [selectedNode, setSelectedNode] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [datasetSize, setDatasetSize] = useState("small");
  const [dimensions, setDimensions] = useState({ width: 860, height: 480 });

  // ===== DERIVED DATA =====
  const nodeMap = useMemo(() => {
    const map = {};
    nodes.forEach((n) => {
      map[n.id] = n;
    });
    return map;
  }, [nodes]);

  const nodeConnections = useMemo(() => {
    const conn = {};
    nodes.forEach((n) => {
      conn[n.id] = links.filter(
        (l) => l.source === n.id || l.target === n.id,
      ).length;
    });
    return conn;
  }, [nodes, links]);

  const maxLinkValue = useMemo(() => {
    if (links.length === 0) return 1;
    return Math.max(...links.map((l) => l.value));
  }, [links]);

  // ===== LAYOUT CALCULATION =====
  const layoutPositions = useMemo(() => {
    if (layoutType === "circular") {
      return computeCircularLayout(nodes, dimensions.width, dimensions.height);
    }
    if (layoutType === "grid") {
      return computeGridLayout(nodes, dimensions.width, dimensions.height);
    }
    // Force-directed
    return computeForceLayout(
      nodes,
      links,
      dimensions.width,
      dimensions.height,
      repulsion,
      attraction,
    ).positions;
  }, [nodes, links, layoutType, dimensions, repulsion, attraction]);

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
    const newId = `node${nodes.length + 1}`;
    const colors = colorPreset.groupColors;
    const group = (nodes.length % colors.length) + 1;
    setNodes((prev) => [
      ...prev,
      {
        id: newId,
        name: `Node ${nodes.length + 1}`,
        color: colors[group - 1],
        group,
        size: 10,
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
    const si = Math.floor(Math.random() * nodes.length);
    let ti = Math.floor(Math.random() * nodes.length);
    while (ti === si) ti = Math.floor(Math.random() * nodes.length);
    setLinks((prev) => [
      ...prev,
      {
        source: nodes[si].id,
        target: nodes[ti].id,
        value: Math.floor(Math.random() * 4) + 1,
      },
    ]);
  }, [nodes]);

  const handleRemoveLink = useCallback((index) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleColorPresetChange = useCallback((presetName) => {
    const preset = COLOR_PRESETS.find((p) => p.name === presetName);
    if (preset) {
      setColorPreset(preset);
      setNodes((prev) =>
        prev.map((n) => ({
          ...n,
          color: preset.groupColors[(n.group - 1) % preset.groupColors.length],
        })),
      );
    }
  }, []);

  const handleDatasetChange = useCallback((size) => {
    setDatasetSize(size);
    if (size === "small") {
      setNodes([...SMALL_NODES]);
      setLinks([...SMALL_LINKS]);
      setTitleText("Network Diagram - Teams");
    } else {
      setNodes([...DEFAULT_NODES]);
      setLinks([...DEFAULT_LINKS]);
      setTitleText("Network Diagram - Social Graph");
    }
    setSelectedNode(null);
  }, []);

  const handleNodeClick = useCallback((nodeId) => {
    setSelectedNode((prev) => (prev === nodeId ? null : nodeId));
  }, []);

  // Update dimensions on mount
  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth || 860,
        height: 480,
      });
    }
  }, []);

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
    background: "#0f172a",
    borderRadius: "8px",
    border: `1px solid ${theme.colors.border.light}`,
    minHeight: "500px",
    overflow: "hidden",
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

  // ===== TOOLTIP =====
  const Tooltip = ({ info, pos }) => {
    if (!info || !pos) return null;
    return (
      <div
        style={{
          position: "absolute",
          left: pos.x + 15,
          top: pos.y - 40,
          background: "rgba(15, 15, 35, 0.95)",
          border: `1px solid ${info.color || "#3b82f6"}`,
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
          {info.name}
        </p>
        <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#94a3b8" }}>
          Connections: {info.connections} | Group: {info.group}
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
          <span style={{ fontSize: "28px" }}>🌐</span>
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
            {nodes.length} N · {links.length} E
          </span>
        </div>
      </div>

      {/* NETWORK DIAGRAM */}
      <div
        id="chart-visual-area"
        ref={containerRef}
        style={chartContainerStyle}
      >
        <Tooltip info={tooltip?.info} pos={tooltip?.position} />

        <svg width="100%" height="500" viewBox={`0 0 ${dimensions.width} 500`}>
          <rect width={dimensions.width} height="500" fill="#0f172a" />

          {/* Links (Edges) */}
          {links.map((link, i) => {
            const sourcePos = layoutPositions.find((p) => p.id === link.source);
            const targetPos = layoutPositions.find((p) => p.id === link.target);
            if (!sourcePos || !targetPos) return null;

            const sourceColor = nodeMap[link.source]?.color || "#64748b";
            const isHighlighted =
              selectedNode === null ||
              selectedNode === link.source ||
              selectedNode === link.target;
            const thickness =
              (link.value / maxLinkValue) * linkThickness * 2 + 0.5;

            return (
              <g key={`link-${i}`}>
                <line
                  x1={sourcePos.x}
                  y1={sourcePos.y}
                  x2={targetPos.x}
                  y2={targetPos.y}
                  stroke={sourceColor}
                  strokeWidth={thickness + 3}
                  opacity={isHighlighted ? 0.15 : 0.02}
                  strokeLinecap="round"
                />
                <line
                  x1={sourcePos.x}
                  y1={sourcePos.y}
                  x2={targetPos.x}
                  y2={targetPos.y}
                  stroke={sourceColor}
                  strokeWidth={thickness}
                  opacity={isHighlighted ? 0.6 : 0.06}
                  strokeLinecap="round"
                  style={{ cursor: "pointer", transition: "opacity 0.3s ease" }}
                  onMouseEnter={(e) => {
                    const rect = e.target
                      .closest("svg")
                      .getBoundingClientRect();
                    setTooltip({
                      info: {
                        name: `${nodeMap[link.source]?.name} → ${nodeMap[link.target]?.name}`,
                        connections: link.value,
                        color: sourceColor,
                        group: "Link",
                      },
                      position: {
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                      },
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              </g>
            );
          })}

          {/* Nodes */}
          {layoutPositions.map((pos) => {
            const node = nodeMap[pos.id];
            if (!node) return null;
            const isSelected = selectedNode === pos.id;
            const connCount = nodeConnections[pos.id] || 0;
            const nodeSize = node.size || nodeBaseSize;

            return (
              <g
                key={`node-${pos.id}`}
                style={{ cursor: "pointer" }}
                onClick={() => handleNodeClick(pos.id)}
                onMouseEnter={(e) => {
                  const rect = e.target.closest("svg").getBoundingClientRect();
                  setTooltip({
                    info: {
                      name: node.name,
                      connections: connCount,
                      color: node.color,
                      group: `Group ${node.group}`,
                    },
                    position: {
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                    },
                  });
                }}
                onMouseMove={(e) => {
                  const rect = e.target.closest("svg").getBoundingClientRect();
                  setTooltip((prev) => ({
                    ...prev,
                    position: {
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                    },
                  }));
                }}
                onMouseLeave={() => setTooltip(null)}
              >
                {/* Node glow */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={nodeSize + 8}
                  fill={node.color}
                  opacity={isSelected ? 0.35 : 0.1}
                  style={{ transition: "opacity 0.3s ease" }}
                />
                {/* Node circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? nodeSize + 3 : nodeSize}
                  fill={node.color}
                  stroke="#0f172a"
                  strokeWidth={3}
                  opacity={selectedNode === null || isSelected ? 1 : 0.25}
                  style={{ transition: "all 0.2s ease" }}
                />
                {/* Connection count */}
                <text
                  x={pos.x}
                  y={pos.y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={Math.max(7, nodeSize * 0.65)}
                  fill="#ffffff"
                  fontWeight={700}
                  fontFamily={theme.typography.fontFamily.primary}
                  style={{ pointerEvents: "none" }}
                >
                  {connCount}
                </text>
                {/* Label */}
                {showLabels && (
                  <text
                    x={pos.x}
                    y={pos.y + nodeSize + 14}
                    textAnchor="middle"
                    fontSize={labelSize}
                    fill="#cbd5e1"
                    fontWeight={isSelected ? 700 : 400}
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
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📊 Dataset</label>
          <select
            value={datasetSize}
            onChange={(e) => handleDatasetChange(e.target.value)}
            style={selectStyle}
          >
            <option value="small">8 Nodes (Teams)</option>
            <option value="large">15 Nodes (Social)</option>
          </select>
        </div>

        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Palette</label>
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

        <div style={controlGroupStyle}>
          <label style={labelStyle}>📐 Layout</label>
          <select
            value={layoutType}
            onChange={(e) => setLayoutType(e.target.value)}
            style={selectStyle}
          >
            {LAYOUT_PRESETS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        <div style={controlGroupStyle}>
          <label style={labelStyle}>⚡ Repulsion: {repulsion}</label>
          <input
            type="range"
            min="500"
            max="8000"
            step="100"
            value={repulsion}
            onChange={(e) => setRepulsion(Number(e.target.value))}
            style={{ width: "100%", accentColor: nodes[0]?.color }}
          />
        </div>

        <div style={controlGroupStyle}>
          <label style={labelStyle}>
            🔗 Attraction: {attraction.toFixed(4)}
          </label>
          <input
            type="range"
            min="0.001"
            max="0.05"
            step="0.001"
            value={attraction}
            onChange={(e) => setAttraction(Number(e.target.value))}
            style={{ width: "100%", accentColor: nodes[0]?.color }}
          />
        </div>

        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Link Thickness: {linkThickness}</label>
          <input
            type="range"
            min="1"
            max="6"
            value={linkThickness}
            onChange={(e) => setLinkThickness(Number(e.target.value))}
            style={{ width: "100%", accentColor: nodes[0]?.color }}
          />
        </div>

        <div style={controlGroupStyle}>
          <label style={labelStyle}>⚫ Node Size: {nodeBaseSize}</label>
          <input
            type="range"
            min="8"
            max="28"
            value={nodeBaseSize}
            onChange={(e) => setNodeBaseSize(Number(e.target.value))}
            style={{ width: "100%", accentColor: nodes[0]?.color }}
          />
        </div>

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
          </div>
        </div>
      </div>

      {/* TABLES */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <label style={labelStyle}>⚫ Nodes</label>
            <button
              onClick={handleAddNode}
              style={buttonStyle}
              onMouseEnter={(e) =>
                (e.target.style.background = `${nodes[0]?.color}20`)
              }
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
            >
              + Add
            </button>
          </div>
          <div style={dataTableContainerStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Group</th>
                  <th style={thStyle}>Conn</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {nodes.map((node) => (
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
                    <td
                      style={{
                        ...tdStyle,
                        color: node.color,
                        fontWeight: 700,
                        textAlign: "center",
                      }}
                    >
                      {node.group}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "center",
                        fontWeight: 700,
                        color: "#cbd5e1",
                      }}
                    >
                      {nodeConnections[node.id] || 0}
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
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <label style={labelStyle}>➡️ Edges</label>
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
            <div style={dataTableContainerStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Connection</th>
                    <th style={thStyle}>Value</th>
                    <th style={thStyle}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link, i) => (
                    <tr key={i}>
                      <td style={tdStyle}>
                        <span
                          style={{
                            color: nodeMap[link.source]?.color,
                            fontWeight: 600,
                          }}
                        >
                          {nodeMap[link.source]?.name}
                        </span>
                        {" → "}
                        <span
                          style={{
                            color: nodeMap[link.target]?.color,
                            fontWeight: 600,
                          }}
                        >
                          {nodeMap[link.target]?.name}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <input
                          type="number"
                          value={link.value}
                          onChange={(e) =>
                            handleLinkChange(i, "value", e.target.value)
                          }
                          style={{ ...cellInputStyle, width: "70px" }}
                          min="1"
                        />
                      </td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => handleRemoveLink(i)}
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
          Edges:{" "}
          <strong style={{ color: theme.colors.text.heading }}>
            {links.length}
          </strong>
        </span>
        <span style={{ color: theme.colors.text.muted }}>
          Layout:{" "}
          <strong style={{ color: nodes[0]?.color }}>{layoutType}</strong>
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
            ⚫ {nodeMap[selectedNode]?.name}
          </span>
        )}
      </div>
    </div>
  );
};

export default NetworkDiagramComponent;
