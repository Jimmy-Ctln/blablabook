import type { BackendErrorResponse } from "@/@types/form";
import { usePageTitle } from "@/hooks/usePageTitle";
import api from "@/api/axios";
import FormAction from "@/components/Form/FormAction/FormAction";
import FormField from "@/components/Form/FormFields/FormField";
import FormTitle from "@/components/Form/FormTitle";
import { useAuthStore } from "@/stores/authStore";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { z } from "zod";

const LOGIN_ERRORS: Record<string, string> = {
  "email or password is invalid": "Email ou mot de passe incorrect",
};

const schema = z.object({
  email: z.email("Format d'email invalide (ex : nom@domaine.com)"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  usePageTitle("Connexion");
  const navigate = useNavigate();
  const authStore = useAuthStore();

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
  });

  const defaultValues = {
    email: "",
    password: "",
  };

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      try {
        await mutation.mutateAsync(value);
      } catch (error) {
        const axiosError = error as AxiosError<BackendErrorResponse>;
        const backendMessage = axiosError.response?.data?.message ?? "";
        toast.error(LOGIN_ERRORS[backendMessage] ?? "Une erreur est survenue");

        form.setFieldValue("password", "");
        form.setFieldMeta("password", (prev) => ({
          ...prev,
          isTouched: false,
        }));
      }
    },
    validators: {
      onChange: schema,
    },
  });

  return (
    <form
      className="w-70 md:w-150 flex flex-col items-center mx-auto text-foreground"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FormTitle title="Connexion" />

      <form.Field name="email">
        {(field) => {
          return (
            <FormField
              field={field}
              type={"string"}
              label={"Email"}
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
