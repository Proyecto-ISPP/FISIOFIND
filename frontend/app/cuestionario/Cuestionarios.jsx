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

  const addQuestion = () => {
    if (!newQuestion.label) return alert('La pregunta no puede estar vacía');
    setQuestions((prev) => [...prev, newQuestion]);
    setNewQuestion({ label: '', type: 'string', options: [] });
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const deleteQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const cancelQuestionnaire = () => {
    setTitle('');
    setQuestions([]);
    setNewQuestion({ label: '', type: 'string', options: [] });
    if (editingQuestionnaire && onCancelEdit) {
      onCancelEdit();
    }
  }

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

  const saveQuestionnaire = async () => {
    if (!title) return alert('Debes poner un título al cuestionario');
    if (questions.length === 0) return alert('Agrega al menos una pregunta');

    const properties = {};
    const elements = [];

    questions.forEach((q, index) => {
      const propertyName = `q${index + 1}`;
      properties[propertyName] = q.type === 'select' ? { type: 'string', enum: q.options } : { type: q.type };
      elements.push({ type: 'Control', label: q.label, scope: `#/properties/${propertyName}` });
    });

    const jsonSchema = { type: 'object', properties };
    const uiSchema = { type: 'Group', label: title, elements };

    const questionnaireData = {
      title,
      json_schema: jsonSchema,
      ui_schema: uiSchema,
      questions
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
    } catch (error) {
      console.error('Error saving questionnaire:', error);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '1rem' }}>{editingQuestionnaire ? 'Editar Cuestionario' : 'Nuevo Cuestionario'}</h2>

      <input
        placeholder="Título del cuestionario"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          marginBottom: '1rem',
          width: '100%',
          padding: '12px',
          fontSize: '16px',
          borderRadius: '8px',
          border: '1px solid #ccc'
        }}
      />

      <div style={{ marginBottom: '1rem' }}>
        <input
          placeholder="Pregunta (Ej: ¿Dónde te duele?)"
          value={newQuestion.label}
          onChange={(e) => setNewQuestion({ ...newQuestion, label: e.target.value })}
          style={{
            marginRight: '1rem',
            padding: '12px',
            fontSize: '16px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            width: '100%'
          }}
        />

        <select
          value={newQuestion.type}
          onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
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

        {newQuestion.type === 'select' && (
          <input
            placeholder="Opciones separadas por coma (Ej: Leve,Moderado,Severo)"
            value={newQuestion.options.join(',')}
            onChange={(e) => setNewQuestion({ ...newQuestion, options: e.target.value.split(',') })}
            style={{
              width: '100%',
              marginTop: '0.5rem',
              padding: '12px',
              fontSize: '16px',
              borderRadius: '8px',
              border: '1px solid #ccc'
            }}
          />
        )}

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
      <ul>
        {questions.map((q, index) => (
          <li key={index} style={{
            backgroundColor: '#f9f9f9',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #ddd',
            marginBottom: '1rem'
          }}>
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
            />
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
              <input
                placeholder="Opciones (coma)"
                value={q.options.join(',')}
                onChange={(e) => updateQuestion(index, 'options', e.target.value.split(','))}
                style={{
                  padding: '12px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  marginTop: '0.5rem'
                }}
              />
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
                marginLeft: '1rem'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b71c1c'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#d32f2f'}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

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
          fontSize: '16px',
          marginTop: '1rem'
        }}
      >
        {editingQuestionnaire ? 'Actualizar Cuestionario' : 'Guardar Cuestionario'}
      </button>

      <button
        onClick={cancelQuestionnaire}
        style={{
          backgroundColor: 'red',
          color: '#fff',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginTop: '0.5rem',
          marginLeft: '1rem',
          fontSize: '16px'
        }}
      >
        Cancelar
      </button>
    </div>
  );
};

export default QuestionnaireBuilder;
