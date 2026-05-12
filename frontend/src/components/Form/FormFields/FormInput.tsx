import type { FormInputProps } from "@/@types/form";
import { Input } from "@/components/ui/input";

export default function FormInput({ field, type, placeholder }: FormInputProps) {
  const hasError = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Input
      type={type}
      id={field.name}
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(e) => field.handleChange(e.target.value)}
      placeholder={placeholder}
      aria-invalid={hasError}
      className={`w-full${hasError ? " border-destructive focus-visible:ring-destructive" : ""}`}
    />
  );
}
