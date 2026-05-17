import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
} from "recharts";

const CHART_CATEGORIES = {
  statistical: {
    label: "Statistical",
    types: ["bar", "pie", "radar"],
  },
  business: {
    label: "Business",
    types: ["bar", "line", "area", "pie"],
  },
  scientific: {
    label: "Scientific",
    types: ["radar", "polar", "heatmap"],
  },
  financial: {
    label: "Financial",
    types: ["candlestick", "ohlc", "volume"],
  },
};

const COLORS = [
  "#00d4ff",
  "#a78bfa",
  "#ffd700",
  "#ff6b6b",
  "#4ecdc4",
  "#45b7d1",
];

// Export utilities
const exportUtils = {
  toPNG: async (elementId) => {
    try {
      const htmlToImage = await import("html-to-image");
      const element = document.getElementById(elementId);
      if (!element) {
        alert("Chart element not found!");
        return;
      }
      const dataUrl = await htmlToImage.toPng(element, { quality: 0.95 });
      const link = document.createElement("a");
      link.download = "chart.png";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("PNG export failed:", error);
      alert("PNG export failed. Make sure html-to-image is installed.");
    }
  },

  toCSV: (data) => {
    if (!data || data.length === 0) {
      alert("No data to export!");
      return;
    }
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) => Object.values(row).join(",")).join("\n");
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.download = "chart_data.csv";
    link.href = URL.createObjectURL(blob);
    link.click();
  },

  toJSON: (data) => {
    if (!data) {
      alert("No data to export!");
      return;
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.download = "chart_data.json";
    link.href = URL.createObjectURL(blob);
    link.click();
  },

  toExcel: async (data) => {
    try {
      const XLSX = await import("xlsx");
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Chart Data");
      XLSX.writeFile(wb, "chart_data.xlsx");
    } catch (error) {
      console.error("Excel export failed:", error);
      alert("Excel export failed. Make sure xlsx is installed.");
    }
  },
};

// Chart Renderer
const ChartRenderer = ({ data, type }) => {
  const renderChart = () => {
    switch (type) {
      case "bar":
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#00d4ff" />
          </BarChart>
        );

      case "pie":
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );

      case "radar":
        return (
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="label" />
            <PolarRadiusAxis />
            <Radar
              dataKey="value"
              stroke="#00d4ff"
              fill="#00d4ff"
              fillOpacity={0.3}
            />
            <Legend />
          </RadarChart>
        );

      default:
        return (
          <div style={{ color: "#fff", textAlign: "center", padding: "40px" }}>
            Select a chart type to begin
          </div>
        );
    }
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      {renderChart()}
    </ResponsiveContainer>
  );
};

// Data Editor
const DataEditor = ({ data, onUpdate }) => {
  const [rows, setRows] = useState(data);
  const [importText, setImportText] = useState("");

  const handleCellChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
    onUpdate(newRows);
  };

  const handleImport = () => {
    try {
      const lines = importText.trim().split("\n");
      if (lines.length === 0) {
        alert("Please paste some data first");
        return;
      }
      if (lines[0].startsWith("[")) {
        const imported = JSON.parse(importText);
        setRows(imported);
        onUpdate(imported);
      } else {
        const imported = lines.slice(1).map((line) => {
          const values = line.split(",");
          return {
            label: values[0] || "",
            value: Number(values[1]) || 0,
          };
        });
        setRows(imported);
        onUpdate(imported);
      }
    } catch (error) {
      alert("Invalid import format");
    }
  };

  const styles = {
    headerStyle: {
      color: "#fff",
      padding: "8px",
      textAlign: "left",
      borderBottom: "1px solid rgba(255,255,255,0.2)",
    },
    cellStyle: { padding: "4px" },
    inputStyle: {
      padding: "8px",
      borderRadius: "4px",
      border: "1px solid rgba(255,255,255,0.3)",
      background: "rgba(255,255,255,0.1)",
      color: "#fff",
      width: "100%",
    },
    deleteBtn: {
      background: "transparent",
      border: "none",
      color: "#ff6b6b",
      cursor: "pointer",
      fontSize: "16px",
    },
    addBtn: {
      marginTop: "12px",
      padding: "8px 16px",
      borderRadius: "8px",
      border: "1px dashed rgba(255,255,255,0.3)",
      background: "transparent",
      color: "#fff",
      cursor: "pointer",
      width: "100%",
    },
  };

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <textarea
          placeholder="Paste CSV or JSON data here..."
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          style={{
            width: "100%",
            minHeight: "80px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.3)",
            background: "rgba(255,255,255,0.1)",
            color: "#fff",
            marginBottom: "8px",
            resize: "vertical",
          }}
        />
        <button
          onClick={handleImport}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border: "none",
            background: "#4ecdc4",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Import Data
        </button>
      </div>

      <div style={{ marginTop: "16px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={styles.headerStyle}>Label</th>
              <th style={styles.headerStyle}>Value</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td style={styles.cellStyle}>
                  <input
                    value={row.label}
                    onChange={(e) =>
                      handleCellChange(index, "label", e.target.value)
                    }
                    style={styles.inputStyle}
                  />
                </td>
                <td style={styles.cellStyle}>
                  <input
                    type="number"
                    value={row.value}
                    onChange={(e) =>
                      handleCellChange(index, "value", Number(e.target.value))
                    }
                    style={styles.inputStyle}
                  />
                </td>
                <td>
                  <button
                    onClick={() => {
                      const newRows = rows.filter((_, i) => i !== index);
                      setRows(newRows);
                      onUpdate(newRows);
                    }}
                    style={styles.deleteBtn}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={() => {
            const newRows = [...rows, { label: "", value: 0 }];
            setRows(newRows);
            onUpdate(newRows);
          }}
          style={styles.addBtn}
        >
          + Add Row
        </button>
      </div>
    </div>
  );
};

// Main Component
const GraphCalculator = () => {
  const [data, setData] = useState([
    { label: "Category 1", value: 30 },
    { label: "Category 2", value: 50 },
    { label: "Category 3", value: 70 },
    { label: "Category 4", value: 40 },
    { label: "Category 5", value: 60 },
  ]);
  const [selectedChart, setSelectedChart] = useState("bar");
  const [showDataEditor, setShowDataEditor] = useState(false);
  const [exportFormat, setExportFormat] = useState("png");

  const handleExport = async () => {
    switch (exportFormat) {
      case "png":
        await exportUtils.toPNG("chart-container");
        break;
      case "csv":
        exportUtils.toCSV(data);
        break;
      case "json":
        exportUtils.toJSON(data);
        break;
      case "excel":
        await exportUtils.toExcel(data);
        break;
      default:
        alert("Export format not supported");
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "24px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <h1
            style={{
              color: "#fff",
              margin: "0 0 16px 0",
              fontSize: "32px",
              fontWeight: "300",
            }}
          >
            📊 GraphForge
          </h1>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <select
              value={selectedChart}
              onChange={(e) => setSelectedChart(e.target.value)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.3)",
                background: "rgba(255,255,255,0.1)",
                color: "#000",
                cursor: "pointer",
              }}
            >
              <option value="bar">Bar Chart</option>
              <option value="pie">Pie Chart</option>
              <option value="radar">Radar Chart</option>
            </select>

            <button
              onClick={() => setShowDataEditor(!showDataEditor)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.3)",
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {showDataEditor ? "✓ Hide Editor" : "✎ Edit Data"}
            </button>

            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.3)",
                background: "rgba(255,255,255,0.1)",
                color: "#000",
                cursor: "pointer",
              }}
            >
              <option value="png">PNG Image</option>
              <option value="csv">CSV File</option>
              <option value="json">JSON Data</option>
              <option value="excel">Excel File</option>
            </select>

            <button
              onClick={handleExport}
              style={{
                padding: "8px 24px",
                borderRadius: "8px",
                border: "none",
                background: "#4ecdc4",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Export
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: showDataEditor ? "1fr 1fr" : "1fr",
            gap: "24px",
          }}
        >
          {/* Chart Display */}
          <div
            id="chart-container"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "20px",
              padding: "24px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              minHeight: "400px",
            }}
          >
            <ChartRenderer data={data} type={selectedChart} />
          </div>

          {/* Data Editor */}
          {showDataEditor && (
            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: "20px",
                padding: "24px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                maxHeight: "600px",
                overflow: "auto",
              }}
            >
              <h3 style={{ color: "#fff", marginTop: "0" }}>Data Editor</h3>
              <DataEditor data={data} onUpdate={setData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GraphCalculator;
