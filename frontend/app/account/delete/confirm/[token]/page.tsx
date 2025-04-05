"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import axios from "axios";

// Ajusta esta función o sustitúyela si usas otra forma de obtener la base URL
import { getApiBaseUrl } from "@/utils/api";

interface ConfirmDeletePageProps {
  params: {
    token: string;
  };
}

export default function ConfirmDeletePage({ params }: ConfirmDeletePageProps) {
  const { token } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Llamada GET al endpoint de confirmación del backend
  const handleConfirmDelete = async () => {
    setLoading(true);
    setError("");
    try {
      // Ajusta la URL al endpoint que creaste en tu backend:
      // /api/app_user/account/delete/confirm/<token>/
      const response = await axios.get(
        `${getApiBaseUrl()}/api/app_user/account/delete/confirm/${token}/`
      );

      // Si todo va bien, redirige a donde prefieras, por ejemplo al home:
      router.push("/");
    } catch (err: any) {
      console.error("Error confirmando eliminación de cuenta:", err);
      setError("No se pudo eliminar la cuenta. El enlace puede haber expirado o ser inválido.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Lógica de cancelación: redirigir a home (o donde quieras)
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center text-red-600">
          Confirmar Eliminación de Cuenta
        </h1>
        <p className="text-gray-700 mb-6 text-center">
          Esta acción es irreversible. Una vez que elimines tu cuenta, no podrás recuperar tus datos.
          <br />
          ¿Estás seguro de que quieres continuar?
        </p>

        {/* Si hay error, lo mostramos */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-all"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all"
            disabled={loading}
          >
            {loading ? "Eliminando..." : "Sí, eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
