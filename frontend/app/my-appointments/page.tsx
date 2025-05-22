"use client";

import { Suspense, useEffect, useState } from "react";
import axios from "axios";
import Calendar from "@/components/ui/calendar";
import { getApiBaseUrl } from "@/utils/api";
import { CalendarProps } from "@/lib/definitions";
import { AppointmentModal } from "@/components/ui/appointment-modal";
import { useRouter } from "next/navigation";
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
  const [selectedEvent, setSelectedEvent] = useState<CalendarProps | null>(
    null
  );
  const [editionMode, setEditionMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // State to track which status category is expanded
  const [expandedStatus, setExpandedStatus] = useState<string | null>(null);
  const router = useRouter();

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
        const roleResponse = await axios.get(
          `${getApiBaseUrl()}/api/app_user/check-role/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

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
          userRole === "physiotherapist"
            ? appointmentsResponse.data.results
            : appointmentsResponse.data;

        // Transformar los datos para el calendario
        const transformedEvents = appointmentsData.map((event: any) => ({
          id: event.id,
          title:
            userRole === "physiotherapist"
              ? `${event.service.type} - ${event.patient_name || "Paciente"}`
              : `${event.service.type} - ${
                  event.physiotherapist_name || "Fisioterapeuta"
                }`,
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
          physiotherapist:
            event.physiotherapist || "Fisioterapeuta no identificado",
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
          currentRole === "physiotherapist"
            ? response.data.results
            : response.data;

        const transformedEvents = appointmentsData.map((event: any) => ({
          id: event.id,
          title:
            currentRole === "physiotherapist"
              ? `${event.service.type} - ${event.patient || "Paciente"}`
              : `${event.service.type} - ${
                  event.physiotherapist || "Fisioterapeuta"
                }`,
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
          physiotherapist:
            event.physiotherapist || "Fisioterapeuta no identificado",
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

  const hasNoActiveEvents =
    !isLoading &&
    (events.length === 0 || events.every((evt) => evt.status === "finished"));
  console.log("No hay eventos activos:", hasNoActiveEvents);

  if (!token) {
    return (
      <RestrictedAccess message="Necesitas iniciar sesión para acceder tus citas" />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-24"></div>

        {/* Header with decorative elements */}
        <div className="relative mb-12">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

          <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600">
              Mis Citas
            </span>
          </h1>
          <p className="text-center text-gray-500 text-lg max-w-2xl mx-auto">
            Gestiona tus consultas y reservas con profesionales
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-3/4">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
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
            </div>

            <div className="w-full md:w-1/4">
              <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-teal-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                Eventos
              </h2>

              <div className="space-y-4">
                {Object.entries(groupedEvents).map(([status, statusEvents]) => {
                  const eventsArray = statusEvents as any[];
                  if (eventsArray.length === 0) return null;

                  const statusLabels = {
                    confirmed: "Confirmadas",
                    pending: "Pendientes",
                    booked: "Reservadas",
                    finished: "Finalizadas",
                  };

                  const statusColors = {
                    confirmed: "bg-green-500",
                    pending: "bg-yellow-500",
                    booked: "bg-blue-500",
                    finished: "bg-gray-500",
                  };

                  return (
                    <div
                      key={status}
                      className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
                    >
                      <div
                        className="px-4 py-3 flex justify-between items-center cursor-pointer"
                        onClick={() => toggleStatus(status)}
                      >
                        <div className="flex items-center">
                          <span
                            className={`w-3 h-3 rounded-full ${statusColors[status]} mr-2`}
                          ></span>
                          <h3 className="font-medium text-gray-800">
                            {statusLabels[status]} ({eventsArray.length})
                          </h3>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 text-gray-400 transition-transform ${
                            expandedStatus === status
                              ? "transform rotate-180"
                              : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>

                      {expandedStatus === status && (
                        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                          <div className="space-y-3 max-h-64 overflow-y-auto">
                            {eventsArray.map((event) => (
                              <div
                                key={event.id}
                                className={`p-3 rounded-lg bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200 ${
                                  hoveredEventId === event.id
                                    ? "ring-2 ring-teal-500"
                                    : ""
                                }`}
                                onMouseEnter={() => handleCardHover(event.id)}
                                onMouseLeave={() => handleCardHover(null)}
                              >
                                <div className="font-medium text-gray-800">
                                  {event.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {new Date(event.start).toLocaleDateString(
                                    "es-ES",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </div>
                                {event.description && (
                                  <div className="mt-1 text-sm text-gray-600">
                                    {event.description}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {hasNoActiveEvents && currentRole === "patient" && (
                  <div className="mt-6 text-center">
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden p-6">
                      <p className="text-gray-600 mb-4">
                        ¿No encuentras ninguna cita? Nuestros fisioterapeutas
                        especializados están listos para ayudarte
                      </p>
                      <button 
                      onClick={() => router.push('/advanced-search?autoSearch=true')}
                      className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center mx-auto">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Pedir una nueva cita
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
