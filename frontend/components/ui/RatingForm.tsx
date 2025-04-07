"use client";

import { getApiBaseUrl } from "@/utils/api";
import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import styles from "@/components/ratings.module.css";
import { GradientButton } from "./gradient-button";
import axios from "axios";

interface RatingData {
  score: number;
  comment: string;
  // Agrega otros campos que quieras mostrar
}

const ModalRating = ({ closeModal, roomCode }: { closeModal: () => void; roomCode: string }) => {
  const [input, setInput] = useState({ comment: "", rating: -1 });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [existingRating, setExistingRating] = useState<RatingData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No se ha encontrado el token de autenticación");
      window.location.href = "/login";
      return;
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
        setCurrentRole(roleResponse.data.user_role);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  // Llamada al back para comprobar si ya existe valoración para el room
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios
      .get(`${getApiBaseUrl()}/api/appointment_ratings/check-room-rating/${roomCode}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Si el endpoint devuelve datos de la valoración, la guardamos en el estado
        if (response.data && response.data.rating_exists !== false) {
          setExistingRating(response.data);
        }
      })
      .catch((error) => {
        console.error("Error checking existing rating:", error);
      });
  }, [roomCode]);

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        closeModal();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const submitHandler = async () => {
    if (input.rating < 0) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se ha encontrado el token de autenticación");
      }
      const response = await fetch(
        `${getApiBaseUrl()}/api/appointment_ratings/room/${roomCode}/`,
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
      setSubmitted(true);
      // Después de enviar, actualizamos el estado para reflejar la valoración
      setExistingRating({ score: input.rating, comment: input.comment });
    } catch (error: any) {
      alert(error.message || "Error al enviar la valoración");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sm:w-96 max-lg:w-80 p-6 bg-white shadow-lg" style={{ borderRadius: "10px" }}>
      {currentRole === "patient" && (
        <>
          <h2 className="mb-3 font-bold text-center">
            {existingRating ? "Valoración enviada" : "Valora esta cita"}
          </h2>
          {existingRating ? (
            <div>
              <p className="text-center">
                Ya has valorado esta cita con un <strong>{existingRating.score} / 5</strong>.
              </p>
              {existingRating.comment && (
                <p className="mt-2 text-center italic">Comentario: {existingRating.comment}</p>
              )}
              <div className={styles.formButtons} style={{ justifyContent: "center", marginTop: "1rem" }}>
                <GradientButton variant="grey" onClick={() => closeModal()}>
                  Cerrar
                </GradientButton>
              </div>
            </div>
          ) : (
            <>
              {submitted && (
                <p className={styles.errorMessage}>
                  ¡Muchas gracias por tu opinión!
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
                  <div className={styles.formButtons} style={{ justifyContent: "space-between" }}>
                    <GradientButton variant="grey" onClick={() => closeModal()}>
                      Cancelar
                    </GradientButton>
                    <GradientButton variant="create" onClick={submitHandler} disabled={isLoading}>
                      {isLoading ? "Enviando..." : "Enviar valoración"}
                    </GradientButton>
                  </div>
                </>
              )}
            </>
          )}
        </>
        )}
    </div>
  );
};

export default ModalRating;
