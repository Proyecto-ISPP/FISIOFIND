'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getApiBaseUrl } from '@/utils/api';

const QuestionnaireBuilder = ({ addQuestionnaire, editingQuestionnaire, onCancelEdit }) => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ label: '', type: 'string', options: [] });
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState(null);
  const [titleError, setTitleError] = useState('');
  const [questionError, setQuestionError] = useState('');
  const [optionsError, setOptionsError] = useState('');

  // Constante para el límite de caracteres
  const CHARACTER_LIMIT = 255;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, [isClient]);

  useEffect(() => {
    if (editingQuestionnaire) {
      setTitle(editingQuestionnaire.title);
      setQuestions(editingQuestionnaire.questions || []);
    } else {
      setTitle('');
      setQuestions([]);
    }
  }, [editingQuestionnaire]);

  const questionTypes = [
    { value: 'string', label: 'Texto' },
    { value: 'number', label: 'Número' },
    { value: 'select', label: 'Selección' },
  ];

  const validateTitle = (value) => {
    if (!value.trim()) {
      setTitleError('El título no puede estar vacío');
      return false;
    }
    if (value.length > CHARACTER_LIMIT) {
      setTitleError(`El título no puede exceder los ${CHARACTER_LIMIT} caracteres`);
      return false;
    }
    setTitleError('');
    return true;
  };

  const validateQuestion = (question) => {
    if (!question.label.trim()) {
      setQuestionError('La pregunta no puede estar vacía');
      return false;
    }
    if (question.label.length > CHARACTER_LIMIT) {
      setQuestionError(`La pregunta no puede exceder los ${CHARACTER_LIMIT} caracteres`);
      return false;
    }
    
    // Validar opciones para preguntas de tipo selección
    if (question.type === 'select') {
      return validateOptions(question.options);
    }
    
    setQuestionError('');
    return true;
  };

  const validateOptions = (options) => {
    // Verificar que hay al menos una opción no vacía
    const validOptions = options.filter(opt => opt.trim() !== '');
    if (validOptions.length === 0) {
      setOptionsError('Debe proporcionar al menos una opción válida');
      return false;
    }
    
    // Verificar que no hay opciones vacías entre opciones válidas
    if (validOptions.length !== options.filter(opt => opt !== '').length) {
      setOptionsError('No se permiten opciones vacías');
      return false;
    }
    
    setOptionsError('');
    return true;
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    validateTitle(value);
  };

  const addQuestion = () => {
    if (!validateQuestion(newQuestion)) return;
    
    // Para preguntas de tipo select, limpiamos las opciones
    const cleanedQuestion = { ...newQuestion };
    if (cleanedQuestion.type === 'select') {
      cleanedQuestion.options = cleanedQuestion.options.filter(opt => opt.trim() !== '');
    }
    
    setQuestions((prev) => [...prev, cleanedQuestion]);
    setNewQuestion({ label: '', type: 'string', options: [] });
    setQuestionError('');
    setOptionsError('');
  };

  const handleQuestionLabelChange = (e) => {
    const value = e.target.value;
    if (value.length <= CHARACTER_LIMIT) {
      setNewQuestion({ ...newQuestion, label: value });
      if (value.trim()) {
        setQuestionError('');
      }
    }
  };

  const handleOptionsChange = (e, questionIndex = null) => {
    const inputValue = e.target.value;
    const rawOptions = inputValue.split(',');
    
    // Crear un arreglo de opciones, eliminando espacios en blanco al inicio y final
    const trimmedOptions = rawOptions.map(opt => opt.trim());
    
    if (questionIndex !== null) {
      // Actualizar opciones de una pregunta existente
      updateQuestion(questionIndex, 'options', trimmedOptions);
    } else {
      // Actualizar opciones de la nueva pregunta
      setNewQuestion({ ...newQuestion, options: trimmedOptions });
    }
    
    // Validar las opciones
    validateOptions(trimmedOptions);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    
    if (field === 'label' && value.length > CHARACTER_LIMIT) {
      return; // No permitir exceder el límite de caracteres
    }
    
    updated[index][field] = value;
    setQuestions(updated);
    
    // Validar según el campo que se está actualizando
    if (field === 'label') {
      if (!value.trim()) {
        const questionErrorElement = document.getElementById(`question-error-${index}`);
        if (questionErrorElement) {
          questionErrorElement.textContent = 'La pregunta no puede estar vacía';
        }
      }
    } else if (field === 'options') {
      const optionsErrorElement = document.getElementById(`options-error-${index}`);
      if (optionsErrorElement) {
        const isValid = validateOptions(value);
        if (!isValid && optionsErrorElement) {
          optionsErrorElement.textContent = 'Opciones inválidas';
        } else if (optionsErrorElement) {
          optionsErrorElement.textContent = '';
        }
      }
    }
  };

  const deleteQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const cancelQuestionnaire = () => {
    setTitle('');
    setQuestions([]);
    setNewQuestion({ label: '', type: 'string', options: [] });
    setTitleError('');
    setQuestionError('');
    setOptionsError('');
    if (editingQuestionnaire && onCancelEdit) {
      onCancelEdit();
    }
  };

  const handleApiError = (error) => {
    console.error('API Error:', error);
    if (error.response) {
      alert(`Error: ${error.response.data.detail || 'Ocurrió un error'}`);
    } else {
      alert('Error de conexión con el servidor');
    }
  };

  const createQuestionnaire = async (questionnaireData) => {
    try {
      const response = await axios.post(
        `${getApiBaseUrl()}/api/questionnaires/create/`,
        questionnaireData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const updateQuestionnaire = async (id, questionnaireData) => {
    try {
      const response = await axios.put(
        `${getApiBaseUrl()}/api/questionnaires/${id}/`,
        questionnaireData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const validateAllQuestions = () => {
    // Validar todas las preguntas antes de guardar
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      
      if (!q.label.trim()) {
        alert(`La pregunta #${i+1} no puede estar vacía`);
        return false;
      }
      
      if (q.label.length > CHARACTER_LIMIT) {
        alert(`La pregunta #${i+1} excede los ${CHARACTER_LIMIT} caracteres`);
        return false;
      }
      
      if (q.type === 'select') {
        const validOptions = q.options.filter(opt => opt.trim() !== '');
        if (validOptions.length === 0) {
          alert(`La pregunta #${i+1} debe tener al menos una opción válida`);
          return false;
        }
        
        if (validOptions.length !== q.options.filter(opt => opt !== '').length) {
          alert(`La pregunta #${i+1} tiene opciones inválidas`);
          return false;
        }
      }
    }
    
    return true;
  };

  const saveQuestionnaire = async () => {
    // Validar título
    if (!validateTitle(title)) {
      alert(titleError);
      return;
    }
    
    // Validar que haya preguntas
    if (questions.length === 0) {
      alert('Agrega al menos una pregunta');
      return;
    }
    
    // Validar todas las preguntas
    if (!validateAllQuestions()) {
      return;
    }

    // Preparar el esquema JSON
    const properties = {};
    const elements = [];

    questions.forEach((q, index) => {
      const propertyName = `q${index + 1}`;
      
      // Limpiar opciones vacías para preguntas de tipo select
      const cleanedOptions = q.type === 'select' 
        ? q.options.filter(opt => opt.trim() !== '') 
        : q.options;
      
      properties[propertyName] = q.type === 'select' 
        ? { type: 'string', enum: cleanedOptions } 
        : { type: q.type };
      
      elements.push({ type: 'Control', label: q.label, scope: `#/properties/${propertyName}` });
    });

    const jsonSchema = { type: 'object', properties };
    const uiSchema = { type: 'Group', label: title, elements };

    // Limpiar las opciones vacías en todas las preguntas
    const cleanedQuestions = questions.map(q => {
      if (q.type === 'select') {
        return { ...q, options: q.options.filter(opt => opt.trim() !== '') };
      }
      return q;
    });

    const questionnaireData = {
      title,
      json_schema: jsonSchema,
      ui_schema: uiSchema,
      questions: cleanedQuestions
    };

    try {
      if (editingQuestionnaire) {
        // Actualizar cuestionario existente
        const updatedQuestionnaire = await updateQuestionnaire(editingQuestionnaire.id, questionnaireData);
        addQuestionnaire({
          id: editingQuestionnaire.id,
          ...updatedQuestionnaire
        });
      } else {
        // Crear nuevo cuestionario
        const newQuestionnaire = await createQuestionnaire(questionnaireData);
        addQuestionnaire({
          id: newQuestionnaire.id,
          ...newQuestionnaire
        });
      }

      setTitle('');
      setQuestions([]);
      setTitleError('');
      setQuestionError('');
      setOptionsError('');
    } catch (error) {
      console.error('Error saving questionnaire:', error);
    }
  };

  const getErrorStyle = () => ({
    color: 'red',
    fontSize: '14px',
    marginTop: '5px'
  });

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '1rem' }}>{editingQuestionnaire ? 'Editar Cuestionario' : 'Nuevo Cuestionario'}</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input
          placeholder="Título del cuestionario"
          value={title}
          onChange={handleTitleChange}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            borderRadius: '8px',
            border: titleError ? '1px solid red' : '1px solid #ccc'
          }}
          maxLength={CHARACTER_LIMIT}
        />
        {titleError && <div style={getErrorStyle()}>{titleError}</div>}
        <div style={{ fontSize: '12px', textAlign: 'right', color: title.length > CHARACTER_LIMIT * 0.8 ? 'orange' : 'gray' }}>
          {title.length}/{CHARACTER_LIMIT}
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <input
          placeholder="Pregunta (Ej: ¿Dónde te duele?)"
          value={newQuestion.label}
          onChange={handleQuestionLabelChange}
          style={{
            marginRight: '1rem',
            padding: '12px',
            fontSize: '16px',
            borderRadius: '8px',
            border: questionError ? '1px solid red' : '1px solid #ccc',
            width: '100%'
          }}
          maxLength={CHARACTER_LIMIT}
        />
        <div style={{ fontSize: '12px', textAlign: 'right', color: newQuestion.label.length > CHARACTER_LIMIT * 0.8 ? 'orange' : 'gray' }}>
          {newQuestion.label.length}/{CHARACTER_LIMIT}
        </div>

        <select
          value={newQuestion.type}
          onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value, options: e.target.value === 'select' ? newQuestion.options : [] })}
          style={{
            padding: '12px',
            fontSize: '16px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            marginRight: '1rem',
            marginTop: '0.5rem'
          }}
        >
          {questionTypes.map((qt) => (
            <option key={qt.value} value={qt.value}>{qt.label}</option>
          ))}
        </select>

        {newQuestion.type === 'select' && (
          <div style={{ marginTop: '0.5rem' }}>
            <input
              placeholder="Opciones separadas por coma (Ej: Leve,Moderado,Severo)"
              value={newQuestion.options.join(',')}
              onChange={(e) => handleOptionsChange(e)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                borderRadius: '8px',
                border: optionsError ? '1px solid red' : '1px solid #ccc'
              }}
            />
            {optionsError && <div style={getErrorStyle()}>{optionsError}</div>}
          </div>
        )}

        {questionError && <div style={getErrorStyle()}>{questionError}</div>}

        <button
          onClick={addQuestion}
          style={{
            backgroundColor: '#1976d2',
            color: '#fff',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '0.5rem',
            fontSize: '16px'
          }}
        >
          Añadir pregunta
        </button>
      </div>

      <h3 style={{ fontSize: '20px', marginBottom: '1rem' }}>Preguntas Añadidas:</h3>
      {questions.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>No hay preguntas añadidas. Añade al menos una pregunta para guardar el cuestionario.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {questions.map((q, index) => (
            <li key={index} style={{
              backgroundColor: '#f9f9f9',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #ddd',
              marginBottom: '1rem'
            }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <input
                  value={q.label}
                  onChange={(e) => updateQuestion(index, 'label', e.target.value)}
                  style={{
                    marginRight: '1rem',
                    padding: '12px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    width: '100%'
                  }}
                  maxLength={CHARACTER_LIMIT}
                />
                <div style={{ fontSize: '12px', textAlign: 'right', color: q.label.length > CHARACTER_LIMIT * 0.8 ? 'orange' : 'gray' }}>
                  {q.label.length}/{CHARACTER_LIMIT}
                </div>
                <div id={`question-error-${index}`} style={getErrorStyle()}></div>
              </div>
              
              <select
                value={q.type}
                onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                style={{
                  padding: '12px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  marginRight: '1rem'
                }}
              >
                {questionTypes.map((qt) => (
                  <option key={qt.value} value={qt.value}>{qt.label}</option>
                ))}
              </select>
              
              {q.type === 'select' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <input
                    placeholder="Opciones (coma)"
                    value={q.options.join(',')}
                    onChange={(e) => handleOptionsChange(e, index)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '16px',
                      borderRadius: '8px',
                      border: '1px solid #ccc'
                    }}
                  />
                  <div id={`options-error-${index}`} style={getErrorStyle()}></div>
                </div>
              )}
              
              <button
                onClick={() => deleteQuestion(index)}
                style={{
                  backgroundColor: '#d32f2f',
                  color: '#fff',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginTop: '0.5rem'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b71c1c'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#d32f2f'}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
        <button
          onClick={saveQuestionnaire}
          style={{
            backgroundColor: '#2e7d32',
            color: '#fff',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px'
          }}
        >
          {editingQuestionnaire ? 'Actualizar Cuestionario' : 'Guardar Cuestionario'}
        </button>

        <button
          onClick={cancelQuestionnaire}
          style={{
            backgroundColor: '#d32f2f',
            color: '#fff',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default QuestionnaireBuilder;