import { useState, useEffect } from "react";
import { fetchDataTabla } from "./logica_tabla";
import { CSVLink } from "react-csv";

const TablaDatos = ({
  startMonth,
  endMonth,
  selectedSector,
  selectedFactor,
}) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 1000;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let result = await fetchDataTabla(
          selectedSector,
          selectedFactor,
          startMonth,
          endMonth
        );
        setData(result);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [selectedSector, selectedFactor, startMonth, endMonth]);

  const headers = [
    { label: "ID", key: "id" },
    { label: "Fecha", key: "fecha" },
    { label: "Hora", key: "hora" },
    { label: "Duración", key: "duracion" },
    { label: "Involucrado", key: "involucrado" },
    { label: "Sector", key: "sector" },
    { label: "Factor de riesgo", key: "factor_de_riesgo" },
  ];

  const paginatedData = data.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Reporte de Eventos de Riesgo</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "10px",
          width: "90%",
          margin: "0 auto",
        }}
      >
        <CSVLink data={data} headers={headers} filename={"datos.csv"}>
          <button
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              background: "#333",
              color: "white",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            Generar CSV
          </button>
        </CSVLink>
      </div>
      <div
        style={{
          overflowX: "auto",
          overflowY: "auto",
          maxHeight: "400px",
          maxWidth: "90%",
          margin: "0 auto",
          borderRadius: "10px",
          border: "1px solid #ddd",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <table
          border="1"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <thead style={{ background: "#333", color: "white" }}>
            <tr>
              {headers.map((header) => (
                <th key={header.key} style={{ padding: "10px" }}>
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr
                key={index}
                style={{ background: index % 2 === 0 ? "#f8f9fa" : "white" }}
              >
                <td style={{ padding: "10px" }}>{row[0]}</td>
                <td style={{ padding: "10px" }}>{row[1]}</td>
                <td style={{ padding: "10px" }}>{row[2]}</td>
                <td style={{ padding: "10px" }}>{row[3]}</td>
                <td style={{ padding: "10px" }}>{row[4]}</td>
                <td style={{ padding: "10px" }}>{row[5]}</td>
                <td style={{ padding: "10px" }}>{row[6]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: "10px" }}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          Anterior
        </button>
        <span style={{ margin: "0 10px" }}>
          Página {currentPage + 1} de {Math.ceil(data.length / itemsPerPage)}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              prev + 1 < data.length / itemsPerPage ? prev + 1 : prev
            )
          }
          disabled={currentPage + 1 >= data.length / itemsPerPage}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default TablaDatos;
