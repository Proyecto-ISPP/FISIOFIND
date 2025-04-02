"use client";

import { useState, useEffect, useCallback } from "react";
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

interface ExerciseLog {
  id: number;
  series: number;
  date: string;
  repetitions_done: number;
  weight_done?: number;
  time_done?: string;
  distance_done?: number;
  notes?: string;
  patient: number;
}

const SessionDetailPage = ({
  params,
}: {
  params: { id: string; sessionId: string };
}) => {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [exercises, setExercises] = useState<ExerciseSession[]>([]);
  const [test, setTest] = useState<Test | null>(null);
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
  const [testResponses, setTestResponses] = useState<TestResponse[]>([]);
  const [showTestWarning, setShowTestWarning] = useState(false);
  const [canSubmitTest, setCanSubmitTest] = useState<{
    canSubmit: boolean;
    reason: string | null;
  }>({
    canSubmit: false,
    reason: null,
  });

  //For logs
  const [exerciseLogs, setExerciseLogs] = useState<
    Record<number, ExerciseLog[]>
  >({});
  const [logFormData, setLogFormData] = useState<{
    seriesId: number | null;
    repetitions: number;
    weight?: number;
    time?: string;
    distance?: number;
    notes: string;
  }>({
    seriesId: null,
    repetitions: 0,
    weight: undefined,
    time: undefined,
    distance: undefined,
    notes: "",
  });
  const [submittingLog, setSubmittingLog] = useState(false);
  const [logError, setLogError] = useState<string | null>(null);
  const [logSuccess, setLogSuccess] = useState(false);
  const [showLogForm, setShowLogForm] = useState<number | null>(null);

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

  // Load session details and exercises for this session
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
          exerciseSessions.map(async (exerciseSession: ExerciseSession) => {
            try {
              // Get the exercise ID (either from exerciseSession.exercise.id or exerciseSession.exercise if it's just an ID)
              const exerciseId =
                typeof exerciseSession.exercise === "object"
                  ? exerciseSession.exercise.id
                  : exerciseSession.exercise;

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
                  `${getApiBaseUrl()}/api/treatments/exercise-sessions/${
                    exerciseSession.id
                  }/series/`,
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
                  console.log(
                    `Series for exercise session ${exerciseSession.id}:`,
                    series
                  );
                }

                // Create a complete exercise session object with all details
                return {
                  id: exerciseSession.id,
                  session: exerciseSession.session,
                  exercise: exerciseDetail,
                  series: series,
                };
              }
              return null;
            } catch (error) {
              console.error(
                `Error fetching details for exercise session ${exerciseSession.id}:`,
                error
              );
              return null;
            }
          })
        );

        // Filter out any null values from failed requests
        const validExercises = exercisesWithDetails.filter((ex) => ex !== null);
        console.log("Exercises with details:", validExercises);
        setExercises(validExercises);

        const logsMap: Record<number, ExerciseLog[]> = {};

        for (const exerciseSession of validExercises) {
          if (exerciseSession.series && exerciseSession.series.length > 0) {
            try {
              // Fetch logs for this exercise session
              const logsResponse = await fetch(
                `${getApiBaseUrl()}/api/treatments/exercise-sessions/${
                  exerciseSession.id
                }/logs/`,
                {
                  headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              if (logsResponse.ok) {
                const logsData = await logsResponse.json();

                // Organize logs by series ID
                for (const log of logsData) {
                  if (!logsMap[log.series]) {
                    logsMap[log.series] = [];
                  }
                  logsMap[log.series].push(log);
                }
              }
            } catch (error) {
              console.error(
                `Error fetching logs for exercise session ${exerciseSession.id}:`,
                error
              );
            }
          }
        }

        setExerciseLogs(logsMap);
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
            setTestResponses(testResponsesData);

            // If there are responses, set the most recent one as the current response
            if (testResponsesData.length > 0) {
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
        err instanceof Error
          ? err.message
          : "Error al cargar los datos de la sesión"
      );
    } finally {
      setLoading(false);
    }
  };

  // Log Form Change
  const handleLogFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setLogFormData((prev) => ({
      ...prev,
      [name]:
        name === "repetitions" || name === "weight" || name === "distance"
          ? value === ""
            ? undefined
            : Number(value)
          : value,
    }));
  };

  // Log Form Submittion
  const handleSubmitLog = async () => {
    if (!logFormData.seriesId) return;

    // Double-check constraints before submitting
    const { canCreate, reason } = canCreateLog(logFormData.seriesId);
    if (!canCreate) {
      setLogError(reason || "No se puede crear más registros para esta serie");
      return;
    }

    setSubmittingLog(true);
    setLogError(null);
    setLogSuccess(false);

    try {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        throw new Error("No se ha encontrado el token de autenticación");
      }

      const payload = {
        series: logFormData.seriesId,
        repetitions_done: logFormData.repetitions,
        ...(logFormData.weight !== undefined && {
          weight_done: logFormData.weight,
        }),
        ...(logFormData.time !== undefined && { time_done: logFormData.time }),
        ...(logFormData.distance !== undefined && {
          distance_done: logFormData.distance,
        }),
        ...(logFormData.notes && { notes: logFormData.notes }),
      };

      const response = await fetch(
        `${getApiBaseUrl()}/api/treatments/exercise-logs/create/`,
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
        throw new Error(errorData.detail || "Error al registrar el progreso");
      }

      const responseData = await response.json();

      // Update the logs state
      setExerciseLogs((prev) => ({
        ...prev,
        [logFormData.seriesId!]: [
          ...(prev[logFormData.seriesId!] || []),
          responseData,
        ],
      }));

      setLogSuccess(true);

      // Reset form
      setLogFormData({
        seriesId: null,
        repetitions: 0,
        weight: undefined,
        time: undefined,
        distance: undefined,
        notes: "",
      });

      // Close form after successful submission
      setTimeout(() => {
        setShowLogForm(null);
      }, 2000);
    } catch (err) {
      console.error("Error:", err);
      setLogError(
        err instanceof Error ? err.message : "Error al registrar el progreso"
      );
    } finally {
      setSubmittingLog(false);
    }
  };

  // Log Form Control
  const canCreateLog = (
    seriesId: number
  ): { canCreate: boolean; reason: string | null } => {
    if (!session || !session.day_of_week) {
      return {
        canCreate: false,
        reason: "No se puede determinar los días de la sesión",
      };
    }

    const logs = exerciseLogs[seriesId] || [];

    // Check if the number of logs exceeds the number of days in the session
    if (logs.length >= session.day_of_week.length) {
      return {
        canCreate: false,
        reason: `Ya has completado el máximo de ${session.day_of_week.length} registros para esta serie`,
      };
    }

    // Check if there's already a log for today
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const loggedToday = logs.some((log) => log.date.split("T")[0] === today);

    if (loggedToday) {
      return {
        canCreate: false,
        reason: "Ya has hecho el registro de hoy",
      };
    }

    return { canCreate: true, reason: null };
  };

  // Handler for test response submittion
  const handleSubmitTestResponse = async () => {
    if (!test) return;

    // Check if the patient can submit a test response
    const { canSubmit, reason } = canSubmitTestResponse();

    if (!canSubmit) {
      setResponseError(reason);
      return;
    }

    if (reason) {
      // Show warning but allow submission
      setShowTestWarning(true);
      return;
    }

    // Continue with submission
    submitTestResponse();
  };

  // Function to check if the patient can submit a test response
  const canSubmitTestResponse = useCallback((): {
    canSubmit: boolean;
    reason: string | null;
  } => {
    if (!session || !session.day_of_week) {
      return {
        canSubmit: false,
        reason: "No se puede determinar los días de la sesión",
      };
    }

    // Check if the number of responses exceeds the number of days in the session
    if (testResponses.length >= session.day_of_week.length) {
      return {
        canSubmit: false,
        reason: `Ya has completado el máximo de ${session.day_of_week.length} respuestas para este test`,
      };
    }

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const respondedToday = testResponses.some(
      (response) => response.submitted_at.split("T")[0] === today
    );

    if (respondedToday) {
      return {
        canSubmit: false,
        reason: "Ya has respondido al test hoy",
      };
    }

    // Check if all exercises have logs for today
    let allExercisesLogged = true;
    const missingSeries = [];

    for (const exerciseSession of exercises) {
      if (exerciseSession.series && exerciseSession.series.length > 0) {
        for (const series of exerciseSession.series) {
          const logs = exerciseLogs[series.id] || [];
          const loggedToday = logs.some(
            (log) => log.date.split("T")[0] === today
          );

          if (!loggedToday) {
            allExercisesLogged = false;
            missingSeries.push(
              `${exerciseSession.exercise.title} (Serie ${series.series_number})`
            );
          }
        }
      }
    }

    if (!allExercisesLogged) {
      return {
        canSubmit: true, // Still allow submission but with warning
        reason: `No has registrado el progreso de todos los ejercicios hoy. Faltan: ${missingSeries.join(
          ", "
        )}`,
      };
    }

    return { canSubmit: true, reason: null };
  }, [session, testResponses, exercises, exerciseLogs]);

  // Function to submit the test response
  const submitTestResponse = async () => {
    setSubmitting(true);
    setResponseError(null);
    setResponseSuccess(false);
    setShowTestWarning(false);

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
        test: test!.id,
      };

      if (test!.test_type === "text") {
        if (!textResponse.trim()) {
          throw new Error("Por favor, ingrese una respuesta");
        }
        payload.response_text = textResponse;
      } else if (test!.test_type === "scale") {
        if (scaleResponse === null) {
          throw new Error("Por favor, seleccione un valor en la escala");
        }
        payload.response_scale = scaleResponse;
      }

      const response = await fetch(
        `${getApiBaseUrl()}/api/treatments/sessions/${
          params.sessionId
        }/test/respond/`,
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

      // Update the responses state
      setTestResponses((prev) => [responseData, ...prev]);
      setResponseSuccess(true);

      // Reset form after successful submission
      if (test!.test_type === "text") {
        setTextResponse("");
      } else if (test!.test_type === "scale") {
        setScaleResponse(null);
      }
    } catch (err) {
      console.error("Error:", err);
      setResponseError(
        err instanceof Error ? err.message : "Error al enviar la respuesta"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Check if the patient can submit a test response
  useEffect(() => {
    if (test && exercises.length > 0) {
      const result = canSubmitTestResponse();
      setCanSubmitTest(result);
    }
  }, [test, exercises, exerciseLogs, testResponses, canSubmitTestResponse]);

  const handleGoBack = () => {
    router.push(`/patient-management/follow-up/${params.id}/sessions`);
  };

  const formatDaysOfWeek = (days: string[]): string => {
    const dayMap: Record<string, string> = {
      Monday: "Lunes",
      Tuesday: "Martes",
      Wednesday: "Miércoles",
      Thursday: "Jueves",
      Friday: "Viernes",
      Saturday: "Sábado",
      Sunday: "Domingo",
    };

    return days.map((day) => dayMap[day] || day).join(", ");
  };

  const formatBodyRegion = (bodyRegion: string): string => {
    const bodyRegionMap: Record<string, string> = {
      NECK: "Cuello",
      SHOULDER: "Hombros",
      ARM: "Brazos (Bíceps, Tríceps)",
      ELBOW: "Codo",
      WRIST_HAND: "Muñeca y Mano",
      CHEST: "Pecho",
      UPPER_BACK: "Espalda Alta",
      LOWER_BACK: "Zona Lumbar",
      CORE: "Zona Media / Core",
      QUADRICEPS: "Cuádriceps",
      HAMSTRINGS: "Isquiotibiales",
      KNEE: "Rodilla",
      CALVES: "Pantorrillas",
      ANKLE_FOOT: "Tobillo y Pie",
      UPPER_BODY: "Parte Superior del Cuerpo",
      LOWER_BODY: "Parte Inferior del Cuerpo",
      FULL_BODY: "Cuerpo Completo",
      UNKNOWN: "No especificada",
    };

    return bodyRegionMap[bodyRegion] || bodyRegion;
  };

  const formatExerciseType = (exerciseType: string): string => {
    const exerciseTypeMap: Record<string, string> = {
      STRENGTH: "Fortalecimiento Muscular",
      MOBILITY: "Movilidad Articular",
      STRETCHING: "Estiramientos",
      BALANCE: "Ejercicios de Equilibrio",
      PROPRIOCEPTION: "Propiocepción",
      COORDINATION: "Coordinación",
      BREATHING: "Ejercicios Respiratorios",
      RELAXATION: "Relajación / Descarga",
      CARDIO: "Resistencia Cardiovascular",
      FUNCTIONAL: "Ejercicio Funcional",
      UNKNOWN: "No especificado",
    };

    return exerciseTypeMap[exerciseType] || exerciseType;
  };

  if (!isClient) {
    return null;
  }

  if (userRole && userRole !== "patient") {
    return (
      <RestrictedAccess message="Solo los pacientes pueden acceder a esta página" />
    );
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
                <h2 className="text-lg font-semibold mb-2">
                  Notas del fisioterapeuta:
                </h2>
                <p className="bg-gray-50 p-4 rounded-lg text-gray-700">
                  {session.notes}
                </p>
              </div>
            )}

            {/* Ejercicios */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Ejercicios ({exercises.length})
              </h2>

              {exercises.length === 0 ? (
                <p className="text-gray-500 italic">
                  No hay ejercicios asignados para esta sesión.
                </p>
              ) : (
                <div className="space-y-4">
                  {exercises.map((exerciseSession) => (
                    <div
                      key={exerciseSession.id}
                      className="border rounded-xl overflow-hidden"
                    >
                      <div className="bg-blue-50 p-4">
                        <h3 className="font-bold text-lg">
                          {exerciseSession.exercise.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatBodyRegion(
                            exerciseSession.exercise.body_region
                          )}{" "}
                          -{" "}
                          {formatExerciseType(
                            exerciseSession.exercise.exercise_type
                          )}
                        </p>
                      </div>

                      <div className="p-4">
                        {exerciseSession.exercise.description && (
                          <p className="mb-4 text-gray-700">
                            {exerciseSession.exercise.description}
                          </p>
                        )}

                        {exerciseSession.series &&
                        exerciseSession.series.length > 0 ? (
                          <div>
                            <h4 className="font-semibold mb-2">Series:</h4>
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Repeticiones
                                    </th>
                                    {exerciseSession.series.some(
                                      (s) => s.weight !== undefined
                                    ) && (
                                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Peso
                                      </th>
                                    )}
                                    {exerciseSession.series.some(
                                      (s) => s.time !== undefined
                                    ) && (
                                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tiempo
                                      </th>
                                    )}
                                    {exerciseSession.series.some(
                                      (s) => s.distance !== undefined
                                    ) && (
                                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Distancia
                                      </th>
                                    )}
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Progreso
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {exerciseSession.series.map((serie) => (
                                    <tr key={serie.id}>
                                      <td className="px-3 py-2 whitespace-nowrap text-sm">
                                        {serie.repetitions}
                                      </td>
                                      {exerciseSession.series.some(
                                        (s) =>
                                          s.weight !== undefined &&
                                          s.weight !== null
                                      ) && (
                                        <td className="px-3 py-2 whitespace-nowrap text-sm">
                                          {serie.weight !== undefined &&
                                          serie.weight !== null
                                            ? `${serie.weight} kg`
                                            : "-"}
                                        </td>
                                      )}
                                      <td className="px-3 py-2 whitespace-nowrap text-sm">
                                        {serie.time !== undefined &&
                                        serie.time !== null
                                          ? serie.time
                                          : "-"}
                                      </td>
                                      <td className="px-3 py-2 whitespace-nowrap text-sm">
                                        {serie.distance !== undefined &&
                                        serie.distance !== null
                                          ? serie.distance + " m"
                                          : "-"}
                                      </td>
                                      <td className="px-3 py-2 whitespace-nowrap text-sm">
                                        {(() => {
                                          const { canCreate, reason } =
                                            canCreateLog(serie.id);
                                          const logs =
                                            exerciseLogs[serie.id] || [];
                                          const maxLogs =
                                            session?.day_of_week?.length || 0;

                                          // Check if all logs are completed
                                          if (logs.length >= maxLogs) {
                                            return (
                                              <div className="text-green-600 font-medium">
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  className="h-5 w-5 inline mr-1"
                                                  viewBox="0 0 20 20"
                                                  fill="currentColor"
                                                >
                                                  <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                  />
                                                </svg>
                                                Completado
                                              </div>
                                            );
                                          }

                                          return (
                                            <div>
                                              <button
                                                onClick={() => {
                                                  setShowLogForm(serie.id);
                                                  setLogFormData({
                                                    seriesId: serie.id,
                                                    repetitions:
                                                      serie.repetitions,
                                                    weight: serie.weight,
                                                    time: serie.time,
                                                    distance: serie.distance,
                                                    notes: "",
                                                  });
                                                }}
                                                className={`text-blue-600 hover:text-blue-800 ${
                                                  !canCreate
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                                }`}
                                                disabled={!canCreate}
                                                title={reason || ""}
                                              >
                                                Registrar progreso
                                              </button>
                                              {logs.length > 0 && (
                                                <div className="mt-1 text-xs text-gray-500">
                                                  {logs.length} de {maxLogs}{" "}
                                                  registros
                                                </div>
                                              )}
                                              {!canCreate && reason && (
                                                <div className="mt-1 text-xs text-red-500">
                                                  {reason}
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })()}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">
                            No hay series definidas para este ejercicio.
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Test Section */}
            {test && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-8">
                <div className="bg-[#05668d] p-4 text-white">
                  <h2 className="text-xl font-bold">
                    Cuestionario de seguimiento
                  </h2>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {test.question}
                  </h3>

                  {/* Test response history */}
                  {testResponses.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold mb-2">
                        Historial de respuestas ({testResponses.length}/
                        {session?.day_of_week.length}):
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        {testResponses.map((resp) => (
                          <div
                            key={resp.id}
                            className="mb-2 pb-2 border-b border-gray-200 last:border-0"
                          >
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">
                                {new Date(resp.submitted_at).toLocaleDateString(
                                  "es-ES"
                                )}
                              </span>
                              <span>
                                {test.test_type === "text"
                                  ? resp.response_text
                                  : test.scale_labels
                                  ? test.scale_labels[
                                      resp.response_scale?.toString() || ""
                                    ]
                                  : resp.response_scale}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Warning modal */}
                  {showTestWarning && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4 text-amber-600">
                          Advertencia
                        </h3>
                        <p className="mb-6">{canSubmitTest.reason}</p>
                        <p className="mb-6">
                          Se recomienda registrar el progreso de todos los
                          ejercicios antes de responder al test.
                        </p>
                        <div className="flex justify-end space-x-4">
                          <button
                            onClick={() => setShowTestWarning(false)}
                            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={submitTestResponse}
                            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                          >
                            Continuar de todos modos
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Test response form */}
                  {canSubmitTest.canSubmit ? (
                    <div>
                      {test.test_type === "text" ? (
                        <div className="mb-4">
                          <textarea
                            value={textResponse}
                            onChange={(e) => setTextResponse(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                            placeholder="Escribe tu respuesta aquí..."
                            disabled={submitting || responseSuccess}
                          ></textarea>
                        </div>
                      ) : (
                        <div className="mb-4">
                          <div className="flex flex-col space-y-2">
                            {test.scale_labels &&
                              Object.entries(test.scale_labels).map(
                                ([value, label]) => (
                                  <label
                                    key={value}
                                    className="flex items-center space-x-2"
                                  >
                                    <input
                                      type="radio"
                                      name="scale"
                                      value={value}
                                      checked={
                                        scaleResponse === parseInt(value)
                                      }
                                      onChange={() =>
                                        setScaleResponse(parseInt(value))
                                      }
                                      disabled={submitting || responseSuccess}
                                      className="h-4 w-4 text-blue-600"
                                    />
                                    <span>{label}</span>
                                  </label>
                                )
                              )}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={handleSubmitTestResponse}
                        disabled={submitting || responseSuccess}
                        className={`px-4 py-2 rounded-xl ${
                          submitting || responseSuccess
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#6bc9be] hover:bg-[#5eb5ab] text-white"
                        }`}
                      >
                        {submitting ? "Enviando..." : "Enviar respuesta"}
                      </button>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                      {canSubmitTest.reason}
                    </div>
                  )}

                  {responseError && (
                    <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                      {responseError}
                    </div>
                  )}

                  {responseSuccess && (
                    <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                      Respuesta enviada correctamente
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Log Form */}
            {showLogForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-md">
                  <h3 className="text-lg font-bold mb-4">Registrar progreso</h3>

                  {logError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
                      {logError}
                    </div>
                  )}

                  {logSuccess && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-4">
                      Progreso registrado correctamente
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Repeticiones realizadas
                      </label>
                      <input
                        type="number"
                        name="repetitions"
                        value={logFormData.repetitions}
                        onChange={handleLogFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Peso utilizado (kg)
                      </label>
                      <input
                        type="number"
                        name="weight"
                        value={logFormData.weight || ""}
                        onChange={handleLogFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                        min="0"
                        step="0.5"
                      />
                    </div>

                    {logFormData.time !== undefined && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tiempo (formato: HH:MM:SS)
                        </label>
                        <input
                          type="text"
                          name="time"
                          value={logFormData.time}
                          onChange={handleLogFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                          placeholder="00:00:00"
                        />
                      </div>
                    )}

                    {logFormData.distance !== undefined && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Distancia (m)
                        </label>
                        <input
                          type="number"
                          name="distance"
                          value={logFormData.distance}
                          onChange={handleLogFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                          min="0"
                          step="0.1"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notas (opcional)
                      </label>
                      <textarea
                        name="notes"
                        value={logFormData.notes}
                        onChange={handleLogFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setShowLogForm(null)}
                      className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
                      disabled={submittingLog}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSubmitLog}
                      className="px-4 py-2 bg-[#05668d] text-white rounded-xl hover:bg-[#045a7c] disabled:opacity-50"
                      disabled={submittingLog}
                    >
                      {submittingLog ? "Guardando..." : "Guardar progreso"}
                    </button>
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
