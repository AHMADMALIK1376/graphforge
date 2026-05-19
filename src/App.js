import React, { useState } from "react";
import "./App.css";
import HomePage from "./pages/HomePage";
import GraphCalculator from "./pages/GraphCalculator";

function App() {
  const [selectedChart, setSelectedChart] = useState(null);

  const handleSelectChart = (chartType) => {
    setSelectedChart(chartType);
  };

  const handleBackToHome = () => {
    setSelectedChart(null);
  };

  return (
    <div className="App">
      {selectedChart ? (
        <GraphCalculator chartType={selectedChart} onBack={handleBackToHome} />
      ) : (
        <HomePage onSelectChart={handleSelectChart} />
      )}
    </div>
  );
}

export default App;
