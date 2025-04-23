"use client";

import { Suspense, useEffect, useState } from "react";
import axios from "axios";
import Calendar from "@/components/ui/calendar";
import { getApiBaseUrl } from "@/utils/api";
import { CalendarProps } from "@/lib/definitions";
import { AppointmentModal } from "@/components/ui/appointment-modal";
import RestrictedAccess from "@/components/RestrictedAccess";

interface APIResponse {
  message: string;
  status: string;
}

export default function Home() {
  const [data, setData] = useState<APIResponse | null>(null);
  const [events, setEvents] = useState([]);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarProps | null>(null);
  const [editionMode, setEditionMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // State to track which status category is expanded
  const [expandedStatus, setExpandedStatus] = useState<string | null>(null);

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
    const fetchAppointments = async () => {
      if (!token) return;

      try {
        setIsLoading(true);

        // Obtener el rol del usuario
        const roleResponse = await axios.get(`${getApiBaseUrl()}/api/app_user/check-role/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userRole = roleResponse.data.user_role;
        setCurrentRole(userRole);

        // Obtener las citas según el rol
        const endpoint =
          userRole === "physiotherapist"
            ? `${getApiBaseUrl()}/api/appointment/physio/list/`
            : `${getApiBaseUrl()}/api/appointment/patient/list/`;

        const appointmentsResponse = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Procesar los datos según el rol
        const appointmentsData =
          userRole === "physiotherapist" ? appointmentsResponse.data.results : appointmentsResponse.data;

        // Transformar los datos para el calendario
        const transformedEvents = appointmentsData.map((event: any) => ({
          id: event.id,
          title:
            userRole === "physiotherapist"
              ? `${event.service.type} - ${event.patient_name || "Paciente"}`
              : `${event.service.type} - ${event.physiotherapist_name || "Fisioterapeuta"}`,
          start: event.start_time,
          end: event.end_time,
          description: event.description || "Sin descripción",
          allDay: event.allDay || false,
          status: event.status,
          service: {
            id: event.service.id,
            type: event.service.type,
            duration: event.service.duration,
            ...(userRole === "physiotherapist" &&
              event.service.questionaryResponses && {
                questionaryResponses: event.service.questionaryResponses,
              }),
          },
          alternatives: event.alternatives,
          patient: event.patient || "Paciente no identificado",
          physiotherapist: event.physiotherapist || "Fisioterapeuta no identificado",
        }));

        setEvents(transformedEvents);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData({ message: "Error al cargar las citas", status: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);

  const handleAlternativesSubmit = (
    alternatives: Record<string, { start: string; end: string }[]>
  ) => {
    if (!isClient || !token || !selectedEvent) return;

    axios
      .put(
        `${getApiBaseUrl()}/api/appointment/update/${selectedEvent.id}/`,
        {
          start_time: selectedEvent.start,
          end_time: selectedEvent.end,
          status: "pending",
          alternatives: alternatives,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        alert("La cita se actualizó correctamente.");
        setEditionMode(false);
        setSelectedEvent(null);
        fetchAppointments();
      })
      .catch((error) => {
        console.error("Error en la actualización de la cita:", error);
        alert("Hubo un problema con la conexión. Intenta nuevamente.");
      });
  };

  const fetchAppointments = () => {
    if (!token || !currentRole) return;

    const endpoint =
      currentRole === "physiotherapist"
        ? `${getApiBaseUrl()}/api/appointment/physio/list/`
        : `${getApiBaseUrl()}/api/appointment/patient/list/`;

    axios
      .get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const appointmentsData =
          currentRole === "physiotherapist" ? response.data.results : response.data;

        const transformedEvents = appointmentsData.map((event: any) => ({
          id: event.id,
          title:
            currentRole === "physiotherapist"
              ? `${event.service.type} - ${event.patient || "Paciente"}`
              : `${event.service.type} - ${event.physiotherapist || "Fisioterapeuta"}`,
          start: event.start_time,
          end: event.end_time,
          description: event.description || "Sin descripción",
          allDay: event.allDay || false,
          status: event.status,
          service: {
            id: event.service.id,
            type: event.service.type,
            duration: event.service.duration,
            ...(currentRole === "physiotherapist" &&
              event.service.questionaryResponses && {
                questionaryResponses: event.service.questionaryResponses,
              }),
          },
          alternatives: event.alternatives,
          patient: event.patient || "Paciente no identificado",
          physiotherapist: event.physiotherapist || "Fisioterapeuta no identificado",
        }));

        setEvents(transformedEvents);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setData({ message: "Error al cargar las citas", status: "error" });
      });
  };

  const handleCardHover = (eventId: string | null) => {
    setHoveredEventId(eventId);
  };

  // Group events by status
  const groupedEvents = {
    confirmed: events.filter((event: any) => event.status === "confirmed"),
    pending: events.filter((event: any) => event.status === "pending"),
    booked: events.filter((event: any) => event.status === "booked"),
    finished: events.filter((event: any) => event.status === "finished"),
  };

  // Toggle the expanded status
  const toggleStatus = (status: string) => {
    setExpandedStatus(expandedStatus === status ? null : status);
  };

  if (!token) {
    return (
      <RestrictedAccess message="Necesitas iniciar sesión para acceder tus citas" />
    );
  }

  return (
    <RestrictedAccess>
      <div className="container mx-auto px-4 py-8">
        <br />
        <br />
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis Citas</h1>

        {isLoading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-3/4">
              <Calendar
                events={events}
                handleAlternativesSubmit={handleAlternativesSubmit}
                setEditionMode={setEditionMode}
                editionMode={editionMode}
                setSelectedEvent={setSelectedEvent}
                selectedEvent={selectedEvent}
                isClient={isClient}
                token={token}
                currentRole={currentRole}
                hoveredEventId={hoveredEventId}
                setHoveredEventId={setHoveredEventId}
              />
            </div>

            <div className="w-full md:w-1/4">
              <h2 className="text-xl font-medium text-gray-700 mb-4">Eventos</h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                {events.length > 0 ? (
                  <div className="space-y-3">
                    {/* Confirmadas */}
                    <div>
                      <button
                        onClick={() => toggleStatus("confirmed")}
                        className="w-full text-left font-medium text-gray-800 flex items-center justify-between"
                      >
                        <span>Confirmadas ({groupedEvents.confirmed.length})</span>
                        <svg
                          className={`w-5 h-5 transform transition-transform ${
                            expandedStatus === "confirmed" ? "rotate-180" : ""
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      {expandedStatus === "confirmed" && (
                        <div className="mt-2 space-y-2">
                          {groupedEvents.confirmed.length > 0 ? (
                            groupedEvents.confirmed
                              .sort(
                                (a: any, b: any) =>
                                  new Date(a.start).getTime() - new Date(b.start).getTime()
                              )
                              .map((event: any) => (
                                <div
                                  key={event.id}
                                  className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                                  onMouseEnter={() => setHoveredEventId(event.title)}
                                  onMouseLeave={() => setHoveredEventId(null)}
                                  onClick={() => setSelectedEvent(event)}
                                >
                                  <h3 className="font-medium text-gray-800">{event.title}</h3>
                                  <div className="flex items-center text-sm text-gray-600 mt-1">
                                    <svg
                                      className="w-4 h-4 mr-1 text-gray-500"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <circle cx="12" cy="12" r="10"></circle>
                                      <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    {new Date(event.start).toLocaleString("es-ES", {
                                      weekday: "short",
                                      day: "numeric",
                                      month: "short",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </div>
                                  <div className="mt-2">
                                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                      Confirmada
                                    </span>
                                    {currentRole === "physiotherapist" &&
                                      event.service &&
                                      event.service.questionaryResponses &&
                                      Object.keys(event.service.questionaryResponses).length > 0 && (
                                        <span className="inline-block ml-2 px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                                          Cuestionario
                                        </span>
                                      )}
                                  </div>
                                </div>
                              ))
                          ) : (
                            <p className="text-gray-500 text-sm">No hay citas confirmadas.</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Pendientes */}
                    <div>
                      <button
                        onClick={() => toggleStatus("pending")}
                        className="w-full text-left font-medium text-gray-800 flex items-center justify-between"
                      >
                        <span>Pendientes ({groupedEvents.pending.length})</span>
                        <svg
                          className={`w-5 h-5 transform transition-transform ${
                            expandedStatus === "pending" ? "rotate-180" : ""
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      {expandedStatus === "pending" && (
                        <div className="mt-2 space-y-2">
                          {groupedEvents.pending.length > 0 ? (
                            groupedEvents.pending
                              .sort(
                                (a: any, b: any) =>
                                  new Date(a.start).getTime() - new Date(b.start).getTime()
                              )
                              .map((event: any) => (
                                <div
                                  key={event.id}
                                  className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                                  onMouseEnter={() => setHoveredEventId(event.title)}
                                  onMouseLeave={() => setHoveredEventId(null)}
                                  onClick={() => setSelectedEvent(event)}
                                >
                                  <h3 className="font-medium text-gray-800">{event.title}</h3>
                                  <div className="flex items-center text-sm text-gray-600 mt-1">
                                    <svg
                                      className="w-4 h-4 mr-1 text-gray-500"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <circle cx="12" cy="12" r="10"></circle>
                                      <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    {new Date(event.start).toLocaleString("es-ES", {
                                      weekday: "short",
                                      day: "numeric",
                                      month: "short",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </div>
                                  <div className="mt-2">
                                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                      Pendiente
                                    </span>
                                    {currentRole === "physiotherapist" &&
                                      event.service &&
                                      event.service.questionaryResponses &&
                                      Object.keys(event.service.questionaryResponses).length > 0 && (
                                        <span className="inline-block ml-2 px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                                          Cuestionario
                                        </span>
                                      )}
                                  </div>
                                </div>
                              ))
                          ) : (
                            <p className="text-gray-500 text-sm">No hay citas pendientes.</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Reservadas */}
                    <div>
                      <button
                        onClick={() => toggleStatus("booked")}
                        className="w-full text-left font-medium text-gray-800 flex items-center justify-between"
                      >
                        <span>Reservadas ({groupedEvents.booked.length})</span>
                        <svg
                          className={`w-5 h-5 transform transition-transform ${
                            expandedStatus === "booked" ? "rotate-180" : ""
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      {expandedStatus === "booked" && (
                        <div className="mt-2 space-y-2">
                          {groupedEvents.booked.length > 0 ? (
                            groupedEvents.booked
                              .sort(
                                (a: any, b: any) =>
                                  new Date(a.start).getTime() - new Date(b.start).getTime()
                              )
                              .map((event: any) => (
                                <div
                                  key={event.id}
                                  className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                                  onMouseEnter={() => setHoveredEventId(event.title)}
                                  onMouseLeave={() => setHoveredEventId(null)}
                                  onClick={() => setSelectedEvent(event)}
                                >
                                  <h3 className="font-medium text-gray-800">{event.title}</h3>
                                  <div className="flex items-center text-sm text-gray-600 mt-1">
                                    <svg
                                      className="w-4 h-4 mr-1 text-gray-500"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <circle cx="12" cy="12" r="10"></circle>
                                      <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    {new Date(event.start).toLocaleString("es-ES", {
                                      weekday: "short",
                                      day: "numeric",
                                      month: "short",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </div>
                                  <div className="mt-2">
                                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                                      Reservada
                                    </span>
                                    {currentRole === "physiotherapist" &&
                                      event.service &&
                                      event.service.questionaryResponses &&
                                      Object.keys(event.service.questionaryResponses).length > 0 && (
                                        <span className="inline-block ml-2 px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                                          Cuestionario
                                        </span>
                                      )}
                                  </div>
                                </div>
                              ))
                          ) : (
                            <p className="text-gray-500 text-sm">No hay citas reservadas.</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Finalizadas */}
                    <div>
                      <button
                        onClick={() => toggleStatus("finished")}
                        className="w-full text-left font-medium text-gray-800 flex items-center justify-between"
                      >
                        <span>Finalizadas ({groupedEvents.finished.length})</span>
                        <svg
                          className={`w-5 h-5 transform transition-transform ${
                            expandedStatus === "finished" ? "rotate-180" : ""
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      {expandedStatus === "finished" && (
                        <div className="mt-2 space-y-2">
                          {groupedEvents.finished.length > 0 ? (
                            groupedEvents.finished
                              .sort(
                                (a: any, b: any) =>
                                  new Date(a.start).getTime() - new Date(b.start).getTime()
                              )
                              .map((event: any) => (
                                <div
                                  key={event.id}
                                  className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                                  onMouseEnter={() => setHoveredEventId(event.title)}
                                  onMouseLeave={() => setHoveredEventId(null)}
                                  onClick={() => setSelectedEvent(event)}
                                >
                                  <h3 className="font-medium text-gray-800">{event.title}</h3>
                                  <div className="flex items-center text-sm text-gray-600 mt-1">
                                    <svg
                                      className="w-4 h-4 mr-1 text-gray-500"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <circle cx="12" cy="12" r="10"></circle>
                                      <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    {new Date(event.start).toLocaleString("es-ES", {
                                      weekday: "short",
                                      day: "numeric",
                                      month: "short",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </div>
                                  <div className="mt-2">
                                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                                      Finalizada
                                    </span>
                                    {currentRole === "physiotherapist" &&
                                      event.service &&
                                      event.service.questionaryResponses &&
                                      Object.keys(event.service.questionaryResponses).length > 0 && (
                                        <span className="inline-block ml-2 px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                                          Cuestionario
                                        </span>
                                      )}
                                  </div>
                                </div>
                              ))
                          ) : (
                            <p className="text-gray-500 text-sm">No hay citas finalizadas.</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">No tienes citas próximas</p>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedEvent && (
          <AppointmentModal
            selectedEvent={selectedEvent}
            currentRole={currentRole}
            setSelectedEvent={setSelectedEvent}
            setEditionMode={setEditionMode}
            isClient={isClient}
            token={token}
          />
        )}
      </div>

      {data && (
        <div className="mt-4 text-center p-4 bg-red-50 text-red-700 rounded-lg">
          <p className="text-lg font-semibold">{data.message}</p>
          <p>Por favor, intenta nuevamente más tarde.</p>
        </div>
      )}
    </RestrictedAccess>
  );
}