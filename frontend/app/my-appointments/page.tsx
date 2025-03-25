"use client";

import { Suspense, useEffect, useState } from "react";
import axios from "axios";
import Cards from "@/components/ui/cards";
import Calendar from "@/components/ui/calendar";
import { getApiBaseUrl } from "@/utils/api";
import { CalendarProps } from "@/lib/definitions";

interface APIResponse {
  message: string;
  status: string;
}

const initialEvents = [
  {
    title: "Reunión de equipo",
    start: "2025-03-01T10:00:00",
    end: "2025-03-01T11:30:00",
    description: "Reunión semanal de equipo",
  },
  { title: "Patata", allDay: true, start: "2025-03-01", description: "Patata" },
  {
    title: "Almuerzo con cliente",
    start: "2025-03-02T12:00:00",
    end: "2025-03-02T13:30:00",
    description: "Almuerzo con el cliente para discutir el proyecto",
  },
];

export default function Home() {
  const [data, setData] = useState<APIResponse | null>(null);
  const [events, setEvents] = useState([]);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null); // Estado para el hover de tarjetas
  const [currentRole, setCurrentRole] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarProps | null>(null);
  const [editionMode, setEditionMode] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedToken = localStorage.getItem("token"); // Obtén el JWT desde localStorage (o desde donde lo tengas almacenado)
      console.log("storedToken", storedToken);
      setToken(storedToken);
    }
  }, [isClient]);

  useEffect(() => {
    if (token) {
      axios.get(`${getApiBaseUrl()}/api/app_user/check-role/`, {
        headers: {
          Authorization: "Bearer " + token, // Envía el JWT en la cabecera de la petición
        },
      })
        .then(response => {
          setCurrentRole(response.data.user_role);
        })
        .catch(error => {
          console.log("Error fetching data:", error);
        });

      if (currentRole == "physiotherapist") {
        axios.get(`${getApiBaseUrl()}/api/appointment/physio/list/`, {
          headers: {
            Authorization: "Bearer " + token, // Envía el JWT en la cabecera de la petición
          },
        })
          .then(response => {
            const transformedEvents = response.data.results.map((event: any) => ({
              id: event.id,
              title: event.service.type + "-" + event.patient || "Sin título",
              start: event.start_time,  // Cambio de start_time a start
              end: event.end_time,      // Cambio de end_time a end
              description: event.description,
              allDay: event.allDay || false,
              status: event.status,
              service: {
                type: event.service.type,
                duration: event.service.duration,
              },
              alternatives: event.alternatives,
            }));
            console.log("citas", response.data);
            setEvents(transformedEvents);
          })
          .catch(error => {
            console.log("Error fetching data:", error);
            setData({ message: "Error al cargar las citas", status: "error" });
          });
      } else if (currentRole == "patient") {
        axios.get(`${getApiBaseUrl()}/api/appointment/patient/list/`, {
          headers: {
            Authorization: "Bearer " + token, // Envía el JWT en la cabecera de la petición
          },
        })
          .then(response => {
            const transformedEvents = response.data.map((event: any) => ({
              id: event.id,
              title: event.service.type + "-" + event.physiotherapist || "Sin título",
              start: event.start_time,  // Cambio de start_time a start
              end: event.end_time,      // Cambio de end_time a end
              description: event.description,
              allDay: event.allDay || false,
              status: event.status,
              service: {
                type: event.service.type,
                duration: event.service.duration,
              },
              alternatives: event.alternatives,
            }));
            console.log("citas", response.data);
            setEvents(transformedEvents);
          })
          .catch(error => {
            console.log("Error fetching data:", error);
            setData({ message: "Error al cargar las citas", status: "error" });
          });
      }
    }
  }, [currentRole, token]);

  const handleAlternativesSubmit = (
    alternatives: Record<string, { start: string; end: string }[]>
  ) => {
    console.log("Fechas alternativas enviadas:", alternatives);
    // Aquí podrías hacer una petición al backend para actualizar la cita,
    // por ejemplo, usando axios.post con el array de alternativas
    if (isClient) {
      if (token) {
        axios
          .put(`${getApiBaseUrl()}/api/appointment/update/${selectedEvent?.id}/`, {
            start_time: selectedEvent?.start,
            end_time: selectedEvent?.end,
            status: "pending",
            alternatives: alternatives,
          }, {
            headers: {
              Authorization: "Bearer " + token,
            }
          })
          .then((response) => {
            // Si la respuesta fue exitosa
            alert("La cita se actualizó correctamente.");
            console.log("Cita actualizada correctamente", response);
            setEditionMode(false);
            setSelectedEvent(null);
            window.location.reload();
          })
          .catch((error) => {
            // Si hubo un error en la solicitud
            console.error("Error en la actualización de la cita:", error);
            alert("Hubo un problema con la conexión. Intenta nuevamente.");
          });
      }
    }
  };

  const handleCardHover = (eventId: string | null) => {
    setHoveredEventId(eventId);
  };

  return (
    <>
      <div className="flex flex-row justify-between">
        {/* Vista en Cards */}
        <Cards events={events} currentRole={currentRole} onCardHover={handleCardHover} token={token} isClient={isClient} handleAlternativesSubmit={handleAlternativesSubmit} setEditionMode={setEditionMode} editionMode={editionMode} setSelectedEvent={setSelectedEvent} selectedEvent={selectedEvent}/>

        <div style={{ borderLeft: "1px solid #000", minHeight: "100%" }}></div>

        {/* Vista del Calendario */}
        <Calendar events={events} currentRole={currentRole} hoveredEventId={hoveredEventId} handleAlternativesSubmit={handleAlternativesSubmit} setEditionMode={setEditionMode} editionMode={editionMode} setSelectedEvent={setSelectedEvent} selectedEvent={selectedEvent} isClient={isClient} token={token}/>
      </div>

      {data && (
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold">Mensaje: {data.message}</p>
          <p className="text-gray-600">Estado: {data.status}</p>
        </div>
      )}
    </>
  );
}
