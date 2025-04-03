import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import styles from './ratings.module.css';
import { getApiBaseUrl } from "@/utils/api";
import { useRouter } from "next/navigation";

interface PhysiotherapistDetails {
  id: number;
  full_name: string;
  profile_picture: string;
}

interface PatientDetails {
  id: number;
  full_name: string;
}

interface Rating {
  id: number;
  physiotherapist: number;
  patient: number;
  punctuation: number;
  opinion: string;
  date: string;
  physiotherapist_details: PhysiotherapistDetails;
  patient_details: PatientDetails;
}


const getAuthToken = () => {
  return localStorage.getItem("token");
};


const TopRatings: React.FC = () => {
  const router = useRouter();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isPhysio, setIsPhysio] = useState<boolean>(false);
  const [hasRated, setHasRated] = useState<boolean>(false);
  const [showRatingForm, setShowRatingForm] = useState<boolean>(false);
  const [newRating, setNewRating] = useState<{punctuation: number, opinion: string}>({
    punctuation: 5,
    opinion: ''
  });
  const apiBaseUrl = getApiBaseUrl();


  // Check if user is authenticated and is a physiotherapist
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);

      const checkUserRole = async () => {
        setIsAuthChecking(true);
        const storedToken = getAuthToken();
      
        if (!storedToken) {
          return;
        }

        try {
          const response = await axios.get(`${getApiBaseUrl()}/api/app_user/check-role/`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          if (response.data && response.data.user_role === "physiotherapist") {
            setIsAuthenticated(true);
          } else {
            return;
          }
        } catch (error) {
          console.error("Error checking user role:", error);
          if (error.response?.status === 401) {
            localStorage.removeItem("token");
          } else {
            router.push("/not-found");
          }
        } finally {
          setIsAuthChecking(false);
        }
    };
  }
  }, [apiBaseUrl]);

  useEffect(() => {
    const fetchTopRatings = async () => {
      try {
        setLoading(true);
        // Use the correct API URL with the base URL
        const response = await axios.get(`${apiBaseUrl}/api/ratings/`);
        
        // Sort by punctuation (highest first) and take top 5
        const sortedRatings = response.data
          .sort((a: Rating, b: Rating) => b.punctuation - a.punctuation)
          .slice(0, 5);
        
        setRatings(sortedRatings);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching ratings:', err);
        setError('Failed to load ratings. Please try again later.');
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
          fill={i < punctuation ? "currentColor" : "none"} 
          stroke={i < punctuation ? "none" : "currentColor"}
          viewBox="0 0 20 20" 
          xmlns="http://www.w3.org/2000/svg"
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
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to submit a rating');
        return;
      }

      await axios.post(
        `${apiBaseUrl}/api/ratings/create/`, 
        newRating,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update state to reflect the new rating
      setHasRated(true);
      setShowRatingForm(false);
      
      // Refresh ratings
      const response = await axios.get(`${apiBaseUrl}/api/ratings/`);
      const sortedRatings = response.data
        .sort((a: Rating, b: Rating) => b.punctuation - a.punctuation)
        .slice(0, 5);
      setRatings(sortedRatings);
      
    } catch (err) {
      console.error('Error submitting rating:', err);
      setError('Failed to submit rating. Please try again later.');
    }
  };

  if (loading) {
    return <div>Cargando valoraciones...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className={styles.ratingsContainer}>
      <br></br>
      {/* Show rating button for authenticated physiotherapists who haven't rated yet */}
      {isAuthenticated && isPhysio && !hasRated && !showRatingForm && (
        <div className={styles.rateButtonContainer}>
          <button 
            className={styles.rateButton}
            onClick={() => setShowRatingForm(true)}
          >
            ¿Te gusta nuestra app? ¡Valóranos!
          </button>
        </div>
      )}

      {/* Rating form */}
      {showRatingForm && (
        <div className={styles.ratingForm}>
          <h3>Valora nuestra aplicación</h3>
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
            <button 
              className={styles.cancelButton}
              onClick={() => setShowRatingForm(false)}
            >
              Cancelar
            </button>
            <button 
              className={styles.submitButton}
              onClick={handleSubmitRating}
            >
              Enviar valoración
            </button>
          </div>
        </div>
      )}

      {ratings.length === 0 ? (
        <p> </p>
      ) : (
        <div className={styles.ratingsGrid}>
          {ratings.map((rating) => (
            <div key={rating.id} className={styles.card}>
              <div className={styles.header}>
                <div className={styles.image}>
                  {rating.physiotherapist_details.profile_picture && (
                    <Image 
                      src={rating.physiotherapist_details.profile_picture} 
                      alt={rating.physiotherapist_details.full_name}
                      width={64}
                      height={64}
                      className={styles.profileImage}
                    />
                  )}
                </div>
                <div>
                  <div className={styles.stars}>
                    {renderStars(rating.punctuation)}
                  </div>
                  <p className={styles.name}>{rating.physiotherapist_details.full_name}</p>
                </div>
              </div>
              <p className={styles.message}>{rating.opinion}</p>
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