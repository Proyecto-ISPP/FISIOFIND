import React from 'react';
import styles from './Room.module.css';

const SettingsPanel = ({ showSettings, setShowSettings }) => {
  if (!showSettings) return null;

  return (
    <div className={styles.settingsPanel}>
      <h4>Configuraciones</h4>
      {/* Reutilizamos .actionButton */}
      <button onClick={() => setShowSettings(false)} className={styles.actionButton}>
        Cerrar
      </button>
      {/* Aquí podrías añadir configuraciones extra (audio, vídeo, calidad, etc.) */}
    </div>
  );
};

export default SettingsPanel;
