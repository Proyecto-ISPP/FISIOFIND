"use client";

import React, { useState, useCallback, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { getApiBaseUrl } from "@/utils/api";
import { Eye, EyeOff } from "lucide-react";
import Alert from '@/components/ui/Alert';

function LoginPacienteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState<{
    show: boolean;
    type: "success" | "error" | "info" | "warning";
    message: string;
}>({
    show: false,
    type: "info",
    message: ""
});

const showAlert = (type: "success" | "error" | "info" | "warning", message: string) => {
    setAlert({
        show: true,
        type,
        message
    });
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        setAlert({
            show: false,
            type: "info",
            message: ""
        });
    }, 5000);
};


  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
        const response = await axios.post(`${getApiBaseUrl()}/api/app_user/login/`, {
            username: formData.username,  // Changed from username to formData.username
            password: formData.password,  // Changed from password to formData.password
        });

        if (response.data.access) {
            localStorage.setItem('token', response.data.access);
            showAlert("success", "¡Inicio de sesión exitoso!");
            
            // Wait for 1 second before redirecting to allow the alert to be seen
            setTimeout(() => {
                router.push(redirectUrl);
            }, 1000);
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            showAlert("error", "Error en el inicio de sesión. Por favor, verifica tus credenciales.");
        } else {
            showAlert("error", "Error al conectar con el servidor. Por favor, inténtalo de nuevo más tarde.");
        }
    }
};

  return (
    <div>
            {alert.show && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert({ ...alert, show: false })}
                />
            )}
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Contraseña"
                  required
                  className="w-full p-3 border border-[#05668D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#41b8d5] text-[#0A7487] pr-10"
                />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-1/4 -translate-y-1/2 bg-transparent border-none cursor-pointer focus:outline-none z-10 hover:bg-transparent"
            >
              {showPassword ? (
                <Eye className="text-blue-600" size={20} />
              ) : (
                <EyeOff className="text-blue-600" size={20} />
              )}
            </button>
              </div>
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
  </div>
  );
}

export default function LoginPaciente() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/restricted-access");
    }
  }, [router]);

  return (
    <Suspense fallback={<div className="text-center p-8">Cargando formulario...</div>}>
      <LoginPacienteForm />
    </Suspense>
  );
}