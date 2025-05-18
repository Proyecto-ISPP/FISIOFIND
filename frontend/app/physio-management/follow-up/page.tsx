"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import RestrictedAccess from "@/components/RestrictedAccess";
import { getApiBaseUrl } from "@/utils/api";
import axios from "axios";
import PatientHistoryViewerModal from "@/app/physio-management/follow-up/components/PatientHistoryViewerModal";

// Definir las interfaces para los datos
interface User {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface Patient {
  id?: number;
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

interface Appointment {
  patient_name: string;
  id: number;
  start_time: string;
  end_time: string;
  is_online: boolean;
  service: Record<string, unknown>;
  name: string;
  physiotherapist_name: string;
  status: string;
  patient: number;
}

const SeguimientoPage = () => {
  const router = useRouter();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [filteredTreatments, setFilteredTreatments] = useState<Treatment[]>([]);
  const [allTreatments, setAllTreatments] = useState<Treatment[]>([]); // New state to store all treatments
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [finishedAppointments, setFinishedAppointments] = useState<
    Appointment[]
  >([]);
  const [patientsWithoutTreatment, setPatientsWithoutTreatment] = useState<
    {
      id: number;
      patient_name: string;
      appointmentId: number;
      appointmentDate: string;
    }[]
  >([]);
  const [creatingTreatment, setCreatingTreatment] = useState(false);

  const [patientSearchTerm, setPatientSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState<
    {
      id: number;
      patient_name: string;
      appointmentId: number;
      appointmentDate: string;
    }[]
  >([]);

  const [showDateForm, setShowDateForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<{id: number, appointmentId: number, appointmentEndTime?: string;} | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateError, setDateError] = useState<string | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null
  );

  // Function to handle the initial click on "Crear tratamiento"
  const handleInitiateTreatmentCreation = (appointmentId: number, patientId: number, appointmentEndTime: string) => {
    setSelectedPatient({id: patientId, appointmentId, appointmentEndTime});
    setShowDateForm(true);

    // Set default dates (today for start, 30 days later for end)
    const today = new Date();
    const thirtyDaysLater = new Date(today);
    thirtyDaysLater.setDate(today.getDate() + 30);

    setStartDate(today.toISOString().split("T")[0]);
    setEndDate(thirtyDaysLater.toISOString().split("T")[0]);
    setDateError(null);
  };

  // Function to handle the click on "Historial Clínico"
  const handleViewHistory = (patientId: number) => {
    setSelectedPatientId(patientId);
    setShowHistoryModal(true);
  };

  const handleCloseHistoryModal = () => {
    setShowHistoryModal(false);
    setSelectedPatientId(null);
  };
  // Function to validate dates
  const validateDates = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to beginning of day for comparison

    if (start < today) {
      setDateError(
        "La fecha de inicio no puede ser anterior a la fecha actual."
      );
      return false;
    }

    if (end <= start) {
      setDateError("La fecha de fin debe ser posterior a la fecha de inicio.");
      return false;
    }

    return true;
  };

  // Function to handle form submission
  const handleDateFormSubmit = async () => {
    if (!validateDates() || !selectedPatient) return;

    setCreatingTreatment(true);
    setDateError(null);

    try {
      // First, get the current physiotherapist ID using the correct endpoint
      const physioResponse = await fetch(
        `${getApiBaseUrl()}/api/app_user/current-user/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!physioResponse.ok) {
        throw new Error("Error al obtener información del fisioterapeuta");
      }

      const physioData = await physioResponse.json();
      const physiotherapistId = physioData.physio?.id;

      if (!physiotherapistId) {
        throw new Error("No se pudo obtener el ID del fisioterapeuta");
      }

      // Format dates for API
      let startDateTime: Date;

      if (selectedPatient?.appointmentEndTime) {
      // Usar 1 minuto después de la hora de fin de la cita
      startDateTime = new Date(new Date(selectedPatient.appointmentEndTime).getTime() + 60000);
      } else {
      // Fallback si no se ha pasado appointmentEndTime
      startDateTime = new Date(startDate + "T12:00:00");
      }

      const formattedStartDate = startDateTime.toISOString();
      const formattedEndDate = new Date(endDate + "T12:00:00").toISOString();

      console.log(
        "Creating treatment with dates:",
        formattedStartDate,
        formattedEndDate
      );

      // Create the treatment with user-selected dates
      const response = await fetch(
        `${getApiBaseUrl()}/api/treatments/create/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            physiotherapist: physiotherapistId,
            patient: selectedPatient.id,
            appointment_id: selectedPatient.appointmentId,
            start_time: formattedStartDate,
            end_time: formattedEndDate,
            homework: "",
            is_active: true,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Treatment creation error:", errorData);

        // Handle specific validation errors from backend
        if (errorData.start_time) {
          setDateError(errorData.start_time[0]);
          setCreatingTreatment(false);
          return;
        }

        throw new Error(
          `Error al crear el tratamiento: ${JSON.stringify(errorData)}`
        );
      }

      const data = await response.json();

      // Reset form and redirect to the new treatment page
      setShowDateForm(false);
      setSelectedPatient(null);
      router.push(`/physio-management/follow-up/${data.id}`);
    } catch (error) {
      console.error("Error al crear el tratamiento:", error);
      setError(
        "No se pudo crear el tratamiento. Por favor, inténtalo de nuevo."
      );
    } finally {
      setCreatingTreatment(false);
    }
  };

  // Function to cancel date form
  const handleCancelDateForm = () => {
    setShowDateForm(false);
    setSelectedPatient(null);
    setDateError(null);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);

      if (storedToken) {
        axios
          .get(`${getApiBaseUrl()}/api/app_user/check-role/`, {
            headers: {
              Authorization: "Bearer " + storedToken,
            },
          })
          .then((response) => {
            setUserRole(response.data.user_role);
          })
          .catch((error) => {
            console.error("Error fetching user role:", error);
            setUserRole(null);
          });
      }
    }
  }, [isClient]);

  // Fetch finished appointments for the current physiotherapist
  useEffect(() => {
    const fetchFinishedAppointments = async () => {
      if (!token || userRole !== "physiotherapist") return;

      try {
        console.log("Fetching finished appointments...");
        const response = await fetch(
          `${getApiBaseUrl()}/api/appointment/physio/list/finished/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener las citas finalizadas");
        }

        const data = await response.json();
        console.log("Finished appointments data:", data);

        // Check if data is an array before setting it
        if (Array.isArray(data)) {
          setFinishedAppointments(data);
        } else {
          console.warn("API did not return an array for appointments:", data);
          setFinishedAppointments([]);
        }
      } catch (error) {
        console.error("Error al obtener citas finalizadas:", error);
      }
    };

    fetchFinishedAppointments();
  }, [token, userRole]);

  // Filter appointments to find patients without treatments
  useEffect(() => {
    // Skip if either array is empty
    if (!finishedAppointments.length) {
      console.log("No finished appointments to process");
      return;
    }

    console.log("Processing appointments to find patients without treatments");
    console.log("Finished appointments:", finishedAppointments);
    console.log("All treatments:", allTreatments); // Use allTreatments instead of treatments

    // Get all patient IDs that already have ACTIVE treatments
    const patientsWithActiveTreatments = new Set(
      allTreatments // Use allTreatments instead of treatments
        .filter(treatment => treatment.is_active)
        .map((treatment) => {
          if (
            typeof treatment.patient === "object" &&
            treatment.patient &&
            treatment.patient.id
          ) {
            return treatment.patient.id;
          } else {
            return Number(treatment.patient);
          }
        })
    );

    console.log(
      "Patients with active treatments:",
      Array.from(patientsWithActiveTreatments)
    );

    // Filter appointments to find patients without active treatments
    const patientsWithoutTreatmentData = finishedAppointments
      .filter(
        (appointment) =>
          !patientsWithActiveTreatments.has(Number(appointment.patient))
      )
      .map((appointment) => ({
        id: Number(appointment.patient),
        patient_name: appointment.patient_name?.trim() ? appointment.patient_name : `Paciente sin nombre`,
        appointmentId: appointment.id,
        appointmentDate: new Date(appointment.end_time).toLocaleDateString(
          "es-ES"
        ),
      }));

    console.log("Patients without active treatment:", patientsWithoutTreatmentData);
    setPatientsWithoutTreatment(patientsWithoutTreatmentData);
    setFilteredPatients(patientsWithoutTreatmentData);
  }, [finishedAppointments, allTreatments]);

  useEffect(() => {
    if (!patientSearchTerm) {
      setFilteredPatients(patientsWithoutTreatment);
      return;
    }

    const term = patientSearchTerm.trim();

    // First, look for exact matches (prioritize these)
    const exactMatches = patientsWithoutTreatment.filter(
      (patient) => patient.patient_name === term
    );

    // If we have exact matches, only show those
    if (exactMatches.length > 0) {
      setFilteredPatients(exactMatches);
      return;
    }

    // Otherwise, look for partial matches (case sensitive)
    const partialMatches = patientsWithoutTreatment.filter((patient) =>
      patient.patient_name.includes(term)
    );

    setFilteredPatients(partialMatches);
  }, [patientSearchTerm, patientsWithoutTreatment]);

  const handlePatientSearch = (term: string) => {
    setPatientSearchTerm(term);
  };

  const extractActivePatients = useCallback((treatmentsData: Treatment[]) => {
    const activePatientsMap = new Map<number, Patient>();

    treatmentsData.forEach((treatment) => {
      if (treatment.is_active && typeof treatment.patient === "object") {
        const patientId = (treatment.patient as Patient).id;
        if (patientId && !activePatientsMap.has(patientId)) {
          activePatientsMap.set(patientId, {
            ...(treatment.patient as Patient),
            id: patientId,
          });
        }
      }
    });
  }, []);

  // Cargar tratamientos desde la API
  useEffect(() => {
    const fetchTreatments = async () => {
      // Add early return if not authenticated or not a physiotherapist
      if (!token || userRole !== "physiotherapist") {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Intentamos obtener los datos del backend
        try {
          // First, fetch ALL treatments without any filter
          const allTreatmentsResponse = await fetch(
            `${getApiBaseUrl()}/api/treatments/physio/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!allTreatmentsResponse.ok) {
            throw new Error("Error al obtener todos los tratamientos");
          }

          const allTreatmentsData = await allTreatmentsResponse.json();
          setAllTreatments(allTreatmentsData);

          // Then, fetch filtered treatments if a filter is applied
          let url = `${getApiBaseUrl()}/api/treatments/physio/`;
          if (activeFilter !== null) {
            url += `?is_active=${activeFilter}`;
          }

          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Error al obtener los tratamientos filtrados");
          }

          const data = await response.json();
          setTreatments(data);
          setFilteredTreatments(data);

          // Extraer pacientes únicos con tratamientos activos
          extractActivePatients(data);
        } catch (fetchError) {
          console.error("Error al obtener datos del backend:", fetchError);
        }
      } catch (err) {
        console.error("Error general:", err);
        setError(
          "No se pudieron cargar los tratamientos. Por favor, inténtalo de nuevo."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchTreatments();
  }, [extractActivePatients, activeFilter, token, userRole]);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    let result = [...treatments];

    // Filtrar por estado activo/inactivo
    if (activeFilter !== null) {
      result = result.filter((t) => t.is_active === activeFilter);
    }

    // Filtrar por término de búsqueda (nombre del paciente)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((t) => {
        // Verificar si patient es un objeto y tiene user
        if (typeof t.patient === "object" && t.patient && "user" in t.patient) {
          const patientUser = t.patient.user;
          return (
            patientUser.first_name.toLowerCase().includes(term) ||
            patientUser.last_name.toLowerCase().includes(term)
          );
        }
        return false;
      });
    }

    setFilteredTreatments(result);
  }, [activeFilter, searchTerm, treatments]);

  const handleFilterChange = (isActive: boolean | null) => {
    setActiveFilter(isActive);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCardClick = (id: number) => {
    router.push(`/physio-management/follow-up/${id}`);
  };

  // Función para obtener el nombre del paciente
  const getPatientName = (treatment: Treatment) => {
    if (
      typeof treatment.patient === "object" &&
      treatment.patient &&
      "user" in treatment.patient
    ) {
      return `${treatment.patient.user.first_name} ${treatment.patient.user.last_name}`;
    }
    return `Paciente ID: ${treatment.patient}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!token || !userRole) {
    return (
      <RestrictedAccess message="Necesitas iniciar sesión para acceder a los tratamientos" />
    );
  }

  if (userRole === "patient") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div
          className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full transition-all duration-300"
          style={{ boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)" }}
        >
          <h2
            className="text-2xl font-bold mb-4"
            style={{
              background: "linear-gradient(90deg, #1E5ACD, #3a6fd8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Próximamente
          </h2>
          <p className="text-gray-700 mb-6">
            🚀 La vista de seguimiento para pacientes estará disponible
            próximamente. Estamos trabajando para ofrecerte la mejor experiencia
            posible.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 w-full"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (userRole !== "physiotherapist") {
    return (
      <RestrictedAccess message="Esta sección está reservada para fisioterapeutas." />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-cyan-50 to-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-500 to-blue-600 text-transparent bg-clip-text">
          Seguimiento de Tratamientos
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-6 py-4 rounded-xl mb-8 shadow-sm">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Patients with finished appointments section */}
      {patientsWithoutTreatment.length > 0 && (
        <div className="mb-12 bg-white rounded-2xl shadow-md p-6 bg-opacity-80 backdrop-blur-sm border border-cyan-100">
          <h2 className="text-2xl font-bold mb-4 text-teal-600">
            Pacientes con citas finalizadas
          </h2>
          <p className="text-gray-600 mb-6">
            Estos pacientes han tenido citas finalizadas contigo. Puedes crear un tratamiento para ellos.
          </p>
          <div className="mb-6">
            <label htmlFor="patientSearch" className="block text-lg font-medium text-teal-600 mb-3">
              Buscar paciente
            </label>
            <div className="relative">
              <input
                type="text"
                id="patientSearch"
                placeholder="Nombre del paciente..."
                value={patientSearchTerm}
                onChange={(e) => handlePatientSearch(e.target.value)}
                className="w-full px-5 py-3 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-sm"
              />
              <svg className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => (
              <div key={`${patient.id}-${patient.appointmentId}`} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer border border-cyan-50 transform hover:-translate-y-1">
                <div className="p-3 text-center text-white font-medium bg-gradient-to-r from-teal-400 to-blue-500">
                  Cita finalizada
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-teal-600 mb-4">{patient.patient_name}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 flex items-center">
                        <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Fecha de cita:
                      </span>
                      <span className="text-blue-600 font-medium">{patient.appointmentDate}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-4">
                    <button onClick={() => handleInitiateTreatmentCreation(patient.appointmentId, patient.id)} className="w-full py-2 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-xl hover:opacity-90 transition-all duration-300">
                      Crear tratamiento
                    </button>

                      {/* Botón para abrir el historial clínico */}
                      <button
                        onClick={() => handleViewHistory(patient.id)} // Llama la función para mostrar el modal
                        className="w-full py-2 bg-gradient-to-r from-[#F5A623] to-[#D77F17] text-white rounded-xl hover:opacity-90 transition-all duration-300"
                      >
                        Historial Clínico
                      </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {patientSearchTerm && filteredPatients.length === 0 && (
            <div className="text-center p-4 bg-gray-50 rounded-xl mt-4">
              <p className="text-gray-600">
                No se encontraron pacientes que coincidan con &quot;{patientSearchTerm}&quot;.
              </p>
            </div>
          )}
        </div>
      )}

        {/* Modal for viewing patient history */}
        {showHistoryModal && selectedPatientId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl h-[85vh] overflow-hidden">
              <PatientHistoryViewerModal
                patientId={selectedPatientId}
                token={token!}
                onClose={handleCloseHistoryModal}
              />
            </div>
          </div>
        )}

        {/* Modal for viewing patient history */}
        {showHistoryModal && selectedPatientId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl h-[85vh] overflow-hidden">
              <PatientHistoryViewerModal
                patientId={selectedPatientId}
                token={token!}
                onClose={handleCloseHistoryModal}
              />
            </div>
          </div>
        )}

      {/* Existing treatments section */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8 bg-opacity-80 backdrop-blur-sm border border-cyan-100">
        <h2 className="text-2xl font-bold mb-6 text-teal-600">
          Tratamientos existentes
        </h2>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="w-full md:w-1/2">
            <h2 className="text-lg font-medium text-teal-600 mb-4">
              Filtrar por estado
            </h2>
            <div className="flex space-x-2">
              <button onClick={() => handleFilterChange(null)} className={`px-6 py-3 rounded-xl transition font-medium ${activeFilter === null ? "bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-md" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}>
                Todos
              </button>
              <button onClick={() => handleFilterChange(true)} className={`px-6 py-3 rounded-xl transition font-medium ${activeFilter === true ? "bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-md" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}>
                Activos
              </button>
              <button onClick={() => handleFilterChange(false)} className={`px-6 py-3 rounded-xl transition font-medium ${activeFilter === false ? "bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-md" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}>
                Históricos
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <label htmlFor="search" className="block text-lg font-medium text-teal-600 mb-3">
              Buscar paciente
            </label>
            <div className="relative">
              <input type="text" id="search" placeholder="Nombre del paciente..." value={searchTerm} onChange={(e) => handleSearch(e.target.value)} className="w-full px-5 py-3 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-sm" />
              <svg className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
        {filteredTreatments.length === 0 ? (
          <div className="text-center py-16 bg-white bg-opacity-60 rounded-2xl shadow-sm border border-cyan-100">
            <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 text-lg">
              No se encontraron tratamientos con los filtros seleccionados
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTreatments.map((treatment) => (
              <div key={treatment.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer border border-cyan-50 transform hover:-translate-y-1" onClick={() => handleCardClick(treatment.id)}>
                <div className={`p-3 text-center text-white font-medium ${treatment.is_active ? "bg-gradient-to-r from-teal-400 to-teal-500" : "bg-gradient-to-r from-gray-400 to-gray-500"}`}>
                  {treatment.is_active ? "Tratamiento Activo" : "Tratamiento Histórico"}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-teal-600 mb-4">{getPatientName(treatment)}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 flex items-center">
                        <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Inicio:
                      </span>
                      <span className="text-blue-600 font-medium">{new Date(treatment.start_time).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 flex items-center">
                        <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Fin:
                      </span>
                      <span className="text-blue-600 font-medium">{new Date(treatment.end_time).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 flex items-center">
                        <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Estado:
                      </span>
                      <span className={`font-medium px-3 py-1 rounded-full text-sm ${treatment.is_active ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`}>
                        {treatment.is_active ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-center border-t border-gray-100">
                  <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                    Ver detalles
                    <svg className="h-4 w-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

export default SeguimientoPage;
