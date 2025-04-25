'use client';
import React, { useState, useEffect } from 'react';
import styles from '../Room.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faFilePdf, faCheckCircle, faSave, faStickyNote } from '@fortawesome/free-solid-svg-icons';
import Alert from '@/components/ui/Alert';
import axios from 'axios';
import { getApiBaseUrl } from '@/utils/api';
import jwt_decode from "jwt-decode";

const QuestionnaireResponseViewer = ({ responseData, onClose, questionnaire }) => {
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [savedNote, setSavedNote] = useState('');
  const [alert, setAlert] = useState(null);
  const [authToken, setAuthToken] = useState('');
  const [patientToken, setPatientToken] = useState('');

  useEffect(() => {
    // Obtener token del fisioterapeuta
    const therapistToken = localStorage.getItem('token');
    setAuthToken(therapistToken);

    // Obtener token del paciente desde responseData
    if (responseData?.patientToken) {
      setPatientToken(responseData.patientToken);
    }
  }, [responseData]);

  if (!responseData || !questionnaire) return null;

  const getQuestionText = (key) => {
    const questionIndex = parseInt(key.replace('q', '')) - 1;
    if (questionnaire.questions && questionIndex >= 0 && questionIndex < questionnaire.questions.length) {
      return questionnaire.questions[questionIndex].label;
    }
    return `Pregunta ${key}`;
  };

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
    setAlert({
      type: 'info',
      message: 'Función de exportación a PDF en desarrollo',
      onClose: () => setAlert(null)
    });
  };

  const toggleNotes = () => {
    setShowNotes(!showNotes);
    // Resetear texto si se cancela
    if (showNotes) setNoteText(savedNote);
  };

  const handleNoteChange = (e) => {
    setNoteText(e.target.value);
  };

  const saveNote = async () => {
    if (!noteText.trim()) {
      setAlert({
        type: 'warning',
        message: 'La nota no puede estar vacía',
        onClose: () => setAlert(null)
      });
      return;
    }

    try {
      const response = await axios.post(
        `${getApiBaseUrl()}/api/questionnaires/save-note/${questionnaire.id}/`,
        {
          patientToken,
          note: noteText
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        setSavedNote(noteText);
        setShowNotes(false);
        setAlert({
          type: 'success',
          message: 'Nota guardada correctamente',
          onClose: () => setAlert(null)
        });
        
        // Actualizar datos locales
        if (responseData[patientToken]) {
          responseData[patientToken].note = noteText;
        }
      }
    } catch (error) {
      console.error('Error guardando nota:', error);
      setAlert({
        type: 'error',
        message: 'Error al guardar la nota. Intente nuevamente.',
        onClose: () => setAlert(null)
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl mx-4 overflow-hidden">
        {alert && (
          <Alert 
            type={alert.type} 
            message={alert.message} 
            onClose={alert.onClose} 
          />
        )}
        
        <div className="flex justify-between items-center p-5 bg-gray-50 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">
            Respuestas: {questionnaire.title}
          </h3>
          <div className="flex space-x-2">
            <button 
              onClick={handleExportPDF} 
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" 
              title="Exportar a PDF"
            >
              <FontAwesomeIcon icon={faFilePdf} />
            </button>
            <button 
              onClick={onClose} 
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" 
              title="Cerrar"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>
        
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-200">
            <div className="text-gray-600">
              <span>Respondido: {new Date(responseData.timestamp).toLocaleString()}</span>
            </div>
            <div className="flex items-center text-green-600">
              <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
              <span>Completo</span>
            </div>
          </div>
          
          <div className="space-y-4 mb-8">
            {Object.keys(responseData.responses).map(key => (
              <div key={key} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="font-medium text-gray-700 mb-2">
                  {getQuestionText(key)}
                </div>
                <div className="text-gray-800">
                  {formatAnswer(key, responseData.responses[key].response)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-4 border-t border-gray-200">
            {!showNotes && !savedNote && (
              <button 
                onClick={toggleNotes}
                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
              >
                <FontAwesomeIcon icon={faStickyNote} className="mr-2" />
                Añadir nota
              </button>
            )}
            
            {showNotes && (
              <div className="mt-4 p-5 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-3">Notas del fisioterapeuta:</h4>
                <textarea 
                  value={noteText}
                  onChange={handleNoteChange}
                  placeholder="Escribe tus notas o diagnóstico aquí..."
                  className="w-full p-3 border border-blue-300 rounded-md min-h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-end mt-3 space-x-3">
                  <button 
                    onClick={() => setShowNotes(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={saveNote}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
                  >
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    Guardar nota
                  </button>
                </div>
              </div>
            )}
            
            {savedNote && !showNotes && (
              <div className="mt-4 p-5 bg-blue-50 border-l-4 border-blue-500 rounded-md">
                <h4 className="font-semibold text-blue-800 mb-2">Nota del fisioterapeuta:</h4>
                <p className="text-gray-800 mb-3">{savedNote}</p>
                <button 
                  onClick={toggleNotes} 
                  className="text-blue-600 hover:text-blue-800 flex items-center transition-colors"
                >
                  <FontAwesomeIcon icon={faStickyNote} className="mr-1" />
                  Editar nota
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireResponseViewer;