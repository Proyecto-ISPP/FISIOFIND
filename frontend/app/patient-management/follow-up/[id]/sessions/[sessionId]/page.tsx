"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RestrictedAccess from "@/components/RestrictedAccess";
import { getApiBaseUrl } from "@/utils/api";

interface Exercise {
  id: number;
  title: string;
  description: string;
  body_region: string;
  exercise_type: string;
}

interface ExerciseSession {
  id: number;
  exercise: Exercise;
  session: number;
  series: Series[];
}

interface Series {
  id: number;
  series_number: number;
  repetitions: number;
  weight?: number;
  time?: string;
  distance?: number;
}

interface Test {
  id: number;
  session: number;
  question: string;
  test_type: "text" | "scale";
  scale_labels?: Record<string, string>;
}

interface TestResponse {
  id: number;
  test: number;
  patient: number;
  response_text?: string;
  response_scale?: number;
  submitted_at: string;
}

interface Session {
  id: number;
  name: string;
  treatment: number;
  day_of_week: string[];
  notes?: string;
  date?: string;
}

const SessionDetailPage = ({ params }: { params: { id: string; sessionId: string } }) => {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [exercises, setExercises] = useState<ExerciseSession[]>([]);
  const [test, setTest] = useState<Test | null>(null);
  const [testResponse, setTestResponse] = useState<TestResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  // For test response
  const [textResponse, setTextResponse] = useState("");
  const [scaleResponse, setScaleResponse] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [responseSuccess, setResponseSuccess] = useState(false);
  const [responseError, setResponseError] = useState<string | null>(null);

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
              loadSessionData(storedToken, params.sessionId);
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
  }, [isClient, params.sessionId]);


  const loadSessionData = async (authToken: string, sessionId: string) => {
    try {
      setLoading(true);
      
      // Load session details
      const sessionResponse = await fetch(
        `${getApiBaseUrl()}/api/treatments/sessions/${sessionId}/`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!sessionResponse.ok) {
        throw new Error("Error al cargar los detalles de la sesión");
      }

      const sessionData = await sessionResponse.json();
      setSession(sessionData);

      // Load exercises for this session
      const exercisesResponse = await fetch(
        `${getApiBaseUrl()}/api/treatments/sessions/${sessionId}/exercises/`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (exercisesResponse.ok) {
        const exerciseSessions = await exercisesResponse.json();
        console.log("Exercise sessions:", exerciseSessions);
        
        // Fetch detailed information for each exercise
        const exercisesWithDetails = await Promise.all(
          exerciseSessions.map(async (exerciseSession: any) => {
            try {
              // Get the exercise ID (either from exerciseSession.exercise.id or exerciseSession.exercise if it's just an ID)
              const exerciseId = typeof exerciseSession.exercise === 'object' ? 
                exerciseSession.exercise.id : exerciseSession.exercise;
              
              const exerciseDetailResponse = await fetch(
                `${getApiBaseUrl()}/api/treatments/exercises/${exerciseId}/`,
                {
                  headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                  },
                }
              );
              
              if (exerciseDetailResponse.ok) {
                const exerciseDetail = await exerciseDetailResponse.json();
                console.log(`Exercise ${exerciseId} details:`, exerciseDetail);
                
                // Get the series for this exercise session
                const seriesResponse = await fetch(
                  `${getApiBaseUrl()}/api/treatments/exercise-sessions/${exerciseSession.id}/series/`,
                  {
                    headers: {
                      Authorization: `Bearer ${authToken}`,
                      "Content-Type": "application/json",
                    },
                  }
                );
                
                let series = [];
                if (seriesResponse.ok) {
                  series = await seriesResponse.json();
                  console.log(`Series for exercise session ${exerciseSession.id}:`, series);
                }
                
                // Create a complete exercise session object with all details
                return {
                  id: exerciseSession.id,
                  session: exerciseSession.session,
                  exercise: exerciseDetail,
                  series: series
                };
              }
              return null;
            } catch (error) {
              console.error(`Error fetching details for exercise session ${exerciseSession.id}:`, error);
              return null;
            }
          })
        );
        
        // Filter out any null values from failed requests
        const validExercises = exercisesWithDetails.filter(ex => ex !== null);
        console.log("Exercises with details:", validExercises);
        setExercises(validExercises);
      }

      // Load test for this session
      try {
        const testResponse = await fetch(
          `${getApiBaseUrl()}/api/treatments/sessions/${sessionId}/test/view/`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (testResponse.ok) {
          const testData = await testResponse.json();
          setTest(testData);

          // Check if patient has already responded to this test
          const testResponsesResponse = await fetch(
            `${getApiBaseUrl()}/api/treatments/sessions/${sessionId}/test/responses/`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (testResponsesResponse.ok) {
            const testResponsesData = await testResponsesResponse.json();
            if (testResponsesData.length > 0) {
              setTestResponse(testResponsesData[0]);
              if (testData.test_type === "text") {
                setTextResponse(testResponsesData[0].response_text || "");
              } else if (testData.test_type === "scale") {
                setScaleResponse(testResponsesData[0].response_scale || null);
              }
            }
          }
        }
      } catch (testError) {
        console.error("Error al cargar el test:", testError);
        // No establecemos error general porque el test es opcional
      }
    } catch (err) {
      console.error("Error:", err);
      setError(
        err instanceof Error ? err.message : "Error al cargar los datos de la sesión"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTestResponse = async () => {
    if (!test) return;
    
    setSubmitting(true);
    setResponseError(null);
    setResponseSuccess(false);

    try {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        throw new Error("No se ha encontrado el token de autenticación");
      }

      const payload: { 
        test: number;
        response_text?: string;
        response_scale?: number;
      } = {
        test: test.id
      };

      if (test.test_type === "text") {
        if (!textResponse.trim()) {
          throw new Error("Por favor, ingrese una respuesta");
        }
        payload.response_text = textResponse;
      } else if (test.test_type === "scale") {
        if (scaleResponse === null) {
          throw new Error("Por favor, seleccione un valor en la escala");
        }
        payload.response_scale = scaleResponse;
      }

      const response = await fetch(
        `${getApiBaseUrl()}/api/treatments/sessions/${params.sessionId}/test/respond/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al enviar la respuesta");
      }

      const responseData = await response.json();
      setTestResponse(responseData);
      setResponseSuccess(true);
    } catch (err) {
      console.error("Error:", err);
      setResponseError(
        err instanceof Error ? err.message : "Error al enviar la respuesta"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoBack = () => {
    router.push(`/patient-management/follow-up/${params.id}/sessions`);
  };

  const formatDaysOfWeek = (days: string[]): string => {
    const dayMap: Record<string, string> = {
      "Monday": "Lunes",
      "Tuesday": "Martes",
      "Wednesday": "Miércoles",
      "Thursday": "Jueves",
      "Friday": "Viernes",
      "Saturday": "Sábado",
      "Sunday": "Domingo"
    };
    
    return days.map(day => dayMap[day] || day).join(", ");
  };

  const formatBodyRegion = (bodyRegion: string): string => {
    const bodyRegionMap: Record<string, string> = {
      "NECK": "Cuello",
      "SHOULDER": "Hombros",
      "ARM": "Brazos (Bíceps, Tríceps)",
      "ELBOW": "Codo",
      "WRIST_HAND": "Muñeca y Mano",
      "CHEST": "Pecho",
      "UPPER_BACK": "Espalda Alta",
      "LOWER_BACK": "Zona Lumbar",
      "CORE": "Zona Media / Core",
      "QUADRICEPS": "Cuádriceps",
      "HAMSTRINGS": "Isquiotibiales",
      "KNEE": "Rodilla",
      "CALVES": "Pantorrillas",
      "ANKLE_FOOT": "Tobillo y Pie",
      "UPPER_BODY": "Parte Superior del Cuerpo",
      "LOWER_BODY": "Parte Inferior del Cuerpo",
      "FULL_BODY": "Cuerpo Completo",
      "UNKNOWN": "No especificada"
    };
    
    return bodyRegionMap[bodyRegion] || bodyRegion;
  };
    
  const formatExerciseType = (exerciseType: string): string => {
    const exerciseTypeMap: Record<string, string> = {
      "STRENGTH": "Fortalecimiento Muscular",
      "MOBILITY": "Movilidad Articular",
      "STRETCHING": "Estiramientos",
      "BALANCE": "Ejercicios de Equilibrio",
      "PROPRIOCEPTION": "Propiocepción",
      "COORDINATION": "Coordinación",
      "BREATHING": "Ejercicios Respiratorios",
      "RELAXATION": "Relajación / Descarga",
      "CARDIO": "Resistencia Cardiovascular",
      "FUNCTIONAL": "Ejercicio Funcional",
      "UNKNOWN": "No especificado"
    };
    
    return exerciseTypeMap[exerciseType] || exerciseType;
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
        Volver a las sesiones
      </button>

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

      {session && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-[#05668d] p-4 text-white">
            <h1 className="text-2xl font-bold">{session.name}</h1>
            {session.day_of_week && (
              <p className="text-white/80 mt-1">
                Días: {formatDaysOfWeek(session.day_of_week)}
              </p>
            )}
          </div>

          <div className="p-6">
            {session.notes && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Notas del fisioterapeuta:</h2>
                <p className="bg-gray-50 p-4 rounded-lg text-gray-700">{session.notes}</p>
              </div>
            )}

            {/* Ejercicios */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Ejercicios ({exercises.length})</h2>
              
              {exercises.length === 0 ? (
                <p className="text-gray-500 italic">No hay ejercicios asignados para esta sesión.</p>
              ) : (
                <div className="space-y-4">
                  {exercises.map((exerciseSession) => (
                    <div key={exerciseSession.id} className="border rounded-xl overflow-hidden">
                      <div className="bg-blue-50 p-4">
                        <h3 className="font-bold text-lg">{exerciseSession.exercise.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatBodyRegion(exerciseSession.exercise.body_region)} - {formatExerciseType(exerciseSession.exercise.exercise_type)}
                        </p>
                      </div>
                      
                      <div className="p-4">
                        {exerciseSession.exercise.description && (
                          <p className="mb-4 text-gray-700">{exerciseSession.exercise.description}</p>
                        )}
                        
                        {exerciseSession.series && exerciseSession.series.length > 0 ? (
                          <div>
                            <h4 className="font-semibold mb-2">Series:</h4>
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Repeticiones</th>
                                    {exerciseSession.series.some(s => s.weight !== undefined) && (
                                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peso</th>
                                    )}
                                    {exerciseSession.series.some(s => s.time !== undefined) && (
                                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiempo</th>
                                    )}
                                    {exerciseSession.series.some(s => s.distance !== undefined) && (
                                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distancia</th>
                                    )}
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {exerciseSession.series.map((serie) => (
                                    <tr key={serie.id}>
                                      
                                      <td className="px-3 py-2 whitespace-nowrap text-sm">{serie.repetitions}</td>
                                      {exerciseSession.series.some(s => s.weight !== undefined && s.weight !== null) && (
                                        <td className="px-3 py-2 whitespace-nowrap text-sm">
                                          {serie.weight !== undefined && serie.weight !== null ? `${serie.weight} kg` : 'hola'}
                                        </td>
                                      )}
                                      {exerciseSession.series.some(s => s.time !== undefined && s.time !== null) && (
                                        <td className="px-3 py-2 whitespace-nowrap text-sm">
                                          {serie.time !== undefined && serie.time !== null ? serie.time : '-'}
                                        </td>
                                      )}
                                      {exerciseSession.series.some(s => s.distance !== undefined && s.distance !== null) && (
                                        <td className="px-3 py-2 whitespace-nowrap text-sm">
                                          {serie.distance !== undefined && serie.distance !== null ? `${serie.distance} m` : '-'}
                                        </td>
                                      )}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No hay series definidas para este ejercicio.</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Test */}
            {test && (
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-green-50 p-4">
                  <div className="flex items-center">
                    <h2 className="text-xl font-semibold">Test de evaluación</h2>
                    {testResponse && (
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded ml-2">
                        Completado
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2">{test.question}</h3>
                    
                    {testResponse ? (
                      <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-700 mb-2">Tu respuesta:</h4>
                        {test.test_type === "text" ? (
                          <p className="text-gray-800">{testResponse.response_text}</p>
                        ) : (
                          <div>
                            <p className="text-gray-800 font-bold">{testResponse.response_scale}</p>
                            {test.scale_labels && testResponse.response_scale !== undefined && (
                              <p className="text-gray-600 text-sm mt-1">
                                {test.scale_labels[testResponse.response_scale.toString()]}
                              </p>
                            )}
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mt-3">
                          Enviado el {new Date(testResponse.submitted_at).toLocaleString("es-ES")}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4">
                        {test.test_type === "text" ? (
                          <div className="mb-4">
                            <label htmlFor="textResponse" className="block text-sm font-medium text-gray-700 mb-1">
                              Tu respuesta:
                            </label>
                            <textarea
                              id="textResponse"
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              value={textResponse}
                              onChange={(e) => setTextResponse(e.target.value)}
                              disabled={submitting}
                            ></textarea>
                          </div>
                        ) : (
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Selecciona un valor:
                            </label>
                            {test.scale_labels && (
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(test.scale_labels).map(([value, label]) => (
                                  <button
                                    key={value}
                                    type="button"
                                    className={`px-4 py-2 rounded-md border ${
                                      scaleResponse === parseInt(value)
                                        ? "bg-blue-100 border-blue-500 text-blue-700"
                                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                    }`}
                                    onClick={() => setScaleResponse(parseInt(value))}
                                    disabled={submitting}
                                  >
                                    <div className="font-bold">{value}</div>
                                    <div className="text-xs">{label}</div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {responseError && (
                          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {responseError}
                          </div>
                        )}

                        {responseSuccess && (
                          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            Respuesta enviada correctamente
                          </div>
                        )}

                        <button
                          type="button"
                          className="w-full md:w-auto px-4 py-2 bg-[#05668d] text-white rounded-md hover:bg-[#045a7c] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={handleSubmitTestResponse}
                          disabled={submitting}
                        >
                          {submitting ? "Enviando..." : "Enviar respuesta"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionDetailPage;