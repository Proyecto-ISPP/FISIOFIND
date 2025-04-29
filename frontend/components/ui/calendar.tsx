import React, { useState, useRef, useEffect } from "react";
import FullCalendar, { EventClickArg, DayCellContentArg } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import esLocale from "@fullcalendar/core/locales/es";
import "@/app/my-appointments/my-appointments.css";
import DynamicFormModal from "./dinamic-form-modal";
import { AppointmentModal } from "./appointment-modal";
import { CalendarProps } from "@/lib/definitions";
import { getApiBaseUrl } from "@/utils/api";
import axios from "axios";

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
  setHoveredEventId,
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
  setHoveredEventId: (eventId: string | null) => void;
}) => {
  const calendarRef = useRef<FullCalendar>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const today = new Date();
  const currentDay = today.getDate();

  const [view, setView] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("calendarView") || "month";
    }
    return "month";
  });
  const [schedule, setSchedule] = useState<any>(null);
  const [physioId, setPhysioId] = useState<number | null>(null);

  useEffect(() => {
    if (isClient && token && currentRole === "physiotherapist") {
      const getCurrentUser = async () => {
        try {
          const response = await axios.get(
            `${getApiBaseUrl()}/api/app_user/current-user/`,
            { headers: { Authorization: "Bearer " + token } }
          );
          if (response.status === 200) {
            setPhysioId(response.data.physio.id);
          }
        } catch (error) {
          console.error("Error fetching current-user:", error);
        }
      };
      getCurrentUser();
    }
  }, [currentRole, token, isClient]);

  useEffect(() => {
    if (physioId) {
      const fetchSchedule = async () => {
        try {
          const response = await axios.get(
            `${getApiBaseUrl()}/api/appointment/schedule/${physioId}/`
          );
          if (response.status === 200) {
            setSchedule(response.data.schedule);
          }
        } catch (error) {
          console.error("Error fetching schedule:", error);
        }
      };
      fetchSchedule();
    }
  }, [physioId]);

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView(
        view === "month" ? "dayGridMonth" : "dayGridMonth" // Simplified for this example
      );
    }
  }, [view]);

  const handlePrev = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.prev();
      setCurrentDate(calendarApi.getDate());
    }
  };

  const handleNext = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.next();
      setCurrentDate(calendarApi.getDate());
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm">
      <div className="p-2 border-b border-gray-100 bg-blue-50">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center">
            <button
              onClick={handlePrev}
              className="text-gray-500 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-100"
              aria-label="Previous"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <h1 className="text-xl font-medium text-blue-700 capitalize mx-2 sm:mx-4">
              {currentDate.toLocaleString("es", { month: "long", year: "numeric" })}
            </h1>
            <button
              onClick={handleNext}
              className="text-gray-500 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-100"
              aria-label="Next"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="calendar-container">
        <FullCalendar
          ref={calendarRef}
          height="auto" // Let the calendar determine its own height
          contentHeight="auto"
          plugins={[dayGridPlugin]}
          locale={esLocale}
          initialView="dayGridMonth"
          headerToolbar={false}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          events={events}
          handleWindowResize={true}
          eventContent={(eventInfo) => (
            <div className="w-full h-full p-1 overflow-hidden text-sm">
              <div className="font-medium text-xs text-blue-700">{eventInfo.timeText}</div>
              <div className="whitespace-nowrap overflow-hidden overflow-ellipsis text-xs sm:text-sm font-medium text-blue-800">
                {eventInfo.event.title}
              </div>
            </div>
          )}
          eventClassNames={(eventInfo) => {
            if (eventInfo.event.title === hoveredEventId) {
              return ["fc-event-hovered"];
            }
            if (eventInfo.event.extendedProps.status === "finished") {
              return ["fc-event-finished"];
            } else if (eventInfo.event.extendedProps.status === "pending") {
              return ["fc-event-pending"];
            } else if (eventInfo.event.extendedProps.status === "confirmed") {
              return ["fc-event-confirmed"];
            } else if (eventInfo.event.extendedProps.status === "booked") {
              return ["fc-event-booked"];
            }
            return [];
          }}
          eventClick={(info) => {
            setSelectedEvent({
              id: info.event.id?.toString() || "",
              title: info.event.title?.toString() || "Sin título",
              start: info.event.start?.toISOString() || "",
              end: info.event.end?.toISOString() || "",
              description: info.event.extendedProps?.description || "Sin descripción",
              status: info.event.extendedProps.status || "Sin estado",
              service: {
                type: info.event.extendedProps.service?.type || "Sin servicio",
                duration: info.event.extendedProps.service?.duration || 0,
                questionaryResponses: info.event.extendedProps.questionaryResponses || null,
              },
              alternatives: info.event.extendedProps.alternatives || null,
            });
          }}
          dayCellContent={({ date, dayNumberText }) => {
            const isToday =
              date.getDate() === currentDay &&
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === today.getFullYear();
            return (
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center mx-auto ${
                  isToday ? "bg-[#05AC9C] text-white font-medium" : "text-[#05668D]"
                }`}
              >
                {dayNumberText}
              </div>
            );
          }}
        />
      </div>

      <style jsx global>{`
        .fc .fc-daygrid-day.fc-day-today {
          background-color: rgba(0, 128, 0, 0.1);
        }

        .fc {
          width: 100% !important; // Ensure the calendar takes the full width of its container
        }

        .fc .fc-button-primary {
          background-color: #008000;
          border-color: #008000;
        }

        .fc .fc-timegrid-slot, .fc .fc-daygrid-day, .fc th {
          border-color: #e5e7eb;
        }

        .fc-theme-standard td, .fc-theme-standard th {
          border-color: #e5e7eb;
        }

        .fc-scrollgrid {
          border-color: #e5e7eb;
        }

        .calendar-container {
          width: fit-content; // Adjust width to fit the calendar content
          height: auto; // Let the height be determined by the calendar
          background-color: white;
          padding: 0.25rem; // Reduced padding to minimize extra space
          margin: 0 auto; // Center the container
        }

        .fc-view-harness {
          height: auto !important; // Let the calendar determine its own height
          background-color: white;
        }

        .fc-col-header, .fc-scrollgrid-sync-table {
          background-color: white;
        }

        .fc-scrollgrid, .fc-scrollgrid-sync-table {
          height: auto !important; // Let the height adjust naturally
        }

        @media (max-width: 640px) {
          .calendar-container {
            width: 100%; // On smaller screens, take full width
            padding: 0.25rem;
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        .transform.scale-102 {
          transform: scale(1.02);
        }
      `}</style>

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

      {editionMode && (
        <DynamicFormModal
          event={selectedEvent}
          onClose={() => setEditionMode(false)}
          onSubmit={handleAlternativesSubmit}
          schedule={schedule}
        />
      )}
    </div>
  );
};

export default Calendar;