"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/utils/api";
import Image from "next/image";

// Define interfaces for our data
interface Exercise {
  id: number;
  title: string;
  description: string | null;
  body_region: string;
  exercise_type: string;
  physiotherapist: number;
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
  UPPER_BODY: "/static/images/body-regions/tre_superior.png",
  LOWER_BODY: "/static/static/images/body-regions/tren_inferior.png",
  FULL_BODY: "/static/images/body-regions/full_body.png",
};

// Map for exercise type images
const exerciseTypeImages: Record<string, string> = {
  STRENGTH: "/static/images/exercise-types/fuerza.png",
  MOBILITY: "/static/images/exercise-types/movilidad.png",
  STRETCHING: "/static/images/exercise-types/estiramiento.png",
  BALANCE: "/static/images/exercise-types/equilibrio.png",
  PROPRIOCEPTION: "/static/images/exercise-types/propriocepcion.png",
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

const ExercisesPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedBodyRegion, setSelectedBodyRegion] = useState<string | null>(null);
  const [selectedExerciseType, setSelectedExerciseType] = useState<string | null>(null);

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
      <h1 className="text-2xl font-bold mb-6">Biblioteca de Ejercicios</h1>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar ejercicios por título..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg pr-10"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isSearching}
              >
              </button>
            </div>
          </form>

          {/* Filter Dropdowns */}
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Body Region Filter */}
            <select
              value={selectedBodyRegion || ""}
              onChange={(e) => setSelectedBodyRegion(e.target.value || null)}
              className="p-3 border border-gray-300 rounded-lg"
            >
              <option value="">Todas las regiones</option>
              {Object.entries(bodyRegionNames).map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>

            {/* Exercise Type Filter */}
            <select
              value={selectedExerciseType || ""}
              onChange={(e) => setSelectedExerciseType(e.target.value || null)}
              className="p-3 border border-gray-300 rounded-lg"
            >
              <option value="">Todos los tipos</option>
              {Object.entries(exerciseTypeNames).map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>

            {/* Reset Filters Button */}
            <button
              onClick={resetFilters}
              className="p-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{exercise.title}</h2>
                
                {/* Exercise Details */}
                <div className="mb-4">
                  {exercise.description && (
                    <p className="text-gray-600 mb-2">{exercise.description}</p>
                  )}
                </div>
                
                {/* Images and Categories */}
                <div className="flex flex-col gap-4">
                  {/* Body Region */}
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 relative flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                      <Image
                        src={bodyRegionImages[exercise.body_region] || "/images/placeholder.png"}
                        alt={bodyRegionNames[exercise.body_region] || exercise.body_region}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Región corporal</p>
                      <p className="font-medium">{bodyRegionNames[exercise.body_region] || exercise.body_region}</p>
                    </div>
                  </div>
                  
                  {/* Exercise Type */}
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 relative flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                      <Image
                        src={exerciseTypeImages[exercise.exercise_type] || "/images/placeholder.png"}
                        alt={exerciseTypeNames[exercise.exercise_type] || exercise.exercise_type}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tipo de ejercicio</p>
                      <p className="font-medium">{exerciseTypeNames[exercise.exercise_type] || exercise.exercise_type}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
                <button
                  onClick={() => router.push(`/physio-management/${params.id}/exercises/${exercise.id}`)}
                  className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Ver detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExercisesPage;