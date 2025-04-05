"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import styles from './ratings.module.css';
import { getApiBaseUrl } from "@/utils/api";
import { useRouter } from "next/navigation";
import { GradientButton } from './ui/gradient-button';
import Alert from "@/components/ui/Alert";


interface PhysiotherapistDetails {
  id: number;  // ID is included in your serializer
  full_name: string;
  photo: string;
}

interface Rating {
  id: number;
  physiotherapist: number;
  punctuation: number;
  opinion: string;
  date: string;
  physiotherapist_details?: PhysiotherapistDetails;
}

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("token");
  }
  return null;
};

const TopRatings: React.FC = () => {
  const router = useRouter();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [isPhysio, setIsPhysio] = useState<boolean>(false);
  const [hasRated, setHasRated] = useState<boolean>(false);
  const [showRatingForm, setShowRatingForm] = useState<boolean>(false);
  const [newRating, setNewRating] = useState<{punctuation: number, opinion: string}>({
    punctuation: 5,
    opinion: ''
  });
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  
  const apiBaseUrl = getApiBaseUrl();

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  // Add this function to show alerts
  const showAlert = (type: "success" | "error" | "info" | "warning", message: string) => {
    setAlertType(type);
    setAlertMessage(message);
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setAlertMessage(null);
    }, 5000);
  };

  // Check if user is authenticated and is a physiotherapist
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      
      if (!token) {
        setIsAuthenticated(false);
        setIsAuthChecking(false);
        return;
      }

      try {
        const response = await axios.get(`${apiBaseUrl}/api/app_user/check-role/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.user_role === "physiotherapist") {
          setIsAuthenticated(true);
          setIsPhysio(true);
        } else {
          setIsAuthenticated(true);
          setIsPhysio(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
        if (error.response?.status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem("token");
          }
        }
        if (error.response) {
            showAlert("error",`Error: ${JSON.stringify(error.response.data)}`);
        } else {
            showAlert("error","Error al comprobar el rol del usuario.");
        }
      } finally {
        setIsAuthChecking(false);
      }
    };

    checkAuth();
  }, [apiBaseUrl]);

  // Function to check if the current physiotherapist has already rated
  const checkIfPhysioHasRated = async () => {
    const token = getAuthToken();
    if (!token) {
      setHasRated(false);
      return;
    }

    try {
      const response = await axios.get(`${apiBaseUrl}/api/ratings/has-rated/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.has_rated) {
        setHasRated(true);
      } else {
        setHasRated(false);
      }
    } catch (err) {
      setHasRated(false);
      
      // Add alert for error handling
      if (axios.isAxiosError(err) && err.response) {
        showAlert("error", `Error: ${JSON.stringify(err.response.data)}`);
      } else {
        showAlert("error", "Error al comprobar si ya has valorado la aplicación.");
      }
    }
  };

  // Call the function to check if the physio has rated when the component mounts
  useEffect(() => {
    if (isAuthenticated && isPhysio) {
      checkIfPhysioHasRated();
    }
  }, [isAuthenticated, isPhysio, apiBaseUrl]);

  // Fetch ratings
  useEffect(() => {
    const fetchTopRatings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiBaseUrl}/api/ratings/list/`);
        
        if (!response.data) {
          throw new Error('No data received from server');
        }
                
        // Process the response and set the ratings
        const sortedRatings = response.data
          .sort((a: Rating, b: Rating) => b.punctuation - a.punctuation)
          .slice(0, 3); // Show only the first 3 ratings
        setRatings(sortedRatings);
        
      } catch (err) {        
        if (axios.isAxiosError(err) && err.response) {
          showAlert("error", `Error: ${JSON.stringify(err.response.data)}`);
        } else {
          showAlert("error", "Error al cargar las valoraciones. Por favor, inténtalo de nuevo más tarde.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatings();
  }, [apiBaseUrl, hasRated]);

  // Helper function to render stars based on punctuation
  const renderStars = (punctuation: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg 
          key={i} 
          className={styles.star}
          fill={i < punctuation ? "currentColor" : "none"} 
          stroke={i < punctuation ? "none" : "currentColor"}
          viewBox="0 0 20 20" 
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
      );
    }
    return stars;
  };

  // Interactive stars for the rating form
  const renderInteractiveStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg 
          key={i} 
          fill={i <= newRating.punctuation ? "currentColor" : "none"} 
          stroke={i <= newRating.punctuation ? "none" : "currentColor"}
          viewBox="0 0 20 20" 
          xmlns="http://www.w3.org/2000/svg"
          className={styles.interactiveStar}
          width="24"
          height="24"
          onClick={() => setNewRating({...newRating, punctuation: i})}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
      );
    }
    return stars;
  };

  const handleSubmitRating = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        showAlert("error", "Debes iniciar sesión para enviar una valoración.");
        return;
      }

      // Make sure the opinion is not empty
      if (!newRating.opinion.trim()) {
        showAlert("error", "Por favor, proporciona una opinión.");
        return;
      }

      // Check if opinion exceeds 140 characters
      if (newRating.opinion.length > 140) {
        showAlert("error", "La opinión debe tener 140 caracteres o menos.");
        return;
      }

      // Include the physiotherapist ID in the payload
      const payload = {
        ...newRating,
        physiotherapist: isPhysio ? 1 : null, // Replace `1` with the actual physiotherapist ID if available
      };

      // Log the payload for debugging

      await axios.post(
        `${apiBaseUrl}/api/ratings/create/`, 
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setHasRated(true);
      setShowRatingForm(false);
      setError(null);

      // Show confirmation message for ratings with 3 stars or more
      if (newRating.punctuation >= 3) {
        showAlert("success", "¡Gracias por valorar nuestra app!");
        setTimeout(() => setConfirmationMessage(null), 3000);
      }

      // Refresh ratings (use a slight delay to ensure the new rating is included)
      setTimeout(async () => {
        try {
          const response = await axios.get(`${apiBaseUrl}/api/ratings/list/`);
          const sortedRatings = response.data
            .sort((a: Rating, b: Rating) => b.punctuation - a.punctuation)
            .slice(0, 3); // Show only the first 3 ratings
          setRatings(sortedRatings);
        } catch (err) {
          if (axios.isAxiosError(err) && err.response) {
            showAlert("error", `Error: ${JSON.stringify(err.response.data)}`);
          } else {
            showAlert("error", "Error al actualizar las valoraciones. Por favor, recarga la página.");
          }
        }
      });
      
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        // Handle 400 Bad Request specifically
        if (err.response.status === 400) {
          const errorData = err.response.data;
          if (typeof errorData === 'object') {
            const errorMessages = Object.values(errorData)
              .flat()
              .join(', ');
            showAlert("error", `Error al enviar la valoración: ${errorMessages}`);
          } else {
            showAlert("error", "Error al enviar la valoración. Por favor, revisa tu entrada.");
          }
        } else {
          showAlert("error", `Error: ${err.response.status} - ${err.response.statusText}`);
        }
      } else {
        showAlert("error", "Error al enviar la valoración. Por favor, inténtalo de nuevo más tarde.");
      }
    }
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Cargando valoraciones...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  return (
    <div className={styles.ratingsContainer}>
    {alertMessage && (
      <div className="mb-6">
        <Alert
          type={alertType}
          message={alertMessage}
          onClose={() => setAlertMessage(null)}
        />
      </div>
      )}
      {/* Confirmation message */}
      {confirmationMessage && (
        <div className={styles.confirmationMessage}>
          {confirmationMessage}
        </div>
      )}
      {/* Show rating button for authenticated physiotherapists who haven't rated yet */}
      {isAuthenticated && isPhysio && !hasRated && (
        <div className={styles.rateButtonContainer}>
          <GradientButton 
            onClick={() => setShowRatingForm(true)}
          >
            ¿Te gusta nuestra app? ¡Valóranos!
          </GradientButton>
        </div>
      )}

      {/* Rating form */}
      {showRatingForm && (
        <div className={styles.ratingForm}>
          <h3>Valora nuestra aplicación</h3>
          {hasRated && (
            <p className={styles.errorMessage}>
              Ya has enviado una valoración. No puedes enviar otra.
            </p>
          )}
          {!hasRated && (
            <>
              <div className={styles.starsContainer}>
                {renderInteractiveStars()}
              </div>
              <textarea
                className={styles.opinionInput}
                placeholder="Cuéntanos tu experiencia con la app..."
                value={newRating.opinion}
                onChange={(e) => setNewRating({...newRating, opinion: e.target.value})}
              />
              <div className={styles.formButtons}>
                <GradientButton 
                  variant="grey"
                  onClick={() => setShowRatingForm(false)}
                >
                  Cancelar
                </GradientButton>
                <GradientButton 
                  variant="create"
                  onClick={handleSubmitRating}
                >
                  Enviar valoración
                </GradientButton>
              </div>
            </>
          )}
        </div>
      )}

      {ratings.length === 0 ? (
        <div className={styles.emptyCardContainer} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div className={`${styles.card} ${styles.cardHover}`} style={{ width: '400px' }}>
            <div className={styles.header}>
              <div>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <p className={styles.name}>No hay valoraciones disponibles</p>
              </div>
            </div>
            <p className={styles.message}>
              {isAuthenticated && isPhysio ? (
                <span 
                  onClick={() => setShowRatingForm(true)} 
                  className={styles.loginLink}
                  style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  ¡Sé el primero en valorar nuestra app!
                </span>
              ) : (
                <span>
                  <span 
                    onClick={() => router.push('/login')} 
                    className={styles.loginLink}
                    style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    ¡Inicia sesión
                  </span> como fisioterapeuta y sé el primero en valorarnos!
                </span>
              )}
            </p>
          </div>
        </div>
      ) : (
        <div className={styles.ratingsGrid} style={{ justifyContent: 'center' }}>
          {ratings.map((rating) => (
            <div 
              key={rating.id} 
              className={`${styles.card} ${styles.cardHover}`} 
              style={{ width: '500px', height: 'auto' }} // Increase card width
            >
              <div className={styles.header}>
                <div className={styles.image}>
                {rating.physiotherapist_details?.photo && (
                  <Image 
                    src={rating.physiotherapist_details.photo} 
                    alt={rating.physiotherapist_details?.full_name || 'Fisioterapeuta anónimo'}
                    width={100}
                    height={100}
                    className={styles.profileImage}
                    onError={(e) => {
                      e.currentTarget.src = '/default-avatar.png';
                    }}
                    unoptimized
                  />
                )}
                </div>
                <div>
                  <div className={styles.stars}>
                    {renderStars(rating.punctuation)}
                  </div>
                  <p className={styles.name}>{rating.physiotherapist_details?.full_name || 'Fisioterapeuta anónimo'}</p>
                </div>
              </div>
              <p className={styles.message}>{rating.opinion || ''}</p>
              <p className={styles.ratingDate}>
                {new Date(rating.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopRatings;