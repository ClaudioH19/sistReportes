import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import dayjs from "dayjs";
import "antd/dist/reset.css";
import "./App.css";
import Wrapper from "./Components/Wrapper/wrapper";
import TablaDatos from "./Components/Datos/TablaDatos";
import SelectorBar from "./Components/SelectorBar";

function App() {
  const [startMonth, setStartMonth] = useState(
    dayjs().subtract(11, "month").startOf("month").format("YYYY-MM-DD")
  );
  const [endMonth, setEndMonth] = useState(
    dayjs().endOf("month").format("YYYY-MM-DD")
  );
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedFactor, setSelectedFactor] = useState("");

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768); // Se actualiza si el ancho es menor a 768px
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Router>
      <SelectorBar
        startMonth={startMonth}
        setStartMonth={setStartMonth}
        endMonth={endMonth}
        setEndMonth={setEndMonth}
        selectedSector={selectedSector}
        setSelectedSector={setSelectedSector}
        selectedFactor={selectedFactor}
        setSelectedFactor={setSelectedFactor}
      />

      <Routes>
        <Route
          path="/"
          element={
            <Wrapper
              startMonth={startMonth}
              endMonth={endMonth}
              selectedSector={selectedSector}
              selectedFactor={selectedFactor}
              isSmallScreen={isSmallScreen}
            />
          }
        />
        <Route
          path="/datos"
          element={
            <TablaDatos
              startMonth={startMonth}
              endMonth={endMonth}
              selectedSector={selectedSector}
              selectedFactor={selectedFactor}
              isSmallScreen={isSmallScreen}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
