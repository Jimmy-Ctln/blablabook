import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "@tanstack/react-router";
import api from "@/api/axios";
import type { AxiosError } from "axios";
import { useForm } from "@tanstack/react-form";
import FormTitle from "@/components/Form/FormTitle";
import FormField from "@/components/Form/FormFields/FormField";
import FormAction from "@/components/Form/FormAction/FormAction";
import { useState } from "react";
import FormGlobalError from "@/components/Form/FormGlobalError";
import type { BackendErrorResponse } from "@/@types/form";

const schema = z
  .object({
    email: z.email("Email invalide").trim(),
    username: z
      .string()
      .min(2, "Le nom d'utilisateur doit contenir au moins 2 caractères")
      .trim(),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .trim(),
    confirmPassword: z
      .string()
      .min(1, "Veuillez confirmer votre mot de passe")
      .trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "La confirmation du mot de passe a échouée",
    path: ["confirmPassword"],
  });

type RegisterFormData = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const mutation = useMutation<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    AxiosError<BackendErrorResponse>,
    RegisterFormData
  >({
    mutationFn: async (data: RegisterFormData) => {
      return api.post("/auth/register", data);
    },
    onSuccess: () => {
      // TODO: envoi un message pour indiquer que l'inscription à fonctionner
      navigate({ to: "/login" });
    },
    onError: (error) => {
      console.error("Erreur serveur: ", error.message);
    },
  });

  const defaultValues = {
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  };

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      setGlobalError(null);
      mutation.mutate(value, {
        onError: (error) => {
          const errorMessage =
            error.response?.data.message || "Une erreur est survenue";
          setGlobalError(errorMessage);

          form.setFieldValue("password", "");
          form.setFieldValue("confirmPassword", "");

          form.setFieldMeta("password", (prev) => ({
            ...prev,
            isTouched: false,
          }));

          form.setFieldMeta("confirmPassword", (prev) => ({
            ...prev,
            isTouched: false,
          }));
        },
      });
    },
    validators: {
      onChange: schema,
    },
  });

  return (
    <form
      className=" w-70 md:w-150 flex flex-col items-center mx-auto"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FormTitle title="Inscription" />

      {globalError && (
        <div role="alert" aria-live="assertive">
          <FormGlobalError message={globalError} />
        </div>
      )}

      <form.Field name="email">
        {(field) => {
          return (
            <FormField
              field={field}
              type={"email"}
              label={"Email"}
              placeholder={""}
            />
          );
        }}
      </form.Field>

      <form.Field name="username">
        {(field) => {
          return (
            <FormField
              field={field}
              type={"string"}
              label={"Nom d'utilisateur"}
              placeholder={""}
            />
          );
        }}
      </form.Field>

      <form.Field name="password">
        {(field) => {
          return (
            <FormField
              field={field}
              type={"password"}
              label={"Mot de passe"}
              placeholder={""}
            />
          );
        }}
      </form.Field>

      <form.Field name="confirmPassword">
        {(field) => {
          return (
            <FormField
              field={field}
              type={"password"}
              label={"Confirmation du mot de passe"}
              placeholder={""}
            />
          );
        }}
      </form.Field>

      <p className="text-sm text-center mt-4">
        Vous avez déjà un compte ?{" "}
        <Link
          to="/login"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Connectez-vous
        </Link>
      </p>

      <form.Subscribe
        selector={(state) => ({
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
        })}
      >
        {({ canSubmit, isSubmitting }) => (
          <FormAction
            form={form}
            canSubmit={canSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </form.Subscribe>
    </form>
  );
}
