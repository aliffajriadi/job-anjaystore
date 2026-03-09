import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { configApi } from "@/lib/api";

export const useConfig = () => {
  return useQuery({
    queryKey: ["config"],
    queryFn: () => configApi.getConfig(),
  });
};

export const useUpdateConfigMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      adminKey,
      payload,
    }: {
      adminKey: string;
      payload: { depo_world: string };
    }) => configApi.updateConfig(adminKey, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["config"] });
    },
  });
};

export const useAdminLoginMutation = () => {
  return useMutation({
    mutationFn: (key: string) => configApi.loginAdmin(key),
  });
};
