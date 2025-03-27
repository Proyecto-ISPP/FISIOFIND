import React from 'react';
import styles from '../Room.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare, faCancel } from '@fortawesome/free-solid-svg-icons';
import MapaDolor from './MapaDolor';

const Plantillas = ({ activePainMap, handlePainMapSelect, sendPainMapToPatient, partsColored, sendWebSocketMessage }) => {
  // TODO: [ENLACE BACKEND] Traer listado de plantillas guardadas en la base de datos

  return (
    <div className={styles.toolPanel}>
      <h4>Mapas de dolor</h4>
      <div className={styles.painMapSection}>
        <h5 className={styles.subsectionTitle}>Mapas de Dolor</h5>
        <div className={styles.painMapGrid}>
          <div
            className={`${styles.painMapItem} ${activePainMap === 'female' ? styles.active : ''}`}
            onClick={() => handlePainMapSelect(activePainMap === 'female' ? null : 'female')}
          >
            <div className={styles.painMapIcon}>
              <MapaDolor gender={"female"} scale={0.27} partsColored={[]} sendWebSocketMessage={() => {}} />
            </div>
            <span>Modelo A</span>
          </div>

          <div
            className={`${styles.painMapItem} ${activePainMap === 'male' ? styles.active : ''}`}
            onClick={() => handlePainMapSelect(activePainMap === 'male' ? null : 'male')}
          >
            <div className={styles.painMapIcon}>
              <MapaDolor gender={"male"} scale={0.27} partsColored={[]} sendWebSocketMessage={() => {}} />
            </div>
            <span>Modelo B</span>
          </div>
        </div>

        {activePainMap && (
          <div className={styles.painMapActions}>
            <MapaDolor scale={1} gender={activePainMap} partsColored={partsColored} sendWebSocketMessage={sendWebSocketMessage}/>
            <div className='flex flex-row gap-2'>
              <button 
                className={`${styles.actionButton} ${styles.primaryAction}`}
                onClick={() => sendPainMapToPatient(null)}
              >
                <FontAwesomeIcon icon={faShare} /> Enviar a Paciente
              </button>
              <button 
                className={`${styles.actionButton} ${styles.primaryAction}`}
                onClick={() => {sendPainMapToPatient('quit')}}
              >
                <FontAwesomeIcon icon={faCancel} /> Dejar de compartir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Plantillas;
