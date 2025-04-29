'use client';
import React, { useEffect, useState } from 'react';
import QuestionnaireBuilder from './Cuestionarios';
import axios from 'axios';
import { getApiBaseUrl } from '@/utils/api';

type Questionnaire = {
  id: string;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonSchema: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  uiSchema: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  questions: any[]; // Para poder editar después
};

interface ModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Componente Modal con estilos mejorados
const ConfirmationModal: React.FC<ModalProps> = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
        <h3 className="text-xl font-bold text-[#05668D] mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button 
            onClick={onCancel} 
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm} 
            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [editingQuestionnaire, setEditingQuestionnaire] = useState<Questionnaire | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [questionnaireToDelete, setQuestionnaireToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${getApiBaseUrl()}/api/questionnaires/list/`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setQuestionnaires(response.data);
      } catch (error) {
        console.error('Error fetching questionnaires:', error);
      }
    };
  
    fetchQuestionnaires();
  }, []);

  const addOrUpdateQuestionnaire = (newQ: Questionnaire) => {
    if (editingQuestionnaire) {
      setQuestionnaires((prev) =>
        prev.map((q) => (q.id === editingQuestionnaire.id ? newQ : q))
      );
      setEditingQuestionnaire(null);
    } else {
      setQuestionnaires((prev) => [...prev, newQ]);
    }
  };

  const handleRequestDelete = (id: string) => {
    if (editingQuestionnaire && editingQuestionnaire.id === id) {
      setQuestionnaireToDelete(id);
      setShowModal(true);
    } else {
      deleteQuestionnaire(id);
    }
  };

  const deleteQuestionnaire = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${getApiBaseUrl()}/api/questionnaires/${id}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setQuestionnaires((prev) => prev.filter((q) => q.id !== id));
      
      if (editingQuestionnaire && editingQuestionnaire.id === id) {
        setEditingQuestionnaire(null);
      }
    } catch (error) {
      console.error('Error deleting questionnaire:', error);
      alert('Error al eliminar el cuestionario');
    } finally {
      setShowModal(false);
      setQuestionnaireToDelete(null);
    }
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
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: "rgb(238, 251, 250)" }}
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#05668D] mb-6">
          Generador de Cuestionarios
        </h1>

        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
          <QuestionnaireBuilder
            addQuestionnaire={addOrUpdateQuestionnaire}
            editingQuestionnaire={editingQuestionnaire}
            onCancelEdit={handleCancelEdit}
          />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold text-[#05668D] mb-4">
            Cuestionarios Generados
          </h3>

          {questionnaires.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No hay cuestionarios creados todavía
            </p>
          ) : (
            <ul className="space-y-3">
              {questionnaires.map((q) => (
                <li
                  key={q.id}
                  className={`p-4 border rounded-xl transition-all duration-300 ${
                    editingQuestionnaire && editingQuestionnaire.id === q.id
                      ? "bg-gradient-to-br from-[#f8fdfc] to-[#edf8f7] border-[#6BC9BE]"
                      : "bg-white border-gray-200 hover:border-[#6BC9BE] hover:shadow-md"
                  }`}
                >
                  <div className="flex flex-wrap justify-between items-center gap-3">
                    <div className="flex-grow">
                      <h4 className="font-semibold text-[#05668D] break-words pr-2">
                        {q.title}
                      </h4>
                      {editingQuestionnaire &&
                        editingQuestionnaire.id === q.id && (
                          <span className="text-sm text-[#6BC9BE] font-medium">
                            (Actualmente en edición)
                          </span>
                        )}
                    </div>
                    <div className="flex space-x-2 flex-shrink-0">
                      <button
                        onClick={() => editQuestionnaire(q)}
                        className="px-4 py-2 bg-gradient-to-r from-[#41B8D5] to-[#1E5ACD] text-white font-medium rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#6BC9BE] focus:ring-offset-2 transition-all duration-300 shadow-sm"
                      >
                        Ver/Editar
                      </button>
                      <button
                        onClick={() => handleRequestDelete(q.id)}
                        className={`px-4 py-2 rounded-xl transition-all duration-300 shadow-sm ${
                          editingQuestionnaire &&
                          editingQuestionnaire.id === q.id
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-red-500 text-white hover:bg-red-600"
                        }`}
                        disabled={
                          !!editingQuestionnaire &&
                          editingQuestionnaire.id === q.id
                        }
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
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
    </div>
  );
}

export default App;