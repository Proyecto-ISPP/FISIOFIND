import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useAppointment } from '@/context/appointmentContext';
import { QuestionaryResponse } from '@/lib/definitions';


export interface ServiceQuestionaryRef {
  validateQuestionaryAndContinue: () => boolean;
}

const ServiceQuestionary = forwardRef<ServiceQuestionaryRef>((props, ref) => {
  const { state, dispatch } = useAppointment();
  const appointmentData = state.appointmentData;
  const questionary = appointmentData.service.questionary;
  
  // Inicializar con las respuestas existentes o un objeto vacío
  const [responses, setResponses] = useState<QuestionaryResponse>(
    appointmentData.questionaryResponses || {}
  );
  
  // Estado para los errores de validación
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Estado para indicar si se intentó enviar el formulario
  const [attempted, setAttempted] = useState(false);
  

    // Exponer el método de validación al componente padre
    useImperativeHandle(ref, () => ({
      validateQuestionaryAndContinue: () => {
        setAttempted(true);
        const isValid = validateForm();
        
        dispatch({
          type: 'SET_QUESTIONARY_COMPLETE',
          payload: isValid
        });
        
        if (!isValid) {
          // Hacer scroll al primer error
          const firstErrorField = document.querySelector('.error-field');
          if (firstErrorField) {
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
        
        return isValid;
      }
    }));


  // Memoizar la función validateForm para evitar recrearla en cada render
  const validateForm = useCallback(() => {
    const newErrors: {[key: string]: string} = {};
    let isValid = true;
    
    if (questionary && questionary.elements) {
      questionary.elements.forEach(element => {
        const propertyName = getPropertyNameFromScope(element.scope);
        const value = responses[propertyName];
        
        // Verificar si está vacío (todos los campos son requeridos)
        if (!value || value.trim() === '') {
          newErrors[propertyName] = 'Este campo es obligatorio';
          isValid = false;
          return;
        }
        
        // Validaciones específicas por tipo
        if (element.type === 'Control') {
          if (value.length > 150) {
            newErrors[propertyName] = 'El texto no puede exceder los 150 caracteres';
            isValid = false;
          }
        } else if (element.type === 'Number') {
          if (!/^[0-9]+(\.[0-9]+)?$/.test(value)) {
            newErrors[propertyName] = 'Debe ingresar un valor numérico';
            isValid = false;
          }
        }
      });
    }
    
    setErrors(newErrors);
    return isValid;
  }, [questionary, responses]);
  
  // Función para extraer el nombre de propiedad desde el scope
  const getPropertyNameFromScope = (scope: string) => {
    // Formato típico: "#/properties/propertyName"
    const parts = scope.split('/');
    return parts[parts.length - 1];
  };
  
  // Calcular si el cuestionario está completo
  const calculateIsComplete = useCallback(() => {
    if (!questionary || !questionary.elements) return false;
    
    return questionary.elements.every(element => {
      const propertyName = getPropertyNameFromScope(element.scope);
      return !!responses[propertyName] && responses[propertyName].trim() !== '';
    }) && Object.keys(errors).length === 0;
  }, [questionary, responses, errors]);
  
  // Actualizar el contexto cuando cambien las respuestas
  useEffect(() => {
    // Actualizar las respuestas en el contexto
    dispatch({
      type: 'UPDATE_QUESTIONARY_RESPONSES',
      payload: responses
    });
    
    // Si ya se intentó enviar, validar en cada cambio
    if (attempted) {
      validateForm();
    }
  }, [responses, dispatch, attempted, validateForm]);
  

  // Efecto separado para actualizar el estado de completitud
  useEffect(() => {
    const isComplete = calculateIsComplete();
    
    dispatch({
      type: 'SET_QUESTIONARY_COMPLETE',
      payload: isComplete
    });
  }, [responses, errors, calculateIsComplete, dispatch]);


  // Si no hay cuestionario, mostramos un mensaje
  if (!questionary || !questionary.elements || questionary.elements.length === 0) {
    return <div className="text-gray-500">No hay cuestionario para este servicio.</div>;
  }

  const handleInputChange = (propertyName: string, value: string, type: string = 'Control') => {
    // Actualizar respuestas
    setResponses(prev => ({ ...prev, [propertyName]: value }));
    
    // Validar el campo actual si ya se ha intentado enviar
    if (attempted) {
      // Limpiar error previo para este campo
      const newErrors = { ...errors };
      
      // Validación de campo requerido
      if (!value || value.trim() === '') {
        newErrors[propertyName] = 'Este campo es obligatorio';
      } else {
        // Validaciones específicas por tipo
        if (type === 'Control') {
          if (value.length > 150) {
            newErrors[propertyName] = 'El texto no puede exceder los 150 caracteres';
          } else {
            delete newErrors[propertyName];
          }
        } else if (type === 'Number') {
          if (!/^[0-9]+(\.[0-9]+)?$/.test(value)) {
            newErrors[propertyName] = 'Debe ingresar un valor numérico';
          } else {
            delete newErrors[propertyName];
          }
        } else {
          delete newErrors[propertyName];
        }
      }
      
      setErrors(newErrors);
    }
  };


  const renderElement = (element: { type: string; scope: string; label: string }) => {
    const propertyName = getPropertyNameFromScope(element.scope);
    const hasError = !!errors[propertyName];
    const errorClass = hasError ? 'error-field' : '';
    
    if (element.type === 'Control') {
      // Check if this is the physical activity field
      const isPhysicalActivityField = 
        element.label.toLowerCase().includes('actividad física') || 
        propertyName.toLowerCase().includes('physical_activity') ||
        propertyName.toLowerCase().includes('actividad_fisica');
      
      return (
        <div className={`form-field ${errorClass}`} key={propertyName}>
          <label>
            {element.label}
            <span className="required">*</span>

            {isPhysicalActivityField && (
              <div className="relative inline-block group">
                <div className="cursor-help inline-flex align-middle ml-1">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="#1C274C"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M12 17V11"
                      stroke="#1C274C"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="1"
                      cy="1"
                      r="1"
                      transform="matrix(1 0 0 -1 11 9)"
                      fill="#1C274C"
                    />
                  </svg>
                </div>
                <div className="absolute bottom-full right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[100] mb-2">
                  <div className="bg-gray-700 text-white text-xs rounded py-2 px-3 w-72 shadow-lg">
                    <b>Nula</b> implica no salir de casa o tener movilidad alguna. <br/>
                    <b>Baja</b> implica cualquier actividad diaria. <br/>
                    <b>Moderada</b> implica realizar ejercicio activo varias veces en semana. <br/>
                    <b>Elevada</b> implica sesiones de ejercicio prologadas casi todos los días de la semana. 
                  </div>
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-700 absolute top-full right-4 transform"></div>
                </div>
              </div>
            )}
          </label>
          <input
            type="text"
            name={propertyName}
            className={`form-input ${hasError ? "form-input-error" : ""}`}
            value={responses[propertyName] || ""}
            onChange={(e) =>
              handleInputChange(propertyName, e.target.value, "Control")
            }
            maxLength={150}
          />
          {hasError && (
            <p className="input-error-message">{errors[propertyName]}</p>
          )}
          <div className="character-counter">
            {responses[propertyName] ? responses[propertyName].length : 0}/150
          </div>
        </div>
      );
    } else if (element.type === 'Number') {
      return (
        <div className={`form-field ${errorClass}`} key={propertyName}>
          <label>
            {element.label}
            <span className="required">*</span>
          </label>
          <input 
            type="text"
            name={propertyName}
            className={`form-input ${hasError ? 'form-input-error' : ''}`}
            value={responses[propertyName] || ''}
            onChange={(e) => handleInputChange(propertyName, e.target.value, 'Number')}
            placeholder="Ingrese un valor numérico"
          />
          {hasError && <p className="input-error-message">{errors[propertyName]}</p>}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="questionary-container">
      <h3 className="questionary-title">{questionary.label || "Cuestionario"}</h3>
      
      {attempted && Object.keys(errors).length > 0 && (
        <div className="questionary-error-summary animated-error">
          <p>Por favor complete todos los campos requeridos</p>
          <ul>
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>{message}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="questionary-form">
        {questionary.elements.map(element => renderElement(element))}
      </div>
      
      <div className="important-notice">
        <p>Todos los campos marcados con <span className="required">*</span> son obligatorios.</p>
      </div>
    </div>
  );
});

// Asignar un displayName para facilitar la depuración
ServiceQuestionary.displayName = 'ServiceQuestionary';

export default ServiceQuestionary;