// pages/unsubscribe.tsx
"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";

const UnsubscribePage = () => {
  const searchParams = useSearchParams(); 
  const [token] = useState<string | null>(searchParams.get("token")); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(true);

  const handleUnsubscribe = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${getApiBaseUrl()}/api/app_user/unsubscribe?token=${token}`
      );
      setMessage(response.data.detail);
    } catch (error: Error | unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(
          error.response?.data?.detail ||
            "Ocurrió un error. Inténtalo más tarde."
        );
      } else {
        setMessage("Ocurrió un error. Inténtalo más tarde.");
      }
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      {showModal ? (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Cancelar Suscripción
          </h1>
          <p className="mb-6 text-center">
            ¿Desea cancelar su suscripción a los correos?
          </p>
          <div className="flex justify-center">
            <button
              onClick={handleUnsubscribe}
              disabled={loading}
              className="px-4 py-2 bg-logo2 text-white rounded hover:bg-opacity-90 focus:outline-none"
            >
              {loading ? "Procesando..." : "Confirmar desuscripción"}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Resultado</h1>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default UnsubscribePage;
