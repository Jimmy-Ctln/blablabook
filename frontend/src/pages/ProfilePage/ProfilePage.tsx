import { Card } from "@/components/ui/card";
import { usePageTitle, useNoIndex } from "@/hooks/usePageTitle";
import {
  Mail,
  Eye,
  EyeOff,
  User2,
  Camera,
  Lock,
  AlertTriangle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { FieldLabel } from "@/components/ui/field";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from "@/components/ui/button";
import { useEffect, useState, type ReactNode } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useUpdateUser } from "./mutation/updateUser.mutation";
import { useAuthStore } from "@/stores/authStore";
import { useChangePassword } from "./mutation/changePassword.mutation";
import { useDeleteAccount } from "./mutation/deleteAccount.mutation";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import FormFieldInfo from "@/components/Form/FormFields/FormFieldInfo";
import type { SelectedAvatar } from "@/@types/user";

const userInfoSchema = z.object({
  username: z.string().min(3, "Au moins 3 caractères requis").trim(),
  email: z.email("Format d'email invalide (ex : nom@domaine.com)").trim(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
    newPassword: z
      .string()
      .min(8, "Au moins 8 caractères requis")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
        "Doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial",
      ),
    confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

const UPDATE_USER_ERRORS: Record<string, string> = {
  "Email already in use": "Cette adresse email est déjà utilisée",
  "username is already in use": "Ce nom d'utilisateur est déjà pris",
};

const CHANGE_PASSWORD_ERRORS: Record<string, string> = {
  "Current password is incorrect": "Le mot de passe actuel est incorrect",
};

export default function ProfilePage() {
  usePageTitle("Mon profil");
  useNoIndex();
  const { data: user, isLoading, isError } = useCurrentUser();
  const { logout } = useAuthStore();

  const [editMode, setEditMode] = useState<"Enregistrer" | "Modifier">(
    "Modifier",
  );
  const [openAvatarDialog, setOpenAvatarDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selected, setSelected] = useState<SelectedAvatar>();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const userId = user?.id ?? 0;

  const updateUserMutation = useUpdateUser(userId, {
    onSuccess: () => {
      handleCloseAvatarDialog();
      toast.success("Informations mises à jour avec succès!");
    },
    onError: (error) => {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "";
      toast.error(
        UPDATE_USER_ERRORS[message] ??
          "Erreur lors de la mise à jour des informations",
      );
    },
  });

  const changePasswordMutation = useChangePassword({
    onSuccess: () => {
      passwordForm.reset();
      setOpenPasswordDialog(false);
      toast.success("Mot de passe modifié avec succès");
    },
    onError: (error) => {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "";
      toast.error(
        CHANGE_PASSWORD_ERRORS[message] ??
          "Erreur lors de la modification du mot de passe",
      );
    },
  });

  const deleteAccountMutation = useDeleteAccount({
    onSuccess: () => {
      logout();
      toast.success("Compte supprimé avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression du compte");
    },
  });

  const userInfoForm = useForm({
    defaultValues: {
      username: user?.username ?? "",
      email: user?.email ?? "",
    },
    validators: {
      onChange: userInfoSchema,
    },
    onSubmit: async ({ value }) => {
      const updateData: Partial<{ username: string; email: string }> = {};
      if (value.username !== user?.username)
        updateData.username = value.username;
      if (value.email !== user?.email) updateData.email = value.email;

      if (Object.keys(updateData).length === 0) {
        setEditMode("Modifier");
        return;
      }

      try {
        await updateUserMutation.mutateAsync(updateData);
        setEditMode("Modifier");
      } catch {
        // Toast shown by mutation's onError
      }
    },
  });

  const passwordForm = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onChange: passwordSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await changePasswordMutation.mutateAsync({
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
        });
      } catch {
        // Toast shown by mutation's onError
      }
    },
  });

  // Sync form values when user data updates after a successful mutation
  useEffect(() => {
    if (user) {
      userInfoForm.reset({
        username: user.username ?? "",
        email: user.email ?? "",
      });
    }
  }, [user, userInfoForm]);

  // Reset password form and visibility toggles when dialog closes
  useEffect(() => {
    if (!openPasswordDialog) {
      passwordForm.reset();
      /* eslint-disable react-hooks/set-state-in-effect */
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [openPasswordDialog, passwordForm]);

  if (isLoading)
    return <div className="p-8 text-center">Chargement du profil...</div>;
  if (isError || !user)
    return (
      <div className="p-8 text-center text-destructive">
        Impossible de charger le profil
      </div>
    );

  function handleCloseAvatarDialog() {
    setOpenAvatarDialog(false);
    setSelected(undefined);
  }

  const avatars: SelectedAvatar[] = [
    { id: "1", sexe: "Masculin", source: "/avatars/masculin-1.svg" },
    { id: "2", sexe: "Masculin", source: "/avatars/masculin-2.svg" },
    { id: "3", sexe: "feminin", source: "/avatars/feminin-1.svg" },
    { id: "4", sexe: "feminin", source: "/avatars/feminin-2.svg" },
  ];

  const userAvatar = (editingMode: boolean): ReactNode => (
    <Avatar
      onClick={() => !editingMode && setOpenAvatarDialog(true)}
      className={`relative overflow-visible w-32 h-32 border-4 border-primary/20 ${
        !editingMode && "cursor-pointer hover:border-primary transition-all"
      }`}
    >
      {user.avatar_url ? (
        <AvatarImage
          className="z-0"
          src={user.avatar_url ? `${user.avatar_url}` : undefined}
          alt={`Avatar de ${user.username}`}
        />
      ) : (
        <AvatarFallback className="z-0 text-foreground text-3xl font-bold">
          {user.username && user.username[0].toUpperCase()}
        </AvatarFallback>
      )}
      {!editingMode && (
        <Button
          size="icon"
          className="absolute w-10 h-10 -bottom-2 -right-2 z-20 rounded-full bg-primary hover:bg-primary/90"
        >
          <Camera className="h-4 w-4" />
        </Button>
      )}
    </Avatar>
  );

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="container px-4 sm:px-6 py-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
            Mon Profil
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Gérez vos informations personnelles et vos préférences
          </p>
        </div>
      </div>

      <div className="container px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="p-6 rounded-2xl flex flex-col items-center">
              {userAvatar(false)}
              <h2 className="mt-6 text-2xl font-bold text-foreground text-center">
                {user?.username}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {user?.email}
              </p>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 rounded-2xl">
              <form
                id="user-info-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  userInfoForm.handleSubmit();
                }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-foreground">
                    Informations personnelles
                  </h3>
                  <div className="gap-2 flex">
                    {editMode === "Enregistrer" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        type="button"
                        onClick={() => {
                          setEditMode("Modifier");
                          userInfoForm.reset();
                        }}
                      >
                        Annuler
                      </Button>
                    )}
                    <userInfoForm.Subscribe
                      selector={(state) => ({
                        isDirty: state.isDirty,
                        isSubmitting: state.isSubmitting,
                        canSubmit: state.canSubmit,
                      })}
                    >
                      {({ isDirty, isSubmitting, canSubmit }) => (
                        <Button
                          variant={
                            editMode === "Modifier" ? "outline" : "default"
                          }
                          size="sm"
                          type={
                            editMode === "Enregistrer" ? "submit" : "button"
                          }
                          disabled={
                            isSubmitting ||
                            (editMode === "Enregistrer" &&
                              (!isDirty || !canSubmit))
                          }
                          onClick={() => {
                            if (editMode === "Modifier") {
                              setEditMode("Enregistrer");
                            }
                          }}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="animate-spin mr-2">⏳</span>
                              Enregistrement...
                            </>
                          ) : (
                            editMode
                          )}
                        </Button>
                      )}
                    </userInfoForm.Subscribe>
                  </div>
                </div>
                <Separator className="mb-4" />

                <div className="space-y-4">
                  <userInfoForm.Field name="username">
                    {(field) => (
                      <div>
                        <FieldLabel
                          htmlFor={field.name}
                          className="mb-2 flex items-center gap-2"
                        >
                          <User2 className="h-4 w-4" />
                          Nom d'utilisateur
                        </FieldLabel>
                        <Input
                          id={field.name}
                          type="text"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={editMode === "Modifier"}
                          placeholder="Votre profil"
                          aria-invalid={
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid
                          }
                          className={`rounded-lg${
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid
                              ? " border-destructive focus-visible:ring-destructive"
                              : ""
                          }`}
                        />
                        <FormFieldInfo field={field} />
                      </div>
                    )}
                  </userInfoForm.Field>

                  <userInfoForm.Field name="email">
                    {(field) => (
                      <div>
                        <FieldLabel
                          htmlFor={field.name}
                          className="mb-2 flex items-center gap-2"
                        >
                          <Mail className="h-4 w-4" />
                          Email
                        </FieldLabel>
                        <Input
                          id={field.name}
                          type="email"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={editMode === "Modifier"}
                          placeholder="votre@email.com"
                          aria-invalid={
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid
                          }
                          className={`rounded-lg${
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid
                              ? " border-destructive focus-visible:ring-destructive"
                              : ""
                          }`}
                        />
                        <FormFieldInfo field={field} />
                      </div>
                    )}
                  </userInfoForm.Field>
                </div>
              </form>
            </Card>

            <Card className="p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Sécurité
              </h3>
              <Separator className="mb-4" />

              <Button
                variant="outline"
                className="w-full sm:w-auto rounded-lg"
                onClick={() => setOpenPasswordDialog(true)}
              >
                Modifier le mot de passe
              </Button>

              <Dialog
                open={openPasswordDialog}
                onOpenChange={setOpenPasswordDialog}
              >
                <DialogContent className="rounded-2xl max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">
                      Modifier le mot de passe
                    </DialogTitle>
                    <DialogDescription>
                      Entrez votre mot de passe actuel et votre nouveau mot de
                      passe
                    </DialogDescription>
                  </DialogHeader>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      passwordForm.handleSubmit();
                    }}
                    className="space-y-4 text-foreground"
                  >
                    <passwordForm.Field name="currentPassword">
                      {(field) => (
                        <div>
                          <FieldLabel htmlFor={field.name} className="mb-2">
                            Mot de passe actuel
                          </FieldLabel>
                          <div className="relative">
                            <Input
                              id={field.name}
                              type={showCurrentPassword ? "text" : "password"}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              placeholder="••••••••"
                              aria-invalid={
                                field.state.meta.isTouched &&
                                !field.state.meta.isValid
                              }
                              className={`pr-10 rounded-lg${
                                field.state.meta.isTouched &&
                                !field.state.meta.isValid
                                  ? " border-destructive focus-visible:ring-destructive"
                                  : ""
                              }`}
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                              onClick={() =>
                                setShowCurrentPassword(!showCurrentPassword)
                              }
                            >
                              {showCurrentPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </button>
                          </div>
                          <FormFieldInfo field={field} />
                        </div>
                      )}
                    </passwordForm.Field>

                    <passwordForm.Field name="newPassword">
                      {(field) => (
                        <div>
                          <FieldLabel htmlFor={field.name} className="mb-2">
                            Nouveau mot de passe
                          </FieldLabel>
                          <div className="relative">
                            <Input
                              id={field.name}
                              type={showNewPassword ? "text" : "password"}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              placeholder="••••••••"
                              aria-invalid={
                                field.state.meta.isTouched &&
                                !field.state.meta.isValid
                              }
                              className={`pr-10 rounded-lg${
                                field.state.meta.isTouched &&
                                !field.state.meta.isValid
                                  ? " border-destructive focus-visible:ring-destructive"
                                  : ""
                              }`}
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </button>
                          </div>
                          <FormFieldInfo field={field} />
                        </div>
                      )}
                    </passwordForm.Field>

                    <passwordForm.Field name="confirmPassword">
                      {(field) => (
                        <div>
                          <FieldLabel htmlFor={field.name} className="mb-2">
                            Confirmer le mot de passe
                          </FieldLabel>
                          <Input
                            id={field.name}
                            type="password"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="••••••••"
                            aria-invalid={
                              field.state.meta.isTouched &&
                              !field.state.meta.isValid
                            }
                            className={`rounded-lg${
                              field.state.meta.isTouched &&
                              !field.state.meta.isValid
                                ? " border-destructive focus-visible:ring-destructive"
                                : ""
                            }`}
                          />
                          <FormFieldInfo field={field} />
                        </div>
                      )}
                    </passwordForm.Field>

                    <DialogFooter className="gap-2 pt-4">
                      <DialogClose asChild>
                        <Button
                          variant="outline"
                          type="button"
                          className="rounded-lg"
                        >
                          Annuler
                        </Button>
                      </DialogClose>
                      <passwordForm.Subscribe
                        selector={(state) => ({
                          canSubmit: state.canSubmit,
                          isSubmitting: state.isSubmitting,
                        })}
                      >
                        {({ canSubmit, isSubmitting }) => (
                          <Button
                            type="submit"
                            className="rounded-lg"
                            disabled={!canSubmit || isSubmitting}
                          >
                            {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
                          </Button>
                        )}
                      </passwordForm.Subscribe>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </Card>

            <Card className="p-6 rounded-2xl border-destructive/30 bg-destructive/5">
              <h3 className="text-xl font-bold text-destructive mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Zone de danger
              </h3>
              <Separator className="mb-4 bg-destructive/20" />

              <p className="text-sm text-muted-foreground mb-4">
                Attention: cette action est irréversible. Une fois votre compte
                supprimé, toutes vos données seront perdues.
              </p>

              <Button
                variant="destructive"
                className="rounded-lg"
                onClick={() => setOpenDeleteDialog(true)}
              >
                Supprimer mon compte
              </Button>

              <Dialog
                open={openDeleteDialog}
                onOpenChange={setOpenDeleteDialog}
              >
                <DialogContent className="rounded-2xl max-w-md border-destructive/30">
                  <DialogHeader>
                    <DialogTitle className="text-destructive">
                      Supprimer définitivement votre compte
                    </DialogTitle>
                    <DialogDescription>
                      Cette action est irréversible. Tous vos données, livres et
                      favoris seront supprimés.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/30">
                    <p className="text-sm text-foreground font-semibold">
                      Êtes-vous absolument certain ?
                    </p>
                  </div>

                  <DialogFooter className="gap-2 pt-4">
                    <DialogClose asChild>
                      <Button variant="outline" className="rounded-lg">
                        Annuler
                      </Button>
                    </DialogClose>
                    <Button
                      variant="destructive"
                      onClick={() => deleteAccountMutation.mutate()}
                      className="rounded-lg"
                    >
                      Supprimer définitivement
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={openAvatarDialog} onOpenChange={setOpenAvatarDialog}>
        <DialogContent className="rounded-2xl max-w-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (selected) {
                updateUserMutation.mutate({ avatar_url: selected.source });
                handleCloseAvatarDialog();
              }
            }}
          >
            <DialogHeader className="text-foreground">
              <DialogTitle>Choisir un avatar</DialogTitle>
              <DialogDescription>
                Sélectionnez votre photo de profil
              </DialogDescription>
              <Separator className="my-4" />
              <div className="flex mx-auto">
                {!selected ? (
                  userAvatar(true)
                ) : (
                  <img
                    className="w-32 rounded-full"
                    src={selected.source}
                    alt={`Aperçu de l'avatar sélectionné`}
                  />
                )}
              </div>
              <Separator className="my-8" />
              <div className="flex gap-4 justify-center flex-wrap">
                {avatars.map((avatar) => (
                  <div
                    key={avatar.id}
                    className={`cursor-pointer border-2 rounded-full p-2 transition-all ${
                      selected?.id === avatar.id
                        ? "border-primary bg-primary/10"
                        : "border-transparent hover:border-primary/50"
                    }`}
                    onClick={() => setSelected(avatar)}
                  >
                    <img
                      src={avatar.source}
                      alt={`Avatar ${avatar.sexe === "Masculin" ? "masculin" : "féminin"} n°${avatar.id}`}
                      className="w-16"
                    />
                  </div>
                ))}
              </div>
              <Separator className="my-8" />
            </DialogHeader>
            <DialogFooter className="gap-2 text-foreground">
              <DialogClose asChild>
                <Button variant="outline" type="button" className="rounded-lg">
                  Annuler
                </Button>
              </DialogClose>
              <Button type="submit" disabled={!selected} className="rounded-lg">
                Confirmer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
