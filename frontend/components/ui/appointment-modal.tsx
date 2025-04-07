import axios from "axios";
import { CalendarProps } from "@/lib/definitions";
import AlternativeSelector from "./alternative-selector";
import { getApiBaseUrl } from "@/utils/api";
import { formatDateFromIso } from "@/lib/utils";
//import { formatDateTime } from "@/utils/date"; // Import formatDateTime from the appropriate utility file
import { useState, useEffect, useRef } from "react"; // Agregar useRef y useEffect
import StarRatingDisplay from "./StarRatingDisplay";
import { BsStarFill } from "react-icons/bs";
import "./LoadingStar.css";
import EditableStarRatingDisplay from "./EditableStarRatingDisplay";
import AppointmentComment from "./AppointmentComment";

// Función para formatear fechas
const formatDateTime = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("es-ES", options);
};

const isEditable = (endDate: string | undefined): boolean => {
  if (!endDate) return false;
  const end = new Date(endDate);
  const now = new Date();
  const diffInMs = now.getTime() - end.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  return diffInDays <= 7;
};

interface AppointmentModalProps {
  selectedEvent: CalendarProps | null;
  currentRole: string;
  setSelectedEvent: (event: CalendarProps | null) => void;
  setEditionMode: (mode: boolean) => void;
  isClient: boolean;
  token: string | null;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  selectedEvent,
  currentRole,
  setSelectedEvent,
  setEditionMode,
  isClient,
  token,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [modalMaxHeight, setModalMaxHeight] = useState("85vh"); // Estado para la altura máxima
  const modalContentRef = useRef<HTMLDivElement>(null); // Referencia para medir el contenido
  const [selectedEventRating, setSelectedEventRating] = useState({
    id: undefined,
    comment: "",
    score: undefined,
  }); // Estado para almacenar la valoración seleccionada
  const [selectedEventRatingScore, setSelectedEventRatingScore] = useState(0); // Estado para almacenar la puntuación de la valoración seleccionada
  const [loadingRating, setLoadingRating] = useState(true);
  const [input, setInput] = useState({ comment: "", rating: 0 });
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [tempComment, setTempComment] = useState("");

  // Efecto para ajustar la altura máxima del modal
  useEffect(() => {
    fetchRating();
    const handleResize = () => {
      setModalMaxHeight(`${window.innerHeight * 0.85}px`);
    };
    handleResize(); // Ejecutar al montar
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (selectedEventRating.comment) {
      setTempComment(selectedEventRating.comment);
    }
  }, [selectedEventRating.comment]);

  const closeModal = () => {
    setRating(tempComment);
    setIsClosing(true);
    setTimeout(() => {
      setSelectedEvent(null); // Close modal after animation
      setEditionMode(false); // Close edition mode after animation
    }, 200); // Match the duration of the transition
  };

  const fetchRating = async () => {
    if (selectedEvent) {
      setLoadingRating(true);
      const response = await fetch(
        `${getApiBaseUrl()}/api/appointment_ratings/appointment/${
          selectedEvent.id
        }/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setSelectedEventRating(data);
      if (data.score) {
        setSelectedEventRatingScore(data.score);
      }
      setLoadingRating(false);
    }
  };

  const handleChangeRating = (val) => {
    setSelectedEventRating((prev) => ({
      ...prev,
      score: val,
    }));
  };

  const setRating = async (tempComment) => {
    if (!selectedEvent) return;
    if (!isEditable(selectedEvent.end) ) return;

    // Determinar si estamos editando o creando
    const isEditing = selectedEventRating?.id != null; // Si ya existe un ID, estamos editando, si no, es creación.

    // La URL ahora solo contiene el appointment_id
    const url = `${getApiBaseUrl()}/api/appointment_ratings/appointment/${
      selectedEvent.id
    }/edit/`;

    try {
      // Si estamos editando, usamos PUT, si no, POST
      const method = isEditing ? "PUT" : "POST"; // Usamos PUT para editar y POST para crear

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          score: selectedEventRating.score,
          comment: tempComment,
        }),
      });

      // Manejo de la respuesta
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "Error al guardar la valoración");
      }

      const data = await response.json();

      // Actualizamos el estado con los datos de la valoración
      setSelectedEventRating(data);

      if (data.score) {
        setSelectedEventRatingScore(data.score);
      }
    } catch (error) {
      console.error("Error al guardar la valoración:", error);
    }
  };

  const handleDownloadInvoice = async (
    appointment_id: string | undefined,
    token: string | null
  ) => {
    try {
      const response = await fetch(
        `${getApiBaseUrl()}/api/payments/invoices/pdf/?appointment_id=${appointment_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || "No se pudo descargar la factura"}`);
        return;
      }

      // Convertir la respuesta en un blob (archivo descargable)
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice_${appointment_id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error al descargar la factura:", error);
      alert("Error al descargar la factura.");
    }
  };

  const getStatusBadge = () => {
    if (!selectedEvent) return null;

    const statusClasses = {
      booked: "bg-yellow-500 text-yellow-50",
      confirmed: "bg-green-500 text-green-50",
      finished: "bg-gray-500 text-gray-50",
      canceled: "bg-red-500 text-red-50",
    };

    const statusText = {
      booked: "Reservada",
      confirmed: "Confirmada",
      finished: "Finalizada",
      canceled: "Cancelada",
    };

    const statusClass =
      (selectedEvent.status &&
        statusClasses[selectedEvent.status as keyof typeof statusClasses]) ||
      "bg-gray-300 text-gray-700";
    const statusLabel =
      (selectedEvent.status &&
        statusText[selectedEvent.status as keyof typeof statusText]) ||
      "Desconocido";

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}
      >
        {statusLabel}
      </span>
    );
  };

  if (!selectedEvent) return null;
  const deleteEvent = (selectedEvent: CalendarProps | null) => {
    if (!selectedEvent) return;
    if (isClient) {
      if (token) {
        // let url = ""
        // if (currentRole === "patient") {
        //   url = `${getApiBaseUrl()}/api/payments/${selectedEvent.id}/cancel/`;
        // } else if (currentRole === "physiotherapist") {
        //   url = `${getApiBaseUrl()}/api/payments/${selectedEvent.id}/cancel-physio/`;
        // }
        // axios
        //   .post(
        //     url,
        //     {},
        //     {
        //       headers: {
        //         Authorization: "Bearer " + token,
        //       },
        //     }

        //   ).then((response) =>
        //     {
        // const status = response.status;
        // console.log(status);

        axios
          .delete(
            `${getApiBaseUrl()}/api/appointment/delete/${selectedEvent.id}/`,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          )
          .then((response) => {
            const status = response.status;
            if (status == 204) {
              alert("La cita fue cancelada correctamente.");
              setSelectedEvent(null);
              window.location.reload();
            }
          })
          .catch((error) => {
            if (error.response) {
              const msg = error.response.data.error;
              alert(msg);
            }
          });

        // })
        // .catch((error) => {
        //   if (error.response) {
        //     const msg = error.response.data.error;
        //     alert(msg);
        //   }
        // });
      }
    }
  };

  const handleSelection = (date: string, startTime: string) => {
    const [startTimeSplit, endTimeSplit] = startTime.split(" - ");
    const startDateTime = new Date(
      `${date}T${startTimeSplit}:00Z`
    ).toISOString();
    const endDateTime = new Date(`${date}T${endTimeSplit}:00Z`).toISOString();

    axios
      .put(
        `${getApiBaseUrl()}/api/appointment/update/${
          selectedEvent?.id
        }/accept-alternative/`,
        {
          start_time: startDateTime,
          end_time: endDateTime,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((response) => {
        alert("La cita se actualizó correctamente.");
        console.log("Cita actualizada correctamente", response);
        setSelectedEvent(null);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error en la actualización de la cita:", error);
        alert("Hubo un problema con la conexión. Intenta nuevamente.");
      });
  };

  const confirmAppointment = () => {
    if (!selectedEvent || !token) return;

    axios
      .put(
        `${getApiBaseUrl()}/api/appointment/update/${
          selectedEvent.id
        }/confirm/`,
        {
          status: "confirmed",
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((response) => {
        const message = response.data.message;
        alert(message);
        setSelectedEvent(null);
        window.location.reload();
      })
      .catch((error) => {
        if (error.response) {
          const msg = error.response.data.error;
          alert(msg);
        }
      });
  };

  const isMoreThan48HoursAway = () => {
    if (!selectedEvent?.start) return false;

    const eventDate = new Date(selectedEvent.start);
    const now = new Date();

    const diffInHours =
      (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60); // Convierte la diferencia de milisegundos a horas
    return diffInHours > 48;
  };

  return (
    <div
      className={`z-50 fixed inset-0 flex items-center justify-center ${
        isClosing ? "opacity-0" : "opacity-100"
      } transition-opacity duration-200 overflow-hidden`}
      onClick={closeModal}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-sm"></div>

      {/* Modal Card - Con altura máxima y scroll */}
      <div
        className={`bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 relative z-50 flex flex-col ${
          isClosing ? "scale-95" : "scale-100"
        } transition-all duration-200`}
        onClick={(event) => event.stopPropagation()}
        style={{ maxHeight: modalMaxHeight }}
      >
        {/* Header - Fijo */}
        <div className="relative flex-shrink-0">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 pt-12 pb-6">
            <div className="flex justify-between items-start">
              <h2
                id="modal-title"
                className="text-white text-xl font-medium truncate max-w-xs"
              >
                {selectedEvent.title}
              </h2>
              {getStatusBadge()}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mt-4 text-teal-50">
                  <svg
                    className="w-5 h-5 mr-2 flex-shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span className="text-sm capitalize">
                    {formatDateFromIso(selectedEvent.start)}
                  </span>
                </div>

                {selectedEvent.end && (
                  <div className="flex items-center mt-2 text-teal-50">
                    <svg
                      className="w-5 h-5 mr-2 flex-shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span className="text-sm">
                      Duración:{" "}
                      {selectedEvent.end && selectedEvent.start
                        ? Math.round(
                            (new Date(selectedEvent.end).getTime() -
                              new Date(selectedEvent.start).getTime()) /
                              (1000 * 60)
                          )
                        : 0}{" "}
                      minutos
                    </span>
                  </div>
                )}
              </div>
              {selectedEvent.status == "finished"  && currentRole === "patient" && (
                <div>
                  <div className="flex items-center mt-4 text-teal-50">
                    <EditableStarRatingDisplay
                      rating={selectedEventRating.score}
                      editable={isEditable(selectedEvent.end)}
                      loading={loadingRating}
                      onRatingChange={handleChangeRating}
                    />
                  </div>
                  {selectedEvent.status === "finished"  && currentRole === "patient" && isEditable(selectedEvent.end) && (
                    <div className="flex items-center mt-4 text-teal-50 justify-end">
                      <svg
                        height={"20px"}
                        viewBox="0 0 1920 1920"
                        xmlns="http://www.w3.org/2000/svg"
                        fill={isEditingComment ? "#b0b8c8" : "currentColor"}
                        stroke="currentColor"
                        onClick={() => setIsEditingComment(!isEditingComment)}
                        style={{ cursor: "pointer" }}
                      >
                        <path
                          d="M1662.178 0v1359.964h-648.703l-560.154 560.154v-560.154H0V0h1662.178ZM1511.07 151.107H151.107v1057.75h453.321v346.488l346.489-346.488h560.154V151.107ZM906.794 755.55v117.53H453.32V755.55h453.473Zm302.063-302.365v117.529H453.32V453.185h755.536Z"
                          fill-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Download invoice */}
          {currentRole === "patient" && (
            <button
              className="absolute top-3 right-[3.25rem] bg-teal-400 bg-opacity-20 hover:bg-opacity-30 text-white p-1.5 rounded-full transition-colors duration-150"
              onClick={() => handleDownloadInvoice(selectedEvent.id, token)}
              aria-label="Descargar"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M7 18H6.2C5.0799 18 4.51984 18 4.09202 17.782C3.71569 17.5903 3.40973 17.2843 3.21799 16.908C3 16.4802 3 15.9201 3 14.8V10.2C3 9.0799 3 8.51984 3.21799 8.09202C3.40973 7.71569 3.71569 7.40973 4.09202 7.21799C4.51984 7 5.0799 7 6.2 7H7M17 18H17.8C18.9201 18 19.4802 18 19.908 17.782C20.2843 17.5903 20.5903 17.2843 20.782 16.908C21 16.4802 21 15.9201 21 14.8V10.2C21 9.07989 21 8.51984 20.782 8.09202C20.5903 7.71569 20.2843 7.40973 19.908 7.21799C19.4802 7 18.9201 7 17.8 7H17M7 11H7.01M17 7V5.4V4.6C17 4.03995 17 3.75992 16.891 3.54601C16.7951 3.35785 16.6422 3.20487 16.454 3.10899C16.2401 3 15.9601 3 15.4 3H8.6C8.03995 3 7.75992 3 7.54601 3.10899C7.35785 3.20487 7.20487 3.35785 7.10899 3.54601C7 3.75992 7 4.03995 7 4.6V5.4V7M17 7H7M8.6 21H15.4C15.9601 21 16.2401 21 16.454 20.891C16.6422 20.7951 16.7951 20.6422 16.891 20.454C17 20.2401 17 19.9601 17 19.4V16.6C17 16.0399 17 15.7599 16.891 15.546C16.7951 15.3578 16.6422 15.2049 16.454 15.109C16.2401 15 15.9601 15 15.4 15H8.6C8.03995 15 7.75992 15 7.54601 15.109C7.35785 15.2049 7.20487 15.3578 7.10899 15.546C7 15.7599 7 16.0399 7 16.6V19.4C7 19.9601 7 20.2401 7.10899 20.454C7.20487 20.6422 7.35785 20.7951 7.54601 20.891C7.75992 21 8.03995 21 8.6 21Z"
                    stroke="#ffffff"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </g>
              </svg>
            </button>
          )}

          {/* Close button */}
          <button
            className="absolute top-3 right-3 bg-teal-400 bg-opacity-20 hover:bg-opacity-30 text-white p-1.5 rounded-full transition-colors duration-150"
            onClick={closeModal}
            aria-label="Cerrar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content - Con scroll */}
        <div ref={modalContentRef} className="p-6 overflow-y-auto flex-grow">
          {(isEditingComment && currentRole === "patient") ? (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-4">
                Incluye un comentario a tu valoración (Opcional)
              </h3>
              <textarea
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md"
                value={tempComment}
                onChange={(e) => setTempComment(e.target.value)}
              />
            </div>
          ) : (
            <>
              {/* Description */}
              {selectedEvent.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Detalles
                  </h3>
                  <p className="text-gray-700">{selectedEvent.description}</p>
                </div>
              )}

              {/* Service info if available */}
              {selectedEvent.service && selectedEvent.service.type && (
                <div className="mb-6 bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Servicio
                    </span>
                    <span className="text-sm text-gray-700">
                      {selectedEvent.service.type}
                    </span>
                  </div>
                  {selectedEvent.service.duration > 0 && (
                    <div className="flex justify-between mt-1">
                      <span className="text-sm font-medium text-gray-500">
                        Duración
                      </span>
                      <span className="text-sm text-gray-700">
                        {selectedEvent.service.duration} minutos
                      </span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Questionary responses - Solo visible para fisioterapeutas */}
          {currentRole === "physiotherapist" &&
            selectedEvent.service?.questionaryResponses &&
            Object.keys(selectedEvent.service.questionaryResponses).length >
              0 && (
              <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-medium text-teal-700 mb-3 pb-2 border-b border-gray-200">
                  Información del paciente
                </h3>

                <div className="space-y-4">
                  {/* Sección de datos personales comunes */}
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Datos básicos
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {/* Mostrar peso con unidad */}
                      {selectedEvent.service.questionaryResponses.peso && (
                        <div className="flex justify-between py-1.5 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-600">
                            Peso:
                          </span>
                          <span className="text-sm text-gray-800">
                            {selectedEvent.service.questionaryResponses.peso} kg
                          </span>
                        </div>
                      )}

                      {/* Mostrar altura con unidad */}
                      {selectedEvent.service.questionaryResponses.altura && (
                        <div className="flex justify-between py-1.5 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-600">
                            Altura:
                          </span>
                          <span className="text-sm text-gray-800">
                            {selectedEvent.service.questionaryResponses.altura}{" "}
                            cm
                          </span>
                        </div>
                      )}

                      {/* Mostrar edad con unidad */}
                      {selectedEvent.service.questionaryResponses.edad && (
                        <div className="flex justify-between py-1.5 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-600">
                            Edad:
                          </span>
                          <span className="text-sm text-gray-800">
                            {selectedEvent.service.questionaryResponses.edad}{" "}
                            años
                          </span>
                        </div>
                      )}

                      {/* Nivel de actividad física */}
                      {selectedEvent.service.questionaryResponses
                        .actividad_fisica && (
                        <div className="flex justify-between py-1.5 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-600">
                            Nivel de actividad:
                          </span>
                          <span className="text-sm text-gray-800">
                            {
                              selectedEvent.service.questionaryResponses
                                .actividad_fisica
                            }
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Motivo de consulta - con más espacio ya que suele ser texto largo */}
                  {selectedEvent.service.questionaryResponses
                    .motivo_consulta && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                        Motivo de consulta
                      </h4>
                      <div className="bg-white p-3 rounded border border-gray-100">
                        <p className="text-sm text-gray-800">
                          {
                            selectedEvent.service.questionaryResponses
                              .motivo_consulta
                          }
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Otras preguntas personalizadas */}
                  {Object.entries(
                    selectedEvent.service.questionaryResponses
                  ).filter(
                    ([key]) =>
                      ![
                        "peso",
                        "altura",
                        "edad",
                        "actividad_fisica",
                        "motivo_consulta",
                      ].includes(key)
                  ).length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                        Información adicional
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {Object.entries(
                          selectedEvent.service.questionaryResponses
                        )
                          .filter(
                            ([key]) =>
                              ![
                                "peso",
                                "altura",
                                "edad",
                                "actividad_fisica",
                                "motivo_consulta",
                              ].includes(key)
                          )
                          .map(([key, value], index) => (
                            <div
                              key={index}
                              className="py-1.5 border-b border-gray-100 last:border-0"
                            >
                              <div className="text-sm font-medium text-gray-600 mb-1">
                                {key}:
                              </div>
                              <div className="text-sm text-gray-800 break-words">
                                {String(value)}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* Alternatives selector */}
          {selectedEvent.alternatives && currentRole === "patient" && (
            <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Opciones alternativas
              </h3>
              <div className="w-full flex justify-center">
                <AlternativeSelector
                  alternatives={selectedEvent.alternatives}
                  onConfirmSelection={handleSelection}
                />
              </div>
            </div>
          )}

          {/* Action buttons - Ahora van dentro del área con scroll */}
          {selectedEvent.status !== "finished" && (
            <div className="flex flex-wrap gap-3 mt-6 justify-end">
              {currentRole === "physiotherapist" &&
                selectedEvent.status === "booked" &&
                isMoreThan48HoursAway() && (
                  <button
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 flex items-center"
                    onClick={confirmAppointment}
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Confirmar cita
                  </button>
                )}

              {currentRole === "physiotherapist" && isMoreThan48HoursAway() && (
                <button
                  className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 flex items-center"
                  onClick={() => setEditionMode(true)}
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Modificar cita
                </button>
              )}

              {selectedEvent &&
                new Date(selectedEvent.start) > new Date() &&
                (currentRole === "physiotherapist" ||
                  (currentRole === "patient" && isMoreThan48HoursAway())) && (
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 flex items-center"
                    onClick={() => deleteEvent(selectedEvent)}
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                    Cancelar cita
                  </button>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { AppointmentModal };
