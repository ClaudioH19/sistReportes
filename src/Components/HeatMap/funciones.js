export const fetchData = async (sector, fecha_inicio, fecha_fin) => {
  const response = await fetch(
    `http://127.0.0.1:8000/api/heatmap_fecha_hora?sector=${sector}&fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`
  );
  if (!response.ok) {
    console.log("Error al obtener los datos");
    return [];
  }

  const data = await response.json();
  let dates = [];
  //deben venir ordenadas por date
  for (const v of data) {
    const idxFecha = parseInt(v.date.split("-")[2]) - 1;
    const idxHora = parseInt(v.hour.split(":")[0], 10);
    dates.push([idxHora, idxFecha, v.value]);
  }

  //console.log(dates);
  return dates;
};

export function generarRangoDeFechas(fechaInicio, fechaFin) {
  // Verificar que las fechas estén definidas
  if (!fechaInicio || !fechaFin) {
    throw new Error(
      "Se deben proporcionar ambas fechas: fechaInicio y fechaFin"
    );
  }

  // Convertir las fechas a objetos Date
  const startDate = new Date(fechaInicio);
  const endDate = new Date(fechaFin);

  // Verificar que fechaInicio <= fechaFin
  if (startDate > endDate) {
    throw new Error(
      "La fecha de inicio no puede ser mayor que la fecha de fin"
    );
  }

  const fechas = [];

  // Iterar desde la fecha de inicio hasta la fecha de fin
  while (startDate <= endDate) {
    // Agregar la fecha actual al arreglo en formato YYYY-MM-DD: DD
    fechas.push("día " + startDate.toISOString().split("T")[0].split("-")[2]);

    // Avanzar al siguiente día
    startDate.setDate(startDate.getDate() + 1);
  }

  return fechas;
}

// Ejemplo de uso:
const rangoDeFechas = generarRangoDeFechas("2023-10-01", "2023-10-10");
console.log(rangoDeFechas);
// Resultado: ["2023-10-01", "2023-10-02", "2023-10-03", ..., "2023-10-10"]

export const hours = [
  "0:00",
  "1:00",
  "2:00",
  "3:00",
  "4:00",
  "5:00",
  "6:00",
  "7:00",
  "8:00",
  "9:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];
