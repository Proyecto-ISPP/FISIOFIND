import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import esLocale from "@fullcalendar/core/locales/es";
import listPlugin from "@fullcalendar/list";
import { CalendarProps } from "@/lib/definitions";
import "@/app/mis-citas/mis-citas.css";
import { useEffect, useState } from "react";
import axios from "axios";
import DynamicFormModal from "./dinamic-form-modal";
import { AppointmentModal } from "./appointment-modal";
import { getApiBaseUrl } from "@/utils/api";

const Calendar = ({
  events,
  currentRole,
  hoveredEventId,
}: {
  events: any;
  currentRole: string;
  hoveredEventId: string | null;
}) => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarProps | null>(
    null
  );
  // const [events, setEvents] = useState();
  const [editionMode, setEditionMode] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, [isClient, token]);

  // useEffect(() => {
  //   if (isClient) {
  //     const storedToken = localStorage.getItem("token");
  //     setToken(storedToken);
  //     if (token) {
  //       axios.get(`${getApiBaseUrl()}/api/appointment?physiotherapist=2`)
  //         .then(response => {
  //           const transformedEvents = response.data.map((event: any) => ({
  //             id: event.id,
  //             title: event.title,
  //             start: event.start_time,  // Cambio de start_time a start
  //             end: event.end_time,      // Cambio de end_time a end
  //             description: event.description,
  //             allDay: event.allDay || false,
  //           }));
  //           setEvents(transformedEvents);
  //         })
  //         .catch(error => {
  //           console.error("Error fetching data:", error);
  //         });
  //     }
  //   }
  // }, [token, isClient]);

  // Función para recibir las alternativas del modal
  const handleAlternativesSubmit = (
    alternatives: Record<string, { start: string; end: string }[]>
  ) => {
    console.log("Fechas alternativas enviadas:", alternatives);
    // Aquí podrías hacer una petición al backend para actualizar la cita,
    // por ejemplo, usando axios.post con el array de alternativas
    if (isClient) {
      if (token) {
        axios
          .patch(`${getApiBaseUrl()}/api/appointment/update/${selectedEvent?.id}/`, {
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

  return (
    <div className="justify-items-center w-2/3 py-4 hidden lg:block">
      <FullCalendar
        height={"80vh"}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
        locale={esLocale}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        events={events}
        handleWindowResize={true}
        eventContent={(eventInfo) => (
          <div
            className={`w-full h-full whitespace-nowrap overflow-hidden overflow-ellipsis`}
          >
            {eventInfo.event.title}
          </div>
        )}
        eventClassNames={(eventInfo) => {
          // Si el evento tiene el ID que está siendo hoverado, añade la clase
          if (eventInfo.event.title === hoveredEventId) {
            return ["fc-event-hovered"]; // Aquí estamos añadiendo la clase .fc-event-hovered
          }
          return []; // No añadimos ninguna clase si no coincide
        }}
        eventClick={(info) => {
          setSelectedEvent({
            id: info.event.id?.toString() || "",
            title: info.event.title?.toString() || "Sin título",
            start: info.event.start?.toISOString() || "",
            end: info.event.end?.toISOString() || "",
            description:
              info.event.extendedProps.description || "Sin descripción",
            status: info.event.extendedProps.status || "Sin estado",
            service: {
              type: info.event.extendedProps.service.type || "Sin servicio",
              duration: info.event.extendedProps.service.duration || 0,
            },
            alternatives: info.event.extendedProps.alternatives || null,
          });
        }}
      />
      {/* MODAL */}
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
      {/* MODAL */}
      {editionMode && (
        <DynamicFormModal
          event={selectedEvent}
          onClose={() => setEditionMode(false)}
          onSubmit={handleAlternativesSubmit}
        />
      )}
    </div>
  );
};

export default Calendar;
