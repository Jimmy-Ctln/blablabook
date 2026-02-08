import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { useUpdateUser } from "./mutation/updateUser.mutation";
import type { UpdateUserInput } from "../../@types/user";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuthStore } from "@/stores/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AvatarCarousel from "@/components/AvatarCarousel";

type UpdateUserFormProps = {
  userId: number;
  onClose?: () => void;
  onUpdate?: (updatedUser: {
    email: string;
    username: string;
    image?: string;
  }) => void;
};

const availableImages = [
  "image1.jpg",
  "image2.jpg",
  "image3.jpg",
  "image4.jpg",
  "image5.jpg",
  "image6.jpg",
];

export default function UpdateUserForm({
  userId,
  onClose,
  onUpdate,
}: UpdateUserFormProps) {
  const updateUserMutation = useUpdateUser(userId);

  const { data: currentUser } = useCurrentUser();
  const form = useForm({
    defaultValues: {
      username: currentUser?.username || "",
      email: currentUser?.email.toLowerCase() || "",
      password: "",
      confirmPassword: "",
      image: currentUser?.image || undefined,
    },
    onSubmit: async ({ value }) => {
      if (!currentUser) return;
      if (value.password && value.password !== value.confirmPassword) {
        alert("Les mots de passe ne correspondent pas !");
        return;
      }

      const body: UpdateUserInput = {
        username: value.username,
        email: value.email.toLowerCase(),
        image: value.image,
        ...(value.password ? { password: value.password } : {}),
      };

      updateUserMutation.mutate(body, {
        onSuccess: () => {
          // mettre à jour le store
          useAuthStore.getState().updateUser({
            username: value.username,
            email: value.email,
            image: value.image,
          });
          if (onUpdate)
            onUpdate({
              username: value.username,
              email: value.email,
              image: value.image,
            });
          if (onClose) onClose();
        },
      });
    },
  });

  if (!currentUser) {
    return <output aria-live="polite">Loading...</output>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="max-w-md mx-auto p-6 bg-white shadow border border-bookbeige/50 rounded-xl space-y-4"
    >
      {/* Image actuelle */}
      <form.Field name="image">
        {(field) => (
          <>
            <Avatar className="w-28 h-28 mx-auto mb-6 border border-bookbeige shadow">
              <AvatarImage
                src={
                  field.state.value ? `/images/${field.state.value}` : undefined
                }
                alt={`Avatar de ${currentUser.username || "l'utilisateur"}`}
              />
              <AvatarFallback className="text-4xl bg-bookbeige/50 border-bookbeige font-bold">
                {currentUser.username
                  ? currentUser.username[0].toUpperCase()
                  : "X"}
              </AvatarFallback>
            </Avatar>

            {/* Miniatures */}
            <div className="flex justify-center gap-3 mb-8">
              <form.Field name="image">
                {(field) => (
                  <AvatarCarousel
                    images={availableImages}
                    selectedImage={field.state.value}
                    onSelect={(img) => field.handleChange(img)}
                  />
                )}
              </form.Field>
            </div>
          </>
        )}
      </form.Field>

      {/* Champs */}
      <form.Field name="username">
        {(field) => (
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-500 text-sm mb-1"
            >
              Nom d'utilisateur
            </label>
            <input
              id="username"
              type="text"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Entrez votre nom d'utilisateur"
              autoComplete="username"
              className="w-full border rounded px-3 py-2 text-sm placeholder-gray-400"
            />
          </div>
        )}
      </form.Field>

      <form.Field name="email">
        {(field) => (
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-500 text-sm mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Entrez votre email"
              autoComplete="email"
              className="w-full border rounded px-3 py-2 text-sm placeholder-gray-400"
            />
          </div>
        )}
      </form.Field>

      <form.Field name="password">
        {(field) => (
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-500 text-sm mb-1"
            >
              Mot de mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Nouveau mot de passe"
              autoComplete="new-password"
              className="w-full border rounded px-3 py-2 text-sm placeholder-gray-400"
            />
          </div>
        )}
      </form.Field>

      <form.Field name="confirmPassword">
        {(field) => (
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-500 text-sm mb-1"
            >
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Confirmez"
              autoComplete="new-password"
              className="w-full border rounded px-3 py-2 text-sm placeholder-gray-400"
            />
          </div>
        )}
      </form.Field>

      <Button
        type="submit"
        className="w-full mt-4 cursor-pointer bg-bookterracotta bg-primary"
      >
        {updateUserMutation.isPending ? "Mise à jour..." : "Enregistrer"}
      </Button>
    </form>
  );
}
