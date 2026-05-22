import { toPng, toSvg } from "html-to-image";
import { saveAs } from "file-saver";

// ============================================
// PNG EXPORT
// ============================================
export const exportToPNG = async (elementId, fileName = "chart") => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      alert("Chart element not found!");
      return;
    }
    const dataUrl = await toPng(element, {
      quality: 0.95,
      backgroundColor: "#ffffff",
      pixelRatio: 3,
    });
    const link = document.createElement("a");
    link.download = `${fileName}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error("PNG export failed:", error);
    alert("PNG export failed. Make sure html-to-image is installed.");
  }
};

// ============================================
// SVG EXPORT
// ============================================
export const exportToSVG = async (elementId, fileName = "chart") => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      alert("Chart element not found!");
      return;
    }
    const dataUrl = await toSvg(element, {
      backgroundColor: "#ffffff",
    });
    const link = document.createElement("a");
    link.download = `${fileName}.svg`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error("SVG export failed:", error);
    alert("SVG export failed.");
  }
};

// ============================================
// CSV EXPORT
// ============================================
export const exportToCSV = (data, fileName = "data") => {
  if (!data || data.length === 0) {
    alert("No data to export!");
    return;
  }
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map((row) => Object.values(row).join(",")).join("\n");
  const csv = `${headers}\n${rows}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  saveAs(blob, `${fileName}.csv`);
};

// ============================================
// JSON EXPORT
// ============================================
export const exportToJSON = (data, fileName = "data") => {
  if (!data) {
    alert("No data to export!");
    return;
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  saveAs(blob, `${fileName}.json`);
};

// ============================================
// EXCEL EXPORT
// ============================================
export const exportToExcel = async (data, fileName = "data") => {
  try {
    const XLSX = await import("xlsx");
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  } catch (error) {
    console.error("Excel export failed:", error);
    alert("Excel export failed. Make sure xlsx is installed.");
  }
};

// ============================================
// PDF EXPORT
// ============================================
export const exportToPDF = async (elementId, fileName = "chart") => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      alert("Chart element not found!");
      return;
    }
    const jsPDF = await import("jspdf");
    const htmlToImage = await import("html-to-image");

    const dataUrl = await htmlToImage.toPng(element, {
      quality: 0.95,
      backgroundColor: "#ffffff",
      pixelRatio: 2,
    });

    const pdf = new jsPDF.default("landscape", "mm", "a4");
    const imgProps = pdf.getImageProperties(dataUrl);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error("PDF export failed:", error);
    alert("PDF export failed. Make sure jspdf is installed.");
  }
};

// ============================================
// EXPORT BOTH CHART + DATA TABLE
// ============================================
export const exportChartWithData = async (
  chartElementId,
  data,
  format,
  fileName = "chart",
) => {
  if (format === "png") {
    await exportToPNG(chartElementId, fileName);
    setTimeout(() => exportToCSV(data, `${fileName}_data`), 500);
  } else if (format === "pdf") {
    await exportToPDF(chartElementId, fileName);
    setTimeout(() => exportToCSV(data, `${fileName}_data`), 500);
  } else if (format === "excel") {
    await exportToExcel(data, fileName);
  } else if (format === "csv") {
    exportToCSV(data, fileName);
  } else if (format === "json") {
    exportToJSON(data, fileName);
  }
};
