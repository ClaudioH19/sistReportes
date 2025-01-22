import ReactECharts from "echarts-for-react";
import React, { useState, useEffect } from "react";
import { fetchData } from "./funciones";

const PieChart = ({ startDate, endDate, sector }) => {
  const [data, setData] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1100);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const getData = async () => {
      if (startDate && endDate) {
        try {
          const fetchedData = await fetchData(sector, startDate, endDate);
          setData(fetchedData);
        } catch (error) {
          console.error("Error al obtener los datos:", error);
        }
      }
    };
    getData();
  }, [startDate, endDate, sector]);

  const option = {
    title: {
      text: "Distribución por Zona",
      left: "center",
      top: "2%",
      textStyle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      orient: "horizontal",
      top: "10%",
      left: "center",
      textStyle: {
        fontSize: isSmallScreen ? 11 : 14,
        color: "#333",
      },
    },
    series: [
      {
        name: "Distribución por Zona",
        type: "pie",
        radius: isSmallScreen ? "40%" : "60%",
        center: isSmallScreen ? ["50%", "60%"] : ["50%", "60%"],
        data: data,
        label: {
          show: true,
          formatter: "{b}: {c}\n ({d}%)",
          fontWeight: "bolder",
          fontSize: isSmallScreen ? 10 : 12,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  return (
    <div style={{ width: "100%" }}>
      <ReactECharts
        option={option}
        style={{
          width: "100%",
          minHeight: "600px",
          margin: "0 auto",
        }}
      />
      <div
        style={{
          textAlign: "center",
          marginTop: "20px",
          fontSize: "14px",
          color: "#666",
        }}
      >
        <strong>Total de zonas:</strong> {data.length || 0} zonas analizadas.
      </div>
    </div>
  );
};

export default PieChart;
