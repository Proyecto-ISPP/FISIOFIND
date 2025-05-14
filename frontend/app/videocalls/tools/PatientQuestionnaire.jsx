'use client';
import React, { useState, useEffect } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import styles from '../Room.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';  // Importamos axios
import Alert from '@/components/ui/Alert';
import { getApiBaseUrl } from '@/utils/api';

const PatientQuestionnaire = ({
  questionnaire,
  sendWebSocketMessage,
  onClose,
  roomCode
}) => {
  const [formData, setFormData] = useState({});
  const [token, setToken] = useState('');
  const [alert, setAlert] = useState({ type: '', message: '', show: false }); // Estado de alertas

  // Obtener el token del localStorage (o de donde sea que lo guardes)
  useEffect(() => {
    const storedToken = localStorage.getItem('token');  // O usar sessionStorage o cookies según sea el caso
    setToken(storedToken);
  }, []);

  const handleSubmit = async () => {
    if (Object.keys(formData).length === 0) {
      setAlert({
        type: 'warning',
        message: 'Por favor responde al menos una pregunta',
        show: true,
      });
      return;
    }

    // Combinamos las preguntas y respuestas
    const responsesCombined = {};
    questionnaire.ui_schema.elements.forEach((question) => {
      const questionId = question.scope.split('/').pop();  // Obtenemos el ID de la pregunta
      responsesCombined[questionId] = {
        question: question.label,  // Usamos el label de la pregunta
        response: formData[questionId],  // Tomamos la respuesta del formData
      };
    });

    // Enviar las respuestas a través de WebSocket
    sendWebSocketMessage({
      action: 'submit-questionnaire',
      message: {
        questionnaireId: questionnaire.id,
        responses: formData,
        questionnaireTitle: questionnaire.title,
        timestamp: new Date().toISOString() // Añadimos timestamp
      }
    });

    // Llamada API para guardar las respuestas en la base de datos
    try {
      const response = await axios.post(
        `${getApiBaseUrl()}/api/questionnaires/${questionnaire.id}/responses/create/`,  // Endpoint con el ID del cuestionario
        {
          room_code: roomCode,  // Código de la sala
          responses: responsesCombined,  // Solo enviamos las respuestas combinadas
          notes: '',  // Aquí puedes añadir notas si es necesario
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Incluimos el token JWT en la cabecera
            'Content-Type': 'application/json',  // Indicamos que el cuerpo es JSON
          },
        }
      );

      setAlert({
        type: 'success',
        message: 'Respuestas guardadas correctamente',
        show: true,
      });

    } catch (error) {
      console.error(error);
      setAlert({
        type: 'error',
        message: error.response?.data?.error || 'Error guardando las respuestas',
        show: true,
      });
    }

    // Cerramos el modal
    onClose();
  };

  return (
    <div className={styles.questionnaireModal}>
      {/* Mostrar alert si está activo */}
      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ ...alert, show: false })}  // Cerrar el alert
        />
      )}

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
          onChange={({ data }) => setFormData(data)}  // Actualizamos el formData
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
