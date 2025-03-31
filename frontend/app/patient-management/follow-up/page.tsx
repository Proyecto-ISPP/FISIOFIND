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
              loadTreatments(storedToken);
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mis Tratamientos</h1>

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

      {/* Existing treatments section */}
      <div>
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-lg font-semibold mb-2">Filtrar por estado</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleFilterChange(null)}
                  className={`px-4 py-2 rounded-xl transition ${
                    activeFilter === null
                      ? "bg-[#6bc9be] text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => handleFilterChange(true)}
                  className={`px-4 py-2 rounded-xl transition ${
                    activeFilter === true
                      ? "bg-[#6bc9be] text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  Activos
                </button>
                <button
                  onClick={() => handleFilterChange(false)}
                  className={`px-4 py-2 rounded-xl transition ${
                    activeFilter === false
                      ? "bg-[#6bc9be] text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  Históricos
                </button>
              </div>
            </div>

            <div className="w-full md:w-1/3">
              <label
                htmlFor="search"
                className="block text-lg font-semibold mb-2"
              >
                Buscar fisioterapeuta
              </label>
              <input
                type="text"
                id="search"
                placeholder="Nombre del fisioterapeuta..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {filteredTreatments.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">
              No se encontraron tratamientos con los filtros seleccionados
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredTreatments.map((treatment) => (
              <div
                key={treatment.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
                onClick={() => handleCardClick(treatment.id)}
              >
                <div
                  className={`p-1 text-center text-white ${
                    treatment.is_active ? "bg-green-500" : "bg-gray-500"
                  }`}
                >
                  {treatment.is_active ? "Activo" : "Histórico"}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">
                    {getPhysiotherapistName(treatment)}
                  </h3>

                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Inicio</span>
                      <span>
                        {new Date(treatment.start_time).toLocaleDateString(
                          "es-ES"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Fin</span>
                      <span>
                        {new Date(treatment.end_time).toLocaleDateString(
                          "es-ES"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado</span>
                      <span
                        className={
                          treatment.is_active
                            ? "text-green-500"
                            : "text-gray-500"
                        }
                      >
                        {treatment.is_active ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>

                  {treatment.homework && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2">Deberes asignados:</h4>
                      <p className="text-gray-700 text-sm line-clamp-2">
                        {treatment.homework}
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 px-6 py-3 flex justify-center">
                  <button className="text-blue-500 hover:underline">
                    Ver detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientFollowUpPage;