import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/authStore";

export const useDeleteUser = (userId: number) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: async () => {
      const confirmed = confirm("Êtes-vous sûr de vouloir supprimer votre compte ?");
      if (!confirmed) throw new Error("Suppression annulée");
      return api.patch(`/user/${userId}/soft-delete`);
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user", userId] });
      logout(); 
      alert("Compte supprimé !");
      navigate({ to: "/" });
    },
    onError: (error) => {
      if (error.message !== "Suppression annulée") {
        alert("Erreur lors de la suppression du compte");
        console.error(error);
      }
    },
  });
};
