import { Card } from "@/components/ui/card";
import { Heart, Mail, Sparkles, User2, Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FieldLabel } from "@/components/ui/field";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from "@/components/ui/button";
import { useState, type ReactNode } from "react";
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
import { useUpdateUser } from "./mutation/updateUser.mutation";
import { useAuthStore } from "@/stores/authStore";

export default function ProfilePage() {
  const { data: user, isLoading, isError } = useCurrentUser();
  const { updateUser } = useAuthStore();
  const [open, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<SelectedAvatar>();

  const userId = user?.id || undefined;

  const updateUserMutation = useUpdateUser(userId, {
    onSuccess: () => {
      // toast.success(`Profil mis à jour !`);
      handleClose();
    },
  });

  type SelectedAvatar = {
    id: string;
    sexe: string;
    source: string;
  };

  function handleClose() {
    setIsOpen(false);
    setSelected(undefined);
  }

  // console.log(user.image);

  const avatars: SelectedAvatar[] = [
    {
      id: "1",
      sexe: "Masculin",
      source: "/images/masculin-1.svg",
    },
    {
      id: "2",
      sexe: "Masculin",
      source: "/images/masculin-2.svg",
    },
    {
      id: "3",
      sexe: "feminin",
      source: "/images/feminin-1.svg",
    },
    {
      id: "4",
      sexe: "feminin",
      source: "/images/feminin-2.svg",
    },
  ];

  if (isLoading) return <div className="p-8 text-center">Chargement...</div>;
  if (isError || !user)
    return (
      <div className="p-8 text-center text-destructive">
        Impossible de charger le profil
      </div>
    );

  const userAvatar = (editingMode: boolean): ReactNode => (
    <Avatar
      onClick={() => !editingMode && setIsOpen(true)}
      className={`relative overflow-visible w-32 h-32 border-2 ${!editingMode && "cursor-pointer hover:border-primary transition-all"}`}
    >
      {user.image ? (
        <AvatarImage
          className={`z-0`}
          src={user.image ? `${user.image}` : undefined}
          alt={`Avatar de ${user.username}`}
        />
      ) : (
        <AvatarFallback className="z-0 bg-foreground text-black text-3xl">
          {user.username && user.username[0].toUpperCase()}
        </AvatarFallback>
      )}
      {!editingMode && (
        <Button className="absolute w-10 h-10 -bottom-2 -right-2 z-20 rounded-full">
          <Camera />
        </Button>
      )}
    </Avatar>
  );

  return (
    <div className="flex flex-col w-full px-10 mt-6 text-foreground">
      <div className="flex flex-col gap-2">
        <h2 className="text-5xl">Mon Profil</h2>
        <span className="text-muted-foreground text-xl">
          Gerez vos informations personnelles et vos preferences de lecture.
        </span>
      </div>
      <Dialog open={open} onOpenChange={() => handleClose()}>
        <DialogContent className="sm:max-w-sm text-foreground rounded-3xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (selected) {
                updateUserMutation.mutate({ image: selected.source });
                updateUser({ user: selected.source });
                handleClose();
              }
            }}
          >
            <DialogHeader>
              <DialogTitle>Choisir un avatar</DialogTitle>
              <DialogDescription>
                Selectionnez votre photo de profil
              </DialogDescription>
              <Separator className="my-4" />
              <div className="flex mx-auto">
                {!selected ? (
                  userAvatar(true)
                ) : (
                  <img
                    className="w-32"
                    src={selected.source}
                    alt="Preview avatar utilisateur"
                  />
                )}
              </div>
              <Separator className="my-8" />
              <div className="flex gap-4 justify-around">
                {avatars.map((avatar) => (
                  <div
                    key={avatar.id}
                    className="gap-4 cursor-pointer border border-transparent rounded-full hover:border-primary transition-all"
                    onClick={() => {
                      setSelected(avatar);
                    }}
                  >
                    <img
                      src={avatar.source}
                      alt="Avatars utilisateurs"
                      className=""
                    />
                  </div>
                ))}
              </div>
              <Separator className="my-8" />
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleClose()}
                >
                  Annuler
                </Button>
              </DialogClose>
              <Button type="submit" disabled={!selected}>
                Confirmer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <div className="flex flex-1 gap-12 mt-10">
        <div className="flex flex-col gap-8">
          <Card className="flex justify-center items-center border w-80 h-56 rounded-4xl">
            {userAvatar(false)}
            <p className="text-xl">{user?.username}</p>
          </Card>
          <Card className="flex blur justify-center items-center border w-80 h-56 rounded-4xl">
            <div className="flex items-center gap-2">
              <Sparkles />
              <h4>Statistiques</h4>
            </div>
          </Card>
          <Card className="flex blur justify-center items-center border w-80 h-56 rounded-4xl">
            <div className="flex items-center gap-2">
              <Heart />
              <h4 className="text-xl">Genres preferes</h4>
            </div>
          </Card>
        </div>
        <div className="flex flex-col w-full gap-2">
          <h3 className="text-xl">Informations personnelles</h3>
          <span className="text-muted-foreground">
            Cliquez sur un champ pour le modifier.
          </span>
          <div className="flex flex-col mt-8 gap-4">
            <FieldLabel htmlFor="input-field-username">
              <User2 width={20} />
              Nom complet
            </FieldLabel>
            <Input
              id="input-field-username"
              type="text"
              placeholder="Votre prenom et nom"
              value={user?.username}
            />
          </div>
          <div className="flex flex-col mt-8 gap-4">
            <FieldLabel htmlFor="input-field-username">
              <Mail width={20} />
              Email
            </FieldLabel>
            <Input
              id="input-field-email"
              type="text"
              placeholder="thomas@gmail.com"
              value={user?.email}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
