"use client";

import { useState, useEffect } from "react";
import { getApiBaseUrl } from "@/utils/api";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Define interfaces for our data
interface Exercise {
  id: number;
  title: string;
  description: string | null;
  body_region: string;
  exercise_type: string;
  physiotherapist: number;
}

interface Series {
  id: number;
  series_number: number;
  repetitions: number;
  weight: number | null;
  time: string | null;
  distance: number | null;
}

interface SessionInfo {
  id: number;
  name: string;
  day_of_week: string[];
}

interface TreatmentInfo {
  id: number;
  patient_name: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

interface ExerciseUsage {
  exercise_session_id: number;
  session: SessionInfo;
  treatment: TreatmentInfo;
  series: Series[];
}

// Map for body region images
const bodyRegionImages: Record<string, string> = {
  NECK: "/static/images/body-regions/cuello.png",
  SHOULDER: "/static/images/body-regions/hombro.png",
  ARM: "/static/images/body-regions/brazo.png",
  ELBOW: "/static/images/body-regions/codo.png",
  WRIST_HAND: "/static/images/body-regions/mano_muneca.png",
  CHEST: "/static/images/body-regions/pecho.png",
  UPPER_BACK: "/static/images/body-regions/espalda.png",
  LOWER_BACK: "/static/images/body-regions/espalda.png",
  CORE: "/static/images/body-regions/core.png",
  QUADRICEPS: "/static/images/body-regions/cuadriceps.png",
  HAMSTRINGS: "/static/images/body-regions/isquiotibiales.png",
  KNEE: "/static/images/body-regions/rodilla.png",
  CALVES: "/static/images/body-regions/gemelos.png",
  ANKLE_FOOT: "/static/images/body-regions/pie_tobillo.png",
  UPPER_BODY: "/static/images/body-regions/tren_superior.png",
  LOWER_BODY: "/static/images/body-regions/tren_inferior.png",
  FULL_BODY: "/static/images/body-regions/full_body.png",
};

// Map for exercise type images
const exerciseTypeImages: Record<string, string> = {
  STRENGTH: "/static/images/exercise-types/fuerza.png",
  MOBILITY: "/static/images/exercise-types/movilidad.png",
  STRETCHING: "/static/images/exercise-types/estiramiento.png",
  BALANCE: "/static/images/exercise-types/equilibrio.png",
  PROPRIOCEPTION: "/static/images/exercise-types/propiocepcion.png",
  COORDINATION: "/static/images/exercise-types/coordinacion.png",
  BREATHING: "/static/images/exercise-types/respiracion.png",
  RELAXATION: "/static/images/exercise-types/respiracion.png",
  CARDIO: "/static/images/exercise-types/cardio.png",
  FUNCTIONAL: "/static/images/exercise-types/funcional.png",
};

// Map for body region display names
const bodyRegionNames: Record<string, string> = {
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
};

// Map for exercise type display names
const exerciseTypeNames: Record<string, string> = {
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
};

const ExercisesPage = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedBodyRegion, setSelectedBodyRegion] = useState<string | null>(null);
  const [selectedExerciseType, setSelectedExerciseType] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [exerciseUsage, setExerciseUsage] = useState<ExerciseUsage[]>([]);
  const [loadingUsage, setLoadingUsage] = useState(false);
  const router = useRouter();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newExercise, setNewExercise] = useState({
    title: "",
    description: "",
    body_region: "UPPER_BODY",
    exercise_type: "STRENGTH",
  });
  const [isCreating, setIsCreating] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  const fetchExerciseUsage = async (exerciseId: number) => {
    try {
      setLoadingUsage(true);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se ha encontrado el token de autenticación");
        setLoadingUsage(false);
        return;
      }

      const response = await fetch(
        `${getApiBaseUrl()}/api/treatments/exercises/${exerciseId}/usage/`,
        {
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
      setExerciseUsage(data);
    } catch (error) {
      console.error("Error fetching exercise usage:", error);
      setError(
        "Error al cargar el uso del ejercicio. Por favor, inténtalo de nuevo."
      );
    } finally {
      setLoadingUsage(false);
    }
  };

  const handleViewDetails = (exercise: Exercise) => {
    if (selectedExercise && selectedExercise.id === exercise.id) {
      // If clicking on the same exercise, close the details
      setSelectedExercise(null);
      setExerciseUsage([]);
    } else {
      // Otherwise, show details for the selected exercise
      setSelectedExercise(exercise);
      fetchExerciseUsage(exercise.id);
    }
  };

  const formatDayOfWeek = (days: string[]) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Fetch all exercises
  const fetchExercises = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se ha encontrado el token de autenticación");
        setLoading(false);
        return;
      }

      const response = await fetch(`${getApiBaseUrl()}/api/treatments/exercises/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setExercises(data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      setError("Error al cargar los ejercicios. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const createExercise = async () => {
    try {
      setIsCreating(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se ha encontrado el token de autenticación");
        setIsCreating(false);
        return;
      }

      const response = await fetch(
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setExercises([...exercises, data]);
      setCreateSuccess(true);

      // Reset form
      setNewExercise({
        title: "",
        description: "",
        body_region: "UPPER_BODY",
        exercise_type: "STRENGTH",
      });

      // Hide form after successful creation
      setTimeout(() => {
        setShowCreateForm(false);
        setCreateSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error creating exercise:", error);
      setError("Error al crear el ejercicio. Por favor, inténtalo de nuevo.");
    } finally {
      setIsCreating(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewExercise((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createExercise();
  };

  // Search exercises by title
  const searchExercises = async () => {
    if (!searchQuery.trim()) {
      fetchExercises();
      return;
    }

    try {
      setIsSearching(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se ha encontrado el token de autenticación");
        setIsSearching(false);
        return;
      }

      const response = await fetch(
        `${getApiBaseUrl()}/api/treatments/exercises/search/?query=${encodeURIComponent(
          searchQuery
        )}`,
        {
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
      setExercises(data);
    } catch (error) {
      console.error("Error searching exercises:", error);
      setError("Error al buscar ejercicios. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchExercises();
  };

  // Filter exercises by body region and exercise type
  const getFilteredExercises = () => {
    return exercises.filter((exercise) => {
      const matchesBodyRegion = !selectedBodyRegion || exercise.body_region === selectedBodyRegion;
      const matchesExerciseType = !selectedExerciseType || exercise.exercise_type === selectedExerciseType;
      return matchesBodyRegion && matchesExerciseType;
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedBodyRegion(null);
    setSelectedExerciseType(null);
    setSearchQuery("");
    fetchExercises();
  };

  // Load exercises on component mount
  useEffect(() => {
    fetchExercises();
  }, []);

  const filteredExercises = getFilteredExercises();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative mb-8">
      {/* Botón de volver a la izquierda */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
        <button
          onClick={() => router.push(`/physio-management/profile`)}
          className="bg-white hover:bg-gray-100 text-[#05668D] font-semibold py-2 px-4 rounded-xl inline-flex items-center shadow-md transition-all duration-300"
        >
          ← Volver
        </button>
      </div>

      {/* Título centrado */}
      <h1 className="text-4xl font-bold text-[#05668D] text-center">
        Biblioteca de Ejercicios
      </h1>
    </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative flex items-center mt-4">
              <input
                type="text"
                placeholder="Buscar ejercicios por título..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl pr-12 focus:ring-gray-200 focus:outline-none"
              />
              <button
                type="submit"
                className="mb-8 absolute right-2 text-gray-100 hover:text-gray-100 transition-colors rounded-xl"
                disabled={isSearching}
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </form>

          {/* Filter Dropdowns */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-grow">
              {/* Body Region Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Región Corporal
                </label>
                <select
                  value={selectedBodyRegion || ""}
                  onChange={(e) =>
                    setSelectedBodyRegion(e.target.value || null)
                  }
                  className="w-full px-4 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent rounded-xl bg-white shadow-sm"
                >
                  <option value="">Todas las regiones</option>
                  {Object.entries(bodyRegionNames).map(([key, name]) => (
                    <option key={key} value={key}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Exercise Type Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Ejercicio
                </label>
                <select
                  value={selectedExerciseType || ""}
                  onChange={(e) =>
                    setSelectedExerciseType(e.target.value || null)
                  }
                  className="w-full px-4 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent rounded-xl bg-white shadow-sm"
                >
                  <option value="">Todos los tipos</option>
                  {Object.entries(exerciseTypeNames).map(([key, name]) => (
                    <option key={key} value={key}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Filters Button */}
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full mb-3 sm:w-auto px-6 py-2 text-base font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 rounded-xl shadow-sm"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Exercise Button */}
      <div className="mb-6 flex justify-center">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-6 py-3 bg-gradient-to-r from-[#6BC9BE] to-[#05668D] text-white font-medium rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#6BC9BE] focus:ring-offset-2 transition-all duration-300 shadow-md flex items-center space-x-2"
        >
          {showCreateForm ? "Cancelar" : "Crear Nuevo Ejercicio"}
        </button>
      </div>

      {/* Create Exercise Form */}
      {showCreateForm && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Crear Nuevo Ejercicio</h2>

          {createSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              Ejercicio creado exitosamente.
            </div>
          )}

          <form onSubmit={handleCreateSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={newExercise.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre del ejercicio"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={newExercise.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descripción detallada del ejercicio"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Región Corporal <span className="text-red-500">*</span>
                </label>
                <select
                  name="body_region"
                  value={newExercise.body_region}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(bodyRegionNames).map(([key, name]) => (
                    <option key={key} value={key}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Ejercicio <span className="text-red-500">*</span>
                </label>
                <select
                  name="exercise_type"
                  value={newExercise.exercise_type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(exerciseTypeNames).map(([key, name]) => (
                    <option key={key} value={key}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isCreating}
                className="px-6 py-2 text-base font-medium text-white bg-gradient-to-r from-[#6BC9BE] to-[#05668D] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#6BC9BE] focus:ring-offset-2 transition-colors duration-200 rounded-xl shadow-sm disabled:opacity-50"
              >
                {isCreating ? "Creando..." : "Crear Ejercicio"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredExercises.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">No se encontraron ejercicios.</p>
          {(searchQuery || selectedBodyRegion || selectedExerciseType) && (
            <button
              onClick={resetFilters}
              className="mt-2 text-blue-500 hover:underline"
            >
              Limpiar filtros y mostrar todos los ejercicios
            </button>
          )}
        </div>
      ) : (
        // Replace the exercise card rendering section with this updated version
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full"
            >
              {selectedExercise?.id === exercise.id ? (
                // Detailed view when exercise is selected - same card size
                <div className="flex flex-col h-full">
                  <div className="p-4 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-semibold">
                        Uso del ejercicio
                      </h2>
                      <button
                        onClick={() => setSelectedExercise(null)}
                        className="text-gray-500 hover:text-gray-700"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    {loadingUsage ? (
                      <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    ) : exerciseUsage.length === 0 ? (
                      <div className="bg-gray-50 rounded-lg p-3 text-center mb-3">
                        <p className="text-gray-500 text-sm">
                          Este ejercicio no está asignado a ninguna sesión.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 overflow-y-auto max-h-64 pr-1">
                        {exerciseUsage.map((usage) => (
                          <div
                            key={usage.exercise_session_id}
                            className="bg-gray-50 rounded-lg p-3 text-sm"
                          >
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <div>
                                <p className="font-medium">
                                  {usage.session.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatDayOfWeek(usage.session.day_of_week)}
                                </p>
                              </div>
                              <span
                                className={`px-2 py-0.5 text-xs rounded-full ${
                                  usage.treatment.is_active
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {usage.treatment.is_active
                                  ? "Activo"
                                  : "Inactivo"}
                              </span>
                            </div>

                            <p className="text-xs mb-1">
                              <span className="font-bold">Paciente:</span>{" "}
                              {usage.treatment.patient_name}
                            </p>
                            <p className="text-xs mb-2">
                              <span className="font-bold">Tratamiento:</span>{" "}
                              {formatDate(usage.treatment.start_time)} -{" "}
                              {formatDate(usage.treatment.end_time)}
                            </p>

                            {usage.series.length > 0 && (
                              <div>
                                <p className="text-xs font-bold mb-1">
                                  {usage.series.length} Series:
                                </p>
                                <div className="overflow-x-auto">
                                  <table className="w-full text-xs">
                                    <thead>
                                      <tr className="bg-gray-50">
                                        <th className="px-2 py-1 text-left">
                                          Rep.
                                        </th>
                                        <th className="px-2 py-1 text-left">
                                          Peso
                                        </th>
                                        <th className="px-2 py-1 text-left">
                                          Tiempo
                                        </th>
                                        <th className="px-2 py-1 text-left">
                                          Dist.
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {usage.series
                                        .slice(0, 4)
                                        .map((series) => (
                                          <tr
                                            key={series.id}
                                            className="border-b border-gray-100"
                                          >
                                            <td className="px-2 py-1">
                                              {series.repetitions}
                                            </td>
                                            <td className="px-2 py-1">
                                              {series.weight
                                                ? `${series.weight} kg`
                                                : "-"}
                                            </td>
                                            <td className="px-2 py-1">
                                              {series.time
                                                ? `${parseInt(series.time)} seg`
                                                : "-"}
                                            </td>
                                            <td className="px-2 py-1">
                                              {series.distance
                                                ? `${series.distance} m`
                                                : "-"}
                                            </td>
                                          </tr>
                                        ))}
                                      {usage.series.length > 4 && (
                                        <tr>
                                          <td
                                            colSpan={5}
                                            className="px-2 py-1 text-center text-gray-500"
                                          >
                                            +{usage.series.length - 4} más
                                          </td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 mt-auto">
                    <button
                      onClick={() => setSelectedExercise(null)}
                      className="w-full py-2 bg-[#05668d] text-gray-200 rounded-xl hover:bg-[#045a7c] transition-colors"
                    >
                      Ver ejercicio
                    </button>
                  </div>
                </div>
              ) : (
                // Default view - same card size as detailed view
                <div className="flex flex-col h-full">
                  {/* Images Section */}
                  <div className="grid grid-cols-2 gap-2 p-4">
                    <div className="relative h-40 bg-gray-100 rounded-xl overflow-hidden">
                      <Image
                        src={
                          bodyRegionImages[exercise.body_region] ||
                          "/images/placeholder.png"
                        }
                        alt={
                          bodyRegionNames[exercise.body_region] ||
                          exercise.body_region
                        }
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                        <p className="font-medium">
                          {bodyRegionNames[exercise.body_region] ||
                            exercise.body_region}
                        </p>
                      </div>
                    </div>

                    <div className="relative h-40 bg-gray-100 rounded-xl overflow-hidden">
                      <Image
                        src={
                          exerciseTypeImages[exercise.exercise_type] ||
                          "/images/placeholder.png"
                        }
                        alt={
                          exerciseTypeNames[exercise.exercise_type] ||
                          exercise.exercise_type
                        }
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                        <p className="font-medium">
                          {exerciseTypeNames[exercise.exercise_type] ||
                            exercise.exercise_type}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 flex-grow">
                    <h2 className="text-xl font-semibold mb-2 break-words">
                      {exercise.title}
                    </h2>

                    {/* Exercise Details */}
                    <div className="mb-4 overflow-y-auto max-h-24">
                      {exercise.description && (
                        <p className="text-gray-600 text-sm">
                          {exercise.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 mt-auto">
                    <button
                      onClick={() => handleViewDetails(exercise)}
                      className="w-full py-2 bg-[#6bc9be] text-white rounded-xl hover:bg-[#5ab9ae] transition-colors"
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExercisesPage;
