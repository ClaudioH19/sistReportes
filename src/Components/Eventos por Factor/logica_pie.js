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

  data = data.map((v) => {
    return { value: v.Total_eventos, name: v.Factor_de_riesgo };
  });
  return data;
};

export const generarChart = (data, startDate, endDate, isSmallScreen) => {
  const safeData = Array.isArray(data) ? data : [];
  const bluePalette = [
    "#3354A3",
    "#1E3D89",
    "#4F6FD1",
    "#142B66",
    "#6B89D1",
    "#213D73",
    "#89A3E6",
    "#102654",
    "#A4B8F1",
    "#0D1D40",
    "#C7DAFF",
    "#08132B",
    "#E0ECFF",
    "#040915",
    "#F2F6FF",
  ];

  const option = {
    title: {
      text: "Total de Eventos por Factor de Riesgo",
      left: "left",
      textStyle: { fontSize: 16, fontWeight: "bold", color: "#000000" },
    },
    tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
    legend: {
      orient: isSmallScreen ? "horizontal" : "vertical",
      right: "10%",
      top: isSmallScreen ? "8%" : "center",
      textStyle: { fontSize: 14, color: "#000000" },
    },
    series: [
      {
        top: isSmallScreen ? "10%" : "0%",
        name: "Factor de Riesgo",
        type: "pie",
        radius: isSmallScreen ? ["30%", "50%"] : ["40%", "70%"],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 5, borderColor: "#fff", borderWidth: 2 },
        label: {
          show: true,
          position: "outside",
          formatter: "{c} ({d}%)",
          fontSize: 14,
          color: "#000000",
        },
        labelLine: { show: true, length: 10, length2: 10 },
        emphasis: { label: { show: true, fontSize: 14, fontWeight: "bold" } },
        data: safeData.map((item, i) => ({
          ...item,
          itemStyle: { color: bluePalette[i % bluePalette.length] },
        })),
      },
    ],
  };

  return option;
};
