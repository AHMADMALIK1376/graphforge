import React, { useState, useCallback, useMemo } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ZAxis, Cell, Legend, ReferenceLine, Label,
} from "recharts";
import { theme } from "../../../styles/theme";

// ============================================
// DEFAULT DATA
// ============================================
const DEFAULT_DATA = [
  { label: "Group A", values: [12, 15, 18, 18, 22, 25, 25, 28, 30, 35] },
  { label: "Group B", values: [20, 22, 25, 28, 30, 30, 32, 35, 38, 42] },
  { label: "Group C", values: [8, 10, 12, 15, 15, 18, 20, 22, 25, 30] },
  { label: "Group D", values: [30, 32, 35, 38, 40, 42, 45, 48, 50, 55] },
  { label: "Group E", values: [5, 8, 10, 12, 12, 15, 15, 18, 20, 25] },
];

const DOT_STYLES = [
  { name: "Circle", value: "circle" }, { name: "Square", value: "square" },
  { name: "Diamond", value: "diamond" }, { name: "Triangle", value: "triangle" },
];

const DotPlotComponent = ({ initialData = DEFAULT_DATA, chartColor = "#58a6ff" }) => {
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Dot Plot");
  const [dotColor, setDotColor] = useState("#58a6ff");
  const [colorMode, setColorMode] = useState("uniform");
  const [categoryColors, setCategoryColors] = useState(["#58a6ff", "#f85149", "#3fb950", "#d29922", "#a371f7"]);
  const [dotSize, setDotSize] = useState(8);
  const [dotStyle, setDotStyle] = useState("circle");
  const [jitter, setJitter] = useState(0.3);
  const [showMean, setShowMean] = useState(true);
  const [showMedian, setShowMedian] = useState(true);
  const [showValues, setShowValues] = useState(false);
  const [gridVisible, setGridVisible] = useState(true);
  const [orientation, setOrientation] = useState("vertical");
  const [dotOpacity, setDotOpacity] = useState(0.8);
  const [highlightOutliers, setHighlightOutliers] = useState(false);

  const isHorizontal = orientation === "horizontal";

  const scatterData = useMemo(() => { const result = []; data.forEach((group, groupIndex) => { group.values.forEach((value, valueIndex) => { const jitterAmount = (Math.random() - 0.5) * jitter; result.push({ x: isHorizontal ? value : groupIndex + jitterAmount, y: isHorizontal ? groupIndex + jitterAmount : value, groupIndex, groupLabel: group.label, value, valueIndex }); }); }); return result; }, [data, jitter, isHorizontal]);

  const stats = useMemo(() => { return data.map((group) => { const sorted = [...group.values].sort((a, b) => a - b); const sum = group.values.reduce((s, v) => s + v, 0); const mean = sum / group.values.length; const mid = Math.floor(sorted.length / 2); const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]; const min = sorted[0]; const max = sorted[sorted.length - 1]; const q1 = sorted[Math.floor(sorted.length / 4)]; const q3 = sorted[Math.floor((3 * sorted.length) / 4)]; const iqr = q3 - q1; const lowerFence = q1 - 1.5 * iqr; const upperFence = q3 + 1.5 * iqr; const outliers = group.values.filter((v) => v < lowerFence || v > upperFence); return { mean, median, min, max, q1, q3, iqr, outliers, count: group.values.length, sum }; }); }, [data]);

  const handleValuesChange = useCallback((groupIndex, valueIndex, newValue) => { setData((prev) => { const updated = [...prev]; const newValues = [...updated[groupIndex].values]; newValues[valueIndex] = Number(newValue) || 0; updated[groupIndex] = { ...updated[groupIndex], values: newValues }; return updated; }); }, []);
  const handleLabelChange = useCallback((groupIndex, newLabel) => { setData((prev) => { const updated = [...prev]; updated[groupIndex] = { ...updated[groupIndex], label: newLabel }; return updated; }); }, []);
  const addValue = useCallback((groupIndex) => { setData((prev) => { const updated = [...prev]; const existingValues = updated[groupIndex].values; const avg = existingValues.reduce((s, v) => s + v, 0) / existingValues.length; updated[groupIndex] = { ...updated[groupIndex], values: [...existingValues, Math.round(avg) + Math.floor(Math.random() * 10) - 5] }; return updated; }); }, []);
  const removeValue = useCallback((groupIndex, valueIndex) => { setData((prev) => { const updated = [...prev]; const newValues = updated[groupIndex].values.filter((_, i) => i !== valueIndex); updated[groupIndex] = { ...updated[groupIndex], values: newValues }; return updated; }); }, []);
  const addGroup = useCallback(() => { const newValues = Array.from({ length: 8 }, () => Math.floor(Math.random() * 60) + 10); setData((prev) => [...prev, { label: `Group ${String.fromCharCode(65 + prev.length)}`, values: newValues }]); }, []);
  const removeGroup = useCallback((groupIndex) => { setData((prev) => prev.filter((_, i) => i !== groupIndex)); }, []);

  const CustomDot = (props) => {
    const { cx, cy, payload, index } = props;
    const size = dotSize;
    const groupColor = categoryColors[payload.groupIndex % categoryColors.length];
    const color = colorMode === "category" ? groupColor : colorMode === "gradient" ? dotColor + `${Math.floor(100 - payload.groupIndex * 15)}` : dotColor;
    const isOutlier = highlightOutliers && stats[payload.groupIndex]?.outliers.includes(payload.value);
    const finalColor = isOutlier ? "#f85149" : color;
    const finalSize = isOutlier ? size + 3 : size;
    // Use pointIndex for unique identification in title
    const pointIndex = index;
    const uniqueId = `dot-${pointIndex}`;

    const shapeProps = { fill: finalColor, fillOpacity: dotOpacity, stroke: finalColor, strokeWidth: 1, style: { cursor: "pointer", transition: "all 0.2s ease", filter: isOutlier ? "drop-shadow(0 0 4px #f85149)" : "none" } };

    switch (dotStyle) {
      case "square": return <rect x={cx - finalSize / 2} y={cy - finalSize / 2} width={finalSize} height={finalSize} rx={1} {...shapeProps}><title>{uniqueId}</title></rect>;
      case "diamond": return <polygon points={`${cx},${cy - finalSize} ${cx + finalSize},${cy} ${cx},${cy + finalSize} ${cx - finalSize},${cy}`} {...shapeProps}><title>{uniqueId}</title></polygon>;
      case "triangle": return <polygon points={`${cx},${cy - finalSize} ${cx + finalSize},${cy + finalSize} ${cx - finalSize},${cy + finalSize}`} {...shapeProps}><title>{uniqueId}</title></polygon>;
      default: return (<g><circle cx={cx} cy={cy} r={finalSize} {...shapeProps} /><title>{uniqueId}</title>{dotSize > 6 && <circle cx={cx - finalSize * 0.2} cy={cy - finalSize * 0.2} r={finalSize * 0.25} fill="rgba(255,255,255,0.3)" />}</g>);
    }
  };

  const CustomXShape = (props) => { const { x, y, payload } = props; return <text x={x} y={y + 15} textAnchor="middle" fill={theme.colors.text.muted} fontSize={10} fontFamily={theme.typography.fontFamily.primary}>{payload.value}</text>; };

  const CustomTooltip = ({ active, payload }) => { if (active && payload && payload.length) { const dataPoint = payload[0]?.payload; if (!dataPoint) return null; const groupStats = stats[dataPoint.groupIndex]; const groupColor = categoryColors[dataPoint.groupIndex % categoryColors.length]; const isOutlier = highlightOutliers && groupStats?.outliers.includes(dataPoint.value); return (<div style={tooltipContainerStyle}><div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}><span style={{ ...tooltipColorDot, background: groupColor }} /><span style={tooltipLabelStyle}>{dataPoint.groupLabel}</span></div><div style={tooltipValueRow}><span style={tooltipValueLabel}>Value:</span><span style={{ ...tooltipValue, color: isOutlier ? "#f85149" : groupColor }}>{dataPoint.value}{isOutlier && " ⚠"}</span></div><div style={tooltipDivider} /><div style={tooltipValueRow}><span style={tooltipValueLabel}>Mean:</span><span style={tooltipStatValue}>{groupStats?.mean?.toFixed(1)}</span></div><div style={tooltipValueRow}><span style={tooltipValueLabel}>Median:</span><span style={tooltipStatValue}>{groupStats?.median?.toFixed(1)}</span></div><div style={tooltipValueRow}><span style={tooltipValueLabel}>Min:</span><span style={tooltipStatValue}>{groupStats?.min}</span></div><div style={tooltipValueRow}><span style={tooltipValueLabel}>Max:</span><span style={tooltipStatValue}>{groupStats?.max}</span></div><div style={tooltipValueRow}><span style={tooltipValueLabel}>Count:</span><span style={tooltipStatValue}>{groupStats?.count}</span></div><div style={tooltipValueRow}><span style={tooltipValueLabel}>IQR:</span><span style={tooltipStatValue}>{groupStats?.iqr?.toFixed(1)}</span></div>{isOutlier && <div style={{ marginTop: "8px", padding: "4px 8px", background: "#f8514920", border: "1px solid #f85149", borderRadius: "2px", color: "#f85149", fontSize: "9px", fontWeight: 700, textAlign: "center", letterSpacing: "1px" }}>⚠ OUTLIER DETECTED</div>}</div>); } return null; };

  // ===== STYLES =====
  const containerStyle = { display: "flex", flexDirection: "column", gap: "20px", fontFamily: theme.typography.fontFamily.primary, background: theme.colors.mainBg, color: theme.colors.text.body, padding: "20px", borderRadius: theme.borderRadius.md, border: `1px solid ${theme.colors.border.default}` };
  const headerStyle = { display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" };
  const titleInputStyle = { background: "transparent", border: "none", borderBottom: `2px solid ${dotColor}`, color: theme.colors.text.heading, fontSize: "20px", fontWeight: 700, fontFamily: theme.typography.fontFamily.primary, letterSpacing: "2px", outline: "none", padding: "4px 0", width: "250px" };
  const chartContainerStyle = { background: "#ffffff", borderRadius: "6px", padding: "24px 16px 16px", border: `1px solid ${theme.colors.border.light}`, minHeight: "480px" };
  const controlsGridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px", background: theme.colors.cardBg, padding: "16px", borderRadius: "4px", border: `1px solid ${theme.colors.border.default}` };
  const controlGroupStyle = { display: "flex", flexDirection: "column", gap: "6px" };
  const labelStyle = { color: theme.colors.text.muted, fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px" };
  const selectStyle = { padding: "8px 12px", background: theme.colors.inputBg, border: `1px solid ${theme.colors.border.default}`, borderRadius: "3px", color: theme.colors.text.body, fontSize: "12px", fontFamily: theme.typography.fontFamily.primary, outline: "none", cursor: "pointer" };
  const checkboxStyle = { display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" };
  const statsCardStyle = { background: theme.colors.cardBg, padding: "12px 16px", borderRadius: "4px", border: `1px solid ${theme.colors.border.default}` };
  const groupCardStyle = (index) => ({ background: theme.colors.cardBg, borderRadius: "4px", border: `1px solid ${theme.colors.border.default}`, borderLeft: `3px solid ${categoryColors[index % categoryColors.length]}`, padding: "12px", marginBottom: "12px" });
  const cellInputStyle = { padding: "5px 6px", background: theme.colors.inputBg, border: `1px solid ${theme.colors.border.default}`, borderRadius: "2px", color: theme.colors.text.body, fontSize: "10px", fontFamily: theme.typography.fontFamily.primary, width: "55px", outline: "none", boxSizing: "border-box" };
  const buttonStyle = (color = dotColor) => ({ padding: "6px 12px", background: "transparent", border: `1px solid ${color}`, borderRadius: "3px", color: color, cursor: "pointer", fontSize: "10px", fontFamily: theme.typography.fontFamily.primary, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" });
  const deleteButtonStyle = { padding: "3px 6px", background: "transparent", border: `1px solid ${theme.colors.status.error}`, borderRadius: "2px", color: theme.colors.status.error, cursor: "pointer", fontSize: "9px" };
  const tooltipContainerStyle = { background: theme.colors.cardBg, border: `1px solid ${theme.colors.border.default}`, borderRadius: "4px", padding: "12px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.5)", minWidth: "170px" };
  const tooltipColorDot = { width: "10px", height: "10px", borderRadius: "50%", display: "inline-block" };
  const tooltipLabelStyle = { color: theme.colors.text.heading, fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" };
  const tooltipValueRow = { display: "flex", justifyContent: "space-between", marginBottom: "3px" };
  const tooltipValueLabel = { color: theme.colors.text.muted, fontSize: "10px" };
  const tooltipValue = { fontSize: "16px", fontWeight: 700 };
  const tooltipStatValue = { color: theme.colors.text.heading, fontSize: "11px", fontWeight: 600 };
  const tooltipDivider = { borderTop: `1px solid ${theme.colors.border.light}`, margin: "8px 0" };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}><div style={{ display: "flex", alignItems: "center", gap: "12px" }}><span style={{ fontSize: "28px" }}>⚫</span><input type="text" value={titleText} onChange={(e) => setTitleText(e.target.value)} style={titleInputStyle} /></div><div style={{ display: "flex", gap: "8px" }}><span style={{ color: dotColor, fontSize: "10px", padding: "4px 10px", border: `1px solid ${dotColor}50`, borderRadius: "3px", fontWeight: 600, letterSpacing: "1px" }}>COMPARISON</span><span style={{ color: theme.colors.text.muted, fontSize: "10px", padding: "4px 10px", border: `1px solid ${theme.colors.border.default}`, borderRadius: "3px", letterSpacing: "1px" }}>{data.length} GROUPS</span></div></div>
      <div id="chart-visual-area" style={chartContainerStyle}>
        <ResponsiveContainer width="100%" height={440}>
          <ScatterChart margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
            {gridVisible && <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border.light} />}
            {isHorizontal ? (<><XAxis type="number" dataKey="x" tick={<CustomXShape />} axisLine={{ stroke: theme.colors.border.default }} name="Value"><Label value="Value" offset={-5} position="insideBottom" fill={theme.colors.text.muted} fontSize={10} /></XAxis><YAxis type="number" dataKey="y" tick={{ fill: theme.colors.text.muted, fontSize: 10 }} axisLine={{ stroke: theme.colors.border.default }} domain={[data.length - 0.5, -0.5]} ticks={data.map((_, i) => i)} tickFormatter={(i) => data[i]?.label || ""} name="Group" /></>) : (<><XAxis type="number" dataKey="x" tick={<CustomXShape />} axisLine={{ stroke: theme.colors.border.default }} domain={[-0.5, data.length - 0.5]} ticks={data.map((_, i) => i)} tickFormatter={(i) => data[i]?.label || ""} name="Group"><Label value="Group" offset={-5} position="insideBottom" fill={theme.colors.text.muted} fontSize={10} /></XAxis><YAxis type="number" dataKey="y" tick={{ fill: theme.colors.text.muted, fontSize: 10 }} axisLine={{ stroke: theme.colors.border.default }} name="Value" /></>)}
            <ZAxis range={[dotSize * 5, dotSize * 5]} />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3" }} />
            {showMean && stats.map((stat, i) => (<ReferenceLine key={`mean-${i}`} y={isHorizontal ? i : stat.mean} x={isHorizontal ? stat.mean : i} stroke={categoryColors[i % categoryColors.length]} strokeWidth={1.5} strokeDasharray="8 4" opacity={0.6} />))}
            {showMedian && stats.map((stat, i) => (<ReferenceLine key={`median-${i}`} y={isHorizontal ? i : stat.median} x={isHorizontal ? stat.median : i} stroke={categoryColors[i % categoryColors.length]} strokeWidth={1.5} strokeDasharray="4 2" opacity={0.4} />))}
            <Scatter data={scatterData} shape={<CustomDot />} isAnimationActive={true} animationDuration={600}>
              {scatterData.map((entry, idx) => (<Cell key={`cell-${idx}`} fill={categoryColors[entry.groupIndex % categoryColors.length]} />))}
            </Scatter>
            <Legend payload={data.map((group, i) => ({ value: group.label, type: "circle", color: categoryColors[i % categoryColors.length] }))} wrapperStyle={{ fontSize: "10px", fontFamily: theme.typography.fontFamily.primary, color: "#8b949e" }} />
          </ScatterChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "12px", flexWrap: "wrap" }}>{showMean && <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10px", color: theme.colors.text.muted }}><span style={{ width: "20px", height: "2px", borderTop: "1.5px dashed #58a6ff" }} />Mean</div>}{showMedian && <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10px", color: theme.colors.text.muted }}><span style={{ width: "20px", height: "2px", borderTop: "1.5px dotted #58a6ff" }} />Median</div>}</div>
      </div>
      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}><label style={labelStyle}>🎨 Dot Color</label><input type="color" value={dotColor} onChange={(e) => { setDotColor(e.target.value); setColorMode("uniform"); }} style={{ width: "40px", height: "32px", cursor: "pointer", border: `1px solid ${theme.colors.border.default}`, borderRadius: "3px", padding: "2px" }} /></div>
        <div style={controlGroupStyle}><label style={labelStyle}>🎨 Color Mode</label><select value={colorMode} onChange={(e) => setColorMode(e.target.value)} style={selectStyle}><option value="uniform">Uniform</option><option value="category">By Category</option></select></div>
        <div style={controlGroupStyle}><label style={labelStyle}>🔷 Dot Shape</label><select value={dotStyle} onChange={(e) => setDotStyle(e.target.value)} style={selectStyle}>{DOT_STYLES.map((s) => (<option key={s.value} value={s.value}>{s.name}</option>))}</select></div>
        <div style={controlGroupStyle}><label style={labelStyle}>📏 Dot Size: {dotSize}px</label><input type="range" min="3" max="18" value={dotSize} onChange={(e) => setDotSize(Number(e.target.value))} style={{ width: "100%", accentColor: dotColor }} /></div>
        <div style={controlGroupStyle}><label style={labelStyle}>〰️ Jitter: {jitter.toFixed(1)}</label><input type="range" min="0" max="0.8" step="0.05" value={jitter} onChange={(e) => setJitter(Number(e.target.value))} style={{ width: "100%", accentColor: dotColor }} /></div>
        <div style={controlGroupStyle}><label style={labelStyle}>👁️ Opacity: {dotOpacity}</label><input type="range" min="0.2" max="1" step="0.05" value={dotOpacity} onChange={(e) => setDotOpacity(Number(e.target.value))} style={{ width: "100%", accentColor: dotColor }} /></div>
        <div style={controlGroupStyle}><label style={labelStyle}>📐 Orientation</label><select value={orientation} onChange={(e) => setOrientation(e.target.value)} style={selectStyle}><option value="vertical">Vertical Dots</option><option value="horizontal">Horizontal Dots</option></select></div>
        <div style={controlGroupStyle}><label style={labelStyle}>🔢 Show Values</label><label style={checkboxStyle}><input type="checkbox" checked={showValues} onChange={(e) => setShowValues(e.target.checked)} /><span style={{ fontSize: "11px", color: theme.colors.text.body }}>Value labels</span></label></div>
        <div style={controlGroupStyle}><label style={labelStyle}>📊 Mean Line</label><label style={checkboxStyle}><input type="checkbox" checked={showMean} onChange={(e) => setShowMean(e.target.checked)} /><span style={{ fontSize: "11px", color: theme.colors.text.body }}>Show (dashed)</span></label></div>
        <div style={controlGroupStyle}><label style={labelStyle}>📊 Median Line</label><label style={checkboxStyle}><input type="checkbox" checked={showMedian} onChange={(e) => setShowMedian(e.target.checked)} /><span style={{ fontSize: "11px", color: theme.colors.text.body }}>Show (dotted)</span></label></div>
        <div style={controlGroupStyle}><label style={labelStyle}>⚠ Highlight Outliers</label><label style={checkboxStyle}><input type="checkbox" checked={highlightOutliers} onChange={(e) => setHighlightOutliers(e.target.checked)} /><span style={{ fontSize: "11px", color: theme.colors.text.body }}>Mark outliers</span></label></div>
        <div style={controlGroupStyle}><label style={labelStyle}>🔲 Grid</label><label style={checkboxStyle}><input type="checkbox" checked={gridVisible} onChange={(e) => setGridVisible(e.target.checked)} /><span style={{ fontSize: "11px", color: theme.colors.text.body }}>Show grid</span></label></div>
      </div>
      {colorMode === "category" && <div style={statsCardStyle}><label style={labelStyle}>🎨 Category Colors</label><div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>{data.map((group, i) => (<input key={i} type="color" value={categoryColors[i] || "#58a6ff"} onChange={(e) => { const updated = [...categoryColors]; updated[i] = e.target.value; setCategoryColors(updated); }} title={group.label} style={{ width: "26px", height: "26px", cursor: "pointer", border: "none", borderRadius: "2px" }} />))}</div></div>}
      <div style={statsCardStyle}><label style={labelStyle}>📊 Group Statistics Summary</label><div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(data.length, 5)}, 1fr)`, gap: "10px", marginTop: "10px", fontSize: "10px" }}>{stats.map((stat, i) => (<div key={i} style={{ padding: "8px", background: theme.colors.inputBg, borderRadius: "3px", borderLeft: `3px solid ${categoryColors[i]}` }}><div style={{ color: categoryColors[i], fontWeight: 700, marginBottom: "4px", fontSize: "11px" }}>{data[i].label}</div><div style={{ color: theme.colors.text.muted }}>n: <strong style={{ color: theme.colors.text.body }}>{stat.count}</strong></div><div style={{ color: theme.colors.text.muted }}>Mean: <strong style={{ color: theme.colors.text.body }}>{stat.mean.toFixed(1)}</strong></div><div style={{ color: theme.colors.text.muted }}>Median: <strong style={{ color: theme.colors.text.body }}>{stat.median.toFixed(1)}</strong></div><div style={{ color: theme.colors.text.muted }}>IQR: <strong style={{ color: theme.colors.text.body }}>{stat.iqr.toFixed(1)}</strong></div><div style={{ color: theme.colors.text.muted }}>Range: <strong style={{ color: theme.colors.text.body }}>{stat.min}-{stat.max}</strong></div></div>))}</div></div>
      <div><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}><label style={labelStyle}>📋 Data Groups</label><button onClick={addGroup} style={buttonStyle()}>+ Add Group</button></div>
        {data.map((group, groupIndex) => (<div key={groupIndex} style={groupCardStyle(groupIndex)}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}><div style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ color: categoryColors[groupIndex % categoryColors.length], fontSize: "12px", fontWeight: 700 }}>●</span><input type="text" value={group.label} onChange={(e) => handleLabelChange(groupIndex, e.target.value)} style={{ ...cellInputStyle, width: "120px", fontWeight: 700, color: categoryColors[groupIndex % categoryColors.length] }} /><span style={{ color: theme.colors.text.muted, fontSize: "9px" }}>({group.values.length} values)</span></div><div style={{ display: "flex", gap: "6px" }}><button onClick={() => addValue(groupIndex)} style={buttonStyle(categoryColors[groupIndex % categoryColors.length])}>+ Value</button><button onClick={() => removeGroup(groupIndex)} style={deleteButtonStyle} disabled={data.length <= 1}>✕ Group</button></div></div><div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>{group.values.map((value, valueIndex) => (<div key={valueIndex} style={{ display: "flex", alignItems: "center", gap: "2px" }}><input type="number" value={value} onChange={(e) => handleValuesChange(groupIndex, valueIndex, e.target.value)} style={{ ...cellInputStyle, width: "48px" }} /><button onClick={() => removeValue(groupIndex, valueIndex)} style={{ ...deleteButtonStyle, fontSize: "8px", padding: "1px 4px" }} disabled={group.values.length <= 2}>×</button></div>))}</div></div>))}
      </div>
    </div>
  );
};

export default DotPlotComponent;
