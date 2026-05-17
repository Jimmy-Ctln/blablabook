import type { FormActionProps } from "@/@types/form";
import FormBtnReset from "./FormBtnReset";
import FormButtonSubmit from "./FormBtnSubmit";

export default function FormAction({
  canSubmit,
  isSubmitting,
  form,
  submitLabel,
  showReset = true,
  fullWidth = false,
}: FormActionProps) {
  if (fullWidth) {
    return (
      <div className="w-full max-w-sm mt-6">
        <FormButtonSubmit
          canSubmit={canSubmit}
          isSubmitting={isSubmitting}
          label={submitLabel}
          fullWidth
        />
      </div>
    );
  }

  return (
    <div className="my-10 flex justify-center gap-x-4">
      {showReset && <FormBtnReset form={form} />}
      <FormButtonSubmit
        canSubmit={canSubmit}
        isSubmitting={isSubmitting}
        label={submitLabel}
      />
    </div>
  );
}