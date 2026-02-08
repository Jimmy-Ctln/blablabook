import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import type { UpdateUserInput } from "../../../@types/user";

export const useUpdateUser = (userId: number, options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedData: UpdateUserInput) => api.patch(`/user/${userId}`, updatedData),
    onSuccess: (_, updatedData) => {
      queryClient.setQueryData(["user", userId], updatedData);
      //TODO Modale génétique pour les alertes
      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      alert("Erreur lors de la mise à jour.");
    },
  });
};
