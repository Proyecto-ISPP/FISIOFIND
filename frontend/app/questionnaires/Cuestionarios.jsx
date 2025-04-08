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
  const CHARACTER_LIMIT = 75;

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

  // All validation functions remain unchanged
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

  // All handler functions remain unchanged
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

  // API handling functions remain unchanged
  const handleApiError = (error) => {
    console.error('API Error:', error);
    
    if (error.response && error.response.data) {
      // Para errores de validación
      if (typeof error.response.data === 'object') {
        // Revisar si hay errores específicos de campos
        const fieldErrors = [];
        
        for (const field in error.response.data) {
          if (Array.isArray(error.response.data[field])) {
            // Agregar cada error de campo
            error.response.data[field].forEach(msg => {
              fieldErrors.push(`${field}: ${msg}`);
            });
          } else if (typeof error.response.data[field] === 'string') {
            fieldErrors.push(`${field}: ${error.response.data[field]}`);
          }
        }
        
        // Si se encontraron errores específicos
        if (fieldErrors.length > 0) {
          alert(`Errores de validación:\n${fieldErrors.join('\n')}`);
          return;
        }
        
        // Si hay un mensaje de error general
        if (error.response.data.detail) {
          alert(`Error: ${error.response.data.detail}`);
          return;
        }
      }
      
      // Si no se pudo extraer un mensaje específico
      alert(`Error en la solicitud: ${JSON.stringify(error.response.data)}`);
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

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-[#05668D] mb-6">
        {editingQuestionnaire ? 'Editar Cuestionario' : 'Nuevo Cuestionario'}
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Título del cuestionario
        </label>
        <input
          placeholder="Título del cuestionario"
          value={title}
          onChange={handleTitleChange}
          className={`w-full px-4 py-3 border ${titleError ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#41B8D5] transition-all duration-300`}
          maxLength={CHARACTER_LIMIT}
        />
        {titleError && <div className="text-red-500 text-sm mt-1">{titleError}</div>}
        <div className={`text-xs text-right mt-1 ${title.length > CHARACTER_LIMIT * 0.8 ? 'text-orange-500' : 'text-gray-500'}`}>
          {title.length}/{CHARACTER_LIMIT}
        </div>
      </div>

      <div className="mb-8 p-5 bg-gradient-to-br from-[#f8fdfc] to-[#edf8f7] rounded-xl border border-gray-200">
        <h3 className="text-lg font-medium text-[#05668D] mb-4">Añadir nueva pregunta</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Texto de la pregunta
          </label>
          <input
            placeholder="Pregunta (Ej: ¿Dónde te duele?)"
            value={newQuestion.label}
            onChange={handleQuestionLabelChange}
            className={`w-full px-4 py-3 border ${questionError ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#41B8D5] transition-all duration-300`}
            maxLength={CHARACTER_LIMIT}
          />
          <div className={`text-xs text-right mt-1 ${newQuestion.label.length > CHARACTER_LIMIT * 0.8 ? 'text-orange-500' : 'text-gray-500'}`}>
            {newQuestion.label.length}/{CHARACTER_LIMIT}
          </div>
          {questionError && <div className="text-red-500 text-sm mt-1">{questionError}</div>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de respuesta
          </label>
          <select
            value={newQuestion.type}
            onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value, options: e.target.value === 'select' ? newQuestion.options : [] })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#41B8D5] transition-all duration-300 bg-white"
          >
            {questionTypes.map((qt) => (
              <option key={qt.value} value={qt.value}>{qt.label}</option>
            ))}
          </select>
        </div>

        {newQuestion.type === 'select' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Opciones de respuesta
            </label>
            <input
              placeholder="Opciones separadas por coma (Ej: Leve,Moderado,Severo)"
              value={newQuestion.options.join(',')}
              onChange={(e) => handleOptionsChange(e)}
              className={`w-full px-4 py-3 border ${optionsError ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#41B8D5] transition-all duration-300`}
            />
            {optionsError && <div className="text-red-500 text-sm mt-1">{optionsError}</div>}
          </div>
        )}

        <button
          onClick={addQuestion}
          className="mt-2 px-6 py-3 bg-[#05668D] text-white font-medium rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#6BC9BE] focus:ring-offset-2 transition-all duration-300 shadow-md flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Añadir pregunta
        </button>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-medium text-[#05668D] mb-4">Preguntas Añadidas:</h3>
        {questions.length === 0 ? (
          <p className="text-gray-500 italic text-center py-6 bg-gray-50 rounded-xl border border-gray-200">
            No hay preguntas añadidas. Añade al menos una pregunta para guardar el cuestionario.
          </p>
        ) : (
          <ul className="space-y-4">
            {questions.map((q, index) => (
              <li key={index} className="bg-gradient-to-br from-[#f8fdfc] to-[#edf8f7] p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pregunta #{index + 1}
                  </label>
                  <input
                    value={q.label}
                    onChange={(e) => updateQuestion(index, 'label', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#41B8D5] transition-all duration-300"
                    maxLength={CHARACTER_LIMIT}
                  />
                  <div className={`text-xs text-right mt-1 ${q.label.length > CHARACTER_LIMIT * 0.8 ? 'text-orange-500' : 'text-gray-500'}`}>
                    {q.label.length}/{CHARACTER_LIMIT}
                  </div>
                  <div id={`question-error-${index}`} className="text-red-500 text-sm mt-1"></div>
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de respuesta
                  </label>
                  <select
                    value={q.type}
                    onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#41B8D5] transition-all duration-300 bg-white"
                  >
                    {questionTypes.map((qt) => (
                      <option key={qt.value} value={qt.value}>{qt.label}</option>
                    ))}
                  </select>
                </div>
                
                {q.type === 'select' && (
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Opciones de respuesta
                    </label>
                    <input
                      placeholder="Opciones separadas por coma"
                      value={q.options.join(',')}
                      onChange={(e) => handleOptionsChange(e, index)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#41B8D5] transition-all duration-300"
                    />
                    <div id={`options-error-${index}`} className="text-red-500 text-sm mt-1"></div>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <button
                    onClick={() => deleteQuestion(index)}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap gap-3 justify-end">
        <button
          onClick={cancelQuestionnaire}
          className="px-6 py-3 bg-white border border-red-400 text-red-500 font-medium rounded-xl hover:bg-red-50 transition-all duration-300 shadow-sm"
        >
          Cancelar
        </button>
        <button
          onClick={saveQuestionnaire}
          className="px-6 py-3 bg-gradient-to-r from-[#6BC9BE] to-[#05668D] text-white font-medium rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#6BC9BE] focus:ring-offset-2 transition-all duration-300 shadow-md"
        >
          {editingQuestionnaire ? 'Actualizar Cuestionario' : 'Guardar Cuestionario'}
        </button>
      </div>
    </div>
  );
};

export default QuestionnaireBuilder;