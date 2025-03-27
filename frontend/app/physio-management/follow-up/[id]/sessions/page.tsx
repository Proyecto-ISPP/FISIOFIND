"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/utils/api";
import styles from "@/app/global.css";
// Se ha eliminado la importación de MultiSelectDropdown

interface Session {
  id: number;
  name: string;
  treatment: number;
  day_of_week: string[];
}

interface Option {
  value: string;
  label: string;
}

// Componente personalizado para seleccionar días
const DaysDropdown = ({
  options,
  selected,
  setSelected,
  placeholder,
}: {
  options: Option[];
  selected: string[];
  setSelected: (value: string[]) => void;
  placeholder: string;
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((day) => day !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="border border-gray-300 rounded-xl py-2 px-3 cursor-pointer text-lg" // Increased padding and text size
      >
        {selected.length === 0
          ? placeholder
          : `${selected.length} seleccionado${selected.length > 1 ? "s" : ""}`}
      </div>
      {dropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg"> {/* Added max-height and scroll */}
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => toggleOption(option.value)}
              className="flex items-center justify-between px-4 py-6 hover:bg-gray-100 cursor-pointer first:rounded-t-xl last:rounded-b-xl" // Increased padding and text size
            >
              <span className="text-gray-700">{option.label}</span>
              {selected.includes(option.value) && (
                <span className="text-[#6bc9be] font-bold text-xl">✓</span> // Increased checkmark size
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Move the SessionsContent to a separate client component
const SessionsContent = ({ treatmentId }: { treatmentId: string }) => {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newSession, setNewSession] = useState({
    name: "",
    day_of_week: [] as string[],
  });

  const daysOfWeek: Option[] = [
    { value: "Monday", label: "Lunes" },
    { value: "Tuesday", label: "Martes" },
    { value: "Wednesday", label: "Miércoles" },
    { value: "Thursday", label: "Jueves" },
    { value: "Friday", label: "Viernes" },
    { value: "Saturday", label: "Sábado" },
    { value: "Sunday", label: "Domingo" },
  ];

  // Add state for edit mode
  const [editMode, setEditMode] = useState(false);
  const [sessionToEdit, setSessionToEdit] = useState<Session | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [sessionIdToDelete, setSessionIdToDelete] = useState<number | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se ha encontrado el token de autenticación");
        return;
      }

      const response = await fetch(
        `${getApiBaseUrl()}/api/treatments/${treatmentId}/sessions/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al cargar las sesiones");
      }

      const data = await response.json();
      setSessions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar las sesiones");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se ha encontrado el token de autenticación");
        return;
      }

      const response = await fetch(
        `${getApiBaseUrl()}/api/treatments/${treatmentId}/sessions/create/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newSession,
            treatment: treatmentId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al crear la sesión");
      }

      await loadSessions();
      setNewSession({ name: "", day_of_week: [] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la sesión");
    }
  };

  const handleEditClick = (session: Session) => {
    setSessionToEdit(session);
    setEditMode(true);
  };

  const handleUpdateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!sessionToEdit) return;

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se ha encontrado el token de autenticación");
        return;
      }

      const response = await fetch(
        `${getApiBaseUrl()}/api/treatments/sessions/${sessionToEdit.id}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: sessionToEdit.name,
            day_of_week: sessionToEdit.day_of_week,
            treatment: treatmentId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar la sesión");
      }

      await loadSessions();
      setEditMode(false);
      setSessionToEdit(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar la sesión");
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setSessionToEdit(null);
  };

  const handleDeleteClick = (sessionId: number) => {
    setSessionIdToDelete(sessionId);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteSession = async () => {
    try {
      if (!sessionIdToDelete) return;

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se ha encontrado el token de autenticación");
        return;
      }

      const response = await fetch(
        `${getApiBaseUrl()}/api/treatments/sessions/${sessionIdToDelete}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar la sesión");
      }

      await loadSessions();
      setShowDeleteConfirmation(false);
      setSessionIdToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar la sesión");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setSessionIdToDelete(null);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() =>
            router.push(`/physio-management/follow-up/${treatmentId}`)
          }
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-xl inline-flex items-center mb-6"
        >
          ← Volver
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Sesiones del Tratamiento
        </h1>

        <form
          onSubmit={handleCreateSession}
          className="mb-8 p-6 bg-white rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Crear Nueva Sesión
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la sesión
              </label>
              <input
                type="text"
                value={newSession.name}
                onChange={(e) =>
                  setNewSession({ ...newSession, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Nombre de la sesión"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Días de la semana
              </label>
              <DaysDropdown
                options={daysOfWeek}
                selected={newSession.day_of_week}
                setSelected={(value) =>
                  setNewSession({ ...newSession, day_of_week: value })
                }
                placeholder="Selecciona los días de la semana"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mb-8 mt-8 px-6 py-3 bg-[#6bc9be] text-white font-medium rounded-xl hover:bg-[#5ab8ad] text-white font-medium rounded-xl hover:bg-[#5ab8ad] focus:outline-none focus:ring-2 focus:ring-[#6bc9be] focus:ring-offset-2 transition-colors duration-200 flex items-center space-x-2"
          >
            Crear Sesión
          </button>
        </form>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white p-6 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:transform hover:scale-[1.02]"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {session.name || `Sesión ${session.id}`}
              </h3>
              <p className="text-gray-600 mb-4">
                Días:{" "}
                {Array.isArray(session.day_of_week)
                  ? session.day_of_week
                      .map(
                        (day) => daysOfWeek.find((d) => d.value === day)?.label
                      )
                      .join(", ")
                  : ""}
              </p>

              <div className="flex flex-col space-y-2">
                <button
                  onClick={() =>
                    router.push(
                      `/physio-management/follow-up/${treatmentId}/sessions/${session.id}/exercises/`
                    )
                  }
                  className="w-full px-6 py-3 bg-[#05668d] text-white font-medium rounded-xl hover:bg-[#045a7d] focus:outline-none focus:ring-2 focus:ring-[#05668d] focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Gestionar Ejercicios</span>
                </button>
                <button
                  onClick={() =>
                    router.push(
                      `/physio-management/follow-up/${treatmentId}/sessions/${session.id}/tests/physio/`
                    )
                  }
                  className="w-full px-6 py-3 bg-[#05668d] text-white font-medium rounded-xl hover:bg-[#045a7d] focus:outline-none focus:ring-2 focus:ring-[#05668d] focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Gestionar Cuestionario</span>
                </button>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => handleEditClick(session)}
                    className="flex-1 px-4 py-2 bg-[#0c7986] text-white font-medium rounded-xl hover:bg-[#0a6875] focus:outline-none focus:ring-2 focus:ring-[#0c7986] focus:ring-offset-2 transition-all duration-200"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteClick(session.id)}
                    className="flex-1 px-4 py-2 bg-red-400 text-white font-medium rounded-xl hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 transition-all duration-200"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Session Modal */}
        {editMode && sessionToEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Editar Sesión
              </h2>
              <form onSubmit={handleUpdateSession} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la Sesión
                  </label>
                  <input
                    type="text"
                    value={sessionToEdit.name}
                    onChange={(e) =>
                      setSessionToEdit({
                        ...sessionToEdit,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nombre de la sesión"
                  />
                </div>
                <div>
                  {/* En el modal de edición usamos también nuestro DaysDropdown */}
                  <DaysDropdown
                    options={daysOfWeek}
                    selected={sessionToEdit.day_of_week || []}
                    setSelected={(value) =>
                      setSessionToEdit((prev) =>
                        prev ? { ...prev, day_of_week: value } : prev
                      )
                    }
                    placeholder="Selecciona los días de la semana"
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#6bc9be] text-white rounded-xl hover:bg-[#5ab8ad]"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Confirmar eliminación
              </h2>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que deseas eliminar esta sesión? Esta acción no
                se puede deshacer.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteSession}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main page component
const SessionsPage = ({ params }: { params: { id: string } }) => {
  return <SessionsContent treatmentId={params.id} />;
};

export default SessionsPage;
