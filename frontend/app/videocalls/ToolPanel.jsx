import React from 'react';
import styles from './Room.module.css';

// Subcomponentes de cada herramienta
import PatientHistoryViewer from './tools/PatientHistoryViewer';
import Modelo3D from './hooks/3DModel';
import Plantillas from './tools/Templates';
import QuestionnaireTool from './tools/QuestionnaireTool';


const ToolPanel = ({
  selectedTool,
  activePainMap,
  handlePainMapSelect,
  sendPainMapToPatient,
  partsColoredFront, // Añadido para pasarlo a mapa dolor
  partsColoredBack, // Añadido para pasarlo a mapa dolor
  sendWebSocketMessage,
  userRole,
  addChatMessage,
  onCloseTool,
  selectedPatientId,
  token,
  questionnaires
}) => {
  if (!selectedTool) return null;

  return (
    <div className={styles.toolContent}>
      {selectedTool === 'historial' && selectedPatientId && (
        <PatientHistoryViewer
          patientId={selectedPatientId}
          token={token}
          onClose={onCloseTool}
        />
      )}
      {selectedTool === 'modelo3d' && (
        <Modelo3D isVisible={true} userRole={userRole} />
      )}
      {selectedTool === 'plantillas' && (
        <Plantillas
          activePainMap={activePainMap}
          handlePainMapSelect={handlePainMapSelect}
          sendPainMapToPatient={sendPainMapToPatient}
          partsColoredFront={partsColoredFront}
          partsColoredBack={partsColoredBack}
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