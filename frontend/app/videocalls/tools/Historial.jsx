import React from 'react';
import styles from '../Room.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard, faShare } from '@fortawesome/free-solid-svg-icons';

const Historial = () => {
  // TODO: [ENLACE BACKEND] Podrías llamar a la API para obtener el historial real del paciente
  // Ejemplo: const { data: historial } = useFetch(`/api/historial/${pacienteId}`);

  return (
    <div className={styles.toolPanel}>
      <h4>Historial Clínico del Paciente</h4>

      <div className={styles.historialHeader}>
        <span className={styles.patientName}>María Rodríguez García</span>
        <span className={styles.patientId}>ID: PAC20241105</span>
      </div>

      <div className={styles.historialTabs}>
        <button className={`${styles.historialTab} ${styles.active}`}>General</button>
        <button className={styles.historialTab}>Notas</button>
        <button className={styles.historialTab}>Resultados</button>
      </div>

      {/* TODO: [ENLACE BACKEND] Este listado .historialItem sería mapeado de datos reales */}
      <div className={styles.historialScroll}>
        <div className={styles.historialItem}>
          <div className={styles.historialItemHeader}>
            <span className={styles.date}>12/02/2025</span>
            <span className={styles.entryType}>Evaluación Inicial</span>
          </div>
          <div className={styles.historialContent}>
            <p>Paciente refiere dolor lumbar de 3 meses de evolución. EVA 7/10. Test de Lasègue +.</p>
            <span className={styles.doctor}>Dr. García Martínez</span>
          </div>
          <button className={styles.viewDetailBtn}>Ver detalles</button>
        </div>
        
        <div className={styles.historialItem}>
          <div className={styles.historialItemHeader}>
            <span className={styles.date}>25/02/2025</span>
            <span className={styles.entryType}>Seguimiento</span>
          </div>
          <div className={styles.historialContent}>
            <p>Mejora en rango de movimiento. EVA 5/10. Se recomienda continuar con ejercicios prescritos.</p>
            <span className={styles.doctor}>Dra. Rodríguez López</span>
          </div>
          <button className={styles.viewDetailBtn}>Ver detalles</button>
        </div>
        
        <div className={styles.historialItem}>
          <div className={styles.historialItemHeader}>
            <span className={styles.date}>10/03/2025</span>
            <span className={styles.entryType}>Revisión</span>
          </div>
          <div className={styles.historialContent}>
            <p>Avance significativo. EVA 3/10. Progresión a ejercicios de fase 2.</p>
            <span className={styles.doctor}>Dr. García Martínez</span>
          </div>
          <button className={styles.viewDetailBtn}>Ver detalles</button>
        </div>
      </div>

      <div className={styles.historialActions}>
        <button className={`${styles.actionButton} ${styles.primaryAction}`}>
          <FontAwesomeIcon icon={faClipboard} /> Nueva Entrada
        </button>
        <button className={styles.actionButton}>
          <FontAwesomeIcon icon={faShare} /> Compartir Historial
        </button>
      </div>
    </div>
  );
};

export default Historial;
