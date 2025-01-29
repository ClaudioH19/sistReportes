import React from "react";
import styles from "./wrapperStyle.module.css";
import KPI_TOTAL_EVENTOS from "../KPI/KPI_total_eventos";
import BarChart from "../Total Eventos/BarChart";
import LineCharts from "../Promedios eventos/LineCharts";
import PieChart from "../Eventos por Factor/pieChart";
import HeatmapChart from "../Eventos por Sector/heatmapChart";

const Wrapper = ({ startMonth, endMonth, selectedSector, selectedFactor }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.containerCharts}>
        <KPI_TOTAL_EVENTOS
          startDate={startMonth}
          endDate={endMonth}
          sector={selectedSector}
          factor={selectedFactor}
        />
      </div>

      <div className={styles.containerCharts}>
        <BarChart
          startDate={startMonth}
          endDate={endMonth}
          sector={selectedSector}
          factor={selectedFactor}
        />
      </div>

      <div className={styles.containerCharts}>
        <LineCharts
          startDate={startMonth}
          endDate={endMonth}
          sector={selectedSector}
          factor={selectedFactor}
        />
      </div>

      <div className={styles.containerCharts}>
        <PieChart
          startDate={startMonth}
          endDate={endMonth}
          sector={selectedSector}
          factor={selectedFactor}
        />
      </div>

      <div className={styles.containerCharts}>
        <HeatmapChart
          startDate={startMonth}
          endDate={endMonth}
          sector={selectedSector}
          factor={selectedFactor}
        />
      </div>
    </div>
  );
};

export default Wrapper;
