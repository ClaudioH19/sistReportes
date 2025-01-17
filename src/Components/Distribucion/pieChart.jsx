import ReactECharts from "echarts-for-react";
import React, { useState, useEffect } from "react";
import { fetchData } from "./funciones";

const PieChart = ({ startDate, endDate, sector }) => {
  const [data, setData] = useState([]);

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
    //backgroundColor: "#f7f8fc",
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
      orient: "vertical",
      top: "middle",
      right: "0%",
      borderRadius: 8,
      padding: 10,
      textStyle: {
        fontSize: 10,
        color: "#333",
      },
    },
    series: [
      {
        name: "Distribución por Zona",
        type: "pie",
        radius: "60%",
        left: "-10%",
        data: data,
        label: {
          show: true,
          formatter: "{b}: {c}\n ({d}%)",
          fontWeight: "bolder",
          fontSize: 10,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        animationType: "scale",
        animationEasing: "elasticOut",
        animationDelay: function (idx) {
          return Math.random() * 100;
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
