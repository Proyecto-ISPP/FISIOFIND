import { getApiBaseUrl } from "@/utils/api";
import React, { useEffect, useState } from "react";

// Interfaces para la valoración promedio y para cada valoración
interface RatingData {
  rating: number;
  ratings_count: number;
}

interface SingleRating {
  id: number;
  // Se asume que el serializer devuelve al menos estos campos:
  patient_name: string;
  score: number;
  created_at: string;
  updated_at: string | null;
  service_name: string;
  comment: string;
  is_reported: boolean; // Añadido para el estado de reportado
}

type SortOrder = "chronological" | "scoreAsc" | "scoreDesc";

interface PhysioterapistRatingProps {
  physioterapistId: number | string;
}

const PhysioterapistRating: React.FC<PhysioterapistRatingProps> = ({
  physioterapistId,
}) => {
  const [ratingData, setRatingData] = useState<RatingData | null>(null);
  const [ratingsList, setRatingsList] = useState<SingleRating[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>("chronological");

  // Fetch promedio de rating
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchRatingData = async () => {
      try {
        const response = await fetch(
          `${getApiBaseUrl()}/api/appointment_ratings/average/`,
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
        setRatingData({
          rating: parseFloat(data.rating),
          ratings_count: data.ratings_count,
        });
      } catch (error) {
        console.error("Error fetching average rating:", error);
      }
    };

    fetchRatingData();
  }, []);

  const reportRating = async (ratingId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(
        `${getApiBaseUrl()}/api/appointment_ratings/report/${ratingId}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("Rating reported successfully.");
    } catch (error) {
      console.error("Error reporting rating:", error);
    }
  };

  // Función para abrir el modal y cargar las valoraciones detalladas
  const openModal = async () => {
    setModalOpen(true);
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(
        `${getApiBaseUrl()}/api/appointment_ratings/${physioterapistId}/`,
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
      const data: SingleRating[] = await response.json();
      setRatingsList(data);
      console.log("Ratings list:", data);
    } catch (error) {
      console.error("Error fetching ratings list:", error);
    }
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setModalOpen(false);
  };

  // Función para ordenar la lista según el criterio seleccionado
  const sortRatings = (ratings: SingleRating[]): SingleRating[] => {
    switch (sortOrder) {
      case "scoreAsc":
        return [...ratings].sort((a, b) => a.score - b.score);
      case "scoreDesc":
        return [...ratings].sort((a, b) => b.score - a.score);
      case "chronological":
      default:
        return [...ratings].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }
  };

  // Gradiente de fondo según el rating promedio
  let backgroundGradient =
    "linear-gradient(to right, #4e8d07 0%, #5ba30b 100%)";
  if (ratingData) {
    if (ratingData.rating >= 4) {
      backgroundGradient =
        "linear-gradient(to right, #4e8d07 0%, #5ba30b 100%)";
    } else if (ratingData.rating >= 2.5) {
      backgroundGradient =
        "linear-gradient(to right, #a78916 0%, #b99612 100%)";
    } else if (ratingData.rating < 2.5) {
      backgroundGradient =
        "linear-gradient(to right, #d73c3c 0%, #f04545 100%)";
    } else {
      backgroundGradient =
        "linear-gradient(to right, #999999 0%, #cccccc 100%)";
    }
    console.log(ratingData);
  }

  return (
    <>
      {/* Tarjeta resumen que abre el modal al hacer click */}
      <div
        onClick={openModal}
        style={{
          background: backgroundGradient,
          paddingInline: "2rem",
          paddingBlock: "0.75rem",
          borderRadius: "50px",
          boxShadow: "rgba(0, 0, 0, 0.5) 0px 0px 11px 1px",
          cursor: "pointer",
        }}
      >
        <div
          className="flex justify-center items-center gap-1"
          style={{ borderBottom: "1px solid #ffffff3d" }}
        >
          <span style={{ fontSize: "x-large" }}>
            {ratingData && !Number.isNaN(ratingData.rating)
              ? ratingData.rating.toFixed(2)
              : "--"}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-star w-4 h-4 text-amber-500 fill-amber-500"
            style={{
              width: "1.75rem",
              height: "1.75rem",
              marginLeft: "0.5rem",
              marginBottom: "0.25rem",
            }}
          >
            <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
          </svg>
        </div>
        <span className="text-xs mt-2">
          {ratingData
            ? `(${ratingData.ratings_count} valoraciones)`
            : "Cargando..."}
        </span>
      </div>
      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop con transición */}
          <div
            className="absolute inset-0 bg-black opacity-40 transition-opacity duration-300"
            onClick={closeModal}
          ></div>
          {/* Contenido del modal */}
          <div className="relative bg-white rounded-xl shadow-2xl p-6 w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh] flex flex-col transform transition-all duration-300">
            {/* Cabecera fija */}
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Valoraciones</h2>
              <button
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                onClick={closeModal}
                title="Cerrar"
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  className="w-6 h-6 text-gray-600"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Opciones de ordenación */}
            <div className="mb-4 flex items-baseline gap-4">
              <label className="text-gray-700 mr-2">Ordenar por:</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-72"
              >
                <option value="chronological">Fecha</option>
                <option value="scoreAsc">Puntuación (menor a mayor)</option>
                <option value="scoreDesc">Puntuación (mayor a menor)</option>
              </select>
            </div>

            {/* Lista de valoraciones scrollable */}
            <div
              className="overflow-y-auto pr-2 space-y-4"
              style={{ maxHeight: "calc(90vh - 180px)" }}
            >
              {ratingsList.length > 0 &&
                sortRatings(ratingsList).map((rating) => {
                  // Determinar la fecha a mostrar: si se editó, mostramos updated_at con la etiqueta "(editado)"
                  const createdDate = new Date(rating.created_at);
                  const updatedDate = rating.updated_at
                    ? new Date(rating.updated_at)
                    : null;

                  const dateToShow =
                    updatedDate &&
                    updatedDate.getTime() !== createdDate.getTime()
                      ? `(editado) ${updatedDate.toLocaleDateString()}`
                      : createdDate.toLocaleDateString();

                  return (
                    <div
                      key={rating.id}
                      className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-gray-50"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-gray-800">
                          {rating.patient_name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            {dateToShow}
                          </span>
                          <button
                            className="p-1 text-red-600 hover:text-red-700"
                            onClick={() => reportRating(rating.id)}
                            title="Reportar valoración"
                          >
                            <svg
                              className={`w-5 h-5 ${
                                rating.is_reported
                                  ? "fill-red-600 text-white"
                                  : "fill-black text-red-600"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16,2 C16.265,2 16.52,2.105 16.707,2.293 L21.707,7.293 C21.895,7.48 22,7.735 22,8 L22,15 C22,15.234 21.918,15.46 21.768,15.64 L16.768,21.64 C16.578,21.868 16.297,22 16,22 L8,22 C7.735,22 7.48,21.895 7.293,21.707 L2.293,16.707 C2.105,16.52 2,16.265 2,16 L2,8 C2,7.735 2.105,7.48 2.293,7.293 L7.293,2.293 C7.48,2.105 7.735,2 8,2 L16,2 Z M15.586,4 L8.414,4 L4,8.414 L4,15.586 L8.414,20 L15.532,20 L20,14.638 L20,8.414 L15.586,4 Z M12,16 C12.552,16 13,16.448 13,17 C13,17.552 12.552,18 12,18 C11.448,18 11,17.552 11,17 C11,16.448 11.448,16 12,16 Z M12,6 C12.552,6 13,6.448 13,7 L13,13 C13,13.552 12.552,14 12,14 C11.448,14 11,13.552 11,13 L11,7 C11,6.448 11.448,6 12,6 Z"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-700">
                          {Number(rating.score).toFixed(1)}
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          style={{ marginBottom: "3px" }}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-amber-500"
                        >
                          <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                        </svg>
                      </div>
                      <div className="mb-1">
                        <span className="font-medium text-gray-700">
                          Servicio:
                        </span>{" "}
                        <span className="text-gray-600">
                          {rating.service_name}
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-700 text-sm">
                          {rating.comment}
                        </p>
                      </div>
                    </div>
                  );
                })}
              {ratingsList.length === 0 && (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">
                    No hay valoraciones disponibles.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PhysioterapistRating;
