import { hours } from "../HeatMap/funciones";

export function horas() {
  let arr = [];
  for (let i = 0; i < 24; i++) arr.push(i + ":00");
  return arr;
}

//peticion cambiar de pos
export const fetchData = async (sector, fecha_inicio, fecha_fin) => {
  const response = await fetch(
    `http://127.0.0.1:8000/api/incidentes?sector=${sector}&fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`
  );
  if (!response.ok) {
    throw new Error("Error al obtener los datos");
  }
  const data = await response.json();

  return data.map((v, iter) => {
    let hours = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];
    hours[v.hour - 1] = v.value;
    iter++;
    if (iter > 50) return {};
    return {
      type: "bar",
      stack: "total",
      name: v.name,
      data: hours,
    };
  });
};
