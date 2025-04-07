"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";
import { IconHeart, IconHeadphones, IconVideo } from "@tabler/icons-react";
import RestrictedAccess from "@/components/RestrictedAccess";
import RatingForm from "@/components/ui/RatingForm";

interface RoomDetails {
  code: string;
  created_at: string;
  appointment_start_time: string | null;
  is_test_room?: boolean;
  patient_name?: string;
  physiotherapist_name?: string;
}

const VideoCallPage = () => {
  const [rooms, setRooms] = useState<RoomDetails[]>([]);
  const [userRole, setUserRole] = useState<"physio" | "patient" | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomDetails | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Marca que estamos en el cliente
    // (Nota: "use client" ya se declaró en la cabecera)
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) {
      axios
        .get(`${getApiBaseUrl()}/api/app_user/check-role/`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          const roleFromAPI = response.data.user_role;
          if (roleFromAPI === "physiotherapist") {
            setUserRole("physio");
          } else if (roleFromAPI === "patient") {
            setUserRole("patient");
          } else {
            setUserRole(null);
          }
        })
        .catch((error) => console.error("Error fetching user role:", error));
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      axios
        .get(`${getApiBaseUrl()}/api/videocall/my-rooms/`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => setRooms(response.data))
        .catch((error) => console.error("Error fetching rooms:", error))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const toggleRatingModal = () => {
    setShowModal(!showModal);
  };

  const createTestRoom = async () => {
    try {
      const response = await axios.post(
        `${getApiBaseUrl()}/api/videocall/create-test-room/`,
        {},
        { headers: { Authorization: "Bearer " + token } }
      );
      const { code, detail } = response.data;
      if (response.status === 200 && detail) {
        alert("🔧 Ya tienes una sala de prueba activa. Redirigiéndote...");
      }
      window.location.href = `/videocalls/${code}`;
    } catch (error) {
      console.error("Error creando sala de prueba:", error);
      alert("Hubo un problema al crear la sala de prueba.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-blue-200 mb-4"></div>
          <div className="h-4 w-24 bg-blue-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!token || !userRole) {
    return (
      <RestrictedAccess message="Necesitas iniciar sesión para acceder a las videollamadas" />
    );
  }

  const hasTestRoom = rooms.some((room) => room.is_test_room);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-5 bg-gradient-to-br from-gray-50 to-gray-100">
      <br />
      <br />
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-xl p-10 mb-8 transition-all duration-300">
        <div className="text-center mb-9">
          <h1
            className="text-3xl font-bold mb-2"
            style={{
              background: "linear-gradient(90deg, #1E5ACD, #3a6fd8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Videollamadas
          </h1>
        </div>

        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <div
              className={`block border-2 ${
                userRole === "physio"
                  ? "border-[#1E5ACD] bg-gradient-to-b from-blue-50 to-[#e8effa] shadow-md"
                  : "border-gray-200 bg-gray-50"
              } rounded-2xl p-4 text-center transition-all duration-200 flex flex-col items-center h-full`}
              style={
                userRole === "physio"
                  ? { boxShadow: "0 4px 12px rgba(30, 90, 205, 0.15)" }
                  : {}
              }
            >
              <div className="w-[50px] h-[50px] rounded-full bg-[#e8effa] flex items-center justify-center mb-3">
                <IconHeart className="text-[#1E5ACD]" size={24} />
              </div>
              <div className="font-semibold text-gray-700 mb-1 text-sm">
                Fisioterapeuta
              </div>
              <div className="text-xs text-gray-500">(Host)</div>
            </div>
          </div>

          <div className="flex-1 relative">
            <div
              className={`block border-2 ${
                userRole === "patient"
                  ? "border-[#05AC9C] bg-gradient-to-b from-[#e6f7f6] to-[#e6f7f6] shadow-md"
                  : "border-gray-200 bg-gray-50"
              } rounded-2xl p-4 text-center transition-all duration-200 flex flex-col items-center h-full`}
              style={
                userRole === "patient"
                  ? { boxShadow: "0 4px 12px rgba(5, 172, 156, 0.15)" }
                  : {}
              }
            >
              <div className="w-[50px] h-[50px] rounded-full bg-[#e6f7f6] flex items-center justify-center mb-3">
                <IconHeadphones className="text-[#05AC9C]" size={24} />
              </div>
              <div className="font-semibold text-gray-700 mb-1 text-sm">
                Paciente
              </div>
              <div className="text-xs text-gray-500">(Visualización)</div>
            </div>
          </div>
        </div>

        {userRole === "physio" && !hasTestRoom && (
          <div className="mb-8 text-center bg-blue-50 border border-blue-200 p-6 rounded-2xl shadow-sm">
            <p className="text-gray-700 mb-4 text-sm md:text-base">
              Puedes crear una <strong>sala de prueba</strong> para
              familiarizarte con las herramientas antes de una consulta real.
            </p>
            <button
              onClick={createTestRoom}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow transition-all duration-200"
            >
              Crear Sala de Prueba
            </button>
          </div>
        )}

        {rooms.length > 0 ? (
          <div className="space-y-4">
            {[...rooms]
              .sort((a, b) => {
                // La test room va primero
                if (a.is_test_room && !b.is_test_room) return -1;
                if (!a.is_test_room && b.is_test_room) return 1;
                return 0;
              })
              .map((room) => {
                const appointmentTime = room.appointment_start_time
                  ? new Date(room.appointment_start_time)
                  : null;

                const now = new Date();
                const diffInMinutes = appointmentTime
                  ? (appointmentTime.getTime() - now.getTime()) / (1000 * 60)
                  : null;

                const isActive =
                  room.is_test_room ||
                  (diffInMinutes !== null &&
                    diffInMinutes <= 120 &&
                    diffInMinutes >= -120);

                return (
                  <div key={room.code} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <IconVideo className="text-blue-600" size={24} />
                        </div>
                        <div>
                          <p className="text-gray-800 font-semibold">
                            {room.is_test_room && (
                              <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2 py-1 rounded-md mr-2">
                                TEST
                              </span>
                            )}
                            Sala: {room.code}
                          </p>
                          {room.patient_name &&
                            userRole === "physio" &&
                            !room.is_test_room && (
                              <p className="text-sm text-gray-600">
                                Paciente:{" "}
                                <span className="font-medium">
                                  {room.patient_name}
                                </span>
                              </p>
                            )}
                          {room.physiotherapist_name &&
                            userRole === "patient" &&
                            !room.is_test_room && (
                              <p className="text-sm text-gray-600">
                                Fisioterapeuta:{" "}
                                <span className="font-medium">
                                  {room.physiotherapist_name}
                                </span>
                              </p>
                            )}
                          {appointmentTime && (
                            <p className="text-sm text-blue-600 font-medium">
                              Cita programada:{" "}
                              {appointmentTime.toLocaleString()}
                            </p>
                          )}
                          {!isActive && appointmentTime && (
                            <p className="text-xs text-gray-400 mt-1">
                              La sala se activará momentos antes de la cita
                            </p>
                          )}
                        </div>
                      </div>

                      {isActive && userRole === "patient" && (
                        <button
                          onClick={() => {
                            setSelectedRoom(room);
                            toggleRatingModal();
                          }}
                          className="font-semibold py-2 px-6 rounded-xl transition-all duration-200 w-full md:w-auto bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white"                          >
                          Valorar Cita
                        </button>
                      )}

                      <button
                        disabled={!isActive}
                        onClick={() =>
                          isActive
                            ? (window.location.href = `/videocalls/${room.code}`)
                            : null
                        }
                        className={`font-semibold py-2 px-6 rounded-xl transition-all duration-200 w-full md:w-auto ${
                          isActive
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {isActive ? "Acceder" : "Inactiva"}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-8">
            No tienes videollamadas pendientes por ahora.
          </p>
        )}
      </div>

      {/* Modal global para RatingForm */}
      {showModal && userRole === "patient" && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={toggleRatingModal}
          ></div>
          {/* Contenedor del modal */}
          <div className="absolute">
            <RatingForm closeModal={toggleRatingModal} roomCode={selectedRoom.code} />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCallPage;
