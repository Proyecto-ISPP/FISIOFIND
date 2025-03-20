'use client';
import React, { useEffect, useState } from 'react';

const QuestionnaireBuilder = ({ addQuestionnaire, editingQuestionnaire, onCancelEdit }) => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ label: '', type: 'string', options: [] });

  useEffect(() => {
    if (editingQuestionnaire) {
      setTitle(editingQuestionnaire.title);
      setQuestions(editingQuestionnaire.questions);
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
    
    // Si estamos en modo edición, notificar al componente padre
    if (editingQuestionnaire && onCancelEdit) {
      onCancelEdit();
    }
  }

  const generateQuestionnaire = () => {
    if (!title) return alert('Debes poner un título al cuestionario');
    if (questions.length === 0) return alert('Agrega al menos una pregunta');

    const id = editingQuestionnaire ? editingQuestionnaire.id : `q_${Date.now()}`;
    const properties = {};
    const elements = [];

    questions.forEach((q, index) => {
      const propertyName = `q${index + 1}`;
      properties[propertyName] = q.type === 'select' ? { type: 'string', enum: q.options } : { type: q.type };
      elements.push({ type: 'Control', label: q.label, scope: `#/properties/${propertyName}` });
    });

    const jsonSchema = { type: 'object', properties };
    const uiSchema = { type: 'Group', label: title, elements };

    addQuestionnaire({ id, title, jsonSchema, uiSchema, questions });
    setTitle('');
    setQuestions([]);
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
        onClick={generateQuestionnaire}
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
        {editingQuestionnaire ? 'Actualizar Cuestionario' : 'Generar Cuestionario'}
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
