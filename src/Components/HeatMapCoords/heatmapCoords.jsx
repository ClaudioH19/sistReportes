import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { fetchData, sectores, colors } from "./funciones";

export const originalWidth = 1620;
export const originalHeight = 1080;

export const newWidth = 960;
export const newHeight = 720;

export const scaleX = newWidth / originalWidth;
export const scaleY = newHeight / originalHeight;

const HeatMapCoords = () => {
  const [data, setData] = useState(null);
  const [nombreFondo, setNombreFondo] = useState("fondoSector1");
  const [percentage, setPercentage] = useState(50);
  const [newWidth, setNewWidth] = useState(window.innerWidth * 0.8);
  const [newHeight, setNewHeight] = useState(
    (window.innerWidth * 0.8 * 9) / 16
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth * 0.8;
      const height = (width * 9) / 16;
      setNewWidth(width);
      setNewHeight(height);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchDataOnce = async () => {
      const result = await fetchData(nombreFondo);
      const scaledData = result.map(([x, y, value]) => [
        x * scaleX,
        y * scaleY,
        value,
      ]);
      setData(scaledData);
    };

    fetchDataOnce();
  }, [nombreFondo, scaleX, scaleY]);

  const option = {
    graphic: [
      {
        type: "image",
        id: "background",
        left: 0,
        top: 0,
        z: -10,
        bounding: "raw",
        style: {
          image: `/images/${nombreFondo}.jpg`,
          width: newWidth,
          height: newHeight,
          opacity: 0.8,
        },
      },
      {
        type: "rect",
        left: 0,
        top: 0,
        z: -5,
        shape: {
          width: newWidth,
          height: newHeight,
        },
        style: {
          fill: `rgba(0, 0, 0, ${(100 - percentage) / 100})`,
        },
      },
    ],

    title: {
      text: `Mapa de Calor`,
      left: "center",
      top: "2%",
      textStyle: {
        color: "#333",
        fontSize: 24,
        fontWeight: "bold",
      },
    },
    grid: {
      left: 0,
      right: 0,
      top: "15%",
      bottom: 0,
      containLabel: false,
    },
    xAxis: {
      type: "category",
      data: () => {
        let arr = [];
        let i = 0;
        while (i < newWidth) {
          arr.push(i);
          i += 1;
        }
        return arr;
      },
    },
    yAxis: {
      type: "category",
      data: () => {
        let arr = [];
        let i = 0;
        while (i < newHeight) {
          arr.push(i);
          i += 1;
        }
        return arr;
      },
    },
    visualMap: {
      min: 1,
      max: 6,
      top: "middle",
      right: "right",
      type: "continuous",
      calculable: true,
      inRange: {
        color: colors,
      },
    },
    series: [
      {
        name: "Eventos",
        type: "heatmap",
        data: data || [],
        itemStyle: {
          borderWidth: 10,
        },
        emphasis: {
          itemStyle: {
            borderWidth: 10,
          },
        },
      },
    ],
  };

  const handleChange = (e) => {
    setPercentage(Number(e.target.value));
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ width: "100%", textAlign: "center", marginBottom: "20px" }}>
        <select
          value={nombreFondo}
          onChange={(e) => setNombreFondo(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            backgroundColor: "#f9f9f9",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="" disabled>
            Seleccionar el Sector
          </option>
          {sectores.map((sector) => (
            <option key={sector.value} value={sector.value}>
              {sector.label}
            </option>
          ))}
        </select>
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <p>
          Brillo actual: <strong>{percentage}%</strong>
        </p>
        <input
          id="percentage-slider"
          type="range"
          min="0"
          max="100"
          value={percentage}
          onChange={handleChange}
          style={{ width: "20%" }}
        />
      </div>

      <ReactECharts
        lazyUpdate={true}
        option={option}
        style={{
          width: `${newWidth}px`,
          height: `${newHeight}px`,
          margin: "0 auto",
        }}
      />
    </div>
  );
};

export default HeatMapCoords;
