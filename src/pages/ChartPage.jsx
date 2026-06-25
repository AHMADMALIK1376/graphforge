// src/pages/ChartPage.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { theme, getCategoryColor } from "../styles/theme";
import { getChartById } from "../utils/chartTypes";
import Layout from "../components/layout/Layout";
import ExportMenu from "../components/common/ExportMenu";
import { exportChartWithData } from "../utils/exportUtils";

// ============================================
// COMPARISON CHARTS - 22 Charts (Blue)
// ============================================
import BarChartComponent from "../components/charts/comparison/BarChart";
import ColumnChartComponent from "../components/charts/comparison/ColumnChart";
import GroupedBarChartComponent from "../components/charts/comparison/GroupedBarChart";
import LollipopChartComponent from "../components/charts/comparison/LollipopChart";
import BulletChartComponent from "../components/charts/comparison/BulletChart";
import DotPlotComponent from "../components/charts/comparison/DotPlot";
import DumbbellChartComponent from "../components/charts/comparison/DumbbellChart";
import PictogramChartComponent from "../components/charts/comparison/PictogramChart";
import IconChartComponent from "../components/charts/comparison/IconChart";
import RangeChartComponent from "../components/charts/comparison/RangeChart";
import RadialBarChartComponent from "../components/charts/comparison/RadialBarChart";
import ParallelCoordinatesComponent from "../components/charts/comparison/ParallelCoordinates";
import RadarChartComponent from "../components/charts/comparison/RadarChart";
import NightingaleChartComponent from "../components/charts/comparison/NightingaleChart";
import WaterfallChartComponent from "../components/charts/comparison/WaterfallChart";
import MatrixChartComponent from "../components/charts/comparison/MatrixChart";
import SmallMultiplesComponent from "../components/charts/comparison/SmallMultiples";
import WordCloudComponent from "../components/charts/comparison/WordCloud";
import SlopeChartComponent from "../components/charts/comparison/SlopeChart";
import TableChartComponent from "../components/charts/comparison/TableChart";
import CategoricalScatterComponent from "../components/charts/comparison/CategoricalScatter";
import QuadrantChartComponent from "../components/charts/comparison/QuadrantChart";

// ============================================
// CORRELATION CHARTS - 6 Charts (Green)
// ============================================
import ScatterPlotComponent from "../components/charts/correlation/ScatterPlot";
import BubbleChartComponent from "../components/charts/correlation/BubbleChart";
import HeatmapComponent from "../components/charts/correlation/Heatmap";
import ConnectedScatterComponent from "../components/charts/correlation/ConnectedScatter";
import ContourPlotComponent from "../components/charts/correlation/ContourPlot";
import HexagonalBinningComponent from "../components/charts/correlation/HexagonalBinning";

// ============================================
// PART-TO-WHOLE CHARTS - 18 Charts (Red)
// ============================================
import PieChartComponent from "../components/charts/partToWhole/PieChart";
import DonutChartComponent from "../components/charts/partToWhole/DonutChart";
import StackedBarChartComponent from "../components/charts/partToWhole/StackedBarChart";
import FunnelPyramidComponent from "../components/charts/partToWhole/FunnelPyramid";
import WaffleChartComponent from "../components/charts/partToWhole/WaffleChart";
import SemiCircleDonutComponent from "../components/charts/partToWhole/SemiCircleDonut";
import CircularGaugeComponent from "../components/charts/partToWhole/CircularGauge";
import PopulationPyramidComponent from "../components/charts/partToWhole/PopulationPyramid";
import IconArrayComponent from "../components/charts/partToWhole/IconArray";
import VennDiagramComponent from "../components/charts/partToWhole/VennDiagram";
import DivergingBarChartComponent from "../components/charts/partToWhole/DivergingBarChart";
import TreemapComponent from "../components/charts/partToWhole/Treemap";
import CircularTreemapComponent from "../components/charts/partToWhole/CircularTreemap";
import ConvexTreemapComponent from "../components/charts/partToWhole/ConvexTreemap";
import SunburstChartComponent from "../components/charts/partToWhole/SunburstChart";
import DendrogramComponent from "../components/charts/partToWhole/Dendrogram";
import EulerDiagramComponent from "../components/charts/partToWhole/EulerDiagram";
import MarimekkoChartComponent from "../components/charts/partToWhole/MarimekkoChart";

// ============================================
// DISTRIBUTION CHARTS - 11 Charts (Orange)
// ============================================
import HistogramComponent from "../components/charts/distribution/Histogram";
import BoxChartComponent from "../components/charts/distribution/BoxChart";
import ViolinPlotComponent from "../components/charts/distribution/ViolinPlot";
import DensityPlotComponent from "../components/charts/distribution/DensityPlot";
import RidgelinePlotComponent from "../components/charts/distribution/RidgelinePlot";
import HorizonChartComponent from "../components/charts/distribution/HorizonChart";
import RadialHistogramComponent from "../components/charts/distribution/RadialHistogram";
import StripPlotComponent from "../components/charts/distribution/StripPlot";
import JitterPlotComponent from "../components/charts/distribution/JitterPlot";
import OneDHeatmapComponent from "../components/charts/distribution/OneDHeatmap";
import BeeswarmChartComponent from "../components/charts/distribution/BeeswarmChart";

// ============================================
// TEMPORAL CHARTS - 12 Charts (Purple)
// ============================================
import LineChartComponent from "../components/charts/temporal/LineChart";
import AreaChartComponent from "../components/charts/temporal/AreaChart";
import StackedAreaChartComponent from "../components/charts/temporal/StackedAreaChart";
import SplineChartComponent from "../components/charts/temporal/SplineChart";
import StepLineChartComponent from "../components/charts/temporal/StepLineChart";
import StreamGraphComponent from "../components/charts/temporal/StreamGraph";
import BumpChartComponent from "../components/charts/temporal/BumpChart";
import BumpAreaChartComponent from "../components/charts/temporal/BumpAreaChart";
import CandlestickChartComponent from "../components/charts/temporal/CandlestickChart";
import OHLCChartComponent from "../components/charts/temporal/OHLCChart";
import GanttChartComponent from "../components/charts/temporal/GanttChart";
import BarcodeChartComponent from "../components/charts/temporal/BarcodeChart";

// ============================================
// GEOSPATIAL & OTHER CHARTS - 8 Charts (Teal/Cyan)
// ============================================
import GeographicHeatmapComponent from "../components/charts/geospatial/GeographicHeatmap";
import ChoroplethMapComponent from "../components/charts/geospatial/ChoroplethMap";
import TileMapComponent from "../components/charts/geospatial/TileMap";
import ChordDiagramComponent from "../components/charts/geospatial/ChordDiagram";
import ArcDiagramComponent from "../components/charts/geospatial/ArcDiagram";
import SankeyDiagramComponent from "../components/charts/geospatial/SankeyDiagram";
import NetworkDiagramComponent from "../components/charts/geospatial/NetworkDiagram";
import FlowchartComponent from "../components/charts/geospatial/Flowchart";

// ============================================
// FALLBACK COMPONENT FOR BROKEN CHARTS
// ============================================
const ChartError = ({ name, error }) => (
  <div
    style={{
      padding: "60px 40px",
      textAlign: "center",
      background: "#1a1a2e",
      borderRadius: "8px",
      margin: "16px",
    }}
  >
    <span style={{ fontSize: "48px" }}>🔧</span>
    <h3 style={{ color: "#f59e0b", marginTop: "16px", marginBottom: "8px" }}>
      Chart Error: {name}
    </h3>
    <p
      style={{
        color: "#f87171",
        fontSize: "13px",
        maxWidth: "500px",
        margin: "0 auto",
      }}
    >
      {error?.message || "Unknown error loading chart component"}
    </p>
    <p style={{ color: "#64748b", fontSize: "11px", marginTop: "16px" }}>
      Check the browser console for more details.
    </p>
  </div>
);

// ============================================
// CHART COMPONENT MAP - ALL 77 CHARTS
// Wrap each component in error boundary
// ============================================
const wrapComponent = (Component, chartName) => {
  if (!Component)
    return () => (
      <ChartError
        name={chartName}
        error={{ message: "Component is undefined" }}
      />
    );
  return Component;
};

const chartComponents = {
  // Comparison (22)
  barChart: wrapComponent(BarChartComponent, "Bar Chart"),
  columnChart: wrapComponent(ColumnChartComponent, "Column Chart"),
  groupedBar: wrapComponent(GroupedBarChartComponent, "Grouped Bar Chart"),
  lollipop: wrapComponent(LollipopChartComponent, "Lollipop Chart"),
  bullet: wrapComponent(BulletChartComponent, "Bullet Chart"),
  dotPlot: wrapComponent(DotPlotComponent, "Dot Plot"),
  dumbbell: wrapComponent(DumbbellChartComponent, "Dumbbell Chart"),
  pictogram: wrapComponent(PictogramChartComponent, "Pictogram Chart"),
  iconChart: wrapComponent(IconChartComponent, "Icon Chart"),
  rangeChart: wrapComponent(RangeChartComponent, "Range Chart"),
  radialBar: wrapComponent(RadialBarChartComponent, "Radial Bar Chart"),
  parallelCoordinates: wrapComponent(
    ParallelCoordinatesComponent,
    "Parallel Coordinates",
  ),
  radar: wrapComponent(RadarChartComponent, "Radar Chart"),
  nightingale: wrapComponent(NightingaleChartComponent, "Nightingale Chart"),
  waterfall: wrapComponent(WaterfallChartComponent, "Waterfall Chart"),
  matrix: wrapComponent(MatrixChartComponent, "Matrix Chart"),
  smallMultiples: wrapComponent(SmallMultiplesComponent, "Small Multiples"),
  wordCloud: wrapComponent(WordCloudComponent, "Word Cloud"),
  slope: wrapComponent(SlopeChartComponent, "Slope Chart"),
  table: wrapComponent(TableChartComponent, "Table Chart"),
  categoricalScatter: wrapComponent(
    CategoricalScatterComponent,
    "Categorical Scatter",
  ),
  quadrant: wrapComponent(QuadrantChartComponent, "Quadrant Chart"),

  // Correlation (6)
  scatter: wrapComponent(ScatterPlotComponent, "Scatter Plot"),
  bubble: wrapComponent(BubbleChartComponent, "Bubble Chart"),
  heatmap: wrapComponent(HeatmapComponent, "Heatmap"),
  connectedScatter: wrapComponent(
    ConnectedScatterComponent,
    "Connected Scatter",
  ),
  contour: wrapComponent(ContourPlotComponent, "Contour Plot"),
  hexagonalBinning: wrapComponent(
    HexagonalBinningComponent,
    "Hexagonal Binning",
  ),

  // Part-to-Whole (18)
  pie: wrapComponent(PieChartComponent, "Pie Chart"),
  donut: wrapComponent(DonutChartComponent, "Donut Chart"),
  stackedBar: wrapComponent(StackedBarChartComponent, "Stacked Bar Chart"),
  funnel: wrapComponent(FunnelPyramidComponent, "Funnel & Pyramid"),
  waffle: wrapComponent(WaffleChartComponent, "Waffle Chart"),
  semiCircleDonut: wrapComponent(SemiCircleDonutComponent, "Semi-Circle Donut"),
  circularGauge: wrapComponent(CircularGaugeComponent, "Circular Gauge"),
  populationPyramid: wrapComponent(
    PopulationPyramidComponent,
    "Population Pyramid",
  ),
  iconArray: wrapComponent(IconArrayComponent, "Icon Array"),
  venn: wrapComponent(VennDiagramComponent, "Venn Diagram"),
  divergingBar: wrapComponent(
    DivergingBarChartComponent,
    "Diverging Bar Chart",
  ),
  treemap: wrapComponent(TreemapComponent, "Treemap"),
  circularTreemap: wrapComponent(CircularTreemapComponent, "Circular Treemap"),
  convexTreemap: wrapComponent(ConvexTreemapComponent, "Convex Treemap"),
  sunburst: wrapComponent(SunburstChartComponent, "Sunburst Chart"),
  dendrogram: wrapComponent(DendrogramComponent, "Dendrogram"),
  euler: wrapComponent(EulerDiagramComponent, "Euler Diagram"),
  marimekko: wrapComponent(MarimekkoChartComponent, "Marimekko Chart"),

  // Distribution (11)
  histogram: wrapComponent(HistogramComponent, "Histogram"),
  box: wrapComponent(BoxChartComponent, "Box Chart"),
  violin: wrapComponent(ViolinPlotComponent, "Violin Plot"),
  density: wrapComponent(DensityPlotComponent, "Density Plot"),
  ridgeline: wrapComponent(RidgelinePlotComponent, "Ridgeline Plot"),
  horizon: wrapComponent(HorizonChartComponent, "Horizon Chart"),
  radialHistogram: wrapComponent(RadialHistogramComponent, "Radial Histogram"),
  strip: wrapComponent(StripPlotComponent, "Strip Plot"),
  jitter: wrapComponent(JitterPlotComponent, "Jitter Plot"),
  oneDHeatmap: wrapComponent(OneDHeatmapComponent, "1D Heatmap"),
  beeswarm: wrapComponent(BeeswarmChartComponent, "Beeswarm Chart"),

  // Temporal (12)
  line: wrapComponent(LineChartComponent, "Line Chart"),
  area: wrapComponent(AreaChartComponent, "Area Chart"),
  stackedArea: wrapComponent(StackedAreaChartComponent, "Stacked Area Chart"),
  spline: wrapComponent(SplineChartComponent, "Spline Chart"),
  stepLine: wrapComponent(StepLineChartComponent, "Step Line Chart"),
  streamGraph: wrapComponent(StreamGraphComponent, "Stream Graph"),
  bump: wrapComponent(BumpChartComponent, "Bump Chart"),
  bumpArea: wrapComponent(BumpAreaChartComponent, "Bump Area Chart"),
  candlestick: wrapComponent(CandlestickChartComponent, "Candlestick Chart"),
  ohlc: wrapComponent(OHLCChartComponent, "OHLC Chart"),
  gantt: wrapComponent(GanttChartComponent, "Gantt Chart"),
  barcode: wrapComponent(BarcodeChartComponent, "Barcode Chart"),

  // Geospatial & Other (8)
  geographicHeatmap: wrapComponent(
    GeographicHeatmapComponent,
    "Geographic Heatmap",
  ),
  choroplethMap: wrapComponent(ChoroplethMapComponent, "Choropleth Map"),
  tileMap: wrapComponent(TileMapComponent, "Tile Map"),
  chordDiagram: wrapComponent(ChordDiagramComponent, "Chord Diagram"),
  arcDiagram: wrapComponent(ArcDiagramComponent, "Arc Diagram"),
  sankeyDiagram: wrapComponent(SankeyDiagramComponent, "Sankey Diagram"),
  networkDiagram: wrapComponent(NetworkDiagramComponent, "Network Diagram"),
  flowchart: wrapComponent(FlowchartComponent, "Flowchart"),
};

// ============================================
// CHART PAGE COMPONENT
// ============================================
const ChartPage = ({ chartId, onBack, onSelectChart }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language, isRTL } = useLanguage();

  // If chartId is not provided, try to get it from URL
  const getChartIdFromUrl = () => {
    const pathSegments = location.pathname.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];
    return lastSegment && lastSegment !== "chart" ? lastSegment : null;
  };

  const effectiveChartId = chartId || getChartIdFromUrl();
  const chart = getChartById(effectiveChartId);

  // Handle back navigation
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/home");
    }
  };

  if (!chart) {
    return (
      <Layout currentPath="/charts">
        <div style={errorStyle}>
          <span style={{ fontSize: "48px" }}>⚠</span>
          <p style={{ color: theme.colors.text.muted }}>
            {t("chart.notFound") || "CHART NOT FOUND"}
          </p>
          <button onClick={handleBack} style={backBtnStyle}>
            ← {t("chart.backToCharts") || "BACK TO CHARTS"}
          </button>
        </div>
      </Layout>
    );
  }

  const categoryColor = getCategoryColor(chart.categoryId);
  const ChartComponent = chartComponents[effectiveChartId];

  return (
    <Layout currentPath="/charts">
      {/* Breadcrumb Navigation */}
      <div style={breadcrumbStyle}>
        <button onClick={handleBack} style={backLinkStyle}>
          ← {t("chart.allCharts") || "ALL CHARTS"}
        </button>
        <span style={separatorStyle}>/</span>
        <span
          style={{ color: "#8A7A6A", fontSize: "11px", letterSpacing: "1px" }}
        >
          {chart.categoryName}
        </span>
        <span style={separatorStyle}>/</span>
        <span
          style={{
            color: "#4A3728",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "1px",
          }}
        >
          {chart.name.toUpperCase()}
        </span>
      </div>

      {/* Info Bar */}
      <div style={infoBarStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>{chart.icon}</span>
          <div>
            <h2
              style={{
                color: "#4A3728",
                fontSize: "18px",
                fontWeight: 700,
                letterSpacing: "2px",
                margin: 0,
              }}
            >
              {chart.name.toUpperCase()}
            </h2>
            <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
              <span
                style={{
                  color:
                    chart.difficulty === "easy"
                      ? "#4CAF50"
                      : chart.difficulty === "medium"
                        ? "#FFF3A0"
                        : "#D15F55",
                  border: "1px solid #D4C4AE",
                  padding: "2px 8px",
                  fontSize: "9px",
                  letterSpacing: "2px",
                  borderRadius: "2px",
                  fontWeight: 600,
                }}
              >
                {chart.difficulty.toUpperCase()}
              </span>
              <span
                style={{
                  color: categoryColor,
                  border: `1px solid ${categoryColor}50`,
                  padding: "2px 8px",
                  fontSize: "9px",
                  letterSpacing: "2px",
                  borderRadius: "2px",
                  fontWeight: 600,
                }}
              >
                {chart.categoryName.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Export Controls */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <ExportMenu
            type="chart"
            label={t("chart.exportChart") || "📊 Export Chart"}
            formats={["png", "svg", "pdf"]}
            onExport={(format) => {
              exportChartWithData(
                "chart-visual-area",
                [],
                format,
                chart?.name?.toLowerCase() + "_chart" || "chart",
              );
            }}
          />
          <ExportMenu
            type="data"
            label={t("chart.exportTable") || "📋 Export Table"}
            formats={["png", "svg", "pdf", "csv", "json", "excel"]}
            onExport={(format) => {
              if (["csv", "json", "excel"].includes(format)) {
                exportChartWithData(
                  "chart-data-table",
                  [],
                  format,
                  chart?.name?.toLowerCase() + "_data" || "data",
                );
              } else {
                exportChartWithData(
                  "chart-data-table",
                  [],
                  format,
                  chart?.name?.toLowerCase() + "_table" || "table",
                );
              }
            }}
          />
        </div>
      </div>

      {/* Chart Component */}
      {ChartComponent ? (
        <ChartComponent />
      ) : (
        <div style={comingSoonStyle}>
          <span style={{ fontSize: "48px" }}>🚧</span>
          <p style={{ color: "#8A7A6A", letterSpacing: "1px" }}>
            {chart.name.toUpperCase()} -{" "}
            {t("chart.comingSoon") || "COMING SOON"}
          </p>
        </div>
      )}
    </Layout>
  );
};

// ============================================
// STYLES
// ============================================
const errorStyle = { textAlign: "center", padding: "100px 0" };

const breadcrumbStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "12px 24px",
  background: "#FFFFFF",
  borderBottom: "1px solid #D4C4AE",
  boxShadow: "0 2px 8px rgba(180, 160, 140, 0.08)",
  marginBottom: "0",
};

const backLinkStyle = {
  background: "none",
  border: "none",
  color: "#A8DCF0",
  cursor: "pointer",
  fontSize: "11px",
  fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
  letterSpacing: "1px",
  padding: 0,
};

const separatorStyle = { color: "#D4C4AE", fontSize: "11px" };

const infoBarStyle = {
  background: "#FFFFFF",
  borderBottom: "1px solid #D4C4AE",
  padding: "14px 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  boxShadow: "0 2px 8px rgba(180, 160, 140, 0.06)",
  marginBottom: "16px",
};

const backBtnStyle = {
  marginTop: "16px",
  padding: "10px 20px",
  background: "transparent",
  border: "1px solid #A8DCF0",
  borderRadius: "3px",
  color: "#A8DCF0",
  cursor: "pointer",
  fontFamily: "'Bungee', 'Bungee Inline', 'Bungee Shade', cursive",
  letterSpacing: "1px",
};

const comingSoonStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "400px",
  background: "#FFFFFF",
  margin: "16px",
  borderRadius: "6px",
  border: "1px solid #D4C4AE",
  boxShadow: "0 2px 8px rgba(180, 160, 140, 0.08)",
};

export default ChartPage;
