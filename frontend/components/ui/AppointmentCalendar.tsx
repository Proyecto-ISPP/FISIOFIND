"use client";
import React, { useState, useEffect } from "react";
import FullCalendar, { DatesSetArg } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useAppointment } from "@/context/appointmentContext";
import esLocale from "@fullcalendar/core/locales/es";
import { useParams } from "next/navigation";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";
import Alert from "@/components/ui/Alert";
import { DateTime } from 'luxon';

// ----- Funciones auxiliares para trabajar con tiempos -----

const timeStrToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

const minutesToTimeStr = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

const subtractInterval = (
  interval: { start: string; end: string },
  appointments: { start: string; end: string }[]
) => {
  let freeIntervals: { start: number; end: number }[] = [
    {
      start: timeStrToMinutes(interval.start),
      end: timeStrToMinutes(interval.end),
    },
  ];

  appointments.forEach((app) => {
    const appStart = timeStrToMinutes(app.start);
    const appEnd = timeStrToMinutes(app.end);
    freeIntervals = freeIntervals.flatMap((free) => {
      // Si no hay solapamiento, dejamos el intervalo intacto
      if (appEnd <= free.start || appStart >= free.end) {
        return [free];
      }
      const intervals = [];
      if (appStart > free.start) {
        intervals.push({ start: free.start, end: appStart });
      }
      if (appEnd < free.end) {
        intervals.push({ start: appEnd, end: free.end });
      }
      return intervals;
    });
  });

  return freeIntervals.map((free) => ({
    start: minutesToTimeStr(free.start),
    end: minutesToTimeStr(free.end),
  }));
};

const combineDateAndTime = (dateStr: string, timeStr: string): string => {
  const dt = DateTime.fromFormat(`${dateStr} ${timeStr}`, "yyyy-MM-dd HH:mm", {
    zone: "Europe/Madrid",
  });

  return dt.toFormat("yyyy-MM-dd'T'HH:mm:ss");
};

const addMinutesTo = (isoDate: string, minutes: number): string => {
  const dt = DateTime.fromFormat(isoDate, "yyyy-MM-dd'T'HH:mm:ss", {
    zone: "Europe/Madrid",
  });

  const result = dt.plus({ minutes });

  return result.toFormat("yyyy-MM-dd'T'HH:mm:ss");
};

// ----- Función para calcular los slots disponibles -----
// Utiliza el objeto de schedule que retorna la API, cuya estructura es:
// {
//   "exceptions": { ... },
//   "appointments": [ ... ],
//   "weekly_schedule": { ... }
// }
export const getAvailableSlots = (
  dateStr: string,
  serviceDuration: number,
  slotInterval: number,
  scheduleData: any
): string[] => {
  // Convertimos la fecha al nombre del día en minúsculas (ej. "monday")
  const dayOfWeek = new Date(dateStr)
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();

  // Obtenemos las franjas horarias para ese día; en la API vienen como array de objetos
  const intervals = scheduleData.weekly_schedule[dayOfWeek] || [];
  const exceptions = scheduleData.exceptions[dateStr] || [];

  // Si por error se reciben arrays anidados, aplanamos (normalmente no sucede con la API)
  const flatIntervals = Array.isArray(intervals[0]) ? intervals.flat() : intervals;

  // Filtramos las citas (appointments) para la fecha indicada
  const appointmentsForDate = scheduleData.appointments
    .filter((app: any) => app.start_time.startsWith(dateStr))
    .map((app: any) => {
      const startDate = new Date(app.start_time);
      const endDate = new Date(app.end_time);
      const startTime = `${startDate.getHours().toString()}:${startDate.getMinutes().toString().padStart(2, "0")}`;
      const endTime = `${endDate.getHours().toString()}:${endDate.getMinutes().toString().padStart(2, "0")}`;
      return { start: startTime, end: endTime };
    });

  let freeIntervals: { start: string; end: string }[] = [];
  flatIntervals.forEach((interval) => {
    const free = subtractInterval(interval, appointmentsForDate);
    freeIntervals = freeIntervals.concat(free);
  });

  let exceptionIntervals: { start: string; end: string }[] = [];
  freeIntervals.forEach((interval) => {
    const exception = subtractInterval(interval, exceptions);
    exceptionIntervals = exceptionIntervals.concat(exception);
  });

  const availableSlots: string[] = [];
  exceptionIntervals.forEach((interval) => {
    let startMin = timeStrToMinutes(interval.start);
    const endMin = timeStrToMinutes(interval.end);

    while (startMin + serviceDuration <= endMin) {
      availableSlots.push(minutesToTimeStr(startMin));
      startMin += slotInterval;
    }
  });

  return availableSlots;
};

// ----- Componente AppointmentCalendar -----

interface AppointmentCalendarProps {
  serviceDuration: number; // Duración del servicio en minutos
  slotInterval: number;    // Intervalo de slots calculado (por ejemplo, GCD de duraciones)
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  serviceDuration,
  slotInterval,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [slots, setSlots] = useState<string[]>([]);
  const [backgroundEvents, setBackgroundEvents] = useState<any[]>([]);
  const { dispatch } = useAppointment();
  const { id } = useParams();
  const [schedule, setSchedule] = useState<any>(null); // Datos del schedule desde la API
  const [alertConfig, setAlertConfig] = useState<{
    show: boolean;
    type: "success" | "error" | "info" | "warning";
    message: string;
  } | null>(null);
  const showAlert = (type: "success" | "error" | "info" | "warning", message: string) => {
    setAlertConfig({ show: true, type, message });
  };

  // Traer el schedule desde la API usando la id del fisioterapeuta
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(
          `${getApiBaseUrl()}/api/appointment/schedule/${id}/`
        );
        if (response.status === 200) {
          if (response.data.schedule) {
            setSchedule(response.data.schedule);
          }
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };
    fetchSchedule();
  }, [id]);

  // Estado para el slot seleccionado y la fecha clicada
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [clickedDate, setClickedDate] = useState<string>("");

  // Add new state for hover
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  // Add mouse event handlers
  const handleDateHover = (info: any) => {
    const dateStr = info.dateStr;
    setHoveredDate(dateStr);
  };

  const handleDateLeave = () => {
    setHoveredDate(null);
  };

  // Modify getDayColor to include hover state
  const getDayColor = (count: number, isSelected: boolean, isHovered: boolean) => {
    if (isSelected || isHovered) {
      return "#05AC9C33"; // Semi-transparent version of your theme color for both hover and selected
    }
    if (count === 0) return "#333333"; // Gris oscuro si no hay disponibilidad
    if (count === 1) return "#b6d9b0";
    if (count === 2) return "#8fcf8c";
    if (count === 3) return "#66c266";
    if (count === 4) return "#4CAF60";
    if (count >= 5) return "#0B6B31"; // Verde bosque
    return "#333333";
  };

  // Al hacer click en una fecha del calendario
  const handleDateClick = (arg: any) => {
    const dateStr = arg.dateStr;
    const today = new Date();
    
    // Set time to start of day for accurate comparison
    today.setHours(0, 0, 0, 0);
    
    // Calculate the day after tomorrow
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 3);
    dayAfterTomorrow.setHours(0, 0, 0, 0);
    
    const selectedDate = new Date(dateStr);
    selectedDate.setHours(0, 0, 0, 0);

    setSelectedDate(dateStr);
    setClickedDate(dateStr);
    
    // Check if selected date is before day after tomorrow
    if (selectedDate < dayAfterTomorrow) {
      setSlots([]);
      showAlert("warning", "Solo se pueden reservar citas con al menos 3 días de antelación.");
      return;
    }

    if (schedule) {
      const available = getAvailableSlots(
        dateStr,
        serviceDuration,
        slotInterval,
        schedule
      );
      setSlots(available);
    }
  };

  // Al seleccionar un slot, se envía la información al contexto de la cita
  const handleSlotClick = (slot: string) => {
    if (!selectedDate) return;
    setSelectedSlot(slot);
    const startISO = combineDateAndTime(selectedDate, slot);
    const endISO = addMinutesTo(startISO, serviceDuration);
    dispatch({
      type: "SELECT_SLOT",
      payload: {
        start_time: startISO,
        end_time: endISO,
        is_online: true,
      },
    });
  };

  // Actualiza los eventos de fondo en el calendario (colores según disponibilidad)
  const handleDatesSet = (arg: DatesSetArg) => {
    const events = [];
    const today = new Date();
    const currentDate = new Date(arg.start);
    while (currentDate < arg.end) {
      const dateStr = currentDate.toISOString().split("T")[0];
      if (schedule) {
        const available = getAvailableSlots(
          dateStr,
          serviceDuration,
          slotInterval,
          schedule
        );
        const count = available.length;
        const isPast = currentDate < today;
        const isSelectedDay = dateStr === clickedDate;
        const isHoveredDay = dateStr === hoveredDate;
        const bgColor = isPast ? "#666666" : getDayColor(count, isSelectedDay, isHoveredDay);
        events.push({
          id: dateStr,
          start: dateStr,
          allDay: true,
          display: "background",
          backgroundColor: bgColor,
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setBackgroundEvents(events);
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        events={backgroundEvents}
        locale={esLocale}
        datesSet={handleDatesSet}
        eventMouseEnter={(info) => handleDateHover(info.event)}
        eventMouseLeave={handleDateLeave}
        dayCellDidMount={(info) => {
          info.el.addEventListener('mouseenter', () => handleDateHover(info));
          info.el.addEventListener('mouseleave', handleDateLeave);
        }}
      />
      {selectedDate && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold">
            Horarios disponibles para {selectedDate}:
          </h4>
          {slots.length > 0 ? (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {slots.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => handleSlotClick(slot)}
                  className={`px-3 py-1 rounded border text-center transition-colors ${selectedSlot === slot
                    ? "bg-[#05AC9C] text-white border-[#05AC9C]"
                    : "bg-white text-black border-gray-300 hover:bg-gray-100"
                    }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-2">No hay horarios disponibles</p>
          )}
        </div>
      )}
      {alertConfig && (
      <Alert
        type={alertConfig.type}
        message={alertConfig.message}
        onClose={() => setAlertConfig(null)}
      />
    )}
    </div>
  );
};

export default AppointmentCalendar;
