export const fetchData = async (sector) => {
  const response = await fetch(
    `http://127.0.0.1:8000/api/coords?sector=${sector}`
  );
  if (!response.ok) {
    console.log("Error al obtener los datos");
    return [];
  }

  const data = await response.json();

  return data;
};

export const sectores = [
  { value: "fondoSector1", label: "Sector 1" },
  { value: "fondoSector2", label: "Sector 2" },
  { value: "fondoSector3", label: "Sector 3" },
  { value: "fondoSector4", label: "Sector 4" },
  { value: "fondoSector5", label: "Sector 5" },
  { value: "fondoSector6", label: "Sector 6" },
];

export const colors = ["#0000ff", "#800080", "#ff007f", "#ff4500", "#ffff00"];
