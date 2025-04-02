import { useEffect, useState } from "react";

interface RatingList {
    physioId: number;
}

export function RatingList({ physioId }: RatingList) {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRatings() {
      try {
        const response = await fetch(`/api/ratings/${physioId}/`);
        if (!response.ok) throw new Error("Error cargando valoraciones");
        const data = await response.json();
        setRatings(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchRatings();
  }, [physioId]);

  if (loading) return <p>Cargando valoraciones...</p>;
  if (!ratings.length) return <p>No hay valoraciones aún.</p>;

  return (
    <div>
      <h3>Valoraciones</h3>
      <ul>
        {ratings.map((rating) => (
          <li key={rating.id}>
            <strong>{rating.score} ⭐</strong> - {rating.comment}
          </li>
        ))}
      </ul>
    </div>
  );
}
