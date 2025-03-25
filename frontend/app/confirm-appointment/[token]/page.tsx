"use client";

import { getApiBaseUrl } from "@/utils/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function ConfirmAppointmentPage() {
  const { token } = useParams();
  const [message, setMessage] = useState("Validando tu cita...");

  useEffect(() => {
    const confirmAppointment = async () => {
      try {
        // Llamamos al endpoint del backend con el token
        const response = await fetch(
          `${getApiBaseUrl()}/api/appointment/confirm/${token}/`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          const data = await response.json();
          setMessage(`Error: ${data.error || "No se pudo confirmar la cita"}`);
        } else {
          const data = await response.json();
          setMessage(data.message || "¡Cita aceptada con éxito!");
          window.location.href = "/"; 
        }
      } catch (error) {
        setMessage("Ocurrió un error inesperado al confirmar la cita.", error);	
      }
    };

    confirmAppointment();
  }, [token]);

  return (
    <div className="p-4 justify-center items-center flex text-green-500">
      <h1>{message}</h1>
    </div>
  );
}
