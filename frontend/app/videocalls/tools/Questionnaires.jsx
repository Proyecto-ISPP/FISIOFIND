import React from 'react';
import styles from '../Room.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';

const Cuestionarios = () => {
  return (
    <div className={styles.toolPanel}>
      <h4>Mis Cuestionarios Personalizados</h4>
      <div className={styles.cuestionariosActions}>
        <button className={`${styles.actionButton} ${styles.primaryAction}`}>
          <FontAwesomeIcon icon={faClipboard} /> Crear Nuevo
        </button>
        <div className={styles.sortOptions}>
          <label>Ordenar por:</label>
          <select className={styles.sortSelect}>
            <option>Recientes</option>
            <option>Alfabético</option>
            <option>Más usados</option>
          </select>
        </div>
      </div>

      <div className={styles.cuestionariosList}>
        <div className={styles.cuestionarioItem}>
          <div className={styles.cuestionarioInfo}>
            <h5>Evaluación Inicial Lumbalgia</h5>
            <div className={styles.cuestionarioMeta}>
              <span className={styles.cuestionarioDate}>Creado: 15/01/2025</span>
              <span className={styles.cuestionarioUses}>Usos: 24</span>
            </div>
            <p className={styles.cuestionarioDesc}>
              Evaluación completa para pacientes con dolor lumbar incluyendo EVA y test funcionales.
            </p>
          </div>
          <div className={styles.cuestionarioActions}>
            <button className={`${styles.actionButton} ${styles.smallButton}`}>Editar</button>
            <button className={`${styles.actionButton} ${styles.primaryAction} ${styles.smallButton}`}>Enviar</button>
          </div>
        </div>

        <div className={styles.cuestionarioItem}>
          <div className={styles.cuestionarioInfo}>
            <h5>Seguimiento Rehabilitación</h5>
            <div className={styles.cuestionarioMeta}>
              <span className={styles.cuestionarioDate}>Creado: 03/02/2025</span>
              <span className={styles.cuestionarioUses}>Usos: 18</span>
            </div>
            <p className={styles.cuestionarioDesc}>
              Cuestionario de seguimiento mensual para evaluar progreso en el tratamiento.
            </p>
          </div>
          <div className={styles.cuestionarioActions}>
            <button className={`${styles.actionButton} ${styles.smallButton}`}>Editar</button>
            <button className={`${styles.actionButton} ${styles.primaryAction} ${styles.smallButton}`}>Enviar</button>
          </div>
        </div>

        <div className={styles.cuestionarioItem}>
          <div className={styles.cuestionarioInfo}>
            <h5>Satisfacción Tratamiento</h5>
            <div className={styles.cuestionarioMeta}>
              <span className={styles.cuestionarioDate}>Creado: 20/02/2025</span>
              <span className={styles.cuestionarioUses}>Usos: 7</span>
            </div>
            <p className={styles.cuestionarioDesc}>
              Encuesta de satisfacción para pacientes que finalizan el tratamiento.
            </p>
          </div>
          <div className={styles.cuestionarioActions}>
            <button className={`${styles.actionButton} ${styles.smallButton}`}>Editar</button>
            <button className={`${styles.actionButton} ${styles.primaryAction} ${styles.smallButton}`}>Enviar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cuestionarios;
