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
      style={{ display: "inline-block" }}
    >
      {hovered ? (
        <StarRating
          rating={rating}
          setRating={onRatingChange}
          size={size}
        />
      ) : (
        <StarRatingDisplay editable={editable} rating={rating} max={max} size={size} loading={loading} />
      )}
    </div>
  );
};

export default EditableStarRatingDisplay;
