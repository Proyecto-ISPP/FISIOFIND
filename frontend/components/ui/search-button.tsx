import React from "react";

interface SearchButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  className?: string;
}

const SearchButton: React.FC<SearchButtonProps> = ({
  onClick,
  isLoading = false,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={`relative w-[250px] h-[45px] cursor-pointer flex items-center border-2 border-[#dedede] bg-[#4169e1] rounded-[10px] overflow-hidden transition-all duration-300 hover:bg-[#4169e1] active:translate-x-[3px] active:translate-y-[3px] group ${className}`}
    >
      <span className="button__text translate-x-[48px] text-[#FFFFFF] font-semibold transition-all duration-300 group-hover:text-transparent whitespace-nowrap">
        Buscar fisioterapeutas
      </span>
      <span className="button__icon absolute translate-x-0 h-full w-[39px] bg-[#1e40af] flex items-center justify-center transition-all duration-300 group-hover:w-[250px] group-hover:translate-x-0">
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="#FFFFFF"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="#FFFFFF"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            className="fill-[#FFFFFF]"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </span>
    </button>
  );
};

export default SearchButton;