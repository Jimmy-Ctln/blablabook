import { Label } from "@radix-ui/react-label";
import FormFieldInfo from "./FormFieldInfo";
import FormInput from "./FormInput";
import type { FormFieldProps } from "@/@types/form";

export default function FormField({ field, type, label, placeholder }: FormFieldProps) {
  return (
    <div className="grid w-full max-w-sm items-center gap-3 my-3">
      <Label htmlFor="email">{label} :</Label>
      <FormInput type={type} field={field} placeholder={placeholder} />
      <FormFieldInfo field={field} />
    </div>
  )
}
