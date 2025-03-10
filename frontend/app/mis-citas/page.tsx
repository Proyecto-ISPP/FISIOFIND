'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';
import listPlugin from '@fullcalendar/list';
import Cards from "@/components/ui/cards";
import dynamic from "next/dynamic";

const Calendar = dynamic(() => import("@/components/ui/calendar"), { ssr: false });

interface APIResponse {
  message: string;
  status: string;
}

const initialEvents = [
  { title: 'Reunión de equipo', start: '2025-03-01T10:00:00', end: '2025-03-01T11:30:00', description: 'Reunión semanal de equipo' },
  { title: 'Patata', allDay: true, start: '2025-03-01', description: 'Patata' },
  { title: 'Almuerzo con cliente', start: '2025-03-02T12:00:00', end: '2025-03-02T13:30:00', description: 'Almuerzo con el cliente para discutir el proyecto' },
];

export default function Home() {
  const [data, setData] = useState<APIResponse | null>(null);
  const [view, setView] = useState<"calendar" | "cards">("calendar"); // Estado para cambiar vista
  const [events, setEvents] = useState(initialEvents);
  
  // Estado para el nuevo evento
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    allDay: false
  });

  useEffect(() => {
    axios.get("http://localhost:8000/app_user/prueba/")
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Función para añadir eventos
  const addEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.start) {
      alert("El título y la fecha de inicio son obligatorios.");
      return;
    }

    const formattedEvent = {
      title: newEvent.title,
      start: newEvent.start,
      end: newEvent.end || null,
      allDay: newEvent.allDay
    };

    setEvents([...events, formattedEvent]);
    setNewEvent({ title: "", start: "", end: "", allDay: false }); // Reset form
  };

  return (
    <>
      {/* Botón para cambiar entre FullCalendar y vista en Cards */}
      <div className="flex justify-center my-4">
        <button 
          onClick={() => setView(view === "calendar" ? "cards" : "calendar")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
        >
          {view === "calendar" ? "Ver en Tarjetas" : "Ver Calendario"}
        </button>
      </div>

      {/* Formulario para agregar eventos */}
      {/* <div className="max-w-lg mx-auto bg-white shadow-md p-4 rounded-md">
        <h2 className="text-lg font-semibold mb-3">Añadir Evento</h2>
        <form onSubmit={addEvent} className="space-y-2">
          <input 
            type="text" 
            placeholder="Título del evento" 
            value={newEvent.title} 
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} 
            className="w-full p-2 border rounded-md"
            required
          />
          <input 
            type="datetime-local" 
            value={newEvent.start} 
            onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })} 
            className="w-full p-2 border rounded-md"
            required
          />
          <input 
            type="datetime-local" 
            value={newEvent.end} 
            onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })} 
            className="w-full p-2 border rounded-md"
          />
          <label className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              checked={newEvent.allDay} 
              onChange={(e) => setNewEvent({ ...newEvent, allDay: e.target.checked, end: "" })} 
            />
            <span>Evento de todo el día</span>
          </label>
          <button 
            type="submit" 
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
          >
            Añadir Evento
          </button>
        </form>
      </div> */}

      {/* Vista del Calendario */}
      {view === "calendar" && (
        <Calendar events={events} />
      )}

      {/* Vista en Cards */}
      {view === "cards" && (
        <Cards events={events} />
      )}

      {/* Mostrar datos de API si existen */}
      {data && (
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold">Mensaje: {data.message}</p>
          <p className="text-gray-600">Estado: {data.status}</p>
        </div>
      )}
    </>
  );
}
