'use client';
import React, { useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import styles from '../Room.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faTimes } from '@fortawesome/free-solid-svg-icons';

const PatientQuestionnaire = ({ 
  questionnaire, 
  sendWebSocketMessage,
  onClose 
}) => {
  const [formData, setFormData] = useState({});

  const handleSubmit = () => {
    if (Object.keys(formData).length === 0) {
      return alert('Por favor responde al menos una pregunta');
    }
  
    sendWebSocketMessage({
      action: 'submit-questionnaire',
      message: {
        questionnaireId: questionnaire.id,
        responses: formData,
        questionnaireTitle: questionnaire.title,
        timestamp: new Date().toISOString() // Añadimos timestamp
      }
    });
    
    onClose();
  };

  return (
    <div className={styles.questionnaireModal}>
      <div className={styles.modalHeader}>
        <h3>{questionnaire.title}</h3>
        <button onClick={onClose} className={styles.closeButton}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      <div className={styles.questionnaireForm}>
        <JsonForms
          schema={questionnaire.json_schema}
          uischema={{
            type: 'Group',
            label: '',
            elements: questionnaire.ui_schema.elements
          }}
          data={formData}
          onChange={({ data }) => setFormData(data)}
          renderers={materialRenderers}
          cells={materialCells}
        />
      </div>

      <div className={styles.formActions}>
        <button
          onClick={handleSubmit}
          className={`${styles.actionButton} ${styles.primaryAction}`}
        >
          <FontAwesomeIcon icon={faPaperPlane} /> Enviar respuestas
        </button>
      </div>
    </div>
  );
};

export default PatientQuestionnaire;