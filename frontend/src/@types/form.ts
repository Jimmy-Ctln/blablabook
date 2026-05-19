import type { AnyFieldApi, AnyFormApi } from "@tanstack/react-form";

export type FormTitleProps = {
  readonly title: string;
  readonly subtitle?: string;
};

export type FormGlobalErrorProps = {
  message: string;
};

export type FormFieldProps = {
  readonly field: AnyFieldApi;
  readonly type: string;
  readonly label: string;
  readonly placeholder: string;
};

export type FormFieldInfoProps = {
  readonly field: AnyFieldApi;
};

export type FormInputProps = {
  readonly field: AnyFieldApi;
  readonly type: string;
  readonly placeholder: string;
};

export type FormActionProps = {
  readonly canSubmit: boolean;
  readonly isSubmitting: boolean;
  readonly form: AnyFormApi;
  readonly submitLabel?: string;
  readonly showReset?: boolean;
  readonly fullWidth?: boolean;
};

export type FormBtnReset = {
  readonly form: AnyFormApi;
};

export type FormBtnSubmit = {
  readonly canSubmit: boolean;
  readonly isSubmitting: boolean;
  readonly label?: string;
  readonly fullWidth?: boolean;
};

// type axios error
export type BackendErrorResponse = {
  message: string;
};
