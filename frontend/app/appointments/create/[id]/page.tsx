// app/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Wizard from "@/components/ui/Wizard";
import { Step } from "@/lib/definitions";
import { AppointmentProvider } from "@/context/appointmentContext";


const steps: Step[] = [
  { step: 1, label: "Selecciona el servicio" },
  { step: 2, label: "Agenda tu cita y hora" },
  { step: 3, label: "Elige tu método de pago" },
  { step: 4, label: "Preguntas rápidas" },
  { step: 5, label: "Resumen final" },
];



export default function WizardPage() {
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, [isClient, token]);

  return (
    <AppointmentProvider>
      <Wizard steps={steps} token={token} isClient={isClient}/>
    </AppointmentProvider>
  );
}