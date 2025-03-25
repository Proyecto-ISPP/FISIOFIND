// Wizard.tsx
"use client";
import React, { useState } from "react";
import WizardHeader from "./WizardHeader";
import WizardContent from "./WizardContent";
import WizardNavigation from "./WizardNavigation";
import { Service, Step } from "@/lib/definitions";
import { AppointmentProvider } from "@/context/appointmentContext"; // Asegúrate de ajustar la ruta
import axios from "axios";
import {getApiBaseUrl} from "@/utils/api";

const Wizard: React.FC<{ steps: Step[], token: string | null, isClient: boolean}> = ({ steps, token, isClient }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [services, setServices] = useState<Service[]>([]);

  React.useEffect(() => {
    const fetchServices = async () => {
      try {
        const urlParts = window.location.pathname.split('/');
        const physio_id = urlParts[urlParts.length - 1];
        if (physio_id && token) {
          const response = await axios.get(`${getApiBaseUrl()}/api/app_user/services/${physio_id}/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
            // For nested JSON object with service categories
            const parsedServices: Service[] = [];
            if (response.data && typeof response.data === 'object') {
            Object.entries(response.data).forEach(([_, service]: [string, any]) => {
              if (service && typeof service === 'object' && 'id' in service) {
                const questionnaire = service["cuestionario Personalizado"] || {};

                parsedServices.push({
                  id: String(service.id),
                  title: service.title || "",
                  price: typeof service.price === 'number' ? service.price : parseFloat(service.price || "0"),
                  description: service.description || "",
                  duration: service.duration || "",
                  questionary: questionnaire['UI Schema'] || { type: "", label: "", elements: [] },
                });
                }
              });
            console.log(parsedServices);  
          }
          setServices(parsedServices);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    
    fetchServices();
  }, [token]);


  // const services: Service[] = [
  //   {
  //     id: "1",
  //     title: "Masaje Deportivo",
  //     price: 50,
  //     description:
  //       "Masaje enfocado en aliviar tensiones musculares de deportistas.",
  //     duration: "45",
  //   },
  //   {
  //     id: "2",
  //     title: "Rehabilitación de Rodilla",
  //     price: 80,
  //     description: "Terapia para mejorar la movilidad y reducir el dolor.",
  //     duration: "60",
  //   },
  // ];

  // Navegación
  const goToNextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const goToPreviousStep = () =>
    setCurrentStep((prev) => Math.max(prev - 1, 1));


  return (
    <AppointmentProvider>
      <div className="w-full p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <WizardHeader steps={steps} currentStep={currentStep} />

          {/* Contenido */}
          <div className="mt-8 w-full bg-white rounded shadow p-6">
            <WizardContent currentStep={currentStep} services={services} />
          </div>

          {/* Navegación */}
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
