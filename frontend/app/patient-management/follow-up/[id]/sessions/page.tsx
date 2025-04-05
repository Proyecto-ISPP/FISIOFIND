"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/utils/api";

// First, let's update the Session interface to include all the new fields
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
  // Add the new fields
  total_series?: number;
  total_logs?: number;
  total_expected_logs?: number;
}

const SessionsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      
      // Fetch test and exercise information for each session
      const sessionsWithInfo = await Promise.all(
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
                  Authorization: `Bearer ${authToken}`,
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
                      Authorization: `Bearer ${authToken}`,
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
                            Authorization: `Bearer ${authToken}`,
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
      console.error("Error:", err);
      setError(
        err instanceof Error ? err.message : "Error al cargar las sesiones"
      );
    } finally {
      setLoading(false);
    }
  };

  // Update the getSessionProgress function to calculate progress based on logs and test responses
  const getSessionProgress = (session: Session) => {
    // Calculate progress for exercises based on logs completed vs expected
    let exerciseProgress = 0;
    if (session.total_expected_logs && session.total_expected_logs > 0) {
      exerciseProgress = ((session.total_logs ?? 0) / session.total_expected_logs) * 100;
    }
    
    // Calculate progress for tests based on responses completed vs expected
    let testProgress = 0;
    if (session.tests_count && session.tests_count > 0) {
      testProgress = ((session.completed_tests_count ?? 0) / session.day_of_week.length) * 100;
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
    
    const overallProgress = totalWeight > 0 ? weightedProgress / totalWeight : 0;
    return Math.round(overallProgress);
  };

  const handleSessionClick = (sessionId: number) => {
    router.push(`/patient-management/follow-up/${params.id}/sessions/${sessionId}`);
  };

  const handleGoBack = () => {
    router.push(`/patient-management/follow-up/${params.id}`);
  };

  // Update the display in the session card to show more detailed progress
  // Fix the render section - it seems to be outside of the return statement
  // Here's how the return statement should look:
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button
          onClick={handleGoBack}
          className="flex items-center text-blue-600 hover:text-blue-800"
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
      </div>
  
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
  
      {!loading && !error && sessions.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No hay sesiones disponibles para este tratamiento</p>
        </div>
      )}
  
      {!loading && !error && sessions.length > 0 && (
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
                  <h3 className="text-xl font-bold mb-2">{session.name}</h3>
                  
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
  
                  <div className="grid grid-cols-2 gap-4 mb-4 mt-4">
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-600">Ejercicios</p>
                      <p className="font-bold text-lg">
                        {session.exercises_count || 0}
                      </p>
                      <p className="text-xs text-gray-500">
                        {session.total_logs || 0}/{session.total_expected_logs || 0} registros
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-600">Test</p>
                      {session.tests_count && session.tests_count > 0 ? (
                        <p className={`font-bold text-sm ${
                          (session.completed_tests_count ?? 0) > 0
                            ? "text-green-600"
                            : "text-amber-600"
                        }`}>
                          {(session.completed_tests_count ?? 0) > 0
                            ? `${session.completed_tests_count}/${session.day_of_week.length}`
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
      )}
    </div>
);
};

export default SessionsPage;