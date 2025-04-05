import React from "react";
import { cn } from "@/lib/utils";

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "danger" | "grey" | "create" | "edit";
  fullWidth?: boolean;
  margin?: "none" | "sm" | "md" | "lg";
  padding?: "default" | "wide" | "narrow"; // Added padding prop for text
  children: React.ReactNode;
}

const GradientButton = ({
  variant = "create",
  fullWidth = false,
  margin = "none",
  padding = "default", // Default padding
  className,
  children,
  ...props
}: GradientButtonProps) => {
  // Base styles with smaller text size but keeping rounded-xl corners
  const baseStyles = "text-white text-sm font-semibold rounded-xl transition-all duration-200 transform hover:-translate-y-0.5";
  
  // Margin styles for the button
  const marginStyles = {
    none: "",
    sm: "my-2",
    md: "my-4",
    lg: "my-6"
  };
  
  // Padding styles with smaller values for a more compact button
  const paddingStyles = {
    narrow: "py-1.5 px-3",
    default: "py-2 px-4",
    wide: "py-2 px-8"
  };
  
  const variantStyles = {
    // Legacy variants (for backward compatibility)
    create: {
      background: "linear-gradient(90deg, #1E5ACD, #3a6fd8)",
      boxShadow: "0 4px 12px rgba(30, 90, 205, 0.2)"
    },
    edit: {
      background: "linear-gradient(90deg, #05AC9C, #06c4b2)",
      boxShadow: "0 4px 12px rgba(5, 172, 156, 0.2)"
    },
    danger: {
      background: "linear-gradient(90deg, #FA5C2B, #ff7a52)",
      boxShadow: "0 4px 12px rgba(250, 92, 43, 0.2)"
    },
    grey: {
      background: "linear-gradient(90deg, #253240, #64748b)",
      boxShadow: "0 4px 12px #94a3b8"
    }
  };

  return (
    <button
      className={cn(
        baseStyles,
        paddingStyles[padding], // Apply text padding
        marginStyles[margin],
        fullWidth ? "w-full" : "",
        className
      )}
      style={variantStyles[variant]}
      {...props}
    >
      {children}
    </button>
  );
};

export { GradientButton };