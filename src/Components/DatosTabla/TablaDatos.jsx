import { useState, useEffect } from "react";
import { fetchDataTabla } from "./logica_tabla";
import { CSVLink } from "react-csv";
import { table_header_color } from "../config";
const TablaDatos = ({
  startMonth,
  endMonth,
  selectedSector,
  selectedFactor,
  isSmallScreen,
}) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 1000;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let result = await fetchDataTabla(
          selectedSector,
          selectedFactor,
          startMonth,
          endMonth
        );
        setData(result);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSector, selectedFactor, startMonth, endMonth]);

  const headers = [
    "id",
    "fecha",
    "hora",
    "duración",
    "involucrado",
    "sector",
    "factor_de_riesgo",
  ];

  const paginatedData = data.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1 style={{ fontSize: isSmallScreen ? "20px" : "24px" }}>
        Hallazgos del Mes: {data.length} Registros
      </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "10px",
          width: "90%",
          margin: "0 auto",
        }}
      >
        <CSVLink data={[headers, ...data]} filename={"datos.csv"}>
          <button
            style={{
              padding: isSmallScreen ? "5px 10px" : "10px 20px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              background: table_header_color,
              color: "white",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              marginBottom: "5px",
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
          maxHeight: isSmallScreen ? "400px" : "600px",
          maxWidth: isSmallScreen ? "100%" : "90%",
          margin: "0 auto",
          borderRadius: "10px",
          border: "1px solid #ddd",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          minHeight: "250px",
        }}
      >
        {loading ? (
          <p style={{ fontSize: isSmallScreen ? "14px" : "16px" }}>
            Cargando datos...
          </p>
        ) : (
          <table
            border="1"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              borderRadius: "10px",
              overflow: "hidden",
              fontSize: isSmallScreen ? "12px" : "14px",
            }}
          >
            <thead style={{ background: table_header_color, color: "white" }}>
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    style={{ padding: isSmallScreen ? "6px" : "10px" }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => (
                <tr
                  key={index}
                  style={{
                    background: index % 2 === 0 ? "#f8f9fa" : "white",
                  }}
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      style={{ padding: isSmallScreen ? "6px" : "10px" }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
