"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { getApiBaseUrl } from "@/utils/api";

interface FormData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  dni: string;
  phone_number: string;
  postal_code: string;
  gender: string;
  birth_date: string;
}

const GENDER_OPTIONS = [
  { value: "M", label: "Masculino" },
  { value: "F", label: "Femenino" },
  { value: "O", label: "Otro" },
];

// Componente reutilizable para los campos del formulario
const FormField = ({
  name,
  label,
  type = "text",
  options = [],
  required = true,
  value,
  onChange,
  error,
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
}) => (
  <div className="mb-4">
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
    >
      {label} {required && <span className="text-red-500">*</span>}
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
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1E5ACD] dark:bg-neutral-800 dark:text-white"
      />
    )}

    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const PatientRegistrationForm = () => {
  const router = useRouter();
  // Utilizamos dos pasos:
  // Paso 1: Información de Cuenta (username, email, password)
  // Paso 2: Información Personal (first_name, last_name, dni, phone_number, birth_date, gender, postal_code)
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    dni: "",
    phone_number: "",
    postal_code: "",
    gender: "M",
    birth_date: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Memorizar la función para evitar recrearla en cada render
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
      if (!formData.phone_number.trim()) {
        newErrors.phone_number = "El teléfono es obligatorio";
        isValid = false;
      } else if (!/^\d{9}$/.test(formData.phone_number)) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await axios.post(
        `${getApiBaseUrl()}/api/app_user/patient/register/`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 201) {
        const loginResponse = await axios.post(
          `${getApiBaseUrl()}/api/app_user/login/`,
          {
            username: formData.username,
            password: formData.password,
          },
          { headers: { "Content-Type": "application/json" } }
        );
        if (loginResponse.status === 200) {
          if (isClient) {
            localStorage.setItem("token", loginResponse.data.access);
            router.push("/patient-management/profile");
          } else {
            console.error("Error al iniciar sesión", loginResponse.data);
          }
        } else {
          console.error("Error al registrar usuario", response.data);
          setErrors(response.data);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        if (responseData) {
          console.log("Error en el registro", responseData);
          setErrors(responseData);

          // Verificar si hay errores en campos del paso 1 y redirigir a ese paso
          if (currentStep > 1) {
            const step1Fields = ["username", "email", "password"];
            const hasStep1Error = step1Fields.some(
              (field) => responseData[field]
            );
            if (hasStep1Error) {
              setCurrentStep(1);
            }
          }
        }
      } else {
        console.error("Error inesperado:", error);
        setErrors({ general: "Ocurrió un error inesperado" });
      }
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
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= 1
                      ? "bg-[#1E5ACD] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  1
                </div>
                <div
                  className={`h-1 flex-1 mx-2 ${
                    currentStep >= 2 ? "bg-[#1E5ACD]" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= 2
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
                <h2 className="text-xl font-semibold mb-4">
                  Información de Cuenta
                </h2>
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
                  />
                  <FormField
                    name="phone_number"
                    label="Número de teléfono"
                    type="tel"
                    value={formData.phone_number}
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
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Anterior
                </button>
              )}

              {currentStep < 2 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="ml-auto px-6 py-2 bg-[#1E5ACD] hover:bg-[#1848A3] text-white font-medium rounded-md transition-colors"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-auto px-6 py-2 bg-[#1E5ACD] hover:bg-[#1848A3] text-white font-medium rounded-md transition-colors disabled:bg-blue-300"
                >
                  {isSubmitting ? "Registrando..." : "Completar Registro"}
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-600 dark:text-gray-400">
            ¿Ya tienes una cuenta?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-[#1E5ACD] hover:underline font-medium"
            >
              Iniciar sesión
            </button>
          </p>
          <button
            onClick={() => router.push("/register")}
            className="mt-4 text-gray-500 hover:text-gray-700 flex items-center gap-2 mx-auto"
          >
            <svg
              xmlns="www.w3.org/2000/svg"
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
            Volver a selección de rol
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistrationForm;
