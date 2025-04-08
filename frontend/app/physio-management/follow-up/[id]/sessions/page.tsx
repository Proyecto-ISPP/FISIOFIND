"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/utils/api";
// Se ha eliminado la importación de MultiSelectDropdown

// First, let's update the Session interface to include progress tracking fields
interface Session {
  id: number;
  name: string;
  treatment: number;
  day_of_week: string[];
  // Add new fields for progress tracking
  exercises_count?: number;
  completed_exercises_count?: number;
  tests_count?: number;
  completed_tests_count?: number;
  total_series?: number;
  total_logs?: number;
  total_expected_logs?: number;
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

  // Update the loadSessions function to fetch additional progress data
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
      
      // Fetch test and exercise information for each session
      const sessionsWithInfo = await Promise.all(
        data.map(async (session: Session) => {
          try {
            // Check if the session has a test
            const testResponse = await fetch(
              `${getApiBaseUrl()}/api/treatments/sessions/${session.id}/test/view/`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            
            if (testResponse.ok) {
              // Session has a test
              session.tests_count = 1;
              
              // Check if the patient has responded to the test
              const testResponsesResponse = await fetch(
                `${getApiBaseUrl()}/api/treatments/sessions/${session.id}/test/responses/`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );
              
              if (testResponsesResponse.ok) {
                const testResponsesData = await testResponsesResponse.json();
                session.completed_tests_count = testResponsesData.length;
              } else {
                session.completed_tests_count = 0;
              }
            } else {
              // Session doesn't have a test
              session.tests_count = 0;
              session.completed_tests_count = 0;
            }
  
            // Fetch exercises for the session
            const exercisesResponse = await fetch(
              `${getApiBaseUrl()}/api/treatments/sessions/${session.id}/exercises/`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
  
            if (exercisesResponse.ok) {
              const exerciseSessions = await exercisesResponse.json();
              session.exercises_count = exerciseSessions.length;
              
              // Calculate total series for all exercises in this session
              let totalSeries = 0;
              let totalLogs = 0;
              
              // For each exercise session, get its series
              for (const exerciseSession of exerciseSessions) {
                const seriesResponse = await fetch(
                  `${getApiBaseUrl()}/api/treatments/exercise-sessions/${exerciseSession.id}/series/`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                    },
                  }
                );
                
                if (seriesResponse.ok) {
                  const seriesData = await seriesResponse.json();
                  totalSeries += seriesData.length;
                  
                  // For each series, get its logs
                  for (const series of seriesData) {
                    try {
                      const logsResponse = await fetch(
                        `${getApiBaseUrl()}/api/treatments/exercise-sessions/${exerciseSession.id}/logs/`,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                          },
                        }
                      );
                      
                      if (logsResponse.ok) {
                        const logsData = await logsResponse.json();
                        // Filter logs for this specific series
                        const seriesLogs = logsData.filter((log: { series: number }) => log.series === series.id);
                        totalLogs += seriesLogs.length;
                      }
                    } catch (error) {
                      console.error(`Error fetching logs for series ${series.id}:`, error);
                    }
                  }
                }
              }
              
              // Calculate the total expected logs (series * days of the week)
              const totalExpectedLogs = totalSeries * session.day_of_week.length;
              
              // Store these values for progress calculation
              session.total_series = totalSeries;
              session.total_logs = totalLogs;
              session.total_expected_logs = totalExpectedLogs;
              
              // Calculate completed exercises percentage
              session.completed_exercises_count = totalExpectedLogs > 0 
                ? Math.round((totalLogs / totalExpectedLogs) * 100) 
                : 0;
            } else {
              session.exercises_count = 0;
              session.completed_exercises_count = 0;
              session.total_series = 0;
              session.total_logs = 0;
              session.total_expected_logs = 0;
            }
          } catch (error) {
            console.error(`Error fetching info for session ${session.id}:`, error);
            // If there's an error, set default values
            session.tests_count = session.tests_count || 0;
            session.completed_tests_count = session.completed_tests_count || 0;
            session.exercises_count = session.exercises_count || 0;
            session.completed_exercises_count = session.completed_exercises_count || 0;
            session.total_series = session.total_series || 0;
            session.total_logs = session.total_logs || 0;
            session.total_expected_logs = session.total_expected_logs || 0;
          }
          
          return session;
        })
      );
      
      setSessions(sessionsWithInfo);
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

  const getSessionProgress = (session: Session) => {
    // Calculate progress for exercises based on logs completed vs expected
    let exerciseProgress = 0;
    if (session.total_expected_logs && session.total_expected_logs > 0) {
      exerciseProgress =
        ((session.total_logs ?? 0) / session.total_expected_logs) * 100;
    }

    // Calculate progress for tests based on responses completed vs expected
    let testProgress = 0;
    if (session.tests_count && session.tests_count > 0) {
      testProgress =
        ((session.completed_tests_count ?? 0) / session.day_of_week.length) *
        100;
    }

    // Calculate overall progress (weighted average)
    let totalWeight = 0;
    let weightedProgress = 0;

    if (session.total_expected_logs && session.total_expected_logs > 0) {
      weightedProgress += exerciseProgress;
      totalWeight += 1;
    }

    if (session.tests_count && session.tests_count > 0) {
      weightedProgress += testProgress;
      totalWeight += 1;
    }

    const overallProgress =
      totalWeight > 0 ? weightedProgress / totalWeight : 0;
    return Math.round(overallProgress);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "rgb(238, 251, 250)" }}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() =>
              router.push(`/physio-management/follow-up/${treatmentId}`)
            }
            className="bg-white hover:bg-gray-100 text-[#05668D] font-semibold py-2 px-4 rounded-xl inline-flex items-center shadow-md transition-all duration-300"
          >
            ← Volver
          </button>
          <h1 className="text-3xl font-bold text-[#05668D]">Sesiones del Tratamiento</h1>
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        <form
          onSubmit={handleCreateSession}
          className="mb-8 p-6 bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          <h2 className="text-2xl font-semibold text-[#05668D] mb-6">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#41B8D5] transition-all duration-300"
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
            className="mt-8 px-6 py-3 bg-gradient-to-r from-[#6BC9BE] to-[#05668D] text-white font-medium rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#6BC9BE] focus:ring-offset-2 transition-all duration-300 shadow-md flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Crear Sesión
          </button>
        </form>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => {
            const progress = getSessionProgress(session);

            return (
              <div
                key={session.id}
                className="bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:transform hover:translate-y-[-2px] relative"
              >
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => handleEditClick(session)}
                    className="p-2 text-gray-600 hover:text-[#05668D] transition-colors duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(session.id)}
                    className="p-2 text-gray-600 hover:text-red-500 transition-colors duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                <h3 className="text-xl font-semibold text-[#05668D] mb-3">
                  {session.name || `Sesión ${session.id}`}
                </h3>

                {/* Progress section */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Progreso del paciente
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-[#41B8D5] to-[#1E5ACD] h-2.5 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Details section */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gradient-to-br from-[#f8fdfc] to-[#edf8f7] p-3 rounded-xl shadow-sm">
                    <p className="text-gray-600 border-b border-gray-200 pb-1 mb-2 text-sm">
                      Ejercicios
                    </p>
                    <p className="font-medium text-[#05668D]">
                      {session.exercises_count || 0} ejercicios
                    </p>
                    {session.total_logs !== undefined &&
                      session.total_expected_logs !== undefined && (
                        <p className="text-xs text-gray-500 mt-1">
                          {session.total_logs} de {session.total_expected_logs}{" "}
                          registros
                        </p>
                      )}
                  </div>
                  <div className="bg-gradient-to-br from-[#f8fdfc] to-[#edf8f7] p-3 rounded-xl shadow-sm">
                    <p className="text-gray-600 border-b border-gray-200 pb-1 mb-2 text-sm">
                      Cuestionarios
                    </p>
                    <p className="font-medium text-[#05668D]">
                      {session.tests_count
                        ? "1 cuestionario"
                        : "Sin cuestionario"}
                    </p>
                    {session.tests_count &&
                      session.completed_tests_count !== undefined && (
                        <p className="text-xs text-gray-500 mt-1">
                          {session.completed_tests_count} de{" "}
                          {session.day_of_week.length} respuestas
                        </p>
                      )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#f8fdfc] to-[#edf8f7] p-3 rounded-xl shadow-sm mb-4">
                  <p className="text-gray-600 border-b border-gray-200 pb-1 mb-2 text-sm">
                    Días programados
                  </p>
                  <p className="text-[#05668D]">
                    {Array.isArray(session.day_of_week)
                      ? session.day_of_week
                          .map(
                            (day) =>
                              daysOfWeek.find((d) => d.value === day)?.label
                          )
                          .join(", ")
                      : ""}
                  </p>
                </div>

                <div className="flex flex-col space-y-2 mt-6">
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        router.push(
                          `/physio-management/follow-up/${treatmentId}/sessions/${session.id}/exercises/`
                        )
                      }
                      className="flex-1 px-4 py-3 bg-[#6BC9BE] text-white font-medium rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#6BC9BE] focus:ring-offset-2 transition-all duration-300 shadow-md"
                    >
                      Ejercicios
                    </button>
                    <button
                      onClick={() =>
                        router.push(
                          `/physio-management/follow-up/${treatmentId}/sessions/${session.id}/tests/physio/`
                        )
                      }
                      className="flex-1 px-4 py-3 bg-[#05668D] text-white font-medium rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#05668D] focus:ring-offset-2 transition-all duration-300 shadow-md"
                    >
                      Cuestionario
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Edit Session Modal */}
        {editMode && sessionToEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
              <h2 className="text-2xl font-bold text-[#05668D] mb-6">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#41B8D5] transition-all duration-300"
                    placeholder="Nombre de la sesión"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Días de la semana
                  </label>
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
                    className="px-4 py-2 bg-white border border-red-400 text-red-500 rounded-xl hover:bg-red-50 transition-all duration-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-[#6BC9BE] to-[#05668D] text-white rounded-xl hover:opacity-90 transition-all duration-300"
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
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
              <h2 className="text-xl font-bold text-[#05668D] mb-4">
                Confirmar eliminación
              </h2>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que deseas eliminar esta sesión? Esta acción no
                se puede deshacer.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteSession}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300"
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
