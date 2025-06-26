import { useQuery } from "@tanstack/react-query";
import { getProductCategories } from "../../services/apiProduct";

export function useProductCategories(productId) {
  const { isPending, data: productCategories } = useQuery({
    queryKey: ["productCategories", productId],
    queryFn: ({ queryKey }) => {
      const [_key, id] = queryKey;
      return getProductCategories(id); // ✅ Correct ID
    },
    enabled: !!productId, // ✅ Only fetch when productId exists
  });

  return {
    productCategories,
    isPending,
  };
}
