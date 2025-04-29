'use client';
import React from 'react';
import styles from '../Room.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faFilePdf, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const QuestionnaireResponseViewer = ({ 
  responseData, 
  onClose,
  questionnaire
}) => {
  if (!responseData || !questionnaire) return null;

  // Mapear las claves (q1, q2, etc.) a las preguntas reales
  const getQuestionText = (key) => {
    const questionIndex = parseInt(key.replace('q', '')) - 1;
    if (questionnaire.questions && questionIndex >= 0 && questionIndex < questionnaire.questions.length) {
      return questionnaire.questions[questionIndex].label;
    }
    return `Pregunta ${key}`;
  };

  // Formatear el valor dependiendo del tipo de pregunta
  const formatAnswer = (key, value) => {
    const questionIndex = parseInt(key.replace('q', '')) - 1;
    if (questionnaire.questions && questionIndex >= 0 && questionIndex < questionnaire.questions.length) {
      const questionType = questionnaire.questions[questionIndex].type;
      
      if (questionType === 'number') {
        return value.toString();
      } else if (questionType === 'select') {
        return value;
      }
    }
    return value;
  };

  const handleExportPDF = () => {
    // Aquí iría la lógica para exportar a PDF
    // Por ahora solo mostramos un mensaje
    alert('Función de exportación a PDF en desarrollo');
  };

  return (
    <div className={styles.responseViewer}>
      <div className={styles.responseHeader}>
        <h3>Respuestas: {questionnaire.title}</h3>
        <div className={styles.headerActions}>
          <button 
            onClick={handleExportPDF} 
            className={styles.actionIconButton}
            title="Exportar a PDF"
          >
            <FontAwesomeIcon icon={faFilePdf} />
          </button>
          <button 
            onClick={onClose} 
            className={styles.closeButton}
            title="Cerrar"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>

      <div className={styles.responseContent}>
        <div className={styles.responseHeader}>
          <div className={styles.responseTimestamp}>
            <span>Respondido: {new Date().toLocaleString()}</span>
          </div>
          <div className={styles.responseStatus}>
            <FontAwesomeIcon icon={faCheckCircle} className={styles.statusIcon} />
            <span>Completo</span>
          </div>
        </div>

        <div className={styles.responseItems}>
          {Object.keys(responseData).map(key => (
            <div key={key} className={styles.responseItem}>
              <div className={styles.questionText}>
                {getQuestionText(key)}
              </div>
              <div className={styles.answerText}>
                {formatAnswer(key, responseData[key])}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireResponseViewer;