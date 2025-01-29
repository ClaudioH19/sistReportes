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

  //MODELO
  //{Total_eventos: , Promedio_duracion: , Promedio_involucrado: }

  //convertir a segundos la duracion
  data.Promedio_duracion = data.Promedio_duracion.match(/[\d.]+/g).reduce(
    (total, value, index) => total + value * [86400, 3600, 60, 1][index],
    0
  );

  return data;
};

//opciones grafico
export const generarKPI = (data, kpi) => {
  data = parseFloat(data).toFixed(1);

  //fijar limite superior
  let totalEventos = data || 1;
  const orderOfMagnitude = Math.pow(10, Math.floor(Math.log10(totalEventos)));
  const maxValue =
    Math.ceil(totalEventos / orderOfMagnitude) * orderOfMagnitude;

  let title = "";

  if (kpi === 1) title = "Total de Eventos Registrados";
  else if (kpi === 2) title = "Promedio de Segundos por Evento";
  else title = "Promedio de Involucrados por Evento";

  const option = {
    title: {
      text: title,
      left: "center",
      top: "5%",
      textStyle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
      },
    },
    series: [
      {
        type: "gauge",
        startAngle: 200,
        endAngle: -20,
        center: ["50%", "75%"],
        radius: "90%",
        min: 0,
        max: maxValue,
        splitNumber: 3,

        axisLine: {
          lineStyle: {
            width: 75,
            color: [
              [1 / 3, "#333333"],
              [2 / 3, "#444444"],
              [1, "#666666"],
            ],
          },
        },

        pointer: {
          length: "50%",
          width: 5,
          offsetCenter: [0, "-20%"],
          itemStyle: {
            color: "#B0B0B0",
          },
        },

        splitLine: {
          show: false,
          distance: -80,
        },

        axisLabel: {
          fontSize: 12,
          color: "#000",
          distance: 35,
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
          fontSize: 25,
          fontWeight: "bold",
          offsetCenter: [0, "30%"],
          color: "#555",
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
