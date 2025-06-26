import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../services/apiProduct";

export function useProducts() {
  const { isPending, data: products } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  return {
    products,
    isPending,
  };
}
