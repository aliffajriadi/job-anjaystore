import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api";
import { useAuth } from "@/context/AuthContext";

interface AuthCredentials {
  username: string;
  password: string;
}

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const useLoginMutation = () => {
  const { login } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ username, password }: AuthCredentials) =>
      authApi.login(username, password),
    onSuccess: (data) => {
      login(data.token, data.user);
      queryClient.setQueryData(["user"], data.user);
    },
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: ({ username, password }: AuthCredentials) =>
      authApi.register(username, password),
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { growid?: string }) =>
      authApi.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      authApi.changePassword(payload),
  });
};

export const useUserProfile = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["user"],
    queryFn: authApi.getMe,
    enabled: !!token,
  });
};
