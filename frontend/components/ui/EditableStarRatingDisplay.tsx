"use client";

import { useState } from "react";
import StarRatingDisplay from "./StarRatingDisplay";
import StarRating from "./StarRating";

interface EditableStarRatingDisplayProps {
  rating: number;
  max?: number;
  size?: number;
  loading?: boolean;
  editable?: boolean;
  onRatingChange: (newRating: number) => void;
}

const EditableStarRatingDisplay = ({
  rating,
  max = 5,
  size = 20,
  loading = false,
  editable = true,
  onRatingChange,
}: EditableStarRatingDisplayProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => editable && setHovered(true)}
      onMouseLeave={() => editable && setHovered(false)}
      style={{
        display: "inline-block",
        transition: "transform 0.1s ease, opacity 0.1s ease",
        transform: hovered ? "scale(1.05)" : "scale(1)",
        opacity: hovered ? 0.95 : 1,
      }}
    >
      {hovered ? (
        <StarRating rating={rating} setRating={onRatingChange} size={size} />
      ) : (
        <StarRatingDisplay
          editable={editable}
          rating={rating}
          max={max}
          size={size}
          loading={loading}
        />
      )}
    </div>
  );
};

export default EditableStarRatingDisplay;
