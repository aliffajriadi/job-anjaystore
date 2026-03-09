import { useQuery } from "@tanstack/react-query";
import { productApi } from "../api";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: productApi.getAll,
    staleTime: 30 * 1000,
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => productApi.getById(id),
    enabled: !!id,
  });
};
