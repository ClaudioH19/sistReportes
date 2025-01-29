export const fetchDataTabla = async (sector, factor, startDate, endDate) => {
  const response = await fetch(
    `http://127.0.0.1:8000/api/data?factor=${factor}&sector=${sector}&startdate=${startDate}&enddate=${endDate}`
  );

  if (!response.ok) {
    throw new Error("Error al obtener los datos");
  }

  let data = await response.json();
  return data;
};
