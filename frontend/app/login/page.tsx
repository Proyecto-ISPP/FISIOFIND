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

  const showAlert = (
    type: "success" | "error" | "info" | "warning",
    message: string
  ) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: "info", message: "" });
    }, 5000);
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${getApiBaseUrl()}/api/app_user/login/`, {
        username: formData.username,
        password: formData.password,
      });
      if (response.data.access) {
        localStorage.setItem('token', response.data.access);
        showAlert("success", "¡Inicio de sesión exitoso!");
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
    } finally {
      setIsSubmitting(false);
    }
  };

  // Responsive media query for large screens
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  useEffect(() => {
    const checkScreen = () => setIsLargeScreen(window.innerWidth >= 1024);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-neutral-900 dark:via-black dark:to-black">
      {/* Floating alert */}
      {alert.show && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ ...alert, show: false })}
          />
        </div>
      )}
      {/* Left side - Video (only on large screens) */}
      {isLargeScreen && (
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
          {/* Fondo degradado */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#6BC9BE] to-[#05668D]" />
          {/* Imágenes grandes, centradas verticalmente, sin divs extra */}
          <img
            src="/static/fisio_find_logo_white.webp"
            alt="Fisio Find Logo Blur"
            className="absolute left-[-8%] top-1/2 -translate-y-1/2 w-[750px] h-[750px] object-contain filter blur-[2px] opacity-90 z-10"
            style={{ maxWidth: '45vw', maxHeight: '90vh' }}
          />
          <img
            src="/static/Gif-mascota-despedida-unscreen.gif"
            alt="Mascota FisioFind"
            className="absolute right-[-12%] w-[750px] h-[750px] object-contain animate-float z-20"
            style={{ maxWidth: '45vw', maxHeight: '90vh', pointerEvents: 'none' }}
          />
          <div className="absolute bottom-8 left-8 z-30 max-w-lg">
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">
              ¡Bienvenido a FisioFind!
            </h2>
          </div>
        </div>
      )}
      {/* Right side - Login form */}
      <div className={`flex flex-col justify-center items-center p-6 md:p-12 ${isLargeScreen ? "lg:w-1/2" : "w-full"}`}>
        <div className="w-full max-w-xl">
          <div className={`flex items-center mb-8 ${isLargeScreen ? "justify-start space-x-6" : "justify-center space-x-4"}`}>
            <Image
              src="/static/fisio_find_logo.webp"
              alt="Fisio Find Logo"
              width={112}
              height={112}
              className="w-28 h-28 drop-shadow-lg"
              priority
            />
            <div className={isLargeScreen ? "text-left" : "text-center"}>
              <h1 className="text-4xl font-bold mb-4">
                <span className="text-[#1E5ACD]">Fisio </span>
                <span className="text-[#253240]">Find</span>
              </h1>
              <p className="text-xl mt-2 font-bold text-gray-600 dark:text-gray-300">
                Inicio de Sesión
              </p>
            </div>
          </div>
          <div className="bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl p-8 w-full bg-white dark:bg-black border border-gray-100 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
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
                  className="w-full p-3 border border-[#05668D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#41b8d5] text-[#0A7487] dark:text-white dark:bg-neutral-900"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
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
                    className="w-full p-3 border border-[#05668D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#41b8d5] text-[#0A7487] dark:text-white dark:bg-neutral-900 pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-2 top-0 bottom-0 flex items-center h-8 bg-transparent border-none cursor-pointer focus:outline-none z-10 hover:bg-transparent"
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
                className="w-full py-3 bg-gradient-to-r from-[#05668D] to-[#0A7487] hover:from-[#0A7487] hover:to-[#05918F] text-white font-medium rounded-xl transition-colors"
              >
                {isSubmitting ? "Ingresando..." : "Iniciar Sesión"}
              </button>
            </form>
            <div className="text-center mt-6">
              <p className="text-gray-600 dark:text-gray-400">
                ¿No tienes cuenta?{' '}
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
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap");
        .font-alfa-slab-one { font-family: 'Alfa Slab One', cursive; }
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>
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