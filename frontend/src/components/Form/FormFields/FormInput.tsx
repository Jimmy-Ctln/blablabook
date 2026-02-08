import type { FormInputProps } from "@/@types/form";
import { Input } from "@/components/ui/input";


export default function FormInput({ field, type, placeholder }: FormInputProps) {
  return (
    <Input
      type={type}
      id={field.name}
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(e) => field.handleChange(e.target.value)}
      placeholder={placeholder}
      className="w-full"
    />
  )
}
