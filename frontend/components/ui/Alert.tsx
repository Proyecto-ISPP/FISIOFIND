"use client";
import React, { useEffect } from "react";

interface AlertProps {
  type: "success" | "error" | "info" | "warning";
  message: string;
  onClose?: () => void;
  duration?: number; // duración opcional en milisegundos
}

const styleMap = {
  success: {
    bg: "bg-green-100",
    border: "border-green-500",
    text: "text-green-800",
    icon: "text-green-600",
  },
  error: {
    bg: "bg-red-100",
    border: "border-red-500",
    text: "text-red-800",
    icon: "text-red-600",
  },
  info: {
    bg: "bg-blue-100",
    border: "border-blue-500",
    text: "text-blue-800",
    icon: "text-blue-600",
  },
  warning: {
    bg: "bg-yellow-100",
    border: "border-yellow-500",
    text: "text-yellow-800",
    icon: "text-yellow-600",
  },
};

const Alert: React.FC<AlertProps> = ({
  type,
  message,
  onClose,
  duration = 5000, // por defecto 5s
}) => {
  const { bg, border, text, icon } = styleMap[type];

  useEffect(() => {
    if (!onClose) return;
    const timeout = setTimeout(onClose, duration);
    return () => clearTimeout(timeout);
  }, [onClose, duration]);

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md animate-in fade-in slide-in-from-top-2 duration-500">
      <div
        role="alert"
        className={`${bg} ${border} ${text} border-l-4 px-4 py-3 rounded-lg flex items-center justify-between shadow-lg transition-all duration-300 ease-in-out`}
      >
        <div className="flex items-center">
          <svg
            stroke="currentColor"
            fill="none"
            viewBox="0 0 24 24"
            className={`h-5 w-5 mr-2 ${icon}`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
          <p className="text-sm font-medium">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`${text} ml-4 text-sm hover:opacity-70 transition`}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
