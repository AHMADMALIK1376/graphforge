import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { theme } from "../../../styles/theme";

// ============================================
// NODE SHAPE RENDERERS
// ============================================
const renderNodeShape = (
  node,
  x,
  y,
  width,
  height,
  fill,
  stroke,
  isSelected,
) => {
  const halfW = width / 2;
  const halfH = height / 2;
  const rx = 8;
  const ry = 8;

  switch (node.shape) {
    case "diamond":
      // Decision diamond
      const diamond = `M ${x} ${y - halfH} L ${x + halfW} ${y} L ${x} ${y + halfH} L ${x - halfW} ${y} Z`;
      return (
        <g>
          <path
            d={diamond}
            fill={fill}
            stroke={stroke}
            strokeWidth={isSelected ? 3 : 2}
          />
        </g>
      );
    case "parallelogram":
      // Input/Output
      const offset = 15;
      const para = `M ${x - halfW + offset} ${y - halfH} L ${x + halfW} ${y - halfH} L ${x + halfW - offset} ${y + halfH} L ${x - halfW} ${y + halfH} Z`;
      return (
        <g>
          <path
            d={para}
            fill={fill}
            stroke={stroke}
            strokeWidth={isSelected ? 3 : 2}
          />
        </g>
      );
    case "ellipse":
      // Terminal (Start/End)
      return (
        <g>
          <ellipse
            cx={x}
            cy={y}
            rx={halfW}
            ry={halfH}
            fill={fill}
            stroke={stroke}
            strokeWidth={isSelected ? 3 : 2}
          />
        </g>
      );
    case "rounded":
      // Process with rounded corners
      return (
        <g>
          <rect
            x={x - halfW}
            y={y - halfH}
            width={width}
            height={height}
            rx={rx}
            ry={ry}
            fill={fill}
            stroke={stroke}
            strokeWidth={isSelected ? 3 : 2}
          />
        </g>
      );
    default:
      // Standard rectangle
      return (
        <g>
          <rect
            x={x - halfW}
            y={y - halfH}
            width={width}
            height={height}
            fill={fill}
            stroke={stroke}
            strokeWidth={isSelected ? 3 : 2}
          />
        </g>
      );
  }
};

// ============================================
// ARROW MARKER
// ============================================
const ArrowMarker = ({ id, color }) => (
  <defs>
    <marker
      id={id}
      viewBox="0 0 10 10"
      refX="9"
      refY="5"
      markerWidth="6"
      markerHeight="6"
      orient="auto-start-reverse"
    >
      <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
    </marker>
  </defs>
);

// ============================================
// DEFAULT DATA - Customer Support Flow
// ============================================
const DEFAULT_NODES = [
  {
    id: "start",
    label: "Start",
    shape: "ellipse",
    x: 450,
    y: 40,
    color: "#10b981",
    textColor: "#ffffff",
  },
  {
    id: "receive",
    label: "Receive\nSupport Ticket",
    shape: "rounded",
    x: 450,
    y: 130,
    color: "#3b82f6",
    textColor: "#ffffff",
  },
  {
    id: "classify",
    label: "Classify\nIssue Type",
    shape: "diamond",
    x: 450,
    y: 250,
    color: "#f59e0b",
    textColor: "#1e293b",
  },
  {
    id: "technical",
    label: "Technical\nIssue?",
    shape: "diamond",
    x: 280,
    y: 370,
    color: "#f59e0b",
    textColor: "#1e293b",
  },
  {
    id: "billing",
    label: "Billing\nIssue?",
    shape: "diamond",
    x: 620,
    y: 370,
    color: "#f59e0b",
    textColor: "#1e293b",
  },
  {
    id: "techFix",
    label: "Assign to\nTech Team",
    shape: "rounded",
    x: 160,
    y: 490,
    color: "#8b5cf6",
    textColor: "#ffffff",
  },
  {
    id: "billingFix",
    label: "Assign to\nBilling Team",
    shape: "rounded",
    x: 620,
    y: 490,
    color: "#8b5cf6",
    textColor: "#ffffff",
  },
  {
    id: "otherFix",
    label: "Assign to\nGeneral Team",
    shape: "rounded",
    x: 450,
    y: 490,
    color: "#8b5cf6",
    textColor: "#ffffff",
  },
  {
    id: "resolve",
    label: "Resolve\nTicket",
    shape: "rounded",
    x: 390,
    y: 610,
    color: "#ec4899",
    textColor: "#ffffff",
  },
  {
    id: "notify",
    label: "Notify\nCustomer",
    shape: "parallelogram",
    x: 390,
    y: 720,
    color: "#06b6d4",
    textColor: "#1e293b",
  },
  {
    id: "end",
    label: "End",
    shape: "ellipse",
    x: 390,
    y: 830,
    color: "#ef4444",
    textColor: "#ffffff",
  },
];

const DEFAULT_LINKS = [
  { id: "l1", source: "start", target: "receive", label: "" },
  { id: "l2", source: "receive", target: "classify", label: "" },
  { id: "l3", source: "classify", target: "technical", label: "Tech" },
  { id: "l4", source: "classify", target: "billing", label: "Billing" },
  { id: "l5", source: "classify", target: "otherFix", label: "Other" },
  { id: "l6", source: "technical", target: "techFix", label: "Yes" },
  { id: "l7", source: "technical", target: "otherFix", label: "No" },
  { id: "l8", source: "billing", target: "billingFix", label: "Yes" },
  { id: "l9", source: "billing", target: "otherFix", label: "No" },
  { id: "l10", source: "techFix", target: "resolve", label: "" },
  { id: "l11", source: "billingFix", target: "resolve", label: "" },
  { id: "l12", source: "otherFix", target: "resolve", label: "" },
  { id: "l13", source: "resolve", target: "notify", label: "" },
  { id: "l14", source: "notify", target: "end", label: "" },
];

// ============================================
// SMALL DATASET - Simple Login Flow
// ============================================
const SMALL_NODES = [
  {
    id: "start",
    label: "Start",
    shape: "ellipse",
    x: 400,
    y: 50,
    color: "#10b981",
    textColor: "#ffffff",
  },
  {
    id: "login",
    label: "User Login",
    shape: "rounded",
    x: 400,
    y: 170,
    color: "#3b82f6",
    textColor: "#ffffff",
  },
  {
    id: "valid",
    label: "Valid\nCredentials?",
    shape: "diamond",
    x: 400,
    y: 310,
    color: "#f59e0b",
    textColor: "#1e293b",
  },
  {
    id: "dashboard",
    label: "Show\nDashboard",
    shape: "rounded",
    x: 200,
    y: 450,
    color: "#8b5cf6",
    textColor: "#ffffff",
  },
  {
    id: "error",
    label: "Show Error\nMessage",
    shape: "parallelogram",
    x: 600,
    y: 450,
    color: "#ef4444",
    textColor: "#ffffff",
  },
  {
    id: "end",
    label: "End",
    shape: "ellipse",
    x: 300,
    y: 570,
    color: "#ef4444",
    textColor: "#ffffff",
  },
];

const SMALL_LINKS = [
  { id: "l1", source: "start", target: "login", label: "" },
  { id: "l2", source: "login", target: "valid", label: "" },
  { id: "l3", source: "valid", target: "dashboard", label: "Yes" },
  { id: "l4", source: "valid", target: "error", label: "No" },
  { id: "l5", source: "dashboard", target: "end", label: "" },
  { id: "l6", source: "error", target: "login", label: "Retry" },
];

// ============================================
// COLOR PRESETS FOR NODES
// ============================================
const COLOR_PRESETS = [
  {
    name: "Professional",
    flow: "#3b82f6",
    decision: "#f59e0b",
    process: "#8b5cf6",
    start: "#10b981",
    end: "#ef4444",
    io: "#06b6d4",
  },
  {
    name: "Vibrant",
    flow: "#ff006e",
    decision: "#ffbe0b",
    process: "#8338ec",
    start: "#00ff88",
    end: "#ff006e",
    io: "#00d4ff",
  },
  {
    name: "Ocean",
    flow: "#023047",
    decision: "#ffb703",
    process: "#219ebc",
    start: "#8ecae6",
    end: "#e63946",
    io: "#457b9d",
  },
  {
    name: "Monochrome",
    flow: "#1a1a2e",
    decision: "#404069",
    process: "#53538f",
    start: "#2d2d44",
    end: "#1a1a2e",
    io: "#6666b4",
  },
];

// ============================================
// SHAPE LEGEND
// ============================================
const SHAPE_INFO = [
  { shape: "ellipse", name: "Terminal", description: "Start / End" },
  { shape: "rounded", name: "Process", description: "Action step" },
  { shape: "diamond", name: "Decision", description: "Yes / No branch" },
  {
    shape: "parallelogram",
    name: "Input/Output",
    description: "Data / Display",
  },
  { shape: "rect", name: "Standard", description: "Generic step" },
];

// ============================================
// MAIN COMPONENT
// ============================================
const FlowchartComponent = ({
  initialNodes = SMALL_NODES,
  initialLinks = SMALL_LINKS,
}) => {
  // ===== STATE =====
  const [nodes, setNodes] = useState(initialNodes);
  const [links, setLinks] = useState(initialLinks);
  const [colorPreset, setColorPreset] = useState(COLOR_PRESETS[0]);
  const [nodeWidth, setNodeWidth] = useState(140);
  const [nodeHeight, setNodeHeight] = useState(50);
  const [linkColor, setLinkColor] = useState("#94a3b8");
  const [linkWidth, setLinkWidth] = useState(2);
  const [showLabels, setShowLabels] = useState(true);
  const [fontSize, setFontSize] = useState(12);
  const [showGrid, setShowGrid] = useState(true);
  const [gridSnap, setGridSnap] = useState(false);
  const [titleText, setTitleText] = useState("Flowchart");
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [datasetSize, setDatasetSize] = useState("small");
  const [draggingNode, setDraggingNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // ===== REFS =====
  const svgRef = useRef(null);

  // ===== DERIVED DATA =====
  const nodeMap = useMemo(() => {
    const map = {};
    nodes.forEach((n) => {
      map[n.id] = n;
    });
    return map;
  }, [nodes]);

  const svgDimensions = useMemo(() => {
    const maxX = Math.max(...nodes.map((n) => n.x + nodeWidth), 800);
    const maxY = Math.max(...nodes.map((n) => n.y + nodeHeight + 50), 600);
    return { width: maxX + 100, height: maxY + 50 };
  }, [nodes, nodeWidth, nodeHeight]);

  // ===== COLOR FUNCTIONS =====
  const getNodeColor = useCallback(
    (shape) => {
      switch (shape) {
        case "ellipse":
          return colorPreset.start;
        case "diamond":
          return colorPreset.decision;
        case "rounded":
          return colorPreset.process;
        case "parallelogram":
          return colorPreset.io;
        default:
          return colorPreset.flow;
      }
    },
    [colorPreset],
  );

  // ===== HANDLERS =====
  const handleNodeChange = useCallback((id, field, value) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              [field]:
                field === "x" || field === "y" ? Number(value) || 0 : value,
            }
          : n,
      ),
    );
  }, []);

  const handleLinkChange = useCallback((id, field, value) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    );
  }, []);

  const handleAddNode = useCallback(() => {
    const newId = `node${Date.now()}`;
    setNodes((prev) => [
      ...prev,
      {
        id: newId,
        label: "New Step",
        shape: "rounded",
        x: 200 + Math.random() * 400,
        y: 100 + Math.random() * 500,
        color: colorPreset.process,
        textColor: "#ffffff",
      },
    ]);
  }, [colorPreset]);

  const handleRemoveNode = useCallback((id) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setLinks((prev) => prev.filter((l) => l.source !== id && l.target !== id));
    setSelectedNode(null);
  }, []);

  const handleAddLink = useCallback(() => {
    if (nodes.length < 2) return;
    const newId = `link${Date.now()}`;
    setLinks((prev) => [
      ...prev,
      {
        id: newId,
        source: nodes[0].id,
        target: nodes[nodes.length - 1].id,
        label: "",
      },
    ]);
  }, [nodes]);

  const handleRemoveLink = useCallback((id) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    setSelectedLink(null);
  }, []);

  const handleColorPresetChange = useCallback((presetName) => {
    const preset = COLOR_PRESETS.find((p) => p.name === presetName);
    if (preset) {
      setColorPreset(preset);
      setNodes((prev) =>
        prev.map((n) => ({
          ...n,
          color:
            preset[
              n.shape === "ellipse"
                ? "start"
                : n.shape === "diamond"
                  ? "decision"
                  : n.shape === "rounded"
                    ? "process"
                    : n.shape === "parallelogram"
                      ? "io"
                      : "flow"
            ],
        })),
      );
    }
  }, []);

  const handleDatasetChange = useCallback((size) => {
    setDatasetSize(size);
    if (size === "small") {
      setNodes([...SMALL_NODES]);
      setLinks([...SMALL_LINKS]);
      setTitleText("Flowchart - Login Process");
    } else {
      setNodes([...DEFAULT_NODES]);
      setLinks([...DEFAULT_LINKS]);
      setTitleText("Flowchart - Support Workflow");
    }
    setSelectedNode(null);
    setSelectedLink(null);
  }, []);

  // ===== DRAG HANDLERS =====
  const handleMouseDown = useCallback(
    (e, nodeId) => {
      const node = nodeMap[nodeId];
      if (!node) return;
      const svgRect = svgRef.current?.getBoundingClientRect();
      if (!svgRect) return;
      setDraggingNode(nodeId);
      setDragOffset({
        x: e.clientX - svgRect.left - node.x,
        y: e.clientY - svgRect.top - node.y,
      });
    },
    [nodeMap],
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!draggingNode) return;
      const svgRect = svgRef.current?.getBoundingClientRect();
      if (!svgRect) return;
      let newX = e.clientX - svgRect.left - dragOffset.x;
      let newY = e.clientY - svgRect.top - dragOffset.y;

      if (gridSnap) {
        const gridSize = 20;
        newX = Math.round(newX / gridSize) * gridSize;
        newY = Math.round(newY / gridSize) * gridSize;
      }

      setNodes((prev) =>
        prev.map((n) =>
          n.id === draggingNode ? { ...n, x: newX, y: newY } : n,
        ),
      );
    },
    [draggingNode, dragOffset, gridSnap],
  );

  const handleMouseUp = useCallback(() => {
    setDraggingNode(null);
  }, []);

  // ===== LINK PATH CALCULATION =====
  const getLinkPath = useCallback(
    (sourceNode, targetNode) => {
      if (!sourceNode || !targetNode) return "";

      const sx = sourceNode.x;
      const sy = sourceNode.y;
      const tx = targetNode.x;
      const ty = targetNode.y;
      const halfH = nodeHeight / 2;

      // Start from bottom of source, end at top of target
      const startY = sy + halfH;
      const endY = ty - halfH;

      const midY = (startY + endY) / 2;
      const dx = tx - sx;

      if (Math.abs(dx) < 20) {
        // Straight vertical line
        return `M ${sx} ${startY} L ${tx} ${endY}`;
      }

      // Curved path
      return `M ${sx} ${startY} C ${sx} ${midY}, ${tx} ${midY}, ${tx} ${endY}`;
    },
    [nodeHeight],
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
    borderBottom: `2px solid ${colorPreset.flow}`,
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
    background: "#f8fafc",
    borderRadius: "8px",
    border: `1px solid ${theme.colors.border.light}`,
    minHeight: "600px",
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
    border: `1px solid ${colorPreset.flow}`,
    borderRadius: "3px",
    color: colorPreset.flow,
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
  // TOOLTIP
  // ============================================
  const Tooltip = ({ info, pos }) => {
    if (!info || !pos) return null;
    return (
      <div
        style={{
          position: "absolute",
          left: pos.x + 15,
          top: pos.y - 30,
          background: "rgba(15, 15, 35, 0.95)",
          border: `1px solid ${info.color || "#3b82f6"}`,
          borderRadius: "6px",
          padding: "8px 12px",
          pointerEvents: "none",
          zIndex: 100,
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "11px",
            fontWeight: 700,
            color: "#e2e8f0",
          }}
        >
          {info.label}
        </p>
        {info.shape && (
          <p style={{ margin: "2px 0 0", fontSize: "9px", color: "#94a3b8" }}>
            Shape: {info.shape}
          </p>
        )}
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
          <span style={{ fontSize: "28px" }}>📊</span>
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
              color: colorPreset.flow,
              fontSize: "10px",
              padding: "4px 10px",
              border: `1px solid ${colorPreset.flow}50`,
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
            {nodes.length} STEPS · {links.length} FLOWS
          </span>
        </div>
      </div>

      {/* FLOWCHART */}
      <div id="chart-visual-area" style={chartContainerStyle}>
        <Tooltip info={tooltip?.info} pos={tooltip?.position} />

        <svg
          ref={svgRef}
          width="100%"
          height={svgDimensions.height}
          viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <ArrowMarker id="arrowhead" color={linkColor} />

          {/* Background */}
          <rect
            width={svgDimensions.width}
            height={svgDimensions.height}
            fill="#f8fafc"
          />

          {/* Grid */}
          {showGrid && (
            <g>
              {Array.from(
                { length: Math.ceil(svgDimensions.width / 20) },
                (_, i) => (
                  <line
                    key={`gv${i}`}
                    x1={i * 20}
                    y1={0}
                    x2={i * 20}
                    y2={svgDimensions.height}
                    stroke="#e2e8f0"
                    strokeWidth={0.5}
                  />
                ),
              )}
              {Array.from(
                { length: Math.ceil(svgDimensions.height / 20) },
                (_, i) => (
                  <line
                    key={`gh${i}`}
                    x1={0}
                    y1={i * 20}
                    x2={svgDimensions.width}
                    y2={i * 20}
                    stroke="#e2e8f0"
                    strokeWidth={0.5}
                  />
                ),
              )}
            </g>
          )}

          {/* Links */}
          {links.map((link) => {
            const sourceNode = nodeMap[link.source];
            const targetNode = nodeMap[link.target];
            if (!sourceNode || !targetNode) return null;

            const isSelected = selectedLink === link.id;
            const pathData = getLinkPath(sourceNode, targetNode);
            const midX = (sourceNode.x + targetNode.x) / 2;
            const midY =
              (sourceNode.y + nodeHeight / 2 + targetNode.y - nodeHeight / 2) /
              2;

            return (
              <g key={link.id}>
                {/* Link glow */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={linkColor}
                  strokeWidth={linkWidth + 4}
                  opacity={isSelected ? 0.2 : 0.05}
                  strokeLinecap="round"
                />
                {/* Main link */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={linkColor}
                  strokeWidth={isSelected ? linkWidth + 2 : linkWidth}
                  opacity={isSelected ? 1 : 0.7}
                  strokeLinecap="round"
                  markerEnd="url(#arrowhead)"
                  style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                  onClick={() => setSelectedLink(isSelected ? null : link.id)}
                  onMouseEnter={(e) => {
                    const rect = e.target
                      .closest("svg")
                      .getBoundingClientRect();
                    setTooltip({
                      info: {
                        label: `${nodeMap[link.source]?.label} → ${nodeMap[link.target]?.label}`,
                        color: linkColor,
                      },
                      position: {
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                      },
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
                {/* Link label */}
                {showLabels && link.label && (
                  <text
                    x={midX}
                    y={midY - 8}
                    textAnchor="middle"
                    fontSize={fontSize - 2}
                    fill="#64748b"
                    fontWeight={600}
                    fontFamily={theme.typography.fontFamily.primary}
                    style={{ pointerEvents: "none" }}
                  >
                    {link.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedNode === node.id;
            const fillColor = node.color || getNodeColor(node.shape);
            const halfW = nodeWidth / 2;
            const halfH = nodeHeight / 2;

            return (
              <g
                key={node.id}
                style={{
                  cursor: draggingNode === node.id ? "grabbing" : "grab",
                }}
                onMouseDown={(e) => {
                  handleMouseDown(e, node.id);
                  setSelectedNode(node.id);
                }}
                onMouseEnter={(e) => {
                  if (!draggingNode) {
                    const rect = e.target
                      .closest("svg")
                      .getBoundingClientRect();
                    setTooltip({
                      info: {
                        label: node.label.replace(/\n/g, " "),
                        shape: node.shape,
                        color: fillColor,
                      },
                      position: {
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                      },
                    });
                  }
                }}
                onMouseLeave={() => {
                  if (!draggingNode) setTooltip(null);
                }}
              >
                {/* Node shadow */}
                {renderNodeShape(
                  node,
                  node.x + 2,
                  node.y + 2,
                  nodeWidth,
                  nodeHeight,
                  "rgba(0,0,0,0.15)",
                  "rgba(0,0,0,0.15)",
                  false,
                )}
                {/* Node shape */}
                {renderNodeShape(
                  node,
                  node.x,
                  node.y,
                  nodeWidth,
                  nodeHeight,
                  fillColor,
                  isSelected ? "#1e293b" : "rgba(0,0,0,0.2)",
                  isSelected,
                )}
                {/* Label */}
                {showLabels && (
                  <text
                    x={node.x}
                    y={node.y + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={fontSize}
                    fill={node.textColor || "#ffffff"}
                    fontWeight={600}
                    fontFamily={theme.typography.fontFamily.primary}
                    style={{ pointerEvents: "none", whiteSpace: "pre" }}
                  >
                    {node.label.split("\n").map((line, i) => (
                      <tspan key={i} x={node.x} dy={i === 0 ? 0 : fontSize + 2}>
                        {line}
                      </tspan>
                    ))}
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
            <option value="small">Login Flow (6 Steps)</option>
            <option value="large">Support Workflow (11 Steps)</option>
          </select>
        </div>

        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Color Theme</label>
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
          <label style={labelStyle}>📏 Node Width: {nodeWidth}</label>
          <input
            type="range"
            min="80"
            max="220"
            value={nodeWidth}
            onChange={(e) => setNodeWidth(Number(e.target.value))}
            style={{ width: "100%", accentColor: colorPreset.flow }}
          />
        </div>

        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Node Height: {nodeHeight}</label>
          <input
            type="range"
            min="40"
            max="100"
            value={nodeHeight}
            onChange={(e) => setNodeHeight(Number(e.target.value))}
            style={{ width: "100%", accentColor: colorPreset.flow }}
          />
        </div>

        <div style={controlGroupStyle}>
          <label style={labelStyle}>✏️ Link Color</label>
          <input
            type="color"
            value={linkColor}
            onChange={(e) => setLinkColor(e.target.value)}
            style={{
              width: "36px",
              height: "32px",
              cursor: "pointer",
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: "3px",
            }}
          />
        </div>

        <div style={controlGroupStyle}>
          <label style={labelStyle}>📐 Link Width: {linkWidth}</label>
          <input
            type="range"
            min="1"
            max="5"
            value={linkWidth}
            onChange={(e) => setLinkWidth(Number(e.target.value))}
            style={{ width: "100%", accentColor: colorPreset.flow }}
          />
        </div>

        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔤 Font Size: {fontSize}</label>
          <input
            type="range"
            min="8"
            max="18"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            style={{ width: "100%", accentColor: colorPreset.flow }}
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
                style={{ accentColor: colorPreset.flow }}
              />{" "}
              Show Labels
            </label>
            <label style={checkboxStyle}>
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
                style={{ accentColor: colorPreset.flow }}
              />{" "}
              Show Grid
            </label>
            <label style={checkboxStyle}>
              <input
                type="checkbox"
                checked={gridSnap}
                onChange={(e) => setGridSnap(e.target.checked)}
                style={{ accentColor: colorPreset.flow }}
              />{" "}
              Snap to Grid
            </label>
          </div>
        </div>
      </div>

      {/* LEGEND + TABLES */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px" }}
      >
        {/* Shape Legend */}
        <div>
          <label
            style={{ ...labelStyle, display: "block", marginBottom: "12px" }}
          >
            🔷 Shape Legend
          </label>
          <div style={dataTableContainerStyle}>
            <div style={{ padding: "12px" }}>
              {SHAPE_INFO.map((info) => (
                <div
                  key={info.shape}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "10px",
                  }}
                >
                  <svg width="50" height="35">
                    {renderNodeShape(
                      { shape: info.shape },
                      25,
                      17,
                      40,
                      28,
                      "#e2e8f0",
                      "#94a3b8",
                      false,
                    )}
                  </svg>
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "11px",
                        fontWeight: 700,
                        color: theme.colors.text.body,
                      }}
                    >
                      {info.name}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "9px",
                        color: theme.colors.text.muted,
                      }}
                    >
                      {info.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Nodes & Links Table */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Steps */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <label style={labelStyle}>📋 Steps</label>
              <button
                onClick={handleAddNode}
                style={buttonStyle}
                onMouseEnter={(e) =>
                  (e.target.style.background = `${colorPreset.flow}20`)
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "transparent")
                }
              >
                + Add Step
              </button>
            </div>
            <div style={dataTableContainerStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Label</th>
                    <th style={thStyle}>Shape</th>
                    <th style={thStyle}>X / Y</th>
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
                            ? `${colorPreset.flow}15`
                            : "transparent",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        setSelectedNode(
                          selectedNode === node.id ? null : node.id,
                        )
                      }
                    >
                      <td style={tdStyle}>
                        <input
                          type="text"
                          value={node.label}
                          onChange={(e) =>
                            handleNodeChange(node.id, "label", e.target.value)
                          }
                          onClick={(e) => e.stopPropagation()}
                          style={cellInputStyle}
                        />
                      </td>
                      <td style={tdStyle}>
                        <select
                          value={node.shape}
                          onChange={(e) =>
                            handleNodeChange(node.id, "shape", e.target.value)
                          }
                          onClick={(e) => e.stopPropagation()}
                          style={{ ...cellInputStyle, width: "100px" }}
                        >
                          {SHAPE_INFO.map((s) => (
                            <option key={s.shape} value={s.shape}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td
                        style={{
                          ...tdStyle,
                          textAlign: "center",
                          fontSize: "10px",
                          color: theme.colors.text.muted,
                        }}
                      >
                        {Math.round(node.x)}, {Math.round(node.y)}
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
          </div>

          {/* Flows */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <label style={labelStyle}>➡️ Flows</label>
              <button
                onClick={handleAddLink}
                style={buttonStyle}
                onMouseEnter={(e) =>
                  (e.target.style.background = `${colorPreset.flow}20`)
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "transparent")
                }
              >
                + Add Flow
              </button>
            </div>
            <div style={dataTableContainerStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>From → To</th>
                    <th style={thStyle}>Label</th>
                    <th style={thStyle}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link) => (
                    <tr
                      key={link.id}
                      style={{
                        background:
                          selectedLink === link.id
                            ? `${colorPreset.flow}15`
                            : "transparent",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        setSelectedLink(
                          selectedLink === link.id ? null : link.id,
                        )
                      }
                    >
                      <td style={tdStyle}>
                        <span
                          style={{ color: colorPreset.flow, fontWeight: 600 }}
                        >
                          {nodeMap[link.source]?.label?.replace(/\n/g, " ")}
                        </span>
                        {" → "}
                        <span
                          style={{ color: colorPreset.flow, fontWeight: 600 }}
                        >
                          {nodeMap[link.target]?.label?.replace(/\n/g, " ")}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) =>
                            handleLinkChange(link.id, "label", e.target.value)
                          }
                          onClick={(e) => e.stopPropagation()}
                          style={{ ...cellInputStyle, width: "80px" }}
                          placeholder="e.g. Yes"
                        />
                      </td>
                      <td style={tdStyle}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveLink(link.id);
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
          Steps:{" "}
          <strong style={{ color: theme.colors.text.heading }}>
            {nodes.length}
          </strong>
        </span>
        <span style={{ color: theme.colors.text.muted }}>
          Flows:{" "}
          <strong style={{ color: theme.colors.text.heading }}>
            {links.length}
          </strong>
        </span>
        <span style={{ color: theme.colors.text.muted }}>
          🖱️ <strong style={{ color: colorPreset.flow }}>Drag nodes</strong> to
          reposition
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
            📊 {nodeMap[selectedNode]?.label?.replace(/\n/g, " ")}
          </span>
        )}
      </div>
    </div>
  );
};

export default FlowchartComponent;
