"use client";

import { getApiBaseUrl } from "@/utils/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ConfirmAppointmentPage() {
  const { token } = useParams();
  const [message, setMessage] = useState("Validando tu cita...");
  const [messageColor, setMessageColor] = useState("text-green-500");

  useEffect(() => {
    const confirmAppointment = async () => {
      try {
        // Obtenemos el token de autenticación del localStorage
        const authToken = localStorage.getItem("token");

        // Llamamos al endpoint del backend con el token de la cita y el token de autenticación en el header
        const response = await fetch(
          `${getApiBaseUrl()}/api/appointment/confirm-appointment/${token}/`,
          {
            method: "GET",
            credentials: "include", // Envía cookies de sesión si las hubiera
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 401) {
          setMessage(
            "Debes iniciar sesión para confirmar tu cita. Por favor, inicia sesión y vuelve a acceder al enlace de confirmación que recibiste en tu correo."
          );
          setMessageColor("text-blue-500");
          setTimeout(() => {
            window.location.href = "/login";
          }, 3000);
        } else if (!response.ok) {
          const data = await response.json();
          setMessage(`Error: ${data.error}`);
          setMessageColor("text-red-500");
        } else if (response.ok) {
          const data = await response.json();
          setMessage(data.message);
          setMessageColor("text-green-500");
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        }
      } catch (error) {
        setMessage("Ocurrió un error inesperado al confirmar la cita." + error);
        setMessageColor("text-red-500");
      }
    };
    confirmAppointment();
  }, [token]);

  return (
    <div className="p-4 justify-center items-center flex">
      <h1 className={messageColor}>{message}</h1>
    </div>
  );
}