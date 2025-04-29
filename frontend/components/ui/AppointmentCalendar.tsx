"use client";
import React, { useState, useEffect, useRef } from "react";
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

const toLocalISOStringWithOffset = (date: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  const offsetMinutes = date.getTimezoneOffset(); // minutos desde UTC (negativo si está por delante)
  const offsetSign = offsetMinutes <= 0 ? "+" : "-";
  const offsetAbs = Math.abs(offsetMinutes);
  const offsetHours = pad(Math.floor(offsetAbs / 60));
  const offsetMins = pad(offsetAbs % 60);

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetSign}${offsetHours}:${offsetMins}`;
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
  const [schedule, setSchedule] = useState<any>(null);
  // Move these state declarations up
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [clickedDate, setClickedDate] = useState<string>("");
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [alertConfig, setAlertConfig] = useState<{
    show: boolean;
    type: "success" | "error" | "info" | "warning";
    message: string;
  } | null>(null);
  const { dispatch } = useAppointment();
  const { id } = useParams();

  const showAlert = (type: "success" | "error" | "info" | "warning", message: string) => {
    setAlertConfig({ show: true, type, message });
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };


  // Traer el schedule desde la API usando la id del fisioterapeuta
  // Modificar el useEffect existente para incluir la generación inicial de eventos
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(
          `${getApiBaseUrl()}/api/appointment/schedule/${id}/`
        );
        if (response.status === 200 && response.data.schedule) {
          setSchedule(response.data.schedule);
          
          // Generar eventos iniciales después de obtener el schedule
          const start = new Date();
          const end = new Date();
          end.setMonth(end.getMonth() + 2); // Mostrar 2 meses adelante
          
          const events = [];
          const currentDate = new Date(start);
          while (currentDate < end) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const available = getAvailableSlots(
              dateStr,
              serviceDuration,
              slotInterval,
              response.data.schedule
            );
            const count = available.length;
            const isSelectedDay = dateStr === clickedDate;
            const isHoveredDay = dateStr === hoveredDate;
            const bgColor = getDayColor(count, isSelectedDay, isHoveredDay, new Date(dateStr));
            
            events.push({
              id: dateStr,
              start: dateStr,
              allDay: true,
              display: "background",
              backgroundColor: bgColor,
            });
            
            currentDate.setDate(currentDate.getDate() + 1);
          }
          setBackgroundEvents(events);
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };
    fetchSchedule();
  }, [id, serviceDuration, slotInterval, clickedDate, hoveredDate]);

  // Update background events whenever selection changes
  useEffect(() => {
    if (schedule && calendarRef.current) {
      updateBackgroundEvents();
    }
  }, [selectedDate, selectedSlot, hoveredDate, clickedDate, schedule]);

  const handleDateHover = (info: any) => {
    setHoveredDate(info.dateStr);
  };

  const handleDateLeave = () => {
    setHoveredDate(null);
  };
  
  const isWithinFirstThreeDays = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 3);
    dayAfterTomorrow.setHours(0, 0, 0, 0);
    return date < dayAfterTomorrow;
  };

  // Modify getDayColor to include hover state
  const getDayColor = (count: number, isSelected: boolean, isHovered: boolean, date: Date) => {
    if (isWithinFirstThreeDays(date)) {
      return "#666666"; // Gray for blocked days
    }
    if (isSelected) {
      return "#05668D";
    }
    if (isHovered) {
      return "#05AC9C33";
    }
    if (count === 0) return "#666666";
    return "#4CAF60"; // Simplified color logic for available slots
  };

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateStr).toLocaleDateString('es-ES', options);
  };

  const handleDateClick = (arg: any) => {
    const dateStr = arg.dateStr;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 3);
    dayAfterTomorrow.setHours(0, 0, 0, 0);

    const selectedDate = new Date(dateStr);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < dayAfterTomorrow) {
      setSlots([]);
      showAlert("warning", "Solo se pueden reservar citas con al menos 3 días de antelación.");
      return;
    }

    setClickedDate(dateStr);

    if (schedule) {
      const available = getAvailableSlots(
        dateStr,
        serviceDuration,
        slotInterval,
        schedule
      );
      setSlots(available);
      setShowModal(true);
    }
  };

  const handleSlotClick = (slot: string) => {
    if (!clickedDate) return;
    
    // Clear selection if clicking the same slot
    if (selectedSlot === slot && clickedDate === selectedDate) {
      setSelectedSlot(null);
      setSelectedDate("");
      setClickedDate("");
      
      // Clear the appointment selection in the global state
      dispatch({
        type: "SELECT_SLOT",
        payload: { start_time: "", end_time: "", is_online: false },
      });
      
      setShowModal(false);
      return;
    }
    
    setSelectedSlot(slot);
    setSelectedDate(clickedDate);

    const startDate = new Date(`${clickedDate}T${slot}`);
    const endDate = new Date(startDate.getTime() + serviceDuration * 60000);

    const startISO = toLocalISOStringWithOffset(startDate);
    const endISO = toLocalISOStringWithOffset(endDate);

    dispatch({
      type: "SELECT_SLOT",
      payload: {
        start_time: startISO,
        end_time: endISO,
        is_online: true,
      },
    });

    setShowModal(false);
  };

  // Actualiza los eventos de fondo en el calendario (colores según disponibilidad)
  const handleDatesSet = (arg: DatesSetArg) => {
    if (!schedule) return; // Don't proceed if schedule isn't loaded yet
    
    const events = [];
    const today = new Date();
    const currentDate = new Date(viewStart);
    
    while (currentDate < viewEnd) {
      const dateStr = currentDate.toISOString().split("T")[0];
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
      const bgColor = isPast 
        ? "#666666" 
        : getDayColor(count, isSelectedDay, isHoveredDay, new Date(dateStr));
      
      events.push({
        id: dateStr,
        start: dateStr,
        allDay: true,
        display: "background",
        backgroundColor: bgColor,
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    setBackgroundEvents(events);
  };

  const handleDatesSet = (arg: DatesSetArg) => {
    // Initial load of background events when the calendar view changes
    if (schedule) {
      updateBackgroundEvents();
    }
  };

  const SlotsModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Horarios disponibles
        </h3>
        <button 
          onClick={() => {
            setShowModal(false);
            setClickedDate("");
          }}
          className="text-gray-500 transition-all duration-500 transform hover:text-red-500 focus:outline-none rounded-full hover:scale-105"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">
        Selecciona un horario para {formatDate(clickedDate)}
        </p>
        
        {slots.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {slots.map((slot, index) => (
          <button
            key={index}
            onClick={() => handleSlotClick(slot)}
            className={`px-3 py-2 rounded-full border text-center transition-all duration-200 transform ${
            selectedSlot === slot && clickedDate === selectedDate
              ? "bg-[#05AC9C] text-white border-[#05AC9C] scale-105 shadow-md"
              : "bg-white text-black border-gray-300 hover:bg-[#05AC9C] hover:text-white hover:border-[#05AC9C] hover:scale-105"
            }`}
          >
            {slot}
          </button>
          ))}
        </div>
        ) : (
        <p className="text-center py-4 text-gray-600">No hay horarios disponibles</p>
        )}
        
        <div className="flex justify-end mt-6">
        <button
          onClick={() => {
            setShowModal(false);
            setClickedDate("");
          }}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-all duration-200 transform hover:scale-105 shadow-md"
        >
          Cerrar
        </button>
        </div>
      </div>
      </div>
    );
  };

  return (
    <div>
      <FullCalendar
        ref={calendarRef}
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
        lazyFetching={false}
        firstDay={1}
      />
      {selectedDate && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold">
            Horarios disponibles para {formatDate(selectedDate)}:
          </h4>
          {slots.length > 0 ? (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {slots.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => handleSlotClick(slot)}
                  className={`px-3 py-1 rounded border text-center transition-colors ${selectedSlot === slot
                    ? "bg-[#05668d] text-white border-[#05668d]"
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
      
      <SlotsModal />
      
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
