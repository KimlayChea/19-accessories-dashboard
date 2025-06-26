import { useQuery } from "@tanstack/react-query";
import { getProductSizes } from "../../services/apiProduct";

export function useProductSizes(productId) {
  const { isPending, data: productSizes } = useQuery({
    queryKey: ["productSizes", productId],
    queryFn: ({ queryKey }) => {
      const [_key, id] = queryKey;
      return getProductSizes(id); // ✅ Correct ID
    },
    enabled: !!productId, // ✅ Only fetch when productId exists
  });

  return {
    productSizes,
    isPending,
  };
}
