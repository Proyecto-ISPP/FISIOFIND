"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import styles from './ratings.module.css';
import { getApiBaseUrl } from "@/utils/api";
import { useRouter } from "next/navigation";

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
  
  const apiBaseUrl = getApiBaseUrl();

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
        console.error("Error checking user role:", error);
        setIsAuthenticated(false);
        if (error.response?.status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem("token");
          }
        }
      } finally {
        setIsAuthChecking(false);
      }
    };

    checkAuth();
  }, [apiBaseUrl]);

  // Fetch ratings
  useEffect(() => {
    // Inside your fetchTopRatings function, add error logging to see what's happening:
    const fetchTopRatings = async () => {
      try {
        setLoading(true);
        console.log("Fetching from:", `${apiBaseUrl}/api/ratings/list/`);
        const response = await axios.get(`${apiBaseUrl}/api/ratings/list/`);
        
        if (!response.data) {
          throw new Error('No data received from server');
        }
        
        console.log("Received data:", response.data);
        
        // Process the response and set the ratings
        const sortedRatings = response.data
          .sort((a: Rating, b: Rating) => b.punctuation - a.punctuation)
          .slice(0, 5);
        setRatings(sortedRatings);
        
      } catch (err) {
        console.error('Error fetching ratings:', err);
        // Add more detailed error logging
        if (err.response) {
          console.error('Response error:', err.response.status, err.response.data);
        }
        setError('Failed to load ratings. Please try again later.');
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
        setError('You must be logged in to submit a rating');
        return;
      }

      // Make sure the opinion is not empty
      if (!newRating.opinion.trim()) {
        setError('Please provide an opinion');
        return;
      }

      await axios.post(
        `${apiBaseUrl}/api/ratings/create/`, 
        newRating,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setHasRated(true);
      setShowRatingForm(false);
      setError(null);
      
      // Refresh ratings (use a slight delay to ensure the new rating is included)
      setTimeout(async () => {
        try {
          const response = await axios.get(`${apiBaseUrl}/api/ratings/list/`);
          const sortedRatings = response.data
            .sort((a: Rating, b: Rating) => b.punctuation - a.punctuation)
            .slice(0, 5);
          setRatings(sortedRatings);
        } catch (err) {
          console.error('Error refreshing ratings:', err);
        }
      }, 500);
      
    } catch (err) {
      console.error('Error submitting rating:', err);
      if (err.response?.data) {
        // Extract validation errors from the response
        if (typeof err.response.data === 'object') {
          const errorMessages = Object.values(err.response.data)
            .flat()
            .join(', ');
          setError(`Failed to submit rating: ${errorMessages}`);
        } else {
          setError('Failed to submit rating. Please try again later.');
        }
      } else {
        setError('Failed to submit rating. Please try again later.');
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
        <p className={styles.noRatings}>No hay valoraciones disponibles.</p>
      ) : (
        <div className={styles.ratingsGrid}>
          {ratings.map((rating) => (
            <div key={rating.id} className={styles.card}>
              <div className={styles.header}>
                <div className={styles.image}>
                {rating.physiotherapist_details?.photo && (
                  <Image 
                    src={rating.physiotherapist_details.photo} 
                    alt={rating.physiotherapist_details?.full_name || 'User'}
                    width={64}
                    height={64}
                    className={styles.profileImage}
                    onError={(e) => {
                      e.currentTarget.src = '/default-avatar.png';
                    }}
                  />
                )}
                </div>
                <div>
                  <div className={styles.stars}>
                    {renderStars(rating.punctuation)}
                  </div>
                  <p className={styles.name}>{rating.physiotherapist_details?.full_name || 'Anonymous'}</p>
                </div>
              </div>
              <p className={styles.message}>{rating.opinion || 'No opinion provided'}</p>
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