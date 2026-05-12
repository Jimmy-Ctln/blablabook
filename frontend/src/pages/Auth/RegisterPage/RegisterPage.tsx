import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "@tanstack/react-router";
import api from "@/api/axios";
import type { AxiosError } from "axios";
import { useForm } from "@tanstack/react-form";
import FormTitle from "@/components/Form/FormTitle";
import FormField from "@/components/Form/FormFields/FormField";
import FormAction from "@/components/Form/FormAction/FormAction";
import type { BackendErrorResponse } from "@/@types/form";
import { toast } from "sonner";

const REGISTER_ERRORS: Record<string, string> = {
  "email is already in use": "Cette adresse email est déjà utilisée",
  "username is already in use": "Ce nom d'utilisateur est déjà pris",
  "password is not confirmed": "Les mots de passe ne correspondent pas",
  "failed to create new user":
    "Une erreur est survenue lors de la création du compte",
};

const schema = z
  .object({
    email: z.email("Format d'email invalide (ex : nom@domaine.com)").trim(),
    username: z.string().min(3, "Au moins 3 caractères requis").trim(),
    password: z
      .string()
      .min(8, "Au moins 8 caractères requis")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
        "Doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial",
      )
      .trim(),
    confirmPassword: z
      .string()
      .min(1, "Veuillez confirmer votre mot de passe")
      .trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
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
      toast.success("Votre compte a bien été créé");
      navigate({ to: "/login" });
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
      try {
        await mutation.mutateAsync(value);
      } catch (error) {
        const axiosError = error as AxiosError<BackendErrorResponse>;
        const backendMessage = axiosError.response?.data?.message ?? "";
        toast.error(
          REGISTER_ERRORS[backendMessage] ?? "Une erreur est survenue",
        );

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
      }
    },
    validators: {
      onChange: schema,
    },
  });

  return (
    <form
      className=" w-70 md:w-150 flex flex-col items-center mx-auto text-foreground"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FormTitle title="Inscription" />

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
