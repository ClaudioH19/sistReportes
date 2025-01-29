import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "antd";
import Select from "react-select";
import dayjs from "dayjs";
import "antd/dist/reset.css";
import "../App.css";

const SelectorBar = ({
  startMonth,
  setStartMonth,
  endMonth,
  setEndMonth,
  selectedSector,
  setSelectedSector,
  selectedFactor,
  setSelectedFactor,
}) => {
  const navigate = useNavigate();
  const [sectores, setSectores] = useState([]);
  const [factores, setFactores] = useState([]);

  useEffect(() => {
    const fetchSectores = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/sectores_disponibles"
        );
        if (!response.ok) throw new Error("Error fetching sectores");
        const data = await response.json();
        setSectores([
          { label: "Todas", value: "" },
          ...data.map((sector) => ({ label: sector.name, value: sector.name })),
        ]);
      } catch (error) {
        console.error("Error fetching sectores: ", error);
      }
    };

    const fetchFactores = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/factores_disponibles"
        );
        if (!response.ok) throw new Error("Error fetching factores");
        const data = await response.json();
        setFactores([
          { label: "Todas", value: "" },
          ...data.map((factor) => ({ label: factor.name, value: factor.name })),
        ]);
      } catch (error) {
        console.error("Error fetching factores: ", error);
      }
    };

    fetchSectores();
    fetchFactores();
  }, []);

  const handleMonthChange = (date) => {
    if (date) {
      setEndMonth(date.endOf("month").format("YYYY-MM-DD"));
      setStartMonth(
        date.subtract(11, "month").startOf("month").format("YYYY-MM-DD")
      );
    } else {
      const currentMonth = dayjs();
      setEndMonth(currentMonth.endOf("month").format("YYYY-MM-DD"));
      setStartMonth(
        currentMonth.subtract(11, "month").startOf("month").format("YYYY-MM-DD")
      );
    }
  };

  return (
    <div className="selectorContainer">
      <div className="selectWrapper">
        <label>Año, Mes</label>
        <DatePicker
          value={endMonth ? dayjs(endMonth) : null}
          onChange={handleMonthChange}
          picker="month"
          placeholder="Seleccione un mes"
          className="ant-picker"
          allowClear={true}
        />
      </div>

      <div className="selectWrapper">
        <label>Sector</label>
        <Select
          isClearable={true}
          options={sectores}
          onChange={(option) => setSelectedSector(option?.value || "")}
          value={sectores.find((s) => s.value === selectedSector) || null}
          placeholder="Todas"
          className="basicSingle"
        />
      </div>

      <div className="selectWrapper">
        <label>Factor de Riesgo</label>
        <Select
          isClearable={true}
          options={factores}
          onChange={(option) => setSelectedFactor(option?.value || "")}
          value={factores.find((f) => f.value === selectedFactor) || null}
          placeholder="Todas"
          className="basicSingle"
        />
      </div>

      <button className="dataButton" onClick={() => navigate("/datos")}>
        <i className="fa-solid fa-table"></i> Ver Datos
      </button>
    </div>
  );
};

export default SelectorBar;
