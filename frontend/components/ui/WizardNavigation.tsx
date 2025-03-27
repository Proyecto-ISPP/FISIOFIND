// WizardNavigation.tsx
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
  const { state, dispatch } = useAppointment();
  const appointmentData = state.appointmentData;
  const router = useRouter();

  // Al montar, comprobamos el rol si existe un token
  useEffect(() => {
    if (isClient && token) {
      axios
        .get(`${getApiBaseUrl()}/api/app_user/check-role/`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          setCurrentRole(response.data.user_role);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [isClient, token]);

  // Función para crear la cita en el backend
  const createAppointment = () => {
    if (!token) {
      setShowAuthModal(true);
      return;
    }

    if (currentRole !== "patient") {
      alert("Debes estar registrado como paciente para confirmar la cita.");
      router.push("/register");
      return;
    }

    axios
      .post(
        `${getApiBaseUrl()}/api/appointment/patient/`,
        {
          start_time: appointmentData.start_time,
          end_time: appointmentData.end_time,
          is_online: appointmentData.is_online,
          service: {
                  type: appointmentData?.service.type,
                  price: appointmentData?.service.price,
                  duration: appointmentData.service.duration,
                  questionaryResponses: appointmentData?.questionaryResponses,
                },
          physiotherapist: appointmentData.physiotherapist,
          status: "booked",
          alternatives: "",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        alert("La cita se realizó correctamente.");
        // Eliminamos el borrador unificado
        sessionStorage.removeItem("appointmentDraft");
        sessionStorage.removeItem("physioName");
        dispatch({ type: "DESELECT_SERVICE" });
        router.push("/my-appointments");
      })
      .catch((error) => {
        alert("Error en la creación de la cita: " + error);
      });
    };


  // Función para guardar el borrador unificado y redirigir
  function handleDraftSaveAndRedirect(redirectPath: string) {
    // Clonamos el appointmentData para no mutar el original
    const safeDraft = { ...appointmentData };
    // Eliminamos cualquier info sensible si hace falta
    if (safeDraft.paymentInfo) delete safeDraft.paymentInfo;
    const name = sessionStorage.getItem("physioName");
    sessionStorage.removeItem("physioName");
    // Unificamos todo en un solo objeto
    const unifiedDraft = {
      appointmentData: safeDraft,
      draftInProgress: true,
      returnUrl: window.location.pathname,
      // Si quieres guardar también el nombre del fisio (ejemplo):
      physioName: name,
    };

    // Guardamos en una sola entrada del sessionStorage
    sessionStorage.setItem("appointmentDraft", JSON.stringify(unifiedDraft));
    router.push(redirectPath);
  }

  return (
    <>
      <div className="flex justify-center space-x-4 mt-6">
        {currentStep !== 1 && (
          <button
            onClick={goToPrevious}
            className="px-6 py-2 rounded-xl bg-white border-2 border-[#65C2C9] text-[#65C2C9] hover:bg-[#65C2C9] hover:text-white transition-colors"
          >
            Atrás
          </button>
        )}
        {currentStep === totalSteps ? (
          <></>
          // <button
          //   onClick={createAppointment}
          //   className="px-4 py-2 bg-logo3 text-white rounded hover:bg-logo4"
          // >
          //   Finalizar
          // </button>
        ) : (
          <button
            onClick={goToNext}
            className="px-6 py-2 rounded-xl bg-[#05668D] text-white hover:bg-[#05918F] transition-colors disabled:opacity-50"
            disabled={currentStep === totalSteps}
          >
            Siguiente
          </button>
        )}
      </div>

      
    </>
  );
};

export default WizardNavigation;