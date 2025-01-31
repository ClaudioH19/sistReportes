import { text_color, donutchart_colors, API_BASE_URL } from "../config";

export const fetchData_stats_per_month = async (
  sector,
  factor,
  startDate,
  endDate
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/data_por_factor?factor=${factor}&sector=${sector}&startdate=${startDate}&enddate=${endDate}`
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

  const option = {
    title: {
      text: "Cantidad de Hallazgos por Factor de Riesgo",
      left: "left",
      textStyle: { fontSize: 16, fontWeight: "bold", color: text_color },
    },
    tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
    legend: {
      orient: isSmallScreen ? "horizontal" : "vertical",
      right: "10%",
      top: isSmallScreen ? "8%" : "center",
      textStyle: { fontSize: 14, color: text_color },
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
          color: text_color,
        },
        labelLine: { show: true, length: 10, length2: 10 },
        emphasis: { label: { show: true, fontSize: 14, fontWeight: "bold" } },
        data: safeData.map((item, i) => ({
          ...item,
          itemStyle: { color: donutchart_colors[i % donutchart_colors.length] },
        })),
      },
    ],
  };

  return option;
};
