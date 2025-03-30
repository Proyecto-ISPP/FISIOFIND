// draftAppointmentModal.tsx
"use client";
import React from "react";
import { AppointmentData } from "@/lib/definitions";
import { formatDateFromIso } from "@/lib/utils";

interface DraftModalProps {
  draftData: AppointmentData;
  onResume: () => void;
  onDiscard: () => void;
}

const DraftModal: React.FC<DraftModalProps> = ({ draftData, onResume, onDiscard }) => {
  const name = draftData.physioName;
  const dataAppointment = draftData.appointmentData;
  const { service, start_time } = dataAppointment;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Tienes un borrador de cita</h2>
        <p className="mb-4">¿Deseas retomar la cita anterior o descartarla para empezar una nueva?</p>
        <div className="text-sm mb-4">
        <p>
            <strong>Fisioterapeuta:</strong>{" "}
            {name ? name : "Sin seleccionar"}
          </p>
          <p>
            <strong>Servicio:</strong>{" "}
            {service.type ? service.type : "Sin seleccionar"}
          </p>
          <p>
            <strong>Fecha/Hora:</strong>{" "}
            {start_time ? formatDateFromIso(start_time) : "No seleccionada"}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={onResume}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retomar
          </button>
          <button
            onClick={onDiscard}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
          >
            Descartar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DraftModal;
