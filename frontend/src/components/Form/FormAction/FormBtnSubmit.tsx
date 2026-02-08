import type { FormBtnSubmit } from "@/@types/form";
import { Button } from "@/components/ui/button";

export default function FormButtonSubmit({ canSubmit, isSubmitting }: FormBtnSubmit) {
  return (
    <Button type="submit" disabled={!canSubmit} >
      {isSubmitting ? "..." : 'Soumettre'}
    </Button>
  )
}