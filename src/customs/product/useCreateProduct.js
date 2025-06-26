import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct as createProductApi } from "../../services/apiProduct";

export function useCreateProduct() {
  const queryCilent = useQueryClient();

  const { mutate: createProduct, isPending: isCreating } = useMutation({
    mutationFn: createProductApi,
    onSuccess: () => {
      queryCilent.invalidateQueries(["products"]);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return { createProduct, isCreating };
}
