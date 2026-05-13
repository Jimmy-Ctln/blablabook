import { AlertCircle } from "lucide-react";
import type { FormFieldInfoProps } from "@/@types/form";

export default function FormFieldInfo({ field }: FormFieldInfoProps) {
  const errors = field.state.meta.errors;

  if (field.state.meta.isTouched && !field.state.meta.isValid && errors.length > 0) {
    const firstError = errors[0];
    let errorMessage: string;

    if (typeof firstError === "object" && firstError !== null && "message" in firstError) {
      errorMessage = firstError.message as string;
    } else if (typeof firstError === "string") {
      errorMessage = firstError;
    } else {
      errorMessage = "Erreur de validation inconnue";
    }

    return (
      <p className="flex items-center gap-1.5 text-sm text-destructive" role="alert">
        <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {errorMessage}
      </p>
    );
  }

  if (field.state.meta.isValidating) {
    return <p className="text-sm text-muted-foreground">Validation en cours…</p>;
  }

  return null;
}
