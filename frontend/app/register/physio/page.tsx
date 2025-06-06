"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { getApiBaseUrl } from "@/utils/api";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Eye, EyeOff, Info } from "lucide-react";
import Alert from '@/components/ui/Alert';
import IdentityVerificationStep from "@/components/IdentityVerificationStep"; // Asegúrate de tener este componente implementado

// Tipado de los datos del formulario (igual que en tu register)
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

// Opciones de género
const GENDER_OPTIONS = [
  { value: "", label: "Seleccione género" },
  { value: "M", label: "Masculino" },
  { value: "F", label: "Femenino" },
  { value: "O", label: "Otro" },
  { value: "P", label: "Prefiero no decirlo" },
];

// Opciones de comunidad autónoma
const AUTONOMIC_COMMUNITY_OPTIONS = [
  { value: "", label: "Seleccione comunidad" },
  { value: "ANDALUCIA", label: "Andalucía", url: "https://colfisio.org/registro-censo-fisioterapeutas" },
  { value: "ARAGON", label: "Aragón", url: "https://ventanilla.colfisioaragon.org/buscador-colegiados" },
  { value: "ASTURIAS", label: "Asturias", url: "https://www.cofispa.org/censo-colegiados" },
  { value: "BALEARES", label: "Baleares", url: "http://www.colfisiobalear.org/es/area-social-y-ciudadana/profesionales-colegiados/" },
  { value: "CANARIAS", label: "Canarias", url: "https://www.consejo-fisioterapia.org/vu_colegiados.html" },
  { value: "CANTABRIA", label: "Cantabria", url: "https://colfisiocant.org/busqueda-profesionales/" },
  { value: "CASTILLA Y LEON", label: "Castilla y León", url: "https://www.consejo-fisioterapia.org/vu_colegiados.html" },
  { value: "CASTILLA-LA MANCHA", label: "Castilla-La Mancha", url: "https://www.coficam.org/ventanilla-unica/censo-colegial" },
  { value: "CATALUÑA", label: "Cataluña", url: "https://www.fisioterapeutes.cat/es/ciudadanos/profesionales" },
  { value: "COMUNIDAD VALENCIANA", label: "Comunidad Valenciana", url: "https://app.colfisiocv.com/college/collegiatelist/" },
  { value: "EXTREMADURA", label: "Extremadura", url: "https://cofext.org/cms/colegiados.php" },
  { value: "GALICIA", label: "Galicia", url: "https://www.cofiga.org/ciudadanos/colegiados" },
  { value: "LA RIOJA", label: "La Rioja", url: "https://www.coflarioja.org/ciudadanos/listado-de-fisioterapeutas/buscar-colegiados" },
  { value: "MADRID", label: "Madrid", url: "https://cfisiomad.com/#/ext/buscarcolegiado" },
  { value: "MURCIA", label: "Murcia", url: "https://cfisiomurcia.com/buscador-de-colegiados/" },
  { value: "NAVARRA", label: "Navarra", url: "https://www.consejo-fisioterapia.org/vu_colegiados.html" },
  { value: "PAIS VASCO", label: "País Vasco", url: "https://cofpv.org/es/colegiados.asp" },
];

// Carga de Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Icono de check
const CheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

// Icono de estrella
const StarIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// Componente reutilizable para los campos del formulario
interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  type?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  error?: string;
  info?: string;
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
  ...rest
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
          <div className="relative inline-block group">
            <div className="cursor-help inline-flex align-middle ml-1">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#1C274C"
                  strokeWidth="1.5"
                />
                <path
                  d="M12 17V11"
                  stroke="#1C274C"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle
                  cx="1"
                  cy="1"
                  r="1"
                  transform="matrix(1 0 0 -1 11 9)"
                  fill="#1C274C"
                />
              </svg>
            </div>
            <div className="absolute bottom-full left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[100] mb-2">
              <div className="bg-gray-700 text-white text-xs rounded py-2 px-3 w-60 shadow-lg">
                {info}
              </div>
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-700 absolute top-full left-2 transform"></div>
            </div>
          </div>
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

// Componente para el pago (Paso 6)
interface StripePaymentFormProps {
  amount: number;
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

      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });
      if (stripeError) {
        setError(stripeError.message || "Error de pago");
        setProcessing(false);
        return;
      }

      const response = await axios.post(`${getApiBaseUrl()}/api/app_user/physio/payment/`, {
        payment_method_id: paymentMethod?.id,
        amount,
        currency: "eur",
      });

      if (response.data.success) {
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/restricted-access");
    }
  }, [router]);
  
  const [currentStep, setCurrentStep] = useState<number>(1);
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
    autonomic_community: "",
    plan: "gold",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

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
    setTimeout(() => {
      setAlert({
        show: false,
        type: "info",
        message: ""
      });
    }, 5000);
  };

  React.useEffect(() => {
    setIsClient(true);
  }, []);

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
      // Validar, por ejemplo, el número colegiado
    } else if (step === 4) {
      if (!formData.plan) {
        newErrors.plan = "Selecciona un plan para continuar";
        isValid = false;
      }
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Validar datos en backend antes de pasar a la verificación (Paso 5)
  const handleProceedToVerification = async () => {
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
        setValidationMessage("Todos los datos son correctos. Proceda con la verificación.");
        setCurrentStep(5); // Paso 5: Verificación de identidad
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

  // Registro final tras el pago (Paso 6)
  const registerPhysio = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${getApiBaseUrl()}/api/app_user/physio/register/`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        showAlert("success", "¡Registro exitoso! Iniciando sesión...");
        // Auto login
        const loginResponse = await axios.post(
          `${getApiBaseUrl()}/api/app_user/login/`,
          { username: formData.username, password: formData.password },
          { headers: { "Content-Type": "application/json" } }
        );

        if (loginResponse.status === 200) {
          if (isClient) {
            localStorage.setItem("token", loginResponse.data.access);
            setTimeout(() => {
              router.push("/");
            }, 1000);
          }
        }
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        showAlert("error", "Error en el registro. Por favor, verifica tus datos.");
        setErrors(error.response.data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentStep < 4) {
      if (validateStep(currentStep)) {
        setCurrentStep(currentStep + 1);
      }
    } else if (currentStep === 4) {
      handleProceedToVerification();
    }
  };

  const handlePaymentSuccess = async () => {
    await registerPhysio();
  };

  const getMaxBirthDate = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split('T')[0]; // formato YYYY-MM-DD
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
              Registro de Fisioterapeuta
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Completa el formulario para comenzar a ofrecer tus servicios
            </p>
          </div>

          <div className="bg-white dark:bg-black rounded-xl shadow-xl overflow-hidden">
            {/* Progress Steps - 6 pasos */}
            <div className="px-6 pt-6">
              <div className="flex items-center w-full mb-8">
                {/* Paso 1 */}
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
                {/* Paso 2 */}
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= 2
                      ? "bg-[#1E5ACD] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  2
                </div>
                <div
                  className={`h-1 flex-1 mx-2 ${
                    currentStep >= 3 ? "bg-[#1E5ACD]" : "bg-gray-200"
                  }`}
                ></div>
                {/* Paso 3 */}
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= 3
                      ? "bg-[#1E5ACD] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  3
                </div>
                <div
                  className={`h-1 flex-1 mx-2 ${
                    currentStep >= 4 ? "bg-[#1E5ACD]" : "bg-gray-200"
                  }`}
                ></div>
                {/* Paso 4 */}
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= 4
                      ? "bg-[#1E5ACD] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  4
                </div>
                <div
                  className={`h-1 flex-1 mx-2 ${
                    currentStep >= 5 ? "bg-[#1E5ACD]" : "bg-gray-200"
                  }`}
                ></div>
                {/* Paso 5 */}
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= 5
                      ? "bg-[#1E5ACD] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  5
                </div>
                <div
                  className={`h-1 flex-1 mx-2 ${
                    currentStep >= 6 ? "bg-[#1E5ACD]" : "bg-gray-200"
                  }`}
                ></div>
                {/* Paso 6 */}
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= 6
                      ? "bg-[#1E5ACD] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  6
                </div>
              </div>
            </div>

            {/* Formulario pasos 1 a 4 */}
            {currentStep < 5 && (
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
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Requisitos de contraseña
                          </h3>
                          <ul className="text-xs text-blue-700 space-y-1 ml-7 list-disc">
                            <li>Mínimo 8 caracteres</li>
                            <li>
                              No debe ser similar a tu información personal
                            </li>
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
                        info="Necesitamos su DNI para verificar su identidad y garantizar la seguridad de su cuenta. Esta información se maneja de forma segura según nuestra política de privacidad."
                      />
                      <FormField
                        name="phone_number"
                        label="Número de teléfono"
                        type="tel"
                        value={formData.phone_number}
                        onChange={handleChange}
                        error={errors.phone_number}
                      />
                      <div className="mb-4 relative">
                        <label
                          htmlFor="birth_date"
                          className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
                        >
                          Fecha de nacimiento
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1E5ACD] dark:bg-neutral-800 dark:text-white"
                          type="date"
                          name="birth_date"
                          id="birth_date"
                          value={formData.birth_date}
                          onChange={handleChange}
                          max={getMaxBirthDate()}
                          min={"1900-01-01"}
                        />
                        {errors.birth_date && (
                          <span className="error">{errors.birth_date}</span>
                        )}
                      </div>
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

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4">
                      Información Profesional
                    </h2>
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
                      {formData.autonomic_community && (
                        <div className="md:col-span-2 text-center -mt-10">
                          <a
                            href={
                              AUTONOMIC_COMMUNITY_OPTIONS.find(
                                (c) => c.value === formData.autonomic_community
                              )?.url || "#"
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center gap-1"
                          >
                            <Info size={14} />
                            Verificar datos en el colegio oficial de{" "}
                            {
                              AUTONOMIC_COMMUNITY_OPTIONS.find(
                                (c) => c.value === formData.autonomic_community
                              )?.label
                            }
                          </a>
                        </div>
                      )}
                      <FormField
                        name="postal_code"
                        label="Código Postal"
                        value={formData.postal_code}
                        onChange={handleChange}
                        error={errors.postal_code}
                      />
                      {/* Checkbox de Términos y Condiciones */}
                      <div className="mb-4 relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          id="terms"
                          checked={acceptedTerms}
                          onChange={(e) => setAcceptedTerms(e.target.checked)}
                          className="w-5 h-5 accent-[#1E5ACD] cursor-pointer mb-0"
                        />
                        <label htmlFor="terms" className="text-sm text-gray-600 mb-0 ml-3">
                          Acepto los{" "}
                          <a
                            href="/terms"
                            className="text-[#1E5ACD] hover:underline font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            términos y condiciones
                          </a>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-[#1E5ACD] text-center">
                      Selecciona tu Plan
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                      {/* Fisio Blue */}
                      <label
                        className={`relative cursor-pointer p-6 rounded-xl border-2 transition-all ${
                          formData.plan === "blue"
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
                              onChange={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  plan: "blue",
                                }))
                              }
                              className="w-5 h-5 text-[#1E5ACD] border-2 border-gray-300 focus:ring-[#1E5ACD]"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-baseline justify-between">
                              <h3 className="text-xl font-semibold text-[#1E5ACD]">
                                Fisio Blue
                              </h3>
                              <p className="text-xl font-high">
                                17,99€
                                <span className="text-sm text-gray-500">
                                  /mes
                                </span>
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
                        className={`relative cursor-pointer p-6 rounded-xl border-2 transition-all ${
                          formData.plan === "gold"
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
                              onChange={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  plan: "gold",
                                }))
                              }
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
                                24,99€
                                <span className="text-sm text-gray-500">
                                  /mes
                                </span>
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
                      <p className="text-red-500 text-center mt-4">
                        ⚠️ {errors.plan}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  {currentStep > 1 && currentStep < 5 && (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-6 py-2 bg-[#05AC9C] text-white font-medium rounded-xl transition-colors hover:bg-[#048F83] flex items-center gap-2"
                    >
                      Anterior
                    </button>
                  )}
                  {currentStep == 3 && (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      disabled={!acceptedTerms}
                      className={`"ml-auto px-6 py-2 text-white font-medium rounded-xl ${
                        !acceptedTerms
                          ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400"
                          : "bg-gradient-to-r from-[#05668D] to-[#0A7487] hover:from-[#0A7487] hover:to-[#05918F] transition-colors disabled:from-blue-300 disabled:to-blue-400"
                      }`}
                    >
                      Siguiente
                    </button>
                  )}
                  {currentStep < 4 && currentStep !== 3 && (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="ml-auto px-6 py-2 bg-gradient-to-r from-[#05668D] to-[#0A7487] hover:from-[#0A7487] hover:to-[#05918F] text-white font-medium rounded-xl transition-colors"
                    >
                      Siguiente
                    </button>
                  )}
                  {currentStep === 4 && (
                    <button
                      type="button"
                      onClick={handleProceedToVerification}
                      className="ml-auto px-6 py-2 bg-gradient-to-r from-[#05668D] to-[#0A7487] hover:from-[#0A7487] hover:to-[#05918F] text-white font-medium rounded-xl transition-colors"
                    >
                      Continuar a Verificación
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
                    className={`text-center mt-4 ${
                      validationMessage.toLowerCase().includes("corrige") ||
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

            {/* Paso 5: Verificación de Identidad */}
            {currentStep === 5 && (
              <IdentityVerificationStep
                formData={formData}
                onVerificationSuccess={() => setCurrentStep(6)}
              />
            )}

            {/* Paso 6: Pago */}
            {currentStep === 6 && (
              <div className="p-6">
                <Elements stripe={stripePromise}>
                  <StripePaymentForm
                    amount={formData.plan === "blue" ? 1799 : 2499}
                    onPaymentSuccess={handlePaymentSuccess}
                  />
                </Elements>
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
    </div>
  );
};

export default PhysioSignUpForm;
