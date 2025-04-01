"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { getApiBaseUrl } from "@/utils/api";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Eye, EyeOff, Info } from "lucide-react";

// Tipado de los datos del formulario
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

// Opciones de género (sin valor por defecto)
const GENDER_OPTIONS = [
  { value: "", label: "Seleccione género" },
  { value: "M", label: "Masculino" },
  { value: "F", label: "Femenino" },
  { value: "O", label: "Otro" },
  { value: "ND", label: "Prefiero no decirlo" },
];

// Opciones de comunidad autónoma
const AUTONOMIC_COMMUNITY_OPTIONS = [
  { value: "ANDALUCIA", label: "Andalucía" },
  { value: "ARAGON", label: "Aragón" },
  { value: "ASTURIAS", label: "Asturias" },
  { value: "BALEARES", label: "Baleares" },
  { value: "CANARIAS", label: "Canarias" },
  { value: "CANTABRIA", label: "Cantabria" },
  { value: "CASTILLA Y LEON", label: "Castilla y León" },
  { value: "CASTILLA-LA MANCHA", label: "Castilla-La Mancha" },
  { value: "CATALUÑA", label: "Cataluña" },
  { value: "EXTREMADURA", label: "Extremadura" },
  { value: "GALICIA", label: "Galicia" },
  { value: "MADRID", label: "Madrid" },
  { value: "MURCIA", label: "Murcia" },
  { value: "NAVARRA", label: "Navarra" },
  { value: "PAIS VASCO", label: "País Vasco" },
  { value: "LA RIOJA", label: "La Rioja" },
  { value: "COMUNIDAD VALENCIANA", label: "Comunidad Valenciana" },
];

// Carga de Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Icono de check (para las listas)
const CheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

// Icono de estrella (para destacar ventajas)
const StarIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// Componente reutilizable para los campos del formulario
interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  error?: string;
  info?: string; // dato opcional para mostrar botón de info
}

const FormField = ({
  name,
  label,
  type = "text",
  options = [],
  required = true,
  value,
  onChange,
  error,
  info,
}: FormFieldProps) => {
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
                <Eye className="text-blue-600" size={20} />
              ) : (
                <EyeOff className="text-blue-600" size={20} />
              )}
            </button>
          )}
        </div>
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

// Componente para el pago (paso 5)
interface StripePaymentFormProps {
  amount: number; // en céntimos
  onPaymentSuccess: () => Promise<void>;
}

const StripePaymentForm = ({ amount, onPaymentSuccess }: StripePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setError(null);
    setProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError("No se encontró el elemento de tarjeta.");
        setProcessing(false);
        return;
      }

      // Crea método de pago
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });
      if (stripeError) {
        setError(stripeError.message || "Error de pago");
        setProcessing(false);
        return;
      }

      // Llamada a tu endpoint de pago
      const response = await axios.post(`${getApiBaseUrl()}/api/app_user/physio/payment/`, {
        payment_method_id: paymentMethod?.id,
        amount,
        currency: "eur",
      });

      if (response.data.success) {
        // Esperamos a que se complete el registro en el padre
        await onPaymentSuccess();
      } else {
        setError("El pago no fue exitoso");
      }
    } catch (err: any) {
      setError("Error procesando el pago: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#1E5ACD] text-center">
        Pago seguro con Stripe
      </h2>

      <p className="text-center text-gray-700 dark:text-gray-300">
        Estás a punto de pagar <strong>{(amount / 100).toFixed(2)} €</strong> al mes.
      </p>

      {processing && (
        <p className="text-center text-blue-600 mb-2">
          Procesando pago y validando datos...
        </p>
      )}

      <form onSubmit={handlePaymentSubmit} className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": { color: "#aab7c4" },
                },
                invalid: { color: "#9e2146" },
              },
            }}
            className="border border-gray-300 p-3 rounded-md"
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}

          <button
            type="submit"
            disabled={!stripe || processing}
            className="w-full mt-6 bg-[#1E5ACD] hover:bg-[#1848A3] text-white font-medium py-2 rounded-md transition-colors disabled:opacity-50"
          >
            {processing ? "Procesando..." : "Pagar ahora"}
          </button>
        </div>
      </form>
    </div>
  );
};

const PhysioSignUpForm = () => {
  const router = useRouter();

  // currentStep: 1→2→3→4→5
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Datos del formulario (se agregó confirm_password y se puso género vacío)
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
    collegiate_number: "",
    autonomic_community: "MADRID",
    plan: "gold",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Manejo de cambios en los inputs
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors]
  );

  // Validación por paso
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
      } else if (formData.confirm_password.length < 8) {
        newErrors.confirm_password = "La contraseña debe tener al menos 8 caracteres";
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
      if (!formData.phone_number.trim()) {
        newErrors.phone_number = "El teléfono es obligatorio";
        isValid = false;
      } else if (!/^\d{9}$/.test(formData.phone_number)) {
        newErrors.phone_number = "Número de teléfono no válido";
        isValid = false;
      }
      if (!formData.birth_date.trim()) {
        newErrors.birth_date = "La fecha de nacimiento es obligatoria";
        isValid = false;
      }
      if (!formData.gender) {
        newErrors.gender = "El género es obligatorio";
        isValid = false;
      }
    } else if (step === 3) {
      // Ejemplo: podrías validar si el número colegiado no está vacío (se deja sencillo)
    } else if (step === 4) {
      if (!formData.plan) {
        newErrors.plan = "Selecciona un plan para continuar";
        isValid = false;
      }
    }
    setErrors(newErrors);
    return isValid;
  };

  // Avanzar al siguiente paso
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Retroceder al paso anterior
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Validar datos en backend antes de ir al pago (paso 5)
  const handleProceedToPayment = async () => {
    // Validamos 1, 2, 4 (y 3 si lo deseas) antes de pasar
    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
      setValidationMessage("Corrige los errores antes de proceder.");
      return;
    }
    setIsValidating(true);
    try {
      const response = await axios.post(
        `${getApiBaseUrl()}/api/app_user/physio/validate/`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data.valid) {
        setValidationMessage("Todos los datos son correctos. Proceda con el pago.");
        setCurrentStep(5);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        setErrors(error.response.data);
        setValidationMessage("Hay errores en los datos, corrígelos antes de proceder.");
      }
    } finally {
      setIsValidating(false);
    }
  };

  // Registro final tras el pago
  const registerPhysio = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${getApiBaseUrl()}/api/app_user/physio/register/`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 201) {
        // Login automático
        const loginResponse = await axios.post(
          `${getApiBaseUrl()}/api/app_user/login/`,
          { username: formData.username, password: formData.password },
          { headers: { "Content-Type": "application/json" } }
        );
        if (loginResponse.status === 200) {
          if (isClient) {
            localStorage.setItem("token", loginResponse.data.access);
            router.push("/");
          }
        }
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        setErrors(error.response.data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Maneja el submit en pasos 1-4
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentStep < 4) {
      if (validateStep(currentStep)) {
        setCurrentStep(currentStep + 1);
      }
    } else if (currentStep === 4) {
      handleProceedToPayment();
    }
  };

  // Llamado desde el formulario de pago (paso 5) cuando el pago es exitoso
  const handlePaymentSuccess = async () => {
    await registerPhysio();
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
          <h1 className="text-3xl font-bold text-[#1E5ACD]">Registro de Fisioterapeuta</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Completa el formulario para comenzar a ofrecer tus servicios
          </p>
        </div>

        <div className="bg-white dark:bg-black rounded-xl shadow-xl overflow-hidden">
          {/* Progress Steps - 5 pasos */}
          <div className="px-6 pt-6">
            <div className="flex items-center w-full mb-8">
              {/* Paso 1 */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 1 ? "bg-[#1E5ACD] text-white" : "bg-gray-200 text-gray-600"
                  }`}
              >
                1
              </div>
              <div
                className={`h-1 flex-1 mx-2 ${currentStep >= 2 ? "bg-[#1E5ACD]" : "bg-gray-200"
                  }`}
              ></div>

              {/* Paso 2 */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 2 ? "bg-[#1E5ACD] text-white" : "bg-gray-200 text-gray-600"
                  }`}
              >
                2
              </div>
              <div
                className={`h-1 flex-1 mx-2 ${currentStep >= 3 ? "bg-[#1E5ACD]" : "bg-gray-200"
                  }`}
              ></div>

              {/* Paso 3 */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 3 ? "bg-[#1E5ACD] text-white" : "bg-gray-200 text-gray-600"
                  }`}
              >
                3
              </div>
              <div
                className={`h-1 flex-1 mx-2 ${currentStep >= 4 ? "bg-[#1E5ACD]" : "bg-gray-200"
                  }`}
              ></div>

              {/* Paso 4 */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 4 ? "bg-[#1E5ACD] text-white" : "bg-gray-200 text-gray-600"
                  }`}
              >
                4
              </div>
              <div
                className={`h-1 flex-1 mx-2 ${currentStep >= 5 ? "bg-[#1E5ACD]" : "bg-gray-200"
                  }`}
              ></div>

              {/* Paso 5 */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 5 ? "bg-[#1E5ACD] text-white" : "bg-gray-200 text-gray-600"
                  }`}
              >
                5
              </div>
            </div>
          </div>

          {/* Formulario pasos 1 a 4 */}
          {currentStep < 5 && (
            <form onSubmit={handleSubmit} className="p-6">
              {/* Paso 1: Cuenta */}
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
                    <FormField
                      name="confirm_password"
                      label="Confirmar contraseña"
                      type="password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      error={errors.confirm_password}
                    />
                  </div>
                </div>
              )}

              {/* Paso 2: Personal */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Información Personal</h2>
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
                  </div>
                </div>
              )}

              {/* Paso 3: Profesional */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Información Profesional</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      name="collegiate_number"
                      label="Número Colegiado"
                      value={formData.collegiate_number}
                      onChange={handleChange}
                      error={errors.collegiate_number}
                    />
                    <FormField
                      name="autonomic_community"
                      label="Comunidad Autónoma"
                      type="select"
                      options={AUTONOMIC_COMMUNITY_OPTIONS}
                      value={formData.autonomic_community}
                      onChange={handleChange}
                      error={errors.autonomic_community}
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

              {/* Paso 4: Plan */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-[#1E5ACD] text-center">
                    Selecciona tu Plan
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {/* Fisio Blue */}
                    <label
                      className={`relative cursor-pointer p-6 rounded-xl border-2 transition-all ${formData.plan === "blue"
                          ? "border-[#1E5ACD] bg-blue-50 dark:bg-blue-900/30"
                          : "border-gray-200 hover:border-blue-200 dark:border-neutral-700 dark:hover:border-blue-600"
                        }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1">
                          <input
                            type="radio"
                            name="plan"
                            value="blue"
                            checked={formData.plan === "blue"}
                            onChange={() => setFormData((prev) => ({ ...prev, plan: "blue" }))}
                            className="w-5 h-5 text-[#1E5ACD] border-2 border-gray-300 focus:ring-[#1E5ACD]"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline justify-between">
                            <h3 className="text-xl font-semibold text-[#1E5ACD]">
                              Fisio Blue
                            </h3>
                            <p className="text-xl font-high">
                              17,99€<span className="text-sm text-gray-500">/mes</span>
                            </p>
                          </div>
                          <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-300">
                            <li className="flex items-center gap-2">
                              <CheckIcon className="w-5 h-5 text-green-500" />
                              Videollamadas con todas las herramientas
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckIcon className="w-5 h-5 text-green-500" />
                              Seguimiento del paciente
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckIcon className="w-5 h-5 text-green-500" />
                              Chat integrado
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckIcon className="w-5 h-5 text-green-500" />
                              Subir y compartir vídeos (hasta 15)
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckIcon className="w-5 h-5 text-green-500" />
                              Soporte técnico limitado
                            </li>
                          </ul>
                        </div>
                      </div>
                    </label>

                    {/* Fisio Gold */}
                    <label
                      className={`relative cursor-pointer p-6 rounded-xl border-2 transition-all ${formData.plan === "gold"
                          ? "border-amber-400 bg-amber-50 dark:bg-amber-900/30"
                          : "border-gray-200 hover:border-amber-200 dark:border-neutral-700 dark:hover:border-amber-600"
                        }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1">
                          <input
                            type="radio"
                            name="plan"
                            value="gold"
                            checked={formData.plan === "gold"}
                            onChange={() => setFormData((prev) => ({ ...prev, plan: "gold" }))}
                            className="w-5 h-5 text-amber-500 border-2 border-gray-300 focus:ring-amber-500"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline justify-between">
                            <div className="flex items-center gap-2">
                              <h3 className="text-xl font-semibold text-amber-600">
                                Fisio Gold
                              </h3>
                              <h3 className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">
                                MÁS POPULAR
                              </h3>
                            </div>
                            <p className="text-xl font-high">
                              24,99€<span className="text-sm text-gray-500">/mes</span>
                            </p>
                          </div>
                          <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-300">
                            <li className="flex items-center gap-2">
                              <CheckIcon className="w-5 h-5 text-green-500" />
                              Todas las ventajas de Fisio Blue
                            </li>
                            <li className="flex items-center gap-2">
                              <StarIcon className="w-4 h-4 text-amber-500" />
                              Mayor alcance
                            </li>
                            <li className="flex items-center gap-2">
                              <StarIcon className="w-4 h-4 text-amber-500" />
                              Tick de verificación
                            </li>
                            <li className="flex items-center gap-2">
                              <StarIcon className="w-4 h-4 text-amber-500" />
                              Subir y compartir vídeos (hasta 30)
                            </li>
                            <li className="flex items-center gap-2">
                              <StarIcon className="w-4 h-4 text-amber-500" />
                              Soporte técnico personalizado
                            </li>
                          </ul>
                        </div>
                      </div>
                    </label>
                  </div>

                  {errors.plan && (
                    <p className="text-red-500 text-center mt-4">⚠️ {errors.plan}</p>
                  )}
                </div>
              )}

              <div className="flex justify-between mt-8">
                {currentStep > 1 && currentStep < 5 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Anterior
                  </button>
                )}
                {/* Botón Siguiente (pasos 1-3) */}
                {currentStep < 4 && (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="ml-auto px-6 py-2 bg-[#1E5ACD] hover:bg-[#1848A3] text-white font-medium rounded-md transition-colors"
                  >
                    Siguiente
                  </button>
                )}
                {/* Botón para proceder al pago (paso 4) */}
                {currentStep === 4 && (
                  <button
                    type="button"
                    onClick={handleProceedToPayment}
                    className="ml-auto px-6 py-2 bg-[#1E5ACD] hover:bg-[#1848A3] text-white font-medium rounded-md transition-colors"
                  >
                    Continuar al Pago
                  </button>
                )}
              </div>

              {isValidating && (
                <p className="text-center text-blue-600 mt-4">
                  Validando datos, por favor espere...
                </p>
              )}
              {validationMessage && !isValidating && (
                <p
                  className={`text-center mt-4 ${validationMessage.toLowerCase().includes("corrige") ||
                      validationMessage.toLowerCase().includes("errores")
                      ? "text-red-600"
                      : "text-green-600"
                    }`}
                >
                  {validationMessage}
                </p>
              )}
            </form>
          )}

          {/* Paso 5: Pago */}
          {currentStep === 5 && (
            <div className="p-6">
              <Elements stripe={stripePromise}>
                <StripePaymentForm
                  amount={formData.plan === "blue" ? 1799 : 2499} // en céntimos
                  onPaymentSuccess={handlePaymentSuccess}
                />
              </Elements>

              {/* Mientras se está registrando al fisio */}
              {isSubmitting && (
                <p className="text-center text-blue-600 mt-4">
                  Terminando de registrar tus datos...
                </p>
              )}
            </div>
          )}
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
            Volver a selección de rol
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhysioSignUpForm;