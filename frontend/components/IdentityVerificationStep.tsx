import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";

// Usa la misma interfaz de FormData que en tu register
interface FormData {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  dni: string;
  phone_number: string;
  postal_code: string;
  gender: string;
  birth_date: string;
  collegiate_number: string;
  autonomic_community: string;
  plan: string;
}

interface IdentityVerificationStepProps {
  formData: FormData;
  onVerificationSuccess: () => void;
}

// Extiende el objeto global para incluir Persona
declare global {
  interface Window {
    Persona: any;
  }
}

const IdentityVerificationStep: React.FC<IdentityVerificationStepProps> = ({
  formData,
  onVerificationSuccess,
}) => {
  const [clientInitialized, setClientInitialized] = useState(false);
  const personaClientRef = useRef<any>(null);

  useEffect(() => {
    const scriptId = "persona-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://cdn.withpersona.com/dist/persona-v5.1.2.js";
      script.async = true;
      script.integrity =
        "sha384-nuMfOsYXMwp5L13VJicJkSs8tObai/UtHEOg3f7tQuFWU5j6LAewJbjbF5ZkfoDo";
      script.crossOrigin = "anonymous";
      document.body.appendChild(script);
      script.onload = initializePersonaClient;
    } else {
      initializePersonaClient();
    }

    function initializePersonaClient() {
      if (window.Persona) {
        const client = new window.Persona.Client({
          templateId: "itmpl_NXuUD3b5bR6jaPnyMjRYTapQ1aLE",
          environmentId: "env_W1FMk5LA8yvTFAmY7rLM67BSAxHf",
          onReady: () => {
            setClientInitialized(true);
            client.open();
          },
          onComplete: async ({ inquiryId, status }: { inquiryId: string; status: string }) => {
            console.log(`Completed inquiry ${inquiryId} with status ${status}`);
            try {
              const response = await axios.post(
                `${getApiBaseUrl()}/api/app_user/physio/verify-identity`,
                {
                  inquiryId,
                  formData,
                }
              );
              if (response.data.verified) {
                onVerificationSuccess();
              } else {
                alert("La verificación falló. Por favor, inténtalo de nuevo.");
              }
            } catch (error) {
              console.error("Error en la verificación:", error);
              alert("Error en la verificación de identidad.");
            }
          },
        });
        personaClientRef.current = client;
      } else {
        console.error("El script de Persona no se cargó correctamente.");
      }
    }

    return () => {
      // Opcional: se puede remover el script al desmontar
      // const script = document.getElementById(scriptId);
      // if (script) document.body.removeChild(script);
    };
  }, [formData, onVerificationSuccess]);

  const relaunchVerification = () => {
    if (personaClientRef.current) {
      personaClientRef.current.open();
    }
  };

  return (
    <div className="p-6 relative">
      <h2 className="text-xl font-semibold text-center">Verificando tu identidad...</h2>
      <p className="text-center">Por favor, completa el flujo de verificación.</p>
      <button
        onClick={relaunchVerification}
        className="absolute bottom-4 right-4 bg-[#1E5ACD] hover:bg-[#1848A3] text-white py-2 px-4 rounded"
      >
        Reintentar Verificación
      </button>
    </div>
  );
};

export default IdentityVerificationStep;
