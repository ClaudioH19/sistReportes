import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { generarRangoDeFechas, fetchData, hours } from "./funciones";

const HeatMap = ({ startDate, endDate, sector }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);
  const fechas = generarRangoDeFechas(startDate, endDate);
  const [data, setData] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1100);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial execution

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setSelectedIdx(0);
    const fetchMonthData = async () => {
      const rawData = await fetchData(sector, startDate, endDate, fechas);
      setData(rawData);
    };
    fetchMonthData();
  }, [startDate, endDate, sector]);

  const maxDataValue = data.reduce(
    (max, current) => Math.max(max, current[2]),
    0
  );

  const option = {
    title: {
      text: `Calendario de Eventos`,
      left: "center",
      textStyle: {
        color: "#333",
        fontSize: 24,
        fontWeight: "bold",
      },
    },
    grid: {
      containLabel: true,
      left: "5%",
      right: "8%",
      top: "10%",
      bottom: "10%",
    },
    xAxis: {
      type: "category",
      data: hours,
      name: "Horario",
      nameLocation: "center",
      nameTextStyle: {
        padding: 25,
        color: "#000",
        fontSize: 12,
        fontWeight: "bold",
      },
      axisLabel: {
        interval: 0,
        fontSize: isSmallScreen ? 9 : 12,
        rotate: isSmallScreen ? 270 : 0,
        color: "#000000",
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(0, 0, 0, 0.1)",
          width: 0.5,
        },
      },
    },
    yAxis: {
      type: "category",
      name: "Fecha",
      nameTextStyle: {
        color: "#000",
        fontSize: 12,
        fontWeight: "bold",
      },
      data: fechas || [],
      axisLabel: {
        fontSize: isSmallScreen ? 9 : 12,
        color: "#000000",
        interval: 0,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(0, 0, 0, 0.1)",
          width: 0.5,
        },
      },
    },
    visualMap: {
      min: 0,
      max: maxDataValue,
      calculable: true,
      top: "middle",
      left: "right",
      orient: "vertical",
      bottom: "15%",
      inRange: {
        color: ["#0000ff", "#800080", "#ff007f", "#ff4500", "#ffff00"],
      },
    },
    series: [
      {
        name: "Eventos",
        type: "heatmap",
        data: data || [],
        label: {
          show: true,
          formatter: ({ value }) => value[2],
          color: "#fff",
          fontSize: 10,
          fontWeight: "bold",
          textBorderColor: "#000000",
          textBorderWidth: 1,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  const handleIndexChange = (event) => {
    setSelectedIdx(Number(event.target.value));
  };
  return (
    <div style={{ width: "100%" }}>
      <ReactECharts
        option={option}
        style={{ width: "100%", height: "600px", margin: "0 auto" }}
      />
      <div
        style={{
          textAlign: "center",
          marginTop: "20px",
          fontSize: "14px",
          color: "#666",
        }}
      >
        <strong>Total de eventos:</strong> {data ? data.length : 0} eventos
        registrados. registrados.
      </div>
    </div>
  );
};

export default HeatMap;
