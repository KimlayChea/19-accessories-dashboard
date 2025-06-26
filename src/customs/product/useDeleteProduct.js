import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct as deleteProductApi } from "../../services/apiProduct";

export function useDeleteProduct() {
  const queryCilent = useQueryClient();

  const { mutate: deleteProduct, isPending: isDeleting } = useMutation({
    mutationFn: deleteProductApi,
    onSuccess: () => {
      queryCilent.invalidateQueries(["products"]);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return { deleteProduct, isDeleting };
}
