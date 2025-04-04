import React, { useState, useRef, useEffect } from "react";
import FullCalendar, { EventClickArg, DayCellContentArg } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import esLocale from "@fullcalendar/core/locales/es";
import "@/app/my-appointments/my-appointments.css";
import DynamicFormModal from "./dinamic-form-modal";
import { AppointmentModal } from "./appointment-modal";
import { CalendarProps } from "@/lib/definitions";
import { getApiBaseUrl } from "@/utils/api";
import axios from "axios";
import { formatDateFromIso } from "@/lib/utils";

const CalendarPage = ({
  events,
  handleAlternativesSubmit,
  setSelectedEvent,
  selectedEvent,
  setEditionMode,
  editionMode,
  isClient,
  token,
  currentRole,
}: {
  events: any;
  handleAlternativesSubmit: (alternatives: Record<string, { start: string; end: string }[]>) => void;
  setSelectedEvent: (event: CalendarProps | null) => void;
  selectedEvent: CalendarProps | null;
  setEditionMode: (mode: boolean) => void;
  editionMode: boolean;
  isClient: boolean;
  token: string | null;
  currentRole: string;
}) => {
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Collapsible Sidebar Toggle (visible only on mobile) */}
        <button
          className="lg:hidden flex items-center justify-center bg-white rounded-lg shadow-sm p-2 mb-2"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          <span className="mr-2">
            {isSidebarCollapsed ? "Mostrar eventos" : "Ocultar eventos"}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isSidebarCollapsed ?
              <path d="M9 18l6-6-6-6" /> :
              <path d="M15 18l-6-6 6-6" />
            }
          </svg>
        </button>

        {/* Sidebar for Event Cards */}
        <div
          className={`${isSidebarCollapsed ? "hidden" : "block"
            } lg:block lg:w-1/3 xl:w-1/4 bg-white rounded-lg shadow-sm p-4 mb-4 lg:mb-0 transition-all duration-300 ease-in-out`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-medium text-lg text-gray-700">Eventos</h2>
            <div className="flex gap-2">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-emerald-300 mr-1"></span>
                <span className="text-xs text-gray-500">Confirmado</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-amber-200 mr-1"></span>
                <span className="text-xs text-gray-500">Pendiente</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-sky-200 mr-1"></span>
                <span className="text-xs text-gray-500">Reservado</span>
              </div>
            </div>
          </div>
          <div className="space-y-2 max-h-[calc(100vh-150px)] overflow-y-auto pr-1 custom-scrollbar">
            {events.length === 0 ? (
              <p className="text-gray-500 text-sm py-6 text-center">No hay eventos programados</p>
            ) : (
              events.map((event: any) => (
                <div
                  key={event.id}
                  className="p-3 border border-gray-100 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer bg-white hover:bg-gray-50"
                  onMouseEnter={() => setHoveredEventId(event.title)}
                  onMouseLeave={() => setHoveredEventId(null)}
                  onClick={() =>
                    setSelectedEvent({
                      id: event.id?.toString() || "",
                      title: event.title?.toString() || "Sin título",
                      start: event.start?.toString() || "",
                      end: event.end?.toString() || "",
                      description: event.description || "Sin descripción",
                      status: event.status || "Sin estado",
                      service: {
                        type: event.service?.type || "Sin servicio",
                        duration: event.service?.duration || 0,
                        questionaryResponses: event.questionaryResponses || null,
                      },
                      alternatives: event.alternatives || null,
                    })
                  }
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-800 line-clamp-1">{event.title}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${event.extendedProps?.status === "confirmed"
                          ? "bg-green-50 text-green-700"
                          : event.extendedProps?.status === "pending"
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                    >
                      {event.extendedProps?.status === "confirmed"
                        ? "Confirmado"
                        : event.extendedProps?.status === "pending"
                          ? "Pendiente"
                          : "Reservado"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1 inline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {/* {new Date(event.start).toLocaleString("es", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })} */}
                    {formatDateFromIso(event.start)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Calendar */}
        <div className="lg:flex-1">
          <Calendar
            events={events}
            hoveredEventId={hoveredEventId}
            handleAlternativesSubmit={handleAlternativesSubmit}
            setSelectedEvent={setSelectedEvent}
            selectedEvent={selectedEvent}
            setEditionMode={setEditionMode}
            editionMode={editionMode}
            isClient={isClient}
            token={token}
            currentRole={currentRole}
          />
        </div>
      </div>
    </div>
  );
};

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
  const calendarRef = useRef<FullCalendar>(null);
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.toLocaleString("es", { month: "long" });
  const currentYear = today.getFullYear();
  // Load the initial view from localStorage or default to "month"
  const [view, setView] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("calendarView") || "month";
    }
    return "month"; // Default to "month" if not on the client side
  });
  const [schedule, setSchedule] = useState<any>(null); // Datos del schedule desde la API
  const [physioId, setPhysioId] = useState<number | null>(null); // ID del fisioterapeuta

  // Traer el schedule desde la API usando la id del fisioterapeuta
  useEffect(() => {
    if (isClient) {
      if (token) {
        if (currentRole == "physiotherapist") {
          const getCurrentUser = async () => {
            try {
              const response = await axios.get(
                `${getApiBaseUrl()}/api/app_user/current-user/`,
                {
                  headers: {
                    Authorization: "Bearer " + token,
                  }
                }
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
      }
    }
  }, [currentRole, token, isClient]);


  // Traer el schedule desde la API usando la id del fisioterapeuta
  useEffect(() => {
    if (physioId) {
      const fetchSchedule = async () => {
        try {
          const response = await axios.get(
            `${getApiBaseUrl()}/api/appointment/schedule/${physioId}/`
          );
          if (response.status === 200) {
            const parsed_schedule = response.data.schedule;
            setSchedule(parsed_schedule);
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
        view === "month"
          ? "dayGridMonth"
          : view === "week"
            ? "timeGridWeek"
            : view === "day"
              ? "timeGridDay"
              : "listWeek"
      );
    }
  }, [view]);

  const handleViewChange = (newView: string) => {
    setView(newView);
    localStorage.setItem("calendarView", newView); // Persist the view in localStorage
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView(
        newView === "month"
          ? "dayGridMonth"
          : newView === "week"
            ? "timeGridWeek"
            : newView === "day"
              ? "timeGridDay"
              : "listWeek"
      );
    }
  };

  const handlePrev = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.prev();
    }
  };

  const handleNext = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.next();
    }
  };

  const handleToday = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.today();
    }
    handleViewChange("today");
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-blue-50"> {/* Updated background color */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center">
            <button
              onClick={handlePrev}
              className="text-gray-500 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-100" // Updated hover color
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
            <h1 className="text-xl font-medium text-blue-700 capitalize mx-2 sm:mx-4"> {/* Updated text color */}
              {calendarRef.current?.getApi()?.view.title || `${currentMonth} de ${currentYear}`}
            </h1>
            <button
              onClick={handleNext}
              className="text-gray-500 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-100" // Updated hover color
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

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleToday}
              className="px-3 py-1 text-sm font-medium rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors" // Updated colors
            >
              Hoy
            </button>
            <div className="flex bg-blue-50 rounded-lg"> {/* Updated background color */}
              <button
                onClick={() => handleViewChange("month")}
                className={`px-3 py-1 text-sm font-medium rounded-l-lg transition-colors ${view === "month"
                    ? "bg-blue-500 text-white"
                    : "text-blue-700 hover:bg-blue-200"
                  }`}
              >
                Mes
              </button>
              <button
                onClick={() => handleViewChange("week")}
                className={`px-3 py-1 text-sm font-medium transition-colors ${view === "week"
                    ? "bg-blue-500 text-white"
                    : "text-blue-700 hover:bg-blue-200"
                  }`}
              >
                Semana
              </button>
              <button
                onClick={() => handleViewChange("day")}
                className={`px-3 py-1 text-sm font-medium rounded-r-lg transition-colors ${view === "day"
                    ? "bg-blue-500 text-white"
                    : "text-blue-700 hover:bg-blue-200"
                  }`}
              >
                Día
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-blue-50 calendar-container"> {/* Updated background color */}
        <FullCalendar<any>
          ref={calendarRef}
          height="auto"
          contentHeight="auto"
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
          locale={esLocale}
          initialView="dayGridMonth"
          headerToolbar={false}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          events={events}
          handleWindowResize={true}
          eventContent={(eventInfo: EventContentArg) => (
            <div className="w-full h-full p-1 overflow-hidden text-sm">
              <div className="font-medium text-xs text-blue-700">{eventInfo.timeText}</div> {/* Updated text color */}
              <div className="whitespace-nowrap overflow-hidden overflow-ellipsis text-xs sm:text-sm font-medium text-blue-800"> {/* Updated text color */}
                {eventInfo.event.title}
              </div>
            </div>
          )}
          eventClassNames={(eventInfo: EventContentArg) => {
            const baseClasses = "rounded-md border-l-2 shadow-sm transition-all duration-200";

            if (eventInfo.event.title === hoveredEventId) {
              return [`${baseClasses} transform scale-102 shadow`];
            }

            switch (eventInfo.event.extendedProps.status) {
              case "pending":
                return [`${baseClasses} border-yellow-300 bg-yellow-100 text-yellow-800`];
              case "confirmed":
                return [`${baseClasses} border-green bg-green text-white`]; // Updated to match schedule calendar
              case "booked":
                return [`${baseClasses} border-red bg-red text-white`]; // Updated to match schedule calendar
              default:
                return [`${baseClasses} border-gray-300 bg-gray-100 text-gray-800`];
            }
          }}
          eventClick={(info: EventClickArg) => {
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
          dayCellContent={({ date, dayNumberText }: DayCellContentArg) => {
            const isToday =
              date.getDate() === currentDay &&
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === today.getFullYear();

            return (
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center mx-auto ${isToday
                    ? "bg-[#05AC9C] text-white font-medium"
                    : "text-[#05668D]"
                  }`}
              >
                {dayNumberText}
              </div>
            );
          }}
        />
      </div>

      {/* Custom styles for calendar */}
      <style jsx global>{`
        .fc .fc-daygrid-day.fc-day-today {
          background-color: rgba(0, 128, 0, 0.1); /* Lighter green background */
        }
        
        .fc .fc-button-primary {
          background-color: #008000; /* Green */
          border-color: #008000;
        }
        
        .fc .fc-timegrid-slot, .fc .fc-daygrid-day, .fc th {
          border-color: #e5e7eb; /* Light gray */
        }
        
        .fc-theme-standard td, .fc-theme-standard th {
          border-color: #e5e7eb; /* Light gray */
        }
        
        .fc-scrollgrid {
          border-color: #e5e7eb; /* Light gray */
        }
        
        .calendar-container {
          min-height: 50vh;
          max-height: 70vh;
          background-color: white; /* Ensure white background */
        }
        
        .fc-view-harness {
          background-color: white; /* Ensure white background for the calendar view */
        }
        
        .fc-col-header, .fc-scrollgrid-sync-table {
          background-color: white; /* Ensure white background for header and table */
        }
        
        @media (max-width: 640px) {
          .calendar-container {
            min-height: 60vh;
          }
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6; /* Light gray */
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db; /* Gray */
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af; /* Darker gray */
        }
        
        .transform.scale-102 {
          transform: scale(1.02);
        }
      `}</style>

      {/* Modals */}
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

export default CalendarPage;

