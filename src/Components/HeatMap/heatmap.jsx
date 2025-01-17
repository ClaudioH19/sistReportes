import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { generadorDias, fetchData, hours } from "./funciones";

const HeatMap = ({ startDate, endDate, sector }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const fechas = generadorDias(startDate, endDate);
  const [data, setData] = useState([]);

  useEffect(() => {
    setSelectedIdx(0);
    const fetchMonthData = async () => {
      const rawData = await fetchData(sector, startDate, endDate, fechas);
      setData(rawData);
    };
    fetchMonthData();
  }, [startDate, endDate, sector]);

  const option = {
    //backgroundColor: "#f7f8fc",
    title: {
      text: `Calendario de Eventos`,
      left: "center",
      top: "2%",
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
        fontSize: 12,
        rotate: 0,
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
      data: fechas[selectedIdx] || [],
      axisLabel: {
        fontSize: 12,
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
      max: 60,
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
        data: data[selectedIdx] || [],
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
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <label
          htmlFor="selector"
          style={{ marginRight: "10px", fontSize: "14px" }}
        >
          Seleccionar página de datos:
        </label>
        <select
          id="selector"
          value={selectedIdx}
          onChange={handleIndexChange}
          style={{
            padding: "5px",
            fontSize: "14px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          {data &&
            data.map((v, idx) => (
              <option key={idx} value={idx}>
                {idx + 1}
              </option>
            ))}
        </select>
      </div>
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
        <strong>Total de eventos:</strong>{" "}
        {data[selectedIdx] ? data[selectedIdx].length : 0} eventos registrados.
        registrados.
      </div>
    </div>
  );
};

export default HeatMap;
