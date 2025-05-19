"use client";

import { useState, useEffect, useCallback } from "react";
import { getApiBaseUrl } from "@/utils/api";
import { useRouter } from "next/navigation";
import React, { use } from "react";

type AreaChoice =
  | "NECK"
  | "SHOULDER"
  | "ARM"
  | "ELBOW"
  | "WRIST_HAND"
  | "CHEST"
  | "UPPER_BACK"
  | "LOWER_BACK"
  | "CORE"
  | "QUADRICEPS"
  | "HAMSTRINGS"
  | "KNEE"
  | "CALVES"
  | "ANKLE_FOOT"
  | "UPPER_BODY"
  | "LOWER_BODY"
  | "FULL_BODY";

// Add a new type for exercise types
type ExerciseType =
  | "STRENGTH"
  | "MOBILITY"
  | "STRETCHING"
  | "BALANCE"
  | "PROPRIOCEPTION"
  | "COORDINATION"
  | "BREATHING"
  | "RELAXATION"
  | "CARDIO"
  | "FUNCTIONAL";

interface Exercise {
  id: number;
  title: string;
  description: string;
  body_region: AreaChoice; // Changed from 'area' to 'body_region'
  exercise_type: ExerciseType; // New field
  physiotherapist: number;
}

interface Series {
  series_number: number;
  repetitions: number;
  weight?: number;
  time?: number;
  distance?: number;
}

// Update the ExerciseSessionData interface to include series
interface SeriesData {
  id: number;
  series_number: number;
  repetitions: number;
  weight?: number;
  time?: number;
  distance?: number;
  exercise_session: number;
  logs?: ExerciseLog[]; // Add logs to the series
}

interface ExerciseLog {
  id: number;
  series: number;
  patient: number;
  date: string;
  repetitions_done: number;
  weight_done?: number;
  time_done?: string;
  distance_done?: number;
  notes?: string;
}

interface ExerciseSessionData {
  exercise: Exercise;
  exerciseSessionId: number;
  series: SeriesData[];
}

const ExercisesPage = ({
  params,
}: {
  params: { id: string; sessionId: string };
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const unwrappedParams = use(params as any);
  const { id, sessionId } = unwrappedParams as {
    id: string;
    sessionId: string;
  };

  const router = useRouter();
  const [exercises, setExercises] = useState<ExerciseSessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showExistingExercises, setShowExistingExercises] = useState(false);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [newExercise, setNewExercise] = useState({
    title: "",
    description: "",
    body_region: "UPPER_BODY" as AreaChoice, // Changed from 'area' to 'body_region'
    exercise_type: "STRENGTH" as ExerciseType, // New field
  });

  const [series, setSeries] = useState<Series[]>([]);
  const [showSeriesForm, setShowSeriesForm] = useState(false);
  const [currentExerciseSessionId, setCurrentExerciseSessionId] = useState<
    number | null
  >(null);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [seriesIdToDelete, setSeriesIdToDelete] = useState<number | null>(null);

  const [showEditSeriesForm, setShowEditSeriesForm] = useState(false);
  const [currentSeries, setCurrentSeries] = useState<SeriesData | null>(null);

  const [showUnassignConfirmation, setShowUnassignConfirmation] =
    useState(false);
  const [exerciseSessionIdToUnassign, setExerciseSessionIdToUnassign] =
    useState<number | null>(null);

  const [expandedSeriesId, setExpandedSeriesId] = useState<number | null>(null);

  const formatAreaName = (areaCode: string): string => {
    const areaMap: Record<string, string> = {
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
    };

    return areaMap[areaCode] || areaCode;
  };

  const formatExerciseTypeName = (typeCode: string): string => {
    const typeMap: Record<string, string> = {
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
    };

    return typeMap[typeCode] || typeCode;
  };

  const loadAvailableExercises = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se ha encontrado el token de autenticación");
        return;
      }

      const response = await fetch(
        `${getApiBaseUrl()}/api/treatments/exercises/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.log("Error response:", response);
      }

      const allExercises = await response.json();
      // Filtrar ejercicios que ya están en la sesión
      const exerciseIds = exercises.map((ex) => ex.exercise.id);
      const filtered = allExercises.filter(
        (exercise: Exercise) => !exerciseIds.includes(exercise.id)
      );
      setAvailableExercises(filtered);
    } catch (err) {
      setError("Error al cargar los ejercicios disponibles");
      console.log(err);
    }
  };

  const handleAssignExercise = async (exerciseId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se ha encontrado el token de autenticación");
        return;
      }

      const response = await fetch(
        `${getApiBaseUrl()}/api/treatments/sessions/${sessionId}/assign-exercise/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ exercise: exerciseId }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCurrentExerciseSessionId(data.id);
      setShowSeriesForm(true);
      setShowExistingExercises(false);

      // Load updated exercises after assigning a new one
      await loadSessionExercises();
    } catch (err) {
      setError("Error al asignar el ejercicio");
      console.log(err);
    }
  };

  const loadSeriesForExerciseSession = async (exerciseSessionId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se ha encontrado el token de autenticación");
        return [];
      }

      const response = await fetch(
        `${getApiBaseUrl()}/api/treatments/exercise-sessions/${exerciseSessionId}/series/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const seriesData = await response.json();

      // For each series, fetch its logs
      const seriesWithLogs = await Promise.all(
        seriesData.map(async (series: SeriesData) => {
          try {
            const logsResponse = await fetch(
              `${getApiBaseUrl()}/api/treatments/exercise-sessions/${exerciseSessionId}/logs/`,
              {
                method: "GET",
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
                (log: ExerciseLog) => log.series === series.id
              );
              return { ...series, logs: seriesLogs };
            }
            return series;
          } catch (error) {
            console.error(
              `Error fetching logs for series ${series.id}:`,
              error
            );
            return series;
          }
        })
      );

      return seriesWithLogs;
    } catch (err) {
      console.error("Error loading series:", err);
      return [];
    }
  };

  const loadSessionExercises = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se ha encontrado el token de autenticación");
        return;
      }

      const response = await fetch(
        `${getApiBaseUrl()}/api/treatments/sessions/${sessionId}/exercises`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const exercisesList: ExerciseSessionData[] = [];
      for (const exerciseSession of data) {
        const response = await fetch(
          `${getApiBaseUrl()}/api/treatments/exercises/${
            exerciseSession.exercise
          }`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const exerciseData = await response.json();

        // Load series for this exercise session
        const seriesData = await loadSeriesForExerciseSession(
          exerciseSession.id
        );

        exercisesList.push({
          exercise: exerciseData,
          exerciseSessionId: exerciseSession.id,
          series: seriesData,
        });
      }

      setExercises(exercisesList);
    } catch (err) {
      setError("Error al cargar los ejercicios de la sesión");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    loadSessionExercises();
  }, [loadSessionExercises]);

  // Add a state to track the form step
  const [formStep, setFormStep] = useState(1);

  // Modify the handleCreateExercise function to handle the first step
  const handleCreateExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se ha encontrado el token de autenticación");
        return;
      }

      // Crear el ejercicio
      const createResponse = await fetch(
        `${getApiBaseUrl()}/api/treatments/exercises/create/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newExercise),
        }
      );

      if (!createResponse.ok) {
        throw new Error(`HTTP error! status: ${createResponse.status}`);
      }

      const createData = await createResponse.json();
      console.log("Exercise created:", createData);

      // Asignar el ejercicio creado a la sesión
      const assignResponse = await fetch(
        `${getApiBaseUrl()}/api/treatments/sessions/${sessionId}/assign-exercise/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ exercise: createData.id }),
        }
      );

      if (!assignResponse.ok) {
        throw new Error(`HTTP error! status: ${assignResponse.status}`);
      }

      const assignData = await assignResponse.json();
      console.log("Exercise assigned:", assignData);

      // Set the exercise session ID and move to step 2
      setCurrentExerciseSessionId(assignData.id);
      setFormStep(2);

      // Add a default series
      if (series.length === 0) {
        handleAddSeries();
      }
    } catch (err) {
      setError("Error al crear y asignar el ejercicio");
      console.error("Error details:", err);
    }
  };

  // Add a function to handle form completion
  const handleCompleteForm = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !currentExerciseSessionId) {
        setError(
          "No se ha encontrado el token de autenticación o el ID de la sesión de ejercicio"
        );
        return;
      }

      // Create series for the exercise session
      for (const serie of series) {
        console.log("Creating series:", serie);
        const response = await fetch(
          `${getApiBaseUrl()}/api/treatments/exercise-sessions/${currentExerciseSessionId}/series/create/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(serie),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      // Reset form state
      setSeries([]);
      setFormStep(1);
      setShowForm(false);
      setCurrentExerciseSessionId(null);

      // Reload exercises to show the newly created and assigned exercise
      await loadSessionExercises();
    } catch (err) {
      setError("Error al completar el formulario");
      console.error("Error details:", err);
    }
  };

  // Add a function to handle form cancellation
  const handleCancelForm = () => {
    setFormStep(1);
    setShowForm(false);
    setSeries([]);
    setCurrentExerciseSessionId(null);
  };

  const handleCreateSeries = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !currentExerciseSessionId) {
        setError(
          "No se ha encontrado el token de autenticación o el ID de la sesión de ejercicio"
        );
        return;
      }

      for (const serie of series) {
        const response = await fetch(
          `${getApiBaseUrl()}/api/treatments/exercise-sessions/${currentExerciseSessionId}/series/create/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(serie),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      setSeries([]);
      setShowSeriesForm(false);
      setCurrentExerciseSessionId(null);
      loadSessionExercises();
    } catch (err) {
      setError("Error al crear las series");
      console.log(err);
    }
  };

  const handleAddSeries = () => {
    const newSeries: Series = {
      series_number: series.length + 1,
      repetitions: 0,
      weight: undefined,
      time: undefined,
      distance: undefined,
    };
    setSeries([...series, newSeries]);
  };

  const handleUpdateSeries = (
    index: number,
    field: keyof Series,
    value: number
  ) => {
    if (value <= 0) {
      value = 1;
    }
    const updatedSeries = [...series];
    updatedSeries[index] = { ...updatedSeries[index], [field]: value };
    setSeries(updatedSeries);
  };

  const handleUnassignExercise = (exerciseSessionId: number) => {
    setExerciseSessionIdToUnassign(exerciseSessionId);
    setShowUnassignConfirmation(true);
  };

  // Add function to confirm unassignment
  const confirmUnassignExercise = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !exerciseSessionIdToUnassign) {
        setError(
          "No se ha encontrado el token de autenticación o el ejercicio a desasignar"
        );
        return;
      }

      const response = await fetch(
        `${getApiBaseUrl()}/api/treatments/exercise-sessions/${exerciseSessionIdToUnassign}/unassign-exercise/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      loadSessionExercises();
      setShowUnassignConfirmation(false);
      setExerciseSessionIdToUnassign(null);
    } catch (err) {
      setError("Error al desasignar el ejercicio");
      console.log(err);
    }
  };

  // Add function to cancel unassignment
  const cancelUnassignExercise = () => {
    setShowUnassignConfirmation(false);
    setExerciseSessionIdToUnassign(null);
  };

  const handleAddSeriesToExistingExercise = (exerciseSessionId: number) => {
    setCurrentExerciseSessionId(exerciseSessionId);
    setSeries([]); // Reset series form
    handleAddSeries(); // Add a default empty series
    setShowSeriesForm(true);
  };

  const handleDeleteSeries = async (seriesId: number) => {
    setSeriesIdToDelete(seriesId);
    setShowDeleteConfirmation(true);
  };

  // Add a function to handle series deletion
  const confirmDeleteSeries = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !seriesIdToDelete) {
        setError(
          "No se ha encontrado el token de autenticación o la serie a eliminar"
        );
        return;
      }

      const response = await fetch(
        `${getApiBaseUrl()}/api/treatments/series/${seriesIdToDelete}/delete/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update exercises state locally instead of reloading from server
      const updatedExercises = exercises.map((exercise) => {
        if (
          exercise.series &&
          exercise.series.some((s: SeriesData) => s.id === seriesIdToDelete)
        ) {
          // This is the exercise containing the deleted series
          const updatedSeries = exercise.series.filter(
            (s: SeriesData) => s.id !== seriesIdToDelete
          );

          // Reorder series numbers
          const reorderedSeries = updatedSeries.map(
            (s: SeriesData, index: number) => ({
              ...s,
              series_number: index + 1,
            })
          );

          return {
            ...exercise,
            series: reorderedSeries,
          };
        }
        return exercise;
      });

      setExercises(updatedExercises);
      setShowDeleteConfirmation(false);
      setSeriesIdToDelete(null);
    } catch (err) {
      setError("Error al eliminar la serie");
      console.error("Error details:", err);
    }
  };

  // Add a function to cancel deletion
  const cancelDeleteSeries = () => {
    setShowDeleteConfirmation(false);
    setSeriesIdToDelete(null);
  };

  const handleEditSeries = (serie: SeriesData) => {
    setCurrentSeries(serie);
    setShowEditSeriesForm(true);
  };

  const handleUpdateExistingSeries = async () => {
    try {
      if (!currentSeries) {
        setError("No hay serie seleccionada para editar");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se ha encontrado el token de autenticación");
        return;
      }

      const response = await fetch(
        `${getApiBaseUrl()}/api/treatments/series/${currentSeries.id}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            repetitions: currentSeries.repetitions,
            weight: currentSeries.weight,
            time: currentSeries.time,
            distance: currentSeries.distance,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update exercises state locally
      const updatedExercises = exercises.map((exercise) => {
        if (
          exercise.series &&
          exercise.series.some((s: SeriesData) => s.id === currentSeries.id)
        ) {
          // This is the exercise containing the edited series
          const updatedSeries = exercise.series.map((s: SeriesData) =>
            s.id === currentSeries.id ? currentSeries : s
          );

          return {
            ...exercise,
            series: updatedSeries,
          };
        }
        return exercise;
      });

      setExercises(updatedExercises);
      setShowEditSeriesForm(false);
      setCurrentSeries(null);
    } catch (err) {
      setError("Error al actualizar la serie");
      console.error("Error details:", err);
    }
  };

  // Add function to cancel editing
  const handleCancelEditSeries = () => {
    setShowEditSeriesForm(false);
    setCurrentSeries(null);
  };

  const formatDuration = (durationString: string) => {
    try {
      // Parse ISO duration format like "PT1H30M" or handle seconds format
      if (durationString.includes("PT")) {
        const hours = durationString.match(/(\d+)H/);
        const minutes = durationString.match(/(\d+)M/);
        const seconds = durationString.match(/(\d+)S/);

        let result = "";
        if (hours) result += `${hours[1]}h `;
        if (minutes) result += `${minutes[1]}m `;
        if (seconds) result += `${seconds[1]}s`;

        return result.trim() || "0s";
      } else {
        // Handle seconds format
        const totalSeconds = parseInt(durationString);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        let result = "";
        if (hours > 0) result += `${hours}h `;
        if (minutes > 0) result += `${minutes}m `;
        if (seconds > 0 || result === "") result += `${seconds}s`;

        return result.trim();
      }
    } catch (e) {
      console.error("Error al formatear la duración:", e);
      return durationString;
    }
  };

  const toggleSeriesLogs = (seriesId: number) => {
    if (expandedSeriesId === seriesId) {
      setExpandedSeriesId(null); // Collapse if already expanded
    } else {
      setExpandedSeriesId(seriesId); // Expand this series
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: "rgb(238, 251, 250)" }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() =>
              router.push(`/physio-management/follow-up/${id}/sessions`)
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
            Volver a las sesiones
          </button>
          <h1 className="text-3xl font-bold text-[#05668D]">
            Ejercicios de la Sesión
          </h1>
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>
        {!showForm && !showExistingExercises && (
          <div className="flex space-x-4 mb-8 mt-8">
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#6BC9BE] to-[#05668D] text-white font-medium rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#6BC9BE] focus:ring-offset-2 transition-all duration-300 shadow-md flex items-center space-x-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Crear Nuevo Ejercicio</span>
            </button>
            <button
              onClick={() => {
                setShowExistingExercises(true);
                loadAvailableExercises();
              }}
              className="px-6 py-3 bg-gradient-to-r from-[#05668D] to-[#6BC9BE] text-white font-medium rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#41B8D5] focus:ring-offset-2 transition-all duration-300 shadow-md flex items-center space-x-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 20c1.5-1.5 3-3 3-5s-1.5-3.5-3-5c-1.5 1.5-3 3-3 5s1.5 3.5 3 5z"
                />
              </svg>
              <span>Seleccionar Existente</span>
            </button>
          </div>
        )}

        {showExistingExercises && (
          <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-bold text-[#05668D] mb-6">
              Ejercicios Disponibles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:transform hover:translate-y-[-2px]"
                >
                  <h3 className="text-xl font-semibold text-[#05668D] mb-3">
                    {exercise.title}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {exercise.description || "Sin descripción"}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {exercise?.body_region
                        ? formatAreaName(exercise.body_region)
                        : "No especificada"}
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {exercise?.exercise_type
                        ? formatExerciseTypeName(exercise.exercise_type)
                        : "No especificado"}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAssignExercise(exercise.id)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-[#6BC9BE] to-[#05668D] text-white font-medium rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#6BC9BE] focus:ring-offset-2 transition-all duration-300"
                  >
                    Añadir a la Sesión
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowExistingExercises(false)}
              className="mt-6 px-6 py-3 bg-white border border-red-400 text-red-500 font-medium rounded-xl hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 transition-all duration-300 shadow-sm"
            >
              Cancelar
            </button>
          </div>
        )}

        {showForm && (
          <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
            {formStep === 1 ? (
              <>
                <h2 className="text-2xl font-bold text-[#05668D] mb-6">
                  Crear Nuevo Ejercicio
                </h2>
                <form
                  onSubmit={handleCreateExercise}
                  className="grid grid-cols-1 gap-6"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Título
                    </label>
                    <input
                      type="text"
                      value={newExercise.title}
                      onChange={(e) =>
                        setNewExercise({
                          ...newExercise,
                          title: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#41B8D5] transition-all duration-300"
                      required
                      maxLength={50}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      value={newExercise.description}
                      onChange={(e) =>
                        setNewExercise({
                          ...newExercise,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#41B8D5] transition-all duration-300"
                      rows={4}
                      required
                      maxLength={150}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Área
                    </label>
                    <select
                      value={newExercise.body_region}
                      onChange={(e) =>
                        setNewExercise({
                          ...newExercise,
                          body_region: e.target.value as AreaChoice,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#41B8D5] transition-all duration-300"
                      required
                    >
                      {/* ... existing options ... */}
                      <option value="NECK">Cuello</option>
                      <option value="SHOULDER">Hombros</option>
                      <option value="ARM">Brazos (Bíceps, Tríceps)</option>
                      <option value="ELBOW">Codo</option>
                      <option value="WRIST_HAND">Muñeca y Mano</option>
                      <option value="CHEST">Pecho</option>
                      <option value="UPPER_BACK">Espalda Alta</option>
                      <option value="LOWER_BACK">Zona Lumbar</option>
                      <option value="CORE">Zona Media / Core</option>
                      <option value="QUADRICEPS">Cuádriceps</option>
                      <option value="HAMSTRINGS">Isquiotibiales</option>
                      <option value="KNEE">Rodilla</option>
                      <option value="CALVES">Pantorrillas</option>
                      <option value="ANKLE_FOOT">Tobillo y Pie</option>
                      <option value="UPPER_BODY">
                        Parte Superior del Cuerpo
                      </option>
                      <option value="LOWER_BODY">
                        Parte Inferior del Cuerpo
                      </option>
                      <option value="FULL_BODY">Cuerpo Completo</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Tipo de Ejercicio
                    </label>
                    <select
                      value={newExercise.exercise_type}
                      onChange={(e) =>
                        setNewExercise({
                          ...newExercise,
                          exercise_type: e.target.value as ExerciseType,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#41B8D5] transition-all duration-300"
                      required
                    >
                      {/* ... existing options ... */}
                      <option value="STRENGTH">Fortalecimiento Muscular</option>
                      <option value="MOBILITY">Movilidad Articular</option>
                      <option value="STRETCHING">Estiramientos</option>
                      <option value="BALANCE">Ejercicios de Equilibrio</option>
                      <option value="PROPRIOCEPTION">Propiocepción</option>
                      <option value="COORDINATION">Coordinación</option>
                      <option value="BREATHING">
                        Ejercicios Respiratorios
                      </option>
                      <option value="RELAXATION">Relajación / Descarga</option>
                      <option value="CARDIO">Resistencia Cardiovascular</option>
                      <option value="FUNCTIONAL">Ejercicio Funcional</option>
                    </select>
                  </div>
                  <div className="flex space-x-4 mt-6">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-[#6BC9BE] to-[#05668D] text-white font-medium rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#6BC9BE] focus:ring-offset-2 transition-all duration-300 shadow-md"
                    >
                      Continuar
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelForm}
                      className="px-6 py-3 bg-white border border-red-700 text-red-500 font-medium rounded-xl hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 transition-all duration-300 shadow-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-[#05668D] mb-6">
                  Configurar Series del Ejercicio
                </h2>
                <div className="space-y-6">
                  {series.map((serie, index) => (
                    <div
                      key={index}
                      className="p-5 bg-gradient-to-br from-[#f8fdfc] to-[#edf8f7] rounded-xl shadow-sm"
                    >
                      <h3 className="text-lg font-semibold mb-4 text-[#05668D]">
                        Serie {serie.series_number}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Repeticiones
                          </label>
                          <input
                            type="number"
                            value={serie.repetitions}
                            onChange={(e) =>
                              handleUpdateSeries(
                                index,
                                "repetitions",
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#41B8D5] transition-all duration-300"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Peso (kg)
                          </label>
                          <input
                            type="number"
                            value={serie.weight || ""}
                            onChange={(e) =>
                              handleUpdateSeries(
                                index,
                                "weight",
                                parseFloat(e.target.value)
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#41B8D5] transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tiempo (segundos)
                          </label>
                          <input
                            type="number"
                            value={serie.time || ""}
                            onChange={(e) =>
                              handleUpdateSeries(
                                index,
                                "time",
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#41B8D5] transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Distancia (metros)
                          </label>
                          <input
                            type="number"
                            value={serie.distance || ""}
                            onChange={(e) =>
                              handleUpdateSeries(
                                index,
                                "distance",
                                parseFloat(e.target.value)
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#41B8D5] transition-all duration-300"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={handleAddSeries}
                    className="px-5 py-2.5 bg-white text-[#05668D] border border-[#05668D] rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-sm flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Añadir Serie
                  </button>
                  <div className="space-x-4">
                    <button
                      onClick={handleCancelForm}
                      className="px-5 py-2.5 bg-white border border-red-400 text-red-500 rounded-xl hover:bg-red-50 transition-all duration-300 shadow-sm"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleCompleteForm}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#6BC9BE] to-[#05668D] text-white rounded-xl hover:opacity-90 transition-all duration-300 shadow-md"
                    >
                      Guardar Series
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Exercise cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map(({ exercise, exerciseSessionId, series }) => (
            <div
              key={exerciseSessionId}
              className="bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <h3 className="text-xl font-semibold break-words text-[#05668D] mb-3">
                {exercise?.title || "Sin título"}
              </h3>
              <p className="text-gray-600 mb-3 break-words">
                {exercise?.description || "Sin descripción"}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {formatAreaName(exercise.body_region)}
                </span>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {formatExerciseTypeName(exercise.exercise_type)}
                </span>
              </div>

              {/* Display series information */}
              {series && series.length > 0 ? (
                <div className="mt-4 mb-4">
                  <h4 className="text-lg font-medium text-[#05668D] mb-2">
                    Series:
                  </h4>
                  <div className="space-y-3">
                    {series.map((serie: SeriesData, index: number) => (
                      <div
                        key={serie.id}
                        className="bg-gradient-to-br from-[#f8fdfc] to-[#edf8f7] p-3 rounded-xl relative"
                      >
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-[#05668D]">
                            Serie {index + 1}
                          </p>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => toggleSeriesLogs(serie.id)}
                              className={`text-[#41B8D5] hover:text-[#05668D] transition-colors duration-300 ${
                                serie.logs && serie.logs.length > 0
                                  ? ""
                                  : "opacity-50 cursor-not-allowed"
                              }`}
                              title={
                                serie.logs && serie.logs.length > 0
                                  ? "Ver registros"
                                  : "No hay registros"
                              }
                              disabled={!serie.logs || serie.logs.length === 0}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleEditSeries(serie)}
                              className="text-[#6BC9BE] hover:text-[#05668D] transition-colors duration-300"
                              title="Editar serie"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteSeries(serie.id)}
                              className="text-red-500 hover:text-red-700 transition-colors duration-300"
                              title="Eliminar serie"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Series details */}
                        <div className="mt-2 text-sm text-gray-600">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="font-medium">Repeticiones:</span>{" "}
                              {serie.repetitions}
                            </div>
                            {serie.weight && (
                              <div>
                                <span className="font-medium">Peso:</span>{" "}
                                {serie.weight} kg
                              </div>
                            )}
                            {serie.time && (
                              <div>
                                <span className="font-medium">Tiempo:</span>{" "}
                                {serie.time} seg
                              </div>
                            )}
                            {serie.distance && (
                              <div>
                                <span className="font-medium">Distancia:</span>{" "}
                                {serie.distance} m
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Expanded logs section */}
                        {expandedSeriesId === serie.id &&
                          serie.logs &&
                          serie.logs.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <h5 className="text-sm font-medium text-gray-700 mb-2">
                                Registros del paciente:
                              </h5>
                              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                {serie.logs.map((log) => (
                                  <div
                                    key={log.id}
                                    className="bg-white p-2 rounded-lg shadow-sm text-xs"
                                  >
                                    <div className="flex justify-between mb-1">
                                      <span className="font-medium">
                                        Fecha:
                                      </span>
                                      <span>
                                        {new Date(
                                          log.date
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <div className="flex justify-between mb-1">
                                      <span className="font-medium">
                                        Repeticiones:
                                      </span>
                                      <span>{log.repetitions_done}</span>
                                    </div>
                                    {log.weight_done && (
                                      <div className="flex justify-between mb-1">
                                        <span className="font-medium">
                                          Peso:
                                        </span>
                                        <span>{log.weight_done} kg</span>
                                      </div>
                                    )}
                                    {log.time_done && (
                                      <div className="flex justify-between mb-1">
                                        <span className="font-medium">
                                          Tiempo:
                                        </span>
                                        <span>
                                          {formatDuration(log.time_done)}
                                        </span>
                                      </div>
                                    )}
                                    {log.distance_done && (
                                      <div className="flex justify-between mb-1">
                                        <span className="font-medium">
                                          Distancia:
                                        </span>
                                        <span>{log.distance_done} m</span>
                                      </div>
                                    )}
                                    {log.notes && (
                                      <div className="mt-1 pt-1 border-t border-gray-100">
                                        <span className="font-medium">
                                          Notas:
                                        </span>{" "}
                                        {log.notes}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-4 mb-4 text-center py-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500">No hay series configuradas</p>
                </div>
              )}

              <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() =>
                    handleAddSeriesToExistingExercise(exerciseSessionId)
                  }
                  className="px-3 py-1.5 bg-gradient-to-r from-[#41B8D5] to-[#1E5ACD] text-white rounded-xl hover:opacity-90 transition-all duration-300 text-sm shadow-sm"
                >
                  Añadir Serie
                </button>
                <button
                  onClick={() => handleUnassignExercise(exerciseSessionId)}
                  className="px-3 py-1.5 bg-white border border-red-400 text-red-500 rounded-xl hover:bg-red-50 transition-all duration-300 text-sm shadow-sm"
                >
                  Eliminar Ejercicio
                </button>
              </div>
            </div>
          ))}
        </div>

        {showUnassignConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Confirmar desasignación
              </h2>
              <p className="text-gray-600 mb-2">
                ¿Estás seguro de que deseas eliminar este ejercicio de la
                sesión?
              </p>
              <p className="text-red-500 font-medium mb-6">
                ¡Atención! Todas las series asociadas a este ejercicio serán
                eliminadas permanentemente.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={cancelUnassignExercise}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmUnassignExercise}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {showSeriesForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Configurar Series del Ejercicio
              </h2>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded">
                <p className="text-blue-700 font-medium">
                  Información importante:
                </p>
                <ul className="list-disc ml-5 text-blue-600 text-sm mt-1">
                  <li>Todos los valores deben ser mayores que 0</li>
                  <li>
                    Debe especificar al menos un valor para peso, tiempo o
                    distancia
                  </li>
                </ul>
              </div>

              <div className="space-y-6">
                {series.map((serie, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Detalles</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Repeticiones *
                        </label>
                        <input
                          type="number"
                          value={serie.repetitions || ""}
                          onChange={(e) =>
                            handleUpdateSeries(
                              index,
                              "repetitions",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                          required
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Peso (kg)
                        </label>
                        <input
                          type="number"
                          value={serie.weight || ""}
                          onChange={(e) =>
                            handleUpdateSeries(
                              index,
                              "weight",
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tiempo (segundos)
                        </label>
                        <input
                          type="number"
                          value={serie.time || ""}
                          onChange={(e) =>
                            handleUpdateSeries(
                              index,
                              "time",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Distancia (metros)
                        </label>
                        <input
                          type="number"
                          value={serie.distance || ""}
                          onChange={(e) =>
                            handleUpdateSeries(
                              index,
                              "distance",
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={handleAddSeries}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300"
                >
                  Añadir Serie
                </button>
                <div className="space-x-4">
                  <button
                    onClick={() => {
                      setSeries([]);
                      setShowSeriesForm(false);
                      setCurrentExerciseSessionId(null);
                    }}
                    className="px-4 py-2 bg-red-400 text-white rounded-xl hover:bg-red-500"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreateSeries}
                    className="px-4 py-2 bg-[#6bc9be] text-white rounded-xl hover:bg-[#5ab8ad]"
                  >
                    Guardar Series
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showEditSeriesForm && currentSeries && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Editar Serie
              </h2>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded">
                <p className="text-blue-700 font-medium">
                  Información importante:
                </p>
                <ul className="list-disc ml-5 text-blue-600 text-sm mt-1">
                  <li>Todos los valores deben ser mayores que 0</li>
                  <li>
                    Debe especificar al menos un valor para peso, tiempo o
                    distancia
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Repeticiones (obligatorio)
                  </label>
                  <input
                    type="number"
                    value={currentSeries.repetitions || ""}
                    onChange={(e) =>
                      setCurrentSeries({
                        ...currentSeries,
                        repetitions:
                          parseInt(e.target.value) === 0
                            ? 1
                            : parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    value={currentSeries.weight || ""}
                    onChange={(e) =>
                      setCurrentSeries({
                        ...currentSeries,
                        weight: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiempo (segundos)
                  </label>
                  <input
                    type="number"
                    value={currentSeries.time || ""}
                    onChange={(e) =>
                      setCurrentSeries({
                        ...currentSeries,
                        time: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Distancia (metros)
                  </label>
                  <input
                    type="number"
                    value={currentSeries.distance || ""}
                    onChange={(e) =>
                      setCurrentSeries({
                        ...currentSeries,
                        distance: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={handleCancelEditSeries}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdateExistingSeries}
                  className="px-4 py-2 bg-[#6bc9be] text-white rounded-xl hover:bg-[#5ab8ad]"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Confirmar eliminación
              </h2>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que deseas eliminar esta serie? Esta acción no
                se puede deshacer.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={cancelDeleteSeries}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteSeries}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200"
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

export default ExercisesPage;
