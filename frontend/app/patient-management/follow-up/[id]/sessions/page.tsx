"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RestrictedAccess from "@/components/RestrictedAccess";
import { getApiBaseUrl } from "@/utils/api";

interface Session {
  id: number;
  name: string;
  day_of_week: string[];
  treatment: number;
  date: string;
  notes: string;
  created_at: string;
  updated_at: string;
  exercises_count?: number;
  completed_exercises_count?: number;
  tests_count?: number;
  completed_tests_count?: number;
}

const SessionsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        // Check user role
        fetch(`${getApiBaseUrl()}/api/app_user/check-role/`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setUserRole(data.user_role);
            if (data.user_role !== "patient") {
              setError("Solo los pacientes pueden acceder a esta página");
            } else {
              loadSessions(storedToken, params.id);
            }
          })
          .catch((err) => {
            console.error("Error al verificar el rol:", err);
            setError("Error al verificar el rol del usuario");
            setLoading(false);
          });
      } else {
        setError("Debe iniciar sesión para acceder a esta página");
        setLoading(false);
      }
    }
  }, [isClient, params.id]);

  const loadSessions = async (authToken: string, treatmentId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${getApiBaseUrl()}/api/treatments/${treatmentId}/sessions/`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al cargar las sesiones");
      }

      const data = await response.json();
      console.log("Sesiones cargadas:", data);
      
      // Fetch test information for each session
      const sessionsWithTestInfo = await Promise.all(
        data.map(async (session: Session) => {
          try {
            // Check if the session has a test
            const testResponse = await fetch(
              `${getApiBaseUrl()}/api/treatments/sessions/${session.id}/test/view/`,
              {
                headers: {
                  Authorization: `Bearer ${authToken}`,
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
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                  },
                }
              );
              
              if (testResponsesResponse.ok) {
                const testResponsesData = await testResponsesResponse.json();
                session.completed_tests_count = testResponsesData.length > 0 ? 1 : 0;
              } else {
                session.completed_tests_count = 0;
              }
            } else {
              // Session doesn't have a test
              session.tests_count = 0;
              session.completed_tests_count = 0;
            }
          } catch (error) {
            console.error(`Error fetching test info for session ${session.id}:`, error);
            // If there's an error, assume no test
            session.tests_count = 0;
            session.completed_tests_count = 0;
          }
          
          return session;
        })
      );
      
      setSessions(sessionsWithTestInfo);
    } catch (err) {
      console.error("Error:", err);
      setError(
        err instanceof Error ? err.message : "Error al cargar las sesiones"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSessionClick = (sessionId: number) => {
    router.push(`/patient-management/follow-up/${params.id}/sessions/${sessionId}`);
  };

  const handleGoBack = () => {
    router.push(`/patient-management/follow-up/${params.id}`);
  };

  const getSessionProgress = (session: Session) => {
    const exercisesCount = session.exercises_count || 0;
    const completedExercisesCount = session.completed_exercises_count || 0;
    const testsCount = session.tests_count || 0;
    const completedTestsCount = session.completed_tests_count || 0;

    const totalItems = exercisesCount + testsCount;
    const completedItems = completedExercisesCount + completedTestsCount;

    if (totalItems === 0) return 0;
    return Math.round((completedItems / totalItems) * 100);
  };

  if (!isClient) {
    return null;
  }

  if (userRole && userRole !== "patient") {
    return <RestrictedAccess message="Solo los pacientes pueden acceder a esta página" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={handleGoBack}
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

      <h1 className="text-3xl font-bold mb-8">Sesiones del tratamiento</h1>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {sessions.length === 0 && !loading && !error && (
        <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          No hay sesiones disponibles para este tratamiento.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => {
          const progress = getSessionProgress(session);
          return (
            <div
              key={session.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
              onClick={() => handleSessionClick(session.id)}
            >
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">{session.name}</h3>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-2">
                        <span>Días de la semana:</span>
                        <span className="text-gray-600">
                          {session.day_of_week.join(", ")}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span>Progreso:</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-grow bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold whitespace-nowrap">{progress}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Ejercicios</p>
                    <p className="font-bold text-lg">
                      {session.exercises_count || 0}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Test</p>
                    {session.tests_count && session.tests_count > 0 ? (
                      <p
                        className={`font-bold text-sm ${
                          session.completed_tests_count &&
                          session.completed_tests_count > 0
                            ? "text-green-600"
                            : "text-amber-600"
                        }`}
                      >
                        {session.completed_tests_count &&
                        session.completed_tests_count > 0
                          ? "Completado"
                          : "Pendiente"}
                      </p>
                    ) : (
                      <p className="text-gray-500 text-sm">No disponible</p>
                    )}
                  </div>
                </div>

                {session.notes && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-1">Notas:</h4>
                    <p className="text-gray-700 text-sm line-clamp-2">
                      {session.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 px-6 py-3 flex justify-center">
                <button className="text-blue-500 hover:underline flex items-center">
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
          );
        })}
      </div>
    </div>
  );
};

export default SessionsPage;