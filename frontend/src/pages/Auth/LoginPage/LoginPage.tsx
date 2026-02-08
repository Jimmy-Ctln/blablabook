import type { BackendErrorResponse } from "@/@types/form";
import api from "@/api/axios";
import FormAction from "@/components/Form/FormAction/FormAction";
import FormField from "@/components/Form/FormFields/FormField";
import FormGlobalError from "@/components/Form/FormGlobalError";
import FormTitle from "@/components/Form/FormTitle";
import { useAuthStore } from "@/stores/authStore";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import { useState } from "react";
import { z } from "zod";

const schema = z.object({
  username: z.string().min(1, "Le nom d'utilisateur doit être définis"),
  password: z.string().min(1, "Le mot de passe est attendu"),
});

type LoginFormData = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  // state for global error if request is failed
  const [globalError, setGlobalError] = useState<string | null>(null);

  const mutation = useMutation<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    AxiosError<BackendErrorResponse>,
    LoginFormData
  >({
    mutationFn: async (data: LoginFormData) => {
      return api.post("/auth/login", data);
    },
    onSuccess: (response) => {
      authStore.login(response.data);
      navigate({ to: "/" });
    },
    onError: (error) => {
      console.error("Erreur serveur: ", error.message);
    },
  });

  const defaultValues = {
    username: "",
    password: "",
  };

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      setGlobalError(null);
      mutation.mutate(value, {
        // if request failed, we set error message in the state, and reset input password
        onError: (error) => {
          const errorMessage =
            error.response?.data?.message || "Une erreur est survenue";
          setGlobalError(errorMessage); // add error message to the globalError state

          // reset input password
          form.setFieldValue("password", "");
          form.setFieldMeta("password", (prev) => ({
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
      className="w-70 md:w-150 flex flex-col items-center mx-auto"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FormTitle title="Connexion" />

      {globalError && (
        <div role="alert" aria-live="assertive">
          <FormGlobalError message={globalError} />
        </div>
      )}

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

      <p className="text-sm text-center mt-4">
        Pas encore de compte ?{" "}
        <Link
          to="/register"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Créez-en un ici
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
