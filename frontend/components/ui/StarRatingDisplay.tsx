import { BsStar, BsStarFill } from "react-icons/bs";

const StarRatingDisplay = ({
  rating,
  max = 5,
  size = 20,
  loading = false,
  editable = false,
}) => {
  return (
    <div className="flex items-center">
      {loading ? (
        <>
          <BsStarFill className="loading-star" color="gold" size={size} />
          <div className="ml-2 w-[48px] h-5 pt-[3px] bg-gray-300 animate-pulse rounded" />
        </>
      ) : rating == null ? (
        <span className="ml-2 text-teal-50 text-sm pt-[3px]">
          {editable ? "Valorar cita" : "No hay valoraciones"}
        </span>
      ) : (
        <>
          <div style={{ position: "relative", width: size, height: size }}>
            <BsStar color="#ccc" size={size} />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: `${(rating / max) * 100}%`,
                overflow: "hidden",
              }}
            >
              <BsStarFill color="gold" size={size} />
            </div>
          </div>
          <span className="ml-2 text-teal-50 text-sm">{`(${rating}/${max})`}</span>
        </>
      )}
    </div>
  );
};

export default StarRatingDisplay;
