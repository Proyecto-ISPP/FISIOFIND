import React from "react";

interface RestoreFiltersProps {
  onClick: () => void;
  className?: string;
}

const RestoreFilters: React.FC<RestoreFiltersProps> = ({
  onClick,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-[230px] h-[45px] cursor-pointer flex items-center border-2 border-[#dedede] bg-[#ff9b9b] rounded-[10px] overflow-hidden transition-all duration-300 hover:bg-[#ff9b9b] active:translate-x-[3px] active:translate-y-[3px] group ${className}`}
    >
      <span className="button__text translate-x-[22px] text-[#FFFFFF] font-semibold transition-all duration-300 group-hover:text-transparent whitespace-nowrap">
        Restaurar filtros
      </span>
      <span className="button__icon absolute translate-x-[190px] h-full w-[39px] bg-[#ff8080] flex items-center justify-center transition-all duration-300 group-hover:w-[230px] group-hover:translate-x-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 512 512"
          className="fill-[#FFFFFF]"
        >
          <path
            style={{
              fill: "none",
              stroke: "#fff",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "32px",
            }}
            d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320"
          />
          <line
            y2="112"
            y1="112"
            x2="432"
            x1="80"
            style={{
              stroke: "#fff",
              strokeLinecap: "round",
              strokeMiterlimit: "10",
              strokeWidth: "32px",
            }}
          />
          <path
            style={{
              fill: "none",
              stroke: "#fff",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "32px",
            }}
            d="M192,112V72h0a23.93,23.93,0,0,1,24-24h80a23.93,23.93,0,0,1,24,24h0v40"
          />
          <line
            y2="400"
            y1="176"
            x2="256"
            x1="256"
            style={{
              fill: "none",
              stroke: "#fff",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "32px",
            }}
          />
          <line
            y2="400"
            y1="176"
            x2="192"
            x1="184"
            style={{
              fill: "none",
              stroke: "#fff",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "32px",
            }}
          />
          <line
            y2="400"
            y1="176"
            x2="320"
            x1="328"
            style={{
              fill: "none",
              stroke: "#fff",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "32px",
            }}
          />
        </svg>
      </span>
    </button>
  );
};

export default RestoreFilters;