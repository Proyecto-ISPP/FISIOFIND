'use client';
import React, { useState, useEffect } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import styles from '../Room.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaperPlane, faTimes, faEdit, faTrash, 
  faPlus, faSave, faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { getApiBaseUrl } from '@/utils/api';

const questionTypes = [
  { value: 'string', label: 'Texto' },
  { value: 'number', label: 'Número' },
  { value: 'select', label: 'Selección' },
];

const QuestionnaireTool = ({ 
  initialQuestionnaires = [],
  sendWebSocketMessage,
  addChatMessage,
  onClose,
  token
}) => {
  const [questionnaires, setQuestionnaires] = useState(initialQuestionnaires);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
  const [editingQuestionnaire, setEditingQuestionnaire] = useState(null);
  const [mode, setMode] = useState('list'); // 'list', 'view', 'edit', 'create'
  const [formData, setFormData] = useState({
    title: '',
    questions: [],
    newQuestion: { label: '', type: 'string', options: [] }
  });

  // Cargar cuestionarios
  useEffect(() => {
    const fetchQuestionnaires = async () => {
      try {
        const response = await axios.get(`${getApiBaseUrl()}/api/questionnaires/list/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuestionnaires(response.data);
      } catch (error) {
        console.error('Error fetching questionnaires:', error);
      }
    };
    fetchQuestionnaires();
  }, [token]);

  // Inicializar formulario de edición
  useEffect(() => {
    if (editingQuestionnaire && mode === 'edit') {
      setFormData({
        title: editingQuestionnaire.title,
        questions: editingQuestionnaire.questions || [],
        newQuestion: { label: '', type: 'string', options: [] }
      });
    }
  }, [editingQuestionnaire, mode]);

  const handleSendQuestionnaire = () => {
    sendWebSocketMessage({
      action: 'send-questionnaire',
      message: {
        questionnaireId: selectedQuestionnaire.id,
        questionnaire: selectedQuestionnaire
      }
    });
    addChatMessage('Sistema', `Cuestionario "${selectedQuestionnaire.title}" enviado al paciente`);
  };

  const handleAddQuestion = () => {
    if (!formData.newQuestion.label.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, prev.newQuestion],
      newQuestion: { label: '', type: 'string', options: [] }
    }));
  };

  const handleUpdateQuestion = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][field] = value;
    setFormData(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const handleDeleteQuestion = (index) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleSaveQuestionnaire = async () => {
    if (!formData.title.trim() || formData.questions.length === 0) {
      return addChatMessage('Sistema', 'Debes completar todos los campos requeridos');
    }

    const questionnaireData = {
      title: formData.title,
      json_schema: {
        type: 'object',
        properties: formData.questions.reduce((props, q, index) => {
          props[`q${index + 1}`] = q.type === 'select' 
            ? { type: 'string', enum: q.options } 
            : { type: q.type };
          return props;
        }, {})
      },
      ui_schema: {
        type: 'Group',
        label: formData.title,
        elements: formData.questions.map((q, index) => ({
          type: 'Control',
          label: q.label,
          scope: `#/properties/q${index + 1}`
        }))
      },
      questions: formData.questions
    };

    try {
      let response;
      if (mode === 'edit') {
        response = await axios.put(
          `${getApiBaseUrl()}/api/questionnaires/${editingQuestionnaire.id}/`,
          questionnaireData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        response = await axios.post(
          `${getApiBaseUrl()}/api/questionnaires/create/`,
          questionnaireData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setQuestionnaires(prev => 
        mode === 'edit' 
          ? prev.map(q => q.id === editingQuestionnaire.id ? response.data : q)
          : [...prev, response.data]
      );

      setMode('list');
      addChatMessage('Sistema', `Cuestionario ${mode === 'edit' ? 'actualizado' : 'creado'} correctamente`);
    } catch (error) {
      console.error('Error saving questionnaire:', error);
      addChatMessage('Error', 'No se pudo guardar el cuestionario');
    }
  };

  const handleDeleteQuestionnaire = async (id) => {
    try {
      await axios.delete(`${getApiBaseUrl()}/api/questionnaires/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestionnaires(prev => prev.filter(q => q.id !== id));
      if (selectedQuestionnaire?.id === id) setSelectedQuestionnaire(null);
      addChatMessage('Sistema', 'Cuestionario eliminado');
    } catch (error) {
      console.error('Error deleting questionnaire:', error);
    }
  };

  return (
    <div className={styles.questionnaireTool}>
      {mode === 'list' && (
        <>
          <div className={styles.toolHeader}>
            <h4>Cuestionarios</h4>
            <button onClick={onClose} className={styles.closeButton}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <button 
            onClick={() => {
              setEditingQuestionnaire(null);
              setFormData({
                title: '',
                questions: [],
                newQuestion: { label: '', type: 'string', options: [] }
              });
              setMode('create');
            }}
            className={styles.actionButton}
          >
            <FontAwesomeIcon icon={faPlus} /> Nuevo Cuestionario
          </button>

          <div className={styles.questionnaireList}>
            {questionnaires.map(q => (
              <div 
                key={q.id} 
                className={`${styles.questionnaireItem} ${
                  selectedQuestionnaire?.id === q.id ? styles.selected : ''
                }`}
              >
                <div 
                  className={styles.questionnaireTitle}
                  onClick={() => {
                    setSelectedQuestionnaire(q);
                    setMode('view');
                  }}
                >
                  {q.title}
                </div>
                <div className={styles.questionnaireActions}>
                  <button 
                    onClick={() => {
                      setEditingQuestionnaire(q);
                      setMode('edit');
                    }}
                    className={styles.iconButton}
                    title="Editar"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button 
                    onClick={() => handleDeleteQuestionnaire(q.id)}
                    className={styles.iconButton}
                    title="Eliminar"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {(mode === 'view' && selectedQuestionnaire) && (
        <div className={styles.viewContainer}>
          <div className={styles.viewHeader}>
            <button 
              onClick={() => setMode('list')}
              className={styles.backButton}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <h4>{selectedQuestionnaire.title}</h4>
          </div>

          <div className={styles.questionnairePreview}>
            <JsonForms
              schema={selectedQuestionnaire.json_schema}
              uischema={selectedQuestionnaire.ui_schema}
              data={{}}
              renderers={materialRenderers}
              cells={materialCells}
              readonly={true}
            />
          </div>

          <button
            onClick={handleSendQuestionnaire}
            className={`${styles.actionButton} ${styles.primaryAction}`}
          >
            <FontAwesomeIcon icon={faPaperPlane} /> Enviar al paciente
          </button>
        </div>
      )}

      {(mode === 'create' || mode === 'edit') && (
        <div className={styles.editContainer}>
          <div className={styles.editHeader}>
            <button 
              onClick={() => setMode('list')}
              className={styles.backButton}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <h4>{mode === 'edit' ? 'Editar Cuestionario' : 'Nuevo Cuestionario'}</h4>
          </div>

          <div className={styles.formGroup}>
            <label>Título del cuestionario:</label>
            <input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className={styles.inputField}
              placeholder="Ej: Evaluación de dolor"
            />
          </div>

          <div className={styles.questionsSection}>
            <h5>Preguntas:</h5>
            
            <div className={styles.newQuestionForm}>
              <div className={styles.formGroup}>
                <label>Nueva pregunta:</label>
                <input
                  value={formData.newQuestion.label}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    newQuestion: { ...prev.newQuestion, label: e.target.value }
                  }))}
                  className={styles.inputField}
                  placeholder="Ej: ¿Dónde sientes el dolor?"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Tipo de respuesta:</label>
                <select
                  value={formData.newQuestion.type}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    newQuestion: { ...prev.newQuestion, type: e.target.value }
                  }))}
                  className={styles.selectField}
                >
                  {questionTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {formData.newQuestion.type === 'select' && (
                <div className={styles.formGroup}>
                  <label>Opciones (separadas por comas):</label>
                  <input
                    value={formData.newQuestion.options.join(',')}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      newQuestion: { 
                        ...prev.newQuestion, 
                        options: e.target.value.split(',') 
                      }
                    }))}
                    className={styles.inputField}
                    placeholder="Ej: Leve, Moderado, Severo"
                  />
                </div>
              )}

              <button
                onClick={handleAddQuestion}
                className={styles.addButton}
              >
                Añadir pregunta
              </button>
            </div>

            <div className={styles.questionsList}>
              {formData.questions.map((q, index) => (
                <div key={index} className={styles.questionItem}>
                  <div className={styles.questionControls}>
                    <input
                      value={q.label}
                      onChange={(e) => handleUpdateQuestion(index, 'label', e.target.value)}
                      className={styles.inputField}
                    />
                    <select
                      value={q.type}
                      onChange={(e) => handleUpdateQuestion(index, 'type', e.target.value)}
                      className={styles.selectField}
                    >
                      {questionTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                    {q.type === 'select' && (
                      <input
                        value={q.options.join(',')}
                        onChange={(e) => handleUpdateQuestion(index, 'options', e.target.value.split(','))}
                        className={styles.inputField}
                        placeholder="Opciones"
                      />
                    )}
                    <button
                      onClick={() => handleDeleteQuestion(index)}
                      className={styles.deleteQuestionButton}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSaveQuestionnaire}
            className={`${styles.actionButton} ${styles.primaryAction}`}
            disabled={!formData.title || formData.questions.length === 0}
          >
            <FontAwesomeIcon icon={faSave} /> {mode === 'edit' ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionnaireTool;