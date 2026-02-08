import { useState } from "react";
import { Pencil } from "lucide-react";
import ProfilePageModal from "./ProfilePageModale";
import { useQueryClient } from "@tanstack/react-query";
import type { User } from "../../@types/user";
import { Button } from "@/components/ui/button";
import { useDeleteUser } from "./mutation/deleteUser.mutation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage({ currentUser }: { currentUser: User }) {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteUserMutation = useDeleteUser(currentUser.id);

  return (
    <div className="flex w-full flex-col items-center justify-center py-6 md:py-0">
      {/* Carré principal */}
      <div
        className="w-full max-w-md md:max-w-lg lg:max-w-2xl border border-bookbeige shadow-sm rounded-xl p-4 lg:p-4 flex flex-col justify-between
          min-h-[500px] md:min-h-[550px] lg:min-h-[600px]
          "
      >
        {/* Bloc supérieur : crayon + image + infos */}
        <div>
          {/* Crayon */}
          <div className="flex justify-end mb-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-10 h-10 flex items-center bg-primary justify-center rounded-full border border-bookbeige cursor-pointer transition"
              title="Modifier profil"
              aria-label="Modifier le profil"
            >
              <Pencil size={20} color="white" />
            </button>
          </div>

          {/* Image */}
          <Avatar className="w-28 h-28 mx-auto mb-16 border border-bookbeige shadow">
            {currentUser.image && (
              <AvatarImage
                src={`/images/${currentUser.image}`}
                alt={`Avatar de ${currentUser.username}`}
              />
            )}
            <AvatarFallback className="text-4xl bg-bookbeige/50 font-bold">
              {currentUser.username
                ? currentUser.username[0].toUpperCase()
                : "X"}
            </AvatarFallback>
          </Avatar>
          {/* Infos utilisateur alignées */}
          <div className="grid grid-cols-[max-content_1fr] gap-x-4 md:gap-x-8 lg:gap-x-12 gap-y-2 md:w-[400px] lg:w-[400px] mx-auto">
            <span className="font-semibold">Nom d'utilisateur :</span>
            <span className="break-words min-w-0">{currentUser?.username}</span>

            <span className="font-semibold">Email :</span>
            <span className="break-words min-w-0">
              {currentUser?.email.toLowerCase()}
            </span>

            <span className="font-semibold">Mot de passe :</span>
            <span className="tracking-widest break-words min-w-0">
              ••••••••••••
            </span>
          </div>
        </div>

        {/* Bouton supprimer en bas */}
        <Button
          disabled={deleteUserMutation.isPending}
          onClick={() => deleteUserMutation.mutate()}
          size={"delete"}
          className="mx-auto cursor-pointer bg-destructive"
        >
          {deleteUserMutation.isPending
            ? "Suppression..."
            : "Supprimer mon compte"}
        </Button>
      </div>

      {/* Modale */}
      {isModalOpen && currentUser && (
        <ProfilePageModal
          userId={currentUser.id}
          onClose={() => setIsModalOpen(false)}
          onUpdate={(updatedUser) => {
            // au lieu de setUser (useEffect)
            queryClient.setQueryData(["user", currentUser.id], updatedUser);
          }}
        />
      )}
    </div>
  );
}
