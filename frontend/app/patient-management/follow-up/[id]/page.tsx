"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import RestrictedAccess from "@/components/RestrictedAccess";
import { getApiBaseUrl } from "@/utils/api";
import { Film, ArrowLeft, File, Calendar, Clock, Bell, User, CheckCircle } from "lucide-react";

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
  notifications_enabled: boolean;
}

const TreatmentDetailPage = ({ params: paramsPromise }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const params = use(paramsPromise); // Unwrap the params Promise
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

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
              loadTreatment(storedToken, params.id); // Access unwrapped params
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
  }, [isClient, params.id]); // Access unwrapped params

  const loadTreatment = async (authToken: string, treatmentId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${getApiBaseUrl()}/api/treatments/${treatmentId}/`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error al cargar el tratamiento");
      }

      const data = await response.json();
      setTreatment(data);
      setNotificationsEnabled(data.notifications_enabled);
    } catch (err) {
      console.error("Error:", err);
      setError(
        err instanceof Error ? err.message : "Error al cargar el tratamiento"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleNotifications = async () => {
    const storedToken = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${getApiBaseUrl()}/api/treatments/${
          treatment?.id
        }/toggle-notifications/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify({
            notifications_enabled: !notificationsEnabled,
          }),
        }
      );

      if (response.ok) {
        setNotificationsEnabled((prev) => !prev);
      } else {
        console.error("Error al actualizar las notificaciones");
      }
    } catch (error) {
      console.error("Error al cambiar las notificaciones:", error);
    }
  };

  const getPhysiotherapistName = (treatment: Treatment): string => {
    if (
      typeof treatment.physiotherapist === "object" &&
      treatment.physiotherapist &&
      treatment.physiotherapist.user
    ) {
      const physio = treatment.physiotherapist;
      return `${physio.user.first_name} ${physio.user.last_name}`;
    }
    return "Fisioterapeuta";
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleViewSessions = () => {
    router.push(`/patient-management/follow-up/${params.id}/sessions`);
  };

  const handleViewVideos = () => {
    router.push(`/patient-management/follow-up/${params.id}/videos`);
  };

  const handleViewFiles = () => {
    router.push(`/patient-management/follow-up/${params.id}/files`);
  };

  const handleGoBack = () => {
    router.push("/patient-management/follow-up");
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
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-cyan-50 to-white min-h-screen">
      <button
        onClick={handleGoBack}
        className="mb-6 flex items-center text-teal-600 hover:text-teal-800 transition-colors duration-200 font-medium"
      >
        <ArrowLeft className="mr-2" size={20} />
        Volver a mis tratamientos
      </button>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-6 py-4 rounded-xl mb-8 shadow-sm">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {treatment && (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-cyan-100">
          <div
            className={`p-3 text-center text-white text-lg font-medium ${
              treatment.is_active 
                ? "bg-gradient-to-r from-teal-400 to-teal-500" 
                : "bg-gradient-to-r from-gray-400 to-gray-500"
            }`}
          >
            {treatment.is_active
              ? "Tratamiento Activo"
              : "Tratamiento Histórico"}
          </div>

          <div className="p-8">
            <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-teal-500 to-blue-600 text-transparent bg-clip-text">
              Tratamiento con {getPhysiotherapistName(treatment)}
            </h1>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-teal-600 flex items-center">
                <User className="mr-2" size={20} />
                Información General
              </h2>
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <div className="bg-teal-100 p-2 rounded-lg mr-4">
                      <User size={20} className="text-teal-600" />
                    </div>
                    <div>
                      <span className="block text-sm text-gray-500 mb-1">Fisioterapeuta</span>
                      <span className="text-lg font-medium text-gray-800">{getPhysiotherapistName(treatment)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-teal-100 p-2 rounded-lg mr-4">
                      <Calendar size={20} className="text-teal-600" />
                    </div>
                    <div>
                      <span className="block text-sm text-gray-500 mb-1">Fecha de inicio</span>
                      <span className="text-lg font-medium text-gray-800">{formatDate(treatment.start_time)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-teal-100 p-2 rounded-lg mr-4">
                      <Clock size={20} className="text-teal-600" />
                    </div>
                    <div>
                      <span className="block text-sm text-gray-500 mb-1">Fecha de finalización</span>
                      <span className="text-lg font-medium text-gray-800">{formatDate(treatment.end_time)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-teal-100 p-2 rounded-lg mr-4">
                      <CheckCircle size={20} className="text-teal-600" />
                    </div>
                    <div>
                      <span className="block text-sm text-gray-500 mb-1">Estado</span>
                      <span className={`text-lg font-medium ${
                        treatment.is_active ? "text-green-600" : "text-gray-600"
                      }`}>
                        {treatment.is_active ? "Activo" : "Finalizado"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <Bell size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {notificationsEnabled
                        ? "Recordatorios de ejercicio activados"
                        : "Recordatorios de ejercicio desactivados"}
                    </p>
                    <p className="text-sm font-normal text-gray-500 mt-1">
                      {notificationsEnabled
                        ? "Recibirás recordatorios por email para no olvidarte de seguir tu tratamiento."
                        : "Activa esta opción si deseas recibir recordatorios por email para no olvidarte de seguir tu tratamiento."}
                    </p>
                  </div>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer self-start sm:self-center">
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={handleToggleNotifications}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Botón Ver Sesiones */}
              <button
                onClick={handleViewSessions}
                className="px-6 py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition flex items-center justify-center font-medium"
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Ver Sesiones
              </button>
              
              {/* Botón Ver Videos */}
              <button
                onClick={handleViewVideos}
                className="px-6 py-4 bg-gradient-to-r from-teal-400 to-teal-500 text-white rounded-xl hover:shadow-lg transition flex items-center justify-center font-medium"
              >
                <Film className="mr-2" size={20} />
                Ver Videos
              </button>
              
              {/* Botón Adjuntar Archivos */}
              <button
                onClick={handleViewFiles}
                className="px-6 py-4 bg-gradient-to-r from-teal-400 to-teal-500 text-white rounded-xl hover:shadow-lg transition flex items-center justify-center font-medium"
              >
                <File className="mr-2" size={20} />
                Adjuntar Archivos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreatmentDetailPage;