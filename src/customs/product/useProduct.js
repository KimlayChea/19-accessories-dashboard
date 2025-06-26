import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../../services/apiProduct";

export function useProduct() {
  const { isPending, data: product } = useQuery({
    queryKey: ["product"],
    queryFn: getProduct,
  });

  return {
    product,
    isPending,
  };
}
