# GraphForge Architecture

## 1. Overview

GraphForge is a React-based single-page web application focused on interactive chart exploration, selection, and export. The app is designed with a modular component structure, client-side routing, theming, multilingual support, and a rich chart catalog organized by category.

## 2. Technology Stack

- React 19
- React Router DOM 7
- React Scripts (Create React App) for build/runtime
- Recharts for chart rendering
- i18next + react-i18next for localization
- Lottie for animated splash content
- jsPDF, html-to-image, file-saver for export operations
- PapaParse and XLSX for CSV/XLSX support
- Web Vitals for performance observations

## 3. Project Structure

```
public/
src/
  App.js
  index.js
  i18n/
  locales/
  components/
    common/
    layout/
    charts/
      comparison/
      correlation/
      distribution/
      partToWhole/
      temporal/
    home/
    splash/
  context/
  hooks/
  pages/
  styles/
  templates/
  utils/
```

### Key directories

- `src/components`: UI building blocks and chart components
- `src/pages`: main feature screens exposed via routes
- `src/context`: shared providers for theme and language
- `src/styles`: theme utilities and global styling
- `src/i18n` + `src/locales`: translation setup and language payloads
- `src/utils`: chart metadata, data generators, exports, and helper functions
- `public`: static HTML/manifest and asset entry points

## 4. Application Bootstrapping

### `src/index.js`

- Creates React root using `ReactDOM.createRoot`
- Applies `<React.StrictMode>` to help catch issues
- Renders `<App />`
- Installs global error handlers for `error` and `unhandledrejection`
- Optionally supports service worker registration and hot module replacement in development mode

### `src/App.js`

- Wraps the entire app with:
  - `I18nextProvider` for translation resources
  - `ThemeProvider` for theme utilities and values
  - `LanguageProvider` for current language state and change logic
- Implements a three-stage app state:
  - `splash` → render full-screen splash deck
  - `loading` → render `SplashLoader` while preloading bundles
  - `ready` → mount routed application
- Preloads page bundles via dynamic `import(...)` in `useEffect`
- Uses `BrowserRouter`, `Routes`, and `Route` for client-side navigation
- Uses `Suspense` fallback with `PageLoader` during lazy loading

## 5. Routing and Navigation

### Routes defined in `App.js`

- `/` → redirects to `/home`
- `/home` → home page
- `/charts` → chart list page
- `/chart/:chartId?` → chart detail page for a selected chart
- `/templates` → templates page
- `/about` → about page
- `/settings` → settings page
- `*` → fallback error route

### Route wrappers

- `HomeWrapper` handles chart selection and navigation from home
- `ChartListWrapper` handles selection from chart list
- `ChartWrapper` resolves `chartId` and renders `ChartPage`

## 6. Application Layout and UI Shell

### `src/components/layout/Layout.jsx`

- Provides global shell structure for pages
- Includes `<Header />`, `<Sidebar />`, and `<Footer />`
- Enforces page layout with fixed header and collapsible sidebar
- Contains scrollable main content area with CSS transition support
- Uses React Router `useLocation()` to adapt navigation state

### `src/components/layout/Sidebar.jsx`

- Displays navigation items for main app sections
- Supports open/close toggle behavior and responsive interactions
- Uses `useLanguage()` to localize labels
- Provides custom scrollbar styling and animation

## 7. Shared Contexts

### `src/context/ThemeProvider.jsx`

- Provides a theme context with color palettes, spacing, typography, and utility helper methods
- Exposes `useTheme()` and `useThemeColor()` hooks
- Provides CSS variable mapping via `useThemeCSS()` for optional global styling

### `src/context/LanguageContext.jsx`

- Wraps translation logic and current language state
- Uses `react-i18next` hooks internally
- Persists selected language to `localStorage`
- Exposes localized strings via `t`, language selection helpers, and RTL detection

## 8. Localization

### `src/i18n/index.js`

- Initializes `i18next` with `LanguageDetector` and `initReactI18next`
- Loads translation resources from `src/locales/*.json`
- Sets `fallbackLng` to `en`
- Enables debugging in development

### Locale files

- `en.json`, `es.json`, `fr.json`, `de.json`, `it.json`, `pt.json`, `ru.json`, `ja.json`, `ko.json`, `zh.json`, `ar.json`, `ur.json`
- Each file contains localized labels and UI copy used by the application

## 9. Chart Catalog and Data Flow

### `src/utils/chartTypes.js`

- Acts as the central registry for all chart categories and chart metadata
- Defines `CHART_CATEGORIES` and per-chart metadata including IDs, names, icons, difficulty, and category mapping
- Provides helper functions such as `getChartById()`, `getAllCharts()`, and `getTotalChartCount()`

### Chart categories and charts

#### Comparison Charts (22 charts)

Used for comparing values across categories and selected groups.

- `barChart` — Bar Chart: horizontal bars for straightforward category comparison.
- `columnChart` — Column Chart: vertical bars for comparing values across groups.
- `groupedBar` — Grouped Bar Chart: side-by-side bars for grouped category comparisons.
- `lollipop` — Lollipop Chart: simplified bar alternative with endpoint markers.
- `bullet` — Bullet Chart: measures performance against target benchmarks.
- `dotPlot` — Dot Plot: plots values as dots for precise category comparison.
- `dumbbell` — Dumbbell Chart: shows change between two values with connecting lines.
- `pictogram` — Pictogram: uses repeated icons to compare quantities visually.
- `iconChart` — Icon Chart: icon-driven comparison with strong visual emphasis.
- `rangeChart` — Range Chart: displays min/max or value ranges across categories.
- `radialBar` — Radial Bar Chart: circular bars for comparison in a radial layout.
- `parallelCoordinates` — Parallel Coordinates: shows multi-dimensional comparisons.
- `radar` — Radar Chart: compares multiple variables in a radial web layout.
- `nightingale` — Nightingale Chart: polar area chart for category comparison.
- `waterfall` — Waterfall Chart: shows cumulative value changes across steps.
- `matrix` — Matrix Chart: grid-style comparison for categorical values.
- `smallMultiples` — Small Multiples: repeated chart panels for side-by-side comparison.
- `wordCloud` — Word Cloud: category magnitude represented by word size.
- `slope` — Slope Chart: compares changes between two points for each category.
- `table` — Table Chart: comparison in tabular form with text and numbers.
- `categoricalScatter` — Categorical Scatter: scatter points grouped by category.
- `quadrant` — Quadrant Chart: positions values across four interpretive zones.

#### Correlation Charts (6 charts)

Designed to show relationships, patterns, and correlations between variables.

- `scatter` — Scatter Plot: plots points to reveal relationships between two dimensions.
- `bubble` — Bubble Chart: adds a third dimension with bubble size.
- `heatmap` — Heatmap: uses color intensity to show correlation density.
- `connectedScatter` — Connected Scatter: links points in time or sequence.
- `contour` — Contour Plot: displays gradient regions of correlation intensity.
- `hexagonalBinning` — Hexagonal Binning: groups dense scatter points into hexagonal bins.

#### Part-to-Whole Charts (18 charts)

Used to show how components contribute to a larger whole.

- `pie` — Pie Chart: percentage-part comparison using slices.
- `donut` — Donut Chart: central hole variation of a pie chart.
- `stackedBar` — Stacked Bar Chart: shows part composition within a bar.
- `funnel` — Funnel & Pyramid: visualizes conversion stages or descending values.
- `waffle` — Waffle Chart: distributes value parts across a grid of squares.
- `semiCircleDonut` — Semi-Circle Donut: half-donut for proportional composition.
- `circularGauge` — Circular Gauge: dial-style indicator for part values.
- `populationPyramid` — Population Pyramid: age or population distribution by group.
- `iconArray` — Icon Array: icon blocks representing part-to-whole ratios.
- `venn` — Venn Diagram: overlap relationships among sets.
- `euler` — Euler Diagram: overlapping set visualization with area-based shapes.
- `treemap` — Treemap: nested rectangles sized by part values.
- `circularTreemap` — Circular Treemap: radial adaptation of a treemap.
- `convexTreemap` — Convex Treemap: convex shapes grouped by value.
- `sunburst` — Sunburst Chart: hierarchical part-to-whole rings.
- `dendrogram` — Dendrogram: hierarchical tree structure of parts.
- `marimekko` — Marimekko Chart: width and height encode part-to-whole proportions.
- `divergingBar` — Diverging Bar Chart: emphasizes positive and negative contributions.

#### Temporal Charts (12 charts)

Built to represent changes and patterns across time.

- `line` — Line Chart: trend over time with continuous lines.
- `area` — Area Chart: line chart with filled area for cumulative volume.
- `stackedArea` — Stacked Area Chart: multiple series stacked over time.
- `spline` — Spline Chart: smooth curves for temporal trends.
- `stepLine` — Step Line Chart: stepped transitions for discrete periods.
- `streamGraph` — Stream Graph: flowing stacked area shapes over time.
- `bump` — Bump Chart: rank changes across categories through time.
- `bumpArea` — Bump Area Chart: area-based bump ranking visualization.
- `candlestick` — Candlestick Chart: high/low/open/close values for finance.
- `ohlc` — OHLC Chart: financial open-high-low-close bar view.
- `gantt` — Gantt Chart: project timelines and task durations.
- `barcode` — Barcode Chart: timeline event density represented by bars.

#### Distribution Charts (11 charts)

Focused on data spread, frequency, and statistical distribution.

- `histogram` — Histogram: frequency distribution using bars.
- `box` — Box Chart: min/max, quartiles, median, and outliers.
- `violin` — Violin Plot: distribution shape plus summary statistics.
- `density` — Density Plot: smoothed distribution curve.
- `ridgeline` — Ridgeline Plot: layered distributions for comparison.
- `horizon` — Horizon Chart: compact trend distribution with banding.
- `radialHistogram` — Radial Histogram: circular histogram for aesthetic display.
- `strip` — Strip Plot: individual observations along an axis.
- `jitter` — Jitter Plot: scatter with small random displacement to avoid overlap.
- `oneDHeatmap` — 1D Heatmap: intensity along a single axis.
- `beeswarm` — Beeswarm Chart: dense distribution of points avoiding overlap.

### Data consumption patterns

- `HomePage.jsx` uses `getAllCharts()` and `getTotalChartCount()` for dashboard statistics
- `ChartListPage.jsx` uses the chart registry to filter, search, and group charts
- `ChartPage.jsx` resolves the selected chart from `chartId` and renders the corresponding chart component

## 10. Chart Rendering Architecture

### `src/pages/ChartPage.jsx`

- Imports individual chart components from subdirectories under `src/components/charts`
- Builds a mapping object `chartComponents` keyed by chart ID
- Renders the selected chart component dynamically based on `chartId`
- Uses `Layout` for consistent page structure and includes export controls

### Chart component organization

- `src/components/charts/comparison/` for comparison charts
- `src/components/charts/correlation/` for relationship charts
- `src/components/charts/distribution/` for distribution visualizations
- `src/components/charts/partToWhole/` for composition charts
- `src/components/charts/temporal/` for time-based charts

## 11. Utility and Common Components

### `src/components/common`

- `LoadingSpinner.jsx` and `PageLoader` provide global loading UI
- `ErrorBoundary.jsx` and `ErrorBoundaryRoute.jsx` support error handling
- `ChartCard.jsx`, `SearchBar.jsx`, `PageHeader.jsx`, `FolderButton.jsx`, `ExportMenu.jsx` and other shared components provide reusable UI patterns

### `src/utils/exportUtils.js`

- Implements chart export features via image generation, PDF creation, and file download helpers
- Uses `jsPDF`, `html-to-image`, and `file-saver`

## 12. Page-Level Components

### Main pages

- `HomePage.jsx`: welcome dashboard, chart highlights, category stats, Lottie animation
- `ChartListPage.jsx`: searchable, filterable list of all available charts
- `ChartPage.jsx`: selected chart display and export tools
- `TemplatesPage.jsx`: template selection and dashboard presets
- `SettingsPage.jsx`: application preferences and language settings
- `AboutPage.jsx`: informational content and app details

### Home cards

- `HeroCard.jsx`, `VisualsCard.jsx`, `CategoriesCard.jsx` compose the home experience

## 13. Loading and Error Handling

- `LoadingSpinner.jsx` renders a full-screen branded spinner with glows and animation
- `Splash` components drive the initial animated presentation sequence
- `ErrorBoundary` catches render-time errors inside React trees
- Global error listeners in `index.js` provide a fallback UI for unhandled runtime exceptions

## 14. Styling Strategy

- Uses inline styling heavily within component files
- Global CSS files exist under `src/styles` and `src/index.css`
- Theme provider exports helpers for colors, spacing, typography, and CSS variables
- Direct style injection is used for layout, animations, and responsive interactions in key components

## 15. Build and Deployment

### `package.json`

- `start`: `react-scripts start`
- `build`: `react-scripts build`
- `test`: `react-scripts test`
- `eject`: `react-scripts eject`

### Build behavior

- Built for static deployment with Create React App
- Client-side routing requires a production server configured to serve `index.html` for all routes
- Assets are loaded from `public/` and `src/assets/` through CRA asset management

## 16. Extensibility and Future Enhancements

- Add a real chart data service to replace static chart metadata
- Add application-wide state management (Redux, Zustand, Recoil) for deeper chart interactions
- Extend theme provider for dark mode and dynamic theme switching
- Add route-based code splitting for individual chart components instead of page-level chunks
- Add unit/integration tests for page and component behavior

## 17. Summary of Architectural Layers

1. Presentation: React components and layout shell
2. Routing: React Router client routing and lazy loaded pages
3. State and context: Theme provider, language provider, local component state
4. Data registry: chart metadata and utilities
5. Localization: i18next resource management
6. Export + utilities: chart export workflows
7. Error and loading: splash, spinner, boundaries, and global handlers

## 18. Notes

- `src/context/ChartContext.js` exists but is currently empty and available for future shared chart state.
- The app uses a static in-memory chart registry instead of a backend API.
- Chart selection passes through URL parameters and wrapper components to preserve navigation state.
