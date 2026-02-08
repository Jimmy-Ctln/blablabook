import { Button } from "@/components/ui/button";
import type { FormBtnReset } from "@/@types/form";


export default function FormBtnReset({ form }: FormBtnReset) {
  return (
    <Button
      type="reset"
      variant="secondary"
      onClick={(e) => {
        e.preventDefault()
        form.reset()
      }}
    >
      Effacer
    </Button>
  )
}