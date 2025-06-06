// components/CheckoutForm.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { getApiBaseUrl } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useAppointment } from "@/context/appointmentContext";
import axios from "axios";
import { log } from "console";

interface CheckoutFormProps {
  request: {
    start_time: string;
    end_time: string;
    is_online: boolean;
    service: {
      tipo: string;
      title: string;
      price: number;
      duration: number;
    };
    physiotherapist: number;
    status: string;
    alternatives: string;
  };
  token: string | null;
}

const CheckoutForm = ({ request, token }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [appointmentId, setAppointmentId] = useState<number | null>(null);
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false); // Estado para el modal
  // const effectRan = useRef(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();
  const { state, dispatch } = useAppointment();
  const appointmentData = state.appointmentData;
  const [currentRole, setCurrentRole] = useState("");

  // Puedes acceder al precio así:
  const price = request?.service?.price;

  useEffect(() => {
    if (token) {
      axios
        .get(`${getApiBaseUrl()}/api/app_user/check-role/`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          setCurrentRole(response.data.user_role);
        })
        .catch((error) => {
          console.log("Error fetching data:", error);
        });
    }
  }, [token]);

  async function createAppointment(tokenValue: string | null) {
    if (!token) {
      setShowAuthModal(true);
      return;
    }

    if (currentRole !== "patient") {
      alert("Debes estar registrado como paciente para confirmar la cita.");
      router.push("/register");
      return;
    }
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/appointment/patient/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokenValue,
        },
        body: JSON.stringify({
          start_time: appointmentData.start_time,
          end_time: appointmentData.end_time,
          is_online: appointmentData.is_online,
          service: {
            id: appointmentData?.service.id,
            title: appointmentData?.service.title,
            type: appointmentData?.service.type,
            tipo: appointmentData?.service.tipo,
            price: appointmentData?.service.price,
            duration: appointmentData.service.duration,
            questionaryResponses: appointmentData?.questionaryResponses,
          },
          physiotherapist: appointmentData.physiotherapist,
          status: "booked",
          alternatives: "",
        }),
      });

      const data = await res.json();
      console.log("Respuesta del backend (cita creada):", data);

      if (data.appointment_data.id) {
        // Eliminamos el borrador unificado
        sessionStorage.removeItem("appointmentDraft");
        localStorage.removeItem("physioName");
        dispatch({ type: "DESELECT_SERVICE" });
        setAppointmentId(data.appointment_data.id); // Guardamos el appointment_id
        // const result = await createPayment(tokenValue, data.id); // ⚡ Llamamos a createPayment después de obtener la cita
        if (data.payment_data) {
          console.log("Payment data:", data.payment_data);
          console.log({
            clientSecret: data.payment_data.client_secret,
            paymentId: data.payment_data.payment.id,
          });
          setClientSecret(data.payment_data.client_secret);
          setPaymentId(data.payment_data.payment.id); // Guardamos el payment_id

          return {
            clientSecret: data.payment_data.client_secret,
            paymentId: data.payment_data.payment.id,
            appointmentId: data.appointment_data.id,
          };
        }
      } else {
        setMessage("Error al crear la cita.");
        setLoading(false);
      }
    } catch (error) {
      console.log("Error al crear la cita:", error);
      setMessage("Error al crear la cita.");
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let dataClientSecret = "";
    let dataPaymentId = null;
    let appointmentId = null;

    try {
      const result = await createAppointment(token);
      if (result) {
        dataClientSecret = result.clientSecret;
        dataPaymentId = result.paymentId;
        appointmentId = result.appointmentId;
      }
    } catch (error) {
      console.log("Error al crear la cita:", error);
      setMessage("Error al crear la cita.");
      setLoading(false);
    }
    console.log("client secret", dataClientSecret);
    if (!stripe || !elements || !dataClientSecret || !dataPaymentId || !appointmentId) return;

    // Confirmar el SetupIntent para almacenar el método de pago
    const result = await stripe.confirmCardSetup(dataClientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: "Cliente de Ejemplo",
        },
      },
    });

    if (result.error) {
      axios.delete(
        `${getApiBaseUrl()}/api/appointment/delete/${appointmentId}/`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      setMessage(
        result.error.message || "Error al confirmar el método de pago."
      );
      console.log(result.error.message);
    } else {
      console.log(token);

      // result.setupIntent ahora contiene el payment_method configurado
      // Puedes enviar este payment_method al backend para actualizar el registro del pago
      try {
        const updateRes = await fetch(
          `${getApiBaseUrl()}/api/payments/update-payment-method/${dataPaymentId}/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
              payment_method_id: result.setupIntent.payment_method,
            }),
          }
        );
        const updateData = await updateRes.json();
        console.log("Método de pago actualizado:", updateData);
        setMessage(
          "Método de pago guardado. Se te cobrará 48h antes de la cita."
        );
        setShowModal(true); // Mostrar el modal de éxito
      } catch (error) {
        console.log(
          "Error al actualizar el método de pago en el backend:",
          error
        );
        setMessage("Error al guardar el método de pago.");
      }
    }
    setLoading(false);
  };

  // Opciones de estilo para CardElement
  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
        padding: "10px 14px",
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
    hidePostalCode: true,
  };

  // Función para guardar el borrador unificado y redirigir
  function handleDraftSaveAndRedirect(redirectPath: string) {
    // Clonamos el appointmentData para no mutar el original
    const safeDraft = { ...appointmentData };
    // Eliminamos cualquier info sensible si hace falta
    if (safeDraft.paymentInfo) delete safeDraft.paymentInfo;
    const name = localStorage.getItem("physioName");
    localStorage.removeItem("physioName");
    // Unificamos todo en un solo objeto
    const unifiedDraft = {
      appointmentData: safeDraft,
      draftInProgress: true,
      returnUrl: window.location.pathname,
      // Si quieres guardar también el nombre del fisio (ejemplo):
      physioName: name,
    };

    // Guardamos en una sola entrada del localStorage
    sessionStorage.setItem("appointmentDraft", JSON.stringify(unifiedDraft));
    router.push(redirectPath);
  }

  return (
    <>
      <form onSubmit={handleSubmit} style={formStyles}>
        <div className="flex items-center justify-center ml-7">
          <h2 style={headingStyles}>
            Ingrese los datos de su tarjeta.
          </h2>
          <div className="relative inline-block group ml-3 mb-6">
            <div className="cursor-default">
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
            <div className="absolute mb-1 bottom-full left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-85 transition-opacity duration-300 pointer-events-none">
              <div className="bg-gray-700 text-white text-xs rounded py-2 px-2 w-60">
                Necesita introducir los datos de su tarjeta para confirmar la cita.
                <br />
                <div className="mb-2" />
                El pago se procesará 48 horas antes del comienzo de la cita.
              </div>
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-700 absolute top-full left-1/2 transform -translate-x-1/2"></div>
            </div>
          </div>{" "}
        </div>
        <div style={cardElementContainer}>
          <CardElement options={cardStyle} />
        </div>
        <button
          type="submit"
          disabled={!stripe || loading}
          style={buttonStyles}
        >
          {loading ? "Procesando..." : `Autorizar ${price} €`}
        </button>
        {message && <div style={messageStyles}>{message}</div>}
      </form>
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h2 className="mb-4">¡Cita creada! 🎉</h2>
            {/* <p>Tu cita ha sido creada.</p> */}
            <p>Si el fisioterapeuta la acepta, se cobrará el importe</p>
            <p>de la cita 48 horas antes de su comienzo.</p>
            <button
              className="inline-flex items-center justify-center px-5 py-3 mt-8 mr-3 text-white font-medium rounded-xl bg-gradient-to-r from-[#05AC9C] to-[#0A7487] hover:from-[#049589] hover:to-[#086273] hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
              onClick={async () => {
                try {
                  const response = await fetch(
                    `${getApiBaseUrl()}/api/payments/invoices/pdf/?payment_id=${paymentId}`,
                    {
                      method: "GET",
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );

                  if (!response.ok) {
                    const errorData = await response.json();
                    alert(
                      `Error: ${errorData.error || "No se pudo descargar la factura"
                      }`
                    );
                    return;
                  }

                  // Convertir la respuesta en un blob (archivo descargable)
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `invoice_${paymentId}.pdf`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                } catch (error) {
                  console.log("Error al descargar la factura:", error);
                  alert("Error al descargar la factura.");
                }
              }}
            >
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Descargar Recibo
            </button>
            <button
              className="inline-flex items-center justify-center px-5 py-3 mt-8 text-white font-medium rounded-xl bg-gradient-to-r from-[#1E5ACD] to-[#41B8D5] hover:from-[#1A4EB8] hover:to-[#3AA9C6] hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
              onClick={() => (window.location.href = "/my-appointments")}
            >
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Ir al Calendario
            </button>
          </div>
        </div>
      )}
      {/* Modal de autenticación */}
      {showAuthModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Debes iniciar sesión</h2>
            <p className="mb-4">
              Para confirmar tu cita, por favor inicia sesión o crea una cuenta.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleDraftSaveAndRedirect("/login")}
                className="px-4 py-2 text-white rounded-xl bg-gradient-to-r from-[#05AC9C] to-[#0A7487] hover:from-[#049589] hover:to-[#086273] hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => handleDraftSaveAndRedirect("/register")}
                className="px-4 py-2 text-white rounded-xl bg-gradient-to-r from-[#1E5ACD] to-[#41B8D5] hover:from-[#1A4EB8] hover:to-[#3AA9C6] hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Crear Cuenta
              </button>
              <button
                onClick={() => {
                  // Solo removemos la entrada unificada
                  sessionStorage.removeItem("appointmentDraft");
                  router.push("/");
                }}
                className="px-4 py-3 mt-2 bg-white text-gray-700 font-medium rounded-xl border border-gray-300 hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 inline"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Ejemplo de estilos en línea para el formulario
const formStyles: React.CSSProperties = {
  maxWidth: "500px",
  margin: "0 auto",
  padding: "2rem",
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  backgroundColor: "#fff",
};

const headingStyles: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "1.5rem",
  color: "#32325d",
};

const cardElementContainer: React.CSSProperties = {
  padding: "1rem",
  border: "1px solid #ced4da",
  borderRadius: "4px",
  marginBottom: "1rem",
};

const buttonStyles: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#5469d4",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  fontSize: "16px",
  cursor: "pointer",
};

const messageStyles: React.CSSProperties = {
  marginTop: "1rem",
  textAlign: "center",
  color: "#fa755a",
};

const modalOverlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalContent: React.CSSProperties = {
  background: "white",
  padding: "2rem",
  borderRadius: "8px",
  textAlign: "center",
};

const modalButton: React.CSSProperties = {
  marginTop: "2rem",
  padding: "10px 20px",
  backgroundColor: "#5469d4",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  fontSize: "16px",
  cursor: "pointer",
  marginRight: "10px",
};

export default CheckoutForm;
