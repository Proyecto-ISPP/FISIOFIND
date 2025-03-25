"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";

interface RoomDetails {
  code: string;
  created_at: string;
}

const VideoCallPage = () => {
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
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
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const createRoom = async () => {
    if (userRole !== "physio") {
      setModalMessage("Lo sentimos, solo los fisioterapeutas pueden crear salas.");
      setShowModal(true);
      return;
    }

    try {
      const response = await axios.post(
        `${getApiBaseUrl()}/api/videocall/create-room/`,
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setRoomCode(response.data.code);
      window.location.href = `/videocalls/${response.data.code}`;
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const joinRoom = async () => {
    if (!code || code.trim() === "") {
      alert("Por favor, ingresa un código de sala válido.");
      return;
    }

    try {
      const response = await axios.get(
        `${getApiBaseUrl()}/api/videocall/join-room/${code}/`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setRoomDetails(response.data);
      window.location.href = `/videocalls/${response.data.code}`;
    } catch (error) {
      console.error("Error joining room:", error);
      setRoomDetails(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }
  
  if (!token || !userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Acceso restringido</h2>
          <p className="text-gray-700 mb-4">
            🔒 Necesitas iniciar sesión para acceder a las videollamadas.
          </p>
          <button
            onClick={() => (window.location.href = '/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }
  
  


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Aviso</h3>
            <p className="mb-4">{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Videollamadas
        </h2>

        <div className="mb-4 text-center text-gray-700">
          <p>
            Rol detectado:{" "}
            <span className="font-semibold capitalize">
              {userRole === "physio"
                ? "Fisioterapeuta (Host)"
                : userRole === "patient"
                ? "Paciente (Visualización)"
                : "Desconocido"}
            </span>
          </p>
        </div>

        {/* Crear Sala */}
        {userRole === "physio" && (
          <div className="mb-4 flex flex-col items-center">
            <button
              onClick={createRoom}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg w-full"
            >
              Crear Sala
            </button>
            {roomCode && (
              <p className="text-gray-600 mt-2">
                Código de la sala:{" "}
                <span className="font-semibold">{roomCode}</span>
              </p>
            )}
          </div>
        )}

        {/* Unirse a Sala */}
        {userRole === "patient" && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Ingresa el código de la sala"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={joinRoom}
              className="mt-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg w-full"
            >
              Unirse a la Sala
            </button>
            {roomDetails && (
              <div className="text-gray-600 mt-2 text-center">
                <p>
                  Unido a la Sala:{" "}
                  <span className="font-semibold">{roomDetails.code}</span>
                </p>
                <p>
                  Creada en:{" "}
                  <span className="font-semibold">{roomDetails.created_at}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCallPage;
