"use client";

import { getApiBaseUrl } from "@/utils/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ConfirmAlternativePage() {
  const { token } = useParams();
  const [message, setMessage] = useState("Validando tu selección...");
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);


  useEffect(() => {
    // Extraemos los parámetros start_time y end_time de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const start_time = urlParams.get("start_time");
    const end_time = urlParams.get("end_time");

    if (start_time && end_time) {
      setStartTime(start_time);
      setEndTime(end_time);
    } else {
      setMessage("Error: Parámetros de tiempo no válidos.");
    }
  }, [token]);

const confirmAppointment = async () => {
  const userToken = localStorage.getItem("token");
  try {
    const response = await fetch(
      `${getApiBaseUrl()}/api/appointment/confirm-alternative/${token}/?start_time=${startTime}&end_time=${endTime}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 401) {
      setMessage(
        "Debes iniciar sesión para confirmar tu cita. Por favor, inicia sesión y vuelve a acceder al enlace de confirmación que recibiste en tu correo."
      );
      setTimeout(() => {
        window.location.href = "/login";
      }, 4000);
      return;
    } else if (!response.ok) {
      const data = await response.json();
      setMessage(`Error: ${data.error}`);
    } else if (response.ok) {
      const data = await response.json();
      setMessage(data.message);
      setTimeout(() => {
        window.location.href = "/my-appointments";
      }, 2000);
    }
  } catch (error) {
    setMessage("Ocurrió un error inesperado al confirmar la cita." + error);
  }
};
    

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-lg text-center">
      <h1 className="text-xl font-semibold text-azulOscuroTitulos mb-4">
        {message}
      </h1>
      <h2 className="text-lg font-medium text-texto mb-2">
        ¿Deseas confirmar la cita con la siguiente franja horaria?
      </h2>

      <div className="mb-4">
        <p className="text-gray-700 font-medium">
          Inicio: <span className="font-bold text-gray-900">{startTime}</span>
        </p>
        <p className="text-gray-700 font-medium">
          Fin: <span className="font-bold text-gray-900">{endTime}</span>
        </p>
      </div>

      <button
        onClick={confirmAppointment}
        className="bg-azul hover:bg-logo1 text-white font-bold py-2 px-6 rounded-lg shadow-md transform transition-all duration-300 ease-in-out hover:scale-105"
      >
        Confirmar Cita
      </button>
    </div>
  );
}
