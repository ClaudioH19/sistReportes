//peticion cambiar de pos
export const fetchData = async (sector, fecha_inicio, fecha_fin) => {
  const response = await fetch(
    `http://127.0.0.1:5000/factor_riesgo?sector=${sector}&fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`
  );
  if (!response.ok) {
    throw new Error("Error al obtener los datos");
  }
  const data = await response.json();

  return data.map((v) => {
    return { name: v.name, value: v.value };
  });
};
