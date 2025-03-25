import React from 'react';
import styles from '../Room.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faShare } from '@fortawesome/free-solid-svg-icons';

const Modelo3D = () => {
  return (
    <div className={styles.toolPanel}>
      <h4>Diagrama Anatómico Interactivo (Placeholder)</h4>
      {/* TODO: Reemplazar por un componente 3D real con Three.js o un SVG más completo */}
      
      <div className={styles.model3dContainer}>
        {/* Pequeño SVG clickable */}
        <div className={styles.model3dCanvas}>
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 200 400" 
            style={{ backgroundColor: '#f0f0f0', borderRadius: '8px' }}
          >
            {/* Cuerpo */}
            <path
              d="M100,20 C80,20,50,80,50,120 
                 C50,150,70,300,70,300 
                 L130,300 
                 C130,300,150,150,150,120 
                 C150,80,120,20,100,20 Z"
              fill="#e0e0e0"
              stroke="#cccccc"
              strokeWidth="2"
              onClick={() => alert('Click en la región central del cuerpo')}
            />
          </svg>
        </div>

        <div className={styles.model3dActions}>
          <button className={`${styles.actionButton} ${styles.primaryAction}`}>
            <FontAwesomeIcon icon={faShare} /> Compartir con Paciente
          </button>
          <button className={styles.actionButton}>
            <FontAwesomeIcon icon={faPlay} /> Mostrar Ejercicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modelo3D;
