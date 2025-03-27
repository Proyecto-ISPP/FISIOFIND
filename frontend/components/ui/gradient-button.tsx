import React from "react";
import { cn } from "@/lib/utils";

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "danger" | "grey" | "create" | "edit";
  fullWidth?: boolean;
  children: React.ReactNode;
}

const GradientButton = ({
  variant = "create",
  fullWidth = false,
  className,
  children,
  ...props
}: GradientButtonProps) => {
  const baseStyles = "py-4 text-white font-semibold rounded-xl transition-all duration-200 transform hover:-translate-y-0.5";
  
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

  // Handle legacy variant names
  const mappedVariant = variant === "create" ? "blue" : 
                        variant === "edit" ? "green" : 
                        variant;

  return (
    <button
      className={cn(
        baseStyles,
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