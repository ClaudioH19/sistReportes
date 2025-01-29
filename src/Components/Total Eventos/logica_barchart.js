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
  endDate
) => {
  const response = await fetch(
    `http://127.0.0.1:8000/api/data_por_mes?factor=${factor}&sector=${sector}&startdate=${startDate}&enddate=${endDate}`
  );

  if (!response.ok) {
    throw new Error("Error al obtener los datos");
  }

  let data = await response.json();

  const monthsRange = generateMonthsInRange(startDate, endDate);

  const dataMap = new Map(
    data.map((v) => [v.mes.slice(0, 7), v.Total_eventos])
  );

  const alignedData = monthsRange.map((month) => dataMap.get(month) || 0);

  return alignedData;
};

export const generarChart = (data, startDate, endDate, isSmallScreen) => {
  const dataAxisX = generateMonthsInRange(startDate, endDate);

  const option = {
    title: {
      text: "Total de Eventos por Mes",
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
        type: "shadow",
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
        color: "#000",
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
          return `{a|${monthNames[date.getMonth()]}}\n{b|${
            value.split("-")[0]
          }}`;
        },
        rich: {
          a: {
            fontSize: 12,
            fontWeight: "bold",
            color: "#000000",
          },
          b: { fontSize: 10, color: "#000" },
        },
      },
      axisLine: {
        lineStyle: {
          color: "#000",
        },
      },
    },
    yAxis: {
      type: "value",
      name: "Tiempo (s)",
      nameLocation: isSmallScreen ? "end" : "middle",
      nameGap: isSmallScreen ? 15 : 50,
      nameTextStyle: {
        padding: isSmallScreen ? [0, -20, 0, 0] : [0, -50, 0, 0],
        color: "#000000",
      },
      axisLabel: {
        fontSize: 12,
        color: "#000000",
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
          color: "#89cfe1",
        },
      },
    },
    series: [
      {
        data: data,
        type: "bar",
        barWidth: "40%",
        itemStyle: {
          color: "#3354A3",
        },
        label: {
          show: true,
          position: "top",
          fontSize: 12,
          color: "#000000",
        },
      },
    ],
  };

  return option;
};
