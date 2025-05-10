'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faCalendar,
  faClock,
  faChevronDown,
  faChevronUp,
  faNotesMedical,
  faFileAlt,
  faLocationDot,
  faVideoCamera
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

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="text-[#05668D] text-lg">Cargando historial clínico...</div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
      {error}
    </div>
  );

  return (
    <div className="bg-[rgb(238, 251, 250)] rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-[#05668D] to-[#6BC9BE] p-4 text-white flex items-center">
        <button onClick={onClose} className="mr-4 hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h4 className="font-bold text-xl">Historial del Paciente</h4>
      </div>

      {appointments.length === 0 ? (
        <div className="p-6 text-center text-gray-600">
          No hay citas registradas para este paciente.
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {appointments.map((appt) => (
            <div key={appt.id} className="border-b border-gray-200 last:border-0">
              <div
                className="p-4 hover:bg-white hover:bg-opacity-50 transition-colors cursor-pointer flex justify-between items-center"
                onClick={() => toggleExpand(appt.id)}
              >
                <div className="flex items-center space-x-2">
                  <span className="bg-[#05AC9C] bg-opacity-20 p-2 rounded-full text-[#05AC9C]">
                    <FontAwesomeIcon icon={faCalendar} />
                  </span>
                  <div>
                    <div className="font-medium text-[#253240]">
                      {formatDate(appt.start_time)} - {formatTime(appt.start_time)}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center space-x-2">
                      <span className="flex items-center">
                        {appt.is_online ? (
                          <FontAwesomeIcon icon={faVideoCamera} className="text-[#41B8D5] mr-1" />
                        ) : (
                          <FontAwesomeIcon icon={faLocationDot} className="text-[#41B8D5] mr-1" />
                        )}
                        {appt.is_online ? 'Online' : 'Presencial'}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span>{appt.service?.type || 'Sin tipo'}</span>
                    </div>
                  </div>
                </div>
                <FontAwesomeIcon
                  icon={expandedAppointmentId === appt.id ? faChevronUp : faChevronDown}
                  className="text-gray-400"
                />
              </div>

              {expandedAppointmentId === appt.id && (
                <div className="p-4 bg-white bg-opacity-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-sm text-gray-600">Estado</div>
                      <div className="font-medium text-[#253240]">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          appt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          appt.status === 'booked' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {appt.status === 'confirmed' ? 'Confirmada' :
                           appt.status === 'booked' ? 'Reservada' :
                           appt.status}
                        </span>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-sm text-gray-600">Duración</div>
                      <div className="font-medium text-[#253240]">{appt.service?.duration || '-'} minutos</div>
                    </div>
                  </div>

                  {appt.questionnaire_responses && appt.questionnaire_responses.length > 0 ? (
                    <div className="space-y-4">
                      {appt.questionnaire_responses.map((qr, idx) => (
                        <div key={qr.id || idx} className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-[#41B8D5]">
                          <div className="flex items-center mb-3">
                            <span className="bg-[#41B8D5] bg-opacity-20 p-2 rounded-full text-[#41B8D5] mr-3">
                              <FontAwesomeIcon icon={faFileAlt} />
                            </span>
                            <h5 className="font-bold text-[#253240]">
                              {qr.questionnaire_title || `Cuestionario #${qr.questionnaire_id}`}
                            </h5>
                          </div>
                          
                          {qr.notes && (
                            <div className="mb-3 bg-[#f0f9fa] p-3 rounded-md">
                              <div className="text-sm text-gray-600 mb-1">Notas</div>
                              <div className="text-[#253240]">{qr.notes}</div>
                            </div>
                          )}
                          
                          <div className="text-sm text-gray-500 mb-3">
                            Completado el {formatDate(qr.created_at)} a las {formatTime(qr.created_at)}
                          </div>
                          
                          {qr.responses && Object.entries(qr.responses).length > 0 ? (
                            <div className="border-t border-gray-100 pt-3 mt-3">
                              <div className="text-sm font-medium text-[#05AC9C] mb-2">Respuestas</div>
                              <div className="space-y-2">
                                {Object.entries(qr.responses).map(([qKey, qObj]) => (
                                  <div key={qKey} className="bg-[#f0f9fa] p-3 rounded-md">
                                    <div className="text-sm text-gray-600 mb-1">{qObj.question}</div>
                                    <div className="text-[#253240]">{qObj.response}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center text-gray-500 py-2">
                              No hay respuestas registradas
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500 bg-white rounded-lg shadow-sm">
                      No hay respuestas de cuestionario asociadas a esta cita.
                    </div>
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