import React, { useState, useEffect } from 'react';
import { useAppointment } from '@/context/appointmentContext';
import { QuestionaryResponse } from '@/lib/definitions';

const ServiceQuestionary: React.FC = () => {
  const { state, dispatch } = useAppointment();
  const appointmentData = state.appointmentData;
  const questionary = appointmentData.service.questionary;
  
  // Inicializar con las respuestas existentes o un objeto vacío
  const [responses, setResponses] = useState<QuestionaryResponse>(
    appointmentData.questionaryResponses || {}
  );
  
  // Actualizar el contexto cuando cambien las respuestas
  useEffect(() => {
    dispatch({
      type: 'UPDATE_QUESTIONARY_RESPONSES',
      payload: responses
    });
  }, [responses, dispatch]);

  if (!questionary || !questionary.elements || questionary.elements.length === 0) {
    return <div className="text-gray-500">No hay cuestionario para este servicio.</div>;
  }

  const handleInputChange = (propertyName: string, value: string) => {
    setResponses(prev => ({ ...prev, [propertyName]: value }));
  };

  // Función para extraer el nombre de propiedad desde el scope
  const getPropertyNameFromScope = (scope: string) => {
    // Formato típico: "#/properties/propertyName"
    const parts = scope.split('/');
    return parts[parts.length - 1];
  };

  const renderElement = (element: { type: string; scope: string; label: string }) => {
    if (element.type === 'Control') {
      const propertyName = getPropertyNameFromScope(element.scope);
      
      return (
        <div className="mb-4" key={propertyName}>
          <label className="block text-gray-700 font-medium mb-2">{element.label}</label>
          <input 
            type="text"
            name={propertyName}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={responses[propertyName] || ''}
            onChange={(e) => handleInputChange(propertyName, e.target.value)}
          />
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">{questionary.label || "Cuestionario"}</h3>
      <div>
        {questionary.elements.map(element => renderElement(element))}
      </div>
    </div>
  );
};

export default ServiceQuestionary;