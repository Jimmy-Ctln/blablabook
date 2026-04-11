import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import { useAuthStore } from "@/stores/authStore";
import type { UserProps } from "@/@types/user";

export const useUpdateUser = (
  userId: number,
  options?: {
    onSuccess?: (data: UserProps) => void;
    onError?: (error: any) => void;
  },
) => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: (updatedData: Partial<UserProps>) =>
      api.patch(`/user/${userId}`, updatedData),
    onSuccess: (response) => {
      const backendData = response.data;
      updateUser(backendData.user);
      queryClient.setQueryData(["user", userId], backendData);
      options?.onSuccess?.(backendData);
    },
    onError: (error) => {
      console.error(error);
      options?.onError?.(error);
    },
  });
};
