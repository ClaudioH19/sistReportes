import ReactECharts from "echarts-for-react";
import React, { useState, useEffect } from "react";
import { horas, fetchData } from "./funciones";
const StackedBar = ({ startDate, endDate, sector }) => {
  const hours = horas();

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [data, setData] = useState([]);

  const handleClick = (params) => {
    if (params && params.data) {
      const { name } = params.data;
      mostrarFoto(name);
    }
  };

  const mostrarFoto = () => {
    const fotoUrl = "images/referencia.jpg";
    setSelectedPhoto(fotoUrl);
  };

  //funcion de cambio
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
    tooltip: {
      trigger: "item",
      axisPointer: {
        type: "shadow",
      },
    },
    title: {
      text: `Incidentes`,
      left: "center",
      top: "2%",
      textStyle: {
        color: "#333",
        fontSize: 24,
        fontWeight: "bold",
      },
    },
    legend: {
      top: "10%",
      show: false,
    },
    grid: {
      left: "5%",
      right: "4%",
      bottom: "3%",
      top: "15%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
    },
    yAxis: {
      type: "category",
      data: hours,
    },
    label: {
      top: 10,
      show: false,
      formatter: (params) => {
        return params.value > 0 ? params.value : "";
      },
    },
    itemStyle: {
      color: (params) => {
        return params.value !== 0 ? "#5470C6" : "rgba(0, 0, 0, 0)";
      },
    },
    series: data,
  };

  return (
    <div style={{ width: "100%" }}>
      <ReactECharts
        lazyUpdate={true}
        option={option}
        style={{ width: "100%", height: "600px", margin: "0 auto" }}
        onEvents={{
          click: handleClick,
        }}
      />
      {selectedPhoto && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={selectedPhoto}
            alt="Foto seleccionada"
            style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: "10px" }}
          />
        </div>
      )}
    </div>
  );
};

export default StackedBar;
