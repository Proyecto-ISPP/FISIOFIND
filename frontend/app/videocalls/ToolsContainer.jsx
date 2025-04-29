import React from 'react';
import styles from './Room.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHistory, 
  faShare, 
  faCubes,
  faClipboard, 
  faFileAlt
} from '@fortawesome/free-solid-svg-icons';

const ToolsContainer = ({ 
  selectedTool, 
  setSelectedTool, 
  toggleScreenShare,
  hasQuestionnaires = false
}) => {
  const tools = [
    { id: 'historial', name: 'Historial', icon: faHistory },
    { id: 'compartir', name: 'Pantalla', icon: faShare },
    { id: 'modelo3d', name: 'Modelo 3D', icon: faCubes },
    { id: 'plantillas', name: 'Mapa dolor', icon: faClipboard },
    ...(hasQuestionnaires ? 
      [{ id: 'cuestionarios', name: 'Cuestionarios', icon: faFileAlt }] : 
      [])
  ];

  const selectTool = (toolId) => {
    if (toolId === 'compartir') {
      toggleScreenShare();
      return;
    }
    setSelectedTool(toolId === selectedTool ? null : toolId);
  };

  return (
    <div className={styles.toolsGrid}>
      {tools.map(tool => (
        <button
          key={tool.id}
          className={`${styles.toolButton} ${
            selectedTool === tool.id ? styles.toolButtonActive : ''
          }`}
          onClick={() => selectTool(tool.id)}
          title={tool.name}
        >
          <FontAwesomeIcon icon={tool.icon} />
          <span className={styles.toolName}>{tool.name}</span>
        </button>
      ))}
    </div>
  );
};

export default ToolsContainer;