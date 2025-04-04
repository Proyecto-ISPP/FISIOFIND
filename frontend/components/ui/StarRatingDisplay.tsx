import { BsStar, BsStarFill } from "react-icons/bs";

const StarRatingDisplay = ({ rating, max = 5, size = 24 }) => {
  // Calcula el porcentaje del rating sobre el máximo
  const percentage = (rating / max) * 100;

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ position: "relative", width: size, height: size }}>
        {/* Estrella vacía en gris */}
        <BsStar color="#ccc" size={size} />
        {/* Estrella llena en dorado con overflow oculto */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${percentage}%`,
            overflow: "hidden",
          }}
        >
          <BsStarFill color="gold" size={size} />
        </div>
      </div>
      <span style={{ marginLeft: 8 }}>{`(${rating}/${max})`}</span>
    </div>
  );
};

export default StarRatingDisplay;