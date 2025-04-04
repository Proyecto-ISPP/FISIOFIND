"use client";

import { BsStar, BsStarHalf, BsStarFill } from "react-icons/bs";

interface StarRatingProps {
  rating: number;
  setRating?: (value: number) => void; // Si no se pasa, modo lectura
  size?: number;
  color?: string;
}

const StarRating = ({ rating, setRating, size = 20, color = "gold" }: StarRatingProps) => {
  return (
    <div style={{ display: "flex", justifyContent: "center"}}>
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        let icon;
        if (rating >= starValue) {
          icon = <BsStarFill color={color} size={size} />;
        } else if (rating >= starValue - 0.5) {
          icon = <BsStarHalf color={color} size={size} />;
        } else {
          icon = <BsStar color={color} size={size} />;
        }

        return (
          <div
            key={index}
            style={{
              display: "inline-block",
              position: "relative",
              width: `${size}px`,
              height: `${size}px`,
              marginRight: "4px",
            }}
          >
            {icon}
            {setRating && (
              <>
                <div
                  onClick={() => setRating(index + 0.5)}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "50%",
                    height: "100%",
                    cursor: "pointer",
                    zIndex: 1,
                  }}
                />
                <div
                  onClick={() => setRating(index + 1)}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "50%",
                    height: "100%",
                    cursor: "pointer",
                    zIndex: 1,
                  }}
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;