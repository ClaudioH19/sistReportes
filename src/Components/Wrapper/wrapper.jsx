import React from "react";
import styles from "./wrapperStyle.module.css";
import KPI_TOTAL_EVENTOS from "../KPI/KPI_total_eventos";
import BarChart from "../BatChart/BarChart";
import LineCharts from "../LineChart/LineCharts";
import PieChart from "../DonutChart/pieChart";
import HeatmapChart from "../Heatmap/heatmapChart";

const Wrapper = ({
  startMonth,
  endMonth,
  selectedSector,
  selectedFactor,
  isSmallScreen,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.containerCharts}>
        <KPI_TOTAL_EVENTOS
          startDate={startMonth}
          endDate={endMonth}
          sector={selectedSector}
          factor={selectedFactor}
          isSmallScreen={isSmallScreen}
        />
      </div>

      <div className={styles.containerCharts}>
        <BarChart
          startDate={startMonth}
          endDate={endMonth}
          sector={selectedSector}
          factor={selectedFactor}
          isSmallScreen={isSmallScreen}
        />
      </div>

      <div className={styles.containerCharts}>
        <LineCharts
          startDate={startMonth}
          endDate={endMonth}
          sector={selectedSector}
          factor={selectedFactor}
          isSmallScreen={isSmallScreen}
        />
      </div>

      <div className={styles.containerCharts}>
        <PieChart
          startDate={startMonth}
          endDate={endMonth}
          sector={selectedSector}
          factor={selectedFactor}
          isSmallScreen={isSmallScreen}
        />
      </div>

      <div className={styles.containerCharts}>
        <HeatmapChart
          startDate={startMonth}
          endDate={endMonth}
          sector={selectedSector}
          factor={selectedFactor}
          isSmallScreen={isSmallScreen}
        />
      </div>
    </div>
  );
};

export default Wrapper;
