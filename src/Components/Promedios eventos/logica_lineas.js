import {
  axis_color,
  text_color,
  split_line_color,
  linechart_color,
} from "../paleta_colores";

export const generateMonthsInRange = (startDate, endDate) => {
  let start = new Date(startDate);
  let end = new Date(endDate);
  let months = [];

  while (start <= end) {
    let formattedMonth = start.toISOString().slice(0, 7);

    if (!months.includes(formattedMonth)) {
      months.push(formattedMonth);
    }

    start.setMonth(start.getMonth() + 1);
    start.setDate(1);
  }

  return months;
};

export const fetchData_stats_per_month = async (
  sector,
  factor,
  startDate,
  endDate,
  graf
) => {
  const response = await fetch(
    `http://127.0.0.1:8000/api/data_por_mes?factor=${factor}&sector=${sector}&startdate=${startDate}&enddate=${endDate}`
  );

  if (!response.ok) {
    throw new Error("Error al obtener los datos");
  }

  let data = await response.json();

  const monthsRange = generateMonthsInRange(startDate, endDate);

  let dataMap = [];

  if (graf === 0)
    dataMap = new Map(
      data.map((v) => [
        v.mes.slice(0, 7),
        parseFloat(
          v.Promedio_duracion.match(/[\d.]+/g).reduce(
            (total, value, index) =>
              total + value * [86400, 3600, 60, 1][index],
            0
          )
        ).toFixed(1),
      ])
    );
  else
    dataMap = new Map(
      data.map((v) => [
        v.mes.slice(0, 7),
        parseFloat(v.Promedio_involucrado).toFixed(1),
      ])
    );

  const alignedData = monthsRange.map((month) => dataMap.get(month) || 0);

  return alignedData;
};

export const generarChart = (data, startDate, endDate, graf, isSmallScreen) => {
  const dataAxisX = generateMonthsInRange(startDate, endDate);

  let tittle = "";
  if (graf === 0) tittle = "Duración Promedio de Hallazgos Mensuales";
  else tittle = "Promedio Mensual de Trabajadores Expuestos";

  const option = {
    title: {
      text: tittle,
      left: "left",
      textStyle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000000",
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line",
      },
    },
    grid: {
      bottom: "15%",
    },
    xAxis: {
      type: "category",
      data: dataAxisX,
      name: "Mes",
      nameLocation: isSmallScreen ? "end" : "middle",
      nameGap: isSmallScreen ? 10 : 40,
      axisLabel: {
        fontSize: isSmallScreen ? 9 : 12,
        rotate: isSmallScreen ? 90 : 0,
        color: text_color,
        formatter: (value) => {
          const date = new Date(value + "-01");
          const monthNames = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
          ];
          return `{a|${monthNames[(date.getMonth() + 1) % 12]}}\n{b|${
            value.split("-")[0]
          }}`;
        },
        rich: {
          a: { fontSize: 12, fontWeight: "bold", color: text_color },
          b: { fontSize: 10, color: text_color },
        },
      },
      axisLine: {
        lineStyle: {
          color: axis_color,
        },
      },
    },
    yAxis: {
      type: "value",
      name: graf === 0 ? "Tiempo (s)" : "N° Expuestos",
      nameLocation: isSmallScreen ? "end" : "middle",
      nameGap: isSmallScreen ? 15 : 50,
      nameTextStyle: {
        padding: isSmallScreen ? [0, -20, 0, 0] : [0, -50, 0, 0],
        color: text_color,
      },
      axisLabel: {
        fontSize: 12,
        color: text_color,
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
          color: split_line_color,
        },
      },
    },
    series: [
      {
        data: data,
        type: "line",
        symbol: "circle",
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: linechart_color[0],
        },
        itemStyle: {
          color: linechart_color[1],
        },
        label: {
          show: true,
          position: "top",
          fontSize: 12,
          color: text_color,
        },
      },
    ],
  };

  return option;
};
