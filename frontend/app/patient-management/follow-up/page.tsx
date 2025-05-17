"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RestrictedAccess from "@/components/RestrictedAccess";
import { getApiBaseUrl } from "@/utils/api";

// Define interfaces for the data
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

const PatientFollowUpPage = () => {
  const router = useRouter();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [filteredTreatments, setFilteredTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      setError("Debe iniciar sesión para acceder a esta página");
      setLoading(false);
      return;
    }

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
          loadTreatments(storedToken);
        }
      })
      .catch((err) => {
        console.error("Error al verificar el rol:", err);
        setError("Error al verificar el rol del usuario");
        setLoading(false);
      });
  }, [isClient]);

  const loadTreatments = async (authToken: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${getApiBaseUrl()}/api/treatments/patient/`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar los tratamientos");
      }

      const data = await response.json();
      setTreatments(data);
      setFilteredTreatments(data);
    } catch (err) {
      console.error("Error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar los tratamientos"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (isActive: boolean | null) => {
    setActiveFilter(isActive);
    if (isActive === null) {
      setFilteredTreatments(
        treatments.filter((treatment) =>
          getPhysiotherapistName(treatment)
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredTreatments(
        treatments.filter(
          (treatment) =>
            treatment.is_active === isActive &&
            getPhysiotherapistName(treatment)
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
      );
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (activeFilter === null) {
      setFilteredTreatments(
        treatments.filter((treatment) =>
          getPhysiotherapistName(treatment)
            .toLowerCase()
            .includes(term.toLowerCase())
        )
      );
    } else {
      setFilteredTreatments(
        treatments.filter(
          (treatment) =>
            treatment.is_active === activeFilter &&
            getPhysiotherapistName(treatment)
              .toLowerCase()
              .includes(term.toLowerCase())
        )
      );
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

  const handleCardClick = (treatmentId: number) => {
    router.push(`/patient-management/follow-up/${treatmentId}`);
  };

  if (!isClient) {
    return null;
  }

  if (userRole && userRole !== "patient") {
    return <RestrictedAccess message="Solo los pacientes pueden acceder a esta página" />;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-cyan-50 to-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-500 to-blue-600 text-transparent bg-clip-text">
          Mis Tratamientos
        </h1>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-6 py-4 rounded-xl mb-8 shadow-sm">
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-md p-6 mb-8 bg-opacity-80 backdrop-blur-sm border border-cyan-100">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="w-full md:w-1/2">
            <h2 className="text-lg font-medium text-teal-600 mb-4">
              Filtrar por estado
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => handleFilterChange(null)}
                className={`px-6 py-3 rounded-xl transition font-medium ${
                  activeFilter === null
                    ? "bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-md"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => handleFilterChange(true)}
                className={`px-6 py-3 rounded-xl transition font-medium ${
                  activeFilter === true
                    ? "bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-md"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                Activos
              </button>
              <button
                onClick={() => handleFilterChange(false)}
                className={`px-6 py-3 rounded-xl transition font-medium ${
                  activeFilter === false
                    ? "bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-md"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                Históricos
              </button>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <label
              htmlFor="search"
              className="block text-lg font-medium text-teal-600 mb-3"
            >
              Buscar fisioterapeuta
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                placeholder="Nombre del fisioterapeuta..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-5 py-3 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-sm"
              />
              <svg 
                className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" 
                xmlns="http://www.w3.org/2000/svg" 
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
            </div>
          </div>
        </div>
      </div>

      {filteredTreatments.length === 0 ? (
        <div className="text-center py-16 bg-white bg-opacity-60 rounded-2xl shadow-sm border border-cyan-100">
          <svg 
            className="mx-auto h-16 w-16 text-gray-300 mb-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <p className="text-gray-500 text-lg">
            No se encontraron tratamientos con los filtros seleccionados
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTreatments.map((treatment) => (
            <div
              key={treatment.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer border border-cyan-50 transform hover:-translate-y-1"
              onClick={() => handleCardClick(treatment.id)}
            >
              <div
                className={`p-3 text-center text-white font-medium ${
                  treatment.is_active
                    ? "bg-gradient-to-r from-teal-400 to-teal-500"
                    : "bg-gradient-to-r from-gray-400 to-gray-500"
                }`}
              >
                {treatment.is_active ? "Tratamiento Activo" : "Tratamiento Histórico"}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-teal-600 mb-4">
                  {getPhysiotherapistName(treatment)}{" "}
                  <span className="text-gray-500 font-normal">(Fisioterapeuta)</span>
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 flex items-center">
                      <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Inicio:
                    </span>
                    <span className="text-blue-600 font-medium">
                      {new Date(treatment.start_time).toLocaleDateString(
                        "es-ES",
                        { day: "numeric", month: "short", year: "numeric" }
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 flex items-center">
                      <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Fin:
                    </span>
                    <span className="text-blue-600 font-medium">
                      {new Date(treatment.end_time).toLocaleDateString(
                        "es-ES",
                        { day: "numeric", month: "short", year: "numeric" }
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 flex items-center">
                      <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Estado:
                    </span>
                    <span
                      className={`font-medium px-3 py-1 rounded-full text-sm ${
                        treatment.is_active
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
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

export default PatientFollowUpPage;