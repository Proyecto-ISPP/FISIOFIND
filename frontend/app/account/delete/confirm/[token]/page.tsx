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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-white dark:from-neutral-900 dark:to-black">
      <div className="bg-white dark:bg-black rounded-xl shadow-xl p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center text-[#1E5ACD]">
          Confirmar Eliminación de Cuenta
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
          Esta acción es irreversible. Una vez que elimines tu cuenta, no podrás recuperar tus datos.
          <br />
          ¿Estás seguro de que quieres continuar?
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmDelete}
            className="px-4 py-2 bg-[#1E5ACD] text-white rounded-xl hover:bg-[#0A7487] transition-all"
            disabled={loading}
          >
            {loading ? "Eliminando..." : "Sí, eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
