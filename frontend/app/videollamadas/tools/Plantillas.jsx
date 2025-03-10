import React from 'react';
import styles from '../Room.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare } from '@fortawesome/free-solid-svg-icons';

const Plantillas = ({ activePainMap, handlePainMapSelect, sendPainMapToPatient }) => {
  // TODO: [ENLACE BACKEND] Traer listado de plantillas guardadas en la base de datos

  return (
    <div className={styles.toolPanel}>
      <h4>Plantillas de Test y Evaluación</h4>
      <div className={styles.searchContainer}>
        <input type="text" placeholder="Buscar plantilla..." className={styles.searchInput} />
      </div>

      <div className={styles.templateCategories}>
        <button className={`${styles.categoryBtn} ${styles.active}`}>Dolor</button>
        <button className={styles.categoryBtn}>Rango Movimiento</button>
        <button className={styles.categoryBtn}>Funcional</button>
        <button className={styles.categoryBtn}>Postura</button>
      </div>

      {/* Mapa de dolor (ejemplo) */}
      <div className={styles.painMapSection}>
        <h5 className={styles.subsectionTitle}>Mapas de Dolor</h5>
        <div className={styles.painMapGrid}>
          <div
            className={`${styles.painMapItem} ${activePainMap === 'bodyFront' ? styles.active : ''}`}
            onClick={() => handlePainMapSelect('bodyFront')}
          >
            <div className={styles.painMapIcon}>
              <div className={styles.painMapBody}>
                <div className={styles.painMapBodyFront}></div>
              </div>
            </div>
            <span>Cuerpo Anterior</span>
          </div>

          <div
            className={`${styles.painMapItem} ${activePainMap === 'bodyBack' ? styles.active : ''}`}
            onClick={() => handlePainMapSelect('bodyBack')}
          >
            <div className={styles.painMapIcon}>
              <div className={styles.painMapBody}>
                <div className={styles.painMapBodyBack}></div>
              </div>
            </div>
            <span>Cuerpo Posterior</span>
          </div>

          <div
            className={`${styles.painMapItem} ${activePainMap === 'face' ? styles.active : ''}`}
            onClick={() => handlePainMapSelect('face')}
          >
            <div className={styles.painMapIcon}>
              <div className={styles.painMapFace}></div>
            </div>
            <span>Región Facial</span>
          </div>
        </div>

        {activePainMap && (
          <div className={styles.painMapActions}>
            <button 
              className={`${styles.actionButton} ${styles.primaryAction}`}
              onClick={sendPainMapToPatient}
            >
              <FontAwesomeIcon icon={faShare} /> Enviar a Paciente
            </button>
          </div>
        )}
      </div>

      <div className={styles.scalesSection}>
        <h5 className={styles.subsectionTitle}>Escalas de Evaluación</h5>
        <ul className={styles.scalesList}>
          <li className={styles.scaleItem}>
            <span>Escala Visual Analógica (EVA)</span>
            <button className={styles.smallButton}>Usar</button>
          </li>
          <li className={styles.scaleItem}>
            <span>Índice de Discapacidad de Oswestry</span>
            <button className={styles.smallButton}>Usar</button>
          </li>
          <li className={styles.scaleItem}>
            <span>Escala de Daniels</span>
            <button className={styles.smallButton}>Usar</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Plantillas;
