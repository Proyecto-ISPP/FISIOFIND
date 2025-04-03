"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

export default function RegisterPage() {
  const router = useRouter();

  const handleRoleSelection = (role: "patient" | "physio") => {
    router.push(`/register/${role}`);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-12 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <Image 
          src="/static/fisio_find_logo.webp" 
          alt="Fisio Find Logo" 
          width={180} 
          height={180} 
          className="mb-6 mx-auto"
        />
        <h1 className="text-4xl font-bold mb-4 font-alfa-slab-one">
          <span className="text-[#1E5ACD]">Fisio </span>
          <span className="text-[#253240]">Find</span>
        </h1>
        <h2 className="text-2xl font-bold mb-2">Registro de Usuario</h2>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Selecciona tu rol para continuar con el registro en nuestra plataforma
        </p>
      </div>

      {/* Role Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Patient Card */}
        <CardContainer className="w-full">
          <CardBody className="bg-gradient-to-bl from-white to-[#65C2C9]/20 relative group/card dark:hover:shadow-2xl dark:hover:shadow-blue-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border">
            <CardItem translateZ="50" className="text-2xl font-bold text-neutral-600 dark:text-white text-center mb-4">
              Soy Paciente
            </CardItem>
            <CardItem translateZ="60" className="w-full mt-4 flex justify-center">
              <div className="h-48 w-48 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                <Image 
                  src="/static/patient_icon.svg" 
                  alt="Patient Icon" 
                  width={180} 
                  height={180} 
                  className="object-cover"
                />
              </div>
            </CardItem>
            <CardItem as="p" translateZ="40" className="text-neutral-500 text-center my-6 dark:text-neutral-300">
              Regístrate como paciente para encontrar los mejores fisioterapeutas y gestionar tus citas
            </CardItem>
            <CardItem
              translateZ="30"
              as="button"
              className="w-full px-4 py-3 rounded-xl bg-[#1E5ACD] text-white font-bold hover:bg-[#1848A3] transition-colors"
              onClick={() => handleRoleSelection("patient")}
            >
              Registrarme como Paciente
            </CardItem>
          </CardBody>
        </CardContainer>

        {/* Physiotherapist Card */}
        <CardContainer className="w-full">
          <CardBody className="bg-gradient-to-bl from-white to-[#65C2C9]/20 relative group/card dark:hover:shadow-2xl dark:hover:shadow-blue-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border">
            <CardItem translateZ="50" className="text-2xl font-bold text-neutral-600 dark:text-white text-center mb-4">
              Soy Fisioterapeuta
            </CardItem>
            <CardItem translateZ="60" className="w-full mt-4 flex justify-center">
              <div className="h-48 w-48 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                <Image 
                  src="/static/physiotherapist_icon.svg" 
                  alt="Physiotherapist Icon" 
                  width={180} 
                  height={180} 
                  className="object-cover"
                />
              </div>
            </CardItem>
            <CardItem as="p" translateZ="40" className="text-neutral-500 text-center my-6 dark:text-neutral-300">
              Regístrate como fisioterapeuta para ofrecer tus servicios y ampliar tu cartera de pacientes
            </CardItem>
            <CardItem
              translateZ="30"
              as="button"
              className="w-full px-4 py-3 rounded-xl bg-[#1E5ACD] text-white font-bold hover:bg-[#1848A3] transition-colors"
              onClick={() => handleRoleSelection("physio")}
            >
              Registrarme como Fisioterapeuta
            </CardItem>
          </CardBody>
        </CardContainer>
      </div>

      {/* Back to Login Link */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-2">¿Ya tienes una cuenta?</p>
        <button 
          className="font-semibold text-[#1E5ACD] hover:underline"
          onClick={() => router.push("/login")}
        >
          Iniciar sesión
        </button>
      </div>

      {/* Back to Home Link */}
      <button 
        className="mt-8 text-gray-500 hover:text-gray-700 flex items-center gap-2"
        onClick={() => router.push("/")}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Volver a la página principal
      </button>
    </div>
  );
}
