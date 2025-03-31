"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";
import { IconHeart, IconHeadphones, IconVideo } from "@tabler/icons-react";

interface RoomDetails {
  code: string;
  created_at: string;
  appointment_start_time: string | null;
}

const VideoCallPage = () => {
  const [rooms, setRooms] = useState<RoomDetails[]>([]);
  const [userRole, setUserRole] = useState<"physio" | "patient" | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, [isClient]);

  useEffect(() => {
    if (token) {
      axios
        .get(`${getApiBaseUrl()}/api/app_user/check-role/`, {
          headers: {
            Authorization: "Bearer " + token,
          },
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
        .catch((error) => {
          console.error("Error fetching user role:", error);
        });
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      axios
        .get(`${getApiBaseUrl()}/api/videocall/my-rooms/`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          setRooms(response.data);
        })
        .catch((error) => {
          console.error("Error fetching rooms:", error);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

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
            Acceso restringido
          </h2>
          <p className="text-gray-700 mb-6">
            🔒 Necesitas iniciar sesión para acceder a las videollamadas.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 w-full"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start p-5 bg-gradient-to-br from-gray-50 to-gray-100"
    >
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

        {rooms.length > 0 ? (
          <div className="space-y-4">
            {rooms.map((room) => {
  const appointmentTime = room.appointment_start_time
    ? new Date(room.appointment_start_time)
    : null;

  const now = new Date();
  const diffInMinutes = appointmentTime
    ? (appointmentTime.getTime() - now.getTime()) / (1000 * 60)
    : null;

  const isActive = diffInMinutes !== null && diffInMinutes <= 30 && diffInMinutes >= -60; // activa desde 30 min antes hasta 60 min después

  return (
    <div
      key={room.code}
      className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <IconVideo className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-gray-800 font-semibold">Sala: {room.code}</p>
            {appointmentTime && (
              <p className="text-sm text-blue-600 font-medium">
                Cita programada: {appointmentTime.toLocaleString()}
              </p>
            )}
            {!isActive && appointmentTime && (
              <p className="text-xs text-gray-400 mt-1">
                La sala se activará 30 minutos antes de la cita
              </p>
            )}
          </div>
        </div>

        <button
          disabled={!isActive}
          onClick={() =>
            isActive
              ? (window.location.href = `/videocalls/${room.code}`)
              : null
          }
          className={`font-semibold py-2 px-6 rounded-xl transition-all duration-200 w-full md:w-auto ${
            isActive
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
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
    </div>
  );
};

export default VideoCallPage;
