import { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { option, fetchData_KPI_stats, generarKPI } from "./logica_kpis";

const KPIS = ({ startDate, endDate, sector, factor, isSmallScreen }) => {
  const [data, setData] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchData_KPI_stats(
          sector,
          factor,
          startDate,
          endDate
        );
        setData(result);
      } catch (err) {}
    };

    fetchData();
  }, [sector, factor, startDate, endDate]);

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "row" }}>
      <ReactECharts
        option={generarKPI(data.Total_eventos, 1)}
        style={{
          width: "33%",
          margin: "0 auto",
        }}
      />
      <ReactECharts
        option={generarKPI(data.Promedio_duracion, 2)}
        style={{
          width: "33%",
          margin: "0 auto",
        }}
      />
      <ReactECharts
        option={generarKPI(data.Promedio_involucrado, 3)}
        style={{
          width: "33%",
          margin: "0 auto",
        }}
      />
    </div>
  );
};

export default KPIS;
