import type { FormGlobalErrorProps } from "@/@types/form";

export default function FormGlobalError({ message }: FormGlobalErrorProps) {
  return (
    <div className="font-bold text-red-500">
      {message}
    </div>
  )
}
