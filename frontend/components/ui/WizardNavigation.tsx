// components/WizardNavigation.tsx
"use client";
import { useAppointment } from "@/context/appointmentContext";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/utils/api";

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  goToNext: () => void;
  goToPrevious: () => void;
  token: string | null;
  isClient: boolean;
}

const WizardNavigation: React.FC<WizardNavigationProps> = ({
  currentStep,
  totalSteps,
  goToNext,
  goToPrevious,
  token,
  isClient,
}) => {
  const [currentRole, setCurrentRole] = useState("");
  const { state } = useAppointment();
  const appointmentData = state.appointmentData;
  const router = useRouter();

  // Obtener el rol actual del usuario mediante una petición de axios
  useEffect(() => {
    if (isClient) {
      if (token) {
        axios
          .get(`${getApiBaseUrl()}/api/app_user/check-role/`, {
            headers: {
              Authorization: "Bearer " + token,
            },
          })
          .then((response) => {
            setCurrentRole(response.data.user_role);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      }
    }
  }, [isClient, token]);

  const createAppointment = () => {
    if (currentRole === "patient") {
      // Si el rol es 'patient', se procede a confirmar la cita
      if (isClient) {
        if (token) {
          axios
            .post(
              `${getApiBaseUrl()}/api/appointment/patient/`,
              {
                start_time: appointmentData?.start_time,
                end_time: appointmentData?.end_time,
                is_online: appointmentData?.is_online,
                service: appointmentData?.service,
                physiotherapist: appointmentData?.physiotherapist,
                status: "booked",
                alternatives: "",
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((response) => {
              alert("La cita se realizó correctamente.");
              console.log("Cita realizada correctamente", response);
              // Redirigir a la pestaña 'mis-citas'
              router.push("/my-appointments");
            })
            .catch((error) => {
              console.error("Error en la creación de la cita:", error);
              alert("Hubo un problema con la conexión. Intenta nuevamente.");
            });
        } 
      }
    } else {
      // Si el rol no es 'patient', se muestra un mensaje y se redirige a la página de registro de paciente
      alert("Debe registrarse como paciente para confirmar la cita.");
      router.push("/login");
    }
  };

  return (
    <div className="flex space-x-4 mt-6">
      <button
        onClick={goToPrevious}
        className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50 hover:bg-logo2"
        disabled={currentStep === 1}
      >
        Atrás
      </button>
      {currentStep === totalSteps ? (
        <button
          onClick={createAppointment}
          className="px-4 py-2 bg-logo3 text-white rounded hover:bg-logo4"
        >
          Finalizar
        </button>
      ) : (
        <button
          onClick={goToNext}
          className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50 hover:bg-logo3"
          disabled={currentStep === totalSteps}
        >
          Siguiente
        </button>
      )}
    </div>
  );
};

export default WizardNavigation;