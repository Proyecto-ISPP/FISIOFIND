import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import styles from './ratings.module.css';
import { getApiBaseUrl } from "@/utils/api";

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

const TopRatings: React.FC = () => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const apiBaseUrl = getApiBaseUrl();

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
  }, [apiBaseUrl]);

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

  if (loading) {
    return <div>Loading top ratings...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className={styles.ratingsContainer}>
      <h2 className={styles.ratingsTitle}>Top Ratings</h2>
      
      {ratings.length === 0 ? (
        <p>No ratings available yet.</p>
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