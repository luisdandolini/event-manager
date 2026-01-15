import type { ButtonHTMLAttributes, ReactNode } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  loadingLabel?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

const variantClasses = {
  primary: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900",
  secondary:
    "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
  ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  loadingLabel = "Carregando",
  leftIcon,
  rightIcon,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      disabled={isDisabled}
      aria-disabled={isDisabled || undefined}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" aria-label={loadingLabel} />
          <span className="sr-only">{loadingLabel}</span>
        </>
      ) : (
        leftIcon
      )}

      {children}

      {!isLoading && rightIcon}
    </button>
  );
}
