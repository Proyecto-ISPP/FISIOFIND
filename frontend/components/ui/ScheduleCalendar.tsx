// components/ui/ScheduleCalendar.js
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

// Importa FullCalendar de forma dinámica para evitar problemas con SSR
const FullCalendar = dynamic(() => import("@fullcalendar/react"), {
  ssr: false,
});

// Mapeo de índice de día (0 = domingo) a nombre en minúsculas
const dayNames = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

// Para eventos recurrentes en FullCalendar se requiere el índice del día (domingo = 0, lunes = 1, ...)
const dayIndices = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export default function ScheduleCalendar({ initialSchedule = null, onScheduleChange }) {
  // Estado de la agenda siguiendo la estructura deseada
  const [schedule, setSchedule] = useState({
    exceptions: {},
    appointments: [],
    weekly_schedule: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
    initialized: false,
  });

  // Inicializar el schedule con los datos recibidos del backend
  useEffect(() => {
    if (initialSchedule && !schedule.initialized) {
      try {
        const parsedSchedule = typeof initialSchedule === 'string' 
          ? JSON.parse(initialSchedule) 
          : initialSchedule;
        setSchedule({ ...parsedSchedule, initialized: true });
      } catch (error) {
        console.error("Error parsing initial schedule:", error);
      }
    }
  }, [initialSchedule]);

  // Notificar cambios en el schedule al componente padre
  useEffect(() => {
    if (onScheduleChange && schedule.initialized) {
      onScheduleChange(schedule);
    }
  }, [schedule, onScheduleChange]);

  // Tipo de evento a crear: "generic" para horario recurrente o "exception"
  const [selectedEventType, setSelectedEventType] = useState("generic");
  // Estados para el modal de confirmación para eliminación
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCalendarEvent, setSelectedCalendarEvent] = useState(null);

  // Función auxiliar para generar IDs únicos
  const generateId = (prefix) =>
    `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Al seleccionar una franja en el calendario se actualiza el estado "schedule"
  const handleSelect = (selectionInfo) => {
    // Extraemos la hora en formato HH:MM de la cadena ISO
    const extractTime = (isoStr) => isoStr.substr(11, 5);
    const interval = {
      id: generateId(selectedEventType === "generic" ? "ws" : "ex"),
      start: extractTime(selectionInfo.startStr),
      end: extractTime(selectionInfo.endStr),
    };

    if (selectedEventType === "generic") {
      // Para el horario recurrente se determina el día de la semana
      const eventDate = new Date(selectionInfo.startStr);
      const dayName = dayNames[eventDate.getDay()];
      setSchedule((prev) => {
        const newSchedule = {
          ...prev,
          weekly_schedule: {
            ...prev.weekly_schedule,
            // Se agrega el nuevo bloque (como un array con un único intervalo)
            [dayName]: [...prev.weekly_schedule[dayName], [interval]],
          },
        };
        return newSchedule;
      });
    } else {
      // Para excepciones se utiliza la fecha completa (YYYY-MM-DD)
      const dateKey = selectionInfo.startStr.split("T")[0];
      setSchedule((prev) => {
        const newSchedule = {
          ...prev,
          exceptions: {
            ...prev.exceptions,
            [dateKey]: prev.exceptions[dateKey]
              ? [...prev.exceptions[dateKey], interval]
              : [interval],
          },
        };
        return newSchedule;
      });
    }
  };

  // Genera los eventos que mostrará FullCalendar a partir del estado "schedule"
  const getCalendarEvents = () => {
    const events = [];

    // Eventos recurrentes (horario genérico)
    Object.entries(schedule.weekly_schedule).forEach(([dayName, blocks]) => {
      // Para cada bloque (cada bloque es un array de intervalos)
      blocks.forEach((block) => {
        // En este ejemplo, suponemos que cada bloque contiene un único intervalo
        block.forEach((interval) => {
          events.push({
            id: interval.id,
            title: "Horario Laboral",
            daysOfWeek: [dayIndices[dayName]], // evento recurrente para ese día
            startTime: interval.start,
            endTime: interval.end,
            backgroundColor: "green",
            borderColor: "green",
            extendedProps: { source: "weekly", day: dayName },
          });
        });
      });
    });

    // Eventos de excepción (únicos para una fecha)
    Object.entries(schedule.exceptions).forEach(([dateKey, intervals]) => {
      intervals.forEach((interval) => {
        events.push({
          id: interval.id,
          title: "Excepción",
          start: `${dateKey}T${interval.start}:00`,
          end: `${dateKey}T${interval.end}:00`,
          backgroundColor: "red",
          borderColor: "red",
          extendedProps: { source: "exception", date: dateKey },
        });
      });
    });

    // Las citas (appointments) ya vienen en formato ISO y se pueden agregar directamente si se requiriera

    return events;
  };

  // Al hacer clic en un evento se abre un modal para confirmar su eliminación
  const handleEventClick = (clickInfo) => {
    // Evitamos la acción por defecto para asegurar que se abra el modal al primer clic
    clickInfo.jsEvent.preventDefault();
    setSelectedCalendarEvent(clickInfo.event);
    setModalOpen(true);
  };

  // Confirma la eliminación del evento y actualiza el estado "schedule"
  const confirmDelete = () => {
    if (selectedCalendarEvent) {
      const source = selectedCalendarEvent.extendedProps.source;
      if (source === "weekly") {
        const day = selectedCalendarEvent.extendedProps.day;
        // Se actualiza el array del día removiendo el bloque que contenga el intervalo con el id seleccionado
        setSchedule((prev) => {
          const newSchedule = {
            ...prev,
            weekly_schedule: {
              ...prev.weekly_schedule,
              [day]: prev.weekly_schedule[day].filter(
                (block) =>
                  !block.some(
                    (interval) => interval.id === selectedCalendarEvent.id
                  )
              ),
            },
          };
          return newSchedule;
        });
      } else if (source === "exception") {
        const dateKey = selectedCalendarEvent.extendedProps.date;
        setSchedule((prev) => {
          const newSchedule = {
            ...prev,
            exceptions: {
              ...prev.exceptions,
              [dateKey]: prev.exceptions[dateKey].filter(
                (interval) => interval.id !== selectedCalendarEvent.id
              ),
            },
          };
          return newSchedule;
        });
      }
      setModalOpen(false);
      setSelectedCalendarEvent(null);
    }
  };

  // Cierra el modal sin eliminar el evento
  const closeModal = () => {
    setModalOpen(false);
    setSelectedCalendarEvent(null);
  };

  // Para ajustar visualmente los eventos "genéricos" y que no ocupen todo el ancho del día
  const handleEventDidMount = (info) => {
    if (info.event.extendedProps.source === "weekly") {
      info.el.style.width = "80%";
      //   info.el.style.marginLeft = "10%";
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Select para elegir el tipo de evento */}
      <div className="mb-4 flex items-center">
        <label htmlFor="eventType" className="mr-2 font-bold">
          Tipo de evento:
        </label>
        <select
          id="eventType"
          value={selectedEventType}
          onChange={(e) => setSelectedEventType(e.target.value)}
          className="border border-gray-300 p-2 rounded"
        >
          <option value="generic">Horas Laborables</option>
          <option value="exception">Excepciones</option>
        </select>
      </div>

      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        height={"80vh"}
        initialView="timeGridWeek"
        locale={esLocale}
        selectable={true}
        selectMirror={true}
        select={handleSelect}
        eventClick={handleEventClick}
        eventDidMount={handleEventDidMount}
        // Se generan los eventos a partir del estado "schedule"
        events={getCalendarEvents()}
      />

      {/* Modal de confirmación para eliminar un evento, estilizado con Tailwind CSS */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">Confirmación</h3>
            <p className="mb-4">
              ¿Desea eliminar el evento{" "}
              <span className="font-bold">
                {selectedCalendarEvent && selectedCalendarEvent.title}
              </span>
              ?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}