export const fetchData_stats_per_month = async (
  sector,
  factor,
  startDate,
  endDate
) => {
  const response = await fetch(
    `http://127.0.0.1:8000/api/data_por_factor?factor=${factor}&sector=${sector}&startdate=${startDate}&enddate=${endDate}`
  );

  if (!response.ok) {
    throw new Error("Error al obtener los datos");
  }

  let data = await response.json();

  //formatear para el graf

  data = data.map((v) => {
    return { value: v.Total_eventos, name: v.Factor_de_riesgo };
  });
  return data;
};

export const generarChart = (data, startDate, endDate) => {
  const safeData = Array.isArray(data) ? data : [];
  const grayPalette = [
    "#2E2E2E",
    "#3C3C3C",
    "#4A4A4A",
    "#585858",
    "#666666",
    "#747474",
    "#828282",
    "#909090",
    "#9E9E9E",
    "#ACACAC",
    "#BABABA",
    "#C8C8C8",
    "#D6D6D6",
    "#E4E4E4",
    "#F2F2F2",
  ];

  const option = {
    title: {
      text: "Total de Eventos por Factor de Riesgo",
      left: "left",
      textStyle: { fontSize: 16, fontWeight: "bold" },
    },
    tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
    legend: {
      orient: "vertical",
      right: "10%",
      top: "center",
      textStyle: { fontSize: 12, color: "#444" },
    },
    series: [
      {
        name: "Factor de Riesgo",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 5, borderColor: "#fff", borderWidth: 2 },
        label: {
          show: true,
          position: "outside",
          formatter: "{c} ({d}%)",
          fontSize: 12,
          color: "#444",
        },
        labelLine: { show: true, length: 10, length2: 10 },
        emphasis: { label: { show: true, fontSize: 14, fontWeight: "bold" } },
        data: safeData.map((item, i) => ({
          ...item,
          itemStyle: { color: grayPalette[i % grayPalette.length] },
        })),
      },
    ],
  };

  return option;
};
