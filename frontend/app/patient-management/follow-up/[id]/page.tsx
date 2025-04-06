"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RestrictedAccess from "@/components/RestrictedAccess";
import { getApiBaseUrl } from "@/utils/api";
import { Film, ArrowLeft, File } from "lucide-react";

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

const TreatmentDetailPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
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
              loadTreatment(storedToken, params.id);
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
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={handleGoBack}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
      >
        <ArrowLeft className="mr-2" size={20} />
        Volver a mis tratamientos
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

      {treatment && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div
            className={`p-2 text-center text-white text-lg font-semibold ${treatment.is_active ? "bg-green-500" : "bg-gray-500"}`}
          >
            {treatment.is_active
              ? "Tratamiento Activo"
              : "Tratamiento Histórico"}
          </div>

          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">
              Tratamiento con {getPhysiotherapistName(treatment)}
            </h1>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Información General
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="mb-3 flex flex-col md:flex-row md:items-center">
                  <span className="font-medium text-gray-700 mb-1 md:mb-0 md:mr-2">
                    Fisioterapeuta:
                  </span>
                  <span>{getPhysiotherapistName(treatment)}</span>
                </div>
                <div className="mb-3 flex flex-col md:flex-row md:items-center">
                  <span className="font-medium text-gray-700 mb-1 md:mb-0 md:mr-2">
                    Fecha de inicio:
                  </span>
                  <span>{formatDate(treatment.start_time)}</span>
                </div>
                <div className="mb-3 flex flex-col md:flex-row md:items-center">
                  <span className="font-medium text-gray-700 mb-1 md:mb-0 md:mr-2">
                    Fecha de finalización:
                  </span>
                  <span>{formatDate(treatment.end_time)}</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center">
                  <span className="font-medium text-gray-700 mb-1 md:mb-0 md:mr-2">
                    Estado:
                  </span>
                  <span
                    className={
                      treatment.is_active ? "text-green-600" : "text-gray-600"
                    }
                  >
                    {treatment.is_active ? "Activo" : "Finalizado"}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-medium text-gray-700 text-sm sm:text-base">
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
                <label className="switch self-start sm:self-center">
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={handleToggleNotifications}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div className="mt-8 flex space-x-4">
              {/* Botón Ver Sesiones */}
              <button
                onClick={handleViewSessions}
                className="w-full md:w-auto px-6 py-3 bg-[#05668d] text-white rounded-xl hover:bg-[#045a7c] transition flex items-center justify-center"
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
              <button
                onClick={handleViewVideos
                }
                className="bg-[#6bc9be] hover:bg-[#5ab8ad] text-white font-semibold py-2 px-4 rounded-xl inline-flex items-center"
              >
                <Film className="mr-2" size={20} />
                Ver Videos
              </button>
              <button
                onClick={handleViewVideos
                }
                className="bg-[#6bc9be] hover:bg-[#5ab8ad] text-white font-semibold py-2 px-4 rounded-xl inline-flex items-center"
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
