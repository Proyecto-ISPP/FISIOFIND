import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import esLocale from "@fullcalendar/core/locales/es";
import listPlugin from "@fullcalendar/list";
import { CalendarProps } from "@/lib/definitions";
import "@/app/mis-citas/mis-citas.css";
import { useState } from "react";

const Calendar = ({ events }: { events: CalendarProps[] }) => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarProps | null>(
    null
  );

  return (
    <div className="justify-items-center">
      <FullCalendar
        height={"85vh"}
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
          <div className="w-full h-full whitespace-nowrap overflow-hidden overflow-ellipsis"
          >
            {eventInfo.event.title}
          </div>
        )}
        eventClick={(info) => {
          setSelectedEvent({
            title: info.event.title,
            start: info.event.start?.toISOString() || "",
            end: info.event.end?.toISOString() || "",
            description:
              info.event.extendedProps.description || "Sin descripción",
          });
        }}
      />
      {/* MODAL */}
      {selectedEvent && (
        <div className="z-50 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-xl font-bold">{selectedEvent.title}</h2>
            <p className="text-gray-600 mt-2">
              <strong>Inicio:</strong>{" "}
              {new Date(selectedEvent.start).toLocaleString()}
            </p>
            {selectedEvent.end && (
              <p className="text-gray-600">
                <strong>Fin:</strong>{" "}
                {new Date(selectedEvent.end).toLocaleString()}
              </p>
            )}
            <p className="mt-2">{selectedEvent.description}</p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={() => setSelectedEvent(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
