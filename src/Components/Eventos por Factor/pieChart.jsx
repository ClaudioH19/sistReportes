import { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { generarChart, fetchData_stats_per_month } from "./logica_pie";

const PieChart = ({ startDate, endDate, sector, factor, isSmallScreen }) => {
  const [data, setData] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let result = await fetchData_stats_per_month(
          sector,
          factor,
          startDate,
          endDate,
          0
        );
        setData(result);
      } catch (err) {}
    };

    fetchData();
  }, [sector, factor, startDate, endDate]);

  return (
    <div style={{ width: "100%" }}>
      <ReactECharts
        option={generarChart(data, startDate, endDate)}
        style={{
          width: "100%",
          minHeight: "600px",
          margin: "0 auto",
        }}
      />
    </div>
  );
};

export default PieChart;
