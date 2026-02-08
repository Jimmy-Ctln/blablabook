import type { FormFieldInfoProps } from "@/@types/form";



export default function FormFieldInfo({ field }: FormFieldInfoProps) {
  const errors = field.state.meta.errors; // get errors array

  if (field.state.meta.isTouched && !field.state.meta.isValid && errors.length > 0) {
    const firstError = errors[0];
    let errorMessage: string;

    if (typeof firstError === 'object' && firstError !== null && "message" in firstError) {
      errorMessage = firstError.message as 'string';
    } else if (typeof firstError === "string") {
      errorMessage = firstError;
    } else {
      errorMessage = "Erreur de validation inconnue";
    }

    return (
      <em className="text-red-500 italic text-sm text-center font-bold" role="alert">
        {errorMessage}
      </em>
    )
  }

  if (field.state.meta.isValidating) {
    return <em>Validation en cours ... </em>
  }
  return null;
}