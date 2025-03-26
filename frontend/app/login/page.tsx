"use client";

import React, { useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { getApiBaseUrl } from "@/utils/api";

function LoginPacienteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${getApiBaseUrl()}/api/app_user/login/`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        localStorage.setItem("token", response.data.access);
        setMessage("Inicio de sesión exitoso");
        setTimeout(() => {
          router.push(redirectUrl);
        }, 500);
      }
    } catch (error: any) {
      setMessage(
        error.response?.data?.error || "Las credenciales no son válidas"
      );
      console.error("Error al iniciar sesión:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-neutral-900 dark:to-black py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <Image
            src="/static/fisio_find_logo.webp"
            alt="Fisio Find Logo"
            width={120}
            height={120}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-[#1E5ACD]">
            Inicio de Sesión
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        <div className="max-w-md mx-auto p-6 bg-white dark:bg-black rounded-xl shadow-xl">
          {message && (
            <p
              className={`text-center mb-4 ${
                message === "Inicio de sesión exitoso"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
              >
                Nombre de usuario <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nombre de usuario"
                required
                className="w-full p-3 border border-[#05668D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#41b8d5] text-[#0A7487]"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
              >
                Contraseña <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Contraseña"
                required
                className="w-full p-3 border border-[#05668D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#41b8d5] text-[#0A7487]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#05668D] hover:bg-[#41b8d5] text-white py-3 rounded-md transition disabled:bg-blue-300"
            >
              {isSubmitting ? "Ingresando..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600 dark:text-gray-400">
              ¿No tienes cuenta?{" "}
              <button
                onClick={() => router.push("/register")}
                className="text-[#1E5ACD] hover:underline font-medium"
              >
                Registrarse
              </button>
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 text-gray-500 hover:text-gray-700 flex items-center gap-2 mx-auto"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Volver a la página principal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente padre que envuelve en Suspense
export default function LoginPaciente() {
  return (
    <Suspense fallback={<div className="text-center p-8">Cargando formulario...</div>}>
      <LoginPacienteForm />
    </Suspense>
  );
}