import type { FormBtnSubmit } from "@/@types/form";
import { Button } from "@/components/ui/button";

export default function FormButtonSubmit({ canSubmit, isSubmitting, label, fullWidth }: FormBtnSubmit) {
  return (
    <Button
      type="submit"
      disabled={!canSubmit}
      className={fullWidth ? "w-full" : ""}
    >
      {isSubmitting ? "..." : (label ?? "Soumettre")}
    </Button>
  );
}