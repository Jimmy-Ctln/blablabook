import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/api/axios";

interface DeleteAccountResponse {
  message: string;
}

export const useDeleteAccount = (
  options?: UseMutationOptions<
    DeleteAccountResponse,
    AxiosError<DeleteAccountResponse>,
    void
  >,
) => {
  return useMutation({
    mutationFn: async () => {
      const response = await api.delete<DeleteAccountResponse>("user");
      return response.data;
    },
    ...options,
  });
};
