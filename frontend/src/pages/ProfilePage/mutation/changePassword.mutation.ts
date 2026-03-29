import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/api/axios";

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

interface ChangePasswordResponse {
  message: string;
}

export const useChangePassword = (
  options?: UseMutationOptions<
    ChangePasswordResponse,
    AxiosError<ChangePasswordResponse>,
    ChangePasswordRequest
  >,
) => {
  return useMutation({
    mutationFn: async (data: ChangePasswordRequest) => {
      const response = await api.patch<ChangePasswordResponse>(
        "user/change-password",
        data,
      );
      return response.data;
    },
    ...options,
  });
};
