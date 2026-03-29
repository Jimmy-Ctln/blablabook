import { Card } from "@/components/ui/card";
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

export default function ProfilePage() {
  const { data: user, isLoading, isError } = useCurrentUser();
  const { logout } = useAuthStore();
  const [editMode, setEditMode] = useState<"Enregistrer" | "Modifier">(
    "Modifier",
  );
  const [openAvatarDialog, setOpenAvatarDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selected, setSelected] = useState<SelectedAvatar>();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [userName, setUserName] = useState(user?.username);
  const [userEmail, setUserEmail] = useState(user?.email);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  if (!user) {
    return;
  }
  const userId = user.id;

  useEffect(() => {
    if (userName !== user.username || userEmail !== user.email) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [userName, userEmail]);

  useEffect(() => {
    setUserName(user?.username);
    setUserEmail(user?.email);
  }, [user]);

  const updateUserMutation = useUpdateUser(userId, {
    onSuccess: () => {
      handleCloseAvatarDialog();
      toast.success("Informations mises à jour avec succès!");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour des informations");
    },
  });

  const changePasswordMutation = useChangePassword({
    onSuccess: () => {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setOpenPasswordDialog(false);
      toast.success("Mot de passe modifié avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la modification du mot de passe");
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

  type SelectedAvatar = {
    id: string;
    sexe: string;
    source: string;
  };

  function handleCloseAvatarDialog() {
    setOpenAvatarDialog(false);
    setSelected(undefined);
  }

  const avatars: SelectedAvatar[] = [
    {
      id: "1",
      sexe: "Masculin",
      source: "/avatars/masculin-1.svg",
    },
    {
      id: "2",
      sexe: "Masculin",
      source: "/avatars/masculin-2.svg",
    },
    {
      id: "3",
      sexe: "feminin",
      source: "/avatars/feminin-1.svg",
    },
    {
      id: "4",
      sexe: "feminin",
      source: "/avatars/feminin-2.svg",
    },
  ];

  if (isLoading)
    return <div className="p-8 text-center">Chargement du profil...</div>;
  if (isError || !user)
    return (
      <div className="p-8 text-center text-destructive">
        Impossible de charger le profil
      </div>
    );

  const userAvatar = (editingMode: boolean): ReactNode => (
    <Avatar
      onClick={() => !editingMode && setOpenAvatarDialog(true)}
      className={`relative overflow-visible w-32 h-32 border-4 border-primary/20 ${
        !editingMode && "cursor-pointer hover:border-primary transition-all"
      }`}
    >
      {user.avatar_url ? (
        <AvatarImage
          className={`z-0`}
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

  const handleUserInfoChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasChanges) {
      setEditMode("Modifier");
      return;
    }

    if (userEmail && !userEmail.includes("@")) {
      toast.error("Email invalide");
      return;
    }

    const updateData: any = {};
    if (userName !== user.username) updateData.username = userName;
    if (userEmail !== user.email) updateData.email = userEmail;

    if (Object.keys(updateData).length > 0) {
      updateUserMutation.mutate(updateData);
      setEditMode("Modifier");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  const handleDeleteAccount = async () => {
    deleteAccountMutation.mutate();
  };

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
                onSubmit={handleUserInfoChange}
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
                        variant={"secondary"}
                        type="button"
                        onClick={() => setEditMode("Modifier")}
                      >
                        Annuler
                      </Button>
                    )}
                    <Button
                      variant={editMode === "Modifier" ? "outline" : "default"}
                      size="sm"
                      type={editMode === "Enregistrer" ? "submit" : "button"}
                      disabled={
                        updateUserMutation.isPending ||
                        (editMode === "Enregistrer" && !hasChanges)
                      }
                      onClick={() => {
                        if (editMode === "Modifier") {
                          setEditMode("Enregistrer");
                        }
                      }}
                    >
                      {updateUserMutation.isPending ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Enregistrement...
                        </>
                      ) : (
                        editMode
                      )}
                    </Button>
                  </div>
                </div>
                <Separator className="mb-4" />

                <div className="space-y-4">
                  <div>
                    <FieldLabel
                      htmlFor="username"
                      className="mb-2 flex items-center gap-2"
                    >
                      <User2 className="h-4 w-4" />
                      Nom complet
                    </FieldLabel>
                    <Input
                      id="username"
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      disabled={editMode === "Modifier"}
                      placeholder="Votre profil"
                      className="rounded-lg"
                    />
                  </div>
                  <div>
                    <FieldLabel
                      htmlFor="email"
                      className="mb-2 flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      disabled={editMode === "Modifier"}
                      placeholder="votre@email.com"
                      className="rounded-lg"
                    />
                  </div>
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
                    onSubmit={handlePasswordChange}
                    className="space-y-4 text-foreground"
                  >
                    <div>
                      <FieldLabel htmlFor="current-password" className="mb-2">
                        Mot de passe actuel
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
                          placeholder="••••••••"
                          className="pr-10 rounded-lg"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <FieldLabel htmlFor="new-password" className="mb-2">
                        Nouveau mot de passe
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          placeholder="••••••••"
                          className="pr-10 rounded-lg"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <FieldLabel htmlFor="confirm-password" className="mb-2">
                        Confirmer le mot de passe
                      </FieldLabel>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="••••••••"
                        className="rounded-lg"
                      />
                    </div>

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
                      <Button type="submit" className="rounded-lg">
                        Mettre à jour
                      </Button>
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
                      onClick={handleDeleteAccount}
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
                    alt="Preview avatar utilisateur"
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
                    onClick={() => {
                      setSelected(avatar);
                    }}
                  >
                    <img
                      src={avatar.source}
                      alt="Avatar option"
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
