import React from 'react';
import styles from './Room.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHistory, faShare, faCubes,
  faClipboard, faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';

const ToolsContainer = ({ selectedTool, setSelectedTool, toggleScreenShare }) => {
  // Lista de herramientas
  const tools = [
    { id: 'historial', name: 'Historial Clínico', icon: faHistory },
    { id: 'compartir', name: 'Compartir Pantalla', icon: faShare },
    { id: 'modelo3d', name: 'Modelo Anatómico', icon: faCubes },
    { id: 'plantillas', name: 'Plantillas Test', icon: faClipboard },
    { id: 'cuestionarios', name: 'Mis Cuestionarios', icon: faQuestionCircle }
  ];

  const selectTool = (toolId) => {
    if (toolId === 'compartir') {
      // Manejo especial para compartir pantalla
      toggleScreenShare();
      return;
    }
    setSelectedTool(toolId === selectedTool ? null : toolId);
  };

  return (
    <div className={styles.toolsGrid}>
      {tools.map(tool => {
        const isActive = selectedTool === tool.id;
        return (
          <button
            key={tool.id}
            className={isActive ? `${styles.toolButton} ${styles.toolButtonActive}` : styles.toolButton}
            onClick={() => selectTool(tool.id)}
          >
            <FontAwesomeIcon icon={tool.icon} /> {tool.name}
          </button>
        );
      })}
    </div>
  );
};

export default ToolsContainer;
