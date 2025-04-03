// Wizard.tsx
"use client";
import React, { useEffect, useState } from "react";
import WizardHeader from "./WizardHeader";
import WizardContent from "./WizardContent";
import WizardNavigation from "./WizardNavigation";
import { Service, Step } from "@/lib/definitions";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";
import { useRef } from "react";
import { ServiceQuestionaryRef } from "./ServiceQuestionary";
import { useParams } from "next/navigation";
import { AppointmentProvider } from "@/context/appointmentContext";

interface WizardProps {
  steps: Step[];
  token: string | null;
  isClient: boolean;
}

const Wizard: React.FC<WizardProps> = ({ steps, token, isClient }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [services, setServices] = useState<Service[]>([]);
  const questionaryRef = useRef<ServiceQuestionaryRef>(null); // Referencia al cuestionario


  React.useEffect(() => {
    const fetchServices = async () => {
      try {
        const urlParts = window.location.pathname.split("/");
        const physio_id = urlParts[urlParts.length - 1];
        if (physio_id) {
          const response = await axios.get(`${getApiBaseUrl()}/api/app_user/services/${physio_id}/`, {
          });

          // For nested JSON object with service categories
          let physioName = ''
          const parsedServices: Service[] = [];
          if (response.data && typeof response.data === 'object') {
            physioName = response.data.physioName
            Object.entries(response.data.services).forEach(([_, service]: [string, any]) => {
              if (service && typeof service === 'object' && 'id' in service) {
                const questionnaire = service.custom_questionnaire && service.custom_questionnaire["UI Schema"]
                  ? service.custom_questionnaire["UI Schema"]
                  : { type: "", label: "", elements: [] };
                console.log(questionnaire);
                parsedServices.push({
                  id: service.id,
                  title: service.title || "",
                  price: typeof service.price === 'number' ? service.price : parseFloat(service.price || "0"),
                  description: service.description || "",
                  duration: service.duration || "",
                  questionary: questionnaire,
                });
              }
            }
            );
          }
          setServices(parsedServices);

          sessionStorage.setItem("physioName", physioName);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();

  }, [token]);

  // Navegación
  const goToNextStep = () => {
    // Si estamos en el paso del cuestionario (asumiendo que es el paso 4)
    if (currentStep === 3) {
      // Validar el cuestionario antes de continuar
      const isValid = questionaryRef.current?.validateQuestionaryAndContinue();
      if (!isValid) {
        return; // No avanzar si el cuestionario no es válido
      }
    }

    // Avanzar al siguiente paso
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const goToPreviousStep = () =>
    setCurrentStep((prev) => Math.max(prev - 1, 1));


  return (
    <AppointmentProvider>
      <div className="w-full p-8">
        <div className="max-w-4xl mx-auto">
          {/* Modal de borrador */}

          <WizardHeader steps={steps} currentStep={currentStep} />

          {/* Contenido */}
          <div className="mt-8 w-full bg-white rounded shadow p-6">
            <WizardContent currentStep={currentStep} services={services} questionaryRef={questionaryRef} token={token}/>
          </div>

          <WizardNavigation
            currentStep={currentStep}
            totalSteps={steps.length}
            goToNext={goToNextStep}
            goToPrevious={goToPreviousStep}
            token={token}
            isClient={isClient}
          />
        </div>
      </div>
    </AppointmentProvider>
  );
};

export default Wizard;