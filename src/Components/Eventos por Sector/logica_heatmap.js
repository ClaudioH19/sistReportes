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
    `http://127.0.0.1:8000/api/data_por_sector?factor=${factor}&sector=${sector}&startdate=${startDate}&enddate=${endDate}`
  );

  if (!response.ok) {
    throw new Error("Error al obtener los datos");
  }

  let data = await response.json();
  const rangeMonths = generateMonthsInRange(startDate, endDate);

  const sectores = [...new Set(data.map((v) => v.sector))];

  data = data.map((v) => {
    const indexMes = rangeMonths.findIndex((m) => m === v.mes.slice(0, 7));
    const indexSector = sectores.findIndex((s) => s === v.sector);

    if (indexMes === -1 || indexSector === -1) {
      console.warn("Error: Mes o sector no encontrado", v.mes, v.sector);
    }

    return [indexMes, indexSector, v.Total_eventos];
  });

  return [data, sectores];
};

export const generarChart = (data, startDate, endDate, isSmallScreen) => {
  const dataAxisY = data[1] || [];
  const dataAxisX = generateMonthsInRange(startDate, endDate);

  const maxTotalEventos = data[0]?.length
    ? Math.max(...data[0].map((d) => d[2]))
    : 10;

  const heatmapPalette = [
    "#A4B8F1",
    "#89A8F1",
    "#7394E6",
    "#5E7FD1",
    "#4A6AC4",
    "#3354A3",
    "#1E3D89",
    "#142B66",
    "#0A1F50",
  ].reverse();

  const option = {
    title: {
      text: "Total de Eventos por Sector",
      left: "left",
      textStyle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000000",
      },
    },
    tooltip: {
      position: "top",
    },
    grid: {
      top: isSmallScreen ? "25%" : "15%",
      bottom: "15%",
    },
    xAxis: {
      type: "category",
      data: dataAxisX,
      name: "Mes",
      nameLocation: isSmallScreen ? "end" : "middle",
      nameGap: isSmallScreen ? 10 : 40,
      splitArea: { show: true },
      axisLabel: {
        fontSize: isSmallScreen ? 9 : 12,
        rotate: isSmallScreen ? 90 : 0,
        color: "#000000",
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
          a: { fontSize: 12, fontWeight: "bold", color: "#000000" },
          b: { fontSize: 10, color: "#000" },
        },
      },
    },
    yAxis: {
      type: "category",
      data: dataAxisY,
      name: "Sector",
      nameTextStyle: { color: "#000000" },
      axisLabel: {
        fontSize: isSmallScreen ? 9 : 12,
        rotate: isSmallScreen ? 90 : 0,
        color: "#000000",
      },
      splitArea: { show: true },
    },
    visualMap: {
      min: 0,
      max: maxTotalEventos,
      calculable: true,
      orient: "horizontal",
      right: "center",
      top: isSmallScreen ? "10%" : "top",
      inRange: {
        color: heatmapPalette,
      },
    },
    series: [
      {
        name: "Eventos",
        type: "heatmap",
        data: data[0] || [],
        label: {
          show: true,
          color: "#fff",
          fontSize: isSmallScreen ? 11 : 14,
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

  return option;
};
