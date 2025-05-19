// components/ui/ScheduleCalendar.js
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { EventClickArg, EventMountArg } from "@fullcalendar/core";

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

// Definición de tipos para el estado "schedule"
interface Interval {
  id: string;
  start: string;
  end: string;
}

interface Appointment {
  id: string;
  start: string;
  end: string;
  title: string;
}

interface Schedule {
  exceptions: Record<string, Interval[]>;
  appointments: Appointment[];
  weekly_schedule: Record<
    "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday",
    Interval[]
  >;
  initialized: boolean;
}

// Definición de tipos para eventos del calendario
interface CalendarEvent {
  id: string;
  title: string;
  start?: string;
  end?: string;
  daysOfWeek?: number[];
  startTime?: string;
  endTime?: string;
  backgroundColor: string;
  borderColor: string;
  extendedProps: {
    source: "weekly" | "exception";
    day?: string;
    date?: string;
  };
}

// Tipado de las propiedades del componente
interface ScheduleCalendarProps {
  initialSchedule?: string | Schedule | null;
  onScheduleChange?: (schedule: Schedule) => void;
}

export default function ScheduleCalendar({ initialSchedule = null, onScheduleChange }: ScheduleCalendarProps) {
  // Estado de la agenda siguiendo la estructura deseada
  const [schedule, setSchedule] = useState<Schedule>({
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
        const parsedSchedule = typeof initialSchedule === "string"
          ? JSON.parse(initialSchedule)
          : initialSchedule;
        setSchedule({ ...parsedSchedule, initialized: true });
      } catch (error) {
        console.error("Error parsing initial schedule:", error);
      }
    }
  }, [initialSchedule, schedule.initialized]);

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
  const [selectedCalendarEvent, setSelectedCalendarEvent] = useState<CalendarEvent | null>(null);

  // Función auxiliar para generar IDs únicos
  const generateId = (prefix: string) =>
    `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Al seleccionar una franja en el calendario se actualiza el estado "schedule"
  const handleSelect = (selectionInfo: { startStr: string; endStr: string }) => {
    const extractTime = (isoStr: string) => {
      const time = isoStr.substr(11, 5);
      const [hours, minutes] = time.split(":");
      return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
    };

    // Detectar si el rango seleccionado cubre todo el día
    const isFullDay = extractTime(selectionInfo.startStr) === "00:00" && extractTime(selectionInfo.endStr) === "00:00";

    const interval: Interval = {
      id: generateId(selectedEventType === "generic" ? "ws" : "ex"),
      start: isFullDay ? "00:00" : extractTime(selectionInfo.startStr),
      end: isFullDay ? "23:59" : extractTime(selectionInfo.endStr),
    };

    if (selectedEventType === "generic") {
      const eventDate = new Date(selectionInfo.startStr);
      const dayName = dayNames[eventDate.getDay()] as keyof Schedule["weekly_schedule"];

      const existingIntervals = schedule.weekly_schedule[dayName];

      // Validar si la nueva franja horaria se solapa con alguna existente
      const overlaps = existingIntervals.some((existing) => {
        return (
          (interval.start >= existing.start && interval.start < existing.end) ||
          (interval.end > existing.start && interval.end <= existing.end) ||
          (interval.start <= existing.start && interval.end >= existing.end)
        );
      });

      if (overlaps) {
        alert("La franja horaria se solapa con una existente. Por favor, elija otra hora.");
        return;
      }

      setSchedule((prev) => {
        const newSchedule = {
          ...prev,
          weekly_schedule: {
            ...prev.weekly_schedule,
            [dayName]: [...prev.weekly_schedule[dayName], interval],
          },
        };
        return newSchedule;
      });
    } else {
      const dateKey = selectionInfo.startStr.split("T")[0];
      const existingIntervals = schedule.exceptions[dateKey] || [];

      // Validar si la nueva franja horaria se solapa con alguna existente
      const overlaps = existingIntervals.some((existing) => {
        return (
          (interval.start >= existing.start && interval.start < existing.end) ||
          (interval.end > existing.start && interval.end <= existing.end) ||
          (interval.start <= existing.start && interval.end >= existing.end)
        );
      });

      if (overlaps) {
        alert("La franja horaria se solapa con una existente. Por favor, elija otra hora.");
        return;
      }

      setSchedule((prev) => {
        const newSchedule = {
          ...prev,
          exceptions: {
            ...prev.exceptions,
            [dateKey]: [...existingIntervals, interval],
          },
        };
        return newSchedule;
      });
    }
  };

  // Genera los eventos que mostrará FullCalendar a partir del estado "schedule"
  const getCalendarEvents = (): CalendarEvent[] => {
    const events: CalendarEvent[] = [];

    // Eventos recurrentes (horario genérico)
    Object.entries(schedule.weekly_schedule).forEach(([dayName, blocks]) => {
      const dayIndex = dayIndices[dayName as keyof typeof dayIndices];
      blocks.forEach((interval) => {
        events.push({
          id: interval.id,
          title: "Horario Laboral",
          daysOfWeek: [dayIndex],
          startTime: interval.start,
          endTime: interval.end,
          backgroundColor: "green",
          borderColor: "green",
          extendedProps: { source: "weekly", day: dayName },
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

    return events;
  };

  // Al hacer clic en un evento se abre un modal para confirmar su eliminación
  const handleEventClick = (clickInfo: EventClickArg) => {
    clickInfo.jsEvent.preventDefault();
    setSelectedCalendarEvent(clickInfo.event as unknown as CalendarEvent);
    setModalOpen(true);
  };

  // Confirma la eliminación del evento y actualiza el estado "schedule"
  const confirmDelete = () => {
    if (selectedCalendarEvent) {
      const source = (selectedCalendarEvent.extendedProps as CalendarEvent["extendedProps"]).source;
      if (source === "weekly") {
        const day = (selectedCalendarEvent.extendedProps as CalendarEvent["extendedProps"]).day as keyof Schedule["weekly_schedule"];
        setSchedule((prev) => {
          const newSchedule = {
            ...prev,
            weekly_schedule: {
              ...prev.weekly_schedule,
              [day]: prev.weekly_schedule[day].filter(
                (interval: Interval) => interval.id !== selectedCalendarEvent.id
              ),
            },
          };
          return newSchedule;
        });
      } else if (source === "exception") {
        const dateKey = (selectedCalendarEvent.extendedProps as CalendarEvent["extendedProps"]).date!;
        setSchedule((prev) => {
          const newSchedule = {
            ...prev,
            exceptions: {
              ...prev.exceptions,
              [dateKey]: prev.exceptions[dateKey].filter(
                (interval: Interval) => interval.id !== selectedCalendarEvent.id
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
  const handleEventDidMount = (info: EventMountArg) => {
    if ((info.event.extendedProps as CalendarEvent["extendedProps"]).source === "weekly") {
      info.el.style.width = "80%";
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
        events={getCalendarEvents()}
        allDaySlot={false} // Elimina la fila de todo el día
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