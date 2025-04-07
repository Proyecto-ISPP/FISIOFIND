import React from 'react';
import styles from './Room.module.css';

// Subcomponentes de cada herramienta
import Historial from './tools/Historial';
import Modelo3D from './hooks/3DModel';
import Plantillas from './tools/Templates';
import QuestionnaireTool from './tools/QuestionnaireTool';

const ToolPanel = ({
  selectedTool,
  activePainMap,
  handlePainMapSelect,
  sendPainMapToPatient,
  partsColored,
  sendWebSocketMessage,
  userRole,
  addChatMessage,
  onCloseTool,
  token,
  questionnaires
}) => {
  if (!selectedTool) return null;

  return (
    <div className={styles.toolContent}>
      {selectedTool === 'historial' && <Historial />}
      {selectedTool === 'modelo3d' && (
        <Modelo3D isVisible={true} userRole={userRole} />
      )}
      {selectedTool === 'plantillas' && (
        <Plantillas
          activePainMap={activePainMap}
          handlePainMapSelect={handlePainMapSelect}
          sendPainMapToPatient={sendPainMapToPatient}
          partsColored={partsColored}
          sendWebSocketMessage={sendWebSocketMessage}
        />
      )}
      {selectedTool === 'cuestionarios' && (
        <QuestionnaireTool
          initialQuestionnaires={questionnaires}
          sendWebSocketMessage={sendWebSocketMessage}
          addChatMessage={addChatMessage}
          onClose={onCloseTool}
          token={token}
        />
      )}
    </div>
  );
};

export default ToolPanel;