import { useQuery } from "@tanstack/react-query";
import { growtopiaApi } from "../api";

export const useGrowtopiaPlayers = () => {
  return useQuery({
    queryKey: ["growtopia"],
    queryFn: growtopiaApi.getPlayers,
    refetchInterval: 700,
  });
};