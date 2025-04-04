'use client';
import React, { useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import styles from './Room.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faTimes } from '@fortawesome/free-solid-svg-icons';

const PatientQuestionnaireView = ({ 
  questionnaire, 
  sendWebSocketMessage,
  onClose 
}) => {
  const [formData, setFormData] = useState({});

  const handleSubmit = () => {
    sendWebSocketMessage({
      action: 'submit-questionnaire',
      message: {
        questionnaireId: questionnaire.id,
        responses: formData
      }
    });
    onClose();
  };

  return (
    <div className={styles.questionnaireModal}>
      <div className={styles.questionnaireHeader}>
        <h4>{questionnaire.title}</h4>
        <button onClick={onClose} className={styles.closeButton}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      
      <div className={styles.questionnaireForm}>
        <JsonForms
          schema={questionnaire.json_schema}
          uischema={questionnaire.ui_schema}
          data={formData}
          onChange={({ data }) => setFormData(data)}
          renderers={materialRenderers}
          cells={materialCells}
        />
      </div>
      
      <button
        onClick={handleSubmit}
        className={`${styles.actionButton} ${styles.primaryAction}`}
      >
        <FontAwesomeIcon icon={faPaperPlane} /> Enviar respuestas
      </button>
    </div>
  );
};

export default PatientQuestionnaireView;