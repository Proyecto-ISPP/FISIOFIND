"use client";
import React from "react";
// import clsx from "clsx";
import { Service, QuestionaryResponse, Questionary } from "@/lib/definitions";
import { useAppointment } from "@/context/appointmentContext";
import AppointmentCalendar from "./AppointmentCalendar";
import { formatAppointment } from "@/lib/utils"; // Se importa la función de formateo
import { useParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "@/components/CheckoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string); //me pidio añadir el as string
import ServiceQuestionary from "./ServiceQuestionary";
import { ServiceQuestionaryRef } from "./ServiceQuestionary"; // Asegúrate de importar la referencia


interface WizardContentProps {
  currentStep: number;
  services: Service[];
  token: string | null;
  questionaryRef: React.RefObject<ServiceQuestionaryRef | null>; // Permitir null

}

// Función para calcular el máximo común divisor de dos números
const gcd = (a: number, b: number): number => {
  return b === 0 ? a : gcd(b, a % b);
};

// Calcula el GCD de un arreglo de números
const computeGCD = (arr: number[]): number => {
  return arr.reduce((prev, curr) => gcd(prev, curr));
};

const WizardContent: React.FC<WizardContentProps> = ({
  currentStep,
  services, questionaryRef,
  token
}) => {
  const { state, dispatch } = useAppointment();
  const appointmentData = state.appointmentData;
  const { id } = useParams();
  const physioId = parseInt(id as string);


  const handleSelectService = (service: Service) => {
    if (appointmentData.service.id === service.id) {
      dispatch({ type: "DESELECT_SERVICE" });
    } else {
      dispatch({
        type: "SELECT_SERVICE",
        payload: {
          service: {
            id: service.id,
            title: service.title,
            type: service.title,
            tipo: service.tipo,
            price: service.price,
            duration: parseInt(service.duration),
            questionary: service.questionary,
          },
          physiotherapist: physioId,
        },
      });
    }
  };

  if (currentStep === 1) {
    return (
      <div className="service-selection-container">
        <h3 className="service-selection-title">Selecciona el servicio</h3>
        
        {services.length > 0 ? (
          <div className="service-selection-grid">
            {services.map((svc) => {
              const isSelected = appointmentData.service.id === svc.id;
              
              return (
                <div
                  key={svc.id}
                  onClick={() => handleSelectService(svc)}
                  className={`service-selection-card ${
                    isSelected ? 'service-selection-card-selected' : 'service-selection-card-default'
                  }`}
                >
                  <div className="service-selection-card-content">
                    <div className="service-selection-card-header">
                      <h3>{svc.title}</h3>
                    </div>
                    
                    <div className="service-selection-card-description">
                      {svc.description}
                    </div>
                    
                    <div className="service-selection-card-footer">
                      <div className="service-selection-card-footer-details">
                        <span className="price">{svc.price}</span>
                        <span className="duration">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          {svc.duration} min
                        </span>
                      </div>
                      
                      <div className={`service-selection-card-footer-indicator ${
                        isSelected ? 'service-selection-card-footer-indicator-selected' : 'service-selection-card-footer-indicator-unselected'
                      }`}>
                        {isSelected && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="service-selection-empty">
            <p>No hay servicios disponibles actualmente.</p>
            <p>Por favor, vuelve más tarde.</p>
          </div>
        )}
      </div>
    );
  } else if (currentStep === 2) {
    if (!appointmentData.service.type) {
      return (
        <p className="text-gray-800">
          Por favor selecciona un servicio primero.
        </p>
      );
    }
    // Calcula el GCD de las duraciones de todos los servicios para definir el slotInterval
    const serviceDurations = services.map((svc) => parseInt(svc.duration));
    const slotInterval = computeGCD(serviceDurations);
    return (
      <div>
        <h3 className="text-lg font-bold mb-4">Agenda tu cita</h3>
        <AppointmentCalendar
          serviceDuration={appointmentData.service.duration}
          slotInterval={slotInterval}
        />
      </div>
    );
  } else if (currentStep === 3) {
    if (!appointmentData.start_time && !appointmentData.end_time) {
      return (
        <p className="text-gray-800">
        Por favor selecciona un tramo horario primero.
      </p>
      );
    } else {
      return <ServiceQuestionary ref={questionaryRef} />;
    }
  } else if (currentStep === 4) {
    // Se formatean las fechas de inicio y fin de forma separada
    const inicio = appointmentData.start_time ? formatAppointment(appointmentData.start_time) : { date: "", time: "" };
    const fin = appointmentData.end_time ? formatAppointment(appointmentData.end_time) : { time: "" };
    

    const questionaryResponses: QuestionaryResponse = appointmentData.questionaryResponses || {};
    const questionary: Questionary = appointmentData.service.questionary;
  
    return (
      <div>
        <h3 className="font-bold mb-2">Resumen final de tu cita</h3>
        <p>
          <strong>Servicio:</strong> {appointmentData.service.type}
        </p>
        <p>
          <strong>Precio:</strong> {appointmentData.service.price} €
        </p>
        <p>
          <strong>Duración:</strong> {appointmentData.service.duration} min
        </p>
        {appointmentData.start_time ? (
          <>
            <p>
              <strong>Fecha:</strong> {inicio.date}
            </p>
            <p>
              <strong>Hora de inicio:</strong> {inicio.time}
            </p>
          </>
        ) : (
          <p>
            <strong>Inicio:</strong> No seleccionado
          </p>
        )}
        {appointmentData.end_time ? (
          <p>
            <strong>Hora de fin:</strong> {fin.time}
          </p>
        ) : (
          <p>
            <strong>Fin:</strong> No seleccionado
          </p>
        )}
        
        {/* Mostrar las respuestas del cuestionario */}
        {questionaryResponses && Object.keys(questionaryResponses).length > 0 && (
          <div className="mt-4">
            <h4 className="font-bold mb-2">Respuestas del cuestionario:</h4>
            <div className="bg-gray-50 p-3 rounded-md max-h-64 overflow-y-auto">
              {Object.entries(questionaryResponses).map(([key, value]) => {
                // Encontrar la pregunta correspondiente por su scope
                const question = questionary?.elements?.find(
                  (elem) => elem.scope.includes(key)
                );
                
                return (
                  <div key={key} className="mb-2">
                    <p>
                      <strong>{question?.label || key}:</strong> {String(value)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  } else if (currentStep === 5) {
    return (
      <div>
        {/* <h3 className="text-lg font-bold mb-4">Elige tu método de pago</h3> */}
        <Elements stripe={stripePromise}>
            <CheckoutForm request={appointmentData} token={token}/>
        </Elements>
      </div>
    );
  }
  return null;
}

export default WizardContent;