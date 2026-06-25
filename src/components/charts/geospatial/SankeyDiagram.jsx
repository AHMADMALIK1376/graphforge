import React, { useState, useCallback, useMemo, memo } from "react";
import { sankey, sankeyLinkHorizontal, sankeyCenter } from "d3-sankey";
import { theme } from "../../../styles/theme";

// ============================================
// DEFAULT DATA - Budget flow through departments
// ============================================
const DEFAULT_DATA = {
  nodes: [
    { id: "budget", name: "Total Budget", color: "#3b82f6", group: "source" },
    { id: "hr", name: "Human Resources", color: "#ef4444", group: "dept" },
    { id: "it", name: "IT Department", color: "#10b981", group: "dept" },
    { id: "marketing", name: "Marketing", color: "#f59e0b", group: "dept" },
    { id: "sales", name: "Sales", color: "#8b5cf6", group: "dept" },
    { id: "ops", name: "Operations", color: "#ec4899", group: "dept" },
    { id: "rd", name: "R&D", color: "#06b6d4", group: "dept" },
    { id: "salaries", name: "Salaries", color: "#f97316", group: "expense" },
    {
      id: "tools",
      name: "Tools & Software",
      color: "#84cc16",
      group: "expense",
    },
    { id: "ads", name: "Advertising", color: "#a855f7", group: "expense" },
    { id: "travel", name: "Travel", color: "#14b8a6", group: "expense" },
    { id: "training", name: "Training", color: "#e11d48", group: "expense" },
  ],
  links: [
    { source: "budget", target: "hr", value: 150 },
    { source: "budget", target: "it", value: 250 },
    { source: "budget", target: "marketing", value: 200 },
    { source: "budget", target: "sales", value: 180 },
    { source: "budget", target: "ops", value: 120 },
    { source: "budget", target: "rd", value: 100 },
    { source: "hr", target: "salaries", value: 120 },
    { source: "hr", target: "training", value: 30 },
    { source: "it", target: "salaries", value: 150 },
    { source: "it", target: "tools", value: 100 },
    { source: "marketing", target: "ads", value: 150 },
    { source: "marketing", target: "tools", value: 50 },
    { source: "sales", target: "salaries", value: 100 },
    { source: "sales", target: "travel", value: 50 },
    { source: "sales", target: "tools", value: 30 },
    { source: "ops", target: "salaries", value: 80 },
    { source: "ops", target: "tools", value: 40 },
    { source: "rd", target: "salaries", value: 70 },
    { source: "rd", target: "tools", value: 30 },
  ],
};

// ============================================
// SMALLER DATASET - Simple user journey
// ============================================
const SMALL_DATA = {
  nodes: [
    { id: "landing", name: "Landing Page", color: "#3b82f6", group: "entry" },
    { id: "search", name: "Search", color: "#ef4444", group: "entry" },
    { id: "social", name: "Social Media", color: "#10b981", group: "entry" },
    { id: "product", name: "Product Page", color: "#f59e0b", group: "mid" },
    { id: "pricing", name: "Pricing", color: "#8b5cf6", group: "mid" },
    { id: "cart", name: "Cart", color: "#ec4899", group: "mid" },
    { id: "checkout", name: "Checkout", color: "#06b6d4", group: "end" },
    { id: "purchase", name: "Purchase", color: "#f97316", group: "end" },
    { id: "bounce", name: "Bounced", color: "#94a3b8", group: "end" },
  ],
  links: [
    { source: "landing", target: "product", value: 400 },
    { source: "landing", target: "pricing", value: 200 },
    { source: "landing", target: "bounce", value: 300 },
    { source: "search", target: "product", value: 500 },
    { source: "search", target: "pricing", value: 150 },
    { source: "search", target: "bounce", value: 200 },
    { source: "social", target: "product", value: 250 },
    { source: "social", target: "pricing", value: 100 },
    { source: "social", target: "bounce", value: 350 },
    { source: "product", target: "cart", value: 600 },
    { source: "product", target: "bounce", value: 400 },
    { source: "pricing", target: "cart", value: 300 },
    { source: "pricing", target: "bounce", value: 150 },
    { source: "cart", target: "checkout", value: 700 },
    { source: "cart", target: "bounce", value: 200 },
    { source: "checkout", target: "purchase", value: 550 },
    { source: "checkout", target: "bounce", value: 150 },
  ],
};

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
      "#84cc16",
      "#a855f7",
      "#14b8a6",
      "#e11d48",
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
      "#1d3557",
      "#48cae4",
      "#90e0ef",
      "#ffb703",
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
      "#081c15",
      "#2d6a4f",
      "#40916c",
      "#52b788",
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
      "#ff9f43",
      "#ff6348",
      "#ffa502",
      "#ff6b81",
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
      "#a5b4fc",
      "#fbcfe8",
      "#a7f3d0",
      "#fde68a",
    ],
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================
const hexToRgba = (hex, alpha) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(0,0,0,${alpha})`;
  return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`;
};

// ============================================
// MAIN COMPONENT
// ============================================
const SankeyDiagramComponent = ({ initialData = SMALL_DATA }) => {
  // ===== STATE =====
  const [data, setData] = useState(initialData);
  const [colorPreset, setColorPreset] = useState(COLOR_PRESETS[0]);
  const [nodeWidth, setNodeWidth] = useState(28);
  const [nodePadding, setNodePadding] = useState(20);
  const [linkOpacity, setLinkOpacity] = useState(0.6);
  const [showLabels, setShowLabels] = useState(true);
  const [labelSize, setLabelSize] = useState(11);
  const [showValues, setShowValues] = useState(true);
  const [alignment, setAlignment] = useState("center");
  const [titleText, setTitleText] = useState("Sankey Diagram");
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [datasetSize, setDatasetSize] = useState("small");

  // ===== DERIVED DATA =====
  const nodeMap = useMemo(() => {
    const map = {};
    data.nodes.forEach((n) => {
      map[n.id] = n;
    });
    return map;
  }, [data.nodes]);

  const sankeyLayout = useMemo(() => {
    const layout = sankey()
      .nodeWidth(nodeWidth)
      .nodePadding(nodePadding)
      .nodeAlign(sankeyCenter)
      .extent([
        [40, 50],
        [860, 480],
      ]);

    // Deep clone data for the layout (it mutates)
    const layoutData = {
      nodes: data.nodes.map((n) => ({ ...n })),
      links: data.links.map((l) => ({ ...l })),
    };

    const { nodes, links } = layout(layoutData);
    return { nodes, links };
  }, [data, nodeWidth, nodePadding]);

  const totalFlow = useMemo(() => {
    return data.links.reduce((sum, l) => sum + l.value, 0);
  }, [data.links]);

  const nodeConnections = useMemo(() => {
    const connections = {};
    data.nodes.forEach((n) => {
      const inLinks = data.links.filter((l) => l.target === n.id);
      const outLinks = data.links.filter((l) => l.source === n.id);
      connections[n.id] = {
        totalIn: inLinks.reduce((sum, l) => sum + l.value, 0),
        totalOut: outLinks.reduce((sum, l) => sum + l.value, 0),
        inCount: inLinks.length,
        outCount: outLinks.length,
      };
    });
    return connections;
  }, [data]);

  // ===== HANDLERS =====
  const handleNodeChange = useCallback((id, field, value) => {
    setData((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) =>
        n.id === id ? { ...n, [field]: value } : n,
      ),
    }));
  }, []);

  const handleLinkChange = useCallback((index, field, value) => {
    setData((prev) => ({
      ...prev,
      links: prev.links.map((l, i) =>
        i === index
          ? {
              ...l,
              [field]:
                field === "value" ? Math.max(1, Number(value) || 1) : value,
            }
          : l,
      ),
    }));
  }, []);

  const handleAddNode = useCallback(() => {
    const newId = `node${data.nodes.length + 1}`;
    const colors = colorPreset.colors;
    setData((prev) => ({
      ...prev,
      nodes: [
        ...prev.nodes,
        {
          id: newId,
          name: `Node ${data.nodes.length + 1}`,
          color: colors[data.nodes.length % colors.length],
          group: "custom",
        },
      ],
    }));
  }, [data.nodes, colorPreset]);

  const handleRemoveNode = useCallback((id) => {
    setData((prev) => ({
      nodes: prev.nodes.filter((n) => n.id !== id),
      links: prev.links.filter((l) => l.source !== id && l.target !== id),
    }));
    setSelectedNode(null);
  }, []);

  const handleAddLink = useCallback(() => {
    if (data.nodes.length < 2) return;
    const sourceIdx = Math.floor(Math.random() * data.nodes.length);
    let targetIdx = Math.floor(Math.random() * data.nodes.length);
    while (targetIdx === sourceIdx) {
      targetIdx = Math.floor(Math.random() * data.nodes.length);
    }
    setData((prev) => ({
      ...prev,
      links: [
        ...prev.links,
        {
          source: prev.nodes[sourceIdx].id,
          target: prev.nodes[targetIdx].id,
          value: Math.floor(Math.random() * 80) + 20,
        },
      ],
    }));
  }, [data.nodes]);

  const handleRemoveLink = useCallback((index) => {
    setData((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
    setSelectedLink(null);
  }, []);

  const handleColorPresetChange = useCallback((presetName) => {
    const preset = COLOR_PRESETS.find((p) => p.name === presetName);
    if (preset) {
      setColorPreset(preset);
      setData((prev) => ({
        ...prev,
        nodes: prev.nodes.map((n, i) => ({
          ...n,
          color: preset.colors[i % preset.colors.length],
        })),
      }));
    }
  }, []);

  const handleDatasetChange = useCallback((size) => {
    setDatasetSize(size);
    if (size === "small") {
      setData({ nodes: [...SMALL_DATA.nodes], links: [...SMALL_DATA.links] });
      setTitleText("Sankey Diagram - User Journey");
    } else {
      setData({
        nodes: [...DEFAULT_DATA.nodes],
        links: [...DEFAULT_DATA.links],
      });
      setTitleText("Sankey Diagram - Budget Flow");
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
    borderBottom: `2px solid ${data.nodes[0]?.color || "#3b82f6"}`,
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
    minHeight: "530px",
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
    border: `1px solid ${data.nodes[0]?.color || "#3b82f6"}`,
    borderRadius: "3px",
    color: data.nodes[0]?.color || "#3b82f6",
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
          top: pos.y - 50,
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
        <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>
          {nodeMap[info.source]?.name} → {nodeMap[info.target]?.name}
        </p>
        <p
          style={{
            margin: "4px 0 0",
            fontSize: "16px",
            fontWeight: 700,
            color: nodeMap[info.source]?.color,
          }}
        >
          {info.value.toLocaleString()}
        </p>
      </div>
    );
  };

  // ============================================
  // LEGEND
  // ============================================
  const Legend = memo(() => (
    <div
      style={{
        position: "absolute",
        top: "15px",
        right: "15px",
        background: "rgba(15, 15, 35, 0.9)",
        borderRadius: "8px",
        padding: "10px 14px",
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
        zIndex: 10,
        maxHeight: "350px",
        overflowY: "auto",
        maxWidth: "180px",
      }}
    >
      <p
        style={{
          margin: "0 0 8px",
          fontSize: "10px",
          fontWeight: 700,
          color: "#cbd5e1",
          textAlign: "center",
        }}
      >
        NODES
      </p>
      {data.nodes.map((node) => (
        <div
          key={node.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "3px",
            cursor: "pointer",
            opacity:
              selectedNode === null || selectedNode === node.id ? 1 : 0.4,
            transition: "opacity 0.2s ease",
          }}
          onClick={() => handleNodeClick(node.id)}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "2px",
              background: node.color,
              border:
                selectedNode === node.id
                  ? "2px solid #ffffff"
                  : "1px solid rgba(255,255,255,0.2)",
            }}
          />
          <span
            style={{
              fontSize: "8px",
              color: selectedNode === node.id ? "#ffffff" : "#94a3b8",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {node.name}
          </span>
        </div>
      ))}
    </div>
  ));

  // ============================================
  // RENDER
  // ============================================
  return (
    <div style={containerStyle}>
      {/* HEADER */}
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>🔀</span>
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
              color: data.nodes[0]?.color || "#3b82f6",
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${data.nodes[0]?.color || "#3b82f6"}50`,
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
            {data.nodes.length} N · {data.links.length} L
          </span>
        </div>
      </div>

      {/* SANKEY DIAGRAM */}
      <div id="chart-visual-area" style={chartContainerStyle}>
        <Legend />
        <Tooltip info={tooltip?.info} pos={tooltip?.position} />

        <svg width="940" height="530" viewBox="0 0 940 530">
          {/* Background */}
          <rect width="940" height="530" fill="#0f172a" />

          {/* Links (Flows) */}
          {sankeyLayout.links.map((link, i) => {
            const sourceColor = nodeMap[link.source.id]?.color || "#64748b";
            const isHighlighted =
              selectedNode === null ||
              selectedNode === link.source.id ||
              selectedNode === link.target.id;
            const isSelectedLink = selectedLink === i;
            const linkPath = sankeyLinkHorizontal()(link);

            return (
              <g key={`link-${i}`}>
                {/* Link glow */}
                <path
                  d={linkPath}
                  fill="none"
                  stroke={sourceColor}
                  strokeWidth={Math.max(1, link.width + 6)}
                  opacity={isHighlighted ? 0.12 : 0.02}
                  style={{ pointerEvents: "stroke", cursor: "pointer" }}
                  onClick={() => setSelectedLink(isSelectedLink ? null : i)}
                />
                {/* Main link */}
                <path
                  d={linkPath}
                  fill="none"
                  stroke={sourceColor}
                  strokeWidth={Math.max(1, link.width)}
                  opacity={isHighlighted ? linkOpacity : 0.08}
                  style={{
                    cursor: "pointer",
                    transition: "opacity 0.3s ease",
                  }}
                  onClick={() => setSelectedLink(isSelectedLink ? null : i)}
                  onMouseEnter={(e) => {
                    const rect = e.target
                      .closest("svg")
                      .getBoundingClientRect();
                    setTooltip({
                      info: {
                        source: link.source.id,
                        target: link.target.id,
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
                {/* Value label on wide links */}
                {showValues && link.width > 8 && isHighlighted && (
                  <text
                    x={link.source.x1 + (link.target.x0 - link.source.x1) / 2}
                    y={link.y0 + link.width / 2 + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={Math.min(10, link.width - 2)}
                    fill="#ffffff"
                    fontWeight={700}
                    fontFamily={theme.typography.fontFamily.primary}
                    style={{ pointerEvents: "none" }}
                  >
                    {link.value}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes (Rectangles) */}
          {sankeyLayout.nodes.map((node, i) => {
            const nodeData = data.nodes.find((n) => n.id === node.id);
            const isSelected = selectedNode === node.id;
            const color = nodeData?.color || "#64748b";

            return (
              <g
                key={`node-${node.id}`}
                style={{ cursor: "pointer" }}
                onClick={() => handleNodeClick(node.id)}
              >
                {/* Node shadow */}
                <rect
                  x={node.x0 - 2}
                  y={node.y0 - 2}
                  width={node.x1 - node.x0 + 4}
                  height={node.y1 - node.y0 + 4}
                  fill={color}
                  opacity={isSelected ? 0.3 : 0.1}
                  rx={4}
                  style={{ transition: "opacity 0.3s ease" }}
                />
                {/* Main node */}
                <rect
                  x={node.x0}
                  y={node.y0}
                  width={node.x1 - node.x0}
                  height={Math.max(0, node.y1 - node.y0)}
                  fill={color}
                  opacity={selectedNode === null || isSelected ? 1 : 0.3}
                  rx={3}
                  style={{ transition: "opacity 0.3s ease" }}
                />
                {/* Label */}
                {showLabels && (
                  <text
                    x={node.x0 < 470 ? node.x1 + 8 : node.x0 - 8}
                    y={node.y0 + (node.y1 - node.y0) / 2 + 1}
                    textAnchor={node.x0 < 470 ? "start" : "end"}
                    dominantBaseline="central"
                    fontSize={labelSize}
                    fontFamily={theme.typography.fontFamily.primary}
                    fill={isSelected ? "#ffffff" : "#cbd5e1"}
                    fontWeight={isSelected ? 700 : 400}
                    style={{ pointerEvents: "none" }}
                  >
                    {nodeData?.name || node.id}
                    {showValues && ` (${node.value?.toLocaleString() || 0})`}
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
            <option value="small">User Journey (9 Nodes)</option>
            <option value="large">Budget Flow (12 Nodes)</option>
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

        {/* Node Width */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Node Width: {nodeWidth}</label>
          <input
            type="range"
            min="15"
            max="50"
            value={nodeWidth}
            onChange={(e) => setNodeWidth(Number(e.target.value))}
            style={{ width: "100%", accentColor: data.nodes[0]?.color }}
          />
        </div>

        {/* Node Padding */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>↕️ Node Padding: {nodePadding}</label>
          <input
            type="range"
            min="5"
            max="50"
            value={nodePadding}
            onChange={(e) => setNodePadding(Number(e.target.value))}
            style={{ width: "100%", accentColor: data.nodes[0]?.color }}
          />
        </div>

        {/* Link Opacity */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>👁️ Link Opacity: {linkOpacity}</label>
          <input
            type="range"
            min="0.2"
            max="1"
            step="0.1"
            value={linkOpacity}
            onChange={(e) => setLinkOpacity(Number(e.target.value))}
            style={{ width: "100%", accentColor: data.nodes[0]?.color }}
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
            style={{ width: "100%", accentColor: data.nodes[0]?.color }}
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
                style={{ accentColor: data.nodes[0]?.color }}
              />
              Show Labels
            </label>
            <label style={checkboxStyle}>
              <input
                type="checkbox"
                checked={showValues}
                onChange={(e) => setShowValues(e.target.checked)}
                style={{ accentColor: data.nodes[0]?.color }}
              />
              Show Values
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
            <label style={labelStyle}>▊ Nodes</label>
            <button
              onClick={handleAddNode}
              style={buttonStyle}
              onMouseEnter={(e) =>
                (e.target.style.background = `${data.nodes[0]?.color}20`)
              }
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
            >
              + Add Node
            </button>
          </div>
          <div style={dataTableContainerStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Color</th>
                  <th style={thStyle}>In/Out</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.nodes.map((node) => {
                  const conn = nodeConnections[node.id] || {
                    totalIn: 0,
                    totalOut: 0,
                  };
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
                      <td
                        style={{
                          ...tdStyle,
                          textAlign: "center",
                          fontSize: "10px",
                        }}
                      >
                        <span style={{ color: "#10b981" }}>
                          ↓{conn.totalIn}
                        </span>
                        {" / "}
                        <span style={{ color: "#ef4444" }}>
                          ↑{conn.totalOut}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveNode(node.id);
                          }}
                          style={deleteButtonStyle}
                          disabled={data.nodes.length <= 2}
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
            <label style={labelStyle}>➡️ Links</label>
            <button
              onClick={handleAddLink}
              style={buttonStyle}
              onMouseEnter={(e) =>
                (e.target.style.background = `${data.nodes[0]?.color}20`)
              }
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
            >
              + Add Link
            </button>
          </div>
          <div style={dataTableContainerStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Source → Target</th>
                  <th style={thStyle}>Value</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.links.map((link, i) => (
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
                        onClick={(e) => e.stopPropagation()}
                        style={{ ...cellInputStyle, width: "80px" }}
                        min="1"
                      />
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
            {data.nodes.length}
          </strong>
        </span>
        <span style={{ color: theme.colors.text.muted }}>
          Links:{" "}
          <strong style={{ color: theme.colors.text.heading }}>
            {data.links.length}
          </strong>
        </span>
        <span style={{ color: theme.colors.text.muted }}>
          Total Flow:{" "}
          <strong style={{ color: data.nodes[0]?.color }}>
            {totalFlow.toLocaleString()}
          </strong>
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
            ▊ {nodeMap[selectedNode]?.name}
          </span>
        )}
      </div>
    </div>
  );
};

export default SankeyDiagramComponent;
