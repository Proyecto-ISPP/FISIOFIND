'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../Room.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faCalendar,
  faClock,
  faChevronDown,
  faChevronUp,
  faNotesMedical
} from '@fortawesome/free-solid-svg-icons';
import { getApiBaseUrl } from '@/utils/api';

const formatDate = (dt) => new Date(dt).toLocaleDateString();
const formatTime = (dt) => new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const PatientHistoryViewer = ({ patientId, token, onClose }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedAppointmentId, setExpandedAppointmentId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${getApiBaseUrl()}/api/app_user/patient/${patientId}/history/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(res.data.appointments || []);
      } catch (err) {
        setError('No se pudo cargar el historial del paciente');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [patientId, token]);

  const toggleExpand = (appointmentId) => {
    setExpandedAppointmentId(prev => prev === appointmentId ? null : appointmentId);
  };

  if (loading) return <div className={styles.loadingMessage}>Cargando historial clínico...</div>;
  if (error) return <div className={styles.errorMessage}>{error}</div>;

  return (
    <div className={styles.questionnaireTool}>
      <div className={styles.toolHeader}>
        <button onClick={onClose} className={styles.backButton}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h4>Historial del Paciente</h4>
      </div>

      {appointments.length === 0 ? (
        <div className={styles.emptyMessage}>No hay citas registradas para este paciente.</div>
      ) : (
        <div className={styles.questionnaireList}>
          {appointments.map((appt) => (
            <div key={appt.id} className={styles.questionnaireItem}>
              <div
                className={styles.questionnaireTitle}
                onClick={() => toggleExpand(appt.id)}
                style={{ cursor: 'pointer' }}
              >
                <FontAwesomeIcon icon={faCalendar} /> {formatDate(appt.start_time)} -{' '}
                <FontAwesomeIcon icon={faClock} /> {formatTime(appt.start_time)}{' '}
                ({appt.is_online ? 'Online' : 'Presencial'}) – {appt.service?.type || 'Sin tipo'}

                <span style={{ float: 'right' }}>
                  <FontAwesomeIcon icon={expandedAppointmentId === appt.id ? faChevronUp : faChevronDown} />
                </span>
              </div>

              {expandedAppointmentId === appt.id && (
                <div className={styles.questionnairePreview} style={{ marginTop: '0.5rem' }}>
                  <p><strong>Estado:</strong> {appt.status}</p>
                  <p><strong>Duración del servicio:</strong> {appt.service?.duration || '-'} minutos</p>

                  {appt.questionnaire_responses && appt.questionnaire_responses.length > 0 ? (
                    appt.questionnaire_responses.map((qr, idx) => (
                      <div key={qr.id || idx} style={{ marginTop: '1rem', padding: '0.8rem', background: '#f9f9f9', borderRadius: '8px' }}>
                        <h5><FontAwesomeIcon icon={faNotesMedical} /> Cuestionario #{qr.questionnaire_id}</h5>
                        <p><strong>Notas:</strong> {qr.notes || '—'}</p>
                        <p><strong>Fecha:</strong> {formatDate(qr.created_at)}</p>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                          {qr.responses && Object.entries(qr.responses).map(([qKey, qObj]) => (
                            <li key={qKey} style={{ marginBottom: '0.5rem' }}>
                              <strong>{qObj.question}:</strong> {qObj.response}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <p>No hay respuestas de cuestionario asociadas a esta cita.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientHistoryViewer;

