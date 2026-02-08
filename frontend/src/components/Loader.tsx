import { Loader2 } from "lucide-react";

type LoaderProps = {
  text?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function Loader({
  text = "Chargement...",
  size = "md",
  className = "",
}: LoaderProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-6 w-6",
  };

  return (
    <div className={`flex items-center gap-2 text-gray-600 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin`} />
      {text && <span>{text}</span>}
    </div>
  );
}
