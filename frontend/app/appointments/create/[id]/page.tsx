// app/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Wizard from "@/components/ui/Wizard";
import { Step } from "@/lib/definitions";


const steps: Step[] = [
  { step: 1, label: "Selecciona el servicio" },
  { step: 2, label: "Agenda tu cita y hora" },
  { step: 3, label: "Preguntas rápidas" },
  { step: 4, label: "Resumen final" },
  { step: 5, label: "Elige tu método de pago" },
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
      <Wizard steps={steps} token={token} isClient={isClient}/>
  );
}