import { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { generarChart, fetchData_stats_per_month } from "./logica_lineas";

const LineCharts = ({ startDate, endDate, sector, factor, isSmallScreen }) => {
  const [dataD, setDataD] = useState(0);
  const [dataI, setDataI] = useState(0);

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
        setDataD(result);
        result = await fetchData_stats_per_month(
          sector,
          factor,
          startDate,
          endDate,
          1
        );
        setDataI(result);
      } catch (err) {}
    };

    fetchData();
  }, [sector, factor, startDate, endDate]);

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <ReactECharts
        option={generarChart(dataD, startDate, endDate, 0)}
        style={{
          width: "100%",
          minHeight: "600px",
          margin: "0 auto",
        }}
      />
      <ReactECharts
        option={generarChart(dataI, startDate, endDate, 1)}
        style={{
          width: "100%",
          minHeight: "600px",
          margin: "0 auto",
        }}
      />
    </div>
  );
};

export default LineCharts;
