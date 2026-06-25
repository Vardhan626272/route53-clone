import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "link";
type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-aws-orange text-aws-header hover:bg-[#ec7211] border border-[#c45500] shadow-sm disabled:opacity-60",
  secondary:
    "bg-white text-aws-text border border-aws-border hover:bg-aws-bg disabled:opacity-60",
  danger:
    "bg-[#d13212] text-white border border-[#b92b0f] hover:bg-[#b92b0f] disabled:opacity-60",
  link: "bg-transparent text-aws-link hover:underline px-0 py-0 border-0 shadow-none",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
};

export function Button({
  variant = "secondary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded font-medium transition-colors disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
}
