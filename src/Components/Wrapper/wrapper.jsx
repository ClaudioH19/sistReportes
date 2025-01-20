import React, { useState, useEffect } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import Select from "react-select";
import "antd/dist/reset.css";
import General from "../General/general";
import PieChart from "../Distribucion/pieChart";
import Heatmap from "../HeatMap/heatmap";
import HeatMapCoords from "../HeatMapCoords/heatmapCoords";
import StackedBar from "../Incidents/stackebar";
import styles from "./wrapperStyle.module.css";

const Wrapper = () => {
  const [startMonth, setStartMonth] = useState(
    dayjs().startOf("month").format("YYYY-MM-DD")
  );
  const [endMonth, setEndMonth] = useState(
    dayjs().endOf("month").format("YYYY-MM-DD")
  );
  const [sectores, setSectores] = useState([]);
  const [selectedSector, setSelectedSector] = useState("");

  useEffect(() => {
    const fetchSectores = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/sectores_disponibles"
        );
        if (!response.ok) {
          throw new Error("Error fetching sectores");
        }
        const data = await response.json();
        const options = data.map((sector) => ({
          label: sector.name,
          value: sector.name,
        }));
        setSectores(options);
      } catch (error) {
        console.error("Error fetching sectores: ", error);
      }
    };

    fetchSectores();
  }, []);

  const handleMonthChange = (date) => {
    if (date) {
      setStartMonth(date.startOf("month").format("YYYY-MM-DD"));
      setEndMonth(date.endOf("month").format("YYYY-MM-DD"));
    } else {
      setStartMonth(null);
      setEndMonth(null);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.Selector}>
        <div className={styles.selectorContainer}>
          <Select
            className={`${styles.basicSingle}`}
            classNamePrefix="select"
            defaultValue={0}
            isClearable={true}
            isSearchable={true}
            name="sector"
            options={sectores}
            onChange={(option) =>
              setSelectedSector(option ? option.value : null)
            }
          />
          <span className={styles.selectLabel}>Mes:</span>
          <DatePicker
            picker="month"
            defaultValue={dayjs()}
            format="YYYY-MM"
            onChange={handleMonthChange}
            disabledDate={(current) =>
              current && (current.year() < 2023 || current.year() > 2025)
            }
          />
        </div>
      </div>
      <General
        startDate={startMonth}
        endDate={endMonth}
        sector={selectedSector}
      />
      <div className={styles.containerCharts}>
        <PieChart
          startDate={startMonth}
          endDate={endMonth}
          sector={selectedSector}
        />
      </div>
      <div className={styles.containerCharts}>
        <Heatmap
          startDate={startMonth}
          endDate={endMonth}
          sector={selectedSector}
        />
      </div>
      <div className={styles.containerCharts}>
        <StackedBar
          startDate={startMonth}
          endDate={endMonth}
          sector={selectedSector}
        />
      </div>
      <div className={styles.containerCharts}>
        <HeatMapCoords />
      </div>
    </div>
  );
};

export default Wrapper;
