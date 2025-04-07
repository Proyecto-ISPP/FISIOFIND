"use client";

import { getApiBaseUrl } from "@/utils/api";
import { useEffect, useState } from "react";
import { BsStar, BsStarHalf, BsStarFill } from "react-icons/bs";
import StarRating from "./StarRating";
import styles from "@/components/ratings.module.css";
import { GradientButton } from "./gradient-button";
import axios from "axios";

const ModalRating = () => {
  const [input, setInput] = useState({ comment: "", rating: -1 });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No se ha encontrado el token de autenticación");
      window.location.href = "/login";
    }

    const fetchUserRole = async () => {
      try {
        // Obtener el rol del usuario
        const roleResponse = await axios.get(
          `${getApiBaseUrl()}/api/app_user/check-role/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const userRole = roleResponse.data.user_role;
        
        setCurrentRole(userRole);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        window.location.href = "/";
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  useEffect(() => {
    if (currentRole === "physiotherapist") {
      console.log("Redirigiendo a la página principal...");
      const timer = setTimeout(() => {
        window.location.href = "/";
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentRole]);

  const submitHandler = async () => {
    if (input.rating < 0) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se ha encontrado el token de autenticación");
      }

      const response = await fetch(
        `${getApiBaseUrl()}/api/appointment_ratings/last_finished/create/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            score: input.rating,
            comment: input.comment,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al enviar la valoración");
      }
      await response.json();
      setSubmitted(true); // Marca como enviado
    } catch (error) {
      alert(error.message || "Error al enviar la valoración");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="sm:w-96 max-lg:w-80 mb-8 p-6 bg-white rounded-lg shadow-lg">
        {currentRole === "physiotherapist" && (
          <p className={styles.errorMessage}>
            Serás redirigido a la página principal.
          </p>
        )}
        {currentRole === "patient" && (
          <>
            <h2 className="mb-3 font-bold">Valora esta cita</h2>
            {submitted && (
              <p className={styles.errorMessage}>
                ¡Muchas gracias por tu opinión!
                <br />
                Serás redirigido a la página principal.
              </p>
            )}
            {!submitted && (
              <>
                <div className={styles.starsContainer}>
                  <StarRating
                    size={30}
                    rating={input.rating}
                    setRating={(val) => setInput({ ...input, rating: val })}
                  />
                </div>
                <textarea
                  className={styles.opinionInput}
                  placeholder="Deja un comentario (opcional)..."
                  value={input.comment}
                  onChange={(e) =>
                    setInput({ ...input, comment: e.target.value })
                  }
                />
                <div
                  className={styles.formButtons}
                  style={{ justifyContent: "space-between" }}
                >
                  <GradientButton
                    variant="grey"
                    onClick={() => (window.location.href = "/")}
                  >
                    Volver al inicio
                  </GradientButton>
                  <GradientButton variant="create" onClick={submitHandler}>
                    Enviar valoración
                  </GradientButton>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ModalRating;
