import React, { useState, useEffect } from 'react';
import styles from '../Room.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';

// Importaciones de SurveyJS
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';;
import { SurveyCreatorComponent, SurveyCreator } from 'survey-creator-react';
import 'survey-creator-core/survey-creator-core.min.css';

const Cuestionarios = () => {
  const [activeView, setActiveView] = useState('lista'); // 'lista', 'crear', 'completar'
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [surveyResults, setSurveyResults] = useState(null);
  const [creator, setCreator] = useState(null);
  
  // Crear instancia del survey creator una vez al montar el componente
  useEffect(() => {
    const creatorInstance = new SurveyCreator({
      showLogicTab: true,
      isAutoSave: true
    });
    
    // JSON por defecto
    creatorInstance.text = JSON.stringify({
      title: "Nuevo Cuestionario",
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "text",
              name: "nombre",
              title: "Nombre completo del paciente:"
            },
            {
              type: "number",
              name: "peso",
              title: "Peso (kg):",
              min: 0,
              max: 300
            }
          ]
        }
      ]
    });
    
    setCreator(creatorInstance);
  }, []);
  
  // Definición del modelo de encuesta simple
  const simpleSurveyJson = {
    title: "Evaluación Básica",
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "text",
            name: "nombre",
            title: "Nombre completo del paciente:",
            isRequired: true
          },
          {
            type: "number",
            name: "peso",
            title: "Peso (kg):",
            isRequired: true,
            min: 0,
            max: 300
          }
        ]
      }
    ]
  };

  // Lista de encuestas predefinidas
  const [cuestionarios, setCuestionarios] = useState([
    {
      id: 1,
      title: "Evaluación Inicial Lumbalgia",
      date: "15/01/2025",
      uses: 24,
      description: "Evaluación completa para pacientes con dolor lumbar incluyendo EVA y test funcionales.",
      json: simpleSurveyJson
    },
    {
      id: 2,
      title: "Seguimiento Rehabilitación",
      date: "03/02/2025",
      uses: 18,
      description: "Cuestionario de seguimiento mensual para evaluar progreso en el tratamiento.",
      json: simpleSurveyJson
    },
    {
      id: 3,
      title: "Satisfacción Tratamiento",
      date: "20/02/2025",
      uses: 7,
      description: "Encuesta de satisfacción para pacientes que finalizan el tratamiento.",
      json: simpleSurveyJson
    }
  ]);

  // Función para manejar la completación de la encuesta
  const completeSurvey = (sender) => {
    const results = JSON.stringify(sender.data);
    console.log(results);
    setSurveyResults(results);
    setActiveView('lista');
    alert("Encuesta completada. Gracias por tu participación.");
  };

  // Función para guardar la encuesta creada
  const saveSurvey = () => {
    if (creator) {
      try {
        const surveyJSON = JSON.parse(creator.text);
        const newSurvey = {
          id: Date.now(),
          title: surveyJSON.title || "Nuevo Cuestionario",
          date: new Date().toLocaleDateString('es-ES'),
          uses: 0,
          description: "Nuevo cuestionario personalizado.",
          json: surveyJSON
        };
        
        setCuestionarios([...cuestionarios, newSurvey]);
        setActiveView('lista');
      } catch (error) {
        console.error("Error al guardar la encuesta:", error);
        alert("Error al guardar la encuesta. Por favor, inténtelo de nuevo.");
      }
    }
  };

  // Función para cargar un cuestionario en el editor
  const editSurvey = (survey) => {
    if (creator && survey) {
      try {
        creator.text = JSON.stringify(survey.json);
        setActiveView('crear');
      } catch (error) {
        console.error("Error al cargar la encuesta para editar:", error);
        alert("Error al cargar la encuesta para editar. Por favor, inténtelo de nuevo.");
      }
    }
  };

  // Ya no necesitamos la función renderActiveView porque ahora manejamos
  // la renderización directamente en el return usando condicionales

  // Estilos inline para mejorar la visualización
  const inlineStyles = {
    toolPanel: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    },
    creatorContainer: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden'
    },
    surveyCreator: {
      flex: 1,
      minHeight: '500px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      marginBottom: '10px'
    },
    surveyContainer: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    },
    actionButtons: {
      marginTop: '10px',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '10px'
    }
  };
  
  return (
    <div className={styles.toolPanel} style={inlineStyles.toolPanel}>
      {activeView === 'crear' ? (
        <div style={inlineStyles.creatorContainer}>
          <h4>Crear/Editar Cuestionario</h4>
          {creator && (
            <div style={inlineStyles.surveyCreator}>
              <SurveyCreatorComponent creator={creator} />
            </div>
          )}
          <div style={inlineStyles.actionButtons}>
            <button 
              className={`${styles.actionButton} ${styles.secondaryAction}`}
              onClick={() => setActiveView('lista')}
            >
              Cancelar
            </button>
            <button 
              className={`${styles.actionButton} ${styles.primaryAction}`}
              onClick={saveSurvey}
            >
              Guardar Cuestionario
            </button>
          </div>
        </div>
      ) : activeView === 'completar' ? (
        <div style={inlineStyles.surveyContainer}>
          <h4>Completar Cuestionario: {selectedSurvey?.title || 'Evaluación Básica'}</h4>
          <Survey 
            model={new Model(selectedSurvey?.json || simpleSurveyJson)} 
            onComplete={completeSurvey}
          />
          <button 
            className={`${styles.actionButton} ${styles.secondaryAction}`}
            onClick={() => setActiveView('lista')}
            style={{ marginTop: '10px' }}
          >
            Volver a la lista
          </button>
        </div>
      ) : (
        <>
          <h4>Mis Cuestionarios Personalizados</h4>
          <div className={styles.cuestionariosActions}>
            <button 
              className={`${styles.actionButton} ${styles.primaryAction}`}
              onClick={() => setActiveView('crear')}
            >
              <FontAwesomeIcon icon={faClipboard} /> Crear Nuevo
            </button>
            <div className={styles.sortOptions}>
              <label>Ordenar por:</label>
              <select className={styles.sortSelect}>
                <option>Recientes</option>
                <option>Alfabético</option>
                <option>Más usados</option>
              </select>
            </div>
          </div>

          <div className={styles.cuestionariosList}>
            {cuestionarios.map(item => (
              <div className={styles.cuestionarioItem} key={item.id}>
                <div className={styles.cuestionarioInfo}>
                  <h5>{item.title}</h5>
                  <div className={styles.cuestionarioMeta}>
                    <span className={styles.cuestionarioDate}>Creado: {item.date}</span>
                    <span className={styles.cuestionarioUses}>Usos: {item.uses}</span>
                  </div>
                  <p className={styles.cuestionarioDesc}>
                    {item.description}
                  </p>
                </div>
                <div className={styles.cuestionarioActions}>
                  <button 
                    className={`${styles.actionButton} ${styles.smallButton}`}
                    onClick={() => {
                      setSelectedSurvey(item);
                      editSurvey(item);
                    }}
                  >
                    Editar
                  </button>
                  <button 
                    className={`${styles.actionButton} ${styles.primaryAction} ${styles.smallButton}`}
                    onClick={() => {
                      setSelectedSurvey(item);
                      setActiveView('completar');
                    }}
                  >
                    Enviar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      
      {/* Mostrar resultados si existen */}
      {surveyResults && (
        <div className={styles.resultsContainer} style={{ marginTop: '20px' }}>
          <h4>Resultados de la última encuesta:</h4>
          <pre style={{ maxHeight: '200px', overflow: 'auto', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
            {surveyResults}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Cuestionarios;