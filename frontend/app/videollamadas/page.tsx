"use client";

import { useState } from "react";
import axios from "axios";

interface RoomDetails {
  code: string;
  created_at: string;
}

const VideoCallPage = () => {
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
  const [userRole, setUserRole] = useState<"physio" | "patient" | null>(null);

  // Estados para el modal
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const createRoom = async () => {
    if (!userRole) {
      alert("Selecciona un rol antes de crear la sala.");
      return;
    }

    // Bloqueamos la creación si es "patient"
    if (userRole === "patient") {
      setModalMessage("Lo sentimos, los pacientes no pueden crear salas.");
      setShowModal(true);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/videocall/create-room/");
      setRoomCode(response.data.code);
      window.location.href = `/videollamadas/${response.data.code}?role=${userRole}`;
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const joinRoom = async () => {
    if (!userRole) {
      alert("Selecciona un rol antes de unirte a la sala.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8000/api/videocall/join-room/${code}/`);
      setRoomDetails(response.data);
      window.location.href = `/videollamadas/${response.data.code}?role=${userRole}`;
    } catch (error) {
      console.error("Error joining room:", error);
      setRoomDetails(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      {/* Modal */}
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

        {/* Selección de rol */}
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Selecciona tu rol:
          </h3>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="physio"
                checked={userRole === "physio"}
                onChange={() => setUserRole("physio")}
                className="accent-blue-500"
              />
              <span>Fisioterapeuta (Host)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="patient"
                checked={userRole === "patient"}
                onChange={() => setUserRole("patient")}
                className="accent-green-500"
              />
              <span>Paciente (Visualización)</span>
            </label>
          </div>
        </div>

        {/* Crear Sala */}
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

        {/* Unirse a Sala */}
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
      </div>
    </div>
  );
};

export default VideoCallPage;
