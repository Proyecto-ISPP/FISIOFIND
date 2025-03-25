import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import esLocale from "@fullcalendar/core/locales/es";
import listPlugin from "@fullcalendar/list";
import { CalendarProps } from "@/lib/definitions";
import "@/app/my-appointments/my-appointments.css";
import DynamicFormModal from "./dinamic-form-modal";
import { AppointmentModal } from "./appointment-modal";

const Calendar = ({
  events,
  currentRole,
  hoveredEventId,
  handleAlternativesSubmit,
  setSelectedEvent,
  selectedEvent,
  setEditionMode,
  editionMode,
  isClient,
  token,
}: {
  events: any;
  currentRole: string;
  hoveredEventId: string | null;
  handleAlternativesSubmit: (alternatives: Record<string, { start: string; end: string }[]>) => void;
  setSelectedEvent: (event: CalendarProps | null) => void;
  selectedEvent: CalendarProps | null;
  setEditionMode: (mode: boolean) => void;
  editionMode: boolean;
  isClient: boolean;
  token: string | null;
}) => {

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
          if (eventInfo.event.extendedProps.status === "pending") {
            return ["fc-event-pending"]; // Añadimos la clase .fc-event-pending si el evento está pendiente
          } else if (eventInfo.event.extendedProps.status === "confirmed") {
            return ["fc-event-confirmed"]; // Añadimos la clase .fc-event-confirmed si el evento está confirmado
          } else if (eventInfo.event.extendedProps.status === "booked") {
            return ["fc-event-booked"]; // Añadimos la clase .fc-event-booked si el evento está reservado
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
