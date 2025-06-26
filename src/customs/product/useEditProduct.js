import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editProduct as editProductApi } from "../../services/apiProduct";

export function useEditProduct() {
  const queryCilent = useQueryClient();

  const { mutate: editProduct, isPending: isEditting } = useMutation({
    mutationFn: ({ newDatas, id }) => editProductApi(newDatas, id),
    onSuccess: () => {
      queryCilent.invalidateQueries(["products"]);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return { editProduct, isEditting };
}
