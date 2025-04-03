"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";
import Image from "next/image";

const VerifyEmailPage = () => {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string; 

  const [verificationStatus, setVerificationStatus] = useState<string | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("No se proporcionó un token de verificación.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `${getApiBaseUrl()}/api/app_user/register/verified/${token}/`
        );

        if (response.status === 200) {
          setVerificationStatus(
            "Se te ha verificado el email correctamente. ¡Ahora puedes iniciar sesión!"
          );

          // Redirige al login después de 3 segundos
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const responseData = error.response?.data;
          if (responseData?.error) {
            setError(responseData.error);
          } else {
            setError("Ocurrió un error al verificar tu email. Intenta de nuevo.");
          }
        } else {
          setError("Ocurrió un error inesperado. Intenta de nuevo.");
        }
      }
    };

    verifyEmail();
  }, [token, router]);

  if (verificationStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-neutral-900 dark:to-black py-8 flex items-center justify-center">
        <div className="bg-white dark:bg-black rounded-xl shadow-xl p-6 max-w-md w-full text-center">
          <Image
            src="/static/fisio_find_logo.webp"
            alt="Fisio Find Logo"
            width={120}
            height={120}
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-[#1E5ACD] mb-4">
            Verificación Exitosa
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {verificationStatus}
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Redirigiendo al inicio de sesión en unos segundos...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-neutral-900 dark:to-black py-8 flex items-center justify-center">
        <div className="bg-white dark:bg-black rounded-xl shadow-xl p-6 max-w-md w-full text-center">
          <Image
            src="/static/fisio_find_logo.webp"
            alt="Fisio Find Logo"
            width={120}
            height={120}
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.push("/register")}
            className="px-6 py-2 bg-[#1E5ACD] text-white font-medium rounded-xl hover:bg-[#0A7487] transition-colors"
          >
            Volver al registro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-neutral-900 dark:to-black py-8 flex items-center justify-center">
      <div className="bg-white dark:bg-black rounded-xl shadow-xl p-6 max-w-md w-full text-center">
        <Image
          src="/static/fisio_find_logo.webp"
          alt="Fisio Find Logo"
          width={120}
          height={120}
          className="mx-auto mb-4"
        />
        <p className="text-gray-600 dark:text-gray-400">Verificando tu email...</p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;