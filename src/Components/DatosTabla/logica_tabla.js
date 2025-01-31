import { API_BASE_URL } from "../config";

export const fetchDataTabla = async (sector, factor, startDate, endDate) => {
  //rastrear solo el mismo mes
  const parts = endDate.split("-");
  startDate = parts[0] + "-" + parts[1] + "-01";

  const response = await fetch(
    `${API_BASE_URL}/api/data?factor=${factor}&sector=${sector}&startdate=${startDate}&enddate=${endDate}`
  );

  if (!response.ok) {
    throw new Error("Error al obtener los datos");
  }

  let data = await response.json();
  return data;
};
