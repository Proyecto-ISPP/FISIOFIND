"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Line } from "react-chartjs-2";
import Alert from "@/components/ui/Alert";
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip,
} from "chart.js";
import { getApiBaseUrl } from "@/utils/api";
import { use } from "react";


// Registrar los componentes necesarios de Chart.js
Chart.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip
);

interface User {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface Patient {
  user: User;
  gender: string;
  birth_date: string;
}

interface Physiotherapist {
  user: User;
  bio?: string;
  autonomic_community: string;
  rating_avg?: number;
  birth_date: string;
  collegiate_number: string;
  gender: string;
}

interface Treatment {
  id: number;
  physiotherapist: Physiotherapist | number;
  patient: Patient | number;
  start_time: string;
  end_time: string;
  homework: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ExerciseEvolutionData {
  exercise_name: string;
  metric_type: string;
  dates: string[];
  values: number[];
}

interface EvolutionDataByMetric {
  [exerciseName: string]: {
    [metricType: string]: ExerciseEvolutionData;
  };
}

interface SessionEvolutionData {
  session_id: number;
  session_name: string;
  exercises: ExerciseEvolutionData[];
}

const TreatmentDetailPage = ({ params }: { params: { id: string } }) => {
  const unwrappedParams = use(params as any);
  const { id, sessionId } = unwrappedParams as {
    id: string;
    sessionId: string;
  };
  const router = useRouter();
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTreatment, setEditedTreatment] = useState<Partial<Treatment>>(
    {}
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  const [evolutionData, setEvolutionData] = useState<ExerciseEvolutionData[]>(
    []
  );
  const [evolutionLoading, setEvolutionLoading] = useState(false);
  const [evolutionError, setEvolutionError] = useState<string | null>(null);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);

  const fetchEvolutionData = async () => {
    try {
      setEvolutionLoading(true);
      setEvolutionError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setEvolutionError("No se ha encontrado el token de autenticación");
        return;
      }

      const response = await fetch(
        `${getApiBaseUrl()}/api/treatments/${id}/evolution/`,
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
      console.log("Datos recibidos del backend:", data);

      // Process the data into a format suitable for our charts
      const processedData: ExerciseEvolutionData[] = [];
      const dataByMetric: EvolutionDataByMetric = {};

      // Process each exercise
      for (const [exerciseName, seriesData] of Object.entries(data)) {
        // Initialize the exercise entry in our map
        if (!dataByMetric[exerciseName]) {
          dataByMetric[exerciseName] = {};
        }

        // For each series in the exercise
        for (const [seriesKey, dateValues] of Object.entries(
          seriesData as Record<string, any>
        )) {
          // Process date values for this series
          for (const entry of dateValues as Array<{
            date: string;
            value: number;
            metric: string;
          }>) {
            const metricType = entry.metric;

            // Initialize the metric entry if it doesn't exist
            if (!dataByMetric[exerciseName][metricType]) {
              dataByMetric[exerciseName][metricType] = {
                exercise_name: exerciseName,
                metric_type: metricType,
                dates: [],
                values: [],
              };
            }

            // Add this data point
            const exerciseMetricData = dataByMetric[exerciseName][metricType];
            const dateIndex = exerciseMetricData.dates.indexOf(entry.date);

            if (dateIndex >= 0) {
              // Update existing value if date already exists
              exerciseMetricData.values[dateIndex] = entry.value;
            } else {
              // Add new date and value
              exerciseMetricData.dates.push(entry.date);
              exerciseMetricData.values.push(entry.value);
            }
          }
        }
      }

      // Convert the nested map to a flat array of exercise data
      for (const exerciseEntries of Object.values(dataByMetric)) {
        for (const metricData of Object.values(exerciseEntries)) {
          // Sort by date
          const sortedIndices = metricData.dates
            .map((date, index) => ({ date, index }))
            .sort((a, b) => {
              const [dayA, monthA] = a.date.split("/").map(Number);
              const [dayB, monthB] = b.date.split("/").map(Number);

              if (monthA !== monthB) return monthA - monthB;
              return dayA - dayB;
            })
            .map((item) => item.index);

          metricData.dates = sortedIndices.map((i) => metricData.dates[i]);
          metricData.values = sortedIndices.map((i) => metricData.values[i]);

          // Only add if there's actual data
          if (metricData.dates.length > 0) {
            processedData.push(metricData);
          }
        }
      }

      setEvolutionData(processedData);
    } catch (error) {
      console.error("Error fetching evolution data:", error);
      setEvolutionError("Error al cargar los datos de evolución");
    } finally {
      setEvolutionLoading(false);
    }
  };

  const fetchTreatmentDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || "";
  
      const response = await fetch(
        `${getApiBaseUrl()}/api/treatments/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Error al obtener el tratamiento");
      }
  
      const data = await response.json();
      setTreatment(data);
      setEditedTreatment({
        start_time: data.start_time,
        end_time: data.end_time,
        homework: data.homework,
        is_active: data.is_active,
      });
    } catch (err) {
      console.error("Error general:", err);
      setAlertType("error");
      setAlertMessage("No se pudieron cargar los detalles del tratamiento. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const fetchTreatmentDetails = async () => {
      try {
        setLoading(true);

        // Intentamos obtener los datos del backend
        try {
          const token = localStorage.getItem("token") || "";

          const response = await fetch(
            `${getApiBaseUrl()}/api/treatments/${id}/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Error al obtener el tratamiento");
          }

          const data = await response.json();
          console.log("Datos del tratamiento:", data);
          setTreatment(data);
          // Inicializar el formulario de edición con los datos actuales
          setEditedTreatment({
            start_time: data.start_time,
            end_time: data.end_time,
            homework: data.homework,
            is_active: data.is_active,
          });

          fetchEvolutionData();
          console.log("Datos de evolución procesados:", evolutionData);
        } catch (fetchError) {
          console.error("Error al obtener datos del backend:", fetchError);
          // Si falla, usamos datos mock
        }
      } catch (err) {
        console.error("Error general:", err);
        setAlertType("error");
        setAlertMessage("No se pudieron cargar los detalles del tratamiento. Por favor, inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchTreatmentDetails();
  }, [id]);

  const getCurrentExerciseChartData = () => {
    if (evolutionData.length === 0 || !evolutionData[activeExerciseIndex]) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const exercise = evolutionData[activeExerciseIndex];

    return {
      labels: exercise.dates,
      datasets: [
        {
          label: getMetricLabel(exercise.metric_type),
          data: exercise.values,
          backgroundColor: getMetricColor(exercise.metric_type),
          borderColor: getMetricColor(exercise.metric_type),
          tension: 0.1,
        },
      ],
    };
  };

  // Helper function to get a human-readable label for metric types
  const getMetricLabel = (metricType: string) => {
    switch (metricType) {
      case "weight":
        return "Peso (kg)";
      case "time":
        return "Tiempo (segundos)";
      case "distance":
        return "Distancia (metros)";
      default:
        return metricType;
    }
  };

  // Helper function to get a color for each metric type
  const getMetricColor = (metricType: string) => {
    switch (metricType) {
      case "weight":
        return "rgb(204, 10, 52)";
      case "time":
        return "rgb(7, 194, 101)";
      case "distance":
        return "rgb(7, 35, 194)";
      default:
        return "rgb(100, 100, 100)";
    }
  };

  const nextExercise = () => {
    if (activeExerciseIndex < evolutionData.length - 1) {
      setActiveExerciseIndex(activeExerciseIndex + 1);
    }
  };

  const prevExercise = () => {
    if (activeExerciseIndex > 0) {
      setActiveExerciseIndex(activeExerciseIndex - 1);
    }
  };

  const handleGoBack = () => {
    router.push("/physio-management/follow-up");
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setSaveError(null);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Convertir fecha local a UTC para mantener formato ISO
    if (value) {
      const date = new Date(value);
      const isoString = date.toISOString();

      setEditedTreatment({
        ...editedTreatment,
        [name]: isoString,
      });
    }
  };

  const handleSaveChanges = async () => {
    if (!treatment) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      // Intentar guardar en el backend
      // Comentado para permitir acceso sin login
      const token = localStorage.getItem("token") || "";

      const response = await fetch(`${getApiBaseUrl()}/api/treatments/${id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedTreatment),
      });


      if (!response.ok) {
        throw new Error("Error al guardar los cambios");
      }

      await fetchTreatmentDetails();

      // const updatedTreatment = await response.json();

      // Actualizar el estado con los datos del servidor
      // setTreatment(updatedTreatment);
      setIsEditing(false);

      // Mostrar mensaje de éxito (opcional)
      setAlertType("success");
      setAlertMessage("Tratamiento actualizado correctamente");
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      setAlertType("error");
      setAlertMessage("No se pudieron guardar los cambios. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: boolean) => {
    if (!treatment) return;

    try {
      // Intentar actualizar el estado en el backend
      // Comentado para permitir acceso sin login
      const token = localStorage.getItem('token') || '';

      const response = await fetch(
        `${getApiBaseUrl()}/api/treatments/${id}/`,
        {
          method: "PUT",
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ is_active: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error al marcar el tratamiento como ${
            newStatus ? "activo" : "inactivo"
          }`
        );
      }

      const updatedTreatment = await response.json();

      // Actualizar el estado con los datos del servidor
      setTreatment(updatedTreatment);

      // Actualizar también el formulario de edición
      setEditedTreatment({
        ...editedTreatment,
        is_active: newStatus,
      });

      setAlertType("success");
      // Mostrar mensaje de éxito
      setAlertMessage(
        `Tratamiento marcado como ${
          newStatus ? "activo" : "inactivo"
        } correctamente`
      );
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      setAlertType("error");
      setAlertMessage("No se pudo cambiar el estado del tratamiento.");
    }
  };

  // Datos para los gráficos
  const chartData = getCurrentExerciseChartData();


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!treatment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={handleGoBack}
          className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
        >
          ← Volver
        </button>
  
        <Alert
          type="error"
          message="No se encontró el tratamiento solicitado"
          onClose={() => setAlertMessage(null)}
        />
      </div>
    );
  }

  // Comprobar si patient y physiotherapist son objetos o solo IDs
  const patientData =
    typeof treatment.patient === "object" ? treatment.patient : null;
  const physioData =
    typeof treatment.physiotherapist === "object"
      ? treatment.physiotherapist
      : null;
  console.log(physioData);

  // Si no tenemos los datos completos, mostramos lo que tenemos
  const patientName = patientData?.user?.first_name
    ? `${patientData.user.first_name} ${patientData.user.last_name}`
    : `Paciente ID: ${treatment.patient}`;

  const patientEmail = patientData?.user?.email || "Email no disponible";
  const patientGender = patientData?.gender
    ? patientData.gender === "M"
      ? "Masculino"
      : "Femenino"
    : "No especificado";

  // Calcular la edad a partir de la fecha de nacimiento si está disponible
  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return "No disponible";

    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return `${age} años`;
  };

  // Formatear la última cita
  const formatLastAppointment = () => {
    const date = new Date();
    return date.toLocaleDateString("es-ES");
  };

  // Formatear fechas para inputs
  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {alertMessage && (
        <div className="mb-6">
          <Alert
            type={alertType}
            message={alertMessage}
            onClose={() => setAlertMessage(null)}
          />
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleGoBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-xl inline-flex items-center"
        >
          ← Volver
        </button>
        <h1 className="text-2xl font-bold">Detalles del Tratamiento</h1>
        <div className="flex space-x-2">
          <button
            onClick={() =>
              router.push(`/physio-management/follow-up/${id}/sessions`)
            }
            className="bg-[#6bc9be] hover:bg-[#5ab8ad] text-white font-semibold py-2 px-4 rounded-xl inline-flex items-center"
          >
            Gestionar Sesiones
          </button>
          <button
            onClick={handleEditToggle}
            className="bg-[#05668d] hover:bg-[#045272] text-white font-semibold py-2 px-4 rounded-xl inline-flex items-center"
          >
            {isEditing ? "Cancelar" : "Editar"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">{patientName}</h1>
          <div className="flex items-center space-x-3">
            <span
              className={`px-3 py-1 rounded-full text-white ${
                treatment.is_active ? "bg-green-500" : "bg-gray-500"
              }`}
            >
              {treatment.is_active ? "Activo" : "Inactivo"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Información del tratamiento
            </h2>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de inicio
                  </label>
                  <input
                    type="date"
                    name="start_time"
                    value={formatDateForInput(
                      editedTreatment.start_time || treatment.start_time
                    )}
                    onChange={handleDateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de fin
                  </label>
                  <input
                    type="date"
                    name="end_time"
                    value={formatDateForInput(
                      editedTreatment.end_time || treatment.end_time
                    )}
                    onChange={handleDateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={
                      editedTreatment.is_active !== undefined
                        ? editedTreatment.is_active
                        : treatment.is_active
                    }
                    onChange={(e) =>
                      setEditedTreatment({
                        ...editedTreatment,
                        is_active: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="is_active"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Tratamiento activo
                  </label>
                </div>

                {saveError && (
                  <div className="text-red-600 text-sm mt-2">{saveError}</div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p>
                  <span className="font-medium">Inicio:</span>{" "}
                  {new Date(treatment.start_time).toLocaleDateString("es-ES")}
                </p>
                <p>
                  <span className="font-medium">Fin:</span>{" "}
                  {new Date(treatment.end_time).toLocaleDateString("es-ES")}
                </p>
              </>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">
              Información del paciente
            </h2>
            <p>
              <span className="font-medium">Nombre:</span> {patientName}
            </p>
            <p>
              <span className="font-medium">Email:</span> {patientEmail}
            </p>
            <p>
              <span className="font-medium">Género:</span> {patientGender}
            </p>
            <p>
              <span className="font-medium">Edad:</span>{" "}
              {calculateAge(patientData?.birth_date)}
            </p>
            <p>
              <span className="font-medium">Última cita:</span>{" "}
              {formatLastAppointment()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Evolución del Paciente</h2>

          {evolutionLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : evolutionError ? (
            <div className="text-center text-red-500 py-8">
              {evolutionError}
            </div>
          ) : evolutionData.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No hay datos de evolución disponibles para este tratamiento.
            </div>
          ) : (
            <div>
              {/* Exercise navigation */}
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={prevExercise}
                  disabled={activeExerciseIndex === 0}
                  className="px-3 py-1 bg-gray-200 rounded-xl disabled:opacity-50"
                >
                  ← Ejercicio anterior
                </button>

                <h4 className="text-md font-medium">
                  {evolutionData[activeExerciseIndex]?.exercise_name ||
                    "Ejercicio"}{" "}
                  ({activeExerciseIndex + 1} de {evolutionData.length}){" - "}
                  {getMetricLabel(
                    evolutionData[activeExerciseIndex]?.metric_type || ""
                  )}
                </h4>

                <button
                  onClick={nextExercise}
                  disabled={activeExerciseIndex >= evolutionData.length - 1}
                  className="px-3 py-1 bg-gray-200 rounded-xl disabled:opacity-50"
                >
                  Siguiente ejercicio →
                </button>
              </div>

              {/* Chart */}
              <div className="h-64 mt-4">
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: getMetricLabel(
                            evolutionData[activeExerciseIndex]?.metric_type ||
                              ""
                          ),
                        },
                      },
                      x: {
                        title: {
                          display: true,
                          text: "Fecha",
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {!isEditing && (
        <div className="mt-6 flex justify-end space-x-4">
          {treatment.is_active ? (
            <button
              className="mb-4 mt-4 px-6 py-3 bg-red-400 text-white font-medium rounded-xl hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 transition-colors duration-200 flex items-center space-x-2"
              onClick={() => handleStatusChange(false)}
            >
              Marcar como Inactivo
            </button>
          ) : (
            <button
              className="mb-8 mt-8 px-6 py-3 bg-[#6bc9be] text-white font-medium rounded-xl hover:bg-[#5ab8ad] focus:outline-none focus:ring-2 focus:ring-[#6bc9be] focus:ring-offset-2 transition-colors duration-200 flex items-center space-x-2"
              onClick={() => handleStatusChange(true)}
            >
              Reactivar Tratamiento
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TreatmentDetailPage;
