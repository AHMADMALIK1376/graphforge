import React from "react";
import { theme, getCategoryColor } from "../styles/theme";
import { getChartById } from "../utils/chartTypes";
import Header from "../components/layout/Header";
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
// CHART COMPONENT MAP - ALL 69 CHARTS
// ============================================
const chartComponents = {
  // Comparison (22)
  barChart: BarChartComponent,
  columnChart: ColumnChartComponent,
  groupedBar: GroupedBarChartComponent,
  lollipop: LollipopChartComponent,
  bullet: BulletChartComponent,
  dotPlot: DotPlotComponent,
  dumbbell: DumbbellChartComponent,
  pictogram: PictogramChartComponent,
  iconChart: IconChartComponent,
  rangeChart: RangeChartComponent,
  radialBar: RadialBarChartComponent,
  parallelCoordinates: ParallelCoordinatesComponent,
  radar: RadarChartComponent,
  nightingale: NightingaleChartComponent,
  waterfall: WaterfallChartComponent,
  matrix: MatrixChartComponent,
  smallMultiples: SmallMultiplesComponent,
  wordCloud: WordCloudComponent,
  slope: SlopeChartComponent,
  table: TableChartComponent,
  categoricalScatter: CategoricalScatterComponent,
  quadrant: QuadrantChartComponent,

  // Correlation (6)
  scatter: ScatterPlotComponent,
  bubble: BubbleChartComponent,
  heatmap: HeatmapComponent,
  connectedScatter: ConnectedScatterComponent,
  contour: ContourPlotComponent,
  hexagonalBinning: HexagonalBinningComponent,

  // Part-to-Whole (18)
  pie: PieChartComponent,
  donut: DonutChartComponent,
  stackedBar: StackedBarChartComponent,
  funnel: FunnelPyramidComponent,
  waffle: WaffleChartComponent,
  semiCircleDonut: SemiCircleDonutComponent,
  circularGauge: CircularGaugeComponent,
  populationPyramid: PopulationPyramidComponent,
  iconArray: IconArrayComponent,
  venn: VennDiagramComponent,
  divergingBar: DivergingBarChartComponent,
  treemap: TreemapComponent,
  circularTreemap: CircularTreemapComponent,
  convexTreemap: ConvexTreemapComponent,
  sunburst: SunburstChartComponent,
  dendrogram: DendrogramComponent,
  euler: EulerDiagramComponent,
  marimekko: MarimekkoChartComponent,

  // Distribution (11)
  histogram: HistogramComponent,
  box: BoxChartComponent,
  violin: ViolinPlotComponent,
  density: DensityPlotComponent,
  ridgeline: RidgelinePlotComponent,
  horizon: HorizonChartComponent,
  radialHistogram: RadialHistogramComponent,
  strip: StripPlotComponent,
  jitter: JitterPlotComponent,
  oneDHeatmap: OneDHeatmapComponent,
  beeswarm: BeeswarmChartComponent,

  // Temporal (12)
  line: LineChartComponent,
  area: AreaChartComponent,
  stackedArea: StackedAreaChartComponent,
  spline: SplineChartComponent,
  stepLine: StepLineChartComponent,
  streamGraph: StreamGraphComponent,
  bump: BumpChartComponent,
  bumpArea: BumpAreaChartComponent,
  candlestick: CandlestickChartComponent,
  ohlc: OHLCChartComponent,
  gantt: GanttChartComponent,
  barcode: BarcodeChartComponent,
};

const ChartPage = ({ chartId, onBack }) => {
  const chart = getChartById(chartId);

  if (!chart) {
    return (
      <div style={pageStyle}>
        <Header />
        <div style={errorStyle}>
          <span style={{ fontSize: "48px" }}>⚠</span>
          <p style={{ color: theme.colors.text.muted }}>CHART NOT FOUND</p>
          <button onClick={onBack} style={backBtnStyle}>
            ← BACK TO CHARTS
          </button>
        </div>
      </div>
    );
  }

  const categoryColor = getCategoryColor(chart.categoryId);
  const ChartComponent = chartComponents[chartId];

  return (
    <div style={pageStyle}>
      <Header currentPage="charts" />
      <div style={contentStyle}>
        <div style={breadcrumbStyle}>
          <button onClick={onBack} style={backLinkStyle}>
            ← ALL CHARTS
          </button>
          <span style={separatorStyle}>/</span>
          <span
            style={{ color: "#8b949e", fontSize: "11px", letterSpacing: "1px" }}
          >
            {chart.categoryName}
          </span>
          <span style={separatorStyle}>/</span>
          <span
            style={{
              color: "#f0f6fc",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1px",
            }}
          >
            {chart.name.toUpperCase()}
          </span>
        </div>

        <div style={infoBarStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "28px" }}>{chart.icon}</span>
            <div>
              <h2
                style={{
                  color: "#f0f6fc",
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
                        ? "#3fb950"
                        : chart.difficulty === "medium"
                          ? "#d29922"
                          : "#f85149",
                    border: "1px solid #30363d",
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

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <ExportMenu
              type="chart"
              label="📊 Export Chart"
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
              label="📋 Export Table"
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

        {ChartComponent ? (
          <ChartComponent />
        ) : (
          <div style={comingSoonStyle}>
            <span style={{ fontSize: "48px" }}>🚧</span>
            <p style={{ color: "#8b949e", letterSpacing: "1px" }}>
              {chart.name.toUpperCase()} - COMING SOON
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const pageStyle = {
  background: "#0a0e14",
  minHeight: "100vh",
  fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
};

const contentStyle = { padding: "0" };

const errorStyle = {
  textAlign: "center",
  padding: "100px 0",
};

const breadcrumbStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "12px 24px",
  background: "#161b22",
  borderBottom: "1px solid #30363d",
};

const backLinkStyle = {
  background: "none",
  border: "none",
  color: "#58a6ff",
  cursor: "pointer",
  fontSize: "11px",
  fontFamily: "'JetBrains Mono', monospace",
  letterSpacing: "1px",
  padding: 0,
};

const separatorStyle = {
  color: "#484f58",
  fontSize: "11px",
};

const infoBarStyle = {
  background: "#161b22",
  borderBottom: "1px solid #30363d",
  padding: "14px 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const backBtnStyle = {
  marginTop: "16px",
  padding: "10px 20px",
  background: "transparent",
  border: "1px solid #58a6ff",
  borderRadius: "3px",
  color: "#58a6ff",
  cursor: "pointer",
  fontFamily: "'JetBrains Mono', monospace",
  letterSpacing: "1px",
};

const comingSoonStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "400px",
  background: "#ffffff",
  margin: "16px",
  borderRadius: "6px",
};

export default ChartPage;
