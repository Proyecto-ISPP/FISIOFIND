"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { getApiBaseUrl } from "@/utils/api";
import { Pencil, Trash2 } from "lucide-react";
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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
        className="border border-gray-300 rounded-xl py-4 px-3 cursor-pointer text-lg"
      >
        {selected.length === 0
          ? placeholder
          : `${selected.length} seleccionado${selected.length > 1 ? "s" : ""}`}
      </div>
      {dropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg">
          {" "}
          {/* Added max-height and scroll */}
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => toggleOption(option.value)}
              className="flex items-center justify-between px-4 pb-4 pt-10 hover:bg-gray-100 cursor-pointer first:rounded-t-xl last:rounded-b-xl"
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
  const [sessionIdToDelete, setSessionIdToDelete] = useState<number | null>(
    null
  );

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
              `${getApiBaseUrl()}/api/treatments/sessions/${
                session.id
              }/test/view/`,
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
                `${getApiBaseUrl()}/api/treatments/sessions/${
                  session.id
                }/test/responses/`,
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
              `${getApiBaseUrl()}/api/treatments/sessions/${
                session.id
              }/exercises/`,
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
                  `${getApiBaseUrl()}/api/treatments/exercise-sessions/${
                    exerciseSession.id
                  }/series/`,
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
                        `${getApiBaseUrl()}/api/treatments/exercise-sessions/${
                          exerciseSession.id
                        }/logs/`,
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
                        const seriesLogs = logsData.filter(
                          (log: { series: number }) => log.series === series.id
                        );
                        totalLogs += seriesLogs.length;
                      }
                    } catch (error) {
                      console.error(
                        `Error fetching logs for series ${series.id}:`,
                        error
                      );
                    }
                  }
                }
              }

              // Calculate the total expected logs (series * days of the week)
              const totalExpectedLogs =
                totalSeries * session.day_of_week.length;

              // Store these values for progress calculation
              session.total_series = totalSeries;
              session.total_logs = totalLogs;
              session.total_expected_logs = totalExpectedLogs;

              // Calculate completed exercises percentage
              session.completed_exercises_count =
                totalExpectedLogs > 0
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
            console.error(
              `Error fetching info for session ${session.id}:`,
              error
            );
            // If there's an error, set default values
            session.tests_count = session.tests_count || 0;
            session.completed_tests_count = session.completed_tests_count || 0;
            session.exercises_count = session.exercises_count || 0;
            session.completed_exercises_count =
              session.completed_exercises_count || 0;
            session.total_series = session.total_series || 0;
            session.total_logs = session.total_logs || 0;
            session.total_expected_logs = session.total_expected_logs || 0;
          }

          return session;
        })
      );

      setSessions(sessionsWithInfo);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar las sesiones"
      );
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
      setError(
        err instanceof Error ? err.message : "Error al actualizar la sesión"
      );
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
      setError(
        err instanceof Error ? err.message : "Error al eliminar la sesión"
      );
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#41B8D5]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6 justify-between">
        <button
          onClick={() =>
            router.push(`/physio-management/follow-up/${treatmentId}`)
          }
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Volver al tratamiento
        </button>
        <h1 className="text-3xl font-bold text-[#05668D]">
          Sesiones del Tratamiento
        </h1>
        <div className="w-24"></div>
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
            <input
              type="text"
              value={newSession.name}
              onChange={(e) =>
                setNewSession({ ...newSession, name: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#41B8D5] transition-all duration-300"
              placeholder="Nombre de la sesión"
              maxLength={50}
            />
          </div>
          <div className="space-y-2">
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
          Crear Sesión
        </button>
      </form>

      {sessions.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">
            No hay sesiones disponibles para este tratamiento
          </p>
        </div>
      )}

      {sessions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => {
            const progress = getSessionProgress(session);
            return (
              <div
                key={session.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer group relative"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold mb-2 text-[#05668D]">
                      {session.name || `Sesión ${session.id}`}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(session);
                        }}
                        className="p-2 rounded-full hover:bg-[#e6f7f6] text-[#41B8D5]"
                        title="Editar sesión"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(session.id);
                        }}
                        className="p-2 rounded-full hover:bg-[#ffeaea] text-[#e57373]"
                        title="Eliminar sesión"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 mb-2">
                    <div className="flex gap-2">
                      <span className="font-medium">Días de la semana:</span>
                      <span className="text-gray-600">
                        {session.day_of_week.join(", ")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-grow bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-[#41B8D5] h-2.5 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold whitespace-nowrap">
                      {progress}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4 mt-4">
                    <div className="bg-[#e6f7f6] p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-600">Ejercicios</p>
                      <p className="font-bold text-lg">
                        {session.exercises_count || 0}
                      </p>
                      <p className="text-xs text-gray-500">
                        {session.total_logs || 0}/
                        {session.total_expected_logs || 0} registros
                      </p>
                      <div className="bg-gray-50 px-6 py-3 flex justify-center mt-6">
                        <button
                          onClick={() =>
                            router.push(
                              `/physio-management/follow-up/${treatmentId}/sessions/${session.id}/exercises/`
                            )
                          }
                          className="text-[#41B8D5] hover:underline flex items-center font-medium"
                        >
                          Ver detalles
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="bg-[#f0f9e8] p-3 rounded-lg text-center flex flex-col justify-between">
                      <p className="text-sm text-gray-600">Test</p>
                      {session.tests_count && session.tests_count > 0 ? (
                        <p
                          className={`font-bold text-sm ${
                            (session.completed_tests_count ?? 0) > 0
                              ? "text-green-600"
                              : "text-amber-600"
                          }`}
                        >
                          {(session.completed_tests_count ?? 0) > 0
                            ? `${session.completed_tests_count}/${session.day_of_week.length}`
                            : "Pendiente"}
                        </p>
                      ) : (
                        <p className="text-gray-500 text-sm">No disponible</p>
                      )}
                      <div className="bg-gray-50 px-6 py-3 flex justify-center mt-6">
                        <button
                          onClick={() =>
                            router.push(
                              `/physio-management/follow-up/${treatmentId}/sessions/${session.id}/tests/physio/`
                            )
                          }
                          className="text-[#8ba573] hover:underline flex items-center font-medium"
                        >
                          Ver detalles
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Session Modal */}
      {editMode && sessionToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleUpdateSession}
            className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 text-[#05668D]">
              Editar Sesión
            </h2>
            <input
              type="text"
              value={sessionToEdit.name}
              onChange={(e) =>
                setSessionToEdit({ ...sessionToEdit, name: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-[#41B8D5]"
              placeholder="Nombre de la sesión"
              maxLength={50}
            />
            <DaysDropdown
              options={daysOfWeek}
              selected={sessionToEdit.day_of_week}
              setSelected={(value) =>
                setSessionToEdit({ ...sessionToEdit, day_of_week: value })
              }
              placeholder="Selecciona los días de la semana"
            />
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6BC9BE] to-[#05668D] text-white font-semibold hover:opacity-90"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-md text-center">
            <h2 className="text-xl font-bold mb-4 text-[#e57373]">
              ¿Eliminar sesión?
            </h2>
            <p className="mb-6">
              ¿Estás seguro de que deseas eliminar esta sesión? Esta acción no
              se puede deshacer.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteSession}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#e57373] to-[#ffb3b3] text-white font-semibold hover:opacity-90"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main page component
const SessionsPage = () => {
  const params = useParams();
  // Add type check to ensure params.id is not undefined
  if (!params.id) {
    return null;
  }
  return <SessionsContent treatmentId={params.id.toString()} />;
};

export default SessionsPage;
