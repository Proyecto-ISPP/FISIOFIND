"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { getApiBaseUrl } from "@/utils/api";
import { Eye, EyeOff, Info } from "lucide-react";
import Alert from '@/components/ui/Alert';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  dni: string;
  phone_number?: string;
  postal_code: string;
  gender: string;
  birth_date: string;
}

const GENDER_OPTIONS = [
  { value: "", label: "Seleccione género" },
  { value: "M", label: "Masculino" },
  { value: "F", label: "Femenino" },
  { value: "O", label: "Otro" },
  { value: "P", label: "Prefiero no decirlo" },
];

const FormField = ({
  name,
  label,
  type = "text",
  options = [],
  required = true,
  value,
  onChange,
  error,
  info
}: {
  name: string;
  label: string;
  type?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  error?: string;
  info?: string;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-4 relative">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
        {info && (
          <span
            title={info}
            className="ml-1 mt-0 text-gray-400 hover:text-gray-600 cursor-pointer"
            style={{ display: 'inline-block', verticalAlign: 'middle' }}
          >
            <Info size={16} />
          </span>
        )}
      </label>

      {type === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1E5ACD] dark:bg-neutral-800 dark:text-white"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="relative">
          <input
            type={type === "password" && showPassword ? "text" : type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1E5ACD] dark:bg-neutral-800 dark:text-white pr-10"
          />
          {type === "password" && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-1/4 -translate-y-1/2 bg-transparent border-none cursor-pointer focus:outline-none z-10 hover:bg-transparent"
            >
              {showPassword ? (
                <Eye
                  className="text-blue-600"
                  size={20}
                />
              ) : (
                <EyeOff
                  className="text-blue-600"
                  size={20}
                />
              )}
            </button>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};


const ConfirmationModal = ({ isOpen, onClose, email, onConfirm }: { isOpen: boolean, onClose: () => void, email: string, onConfirm: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-xl max-w-md w-full transform transition-all duration-300 ease-in-out scale-100">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Confirma tu correo electrónico</h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          ¡Registro casi completo! Te hemos enviado un correo de confirmación a <strong>{email}</strong>.
          <br /><br />
          Por favor, revisa tu bandeja de entrada (y la carpeta de spam, por si acaso) y sigue las instrucciones para activar tu cuenta.
        </p>
        <div className="flex justify-end">
           <button
             onClick={() => {
               onClose(); // Cierra el modal
               onConfirm(); // Ejecuta la acción de confirmación (redirección)
             }}
             className="px-5 py-2 bg-[#1E5ACD] text-white font-semibold rounded-lg hover:bg-[#1747A0] focus:outline-none focus:ring-2 focus:ring-[#1E5ACD] focus:ring-opacity-50 transition-colors"
           >
             Entendido
           </button>
        </div>
      </div>
    </div>
  );
};


const PatientRegistrationForm = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/restricted-access");
    }
  }, [router]);

  // Utilizamos dos pasos:
  // Paso 1: Información de Cuenta (username, email, password)
  // Paso 2: Información Personal (first_name, last_name, dni, phone_number, birth_date, gender, postal_code)
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
    dni: "",
    phone_number: "",
    postal_code: "",
    gender: "",
    birth_date: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [alert, setAlert] = useState<{
    show: boolean;
    type: "success" | "error" | "info" | "warning";
    message: string;
  }>({
    show: false,
    type: "info",
    message: ""
  });
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Nuevo estado para rastrear el login

  const showAlert = (type: "success" | "error" | "info" | "warning", message: string) => {
    setAlert({
      show: true,
      type,
      message
    });
    setTimeout(() => {
      setAlert({
        show: false,
        type: "info",
        message: ""
      });
    }, 5000);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      if (errors[name]) {
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const validateStep = (step: number) => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    if (step === 1) {
      if (!formData.username.trim()) {
        newErrors.username = "El nombre de usuario es obligatorio";
        isValid = false;
      }
      if (!formData.email.trim()) {
        newErrors.email = "El email es obligatorio";
        isValid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = "Email no válido";
        isValid = false;
      }
      if (!formData.password.trim()) {
        newErrors.password = "La contraseña es obligatoria";
        isValid = false;
      } else if (formData.password.length < 8) {
        newErrors.password = "La contraseña debe tener al menos 8 caracteres";
        isValid = false;
      }
      if (!formData.confirm_password.trim()) {
        newErrors.confirm_password = "La confirmación de la contraseña es obligatoria";
        isValid = false;
      } else if (formData.confirm_password !== formData.password) {
        newErrors.confirm_password = "Las contraseñas no coinciden";
        isValid = false;
      }
    } else if (step === 2) {
      if (!formData.first_name.trim()) {
        newErrors.first_name = "El nombre es obligatorio";
        isValid = false;
      }
      if (!formData.last_name.trim()) {
        newErrors.last_name = "Los apellidos son obligatorios";
        isValid = false;
      }
      if (!formData.dni.trim()) {
        newErrors.dni = "El DNI es obligatorio";
        isValid = false;
      } else if (!/^[0-9]{8}[A-Z]$/.test(formData.dni)) {
        newErrors.dni = "Formato de DNI no válido";
        isValid = false;
      }
      if (
        formData.phone_number.trim() !== "" &&
        !/^\d{9}$/.test(formData.phone_number)
      ) {
        newErrors.phone_number = "Número de teléfono no válido";
        isValid = false;
      }
      if (!formData.birth_date) {
        newErrors.birth_date = "La fecha de nacimiento es obligatoria";
        isValid = false;
      }
      if (!formData.gender) {
        newErrors.gender = "El género es obligatorio";
        isValid = false;
      }
      if (!formData.postal_code.trim()) {
        newErrors.postal_code = "El código postal es obligatorio";
        isValid = false;
      } else if (!/^\d{5}$/.test(formData.postal_code)) {
        newErrors.postal_code = "Código postal no válido (5 dígitos)";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    router.push('/');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!validateStep(currentStep)) {
       showAlert("warning", "Por favor, corrige los errores en el formulario.");
       return; 
    }
    setShowModal(true);
    setIsSubmitting(true); 
    setErrors({}); 
  
    const requestData: Partial<FormData> = { ...formData };
    if (!requestData.phone_number?.trim()) {
      delete requestData.phone_number;
    }
    delete requestData.confirm_password;
  
    try {
  
      const response = await axios.post(
        `${getApiBaseUrl()}/api/app_user/patient/register/`,
        requestData,
        { headers: { "Content-Type": "application/json" } }
      );
  
      if (response.status === 201) {
        try {
          const loginResponse = await axios.post(
            `${getApiBaseUrl()}/api/app_user/login/`,
            { username: formData.username, password: formData.password },
            { headers: { "Content-Type": "application/json" } }
          );
  
          if (loginResponse.status === 200) {
            localStorage.setItem("token", loginResponse.data.access);
            localStorage.setItem("refresh_token", loginResponse.data.refresh);
            setIsLoggedIn(true);
  
          } else {
             showAlert("error", `Registro completado, pero hubo un error al iniciar sesión automáticamente. Por favor, inicia sesión manualmente.`);
             setShowModal(false);
          }
        } catch (loginError) {
            showAlert("error", `Registro completado, pero hubo un error al iniciar sesión automáticamente. Por favor, inicia sesión manualmente.`);
            console.error("Login error after registration:", loginError);

            setShowModal(false);
        }
  
      }
  
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            console.error("Registration error data:", error.response.data);
            const serverErrors = error.response.data;
            const newErrors: { [key: string]: string } = {};
            let generalErrorMessage = "Error en el registro. Verifica los campos.";
            for (const key in serverErrors) {
                if (Array.isArray(serverErrors[key])) {
                    newErrors[key] = serverErrors[key].join(' ');
                    if (['username', 'email', 'password'].includes(key) && currentStep === 2) {
                        setCurrentStep(1);
                    }
                } else if (key === 'detail' || typeof serverErrors[key] === 'string') {
                    generalErrorMessage = serverErrors[key];
                }
            }
            setErrors(newErrors);
            showAlert("error", generalErrorMessage);
  
        } else {
          showAlert("error", "Ocurrió un error inesperado. Inténtalo de nuevo más tarde.");
          console.error("Unexpected registration error:", error);
        }
  
        setShowModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
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
              Registro de Paciente
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Completa el formulario para encontrar fisioterapeutas cerca de ti
            </p>
          </div>
          <div className="bg-white dark:bg-black rounded-xl shadow-xl overflow-hidden">
            {/* Progress Steps */}
            <div className="px-6 pt-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center w-full">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 1
                        ? "bg-[#1E5ACD] text-white"
                        : "bg-gray-200 text-gray-600"
                      }`}
                  >
                    1
                  </div>
                  <div
                    className={`h-1 flex-1 mx-2 ${currentStep >= 2 ? "bg-[#1E5ACD]" : "bg-gray-200"
                      }`}
                  ></div>
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 2
                        ? "bg-[#1E5ACD] text-white"
                        : "bg-gray-200 text-gray-600"
                      }`}
                  >
                    2
                  </div>
                </div>
              </div>
            </div>
              <form onSubmit={handleSubmit} className="p-6">
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4">Información de Cuenta</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <FormField
                          name="username"
                          label="Nombre de usuario"
                          value={formData.username}
                          onChange={handleChange}
                          error={errors.username}
                        />
                      </div>
                      <FormField
                        name="email"
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                      />
                      <FormField
                        name="password"
                        label="Contraseña"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                        <div>
                          <FormField
                            name="confirm_password"
                            label="Confirmar contraseña"
                            type="password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            error={errors.confirm_password}
                          />
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col justify-center h-full">
                          <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Requisitos de contraseña
                          </h3>
                          <ul className="text-xs text-blue-700 space-y-1 ml-7 list-disc">
                            <li>Mínimo 8 caracteres</li>
                            <li>No debe ser similar a tu información personal</li>
                            <li>No debe ser una contraseña común</li>
                            <li>No puede ser únicamente numérica</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">
                    Información Personal
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      name="first_name"
                      label="Nombre"
                      value={formData.first_name}
                      onChange={handleChange}
                      error={errors.first_name}
                    />
                    <FormField
                      name="last_name"
                      label="Apellidos"
                      value={formData.last_name}
                      onChange={handleChange}
                      error={errors.last_name}
                    />
                    <FormField
                      name="dni"
                      label="DNI"
                      value={formData.dni}
                      onChange={handleChange}
                      error={errors.dni}
                      info="Necesitamos tu DNI para verificar tu identidad."
                    />
                    <FormField
                      name="phone_number"
                      label="Número de teléfono"
                      type="tel"
                      required={false}
                      value={formData.phone_number || ""}
                      onChange={handleChange}
                      error={errors.phone_number}
                    />
                    <FormField
                      name="birth_date"
                      label="Fecha de nacimiento"
                      type="date"
                      value={formData.birth_date}
                      onChange={handleChange}
                      error={errors.birth_date}
                    />
                    <FormField
                      name="gender"
                      label="Género"
                      type="select"
                      options={GENDER_OPTIONS}
                      value={formData.gender}
                      onChange={handleChange}
                      error={errors.gender}
                    />
                    <FormField
                      name="postal_code"
                      label="Código Postal"
                      value={formData.postal_code}
                      onChange={handleChange}
                      error={errors.postal_code}
                    />
                  </div>
                </div>
              )}
                <div className="flex justify-between mt-8">
                  {currentStep > 1 ? ( // Mostrar botón "Anterior" solo si no estamos en el primer paso
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-6 py-2 bg-[#05AC9C] text-white font-medium rounded-xl transition-colors hover:bg-[#048F83] flex items-center gap-2"
                    >
                      Anterior
                    </button>
                  ) : (
                     // Placeholder para mantener el botón derecho alineado cuando "Anterior" no está
                     <div aria-hidden="true"></div>
                  )}

                  {currentStep < 2 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="ml-auto px-6 py-2 bg-gradient-to-r from-[#05668D] to-[#0A7487] hover:from-[#0A7487] hover:to-[#05918F] text-white font-medium rounded-xl transition-colors"
                    >
                      Siguiente
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="ml-auto px-6 py-2 bg-gradient-to-r from-[#05668D] to-[#0A7487] hover:from-[#0A7487] hover:to-[#05918F] text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed" // Mejorado estado disabled
                    >
                      {isSubmitting ? (
                         <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                             Registrando...
                         </div>
                       ) : "Completar Registro"}
                    </button>
                  )}
                </div>
              </form>
            </div> {/* Fin de tu div con clase bg-white dark:bg-black... */}
            <div className="text-center py-6 bg-gray-50 dark:bg-neutral-700 border-t border-gray-200 dark:border-neutral-600"> {/* Separado para claridad visual */}
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3"> {/* Estilo ajustado */}
                ¿Ya tienes una cuenta?{" "}
                <button
                  onClick={() => router.push("/login")}
                  className="text-[#1E5ACD] hover:underline font-medium"
                >
                  Iniciar sesión
                </button>
              </p>
              <button
                onClick={() => router.push("/register")} // Asume que /register es la selección de rol
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-2 mx-auto"
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
                  <path d="M19 12H5M12 19l-7-7 7-7" /> {/* Corregido d="" */}
                </svg>
                Volver a selección de rol
              </button>
            </div>

        </div>
      </div> 

      </div> 

      <ConfirmationModal
        isOpen={showModal}
        onClose={handleModalConfirm}
        email={formData.email}
        onConfirm={handleModalConfirm}
      />
    </> 
  );
};

export default PatientRegistrationForm;