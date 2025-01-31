import { API_BASE_URL, kpis_color, text_color } from "../config";

export const fetchData_KPI_stats = async (
  sector,
  factor,
  startDate,
  endDate
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/indicadores_kpi?factor=${factor}&sector=${sector}&startdate=${startDate}&enddate=${endDate}`
  );
  if (!response.ok) {
    throw new Error("Error al obtener los datos");
  }
  let data = await response.json();

  if (data.Promedio_duracion !== 0)
    data.Promedio_duracion = data.Promedio_duracion.match(/[\d.]+/g).reduce(
      (total, value, index) => total + value * [86400, 3600, 60, 1][index],
      0
    );

  return data;
};

export const generarKPI = (data, kpi, isSmallScreen) => {
  data = parseFloat(data).toFixed(1);
  let totalEventos = data || 1;
  let orderOfMagnitude = 1;

  //limites fijos para distribucion
  if (kpi === 1) orderOfMagnitude = 15000;
  else if (kpi === 2) orderOfMagnitude = 15;
  else orderOfMagnitude = 15;

  if (data > orderOfMagnitude) orderOfMagnitude = data;

  let maxValue = 1;
  if (data !== 0)
    maxValue = Math.ceil(totalEventos / orderOfMagnitude) * orderOfMagnitude;

  let title = "";
  if (kpi === 1) title = "Hallazgos Totales Registrados";
  else if (kpi === 2) title = "Promedio de Segundos por Hallazgo";
  else title = "Promedio de Trabajadores por Hallazgo";

  if (isSmallScreen) {
    if (kpi === 1) title = "Total\nHallazgos";
    else if (kpi === 2) title = "Prom.\nSegundos\npor Hallazgo";
    else title = "Prom.\nTrabajadores\npor Hallazgo";
  }

  const fontSizeTitle = isSmallScreen ? 14 : 18;
  const fontSizeLabels = isSmallScreen ? 10 : 12;
  const fontSizeDetail = isSmallScreen ? 15 : 25;
  const radiusSize = isSmallScreen ? "80%" : "90%";
  const pointerWidth = isSmallScreen ? 3 : 5;
  const axisLineWidth = isSmallScreen ? 50 : 75;

  const option = {
    title: {
      text: title,
      left: "center",
      top: "5%",
      textStyle: {
        fontSize: fontSizeTitle,
        fontWeight: "bold",
        color: text_color,
      },
    },
    series: [
      {
        type: "gauge",
        startAngle: 200,
        endAngle: -20,
        center: isSmallScreen ? ["50%", "55%"] : ["50%", "75%"],
        radius: radiusSize,
        min: 0,
        max: maxValue,
        splitNumber: 3,

        axisLine: {
          lineStyle: {
            width: axisLineWidth,
            color: [
              [1 / 3, kpis_color[0]],
              [2 / 3, kpis_color[1]],
              [1, kpis_color[2]],
            ],
          },
        },

        pointer: {
          length: "50%",
          width: pointerWidth,
          offsetCenter: [0, "-20%"],
          itemStyle: {
            color: text_color,
          },
        },

        splitLine: {
          show: false,
          distance: -80,
        },

        axisLabel: {
          fontSize: fontSizeLabels,
          color: text_color,
          distance: isSmallScreen ? 50 : 30,
          formatter: function (value) {
            if (value === 0) return "0";
            if (value === maxValue / 3)
              return value >= 1000 ? (value / 1000).toFixed(0) + " mil" : value;
            if (value === (2 * maxValue) / 3)
              return value >= 1000 ? (value / 1000).toFixed(0) + " mil" : value;
            if (value === maxValue)
              return value >= 1000 ? (value / 1000).toFixed(0) + " mil" : value;
            return "";
          },
        },

        title: {
          show: false,
        },

        axisTick: {
          show: false,
        },

        detail: {
          fontSize: fontSizeDetail,
          fontWeight: "bold",
          offsetCenter: isSmallScreen ? [0, "55%"] : [0, "35%"],
          color: text_color,
        },

        data: [
          {
            value: data || 0,
          },
        ],
      },
    ],
  };

  return option;
};
