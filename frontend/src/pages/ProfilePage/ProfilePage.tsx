import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/stores/authStore";
import { Heart, Mail, Sparkles, User2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FieldLabel } from "@/components/ui/field";
import type { User } from "@/@types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage({ currentUser }: { currentUser: User }) {
  const store = useAuthStore();
  const user = store.user;

  if (!user) {
    return;
  }

  return (
    <div className="flex flex-col w-full px-10 mt-6 text-foreground">
      <div className="flex flex-col gap-2">
        <h2 className="text-5xl">Mon Profil</h2>
        <span className="text-muted-foreground text-xl">
          Gerez vos informations personnelles et vos preferences de lecture.
        </span>
      </div>
      <div className="flex flex-1 gap-12 mt-10">
        <div className="flex flex-col gap-8">
          <Card className="flex justify-center items-center border w-72 h-56 rounded-4xl">
            <Avatar className="w-10 h-10 border-2 bg-foreground hover:border-primary transition-all">
              {user.image ? (
                <AvatarImage
                  key={user.image}
                  src={user.image ? `/image/${user.image}` : undefined}
                  alt={`Avatar de ${user.username || "X"}`}
                />
              ) : (
                <AvatarFallback className="bg-bookbeige/50">
                  {user.username ? user.username[0].toUpperCase() : "X"}
                </AvatarFallback>
              )}
            </Avatar>
            <p className="text-xl">{user?.username}</p>
          </Card>
          <Card className="flex justify-center items-center border w-72 h-56 rounded-4xl">
            <div className="flex items-center gap-2">
              <Sparkles />
              <h4>Statistiques</h4>
            </div>
          </Card>
          <Card className="flex justify-center items-center border w-72 h-56 rounded-4xl">
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
