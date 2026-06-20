import React, { useState, useCallback, useMemo } from "react";
import { theme } from "../../../styles/theme";

const DEFAULT_COLUMNS = [
  { key: "name", label: "Product", type: "text", sortable: true },
  {
    key: "sales",
    label: "Sales ($)",
    type: "number",
    sortable: true,
    showBar: true,
  },
  {
    key: "profit",
    label: "Profit ($)",
    type: "number",
    sortable: true,
    showBar: true,
  },
  {
    key: "margin",
    label: "Margin (%)",
    type: "number",
    sortable: true,
    conditionalFormat: true,
  },
  {
    key: "growth",
    label: "Growth (%)",
    type: "number",
    sortable: true,
    conditionalFormat: true,
  },
  { key: "status", label: "Status", type: "text", sortable: true },
  { key: "trend", label: "Trend", type: "text", sortable: false },
];

const DEFAULT_DATA = [
  {
    name: "Product A",
    sales: 500,
    profit: 150,
    margin: 30,
    growth: 12,
    status: "Active",
    trend: "📈 Up",
  },
  {
    name: "Product B",
    sales: 350,
    profit: 80,
    margin: 23,
    growth: -5,
    status: "Active",
    trend: "📉 Down",
  },
  {
    name: "Product C",
    sales: 750,
    profit: 300,
    margin: 40,
    growth: 25,
    status: "Best Seller",
    trend: "📈 Up",
  },
  {
    name: "Product D",
    sales: 200,
    profit: 20,
    margin: 10,
    growth: -15,
    status: "At Risk",
    trend: "📉 Down",
  },
  {
    name: "Product E",
    sales: 600,
    profit: 200,
    margin: 33,
    growth: 8,
    status: "Active",
    trend: "📈 Up",
  },
  {
    name: "Product F",
    sales: 150,
    profit: 30,
    margin: 20,
    growth: 3,
    status: "New",
    trend: "📈 Up",
  },
  {
    name: "Product G",
    sales: 900,
    profit: 400,
    margin: 44,
    growth: 30,
    status: "Best Seller",
    trend: "📈 Up",
  },
  {
    name: "Product H",
    sales: 100,
    profit: -10,
    margin: -10,
    growth: -25,
    status: "Critical",
    trend: "📉 Down",
  },
  {
    name: "Product I",
    sales: 450,
    profit: 120,
    margin: 27,
    growth: 10,
    status: "Active",
    trend: "📈 Up",
  },
  {
    name: "Product J",
    sales: 300,
    profit: 60,
    margin: 20,
    growth: -2,
    status: "Watch",
    trend: "📉 Down",
  },
  {
    name: "Product K",
    sales: 550,
    profit: 180,
    margin: 33,
    growth: 15,
    status: "Active",
    trend: "📈 Up",
  },
  {
    name: "Product L",
    sales: 250,
    profit: 45,
    margin: 18,
    growth: 0,
    status: "Stable",
    trend: "→ Flat",
  },
];

const CONDITIONAL_PRESETS = [
  {
    name: "Green-Red",
    positive: "#3fb950",
    negative: "#f85149",
    neutral: "#8b949e",
  },
  {
    name: "Blue-Orange",
    positive: "#58a6ff",
    negative: "#d29922",
    neutral: "#8b949e",
  },
  {
    name: "Purple-Yellow",
    positive: "#a371f7",
    negative: "#e3b341",
    neutral: "#8b949e",
  },
];

const HIGHLIGHT_RULES = [
  { name: "None", value: "none" },
  { name: "Alternating", value: "alternating" },
  { name: "By Status", value: "status" },
];

const TableChartComponent = ({
  initialData = DEFAULT_DATA,
  chartColor = "#58a6ff",
}) => {
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [data, setData] = useState(initialData);
  const [titleText, setTitleText] = useState("Table Chart");
  const [sortKey, setSortKey] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [conditionalColors, setConditionalColors] = useState(
    CONDITIONAL_PRESETS[0],
  );
  const [conditionalPreset, setConditionalPreset] = useState("Green-Red");
  const [showBars, setShowBars] = useState(true);
  const [barColor, setBarColor] = useState("#58a6ff");
  const [highlightRule, setHighlightRule] = useState("alternating");
  const [showRowNumbers, setShowRowNumbers] = useState(true);
  const [stickyHeader, setStickyHeader] = useState(true);
  const [fontSize, setFontSize] = useState(12);
  const [rowPadding, setRowPadding] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [editableCells, setEditableCells] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [data, searchTerm]);
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (typeof valA === "number" && typeof valB === "number")
        return sortDirection === "asc" ? valA - valB : valB - valA;
      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      return sortDirection === "asc"
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    });
    return sorted;
  }, [filteredData, sortKey, sortDirection]);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const columnStats = useMemo(() => {
    const stats = {};
    columns.forEach((col) => {
      if (col.type === "number" && col.showBar) {
        const values = data
          .map((row) => row[col.key])
          .filter((v) => typeof v === "number");
        stats[col.key] = { min: Math.min(...values), max: Math.max(...values) };
      }
    });
    return stats;
  }, [columns, data]);

  const handleSort = (key) => {
    if (sortKey === key)
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };
  const handleCellEdit = useCallback(
    (rowIndex, colKey, newValue) => {
      setData((prev) => {
        const updated = [...prev];
        const actualIndex = sortedData.indexOf(paginatedData[rowIndex]);
        if (actualIndex !== -1) {
          const col = columns.find((c) => c.key === colKey);
          updated[actualIndex] = {
            ...updated[actualIndex],
            [colKey]: col?.type === "number" ? Number(newValue) || 0 : newValue,
          };
        }
        return updated;
      });
    },
    [sortedData, paginatedData, columns],
  );
  const addRow = useCallback(() => {
    const newRow = {};
    columns.forEach((col) => {
      newRow[col.key] = col.type === "number" ? 0 : "";
    });
    setData((prev) => [...prev, newRow]);
  }, [columns]);
  const removeRow = useCallback(
    (rowIndex) => {
      const actualIndex = sortedData.indexOf(paginatedData[rowIndex]);
      if (actualIndex !== -1)
        setData((prev) => prev.filter((_, i) => i !== actualIndex));
    },
    [sortedData, paginatedData],
  );
  const handlePresetChange = (presetName) => {
    const preset = CONDITIONAL_PRESETS.find((p) => p.name === presetName);
    if (preset) {
      setConditionalPreset(presetName);
      setConditionalColors(preset);
    }
  };
  const getConditionalColor = (value) => {
    if (typeof value !== "number") return "#c9d1d9";
    if (value > 0) return conditionalColors.positive;
    if (value < 0) return conditionalColors.negative;
    return conditionalColors.neutral;
  };
  const getRowBackground = (row, index) => {
    switch (highlightRule) {
      case "alternating":
        return index % 2 === 0 ? "transparent" : "#161b22";
      case "status":
        const status = String(row.status || "").toLowerCase();
        if (status.includes("critical")) return "#f8514910";
        if (status.includes("risk")) return "#d2992210";
        if (status.includes("best")) return "#3fb95010";
        if (status.includes("new")) return "#58a6ff10";
        return "transparent";
      default:
        return "transparent";
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
    width: "220px",
  };
  const tableContainerStyle = {
    background: "#ffffff",
    borderRadius: "6px",
    border: `1px solid ${theme.colors.border.light}`,
    overflow: "auto",
    maxHeight: "600px",
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
  const cellInputStyle = (width = "80px") => ({
    padding: `${compactMode ? "4px" : "6px"} 8px`,
    background: "transparent",
    border: editableCells ? "1px solid transparent" : "none",
    borderRadius: "3px",
    color: "inherit",
    fontSize: `${fontSize}px`,
    fontFamily: theme.typography.fontFamily.primary,
    width: width,
    outline: "none",
    boxSizing: "border-box",
    cursor: editableCells ? "text" : "default",
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
    padding: "2px 6px",
    background: "transparent",
    border: "1px solid #f85149",
    borderRadius: "2px",
    color: "#f85149",
    cursor: "pointer",
    fontSize: "8px",
  };
  const thStyle = {
    background: "#0d1117",
    color: "#8b949e",
    padding: "8px 10px",
    textAlign: "left",
    fontSize: "9px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1px",
    borderBottom: "2px solid #30363d",
    whiteSpace: "nowrap",
    zIndex: 10,
  };
  const tdStyle = { borderBottom: "1px solid #21262d", whiteSpace: "nowrap" };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>📋</span>
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
            {data.length} ROWS × {columns.length} COLS
          </span>
        </div>
      </div>
      <div style={{ position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#8b949e",
            fontSize: "14px",
          }}
        >
          ⌕
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="SEARCH TABLE..."
          style={{
            width: "100%",
            padding: "10px 16px 10px 36px",
            background: theme.colors.cardBg,
            border: `1px solid ${theme.colors.border.default}`,
            borderRadius: "4px",
            color: theme.colors.text.body,
            fontSize: "12px",
            fontFamily: theme.typography.fontFamily.primary,
            letterSpacing: "1px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>
      <div style={tableContainerStyle}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: `${fontSize}px`,
            fontFamily: theme.typography.fontFamily.primary,
          }}
        >
          <thead>
            <tr>
              {showRowNumbers && (
                <th
                  style={{
                    ...thStyle,
                    position: stickyHeader ? "sticky" : "static",
                    top: 0,
                    width: "35px",
                    textAlign: "center",
                  }}
                >
                  #
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  style={{
                    ...thStyle,
                    position: stickyHeader ? "sticky" : "static",
                    top: 0,
                    cursor: col.sortable ? "pointer" : "default",
                    color: sortKey === col.key ? chartColor : "#8b949e",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      <span style={{ fontSize: "10px" }}>
                        {sortDirection === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th
                style={{
                  ...thStyle,
                  position: stickyHeader ? "sticky" : "static",
                  top: 0,
                  width: "40px",
                  textAlign: "center",
                }}
              >
                ✕
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                style={{
                  background: getRowBackground(row, rowIndex),
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#1c2128";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = getRowBackground(
                    row,
                    rowIndex,
                  );
                }}
              >
                {showRowNumbers && (
                  <td
                    style={{
                      ...tdStyle,
                      padding: `${rowPadding}px 8px`,
                      color: "#484f58",
                      fontSize: "9px",
                      textAlign: "center",
                    }}
                  >
                    {(currentPage - 1) * rowsPerPage + rowIndex + 1}
                  </td>
                )}
                {columns.map((col) => {
                  const value = row[col.key];
                  const isNumber = typeof value === "number";
                  const stats = columnStats[col.key];
                  const barWidth = stats
                    ? ((value - stats.min) / (stats.max - stats.min || 1)) * 100
                    : 0;
                  const condColor = col.conditionalFormat
                    ? getConditionalColor(value)
                    : null;
                  return (
                    <td
                      key={col.key}
                      style={{
                        ...tdStyle,
                        padding: `${rowPadding}px 8px`,
                        color: condColor || (isNumber ? "#f0f6fc" : "#c9d1d9"),
                        fontWeight: isNumber ? 600 : 400,
                        position: "relative",
                      }}
                    >
                      {col.showBar && showBars && isNumber && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            height: "3px",
                            width: `${barWidth}%`,
                            background: condColor || barColor,
                            borderRadius: "0 2px 0 0",
                            opacity: 0.5,
                            transition: "width 0.3s ease",
                          }}
                        />
                      )}
                      {editableCells ? (
                        <input
                          type={col.type === "number" ? "number" : "text"}
                          value={value}
                          onChange={(e) =>
                            handleCellEdit(rowIndex, col.key, e.target.value)
                          }
                          style={{
                            ...cellInputStyle(
                              col.key === "name"
                                ? "120px"
                                : col.key === "status"
                                  ? "90px"
                                  : col.key === "trend"
                                    ? "80px"
                                    : "70px",
                            ),
                            color:
                              condColor || (isNumber ? "#f0f6fc" : "#c9d1d9"),
                            fontWeight: isNumber ? 600 : 400,
                          }}
                          onFocus={(e) => {
                            e.target.style.border = `1px solid ${chartColor}50`;
                            e.target.style.background = "#0d1117";
                          }}
                          onBlur={(e) => {
                            e.target.style.border = "1px solid transparent";
                            e.target.style.background = "transparent";
                          }}
                        />
                      ) : (
                        <span>
                          {value}
                          {isNumber && col.key === "margin" ? "%" : ""}
                          {isNumber && col.key === "growth" ? "%" : ""}
                        </span>
                      )}
                    </td>
                  );
                })}
                <td
                  style={{
                    ...tdStyle,
                    padding: `${rowPadding}px 8px`,
                    textAlign: "center",
                  }}
                >
                  <button
                    onClick={() => removeRow(rowIndex)}
                    style={deleteBtnStyle}
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            fontSize: "11px",
          }}
        >
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{
              ...buttonStyle("#8b949e"),
              opacity: currentPage === 1 ? 0.4 : 1,
              cursor: currentPage === 1 ? "default" : "pointer",
            }}
          >
            ← Prev
          </button>
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={i}
                onClick={() => setCurrentPage(pageNum)}
                style={{
                  padding: "6px 12px",
                  background:
                    currentPage === pageNum ? chartColor + "20" : "transparent",
                  border:
                    currentPage === pageNum
                      ? `1px solid ${chartColor}`
                      : "1px solid #30363d",
                  borderRadius: "3px",
                  color: currentPage === pageNum ? chartColor : "#8b949e",
                  cursor: "pointer",
                  fontSize: "10px",
                  fontFamily: theme.typography.fontFamily.primary,
                  fontWeight: currentPage === pageNum ? 700 : 400,
                }}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{
              ...buttonStyle("#8b949e"),
              opacity: currentPage === totalPages ? 0.4 : 1,
              cursor: currentPage === totalPages ? "default" : "pointer",
            }}
          >
            Next →
          </button>
          <span style={{ color: "#8b949e", marginLeft: "12px" }}>
            {sortedData.length} rows | Page {currentPage} of {totalPages}
          </span>
        </div>
      )}
      <div style={controlsGridStyle}>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Conditional Colors</label>
          <select
            value={conditionalPreset}
            onChange={(e) => handlePresetChange(e.target.value)}
            style={selectStyle}
          >
            {CONDITIONAL_PRESETS.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📊 Highlight Rule</label>
          <select
            value={highlightRule}
            onChange={(e) => setHighlightRule(e.target.value)}
            style={selectStyle}
          >
            {HIGHLIGHT_RULES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Font Size: {fontSize}px</label>
          <input
            type="range"
            min="10"
            max="18"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📏 Row Padding: {rowPadding}px</label>
          <input
            type="range"
            min="4"
            max="16"
            value={rowPadding}
            onChange={(e) => setRowPadding(Number(e.target.value))}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📊 Rows Per Page: {rowsPerPage}</label>
          <input
            type="range"
            min="5"
            max="25"
            step="5"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            style={{ width: "100%", accentColor: chartColor }}
          />
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🎨 Bar Color</label>
          <input
            type="color"
            value={barColor}
            onChange={(e) => setBarColor(e.target.value)}
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
          <label style={labelStyle}>📊 Show Bars</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showBars}
              onChange={(e) => setShowBars(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              In-cell bars
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>🔢 Row Numbers</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={showRowNumbers}
              onChange={(e) => setShowRowNumbers(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Show #
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📌 Sticky Header</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={stickyHeader}
              onChange={(e) => setStickyHeader(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Fixed header
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>✏️ Editable</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={editableCells}
              onChange={(e) => setEditableCells(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Edit cells
            </span>
          </label>
        </div>
        <div style={controlGroupStyle}>
          <label style={labelStyle}>📦 Compact</label>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={compactMode}
              onChange={(e) => setCompactMode(e.target.checked)}
            />
            <span style={{ fontSize: "11px", color: theme.colors.text.body }}>
              Tight spacing
            </span>
          </label>
        </div>
      </div>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button onClick={addRow} style={buttonStyle()}>
          + Add Row
        </button>
        <button
          onClick={() => setData(DEFAULT_DATA)}
          style={{ ...buttonStyle("#8b949e") }}
        >
          ↺ Reset Data
        </button>
        <button
          onClick={() => setColumns(DEFAULT_COLUMNS)}
          style={{ ...buttonStyle("#8b949e") }}
        >
          ↺ Reset Cols
        </button>
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
          Rows: <strong style={{ color: "#f0f6fc" }}>{data.length}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Columns:{" "}
          <strong style={{ color: "#f0f6fc" }}>{columns.length}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Filtered:{" "}
          <strong style={{ color: chartColor }}>{filteredData.length}</strong>
        </span>
        <span style={{ color: "#8b949e" }}>
          Page:{" "}
          <strong style={{ color: "#f0f6fc" }}>
            {currentPage}/{totalPages}
          </strong>
        </span>
      </div>
    </div>
  );
};

export default TableChartComponent;

