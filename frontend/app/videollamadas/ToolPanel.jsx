import React from 'react';
import styles from './Room.module.css';

// Subcomponentes de cada herramienta
import Historial from './tools/Historial';
import Modelo3D from './tools/Modelo3D';
import Plantillas from './tools/Plantillas';
import Cuestionarios from './tools/Cuestionarios';

const ToolPanel = ({
  selectedTool,
  activePainMap,
  handlePainMapSelect,
  sendPainMapToPatient
}) => {
  if (!selectedTool) return null;

  return (
    <div className={styles.toolContent}>
      {selectedTool === 'historial' && <Historial />}
      {selectedTool === 'modelo3d' && <Modelo3D />}
      {selectedTool === 'plantillas' && (
        <Plantillas
          activePainMap={activePainMap}
          handlePainMapSelect={handlePainMapSelect}
          sendPainMapToPatient={sendPainMapToPatient}
        />
      )}
      {selectedTool === 'cuestionarios' && <Cuestionarios />}
    </div>
  );
};

export default ToolPanel;
