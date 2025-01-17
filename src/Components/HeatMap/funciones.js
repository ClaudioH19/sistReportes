export function generadorDias(fecha_inicio, fecha_fin) {
  if (fecha_inicio && fecha_fin) {
    let dataAxis = [];
    let startDate = new Date(fecha_inicio);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    let endDate = new Date(fecha_fin);
    endDate.setMonth(endDate.getMonth() + 1, 0); // Último día del mes final
    endDate.setHours(23, 59, 59, 999);

    let aux = [];
    let currentMonth = startDate.getMonth();

    while (startDate <= endDate) {
      aux.push(startDate.toISOString().split("T")[0]);

      // Detectar cambio de mes
      if (startDate.getMonth() !== currentMonth) {
        dataAxis.push(aux.slice(0, -1)); // Excluir la fecha del mes siguiente
        aux = [aux[aux.length - 1]]; // Iniciar con la fecha actual
        currentMonth = startDate.getMonth();
      }
      startDate.setDate(startDate.getDate() + 1);
    }

    // Agregar las fechas restantes
    if (aux.length) dataAxis.push(aux);

    return dataAxis;
  }
  return null;
}

export const fetchData = async (sector, fecha_inicio, fecha_fin, fechas) => {
  const response = await fetch(
    `http://127.0.0.1:8000/api/heatmap_fecha_hora?sector=${sector}&fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`
  );
  if (!response.ok) {
    console.log("Error al obtener los datos");
    return [];
  }

  // Inicializar el arreglo con 12 meses vacíos
  let dates = Array.from({ length: 12 }, () => []);

  const data = await response.json();

  for (const v of data) {
    const currentMonthIdx = new Date(v.date).getMonth();
    const idxFecha = searchIndexMonth(fecha_inicio, fecha_fin, v.date, fechas);
    const idxHora = parseInt(v.hour.split(":")[0], 10);

    dates[currentMonthIdx].push([idxHora, idxFecha, v.value]);
  }
  dates = dates.filter((arr) => arr.length > 0);
  return dates;
};

export const searchIndexMonth = (startDate, endDate, dia, dias) => {
  //const idxMonth = new Date(dia).getMonth();
  const idx = new Date(dia).getDate() - 1;

  return idx;
};

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
