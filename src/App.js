import React, { useState } from "react";
import "./App.css";
import HomePage from "./pages/HomePage";
import ChartPage from "./pages/ChartPage";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedChartId, setSelectedChartId] = useState(null);

  const handleSelectChart = (chartId) => {
    setSelectedChartId(chartId);
    setCurrentPage("chart");
  };

  const handleBackToHome = () => {
    setCurrentPage("home");
    setSelectedChartId(null);
  };

  return (
    <div className="App">
      {currentPage === "home" && <HomePage onSelectChart={handleSelectChart} />}
      {currentPage === "chart" && (
        <ChartPage chartId={selectedChartId} onBack={handleBackToHome} />
      )}
    </div>
  );
}

export default App;
