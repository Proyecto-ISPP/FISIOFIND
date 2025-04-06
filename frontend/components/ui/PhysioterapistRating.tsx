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
    } else {
      backgroundGradient =
        "linear-gradient(to right, #d73c3c 0%, #f04545 100%)";
    }
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
            {ratingData ? ratingData.rating.toFixed(2) : "--"}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center text-black">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={closeModal}
          ></div>
          {/* Contenido del modal */}
          <div className="relative bg-white rounded-lg p-6 w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh] flex flex-col">
            {/* Cabecera fija */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Valoraciones</h2>
              <button
                className="text-gray-600 hover:text-gray-900"
                onClick={closeModal}
              >
                Cerrar
              </button>
            </div>

            {/* Opciones de ordenación */}
            <div className="mb-4">
              <label className="mr-2">Ordenar por:</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                className="border rounded p-1"
              >
                <option value="chronological">Cronológico</option>
                <option value="scoreAsc">Puntuación (menor a mayor)</option>
                <option value="scoreDesc">Puntuación (mayor a menor)</option>
              </select>
            </div>

            {/* Lista de valoraciones scrollable */}
            <div
              className="grid gap-4 overflow-auto"
              style={{ maxHeight: "calc(90vh - 160px)" }}
            >
              {sortRatings(ratingsList).map((rating) => {
                // Determinar la fecha a mostrar: si se editó, mostramos updated_at con la etiqueta "(editado)"
                const createdDate = new Date(rating.created_at);
                const updatedDate = rating.updated_at
                  ? new Date(rating.updated_at)
                  : null;

                const dateToShow =
                  updatedDate && updatedDate.getTime() !== createdDate.getTime()
                    ? `(editado) ${updatedDate.toLocaleDateString()}`
                    : createdDate.toLocaleDateString();

                return (
                  <div
                    key={rating.id}
                    className="border rounded-lg p-4 shadow-sm flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{rating.patient_name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {dateToShow}
                        </span>
                        <button
                          className="self-end p-1 text-red-600 hover:text-red-700"
                          onClick={() =>
                            console.log(`Reportar valoración ${rating.id}`)
                          }
                          title="Reportar valoración"
                        >
                          <svg
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16,2 C16.2652165,2 16.5195704,2.10535684 16.7071068,2.29289322 L21.7071068,7.29289322 C21.8946432,7.4804296 22,7.73478351 22,8 L22,15 C22,15.2339365 21.9179838,15.4604694 21.7682213,15.6401844 L16.7682213,21.6401844 C16.5782275,21.868177 16.2967798,22 16,22 L8,22 C7.73478351,22 7.4804296,21.8946432 7.29289322,21.7071068 L2.29289322,16.7071068 C2.10535684,16.5195704 2,16.2652165 2,16 L2,8 C2,7.73478351 2.10535684,7.4804296 2.29289322,7.29289322 L7.29289322,2.29289322 C7.4804296,2.10535684 7.73478351,2 8,2 L16,2 Z M15.5857864,4 L8.41421356,4 L4,8.41421356 L4,15.5857864 L8.41421356,20 L15.5316251,20 L20,14.6379501 L20,8.41421356 L15.5857864,4 Z M12,16 C12.5522847,16 13,16.4477153 13,17 C13,17.5522847 12.5522847,18 12,18 C11.4477153,18 11,17.5522847 11,17 C11,16.4477153 11.4477153,16 12,16 Z M12,6 C12.5522847,6 13,6.44771525 13,7 L13,13 C13,13.5522847 12.5522847,14 12,14 C11.4477153,14 11,13.5522847 11,13 L11,7 C11,6.44771525 11.4477153,6 12,6 Z"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {Number(rating.score).toFixed(1)}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-star text-amber-500"
                      >
                        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-medium">Servicio: </span>
                      <span>{rating.service_name}</span>
                    </div>
                    <div>
                      <p className="text-sm">{rating.comment}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PhysioterapistRating;
