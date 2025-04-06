'use client';
import React, { useState, useEffect } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import styles from '../Room.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaperPlane, faTimes, faEdit, faTrash, 
  faPlus, faSave, faArrowLeft, faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { getApiBaseUrl } from '@/utils/api';

// Constante para el límite de caracteres
const CHARACTER_LIMIT = 75;

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
  const [questionnaires, setQuestionnaires] = useState([]);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
  const [editingQuestionnaire, setEditingQuestionnaire] = useState(null);
  const [mode, setMode] = useState('list');
  const [formData, setFormData] = useState({
    title: '',
    questions: [],
    newQuestion: { label: '', type: 'string', options: [] }
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para validaciones
  const [titleError, setTitleError] = useState('');
  const [questionErrors, setQuestionErrors] = useState({});
  const [newQuestionError, setNewQuestionError] = useState('');
  const [newOptionsError, setNewOptionsError] = useState('');

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${getApiBaseUrl()}/api/questionnaires/list/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuestionnaires(response.data);
      } catch (error) {
        console.error('Error fetching questionnaires:', error);
        addChatMessage('Error', 'No se pudieron cargar los cuestionarios');
      } finally {
        setIsLoading(false);
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
      // Resetear errores
      setTitleError('');
      setQuestionErrors({});
      setNewQuestionError('');
      setNewOptionsError('');
    }
  }, [editingQuestionnaire, mode]);

  const handleSendQuestionnaire = () => {
    if (!selectedQuestionnaire) {
      return addChatMessage('Error', 'No hay cuestionario seleccionado');
    }
    // Validar que el cuestionario tenga preguntas
    if (!selectedQuestionnaire.questions || selectedQuestionnaire.questions.length === 0) {
      return addChatMessage('Error', 'El cuestionario no tiene preguntas');
    }
  
    sendWebSocketMessage({
      action: 'send-questionnaire',
      message: {
        questionnaireId: selectedQuestionnaire.id,
        questionnaire: selectedQuestionnaire
      }
    });
    
    addChatMessage('Sistema', `Cuestionario "${selectedQuestionnaire.title}" enviado al paciente`);
    setMode('list'); // Volver a la lista después de enviar
  };

  // Validadores
  const validateTitle = (title) => {
    if (!title.trim()) {
      setTitleError('El título no puede estar vacío');
      return false;
    }
    if (title.length > CHARACTER_LIMIT) {
      setTitleError(`El título no puede exceder los ${CHARACTER_LIMIT} caracteres`);
      return false;
    }
    setTitleError('');
    return true;
  };

  const validateQuestion = (question, index) => {
    const errors = {};
    
    if (!question.label.trim()) {
      errors.label = 'La pregunta no puede estar vacía';
    } else if (question.label.length > CHARACTER_LIMIT) {
      errors.label = `La pregunta no puede exceder los ${CHARACTER_LIMIT} caracteres`;
    }
    
    if (question.type === 'select') {
      const validOptions = question.options.filter(opt => opt.trim() !== '');
      if (validOptions.length === 0) {
        errors.options = 'Debe proporcionar al menos una opción válida';
      } else if (validOptions.length !== question.options.filter(opt => opt !== '').length) {
        errors.options = 'No se permiten opciones vacías';
      }
    }
    
    // Actualizar estado de errores
    setQuestionErrors(prev => ({
      ...prev,
      [index]: errors
    }));
    
    return Object.keys(errors).length === 0;
  };

  const validateOptions = (options) => {
    const validOptions = options.filter(opt => opt.trim() !== '');
    
    if (options.length > 0 && validOptions.length === 0) {
      setNewOptionsError('Debe proporcionar al menos una opción válida');
      return false;
    }
    
    if (validOptions.length !== options.filter(opt => opt !== '').length) {
      setNewOptionsError('No se permiten opciones vacías');
      return false;
    }
    
    setNewOptionsError('');
    return true;
  };

  const validateNewQuestion = () => {
    const { newQuestion } = formData;
    
    if (!newQuestion.label.trim()) {
      setNewQuestionError('La pregunta no puede estar vacía');
      return false;
    }
    
    if (newQuestion.label.length > CHARACTER_LIMIT) {
      setNewQuestionError(`La pregunta no puede exceder los ${CHARACTER_LIMIT} caracteres`);
      return false;
    }
    
    if (newQuestion.type === 'select') {
      return validateOptions(newQuestion.options);
    }
    
    setNewQuestionError('');
    return true;
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, title: value }));
    validateTitle(value);
  };

  const handleNewQuestionChange = (e) => {
    const value = e.target.value;
    if (value.length <= CHARACTER_LIMIT) {
      setFormData(prev => ({
        ...prev,
        newQuestion: { ...prev.newQuestion, label: value }
      }));
      if (value.trim()) {
        setNewQuestionError('');
      }
    }
  };

  const handleNewQuestionTypeChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      newQuestion: { 
        ...prev.newQuestion, 
        type: value,
        options: value === 'select' ? prev.newQuestion.options : []
      }
    }));
  };

  const handleNewOptionsChange = (e) => {
    const inputValue = e.target.value;
    const rawOptions = inputValue.split(',');
    const trimmedOptions = rawOptions.map(opt => opt.trim());
    
    setFormData(prev => ({
      ...prev,
      newQuestion: { ...prev.newQuestion, options: trimmedOptions }
    }));
    
    validateOptions(trimmedOptions);
  };

  const handleAddQuestion = () => {
    if (!validateNewQuestion()) return;
    
    // Limpiar opciones vacías si es tipo select
    const newQuestion = { ...formData.newQuestion };
    if (newQuestion.type === 'select') {
      newQuestion.options = newQuestion.options.filter(opt => opt.trim() !== '');
    }
    
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
      newQuestion: { label: '', type: 'string', options: [] }
    }));
    
    setNewQuestionError('');
    setNewOptionsError('');
  };

  const handleUpdateQuestion = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    
    if (field === 'label' && value.length > CHARACTER_LIMIT) {
      return; // No permitir exceder el límite de caracteres
    }
    
    if (field === 'options') {
      // Convertir string separado por comas a array
      if (typeof value === 'string') {
        value = value.split(',').map(opt => opt.trim());
      }
    }
    
    updatedQuestions[index][field] = value;
    setFormData(prev => ({ ...prev, questions: updatedQuestions }));
    
    // Validar la pregunta actualizada
    validateQuestion(updatedQuestions[index], index);
  };

  const handleDeleteQuestion = (index) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
    
    // Eliminar errores asociados a esta pregunta
    setQuestionErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[index];
      
      // Reindexar los errores para que coincidan con los nuevos índices
      const reindexedErrors = {};
      Object.keys(newErrors).forEach(key => {
        const numKey = parseInt(key);
        if (numKey > index) {
          reindexedErrors[numKey - 1] = newErrors[key];
        } else {
          reindexedErrors[key] = newErrors[key];
        }
      });
      
      return reindexedErrors;
    });
  };

  const validateAllQuestions = () => {
    let isValid = true;
    const newErrors = {};
    
    // Validar todas las preguntas
    formData.questions.forEach((question, index) => {
      if (!validateQuestion(question, index)) {
        isValid = false;
        newErrors[index] = {
          label: question.label.trim() === '' ? 'La pregunta no puede estar vacía' : '',
          options: question.type === 'select' && 
                    (question.options.filter(opt => opt.trim() !== '').length === 0) ? 
                    'Debe proporcionar al menos una opción válida' : ''
        };
      }
    });
    
    setQuestionErrors(newErrors);
    return isValid;
  };

  const handleSaveQuestionnaire = async () => {
    // Validación previa (se mantiene igual)
    const isTitleValid = validateTitle(formData.title);
    
    if (formData.questions.length === 0) {
      addChatMessage('Sistema', 'Debes agregar al menos una pregunta');
      return;
    }
    
    const areQuestionsValid = validateAllQuestions();
    
    if (!isTitleValid || !areQuestionsValid) {
      addChatMessage('Sistema', 'Por favor, corrige los errores antes de guardar');
      return;
    }
  
    // Limpiar las opciones vacías en todas las preguntas
    const cleanedQuestions = formData.questions.map(q => {
      if (q.type === 'select') {
        return { ...q, options: q.options.filter(opt => opt.trim() !== '') };
      }
      return q;
    });
  
    const questionnaireData = {
      title: formData.title,
      json_schema: {
        type: 'object',
        properties: cleanedQuestions.reduce((props, q, index) => {
          props[`q${index + 1}`] = q.type === 'select' 
            ? { type: 'string', enum: q.options } 
            : { type: q.type };
          return props;
        }, {})
      },
      ui_schema: {
        type: 'Group',
        label: formData.title,
        elements: cleanedQuestions.map((q, index) => ({
          type: 'Control',
          label: q.label,
          scope: `#/properties/q${index + 1}`
        }))
      },
      questions: cleanedQuestions
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
      
      // Manejo mejorado de errores
      let errorMessage = 'No se pudo guardar el cuestionario';
      
      // Extraer mensaje de error específico de la respuesta del backend
      if (error.response && error.response.data) {
        if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.title) {
          errorMessage = `Error en el título: ${error.response.data.title}`;
          setTitleError(error.response.data.title);
        } else if (error.response.data.questions) {
          errorMessage = `Error en preguntas: ${error.response.data.questions}`;
          // Podrías actualizar questionErrors aquí si tienes información sobre qué pregunta específica falló
        } else if (typeof error.response.data === 'object') {
          // Intentar extraer el primer mensaje de error disponible
          const firstErrorKey = Object.keys(error.response.data)[0];
          if (firstErrorKey) {
            errorMessage = `${firstErrorKey}: ${error.response.data[firstErrorKey]}`;
          }
        }
      }
      
      addChatMessage('Error', errorMessage);
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

  // Helper para estilos de error
  const errorStyle = {
    color: 'red',
    fontSize: '12px',
    marginTop: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  };

  const errorIconStyle = {
    marginRight: '4px'
  };

  const inputErrorStyle = {
    border: '1px solid red'
  };

  const charCountStyle = (length) => ({
    fontSize: '12px', 
    textAlign: 'right', 
    color: length > CHARACTER_LIMIT * 0.8 ? 'orange' : 'gray',
    marginTop: '2px'
  });

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

          {isLoading ? (
            <div className={styles.loadingMessage}>Cargando cuestionarios...</div>
          ) : (
            <>
              <button 
                onClick={() => {
                  setEditingQuestionnaire(null);
                  setFormData({
                    title: '',
                    questions: [],
                    newQuestion: { label: '', type: 'string', options: [] }
                  });
                  setTitleError('');
                  setQuestionErrors({});
                  setNewQuestionError('');
                  setNewOptionsError('');
                  setMode('create');
                }}
                className={styles.actionButton}
              >
                <FontAwesomeIcon icon={faPlus} /> Nuevo Cuestionario
              </button>

              <div className={styles.questionnaireList}>
                {questionnaires.length === 0 ? (
                  <div className={styles.emptyMessage}>
                    No hay cuestionarios creados. Crea uno nuevo para empezar.
                  </div>
                ) : (
                  questionnaires.map(q => (
                    <div 
                      key={q.id} 
                      className={`${styles.questionnaireItem} ${
                        selectedQuestionnaire?.id === q.id ? styles.selected : ''
                      }`}
                      onClick={() => {
                        setSelectedQuestionnaire(q);
                        setMode('view');
                      }}
                    >
                      <div className={styles.questionnaireTitle}>
                        {q.title}
                        <div className={styles.questionnaireMeta}>
                          <span>{q.questions?.length || 0} preguntas</span>
                        </div>
                      </div>
                      <div className={styles.questionnaireActions}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingQuestionnaire(q);
                            setMode('edit');
                          }}
                          className={styles.iconButton}
                          title="Editar"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteQuestionnaire(q.id);
                          }}
                          className={styles.iconButton}
                          title="Eliminar"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
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
              onChange={handleTitleChange}
              className={`${styles.inputField} ${titleError ? styles.inputError : ''}`}
              placeholder="Ej: Evaluación de dolor"
              style={titleError ? inputErrorStyle : {}}
              maxLength={CHARACTER_LIMIT}
            />
            <div style={charCountStyle(formData.title.length)}>
              {formData.title.length}/{CHARACTER_LIMIT}
            </div>
            {titleError && (
              <div style={errorStyle}>
                <FontAwesomeIcon icon={faExclamationCircle} style={errorIconStyle} />
                {titleError}
              </div>
            )}
          </div>

          <div className={styles.questionsSection}>
            <h5>Preguntas:</h5>
            
            <div className={styles.newQuestionForm}>
              <div className={styles.formGroup}>
                <label>Nueva pregunta:</label>
                <input
                  value={formData.newQuestion.label}
                  onChange={handleNewQuestionChange}
                  className={`${styles.inputField} ${newQuestionError ? styles.inputError : ''}`}
                  placeholder="Ej: ¿Dónde sientes el dolor?"
                  style={newQuestionError ? inputErrorStyle : {}}
                  maxLength={CHARACTER_LIMIT}
                />
                <div style={charCountStyle(formData.newQuestion.label.length)}>
                  {formData.newQuestion.label.length}/{CHARACTER_LIMIT}
                </div>
                {newQuestionError && (
                  <div style={errorStyle}>
                    <FontAwesomeIcon icon={faExclamationCircle} style={errorIconStyle} />
                    {newQuestionError}
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Tipo de respuesta:</label>
                <select
                  value={formData.newQuestion.type}
                  onChange={handleNewQuestionTypeChange}
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
                    onChange={handleNewOptionsChange}
                    className={`${styles.inputField} ${newOptionsError ? styles.inputError : ''}`}
                    placeholder="Ej: Leve, Moderado, Severo"
                    style={newOptionsError ? inputErrorStyle : {}}
                  />
                  {newOptionsError && (
                    <div style={errorStyle}>
                      <FontAwesomeIcon icon={faExclamationCircle} style={errorIconStyle} />
                      {newOptionsError}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleAddQuestion}
                className={styles.addButton}
                disabled={!formData.newQuestion.label.trim() || 
                        (formData.newQuestion.type === 'select' && 
                         formData.newQuestion.options.filter(o => o.trim()).length === 0)}
              >
                Añadir pregunta
              </button>
            </div>

            <div className={styles.questionsList}>
              {formData.questions.length === 0 ? (
                <div className={styles.emptyMessage}>
                  No hay preguntas añadidas. Añade al menos una pregunta para guardar el cuestionario.
                </div>
              ) : (
                formData.questions.map((q, index) => (
                  <div key={index} className={styles.questionItem}>
                    <div className={styles.questionControls}>
                      <div style={{ width: '100%' }}>
                        <input
                          value={q.label}
                          onChange={(e) => handleUpdateQuestion(index, 'label', e.target.value)}
                          className={`${styles.inputField} ${questionErrors[index]?.label ? styles.inputError : ''}`}
                          style={questionErrors[index]?.label ? inputErrorStyle : {}}
                          maxLength={CHARACTER_LIMIT}
                        />
                        <div style={charCountStyle(q.label.length)}>
                          {q.label.length}/{CHARACTER_LIMIT}
                        </div>
                        {questionErrors[index]?.label && (
                          <div style={errorStyle}>
                            <FontAwesomeIcon icon={faExclamationCircle} style={errorIconStyle} />
                            {questionErrors[index].label}
                          </div>
                        )}
                      </div>

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
                        <div style={{ width: '100%' }}>
                          <input
                            value={q.options.join(',')}
                            onChange={(e) => handleUpdateQuestion(index, 'options', e.target.value)}
                            className={`${styles.inputField} ${questionErrors[index]?.options ? styles.inputError : ''}`}
                            placeholder="Opciones"
                            style={questionErrors[index]?.options ? inputErrorStyle : {}}
                          />
                          {questionErrors[index]?.options && (
                            <div style={errorStyle}>
                              <FontAwesomeIcon icon={faExclamationCircle} style={errorIconStyle} />
                              {questionErrors[index].options}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <button
                        onClick={() => handleDeleteQuestion(index)}
                        className={styles.deleteQuestionButton}
                        title="Eliminar pregunta"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={handleSaveQuestionnaire}
            className={`${styles.actionButton} ${styles.primaryAction}`}
            disabled={!formData.title.trim() || formData.questions.length === 0}
          >
            <FontAwesomeIcon icon={faSave} /> {mode === 'edit' ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionnaireTool;