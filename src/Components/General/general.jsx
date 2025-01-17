import styles from "./generalStyle.module.css";

const General = ({ startDate, endDate }) => {
  return (
    <div className={styles.container}>
      <div className={styles.image}>
        <img src="/images/referencia.jpg" alt="Imagen referencia" />
      </div>
      <div className={styles.sectionRight}>
        <div className={styles.text}>
          <h3>Fecha Inicio: {startDate}</h3>
          <h3>Fecha Fin: {endDate}</h3>
        </div>
        <div className={styles.text}>
          <p>
            <strong>Detecciones realizadas:</strong>
          </p>
          <p>
            Lorem Ipsus...Lorem Ipsus...Lorem Ipsus...Lorem Ipsus...Lorem
            Ipsus...
          </p>
        </div>
      </div>
    </div>
  );
};

export default General;
