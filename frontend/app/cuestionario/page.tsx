'use client';
import React, { useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import MyGroupRenderer, { myGroupTester } from './MyGroupRenderer';
import QuestionnaireBuilder from './Cuestionarios';

type Questionnaire = {
  id: string;
  title: string;
  jsonSchema: any;
  uiSchema: any;
  questions: any[]; // Para poder editar después
};

interface ModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Componente Modal simple
const ConfirmationModal: React.FC<ModalProps> = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '500px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
      }}>
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        <p>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button 
            onClick={onCancel} 
            style={{
              padding: '8px 16px',
              backgroundColor: '#f0f0f0',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm} 
            style={{
              padding: '8px 16px',
              backgroundColor: '#d32f2f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

const renderers = [
  ...materialRenderers,
  { tester: myGroupTester, renderer: MyGroupRenderer },
];

function App() {
  const [schema, setSchema] = useState({});
  const [uischema, setUischema] = useState({ type: 'Group', label: 'Cuestionario', elements: [] });
  const [data, setData] = useState({});
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [editingQuestionnaire, setEditingQuestionnaire] = useState<Questionnaire | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [questionnaireToDelete, setQuestionnaireToDelete] = useState<string | null>(null);

  const addOrUpdateQuestionnaire = (newQ: Questionnaire) => {
    if (editingQuestionnaire) {
      setQuestionnaires((prev) =>
        prev.map((q) => (q.id === editingQuestionnaire.id ? newQ : q))
      );
      setEditingQuestionnaire(null);
    } else {
      setQuestionnaires((prev) => [...prev, newQ]);
    }

    setSchema(newQ.jsonSchema);
    setUischema(newQ.uiSchema);
  };

  const handleRequestDelete = (id: string) => {
    if (editingQuestionnaire && editingQuestionnaire.id === id) {
      setQuestionnaireToDelete(id);
      setShowModal(true);
    } else {
      deleteQuestionnaire(id);
    }
  };

  const deleteQuestionnaire = (id: string) => {
    setQuestionnaires((prev) => prev.filter((q) => q.id !== id));
    
    if (editingQuestionnaire && editingQuestionnaire.id === id) {
      setEditingQuestionnaire(null);
    }

    setShowModal(false);
    setQuestionnaireToDelete(null);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setQuestionnaireToDelete(null);
  };

  const editQuestionnaire = (q: Questionnaire) => {
    setEditingQuestionnaire(q);
  };

  const handleCancelEdit = () => {
    setEditingQuestionnaire(null);
  };

  const questionnaireTitle = questionnaireToDelete 
    ? questionnaires.find(q => q.id === questionnaireToDelete)?.title || "este cuestionario"
    : "";

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>Generador de Cuestionarios</h1>

      <JsonForms
        schema={schema}
        uischema={uischema}
        data={data}
        onChange={({ data }) => setData(data)}
        renderers={renderers}
        cells={materialCells}
      />

      <QuestionnaireBuilder
        addQuestionnaire={addOrUpdateQuestionnaire}
        editingQuestionnaire={editingQuestionnaire}
        onCancelEdit={handleCancelEdit}
      />

      <div style={{ marginTop: '2rem' }}>
        <h3>Cuestionarios Generados:</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {questionnaires.map((q) => (
            <li key={q.id} style={{ 
              marginBottom: '12px',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: editingQuestionnaire && editingQuestionnaire.id === q.id ? '#f5f5f5' : 'transparent'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{q.title}</strong>
                  {editingQuestionnaire && editingQuestionnaire.id === q.id && (
                    <span style={{ color: '#1976d2', marginLeft: '10px', fontSize: '14px' }}>
                      (Actualmente en edición)
                    </span>
                  )}
                </div>
                <div>
                  <button 
                    onClick={() => editQuestionnaire(q)} 
                    style={{ 
                      marginLeft: '1rem',
                      padding: '6px 12px',
                      backgroundColor: '#1976d2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Ver/Editar
                  </button>
                  <button 
                    onClick={() => handleRequestDelete(q.id)} 
                    style={{ 
                      marginLeft: '0.5rem',
                      padding: '6px 12px',
                      backgroundColor: editingQuestionnaire && editingQuestionnaire.id === q.id ? '#ccc' : '#d32f2f',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: editingQuestionnaire && editingQuestionnaire.id === q.id ? 'not-allowed' : 'pointer'
                    }}
                    disabled={!!editingQuestionnaire && editingQuestionnaire.id === q.id}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal de confirmación */}
      {showModal && questionnaireToDelete && (
        <ConfirmationModal 
          title="¡Atención!"
          message={`Estás intentando eliminar "${questionnaireTitle}" mientras lo estás editando. Si continúas, perderás los cambios realizados y deberás crear un nuevo cuestionario.`}
          onConfirm={() => deleteQuestionnaire(questionnaireToDelete)}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}

export default App;