export const fetchData_KPI_stats = async (
  sector,
  factor,
  startDate,
  endDate
) => {
  const response = await fetch(
    `http://127.0.0.1:8000/api/indicadores_kpi?factor=${factor}&sector=${sector}&startdate=${startDate}&enddate=${endDate}`
  );
  if (!response.ok) {
    throw new Error("Error al obtener los datos");
  }
  let data = await response.json();

  data.Promedio_duracion = data.Promedio_duracion.match(/[\d.]+/g).reduce(
    (total, value, index) => total + value * [86400, 3600, 60, 1][index],
    0
  );

  return data;
};

export const generarKPI = (data, kpi, isSmallScreen) => {
  data = parseFloat(data).toFixed(1);

  let totalEventos = data || 1;
  const orderOfMagnitude = Math.pow(10, Math.floor(Math.log10(totalEventos)));
  const maxValue =
    Math.ceil(totalEventos / orderOfMagnitude) * orderOfMagnitude;

  let title = "";
  if (kpi === 1) title = "Total Eventos Registrados";
  else if (kpi === 2) title = "Media de Segundos por Evento";
  else title = "Media de Involucrados por Evento";

  if (isSmallScreen) {
    if (kpi === 1) title = "Total Eventos";
    else if (kpi === 2) title = "Prom. Segundos/Event";
    else title = "Prom. Involucrados/Event";
  }

  const fontSizeTitle = isSmallScreen ? 9 : 18;
  const fontSizeLabels = isSmallScreen ? 10 : 12;
  const fontSizeDetail = isSmallScreen ? 15 : 25;
  const radiusSize = isSmallScreen ? "80%" : "90%";
  const pointerWidth = isSmallScreen ? 3 : 5;
  const axisLineWidth = isSmallScreen ? 50 : 75;

  const option = {
    title: {
      text: title,
      left: "center",
      top: isSmallScreen ? "20%" : "5%",
      textStyle: {
        fontSize: fontSizeTitle,
        fontWeight: "bold",
        color: "#000000",
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
              [1 / 3, "#8cb3e0"],
              [2 / 3, "#3c6eb4"],
              [1, "#3354A3"],
            ],
          },
        },

        pointer: {
          length: "50%",
          width: pointerWidth,
          offsetCenter: [0, "-20%"],
          itemStyle: {
            color: "#000000",
          },
        },

        splitLine: {
          show: false,
          distance: -80,
        },

        axisLabel: {
          fontSize: fontSizeLabels,
          color: "#000000",
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
          offsetCenter: [0, "35%"],
          color: "#000000",
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
