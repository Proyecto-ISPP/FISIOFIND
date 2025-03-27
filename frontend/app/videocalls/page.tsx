"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";
import { IconHeart, IconHeadphones } from "@tabler/icons-react";
import { GradientButton } from "@/components/ui/gradient-button";

interface RoomDetails {
  code: string;
  created_at: string;
}

const VideoCallPage = () => {
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
  const [userRole, setUserRole] = useState<"physio" | "patient" | null>("physio");
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
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full transition-all duration-300"
             style={{ boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)" }}>
          <h2 className="text-2xl font-bold mb-4"
              style={{ 
                background: "linear-gradient(90deg, #1E5ACD, #3a6fd8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
            Acceso restringido
          </h2>
          <p className="text-gray-700 mb-6">
            🔒 Necesitas iniciar sesión para acceder a las videollamadas.
          </p>
          <button
            onClick={() => (window.location.href = '/login')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 w-full"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5" 
         style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)" }}>
      
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full transition-all duration-300"
               style={{ boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)" }}>
            <h3 className="text-xl font-bold mb-4"
                style={{ 
                  background: "linear-gradient(90deg, #1E5ACD, #3a6fd8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
              Aviso
            </h3>
            <p className="mb-6 text-gray-700">{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-6 rounded-xl transition-all duration-200"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <div className="bg-white w-full max-w-[480px] rounded-3xl shadow-xl p-10 transition-all duration-300"
           style={{ boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)" }}>
        
        <div className="text-center mb-9">
          <h1 className="text-3xl font-bold mb-2"
              style={{ 
                background: "linear-gradient(90deg, #1E5ACD, #3a6fd8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
            Videollamadas
          </h1>
        </div>
        
        <h2 className="text-lg font-semibold text-gray-700 mb-8">Rol detectado:</h2>
        
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <div 
              className={`block bg-gray-50 border-2 ${userRole === "physio" ? "border-[#1E5ACD] bg-gradient-to-b from-blue-50 to-[#e8effa] shadow-md" : "border-gray-200"} rounded-2xl p-4 text-center transition-all duration-200 flex flex-col items-center h-full`}
              style={userRole === "physio" ? {boxShadow: "0 4px 12px rgba(30, 90, 205, 0.15)"} : {}}
            >
              <div className="w-[50px] h-[50px] rounded-full bg-[#e8effa] flex items-center justify-center mb-3">
                <IconHeart className="text-[#1E5ACD]" size={24} />
              </div>
              <div className="font-semibold text-gray-700 mb-1 text-sm">Fisioterapeuta</div>
              <div className="text-xs text-gray-500">(Host)</div>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <div 
              className={`block bg-gray-50 border-2 ${userRole === "patient" ? "border-[#05AC9C] bg-gradient-to-b from-[#e6f7f6] to-[#e6f7f6] shadow-md" : "border-gray-200"} rounded-2xl p-4 text-center transition-all duration-200 flex flex-col items-center h-full`}
              style={userRole === "patient" ? {boxShadow: "0 4px 12px rgba(5, 172, 156, 0.15)"} : {}}
            >
              <div className="w-[50px] h-[50px] rounded-full bg-[#e6f7f6] flex items-center justify-center mb-3">
                <IconHeadphones className="text-[#05AC9C]" size={24} />
              </div>
              <div className="font-semibold text-gray-700 mb-1 text-sm">Paciente</div>
              <div className="text-xs text-gray-500">(Visualización)</div>
            </div>
          </div>
        </div>
        
        {userRole === "patient" && (
          <div className="mb-6 relative">
            <input
              type="text"
              placeholder="Ingresa el código de la sala"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full py-[18px] px-5 text-base border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-[#1E5ACD] focus:shadow-[0_0_0_4px_rgba(30,90,205,0.1)]"
            />
          </div>
        )}
        
        <div className="space-y-4">
          {userRole === "physio" && (
            <button 
              onClick={createRoom}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Crear Sala
            </button>
          )}
          
          {userRole === "patient" && (
            <button 
              onClick={joinRoom}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Unirse a la Sala
            </button>
          )}
        </div>
        
        {roomCode && (
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-gray-700 text-center">
              Código de la sala: <span className="font-semibold text-blue-700">{roomCode}</span>
            </p>
          </div>
        )}
        
        {roomDetails && (
          <div className="mt-6 p-4 bg-teal-50 rounded-xl border border-teal-100">
            <p className="text-gray-700 text-center mb-1">
              Unido a la Sala: <span className="font-semibold text-teal-700">{roomDetails.code}</span>
            </p>
            <p className="text-gray-700 text-center text-sm">
              Creada en: <span className="font-semibold">{roomDetails.created_at}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCallPage;
